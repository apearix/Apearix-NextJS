import { z } from "zod";

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
  excerpt: z.string().optional(),
  content: z.string().min(1, "Content zaroori hai"),
  featured_image: z
    .string()
    .refine(
      (val) => !val || /^https?:\/\/.+/.test(val),
      "Valid image URL dalein"
    )
    .optional()
    .or(z.literal("")),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  author_id: z.string().min(1, "Author select karein"),
  published_at: z.string().optional().nullable().or(z.literal("")),
  meta_title: z
    .string()
    .max(60, "Meta title 60 characters se chota hona chahiye")
    .optional(),
  meta_description: z
    .string()
    .max(160, "Meta description 160 characters se chota hona chahiye")
    .optional(),
  canonical_url: z
    .string()
    .max(500, "Canonical URL 500 characters se zyada nahi ho sakta")
    .refine(
      (val) => !val || /^https?:\/\/.+/.test(val),
      "Valid canonical URL dalein"
    )
    .optional()
    .or(z.literal("")),
});

export const createBlogSchema = baseBlogSchema.extend({
  is_manual_slug: z.boolean().default(false),
});

export const updateBlogSchema = baseBlogSchema.partial().extend({
  id: z.string().min(1, "Blog ID missing hai"),
});

// Primary Types
export type CreateBlogInput = z.infer<typeof createBlogSchema>;
export type UpdateBlogInput = z.infer<typeof updateBlogSchema>;

// Aliases (backward compatibility ke liye)
export const blogFormSchema = createBlogSchema; 