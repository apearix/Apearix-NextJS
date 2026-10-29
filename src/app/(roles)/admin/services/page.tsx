"use client";

import React, { useState, useMemo, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Plus,
  CheckCircle,
  Trash2,
  Eye,
  Copy,
  Edit,
  ExternalLink,
  Layers,
  Tag,
  Check,
  XCircle,
  X,
  Loader2,
  Code,
  Shield,
  Cpu,
  Smartphone,
  Cloud,
  Database,
  Zap,
  Sparkles,
  Server,
  Layout,
  ImageIcon,
} from "lucide-react";
import { PageHeader } from "@/components/admin/common/PageHeader";
import { TablePagination } from "@/components/admin/common/TablePagination";
import { TableToolbar } from "@/components/admin/common/TableToolbar";
import { BulkImportModal } from "@/components/admin/common/BulkImportModal";
import { formatDateInTimezone } from "@/lib/timezone";
import { ServiceQuickViewDrawer } from "@/components/admin/drawer/ServiceQuickViewDrawer";
import { ActionMenu } from "@/components/admin/common/ActionMenu";
import { type ServiceFormValues } from "@/schemas/service.schema";
import {
  index as fetchServicesApi,
  destroy as deleteServiceApi,
  update as updateServiceApi,
  store as createServiceApi,
  bulkUpdateStatus as bulkUpdateStatusApi,
  bulkDelete as bulkDeleteApi,
  bulkImport as bulkImportApi,
  fetchServiceCategories,
} from "@/lib/services/admin/services";

function renderServiceIcon(name?: string) {
  const iconLower = (name || "").toLowerCase().trim();
  const iconProps = { className: "w-4 h-4 text-primary" };

  switch (iconLower) {
    case "code":
      return <Code {...iconProps} />;
    case "shield":
      return <Shield {...iconProps} />;
    case "cpu":
      return <Cpu {...iconProps} />;
    case "smartphone":
      return <Smartphone {...iconProps} />;
    case "cloud":
      return <Cloud {...iconProps} />;
    case "database":
      return <Database {...iconProps} />;
    case "zap":
      return <Zap {...iconProps} />;
    case "sparkles":
      return <Sparkles {...iconProps} />;
    case "server":
      return <Server {...iconProps} />;
    case "layout":
    default:
      return <Layers {...iconProps} />;
  }
}

const SAMPLE_SERVICE_IMPORT = [
  {
    title: "AI Automation & Systems Engineering",
    slug: "ai-automation-systems-engineering",
    is_manual_slug: false,
    icon: "sparkles",
    excerpt: "Custom LLM agents, automated workflow pipelines, and enterprise AI integrations.",
    description: "Detailed end-to-end autonomous agent architectures and production deployments.",
    category_id: "",
    order: 1,
    is_active: true,
    seo: {
      meta_title: "AI Automation & Systems Engineering",
      meta_description: "Custom LLM agents and enterprise AI integrations.",
      canonical_url: "https://apearix.com/services/ai-automation-systems-engineering",
    },
  },
];

