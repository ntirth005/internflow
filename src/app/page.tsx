import Link from "next/link";
import { ArrowRight, ShieldCheck, CheckCircle, Clock } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-sans">
      {/* Navigation Header */}
      <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-primary-foreground font-display font-bold text-lg">
              S
            </div>
            <span className="font-display font-bold text-lg tracking-tight">SkillBridge IMP</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link 
              href="/verify" 
              className="text-sm font-medium hover:text-primary transition-colors px-3 py-1.5"
            >
              Verify Certificate
            </Link>
            <Link 
              href="/login" 
              className="text-sm font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80 px-4 py-2 rounded-md transition-colors"
            >
              Sign In
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col justify-center max-w-7xl mx-auto px-6 py-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 flex flex-col gap-6 text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold w-fit">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Internship Management Portal
            </div>
            <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl leading-[1.1] tracking-tight">
              Centralized Internship Management. <br />
              <span className="text-primary">Simplified.</span>
            </h1>
            <p className="text-muted-foreground text-lg sm:text-xl max-w-2xl leading-relaxed">
              Track project milestones, submit deliverables, receive mentor feedback, and acquire cryptographically verifiable completion certificates.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-2">
              <Link 
                href="/login" 
                className="flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-md font-medium transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5"
              >
                Access Dashboard
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link 
                href="/verify" 
                className="flex items-center justify-center gap-2 border border-input bg-background hover:bg-accent px-6 py-3 rounded-md font-medium transition-colors"
              >
                <ShieldCheck className="w-4 h-4 text-success" />
                Verify Credentials
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 grid grid-cols-1 gap-6 bg-card border border-border p-8 rounded-2xl shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-2xl" />
            <h3 className="font-display font-bold text-xl mb-2">Core Workflow Features</h3>
            
            <div className="flex gap-4 items-start">
              <div className="p-2 rounded bg-primary/10 text-primary mt-1">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-base">Checklist Milestone Tracker</h4>
                <p className="text-sm text-muted-foreground mt-0.5">Toggle project checklist items and see your progress rise dynamically.</p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="p-2 rounded bg-primary/10 text-primary mt-1">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-base">Mentor Feedback Cycles</h4>
                <p className="text-sm text-muted-foreground mt-0.5">Submissions queue instantly into your assigned mentor's workspace for quick approval loops.</p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="p-2 rounded bg-primary/10 text-primary mt-1">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-base">Cryptographic Badges</h4>
                <p className="text-sm text-muted-foreground mt-0.5">Automatically generate unique SHA-256 HMAC-signed printable certificates.</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-background py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
          <span>&copy; 2026 SkillBridge. All rights reserved.</span>
          <div className="flex gap-6">
            <span>Built with Next.js & Tailwind CSS</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
