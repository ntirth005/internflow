import React from "react";
import Link from "next/link";
import { ShieldCheck, ShieldAlert, Calendar, ExternalLink } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { verifyCertificateHash } from "@/lib/certificate";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";

export const dynamic = "force-dynamic";

interface VerificationPageProps {
  params: Promise<{
    hashSignature: string;
  }>;
}

export default async function VerificationPage({ params }: VerificationPageProps) {
  const { hashSignature } = await params;

  // Query database for certificate record
  const cert = await prisma.certificate.findUnique({
    where: { hashSignature },
    include: {
      student: {
        include: {
          user: {
            select: { name: true, email: true },
          },
          submission: true,
        },
      },
      project: {
        select: { title: true, description: true },
      },
    },
  });

  // Verify hash authenticity using timing-safe comparison helper
  const isVerified =
    cert &&
    verifyCertificateHash(cert.studentId, cert.projectId, cert.issuedAt, hashSignature);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-foreground font-sans">
      <div className="max-w-2xl w-full space-y-8 text-center">
        {/* Header branding logo */}
        <Link href="/" className="inline-flex items-center gap-2">
          <div className="w-10 h-10 rounded bg-primary flex items-center justify-center text-primary-foreground font-display font-black text-xl">
            S
          </div>
          <span className="font-display font-black text-xl tracking-tight text-foreground">
            SkillBridge IMP
          </span>
        </Link>

        {isVerified && cert ? (
          <Card className="border-2 border-success/30 bg-card/65 backdrop-blur shadow-2xl relative overflow-hidden text-left max-w-xl mx-auto">
            {/* Status bar accent */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-success" />

            <CardHeader className="text-center pb-4 pt-8">
              <div className="w-16 h-16 rounded-full bg-success/10 text-success flex items-center justify-center mx-auto mb-3 shadow-inner">
                <ShieldCheck className="w-9 h-9" />
              </div>
              <CardTitle className="text-2xl font-display font-bold text-success">
                Authentic Credential Verified
              </CardTitle>
              <CardDescription className="text-xs mt-1">
                This certificate has been cryptographically validated against the platform registry.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6 pt-4 border-t border-border/50 bg-muted/10">
              <div className="space-y-4">
                <div className="border-b border-border/40 pb-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                    Certified Graduate
                  </span>
                  <span className="text-lg font-bold text-foreground mt-1 block">
                    {cert.student.user.name}
                  </span>
                </div>

                <div className="border-b border-border/40 pb-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                    Project Workload Milestone
                  </span>
                  <span className="text-base font-bold text-primary mt-1 block">
                    {cert.project.title}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 border-b border-border/40 pb-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                      Issued Date
                    </span>
                    <span className="text-sm font-semibold text-foreground mt-1 flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      {new Date(cert.issuedAt).toLocaleDateString(undefined, {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                      Verification Status
                    </span>
                    <span className="inline-flex mt-1 items-center gap-1 px-2 py-0.5 rounded bg-success/15 text-success text-xs font-bold font-mono">
                      VALID
                    </span>
                  </div>
                </div>

                {cert.student.submission && (
                  <div className="border-b border-border/40 pb-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                      Graduate Deliverables Link
                    </span>
                    <a
                      href={cert.student.submission.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-primary hover:underline font-mono text-xs mt-1"
                    >
                      GitHub Repository Source
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}

                <div className="pt-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                    Cryptographic Signature Hash
                  </span>
                  <code className="block mt-1 p-3 bg-muted rounded font-mono text-[9px] text-foreground border border-border break-all select-all">
                    {cert.hashSignature}
                  </code>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-2 border-destructive/30 bg-card/65 backdrop-blur shadow-2xl relative overflow-hidden text-left max-w-xl mx-auto">
            {/* Status bar accent */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-destructive" />

            <CardHeader className="text-center pb-6 pt-8">
              <div className="w-16 h-16 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mx-auto mb-3">
                <ShieldAlert className="w-9 h-9" />
              </div>
              <CardTitle className="text-xl font-display font-bold text-destructive">
                Authenticity Verification Failed
              </CardTitle>
              <CardDescription className="text-xs mt-1">
                The verification signature hash code does not match any certificate in our registry.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 pt-2 text-center text-sm text-muted-foreground border-t border-border/50 bg-muted/10">
              <p className="leading-relaxed">
                This link may be broken or the credential has been falsified or revoked. If you believe this is an error, please verify the exact signature code.
              </p>
              <div className="pt-2 font-mono text-[10px] text-muted-foreground break-all select-all bg-muted p-3 rounded border border-border">
                Tested Signature: {hashSignature}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
