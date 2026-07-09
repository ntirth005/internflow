"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Alert } from "@/components/ui/Alert";
import { submitReview } from "@/app/actions/mentor";

interface ReviewFormProps {
  studentProfileId: string;
  studentName: string;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({
  studentProfileId,
  studentName,
}) => {
  const router = useRouter();
  const [comments, setComments] = useState("");
  const [decision, setDecision] = useState<"APPROVE" | "REJECT" | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[] | string | undefined>>({});
  const [globalError, setGlobalError] = useState("");
  const [globalSuccess, setGlobalSuccess] = useState("");

  const getError = (field: string): string | undefined => {
    const err = errors[field];
    if (!err) return undefined;
    return Array.isArray(err) ? err[0] : err;
  };

  const handleDecision = async (chosenDecision: "APPROVE" | "REJECT") => {
    if (!comments.trim()) {
      setGlobalError("Please provide audit evaluation feedback notes first.");
      return;
    }

    setIsLoading(true);
    setErrors({});
    setGlobalError("");
    setGlobalSuccess("");
    setDecision(chosenDecision);

    const res = await submitReview({
      studentId: studentProfileId,
      comments,
      decision: chosenDecision,
    });

    if (res.success) {
      setGlobalSuccess(`Review processed successfully as: ${chosenDecision}`);
      setTimeout(() => {
        router.push("/dashboard/mentor");
        router.refresh();
      }, 1500);
    } else {
      if (res.error.code === "BAD_REQUEST" && res.error.details) {
        setErrors(res.error.details as Record<string, string[] | string | undefined>);
      } else {
        setGlobalError(res.error.message);
      }
    }
    setIsLoading(false);
  };

  return (
    <Card className="border border-border text-left">
      <CardHeader>
        <CardTitle>Evaluation & Decisions</CardTitle>
        <CardDescription>
          Record your evaluation notes for {studentName} and log the milestone audit decision.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {globalSuccess && (
          <Alert variant="success" title="Review Finalized">
            {globalSuccess}
          </Alert>
        )}

        {globalError && (
          <Alert variant="error" title="Review Error">
            {globalError}
          </Alert>
        )}

        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Evaluation Feedback / Corrective Actions
          </label>
          <textarea
            className="w-full min-h-32 rounded-md border border-input bg-background px-3 py-2 text-sm font-sans placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all"
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="Write detailed reviews here. If requesting corrections, itemize the required checklist additions."
            disabled={isLoading}
            required
          />
          {getError("comments") && (
            <span className="text-xs text-destructive font-medium">{getError("comments")}</span>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button
            onClick={() => handleDecision("REJECT")}
            variant="outline"
            className="flex-1 border-destructive/30 hover:bg-destructive/10 text-destructive flex items-center justify-center gap-2 cursor-pointer"
            disabled={isLoading}
            isLoading={isLoading && decision === "REJECT"}
          >
            <AlertTriangle className="w-4 h-4" />
            Request Code Revisions
          </Button>

          <Button
            onClick={() => handleDecision("APPROVE")}
            className="flex-1 bg-success hover:bg-success-hover text-success-foreground flex items-center justify-center gap-2 cursor-pointer"
            disabled={isLoading}
            isLoading={isLoading && decision === "APPROVE"}
          >
            <CheckCircle2 className="w-4 h-4" />
            Approve Deliverables
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
export default ReviewForm;
