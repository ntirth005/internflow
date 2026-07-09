import React from "react";
import Link from "next/link";
import { Users, Clock, CheckCircle, AlertTriangle, ArrowRight, MessageSquare } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/auth";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table";

export const dynamic = "force-dynamic";

export default async function MentorDashboardPage() {
  const session = await verifySession();

  // Guard mentor/admin role
  if (session.role !== "MENTOR" && session.role !== "ADMIN") {
    return (
      <div className="p-8 text-center text-destructive flex flex-col items-center gap-2">
        <h2 className="text-xl font-bold">Access Denied</h2>
        <p className="text-sm">You do not have permission to view the Mentor Review Workspace.</p>
      </div>
    );
  }

  // Get mentor profile record
  const mentorProfile = await prisma.mentorProfile.findUnique({
    where: { userId: session.userId },
  });

  if (!mentorProfile && session.role !== "ADMIN") {
    return (
      <div className="p-8 text-center text-destructive flex flex-col items-center gap-2">
        <h2 className="text-xl font-bold">Profile Error</h2>
        <p className="text-sm">Could not find mentor workspace parameters associated with your account.</p>
      </div>
    );
  }

  // Find students assigned to this mentor (or all students if administrator logs in)
  const students = await prisma.studentProfile.findMany({
    where: session.role === "ADMIN" ? {} : { mentorId: mentorProfile?.id },
    include: {
      user: {
        select: { name: true, email: true },
      },
      project: {
        select: { title: true },
      },
      submission: true,
    },
    orderBy: { updatedAt: "desc" },
  });

  // Calculate status counts
  const totalAssigned = students.length;
  const pendingCount = students.filter((s) => s.status === "SUBMITTED").length;
  const approvedCount = students.filter((s) => s.status === "APPROVED" || s.status === "CERTIFIED").length;
  const rejectedCount = students.filter((s) => s.status === "REJECTED").length;

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
    <div className="space-y-8 text-left">
      <div>
        <h1 className="font-display font-black text-3xl tracking-tight">Mentor Review Workspace</h1>
        <p className="text-muted-foreground mt-1">
          {session.role === "ADMIN"
            ? "Administrative view: Overseeing all students cohort review submissions."
            : `Audit deliverables, comment on check-lists, and issue project approvals for your assigned cohort.`}
        </p>
      </div>

      {/* Analytics widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
              Assigned Students
            </CardTitle>
            <Users className="w-5 h-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-display font-bold">{totalAssigned}</div>
            <p className="text-xs text-muted-foreground mt-1">Active student profiles</p>
          </CardContent>
        </Card>

        <Card className="border border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
              Pending Reviews
            </CardTitle>
            <Clock className="w-5 h-5 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-display font-bold">{pendingCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Awaiting your approval</p>
          </CardContent>
        </Card>

        <Card className="border border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
              Approved Projects
            </CardTitle>
            <CheckCircle className="w-5 h-5 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-display font-bold">{approvedCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Milestones finalized</p>
          </CardContent>
        </Card>

        <Card className="border border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
              Revisions Requested
            </CardTitle>
            <AlertTriangle className="w-5 h-5 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-display font-bold">{rejectedCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Awaiting code correction</p>
          </CardContent>
        </Card>
      </div>

      {/* Main submissions queue table */}
      <Card className="border border-border">
        <CardHeader className="pb-3 text-left">
          <CardTitle>Cohort Submissions Queue</CardTitle>
          <CardDescription>
            Audit student checklist progresses, open code links, and complete feedback evaluations.
          </CardDescription>
        </CardHeader>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Assigned Project</TableHead>
              <TableHead>Progress Track</TableHead>
              <TableHead>Work Status</TableHead>
              <TableHead>Submitted URLs</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                  <div className="flex flex-col items-center gap-1.5 justify-center">
                    <MessageSquare className="w-8 h-8 text-muted-foreground/35" />
                    <p className="text-sm">No assigned students found.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>
                    <div className="font-semibold text-foreground text-sm">{student.user.name}</div>
                    <div className="text-[10px] font-mono text-muted-foreground mt-0.5">{student.user.email}</div>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs font-medium text-foreground">
                      {student.project?.title || <span className="text-muted-foreground font-mono italic">None</span>}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-muted h-1.5 rounded-full overflow-hidden shrink-0">
                        <div
                          className="bg-primary h-full transition-all duration-300"
                          style={{ width: `${student.progress}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold font-mono text-foreground">{Math.round(student.progress)}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusColor(student.status)}`}>
                      {student.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    {student.submission ? (
                      <div className="flex flex-col gap-0.5 text-[10px] font-mono">
                        <a
                          href={student.submission.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-primary hover:underline truncate max-w-32"
                        >
                          GitHub Link
                        </a>
                        {student.submission.liveUrl && (
                          <a
                            href={student.submission.liveUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-success hover:underline truncate max-w-32"
                          >
                            Live Demo
                          </a>
                        )}
                      </div>
                    ) : (
                      <span className="text-[10px] text-muted-foreground font-mono italic">Not submitted</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={`/dashboard/mentor/students/${student.id}`} passHref>
                      <button className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded border border-border bg-card hover:bg-accent/40 text-foreground cursor-pointer transition-colors">
                        Review Workspace
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
