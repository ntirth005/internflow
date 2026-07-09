import React from "react";
import Link from "next/link";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/auth";
import { SubmitClient } from "./SubmitClient";
import { Button } from "@/components/ui/Button";

export const dynamic = "force-dynamic";

export default async function StudentSubmitPage() {
  const session = await verifySession();

  const profile = await prisma.studentProfile.findUnique({
    where: { userId: session.userId },
    include: {
      submission: true,
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

  // Deny access if progress < 100
  if (profile.progress < 100) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 text-left">
        <Link href="/dashboard/student" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Student Hub
        </Link>

        <div className="p-6 border border-warning/20 bg-warning/10 text-warning rounded-xl flex items-start gap-4">
          <AlertTriangle className="w-6 h-6 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h3 className="font-bold text-base">Checklist Incomplete</h3>
            <p className="text-xs leading-relaxed opacity-95">
              You must complete all task items in your assigned project checklist before you can submit deliverable URLs. Currently you are at {profile.progress}%.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Deny access if already submitted, approved, or certified
  if (profile.status === "SUBMITTED" || profile.status === "APPROVED" || profile.status === "CERTIFIED") {
    return (
      <div className="max-w-2xl mx-auto space-y-6 text-left">
        <Link href="/dashboard/student" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Student Hub
        </Link>

        <div className="p-6 border border-border bg-card rounded-xl text-center space-y-4">
          <h3 className="font-bold text-lg">Submission Closed</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Your project submission state is currently: <span className="font-semibold text-foreground">{profile.status}</span>. You cannot submit deliverables at this stage.
          </p>
          <div className="pt-2">
            <Link href="/dashboard/student" passHref>
              <Button>Return to Hub</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 text-left">
      <Link href="/dashboard/student" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Student Hub
      </Link>

      <SubmitClient
        initialGithubUrl={profile.submission?.githubUrl || ""}
        initialLiveUrl={profile.submission?.liveUrl || ""}
      />
    </div>
  );
}
