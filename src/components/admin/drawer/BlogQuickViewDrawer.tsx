"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Globe, Edit3 } from "lucide-react";
import { QuickViewDrawer } from "@/components/admin/common/QuickViewDrawer";
import type { PostFormValues } from "@/app/(roles)/admin/blogs/page";

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
              href={`/admin/blogs/edit/${activePost.id}`}
              className="px-4 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              Edit in Form
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
            <div className="flex items-center gap-2 mt-2 text-xs text-muted">
              <span className="font-medium text-heading">
                {activePost.publishing.author_id}
              </span>
              <span>•</span>
              <span>
                {activePost.publishing.published_at
                  ? new Date(activePost.publishing.published_at).toLocaleString()
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
              className="text-xs text-body bg-white p-3 rounded-lg border border-border max-h-44 overflow-y-auto leading-relaxed overscroll-contain"
            >
              {activePost.content || "No content."}
            </div>
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
                  {activePost.seo?.meta_title || activePost.title}
                </span>
              </div>
              <div>
                <span className="text-muted font-medium">Meta Description:</span>{" "}
                <span className="text-body">
                  {activePost.seo?.meta_description || "—"}
                </span>
              </div>
              <div>
                <span className="text-muted font-medium">Canonical:</span>{" "}
                <Link
                  href={activePost.seo?.canonical_url || `https://apearix.com/blog/${activePost.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary font-mono text-[10px] hover:underline"
                >
                  {activePost.seo?.canonical_url || `https://apearix.com/blog/${activePost.slug}`}
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </QuickViewDrawer>
  );
}