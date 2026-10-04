"use client";

import React, { useState, useMemo, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Plus,
  CheckCircle,
  Archive,
  Trash2,
  Eye,
  Edit,
  FileMinus,
  FileText,
  X,
  Loader2,
} from "lucide-react";
import { PageHeader } from "@/components/admin/common/PageHeader";
import { TablePagination } from "@/components/admin/common/TablePagination";
import { TableToolbar } from "@/components/admin/common/TableToolbar";
import { BulkImportModal } from "@/components/admin/common/BulkImportModal";
import { formatDateInTimezone } from "@/lib/timezone";
import { PageQuickViewDrawer } from "@/components/admin/drawer/PageQuickViewDrawer";
import { ActionMenu } from "@/components/admin/common/ActionMenu";
import { type PageStatus, type PageFormValues } from "@/schemas/page.schema";
import {
  index as fetchPagesApi,
  destroy as deletePageApi,
  update as updatePageApi,
  bulkUpdateStatus as bulkUpdateStatusApi,
  bulkDelete as bulkDeleteApi,
  bulkImport as bulkImportApi,
} from "@/lib/services/admin/pages";

const SAMPLE_PAGE_IMPORT = [
  {
    title: "Privacy Policy",
    slug: "privacy-policy",
    is_manual_slug: false,
    content: "<h1>Privacy Policy</h1><p>We respect your privacy and protect your data...</p>",
    status: "published" as PageStatus,
    meta_title: "Privacy Policy - Apearix",
    meta_description: "Read the official privacy policy of Apearix.",
    published_at: "2026-01-01T00:00:00Z",
  },
];

