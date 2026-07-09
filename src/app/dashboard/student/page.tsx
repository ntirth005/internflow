import React from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, AlertCircle, FileText, CheckCircle } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/auth";
import { ChecklistGrid } from "@/components/student/ChecklistGrid";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export const dynamic = "force-dynamic";

export default async function StudentDashboardPage() {
  const session = await verifySession();

  const profile = await prisma.studentProfile.findUnique({
    where: { userId: session.userId },
    include: {
      user: {
        select: { name: true, email: true },
      },
      project: true,
      taskCompletions: true,
      mentor: {
        include: {
          user: {
            select: { name: true },
          },
        },
      },
    },
  });

  if (!profile) {
    return (
      <div className="p-8 text-center text-destructive flex flex-col items-center gap-2">
        <h2 className="text-xl font-bold">Profile Error</h2>
        <p className="text-sm">We could not locate your student details profile records.</p>
      </div>
    );
  }

  // Format completed tasks to string array
  const completedTaskIds = profile.taskCompletions
    .filter((tc) => tc.completed)
    .map((tc) => tc.taskId);

  let tasksList: unknown[] = [];
  if (profile.project?.tasks && typeof profile.project.tasks === "object") {
    if (Array.isArray(profile.project.tasks)) {
      tasksList = profile.project.tasks;
    }
  } else if (typeof profile.project?.tasks === "string") {
    try {
      tasksList = JSON.parse(profile.project.tasks) as unknown[];
    } catch {
      console.error("JSON parse tasks error");
    }
  }

  const typedTasks = tasksList.map((t) => {
    const item = t as { id?: string; label?: string; position?: number };
    return {
      id: item.id || "",
      label: item.label || "",
      position: typeof item.position === "number" ? item.position : 0,
    };
  });

  const getStatusBanner = () => {
    switch (profile.status) {
      case "UNASSIGNED":
        return {
          title: "Setup Pending",
          description: "Your platform administrator has not allocated a project workspace template yet.",
          icon: AlertCircle,
          colorClass: "bg-muted/40 text-muted-foreground border-border",
        };
      case "ASSIGNED":
        return {
          title: "Project Assigned",
          description: "A project template has been assigned. Click checkboxes below to track your progress.",
          icon: BookOpen,
          colorClass: "bg-primary/10 text-primary border-primary/20",
        };
      case "IN_PROGRESS":
        return {
          title: "Work in Progress",
          description: "Keep working! Complete all milestone items to enable work submission options.",
          icon: BookOpen,
          colorClass: "bg-primary/10 text-primary border-primary/20",
        };
      case "SUBMITTED":
        return {
          title: "Submission Under Audit",
          description: "All files have been uploaded. Your assigned review mentor is currently auditing your project.",
          icon: FileText,
          colorClass: "bg-warning/10 text-warning border-warning/20",
        };
      case "REJECTED":
        return {
          title: "Revisions Requested",
          description: "Your mentor has requested changes. Read feedback notes and submit corrected files.",
          icon: AlertCircle,
          colorClass: "bg-destructive/10 text-destructive border-destructive/20",
        };
      case "APPROVED":
        return {
          title: "Project Approved!",
          description: "Excellent job! Your project was approved. Waiting for administrator to issue credentials.",
          icon: CheckCircle,
          colorClass: "bg-success/10 text-success border-success/20",
        };
      case "CERTIFIED":
        return {
          title: "Certified Graduate!",
          description: "Congratulations! Your certificate has been issued and is ready for public verification.",
          icon: CheckCircle,
          colorClass: "bg-success text-success-foreground border-transparent font-semibold",
        };
      default:
        return null;
    }
  };

  const banner = getStatusBanner();

  return (
    <div className="space-y-8 text-left">
      {/* Welcome Board */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-display font-black text-3xl tracking-tight">Student Hub</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back, <span className="text-foreground font-semibold">{profile.user.name}</span>. Track checklist tasks and submit project files.
          </p>
        </div>

        {profile.status !== "UNASSIGNED" && (
          <Link href="/dashboard/student/submit" passHref>
            <Button
              className="flex items-center gap-2 cursor-pointer"
              disabled={profile.progress < 100 || profile.status === "SUBMITTED" || profile.status === "APPROVED" || profile.status === "CERTIFIED"}
            >
              Submit Project Deliverables
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        )}
      </div>

      {/* Banner */}
      {banner && (
        <div className={`p-4 rounded-xl border flex items-start gap-3.5 shadow-sm transition-all ${banner.colorClass}`}>
          <banner.icon className="w-5.5 h-5.5 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-sm tracking-wide uppercase">{banner.title}</h4>
            <p className="text-xs mt-0.5 leading-relaxed opacity-90">{banner.description}</p>
          </div>
        </div>
      )}

      {profile.status === "UNASSIGNED" ? (
        <Card className="border border-border">
          <CardHeader>
            <CardTitle>Workspace Allocation Pending</CardTitle>
            <CardDescription>
              We are preparing your workspace environment parameters.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Once an administrator allocates a milestone template to your account, you will see instructions, checklists, and code repository setup scripts here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main workspace */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="font-display font-bold text-2xl tracking-tight">
                {profile.project?.title}
              </h2>
              <p className="text-xs text-muted-foreground mt-1 font-mono">
                Assigned Project Template ID: {profile.projectId}
              </p>
            </div>

            {/* Checklist Tasks widget */}
            <ChecklistGrid
              tasks={typedTasks}
              completedTaskIds={completedTaskIds}
              disabled={profile.status === "SUBMITTED" || profile.status === "APPROVED" || profile.status === "CERTIFIED"}
            />
          </div>

          {/* Sidebar Info Panels */}
          <div className="space-y-6">
            {/* Guide details */}
            <Card className="border border-border">
              <CardHeader>
                <CardTitle className="text-base font-bold">Project Overview</CardTitle>
                <CardDescription>Guidelines and instructions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <p className="text-muted-foreground leading-relaxed text-xs">
                  {profile.project?.description}
                </p>
                {profile.mentor && (
                  <div className="border-t border-border pt-4">
                    <h5 className="font-semibold text-xs text-muted-foreground uppercase tracking-wider">
                      Assigned Review Mentor
                    </h5>
                    <p className="font-medium text-foreground mt-1">
                      {profile.mentor.user.name}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Submissions checklist status */}
            <Card className="border border-border">
              <CardHeader>
                <CardTitle className="text-base font-bold">Workspace Shortcuts</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-3">
                <Link
                  href="/dashboard/student/feedback"
                  className="flex items-center justify-between p-3 rounded-lg border border-border bg-card hover:bg-accent/50 transition-colors text-xs font-semibold"
                >
                  View Mentorship Feedback
                  <ArrowRight className="w-4 h-4 text-primary" />
                </Link>
                <Link
                  href="/dashboard/student/profile"
                  className="flex items-center justify-between p-3 rounded-lg border border-border bg-card hover:bg-accent/50 transition-colors text-xs font-semibold"
                >
                  Configure Account Settings
                  <ArrowRight className="w-4 h-4 text-primary" />
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
