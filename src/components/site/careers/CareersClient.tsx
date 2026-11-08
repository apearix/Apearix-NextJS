"use client";

import React, { useState, useMemo } from "react";
import {
  ArrowRight,
  Briefcase,
  MapPin,
  Clock,
  DollarSign,
  Search,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Share2,
} from "lucide-react";
import type { JobFormValues } from "@/schemas/career.schema";
import { ApplyJobModal } from "./ApplyJobModal";

export interface CareersClientProps {
  initialJobs: JobFormValues[];
  departments: string[];
}

export function CareersClient({ initialJobs, departments }: Readonly<CareersClientProps>) {
  const [selectedDept, setSelectedDept] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [workplaceFilter, setWorkplaceFilter] = useState<string>("All");
  const [expandedJobId, setExpandedJobId] = useState<string | null>(null);

  // Apply Modal state
  const [activeApplyJob, setActiveApplyJob] = useState<JobFormValues | null>(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  const filterTabs = useMemo(() => {
    return ["All", ...departments];
  }, [departments]);

  const filteredJobs = useMemo(() => {
    return initialJobs.filter((job) => {
      if (selectedDept !== "All" && job.department !== selectedDept) return false;
      if (workplaceFilter !== "All" && job.workplace_type !== workplaceFilter) return false;
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = (job.title || "").toLowerCase().includes(q);
        const matchDept = (job.department || "").toLowerCase().includes(q);
        const matchLoc = (job.location || "").toLowerCase().includes(q);
        const matchOverview = (job.overview || "").toLowerCase().includes(q);
        if (!matchTitle && !matchDept && !matchLoc && !matchOverview) return false;
      }
      return true;
    });
  }, [initialJobs, selectedDept, workplaceFilter, searchQuery]);

  const handleOpenApply = (job: JobFormValues) => {
    setActiveApplyJob(job);
    setIsApplyModalOpen(true);
  };

  const toggleExpand = (jobId?: string) => {
    if (!jobId) return;
    setExpandedJobId((prev) => (prev === jobId ? null : jobId));
  };

  return (
    <>
      {/* Search & Department Filters */}
      <div className="max-w-4xl mx-auto mb-10 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-5 h-5 text-[#9CA3AF] absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search open positions by role, keywords, or skills..."
            className="w-full h-13 pl-12 pr-4 rounded-xl border border-border bg-white text-sm text-heading placeholder:text-[#9CA3AF] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#6D28F5]/30 focus:border-[#6D28F5]"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex flex-wrap items-center gap-2">
            {filterTabs.map((dept) => {
              const isSelected = selectedDept === dept;
              return (
                <button
                  key={dept}
                  type="button"
                  onClick={() => setSelectedDept(dept)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${isSelected
                    ? "bg-[#6D28F5] text-white shadow-sm"
                    : "bg-white border border-border text-body hover:border-[#6D28F5]/50 hover:text-heading"
                    }`}
                >
                  {dept}
                </button>
              );
            })}
          </div>

          {/* Workplace Filter */}
          <div className="flex items-center gap-1 bg-white border border-border rounded-lg p-1 text-xs">
            {["All", "Remote", "Hybrid"].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setWorkplaceFilter(type)}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${workplaceFilter === type
                  ? "bg-primary-light text-[#6D28F5]"
                  : "text-muted hover:text-heading"
                  }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Jobs Listing */}
      <div className="space-y-4 max-w-4xl mx-auto">
        {filteredJobs.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-border space-y-3">
            <Briefcase className="w-10 h-10 text-[#9CA3AF] mx-auto opacity-60" />
            <h3 className="text-lg font-bold text-heading">No Open Positions Found</h3>
            <p className="text-sm text-body max-w-md mx-auto">
              We couldn&apos;t find any roles matching your current filters. Try selecting another department or check back soon!
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedDept("All");
                setWorkplaceFilter("All");
                setSearchQuery("");
              }}
              className="text-xs font-semibold text-[#6D28F5] hover:underline pt-2 cursor-pointer"
            >
              Reset all filters
            </button>
          </div>
        ) : (
          filteredJobs.map((job) => {
            const isExpanded = expandedJobId === job.id;
            return (
              <div
                key={job.id}
                className="rounded-2xl bg-white border border-border hover:border-border-accent shadow-sm transition-all overflow-hidden"
              >
                <div className="p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="px-2.5 py-0.5 bg-primary-light text-[#6D28F5] font-semibold text-xs rounded-full">
                        {job.department}
                      </span>
                      {job.is_featured && (
                        <span className="px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 font-semibold text-[11px] rounded-full flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-amber-500" />
                          Featured
                        </span>
                      )}
                      <span className="text-xs text-muted">
                        {job.job_type} • {job.workplace_type}
                      </span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-bold text-heading tracking-tight">
                      {job.title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-muted mt-2.5">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#9CA3AF]" />
                        {job.location}
                      </span>
                      {job.experience_level && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-[#9CA3AF]" />
                          {job.experience_level}
                        </span>
                      )}
                      {job.is_salary_disclosed && (job.salary_min || job.salary_max) && (
                        <span className="flex items-center gap-1 text-emerald-700 font-medium">
                          <DollarSign className="w-3.5 h-3.5" />
                          {job.salary_currency} {job.salary_min ? job.salary_min.toLocaleString() : "0"} - {job.salary_max ? job.salary_max.toLocaleString() : "Competitive"}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
                    <button
                      type="button"
                      onClick={() => toggleExpand(job.id)}
                      className="h-11 px-4 rounded-xl border border-border hover:bg-surface text-xs font-semibold text-body flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span>{isExpanded ? "Hide Details" : "Role Details"}</span>
                      {isExpanded ? (
                        <ChevronUp className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenApply(job)}
                      className="h-11 px-6 rounded-xl bg-[#6D28F5] hover:bg-[#5B21E6] text-white font-medium text-xs flex items-center justify-center gap-2 transition-colors flex-1 md:flex-initial cursor-pointer shadow-sm"
                    >
                      <span>Apply Now</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Collapsible Role Details Drawer */}
                {isExpanded && (
                  <div className="px-6 md:px-8 pb-8 pt-2 border-t border-[#F3F4F6] space-y-6 bg-surface/60">
                    {/* Overview */}
                    <div>
                      <h4 className="text-xs font-bold text-heading uppercase tracking-wider mb-2">
                        About This Role
                      </h4>
                      <p className="text-sm text-body leading-relaxed whitespace-pre-line">
                        {job.overview}
                      </p>
                    </div>

                    {/* Responsibilities */}
                    {job.responsibilities && job.responsibilities.length > 0 && (
                      <div>
                        <h4 className="text-xs font-bold text-heading uppercase tracking-wider mb-2">
                          What You Will Do
                        </h4>
                        <ul className="space-y-2">
                          {job.responsibilities.map((resp, i) => (
                            <li key={i} className="flex items-start gap-2.5 text-xs text-body">
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#6D28F5] shrink-0 mt-0.5" />
                              <span>{resp}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Requirements */}
                    {job.requirements && job.requirements.length > 0 && (
                      <div>
                        <h4 className="text-xs font-bold text-heading uppercase tracking-wider mb-2">
                          What We Look For
                        </h4>
                        <ul className="space-y-2">
                          {job.requirements.map((req, i) => (
                            <li key={i} className="flex items-start gap-2.5 text-xs text-body">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                              <span>{req}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Benefits */}
                    {job.benefits && job.benefits.length > 0 && (
                      <div>
                        <h4 className="text-xs font-bold text-heading uppercase tracking-wider mb-2">
                          Perks & Benefits
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {job.benefits.map((b, i) => (
                            <span
                              key={i}
                              className="px-3 py-1 bg-white border border-border rounded-full text-xs text-body font-medium"
                            >
                              {b}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Apply Footer */}
                    <div className="pt-4 flex items-center justify-between">
                      <p className="text-xs text-muted">
                        Interested in joining our mission? We review applications within 48 hours.
                      </p>
                      <button
                        type="button"
                        onClick={() => handleOpenApply(job)}
                        className="h-10 px-5 rounded-lg bg-[#6D28F5] hover:bg-[#5B21E6] text-white font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <span>Apply For Position</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Apply Modal */}
      <ApplyJobModal
        job={activeApplyJob}
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
      />
    </>
  );
}
