import React from "react";
import Link from "next/link";
import { ArrowLeft, MessageSquare, Award, AlertTriangle, Calendar } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/auth";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";

export const dynamic = "force-dynamic";

export default async function StudentFeedbackPage() {
  const session = await verifySession();

  const profile = await prisma.studentProfile.findUnique({
    where: { userId: session.userId },
  });

  if (!profile) {
    return (
      <div className="p-8 text-center text-destructive flex flex-col items-center gap-2">
        <h2 className="text-xl font-bold">Profile Error</h2>
        <p className="text-sm">We could not locate your student details profile records.</p>
      </div>
    );
  }

  // Fetch feedback records ordered by creation time
  const feedback = await prisma.feedback.findMany({
    where: { studentId: profile.id },
    orderBy: { createdAt: "desc" },
    include: {
      mentor: {
        select: { name: true, email: true },
      },
    },
  });

  return (
    <div className="max-w-3xl mx-auto space-y-6 text-left">
      <Link href="/dashboard/student" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Student Hub
      </Link>

      <div>
        <h1 className="font-display font-black text-3xl tracking-tight">Mentorship Feedback</h1>
        <p className="text-muted-foreground mt-1">
          Review comments, correction logs, and approval signoffs from review mentors.
        </p>
      </div>

      <div className="space-y-6">
        {feedback.length === 0 ? (
          <Card className="border border-border">
            <CardContent className="py-12 text-center text-muted-foreground">
              <MessageSquare className="w-10 h-10 mx-auto text-muted-foreground/40 mb-3" />
              <p className="text-sm font-medium">No reviews logged yet.</p>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                Feedback evaluation logs will populate here once you submit deliverables and they are reviewed.
              </p>
            </CardContent>
          </Card>
        ) : (
          feedback.map((item) => {
            const isApproved = item.decision === "APPROVE";
            const StatusIcon = isApproved ? Award : AlertTriangle;

            return (
              <Card key={item.id} className={`border ${isApproved ? "border-success/30 bg-success/5" : "border-destructive/30 bg-destructive/5"}`}>
                <CardHeader className="pb-3 text-left">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isApproved ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive"}`}>
                        <StatusIcon className="w-4.5 h-4.5" />
                      </div>
                      <div>
                        <CardTitle className="text-sm font-bold">
                          {isApproved ? "Submission Approved" : "Revision Required"}
                        </CardTitle>
                        <CardDescription className="text-xs mt-0.5">
                          Reviewed by {item.mentor.name}
                        </CardDescription>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground shrink-0">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(item.createdAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-2 text-left border-t border-border/30">
                  <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap font-sans">
                    {item.comments}
                  </p>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
