import { z } from "zod";

export const createMilestoneSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title must be 200 characters or less"),
  description: z.string().max(1000, "Description must be 1000 characters or less").optional(),
});

export const updateMilestoneSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title must be 200 characters or less").optional(),
  description: z.string().max(1000, "Description must be 1000 characters or less").optional(),
  status: z.enum(["pending", "in_progress", "completed"]).optional(),
});

export const reorderMilestonesSchema = z.object({
  milestoneIds: z.array(z.string()).min(1, "At least one milestone is required"),
});

export type CreateMilestoneInput = z.infer<typeof createMilestoneSchema>;
export type UpdateMilestoneInput = z.infer<typeof updateMilestoneSchema>;
export type ReorderMilestonesInput = z.infer<typeof reorderMilestonesSchema>;
