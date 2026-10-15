"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Clock,
  Calendar, 
  Copy,
  Check, 
  ChevronRight,
  Sparkles,
  ArrowUpRight,
  Bird,
  LineChart
} from "lucide-react"; 
import type { BlogPost } from "../data";
interface BlogShowClientProps {
  post: BlogPost;
  relatedPosts: BlogPost[];
}

export default function BlogShowClient({ post, relatedPosts }: BlogShowClientProps) {
  const [copied, setCopied] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
 
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight =
        document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (windowHeight > 0) {
        setScrollProgress((totalScroll / windowHeight) * 100);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareOnTwitter = () => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`Read "${post.title}" on Apearix Engineering:`);
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, "_blank");
  };

  const shareOnLinkedIn = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, "_blank");
  };

  // Static Table of Contents Mock
  const tocItems = [
    { id: "the-latency-challenge", label: "The Sub-100ms Latency Challenge" },
    { id: "streaming-ssr-react-server-components", label: "Streaming SSR & React Server Components" },
    { id: "edge-caching-precision-invalidation", label: "Edge Caching & Targeted Revalidation" },
    { id: "database-and-orm-tuning", label: "Zero-Overhead Database Queries" },
    { id: "key-benchmarks-and-verdict", label: "Architecture Benchmarks & Takeaways" },
  ];

  return (
    <div className="w-full bg-background relative selection:bg-primary-light selection:text-primary pt-18">
      {/* Top Reading Progress Bar */}
      <div
        className="fixed top-0 left-0 h-1 bg-primary z-50 transition-all duration-100"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* ----------------- BREADCRUMBS & TOP NAV ----------------- */}
      <div className="border-b border-border bg-surface/50">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 xl:px-0 py-3.5">
          <div className="flex items-center justify-between">
            <Link
              href="/blogs"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-muted hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to all insights</span>
            </Link>

            <div className="hidden sm:flex items-center gap-2 text-xs text-muted">  
              <span>Blog</span>
              <ChevronRight className="w-3 h-3 text-border" />
              <span className="text-heading font-medium truncate max-w-[200px]">
                {post.category}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ----------------- ARTICLE HEADER / HERO ----------------- */}
      <header className="pt-10 pb-8 sm:pt-14 sm:pb-12 bg-gradient-to-b from-surface via-background to-background border-b border-border">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 xl:px-0">
          <div className="flex flex-wrap items-center gap-2.5 mb-5">
            <span className="px-3 py-1 bg-primary-light border border-border-accent text-primary text-xs font-bold rounded-full">
              {post.category}
            </span>
            <span className="text-xs text-muted flex items-center gap-1.5 font-medium">
              <Clock className="w-3.5 h-3.5" /> {post.readTime}
            </span>
            <span className="text-xs text-muted flex items-center gap-1.5 font-medium">
              <Calendar className="w-3.5 h-3.5" /> {post.date}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-heading tracking-tight leading-[1.15] text-balance mb-6">
            {post.title}
          </h1>

          <p className="text-base sm:text-xl text-body leading-relaxed max-w-3xl mb-8">
            {post.snippet}
          </p>

          {/* Author Card + Social Share strip */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-6 border-t border-border">
            <div className="flex items-center gap-3.5">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border border-border shadow-xs">
                <Image
                  src={post.author.avatar}
                  alt={post.author.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <div className="text-sm font-bold text-heading">{post.author.name}</div>
                <div className="text-xs text-muted">{post.author.role}</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-muted mr-1">Share:</span>
              <button
                onClick={shareOnTwitter}
                aria-label="Share on X"
                className="p-2 rounded-lg bg-surface border border-border hover:border-border-accent hover:text-primary text-muted transition-colors"
              >
                <Bird className="w-4 h-4" />
              </button>
              <button
                onClick={shareOnLinkedIn}
                aria-label="Share on LinkedIn"
                className="p-2 rounded-lg bg-surface border border-border hover:border-border-accent hover:text-primary text-muted transition-colors"
              >
                <LineChart className="w-4 h-4" />
              </button>
              <button
                onClick={handleCopyLink}
                aria-label="Copy Link"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-surface border border-border hover:border-border-accent hover:text-primary text-muted text-xs font-medium transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-green-600" />
                    <span className="text-green-600 font-semibold">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy URL</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ----------------- FEATURED BANNER IMAGE ----------------- */}
      <div className="container max-w-[1020px] mx-auto px-4 sm:px-6 lg:px-8 -mt-2 sm:-mt-4 mb-12">
        <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden border border-border shadow-xl bg-surface-alt">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 1020px"
            className="object-cover object-center"
          />
        </div>
        <p className="text-[12px] text-muted text-center mt-2.5 italic">
          Architecture overview: High-throughput ingestion & micro-frontend caching layers.
        </p>
      </div>

      {/* ----------------- MAIN CONTENT & SIDEBAR GRID ----------------- */}
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-14">
          {/* Left Article Body */}
          <main className="lg:col-span-8">
            <article className="prose prose-slate max-w-none prose-headings:text-heading prose-headings:font-bold prose-p:text-body prose-p:leading-relaxed prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-code:text-primary prose-pre:bg-surface-alt prose-pre:border prose-pre:border-border prose-pre:rounded-xl">
              <section id="the-latency-challenge">
                <h2 className="text-2xl font-bold tracking-tight text-heading border-b border-border pb-2.5 mt-">
                  The Sub-100ms Latency Challenge
                </h2>
                <p>
                  In enterprise SaaS platforms and heavy data-dense internal tools like Appsmith, latency directly dictates engineering velocity. Once time-to-interactive (TTI) climbs beyond 200 milliseconds, developers and operators perceive sluggishness, reducing daily task completions.
                </p>
                <p>
                  Modern web frameworks often solve initial paint by moving everything to client-side hydration. However, transmitting mega-sized JavaScript bundles across distributed geographical regions degrades Core Web Vitals (INP and LCP). To sustain reliable sub-100ms performance, the rendering paradigm must shift entirely toward hybrid streaming architectures.
                </p>
              </section>

              {/* Callout Info Box */}
              <div className="my-8 p-5 rounded-xl bg-surface-alt border-l-4 border-primary border border-border">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-heading mb-1">Architecture Directive</h4>
                    <p className="text-xs sm:text-sm text-body m-0">
                      Never block layout rendering on remote third-party API fetches. Wrap unpredictable endpoints inside React Suspense boundaries to allow skeleton shells to paint within 16 milliseconds.
                    </p>
                  </div>
                </div>
              </div>

              <section id="streaming-ssr-react-server-components">
                <h2 className="text-2xl font-bold tracking-tight text-heading border-b border-border pb-2.5 mt-10">
                  Streaming SSR & React Server Components
                </h2>
                <p>
                  By decoupling data acquisition from client JavaScript bundles, React Server Components (RSC) allow servers to execute database queries directly against co-located PostgreSQL instances and stream pre-rendered HTML chunks via standard HTTP/2 pipelines.
                </p>

                <pre className="p-4 rounded-xl bg-surface border border-border overflow-x-auto text-xs sm:text-sm text-heading font-mono">
{`// app/dashboard/page.tsx
import { Suspense } from "react";
import { MetricsGrid, MetricsSkeleton } from "@/components/metrics";

export default async function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Systems Telemetry</h1>
      {/* Critical UI paints immediately without waiting */}
      <Suspense fallback={<MetricsSkeleton />}>
        <MetricsGrid />
      </Suspense>
    </div>
  );
}`}
                </pre>
              </section>

              <section id="edge-caching-precision-invalidation">
                <h2 className="text-2xl font-bold tracking-tight text-heading border-b border-border pb-2.5 mt-10">
                  Edge Caching & Targeted Revalidation
                </h2>
                <p>
                  Static site generation is fast but insufficient for interactive SaaS platforms where data mutates continuously. Utilizing tag-based revalidation (ISR) at the edge provides static-level response latencies with real-time freshness guarantees.
                </p>
                <ul>
                  <li><strong>Tag-based purging:</strong> Tagging API calls with domain entities (e.g., <code>cache: [&apos;org_8921&apos;]</code>) allows localized cache busts when records update.</li>
                  <li><strong>Stale-While-Revalidate:</strong> Users always hit global Cloudflare/Vercel PoPs instantly, while revalidation occurs asynchronously in the background.</li>
                </ul>
              </section>

              <section id="database-and-orm-tuning">
                <h2 className="text-2xl font-bold tracking-tight text-heading border-b border-border pb-2.5 mt-10">
                  Zero-Overhead Database Queries
                </h2>
                <p>
                  ORMs simplify rapid prototyping but frequently introduce N+1 query traps. For high-throughput analytics endpoints, raw prepared statements and indexed jsonb aggregations reduce compute overhead by over 60%.
                </p>
              </section>

              <section id="key-benchmarks-and-verdict">
                <h2 className="text-2xl font-bold tracking-tight text-heading border-b border-border pb-2.5 mt-10">
                  Architecture Benchmarks & Takeaways
                </h2>
                <p>
                  Adopting edge streaming, granular Suspense boundaries, and multi-tenant schema isolation delivers tangible gains across enterprise fleets:
                </p>
                <ul>
                  <li><strong>First Contentful Paint (FCP):</strong> Reduced from 840ms to 85ms on 4G connections.</li>
                  <li><strong>Interaction to Next Paint (INP):</strong> Maintained consistently under 35ms.</li>
                  <li><strong>Edge Cache Hit Ratio:</strong> Peaked at 96.4% across global regions.</li>
                </ul>
              </section>
            </article>

            {/* Article Tags */}
            <div className="mt-12 pt-6 border-t border-border flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-muted mr-2">Tagged:</span>
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-md text-xs font-semibold bg-surface-alt border border-border text-heading hover:border-primary transition-colors"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </main>

          {/* Right Sidebar: Sticky TOC & CTA */}
          <aside className="lg:col-span-4 hidden lg:block">
            <div className="sticky top-20 space-y-6">
              {/* Table of Contents Box */}
              <div className="p-6 rounded-2xl bg-surface border border-border">
                <div className="text-xs font-bold text-heading uppercase tracking-wider mb-4 flex items-center gap-2">
                  <span>Table of Contents</span>
                </div>
                <nav className="space-y-2.5 text-xs sm:text-sm">
                  {tocItems.map((item) => (
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

              {/* Author Info Card */}
              <div className="p-6 rounded-2xl bg-surface border border-border">
                <div className="text-xs font-bold text-muted uppercase tracking-wider mb-3">
                  About the Author
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden border border-border">
                    <Image
                      src={post.author.avatar}
                      alt={post.author.name}
                      fill
                      className="object-cover"
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedPosts.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/blogs/${rel.slug}`}
                  className="group block p-6 rounded-xl bg-background border border-border hover:border-border-accent hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-2 text-xs text-muted mb-2">
                    <span className="text-primary font-semibold">{rel.category}</span>
                    <span>•</span>
                    <span>{rel.readTime}</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-heading group-hover:text-primary transition-colors leading-snug mb-2">
                    {rel.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-body line-clamp-2 leading-relaxed">
                    {rel.snippet}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}