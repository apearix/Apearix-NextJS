"use client";

import React, { useState, useMemo, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Plus,
  Briefcase,
  Users,
  CheckCircle,
  Archive,
  Trash2,
  Eye,
  Edit,
  FileMinus,
  MapPin,
  X,
  Loader2,
} from "lucide-react";
import { PageHeader } from "@/components/admin/common/PageHeader";
import { TablePagination } from "@/components/admin/common/TablePagination";
import { TableToolbar } from "@/components/admin/common/TableToolbar";
import { ActionMenu } from "@/components/admin/common/ActionMenu";
import { JobQuickViewDrawer } from "@/components/admin/drawer/JobQuickViewDrawer";
import { formatDateInTimezone } from "@/lib/timezone";
import type { JobFormValues } from "@/schemas/career.schema";
import {
  index as fetchJobsApi,
  destroy as deleteJobApi,
  update as updateJobApi,
  bulkUpdateStatus as bulkUpdateStatusApi,
  bulkDelete as bulkDeleteApi,
  getStats as fetchStatsApi,
} from "@/lib/services/admin/careers";

export default function AdminCareersPage() {
  const [jobs, setJobs] = useState<JobFormValues[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [sortFilter, setSortFilter] = useState<string>("newest");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [stats, setStats] = useState({ totalJobs: 0, activeJobs: 0, totalApplications: 0 });

  // Quick view drawer
  const [drawerJob, setDrawerJob] = useState<JobFormValues | null>(null);

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
      const [jobsData, statsData] = await Promise.all([
        fetchJobsApi(),
        fetchStatsApi().catch(() => ({ totalJobs: 0, activeJobs: 0, totalApplications: 0 })),
      ]);
      setJobs(jobsData.items || []);
      setStats(statsData || { totalJobs: 0, activeJobs: 0, totalApplications: 0 });
    } catch (err) {
      console.error("Failed to load careers data:", err);
      showToast("Failed to load job openings from server.");
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const departments = useMemo(() => {
    const set = new Set<string>();
    jobs.forEach((j) => {
      if (j.department) set.add(j.department);
    });
    return Array.from(set);
  }, [jobs]);

  const counts = useMemo(
    () => ({
      all: jobs.length,
      published: jobs.filter((j) => j.status === "published").length,
      draft: jobs.filter((j) => j.status === "draft").length,
      closed: jobs.filter((j) => j.status === "closed").length,
    }),
    [jobs]
  );

  const filteredJobs = useMemo(() => {
    return jobs
      .filter((job) => {
        if (statusFilter !== "all" && job.status !== statusFilter) return false;
        if (departmentFilter !== "all" && job.department !== departmentFilter) return false;
        if (searchQuery.trim() !== "") {
          const q = searchQuery.toLowerCase().trim();
          const matchTitle = (job.title || "").toLowerCase().includes(q);
          const matchDept = (job.department || "").toLowerCase().includes(q);
          const matchLocation = (job.location || "").toLowerCase().includes(q);
          const matchSlug = (job.slug || "").toLowerCase().includes(q);
          if (!matchTitle && !matchDept && !matchLocation && !matchSlug) return false;
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
        if (sortFilter === "title_asc") {
          return (a.title || "").localeCompare(b.title || "");
        }
        if (sortFilter === "order_asc") {
          return (a.order ?? 0) - (b.order ?? 0);
        }
        return 0;
      });
  }, [jobs, statusFilter, departmentFilter, searchQuery, sortFilter]);

  const totalItems = filteredJobs.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const validCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (validCurrentPage - 1) * pageSize;
  const paginatedJobs = filteredJobs.slice(startIndex, startIndex + pageSize);

  const allFilteredSelected =
    paginatedJobs.length > 0 && paginatedJobs.every((j) => selectedIds.has(j.id!));
  const isIndeterminate =
    paginatedJobs.some((j) => selectedIds.has(j.id!)) && !allFilteredSelected;

  const toggleSelectAll = (checked: boolean) => {
    const next = new Set(selectedIds);
    if (checked) paginatedJobs.forEach((j) => next.add(j.id!));
    else paginatedJobs.forEach((j) => next.delete(j.id!));
    setSelectedIds(next);
  };

  const toggleSelectOne = (id: string, checked: boolean) => {
    const next = new Set(selectedIds);
    if (checked) next.add(id);
    else next.delete(id);
    setSelectedIds(next);
  };

  const handleBulkStatusChange = async (newStatus: "published" | "draft" | "closed") => {
    if (selectedIds.size === 0) return;
    try {
      await bulkUpdateStatusApi(Array.from(selectedIds), newStatus);
      showToast(`Updated ${selectedIds.size} openings to ${newStatus}`);
      setSelectedIds(new Set());
      await loadData();
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Failed to update bulk status";
      showToast(msg);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    if (window.confirm(`Are you sure you want to delete ${selectedIds.size} selected opening(s)?`)) {
      try {
        await bulkDeleteApi(Array.from(selectedIds));
        showToast(`Deleted ${selectedIds.size} job openings`);
        setSelectedIds(new Set());
        await loadData();
      } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : "Failed to delete selected openings";
        showToast(msg);
      }
    }
  };

  const updateSingleStatus = async (id: string, status: "published" | "draft" | "closed") => {
    const item = jobs.find((j) => j.id === id);
    if (!item) return;
    try {
      await updateJobApi(id, { id, status: status as JobFormValues["status"] });
      showToast(`Job status updated to ${status}`);
      await loadData();
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Failed to update status";
      showToast(msg);
    }
  };

  const deleteSingleJob = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this job opening?")) {
      try {
        await deleteJobApi(id);
        if (drawerJob?.id === id) setDrawerJob(null);
        showToast("Job opening deleted");
        await loadData();
      } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : "Failed to delete job opening";
        showToast(msg);
      }
    }
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
    let target: JobFormValues[] = [];
    if (type === "all_json") target = jobs;
    else if (type === "filtered_json") target = filteredJobs;
    else if (type === "selected_json") target = jobs.filter((j) => selectedIds.has(j.id!));
    else if (type === "csv") target = filteredJobs;

    if (target.length === 0) {
      showToast("No openings available to export");
      return;
    }

    if (type === "csv") {
      const headers = [
        "Title",
        "Slug",
        "Department",
        "Type",
        "Workplace",
        "Location",
        "Experience Level",
        "Status",
        "Applicants",
        "Created At",
      ];
      const rows = target.map((j) => [
        `"${(j.title || "").replace(/"/g, '""')}"`,
        `"${j.slug || ""}"`,
        `"${(j.department || "").replace(/"/g, '""')}"`,
        `"${j.job_type || ""}"`,
        `"${j.workplace_type || ""}"`,
        `"${(j.location || "").replace(/"/g, '""')}"`,
        `"${(j.experience_level || "").replace(/"/g, '""')}"`,
        `"${j.status || ""}"`,
        `"${j.applicant_count || 0}"`,
        `"${j.created_at || ""}"`,
      ]);
      const csvStr = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
      const blob = new Blob([csvStr], { type: "text/csv;charset=utf-8;" });
      downloadFile(blob, `apearix_careers_${new Date().toISOString().slice(0, 10)}.csv`);
      showToast(`Exported ${target.length} openings as CSV`);
    } else {
      const cleanJson = target.map(({ id, created_at, updated_at, ...clean }) => clean);
      const jsonStr = JSON.stringify(cleanJson, null, 2);
      const blob = new Blob([jsonStr], { type: "application/json" });
      downloadFile(blob, `apearix_careers_${type}_${new Date().toISOString().slice(0, 10)}.json`);
      showToast(`Exported ${target.length} openings as JSON`);
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
        title="Careers & Openings"
        subtitle="Manage job positions, remote vacancies, publication status, and applicant pipelines."
        badge={`${jobs.length} Openings`}
        btn={
          <div className="flex items-center gap-2.5">
            <Link
              href="/admin/careers/applications"
              className="inline-flex items-center gap-2 px-3.5 py-2.5 bg-surface hover:bg-surface-alt border border-border text-heading text-sm font-semibold rounded-lg shadow-xs transition-all active:scale-[0.98]"
            >
              <Users className="w-4 h-4 text-primary" />
              <span>Review Applicants</span>
              {stats.totalApplications > 0 && (
                <span className="ml-1 px-1.5 py-0.5 rounded-full text-[11px] font-bold bg-primary/10 text-primary">
                  {stats.totalApplications}
                </span>
              )}
            </Link>
            <Link
              href="/admin/careers/create"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary-hover text-white text-sm font-semibold rounded-lg shadow-sm shadow-primary/20 transition-all active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" /> Create Opening
            </Link>
          </div>
        }
      />

      {/* Toolbar */}
      <TableToolbar
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          setCurrentPage(1);
        }}
        searchPlaceholder="Search roles by title, department, location, slug..."
        filters={[
          {
            id: "status-filter",
            value: statusFilter,
            onChange: (val) => {
              setStatusFilter(val);
              setCurrentPage(1);
            },
            minWidth: "140px",
            options: [
              { label: `Status: All (${counts.all})`, value: "all" },
              { label: `Published (${counts.published})`, value: "published" },
              { label: `Draft (${counts.draft})`, value: "draft" },
              { label: `Closed (${counts.closed})`, value: "closed" },
            ],
          },
          {
            id: "dept-filter",
            value: departmentFilter,
            onChange: (val) => {
              setDepartmentFilter(val);
              setCurrentPage(1);
            },
            minWidth: "150px",
            options: [
              { label: "Department: All", value: "all" },
              ...departments.map((d) => ({ label: d, value: d })),
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
            { label: "Title: A to Z", value: "title_asc" },
            { label: "Order: Ascending", value: "order_asc" },
          ],
        }}
        exportOptions={[
          {
            id: "all_json",
            label: "All Openings (JSON)",
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
              {selectedIds.size} {selectedIds.size === 1 ? "opening" : "openings"} selected
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleBulkStatusChange("published")}
              className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium text-white transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> Publish
            </button>
            <button
              onClick={() => handleBulkStatusChange("draft")}
              className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium text-white transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <FileMinus className="w-3.5 h-3.5 text-amber-300" /> Draft
            </button>
            <button
              onClick={() => handleBulkStatusChange("closed")}
              className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium text-white transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Archive className="w-3.5 h-3.5 text-slate-300" /> Close
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
              <span className="text-xs font-medium">Loading job openings...</span>
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
                  <th scope="col" className="py-3.5 px-3 min-w-[320px]">Role & Department</th>
                  <th scope="col" className="py-3.5 px-3 min-w-40">Type & Location</th>
                  <th scope="col" className="py-3.5 px-3 min-w-28 text-center">Applicants</th>
                  <th scope="col" className="py-3.5 px-3 min-w-32.5">Status</th>
                  <th scope="col" className="py-3.5 px-3 min-w-30">Created</th>
                  <th scope="col" className="py-3.5 pr-4 pl-3 text-right w-16">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-sm">
                {paginatedJobs.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-16 px-4 text-center">
                      <div className="w-12 h-12 mx-auto rounded-2xl bg-primary-light text-primary flex items-center justify-center mb-3">
                        <Briefcase className="w-6 h-6" />
                      </div>
                      <h3 className="text-base font-semibold text-heading">No job openings found</h3>
                      <p className="text-xs text-muted max-w-sm mx-auto mt-1 mb-5">
                        No positions match your current search or status filter. Try resetting them or post a new vacancy.
                      </p>
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => {
                            setSearchQuery("");
                            setStatusFilter("all");
                            setDepartmentFilter("all");
                          }}
                          className="px-3 py-1.5 bg-surface hover:bg-surface-alt border border-border text-xs font-semibold text-heading rounded-lg transition-colors cursor-pointer"
                        >
                          Reset Filters
                        </button>
                        <Link
                          href="/admin/careers/create"
                          className="px-3 py-1.5 bg-primary hover:bg-primary-hover text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                        >
                          Create Role
                        </Link>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedJobs.map((job) => {
                    const isSelected = selectedIds.has(job.id!);
                    const status = job.status || "draft";

                    return (
                      <tr
                        key={job.id}
                        onClick={() => setDrawerJob(job)}
                        className={`group hover:bg-surface transition-colors cursor-pointer ${
                          isSelected ? "bg-primary-light/40 border-l-4 border-l-primary" : ""
                        }`}
                      >
                        {/* Checkbox Column */}
                        <td className="py-3.5 pl-4 pr-2 w-10" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => toggleSelectOne(job.id!, e.target.checked)}
                            className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20 accent-primary cursor-pointer"
                          />
                        </td>

                        {/* Role & Department */}
                        <td className="py-3.5 px-3 max-w-[340px]">
                          <div className="flex items-start gap-3">
                            <div className="w-9 h-9 rounded-lg bg-primary-light border border-border-accent/40 flex items-center justify-center text-primary shrink-0 mt-0.5">
                              <Briefcase className="w-4 h-4" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div
                                className="font-semibold text-heading text-sm group-hover:text-primary transition-colors line-clamp-2 leading-snug break-words"
                                title={job.title}
                              >
                                {job.title}
                              </div>
                              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                                <span className="text-[10px] text-primary bg-primary-light font-medium px-2 py-0.5 rounded border border-border-accent/30 shrink-0">
                                  {job.department}
                                </span>
                                {job.experience_level && (
                                  <span className="text-[11px] text-muted font-medium truncate">
                                    {job.experience_level}
                                  </span>
                                )}
                                {job.is_featured && (
                                  <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded font-semibold border border-amber-200 shrink-0">
                                    Featured
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Type & Workplace */}
                        <td className="py-3.5 px-3">
                          <div className="text-heading font-medium text-xs">
                            {job.job_type} • {job.workplace_type}
                          </div>
                          <div className="text-muted text-xs flex items-center gap-1 mt-1 truncate">
                            <MapPin className="w-3 h-3 shrink-0 text-muted/80" />
                            <span className="truncate">{job.location || "Remote"}</span>
                          </div>
                        </td>

                        {/* Applicants Pill Link */}
                        <td
                          className="py-3.5 px-3 text-center"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Link
                            href={`/admin/careers/applications?jobId=${job.id}`}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface hover:bg-primary-light/60 border border-border text-heading hover:text-primary font-semibold text-xs transition-colors cursor-pointer"
                            title="View role applicants"
                          >
                            <Users className="w-3 h-3 text-primary" />
                            <span>{job.applicant_count || 0}</span>
                          </Link>
                        </td>

                        {/* Status Badge */}
                        <td className="py-3.5 px-3">
                          {status === "published" && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Published
                            </span>
                          )}
                          {status === "draft" && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Draft
                            </span>
                          )}
                          {status === "closed" && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span> Closed
                            </span>
                          )}
                        </td>

                        {/* Created Date */}
                        <td className="py-3.5 px-3 text-xs text-heading">
                          {job.created_at
                            ? formatDateInTimezone(job.created_at, undefined, {
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
                                label: "Edit Role",
                                icon: <Edit className="w-3.5 h-3.5 text-muted" />,
                                onClick: () => (window.location.href = `/admin/careers/${job.id}/edit`),
                              },
                              {
                                label: "View Preview",
                                icon: <Eye className="w-3.5 h-3.5 text-muted" />,
                                onClick: () => setDrawerJob(job),
                              },
                              {
                                label: "View Applicants",
                                icon: <Users className="w-3.5 h-3.5 text-muted" />,
                                onClick: () =>
                                  (window.location.href = `/admin/careers/applications?jobId=${job.id}`),
                                dividerAfter: true,
                              },
                              ...(status === "published"
                                ? [
                                    {
                                      label: "Set to Draft",
                                      icon: <FileMinus className="w-3.5 h-3.5" />,
                                      variant: "warning" as const,
                                      onClick: () => updateSingleStatus(job.id!, "draft"),
                                    },
                                    {
                                      label: "Close Role",
                                      icon: <Archive className="w-3.5 h-3.5" />,
                                      onClick: () => updateSingleStatus(job.id!, "closed"),
                                    },
                                  ]
                                : status === "draft"
                                ? [
                                    {
                                      label: "Publish Now",
                                      icon: <CheckCircle className="w-3.5 h-3.5" />,
                                      variant: "success" as const,
                                      onClick: () => updateSingleStatus(job.id!, "published"),
                                    },
                                    {
                                      label: "Close Role",
                                      icon: <Archive className="w-3.5 h-3.5" />,
                                      onClick: () => updateSingleStatus(job.id!, "closed"),
                                    },
                                  ]
                                : [
                                    {
                                      label: "Reopen & Publish",
                                      icon: <CheckCircle className="w-3.5 h-3.5" />,
                                      variant: "success" as const,
                                      onClick: () => updateSingleStatus(job.id!, "published"),
                                    },
                                    {
                                      label: "Set to Draft",
                                      icon: <FileMinus className="w-3.5 h-3.5" />,
                                      onClick: () => updateSingleStatus(job.id!, "draft"),
                                    },
                                  ]),
                              {
                                label: "Delete Role",
                                icon: <Trash2 className="w-3.5 h-3.5" />,
                                variant: "danger" as const,
                                onClick: () => deleteSingleJob(job.id!),
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

      {/* Quick View Drawer Component */}
      <JobQuickViewDrawer job={drawerJob} onClose={() => setDrawerJob(null)} />
    </main>
  );
}
