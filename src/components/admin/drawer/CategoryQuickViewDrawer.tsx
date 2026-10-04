"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Folder, Edit3, Tag, Hash } from "lucide-react";
import { QuickViewDrawer } from "@/components/admin/common/QuickViewDrawer";
import type { CategoryFormValues } from "@/schemas/category.schema";
import { formatDateTimeInTimezone } from "@/lib/timezone";

export interface CategoryQuickViewDrawerProps {
  category: CategoryFormValues | null;
  onClose: () => void;
}

export function CategoryQuickViewDrawer({ category, onClose }: Readonly<CategoryQuickViewDrawerProps>) {
  const [cachedItem, setCachedItem] = useState<CategoryFormValues | null>(category);

  useEffect(() => {
    if (category) {
      setCachedItem(category);
    }
  }, [category]);

  const activeItem = category || cachedItem;

  return (
    <QuickViewDrawer
      isOpen={Boolean(category)}
      onClose={onClose}
      headerContent={
        activeItem ? (
          <div className="flex items-center gap-2 truncate">
            {activeItem.is_active ? (
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase shrink-0">
                Active
              </span>
            ) : (
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 uppercase shrink-0">
                Inactive
              </span>
            )}
            <span className="text-xs text-muted font-mono truncate">
              {activeItem.slug || "—"}
            </span>
          </div>
        ) : null
      }
      footerActions={
        activeItem ? (
          <>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-border text-xs font-semibold rounded-lg text-heading hover:bg-white transition-colors cursor-pointer"
            >
              Close
            </button>
            <Link
              href={`/admin/category/${activeItem.id}/edit`}
              className="px-4 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              Edit Category
            </Link>
          </>
        ) : null
      }
    >
      {activeItem && (
        <>
          <div>
            <div className="flex items-center gap-2 mb-1 text-xs text-muted">
              <Folder className="w-4 h-4 text-primary" />
              <span>Category</span>
            </div>
            <h2 className="text-lg font-bold text-heading leading-snug">
              {activeItem.name}
            </h2>
            <div className="flex flex-wrap items-center gap-2 mt-3">
              <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-lg bg-surface border border-border text-heading">
                <Tag className="w-3 h-3 text-primary" />
                Type: {activeItem.category_type?.name || activeItem.category_type_id || "General"}
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-lg bg-surface border border-border text-heading">
                <Hash className="w-3 h-3 text-primary" />
                Order: {activeItem.order ?? 0}
              </span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted mb-1.5">
              Description
            </h4>
            <div className="text-xs text-body bg-white px-3 py-3 rounded-xl border border-border leading-relaxed">
              {activeItem.description || "No description provided."}
            </div>
          </div>

          {(activeItem.meta_title || activeItem.meta_description) && (
            <div className="border border-border rounded-xl p-3 bg-white space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted">
                SEO Metadata
              </h4>
              {activeItem.meta_title && (
                <div className="text-xs text-heading font-medium">Title: {activeItem.meta_title}</div>
              )}
              {activeItem.meta_description && (
                <div className="text-xs text-body leading-normal">{activeItem.meta_description}</div>
              )}
            </div>
          )}

          <div className="border border-border rounded-xl p-4 bg-surface-alt space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-heading flex items-center gap-1.5">
              System Audit Info
            </h4>
            <div className="text-[11px] space-y-1.5 text-muted">
              <div className="flex justify-between">
                <span>Category ID:</span>
                <span className="font-mono text-heading">{activeItem.id || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span>Created Date:</span>
                <span className="text-heading">
                  {activeItem.created_at ? formatDateTimeInTimezone(activeItem.created_at) : "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Last Modified:</span>
                <span className="text-heading">
                  {activeItem.updated_at ? formatDateTimeInTimezone(activeItem.updated_at) : "Just now"}
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </QuickViewDrawer>
  );
}
