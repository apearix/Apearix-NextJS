"use client";

import React, { useState, useMemo, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Plus,
  CheckCircle,
  Trash2,
  Eye,
  Edit,
  HelpCircle,
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
import { FaqQuickViewDrawer } from "@/components/admin/drawer/FaqQuickViewDrawer";
import { ActionMenu } from "@/components/admin/common/ActionMenu";
import { type FaqFormValues } from "@/schemas/faq.schema";
import {
  index as fetchFaqsApi,
  destroy as deleteFaqApi,
  update as updateFaqApi,
  bulkUpdateStatus as bulkUpdateStatusApi,
  bulkDelete as bulkDeleteApi,
  bulkImport as bulkImportApi,
} from "@/lib/services/admin/faqs";

const SAMPLE_FAQ_IMPORT = [
  {
    question: "What payment methods do you accept?",
    answer: "We accept Visa, Mastercard, American Express, PayPal, and UPI payments.",
    category: "billing",
    order: 1,
    is_active: true,
  },
];

export default function AdminFaqsPage() {
  const [faqs, setFaqs] = useState<FaqFormValues[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [sortFilter, setSortFilter] = useState<string>("newest");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // Modals & Panels
  const [drawerFaq, setDrawerFaq] = useState<FaqFormValues | null>(null);
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

  const loadFaqs = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetchFaqsApi();
      setFaqs(res.items);
    } catch (error) {
      console.error("Error loading FAQs:", error);
      showToast("Failed to load FAQs list from server.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFaqs();
  }, [loadFaqs]);

  const categoriesList = useMemo(() => {
    const set = new Set<string>();
    faqs.forEach((f) => {
      if (f.category) set.add(f.category);
    });
    return Array.from(set);
  }, [faqs]);

  const counts = useMemo(
    () => ({
      all: faqs.length,
      active: faqs.filter((f) => f.is_active).length,
      inactive: faqs.filter((f) => !f.is_active).length,
    }),
    [faqs]
  );

  const filteredFaqs = useMemo(() => {
    return faqs
      .filter((faq) => {
        if (statusFilter === "active" && !faq.is_active) return false;
        if (statusFilter === "inactive" && faq.is_active) return false;
        if (categoryFilter !== "all" && (faq.category || "general") !== categoryFilter) return false;
        if (searchQuery.trim() !== "") {
          const q = searchQuery.toLowerCase().trim();
          const matchQuestion = (faq.question || "").toLowerCase().includes(q);
          const matchAnswer = (faq.answer || "").toLowerCase().includes(q);
          const matchCategory = (faq.category || "").toLowerCase().includes(q);
          if (!matchQuestion && !matchAnswer && !matchCategory) return false;
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
        return 0;
      });
  }, [faqs, statusFilter, categoryFilter, searchQuery, sortFilter]);

  const totalItems = filteredFaqs.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const validCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (validCurrentPage - 1) * pageSize;
  const paginatedFaqs = filteredFaqs.slice(startIndex, startIndex + pageSize);

  const allFilteredSelected =
    paginatedFaqs.length > 0 && paginatedFaqs.every((f) => selectedIds.has(f.id!));
  const isIndeterminate =
    paginatedFaqs.some((f) => selectedIds.has(f.id!)) && !allFilteredSelected;

  const toggleSelectAll = (checked: boolean) => {
    const next = new Set(selectedIds);
    if (checked) paginatedFaqs.forEach((f) => next.add(f.id!));
    else paginatedFaqs.forEach((f) => next.delete(f.id!));
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
      showToast(`Updated ${selectedIds.size} FAQ(s) to ${isActive ? "Active" : "Inactive"}`);
      setSelectedIds(new Set());
      await loadFaqs();
    } catch (error: any) {
      showToast(error?.message || "Failed to update bulk status");
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    if (window.confirm(`Are you sure you want to delete ${selectedIds.size} selected FAQ(s)?`)) {
      try {
        await bulkDeleteApi(Array.from(selectedIds));
        showToast(`Deleted ${selectedIds.size} FAQ(s)`);
        setSelectedIds(new Set());
        await loadFaqs();
      } catch (error: any) {
        showToast(error?.message || "Failed to delete selected FAQs");
      }
    }
  };

  const updateSingleStatus = async (id: string, isActive: boolean) => {
    const item = faqs.find((f) => f.id === id);
    if (!item) return;
    try {
      await updateFaqApi(id, {
        id,
        question: item.question,
        answer: item.answer,
        category: item.category,
        order: item.order,
        is_active: isActive,
      });
      showToast(`FAQ status updated to ${isActive ? "Active" : "Inactive"}`);
      await loadFaqs();
    } catch (error: any) {
      showToast(error?.message || "Failed to update status");
    }
  };

  const deleteSingleFaq = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this FAQ item?")) {
      try {
        await deleteFaqApi(id);
        if (drawerFaq?.id === id) setDrawerFaq(null);
        showToast("FAQ deleted");
        await loadFaqs();
      } catch (error: any) {
        showToast(error?.message || "Failed to delete FAQ");
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
    let target: FaqFormValues[] = [];
    if (type === "all_json") target = faqs;
    else if (type === "filtered_json") target = filteredFaqs;
    else if (type === "selected_json") target = faqs.filter((f) => selectedIds.has(f.id!));
    else if (type === "csv") target = filteredFaqs;

    if (target.length === 0) {
      showToast("No FAQs available to export");
      return;
    }

    if (type === "csv") {
      const headers = ["Question", "Answer", "Category", "Order", "Status", "Created At"];
      const rows = target.map((f) => [
        `"${(f.question || "").replace(/"/g, '""')}"`,
        `"${(f.answer || "").replace(/"/g, '""')}"`,
        `"${f.category || "general"}"`,
        `"${f.order ?? 0}"`,
        `"${f.is_active ? "Active" : "Inactive"}"`,
        `"${f.created_at || ""}"`,
      ]);
      const csvStr = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
      const blob = new Blob([csvStr], { type: "text/csv;charset=utf-8;" });
      downloadFile(blob, `apearix_faqs_${new Date().toISOString().slice(0, 10)}.csv`);
      showToast(`Exported ${target.length} FAQ(s) as CSV`);
    } else {
      const cleanJson = target.map(({ id, updated_at, created_at, ...clean }) => clean);
      const jsonStr = JSON.stringify(cleanJson, null, 2);
      const blob = new Blob([jsonStr], { type: "application/json" });
      downloadFile(blob, `apearix_faqs_${type}_${new Date().toISOString().slice(0, 10)}.json`);
      showToast(`Exported ${target.length} FAQ(s) as JSON`);
    }
  };

  const validateFaqRow = (item: any, index: number) => {
    const warnings: string[] = [];
    const errors: string[] = [];

    if (!item.question || typeof item.question !== "string" || item.question.trim() === "") {
      errors.push("Missing question text");
    }

    if (!item.answer || typeof item.answer !== "string" || item.answer.trim() === "") {
      errors.push("Missing answer text");
    }

    const isValid = errors.length === 0;
    const remarks = isValid ? (warnings.length > 0 ? warnings.join(", ") : "Valid") : errors.join(", ");

    const faqData: FaqFormValues = {
      question: item.question || "Sample Question?",
      answer: item.answer || "Sample Answer details.",
      category: item.category || "general",
      order: item.order !== undefined ? Number(item.order) : 0,
      is_active: item.is_active !== undefined ? Boolean(item.is_active) : true,
    };

    return {
      data: faqData,
      isValid,
      remarks,
    };
  };

  const handleImportCommit = async (importedFaqs: FaqFormValues[]) => {
    try {
      const payload = importedFaqs.map((faq) => ({
        question: faq.question,
        answer: faq.answer,
        category: faq.category || "general",
        order: faq.order ?? 0,
        is_active: faq.is_active !== undefined ? faq.is_active : true,
      }));

      const res = await bulkImportApi(payload);
      const count = res?.count ?? res?.items?.length ?? importedFaqs.length;
      showToast(`Successfully imported ${count} FAQ(s)!`);
      await loadFaqs();
    } catch (err: any) {
      console.error("Bulk import FAQs error:", err);
      showToast(err?.message || "Failed to bulk import FAQs");
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
        title="FAQs"
        subtitle="Manage frequently asked questions, answers, categories, and display order."
        badge={`${faqs.length} FAQs`}
        btn={
          <Link
            href="/admin/faqs/create"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary-hover text-white text-sm font-semibold rounded-lg shadow-sm shadow-primary/20 transition-all active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" /> Create FAQ
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
        searchPlaceholder="Search FAQs by question, answer or category..."
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
            { label: "Order: Ascending", value: "order_asc" },
          ],
        }}
        onImportClick={() => setIsImportModalOpen(true)}
        exportOptions={[
          {
            id: "all_json",
            label: "All FAQs (JSON)",
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
              {selectedIds.size} {selectedIds.size === 1 ? "FAQ" : "FAQs"} selected
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
              <span className="text-xs font-medium">Loading FAQ records...</span>
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
                  <th scope="col" className="py-3.5 px-3 min-w-[320px]">Question</th>
                  <th scope="col" className="py-3.5 px-3 min-w-36">Category</th>
                  <th scope="col" className="py-3.5 px-3 min-w-24">Order</th>
                  <th scope="col" className="py-3.5 px-3 min-w-32.5">Status</th>
                  <th scope="col" className="py-3.5 px-3 min-w-30">Created</th>
                  <th scope="col" className="py-3.5 pr-4 pl-3 text-right w-16">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-sm">
                {paginatedFaqs.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-16 px-4 text-center">
                      <div className="w-12 h-12 mx-auto rounded-2xl bg-primary-light text-primary flex items-center justify-center mb-3">
                        <HelpCircle className="w-6 h-6" />
                      </div>
                      <h3 className="text-base font-semibold text-heading">No FAQs found</h3>
                      <p className="text-xs text-muted max-w-sm mx-auto mt-1 mb-5">
                        No FAQ records match your current search or category filter. Try resetting them or upload a JSON backup.
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
                  paginatedFaqs.map((faq) => {
                    const isSelected = selectedIds.has(faq.id!);
                    return (
                      <tr
                        key={faq.id}
                        onClick={() => setDrawerFaq(faq)}
                        className={`group hover:bg-surface transition-colors cursor-pointer ${
                          isSelected ? "bg-primary-light/40 border-l-4 border-l-primary" : ""
                        }`}
                      >
                        <td className="py-3.5 pl-4 pr-2 w-10" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => toggleSelectOne(faq.id!, e.target.checked)}
                            className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20 accent-primary cursor-pointer"
                          />
                        </td>
                        <td className="py-3.5 px-3 max-w-[320px]">
                          <div className="flex items-start gap-3">
                            <div className="w-9 h-9 rounded-lg bg-primary-light border border-primary/20 flex items-center justify-center text-primary shrink-0 mt-0.5">
                              <HelpCircle className="w-4 h-4" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div
                                className="font-semibold text-heading text-sm hover:text-primary transition-colors line-clamp-2 leading-snug break-words"
                                title={faq.question}
                              >
                                {faq.question}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-3">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-surface-alt text-heading border border-border">
                            <Tag className="w-3 h-3 text-primary" />
                            {faq.category || "general"}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-xs font-mono text-heading">
                          {faq.order ?? 0}
                        </td>
                        <td className="py-3.5 px-3">
                          {faq.is_active ? (
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
                          {faq.created_at
                            ? formatDateInTimezone(faq.created_at, undefined, { month: "short", day: "numeric", year: "numeric" })
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
                                label: "Edit FAQ",
                                icon: <Edit className="w-3.5 h-3.5 text-muted" />,
                                onClick: () => window.location.href = `/admin/faqs/${faq.id}/edit`,
                              },
                              {
                                label: "View Preview",
                                icon: <Eye className="w-3.5 h-3.5 text-muted" />,
                                onClick: () => setDrawerFaq(faq),
                                dividerAfter: true,
                              },
                              faq.is_active
                                ? {
                                    label: "Mark Inactive",
                                    icon: <XCircle className="w-3.5 h-3.5 text-amber-600" />,
                                    variant: "warning" as const,
                                    onClick: () => updateSingleStatus(faq.id!, false),
                                    dividerAfter: true,
                                  }
                                : {
                                    label: "Mark Active",
                                    icon: <Check className="w-3.5 h-3.5 text-emerald-600" />,
                                    variant: "success" as const,
                                    onClick: () => updateSingleStatus(faq.id!, true),
                                    dividerAfter: true,
                                  },
                              {
                                label: "Delete FAQ",
                                icon: <Trash2 className="w-3.5 h-3.5" />,
                                variant: "danger" as const,
                                onClick: () => deleteSingleFaq(faq.id!),
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
      <FaqQuickViewDrawer
        faq={drawerFaq}
        onClose={() => setDrawerFaq(null)}
      />

      {/* Universal Reusable Bulk Import Modal */}
      <BulkImportModal<FaqFormValues>
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        title="Import FAQs"
        subtitle="Bulk upload FAQ records conforming to the"
        badgeText="FaqFormValues"
        sampleFileName="apearix_faqs_sample.json"
        sampleData={SAMPLE_FAQ_IMPORT}
        validateRow={validateFaqRow}
        previewColumns={[
          {
            header: "Question",
            render: (item) => item.question,
          },
          {
            header: "Category",
            render: (item) => item.category || "general",
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
