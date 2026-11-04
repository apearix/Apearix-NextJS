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
  AlertCircle,
  Loader2,
  Calendar,
  Save,
  ArrowLeft,
} from "lucide-react";
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

export function JobForm({ initialData, isEdit = false }: Readonly<JobFormProps>) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form Fields
  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [department, setDepartment] = useState(initialData?.department || "Engineering");
  const [jobType, setJobType] = useState<any>(initialData?.job_type || "Full-Time");
  const [workplaceType, setWorkplaceType] = useState<any>(initialData?.workplace_type || "Remote");
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
  
  // Tag / Bullet lists
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
      "Strong proficiency in TypeScript, React / Next.js, and Node.js ecosystems.",
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
  const [status, setStatus] = useState<any>(initialData?.status || "published");
  const [isFeatured, setIsFeatured] = useState(initialData?.is_featured || false);
  const [order, setOrder] = useState<number>(initialData?.order || 0);
  const [deadline, setDeadline] = useState<string>(
    initialData?.deadline ? initialData.deadline.split("T")[0] : ""
  );

  // Tag helper
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
    setErrorMsg(null);

    if (!title.trim()) {
      setErrorMsg("Job title is required");
      return;
    }
    if (!department.trim()) {
      setErrorMsg("Department is required");
      return;
    }
    if (!overview.trim()) {
      setErrorMsg("Role overview is required");
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
      } else {
        await createJobApi(payload);
      }

      router.push("/admin/careers");
      router.refresh();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Something went wrong while saving the job");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl pb-16">
      {/* Top action bar */}
      <div className="flex items-center justify-between border-b border-border pb-4">
        <Link
          href="/admin/careers"
          className="text-xs font-semibold text-muted hover:text-heading flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Careers
        </Link>
        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/careers"
            className="px-4 py-2 border border-border text-xs font-semibold rounded-lg text-heading hover:bg-white transition-colors cursor-pointer"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Save className="w-3.5 h-3.5" />
            )}
            {isEdit ? "Update Job Opening" : "Publish Job Opening"}
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* 1. Basic Information */}
      <div className="bg-white p-6 rounded-xl border border-border space-y-4">
        <h3 className="text-sm font-bold text-heading uppercase tracking-wider flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-primary" />
          Role Basics
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="text-xs font-semibold text-heading block mb-1">
              Job Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Senior Full Stack Engineer (Next.js & TypeScript)"
              className="w-full text-xs p-2.5 rounded-lg border border-border focus:ring-1 focus:ring-primary focus:outline-none"
            />
          </div>

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
                  className={`text-[10px] px-2 py-0.5 rounded border transition-colors cursor-pointer ${
                    department === d
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

          <div>
            <label className="text-xs font-semibold text-heading block mb-1">
              Job Type
            </label>
            <select
              value={jobType}
              onChange={(e) => setJobType(e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-border focus:ring-1 focus:ring-primary focus:outline-none bg-white"
            >
              <option value="Full-Time">Full-Time</option>
              <option value="Part-Time">Part-Time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-heading block mb-1">
              Workplace Type
            </label>
            <select
              value={workplaceType}
              onChange={(e) => setWorkplaceType(e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-border focus:ring-1 focus:ring-primary focus:outline-none bg-white"
            >
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
              <option value="On-Site">On-Site</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="text-xs font-semibold text-heading block mb-1">
              Location
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Remote (Worldwide) or Remote (US/India)"
              className="w-full text-xs p-2.5 rounded-lg border border-border focus:ring-1 focus:ring-primary focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* 2. Compensation */}
      <div className="bg-white p-6 rounded-xl border border-border space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-heading uppercase tracking-wider flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-600" />
            Compensation
          </h3>
          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-heading">
            <input
              type="checkbox"
              checked={isSalaryDisclosed}
              onChange={(e) => setIsSalaryDisclosed(e.target.checked)}
              className="rounded border-border text-primary focus:ring-primary h-3.5 w-3.5"
            />
            Show Salary on Job Board
          </label>
        </div>

        {isSalaryDisclosed && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="text-xs font-semibold text-heading block mb-1">Currency</label>
              <select
                value={salaryCurrency}
                onChange={(e) => setSalaryCurrency(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-border focus:ring-1 focus:ring-primary focus:outline-none bg-white"
              >
                <option value="USD">USD ($)</option>
                <option value="INR">INR (₹)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-heading block mb-1">Minimum (Annual)</label>
              <input
                type="number"
                value={salaryMin}
                onChange={(e) => setSalaryMin(e.target.value)}
                placeholder="e.g. 80000"
                className="w-full text-xs p-2.5 rounded-lg border border-border focus:ring-1 focus:ring-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-heading block mb-1">Maximum (Annual)</label>
              <input
                type="number"
                value={salaryMax}
                onChange={(e) => setSalaryMax(e.target.value)}
                placeholder="e.g. 120000"
                className="w-full text-xs p-2.5 rounded-lg border border-border focus:ring-1 focus:ring-primary focus:outline-none"
              />
            </div>
          </div>
        )}
      </div>

      {/* 3. Description & Bullets */}
      <div className="bg-white p-6 rounded-xl border border-border space-y-6">
        <div>
          <label className="text-xs font-semibold text-heading block mb-1">
            Role Overview & Mission <span className="text-rose-500">*</span>
          </label>
          <textarea
            required
            rows={4}
            value={overview}
            onChange={(e) => setOverview(e.target.value)}
            placeholder="Describe what makes this position exciting, the team environment, and the products the engineer will build..."
            className="w-full text-xs p-3 rounded-lg border border-border focus:ring-1 focus:ring-primary focus:outline-none"
          />
        </div>

        {/* Responsibilities */}
        <div>
          <label className="text-xs font-semibold text-heading block mb-1">Key Responsibilities</label>
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
              placeholder="Add a key duty and press Enter or Click Add..."
              className="flex-1 text-xs p-2.5 rounded-lg border border-border focus:ring-1 focus:ring-primary focus:outline-none"
            />
            <button
              type="button"
              onClick={() => addTag(respInput, responsibilities, setResponsibilities, setRespInput)}
              className="px-3 py-2 bg-surface hover:bg-slate-200 border border-border text-heading text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
          <ul className="space-y-1.5">
            {responsibilities.map((r, i) => (
              <li key={i} className="flex items-center justify-between p-2 rounded-lg bg-surface border border-border text-xs text-body">
                <span>{r}</span>
                <button
                  type="button"
                  onClick={() => removeTag(i, responsibilities, setResponsibilities)}
                  className="p-1 text-muted hover:text-rose-600 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Requirements */}
        <div>
          <label className="text-xs font-semibold text-heading block mb-1">Requirements & Experience</label>
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
              placeholder="Add a required skill or qualification..."
              className="flex-1 text-xs p-2.5 rounded-lg border border-border focus:ring-1 focus:ring-primary focus:outline-none"
            />
            <button
              type="button"
              onClick={() => addTag(reqInput, requirements, setRequirements, setReqInput)}
              className="px-3 py-2 bg-surface hover:bg-slate-200 border border-border text-heading text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
          <ul className="space-y-1.5">
            {requirements.map((r, i) => (
              <li key={i} className="flex items-center justify-between p-2 rounded-lg bg-surface border border-border text-xs text-body">
                <span>{r}</span>
                <button
                  type="button"
                  onClick={() => removeTag(i, requirements, setRequirements)}
                  className="p-1 text-muted hover:text-rose-600 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Benefits */}
        <div>
          <label className="text-xs font-semibold text-heading block mb-1">Benefits & Perks</label>
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
              placeholder="Add a perk or benefit..."
              className="flex-1 text-xs p-2.5 rounded-lg border border-border focus:ring-1 focus:ring-primary focus:outline-none"
            />
            <button
              type="button"
              onClick={() => addTag(benefitInput, benefits, setBenefits, setBenefitInput)}
              className="px-3 py-2 bg-surface hover:bg-slate-200 border border-border text-heading text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
          <ul className="space-y-1.5">
            {benefits.map((b, i) => (
              <li key={i} className="flex items-center justify-between p-2 rounded-lg bg-surface border border-border text-xs text-body">
                <span>{b}</span>
                <button
                  type="button"
                  onClick={() => removeTag(i, benefits, setBenefits)}
                  className="p-1 text-muted hover:text-rose-600 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 4. Publishing & Visibility */}
      <div className="bg-white p-6 rounded-xl border border-border space-y-4">
        <h3 className="text-sm font-bold text-heading uppercase tracking-wider">
          Publishing & Deadlines
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-semibold text-heading block mb-1">Publication Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-border focus:ring-1 focus:ring-primary focus:outline-none bg-white font-medium"
            >
              <option value="published">Published (Live on Careers Page)</option>
              <option value="draft">Draft (Hidden)</option>
              <option value="closed">Closed (No longer accepting)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-heading block mb-1">Application Deadline</label>
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
              className="w-full text-xs p-2.5 rounded-lg border border-border focus:ring-1 focus:ring-primary focus:outline-none bg-white"
            />
          </div>

          <div className="md:col-span-3 pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-heading">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="rounded border-border text-primary focus:ring-primary h-3.5 w-3.5"
              />
              Mark as Featured Position (Highlighted at top of Careers page)
            </label>
          </div>
        </div>
      </div>
    </form>
  );
}
