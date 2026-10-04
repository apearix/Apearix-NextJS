import { z } from "zod";

export const pageStatusEnum = z.enum(["draft", "published", "archived"]);
export type PageStatus = z.infer<typeof pageStatusEnum>;

export const basePageSchema = z.object({
  title: z
    .string()
    .min(1, "Page title zaroori hai")
    .max(150, "Title 150 characters se chota hona chahiye"),
  slug: z
    .string()
    .min(1, "Slug zaroori hai")
    .max(150, "Slug 150 characters se chota hona chahiye")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug sirf lowercase letters, numbers aur hyphens (-) contain kar sakta hai"
    ),
  is_manual_slug: z.boolean().default(false),
  content: z
    .string()
    .min(1, "Page content is required")
    .max(100000, "Content limit 100,000 characters (HTML ke sath) hai."),
  status: pageStatusEnum.default("published"),
  meta_title: z
    .string()
    .max(100, "Meta title 100 characters se chota hona chahiye")
    .optional()
    .nullable()
    .or(z.literal("")),
  meta_description: z
    .string()
    .max(255, "Meta description 255 characters se chota hona chahiye")
    .optional()
    .nullable()
    .or(z.literal("")),
  published_at: z.string().optional().nullable().or(z.literal("")),
});

export const createPageSchema = basePageSchema;

export const updatePageSchema = basePageSchema.partial().extend({
  id: z.string().min(1, "Page ID missing hai"),
});

export const bulkImportPageSchema = z.object({
  items: z.array(createPageSchema).min(1, "Kam se kam ek page hona chahiye"),
});

// Primary Types
export type CreatePageInput = z.input<typeof createPageSchema>;
export type CreatePageOutput = z.output<typeof createPageSchema>;
export type UpdatePageInput = z.input<typeof updatePageSchema>;
export type BulkImportPageInput = z.input<typeof bulkImportPageSchema>;

export type PageFormValues = CreatePageOutput & {
  id?: string;
  created_at?: string;
  updated_at?: string;
};