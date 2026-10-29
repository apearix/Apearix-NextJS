"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Package,
  Edit3,
  Tag,
  Hash,
  Globe,
  ExternalLink,
  DollarSign,
  Barcode,
  Layers,
  Calendar,
  CheckCircle2,
  AlertCircle,
  ImageIcon,
} from "lucide-react";
import { QuickViewDrawer } from "@/components/admin/common/QuickViewDrawer";
import type { ProductFormValues } from "@/schemas/product.schema";
import { formatDateTimeInTimezone } from "@/lib/timezone";

export interface ProductQuickViewDrawerProps {
  product: ProductFormValues | null;
  onClose: () => void;
}

export function ProductQuickViewDrawer({
  product,
  onClose,
}: Readonly<ProductQuickViewDrawerProps>) {
  const [cachedProduct, setCachedProduct] = useState<ProductFormValues | null>(product);

  useEffect(() => {
    if (product) {
      setCachedProduct(product);
    }
  }, [product]);

  const activeProduct = product || cachedProduct;
  const categoryDisplay = activeProduct?.category?.name || "Products";

  return (
    <QuickViewDrawer
      isOpen={Boolean(product)}
      onClose={onClose}
      headerContent={
        activeProduct ? (
          <div className="flex items-center gap-2 truncate">
            {activeProduct.is_active ? (
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase shrink-0">
                Active
              </span>
            ) : (
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 uppercase shrink-0">
                Inactive
              </span>
            )}
            <span className="text-xs text-muted font-mono truncate">
              /products/{activeProduct.slug}
            </span>
          </div>
        ) : null
      }
      footerActions={
        activeProduct ? (
          <>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-border text-xs font-semibold rounded-lg text-heading hover:bg-white transition-colors cursor-pointer"
            >
              Close
            </button>
            <Link
              href={`/admin/products/${activeProduct.id}`}
              className="px-3.5 py-2 bg-surface hover:bg-surface-alt border border-border text-heading text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5 text-muted" />
              Full Page
            </Link>
            <Link
              href={`/admin/products/${activeProduct.id}/edit`}
              className="px-4 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              Edit Product
            </Link>
          </>
        ) : null
      }
    >
      {activeProduct && (
        <div className="space-y-6">
          {/* Header Card */}
          <div className="border border-border rounded-xl p-4 bg-surface-alt">
            <div className="flex items-start gap-3">
              {activeProduct.image_or_thumbnail ? (
                <img
                  src={activeProduct.image_or_thumbnail}
                  alt={activeProduct.name}
                  className="w-16 h-16 rounded-xl object-cover border border-border shrink-0 shadow-sm"
                />
              ) : (
                <div className="w-16 h-16 rounded-xl bg-primary-light border border-border-accent flex items-center justify-center text-primary shrink-0">
                  <Package className="w-8 h-8" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <h3 className="text-base font-bold text-heading leading-snug">
                  {activeProduct.name}
                </h3>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-lg font-bold text-heading">
                    ${Number(activeProduct.price || 0).toFixed(2)}
                  </span>
                  {activeProduct.compare_at_price ? (
                    <span className="text-xs text-muted line-through">
                      ${Number(activeProduct.compare_at_price).toFixed(2)}
                    </span>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 mt-3.5 pt-3 border-t border-border/60">
              <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-lg bg-surface border border-border text-heading">
                <Tag className="w-3 h-3 text-primary" />
                Category: {categoryDisplay}
              </span>
              {activeProduct.sku && (
                <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-lg bg-surface border border-border text-heading font-mono">
                  <Barcode className="w-3 h-3 text-primary" />
                  SKU: {activeProduct.sku}
                </span>
              )}
              <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-lg bg-surface border border-border text-heading">
                <Layers className="w-3 h-3 text-primary" />
                Stock: {activeProduct.stock ?? 0} units
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted mb-1.5">
              Product Description
            </h4>
            <div
              data-lenis-prevent="true"
              className="text-xs text-body bg-white p-4 rounded-xl border border-border max-h-60 overflow-y-auto leading-relaxed prose prose-sm max-w-none"
            >
              {activeProduct.description ? (
                <div
                  dangerouslySetInnerHTML={{
                    __html: activeProduct.description,
                  }}
                />
              ) : (
                <p className="text-muted italic">No product description provided.</p>
              )}
            </div>
          </div>

          {/* SEO Preview */}
          {(activeProduct.seo?.meta_title || activeProduct.seo?.meta_description) && (
            <div className="border border-border rounded-xl p-4 bg-surface">
              <div className="flex items-center gap-2 mb-2">
                <Globe className="w-3.5 h-3.5 text-primary" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted">
                  Search Engine Snippet
                </h4>
              </div>
              <div className="font-semibold text-sm text-[#1a0dab] line-clamp-1">
                {activeProduct.seo?.meta_title || activeProduct.name}
              </div>
              <div className="text-xs text-emerald-700 font-mono truncate my-0.5">
                {activeProduct.seo?.canonical_url || `https://apearix.com/products/${activeProduct.slug}`}
              </div>
              <p className="text-xs text-muted line-clamp-2 mt-1">
                {activeProduct.seo?.meta_description || "No meta description set."}
              </p>
            </div>
          )}

          {/* Metadata Footer */}
          <div className="pt-2 border-t border-border flex items-center justify-between text-[11px] text-muted">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3 h-3" />
              <span>
                Created:{" "}
                {activeProduct.created_at
                  ? formatDateTimeInTimezone(activeProduct.created_at)
                  : "—"}
              </span>
            </div>
            {activeProduct.updated_at && (
              <span>Updated: {formatDateTimeInTimezone(activeProduct.updated_at)}</span>
            )}
          </div>
        </div>
      )}
    </QuickViewDrawer>
  );
}
