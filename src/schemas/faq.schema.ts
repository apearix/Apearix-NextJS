import { z } from "zod";

export const baseFaqSchema = z.object({
  question: z
    .string()
    .min(1, "Question zaroori hai")
    .max(300, "Question 300 characters se chota hona chahiye")
    .trim(),
  answer: z
    .string()
    .min(1, "Answer zaroori hai")
    .max(50000, "Answer 50,000 characters se chota hona chahiye"),
  category: z
    .string()
    .max(50, "Category name 50 characters se chota hona chahiye")
    .default("general")
    .optional()
    .or(z.literal("")),
  order: z.number().int().default(0).optional(),
  is_active: z.boolean().default(true),
});

export const createFaqSchema = baseFaqSchema;

export const updateFaqSchema = baseFaqSchema.partial().extend({
  id: z.string().min(1, "FAQ ID missing hai"),
});

export const bulkImportFaqSchema = z.object({
  items: z.array(createFaqSchema).min(1, "Kam se kam ek FAQ hona chahiye"),
});

// Primary Types
export type CreateFaqInput = z.input<typeof createFaqSchema>;
export type CreateFaqOutput = z.output<typeof createFaqSchema>;
export type UpdateFaqInput = z.input<typeof updateFaqSchema>;
export type BulkImportFaqInput = z.input<typeof bulkImportFaqSchema>;

export type FaqFormValues = CreateFaqOutput & {
  id?: string;
  created_at?: string;
  updated_at?: string;
};