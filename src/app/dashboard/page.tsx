import { redirect } from "next/navigation";
import { verifySession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  let session;
  try {
    session = await verifySession();
  } catch {
    redirect("/login");
  }

  // Redirect based on role
  redirect(`/dashboard/${session.role.toLowerCase()}`);
}
