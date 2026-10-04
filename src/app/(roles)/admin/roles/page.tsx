"use client";

import React, { useState, useMemo, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Plus,
  CheckCircle,
  Trash2,
  Eye,
  Edit,
  ShieldCheck,
  Users,
  X,
  Loader2,
} from "lucide-react";
import { PageHeader } from "@/components/admin/common/PageHeader";
import { TablePagination } from "@/components/admin/common/TablePagination";
import { TableToolbar } from "@/components/admin/common/TableToolbar";
import { BulkImportModal } from "@/components/admin/common/BulkImportModal";
import { formatDateInTimezone } from "@/lib/timezone";
import { RoleQuickViewDrawer } from "@/components/admin/drawer/RoleQuickViewDrawer";
import { ActionMenu } from "@/components/admin/common/ActionMenu";
import { type RoleFormValues } from "@/schemas/role.schema";
import {
  index as fetchRolesApi,
  destroy as deleteRoleApi,
  bulkDelete as bulkDeleteApi,
  bulkImport as bulkImportApi,
} from "@/lib/services/admin/roles";

const SAMPLE_ROLE_IMPORT = [
  {
    name: "Editor",
    slug: "editor",
    is_manual_slug: false,
    description: "Can create, edit and publish articles and media content.",
  },
];

