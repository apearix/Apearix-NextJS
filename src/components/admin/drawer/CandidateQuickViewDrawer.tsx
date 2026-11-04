"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FileText,
  Mail,
  Phone,
  Globe,
  Clock,
  DollarSign,
  Star,
  ExternalLink,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { QuickViewDrawer } from "@/components/admin/common/QuickViewDrawer";
import type { ApplicationItem } from "@/schemas/career.schema";
import { formatDateTimeInTimezone } from "@/lib/timezone";
import { updateStatus, updateNotes } from "@/lib/services/admin/career-applications";

export interface CandidateQuickViewDrawerProps {
  application: ApplicationItem | null;
  onClose: () => void;
  onApplicationUpdated: (updated: ApplicationItem) => void;
  onDeleteRequested?: (id: string) => void;
}

const STATUS_OPTIONS: { value: ApplicationItem["status"]; label: string; color: string }[] = [
  { value: "applied", label: "Applied", color: "bg-blue-50 text-blue-700 border-blue-200" },
  { value: "reviewing", label: "Reviewing", color: "bg-amber-50 text-amber-700 border-amber-200" },
  { value: "shortlisted", label: "Shortlisted", color: "bg-purple-50 text-purple-700 border-purple-200" },
  { value: "interviewing", label: "Interviewing", color: "bg-indigo-50 text-indigo-700 border-indigo-200" },
  { value: "offered", label: "Offered", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  { value: "hired", label: "Hired", color: "bg-emerald-600 text-white border-emerald-600" },
  { value: "rejected", label: "Rejected", color: "bg-rose-50 text-rose-700 border-rose-200" },
];

export function CandidateQuickViewDrawer({
  application,
  onClose,
  onApplicationUpdated,
  onDeleteRequested,
}: Readonly<CandidateQuickViewDrawerProps>) {
  const [cachedApp, setCachedApp] = useState<ApplicationItem | null>(application);
  const [currentStatus, setCurrentStatus] = useState<ApplicationItem["status"]>("applied");
  const [rating, setRating] = useState<number>(0);
  const [adminNotes, setAdminNotes] = useState<string>("");
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [notesSavedSuccess, setNotesSavedSuccess] = useState(false);

  useEffect(() => {
    if (application) {
      setCachedApp(application);
      setCurrentStatus(application.status);
      setRating(application.rating || 0);
      setAdminNotes(application.admin_notes || "");
      setNotesSavedSuccess(false);
    }
  }, [application]);

  const activeApp = application || cachedApp;

  const handleStatusChange = async (newStatus: ApplicationItem["status"]) => {
    if (!activeApp || newStatus === currentStatus) return;
    setIsUpdatingStatus(true);
    try {
      await updateStatus(activeApp.id, newStatus);
      setCurrentStatus(newStatus);
      const updated: ApplicationItem = { ...activeApp, status: newStatus };
      setCachedApp(updated);
      onApplicationUpdated(updated);
    } catch (err) {
      console.error("Failed to update status", err);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleSaveNotes = async () => {
    if (!activeApp) return;
    setIsSavingNotes(true);
    try {
      await updateNotes(activeApp.id, { admin_notes: adminNotes, rating });
      const updated: ApplicationItem = { ...activeApp, admin_notes: adminNotes, rating };
      setCachedApp(updated);
      onApplicationUpdated(updated);
      setNotesSavedSuccess(true);
      setTimeout(() => setNotesSavedSuccess(false), 2500);
    } catch (err) {
      console.error("Failed to save notes", err);
    } finally {
      setIsSavingNotes(false);
    }
  };

  const statusBadge = STATUS_OPTIONS.find((s) => s.value === currentStatus) || STATUS_OPTIONS[0];

  return (
    <QuickViewDrawer
      isOpen={Boolean(application)}
      onClose={onClose}
      headerContent={
        activeApp ? (
          <div className="flex items-center gap-2 truncate">
            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border uppercase shrink-0 ${statusBadge.color}`}>
              {statusBadge.label}
            </span>
            <span className="text-xs text-muted truncate">
              Applied for: <strong className="text-heading font-medium">{activeApp.job?.title || "Role"}</strong>
            </span>
          </div>
        ) : null
      }
      footerActions={
        activeApp ? (
          <div className="flex items-center justify-between w-full">
            {onDeleteRequested && (
              <button
                type="button"
                onClick={() => onDeleteRequested(activeApp.id)}
                className="px-3 py-2 text-rose-600 hover:bg-rose-50 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete
              </button>
            )}
            <div className="flex items-center gap-2 ml-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-border text-xs font-semibold rounded-lg text-heading hover:bg-white transition-colors cursor-pointer"
              >
                Close
              </button>
              <a
                href={activeApp.resume_url}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" />
                View Resume
                <ExternalLink className="w-3 h-3 ml-0.5" />
              </a>
            </div>
          </div>
        ) : null
      }
    >
      {activeApp ? (
        <div className="space-y-6">
          {/* Candidate Profile Header */}
          <div className="p-4 bg-surface rounded-xl border border-border">
            <h3 className="text-xl font-bold text-heading">
              {activeApp.first_name} {activeApp.last_name}
            </h3>
            <p className="text-xs text-muted mt-0.5">
              Applied on {formatDateTimeInTimezone(activeApp.created_at || "")}
            </p>

            {/* Quick Contacts */}
            <div className="mt-3.5 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-body">
                <Mail className="w-3.5 h-3.5 text-primary shrink-0" />
                <a href={`mailto:${activeApp.email}`} className="hover:underline text-primary">
                  {activeApp.email}
                </a>
              </div>
              {activeApp.phone && (
                <div className="flex items-center gap-2 text-body">
                  <Phone className="w-3.5 h-3.5 text-muted shrink-0" />
                  <a href={`tel:${activeApp.phone}`} className="hover:underline">
                    {activeApp.phone}
                  </a>
                </div>
              )}
            </div>

            {/* Social / Portfolio Links */}
            <div className="mt-4 flex flex-wrap gap-2 pt-3 border-t border-border/60">
              {activeApp.linkedin_url && (
                <a
                  href={activeApp.linkedin_url}
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1 rounded-md bg-white border border-border text-xs text-[#0A66C2] font-medium flex items-center gap-1 hover:bg-slate-50 transition-colors"
                >
                  <Globe className="w-3.5 h-3.5" />
                  LinkedIn
                  <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                </a>
              )}
              {activeApp.github_url && (
                <a
                  href={activeApp.github_url}
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1 rounded-md bg-white border border-border text-xs text-[#24292F] font-medium flex items-center gap-1 hover:bg-slate-50 transition-colors"
                >
                  <Globe className="w-3.5 h-3.5" />
                  GitHub
                  <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                </a>
              )}
              {activeApp.portfolio_url && (
                <a
                  href={activeApp.portfolio_url}
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1 rounded-md bg-white border border-border text-xs text-primary font-medium flex items-center gap-1 hover:bg-purple-50 transition-colors"
                >
                  <Globe className="w-3.5 h-3.5" />
                  Portfolio
                  <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                </a>
              )}
              <a
                href={activeApp.resume_url}
                target="_blank"
                rel="noreferrer"
                className="px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-semibold flex items-center gap-1 hover:bg-emerald-100 transition-colors ml-auto"
              >
                <FileText className="w-3.5 h-3.5 text-emerald-600" />
                {activeApp.resume_filename || "Open Resume"}
              </a>
            </div>
          </div>

          {/* Hiring Stage Pipeline Changer */}
          <div>
            <label className="text-xs font-bold text-heading uppercase tracking-wider block mb-2">
              Hiring Pipeline Stage
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {STATUS_OPTIONS.map((opt) => {
                const isActive = currentStatus === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    disabled={isUpdatingStatus}
                    onClick={() => handleStatusChange(opt.value)}
                    className={`px-2.5 py-2 rounded-lg text-xs font-semibold text-center border transition-all cursor-pointer ${
                      isActive
                        ? `${opt.color} ring-2 ring-primary/20 shadow-sm`
                        : "bg-white border-border text-body hover:bg-surface"
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Key Candidate Metrics */}
          <div className="grid grid-cols-3 gap-2 p-3 bg-surface rounded-xl border border-border text-xs">
            <div>
              <p className="text-[10px] text-muted uppercase font-semibold">Notice Period</p>
              <p className="font-bold text-heading mt-0.5">{activeApp.notice_period || "Not Disclosed"}</p>
            </div>
            <div>
              <p className="text-[10px] text-muted uppercase font-semibold">Current CTC</p>
              <p className="font-bold text-heading mt-0.5">{activeApp.current_ctc || "N/A"}</p>
            </div>
            <div>
              <p className="text-[10px] text-muted uppercase font-semibold">Expected CTC</p>
              <p className="font-bold text-heading mt-0.5">{activeApp.expected_ctc || "N/A"}</p>
            </div>
          </div>

          {/* Cover Letter / Introduction */}
          <div>
            <h4 className="text-xs font-bold text-heading uppercase tracking-wider mb-2">Cover Letter / Note</h4>
            <div className="text-xs text-body leading-relaxed bg-white p-3.5 rounded-lg border border-border/60 whitespace-pre-line min-h-[70px]">
              {activeApp.cover_letter || (
                <span className="text-muted italic">No cover letter was submitted with this application.</span>
              )}
            </div>
          </div>

          {/* Recruiter Rating & Internal Notes */}
          <div className="p-4 bg-purple-50/40 rounded-xl border border-purple-100/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-900 uppercase tracking-wider">Candidate Score</span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 text-slate-300 hover:text-amber-400 focus:outline-none transition-colors"
                  >
                    <Star
                      className={`w-4 h-4 ${
                        star <= rating ? "text-amber-400 fill-amber-400" : ""
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-purple-950 block mb-1">
                Interviewer & Recruiter Notes
              </label>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Write private notes on technical assessment, culture fit, or salary negotiation..."
                rows={3}
                className="w-full text-xs p-2.5 rounded-lg border border-purple-200 bg-white text-heading placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              {notesSavedSuccess ? (
                <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Notes saved!
                </span>
              ) : <span />}

              <button
                type="button"
                disabled={isSavingNotes}
                onClick={handleSaveNotes}
                className="px-3 py-1.5 bg-primary hover:bg-primary-hover text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isSavingNotes && <Loader2 className="w-3 h-3 animate-spin" />}
                Save Notes
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </QuickViewDrawer>
  );
}
