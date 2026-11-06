"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Plus,
  Users,
  Briefcase,
  CheckCircle,
  Trash2,
  Eye,
  Edit,
  MapPin,
  Calendar,
  AlertCircle,
  Loader2,
  Check,
  XCircle,
  ArrowUpRight,
  ArrowDownRight,
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
      const [jobsData, statsData] = await Promise.all([
        fetchJobsApi(),
        fetchStatsApi(),
      ]);
      setJobs(jobsData.items || []);
      setStats(statsData || { totalJobs: 0, activeJobs: 0, totalApplications: 0 });
    } catch (err) {
      console.error("Failed to load careers data", err);
      showToast("Jobs load karne mein samasya aayi", "error");
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
          if (!matchTitle && !matchDept && !matchLocation) return false;
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

  const handleDeleteJob = async (id: string) => {
    if (!window.confirm("Kya aap sach me is job opening ko delete karna chahte hain?")) return;
    try {
      await deleteJobApi(id);
      setJobs((prev) => prev.filter((j) => j.id !== id));
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      showToast("Job opening delete ho gayi");
    } catch (err) {
      console.error(err);
      showToast("Delete karne mein samasya aayi", "error");
    }
  };

  const handleToggleStatus = async (job: JobFormValues) => {
    if (!job.id) return;
    const nextStatus = job.status === "published" ? "closed" : "published";
    try {
      await updateJobApi(job.id, { id: job.id, status: nextStatus as any });
      setJobs((prev) =>
        prev.map((j) => (j.id === job.id ? { ...j, status: nextStatus as any } : j))
      );
      showToast(`Job status updated to ${nextStatus}`);
    } catch (err) {
      console.error(err);
      showToast("Status update karne mein samasya aayi", "error");
    }
  };

  const handleBulkStatus = async (status: string) => {
    if (selectedIds.size === 0) return;
    try {
      const ids = Array.from(selectedIds);
      await bulkUpdateStatusApi(ids, status);
      setJobs((prev) =>
        prev.map((j) => (j.id && selectedIds.has(j.id) ? { ...j, status: status as any } : j))
      );
      setSelectedIds(new Set());
      showToast(`${ids.length} jobs ka status change ho gaya`);
    } catch (err) {
      console.error(err);
      showToast("Bulk status update fail ho gaya", "error");
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    if (!window.confirm(`Kya aap sach me in ${selectedIds.size} openings ko delete karna chahte hain?`)) return;
    try {
      const ids = Array.from(selectedIds);
      await bulkDeleteApi(ids);
      setJobs((prev) => prev.filter((j) => j.id && !selectedIds.has(j.id)));
      setSelectedIds(new Set());
      showToast(`${ids.length} jobs delete ho gayi`);
    } catch (err) {
      console.error(err);
      showToast("Bulk delete fail ho gaya", "error");
    }
  };

  return (
    <div className="space-y-5">
      {/* Toast Alert */}
      {toastMessage && (
        <div
          className={`fixed bottom-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg border text-sm font-medium transition-all ${toastMessage.type === "success"
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
        title="Careers & Job Openings"
        subtitle="Manage job positions, remote roles, and review applicant submissions"
        btn={
          <div className="flex items-center gap-2.5">
            <Link
              href="/admin/careers/applications"
              className="px-4 py-2 border border-border text-heading bg-white hover:bg-surface text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Users className="w-3.5 h-3.5 text-primary" />
              <span>Review Applicants</span>
            </Link>
            <Link
              href="/admin/careers/create"
              className="px-4 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create New Opening</span>
            </Link>
          </div>
        }
      />

      {/* Metrics Row */}
      {(() => {
        const metricsData = [
          {
            title: "Total Roles",
            value: stats.totalJobs || jobs.length, 
            icon: Briefcase,
            colorClass: "bg-purple-50 text-purple-600 group-hover:bg-purple-600",
          },
          {
            title: "Active / Published",
            value: jobs.filter((j) => j.status === "published").length, 
            icon: Check,
            colorClass: "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600",
          },
          {
            title: "Total Applicants",
            value: stats.totalApplications || 0, 
            icon: Users,
            colorClass: "bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600",
          },
        ];

        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {metricsData.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className="relative flex gap-3 group bg-white rounded-2xl p-5 border border-border hover:border-border-accent/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-lg hover:shadow-glow/20 transition-all duration-300"
                >
                  <div className="flex items-center justify-between">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center transition-colors duration-200 group-hover:text-white ${item.colorClass}`}
                    >
                      <Icon size={20} strokeWidth={2.2} />
                    </div>
                  </div>

                  <div className="">
                    <p className="text-heading text-sm font-semibold">{item.title}</p>
                    <h3 className="text-3xl font-extrabold text-heading tracking-tight">
                      {item.value}
                    </h3> 
                  </div>
                </div>
              );
            })}
          </div>
        );
      })()}

      {/* Table Toolbar */}
      <TableToolbar
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          setCurrentPage(1);
        }}
        searchPlaceholder="Search roles by title, department, location..."
        filters={[
          {
            id: "status-filter",
            value: statusFilter,
            onChange: (val) => {
              setStatusFilter(val);
              setCurrentPage(1);
            },
            minWidth: "135px",
            options: [
              { label: "Status: All", value: "all" },
              { label: "Published", value: "published" },
              { label: "Draft", value: "draft" },
              { label: "Closed", value: "closed" },
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
            { label: "Newest First", value: "newest" },
            { label: "Oldest First", value: "oldest" },
            { label: "Sort Order", value: "order_asc" },
          ],
        }}
      >
        {selectedIds.size > 0 && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleBulkStatus("published")}
              className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors"
            >
              Publish ({selectedIds.size})
            </button>
            <button
              type="button"
              onClick={() => handleBulkStatus("closed")}
              className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 transition-colors"
            >
              Close ({selectedIds.size})
            </button>
            <button
              type="button"
              onClick={handleBulkDelete}
              className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 transition-colors"
            >
              Delete ({selectedIds.size})
            </button>
          </div>
        )}
      </TableToolbar>

      {/* Jobs Data Table */}
      <div className="bg-white rounded-xl border border-border overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-surface border-b border-border text-muted uppercase font-semibold">
                <th className="py-3.5 px-4 w-10">
                  <input
                    type="checkbox"
                    checked={allFilteredSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = isIndeterminate;
                    }}
                    onChange={(e) => toggleSelectAll(e.target.checked)}
                    className="rounded border-border text-primary focus:ring-primary h-3.5 w-3.5 cursor-pointer"
                  />
                </th>
                <th className="py-3.5 px-4">Role & Department</th>
                <th className="py-3.5 px-4">Type & Location</th>
                <th className="py-3.5 px-4 text-center">Applicants</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Created Date</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-muted">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Loader2 className="w-6 h-6 animate-spin text-primary" />
                      <span>Loading job openings...</span>
                    </div>
                  </td>
                </tr>
              ) : paginatedJobs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-muted">
                    <div className="max-w-xs mx-auto space-y-2">
                      <Briefcase className="w-8 h-8 text-muted mx-auto opacity-50" />
                      <p className="font-semibold text-heading text-sm">No job openings found</p>
                      <p className="text-xs">Adjust filters or create your first job posting.</p>
                      <Link
                        href="/admin/careers/create"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white text-xs font-semibold rounded-lg mt-2"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Create Role
                      </Link>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedJobs.map((job) => {
                  const isChecked = job.id ? selectedIds.has(job.id) : false;
                  return (
                    <tr
                      key={job.id}
                      className={`hover:bg-surface/50 transition-colors ${isChecked ? "bg-purple-50/30" : ""
                        }`}
                    >
                      <td className="py-3 px-4">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => toggleSelectOne(job.id!, e.target.checked)}
                          className="rounded border-border text-primary focus:ring-primary h-3.5 w-3.5 cursor-pointer"
                        />
                      </td>

                      {/* Title & Department */}
                      <td className="py-3 px-4 max-w-xs">
                        <div className="font-semibold text-heading truncate">{job.title}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-purple-50 text-primary border border-purple-100">
                            {job.department}
                          </span>
                          {job.experience_level && (
                            <span className="text-[11px] text-muted">{job.experience_level}</span>
                          )}
                        </div>
                      </td>

                      {/* Type & Location */}
                      <td className="py-3 px-4">
                        <div className="text-heading font-medium">
                          {job.job_type} • {job.workplace_type}
                        </div>
                        <div className="text-muted text-[11px] flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3" />
                          <span>{job.location}</span>
                        </div>
                      </td>

                      {/* Applicants */}
                      <td className="py-3 px-4 text-center">
                        <Link
                          href={`/admin/careers/applications?jobId=${job.id}`}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface hover:bg-purple-50 border border-border text-heading font-semibold text-xs transition-colors"
                        >
                          <Users className="w-3 h-3 text-primary" />
                          <span>{job.applicant_count || 0}</span>
                        </Link>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(job)}
                          className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border transition-all cursor-pointer ${job.status === "published"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                            : job.status === "draft"
                              ? "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
                              : "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100"
                            }`}
                        >
                          {job.status === "published" ? "Published" : job.status === "draft" ? "Draft" : "Closed"}
                        </button>
                      </td>

                      {/* Date */}
                      <td className="py-3 px-4 text-muted text-[11px]">
                        {job.created_at ? formatDateInTimezone(job.created_at) : "—"}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => setDrawerJob(job)}
                            className="p-1.5 text-muted hover:text-heading hover:bg-surface rounded-lg transition-colors cursor-pointer"
                            title="Quick View"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <Link
                            href={`/admin/careers/${job.id}/edit`}
                            className="p-1.5 text-muted hover:text-primary hover:bg-surface rounded-lg transition-colors cursor-pointer"
                            title="Edit Role"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleDeleteJob(job.id!)}
                            className="p-1.5 text-muted hover:text-rose-600 hover:bg-surface rounded-lg transition-colors cursor-pointer"
                            title="Delete"
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

      {/* Quick View Drawer */}
      <JobQuickViewDrawer job={drawerJob} onClose={() => setDrawerJob(null)} />
    </div>
  );
}
