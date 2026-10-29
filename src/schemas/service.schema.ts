import { z } from "zod";

export const baseServiceSchema = z.object({
  title: z
    .string()
    .min(1, "Service title is required")
    .max(200, "Service title must not exceed 200 characters")
    .trim(),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(220, "Slug must not exceed 220 characters")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must contain only lowercase alphanumeric characters and hyphens"
    ),
  is_manual_slug: z.boolean().default(false),
  category_id: z.string().optional().nullable().or(z.literal("")),
  icon: z.string().max(100, "Icon identifier must not exceed 100 characters").optional().or(z.literal("")),
  featured_image: z
    .string()
    .refine((val) => !val || /^(https?:\/\/|\/|data:).+/.test(val), "Valid image URL is required")
    .optional()
    .or(z.literal("")),
  excerpt: z.string().max(500, "Excerpt must not exceed 500 characters").optional().or(z.literal("")),
  description: z.string().optional().or(z.literal("")),
  order: z.coerce.number().int().default(0).optional(),
  is_active: z.boolean().default(true),
  seo: z
    .object({
      meta_title: z.string().max(60, "Meta title must be under 60 characters").optional().or(z.literal("")),
      meta_description: z.string().max(160, "Meta description must be under 160 characters").optional().or(z.literal("")),
      canonical_url: z.string().optional().or(z.literal("")),
    })
    .optional(),
});

export const createServiceSchema = baseServiceSchema;

export const updateServiceSchema = baseServiceSchema.partial().extend({
  id: z.string().min(1, "Service ID is required"),
});

export const bulkImportServiceSchema = z.object({
  items: z.array(createServiceSchema).min(1, "At least one service is required"),
});

// Primary Types
export type CreateServiceInput = z.input<typeof createServiceSchema>;
export type CreateServiceOutput = z.output<typeof createServiceSchema>;
export type UpdateServiceInput = z.input<typeof updateServiceSchema>;
export type BulkImportServiceInput = z.input<typeof bulkImportServiceSchema>;

export type ServiceFormValues = CreateServiceOutput & {
  id?: string;
  category?: { id: string; name: string; slug: string } | null;
  created_at?: string;
  updated_at?: string;
};