export default function AdminPagesPage() {
  const [pages, setPages] = useState<PageFormValues[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortFilter, setSortFilter] = useState<string>("newest");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // Modals & Panels
  const [drawerPage, setDrawerPage] = useState<PageFormValues | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const loadPages = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetchPagesApi();
      setPages(res.items);
    } catch (error) {
      console.error("Error loading pages:", error);
      showToast("Failed to load static pages from server.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPages();
  }, [loadPages]);

  const counts = useMemo(
    () => ({
      all: pages.length,
      published: pages.filter((p) => p.status === "published").length,
      draft: pages.filter((p) => p.status === "draft").length,
      archived: pages.filter((p) => p.status === "archived").length,
    }),
    [pages]
  );

  const filteredPages = useMemo(() => {
    return pages
      .filter((page) => {
        if (statusFilter !== "all" && page.status !== statusFilter) return false;
        if (searchQuery.trim() !== "") {
          const q = searchQuery.toLowerCase().trim();
          const matchTitle = (page.title || "").toLowerCase().includes(q);
          const matchSlug = (page.slug || "").toLowerCase().includes(q);
          const matchMeta = (page.meta_title || "").toLowerCase().includes(q);
          if (!matchTitle && !matchSlug && !matchMeta) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortFilter === "newest") {
          return (
            new Date(b.created_at || 0).getTime() -
            new Date(a.created_at || 0).getTime()
          );
        }
        if (sortFilter === "oldest") {
          return (
            new Date(a.created_at || 0).getTime() -
            new Date(b.created_at || 0).getTime()
          );
        }
        if (sortFilter === "title_asc") {
          return (a.title || "").localeCompare(b.title || "");
        }
        return 0;
      });
  }, [pages, statusFilter, searchQuery, sortFilter]);

  const totalItems = filteredPages.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const validCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (validCurrentPage - 1) * pageSize;
  const paginatedPages = filteredPages.slice(startIndex, startIndex + pageSize);

  const allFilteredSelected =
    paginatedPages.length > 0 && paginatedPages.every((p) => selectedIds.has(p.id!));
  const isIndeterminate =
    paginatedPages.some((p) => selectedIds.has(p.id!)) && !allFilteredSelected;

  const toggleSelectAll = (checked: boolean) => {
    const next = new Set(selectedIds);
    if (checked) paginatedPages.forEach((p) => next.add(p.id!));
    else paginatedPages.forEach((p) => next.delete(p.id!));
    setSelectedIds(next);
  };

  const toggleSelectOne = (id: string, checked: boolean) => {
    const next = new Set(selectedIds);
    if (checked) next.add(id);
    else next.delete(id);
    setSelectedIds(next);
  };

  const handleBulkStatusChange = async (newStatus: PageStatus) => {
    if (selectedIds.size === 0) return;
    try {
      await bulkUpdateStatusApi(Array.from(selectedIds), newStatus);
      showToast(`Updated ${selectedIds.size} page(s) to ${newStatus}`);
      setSelectedIds(new Set());
      await loadPages();
    } catch (error: any) {
      showToast(error?.message || "Failed to update bulk status");
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    if (window.confirm(`Are you sure you want to delete ${selectedIds.size} selected page(s)?`)) {
      try {
        await bulkDeleteApi(Array.from(selectedIds));
        showToast(`Deleted ${selectedIds.size} page(s)`);
        setSelectedIds(new Set());
        await loadPages();
      } catch (error: any) {
        showToast(error?.message || "Failed to delete selected pages");
      }
    }
  };

  const updateSingleStatus = async (id: string, status: PageStatus) => {
    const item = pages.find((p) => p.id === id);
    if (!item) return;
    try {
      await updatePageApi(id, {
        id,
        title: item.title,
        slug: item.slug,
        content: item.content,
        status,
        published_at:
          status === "published"
            ? item.published_at || new Date().toISOString()
            : item.published_at || "",
      });
      showToast(`Page status updated to ${status}`);
      await loadPages();
    } catch (error: any) {
      showToast(error?.message || "Failed to update status");
    }
  };

  const deleteSinglePage = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this page?")) {
      try {
        await deletePageApi(id);
        if (drawerPage?.id === id) setDrawerPage(null);
        showToast("Page deleted");
        await loadPages();
      } catch (error: any) {
        showToast(error?.message || "Failed to delete page");
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
    let target: PageFormValues[] = [];
    if (type === "all_json") target = pages;
    else if (type === "filtered_json") target = filteredPages;
    else if (type === "selected_json") target = pages.filter((p) => selectedIds.has(p.id!));
    else if (type === "csv") target = filteredPages;

    if (target.length === 0) {
      showToast("No pages available to export");
      return;
    }

    if (type === "csv") {
      const headers = ["Title", "Slug", "Status", "Published At", "Meta Title", "Meta Description"];
      const rows = target.map((p) => [
        `"${(p.title || "").replace(/"/g, '""')}"`,
        `"${p.slug || ""}"`,
        `"${p.status || ""}"`,
        `"${p.published_at || ""}"`,
        `"${(p.meta_title || "").replace(/"/g, '""')}"`,
        `"${(p.meta_description || "").replace(/"/g, '""')}"`,
      ]);
      const csvStr = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
      const blob = new Blob([csvStr], { type: "text/csv;charset=utf-8;" });
      downloadFile(blob, `apearix_pages_${new Date().toISOString().slice(0, 10)}.csv`);
      showToast(`Exported ${target.length} page(s) as CSV`);
    } else {
      const cleanJson = target.map(({ id, updated_at, created_at, ...clean }) => clean);
      const jsonStr = JSON.stringify(cleanJson, null, 2);
      const blob = new Blob([jsonStr], { type: "application/json" });
      downloadFile(blob, `apearix_pages_${type}_${new Date().toISOString().slice(0, 10)}.json`);
      showToast(`Exported ${target.length} page(s) as JSON`);
    }
  };

  const validatePageRow = (item: any, index: number) => {
    const warnings: string[] = [];
    const errors: string[] = [];

    if (!item.title || typeof item.title !== "string" || item.title.trim() === "") {
      errors.push("Missing page title");
    }

    let slug = item.slug;
    if (!slug || typeof slug !== "string") {
      if (item.title) {
        slug = item.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
        warnings.push("Auto-slugged");
      } else {
        errors.push("No slug/title");
      }
    }

    let status: PageStatus = item.status || "published";
    if (!["draft", "published", "archived"].includes(status)) {
      warnings.push(`Status '${status}' mapped to published`);
      status = "published";
    }

    const isValid = errors.length === 0;
    const remarks = isValid ? (warnings.length > 0 ? warnings.join(", ") : "Valid") : errors.join(", ");

    const pageData: PageFormValues = {
      title: item.title || "Untitled Page",
      slug: slug || "untitled-page",
      is_manual_slug: item.is_manual_slug !== undefined ? Boolean(item.is_manual_slug) : true,
      content: item.content || "Content imported via batch JSON.",
      status,
      meta_title: item.meta_title || item.title || "",
      meta_description: item.meta_description || "",
      published_at: item.published_at || (status === "published" ? new Date().toISOString() : ""),
    };

    return {
      data: pageData,
      isValid,
      remarks,
    };
  };

  const handleImportCommit = async (importedPages: PageFormValues[]) => {
    try {
      const payload = importedPages.map((page) => ({
        title: page.title,
        slug: page.slug,
        is_manual_slug: page.is_manual_slug,
        content: page.content,
        status: page.status,
        meta_title: page.meta_title,
        meta_description: page.meta_description,
        published_at: page.published_at || "",
      }));

      const res = await bulkImportApi(payload);
      const count = res?.count ?? res?.items?.length ?? importedPages.length;
      showToast(`Successfully imported ${count} page(s)!`);
      await loadPages();
    } catch (err: any) {
      console.error("Bulk import pages error:", err);
      showToast(err?.message || "Failed to bulk import pages");
    }
  };

  return (
    <main>
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-heading text-white text-xs font-semibold rounded-xl shadow-2xl border border-white/10 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <PageHeader
        title="Pages"
        subtitle="Manage, publish, and optimize your static legal and landing pages."
        badge={`${pages.length} Pages`}
        btn={
          <Link
            href="/admin/pages/create"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary-hover text-white text-sm font-semibold rounded-lg shadow-sm shadow-primary/20 transition-all active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" /> Create Page
          </Link>
        }
      />

      {/* Toolbar */}
      <TableToolbar
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          setCurrentPage(1);
        }}
        searchPlaceholder="Search pages by title, slug or meta title..."
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
              { label: `Status: All (${counts.all})`, value: "all" },
              { label: `Published (${counts.published})`, value: "published" },
              { label: `Draft (${counts.draft})`, value: "draft" },
              { label: `Archived (${counts.archived})`, value: "archived" },
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
          ],
        }}
        onImportClick={() => setIsImportModalOpen(true)}
        exportOptions={[
          {
            id: "all_json",
            label: "All Pages (JSON)",
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
              {selectedIds.size} {selectedIds.size === 1 ? "page" : "pages"} selected
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
              onClick={() => handleBulkStatusChange("archived")}
              className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium text-white transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Archive className="w-3.5 h-3.5 text-slate-300" /> Archive
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
              <span className="text-xs font-medium">Loading static pages...</span>
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
                  <th scope="col" className="py-3.5 px-3 min-w-[320px]">Page</th>
                  <th scope="col" className="py-3.5 px-3 min-w-32.5">Status</th>
                  <th scope="col" className="py-3.5 px-3 min-w-32.5">Published</th>
                  <th scope="col" className="py-3.5 px-3 min-w-30">Updated</th>
                  <th scope="col" className="py-3.5 pr-4 pl-3 text-right w-16">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-sm">
                {paginatedPages.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-16 px-4 text-center">
                      <div className="w-12 h-12 mx-auto rounded-2xl bg-primary-light text-primary flex items-center justify-center mb-3">
                        <FileText className="w-6 h-6" />
                      </div>
                      <h3 className="text-base font-semibold text-heading">No pages found</h3>
                      <p className="text-xs text-muted max-w-sm mx-auto mt-1 mb-5">
                        No static pages match your current search or status filter. Try resetting them or upload a JSON backup.
                      </p>
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => {
                            setSearchQuery("");
                            setStatusFilter("all");
                          }}
                          className="px-3 py-1.5 bg-surface hover:bg-surface-alt border border-border text-xs font-semibold text-heading rounded-lg transition-colors cursor-pointer"
                        >
                          Reset Filters
                        </button>
                        <button
                          onClick={() => setIsImportModalOpen(true)}
                          className="px-3 py-1.5 bg-primary hover:bg-primary-hover text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                        >
                          Import JSON
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedPages.map((page) => {
                    const isSelected = selectedIds.has(page.id!);
                    const status = page.status || "published";
                    return (
                      <tr
                        key={page.id}
                        onClick={() => setDrawerPage(page)}
                        className={`group hover:bg-surface transition-colors cursor-pointer ${
                          isSelected ? "bg-primary-light/40 border-l-4 border-l-primary" : ""
                        }`}
                      >
                        <td className="py-3.5 pl-4 pr-2 w-10" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => toggleSelectOne(page.id!, e.target.checked)}
                            className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20 accent-primary cursor-pointer"
                          />
                        </td>
                        <td className="py-3.5 px-3 max-w-[320px]">
                          <div className="flex items-start gap-3">
                            <div className="w-9 h-9 rounded-lg bg-primary-light border border-primary/20 flex items-center justify-center text-primary shrink-0 mt-0.5">
                              <FileText className="w-4 h-4" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div
                                className="font-semibold text-heading text-sm hover:text-primary transition-colors line-clamp-2 leading-snug break-words"
                                title={page.title}
                              >
                                {page.title}
                              </div>
                              <div className="text-xs text-muted font-mono truncate mt-0.5 flex items-center gap-1.5">
                                <span className="truncate">/{page.slug}</span>
                                {page.is_manual_slug && (
                                  <span className="text-[10px] text-primary bg-primary-light px-1 py-0.5 rounded font-sans font-medium shrink-0">
                                    Custom
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
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
                          {status === "archived" && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span> Archived
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-3 text-xs text-heading">
                          {page.published_at
                            ? formatDateInTimezone(page.published_at, undefined, { month: "short", day: "numeric", year: "numeric" })
                            : "—"}
                        </td>
                        <td className="py-3.5 px-3 text-xs text-muted">
                          {page.updated_at
                            ? formatDateInTimezone(page.updated_at, undefined, { month: "short", day: "numeric", year: "numeric" })
                            : "Just now"}
                        </td>
                        {/* Actions Column */}
                        <td
                          className="py-3.5 pr-4 pl-3 text-right"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ActionMenu
                            items={[
                              {
                                label: "Edit Page",
                                icon: <Edit className="w-3.5 h-3.5 text-muted" />,
                                onClick: () => window.location.href = `/admin/pages/${page.id}/edit`,
                              },
                              {
                                label: "View Preview",
                                icon: <Eye className="w-3.5 h-3.5 text-muted" />,
                                onClick: () => setDrawerPage(page),
                                dividerAfter: true,
                              },
                              ...(status === "published"
                                ? [
                                    {
                                      label: "Unpublish",
                                      icon: <FileMinus className="w-3.5 h-3.5" />,
                                      variant: "warning" as const,
                                      onClick: () => updateSingleStatus(page.id!, "draft"),
                                    },
                                  ]
                                : [
                                    {
                                      label: "Publish Now",
                                      icon: <CheckCircle className="w-3.5 h-3.5" />,
                                      variant: "success" as const,
                                      onClick: () => updateSingleStatus(page.id!, "published"),
                                    },
                                  ]),
                              {
                                label: "Archive",
                                icon: <Archive className="w-3.5 h-3.5" />,
                                onClick: () => updateSingleStatus(page.id!, "archived"),
                                dividerAfter: true,
                              },
                              {
                                label: "Delete Page",
                                icon: <Trash2 className="w-3.5 h-3.5" />,
                                variant: "danger" as const,
                                onClick: () => deleteSinglePage(page.id!),
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

      {/* Quick View Drawer */}
      <PageQuickViewDrawer
        page={drawerPage}
        onClose={() => setDrawerPage(null)}
      />

      {/* Universal Reusable Bulk Import Modal */}
      <BulkImportModal<PageFormValues>
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        title="Import Pages"
        subtitle="Bulk upload static pages conforming to the"
        badgeText="PageFormValues"
        sampleFileName="apearix_pages_sample.json"
        sampleData={SAMPLE_PAGE_IMPORT}
        validateRow={validatePageRow}
        previewColumns={[
          {
            header: "Title",
            render: (item) => item.title,
          },
          {
            header: "Slug",
            render: (item) => item.slug,
          },
          {
            header: "Status",
            render: (item) => item.status,
          },
        ]}
        onCommit={handleImportCommit}
      />
    </main>
  );
}
