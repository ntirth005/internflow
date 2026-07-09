"use client";

import React, { useState } from "react";
import { Header } from "@/components/shared/Header";
import { Sidebar } from "@/components/shared/Sidebar";

interface DashboardLayoutWrapperProps {
  role: "STUDENT" | "MENTOR" | "ADMIN";
  userName: string;
  userEmail: string;
  children: React.ReactNode;
}

export const DashboardLayoutWrapper: React.FC<DashboardLayoutWrapperProps> = ({
  role,
  userName,
  userEmail,
  children,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Sticky Header */}
      <Header
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        userName={userName}
        userEmail={userEmail}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Navigation Sidebar */}
        <Sidebar
          role={role}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Scrollable Main Content Container */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-muted/30">
          <div className="max-w-7xl mx-auto space-y-8">{children}</div>
        </main>
      </div>
    </div>
  );
};
export default DashboardLayoutWrapper;
