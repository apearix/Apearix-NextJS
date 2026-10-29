export const dynamic = "force-dynamic";

import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Edit3,
  ExternalLink,
  Layers,
  Tag,
  Hash,
  Globe,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Layout,
  Code,
  Shield,
  Cpu,
  Smartphone,
  Cloud,
  Database,
  Zap,
  Server,
  Sparkles,
} from "lucide-react";
import { serverApi } from "@/lib/serverApi";
import { formatServiceItem } from "@/lib/services/admin/services";
import { PageHeader } from "@/components/admin/common/PageHeader";
import { SectionCard } from "@/components/admin/common/SectionCard";
import { formatDateTimeInTimezone } from "@/lib/timezone";

export const metadata = {
  title: "Admin - Service Details",
};

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

export default async function ServiceShowPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  let initialData = null;

  try {
    initialData = await serverApi<any>(`/api/v1/admin/services/${resolvedParams.id}`, {
      cache: "no-store",
    });
  } catch (error) {
    console.error("Failed to fetch service details:", error);
    notFound();
  }

  const rawItem = initialData?.data || initialData;
  if (!rawItem || (!rawItem.id && !rawItem.title)) {
    notFound();
  }

  const service = formatServiceItem(rawItem);
  const categoryName = service.category?.name || "Services";

  return (
    <main className="max-w-7xl mx-auto pb-16">
      {/* Header */}
      <PageHeader
        title={service.title}
        subtitle={`Service details and public configuration`}
        badge={service.is_active ? "Active" : "Inactive"}
        btn={
          <div className="flex items-center gap-2">
            <Link
              href="/admin/services"
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-surface hover:bg-surface-alt border border-border text-heading text-sm font-semibold rounded-lg transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-muted" /> Back to Services
            </Link>
            <Link
              href={`/admin/services/${service.id}/edit`}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary-hover text-white text-sm font-semibold rounded-lg shadow-sm shadow-primary/20 transition-all active:scale-[0.98] cursor-pointer"
            >
              <Edit3 className="w-4 h-4" /> Edit Service
            </Link>
          </div>
        }
      />

      {/* Main Grid */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Overview Card */}
          <SectionCard
            title="Service Overview"
            subtitle="Identification, hierarchy, and public endpoint"
          >
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 rounded-xl bg-surface border border-border">
                <div className="w-12 h-12 rounded-xl bg-primary-light border border-border-accent flex items-center justify-center shrink-0">
                  {renderServiceIcon(service.icon)}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg font-bold text-heading leading-snug">
                    {service.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-muted font-mono mt-1">
                    <span>Slug:</span>
                    <span className="text-primary font-semibold">/services/{service.slug}</span>
                  </div>
                </div>
              </div>

              {/* Tags & Badges */}
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-surface border border-border text-heading">
                  <Tag className="w-3.5 h-3.5 text-primary" />
                  Category: <strong className="font-semibold">{categoryName}</strong>
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-surface border border-border text-heading">
                  <Hash className="w-3.5 h-3.5 text-primary" />
                  Display Order: <strong className="font-semibold">{service.order ?? 0}</strong>
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-surface border border-border text-heading">
                  <Layout className="w-3.5 h-3.5 text-primary" />
                  Icon: <code className="font-mono text-primary">{service.icon || "layout"}</code>
                </span>
              </div>

              {/* Excerpt */}
              {service.excerpt && (
                <div className="mt-4 pt-4 border-t border-border">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted mb-1.5">
                    Short Summary / Excerpt
                  </h4>
                  <p className="text-sm text-heading bg-white p-3.5 rounded-xl border border-border leading-relaxed">
                    {service.excerpt}
                  </p>
                </div>
              )}
            </div>
          </SectionCard>

          {/* Description Card */}
          <SectionCard
            title="Service Description & Content"
            subtitle="Full specifications and deliverables"
          >
            <div className="bg-white p-5 rounded-xl border border-border min-h-36">
              {service.description ? (
                <div
                  className="prose prose-sm max-w-none text-heading leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: service.description }}
                />
              ) : (
                <p className="text-xs text-muted italic">No detailed description has been added for this service.</p>
              )}
            </div>
          </SectionCard>

          {/* SEO Preview Card */}
          <SectionCard
            title="Search Engine Optimization (SEO)"
            subtitle="Preview how this service looks in search engine results"
          >
            <div className="bg-surface p-4 rounded-xl border border-border">
              <div className="flex items-center gap-2 mb-2">
                <Globe className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold uppercase tracking-wider text-muted">
                  Google Search Snippet Preview
                </span>
              </div>
              <div className="text-base font-medium text-[#1a0dab] line-clamp-1 hover:underline cursor-pointer">
                {service.seo?.meta_title || service.title}
              </div>
              <div className="text-xs text-emerald-700 font-mono my-0.5 truncate">
                {service.seo?.canonical_url || `https://apearix.com/services/${service.slug}`}
              </div>
              <p className="text-xs text-muted line-clamp-2 mt-1 leading-normal">
                {service.seo?.meta_description || service.excerpt || "No meta description provided for this service."}
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
                {service.is_active ? (
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
                    {service.created_at ? formatDateTimeInTimezone(service.created_at) : "—"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" /> Last Updated
                  </span>
                  <span className="text-heading font-medium">
                    {service.updated_at ? formatDateTimeInTimezone(service.updated_at) : "—"}
                  </span>
                </div>
              </div>

              {/* Public link */}
              <div className="pt-3 border-t border-border">
                <Link
                  href={`/services/${service.slug}`}
                  target="_blank"
                  className="w-full inline-flex items-center justify-center gap-2 px-3.5 py-2 bg-surface hover:bg-surface-alt border border-border text-heading text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-primary" />
                  View Public Service Page
                </Link>
              </div>
            </div>
          </SectionCard>

          {/* Featured Image Card */}
          <SectionCard title="Featured Image">
            {service.featured_image ? (
              <div className="rounded-xl overflow-hidden aspect-video bg-surface border border-border">
                <img
                  src={service.featured_image}
                  alt={service.title}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-border bg-surface p-8 text-center text-xs text-muted">
                No featured image uploaded.
              </div>
            )}
          </SectionCard>
        </div>
      </div>
    </main>
  );
}
