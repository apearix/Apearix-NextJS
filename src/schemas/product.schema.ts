import { z } from "zod";

export const baseProductSchema = z.object({
  name: z
    .string()
    .min(1, "Product name is required")
    .max(200, "Product name must not exceed 200 characters")
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
  price: z.coerce.number().min(0, "Price must be at least 0"),
  compare_at_price: z.coerce.number().min(0, "Compare at price must be at least 0").optional().nullable(),
  sku: z.string().max(100, "SKU must not exceed 100 characters").optional().or(z.literal("")),
  stock: z.coerce.number().int().min(0, "Stock must be at least 0").default(0).optional(),
  image_or_thumbnail: z
    .string()
    .refine((val) => !val || /^(https?:\/\/|\/|data:).+/.test(val), "Valid image URL is required")
    .optional()
    .or(z.literal("")),
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

export const createProductSchema = baseProductSchema;

export const updateProductSchema = baseProductSchema.partial().extend({
  id: z.string().min(1, "Product ID is required"),
});

export const bulkImportProductSchema = z.object({
  items: z.array(createProductSchema).min(1, "At least one product is required"),
});

// Primary Types
export type CreateProductInput = z.input<typeof createProductSchema>;
export type CreateProductOutput = z.output<typeof createProductSchema>;
export type UpdateProductInput = z.input<typeof updateProductSchema>;
export type BulkImportProductInput = z.input<typeof bulkImportProductSchema>;

export type ProductFormValues = CreateProductOutput & {
  id?: string;
  category?: { id: string; name: string; slug: string } | null;
  created_at?: string;
  updated_at?: string;
};
