"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  User,
  Users,
  FolderKanban,
  X,
  ClipboardList,
} from "lucide-react";

interface SidebarProps {
  role: "STUDENT" | "MENTOR" | "ADMIN";
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ role, isOpen, onClose }) => {
  const pathname = usePathname();

  const links = {
    STUDENT: [
      {
        href: "/dashboard/student",
        label: "My Project",
        icon: <ClipboardList className="w-5 h-5" />,
      },
      {
        href: "/dashboard/student/profile",
        label: "Profile",
        icon: <User className="w-5 h-5" />,
      },
    ],
    MENTOR: [
      {
        href: "/dashboard/mentor",
        label: "Review Queue",
        icon: <LayoutDashboard className="w-5 h-5" />,
      },
    ],
    ADMIN: [
      {
        href: "/dashboard/admin",
        label: "Analytics Home",
        icon: <LayoutDashboard className="w-5 h-5" />,
      },
      {
        href: "/dashboard/admin/users",
        label: "Manage Users",
        icon: <Users className="w-5 h-5" />,
      },
      {
        href: "/dashboard/admin/projects",
        label: "Project Templates",
        icon: <FolderKanban className="w-5 h-5" />,
      },
    ],
  };

  const roleLinks = links[role] || [];

  return (
    <>
      {/* Mobile Sidebar Backdrop Drawer */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border flex flex-col transition-transform duration-300 transform lg:translate-x-0 lg:static ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header inside sidebar (only for mobile drawer close trigger) */}
        <div className="h-16 flex items-center justify-between px-6 lg:hidden border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-primary-foreground font-display font-bold text-lg">
              S
            </div>
            <span className="font-display font-bold text-lg tracking-tight">
              SkillBridge IMP
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-accent text-foreground transition-colors"
            aria-label="Close Navigation Sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Role Badge */}
        <div className="px-6 py-4 border-b border-border text-left">
          <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
            Workspace Role
          </p>
          <span className="inline-flex items-center gap-1.5 mt-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
            {role}
          </span>
        </div>

        {/* Sidebar Links */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {roleLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                {link.icon}
                {link.label}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
};
export default Sidebar;
