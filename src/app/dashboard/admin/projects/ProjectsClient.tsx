"use client";

import React, { useState } from "react";
import { Plus, Trash2, Edit2, ListPlus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Alert } from "@/components/ui/Alert";
import {
  createProjectTemplateAction,
  updateProjectTemplateAction,
  deleteProjectTemplateAction,
} from "@/app/actions/admin";

interface TaskItem {
  id: string;
  label: string;
  position: number;
}

interface ProjectTemplate {
  id: string;
  title: string;
  description: string;
  tasks: TaskItem[];
}

interface ProjectsClientProps {
  projects: ProjectTemplate[];
}

export const ProjectsClient: React.FC<ProjectsClientProps> = ({ projects }) => {
  const [activeForm, setActiveForm] = useState<"create" | "edit" | null>(null);
  const [selectedProject, setSelectedProject] = useState<ProjectTemplate | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tasks, setTasks] = useState<TaskItem[]>([
    { id: generateUUID(), label: "Initialize repository structure", position: 0 },
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[] | string | undefined>>({});
  const [globalError, setGlobalError] = useState("");
  const [globalSuccess, setGlobalSuccess] = useState("");

  const getError = (field: string): string | undefined => {
    const err = errors[field];
    if (!err) return undefined;
    return Array.isArray(err) ? err[0] : err;
  };

  function generateUUID() {
    if (typeof window !== "undefined" && window.crypto && window.crypto.randomUUID) {
      return window.crypto.randomUUID();
    }
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setTasks([{ id: generateUUID(), label: "Initialize repository structure", position: 0 }]);
    setSelectedProject(null);
    setErrors({});
    setGlobalError("");
  };

  const handleAddTask = () => {
    setTasks([
      ...tasks,
      { id: generateUUID(), label: "", position: tasks.length },
    ]);
  };

  const handleRemoveTask = (id: string) => {
    if (tasks.length === 1) {
      setGlobalError("A template must contain at least 1 checklist task.");
      return;
    }
    setTasks(tasks.filter((t) => t.id !== id).map((t, idx) => ({ ...t, position: idx })));
  };

  const handleTaskLabelChange = (id: string, label: string) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, label } : t)));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});
    setGlobalError("");
    setGlobalSuccess("");

    // Simple validation of tasks
    const invalidTasks = tasks.some((t) => !t.label.trim());
    if (invalidTasks) {
      setGlobalError("All checklist task descriptions must be completed.");
      setIsLoading(false);
      return;
    }

    const res = await createProjectTemplateAction({ title, description, tasks });

    if (res.success) {
      setGlobalSuccess("Project template created successfully!");
      setActiveForm(null);
      resetForm();
    } else {
      if (res.error.code === "BAD_REQUEST" && res.error.details) {
        setErrors(res.error.details as Record<string, string[] | string | undefined>);
      } else {
        setGlobalError(res.error.message);
      }
    }
    setIsLoading(false);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject) return;
    setIsLoading(true);
    setErrors({});
    setGlobalError("");
    setGlobalSuccess("");

    const invalidTasks = tasks.some((t) => !t.label.trim());
    if (invalidTasks) {
      setGlobalError("All checklist task descriptions must be completed.");
      setIsLoading(false);
      return;
    }

    const res = await updateProjectTemplateAction(selectedProject.id, {
      title,
      description,
      tasks,
    });

    if (res.success) {
      setGlobalSuccess("Project template updated successfully!");
      setActiveForm(null);
      resetForm();
    } else {
      setGlobalError(res.error.message);
    }
    setIsLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this template?")) {
      return;
    }
    setGlobalError("");
    setGlobalSuccess("");

    const res = await deleteProjectTemplateAction(id);
    if (res.success) {
      setGlobalSuccess("Project template deleted successfully!");
    } else {
      setGlobalError(res.error.message);
    }
  };

  const openEdit = (proj: ProjectTemplate) => {
    setSelectedProject(proj);
    setTitle(proj.title);
    setDescription(proj.description);
    setTasks([...proj.tasks].sort((a, b) => a.position - b.position));
    setActiveForm("edit");
  };

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-display font-black text-3xl tracking-tight">Project Templates Catalog</h1>
          <p className="text-muted-foreground mt-1">
            Build and manage milestone tasks checklists for allocated student workloads.
          </p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setActiveForm("create");
          }}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Template
        </Button>
      </div>

      {globalSuccess && (
        <Alert variant="success" title="Success">
          {globalSuccess}
        </Alert>
      )}

      {globalError && (
        <Alert variant="error" title="Template Error">
          {globalError}
        </Alert>
      )}

      {/* Dynamic forms panel */}
      {activeForm && (
        <Card className="border border-border bg-card/40 backdrop-blur-sm animate-in fade-in slide-in-from-top-4 duration-200">
          <CardHeader>
            <CardTitle>
              {activeForm === "create" && "Create Project Template"}
              {activeForm === "edit" && `Modify Template: ${selectedProject?.title}`}
            </CardTitle>
            <CardDescription>
              Specify title, documentation description guidelines, and structured task checklist items.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={activeForm === "create" ? handleCreate : handleUpdate} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Project Title</label>
                  <Input value={title} onChange={(e) => setTitle(e.target.value)} error={getError("title")} disabled={isLoading} required />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Description / Guide Instructions</label>
                  <textarea
                    className="w-full min-h-24 rounded-md border border-input bg-background px-3 py-2 text-sm font-sans placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    disabled={isLoading}
                    required
                  />
                  {getError("description") && <span className="text-xs text-destructive font-medium">{getError("description")}</span>}
                </div>
              </div>

              {/* Tasks Checklist Builder */}
              <div className="space-y-3">
                <div className="flex justify-between items-center border-b border-border pb-2">
                  <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Checklist Tasks Builder</h4>
                  <Button type="button" variant="outline" onClick={handleAddTask} className="h-8 px-2 text-xs flex items-center gap-1">
                    <ListPlus className="w-3.5 h-3.5" />
                    Add Item
                  </Button>
                </div>

                <div className="space-y-3">
                  {tasks.map((task, index) => (
                    <div key={task.id} className="flex gap-2 items-center">
                      <span className="w-6 h-6 rounded bg-primary/10 text-primary font-mono text-xs flex items-center justify-center font-bold">
                        {index + 1}
                      </span>
                      <Input
                        value={task.label}
                        onChange={(e) => handleTaskLabelChange(task.id, e.target.value)}
                        placeholder="e.g. Set up Prisma and PostgreSQL connections"
                        disabled={isLoading}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveTask(task.id)}
                        className="p-2 rounded text-muted-foreground hover:bg-destructive/10 hover:text-destructive cursor-pointer transition-colors"
                        title="Remove Task"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-border">
                <Button type="button" variant="outline" onClick={() => { setActiveForm(null); resetForm(); }}>Cancel</Button>
                <Button type="submit" isLoading={isLoading}>Save Template</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Catalog List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((proj) => (
          <Card key={proj.id} className="border border-border bg-card flex flex-col justify-between">
            <CardHeader className="pb-3 text-left">
              <div className="flex justify-between items-start gap-4">
                <CardTitle className="text-lg font-bold truncate">{proj.title}</CardTitle>
                <div className="flex shrink-0 gap-1">
                  <button
                    onClick={() => openEdit(proj)}
                    className="p-1.5 rounded hover:bg-accent text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                    title="Edit Template"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(proj.id)}
                    className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive cursor-pointer transition-colors"
                    title="Delete Template"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <CardDescription className="line-clamp-3 text-xs leading-relaxed mt-2">
                {proj.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2 text-left border-t border-border/50 bg-muted/10 mt-auto">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-muted-foreground">Milestone Checklist Tasks:</span>
                <span className="px-2.5 py-0.5 rounded-full font-mono bg-primary/10 text-primary font-bold">
                  {proj.tasks.length} items
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
export default ProjectsClient;
