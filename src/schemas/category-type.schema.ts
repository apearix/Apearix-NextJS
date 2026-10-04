import { z } from "zod";

export const baseCategoryTypeSchema = z.object({
  name: z
    .string()
    .min(1, "Category Type ka naam zaroori hai")
    .max(100, "Name 100 characters se chota hona chahiye")
    .trim(),

  slug: z
    .string()
    .max(100, "Slug 100 characters se chota hona chahiye")
    .optional()
    .or(z.literal("")),

  description: z.string().optional().nullable().or(z.literal("")),
  is_active: z.boolean().default(true),
});

export const createCategoryTypeSchema = baseCategoryTypeSchema;

export const updateCategoryTypeSchema = baseCategoryTypeSchema.partial().extend({
  id: z.string().min(1, "Valid Category Type ID zaroori hai"),
});

export const bulkImportCategoryTypeSchema = z.object({
  items: z.array(createCategoryTypeSchema).min(1, "Kam se kam ek Category Type hona chahiye"),
});

export type CreateCategoryTypeInput = z.input<typeof createCategoryTypeSchema>;
export type CreateCategoryTypeOutput = z.output<typeof createCategoryTypeSchema>;
export type UpdateCategoryTypeInput = z.input<typeof updateCategoryTypeSchema>;
export type BulkImportCategoryTypeInput = z.input<typeof bulkImportCategoryTypeSchema>;

export type CategoryTypeFormValues = CreateCategoryTypeOutput & {
  id?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
};