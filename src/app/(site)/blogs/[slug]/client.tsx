"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Clock,
  Calendar,
  Copy,
  Check,
  ChevronRight,
  ArrowUpRight,
} from "lucide-react";
import type { BlogPost } from "@/lib/services/site/blogs";
import { BlogAuthorAvatar, BlogCoverImage } from "../_components/BlogMedia";
import { BlogCard } from "../_components/BlogCard";

interface BlogShowClientProps {
  post: BlogPost;
  relatedPosts: BlogPost[];
}

export default function BlogShowClient({
  post,
  relatedPosts,
}: Readonly<BlogShowClientProps>) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    if (typeof window === "undefined") return;
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable in restricted contexts
    }
  };

  return (
    <div className="w-full bg-background relative selection:bg-primary-light selection:text-primary">
      {/* ----------------- ARTICLE HEADER / HERO ----------------- */}
      <header className="pt-10  sm:pt-22  bg-linear-to-b from-surface via-background to-background ">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 xl:px-0">
          <div className="flex flex-wrap items-center gap-2.5 mb-5">
            <span className="px-3 py-1 bg-primary-light border border-border-accent text-primary text-xs font-bold rounded-full">
              {post.category}
            </span>
            <span className="text-xs text-muted flex items-center gap-1.5 font-medium">
              <Clock className="w-3.5 h-3.5" /> {post.readTime}
            </span>
            {post.date && (
              <span className="text-xs text-muted flex items-center gap-1.5 font-medium">
                <Calendar className="w-3.5 h-3.5" /> {post.date}
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-heading tracking-tight leading-[1.15] text-balance mb-6">
            {post.title}
          </h1>

          {post.snippet && (
            <p className="text-base sm:text-xl text-body leading-relaxed max-w-3xl mb-8">
              {post.snippet}
            </p>
          )}
        </div>
      </header>

      {/* ----------------- MAIN CONTENT & SIDEBAR GRID ----------------- */}
      <div className="container max-w-7xl mx-auto px-4 xl:px-0 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Right Sidebar: Sticky TOC & CTA */}
          <aside className="lg:col-span-4 hidden lg:block">
            <div className="sticky top-20 space-y-6">
              {/* Table of Contents Box */}
              {post.tocItems.length > 0 && (
                <div className="p-6 rounded-2xl bg-surface border border-border">
                  <div className="text-xs font-bold text-heading uppercase tracking-wider mb-4 flex items-center gap-2">
                    <span>Table of Contents</span>
                  </div>
                  <nav className="space-y-2.5 text-xs sm:text-sm">
                    {post.tocItems.map((item) => (
                      <a
                        key={item.id}
                        href={`#${item.id}`}
                        className="block text-muted hover:text-primary transition-colors py-1 leading-snug"
                      >
                        {item.label}
                      </a>
                    ))}
                  </nav>
                </div>
              )}

              {/* Author Info Card */}
              <div className="p-6 rounded-2xl bg-surface border border-border">
                <div className="text-xs font-bold text-muted uppercase tracking-wider mb-3">
                  About the Author
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden border border-border">
                    <BlogAuthorAvatar
                      src={post.author.avatar}
                      name={post.author.name}
                      sizes="48px"
                      textClassName="text-sm"
                    />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-heading">{post.author.name}</div>
                    <div className="text-xs text-muted">{post.author.role}</div>
                  </div>
                </div>
                <p className="text-xs text-body leading-relaxed">
                  Specializing in distributed systems architecture, high-scale Next.js infrastructure, and AI engineering workflows at Apearix.
                </p>
              </div>

              {/* Mini CTA */}
              <div className="p-6 rounded-2xl bg-primary text-white space-y-3">
                <h4 className="text-sm font-bold">Building High-Scale Systems?</h4>
                <p className="text-xs text-white/80 leading-relaxed">
                  Partner with our engineering team to audit your Next.js application or design custom AI architectures.
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-lg bg-white text-primary hover:bg-surface transition-colors"
                >
                  <span>Talk to an Architect</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </aside>

          {/* Left Article Body */}
          <main className="lg:col-span-8">
            <div className="container mb-4">
              <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-border  bg-surface-alt">
                <div className="absolute bottom-2 right-2 z-10 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    aria-label="Copy Blog Link"
                    className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-surface border border-border hover:border-border-accent hover:text-primary text-primary text-xs font-medium transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-green-600" />
                        <span className="text-green-600 font-semibold">Copied Link!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Share Blog</span>
                      </>
                    )}
                  </button>
                </div>
                <BlogCoverImage
                  src={post.coverImage}
                  alt={post.title}
                  preload
                  sizes="(max-width: 1024px) 100vw, 1020px"
                  className="object-cover object-center"
                />
              </div>
            </div>

            <article
              className="prose prose-slate max-w-none text-body leading-relaxed prose-headings:text-heading prose-headings:font-bold prose-headings:tracking-tight prose-headings:scroll-mt-24 prose-h1:text-3xl prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3 prose-p:text-body prose-p:leading-relaxed prose-a:text-[#6D28F5] prose-a:underline prose-a:font-semibold hover:prose-a:opacity-80 prose-ul:list-disc prose-ul:pl-6 prose-ol:list-decimal prose-ol:pl-6 prose-li:my-1.5 prose-code:text-[#6D28F5] prose-code:bg-primary-light prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-xs prose-strong:text-heading prose-strong:font-semibold"
              dangerouslySetInnerHTML={{
                __html: post.contentHtml || "<p>No content available.</p>",
              }}
            />

            {/* Article Tags */}
            {post.tags.length > 0 && (
              <div className="mt-6 pt-6 border-t border-border flex flex-wrap items-center gap-2">
                <span className="text-xs font-medium text-muted mr-1">Tagged:</span>
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-md text-xs font-medium bg-surface-alt border border-border text-muted hover:border-primary transition-colors"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* ----------------- RELATED ARTICLES SECTION ----------------- */}
      {relatedPosts.length > 0 && (
        <section className="py-16 bg-surface border-t border-border">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-xs font-bold text-primary uppercase tracking-wider">
                  Recommended Reading
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-heading mt-1">
                  Related Architecture Guides
                </h2>
              </div>
              <Link
                href="/blogs"
                className="text-xs sm:text-sm font-semibold text-primary hover:underline flex items-center gap-1"
              >
                <span>View all articles</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.map((article) => (
                <BlogCard key={article.id} article={article} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
