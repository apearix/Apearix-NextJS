'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface CTASectionProps {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaHref?: string;
}

export function CTASection({
  title = "Ready to build software that moves your business forward?",
  subtitle = "Whether you are starting with an idea or scaling an existing product, we are ready to help you build something people enjoy using.",
  ctaText = "Start Your Project",
  ctaHref = "/company/contact",
}: CTASectionProps) {
  return (
    <section className="py-20 md:py-28 bg-gradient-to-br from-[#6D28F5] via-[#7C3AED] to-[#5B21E6] text-white">
      <div className="container max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-6 max-w-3xl mx-auto leading-tight">
          {title}
        </h2>
        <p className="text-base sm:text-lg text-[#F4F0FF]/90 mb-10 max-w-2xl mx-auto leading-relaxed">
          {subtitle}
        </p>
        <Link
          href={ctaHref}
          className="inline-flex items-center gap-2 h-14 px-8 rounded-[10px] bg-white text-[#6D28F5] font-bold text-sm hover:bg-[#FAFAFC] active:scale-[0.98] transition-all shadow-xl shadow-black/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          <span>{ctaText}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
