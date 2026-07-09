import React from "react";
import Link from "next/link";
import { Users, Clock, CheckCircle, FolderKanban } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  // Query all stats in parallel
  const [
    totalStudents,
    activeStudents,
    completedProjects,
    pendingReviews,
    totalAssigned,
  ] = await Promise.all([
    prisma.studentProfile.count(),
    prisma.studentProfile.count({
      where: {
        status: {
          in: ["ASSIGNED", "IN_PROGRESS", "REJECTED"],
        },
      },
    }),
    prisma.studentProfile.count({
      where: {
        status: {
          in: ["APPROVED", "CERTIFIED"],
        },
      },
    }),
    prisma.studentProfile.count({
      where: {
        status: "SUBMITTED",
      },
    }),
    prisma.studentProfile.count({
      where: {
        status: {
          not: "UNASSIGNED",
        },
      },
    }),
  ]);

  const completionPercentage =
    totalAssigned > 0 ? Math.round((completedProjects / totalAssigned) * 100) : 0;

  return (
    <div className="space-y-8 text-left">
      <div>
        <h1 className="font-display font-black text-3xl tracking-tight">Admin Console</h1>
        <p className="text-muted-foreground mt-1">
          Monitor platform-wide cohort progress, allocate templates, and manage student credentials.
        </p>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
              Total Students
            </CardTitle>
            <Users className="w-5 h-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-display font-bold">{totalStudents}</div>
            <p className="text-xs text-muted-foreground mt-1">Registered in program</p>
          </CardContent>
        </Card>

        <Card className="border border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
              Active Cohort
            </CardTitle>
            <Clock className="w-5 h-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-display font-bold">{activeStudents}</div>
            <p className="text-xs text-muted-foreground mt-1">Currently in progress</p>
          </CardContent>
        </Card>

        <Card className="border border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
              Completed Projects
            </CardTitle>
            <CheckCircle className="w-5 h-5 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-display font-bold">{completedProjects}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Approved ({completionPercentage}% completion rate)
            </p>
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
            <div className="text-3xl font-display font-bold">{pendingReviews}</div>
            <p className="text-xs text-muted-foreground mt-1">Awaiting mentor action</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Access Card */}
      <Card className="border border-border">
        <CardHeader>
          <CardTitle>Quick Management Shortcuts</CardTitle>
          <CardDescription>
            Navigate directly to core management modules.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/dashboard/admin/users"
            className="flex items-center justify-between p-4 rounded-lg border border-border bg-card hover:bg-accent/50 transition-colors"
          >
            <div className="text-left">
              <h4 className="font-semibold">Manage Users Directory</h4>
              <p className="text-xs text-muted-foreground mt-1">
                Add, update, delete, or allocate mentors/projects to students.
              </p>
            </div>
            <Users className="w-5 h-5 text-primary" />
          </Link>
          <Link
            href="/dashboard/admin/projects"
            className="flex items-center justify-between p-4 rounded-lg border border-border bg-card hover:bg-accent/50 transition-colors"
          >
            <div className="text-left">
              <h4 className="font-semibold">Project Templates</h4>
              <p className="text-xs text-muted-foreground mt-1">
                Create and edit the milestone checklist templates.
              </p>
            </div>
            <FolderKanban className="w-5 h-5 text-primary" />
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
