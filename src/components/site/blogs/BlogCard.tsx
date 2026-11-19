"use client";

import Link from "next/link";
import { ArrowUpRight, Clock } from "lucide-react";
import type { BlogPost } from "@/lib/services/site/blogs";
import { BlogAuthorAvatar, BlogCoverImage } from "./BlogMedia";

interface BlogCardProps {
  article: BlogPost;
}

export function BlogCard({ article }: Readonly<BlogCardProps>) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface transition-all duration-300 hover:-translate-y-1 hover:border-border-accent hover:shadow-xl hover:shadow-glow/60">
      {/* Top Thumbnail */}
      
      <div>
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-surface-alt">
          <BlogCoverImage
            src={article.coverImage}
            alt={article.title}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500 ease-apple"
          />
        </div>
        {/* Content */}
        <div className="flex flex-1 flex-col p-5 sm:p-6">
          <div className="mb-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] font-semibold uppercase tracking-wide text-muted">
            {article.category && <span className="text-primary">{article.category}</span>}
            <span>•</span>
            <Clock className="h-3.5 w-3.5" />
            {article.date && (
              <span className="font-medium normal-case tracking-normal">{article.date}</span>
            )}
            <span>•</span>
            <span className="font-medium normal-case tracking-normal">{article.readTime}</span>
          </div>

          <h3 className="mb-3 line-clamp-2 text-lg font-bold leading-snug tracking-tight text-heading transition-colors duration-200 group-hover:text-primary sm:text-xl">
            <Link href={`/blogs/${article.slug}`}>{article.title}</Link>
          </h3>

          <p className="line-clamp-3 text-sm leading-relaxed text-body">{article.snippet}</p>


          {/* Tags */}
          {article.tags.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-1.5">
              {article.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] font-medium text-muted bg-surface-alt px-2 py-0.5 rounded border border-border"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Card Footer / Author */}
      <div className="mt-auto flex items-center justify-between gap-3 border-t border-border bg-surface-alt/50 px-5 py-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full border border-border">
            <BlogAuthorAvatar
              src={article.author.avatar}
              name={article.author.name}
              sizes="32px"
              textClassName="text-[10px]"
            />
          </div>
          <span className="truncate text-xs font-semibold text-heading">
            {article.author.name}
          </span>
        </div>

        <Link
          href={`/blogs/${article.slug}`}
          className="inline-flex shrink-0 items-center gap-1 text-xs font-bold text-primary transition-transform group-hover:translate-x-0.5"
        >
          <span>Read article</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </article>
  );
}
