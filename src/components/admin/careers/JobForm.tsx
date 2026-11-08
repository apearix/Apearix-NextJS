"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Briefcase,
  DollarSign,
  Plus,
  X,
  CheckCircle2,
  Loader2,
  Calendar,
  Save,
  ArrowLeft,
  Info,
  FileText,
  Sparkles,
  MapPin,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/common/PageHeader";
import { SectionCard } from "@/components/admin/common/SectionCard";
import type { CreateJobInput, JobFormValues } from "@/schemas/career.schema";
import { store as createJobApi, update as updateJobApi } from "@/lib/services/admin/careers";

export interface JobFormProps {
  initialData?: JobFormValues | null;
  isEdit?: boolean;
}

const DEPARTMENTS = [
  "Engineering",
  "AI R&D",
  "Product Design",
  "Mobile",
  "DevOps & Cloud",
  "Marketing & Growth",
];

type JobType = "Full-Time" | "Part-Time" | "Contract" | "Internship";
type WorkplaceType = "Remote" | "Hybrid" | "On-Site";
type JobStatus = "draft" | "published" | "closed" | "archived";

function generateSlug(text: string): string {
  let s = text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .slice(0, 200);

  while (s.startsWith("-")) s = s.slice(1);
  while (s.endsWith("-")) s = s.slice(0, -1);
  return s;
}

