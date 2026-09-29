import { z } from "zod";

export const blogFormSchema = z.object({
  title: z
    .string()
    .min(1, "Title zaroori hai")
    .max(200, "Title 200 characters se zyada nahi ho sakta"),
  slug: z
    .string()
    .min(1, "Slug zaroori hai")
    .max(220, "Slug 220 characters se zyada nahi ho sakta")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug sirf lowercase letters, numbers aur hyphens (-) contain kar sakta hai"),
  excerpt: z.string().optional(),
  content: z.string().min(1, "Content zaroori hai"),
  featured_image: z.string().url("Valid image URL enter karein").optional().or(z.literal("")),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  author_id: z.number().int().positive("Author select karna zaroori hai"),
  published_at: z.string().optional().nullable(),
  meta_title: z.string().max(60, "Meta title 60 characters se chota hona chahiye").optional(),
  meta_description: z.string().max(160, "Meta description 160 characters se chota hona chahiye").optional(),
  canonical_url: z.string().url("Valid canonical URL dalein").max(500).optional().or(z.literal("")),
});

export type BlogFormValues = z.infer<typeof blogFormSchema>;