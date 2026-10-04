"use client";

import React, { useState, useMemo, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Plus,
  CheckCircle,
  Shield,
  Trash2,
  Eye,
  Edit,
  UserCheck,
  UserX,
  ShieldAlert,
  User as UserIcon,
  X,
  Loader2,
  Lock,
} from "lucide-react";
import { PageHeader } from "@/components/admin/common/PageHeader";
import { TablePagination } from "@/components/admin/common/TablePagination";
import { TableToolbar } from "@/components/admin/common/TableToolbar";
import { BulkImportModal } from "@/components/admin/common/BulkImportModal";
import { formatDateInTimezone } from "@/lib/timezone";
import { UserQuickViewDrawer } from "@/components/admin/drawer/UserQuickViewDrawer";
import { ActionMenu } from "@/components/admin/common/ActionMenu";
import { type UserStatus, type UserFormValues } from "@/schemas/user.schema";
import {
  index as fetchUsersApi,
  destroy as deleteUserApi,
  update as updateUserApi,
  bulkUpdateStatus as bulkUpdateStatusApi,
  bulkDelete as bulkDeleteApi,
  bulkImport as bulkImportApi,
  fetchRoles,
} from "@/lib/services/admin/users";

const SAMPLE_USER_IMPORT = [
  {
    first_name: "Rahul",
    last_name: "Sharma",
    email: "rahul.sharma@example.com",
    phone: "+919876543210",
    password: "Password@123",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
    dob: "1995-08-15",
    status: "active" as UserStatus,
    role_id: "",
  },
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserFormValues[]>([]);
  const [roles, setRoles] = useState<{ id: string; name: string; slug: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [sortFilter, setSortFilter] = useState<string>("newest");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // Modals & Panels
  const [drawerUser, setDrawerUser] = useState<UserFormValues | null>(null);
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

  const loadUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      const [resUsers, resRoles] = await Promise.all([
        fetchUsersApi(),
        fetchRoles(),
      ]);
      setUsers(resUsers.items);
      setRoles(resRoles);
    } catch (error) {
      console.error("Error loading users:", error);
      showToast("Failed to load users list from server.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const counts = useMemo(
    () => ({
      all: users.length,
      active: users.filter((u) => u.status === "active").length,
      inactive: users.filter((u) => u.status === "inactive").length,
      suspended: users.filter((u) => u.status === "suspended").length,
      blocked: users.filter((u) => u.status === "blocked").length,
    }),
    [users]
  );

  const filteredUsers = useMemo(() => {
    return users
      .filter((u) => {
        if (statusFilter !== "all" && u.status !== statusFilter) return false;
        if (roleFilter !== "all") {
          const userRoleId = u.role_id || u.role?.id;
          if (userRoleId !== roleFilter) return false;
        }
        if (searchQuery.trim() !== "") {
          const q = searchQuery.toLowerCase().trim();
          const fullName = `${u.first_name || ""} ${u.last_name || ""}`.toLowerCase();
          const matchName = fullName.includes(q);
          const matchEmail = (u.email || "").toLowerCase().includes(q);
          const matchPhone = (u.phone || "").toLowerCase().includes(q);
          const matchRole = (u.role?.name || "").toLowerCase().includes(q);
          if (!matchName && !matchEmail && !matchPhone && !matchRole) return false;
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
          const nameA = `${a.first_name || ""} ${a.last_name || ""}`.trim();
          const nameB = `${b.first_name || ""} ${b.last_name || ""}`.trim();
          return nameA.localeCompare(nameB);
        }
        return 0;
      });
  }, [users, statusFilter, roleFilter, searchQuery, sortFilter]);

  const totalItems = filteredUsers.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const validCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (validCurrentPage - 1) * pageSize;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + pageSize);

  const allFilteredSelected =
    paginatedUsers.length > 0 && paginatedUsers.every((u) => selectedIds.has(u.id!));
  const isIndeterminate =
    paginatedUsers.some((u) => selectedIds.has(u.id!)) && !allFilteredSelected;

  const toggleSelectAll = (checked: boolean) => {
    const next = new Set(selectedIds);
    if (checked) paginatedUsers.forEach((u) => next.add(u.id!));
    else paginatedUsers.forEach((u) => next.delete(u.id!));
    setSelectedIds(next);
  };

  const toggleSelectOne = (id: string, checked: boolean) => {
    const next = new Set(selectedIds);
    if (checked) next.add(id);
    else next.delete(id);
    setSelectedIds(next);
  };

  const handleBulkStatusChange = async (newStatus: UserStatus) => {
    if (selectedIds.size === 0) return;
    try {
      await bulkUpdateStatusApi(Array.from(selectedIds), newStatus);
      showToast(`Updated ${selectedIds.size} user(s) to ${newStatus}`);
      setSelectedIds(new Set());
      await loadUsers();
    } catch (error: any) {
      showToast(error?.message || "Failed to update bulk status");
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    if (window.confirm(`Are you sure you want to delete ${selectedIds.size} selected user(s)?`)) {
      try {
        await bulkDeleteApi(Array.from(selectedIds));
        showToast(`Deleted ${selectedIds.size} user(s)`);
        setSelectedIds(new Set());
        await loadUsers();
      } catch (error: any) {
        showToast(error?.message || "Failed to delete selected users");
      }
    }
  };

  const updateSingleStatus = async (id: string, status: UserStatus) => {
    const item = users.find((u) => u.id === id);
    if (!item) return;
    try {
      await updateUserApi(id, {
        id,
        first_name: item.first_name,
        last_name: item.last_name,
        email: item.email,
        status,
        role_id: item.role_id || item.role?.id || roles[0]?.id || "",
      });
      showToast(`User status updated to ${status}`);
      await loadUsers();
    } catch (error: any) {
      showToast(error?.message || "Failed to update status");
    }
  };

  const deleteSingleUser = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this user account?")) {
      try {
        await deleteUserApi(id);
        if (drawerUser?.id === id) setDrawerUser(null);
        showToast("User account deleted");
        await loadUsers();
      } catch (error: any) {
        showToast(error?.message || "Failed to delete user account");
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
    let target: UserFormValues[] = [];
    if (type === "all_json") target = users;
    else if (type === "filtered_json") target = filteredUsers;
    else if (type === "selected_json") target = users.filter((u) => selectedIds.has(u.id!));
    else if (type === "csv") target = filteredUsers;

    if (target.length === 0) {
      showToast("No users available to export");
      return;
    }

    if (type === "csv") {
      const headers = ["First Name", "Last Name", "Email", "Phone", "Role", "Status", "Date of Birth", "Created At"];
      const rows = target.map((u) => [
        `"${(u.first_name || "").replace(/"/g, '""')}"`,
        `"${(u.last_name || "").replace(/"/g, '""')}"`,
        `"${u.email || ""}"`,
        `"${u.phone || ""}"`,
        `"${u.role?.name || ""}"`,
        `"${u.status || ""}"`,
        `"${u.dob || ""}"`,
        `"${u.created_at || ""}"`,
      ]);
      const csvStr = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
      const blob = new Blob([csvStr], { type: "text/csv;charset=utf-8;" });
      downloadFile(blob, `apearix_users_${new Date().toISOString().slice(0, 10)}.csv`);
      showToast(`Exported ${target.length} user(s) as CSV`);
    } else {
      const cleanJson = target.map(({ id, updated_at, created_at, ...clean }) => clean);
      const jsonStr = JSON.stringify(cleanJson, null, 2);
      const blob = new Blob([jsonStr], { type: "application/json" });
      downloadFile(blob, `apearix_users_${type}_${new Date().toISOString().slice(0, 10)}.json`);
      showToast(`Exported ${target.length} user(s) as JSON`);
    }
  };

  const validateUserRow = (item: any, index: number) => {
    const warnings: string[] = [];
    const errors: string[] = [];

    if (!item.first_name || typeof item.first_name !== "string" || item.first_name.trim() === "") {
      errors.push("Missing first name");
    }

    if (!item.email || typeof item.email !== "string" || !item.email.includes("@")) {
      errors.push("Invalid email address");
    }

    let status: UserStatus = item.status || "active";
    if (!["active", "inactive", "suspended", "blocked"].includes(status)) {
      warnings.push(`Status '${status}' mapped to active`);
      status = "active";
    }

    const defaultRoleId = roles[0]?.id || "";
    const roleId = item.role_id || defaultRoleId;

    const isValid = errors.length === 0;
    const remarks = isValid ? (warnings.length > 0 ? warnings.join(", ") : "Valid") : errors.join(", ");

    const userData: UserFormValues = {
      first_name: item.first_name || "User",
      last_name: item.last_name || "",
      email: item.email || "",
      phone: item.phone || "",
      password: item.password || "Password@123",
      avatar: item.avatar || "",
      dob: item.dob || "",
      status,
      role_id: roleId,
    };

    return {
      data: userData,
      isValid,
      remarks,
    };
  };

  const handleImportCommit = async (importedUsers: UserFormValues[]) => {
    try {
      const payload = importedUsers.map((u) => ({
        first_name: u.first_name,
        last_name: u.last_name,
        email: u.email,
        phone: u.phone,
        password: u.password || "Password@123",
        avatar: u.avatar,
        dob: u.dob,
        status: u.status,
        role_id: u.role_id || roles[0]?.id || "",
      }));

      const res = await bulkImportApi(payload);
      const count = res?.count ?? res?.items?.length ?? importedUsers.length;
      showToast(`Successfully imported ${count} user account(s)!`);
      await loadUsers();
    } catch (err: any) {
      console.error("Bulk import users error:", err);
      showToast(err?.message || "Failed to bulk import users");
    }
  };

  const renderStatusBadge = (status?: string) => {
    switch (status) {
      case "active":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Active
          </span>
        );
      case "inactive":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Inactive
          </span>
        );
      case "suspended":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-50 text-orange-700 border border-orange-200">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span> Suspended
          </span>
        );
      case "blocked":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span> Blocked
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span> Active
          </span>
        );
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
        title="Users"
        subtitle="Manage user profiles, roles, account statuses, and permissions."
        badge={`${users.length} Users`}
        btn={
          <Link
            href="/admin/users/create"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary-hover text-white text-sm font-semibold rounded-lg shadow-sm shadow-primary/20 transition-all active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" /> Create User
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
        searchPlaceholder="Search users by name, email, phone or role..."
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
              { label: `Suspended (${counts.suspended})`, value: "suspended" },
              { label: `Blocked (${counts.blocked})`, value: "blocked" },
            ],
          },
          {
            id: "role-filter",
            value: roleFilter,
            onChange: (val) => {
              setRoleFilter(val);
              setCurrentPage(1);
            },
            minWidth: "140px",
            options: [
              { label: "Role: All", value: "all" },
              ...roles.map((r) => ({
                label: r.name,
                value: r.id,
              })),
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
            { label: "Name: A to Z", value: "name_asc" },
          ],
        }}
        onImportClick={() => setIsImportModalOpen(true)}
        exportOptions={[
          {
            id: "all_json",
            label: "All Users (JSON)",
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
              {selectedIds.size} {selectedIds.size === 1 ? "user" : "users"} selected
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleBulkStatusChange("active")}
              className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium text-white transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <UserCheck className="w-3.5 h-3.5 text-emerald-400" /> Active
            </button>
            <button
              onClick={() => handleBulkStatusChange("inactive")}
              className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium text-white transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <UserX className="w-3.5 h-3.5 text-amber-300" /> Inactive
            </button>
            <button
              onClick={() => handleBulkStatusChange("blocked")}
              className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium text-white transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 text-rose-400" /> Block
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
              <span className="text-xs font-medium">Loading user accounts...</span>
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
                  <th scope="col" className="py-3.5 px-3 min-w-[280px]">User Account</th>
                  <th scope="col" className="py-3.5 px-3 min-w-36">Role</th>
                  <th scope="col" className="py-3.5 px-3 min-w-32.5">Status</th>
                  <th scope="col" className="py-3.5 px-3 min-w-36">Phone</th>
                  <th scope="col" className="py-3.5 px-3 min-w-30">Created</th>
                  <th scope="col" className="py-3.5 pr-4 pl-3 text-right w-16">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-sm">
                {paginatedUsers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-16 px-4 text-center">
                      <div className="w-12 h-12 mx-auto rounded-2xl bg-primary-light text-primary flex items-center justify-center mb-3">
                        <UserIcon className="w-6 h-6" />
                      </div>
                      <h3 className="text-base font-semibold text-heading">No users found</h3>
                      <p className="text-xs text-muted max-w-sm mx-auto mt-1 mb-5">
                        No user accounts match your current search or filter criteria. Try resetting filters or import batch data.
                      </p>
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => {
                            setSearchQuery("");
                            setStatusFilter("all");
                            setRoleFilter("all");
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
                  paginatedUsers.map((user) => {
                    const isSelected = selectedIds.has(user.id!);
                    const fullName = `${user.first_name || ""} ${user.last_name || ""}`.trim() || user.email;
                    return (
                      <tr
                        key={user.id}
                        onClick={() => setDrawerUser(user)}
                        className={`group hover:bg-surface transition-colors cursor-pointer ${
                          isSelected ? "bg-primary-light/40 border-l-4 border-l-primary" : ""
                        }`}
                      >
                        <td className="py-3.5 pl-4 pr-2 w-10" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => toggleSelectOne(user.id!, e.target.checked)}
                            className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20 accent-primary cursor-pointer"
                          />
                        </td>
                        <td className="py-3.5 px-3 max-w-[280px]">
                          <div className="flex items-center gap-3">
                            {user.avatar ? (
                              <img
                                src={user.avatar}
                                alt={fullName}
                                className="w-9 h-9 rounded-full object-cover border border-border shrink-0 shadow-sm"
                              />
                            ) : (
                              <div className="w-9 h-9 rounded-full bg-primary-light border border-primary/20 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                                {user.first_name ? user.first_name.charAt(0).toUpperCase() : "U"}
                              </div>
                            )}
                            <div className="min-w-0 flex-1">
                              <div
                                className="font-semibold text-heading text-sm hover:text-primary transition-colors truncate"
                                title={fullName}
                              >
                                {fullName}
                              </div>
                              <div className="text-xs text-muted font-mono truncate">
                                {user.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-3">
                          <div className="inline-flex items-center gap-1.5 text-xs text-heading font-medium">
                            <Shield className="w-3.5 h-3.5 text-primary" />
                            <span>{user.role?.name || "User"}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-3">
                          {renderStatusBadge(user.status)}
                        </td>
                        <td className="py-3.5 px-3 text-xs text-heading">
                          {user.phone || "—"}
                        </td>
                        <td className="py-3.5 px-3 text-xs text-muted">
                          {user.created_at
                            ? formatDateInTimezone(user.created_at, undefined, { month: "short", day: "numeric", year: "numeric" })
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
                                label: "Edit Profile",
                                icon: <Edit className="w-3.5 h-3.5 text-muted" />,
                                onClick: () => window.location.href = `/admin/users/${user.id}/edit`,
                              },
                              {
                                label: "Quick Preview",
                                icon: <Eye className="w-3.5 h-3.5 text-muted" />,
                                onClick: () => setDrawerUser(user),
                                dividerAfter: true,
                              },
                              ...(user.status !== "active"
                                ? [
                                    {
                                      label: "Set Active",
                                      icon: <UserCheck className="w-3.5 h-3.5 text-emerald-600" />,
                                      variant: "success" as const,
                                      onClick: () => updateSingleStatus(user.id!, "active"),
                                    },
                                  ]
                                : []),
                              ...(user.status !== "inactive"
                                ? [
                                    {
                                      label: "Set Inactive",
                                      icon: <UserX className="w-3.5 h-3.5 text-amber-600" />,
                                      variant: "warning" as const,
                                      onClick: () => updateSingleStatus(user.id!, "inactive"),
                                    },
                                  ]
                                : []),
                              ...(user.status !== "suspended"
                                ? [
                                    {
                                      label: "Suspend User",
                                      icon: <ShieldAlert className="w-3.5 h-3.5 text-orange-600" />,
                                      variant: "warning" as const,
                                      onClick: () => updateSingleStatus(user.id!, "suspended"),
                                    },
                                  ]
                                : []),
                              ...(user.status !== "blocked"
                                ? [
                                    {
                                      label: "Block User",
                                      icon: <Lock className="w-3.5 h-3.5 text-rose-600" />,
                                      variant: "danger" as const,
                                      onClick: () => updateSingleStatus(user.id!, "blocked"),
                                      dividerAfter: true,
                                    },
                                  ]
                                : [{ label: "", onClick: () => {}, dividerAfter: true }]),
                              {
                                label: "Delete User",
                                icon: <Trash2 className="w-3.5 h-3.5" />,
                                variant: "danger" as const,
                                onClick: () => deleteSingleUser(user.id!),
                              },
                            ].filter((item) => item.label !== "")}
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
      <UserQuickViewDrawer
        user={drawerUser}
        onClose={() => setDrawerUser(null)}
      />

      {/* Universal Reusable Bulk Import Modal */}
      <BulkImportModal<UserFormValues>
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        title="Import User Accounts"
        subtitle="Bulk upload user accounts conforming to the"
        badgeText="UserFormValues"
        sampleFileName="apearix_users_sample.json"
        sampleData={SAMPLE_USER_IMPORT}
        validateRow={validateUserRow}
        previewColumns={[
          {
            header: "First Name",
            render: (item) => item.first_name,
          },
          {
            header: "Email",
            render: (item) => item.email,
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
