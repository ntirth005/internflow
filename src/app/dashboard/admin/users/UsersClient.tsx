"use client";

import React, { useState } from "react";
import { Plus, Trash2, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table";
import { Alert } from "@/components/ui/Alert";
import {
  createUserAction,
  updateUserAction,
  deleteUserAction,
  assignProjectAction,
  assignMentorAction,
} from "@/app/actions/admin";

interface UserItem {
  id: string;
  name: string;
  email: string;
  role: "STUDENT" | "MENTOR" | "ADMIN";
  studentProfile?: {
    id: string;
    projectId: string | null;
    mentorId: string | null;
    status: string;
    progress: number;
    project?: { title: string } | null;
    mentor?: { user: { name: string } } | null;
  } | null;
}

interface UsersClientProps {
  users: UserItem[];
  mentors: { id: string; user: { name: string } }[];
  projects: { id: string; title: string }[];
}

export const UsersClient: React.FC<UsersClientProps> = ({ users, mentors, projects }) => {
  const [activeForm, setActiveForm] = useState<"create" | "edit" | "assign" | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"STUDENT" | "MENTOR" | "ADMIN">("STUDENT");

  const [allocProjectId, setAllocProjectId] = useState("");
  const [allocMentorId, setAllocMentorId] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[] | string | undefined>>({});
  const [globalError, setGlobalError] = useState("");
  const [globalSuccess, setGlobalSuccess] = useState("");

  const getError = (field: string): string | undefined => {
    const err = errors[field];
    if (!err) return undefined;
    return Array.isArray(err) ? err[0] : err;
  };

  const resetForm = () => {
    setName("");
    setEmail("");
    setPassword("");
    setRole("STUDENT");
    setAllocProjectId("");
    setAllocMentorId("");
    setSelectedUser(null);
    setErrors({});
    setGlobalError("");
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});
    setGlobalError("");
    setGlobalSuccess("");

    const res = await createUserAction({ name, email, password, role });

    if (res.success) {
      setGlobalSuccess("User created successfully!");
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
    if (!selectedUser) return;
    setIsLoading(true);
    setErrors({});
    setGlobalError("");
    setGlobalSuccess("");

    const res = await updateUserAction(selectedUser.id, { name, email, role });

    if (res.success) {
      setGlobalSuccess("User updated successfully!");
      setActiveForm(null);
      resetForm();
    } else {
      setGlobalError(res.error.message);
    }
    setIsLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user? This will remove all associated profiles and data.")) {
      return;
    }
    setGlobalError("");
    setGlobalSuccess("");

    const res = await deleteUserAction(id);
    if (res.success) {
      setGlobalSuccess("User deleted successfully!");
    } else {
      setGlobalError(res.error.message);
    }
  };

  const handleAssignProject = async (studentProfileId: string) => {
    if (!allocProjectId) return;
    setIsLoading(true);
    setGlobalError("");
    setGlobalSuccess("");

    const res = await assignProjectAction({
      studentId: studentProfileId,
      projectId: allocProjectId,
    });

    if (res.success) {
      setGlobalSuccess("Project assigned successfully!");
      setActiveForm(null);
      resetForm();
    } else {
      setGlobalError(res.error.message);
    }
    setIsLoading(false);
  };

  const handleAssignMentor = async (studentProfileId: string) => {
    if (!allocMentorId) return;
    setIsLoading(true);
    setGlobalError("");
    setGlobalSuccess("");

    const res = await assignMentorAction({
      studentId: studentProfileId,
      mentorId: allocMentorId,
    });

    if (res.success) {
      setGlobalSuccess("Mentor assigned successfully!");
      setActiveForm(null);
      resetForm();
    } else {
      setGlobalError(res.error.message);
    }
    setIsLoading(false);
  };

  const openEdit = (user: UserItem) => {
    setSelectedUser(user);
    setName(user.name);
    setEmail(user.email);
    setRole(user.role);
    setActiveForm("edit");
  };

  const openAssign = (user: UserItem) => {
    setSelectedUser(user);
    setAllocProjectId(user.studentProfile?.projectId || "");
    setAllocMentorId(user.studentProfile?.mentorId || "");
    setActiveForm("assign");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "UNASSIGNED":
        return "bg-muted/50 text-muted-foreground border border-muted-foreground/20";
      case "ASSIGNED":
      case "IN_PROGRESS":
        return "bg-primary/10 text-primary border border-primary/20";
      case "SUBMITTED":
        return "bg-warning/10 text-warning border border-warning/20";
      case "APPROVED":
        return "bg-success/10 text-success border border-success/20";
      case "REJECTED":
        return "bg-destructive/10 text-destructive border border-destructive/20";
      case "CERTIFIED":
        return "bg-success text-success-foreground font-semibold";
      default:
        return "bg-muted/30 text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-display font-black text-3xl tracking-tight">User Management Directory</h1>
          <p className="text-muted-foreground mt-1">
            Register students and mentors, assign project workloads, and link mentor review accounts.
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
          Add New User
        </Button>
      </div>

      {globalSuccess && (
        <Alert variant="success" title="Success">
          {globalSuccess}
        </Alert>
      )}

      {globalError && (
        <Alert variant="error" title="Action Error">
          {globalError}
        </Alert>
      )}

      {/* Dynamic forms panel */}
      {activeForm && (
        <Card className="border border-border bg-card/40 backdrop-blur-sm animate-in fade-in slide-in-from-top-4 duration-200">
          <CardHeader>
            <CardTitle>
              {activeForm === "create" && "Create New User"}
              {activeForm === "edit" && `Modify User: ${selectedUser?.name}`}
              {activeForm === "assign" && `Configure Project & Mentor: ${selectedUser?.name}`}
            </CardTitle>
            <CardDescription>
              {activeForm === "create" && "Register a new student, mentor, or administrator account."}
              {activeForm === "edit" && "Update user details. Changing role will swap associated profile records."}
              {activeForm === "assign" && "Allocate a milestone project template and link a mentor review profile."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {activeForm === "create" && (
              <form onSubmit={handleCreate} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Full Name</label>
                    <Input value={name} onChange={(e) => setName(e.target.value)} error={getError("name")} disabled={isLoading} required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email Address</label>
                    <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} error={getError("email")} disabled={isLoading} required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Password</label>
                    <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} error={getError("password")} disabled={isLoading} required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">User Workspace Role</label>
                    <Select value={role} onChange={(e) => setRole(e.target.value as "STUDENT" | "MENTOR" | "ADMIN")} error={getError("role")} disabled={isLoading}>
                      <option value="STUDENT">Student</option>
                      <option value="MENTOR">Mentor</option>
                      <option value="ADMIN">Administrator</option>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Button type="button" variant="outline" onClick={() => { setActiveForm(null); resetForm(); }}>Cancel</Button>
                  <Button type="submit" isLoading={isLoading}>Register User</Button>
                </div>
              </form>
            )}

            {activeForm === "edit" && (
              <form onSubmit={handleUpdate} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Full Name</label>
                    <Input value={name} onChange={(e) => setName(e.target.value)} disabled={isLoading} required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email Address</label>
                    <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={isLoading} required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">User Workspace Role</label>
                    <Select value={role} onChange={(e) => setRole(e.target.value as "STUDENT" | "MENTOR" | "ADMIN")} disabled={isLoading}>
                      <option value="STUDENT">Student</option>
                      <option value="MENTOR">Mentor</option>
                      <option value="ADMIN">Administrator</option>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Button type="button" variant="outline" onClick={() => { setActiveForm(null); resetForm(); }}>Cancel</Button>
                  <Button type="submit" isLoading={isLoading}>Save Modifications</Button>
                </div>
              </form>
            )}

            {activeForm === "assign" && selectedUser?.studentProfile && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Assign Project */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Assign Project Template</h4>
                    <div className="flex gap-2">
                      <Select value={allocProjectId} onChange={(e) => setAllocProjectId(e.target.value)} disabled={isLoading}>
                        <option value="">Unassigned</option>
                        {projects.map((p) => (
                          <option key={p.id} value={p.id}>{p.title}</option>
                        ))}
                      </Select>
                      <Button
                        onClick={() => handleAssignProject(selectedUser.studentProfile!.id)}
                        disabled={isLoading || allocProjectId === (selectedUser.studentProfile?.projectId || "")}
                        isLoading={isLoading}
                      >
                        Apply
                      </Button>
                    </div>
                  </div>

                  {/* Assign Mentor */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Assign Review Mentor</h4>
                    <div className="flex gap-2">
                      <Select value={allocMentorId} onChange={(e) => setAllocMentorId(e.target.value)} disabled={isLoading}>
                        <option value="">Unassigned</option>
                        {mentors.map((m) => (
                          <option key={m.id} value={m.id}>{m.user.name}</option>
                        ))}
                      </Select>
                      <Button
                        onClick={() => handleAssignMentor(selectedUser.studentProfile!.id)}
                        disabled={isLoading || allocMentorId === (selectedUser.studentProfile?.mentorId || "")}
                        isLoading={isLoading}
                      >
                        Apply
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end pt-4 border-t border-border">
                  <Button type="button" variant="outline" onClick={() => { setActiveForm(null); resetForm(); }}>Done</Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Directory Table */}
      <Card className="border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User Details</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Assigned Workload</TableHead>
              <TableHead>Assigned Mentor</TableHead>
              <TableHead>Work State</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="font-medium text-foreground">{user.name}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{user.email}</div>
                </TableCell>
                <TableCell>
                  <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium tracking-wide uppercase ${
                    user.role === "ADMIN" ? "bg-warning/10 text-warning" :
                    user.role === "MENTOR" ? "bg-success/10 text-success" :
                    "bg-primary/10 text-primary"
                  }`}>
                    {user.role}
                  </span>
                </TableCell>
                <TableCell>
                  {user.role === "STUDENT" ? (
                    user.studentProfile?.project ? (
                      <div>
                        <div className="font-medium text-xs text-foreground">{user.studentProfile.project.title}</div>
                        <div className="w-24 bg-muted h-1.5 rounded-full overflow-hidden mt-1">
                          <div
                            className="bg-primary h-full transition-all duration-300"
                            style={{ width: `${user.studentProfile.progress}%` }}
                          />
                        </div>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground font-mono">None</span>
                    )
                  ) : (
                    <span className="text-xs text-muted-foreground font-mono">-</span>
                  )}
                </TableCell>
                <TableCell>
                  {user.role === "STUDENT" ? (
                    user.studentProfile?.mentor ? (
                      <span className="text-xs font-medium text-foreground">
                        {user.studentProfile.mentor.user.name}
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground font-mono">None</span>
                    )
                  ) : (
                    <span className="text-xs text-muted-foreground font-mono">-</span>
                  )}
                </TableCell>
                <TableCell>
                  {user.role === "STUDENT" && user.studentProfile ? (
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(user.studentProfile.status)}`}>
                      {user.studentProfile.status}
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground font-mono">-</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1.5">
                    {user.role === "STUDENT" && (
                      <Button
                        onClick={() => openAssign(user)}
                        variant="outline"
                        className="h-8 px-2.5 text-xs flex items-center gap-1 cursor-pointer"
                        title="Configure Project/Mentor"
                      >
                        Allocate
                      </Button>
                    )}
                    <button
                      onClick={() => openEdit(user)}
                      className="p-1.5 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                      title="Edit User Details"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
                      title="Delete User"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};
export default UsersClient;
