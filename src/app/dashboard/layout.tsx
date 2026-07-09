import React from "react";
import { redirect } from "next/navigation";
import { verifySession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DashboardLayoutWrapper } from "./DashboardLayoutWrapper";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let session;
  try {
    session = await verifySession();
  } catch {
    redirect("/login");
  }

  // Fetch fresh user data from database
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <DashboardLayoutWrapper
      role={user.role}
      userName={user.name}
      userEmail={user.email}
    >
      {children}
    </DashboardLayoutWrapper>
  );
}
