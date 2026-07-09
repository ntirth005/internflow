import React from "react";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/auth";
import { ProjectsClient } from "./ProjectsClient";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  // Guard access to admin role only
  const session = await verifySession();
  if (session.role !== "ADMIN") {
    return (
      <div className="p-8 text-center text-destructive flex flex-col items-center gap-2">
        <h2 className="text-xl font-bold">Access Denied</h2>
        <p className="text-sm">You do not have permission to view the Project Templates Catalog.</p>
      </div>
    );
  }

  // Fetch all projects from database
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: "desc" },
  });

  // Map and type JSON tasks array
  const formattedProjects = projects.map((p) => {
    let tasksList: unknown[] = [];
    if (p.tasks && typeof p.tasks === "object") {
      if (Array.isArray(p.tasks)) {
        tasksList = p.tasks;
      }
    } else if (typeof p.tasks === "string") {
      try {
        tasksList = JSON.parse(p.tasks) as unknown[];
      } catch {
        console.error("Error parsing tasks string");
      }
    }

    return {
      id: p.id,
      title: p.title,
      description: p.description,
      tasks: tasksList.map((t) => {
        const item = t as { id?: string; label?: string; position?: number };
        return {
          id: item.id || "",
          label: item.label || "",
          position: typeof item.position === "number" ? item.position : 0,
        };
      }),
    };
  });

  return <ProjectsClient projects={formattedProjects} />;
}
