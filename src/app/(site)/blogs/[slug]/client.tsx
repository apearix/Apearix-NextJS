"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Clock,
  Calendar,
  Copy,
  Check,
  ChevronRight,
  ArrowUpRight,
} from "lucide-react";
import type { BlogPost } from "../data";
import { MOCK_BLOGS } from "../data";
interface BlogShowClientProps {
  post: BlogPost;
  relatedPosts: BlogPost[];
}

export default function BlogShowClient({ post, relatedPosts }: BlogShowClientProps) {
  const [copied, setCopied] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const [selectedCategory, setSelectedCategory] = useState<string>("All Articles");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
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
    // Featured article (first marked featured, or fallback)
    const featuredArticle = useMemo(() => {
      return MOCK_BLOGS.find((b) => b.featured) || MOCK_BLOGS[0];
    }, []);
  const filteredArticles = useMemo(() => {
    return MOCK_BLOGS.filter((article) => {
      const matchesCategory =
        selectedCategory === "All Articles" || article.category === selectedCategory;

      const matchesSearch =
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.snippet.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);
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
        </div>
      </header>
      {/* ----------------- MAIN CONTENT & SIDEBAR GRID ----------------- */}
      <div className="container max-w-7xl mx-auto px-4 xl:px-0 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
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
          {/* Left Article Body */}
          <main className="lg:col-span-8">
            <div className="container">
              <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-border shadow-xl bg-surface-alt">
                <div className="absolute bottom-2 right-2 z-10 flex items-center gap-2">
                  <button
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
            <article
              className="prose prose-slate max-w-none text-body leading-relaxed prose-headings:text-heading prose-headings:font-bold prose-headings:tracking-tight prose-h1:text-3xl prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3 prose-p:text-body prose-p:leading-relaxed prose-a:text-[#6D28F5] prose-a:underline prose-a:font-semibold hover:prose-a:opacity-80 prose-ul:list-disc prose-ul:pl-6 prose-ol:list-decimal prose-ol:pl-6 prose-li:my-1.5 prose-code:text-[#6D28F5] prose-code:bg-primary-light prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-xs prose-strong:text-heading prose-strong:font-semibold"
              dangerouslySetInnerHTML={{ __html: "<p>No content available.</p>" }}
            />

            {/* Article Tags */}
            <div className="mt-6 pt-6 border-t border-border flex flex-wrap items-center gap-2">
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
              {filteredArticles.map((article, index) => (
                <article
                  key={article.id}
                  className="group flex flex-col justify-between rounded-xl bg-surface border border-border hover:border-border-accent hover:shadow-lg hover:shadow-glow/60 transition-all duration-300 overflow-hidden"
                >
                  {/* Top Thumbnail */}
                  <div>
                    <div className="relative aspect-video w-full overflow-hidden bg-surface-alt">
                      <Image
                        src={article.coverImage}
                        alt={article.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500 ease-apple"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-1 bg-white/95 backdrop-blur-sm text-primary text-[11px] font-bold rounded-md shadow-xs border border-border">
                          {article.category}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <div className="flex items-center gap-2 text-xs text-muted mb-2.5">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{article.readTime}</span>
                        <span>•</span>
                        <span>{article.date}</span>
                      </div>

                      <h3 className="text-lg font-bold text-heading group-hover:text-primary transition-colors duration-200 line-clamp-2 leading-snug mb-2.5">
                        <Link href={`/blogs/${article.slug}`}>
                          {article.title}
                        </Link>
                      </h3>

                      <p className="text-xs sm:text-sm text-body line-clamp-3 leading-relaxed mb-4">
                        {article.snippet}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {/* {article.tags.slice(0, 3).map((tag) => ( */}
                          <span
                            // key={tag}
                            className="text-[10px] font-medium text-muted bg-surface-alt px-2 py-0.5 rounded border border-border"
                          >
                            #tech
                          </span>
                        {/* ))} */}
                      </div>
                    </div>
                  </div>

                  {/* Card Footer / Author */}
                  <div className="px-6 py-4 bg-surface-alt/60 border-t border-border flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-2.5">
                      <div className="relative w-7 h-7 rounded-full overflow-hidden border border-border">
                        <Image
                          src={article.author.avatar}
                          alt={article.author.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <span className="text-xs font-semibold text-heading truncate max-w-27.5 sm:max-w-35">
                        {article.author.name}
                      </span>
                    </div>

                    <Link
                      href={`/blogs/${article.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-primary group-hover:translate-x-0.5 transition-transform"
                    >
                      <span>Read</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>

          </div>
        </section>
      )}
    </div>
  );
}