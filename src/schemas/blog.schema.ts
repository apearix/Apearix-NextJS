import { z } from "zod";

export const postStatusEnum = z.enum(["draft", "published", "archived"]);
export type PostStatus = z.infer<typeof postStatusEnum>;

export const publishingSchema = z.object({
  status: postStatusEnum.default("draft"),
  author_id: z.string().min(1, "Author select karein"),
  published_at: z.string().optional().nullable().or(z.literal("")),
});

export const seoSchema = z.object({
  meta_title: z
    .string()
    .max(60, "Meta title 60 characters se chota hona chahiye")
    .optional()
    .or(z.literal("")),
  meta_description: z
    .string()
    .max(160, "Meta description 160 characters se chota hona chahiye")
    .optional()
    .or(z.literal("")),
  canonical_url: z
    .string()
    .max(500, "Canonical URL 500 characters se zyada nahi ho sakta")
    .refine(
      (val) => !val || /^(https?:\/\/|\/).+/.test(val),
      "Valid canonical URL dalein"
    )
    .optional()
    .or(z.literal("")),
});

export const baseBlogSchema = z.object({
  title: z
    .string()
    .min(1, "Title zaroori hai")
    .max(200, "Title 200 characters se zyada nahi ho sakta"),
  slug: z
    .string()
    .min(1, "Slug zaroori hai")
    .max(220, "Slug 220 characters se zyada nahi ho sakta")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug sirf lowercase letters, numbers aur hyphens (-) contain kar sakta hai"
    ),
  is_manual_slug: z.boolean().default(false),
  excerpt: z.string().optional().or(z.literal("")),
  content: z
    .string()
    .min(1, "Blog content is required")
    .max(100000, "Blog content 1,00,000 characters (HTML ke sath) se zyada nahi ho sakta."),
  featured_image: z
    .string()
    .refine(
      (val) => !val || /^(https?:\/\/|\/).+/.test(val),
      "Valid image URL dalein"
    )
    .optional()
    .or(z.literal("")),
  publishing: publishingSchema,
  seo: seoSchema,
});

export const createBlogSchema = baseBlogSchema;

export const updateBlogSchema = baseBlogSchema.partial().extend({
  id: z.string().min(1, "Blog ID missing hai"),
});

export const bulkImportBlogSchema = z.object({
  items: z.array(createBlogSchema).min(1, "Kam se kam ek blog post hona chahiye"),
});

// Primary Types
export type CreateBlogInput = z.input<typeof createBlogSchema>;
export type CreateBlogOutput = z.output<typeof createBlogSchema>;
export type UpdateBlogInput = z.input<typeof updateBlogSchema>;
export type BulkImportBlogInput = z.input<typeof bulkImportBlogSchema>;

// Exact Match to your PostFormValues interface
export type PostFormValues = CreateBlogOutput & {
  id?: string;
  updated_at?: string;
};