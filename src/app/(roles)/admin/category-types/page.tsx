"use client";

import React, { useState, useMemo, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Plus,
  CheckCircle,
  Trash2,
  Eye,
  Edit,
  FolderTree,
  Tag,
  Check,
  XCircle,
  X,
  Loader2,
} from "lucide-react";
import { PageHeader } from "@/components/admin/common/PageHeader";
import { TablePagination } from "@/components/admin/common/TablePagination";
import { TableToolbar } from "@/components/admin/common/TableToolbar";
import { BulkImportModal } from "@/components/admin/common/BulkImportModal";
import { formatDateInTimezone } from "@/lib/timezone";
import { CategoryTypeQuickViewDrawer } from "@/components/admin/drawer/CategoryTypeQuickViewDrawer";
import { ActionMenu } from "@/components/admin/common/ActionMenu";
import { type CategoryTypeFormValues } from "@/schemas/category-type.schema";
import {
  index as fetchCategoryTypesApi,
  destroy as deleteCategoryTypeApi,
  update as updateCategoryTypeApi,
  bulkUpdateStatus as bulkUpdateStatusApi,
  bulkDelete as bulkDeleteApi,
  bulkImport as bulkImportApi,
} from "@/lib/services/admin/category-types";

const SAMPLE_TYPE_IMPORT = [
  {
    name: "Blog Categories",
    slug: "blogs",
    description: "Categories for blog posts and news articles.",
    is_active: true,
  },
];

