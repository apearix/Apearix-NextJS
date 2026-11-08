"use client";

import React, { useState, useMemo, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Users,
  Briefcase,
  FileText,
  ExternalLink,
  Star,
  CheckCircle,
  XCircle,
  Trash2,
  Eye,
  Loader2,
  Mail,
  Phone,
  Clock,
  Award,
  X,
} from "lucide-react";
import { PageHeader } from "@/components/admin/common/PageHeader";
import { TablePagination } from "@/components/admin/common/TablePagination";
import { TableToolbar } from "@/components/admin/common/TableToolbar";
import { ActionMenu } from "@/components/admin/common/ActionMenu";
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

const STATUS_CONFIG: Record<
  ApplicationItem["status"],
  { label: string; bg: string; dot: string; text: string; border: string }
> = {
  applied: {
    label: "Applied",
    bg: "bg-blue-50",
    dot: "bg-blue-500",
    text: "text-blue-700",
    border: "border-blue-200",
  },
  reviewing: {
    label: "Reviewing",
    bg: "bg-amber-50",
    dot: "bg-amber-500",
    text: "text-amber-700",
    border: "border-amber-200",
  },
  shortlisted: {
    label: "Shortlisted",
    bg: "bg-purple-50",
    dot: "bg-purple-500",
    text: "text-purple-700",
    border: "border-purple-200",
  },
  interviewing: {
    label: "Interviewing",
    bg: "bg-indigo-50",
    dot: "bg-indigo-500",
    text: "text-indigo-700",
    border: "border-indigo-200",
  },
  offered: {
    label: "Offered",
    bg: "bg-emerald-50",
    dot: "bg-emerald-500",
    text: "text-emerald-700",
    border: "border-emerald-200",
  },
  hired: {
    label: "Hired",
    bg: "bg-emerald-600",
    dot: "bg-white",
    text: "text-white",
    border: "border-emerald-600",
  },
  rejected: {
    label: "Rejected",
    bg: "bg-rose-50",
    dot: "bg-rose-500",
    text: "text-rose-700",
    border: "border-rose-200",
  },
};

