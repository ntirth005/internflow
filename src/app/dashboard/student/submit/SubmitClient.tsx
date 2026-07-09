"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Alert } from "@/components/ui/Alert";
import { submitDeliverables } from "@/app/actions/student";

interface SubmitClientProps {
  initialGithubUrl: string;
  initialLiveUrl: string;
}

export const SubmitClient: React.FC<SubmitClientProps> = ({
  initialGithubUrl,
  initialLiveUrl,
}) => {
  const router = useRouter();
  const [githubUrl, setGithubUrl] = useState(initialGithubUrl);
  const [liveUrl, setLiveUrl] = useState(initialLiveUrl);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[] | string | undefined>>({});
  const [globalError, setGlobalError] = useState("");
  const [globalSuccess, setGlobalSuccess] = useState("");

  const getError = (field: string): string | undefined => {
    const err = errors[field];
    if (!err) return undefined;
    return Array.isArray(err) ? err[0] : err;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});
    setGlobalError("");
    setGlobalSuccess("");

    const res = await submitDeliverables({ githubUrl, liveUrl });

    if (res.success) {
      setGlobalSuccess("Deliverables submitted successfully! Redirecting...");
      setTimeout(() => {
        router.push("/dashboard/student");
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
    <Card className="border border-border max-w-2xl mx-auto text-left">
      <CardHeader>
        <CardTitle>Submit Project Deliverables</CardTitle>
        <CardDescription>
          Provide links to your github repository codebase and live hosted demo deployment to finalize the milestone.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {globalSuccess && (
          <Alert variant="success" title="Submitted" className="mb-4">
            {globalSuccess}
          </Alert>
        )}

        {globalError && (
          <Alert variant="error" title="Submission Failed" className="mb-4">
            {globalError}
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              GitHub Repository URL
            </label>
            <Input
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              placeholder="https://github.com/your-username/repo-name"
              error={getError("githubUrl")}
              disabled={isLoading}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Live Deployment URL
            </label>
            <Input
              value={liveUrl}
              onChange={(e) => setLiveUrl(e.target.value)}
              placeholder="https://your-deployment-subdomain.vercel.app"
              error={getError("liveUrl")}
              disabled={isLoading}
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/dashboard/student")}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={isLoading} className="flex items-center gap-2">
              <Send className="w-4 h-4" />
              Submit Review Request
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
export default SubmitClient;
