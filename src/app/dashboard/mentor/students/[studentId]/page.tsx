import React from "react";
import Link from "next/link";
import { ArrowLeft, Check, ExternalLink } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/auth";
import { ReviewForm } from "./ReviewForm";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";

export const dynamic = "force-dynamic";

interface MentorStudentReviewPageProps {
  params: Promise<{
    studentId: string;
  }>;
}

export default async function MentorStudentReviewPage({ params }: MentorStudentReviewPageProps) {
  const { studentId } = await params;
  const session = await verifySession();

  // Guard access to mentors and administrators
  if (session.role !== "MENTOR" && session.role !== "ADMIN") {
    return (
      <div className="p-8 text-center text-destructive flex flex-col items-center gap-2">
        <h2 className="text-xl font-bold">Access Denied</h2>
        <p className="text-sm">You do not have permission to view the review workspace.</p>
      </div>
    );
  }

  // Fetch student profile, user name/email, assigned project, task completions, and submission urls
  const student = await prisma.studentProfile.findUnique({
    where: { id: studentId },
    include: {
      user: {
        select: { name: true, email: true },
      },
      project: true,
      submission: true,
      taskCompletions: true,
    },
  });

  if (!student) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 text-left">
        <Link href="/dashboard/mentor" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Workspace
        </Link>
        <div className="p-8 text-center text-destructive border border-destructive/20 bg-destructive/5 rounded-xl">
          <h2 className="text-lg font-bold">Student Record Not Found</h2>
          <p className="text-xs text-muted-foreground mt-1">We could not locate this student profile ID in the platform.</p>
        </div>
      </div>
    );
  }

  let tasksList: unknown[] = [];
  if (student.project?.tasks && typeof student.project.tasks === "object") {
    if (Array.isArray(student.project.tasks)) {
      tasksList = student.project.tasks;
    }
  } else if (typeof student.project?.tasks === "string") {
    try {
      tasksList = JSON.parse(student.project.tasks) as unknown[];
    } catch {
      console.error("JSON parse tasks error");
    }
  }

  const completedTaskIds = new Set(
    student.taskCompletions.filter((tc) => tc.completed).map((tc) => tc.taskId)
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "UNASSIGNED":
        return "bg-muted/50 text-muted-foreground border-border/20";
      case "ASSIGNED":
      case "IN_PROGRESS":
        return "bg-primary/10 text-primary border-primary/20";
      case "SUBMITTED":
        return "bg-warning/10 text-warning border-warning/20";
      case "APPROVED":
        return "bg-success/10 text-success border-success/20";
      case "REJECTED":
        return "bg-destructive/10 text-destructive border-destructive/20";
      case "CERTIFIED":
        return "bg-success text-success-foreground font-semibold";
      default:
        return "bg-muted/30 text-muted-foreground";
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 text-left">
      <Link href="/dashboard/mentor" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Workspace
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border pb-4">
        <div>
          <h1 className="font-display font-black text-2xl tracking-tight">{student.user.name}</h1>
          <p className="text-muted-foreground text-xs font-mono mt-0.5">{student.user.email}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(student.status)}`}>
            {student.status}
          </span>
          <span className="px-2.5 py-0.5 rounded bg-primary/10 text-primary font-mono text-xs font-bold">
            {student.progress}% complete
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Deliverables details and Checklist completions audit */}
        <div className="lg:col-span-2 space-y-6">
          {/* Submissions URLs card */}
          <Card className="border border-border bg-card">
            <CardHeader className="pb-3 text-left">
              <CardTitle className="text-base font-bold">Submitted Deliverables</CardTitle>
              <CardDescription>URLs provided by student during submission.</CardDescription>
            </CardHeader>
            <CardContent className="pt-2 text-left border-t border-border/50">
              {student.submission ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm font-sans pt-2">
                  <div className="p-4 rounded-lg border border-border bg-muted/10 space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">GitHub Codebase</span>
                    <a
                      href={student.submission.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 text-primary hover:underline font-mono text-xs break-all mt-1"
                    >
                      Repository Link
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  <div className="p-4 rounded-lg border border-border bg-muted/10 space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Hosted Live Demo</span>
                    {student.submission.liveUrl ? (
                      <a
                        href={student.submission.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 text-success hover:underline font-mono text-xs break-all mt-1"
                      >
                        Deployment Link
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    ) : (
                      <span className="text-xs text-muted-foreground font-mono italic block mt-1">None provided</span>
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-6 text-center text-muted-foreground text-sm font-medium">
                  The student has not submitted project deliverables URLs yet.
                </div>
              )}
            </CardContent>
          </Card>

          {/* Checklist Audit Table */}
          <Card className="border border-border">
            <CardHeader className="pb-3 text-left bg-muted/20">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                Task Checklist Audit
              </CardTitle>
            </CardHeader>
            <div className="divide-y divide-border">
              {tasksList.map((t, index) => {
                const task = t as { id: string; label: string; position: number };
                const isCompleted = completedTaskIds.has(task.id);

                return (
                  <div key={task.id} className="flex items-center justify-between p-4 text-left">
                    <div className="flex items-start gap-3">
                      <span className="w-5.5 h-5.5 rounded bg-muted font-mono text-xs font-bold flex items-center justify-center shrink-0">
                        {index + 1}
                      </span>
                      <span className={`text-sm ${isCompleted ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                        {task.label}
                      </span>
                    </div>

                    <div className="shrink-0 pl-4">
                      {isCompleted ? (
                        <span className="inline-flex px-2 py-0.5 rounded bg-success/15 text-success text-[10px] font-bold items-center gap-1">
                          <Check className="w-3 h-3" />
                          Complete
                        </span>
                      ) : (
                        <span className="inline-flex px-2 py-0.5 rounded bg-muted text-muted-foreground text-[10px] font-bold">
                          Pending
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Review decision panel */}
        <div className="space-y-6">
          {student.status === "SUBMITTED" ? (
            <ReviewForm studentProfileId={student.id} studentName={student.user.name} />
          ) : (
            <Card className="border border-border">
              <CardHeader>
                <CardTitle className="text-base font-bold">Review Finalized</CardTitle>
                <CardDescription>Status has transitioned out of review queue.</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground leading-relaxed text-center py-6">
                <p>
                  This student profile state is currently: <span className="font-semibold text-foreground">{student.status}</span>.
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Decisions can only be processed while student status remains in <span className="font-semibold font-mono">SUBMITTED</span>.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Guidelines info card */}
          <Card className="border border-border">
            <CardHeader>
              <CardTitle className="text-xs uppercase tracking-wider font-bold text-muted-foreground">
                Evaluator Policy Guidelines
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground leading-relaxed space-y-2 text-left">
              <p>
                1. Verify that the GitHub repository link contains valid, complete project source codes.
              </p>
              <p>
                2. Audit live hosted demo endpoints to test functional deployment state parameters.
              </p>
              <p>
                3. Approvals transition status to <span className="font-semibold font-mono">APPROVED</span>, enabling the immediate generation of cryptographically secure graduation certificates.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
