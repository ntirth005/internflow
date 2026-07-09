"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Alert } from "@/components/ui/Alert";
import { updateStudentProfile } from "@/app/actions/student";

interface ProfileClientProps {
  initialName: string;
  email: string;
}

export const ProfileClient: React.FC<ProfileClientProps> = ({
  initialName,
  email,
}) => {
  const router = useRouter();
  const [name, setName] = useState(initialName);
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

    const res = await updateStudentProfile({ name });

    if (res.success) {
      setGlobalSuccess("Profile updated successfully!");
      router.refresh();
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
    <Card className="border border-border max-w-xl mx-auto text-left">
      <CardHeader>
        <CardTitle>Profile Settings</CardTitle>
        <CardDescription>Update your workspace details name identifiers.</CardDescription>
      </CardHeader>
      <CardContent>
        {globalSuccess && (
          <Alert variant="success" title="Success" className="mb-4">
            {globalSuccess}
          </Alert>
        )}

        {globalError && (
          <Alert variant="error" title="Profile Error" className="mb-4">
            {globalError}
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Full Name
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={getError("name")}
              disabled={isLoading}
              required
            />
          </div>

          <div className="space-y-2 opacity-70">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Email Address (Cannot change)
            </label>
            <Input value={email} disabled required />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/dashboard/student")}
              disabled={isLoading}
            >
              Back
            </Button>
            <Button type="submit" isLoading={isLoading} className="flex items-center gap-2">
              <Save className="w-4 h-4" />
              Save Settings
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
export default ProfileClient;
