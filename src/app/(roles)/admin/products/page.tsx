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
  Package,
  Tag,
  Check,
  XCircle,
  X,
  Loader2,
  DollarSign,
  Barcode,
  Layers,
  ImageIcon,
} from "lucide-react";
import { PageHeader } from "@/components/admin/common/PageHeader";
import { TablePagination } from "@/components/admin/common/TablePagination";
import { TableToolbar } from "@/components/admin/common/TableToolbar";
import { BulkImportModal } from "@/components/admin/common/BulkImportModal";
import { formatDateInTimezone } from "@/lib/timezone";
import { ProductQuickViewDrawer } from "@/components/admin/drawer/ProductQuickViewDrawer";
import { ActionMenu } from "@/components/admin/common/ActionMenu";
import { type ProductFormValues } from "@/schemas/product.schema";
import {
  index as fetchProductsApi,
  destroy as deleteProductApi,
  update as updateProductApi,
  store as createProductApi,
  bulkUpdateStatus as bulkUpdateStatusApi,
  bulkDelete as bulkDeleteApi,
  bulkImport as bulkImportApi,
} from "@/lib/services/admin/products";

const SAMPLE_PRODUCT_IMPORT = [
  {
    name: "Enterprise Agent Platform",
    slug: "enterprise-agent-platform",
    is_manual_slug: false,
    price: 199.0,
    compare_at_price: 249.0,
    sku: "APX-AGT-001",
    stock: 50,
    description: "Enterprise tier multi-agent orchestration and deployment suite.",
    category_id: "",
    order: 1,
    is_active: true,
    seo: {
      meta_title: "Enterprise Agent Platform",
      meta_description: "Enterprise multi-agent orchestration and deployment suite.",
      canonical_url: "https://apearix.com/products/enterprise-agent-platform",
    },
  },
];

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductFormValues[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [sortFilter, setSortFilter] = useState<string>("newest");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // Modals & Panels
  const [drawerProduct, setDrawerProduct] = useState<ProductFormValues | null>(null);
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

  const loadProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetchProductsApi();
      setProducts(res.items);
    } catch (error) {
      console.error("Error loading products:", error);
      showToast("Failed to load products from server.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const categoriesList = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      const catName = p.category?.name;
      if (catName) set.add(catName);
    });
    return Array.from(set);
  }, [products]);

  const counts = useMemo(
    () => ({
      all: products.length,
      active: products.filter((p) => p.is_active).length,
      inactive: products.filter((p) => !p.is_active).length,
    }),
    [products]
  );

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        if (statusFilter === "active" && !p.is_active) return false;
        if (statusFilter === "inactive" && p.is_active) return false;
        if (categoryFilter !== "all" && p.category?.name !== categoryFilter) return false;

        if (searchQuery.trim() !== "") {
          const q = searchQuery.toLowerCase().trim();
          const matchName = (p.name || "").toLowerCase().includes(q);
          const matchSlug = (p.slug || "").toLowerCase().includes(q);
          const matchSku = (p.sku || "").toLowerCase().includes(q);
          const matchCat = (p.category?.name || "").toLowerCase().includes(q);
          if (!matchName && !matchSlug && !matchSku && !matchCat) return false;
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
        if (sortFilter === "price_asc") {
          return Number(a.price || 0) - Number(b.price || 0);
        }
        if (sortFilter === "price_desc") {
          return Number(b.price || 0) - Number(a.price || 0);
        }
        if (sortFilter === "name_asc") {
          return (a.name || "").localeCompare(b.name || "");
        }
        return 0;
      });
  }, [products, statusFilter, categoryFilter, searchQuery, sortFilter]);

  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const validCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (validCurrentPage - 1) * pageSize;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + pageSize);

  const allFilteredSelected =
    paginatedProducts.length > 0 && paginatedProducts.every((p) => selectedIds.has(p.id!));
  const isIndeterminate =
    paginatedProducts.some((p) => selectedIds.has(p.id!)) && !allFilteredSelected;

  const toggleSelectAll = (checked: boolean) => {
    const next = new Set(selectedIds);
    if (checked) paginatedProducts.forEach((p) => next.add(p.id!));
    else paginatedProducts.forEach((p) => next.delete(p.id!));
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
      showToast(`Updated ${selectedIds.size} products to ${isActive ? "Active" : "Inactive"}`);
      setSelectedIds(new Set());
      await loadProducts();
    } catch (error: any) {
      showToast(error?.message || "Failed to update bulk status");
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    if (window.confirm(`Are you sure you want to delete ${selectedIds.size} selected product(s)?`)) {
      try {
        await bulkDeleteApi(Array.from(selectedIds));
        showToast(`Deleted ${selectedIds.size} products`);
        setSelectedIds(new Set());
        await loadProducts();
      } catch (error: any) {
        showToast(error?.message || "Failed to delete selected products");
      }
    }
  };

  const updateSingleStatus = async (id: string, isActive: boolean) => {
    const item = products.find((p) => p.id === id);
    if (!item) return;
    try {
      await updateProductApi(id, {
        id,
        name: item.name,
        slug: item.slug,
        is_active: isActive,
      });
      showToast(`Product status updated to ${isActive ? "Active" : "Inactive"}`);
      await loadProducts();
    } catch (error: any) {
      showToast(error?.message || "Failed to update status");
    }
  };

  const duplicateSingleProduct = async (id: string) => {
    const item = products.find((p) => p.id === id);
    if (!item) return;
    try {
      await createProductApi({
        name: `${item.name} (Copy)`,
        slug: `${item.slug}-copy`,
        is_manual_slug: true,
        category_id: item.category_id || "",
        price: item.price,
        compare_at_price: item.compare_at_price,
        sku: item.sku ? `${item.sku}-COPY` : "",
        stock: item.stock,
        image_or_thumbnail: item.image_or_thumbnail,
        description: item.description,
        order: (item.order ?? 0) + 1,
        is_active: false,
        seo: item.seo,
      });
      showToast(`Duplicated: "${item.name}"`);
      await loadProducts();
    } catch (error: any) {
      showToast(error?.message || "Failed to duplicate product");
    }
  };

  const deleteSingleProduct = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProductApi(id);
        if (drawerProduct?.id === id) setDrawerProduct(null);
        showToast("Product deleted");
        await loadProducts();
      } catch (error: any) {
        showToast(error?.message || "Failed to delete product");
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
    let target: ProductFormValues[] = [];
    if (type === "all_json") target = products;
    else if (type === "filtered_json") target = filteredProducts;
    else if (type === "selected_json") target = products.filter((p) => selectedIds.has(p.id!));
    else if (type === "csv") target = filteredProducts;

    if (target.length === 0) {
      showToast("No products available to export");
      return;
    }

    if (type === "csv") {
      const headers = ["Name", "Slug", "Category", "Price", "Compare Price", "SKU", "Stock", "Status", "Created At"];
      const rows = target.map((p) => [
        `"${(p.name || "").replace(/"/g, '""')}"`,
        `"${p.slug || ""}"`,
        `"${(p.category?.name || "").replace(/"/g, '""')}"`,
        `"${p.price || 0}"`,
        `"${p.compare_at_price || ""}"`,
        `"${p.sku || ""}"`,
        `"${p.stock || 0}"`,
        `"${p.is_active ? "Active" : "Inactive"}"`,
        `"${p.created_at || ""}"`,
      ]);
      const csvStr = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
      const blob = new Blob([csvStr], { type: "text/csv;charset=utf-8;" });
      downloadFile(blob, `apearix_products_${new Date().toISOString().slice(0, 10)}.csv`);
      showToast(`Exported ${target.length} products as CSV`);
    } else {
      const cleanJson = target.map(({ id, updated_at, ...clean }) => clean);
      const jsonStr = JSON.stringify(cleanJson, null, 2);
      const blob = new Blob([jsonStr], { type: "application/json" });
      downloadFile(blob, `apearix_products_${type}_${new Date().toISOString().slice(0, 10)}.json`);
      showToast(`Exported ${target.length} products as JSON`);
    }
  };

  const validateProductRow = (item: any) => {
    const warnings: string[] = [];
    const errors: string[] = [];

    if (!item.name || typeof item.name !== "string" || item.name.trim() === "") {
      errors.push("Missing product name");
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

    const price = Number(item.price);
    if (isNaN(price) || price < 0) {
      warnings.push("Invalid price defaulted to 0");
    }

    const isValid = errors.length === 0;
    const remarks = isValid ? (warnings.length > 0 ? warnings.join(", ") : "Valid") : errors.join(", ");

    const productData: ProductFormValues = {
      name: item.name || "Untitled Product",
      slug: slug || "untitled-product",
      is_manual_slug: item.is_manual_slug !== undefined ? Boolean(item.is_manual_slug) : true,
      category_id: item.category_id || "",
      price: isNaN(price) ? 0 : price,
      compare_at_price: item.compare_at_price !== undefined ? Number(item.compare_at_price) : null,
      sku: item.sku || "",
      stock: item.stock !== undefined ? Number(item.stock) : 0,
      image_or_thumbnail: item.image_or_thumbnail || "",
      description: item.description || "",
      order: item.order !== undefined ? Number(item.order) : 0,
      is_active: item.is_active !== undefined ? Boolean(item.is_active) : true,
      seo: {
        meta_title: item.seo?.meta_title || item.name || "",
        meta_description: item.seo?.meta_description || "",
        canonical_url: item.seo?.canonical_url || `https://apearix.com/products/${slug}`,
      },
    };

    return {
      data: productData,
      isValid,
      remarks,
    };
  };

  const handleImportCommit = async (importedProducts: ProductFormValues[]) => {
    try {
      const payload = importedProducts.map((p) => ({
        name: p.name,
        slug: p.slug,
        is_manual_slug: p.is_manual_slug,
        category_id: p.category_id || "",
        price: p.price,
        compare_at_price: p.compare_at_price,
        sku: p.sku || "",
        stock: p.stock ?? 0,
        image_or_thumbnail: p.image_or_thumbnail || "",
        description: p.description || "",
        order: p.order ?? 0,
        is_active: p.is_active !== undefined ? p.is_active : true,
        seo: p.seo,
      }));

      const res = await bulkImportApi(payload);
      const count = res?.count ?? res?.items?.length ?? importedProducts.length;
      showToast(`Successfully imported ${count} product(s)!`);
      await loadProducts();
    } catch (err: any) {
      console.error("Bulk import products error:", err);
      showToast(err?.message || "Failed to bulk import products");
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
        title="Products"
        subtitle="Manage inventory, prices, SKUs, and public storefront listings."
        badge={`${products.length} Products`}
        btn={
          <Link
            href="/admin/products/create"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary-hover text-white text-sm font-semibold rounded-lg shadow-sm shadow-primary/20 transition-all active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" /> Create Product
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
        searchPlaceholder="Search products by name, slug, SKU or category..."
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
          minWidth: "155px",
          options: [
            { label: "Sort: Newest", value: "newest" },
            { label: "Sort: Oldest", value: "oldest" },
            { label: "Price: Low to High", value: "price_asc" },
            { label: "Price: High to Low", value: "price_desc" },
            { label: "Name: A to Z", value: "name_asc" },
          ],
        }}
        onImportClick={() => setIsImportModalOpen(true)}
        exportOptions={[
          {
            id: "all_json",
            label: "All Products (JSON)",
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
              {selectedIds.size} {selectedIds.size === 1 ? "product" : "products"} selected
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
              <span className="text-xs font-medium">Loading products...</span>
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
                  <th scope="col" className="py-3.5 px-3 min-w-[320px]">Product</th>
                  <th scope="col" className="py-3.5 px-3 min-w-36">Category</th>
                  <th scope="col" className="py-3.5 px-3 min-w-28">Price</th>
                  <th scope="col" className="py-3.5 px-3 min-w-28">SKU</th>
                  <th scope="col" className="py-3.5 px-3 min-w-32.5">Status</th>
                  <th scope="col" className="py-3.5 px-3 min-w-30">Created</th>
                  <th scope="col" className="py-3.5 pr-4 pl-3 text-right w-16">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-sm">
                {paginatedProducts.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-16 px-4 text-center">
                      <div className="w-12 h-12 mx-auto rounded-2xl bg-primary-light text-primary flex items-center justify-center mb-3">
                        <Package className="w-6 h-6" />
                      </div>
                      <h3 className="text-base font-semibold text-heading">No products found</h3>
                      <p className="text-xs text-muted max-w-sm mx-auto mt-1 mb-5">
                        No product records match your current search or category filter. Try resetting them or upload a JSON backup.
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
                  paginatedProducts.map((product) => {
                    const isSelected = selectedIds.has(product.id!);
                    return (
                      <tr
                        key={product.id}
                        onClick={() => setDrawerProduct(product)}
                        className={`group hover:bg-surface transition-colors cursor-pointer ${
                          isSelected ? "bg-primary-light/40 border-l-4 border-l-primary" : ""
                        }`}
                      >
                        <td className="py-3.5 pl-4 pr-2 w-10" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => toggleSelectOne(product.id!, e.target.checked)}
                            className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20 accent-primary cursor-pointer"
                          />
                        </td>
                        <td className="py-3.5 px-3 max-w-[320px]">
                          <div className="flex items-start gap-3">
                            {product.image_or_thumbnail ? (
                              <img
                                src={product.image_or_thumbnail}
                                alt={product.name}
                                className="w-10 h-10 rounded-lg object-cover border border-border shrink-0 shadow-sm mt-0.5"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-lg bg-primary-light border border-border-accent flex items-center justify-center text-primary shrink-0 mt-0.5">
                                <Package className="w-4 h-4" />
                              </div>
                            )}
                            <div className="min-w-0 flex-1">
                              <div
                                className="font-semibold text-heading text-sm hover:text-primary transition-colors line-clamp-2 leading-snug break-words"
                                title={product.name}
                              >
                                {product.name}
                              </div>
                              <div className="text-xs text-muted font-mono truncate mt-1 flex items-center gap-1.5">
                                <span className="truncate">/products/{product.slug}</span>
                                {product.is_manual_slug && (
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
                            {product.category?.name || "Products"}
                          </span>
                        </td>
                        <td className="py-3.5 px-3">
                          <div className="text-xs font-bold text-heading">
                            ${Number(product.price || 0).toFixed(2)}
                          </div>
                          {product.compare_at_price ? (
                            <div className="text-[10px] text-muted line-through">
                              ${Number(product.compare_at_price).toFixed(2)}
                            </div>
                          ) : null}
                        </td>
                        <td className="py-3.5 px-3 text-xs font-mono text-heading">
                          {product.sku || "—"}
                        </td>
                        <td className="py-3.5 px-3">
                          {product.is_active ? (
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
                          {product.created_at
                            ? formatDateInTimezone(product.created_at, undefined, {
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
                                label: "Edit Product",
                                icon: <Edit className="w-3.5 h-3.5 text-muted" />,
                                onClick: () => {
                                  window.location.href = `/admin/products/${product.id}/edit`;
                                },
                              },
                              {
                                label: "View Preview",
                                icon: <Eye className="w-3.5 h-3.5 text-muted" />,
                                onClick: () => setDrawerProduct(product),
                              },
                              {
                                label: "Full Details",
                                icon: <ExternalLink className="w-3.5 h-3.5 text-muted" />,
                                onClick: () => {
                                  window.location.href = `/admin/products/${product.id}`;
                                },
                              },
                              {
                                label: "Duplicate",
                                icon: <Copy className="w-3.5 h-3.5 text-muted" />,
                                onClick: () => duplicateSingleProduct(product.id!),
                                dividerAfter: true,
                              },
                              ...(product.is_active
                                ? [
                                    {
                                      label: "Deactivate",
                                      icon: <XCircle className="w-3.5 h-3.5" />,
                                      variant: "warning" as const,
                                      onClick: () => updateSingleStatus(product.id!, false),
                                    },
                                  ]
                                : [
                                    {
                                      label: "Activate",
                                      icon: <Check className="w-3.5 h-3.5" />,
                                      variant: "success" as const,
                                      onClick: () => updateSingleStatus(product.id!, true),
                                    },
                                  ]),
                              {
                                label: "Delete",
                                icon: <Trash2 className="w-3.5 h-3.5" />,
                                variant: "danger" as const,
                                onClick: () => deleteSingleProduct(product.id!),
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
      <BulkImportModal<ProductFormValues>
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        title="Import Products"
        subtitle="Bulk upload products conforming to the"
        badgeText="ProductFormValues"
        sampleFileName="apearix_products_sample.json"
        sampleData={SAMPLE_PRODUCT_IMPORT}
        validateRow={validateProductRow}
        previewColumns={[
          {
            header: "Product",
            render: (item) => (
              <span className="font-medium text-heading max-w-[140px] truncate block">
                {item.name}
              </span>
            ),
          },
          {
            header: "Price",
            render: (item) => (
              <span className="font-semibold text-heading text-xs">
                ${Number(item.price || 0).toFixed(2)}
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
      <ProductQuickViewDrawer product={drawerProduct} onClose={() => setDrawerProduct(null)} />
    </main>
  );
}
