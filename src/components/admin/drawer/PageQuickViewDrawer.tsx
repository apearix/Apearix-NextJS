"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Globe, Edit3, FileText } from "lucide-react";
import { QuickViewDrawer } from "@/components/admin/common/QuickViewDrawer";
import type { PageFormValues } from "@/schemas/page.schema";
import { formatDateTimeInTimezone } from "@/lib/timezone";

export interface PageQuickViewDrawerProps {
  page: PageFormValues | null;
  onClose: () => void;
}

export function PageQuickViewDrawer({ page, onClose }: Readonly<PageQuickViewDrawerProps>) {
  const [cachedPage, setCachedPage] = useState<PageFormValues | null>(page);

  useEffect(() => {
    if (page) {
      setCachedPage(page);
    }
  }, [page]);

  const activePage = page || cachedPage;

  return (
    <QuickViewDrawer
      isOpen={Boolean(page)}
      onClose={onClose}
      headerContent={
        activePage ? (
          <div className="flex items-center gap-2 truncate">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary-light text-primary uppercase shrink-0">
              {activePage.status || "published"}
            </span>
            <span className="text-xs text-muted font-mono truncate">
              /{activePage.slug}
            </span>
          </div>
        ) : null
      }
      footerActions={
        activePage ? (
          <>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-border text-xs font-semibold rounded-lg text-heading hover:bg-white transition-colors cursor-pointer"
            >
              Close
            </button>
            <Link
              href={`/admin/pages/${activePage.id}/edit`}
              className="px-4 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              Edit in Form
            </Link>
          </>
        ) : null
      }
    >
      {activePage && (
        <>
          {/* Header & Title */}
          <div>
            <div className="flex items-center gap-2 mb-1 text-xs text-muted">
              <FileText className="w-4 h-4 text-primary" />
              <span>Static Page</span>
            </div>
            <h2 className="text-xl font-bold text-heading leading-snug">
              {activePage.title}
            </h2>
            <div className="flex items-center gap-2 mt-2 text-xs text-muted">
              <span>Published:</span>
              <span>
                {activePage.published_at
                  ? formatDateTimeInTimezone(activePage.published_at)
                  : "Not Published"}
              </span>
            </div>
          </div>

          {/* Content Preview */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted mb-1.5">
              Content Preview
            </h4>
            <div
              data-lenis-prevent="true"
              className="text-xs text-body bg-white px-3 py-2 rounded-lg border border-border max-h-56 overflow-y-auto leading-relaxed overscroll-contain prose prose-xs max-w-none [&_p]:mb-2 [&_h1]:text-sm [&_h1]:font-bold [&_h2]:text-xs [&_h2]:font-bold [&_ul]:list-disc [&_ul]:pl-4 [&_ol]:list-decimal [&_ol]:pl-4"
              dangerouslySetInnerHTML={{
                __html: activePage.content?.trim() || "<p>No content.</p>",
              }}
            />
          </div>

          {/* SEO Metadata */}
          <div className="border border-border rounded-xl p-4 bg-surface-alt space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-heading flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-primary" />
              SEO Metadata
            </h4>
            <div className="text-[11px] space-y-1.5">
              <div>
                <span className="text-muted font-medium">Meta Title:</span>{" "}
                <span className="text-heading">
                  {activePage.meta_title || activePage.title}
                </span>
              </div>
              <div>
                <span className="text-muted font-medium">Meta Description:</span>{" "}
                <span className="text-body">
                  {activePage.meta_description || "—"}
                </span>
              </div>
              <div>
                <span className="text-muted font-medium">Page URL:</span>{" "}
                <Link
                  href={`https://apearix.com/${activePage.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary font-mono text-[10px] hover:underline"
                >
                  https://apearix.com/{activePage.slug}
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </QuickViewDrawer>
  );
}
