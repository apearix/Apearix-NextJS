"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Layers,
  Edit3,
  Tag,
  Hash,
  Globe,
  ExternalLink,
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
  CheckCircle2,
  Calendar,
} from "lucide-react";
import { QuickViewDrawer } from "@/components/admin/common/QuickViewDrawer";
import type { ServiceFormValues } from "@/schemas/service.schema";
import { formatDateTimeInTimezone } from "@/lib/timezone";

export interface ServiceQuickViewDrawerProps {
  service: ServiceFormValues | null;
  onClose: () => void;
}

// Dynamic Lucide icon helper
function renderServiceIcon(name?: string) {
  const iconLower = (name || "").toLowerCase().trim();
  const iconProps = { className: "w-5 h-5 text-primary" };

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

export function ServiceQuickViewDrawer({
  service,
  onClose,
}: Readonly<ServiceQuickViewDrawerProps>) {
  const [cachedService, setCachedService] = useState<ServiceFormValues | null>(service);

  useEffect(() => {
    if (service) {
      setCachedService(service);
    }
  }, [service]);

  const activeService = service || cachedService;
  const categoryDisplay = activeService?.category?.name || "Services";

  return (
    <QuickViewDrawer
      isOpen={Boolean(service)}
      onClose={onClose}
      headerContent={
        activeService ? (
          <div className="flex items-center gap-2 truncate">
            {activeService.is_active ? (
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase shrink-0">
                Active
              </span>
            ) : (
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 uppercase shrink-0">
                Inactive
              </span>
            )}
            <span className="text-xs text-muted font-mono truncate">
              /services/{activeService.slug}
            </span>
          </div>
        ) : null
      }
      footerActions={
        activeService ? (
          <>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-border text-xs font-semibold rounded-lg text-heading hover:bg-white transition-colors cursor-pointer"
            >
              Close
            </button>
            <Link
              href={`/admin/services/${activeService.id}`}
              className="px-3.5 py-2 bg-surface hover:bg-surface-alt border border-border text-heading text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5 text-muted" />
              Full Page
            </Link>
            <Link
              href={`/admin/services/${activeService.id}/edit`}
              className="px-4 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              Edit Service
            </Link>
          </>
        ) : null
      }
    >
      {activeService && (
        <div className="space-y-6">
          {/* Header Card */}
          <div className="border border-border rounded-xl p-4 bg-surface-alt">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary-light border border-border-accent flex items-center justify-center shrink-0">
                {renderServiceIcon(activeService.icon)}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-base font-bold text-heading leading-snug">
                  {activeService.title}
                </h3>
                <p className="text-xs text-muted font-mono mt-0.5">
                  Slug: {activeService.slug}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 mt-3.5 pt-3 border-t border-border/60">
              <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-lg bg-surface border border-border text-heading">
                <Tag className="w-3 h-3 text-primary" />
                Category: {categoryDisplay}
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-lg bg-surface border border-border text-heading">
                <Hash className="w-3 h-3 text-primary" />
                Order: {activeService.order ?? 0}
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-lg bg-surface border border-border text-heading">
                <Layout className="w-3 h-3 text-primary" />
                Icon: {activeService.icon || "layout"}
              </span>
            </div>
          </div>

          {/* Featured Image */}
          {activeService.featured_image && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted mb-2">
                Service Image
              </h4>
              <div className="rounded-xl overflow-hidden aspect-video bg-surface border border-border">
                <img
                  src={activeService.featured_image}
                  alt={activeService.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}

          {/* Excerpt */}
          {activeService.excerpt && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted mb-1.5">
                Overview / Excerpt
              </h4>
              <p className="text-xs text-body bg-white p-3 rounded-xl border border-border leading-relaxed">
                {activeService.excerpt}
              </p>
            </div>
          )}

          {/* Description */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted mb-1.5">
              Service Description
            </h4>
            <div
              data-lenis-prevent="true"
              className="text-xs text-body bg-white p-4 rounded-xl border border-border max-h-60 overflow-y-auto leading-relaxed prose prose-sm max-w-none"
            >
              {activeService.description ? (
                <div
                  dangerouslySetInnerHTML={{
                    __html: activeService.description,
                  }}
                />
              ) : (
                <p className="text-muted italic">No detailed description provided.</p>
              )}
            </div>
          </div>

          {/* SEO Preview */}
          {(activeService.seo?.meta_title || activeService.seo?.meta_description) && (
            <div className="border border-border rounded-xl p-4 bg-surface">
              <div className="flex items-center gap-2 mb-2">
                <Globe className="w-3.5 h-3.5 text-primary" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted">
                  Search Engine Snippet
                </h4>
              </div>
              <div className="font-semibold text-sm text-[#1a0dab] line-clamp-1">
                {activeService.seo?.meta_title || activeService.title}
              </div>
              <div className="text-xs text-emerald-700 font-mono truncate my-0.5">
                {activeService.seo?.canonical_url || `https://apearix.com/services/${activeService.slug}`}
              </div>
              <p className="text-xs text-muted line-clamp-2 mt-1">
                {activeService.seo?.meta_description || activeService.excerpt || "No meta description set."}
              </p>
            </div>
          )}

          {/* Metadata Footer */}
          <div className="pt-2 border-t border-border flex items-center justify-between text-[11px] text-muted">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3 h-3" />
              <span>
                Created:{" "}
                {activeService.created_at
                  ? formatDateTimeInTimezone(activeService.created_at)
                  : "—"}
              </span>
            </div>
            {activeService.updated_at && (
              <span>Updated: {formatDateTimeInTimezone(activeService.updated_at)}</span>
            )}
          </div>
        </div>
      )}
    </QuickViewDrawer>
  );
}
