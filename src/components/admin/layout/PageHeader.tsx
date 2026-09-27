'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface PageHeaderProps {
  badge?: string;
  title: string;
  subtitle: string;
  breadcrumbs?: { label: string; href: string }[];
}

export function PageHeader({ badge, title, subtitle, breadcrumbs }: PageHeaderProps) {
  const jsonLdBreadcrumb = breadcrumbs
    ? {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://www.apearix.com"
          },
          ...breadcrumbs.map((crumb, idx) => ({
            "@type": "ListItem",
            "position": idx + 2,
            "name": crumb.label,
            "item": `https://www.apearix.com${crumb.href}`
          }))
        ]
      }
    : null;

  return (
    <section className="pt-32 sm:pt-36 md:pt-40 pb-16 bg-gradient-to-b from-[#FFFFFF] via-[#FAFAFC] to-[#F4F0FF]/50 border-b border-[#E5E7EB]">
      {jsonLdBreadcrumb && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
        />
      )}
      <div className="container max-w-[1280px] mx-auto px-6 text-center flex flex-col items-center">
        
        {/* Breadcrumbs */}
        {breadcrumbs && (
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[#6B7280] mb-6">
            <Link href="/" className="hover:text-[#6D28F5] transition-colors">
              Home
            </Link>
            {breadcrumbs.map((crumb, idx) => (
              <span key={crumb.href} className="flex items-center gap-2">
                <ChevronRight className="w-3.5 h-3.5 text-[#6B7280]/60" />
                {idx === breadcrumbs.length - 1 ? (
                  <span className="font-semibold text-[#111827]">{crumb.label}</span>
                ) : (
                  <Link href={crumb.href} className="hover:text-[#6D28F5] transition-colors">
                    {crumb.label}
                  </Link>
                )}
              </span>
            ))}
          </nav>
        )}

        {/* Badge */}
        {badge && (
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 mb-6 text-xs font-semibold tracking-wider uppercase text-[#6D28F5] bg-[#F4F0FF] rounded-full border border-[#DDD6FE] shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#6D28F5]"></span>
            <span>{badge}</span>
          </span>
        )}

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#111827] mb-6 max-w-4xl leading-[1.08] text-balance">
          {title}
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg md:text-xl text-[#4B5563] leading-relaxed max-w-2xl text-balance">
          {subtitle}
        </p>

      </div>
    </section>
  );
}
