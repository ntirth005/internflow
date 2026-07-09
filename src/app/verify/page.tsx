"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldCheck, Search, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";

export default function VerifySearchPage() {
  const router = useRouter();
  const [hash, setHash] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const trimmed = hash.trim();
    if (!trimmed) {
      setError("Please paste a certificate hash signature code first.");
      return;
    }

    if (trimmed.length !== 64) {
      setError("A valid cryptographic signature hash code must be exactly 64 characters long.");
      return;
    }

    setIsLoading(true);
    router.push(`/verify/${trimmed}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-6 py-12 relative overflow-hidden text-left">
      {/* Decorative backdrop gradients */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-success/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-success/5 rounded-full blur-3xl -z-10" />

      <div className="w-full max-w-md space-y-6">
        {/* Branding header */}
        <div className="flex flex-col items-center gap-2 mb-4 text-center">
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
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-success" />
              Verify Credentials
            </CardTitle>
            <CardDescription>
              Validate the authenticity of any SkillBridge IMP graduate certificate.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Signature Hash Code
                </label>
                <div className="relative">
                  <Input
                    id="hash"
                    type="text"
                    placeholder="Paste 64-character SHA256 signature..."
                    value={hash}
                    onChange={(e) => setHash(e.target.value)}
                    error={error}
                    disabled={isLoading}
                    required
                    className="pr-10"
                  />
                  <Search className="w-4 h-4 text-muted-foreground absolute right-3 top-3" />
                </div>
              </div>

              <Button type="submit" className="w-full mt-2" isLoading={isLoading}>
                Verify Authenticity
              </Button>
            </form>

            <div className="text-center pt-2">
              <Link href="/login" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to Sign In
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
