"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, LogOut, Sun, Moon } from "lucide-react";
import { logoutAction } from "@/app/actions/auth";

interface HeaderProps {
  onToggleSidebar: () => void;
  userName?: string;
  userEmail?: string;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar, userName = "User", userEmail = "" }) => {
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Initialize theme from document element class
  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setTimeout(() => {
      setDarkMode(isDark);
    }, 0);
  }, []);

  const toggleTheme = () => {
    if (darkMode) {
      document.documentElement.classList.remove("dark");
      setDarkMode(false);
    } else {
      document.documentElement.classList.add("dark");
      setDarkMode(true);
    }
  };

  const handleLogout = async () => {
    const res = await logoutAction();
    if (res.success) {
      router.push("/login");
      router.refresh();
    }
  };

  const userInitials = userName
    ? userName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <header className="sticky top-0 z-40 w-full h-16 border-b border-border bg-background/95 backdrop-blur flex items-center justify-between px-6">
      {/* Left side */}
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 -ml-2 rounded-md hover:bg-accent text-foreground transition-colors"
          aria-label="Toggle Navigation Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-primary-foreground font-display font-bold text-lg">
            S
          </div>
          <span className="font-display font-bold text-lg tracking-tight hidden sm:inline-block">
            SkillBridge IMP
          </span>
        </Link>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* Theme toggler */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-accent text-muted-foreground hover:text-foreground transition-all duration-200"
          aria-label="Toggle Color Theme"
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        {/* User avatar dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-10 h-10 rounded-full bg-primary/10 hover:bg-primary/20 text-primary flex items-center justify-center font-display font-semibold text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            aria-label="User Profile Dropdown"
          >
            {userInitials}
          </button>

          {dropdownOpen && (
            <>
              {/* Overlay blocker to close */}
              <div
                className="fixed inset-0 z-40"
                onClick={() => setDropdownOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-56 rounded-md border border-border bg-card text-card-foreground shadow-lg z-50 py-1 origin-top-right transition-all">
                <div className="px-4 py-2 border-b border-border text-left">
                  <p className="text-sm font-semibold truncate text-foreground">{userName}</p>
                  {userEmail && (
                    <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
                  )}
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-sm text-destructive hover:bg-destructive/10 flex items-center gap-2 text-left cursor-pointer transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
export default Header;