export default function AdminServicesPage() {
  const [services, setServices] = useState<ServiceFormValues[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [sortFilter, setSortFilter] = useState<string>("newest");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // Modals & Panels
  const [drawerService, setDrawerService] = useState<ServiceFormValues | null>(null);
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

  const loadServices = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetchServicesApi();
      setServices(res.items);
    } catch (error) {
      console.error("Error loading services:", error);
      showToast("Failed to load services from server.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadServices();
  }, [loadServices]);

  const categoriesList = useMemo(() => {
    const set = new Set<string>();
    services.forEach((s) => {
      const catName = s.category?.name;
      if (catName) set.add(catName);
    });
    return Array.from(set);
  }, [services]);

  const counts = useMemo(
    () => ({
      all: services.length,
      active: services.filter((s) => s.is_active).length,
      inactive: services.filter((s) => !s.is_active).length,
    }),
    [services]
  );

  const filteredServices = useMemo(() => {
    return services
      .filter((s) => {
        if (statusFilter === "active" && !s.is_active) return false;
        if (statusFilter === "inactive" && s.is_active) return false;
        if (categoryFilter !== "all" && s.category?.name !== categoryFilter) return false;

        if (searchQuery.trim() !== "") {
          const q = searchQuery.toLowerCase().trim();
          const matchTitle = (s.title || "").toLowerCase().includes(q);
          const matchSlug = (s.slug || "").toLowerCase().includes(q);
          const matchExcerpt = (s.excerpt || "").toLowerCase().includes(q);
          const matchCat = (s.category?.name || "").toLowerCase().includes(q);
          if (!matchTitle && !matchSlug && !matchExcerpt && !matchCat) return false;
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
  }, [services, statusFilter, categoryFilter, searchQuery, sortFilter]);

  const totalItems = filteredServices.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const validCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (validCurrentPage - 1) * pageSize;
  const paginatedServices = filteredServices.slice(startIndex, startIndex + pageSize);

  const allFilteredSelected =
    paginatedServices.length > 0 && paginatedServices.every((s) => selectedIds.has(s.id!));
  const isIndeterminate =
    paginatedServices.some((s) => selectedIds.has(s.id!)) && !allFilteredSelected;

  const toggleSelectAll = (checked: boolean) => {
    const next = new Set(selectedIds);
    if (checked) paginatedServices.forEach((s) => next.add(s.id!));
    else paginatedServices.forEach((s) => next.delete(s.id!));
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
      showToast(`Updated ${selectedIds.size} services to ${isActive ? "Active" : "Inactive"}`);
      setSelectedIds(new Set());
      await loadServices();
    } catch (error: any) {
      showToast(error?.message || "Failed to update bulk status");
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    if (window.confirm(`Are you sure you want to delete ${selectedIds.size} selected service(s)?`)) {
      try {
        await bulkDeleteApi(Array.from(selectedIds));
        showToast(`Deleted ${selectedIds.size} services`);
        setSelectedIds(new Set());
        await loadServices();
      } catch (error: any) {
        showToast(error?.message || "Failed to delete selected services");
      }
    }
  };

  const updateSingleStatus = async (id: string, isActive: boolean) => {
    const item = services.find((s) => s.id === id);
    if (!item) return;
    try {
      await updateServiceApi(id, {
        id,
        title: item.title,
        slug: item.slug,
        is_active: isActive,
      });
      showToast(`Service status updated to ${isActive ? "Active" : "Inactive"}`);
      await loadServices();
    } catch (error: any) {
      showToast(error?.message || "Failed to update status");
    }
  };

  const duplicateSingleService = async (id: string) => {
    const item = services.find((s) => s.id === id);
    if (!item) return;
    try {
      await createServiceApi({
        title: `${item.title} (Copy)`,
        slug: `${item.slug}-copy`,
        is_manual_slug: true,
        category_id: item.category_id || "",
        icon: item.icon || "layout",
        featured_image: item.featured_image || "",
        excerpt: item.excerpt || "",
        description: item.description || "",
        order: (item.order ?? 0) + 1,
        is_active: false,
        seo: item.seo,
      });
      showToast(`Duplicated: "${item.title}"`);
      await loadServices();
    } catch (error: any) {
      showToast(error?.message || "Failed to duplicate service");
    }
  };

  const deleteSingleService = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      try {
        await deleteServiceApi(id);
        if (drawerService?.id === id) setDrawerService(null);
        showToast("Service deleted");
        await loadServices();
      } catch (error: any) {
        showToast(error?.message || "Failed to delete service");
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
    let target: ServiceFormValues[] = [];
    if (type === "all_json") target = services;
    else if (type === "filtered_json") target = filteredServices;
    else if (type === "selected_json") target = services.filter((s) => selectedIds.has(s.id!));
    else if (type === "csv") target = filteredServices;

    if (target.length === 0) {
      showToast("No services available to export");
      return;
    }

    if (type === "csv") {
      const headers = ["Title", "Slug", "Category", "Icon", "Status", "Order", "Excerpt", "Created At"];
      const rows = target.map((s) => [
        `"${(s.title || "").replace(/"/g, '""')}"`,
        `"${s.slug || ""}"`,
        `"${(s.category?.name || "").replace(/"/g, '""')}"`,
        `"${s.icon || ""}"`,
        `"${s.is_active ? "Active" : "Inactive"}"`,
        `"${s.order ?? 0}"`,
        `"${(s.excerpt || "").replace(/"/g, '""')}"`,
        `"${s.created_at || ""}"`,
      ]);
      const csvStr = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
      const blob = new Blob([csvStr], { type: "text/csv;charset=utf-8;" });
      downloadFile(blob, `apearix_services_${new Date().toISOString().slice(0, 10)}.csv`);
      showToast(`Exported ${target.length} services as CSV`);
    } else {
      const cleanJson = target.map(({ id, updated_at, ...clean }) => clean);
      const jsonStr = JSON.stringify(cleanJson, null, 2);
      const blob = new Blob([jsonStr], { type: "application/json" });
      downloadFile(blob, `apearix_services_${type}_${new Date().toISOString().slice(0, 10)}.json`);
      showToast(`Exported ${target.length} services as JSON`);
    }
  };

  const validateServiceRow = (item: any) => {
    const warnings: string[] = [];
    const errors: string[] = [];

    if (!item.title || typeof item.title !== "string" || item.title.trim() === "") {
      errors.push("Missing service title");
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

    const isValid = errors.length === 0;
    const remarks = isValid ? (warnings.length > 0 ? warnings.join(", ") : "Valid") : errors.join(", ");

    const serviceData: ServiceFormValues = {
      title: item.title || "Untitled Service",
      slug: slug || "untitled-service",
      is_manual_slug: item.is_manual_slug !== undefined ? Boolean(item.is_manual_slug) : true,
      category_id: item.category_id || "",
      icon: item.icon || "layout",
      featured_image: item.featured_image || "",
      excerpt: item.excerpt || "",
      description: item.description || "",
      order: item.order !== undefined ? Number(item.order) : 0,
      is_active: item.is_active !== undefined ? Boolean(item.is_active) : true,
      seo: {
        meta_title: item.seo?.meta_title || item.title || "",
        meta_description: item.seo?.meta_description || item.excerpt || "",
        canonical_url: item.seo?.canonical_url || `https://apearix.com/services/${slug}`,
      },
    };

    return {
      data: serviceData,
      isValid,
      remarks,
    };
  };

  const handleImportCommit = async (importedServices: ServiceFormValues[]) => {
    try {
      const payload = importedServices.map((service) => ({
        title: service.title,
        slug: service.slug,
        is_manual_slug: service.is_manual_slug,
        category_id: service.category_id || "",
        icon: service.icon || "layout",
        featured_image: service.featured_image || "",
        excerpt: service.excerpt || "",
        description: service.description || "",
        order: service.order ?? 0,
        is_active: service.is_active !== undefined ? service.is_active : true,
        seo: service.seo,
      }));

      const res = await bulkImportApi(payload);
      const count = res?.count ?? res?.items?.length ?? importedServices.length;
      showToast(`Successfully imported ${count} service(s)!`);
      await loadServices();
    } catch (err: any) {
      console.error("Bulk import services error:", err);
      showToast(err?.message || "Failed to bulk import services");
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
        title="Services"
        subtitle="Manage, publish, bulk import and organize your agency service offerings."
        badge={`${services.length} Services`}
        btn={
          <Link
            href="/admin/services/create"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary-hover text-white text-sm font-semibold rounded-lg shadow-sm shadow-primary/20 transition-all active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" /> Create Service
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
        searchPlaceholder="Search services by title, slug, excerpt or category..."
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
          {
            id: "category-filter",
            value: categoryFilter,
            onChange: (val) => {
              setCategoryFilter(val);
              setCurrentPage(1);
            },
            minWidth: "140px",
            options: [
              { label: "Category: All", value: "all" },
              ...categoriesList.map((cat) => ({
                label: cat,
                value: cat,
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
            { label: "Title: A to Z", value: "title_asc" },
            { label: "Order: Ascending", value: "order_asc" },
          ],
        }}
        onImportClick={() => setIsImportModalOpen(true)}
        exportOptions={[
          {
            id: "all_json",
            label: "All Services (JSON)",
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
              {selectedIds.size} {selectedIds.size === 1 ? "service" : "services"} selected
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
              <span className="text-xs font-medium">Loading services...</span>
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
                  <th scope="col" className="py-3.5 px-3 min-w-[320px]">Service</th>
                  <th scope="col" className="py-3.5 px-3 min-w-36">Category</th>
                  <th scope="col" className="py-3.5 px-3 min-w-24">Order</th>
                  <th scope="col" className="py-3.5 px-3 min-w-32.5">Status</th>
                  <th scope="col" className="py-3.5 px-3 min-w-30">Created</th>
                  <th scope="col" className="py-3.5 pr-4 pl-3 text-right w-16">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-sm">
                {paginatedServices.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-16 px-4 text-center">
                      <div className="w-12 h-12 mx-auto rounded-2xl bg-primary-light text-primary flex items-center justify-center mb-3">
                        <Layers className="w-6 h-6" />
                      </div>
                      <h3 className="text-base font-semibold text-heading">No services found</h3>
                      <p className="text-xs text-muted max-w-sm mx-auto mt-1 mb-5">
                        No service records match your current search or category filter. Try resetting them or upload a JSON backup.
                      </p>
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => {
                            setSearchQuery("");
                            setStatusFilter("all");
                            setCategoryFilter("all");
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
                  paginatedServices.map((service) => {
                    const isSelected = selectedIds.has(service.id!);
                    return (
                      <tr
                        key={service.id}
                        onClick={() => setDrawerService(service)}
                        className={`group hover:bg-surface transition-colors cursor-pointer ${
                          isSelected ? "bg-primary-light/40 border-l-4 border-l-primary" : ""
                        }`}
                      >
                        <td className="py-3.5 pl-4 pr-2 w-10" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => toggleSelectOne(service.id!, e.target.checked)}
                            className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20 accent-primary cursor-pointer"
                          />
                        </td>
                        <td className="py-3.5 px-3 max-w-[320px]">
                          <div className="flex items-start gap-3">
                            {service.featured_image ? (
                              <img
                                src={service.featured_image}
                                alt={service.title}
                                className="w-10 h-10 rounded-lg object-cover border border-border shrink-0 shadow-sm mt-0.5"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-lg bg-primary-light border border-border-accent flex items-center justify-center text-primary shrink-0 mt-0.5">
                                {renderServiceIcon(service.icon)}
                              </div>
                            )}
                            <div className="min-w-0 flex-1">
                              <div
                                className="font-semibold text-heading text-sm hover:text-primary transition-colors line-clamp-2 leading-snug break-words"
                                title={service.title}
                              >
                                {service.title}
                              </div>
                              <div className="text-xs text-muted font-mono truncate mt-1 flex items-center gap-1.5">
                                <span className="truncate">/services/{service.slug}</span>
                                {service.is_manual_slug && (
                                  <span className="text-[10px] text-primary bg-primary-light px-1 py-0.5 rounded font-sans font-medium shrink-0">
                                    Custom
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-3">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-surface-alt text-heading border border-border">
                            <Tag className="w-3 h-3 text-primary" />
                            {service.category?.name || "Services"}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-xs font-mono text-heading">
                          {service.order ?? 0}
                        </td>
                        <td className="py-3.5 px-3">
                          {service.is_active ? (
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
                          {service.created_at
                            ? formatDateInTimezone(service.created_at, undefined, {
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
                                label: "Edit Service",
                                icon: <Edit className="w-3.5 h-3.5 text-muted" />,
                                onClick: () => {
                                  window.location.href = `/admin/services/${service.id}/edit`;
                                },
                              },
                              {
                                label: "View Preview",
                                icon: <Eye className="w-3.5 h-3.5 text-muted" />,
                                onClick: () => setDrawerService(service),
                              },
                              {
                                label: "Full Details",
                                icon: <ExternalLink className="w-3.5 h-3.5 text-muted" />,
                                onClick: () => {
                                  window.location.href = `/admin/services/${service.id}`;
                                },
                              },
                              {
                                label: "Duplicate",
                                icon: <Copy className="w-3.5 h-3.5 text-muted" />,
                                onClick: () => duplicateSingleService(service.id!),
                                dividerAfter: true,
                              },
                              ...(service.is_active
                                ? [
                                    {
                                      label: "Deactivate",
                                      icon: <XCircle className="w-3.5 h-3.5" />,
                                      variant: "warning" as const,
                                      onClick: () => updateSingleStatus(service.id!, false),
                                    },
                                  ]
                                : [
                                    {
                                      label: "Activate",
                                      icon: <Check className="w-3.5 h-3.5" />,
                                      variant: "success" as const,
                                      onClick: () => updateSingleStatus(service.id!, true),
                                    },
                                  ]),
                              {
                                label: "Delete",
                                icon: <Trash2 className="w-3.5 h-3.5" />,
                                variant: "danger" as const,
                                onClick: () => deleteSingleService(service.id!),
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

      {/* Universal Bulk Import Modal */}
      <BulkImportModal<ServiceFormValues>
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        title="Import Services"
        subtitle="Bulk upload services conforming to the"
        badgeText="ServiceFormValues"
        sampleFileName="apearix_services_sample.json"
        sampleData={SAMPLE_SERVICE_IMPORT}
        validateRow={validateServiceRow}
        previewColumns={[
          {
            header: "Title",
            render: (item) => (
              <span className="font-medium text-heading max-w-[140px] truncate block">
                {item.title}
              </span>
            ),
          },
          {
            header: "Slug",
            render: (item) => (
              <span className="text-muted font-mono text-[10px] max-w-[110px] truncate block">
                /{item.slug}
              </span>
            ),
          },
          {
            header: "Status",
            render: (item) => (
              <span className="capitalize font-medium text-heading">
                {item.is_active ? "Active" : "Inactive"}
              </span>
            ),
          },
        ]}
        onCommit={handleImportCommit}
      />

      {/* Quick View Drawer */}
      <ServiceQuickViewDrawer service={drawerService} onClose={() => setDrawerService(null)} />
    </main>
  );
}
