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
    <article className="group flex flex-col justify-between rounded-xl bg-surface border border-border hover:border-border-accent hover:shadow-lg hover:shadow-glow/60 transition-all duration-300 overflow-hidden">
      {/* Top Thumbnail */}
      
      <div>
        <div className="relative aspect-video w-full overflow-hidden bg-surface-alt">
          <BlogCoverImage
            src={article.coverImage}
            alt={article.title}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500 ease-apple"
          />
        </div>
        <Link
          href={`/blogs/${article.slug}`}  >
        </Link>
        {/* Content */}
        <div className="p-6">
          <div className="flex items-center gap-2 text-xs text-muted mb-2.5">
            <Clock className="w-3.5 h-3.5" />
            {article.date && (
              <>
                <span>{article.date}</span>
              </>
            )}
            {article.category && (
              <>
                <span>•</span>
                <span>{article.category}</span>
              </>
            )}
          </div>

          <h3 className="text-xl font-bold text-heading group-hover:text-primary transition-colors duration-200 line-clamp-2 leading-snug mb-2.5">
            <Link href={`/blogs/${article.slug}`}>{article.title}</Link>
          </h3>

          <p className="text-xs sm:text-sm text-body leading-relaxed">
            <span className="line-clamp-3 text-xs sm:text-sm text-body leading-relaxed">
              {article.snippet}
            </span>
          </p>


          {/* Tags */}
          {article.tags.length > 0 && (
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
          )}
        </div>

      </div>

      {/* Card Footer / Author */}
      {/* <div className="px-6 py-4 bg-surface-alt/60 border-t border-border flex items-center justify-between mt-auto">
        <div className="flex items-center gap-2.5">
          <div className="relative w-7 h-7 rounded-full overflow-hidden border border-border">
            <BlogAuthorAvatar
              src={article.author.avatar}
              name={article.author.name}
              sizes="28px"
              textClassName="text-[10px]"
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
          <span>Read more</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div> */}
    </article>
  );
}