export default function AdminRolesPage() {
  const [roles, setRoles] = useState<RoleFormValues[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [sortFilter, setSortFilter] = useState<string>("newest");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // Modals & Panels
  const [drawerRole, setDrawerRole] = useState<RoleFormValues | null>(null);
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

  const loadRoles = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetchRolesApi();
      setRoles(res.items);
    } catch (error) {
      console.error("Error loading roles:", error);
      showToast("Failed to load roles list from server.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRoles();
  }, [loadRoles]);

  const filteredRoles = useMemo(() => {
    return roles
      .filter((r) => {
        if (searchQuery.trim() !== "") {
          const q = searchQuery.toLowerCase().trim();
          const matchName = (r.name || "").toLowerCase().includes(q);
          const matchSlug = (r.slug || "").toLowerCase().includes(q);
          const matchDesc = (r.description || "").toLowerCase().includes(q);
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
  }, [roles, searchQuery, sortFilter]);

  const totalItems = filteredRoles.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const validCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (validCurrentPage - 1) * pageSize;
  const paginatedRoles = filteredRoles.slice(startIndex, startIndex + pageSize);

  const allFilteredSelected =
    paginatedRoles.length > 0 && paginatedRoles.every((r) => selectedIds.has(r.id!));
  const isIndeterminate =
    paginatedRoles.some((r) => selectedIds.has(r.id!)) && !allFilteredSelected;

  const toggleSelectAll = (checked: boolean) => {
    const next = new Set(selectedIds);
    if (checked) paginatedRoles.forEach((r) => next.add(r.id!));
    else paginatedRoles.forEach((r) => next.delete(r.id!));
    setSelectedIds(next);
  };

  const toggleSelectOne = (id: string, checked: boolean) => {
    const next = new Set(selectedIds);
    if (checked) next.add(id);
    else next.delete(id);
    setSelectedIds(next);
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    if (window.confirm(`Are you sure you want to delete ${selectedIds.size} selected role(s)?`)) {
      try {
        await bulkDeleteApi(Array.from(selectedIds));
        showToast(`Deleted ${selectedIds.size} role(s)`);
        setSelectedIds(new Set());
        await loadRoles();
      } catch (error: any) {
        showToast(error?.message || "Failed to delete selected roles");
      }
    }
  };

  const deleteSingleRole = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this role?")) {
      try {
        await deleteRoleApi(id);
        if (drawerRole?.id === id) setDrawerRole(null);
        showToast("Role deleted");
        await loadRoles();
      } catch (error: any) {
        showToast(error?.message || "Failed to delete role");
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
    let target: RoleFormValues[] = [];
    if (type === "all_json") target = roles;
    else if (type === "filtered_json") target = filteredRoles;
    else if (type === "selected_json") target = roles.filter((r) => selectedIds.has(r.id!));
    else if (type === "csv") target = filteredRoles;

    if (target.length === 0) {
      showToast("No roles available to export");
      return;
    }

    if (type === "csv") {
      const headers = ["Role Name", "Slug", "Description", "Assigned Users", "Created At"];
      const rows = target.map((r) => [
        `"${(r.name || "").replace(/"/g, '""')}"`,
        `"${r.slug || ""}"`,
        `"${(r.description || "").replace(/"/g, '""')}"`,
        `"${r.users_count || 0}"`,
        `"${r.created_at || ""}"`,
      ]);
      const csvStr = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
      const blob = new Blob([csvStr], { type: "text/csv;charset=utf-8;" });
      downloadFile(blob, `apearix_roles_${new Date().toISOString().slice(0, 10)}.csv`);
      showToast(`Exported ${target.length} role(s) as CSV`);
    } else {
      const cleanJson = target.map(({ id, updated_at, created_at, ...clean }) => clean);
      const jsonStr = JSON.stringify(cleanJson, null, 2);
      const blob = new Blob([jsonStr], { type: "application/json" });
      downloadFile(blob, `apearix_roles_${type}_${new Date().toISOString().slice(0, 10)}.json`);
      showToast(`Exported ${target.length} role(s) as JSON`);
    }
  };

  const validateRoleRow = (item: any, index: number) => {
    const warnings: string[] = [];
    const errors: string[] = [];

    if (!item.name || typeof item.name !== "string" || item.name.trim() === "") {
      errors.push("Missing role name");
    }

    let slug = item.slug;
    if (!slug || typeof slug !== "string") {
      if (item.name) {
        slug = item.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
        warnings.push("Auto-slugged");
      } else {
        errors.push("No slug/name");
      }
    }

    const isValid = errors.length === 0;
    const remarks = isValid ? (warnings.length > 0 ? warnings.join(", ") : "Valid") : errors.join(", ");

    const roleData: RoleFormValues = {
      name: item.name || "Custom Role",
      slug: slug || "custom-role",
      is_manual_slug: item.is_manual_slug !== undefined ? Boolean(item.is_manual_slug) : true,
      description: item.description || "",
    };

    return {
      data: roleData,
      isValid,
      remarks,
    };
  };

  const handleImportCommit = async (importedRoles: RoleFormValues[]) => {
    try {
      const payload = importedRoles.map((r) => ({
        name: r.name,
        slug: r.slug,
        is_manual_slug: r.is_manual_slug,
        description: r.description,
      }));

      const res = await bulkImportApi(payload);
      const count = res?.count ?? res?.items?.length ?? importedRoles.length;
      showToast(`Successfully imported ${count} role(s)!`);
      await loadRoles();
    } catch (err: any) {
      console.error("Bulk import roles error:", err);
      showToast(err?.message || "Failed to bulk import roles");
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
        title="Roles"
        subtitle="Manage access roles, permissions, and assigned system duties."
        badge={`${roles.length} Roles`}
        btn={
          <Link
            href="/admin/roles/create"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary-hover text-white text-sm font-semibold rounded-lg shadow-sm shadow-primary/20 transition-all active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" /> Create Role
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
        searchPlaceholder="Search roles by name, slug or description..."
        sort={{
          value: sortFilter,
          onChange: setSortFilter,
          minWidth: "140px",
          options: [
            { label: "Sort: Newest", value: "newest" },
            { label: "Sort: Oldest", value: "oldest" },
            { label: "Name: A to Z", value: "name_asc" },
          ],
        }}
        onImportClick={() => setIsImportModalOpen(true)}
        exportOptions={[
          {
            id: "all_json",
            label: "All Roles (JSON)",
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
              {selectedIds.size} {selectedIds.size === 1 ? "role" : "roles"} selected
            </span>
          </div>

          <div className="flex items-center gap-2">
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
              <span className="text-xs font-medium">Loading user roles...</span>
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
                  <th scope="col" className="py-3.5 px-3 min-w-[240px]">Role</th>
                  <th scope="col" className="py-3.5 px-3 min-w-[280px]">Description</th>
                  <th scope="col" className="py-3.5 px-3 min-w-36">Assigned Users</th>
                  <th scope="col" className="py-3.5 px-3 min-w-30">Created</th>
                  <th scope="col" className="py-3.5 pr-4 pl-3 text-right w-16">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-sm">
                {paginatedRoles.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-16 px-4 text-center">
                      <div className="w-12 h-12 mx-auto rounded-2xl bg-primary-light text-primary flex items-center justify-center mb-3">
                        <ShieldCheck className="w-6 h-6" />
                      </div>
                      <h3 className="text-base font-semibold text-heading">No roles found</h3>
                      <p className="text-xs text-muted max-w-sm mx-auto mt-1 mb-5">
                        No user roles match your current search query. Try resetting filters or import batch roles.
                      </p>
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => {
                            setSearchQuery("");
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
                  paginatedRoles.map((role) => {
                    const isSelected = selectedIds.has(role.id!);
                    return (
                      <tr
                        key={role.id}
                        onClick={() => setDrawerRole(role)}
                        className={`group hover:bg-surface transition-colors cursor-pointer ${
                          isSelected ? "bg-primary-light/40 border-l-4 border-l-primary" : ""
                        }`}
                      >
                        <td className="py-3.5 pl-4 pr-2 w-10" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => toggleSelectOne(role.id!, e.target.checked)}
                            className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20 accent-primary cursor-pointer"
                          />
                        </td>
                        <td className="py-3.5 px-3 max-w-[240px]">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-primary-light border border-primary/20 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                              <ShieldCheck className="w-4 h-4" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div
                                className="font-semibold text-heading text-sm hover:text-primary transition-colors truncate"
                                title={role.name}
                              >
                                {role.name}
                              </div>
                              <div className="text-xs text-muted font-mono truncate">
                                {role.slug}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-3 max-w-[280px]">
                          <p className="text-xs text-muted line-clamp-2 leading-relaxed">
                            {role.description || "—"}
                          </p>
                        </td>
                        <td className="py-3.5 px-3">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-surface-alt text-heading border border-border">
                            <Users className="w-3 h-3 text-primary" />
                            {role.users_count ?? 0} Users
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-xs text-muted">
                          {role.created_at
                            ? formatDateInTimezone(role.created_at, undefined, { month: "short", day: "numeric", year: "numeric" })
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
                                onClick: () => window.location.href = `/admin/roles/${role.id}/edit`,
                              },
                              {
                                label: "Quick Preview",
                                icon: <Eye className="w-3.5 h-3.5 text-muted" />,
                                onClick: () => setDrawerRole(role),
                                dividerAfter: true,
                              },
                              {
                                label: "Delete Role",
                                icon: <Trash2 className="w-3.5 h-3.5" />,
                                variant: "danger" as const,
                                onClick: () => deleteSingleRole(role.id!),
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
      <RoleQuickViewDrawer
        role={drawerRole}
        onClose={() => setDrawerRole(null)}
      />

      {/* Universal Reusable Bulk Import Modal */}
      <BulkImportModal<RoleFormValues>
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        title="Import User Roles"
        subtitle="Bulk upload user roles conforming to the"
        badgeText="RoleFormValues"
        sampleFileName="apearix_roles_sample.json"
        sampleData={SAMPLE_ROLE_IMPORT}
        validateRow={validateRoleRow}
        previewColumns={[
          {
            header: "Role Name",
            render: (item) => item.name,
          },
          {
            header: "Slug",
            render: (item) => item.slug,
          },
          {
            header: "Description",
            render: (item) => item.description || "—",
          },
        ]}
        onCommit={handleImportCommit}
      />
    </main>
  );
}
