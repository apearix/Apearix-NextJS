export const dynamic = "force-dynamic";

import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Edit3,
  ExternalLink,
  Package,
  Tag,
  Hash,
  Globe,
  Calendar,
  CheckCircle2,
  DollarSign,
  Barcode,
  Layers,
  AlertCircle,
} from "lucide-react";
import { serverApi } from "@/lib/serverApi";
import { formatProductItem } from "@/lib/services/admin/products";
import { PageHeader } from "@/components/admin/common/PageHeader";
import { SectionCard } from "@/components/admin/common/SectionCard";
import { formatDateTimeInTimezone } from "@/lib/timezone";

export const metadata = {
  title: "Admin - Product Details",
};

export default async function ProductShowPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  let initialData = null;

  try {
    initialData = await serverApi<any>(`/api/v1/admin/products/${resolvedParams.id}`, {
      cache: "no-store",
    });
  } catch (error) {
    console.error("Failed to fetch product details:", error);
    notFound();
  }

  const rawItem = initialData?.data || initialData;
  if (!rawItem || (!rawItem.id && !rawItem.name && !rawItem.title)) {
    notFound();
  }

  const product = formatProductItem(rawItem);
  const categoryName = product.category?.name || "Products";
  const inStock = (product.stock ?? 0) > 0;

  return (
    <main className="max-w-7xl mx-auto pb-16">
      {/* Header */}
      <PageHeader
        title={product.name}
        subtitle={`Product details, inventory, and pricing`}
        badge={product.is_active ? "Active" : "Inactive"}
        btn={
          <div className="flex items-center gap-2">
            <Link
              href="/admin/products"
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-surface hover:bg-surface-alt border border-border text-heading text-sm font-semibold rounded-lg transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-muted" /> Back to Products
            </Link>
            <Link
              href={`/admin/products/${product.id}/edit`}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary-hover text-white text-sm font-semibold rounded-lg shadow-sm shadow-primary/20 transition-all active:scale-[0.98] cursor-pointer"
            >
              <Edit3 className="w-4 h-4" /> Edit Product
            </Link>
          </div>
        }
      />

      {/* Main Grid */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Overview & Pricing Card */}
          <SectionCard
            title="Product Overview & Pricing"
            subtitle="Identification, pricing structure, and public endpoint"
          >
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 rounded-xl bg-surface border border-border">
                {product.image_or_thumbnail ? (
                  <img
                    src={product.image_or_thumbnail}
                    alt={product.name}
                    className="w-16 h-16 rounded-xl object-cover border border-border shrink-0 shadow-sm"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-primary-light border border-border-accent flex items-center justify-center text-primary shrink-0">
                    <Package className="w-8 h-8" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg font-bold text-heading leading-snug">
                    {product.name}
                  </h3>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-extrabold text-heading">
                      ${Number(product.price || 0).toFixed(2)}
                    </span>
                    {product.compare_at_price ? (
                      <span className="text-sm text-muted line-through">
                        ${Number(product.compare_at_price).toFixed(2)}
                      </span>
                    ) : null}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted font-mono mt-2">
                    <span>Slug:</span>
                    <span className="text-primary font-semibold">/products/{product.slug}</span>
                  </div>
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-surface border border-border text-heading">
                  <Tag className="w-3.5 h-3.5 text-primary" />
                  Category: <strong className="font-semibold">{categoryName}</strong>
                </span>
                {product.sku && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-surface border border-border text-heading font-mono">
                    <Barcode className="w-3.5 h-3.5 text-primary" />
                    SKU: <strong className="font-semibold">{product.sku}</strong>
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-surface border border-border text-heading">
                  <Layers className="w-3.5 h-3.5 text-primary" />
                  Stock:{" "}
                  <strong className={inStock ? "text-emerald-600 font-semibold" : "text-rose-600 font-semibold"}>
                    {product.stock ?? 0} units ({inStock ? "In Stock" : "Out of Stock"})
                  </strong>
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-surface border border-border text-heading">
                  <Hash className="w-3.5 h-3.5 text-primary" />
                  Order: <strong className="font-semibold">{product.order ?? 0}</strong>
                </span>
              </div>
            </div>
          </SectionCard>

          {/* Description Card */}
          <SectionCard
            title="Product Description"
            subtitle="Full specifications and details"
          >
            <div className="bg-white p-5 rounded-xl border border-border min-h-36">
              {product.description ? (
                <div
                  className="prose prose-sm max-w-none text-heading leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              ) : (
                <p className="text-xs text-muted italic">No detailed description has been provided for this product.</p>
              )}
            </div>
          </SectionCard>

          {/* SEO Preview Card */}
          <SectionCard
            title="Search Engine Optimization (SEO)"
            subtitle="Preview how this product appears in search engine results"
          >
            <div className="bg-surface p-4 rounded-xl border border-border">
              <div className="flex items-center gap-2 mb-2">
                <Globe className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold uppercase tracking-wider text-muted">
                  Google Search Snippet Preview
                </span>
              </div>
              <div className="text-base font-medium text-[#1a0dab] line-clamp-1 hover:underline cursor-pointer">
                {product.seo?.meta_title || product.name}
              </div>
              <div className="text-xs text-emerald-700 font-mono my-0.5 truncate">
                {product.seo?.canonical_url || `https://apearix.com/products/${product.slug}`}
              </div>
              <p className="text-xs text-muted line-clamp-2 mt-1 leading-normal">
                {product.seo?.meta_description || "No meta description provided for this product."}
              </p>
            </div>
          </SectionCard>
        </div>

        {/* Right Column (1 Col) */}
        <div className="space-y-6">
          {/* Status & Metadata Card */}
          <SectionCard title="Status & Publishing">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <span className="text-xs font-medium text-muted">Current Status</span>
                {product.is_active ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Active
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Inactive
                  </span>
                )}
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-muted flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" /> Created At
                  </span>
                  <span className="text-heading font-medium">
                    {product.created_at ? formatDateTimeInTimezone(product.created_at) : "—"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" /> Last Updated
                  </span>
                  <span className="text-heading font-medium">
                    {product.updated_at ? formatDateTimeInTimezone(product.updated_at) : "—"}
                  </span>
                </div>
              </div>

              {/* Public link */}
              <div className="pt-3 border-t border-border">
                <Link
                  href={`/products/${product.slug}`}
                  target="_blank"
                  className="w-full inline-flex items-center justify-center gap-2 px-3.5 py-2 bg-surface hover:bg-surface-alt border border-border text-heading text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-primary" />
                  View Public Product Page
                </Link>
              </div>
            </div>
          </SectionCard>

          {/* Product Image Card */}
          <SectionCard title="Product Image">
            {product.image_or_thumbnail ? (
              <div className="rounded-xl overflow-hidden aspect-square bg-surface border border-border">
                <img
                  src={product.image_or_thumbnail}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-border bg-surface p-8 text-center text-xs text-muted">
                No product image uploaded.
              </div>
            )}
          </SectionCard>
        </div>
      </div>
    </main>
  );
}
