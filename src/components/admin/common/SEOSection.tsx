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
}

interface SEOSectionProps<T extends SEOFormFields> {
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  watchedValues?: {
    meta_title?: string;
    meta_description?: string;
    slug?: string;
    title?: string;
  };
  baseDomain?: string;
  urlPrefix?: string;
}

export default function SEOSection<T extends SEOFormFields>({
  register,
  errors,
  watchedValues = {},
  baseDomain = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  urlPrefix = "blog/",
}: SEOSectionProps<T>) {
  const { meta_title, meta_description, slug, title } = watchedValues;

  const displayTitle = meta_title || title || "Your Page Title";

  // Clean trailing and leading slashes without regex backtracking warnings
  const cleanBase = baseDomain.endsWith("/")
    ? baseDomain.slice(0, -1)
    : baseDomain;
  const cleanPrefix = urlPrefix.replace(/^\/+|\/+$/g, "");
  const pathSegment = [cleanPrefix, slug || "your-slug"]
    .filter(Boolean)
    .join("/");
  const displayUrl = `${cleanBase}/${pathSegment}`;

  const displayDesc =
    meta_description ||
    "Add a meta description to see how this post will look in search engines.";

  return (
    <SectionCard title="Search Engine Optimization (SEO)" icon={Globe}>
      {/* Meta Title */}
      <div>
        <label
          htmlFor="meta_title"
          className="block text-sm font-medium text-[var(--color-heading)] mb-1"
        >
          Meta Title
        </label>
        <input
          id="meta_title"
          type="text"
          maxLength={60}
          placeholder={title || "Default page title will be used"}
          {...register("meta_title" as any)}
          className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2 text-sm text-[var(--color-heading)] placeholder:text-[var(--color-muted)] focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-colors"
        />
        <div className="mt-1 flex justify-between text-xs text-[var(--color-muted)]">
          <span>Target: 50-60 characters</span>
          <span>{meta_title?.length || 0}/60</span>
        </div>
        {errors.meta_title && (
          <p className="mt-1 text-xs text-red-500">
            {errors.meta_title.message as string}
          </p>
        )}
      </div>

      {/* Meta Description */}
      <div>
        <label
          htmlFor="meta_description"
          className="block text-sm font-medium text-[var(--color-heading)] mb-1"
        >
          Meta Description
        </label>
        <textarea
          id="meta_description"
          rows={3}
          maxLength={160}
          placeholder="Brief description that displays in search engine results..."
          {...register("meta_description" as any)}
          className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2 text-sm text-[var(--color-heading)] placeholder:text-[var(--color-muted)] focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-colors"
        />
        <div className="mt-1 flex justify-between text-xs text-[var(--color-muted)]">
          <span>Target: 150-160 characters</span>
          <span>{meta_description?.length || 0}/160</span>
        </div>
        {errors.meta_description && (
          <p className="mt-1 text-xs text-red-500">
            {errors.meta_description.message as string}
          </p>
        )}
      </div>

      {/* Canonical URL / Original Link */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label
            htmlFor="canonical_url"
            className="block text-sm font-medium text-[var(--color-heading)]"
          >
            Original Link (Canonical URL)
          </label>
          <span className="text-xs text-[var(--color-muted)]">Optional</span>
        </div>
        <input
          id="canonical_url"
          type="url"
          placeholder={`${cleanBase}/original-article`}
          {...register("canonical_url" as any)}
          className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2 text-sm text-[var(--color-heading)] placeholder:text-[var(--color-muted)] focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-colors"
        />
        <p className="mt-1 text-xs text-[var(--color-muted)]">
          If this article was previously published elsewhere, link to the
          original URL here to prevent duplicate content penalties.
        </p>
        {errors.canonical_url && (
          <p className="mt-1 text-xs text-red-500">
            {errors.canonical_url.message as string}
          </p>
        )}
      </div>

      {/* Google Search Result Preview */}
      <div className="mt-4 rounded-lg bg-[var(--color-surface-alt)] p-4 border border-[var(--color-border-subtle)]">
        <p className="text-xs font-semibold text-[var(--color-muted)] mb-2 uppercase tracking-wide">
          Google Search Preview
        </p>
        <p className="text-xs text-blue-700 truncate">{displayUrl}</p>
        <h3 className="text-base font-medium text-blue-800 hover:underline cursor-pointer truncate">
          {displayTitle}
        </h3>
        <p className="text-xs text-[var(--color-muted)] line-clamp-2 mt-0.5">
          {displayDesc}
        </p>
      </div>
    </SectionCard>
  );
}
