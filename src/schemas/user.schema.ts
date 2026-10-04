import { z } from "zod";

export const userStatusEnum = z.enum(["active", "inactive", "suspended", "blocked"]);
export type UserStatus = z.infer<typeof userStatusEnum>;

export const baseUserSchema = z.object({
  first_name: z
    .string()
    .min(1, "First name zaroori hai")
    .max(50, "First name 50 characters se chota hona chahiye")
    .trim(),
  last_name: z
    .string()
    .max(50, "Last name 50 characters se chota hona chahiye")
    .trim()
    .optional()
    .nullable()
    .or(z.literal("")),
  email: z
    .string()
    .min(1, "Email zaroori hai")
    .email("Valid email address dalein")
    .toLowerCase()
    .trim(),
  phone: z
    .string()
    .refine((val) => !val || /^\+?[0-9\s\-()]{7,20}$/.test(val), "Valid phone number dalein")
    .optional()
    .nullable()
    .or(z.literal("")),
  password: z
    .string()
    .min(8, "Password kam se kam 8 characters ka hona chahiye")
    .max(64, "Password 64 characters se zyada nahi ho sakta"),
  avatar: z
    .string()
    .refine(
      (val) => !val || /^(https?:\/\/|\/).+/.test(val),
      "Valid avatar URL dalein"
    )
    .optional()
    .nullable()
    .or(z.literal("")),
  dob: z
    .string()
    .optional()
    .nullable()
    .or(z.literal("")),
  status: userStatusEnum.default("active"),
  role_id: z.string().min(1, "Valid Role select karein"),
});

// Form creation schema
export const createUserSchema = baseUserSchema;

// Form update schema (password optional on update)
export const updateUserSchema = baseUserSchema
  .extend({
    password: z
      .string()
      .min(8, "Password kam se kam 8 characters ka hona chahiye")
      .max(64, "Password 64 characters se zyada nahi ho sakta")
      .optional()
      .or(z.literal("")),
  })
  .partial()
  .extend({
    id: z.string().min(1, "User ID missing ya invalid hai"),
  });

export const bulkImportUserSchema = z.object({
  items: z.array(createUserSchema).min(1, "Kam se kam ek user hona chahiye"),
});

// Primary Types
export type CreateUserInput = z.input<typeof createUserSchema>;
export type CreateUserOutput = z.output<typeof createUserSchema>;
export type UpdateUserInput = z.input<typeof updateUserSchema>;
export type BulkImportUserInput = z.input<typeof bulkImportUserSchema>;

// Form values type for UI forms
export type UserFormValues = Omit<CreateUserOutput, "password"> & {
  id?: string;
  password?: string;
  role?: { id: string; name: string };
  last_login_at?: string | null;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
};