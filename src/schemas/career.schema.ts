import { z } from "zod";

export const JobTypeEnum = z.enum(["Full-Time", "Part-Time", "Contract", "Internship"]);
export const WorkplaceTypeEnum = z.enum(["Remote", "Hybrid", "On-Site"]);
export const JobStatusEnum = z.enum(["draft", "published", "closed", "archived"]);

export const ApplicationStatusEnum = z.enum([
  "applied",
  "reviewing",
  "shortlisted",
  "interviewing",
  "offered",
  "hired",
  "rejected",
]);

export const baseJobSchema = z.object({
  title: z
    .string()
    .min(1, "Job title zaroori hai")
    .max(250, "Job title 250 characters se chota hona chahiye")
    .trim(),
  slug: z.string().optional().or(z.literal("")),
  department: z
    .string()
    .min(1, "Department zaroori hai")
    .max(100, "Department 100 characters se chota hona chahiye")
    .trim(),
  job_type: JobTypeEnum.default("Full-Time"),
  workplace_type: WorkplaceTypeEnum.default("Remote"),
  location: z.string().default("Remote").optional(),
  experience_level: z.string().optional().or(z.literal("")),
  salary_min: z.number().nullable().optional(),
  salary_max: z.number().nullable().optional(),
  salary_currency: z.string().default("USD").optional(),
  is_salary_disclosed: z.boolean().default(false),
  overview: z.string().min(1, "Job overview / description zaroori hai"),
  responsibilities: z.array(z.string()).default([]),
  requirements: z.array(z.string()).default([]),
  benefits: z.array(z.string()).default([]),
  status: JobStatusEnum.default("published"),
  is_featured: z.boolean().default(false),
  order: z.number().int().default(0),
  deadline: z.string().nullable().optional().or(z.literal("")),
});

export const createJobSchema = baseJobSchema;

export const updateJobSchema = baseJobSchema.partial().extend({
  id: z.string().min(1, "Job ID missing hai"),
});

export type CreateJobInput = z.input<typeof createJobSchema>;
export type CreateJobOutput = z.output<typeof createJobSchema>;
export type UpdateJobInput = z.input<typeof updateJobSchema>;

export type JobFormValues = CreateJobOutput & {
  id?: string;
  applicant_count?: number;
  views_count?: number;
  created_at?: string;
  updated_at?: string;
};

// Application Schemas
export const baseApplicationSchema = z.object({
  job_id: z.string().min(1, "Job ID zaroori hai"),
  first_name: z.string().min(1, "First name zaroori hai").max(120),
  last_name: z.string().min(1, "Last name zaroori hai").max(120),
  email: z.string().email("Valid email zaroori hai").max(160),
  phone: z.string().optional().or(z.literal("")),
  portfolio_url: z.string().url("Valid URL").optional().or(z.literal("")),
  linkedin_url: z.string().url("Valid URL").optional().or(z.literal("")),
  github_url: z.string().url("Valid URL").optional().or(z.literal("")),
  cover_letter: z.string().optional().or(z.literal("")),
  current_ctc: z.string().optional().or(z.literal("")),
  expected_ctc: z.string().optional().or(z.literal("")),
  notice_period: z.string().optional().or(z.literal("")),
  status: ApplicationStatusEnum.default("applied"),
  rating: z.number().int().min(0).max(5).default(0),
  admin_notes: z.string().optional().or(z.literal("")),
});

export type ApplicationItem = {
  id: string;
  job_id: string;
  job?: JobFormValues;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string | null;
  resume_url: string;
  resume_filename?: string | null;
  portfolio_url?: string | null;
  linkedin_url?: string | null;
  github_url?: string | null;
  cover_letter?: string | null;
  current_ctc?: string | null;
  expected_ctc?: string | null;
  notice_period?: string | null;
  status: "applied" | "reviewing" | "shortlisted" | "interviewing" | "offered" | "hired" | "rejected";
  rating: number;
  admin_notes?: string | null;
  created_at?: string;
  updated_at?: string;
};
