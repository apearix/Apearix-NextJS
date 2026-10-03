"use client";

import React from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { Globe } from "lucide-react";
import { SectionCard } from "./SectionCard";

export interface SEOFormFields {
  meta_title?: string;
  meta_description?: string;
  canonical_url?: string;
  slug?: string;
  title?: string;
  seo?: {
    meta_title?: string;
    meta_description?: string;
    canonical_url?: string;
  };
}

interface SEOSectionProps<T extends Record<string, any>> {
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  watchedValues?: {
    meta_title?: string;
    meta_description?: string;
    canonical_url?: string;
    slug?: string;
    title?: string;
  };
  baseDomain?: string;
  urlPrefix?: string;
  fieldNamePrefix?: "seo." | ""; // Default "seo." for nested schemas
}

export default function SEOSection<T extends Record<string, any>>({
  register,
  errors,
  watchedValues = {},
  baseDomain = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  urlPrefix = "blog/",
  fieldNamePrefix = "seo.",
}: Readonly<SEOSectionProps<T>>) {
  const { meta_title, meta_description, slug, title } = watchedValues;

  const displayTitle = meta_title || title || "Your Page Title";
  const cleanBase = baseDomain.endsWith("/") ? baseDomain.slice(0, -1) : baseDomain;
  const cleanPrefix = urlPrefix.replace(/^\/+|\/+$/g, "");
  const pathSegment = [cleanPrefix, slug || "your-slug"].filter(Boolean).join("/");
  const displayUrl = `${cleanBase}/${pathSegment}`;
  const displayDesc =
    meta_description ||
    "Add a meta description to see how this post will look in search engines.";

  // Nested error helper
  const getNestedError = (fieldName: string) => {
    if (fieldNamePrefix === "seo.") {
      return (errors.seo as any)?.[fieldName]?.message;
    }
    return (errors as any)?.[fieldName]?.message;
  };

  const metaTitleError = getNestedError("meta_title");
  const metaDescError = getNestedError("meta_description");
  const canonicalUrlError = getNestedError("canonical_url");

  return (
    <SectionCard title="Search Engine Optimization (SEO)" icon={Globe}>
      {/* Meta Title */}
      <div>
        <label htmlFor="meta_title" className="block mb-1 text-heading text-sm font-medium">
          Meta Title
        </label>
        <input
          id="meta_title"
          type="text"
          maxLength={60}
          placeholder={title || "Default page title will be used"}
          {...register(`${fieldNamePrefix}meta_title` as any)}
          className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm text-heading placeholder:text-muted focus:border-(--color-primary) focus:ring-1 focus:ring-(--color-primary) transition-colors"
        />
        <div className="mt-1 flex justify-between text-xs text-muted">
          <span>Target: 50-60 characters</span>
          <span>{meta_title?.length || 0}/60</span>
        </div>
        {metaTitleError && (
          <p className="mt-1 text-xs text-red-500">{metaTitleError}</p>
        )}
      </div>

      {/* Meta Description */}
      <div>
        <label htmlFor="meta_description" className="block mb-1 text-heading text-sm font-medium">
          Meta Description
        </label>
        <textarea
          id="meta_description"
          rows={3}
          maxLength={160}
          placeholder="Brief description that displays in search engine results..."
          {...register(`${fieldNamePrefix}meta_description` as any)}
          className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm text-heading placeholder:text-muted focus:border-(--color-primary) focus:ring-1 focus:ring-(--color-primary) transition-colors"
        />
        <div className="mt-1 flex justify-between text-xs text-muted">
          <span>Target: 150-160 characters</span>
          <span>{meta_description?.length || 0}/160</span>
        </div>
        {metaDescError && (
          <p className="mt-1 text-xs text-red-500">{metaDescError}</p>
        )}
      </div>

      {/* Canonical URL / Original Link */}
      <div>
        <label htmlFor="canonical_url" className="block mb-1 text-heading text-sm font-medium">
          Original Link (Canonical URL)
        </label>
        <input
          id="canonical_url"
          type="url"
          placeholder={`${cleanBase}/original-article`}
          {...register(`${fieldNamePrefix}canonical_url` as any)}
          className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm text-heading placeholder:text-muted focus:border-(--color-primary) focus:ring-1 focus:ring-(--color-primary) transition-colors"
        />
        <p className="mt-1 text-xs text-muted">
          If this article was previously published elsewhere, link to the original URL here to prevent duplicate content penalties.
        </p>
        {canonicalUrlError && (
          <p className="mt-1 text-xs text-red-500">{canonicalUrlError}</p>
        )}
      </div>

      {/* Google Search Result Preview */}
      <div className="mt-4 rounded-lg bg-surface-alt p-4 border border-border-subtle">
        <p className="text-xs font-semibold text-muted mb-2 uppercase tracking-wide">
          Google Search Preview
        </p>
        <p className="text-xs text-blue-700 truncate">{displayUrl}</p>
        <h3 className="text-base font-medium text-blue-800 hover:underline cursor-pointer truncate">
          {displayTitle}
        </h3>
        <p className="text-xs text-muted line-clamp-2 mt-0.5 wrap-break-word">
          {displayDesc}
        </p>
      </div>
    </SectionCard>
  );
}