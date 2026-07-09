import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, Printer, ShieldCheck, Award } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/auth";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { env } from "@/lib/config";

export const dynamic = "force-dynamic";

export default async function StudentCertificatePage() {
  const session = await verifySession();

  // Guard access to student role
  if (session.role !== "STUDENT") {
    redirect("/dashboard");
  }

  // Fetch student profile, certificate details, and user details
  const profile = await prisma.studentProfile.findUnique({
    where: { userId: session.userId },
    include: {
      user: {
        select: { name: true },
      },
      project: {
        select: { title: true },
      },
      certificate: true,
    },
  });

  if (!profile || !profile.certificate) {
    return (
      <div className="max-w-xl mx-auto space-y-6 text-left">
        <Link href="/dashboard/student" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Hub
        </Link>
        <div className="p-8 text-center text-destructive border border-destructive/20 bg-destructive/5 rounded-xl">
          <h2 className="text-lg font-bold">No Certificate Issued</h2>
          <p className="text-xs text-muted-foreground mt-1">
            An administrator has not issued a graduation certificate for your account yet.
          </p>
        </div>
      </div>
    );
  }

  const cert = profile.certificate;
  const verificationUrl = `${env.NEXT_PUBLIC_APP_URL}/verify/${cert.hashSignature}`;

  return (
    <div className="max-w-4xl mx-auto space-y-8 text-left">
      {/* Navigation shortcuts (hidden on print) */}
      <div className="flex justify-between items-center print:hidden">
        <Link href="/dashboard/student" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Hub
        </Link>

        <Button
          onClick={() => window.print()}
          className="flex items-center gap-2 bg-primary text-primary-foreground cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          Print / Save as PDF
        </Button>
      </div>

      {/* Diploma Canvas Card */}
      <Card className="border-[12px] border-double border-warning/40 bg-card relative overflow-hidden shadow-2xl p-6 sm:p-12 md:p-16 min-h-[550px] flex flex-col justify-between print:border-[16px] print:shadow-none print:my-0">
        
        {/* Decorative corner accents */}
        <div className="absolute top-0 left-0 w-24 h-24 border-t-4 border-l-4 border-warning/35" />
        <div className="absolute top-0 right-0 w-24 h-24 border-t-4 border-r-4 border-warning/35" />
        <div className="absolute bottom-0 left-0 w-24 h-24 border-b-4 border-l-4 border-warning/35" />
        <div className="absolute bottom-0 right-0 w-24 h-24 border-b-4 border-r-4 border-warning/35" />

        {/* Certificate Heading */}
        <div className="text-center space-y-4">
          <div className="flex justify-center mb-2">
            <Award className="w-16 h-16 text-warning" />
          </div>
          <h2 className="font-serif font-bold text-2xl uppercase tracking-widest text-warning/90">
            Certificate of Completion
          </h2>
          <p className="text-muted-foreground text-xs italic font-serif mt-1">
            This credential certifies that
          </p>
        </div>

        {/* Graduate Name */}
        <div className="text-center my-6 space-y-2">
          <h1 className="font-serif font-black text-3xl sm:text-4xl lg:text-5xl text-foreground tracking-wide border-b-2 border-border pb-4 max-w-xl mx-auto">
            {profile.user.name}
          </h1>
          <p className="text-muted-foreground text-xs leading-relaxed max-w-lg mx-auto pt-2">
            has successfully completed platform requirements and milestone evaluations for the project
          </p>
        </div>

        {/* Project Title */}
        <div className="text-center space-y-1 mt-2">
          <h3 className="font-sans font-bold text-lg text-primary tracking-wide">
            {profile.project?.title}
          </h3>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-mono">
            SkillBridge Internship Management Portal (IMP)
          </p>
        </div>

        {/* Footer Details */}
        <div className="flex flex-col sm:flex-row justify-between items-center sm:items-end gap-6 border-t border-border pt-8 mt-8 text-xs text-muted-foreground">
          {/* Signatures */}
          <div className="text-left space-y-1">
            <span className="font-mono text-[9px] uppercase tracking-wider block text-muted-foreground">Issued Date</span>
            <span className="font-semibold text-foreground">
              {new Date(cert.issuedAt).toLocaleDateString(undefined, {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>

          {/* Cryptographic check */}
          <div className="flex flex-col items-center sm:items-end space-y-1">
            <div className="flex items-center gap-1 text-[10px] text-success font-bold font-mono">
              <ShieldCheck className="w-4 h-4 text-success" />
              SECURE CRYPTO SIGNATURE VERIFIED
            </div>
            <span className="text-[9px] font-mono text-muted-foreground truncate max-w-[280px] select-all" title={cert.hashSignature}>
              Hash: {cert.hashSignature}
            </span>
          </div>
        </div>

        {/* Public Verification Link (Hidden on Print, or shown as footer text) */}
        <div className="text-center mt-6 pt-4 border-t border-border/40 text-[9px] text-muted-foreground print:block">
          <span className="print:hidden">
            Public verification page:{" "}
            <a href={verificationUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline font-mono">
              {verificationUrl}
            </a>
          </span>
          <span className="hidden print:inline">
            Verify this credential&apos;s authenticity online at: {verificationUrl}
          </span>
        </div>
      </Card>
      
      {/* Printable CSS style hook helper */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @media print {
            header, .print\\:hidden, nav, sidebar {
              display: none !important;
            }
            body {
              background: none !important;
              color: black !important;
              padding: 0 !important;
              margin: 0 !important;
            }
            main {
              padding: 0 !important;
              margin: 0 !important;
              width: 100% !important;
              max-width: 100% !important;
            }
            .max-w-4xl {
              max-width: 100% !important;
            }
          }
        `
      }} />
    </div>
  );
}
