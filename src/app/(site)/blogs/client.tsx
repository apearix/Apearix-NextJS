"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Search, Clock, ArrowUpRight, Sparkles, Layers } from "lucide-react";
import type { BlogCategory, BlogPost } from "@/lib/services/site/blogs";
import { BlogAuthorAvatar, BlogCoverImage } from "./_components/BlogMedia";
import { BlogCard } from "./_components/BlogCard";

interface BlogIndexClientProps {
  initialBlogs: BlogPost[];
  categories: BlogCategory[];
}

export default function BlogIndexClient({
  initialBlogs,
  categories,
}: Readonly<BlogIndexClientProps>) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All Articles");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const categoryTabs = useMemo(() => {
    const uniqueNames = Array.from(
      new Set([
        ...categories.map((c) => c.name),
        ...initialBlogs.map((b) => b.category),
      ])
    ).filter(Boolean);
    return ["All Articles", ...uniqueNames];
  }, [categories, initialBlogs]);

  // Featured article (first marked featured, or latest fallback)
  const featuredArticle = useMemo(() => {
    return initialBlogs.find((b) => b.featured) || initialBlogs[0] || null;
  }, [initialBlogs]);

  // Filtered articles
  const filteredArticles = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return initialBlogs.filter((article) => {
      const matchesCategory =
        selectedCategory === "All Articles" || article.category === selectedCategory;

      const matchesSearch =
        !query ||
        article.title.toLowerCase().includes(query) ||
        article.snippet.toLowerCase().includes(query) ||
        article.category.toLowerCase().includes(query) ||
        article.tags.some((tag) => tag.toLowerCase().includes(query));

      return matchesCategory && matchesSearch;
    });
  }, [initialBlogs, selectedCategory, searchQuery]);

  return (
    <div className="w-full bg-background selection:bg-primary-light selection:text-primary">
      {/* ----------------- HERO BANNER / FEATURED SPOTLIGHT ----------------- */}
      <section className="relative py-12 md:pt-25  border-b border-border bg-linear-to-b from-surface via-background to-background overflow-hidden">
        {/* Subtle decorative mesh glow */}
        <div
          className="absolute -top-32 left-1/2 -translate-x-1/2 w-180 h-90 bg-primary/10 rounded-full blur-[120px] pointer-events-none"
          aria-hidden="true"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 xl:px-0 relative z-10">
          {/* Header pill & title */}
          <div className="max-w-4xl mb-8">
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
                <div className="lg:col-span-7 relative h-64 sm:h-80 lg:h-auto min-h-70 overflow-hidden bg-surface-alt">
                  <BlogCoverImage
                    src={featuredArticle.coverImage}
                    alt={featuredArticle.title}
                    sizes="(max-width: 1024px) 100vw, 58vw"
                    preload
                    className="object-cover object-center transform group-hover:scale-105 transition-transform duration-700 ease-apple"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent lg:hidden" />
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
                    {featuredArticle.tags.length > 0 && (
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
                    )}
                  </div>

                  {/* Author meta & CTA */}
                  <div className="pt-6 border-t border-border flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-full overflow-hidden border border-border">
                        <BlogAuthorAvatar
                          src={featuredArticle.author.avatar}
                          name={featuredArticle.author.name}
                          sizes="40px"
                          textClassName="text-xs"
                        />
                      </div>
                      <div>
                        <div className="text-xs sm:text-sm font-semibold text-heading">
                          {featuredArticle.author.name}
                        </div>
                        {featuredArticle.date && (
                          <div className="text-[11px] text-muted">{featuredArticle.date}</div>
                        )}
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
              {categoryTabs.map((cat) => {
                const count =
                  cat === "All Articles"
                    ? initialBlogs.length
                    : initialBlogs.filter((b) => b.category === cat).length;
                const isActive = selectedCategory === cat;

                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-2 ${isActive
                        ? "bg-primary text-white shadow-sm"
                        : "bg-surface-alt hover:bg-border/60 text-muted hover:text-heading border border-border"
                      }`}
                  >
                    <span>{cat}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${isActive
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
            <div className="relative min-w-65 lg:min-w-[320px]">
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
                  type="button"
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

      {/* ----------------- ARTICLES GRID ----------------- */}
      <section className="py-16 bg-background">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 xl:px-0 space-y-6">
          {filteredArticles.length === 0 ? (
            <div className="text-center py-24 bg-surface rounded-2xl border border-dashed border-border p-8">
              <Layers className="w-12 h-12 text-muted mx-auto mb-3 stroke-[1.5]" />
              <h3 className="text-lg font-medium text-heading">
                {initialBlogs.length === 0
                  ? "No articles published yet"
                  : "No matching articles found"}
              </h3>
              <p className="text-sm text-muted mt-1 max-w-sm mx-auto">
                {initialBlogs.length === 0
                  ? "Check back soon for new engineering insights, architecture guides, and technical articles."
                  : `We couldn't find any articles matching "${searchQuery || selectedCategory}". Try adjusting your keywords or category filter.`}
              </p>
              {initialBlogs.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("All Articles");
                  }}
                  className="mt-5 px-4 py-2 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary-hover transition-colors"
                >
                  Reset Filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map((article) => (
                <BlogCard key={article.id} article={article} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
