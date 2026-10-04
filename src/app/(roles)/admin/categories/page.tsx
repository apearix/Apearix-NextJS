"use client";

import React, { useState, useMemo, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Plus,
  CheckCircle,
  Trash2,
  Eye,
  Edit,
  Folder,
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
import { CategoryQuickViewDrawer } from "@/components/admin/drawer/CategoryQuickViewDrawer";
import { ActionMenu } from "@/components/admin/common/ActionMenu";
import { type CategoryFormValues } from "@/schemas/category.schema";
import {
  index as fetchCategoriesApi,
  destroy as deleteCategoryApi,
  update as updateCategoryApi,
  bulkUpdateStatus as bulkUpdateStatusApi,
  bulkDelete as bulkDeleteApi,
  bulkImport as bulkImportApi,
  fetchCategoryTypes,
} from "@/lib/services/admin/categories";

const SAMPLE_CATEGORY_IMPORT = [
  {
    name: "Web Development",
    slug: "web-development",
    description: "Articles and projects related to modern web technology.",
    order: 1,
    is_active: true,
  },
];

export default function AdminCategoryPage() {
  const [items, setItems] = useState<CategoryFormValues[]>([]);
  const [categoryTypes, setCategoryTypes] = useState<{ id: string; name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [sortFilter, setSortFilter] = useState<string>("newest");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // Modals & Panels
  const [drawerItem, setDrawerItem] = useState<CategoryFormValues | null>(null);
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
      const [res, types] = await Promise.all([
        fetchCategoriesApi(),
        fetchCategoryTypes(),
      ]);
      setItems(res.items);
      setCategoryTypes(types);
    } catch (error) {
      console.error("Error loading Categories:", error);
      showToast("Failed to load Categories list from server.");
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
        if (typeFilter !== "all" && item.category_type_id !== typeFilter && item.category_type?.id !== typeFilter) return false;
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
        if (sortFilter === "order_asc") {
          return (a.order ?? 0) - (b.order ?? 0);
        }
        if (sortFilter === "name_asc") {
          return (a.name || "").localeCompare(b.name || "");
        }
        return 0;
      });
  }, [items, statusFilter, typeFilter, searchQuery, sortFilter]);

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
      showToast(`Updated ${selectedIds.size} category(s) to ${isActive ? "Active" : "Inactive"}`);
      setSelectedIds(new Set());
      await loadData();
    } catch (error: any) {
      showToast(error?.message || "Failed to update bulk status");
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    if (window.confirm(`Are you sure you want to delete ${selectedIds.size} selected category(s)?`)) {
      try {
        await bulkDeleteApi(Array.from(selectedIds));
        showToast(`Deleted ${selectedIds.size} category(s)`);
        setSelectedIds(new Set());
        await loadData();
      } catch (error: any) {
        showToast(error?.message || "Failed to delete selected categories");
      }
    }
  };

  const updateSingleStatus = async (id: string, isActive: boolean) => {
    const item = items.find((f) => f.id === id);
    if (!item) return;
    try {
      await updateCategoryApi(id, {
        id,
        name: item.name,
        slug: item.slug,
        description: item.description,
        order: item.order,
        category_type_id: item.category_type_id,
        is_active: isActive,
      });
      showToast(`Status updated to ${isActive ? "Active" : "Inactive"}`);
      await loadData();
    } catch (error: any) {
      showToast(error?.message || "Failed to update status");
    }
  };

  const deleteSingleItem = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this Category?")) {
      try {
        await deleteCategoryApi(id);
        if (drawerItem?.id === id) setDrawerItem(null);
        showToast("Category deleted");
        await loadData();
      } catch (error: any) {
        showToast(error?.message || "Failed to delete category");
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
    let target: CategoryFormValues[] = [];
    if (type === "all_json") target = items;
    else if (type === "filtered_json") target = filteredItems;
    else if (type === "selected_json") target = items.filter((f) => selectedIds.has(f.id!));
    else if (type === "csv") target = filteredItems;

    if (target.length === 0) {
      showToast("No Categories available to export");
      return;
    }

    if (type === "csv") {
      const headers = ["Name", "Slug", "Order", "Status", "Created At"];
      const rows = target.map((f) => [
        `"${(f.name || "").replace(/"/g, '""')}"`,
        `"${(f.slug || "").replace(/"/g, '""')}"`,
        `"${f.order ?? 0}"`,
        `"${f.is_active ? "Active" : "Inactive"}"`,
        `"${f.created_at || ""}"`,
      ]);
      const csvStr = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
      const blob = new Blob([csvStr], { type: "text/csv;charset=utf-8;" });
      downloadFile(blob, `apearix_categories_${new Date().toISOString().slice(0, 10)}.csv`);
      showToast(`Exported ${target.length} category(s) as CSV`);
    } else {
      const cleanJson = target.map(({ id, updated_at, created_at, ...clean }) => clean);
      const jsonStr = JSON.stringify(cleanJson, null, 2);
      const blob = new Blob([jsonStr], { type: "application/json" });
      downloadFile(blob, `apearix_categories_${type}_${new Date().toISOString().slice(0, 10)}.json`);
      showToast(`Exported ${target.length} category(s) as JSON`);
    }
  };

  const validateRow = (item: any, index: number) => {
    const warnings: string[] = [];
    const errors: string[] = [];

    if (!item.name || typeof item.name !== "string" || item.name.trim() === "") {
      errors.push("Missing category name");
    }

    const isValid = errors.length === 0;
    const remarks = isValid ? (warnings.length > 0 ? warnings.join(", ") : "Valid") : errors.join(", ");

    const rowData: CategoryFormValues = {
      name: item.name || "Sample Category",
      slug: item.slug || "",
      description: item.description || "",
      order: item.order !== undefined ? Number(item.order) : 0,
      is_active: item.is_active !== undefined ? Boolean(item.is_active) : true,
    };

    return {
      data: rowData,
      isValid,
      remarks,
    };
  };

  const handleImportCommit = async (importedItems: CategoryFormValues[]) => {
    try {
      const payload = importedItems.map((item) => ({
        name: item.name,
        slug: item.slug || undefined,
        description: item.description || "",
        order: item.order ?? 0,
        is_active: item.is_active !== undefined ? item.is_active : true,
      }));

      const res = await bulkImportApi(payload);
      const count = res?.count ?? res?.items?.length ?? importedItems.length;
      showToast(`Successfully imported ${count} category(s)!`);
      await loadData();
    } catch (err: any) {
      console.error("Bulk import Categories error:", err);
      showToast(err?.message || "Failed to bulk import categories");
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
        title="Categories"
        subtitle="Manage website categories, icons, hierarchy, and display ordering."
        badge={`${items.length} Categories`}
        btn={
          <Link
            href="/admin/category/create"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary-hover text-white text-sm font-semibold rounded-lg shadow-sm shadow-primary/20 transition-all active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" /> Create Category
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
        searchPlaceholder="Search Categories by name, slug or description..."
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
          ...(categoryTypes.length > 0
            ? [
                {
                  id: "type-filter",
                  value: typeFilter,
                  onChange: (val: string) => {
                    setTypeFilter(val);
                    setCurrentPage(1);
                  },
                  minWidth: "140px",
                  options: [
                    { label: "Type: All", value: "all" },
                    ...categoryTypes.map((t) => ({ label: t.name, value: t.id })),
                  ],
                },
              ]
            : []),
        ]}
        sort={{
          value: sortFilter,
          onChange: setSortFilter,
          minWidth: "140px",
          options: [
            { label: "Sort: Newest", value: "newest" },
            { label: "Sort: Oldest", value: "oldest" },
            { label: "Order: Ascending", value: "order_asc" },
            { label: "Name: A-Z", value: "name_asc" },
          ],
        }}
        onImportClick={() => setIsImportModalOpen(true)}
        exportOptions={[
          {
            id: "all_json",
            label: "All Categories (JSON)",
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
              {selectedIds.size} {selectedIds.size === 1 ? "Category" : "Categories"} selected
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
              <span className="text-xs font-medium">Loading Category records...</span>
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
                  <th scope="col" className="py-3.5 px-3 min-w-36">Category Type</th>
                  <th scope="col" className="py-3.5 px-3 min-w-24">Order</th>
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
                        <Folder className="w-6 h-6" />
                      </div>
                      <h3 className="text-base font-semibold text-heading">No Categories found</h3>
                      <p className="text-xs text-muted max-w-sm mx-auto mt-1 mb-5">
                        No records match your search query or filter. Try resetting them or upload a JSON backup.
                      </p>
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => {
                            setSearchQuery("");
                            setStatusFilter("all");
                            setTypeFilter("all");
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
                              <Folder className="w-4 h-4" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div
                                className="font-semibold text-heading text-sm hover:text-primary transition-colors truncate"
                                title={item.name}
                              >
                                {item.name}
                              </div>
                              <div className="text-xs text-muted font-mono truncate">
                                /{item.slug || "—"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-3">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-surface-alt text-heading border border-border">
                            <Tag className="w-3 h-3 text-primary" />
                            {item.category_type?.name || "General"}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-xs font-mono text-heading">
                          {item.order ?? 0}
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
                                label: "Edit Category",
                                icon: <Edit className="w-3.5 h-3.5 text-muted" />,
                                onClick: () => window.location.href = `/admin/category/${item.id}/edit`,
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
                                label: "Delete Category",
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
      <CategoryQuickViewDrawer
        category={drawerItem}
        onClose={() => setDrawerItem(null)}
      />

      {/* Universal Reusable Bulk Import Modal */}
      <BulkImportModal<CategoryFormValues>
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        title="Import Categories"
        subtitle="Bulk upload Category records conforming to the"
        badgeText="CategoryFormValues"
        sampleFileName="apearix_categories_sample.json"
        sampleData={SAMPLE_CATEGORY_IMPORT}
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