export function JobForm({ initialData, isEdit = false }: Readonly<JobFormProps>) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [autoSlug, setAutoSlug] = useState(!initialData?.slug);

  // Form Fields
  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [department, setDepartment] = useState(initialData?.department || "Engineering");
  const [jobType, setJobType] = useState<JobType>(
    (initialData?.job_type as JobType) || "Full-Time"
  );
  const [workplaceType, setWorkplaceType] = useState<WorkplaceType>(
    (initialData?.workplace_type as WorkplaceType) || "Remote"
  );
  const [location, setLocation] = useState(initialData?.location || "Remote");
  const [experienceLevel, setExperienceLevel] = useState(initialData?.experience_level || "");

  // Salary
  const [isSalaryDisclosed, setIsSalaryDisclosed] = useState(initialData?.is_salary_disclosed || false);
  const [salaryCurrency, setSalaryCurrency] = useState(initialData?.salary_currency || "USD");
  const [salaryMin, setSalaryMin] = useState<number | string>(
    initialData?.salary_min !== null && initialData?.salary_min !== undefined ? initialData.salary_min : ""
  );
  const [salaryMax, setSalaryMax] = useState<number | string>(
    initialData?.salary_max !== null && initialData?.salary_max !== undefined ? initialData.salary_max : ""
  );

  // Content
  const [overview, setOverview] = useState(initialData?.overview || "");

  // Dynamic Bullet Lists
  const [responsibilities, setResponsibilities] = useState<string[]>(
    initialData?.responsibilities || [
      "Architect and build high-performance web applications using modern tech stacks.",
      "Collaborate with cross-functional teams to design scalable backend APIs and responsive user interfaces.",
      "Participate in code reviews and advocate for engineering best practices.",
    ]
  );
  const [respInput, setRespInput] = useState("");

  const [requirements, setRequirements] = useState<string[]>(
    initialData?.requirements || [
      "Strong proficiency in TypeScript, React / Next.js, and modern CSS frameworks.",
      "Experience writing clean, maintainable code with thorough automated testing.",
      "Excellent problem-solving skills and async communication capabilities.",
    ]
  );
  const [reqInput, setReqInput] = useState("");

  const [benefits, setBenefits] = useState<string[]>(
    initialData?.benefits || [
      "100% Remote-first work culture",
      "Flexible working hours with async-first mindset",
      "Competitive compensation package",
      "Annual learning and home office stipend",
    ]
  );
  const [benefitInput, setBenefitInput] = useState("");

  // Status & Meta
  const [status, setStatus] = useState<JobStatus>(
    (initialData?.status as JobStatus) || "published"
  );
  const [isFeatured, setIsFeatured] = useState(initialData?.is_featured || false);
  const [order, setOrder] = useState<number>(initialData?.order || 0);
  const [deadline, setDeadline] = useState<string>(
    initialData?.deadline ? initialData.deadline.split("T")[0] : ""
  );

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (autoSlug) {
      setSlug(generateSlug(val));
    }
  };

  // Tag list helper
  const addTag = (
    text: string,
    list: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>,
    setInput: React.Dispatch<React.SetStateAction<string>>
  ) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    if (!list.includes(trimmed)) {
      setList([...list, trimmed]);
    }
    setInput("");
  };

  const removeTag = (
    idx: number,
    list: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setList(list.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Job title is required");
      return;
    }
    if (!department.trim()) {
      toast.error("Department is required");
      return;
    }
    if (!overview.trim()) {
      toast.error("Role overview / mission description is required");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: CreateJobInput = {
        title: title.trim(),
        slug: slug.trim() || undefined,
        department: department.trim(),
        job_type: jobType,
        workplace_type: workplaceType,
        location: location.trim() || "Remote",
        experience_level: experienceLevel.trim() || undefined,
        is_salary_disclosed: isSalaryDisclosed,
        salary_currency: salaryCurrency,
        salary_min: salaryMin !== "" ? Number(salaryMin) : null,
        salary_max: salaryMax !== "" ? Number(salaryMax) : null,
        overview: overview.trim(),
        responsibilities,
        requirements,
        benefits,
        status,
        is_featured: isFeatured,
        order: Number(order) || 0,
        deadline: deadline ? `${deadline}T23:59:59Z` : null,
      };

      if (isEdit && initialData?.id) {
        await updateJobApi(initialData.id, { ...payload, id: initialData.id });
        toast.success("Job opening updated successfully!");
      } else {
        await createJobApi(payload);
        toast.success("Job opening created successfully!");
      }

      setTimeout(() => {
        router.push("/admin/careers");
        router.refresh();
      }, 700);
    } catch (err: unknown) {
      console.error(err);
      const errMsg = err instanceof Error ? err.message : "Failed to save job opening.";
      toast.error(errMsg);
      setIsSubmitting(false);
    }
  };

  return (
    <main>
      {/* Page Header */}
      <PageHeader
        title={isEdit ? `Edit: ${initialData?.title || title || "Job Opening"}` : "Create Job Opening"}
        subtitle={
          isEdit
            ? "Update role specifications, requirements, compensation, and publication status."
            : "Draft, specify responsibilities, requirements, and publish a new career opportunity on Apearix."
        }
        badge="Careers"
        btn={
          <div className="flex items-center gap-2">
            <Link
              href="/admin/careers"
              className="inline-flex items-center gap-1.5 px-3 py-2 border border-border text-xs font-semibold rounded-lg text-heading hover:bg-surface transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </Link>
            <button
              type="submit"
              form="career-job-form"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover disabled:opacity-60 disabled:cursor-not-allowed text-white text-xs font-semibold rounded-lg shadow-sm shadow-primary/20 transition-all active:scale-[0.98] cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{isEdit ? "Saving..." : "Creating..."}</span>
                </>
              ) : (
                <>
                  {isEdit ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  <span>{isEdit ? "Save Changes" : "Publish Opening"}</span>
                </>
              )}
            </button>
          </div>
        }
      />

      {/* Main 2-Column Responsive Form */}
      <form
        id="career-job-form"
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-6 lg:grid-cols-12 pb-16"
      >
        {/* Left Column (8 cols): Core Content */}
        <section className="space-y-6 lg:col-span-8">
          {/* 1. General Information */}
          <SectionCard title="General Information" icon={Briefcase}>
            {/* Title */}
            <div>
              <label htmlFor="job-title" className="block text-heading text-xs font-semibold mb-1">
                Role Title <span className="text-rose-500">*</span>
              </label>
              <input
                id="job-title"
                type="text"
                required
                maxLength={250}
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. Senior Full Stack Engineer (Next.js & TypeScript)"
                className="w-full text-xs p-2.5 rounded-lg border border-border focus:ring-1 focus:ring-primary focus:outline-none"
              />
              <div className="mt-1 flex items-center justify-between text-[11px] text-muted">
                <span>Engaging and specific job title for candidate discovery</span>
                <span>{title.length}/250</span>
              </div>
            </div>

            {/* URL Slug with Auto / Manual toggle */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="job-slug" className="block text-heading text-xs font-semibold">
                  URL Slug
                </label>
                <button
                  type="button"
                  onClick={() => {
                    const next = !autoSlug;
                    setAutoSlug(next);
                    if (next && title) {
                      setSlug(generateSlug(title));
                    }
                  }}
                  className="text-xs text-primary hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3 h-3" />
                  {autoSlug ? "Switch to Manual Slug" : "Auto-Generate from Title"}
                </button>
              </div>

              <div className="flex items-center rounded-lg border border-border bg-surface-alt px-3 focus-within:border-primary focus-within:bg-background">
                <span className="text-xs text-muted select-none font-mono">
                  apearix.com/careers/
                </span>
                <input
                  id="job-slug"
                  type="text"
                  value={slug}
                  onChange={(e) => {
                    setAutoSlug(false);
                    setSlug(e.target.value);
                  }}
                  placeholder="senior-full-stack-engineer"
                  className="w-full text-xs p-2 bg-transparent border-0 focus:outline-none font-mono text-heading"
                />
              </div>
            </div>

            {/* Overview / Mission */}
            <div>
              <label htmlFor="job-overview" className="block text-heading text-xs font-semibold mb-1">
                Role Overview & Mission <span className="text-rose-500">*</span>
              </label>
              <textarea
                id="job-overview"
                required
                rows={5}
                value={overview}
                onChange={(e) => setOverview(e.target.value)}
                placeholder="Describe what makes this position exciting, the team environment, and the products the engineer will build..."
                className="w-full text-xs p-3 rounded-lg border border-border focus:ring-1 focus:ring-primary focus:outline-none resize-y"
              />
            </div>
          </SectionCard>

          {/* 2. Responsibilities & Requirements */}
          <SectionCard title="Responsibilities & Requirements" icon={FileText}>
            {/* Responsibilities */}
            <div>
              <label className="text-xs font-semibold text-heading block mb-1">
                Key Responsibilities
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={respInput}
                  onChange={(e) => setRespInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTag(respInput, responsibilities, setResponsibilities, setRespInput);
                    }
                  }}
                  placeholder="Add a core duty and press Enter..."
                  className="flex-1 text-xs p-2.5 rounded-lg border border-border focus:ring-1 focus:ring-primary focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => addTag(respInput, responsibilities, setResponsibilities, setRespInput)}
                  className="px-3 py-2 bg-surface hover:bg-slate-200 border border-border text-heading text-xs font-semibold rounded-lg transition-colors cursor-pointer shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
              <ul className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                {responsibilities.map((r, i) => (
                  <li
                    key={i}
                    className="flex items-center justify-between p-2 rounded-lg bg-surface border border-border text-xs text-heading group"
                  >
                    <span className="flex items-start gap-2 min-w-0 pr-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                      <span className="wrap-break-word">{r}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => removeTag(i, responsibilities, setResponsibilities)}
                      className="p-1 text-muted hover:text-rose-600 transition-colors cursor-pointer shrink-0"
                      title="Remove responsibility"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Requirements */}
            <div className="pt-2 border-t border-border/70">
              <label className="text-xs font-semibold text-heading block mb-1">
                Requirements & Qualifications
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={reqInput}
                  onChange={(e) => setReqInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTag(reqInput, requirements, setRequirements, setReqInput);
                    }
                  }}
                  placeholder="Add a qualification and press Enter..."
                  className="flex-1 text-xs p-2.5 rounded-lg border border-border focus:ring-1 focus:ring-primary focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => addTag(reqInput, requirements, setRequirements, setReqInput)}
                  className="px-3 py-2 bg-surface hover:bg-slate-200 border border-border text-heading text-xs font-semibold rounded-lg transition-colors cursor-pointer shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
              <ul className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                {requirements.map((r, i) => (
                  <li
                    key={i}
                    className="flex items-center justify-between p-2 rounded-lg bg-surface border border-border text-xs text-heading group"
                  >
                    <span className="flex items-start gap-2 min-w-0 pr-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="wrap-break-word">{r}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => removeTag(i, requirements, setRequirements)}
                      className="p-1 text-muted hover:text-rose-600 transition-colors cursor-pointer shrink-0"
                      title="Remove requirement"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Benefits */}
            <div className="pt-2 border-t border-border/70">
              <label className="text-xs font-semibold text-heading block mb-1">
                Perks & Benefits
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={benefitInput}
                  onChange={(e) => setBenefitInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTag(benefitInput, benefits, setBenefits, setBenefitInput);
                    }
                  }}
                  placeholder="Add a benefit (e.g. Health insurance, Equity, Remote stipend)..."
                  className="flex-1 text-xs p-2.5 rounded-lg border border-border focus:ring-1 focus:ring-primary focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => addTag(benefitInput, benefits, setBenefits, setBenefitInput)}
                  className="px-3 py-2 bg-surface hover:bg-slate-200 border border-border text-heading text-xs font-semibold rounded-lg transition-colors cursor-pointer shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {benefits.map((b, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-alt border border-border text-xs text-heading font-medium"
                  >
                    <span>{b}</span>
                    <button
                      type="button"
                      onClick={() => removeTag(i, benefits, setBenefits)}
                      className="text-muted hover:text-rose-600 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </SectionCard>

          {/* 3. Compensation & Location */}
          <SectionCard title="Compensation & Location" icon={DollarSign}>
            <div className="flex items-center justify-between pb-2 border-b border-border/70">
              <div>
                <p className="text-xs font-semibold text-heading">Public Compensation</p>
                <p className="text-[11px] text-muted">
                  Disclosing compensation significantly increases candidate conversion.
                </p>
              </div>
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-heading select-none">
                <input
                  type="checkbox"
                  checked={isSalaryDisclosed}
                  onChange={(e) => setIsSalaryDisclosed(e.target.checked)}
                  className="w-4 h-4 rounded border-border text-primary focus:ring-primary accent-primary cursor-pointer"
                />
                Show on Job Board
              </label>
            </div>

            {isSalaryDisclosed && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1 animate-in fade-in duration-150">
                <div>
                  <label className="text-xs font-semibold text-heading block mb-1">Currency</label>
                  <select
                    value={salaryCurrency}
                    onChange={(e) => setSalaryCurrency(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-border focus:ring-1 focus:ring-primary focus:outline-none bg-white cursor-pointer"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="INR">INR (₹)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-heading block mb-1">
                    Minimum Annual
                  </label>
                  <input
                    type="number"
                    value={salaryMin}
                    onChange={(e) => setSalaryMin(e.target.value)}
                    placeholder="e.g. 90000"
                    className="w-full text-xs p-2.5 rounded-lg border border-border focus:ring-1 focus:ring-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-heading block mb-1">
                    Maximum Annual
                  </label>
                  <input
                    type="number"
                    value={salaryMax}
                    onChange={(e) => setSalaryMax(e.target.value)}
                    placeholder="e.g. 135000"
                    className="w-full text-xs p-2.5 rounded-lg border border-border focus:ring-1 focus:ring-primary focus:outline-none"
                  />
                </div>
              </div>
            )}
          </SectionCard>
        </section>

        {/* Right Column (4 cols): Settings & Metadata */}
        <aside className="space-y-6 lg:col-span-4">
          {/* 4. Publishing & Deadlines */}
          <SectionCard title="Publishing & Visibility" icon={Calendar}>
            <div>
              <label className="text-xs font-semibold text-heading block mb-1">
                Publication Status <span className="text-rose-500">*</span>
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as JobStatus)}
                className="w-full text-xs p-2.5 rounded-lg border border-border focus:ring-1 focus:ring-primary focus:outline-none bg-white font-medium cursor-pointer"
              >
                <option value="published">Published (Live on Website)</option>
                <option value="draft">Draft (Internal Only)</option>
                <option value="closed">Closed (No Longer Accepting)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-heading block mb-1">
                Application Deadline
              </label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-border focus:ring-1 focus:ring-primary focus:outline-none bg-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-heading block mb-1">Sort Order</label>
              <input
                type="number"
                value={order}
                onChange={(e) => setOrder(Number(e.target.value))}
                placeholder="0"
                className="w-full text-xs p-2.5 rounded-lg border border-border focus:ring-1 focus:ring-primary focus:outline-none bg-white"
              />
              <span className="text-[11px] text-muted mt-1 block">
                Lower numbers appear first on the careers page.
              </span>
            </div>

            <div className="pt-2 border-t border-border/70">
              <label className="flex items-start gap-2.5 cursor-pointer text-xs font-semibold text-heading select-none">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-4 h-4 rounded border-border text-primary focus:ring-primary accent-primary cursor-pointer mt-0.5"
                />
                <div>
                  <span>Featured Position</span>
                  <p className="text-[11px] text-muted font-normal mt-0.5">
                    Highlight this role in a top banner and prioritize in searches.
                  </p>
                </div>
              </label>
            </div>
          </SectionCard>

          {/* 5. Role Classification */}
          <SectionCard title="Role Classification" icon={Info}>
            <div>
              <label className="text-xs font-semibold text-heading block mb-1">
                Department <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="e.g. Engineering"
                className="w-full text-xs p-2.5 rounded-lg border border-border focus:ring-1 focus:ring-primary focus:outline-none mb-1.5"
              />
              <div className="flex flex-wrap gap-1">
                {DEPARTMENTS.map((d) => (
                  <button
                    type="button"
                    key={d}
                    onClick={() => setDepartment(d)}
                    className={`text-[10px] px-2 py-0.5 rounded border transition-colors cursor-pointer ${department === d
                      ? "bg-primary text-white border-primary"
                      : "bg-surface text-muted border-border hover:bg-slate-100"
                      }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-heading block mb-1">Job Type</label>
              <select
                value={jobType}
                onChange={(e) => setJobType(e.target.value as JobType)}
                className="w-full text-xs p-2.5 rounded-lg border border-border focus:ring-1 focus:ring-primary focus:outline-none bg-white cursor-pointer"
              >
                <option value="Full-Time">Full-Time</option>
                <option value="Part-Time">Part-Time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-heading block mb-1">
                Workplace Setting
              </label>
              <select
                value={workplaceType}
                onChange={(e) => setWorkplaceType(e.target.value as WorkplaceType)}
                className="w-full text-xs p-2.5 rounded-lg border border-border focus:ring-1 focus:ring-primary focus:outline-none bg-white cursor-pointer"
              >
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="On-Site">On-Site</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-heading block mb-1">Location</label>
              <div className="relative">
                <MapPin className="w-3.5 h-3.5 text-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Remote (Worldwide) or Bangalore, India"
                  className="w-full text-xs pl-8 pr-3 py-2.5 rounded-lg border border-border focus:ring-1 focus:ring-primary focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-heading block mb-1">
                Experience Level
              </label>
              <input
                type="text"
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                placeholder="e.g. 4+ Years / Senior"
                className="w-full text-xs p-2.5 rounded-lg border border-border focus:ring-1 focus:ring-primary focus:outline-none"
              />
            </div>
          </SectionCard>
        </aside>
      </form>
    </main>
  );
}
