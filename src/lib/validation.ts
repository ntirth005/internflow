import { z } from "zod";

// Authentication Schemas
export const RegisterInputSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  email: z.string().email("Invalid email address format"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

export const LoginInputSchema = z.object({
  email: z.string().email("Invalid email address format"),
  password: z.string().min(1, "Password is required"),
});

// Student Profile Updates
export const ProfileUpdateInputSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
});

// Student Task Progress Checklists
export const TaskToggleInputSchema = z.object({
  taskId: z.string().uuid("Invalid task ID format"),
  completed: z.boolean(),
});

// Student Deliverable Submissions
export const SubmissionInputSchema = z.object({
  githubUrl: z
    .string()
    .url("Invalid URL format")
    .regex(/github\.com\//, "Must be a valid GitHub repository URL"),
  liveUrl: z.string().url("Invalid URL format"),
});

// Mentor Review Form
export const ReviewInputSchema = z.object({
  studentId: z.string().uuid("Invalid student ID format"),
  comments: z.string().min(10, "Feedback comments must be at least 10 characters long"),
  decision: z.enum(["APPROVE", "REJECT"]),
});

// Admin Control Panel Schemas
export const UserCreateInputSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["STUDENT", "MENTOR", "ADMIN"]),
});

export const ProjectTemplateInputSchema = z.object({
  title: z.string().min(5, "Project title must be at least 5 characters"),
  description: z.string().min(20, "Project description must be at least 20 characters"),
  tasks: z.array(
    z.object({
      id: z.string().uuid(),
      label: z.string().min(3, "Task description must be at least 3 characters"),
      position: z.number().int().nonnegative(),
    })
  ).min(1, "Project template must contain at least 1 task checklist item"),
});

export const AssignProjectSchema = z.object({
  studentId: z.string().uuid(),
  projectId: z.string().uuid(),
});

export const AssignMentorSchema = z.object({
  studentId: z.string().uuid(),
  mentorId: z.string().uuid(),
});

export const CertificateInputSchema = z.object({
  studentId: z.string().uuid(),
});