export default function AdminCategoryTypesPage() {
  const [items, setItems] = useState<CategoryTypeFormValues[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortFilter, setSortFilter] = useState<string>("newest");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // Modals & Panels
  const [drawerItem, setDrawerItem] = useState<CategoryTypeFormValues | null>(null);
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

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetchCategoryTypesApi();
      setItems(res.items);
    } catch (error) {
      console.error("Error loading Category Types:", error);
      showToast("Failed to load Category Types list from server.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const counts = useMemo(
    () => ({
      all: items.length,
      active: items.filter((f) => f.is_active).length,
      inactive: items.filter((f) => !f.is_active).length,
    }),
    [items]
  );

  const filteredItems = useMemo(() => {
    return items
      .filter((item) => {
        if (statusFilter === "active" && !item.is_active) return false;
        if (statusFilter === "inactive" && item.is_active) return false;
        if (searchQuery.trim() !== "") {
          const q = searchQuery.toLowerCase().trim();
          const matchName = (item.name || "").toLowerCase().includes(q);
          const matchSlug = (item.slug || "").toLowerCase().includes(q);
          const matchDesc = (item.description || "").toLowerCase().includes(q);
          if (!matchName && !matchSlug && !matchDesc) return false;
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
        if (sortFilter === "name_asc") {
          return (a.name || "").localeCompare(b.name || "");
        }
        return 0;
      });
  }, [items, statusFilter, searchQuery, sortFilter]);

  const totalItems = filteredItems.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const validCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (validCurrentPage - 1) * pageSize;
  const paginatedItems = filteredItems.slice(startIndex, startIndex + pageSize);

  const allFilteredSelected =
    paginatedItems.length > 0 && paginatedItems.every((f) => selectedIds.has(f.id!));
  const isIndeterminate =
    paginatedItems.some((f) => selectedIds.has(f.id!)) && !allFilteredSelected;

  const toggleSelectAll = (checked: boolean) => {
    const next = new Set(selectedIds);
    if (checked) paginatedItems.forEach((f) => next.add(f.id!));
    else paginatedItems.forEach((f) => next.delete(f.id!));
    setSelectedIds(next);
  };

  const toggleSelectOne = (id: string, checked: boolean) => {
    const next = new Set(selectedIds);
    if (checked) next.add(id);
    else next.delete(id);
    setSelectedIds(next);
  };

  const handleBulkStatusChange = async (isActive: boolean) => {
    if (selectedIds.size === 0) return;
    try {
      await bulkUpdateStatusApi(Array.from(selectedIds), isActive);
      showToast(`Updated ${selectedIds.size} type(s) to ${isActive ? "Active" : "Inactive"}`);
      setSelectedIds(new Set());
      await loadData();
    } catch (error: any) {
      showToast(error?.message || "Failed to update bulk status");
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    if (window.confirm(`Are you sure you want to delete ${selectedIds.size} selected category type(s)?`)) {
      try {
        await bulkDeleteApi(Array.from(selectedIds));
        showToast(`Deleted ${selectedIds.size} category type(s)`);
        setSelectedIds(new Set());
        await loadData();
      } catch (error: any) {
        showToast(error?.message || "Failed to delete selected category types");
      }
    }
  };

  const updateSingleStatus = async (id: string, isActive: boolean) => {
    const item = items.find((f) => f.id === id);
    if (!item) return;
    try {
      await updateCategoryTypeApi(id, {
        id,
        name: item.name,
        slug: item.slug,
        description: item.description,
        is_active: isActive,
      });
      showToast(`Status updated to ${isActive ? "Active" : "Inactive"}`);
      await loadData();
    } catch (error: any) {
      showToast(error?.message || "Failed to update status");
    }
  };

  const deleteSingleItem = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this Category Type?")) {
      try {
        await deleteCategoryTypeApi(id);
        if (drawerItem?.id === id) setDrawerItem(null);
        showToast("Category Type deleted");
        await loadData();
      } catch (error: any) {
        showToast(error?.message || "Failed to delete category type");
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
    let target: CategoryTypeFormValues[] = [];
    if (type === "all_json") target = items;
    else if (type === "filtered_json") target = filteredItems;
    else if (type === "selected_json") target = items.filter((f) => selectedIds.has(f.id!));
    else if (type === "csv") target = filteredItems;

    if (target.length === 0) {
      showToast("No Category Types available to export");
      return;
    }

    if (type === "csv") {
      const headers = ["Name", "Slug", "Description", "Status", "Created At"];
      const rows = target.map((f) => [
        `"${(f.name || "").replace(/"/g, '""')}"`,
        `"${(f.slug || "").replace(/"/g, '""')}"`,
        `"${(f.description || "").replace(/"/g, '""')}"`,
        `"${f.is_active ? "Active" : "Inactive"}"`,
        `"${f.created_at || ""}"`,
      ]);
      const csvStr = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
      const blob = new Blob([csvStr], { type: "text/csv;charset=utf-8;" });
      downloadFile(blob, `apearix_category_types_${new Date().toISOString().slice(0, 10)}.csv`);
      showToast(`Exported ${target.length} type(s) as CSV`);
    } else {
      const cleanJson = target.map(({ id, updated_at, created_at, ...clean }) => clean);
      const jsonStr = JSON.stringify(cleanJson, null, 2);
      const blob = new Blob([jsonStr], { type: "application/json" });
      downloadFile(blob, `apearix_category_types_${type}_${new Date().toISOString().slice(0, 10)}.json`);
      showToast(`Exported ${target.length} type(s) as JSON`);
    }
  };

  const validateRow = (item: any, index: number) => {
    const warnings: string[] = [];
    const errors: string[] = [];

    if (!item.name || typeof item.name !== "string" || item.name.trim() === "") {
      errors.push("Missing name");
    }

    const isValid = errors.length === 0;
    const remarks = isValid ? (warnings.length > 0 ? warnings.join(", ") : "Valid") : errors.join(", ");

    const rowData: CategoryTypeFormValues = {
      name: item.name || "Sample Type",
      slug: item.slug || "",
      description: item.description || "",
      is_active: item.is_active !== undefined ? Boolean(item.is_active) : true,
    };

    return {
      data: rowData,
      isValid,
      remarks,
    };
  };

  const handleImportCommit = async (importedItems: CategoryTypeFormValues[]) => {
    try {
      const payload = importedItems.map((item) => ({
        name: item.name,
        slug: item.slug || undefined,
        description: item.description || "",
        is_active: item.is_active !== undefined ? item.is_active : true,
      }));

      const res = await bulkImportApi(payload);
      const count = res?.count ?? res?.items?.length ?? importedItems.length;
      showToast(`Successfully imported ${count} category type(s)!`);
      await loadData();
    } catch (err: any) {
      console.error("Bulk import Category Types error:", err);
      showToast(err?.message || "Failed to bulk import category types");
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
        title="Category Types"
        subtitle="Manage category classification groups for blogs, products, pages, and services."
        badge={`${items.length} Types`}
        btn={
          <Link
            href="/admin/category-types/create"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary-hover text-white text-sm font-semibold rounded-lg shadow-sm shadow-primary/20 transition-all active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" /> Create Category Type
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
        searchPlaceholder="Search Category Types by name, slug or description..."
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
              { label: `Active (${counts.active})`, value: "active" },
              { label: `Inactive (${counts.inactive})`, value: "inactive" },
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
            { label: "Name: A-Z", value: "name_asc" },
          ],
        }}
        onImportClick={() => setIsImportModalOpen(true)}
        exportOptions={[
          {
            id: "all_json",
            label: "All Types (JSON)",
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
              {selectedIds.size} {selectedIds.size === 1 ? "Category Type" : "Category Types"} selected
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleBulkStatusChange(true)}
              className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium text-white transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-3.5 h-3.5 text-emerald-400" /> Active
            </button>
            <button
              onClick={() => handleBulkStatusChange(false)}
              className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium text-white transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <XCircle className="w-3.5 h-3.5 text-amber-300" /> Inactive
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
              <span className="text-xs font-medium">Loading Category Type records...</span>
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
                  <th scope="col" className="py-3.5 px-3 min-w-[240px]">Name</th>
                  <th scope="col" className="py-3.5 px-3 min-w-44">Slug</th>
                  <th scope="col" className="py-3.5 px-3 min-w-64">Description</th>
                  <th scope="col" className="py-3.5 px-3 min-w-32.5">Status</th>
                  <th scope="col" className="py-3.5 px-3 min-w-30">Created</th>
                  <th scope="col" className="py-3.5 pr-4 pl-3 text-right w-16">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-sm">
                {paginatedItems.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-16 px-4 text-center">
                      <div className="w-12 h-12 mx-auto rounded-2xl bg-primary-light text-primary flex items-center justify-center mb-3">
                        <FolderTree className="w-6 h-6" />
                      </div>
                      <h3 className="text-base font-semibold text-heading">No Category Types found</h3>
                      <p className="text-xs text-muted max-w-sm mx-auto mt-1 mb-5">
                        No records match your search query or filter. Try resetting them or upload a JSON backup.
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
                  paginatedItems.map((item) => {
                    const isSelected = selectedIds.has(item.id!);
                    return (
                      <tr
                        key={item.id}
                        onClick={() => setDrawerItem(item)}
                        className={`group hover:bg-surface transition-colors cursor-pointer ${
                          isSelected ? "bg-primary-light/40 border-l-4 border-l-primary" : ""
                        }`}
                      >
                        <td className="py-3.5 pl-4 pr-2 w-10" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => toggleSelectOne(item.id!, e.target.checked)}
                            className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20 accent-primary cursor-pointer"
                          />
                        </td>
                        <td className="py-3.5 px-3 max-w-[240px]">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-primary-light border border-primary/20 flex items-center justify-center text-primary shrink-0">
                              <FolderTree className="w-4 h-4" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div
                                className="font-semibold text-heading text-sm hover:text-primary transition-colors truncate"
                                title={item.name}
                              >
                                {item.name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-3">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono bg-surface-alt text-heading border border-border">
                            <Tag className="w-3 h-3 text-primary" />
                            {item.slug || "—"}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-xs text-muted max-w-64 truncate">
                          {item.description || "—"}
                        </td>
                        <td className="py-3.5 px-3">
                          {item.is_active ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Inactive
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-3 text-xs text-muted">
                          {item.created_at
                            ? formatDateInTimezone(item.created_at, undefined, { month: "short", day: "numeric", year: "numeric" })
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
                                label: "Edit Type",
                                icon: <Edit className="w-3.5 h-3.5 text-muted" />,
                                onClick: () => window.location.href = `/admin/category-types/${item.id}/edit`,
                              },
                              {
                                label: "View Details",
                                icon: <Eye className="w-3.5 h-3.5 text-muted" />,
                                onClick: () => setDrawerItem(item),
                                dividerAfter: true,
                              },
                              item.is_active
                                ? {
                                    label: "Mark Inactive",
                                    icon: <XCircle className="w-3.5 h-3.5 text-amber-600" />,
                                    variant: "warning" as const,
                                    onClick: () => updateSingleStatus(item.id!, false),
                                    dividerAfter: true,
                                  }
                                : {
                                    label: "Mark Active",
                                    icon: <Check className="w-3.5 h-3.5 text-emerald-600" />,
                                    variant: "success" as const,
                                    onClick: () => updateSingleStatus(item.id!, true),
                                    dividerAfter: true,
                                  },
                              {
                                label: "Delete Type",
                                icon: <Trash2 className="w-3.5 h-3.5" />,
                                variant: "danger" as const,
                                onClick: () => deleteSingleItem(item.id!),
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
      <CategoryTypeQuickViewDrawer
        categoryType={drawerItem}
        onClose={() => setDrawerItem(null)}
      />

      {/* Universal Reusable Bulk Import Modal */}
      <BulkImportModal<CategoryTypeFormValues>
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        title="Import Category Types"
        subtitle="Bulk upload Category Type records conforming to the"
        badgeText="CategoryTypeFormValues"
        sampleFileName="apearix_category_types_sample.json"
        sampleData={SAMPLE_TYPE_IMPORT}
        validateRow={validateRow}
        previewColumns={[
          {
            header: "Name",
            render: (item) => item.name,
          },
          {
            header: "Slug",
            render: (item) => item.slug || "Auto",
          },
          {
            header: "Status",
            render: (item) => (item.is_active ? "Active" : "Inactive"),
          },
        ]}
        onCommit={handleImportCommit}
      />
    </main>
  );
}
