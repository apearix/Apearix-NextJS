"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Globe, Edit3 } from "lucide-react";
import { QuickViewDrawer } from "@/components/admin/common/QuickViewDrawer";
import type { PostFormValues } from "@/schemas/blog.schema";
import { getAuthorName } from "@/lib/services/admin/blogs";
import { formatDateTimeInTimezone } from "@/lib/timezone";

export interface BlogQuickViewDrawerProps {
  post: PostFormValues | null;
  onClose: () => void;
}

export function BlogQuickViewDrawer({ post, onClose }: Readonly<BlogQuickViewDrawerProps>) {
  // Post data preserve rakhte hain taaki close slide animation ke dauran content blank na ho
  const [cachedPost, setCachedPost] = useState<PostFormValues | null>(post);

  useEffect(() => {
    if (post) {
      setCachedPost(post);
    }
  }, [post]);

  const activePost = post || cachedPost;

  return (
    <QuickViewDrawer
      isOpen={Boolean(post)}
      onClose={onClose}
      headerContent={
        activePost ? (
          <div className="flex items-center gap-2 truncate">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary-light text-primary uppercase shrink-0">
              {activePost.publishing.status}
            </span>
            <span className="text-xs text-muted font-mono truncate">
              /blog/{activePost.slug}
            </span>
          </div>
        ) : null
      }
      footerActions={
        activePost ? (
          <>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-border text-xs font-semibold rounded-lg text-heading hover:bg-white transition-colors cursor-pointer"
            >
              Close
            </button>
            <Link
              href={`/admin/blogs/${activePost.id}/edit`}
              className="px-4 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              Edit Post
            </Link>
          </>
        ) : null
      }
    >
      {activePost && (
        <>
          {/* Featured Image */}
          {activePost.featured_image && (
            <div className="rounded-xl overflow-hidden aspect-video bg-surface-alt border border-border">
              <img
                src={activePost.featured_image}
                alt={activePost.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Title & Author Info */}
          <div>
            <h2 className="text-xl font-bold text-heading leading-snug">
              {activePost.title}
            </h2>
            <div className="flex items-center gap-2 mt-2 text-xs text-muted flex-wrap">
              <span className="font-medium text-heading">
                {getAuthorName(activePost.publishing.author_id, activePost.author, activePost.author_name)}
              </span>
              {activePost.category?.name && (
                <>
                  <span>•</span>
                  <span className="px-2 py-0.5 rounded-full bg-surface-alt border border-border text-primary font-medium">
                    {activePost.category.name}
                  </span>
                </>
              )}
              <span>•</span>
              <span>
                {activePost.publishing.published_at
                  ? formatDateTimeInTimezone(activePost.publishing.published_at)
                  : "Not Published"}
              </span>
            </div>
          </div>

          {/* Excerpt */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted mb-1.5">
              Excerpt
            </h4>
            <p className="text-xs text-body bg-surface p-3 rounded-lg border border-border leading-relaxed">
              {activePost.excerpt || "No excerpt provided."}
            </p>
          </div>

          {/* Content Preview */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted mb-1.5">
              Content Preview
            </h4>
            <div
              data-lenis-prevent="true"
              className="text-xs text-body bg-white px-3 py-3 rounded-xl border border-border max-h-48 overflow-y-auto leading-relaxed overscroll-contain prose prose-xs max-w-none [&_p]:mb-2 [&_h1]:text-sm [&_h1]:font-bold [&_h2]:text-xs [&_h2]:font-bold [&_ul]:list-disc [&_ul]:pl-4 [&_ol]:list-decimal [&_ol]:pl-4"
              dangerouslySetInnerHTML={{
                __html: activePost.content?.trim() || "<p>No content provided.</p>",
              }}
            />
          </div>

          {/* SEO Preview */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted mb-1.5">
              Search Engine Preview
            </h4>
            <div className="border border-border rounded-xl p-4 bg-surface-alt space-y-1">
              <span className="text-[11px] text-emerald-700 flex items-center gap-1">
                <Globe className="w-3 h-3" />
                https://apearix.com/blog/{activePost.slug}
              </span>
              <h5 className="text-sm font-semibold text-primary truncate">
                {activePost.seo?.meta_title || activePost.title}
              </h5>
              <p className="text-xs text-muted line-clamp-2">
                {activePost.seo?.meta_description ||
                  activePost.excerpt ||
                  "No meta description set."}
              </p>
            </div>
          </div>

          {/* Audit Info */}
          <div className="border border-border rounded-xl p-4 bg-surface-alt space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-heading flex items-center gap-1.5">
              Audit Metadata
            </h4>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-muted block text-[11px]">Post ID</span>
                <span className="font-mono text-heading font-medium truncate block">
                  {activePost.id || "N/A"}
                </span>
              </div>
              <div>
                <span className="text-muted block text-[11px]">Slug Type</span>
                <span className="text-heading font-medium">
                  {activePost.is_manual_slug ? "Manual Override" : "Auto Generated"}
                </span>
              </div>
              <div>
                <span className="text-muted block text-[11px]">Category</span>
                <span className="text-heading font-medium">
                  {activePost.category?.name || "Uncategorized"}
                </span>
              </div>
              <div>
                <span className="text-muted block text-[11px]">Last Updated</span>
                <span className="text-heading">
                  {activePost.updated_at ? formatDateTimeInTimezone(activePost.updated_at) : "N/A"}
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </QuickViewDrawer>
  );
}
