import { z } from "zod";

export const baseRoleSchema = z.object({
  name: z
    .string()
    .min(1, "Role ka naam zaroori hai")
    .max(50, "Role name 50 characters se chota hona chahiye")
    .trim(),
  slug: z
    .string()
    .max(50, "Slug 50 characters se chota hona chahiye")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug sirf lowercase letters, numbers aur hyphens (-) contain kar sakta hai"
    )
    .optional()
    .nullable()
    .or(z.literal("")),
  is_manual_slug: z.boolean().default(false),
  description: z
    .string()
    .max(255, "Description 255 characters se chota hona chahiye")
    .optional()
    .nullable()
    .or(z.literal("")),
});

export const createRoleSchema = baseRoleSchema;

export const updateRoleSchema = baseRoleSchema.partial().extend({
  id: z.string().min(1, "Valid Role ID zaroori hai"),
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
  slug?: string;
  is_manual_slug?: boolean;
  users_count?: number;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
};