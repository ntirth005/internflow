import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/auth";
import { ProfileClient } from "./ProfileClient";

export const dynamic = "force-dynamic";

export default async function StudentProfilePage() {
  const session = await verifySession();

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { name: true, email: true },
  });

  if (!user) {
    return (
      <div className="p-8 text-center text-destructive flex flex-col items-center gap-2">
        <h2 className="text-xl font-bold">Session Error</h2>
        <p className="text-sm">We could not locate your user account details.</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-6 text-left">
      <Link href="/dashboard/student" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Student Hub
      </Link>

      <ProfileClient initialName={user.name} email={user.email} />
    </div>
  );
}
