"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FolderTree, Edit3, Tag } from "lucide-react";
import { QuickViewDrawer } from "@/components/admin/common/QuickViewDrawer";
import type { CategoryTypeFormValues } from "@/schemas/category-type.schema";
import { formatDateTimeInTimezone } from "@/lib/timezone";

export interface CategoryTypeQuickViewDrawerProps {
  categoryType: CategoryTypeFormValues | null;
  onClose: () => void;
}

export function CategoryTypeQuickViewDrawer({ categoryType, onClose }: Readonly<CategoryTypeQuickViewDrawerProps>) {
  const [cachedItem, setCachedItem] = useState<CategoryTypeFormValues | null>(categoryType);

  useEffect(() => {
    if (categoryType) {
      setCachedItem(categoryType);
    }
  }, [categoryType]);

  const activeItem = categoryType || cachedItem;

  return (
    <QuickViewDrawer
      isOpen={Boolean(categoryType)}
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
              href={`/admin/category-types/${activeItem.id}/edit`}
              className="px-4 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              Edit Type
            </Link>
          </>
        ) : null
      }
    >
      {activeItem && (
        <>
          <div>
            <div className="flex items-center gap-2 mb-1 text-xs text-muted">
              <FolderTree className="w-4 h-4 text-primary" />
              <span>Category Type</span>
            </div>
            <h2 className="text-lg font-bold text-heading leading-snug">
              {activeItem.name}
            </h2>
            <div className="flex items-center gap-3 mt-3">
              <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-lg bg-surface border border-border text-heading">
                <Tag className="w-3 h-3 text-primary" />
                Slug: {activeItem.slug || "—"}
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

          <div className="border border-border rounded-xl p-4 bg-surface-alt space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-heading flex items-center gap-1.5">
              System Audit Info
            </h4>
            <div className="text-[11px] space-y-1.5 text-muted">
              <div className="flex justify-between">
                <span>ID:</span>
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