export default function CareerApplicationsPage() {
  const searchParams = useSearchParams();
  const initialJobId = searchParams.get("jobId") || "all";

  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [jobs, setJobs] = useState<JobFormValues[]>([]);
  const [stats, setStats] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [jobFilter, setJobFilter] = useState<string>(initialJobId);
  const [sortFilter, setSortFilter] = useState<string>("newest");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // Quick view drawer
  const [drawerApp, setDrawerApp] = useState<ApplicationItem | null>(null);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  }, []);

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [appsData, jobsData, statsData] = await Promise.all([
        fetchApplicationsApi(),
        fetchJobsApi(),
        fetchStatsApi().catch(() => ({})),
      ]);
      setApplications(appsData.items || []);
      setJobs(jobsData.items || []);
      setStats(statsData || {});
    } catch (err) {
      console.error("Failed to load applications:", err);
      showToast("Failed to load candidate applications.");
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
      setCurrentPage(1);
    }
  }, [searchParams]);

  const filteredApplications = useMemo(() => {
    return applications
      .filter((app) => {
        if (statusFilter !== "all" && app.status !== statusFilter) return false;
        if (jobFilter !== "all" && app.job_id !== jobFilter) return false;
        if (searchQuery.trim() !== "") {
          const q = searchQuery.toLowerCase().trim();
          const fullName = `${app.first_name || ""} ${app.last_name || ""}`.toLowerCase();
          const matchName = fullName.includes(q);
          const matchEmail = (app.email || "").toLowerCase().includes(q);
          const matchPhone = (app.phone || "").toLowerCase().includes(q);
          const matchJob = (app.job?.title || "").toLowerCase().includes(q);
          if (!matchName && !matchEmail && !matchPhone && !matchJob) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortFilter === "newest") {
          return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
        }
        if (sortFilter === "oldest") {
          return new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime();
        }
        if (sortFilter === "rating_desc") {
          return (b.rating || 0) - (a.rating || 0);
        }
        if (sortFilter === "name_asc") {
          const nameA = `${a.first_name || ""} ${a.last_name || ""}`.trim();
          const nameB = `${b.first_name || ""} ${b.last_name || ""}`.trim();
          return nameA.localeCompare(nameB);
        }
        return 0;
      });
  }, [applications, statusFilter, jobFilter, searchQuery, sortFilter]);

  const totalItems = filteredApplications.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const validCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (validCurrentPage - 1) * pageSize;
  const paginatedApps = filteredApplications.slice(startIndex, startIndex + pageSize);

  const allFilteredSelected =
    paginatedApps.length > 0 && paginatedApps.every((a) => selectedIds.has(a.id));
  const isIndeterminate =
    paginatedApps.some((a) => selectedIds.has(a.id)) && !allFilteredSelected;

  const toggleSelectAll = (checked: boolean) => {
    const next = new Set(selectedIds);
    if (checked) paginatedApps.forEach((a) => next.add(a.id));
    else paginatedApps.forEach((a) => next.delete(a.id));
    setSelectedIds(next);
  };

  const toggleSelectOne = (id: string, checked: boolean) => {
    const next = new Set(selectedIds);
    if (checked) next.add(id);
    else next.delete(id);
    setSelectedIds(next);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this candidate application?")) return;
    try {
      await deleteApplicationApi(id);
      setApplications((prev) => prev.filter((a) => a.id !== id));
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      if (drawerApp?.id === id) setDrawerApp(null);
      showToast("Candidate application deleted");
    } catch (err: unknown) {
      console.error(err);
      const msg = err instanceof Error ? err.message : "Failed to delete candidate application";
      showToast(msg);
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
      if (drawerApp?.id === id) {
        setDrawerApp((prev) => (prev ? { ...prev, status: newStatus } : null));
      }
      showToast(`Applicant stage moved to ${STATUS_CONFIG[newStatus]?.label || newStatus}`);
    } catch (err: unknown) {
      console.error(err);
      const msg = err instanceof Error ? err.message : "Failed to update application status";
      showToast(msg);
    }
  };

  const handleBulkStatusChange = async (newStatus: ApplicationItem["status"]) => {
    if (selectedIds.size === 0) return;
    try {
      const ids = Array.from(selectedIds);
      await Promise.all(ids.map((id) => updateStatusApi(id, newStatus)));
      setApplications((prev) =>
        prev.map((a) => (selectedIds.has(a.id) ? { ...a, status: newStatus } : a))
      );
      showToast(`Moved ${ids.length} candidates to ${STATUS_CONFIG[newStatus]?.label || newStatus}`);
      setSelectedIds(new Set());
    } catch (err: unknown) {
      console.error(err);
      const msg = err instanceof Error ? err.message : "Bulk stage update failed";
      showToast(msg);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    if (
      !window.confirm(
        `Are you sure you want to delete ${selectedIds.size} selected candidate application(s)?`
      )
    )
      return;

    try {
      const ids = Array.from(selectedIds);
      await Promise.all(ids.map((id) => deleteApplicationApi(id)));
      setApplications((prev) => prev.filter((a) => !selectedIds.has(a.id)));
      setSelectedIds(new Set());
      showToast(`Deleted ${ids.length} candidate applications`);
    } catch (err: unknown) {
      console.error(err);
      const msg = err instanceof Error ? err.message : "Bulk delete failed";
      showToast(msg);
    }
  };

  const handleApplicationUpdated = (updated: ApplicationItem) => {
    setApplications((prev) =>
      prev.map((a) => (a.id === updated.id ? updated : a))
    );
  };

  const downloadFile = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const handleExport = (type: "all_json" | "filtered_json" | "selected_json" | "csv") => {
    let target: ApplicationItem[] = [];
    if (type === "all_json") target = applications;
    else if (type === "filtered_json") target = filteredApplications;
    else if (type === "selected_json") target = applications.filter((a) => selectedIds.has(a.id));
    else if (type === "csv") target = filteredApplications;

    if (target.length === 0) {
      showToast("No applications available to export");
      return;
    }

    if (type === "csv") {
      const headers = [
        "First Name",
        "Last Name",
        "Email",
        "Phone",
        "Role Applied",
        "Stage",
        "Rating",
        "Resume URL",
        "Portfolio URL",
        "LinkedIn URL",
        "Applied Date",
      ];
      const rows = target.map((a) => [
        `"${(a.first_name || "").replace(/"/g, '""')}"`,
        `"${(a.last_name || "").replace(/"/g, '""')}"`,
        `"${(a.email || "").replace(/"/g, '""')}"`,
        `"${(a.phone || "").replace(/"/g, '""')}"`,
        `"${(a.job?.title || "").replace(/"/g, '""')}"`,
        `"${a.status || ""}"`,
        `"${a.rating || 0}"`,
        `"${a.resume_url || ""}"`,
        `"${a.portfolio_url || ""}"`,
        `"${a.linkedin_url || ""}"`,
        `"${a.created_at || ""}"`,
      ]);
      const csvStr = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
      const blob = new Blob([csvStr], { type: "text/csv;charset=utf-8;" });
      downloadFile(blob, `apearix_applicants_${new Date().toISOString().slice(0, 10)}.csv`);
      showToast(`Exported ${target.length} applicants as CSV`);
    } else {
      const cleanJson = target.map(({ id, created_at, updated_at, ...clean }) => clean);
      const jsonStr = JSON.stringify(cleanJson, null, 2);
      const blob = new Blob([jsonStr], { type: "application/json" });
      downloadFile(
        blob,
        `apearix_applicants_${type}_${new Date().toISOString().slice(0, 10)}.json`
      );
      showToast(`Exported ${target.length} applicants as JSON`);
    }
  };

  return (
    <main>
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-heading text-white text-xs font-semibold rounded-xl shadow-2xl border border-white/10 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <PageHeader
        title="Talent Pipeline & Applicants"
        subtitle="Review candidate submissions, resume credentials, interview stages, and talent decisions."
        badge={`${applications.length} Applicants`}
        btn={
          <Link
            href="/admin/careers"
            className="inline-flex items-center gap-2 px-3.5 py-2.5 bg-surface hover:bg-surface-alt border border-border text-heading text-sm font-semibold rounded-lg shadow-xs transition-all active:scale-[0.98]"
          >
            <Briefcase className="w-4 h-4 text-primary" />
            <span>Manage Job Roles</span>
          </Link>
        }
      />

      {/* Pipeline Stage Quick-Filter Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 mb-4">
        {[
          { key: "applied", label: "Applied", count: stats.applied ?? applications.filter((a) => a.status === "applied").length },
          { key: "reviewing", label: "Reviewing", count: stats.reviewing ?? applications.filter((a) => a.status === "reviewing").length },
          { key: "shortlisted", label: "Shortlisted", count: stats.shortlisted ?? applications.filter((a) => a.status === "shortlisted").length },
          { key: "interviewing", label: "Interviewing", count: stats.interviewing ?? applications.filter((a) => a.status === "interviewing").length },
          { key: "offered", label: "Offered", count: stats.offered ?? applications.filter((a) => a.status === "offered").length },
          { key: "hired", label: "Hired", count: stats.hired ?? applications.filter((a) => a.status === "hired").length },
          { key: "rejected", label: "Rejected", count: stats.rejected ?? applications.filter((a) => a.status === "rejected").length },
        ].map((stage) => {
          const isSelected = statusFilter === stage.key;
          const conf = STATUS_CONFIG[stage.key as ApplicationItem["status"]];
          return (
            <button
              key={stage.key}
              type="button"
              onClick={() => {
                setStatusFilter(isSelected ? "all" : stage.key);
                setCurrentPage(1);
              }}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${isSelected
                  ? "bg-white ring-2 ring-primary shadow-sm border-primary"
                  : "bg-white hover:bg-surface border-border hover:border-border-accent"
                }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold tracking-wider text-muted">
                  {stage.label}
                </span>
                <span
                  className={`w-2 h-2 rounded-full ${stage.key === "hired" ? "bg-emerald-500" : conf.dot
                    }`}
                />
              </div>
              <p className="text-xl font-extrabold text-heading mt-1">{stage.count}</p>
            </button>
          );
        })}
      </div>

      {/* Toolbar */}
      <TableToolbar
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          setCurrentPage(1);
        }}
        searchPlaceholder="Search candidates by name, email, phone, or job title..."
        filters={[
          {
            id: "job-filter",
            value: jobFilter,
            onChange: (val) => {
              setJobFilter(val);
              setCurrentPage(1);
            },
            minWidth: "170px",
            options: [
              { label: `All Job Roles (${jobs.length})`, value: "all" },
              ...jobs.map((j) => ({
                label: j.title.length > 24 ? `${j.title.slice(0, 22)}...` : j.title,
                value: j.id || "",
              })),
            ],
          },
          {
            id: "status-filter",
            value: statusFilter,
            onChange: (val) => {
              setStatusFilter(val);
              setCurrentPage(1);
            },
            minWidth: "140px",
            options: [
              { label: `Stage: All (${applications.length})`, value: "all" },
              { label: "Applied", value: "applied" },
              { label: "Reviewing", value: "reviewing" },
              { label: "Shortlisted", value: "shortlisted" },
              { label: "Interviewing", value: "interviewing" },
              { label: "Offered", value: "offered" },
              { label: "Hired", value: "hired" },
              { label: "Rejected", value: "rejected" },
            ],
          },
        ]}
        sort={{
          value: sortFilter,
          onChange: setSortFilter,
          minWidth: "140px",
          options: [
            { label: "Sort: Newest", value: "newest" },
            { label: "Sort: Oldest", value: "oldest" },
            { label: "Rating: High to Low", value: "rating_desc" },
            { label: "Name: A to Z", value: "name_asc" },
          ],
        }}
        exportOptions={[
          {
            id: "all_json",
            label: "All Applicants (JSON)",
            badge: ".json",
            onClick: () => handleExport("all_json"),
          },
          {
            id: "filtered_json",
            label: "Filtered View (JSON)",
            badge: ".json",
            onClick: () => handleExport("filtered_json"),
          },
          {
            id: "csv",
            label: "Export as CSV",
            badge: ".csv",
            onClick: () => handleExport("csv"),
          },
        ]}
      />

      {/* Floating Bulk Action Bar */}
      {selectedIds.size > 0 && (
        <div className="mb-4 bg-heading text-white px-4 py-3 rounded-xl shadow-lg flex items-center justify-between gap-4 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex items-center gap-3">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span className="text-xs font-semibold tracking-wide">
              {selectedIds.size} {selectedIds.size === 1 ? "applicant" : "applicants"} selected
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => handleBulkStatusChange("shortlisted")}
              className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium text-white transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Award className="w-3.5 h-3.5 text-purple-300" /> Shortlist
            </button>
            <button
              onClick={() => handleBulkStatusChange("interviewing")}
              className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium text-white transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Users className="w-3.5 h-3.5 text-indigo-300" /> Interview
            </button>
            <button
              onClick={() => handleBulkStatusChange("rejected")}
              className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium text-white transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <XCircle className="w-3.5 h-3.5 text-rose-300" /> Reject
            </button>
            <button
              onClick={() => handleExport("selected_json")}
              className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium text-white transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              Export
            </button>
            <button
              onClick={handleBulkDelete}
              className="px-2.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-xs font-medium text-white transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" /> Delete
            </button>
            <button
              onClick={() => setSelectedIds(new Set())}
              className="p-1 rounded-md text-white/70 hover:text-white cursor-pointer"
              title="Clear selection"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Table Card */}
      <div className="bg-white border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto min-h-95">
          {isLoading ? (
            <div className="py-20 text-center text-muted flex flex-col items-center justify-center gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <span className="text-xs font-medium">Loading candidate applications...</span>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface border-b border-border text-xs text-muted uppercase tracking-wider font-semibold select-none">
                  <th scope="col" className="py-3.5 pl-4 pr-2 w-10">
                    <input
                      type="checkbox"
                      checked={allFilteredSelected}
                      ref={(el) => {
                        if (el) el.indeterminate = isIndeterminate;
                      }}
                      onChange={(e) => toggleSelectAll(e.target.checked)}
                      className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20 accent-primary cursor-pointer"
                    />
                  </th>
                  <th scope="col" className="py-3.5 px-3 min-w-70">Candidate</th>
                  <th scope="col" className="py-3.5 px-3 min-w-50">Applied Role</th>
                  <th scope="col" className="py-3.5 px-3 min-w-25">Resume</th>
                  <th scope="col" className="py-3.5 px-3 min-w-35">Pipeline Stage</th>
                  <th scope="col" className="py-3.5 px-3 min-w-25">Rating</th>
                  <th scope="col" className="py-3.5 px-3 min-w-30">Applied Date</th>
                  <th scope="col" className="py-3.5 pr-4 pl-3 text-right w-16">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-sm">
                {paginatedApps.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-16 px-4 text-center">
                      <div className="w-12 h-12 mx-auto rounded-2xl bg-primary-light text-primary flex items-center justify-center mb-3">
                        <Users className="w-6 h-6" />
                      </div>
                      <h3 className="text-base font-semibold text-heading">No applications found</h3>
                      <p className="text-xs text-muted max-w-sm mx-auto mt-1 mb-5">
                        No candidates match your current search, role, or stage filter. Try adjusting or resetting them.
                      </p>
                      <button
                        onClick={() => {
                          setSearchQuery("");
                          setStatusFilter("all");
                          setJobFilter("all");
                        }}
                        className="px-3 py-1.5 bg-surface hover:bg-surface-alt border border-border text-xs font-semibold text-heading rounded-lg transition-colors cursor-pointer"
                      >
                        Reset Filters
                      </button>
                    </td>
                  </tr>
                ) : (
                  paginatedApps.map((app) => {
                    const isSelected = selectedIds.has(app.id);
                    const statusConf = STATUS_CONFIG[app.status] || STATUS_CONFIG.applied;
                    const fullName = `${app.first_name || ""} ${app.last_name || ""}`.trim() || "Applicant";

                    return (
                      <tr
                        key={app.id}
                        onClick={() => setDrawerApp(app)}
                        className={`group hover:bg-surface transition-colors cursor-pointer ${isSelected ? "bg-primary-light/40 border-l-4 border-l-primary" : ""
                          }`}
                      >
                        {/* Checkbox Column */}
                        <td className="py-3.5 pl-4 pr-2 w-10" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => toggleSelectOne(app.id, e.target.checked)}
                            className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20 accent-primary cursor-pointer"
                          />
                        </td>

                        {/* Candidate Name & Contact */}
                        <td className="py-3.5 px-3 max-w-70">
                          <div className="flex items-start gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-primary-light border border-border-accent/40 flex items-center justify-center text-primary font-bold text-xs shrink-0 mt-0.5">
                              {app.first_name ? app.first_name.charAt(0).toUpperCase() : "A"}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div
                                className="font-semibold text-heading text-sm group-hover:text-primary transition-colors truncate"
                                title={fullName}
                              >
                                {fullName}
                              </div>
                              <div className="flex items-center gap-1.5 text-xs text-muted mt-0.5 truncate">
                                <Mail className="w-3 h-3 text-muted shrink-0" />
                                <span className="truncate">{app.email}</span>
                              </div>
                              {app.phone && (
                                <div className="flex items-center gap-1.5 text-[11px] text-muted/80 mt-0.5 truncate">
                                  <Phone className="w-3 h-3 text-muted/70 shrink-0" />
                                  <span className="truncate">{app.phone}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Applied Role */}
                        <td className="py-3.5 px-3 max-w-55">
                          <div
                            className="font-semibold text-heading text-xs truncate"
                            title={app.job?.title || "Role"}
                          >
                            {app.job?.title || "Job Opening"}
                          </div>
                          <div className="text-[11px] text-muted font-medium mt-0.5 truncate">
                            {app.job?.department || "General"}
                          </div>
                        </td>

                        {/* Resume / CV Link */}
                        <td
                          className="py-3.5 px-3"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {app.resume_url ? (
                            <a
                              href={app.resume_url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 font-semibold text-xs transition-colors cursor-pointer"
                              title="Open CV in new tab"
                            >
                              <FileText className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span>CV</span>
                              <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                            </a>
                          ) : (
                            <span className="text-muted text-xs">—</span>
                          )}
                        </td>

                        {/* Pipeline Stage Badge */}
                        <td className="py-3.5 px-3">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusConf.bg} ${statusConf.text} ${statusConf.border}`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${statusConf.dot}`} />
                            <span>{statusConf.label}</span>
                          </span>
                        </td>

                        {/* Rating */}
                        <td className="py-3.5 px-3">
                          {app.rating > 0 ? (
                            <div className="inline-flex items-center gap-1 text-amber-500 font-bold text-xs bg-amber-50/60 px-2 py-0.5 rounded-md border border-amber-200/60">
                              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                              <span>{app.rating}.0</span>
                            </div>
                          ) : (
                            <span className="text-muted text-xs font-medium">—</span>
                          )}
                        </td>

                        {/* Applied Date */}
                        <td className="py-3.5 px-3 text-xs text-heading">
                          {app.created_at
                            ? formatDateInTimezone(app.created_at, undefined, {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })
                            : "—"}
                        </td>

                        {/* Actions Column */}
                        <td
                          className="py-3.5 pr-4 pl-3 text-right"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ActionMenu
                            items={[
                              {
                                label: "Review Candidate",
                                icon: <Eye className="w-3.5 h-3.5 text-muted" />,
                                onClick: () => setDrawerApp(app),
                              },
                              ...(app.resume_url
                                ? [
                                  {
                                    label: "View Resume / CV",
                                    icon: <FileText className="w-3.5 h-3.5 text-muted" />,
                                    onClick: () => window.open(app.resume_url, "_blank"),
                                    dividerAfter: true,
                                  },
                                ]
                                : []),
                              ...(app.status !== "reviewing"
                                ? [
                                  {
                                    label: "Move to Reviewing",
                                    icon: <Clock className="w-3.5 h-3.5" />,
                                    onClick: () => handleQuickStatusChange(app.id, "reviewing"),
                                  },
                                ]
                                : []),
                              ...(app.status !== "shortlisted"
                                ? [
                                  {
                                    label: "Shortlist Candidate",
                                    icon: <Award className="w-3.5 h-3.5 text-purple-600" />,
                                    onClick: () => handleQuickStatusChange(app.id, "shortlisted"),
                                  },
                                ]
                                : []),
                              ...(app.status !== "interviewing"
                                ? [
                                  {
                                    label: "Schedule Interview",
                                    icon: <Users className="w-3.5 h-3.5 text-indigo-600" />,
                                    onClick: () => handleQuickStatusChange(app.id, "interviewing"),
                                  },
                                ]
                                : []),
                              ...(app.status !== "offered"
                                ? [
                                  {
                                    label: "Extend Offer",
                                    icon: <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />,
                                    variant: "success" as const,
                                    onClick: () => handleQuickStatusChange(app.id, "offered"),
                                  },
                                ]
                                : []),
                              ...(app.status !== "hired"
                                ? [
                                  {
                                    label: "Mark as Hired",
                                    icon: <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />,
                                    variant: "success" as const,
                                    onClick: () => handleQuickStatusChange(app.id, "hired"),
                                  },
                                ]
                                : []),
                              ...(app.status !== "rejected"
                                ? [
                                  {
                                    label: "Reject Candidate",
                                    icon: <XCircle className="w-3.5 h-3.5 text-rose-500" />,
                                    variant: "warning" as const,
                                    onClick: () => handleQuickStatusChange(app.id, "rejected"),
                                    dividerAfter: true,
                                  },
                                ]
                                : []),
                              {
                                label: "Delete Application",
                                icon: <Trash2 className="w-3.5 h-3.5" />,
                                variant: "danger" as const,
                                onClick: () => handleDelete(app.id),
                              },
                            ]}
                          />
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        <TablePagination
          currentPage={validCurrentPage}
          totalItems={totalItems}
          pageSize={pageSize}
          pageSizeOptions={[10, 25, 50]}
          onPageChange={(page) => setCurrentPage(page)}
          onPageSizeChange={(newSize) => {
            setPageSize(newSize);
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
    </main>
  );
}
