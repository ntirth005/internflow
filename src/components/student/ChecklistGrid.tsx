"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CheckSquare, Square, Loader2 } from "lucide-react";
import { ProgressTrack } from "./ProgressTrack";
import { toggleTaskCompletion } from "@/app/actions/student";

interface TaskItem {
  id: string;
  label: string;
  position: number;
}

interface ChecklistGridProps {
  tasks: TaskItem[];
  completedTaskIds: string[];
  disabled?: boolean;
}

export const ChecklistGrid: React.FC<ChecklistGridProps> = ({
  tasks,
  completedTaskIds,
  disabled = false,
}) => {
  const router = useRouter();
  const [completedSet, setCompletedSet] = useState<Set<string>>(new Set(completedTaskIds));
  const [togglingTaskId, setTogglingTaskId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  // Optimistic progress
  const optimisticProgress =
    tasks.length > 0 ? Math.round((completedSet.size / tasks.length) * 100) : 0;

  const handleToggle = async (taskId: string, checked: boolean) => {
    if (disabled || togglingTaskId) return;

    setTogglingTaskId(taskId);

    // Optimistic UI state update
    const prevSet = new Set(completedSet);
    const nextSet = new Set(completedSet);
    if (checked) {
      nextSet.add(taskId);
    } else {
      nextSet.delete(taskId);
    }
    setCompletedSet(nextSet);

    startTransition(async () => {
      const res = await toggleTaskCompletion({ taskId, completed: checked });
      if (!res.success) {
        // Rollback state
        setCompletedSet(prevSet);
        alert(res.error.message || "Failed to update task state.");
      } else {
        router.refresh();
      }
      setTogglingTaskId(null);
    });
  };

  const sortedTasks = [...tasks].sort((a, b) => a.position - b.position);

  return (
    <div className="space-y-6 text-left">
      {/* Linked Progress Bar */}
      <div className="p-6 rounded-xl border border-border bg-card/50 backdrop-blur-sm shadow-sm">
        <ProgressTrack progress={optimisticProgress} />
      </div>

      {/* Task Checklist Items */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="px-6 py-4 border-b border-border bg-muted/20">
          <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
            Project Task Checklist
          </h3>
        </div>
        <div className="divide-y divide-border">
          {sortedTasks.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground text-sm">
              No task items defined for this project template.
            </div>
          ) : (
            sortedTasks.map((task) => {
              const isCompleted = completedSet.has(task.id);
              const isToggling = togglingTaskId === task.id;

              return (
                <div
                  key={task.id}
                  onClick={() => handleToggle(task.id, !isCompleted)}
                  className={`flex items-start gap-4 p-5 transition-all duration-150 ${
                    disabled
                      ? "opacity-60 cursor-not-allowed"
                      : "hover:bg-accent/40 cursor-pointer"
                  } ${isCompleted ? "bg-accent/10" : ""}`}
                >
                  <button
                    type="button"
                    disabled={disabled || isToggling}
                    className="mt-0.5 text-primary focus:outline-none shrink-0"
                    aria-label={`Mark task '${task.label}' as ${isCompleted ? "incomplete" : "complete"}`}
                  >
                    {isToggling ? (
                      <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                    ) : isCompleted ? (
                      <CheckSquare className="w-5 h-5 text-success" />
                    ) : (
                      <Square className="w-5 h-5 text-muted-foreground" />
                    )}
                  </button>
                  <span
                    className={`text-sm select-none transition-all leading-relaxed ${
                      isCompleted
                        ? "text-muted-foreground line-through decoration-muted-foreground/45"
                        : "text-foreground font-medium"
                    }`}
                  >
                    {task.label}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
export default ChecklistGrid;
