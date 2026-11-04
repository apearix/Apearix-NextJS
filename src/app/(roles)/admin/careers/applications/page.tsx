"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Users,
  Briefcase,
  Search,
  Filter,
  FileText,
  ExternalLink,
  Star,
  CheckCircle,
  XCircle,
  Trash2,
  Eye,
  Loader2,
  Calendar,
  Mail,
  Phone,
  ArrowLeft,
} from "lucide-react";
import { PageHeader } from "@/components/admin/common/PageHeader";
import { TablePagination } from "@/components/admin/common/TablePagination";
import { CandidateQuickViewDrawer } from "@/components/admin/drawer/CandidateQuickViewDrawer";
import { formatDateInTimezone } from "@/lib/timezone";
import type { ApplicationItem, JobFormValues } from "@/schemas/career.schema";
import {
  index as fetchApplicationsApi,
  destroy as deleteApplicationApi,
  updateStatus as updateStatusApi,
  getStats as fetchStatsApi,
} from "@/lib/services/admin/career-applications";
import { index as fetchJobsApi } from "@/lib/services/admin/careers";

const STATUS_BADGES: Record<
  ApplicationItem["status"],
  { label: string; color: string }
> = {
  applied: { label: "Applied", color: "bg-blue-50 text-blue-700 border-blue-200" },
  reviewing: { label: "Reviewing", color: "bg-amber-50 text-amber-700 border-amber-200" },
  shortlisted: { label: "Shortlisted", color: "bg-purple-50 text-purple-700 border-purple-200" },
  interviewing: { label: "Interviewing", color: "bg-indigo-50 text-indigo-700 border-indigo-200" },
  offered: { label: "Offered", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  hired: { label: "Hired", color: "bg-emerald-600 text-white border-emerald-600" },
  rejected: { label: "Rejected", color: "bg-rose-50 text-rose-700 border-rose-200" },
};

export default function CareerApplicationsPage() {
  const searchParams = useSearchParams();
  const initialJobId = searchParams.get("jobId") || "all";

  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [jobs, setJobs] = useState<JobFormValues[]>([]);
  const [stats, setStats] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [jobFilter, setJobFilter] = useState<string>(initialJobId);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // Quick view drawer
  const [drawerApp, setDrawerApp] = useState<ApplicationItem | null>(null);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const showToast = useCallback((text: string, type: "success" | "error" = "success") => {
    setToastMessage({ type, text });
    setTimeout(() => setToastMessage(null), 3000);
  }, []);

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [appsData, jobsData, statsData] = await Promise.all([
        fetchApplicationsApi(),
        fetchJobsApi(),
        fetchStatsApi(),
      ]);
      setApplications(appsData.items || []);
      setJobs(jobsData.items || []);
      setStats(statsData || {});
    } catch (err) {
      console.error("Failed to load applications", err);
      showToast("Applications load karne mein samasya aayi", "error");
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Sync if jobId query param changes
  useEffect(() => {
    const qJobId = searchParams.get("jobId");
    if (qJobId) {
      setJobFilter(qJobId);
    }
  }, [searchParams]);

  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      if (statusFilter !== "all" && app.status !== statusFilter) return false;
      if (jobFilter !== "all" && app.job_id !== jobFilter) return false;
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase().trim();
        const fullName = `${app.first_name} ${app.last_name}`.toLowerCase();
        const matchName = fullName.includes(q);
        const matchEmail = (app.email || "").toLowerCase().includes(q);
        const matchPhone = (app.phone || "").toLowerCase().includes(q);
        const matchJob = (app.job?.title || "").toLowerCase().includes(q);
        if (!matchName && !matchEmail && !matchPhone && !matchJob) return false;
      }
      return true;
    });
  }, [applications, statusFilter, jobFilter, searchQuery]);

  const totalItems = filteredApplications.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const validCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (validCurrentPage - 1) * pageSize;
  const paginatedApps = filteredApplications.slice(startIndex, startIndex + pageSize);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Kya aap sach me is candidate application ko delete karna chahte hain?")) return;
    try {
      await deleteApplicationApi(id);
      setApplications((prev) => prev.filter((a) => a.id !== id));
      if (drawerApp?.id === id) setDrawerApp(null);
      showToast("Application delete ho gayi");
    } catch (err) {
      console.error(err);
      showToast("Delete karne mein samasya aayi", "error");
    }
  };

  const handleQuickStatusChange = async (
    id: string,
    newStatus: ApplicationItem["status"]
  ) => {
    try {
      await updateStatusApi(id, newStatus);
      setApplications((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
      );
      showToast(`Status updated to ${newStatus}`);
    } catch (err) {
      console.error(err);
      showToast("Status update fail ho gaya", "error");
    }
  };

  const handleApplicationUpdated = (updated: ApplicationItem) => {
    setApplications((prev) =>
      prev.map((a) => (a.id === updated.id ? updated : a))
    );
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div
          className={`fixed bottom-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg border text-sm font-medium transition-all ${
            toastMessage.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-rose-50 text-rose-800 border-rose-200"
          }`}
        >
          {toastMessage.type === "success" ? (
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Page Header */}
      <PageHeader
        title="Job Applicants & Talent Pipeline"
        subtitle="Review submitted candidate CVs, schedule interviews, and manage hiring stages"
        btn={
          <Link
            href="/admin/careers"
            className="px-4 py-2 border border-border text-heading bg-white hover:bg-surface text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Manage Job Roles</span>
          </Link>
        }
      />

      {/* Pipeline Stages Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {[
          { key: "applied", label: "Applied", count: stats.applied || 0, color: "border-blue-200 bg-blue-50/50 text-blue-900" },
          { key: "reviewing", label: "Reviewing", count: stats.reviewing || 0, color: "border-amber-200 bg-amber-50/50 text-amber-900" },
          { key: "shortlisted", label: "Shortlisted", count: stats.shortlisted || 0, color: "border-purple-200 bg-purple-50/50 text-purple-900" },
          { key: "interviewing", label: "Interviewing", count: stats.interviewing || 0, color: "border-indigo-200 bg-indigo-50/50 text-indigo-900" },
          { key: "offered", label: "Offered", count: stats.offered || 0, color: "border-emerald-200 bg-emerald-50/50 text-emerald-900" },
          { key: "hired", label: "Hired", count: stats.hired || 0, color: "border-emerald-400 bg-emerald-100/70 text-emerald-950 font-bold" },
          { key: "rejected", label: "Rejected", count: stats.rejected || 0, color: "border-rose-200 bg-rose-50/50 text-rose-900" },
        ].map((stage) => {
          const isSelected = statusFilter === stage.key;
          return (
            <button
              key={stage.key}
              type="button"
              onClick={() => setStatusFilter(isSelected ? "all" : stage.key)}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                isSelected ? "ring-2 ring-primary shadow-sm" : "hover:border-primary/40"
              } ${stage.color}`}
            >
              <p className="text-[10px] uppercase font-semibold opacity-75">{stage.label}</p>
              <p className="text-xl font-bold mt-0.5">{stage.count}</p>
            </button>
          );
        })}
      </div>

      {/* Filter Row */}
      <div className="bg-white p-4 rounded-xl border border-border flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by candidate name, email, phone, or job title..."
            className="w-full text-xs pl-9 pr-3 py-2 rounded-lg border border-border focus:ring-1 focus:ring-primary focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          {/* Job Filter */}
          <select
            value={jobFilter}
            onChange={(e) => setJobFilter(e.target.value)}
            className="text-xs py-2 px-3 rounded-lg border border-border focus:ring-1 focus:ring-primary focus:outline-none bg-white font-medium max-w-[220px]"
          >
            <option value="all">All Job Openings</option>
            {jobs.map((j) => (
              <option key={j.id} value={j.id}>
                {j.title}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs py-2 px-3 rounded-lg border border-border focus:ring-1 focus:ring-primary focus:outline-none bg-white font-medium"
          >
            <option value="all">All Stages</option>
            <option value="applied">Applied</option>
            <option value="reviewing">Reviewing</option>
            <option value="shortlisted">Shortlisted</option>
            <option value="interviewing">Interviewing</option>
            <option value="offered">Offered</option>
            <option value="hired">Hired</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-xl border border-border overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-surface border-b border-border text-muted uppercase font-semibold">
                <th className="py-3.5 px-4">Candidate</th>
                <th className="py-3.5 px-4">Applied Role</th>
                <th className="py-3.5 px-4">Resume</th>
                <th className="py-3.5 px-4">Pipeline Stage</th>
                <th className="py-3.5 px-4">Score</th>
                <th className="py-3.5 px-4">Applied Date</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-muted">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Loader2 className="w-6 h-6 animate-spin text-primary" />
                      <span>Loading candidate pipeline...</span>
                    </div>
                  </td>
                </tr>
              ) : paginatedApps.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-muted">
                    <div className="max-w-xs mx-auto space-y-2">
                      <Users className="w-8 h-8 text-muted mx-auto opacity-50" />
                      <p className="font-semibold text-heading text-sm">No applications found</p>
                      <p className="text-xs">Candidate applications will appear here as soon as applicants apply on the careers page.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedApps.map((app) => {
                  const badge = STATUS_BADGES[app.status] || STATUS_BADGES.applied;
                  return (
                    <tr key={app.id} className="hover:bg-surface/50 transition-colors">
                      {/* Candidate Name & Contact */}
                      <td className="py-3 px-4">
                        <button
                          type="button"
                          onClick={() => setDrawerApp(app)}
                          className="font-semibold text-heading hover:text-primary transition-colors text-left block"
                        >
                          {app.first_name} {app.last_name}
                        </button>
                        <div className="text-[11px] text-muted flex items-center gap-1.5 mt-0.5">
                          <Mail className="w-3 h-3 text-muted" />
                          <span>{app.email}</span>
                        </div>
                      </td>

                      {/* Job Title */}
                      <td className="py-3 px-4 max-w-xs">
                        <div className="font-medium text-heading truncate">
                          {app.job?.title || "Role"}
                        </div>
                        <div className="text-[11px] text-muted">
                          {app.job?.department || "General"}
                        </div>
                      </td>

                      {/* Resume Link */}
                      <td className="py-3 px-4">
                        <a
                          href={app.resume_url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 font-semibold text-[11px] transition-colors"
                        >
                          <FileText className="w-3.5 h-3.5 text-emerald-600" />
                          <span>CV</span>
                          <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                        </a>
                      </td>

                      {/* Stage Selector */}
                      <td className="py-3 px-4">
                        <select
                          value={app.status}
                          onChange={(e) =>
                            handleQuickStatusChange(
                              app.id,
                              e.target.value as ApplicationItem["status"]
                            )
                          }
                          className={`text-[11px] font-semibold py-1 px-2 rounded-lg border focus:outline-none cursor-pointer ${badge.color}`}
                        >
                          <option value="applied">Applied</option>
                          <option value="reviewing">Reviewing</option>
                          <option value="shortlisted">Shortlisted</option>
                          <option value="interviewing">Interviewing</option>
                          <option value="offered">Offered</option>
                          <option value="hired">Hired</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </td>

                      {/* Rating */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-0.5 text-amber-400">
                          {app.rating > 0 ? (
                            <>
                              <Star className="w-3.5 h-3.5 fill-amber-400" />
                              <span className="text-xs font-bold text-heading ml-1">
                                {app.rating}.0
                              </span>
                            </>
                          ) : (
                            <span className="text-muted text-[11px]">—</span>
                          )}
                        </div>
                      </td>

                      {/* Applied Date */}
                      <td className="py-3 px-4 text-muted text-[11px]">
                        {app.created_at ? formatDateInTimezone(app.created_at) : "—"}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => setDrawerApp(app)}
                            className="p-1.5 text-muted hover:text-heading hover:bg-surface rounded-lg transition-colors cursor-pointer"
                            title="Review Application"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(app.id)}
                            className="p-1.5 text-muted hover:text-rose-600 hover:bg-surface rounded-lg transition-colors cursor-pointer"
                            title="Delete Application"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <TablePagination
          currentPage={validCurrentPage}
          pageSize={pageSize}
          totalItems={totalItems}
          onPageChange={setCurrentPage}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setCurrentPage(1);
          }}
        />
      </div>

      {/* Candidate Quick View Drawer */}
      <CandidateQuickViewDrawer
        application={drawerApp}
        onClose={() => setDrawerApp(null)}
        onApplicationUpdated={handleApplicationUpdated}
        onDeleteRequested={handleDelete}
      />
    </div>
  );
}
