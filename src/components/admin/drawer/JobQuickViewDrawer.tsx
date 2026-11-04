"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Briefcase, Edit3, MapPin, Users, Calendar, DollarSign, CheckCircle2 } from "lucide-react";
import { QuickViewDrawer } from "@/components/admin/common/QuickViewDrawer";
import type { JobFormValues } from "@/schemas/career.schema";
import { formatDateTimeInTimezone } from "@/lib/timezone";

export interface JobQuickViewDrawerProps {
  job: JobFormValues | null;
  onClose: () => void;
}

export function JobQuickViewDrawer({ job, onClose }: Readonly<JobQuickViewDrawerProps>) {
  const [cachedJob, setCachedJob] = useState<JobFormValues | null>(job);

  useEffect(() => {
    if (job) {
      setCachedJob(job);
    }
  }, [job]);

  const activeJob = job || cachedJob;

  return (
    <QuickViewDrawer
      isOpen={Boolean(job)}
      onClose={onClose}
      headerContent={
        activeJob ? (
          <div className="flex items-center gap-2 truncate">
            {activeJob.status === "published" ? (
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase shrink-0">
                Published
              </span>
            ) : activeJob.status === "draft" ? (
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 uppercase shrink-0">
                Draft
              </span>
            ) : (
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 uppercase shrink-0">
                Closed
              </span>
            )}
            <span className="text-xs text-muted font-mono truncate">
              {activeJob.department}
            </span>
          </div>
        ) : null
      }
      footerActions={
        activeJob ? (
          <>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-border text-xs font-semibold rounded-lg text-heading hover:bg-white transition-colors cursor-pointer"
            >
              Close
            </button>
            <Link
              href={`/admin/careers/applications?jobId=${activeJob.id}`}
              className="px-4 py-2 border border-primary/20 text-primary text-xs font-semibold rounded-lg hover:bg-primary/5 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Users className="w-3.5 h-3.5" />
              View Applicants ({activeJob.applicant_count || 0})
            </Link>
            <Link
              href={`/admin/careers/${activeJob.id}/edit`}
              className="px-4 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              Edit Role
            </Link>
          </>
        ) : null
      }
    >
      {activeJob ? (
        <div className="space-y-6">
          {/* Header Title */}
          <div>
            <h2 className="text-lg font-bold text-heading leading-tight mb-2">
              {activeJob.title}
            </h2>
            <div className="flex flex-wrap items-center gap-3 text-xs text-muted">
              <span className="flex items-center gap-1">
                <Briefcase className="w-3.5 h-3.5 text-primary" />
                {activeJob.job_type} • {activeJob.workplace_type}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-muted" />
                {activeJob.location}
              </span>
              {activeJob.experience_level && (
                <span className="bg-surface px-2 py-0.5 rounded border border-border font-medium">
                  {activeJob.experience_level}
                </span>
              )}
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-3 p-3 bg-surface rounded-xl border border-border">
            <div>
              <p className="text-[11px] text-muted uppercase font-semibold">Total Applicants</p>
              <p className="text-lg font-bold text-heading mt-0.5">{activeJob.applicant_count || 0}</p>
            </div>
            <div>
              <p className="text-[11px] text-muted uppercase font-semibold">Page Views</p>
              <p className="text-lg font-bold text-heading mt-0.5">{activeJob.views_count || 0}</p>
            </div>
          </div>

          {/* Compensation */}
          {activeJob.is_salary_disclosed && (activeJob.salary_min || activeJob.salary_max) && (
            <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              <div className="text-xs">
                <span className="font-semibold text-emerald-900">Compensation: </span>
                <span className="text-emerald-800">
                  {activeJob.salary_currency} {activeJob.salary_min ? activeJob.salary_min.toLocaleString() : "0"} - {activeJob.salary_max ? activeJob.salary_max.toLocaleString() : "Competitive"}
                </span>
              </div>
            </div>
          )}

          {/* Overview */}
          <div>
            <h4 className="text-xs font-bold text-heading uppercase tracking-wider mb-2">Role Overview</h4>
            <div className="text-sm text-body leading-relaxed bg-white p-3.5 rounded-lg border border-border/60 whitespace-pre-line">
              {activeJob.overview}
            </div>
          </div>

          {/* Responsibilities */}
          {activeJob.responsibilities && activeJob.responsibilities.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-heading uppercase tracking-wider mb-2">Key Responsibilities</h4>
              <ul className="space-y-1.5 text-xs text-body">
                {activeJob.responsibilities.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Requirements */}
          {activeJob.requirements && activeJob.requirements.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-heading uppercase tracking-wider mb-2">Requirements & Skills</h4>
              <ul className="space-y-1.5 text-xs text-body">
                {activeJob.requirements.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Benefits */}
          {activeJob.benefits && activeJob.benefits.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-heading uppercase tracking-wider mb-2">Perks & Benefits</h4>
              <div className="flex flex-wrap gap-1.5">
                {activeJob.benefits.map((item, idx) => (
                  <span key={idx} className="px-2.5 py-1 bg-surface border border-border text-xs rounded-full text-heading font-medium">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Meta Info */}
          <div className="pt-4 border-t border-border/80 space-y-1 text-[11px] text-muted">
            <p>Slug: <span className="font-mono text-heading">/careers/{activeJob.slug}</span></p>
            {activeJob.deadline && (
              <p>Deadline: {formatDateTimeInTimezone(activeJob.deadline)}</p>
            )}
            {activeJob.created_at && (
              <p>Created: {formatDateTimeInTimezone(activeJob.created_at)}</p>
            )}
          </div>
        </div>
      ) : null}
    </QuickViewDrawer>
  );
}
