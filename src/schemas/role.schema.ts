import { z } from "zod";

export const baseRoleSchema = z.object({
  name: z
    .string()
    .min(1, "Role ka naam zaroori hai")
    .max(50, "Role name 50 characters se chota hona chahiye")
    .trim(),
  description: z
    .string()
    .max(255, "Description 255 characters se chota hona chahiye")
    .optional()
    .nullable()
    .or(z.literal("")),
});

export const createRoleSchema = baseRoleSchema;

export const updateRoleSchema = baseRoleSchema.partial().extend({
  id: z.string().uuid("Valid Role ID zaroori hai"),
});

export const bulkImportRoleSchema = z.object({
  items: z.array(createRoleSchema).min(1, "Kam se kam ek role hona chahiye"),
});

// Primary Types
export type CreateRoleInput = z.input<typeof createRoleSchema>;
export type CreateRoleOutput = z.output<typeof createRoleSchema>;
export type UpdateRoleInput = z.input<typeof updateRoleSchema>;
export type BulkImportRoleInput = z.input<typeof bulkImportRoleSchema>;

export type RoleFormValues = CreateRoleOutput & {
  id?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
};