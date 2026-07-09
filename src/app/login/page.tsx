"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Alert } from "@/components/ui/Alert";
import { loginAction } from "@/app/actions/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    setErrors({});

    // Simple validation before sending
    const newErrors: { email?: string; password?: string } = {};
    if (!email) newErrors.email = "Email is required";
    if (!password) newErrors.password = "Password is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    const result = await loginAction({ email, password });

    if (result.success && result.redirectUrl) {
      router.push(result.redirectUrl);
      router.refresh();
    } else if (!result.success) {
      if (result.error.code === "BAD_REQUEST" && result.error.details) {
        setErrors(result.error.details);
      } else {
        setErrorMessage(result.error.message);
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-6 py-12 relative overflow-hidden">
      {/* Decorative backdrop gradients */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10" />

      <div className="w-full max-w-md">
        {/* Branding header */}
        <div className="flex flex-col items-center gap-2 mb-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded bg-primary flex items-center justify-center text-primary-foreground font-display font-bold text-xl">
              S
            </div>
            <span className="font-display font-bold text-2xl tracking-tight text-foreground">
              SkillBridge IMP
            </span>
          </Link>
          <p className="text-sm text-muted-foreground">Internship Management Portal</p>
        </div>

        <Card className="border border-border bg-card/50 backdrop-blur-md shadow-xl">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold tracking-tight">Sign In</CardTitle>
            <CardDescription>
              Enter your credentials to access your dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {errorMessage && (
              <Alert variant="error" title="Sign In Failed">
                {errorMessage}
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@interflow.co.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={errors.email}
                  disabled={isLoading}
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Password
                  </label>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={errors.password}
                  disabled={isLoading}
                  required
                />
              </div>

              <Button type="submit" className="w-full mt-2" isLoading={isLoading}>
                Sign In
              </Button>
            </form>

            <div className="text-center text-xs text-muted-foreground mt-4 pt-4 border-t border-border/50">
              Need a student account?{" "}
              <Link href="/register" className="text-primary hover:underline font-semibold">
                Register here
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Public Lookups redirect */}
        <div className="mt-6 flex justify-center">
          <Link
            href="/verify"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground hover:underline transition-colors"
          >
            <ShieldCheck className="w-4 h-4 text-success" />
            Verify dynamic student credentials
          </Link>
        </div>
      </div>
    </div>
  );
}
