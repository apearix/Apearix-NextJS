"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Search, 
  Clock, 
  ArrowUpRight, 
  Sparkles, 
  BookOpen, 
  Tag, 
  CheckCircle2, 
  Send,
  Calendar,
  Layers
} from "lucide-react";
import { MOCK_BLOGS  } from "./data";

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  snippet: string;
  category: "Engineering Deep Dive" | "AI Architecture" | "UI/UX Design" | "DevOps & Cloud" | "Product & Scale";
  date: string;
  readTime: string;
  featured?: boolean;
  coverImage: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  tags: string[];
}
 
const CATEGORIES = [
  "All Articles",
  "Engineering Deep Dive",
  "AI Architecture",
  "UI/UX Design",
  "DevOps & Cloud",
] as const;

export default function BlogIndexClient() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All Articles");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Featured article (first marked featured, or fallback)
  const featuredArticle = useMemo(() => {
    return MOCK_BLOGS.find((b) => b.featured) || MOCK_BLOGS[0];
  }, []);

  // Filtered articles
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

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setIsSubscribed(true);
      setNewsletterEmail("");
    }
  };

  return (
    <div className="w-full bg-background selection:bg-primary-light selection:text-primary">
      {/* ----------------- HERO BANNER / FEATURED SPOTLIGHT ----------------- */}
      <section className="relative pt-12 pb-16 md:pt-25 md:pb-24 border-b border-border bg-gradient-to-b from-surface via-background to-background overflow-hidden">
        {/* Subtle decorative mesh glow */}
        <div 
          className="absolute -top-32 left-1/2 -translate-x-1/2 w-[720px] h-[360px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" 
          aria-hidden="true" 
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 xl:px-0 relative z-10">
          {/* Header pill & title */}
          <div className="max-w-3xl mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-light border border-border-accent text-primary text-xs font-semibold uppercase tracking-wider mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Apearix Engineering & Architecture Hub</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-heading tracking-tight text-balance leading-[1.15]">
              Insights, Systems & Production Engineering
            </h1>
            <p className="mt-4 text-base sm:text-lg text-body leading-relaxed max-w-2xl">
              Enterprise blueprints, deep dives into AI workflow orchestration, high-velocity frontend architecture, and cloud infrastructure scale.
            </p>
          </div>

          {/* Featured Article Card */}
          {featuredArticle && (
            <div className="group relative rounded-2xl bg-surface border border-border hover:border-border-accent transition-all duration-300 hover:shadow-xl hover:shadow-glow overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                {/* Banner Thumbnail Area */}
                <div className="lg:col-span-7 relative h-64 sm:h-80 lg:h-auto min-h-[280px] overflow-hidden bg-surface-alt">
                  <Image
                    src={featuredArticle.coverImage}
                    alt={featuredArticle.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 58vw"
                    priority
                    className="object-cover object-center transform group-hover:scale-105 transition-transform duration-700 ease-[var(--ease-apple)]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent lg:hidden" />
                  <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                    <span className="px-3 py-1 bg-primary text-white text-xs font-bold rounded-full tracking-wide shadow-sm flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3" /> Featured Deep Dive
                    </span>
                  </div>
                </div>

                {/* Content Area */}
                <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between bg-surface">
                  <div>
                    <div className="flex items-center gap-3 text-xs text-muted font-medium mb-3">
                      <span className="text-primary font-semibold">{featuredArticle.category}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> {featuredArticle.readTime}
                      </span>
                    </div>

                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-heading group-hover:text-primary transition-colors duration-200 leading-snug tracking-tight mb-4">
                      <Link href={`/blogs/${featuredArticle.slug}`} className="hover:underline focus:outline-none">
                        {featuredArticle.title}
                      </Link>
                    </h2>

                    <p className="text-sm sm:text-base text-body leading-relaxed line-clamp-3 mb-6">
                      {featuredArticle.snippet}
                    </p>

                    {/* Tag list */}
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {featuredArticle.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-0.5 rounded-md text-xs font-medium bg-surface-alt text-muted border border-border"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Author meta & CTA */}
                  <div className="pt-6 border-t border-border flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-full overflow-hidden border border-border">
                        <Image
                          src={featuredArticle.author.avatar}
                          alt={featuredArticle.author.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <div className="text-xs sm:text-sm font-semibold text-heading">
                          {featuredArticle.author.name}
                        </div>
                        <div className="text-[11px] text-muted">{featuredArticle.date}</div>
                      </div>
                    </div>

                    <Link
                      href={`/blogs/${featuredArticle.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-primary group-hover:translate-x-0.5 transition-transform"
                    >
                      <span>Read Deep Dive</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ----------------- SEARCH & CATEGORY FILTER BAR ----------------- */}
      <section className="sticky top-16 z-30 bg-background/85 backdrop-blur-md border-b border-border py-4 transition-all">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 xl:px-0">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Category tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 md:pb-0">
              {CATEGORIES.map((cat) => {
                const count =
                  cat === "All Articles"
                    ? MOCK_BLOGS.length
                    : MOCK_BLOGS.filter((b) => b.category === cat).length;
                const isActive = selectedCategory === cat;

                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-2 ${
                      isActive
                        ? "bg-primary text-white shadow-sm"
                        : "bg-surface-alt hover:bg-border/60 text-muted hover:text-heading border border-border"
                    }`}
                  >
                    <span>{cat}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-border text-muted"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Search Input Box */}
            <div className="relative min-w-[260px] lg:min-w-[320px]">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search topics, LLMs, Next.js..."
                className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-full bg-surface border border-border placeholder:text-muted focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted hover:text-heading"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ----------------- ARTICLES GRID & NEWSLETTER ----------------- */}
      <section className="py-14 sm:py-10 bg-background">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 xl:px-0">
          {filteredArticles.length === 0 ? (
            <div className="text-center py-24 bg-surface rounded-2xl border border-dashed border-border p-8">
              <Layers className="w-12 h-12 text-muted mx-auto mb-3 stroke-[1.5]" />
              <h3 className="text-lg font-bold text-heading">No matching articles found</h3>
              <p className="text-sm text-muted mt-1 max-w-sm mx-auto">
                We couldn&apos;t find any articles matching &quot;{searchQuery}&quot;. Try adjusting your keywords or category filter.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All Articles");
                }}
                className="mt-5 px-4 py-2 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary-hover transition-colors"
              >
                Reset Filters
              </button>
            </div>
          ) : (
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
                        className="object-cover group-hover:scale-105 transition-transform duration-500 ease-[var(--ease-apple)]"
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
                        {article.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] font-medium text-muted bg-surface-alt px-2 py-0.5 rounded border border-border"
                          >
                            #{tag}
                          </span>
                        ))}
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
                      <span className="text-xs font-semibold text-heading truncate max-w-[110px] sm:max-w-[140px]">
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
          )}

          {/* ----------------- ENTERPRISE NEWSLETTER / ARCHITECTURE DIGEST ----------------- */}
          <div className="mt-16 sm:mt-24 rounded-2xl bg-gradient-to-br from-surface via-surface-alt to-surface border border-border-accent p-8 sm:p-12 relative overflow-hidden">
            <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="max-w-2xl relative z-10">
              <span className="px-3 py-1 rounded-full bg-primary-light text-primary text-xs font-bold tracking-wide uppercase">
                Apearix Dispatch
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-heading tracking-tight mt-3 mb-2">
                Get bi-weekly production architecture blueprints
              </h2>
              <p className="text-sm sm:text-base text-body leading-relaxed mb-6">
                Curated insights on high-scale distributed systems, enterprise LLM architectures, and zero-downtime frontend deployment strategies. No spam, ever.
              </p>

              {isSubscribed ? (
                <div className="inline-flex items-center gap-2 px-4 py-3 bg-green-50 text-green-700 border border-green-200 rounded-xl text-sm font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span>You&apos;re subscribed! Check your inbox for the latest release.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md">
                  <input
                    type="email"
                    required
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="architect@yourcompany.com"
                    className="flex-1 px-4 py-2.5 rounded-lg border border-border bg-white text-sm text-heading placeholder:text-muted focus:outline-none focus:border-primary"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-lg bg-primary hover:bg-primary-hover text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2 shadow-xs"
                  >
                    <span>Subscribe</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}