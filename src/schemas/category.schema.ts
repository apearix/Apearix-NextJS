import { z } from "zod";

export const baseCategorySchema = z.object({
  name: z
    .string()
    .min(1, "Category name zaroori hai")
    .max(150, "Name 150 characters se chota hona chahiye")
    .trim(),

  slug: z
    .string()
    .max(160, "Slug 160 characters se chota hona chahiye")
    .optional()
    .or(z.literal("")),

  description: z.string().optional().nullable().or(z.literal("")),

  icon_or_image: z.string().optional().nullable().or(z.literal("")),

  order: z.coerce.number().int().nonnegative().default(0),

  is_active: z.boolean().default(true),

  category_type_id: z.string().optional().nullable().or(z.literal("")),

  parent_id: z.string().optional().nullable().or(z.literal("")),

  // SEO fields
  meta_title: z.string().max(100).optional().nullable().or(z.literal("")),
  meta_description: z.string().max(255).optional().nullable().or(z.literal("")),
});

export const createCategorySchema = baseCategorySchema;

export const updateCategorySchema = baseCategorySchema.partial().extend({
  id: z.string().min(1, "Valid Category ID zaroori hai"),
});

export const bulkImportCategorySchema = z.object({
  items: z.array(createCategorySchema).min(1, "Kam se kam ek category honi chahiye"),
});

export type CreateCategoryInput = z.input<typeof createCategorySchema>;
export type CreateCategoryOutput = z.output<typeof createCategorySchema>;
export type UpdateCategoryInput = z.input<typeof updateCategorySchema>;
export type BulkImportCategoryInput = z.input<typeof bulkImportCategorySchema>;

export type CategoryFormValues = CreateCategoryOutput & {
  id?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
  category_type?: { id: string; name: string; slug: string } | null;
  parent?: { id: string; name: string } | null;
};