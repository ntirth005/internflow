import React from "react";

interface ProgressTrackProps {
  progress: number;
}

export const ProgressTrack: React.FC<ProgressTrackProps> = ({ progress }) => {
  const roundedProgress = Math.min(Math.max(Math.round(progress), 0), 100);

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-sm font-semibold">
        <span className="text-muted-foreground uppercase tracking-wider text-xs">Milestones Progress</span>
        <span className="text-primary font-mono text-base font-bold">{roundedProgress}%</span>
      </div>
      <div className="w-full bg-muted h-3 rounded-full overflow-hidden border border-border/50">
        <div
          className="bg-primary h-full transition-all duration-500 ease-out shadow-[0_0_8px_rgba(var(--primary-rgb),0.5)]"
          style={{ width: `${roundedProgress}%` }}
        />
      </div>
    </div>
  );
};
export default ProgressTrack;
