import { z } from "zod";

export const createProjectSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name must be 100 characters or less"),
  description: z.string().max(500, "Description must be 500 characters or less").optional(),
  clientName: z.string().max(100, "Client name must be 100 characters or less").optional(),
  clientEmail: z.string().email("Invalid email address").optional().or(z.literal("")),
});

export const updateProjectSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name must be 100 characters or less").optional(),
  description: z.string().max(500, "Description must be 500 characters or less").optional(),
  status: z.enum(["draft", "active", "paused", "completed"]).optional(),
  clientName: z.string().max(100, "Client name must be 100 characters or less").optional(),
  clientEmail: z.string().email("Invalid email address").optional().or(z.literal("")),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
