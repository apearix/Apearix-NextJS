"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { HelpCircle, Edit3, Tag, Hash } from "lucide-react";
import { QuickViewDrawer } from "@/components/admin/common/QuickViewDrawer";
import type { FaqFormValues } from "@/schemas/faq.schema";
import { formatDateTimeInTimezone } from "@/lib/timezone";

export interface FaqQuickViewDrawerProps {
  faq: FaqFormValues | null;
  onClose: () => void;
}

export function FaqQuickViewDrawer({ faq, onClose }: Readonly<FaqQuickViewDrawerProps>) {
  const [cachedFaq, setCachedFaq] = useState<FaqFormValues | null>(faq);

  useEffect(() => {
    if (faq) {
      setCachedFaq(faq);
    }
  }, [faq]);

  const activeFaq = faq || cachedFaq;

  return (
    <QuickViewDrawer
      isOpen={Boolean(faq)}
      onClose={onClose}
      headerContent={
        activeFaq ? (
          <div className="flex items-center gap-2 truncate">
            {activeFaq.is_active ? (
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase shrink-0">
                Active
              </span>
            ) : (
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 uppercase shrink-0">
                Inactive
              </span>
            )}
            <span className="text-xs text-muted font-mono truncate">
              {activeFaq.category || "general"}
            </span>
          </div>
        ) : null
      }
      footerActions={
        activeFaq ? (
          <>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-border text-xs font-semibold rounded-lg text-heading hover:bg-white transition-colors cursor-pointer"
            >
              Close
            </button>
            <Link
              href={`/admin/faqs/${activeFaq.id}/edit`}
              className="px-4 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              Edit FAQ
            </Link>
          </>
        ) : null
      }
    >
      {activeFaq && (
        <>
          {/* Question & Meta */}
          <div>
            <div className="flex items-center gap-2 mb-1 text-xs text-muted">
              <HelpCircle className="w-4 h-4 text-primary" />
              <span>FAQ Item</span>
            </div>
            <h2 className="text-lg font-bold text-heading leading-snug">
              {activeFaq.question}
            </h2>
            <div className="flex items-center gap-3 mt-3">
              <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-lg bg-surface border border-border text-heading">
                <Tag className="w-3 h-3 text-primary" />
                Category: {activeFaq.category || "general"}
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-lg bg-surface border border-border text-heading">
                <Hash className="w-3 h-3 text-primary" />
                Order: {activeFaq.order ?? 0}
              </span>
            </div>
          </div>

          {/* Answer Preview */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted mb-1.5">
              Answer Details
            </h4>
            <div
              data-lenis-prevent="true"
              className="text-xs text-body bg-white px-3 py-3 rounded-xl border border-border max-h-60 overflow-y-auto leading-relaxed overscroll-contain prose prose-xs max-w-none [&_p]:mb-2 [&_h1]:text-sm [&_h1]:font-bold [&_h2]:text-xs [&_h2]:font-bold [&_ul]:list-disc [&_ul]:pl-4 [&_ol]:list-decimal [&_ol]:pl-4"
              dangerouslySetInnerHTML={{
                __html: activeFaq.answer?.trim() || "<p>No answer details provided.</p>",
              }}
            />
          </div>

          {/* Audit Info */}
          <div className="border border-border rounded-xl p-4 bg-surface-alt space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-heading flex items-center gap-1.5">
              System Audit Info
            </h4>
            <div className="text-[11px] space-y-1.5 text-muted">
              <div className="flex justify-between">
                <span>FAQ ID:</span>
                <span className="font-mono text-heading">{activeFaq.id || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span>Created Date:</span>
                <span className="text-heading">
                  {activeFaq.created_at ? formatDateTimeInTimezone(activeFaq.created_at) : "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Last Modified:</span>
                <span className="text-heading">
                  {activeFaq.updated_at ? formatDateTimeInTimezone(activeFaq.updated_at) : "Just now"}
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </QuickViewDrawer>
  );
}
