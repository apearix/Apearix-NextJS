'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Check, ArrowRight, Search, Gauge, Smartphone, Binary } from 'lucide-react';
import Link from 'next/link';

const features = [
  {
    title: 'Technical SEO',
    desc: 'Crawlable, search-engine native structure, dynamic sitemaps, and robots governance.',
    icon: Search,
  },
  {
    title: 'Fast Performance',
    desc: 'Lightweight payloads, optimized responsive images, and sub-second renders.',
    icon: Gauge,
  },
  {
    title: 'Mobile First',
    desc: 'Fluid responsiveness across every device, desktop screen, and touch display.',
    icon: Smartphone,
  },
  {
    title: 'Structured Data',
    desc: 'Machine-readable JSON-LD schemas optimized for modern search engines and AI assistants.',
    icon: Binary,
  },
];

export function PerformanceSEO() {
  return (
    <section className="relative overflow-hidden border-b border-border bg-footer  py-10 sm:py-16 lg:py-20">
      {/* Subtle Glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-80 w-150 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#6D28F5]/5 blur-[120px]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 xl:px-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden rounded-3xl border border-border bg-surface p-8 sm:p-12 lg:p-14"
        >
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">

            {/* Left Narrative */}
            <div className="lg:col-span-6">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border-accent bg-primary-light px-3 py-1 text-xs font-semibold tracking-wider text-[#6D28F5]">
                <Sparkles className="h-3 w-3" />
                <span>Engineered for Discoverability</span>
              </div>

              <h2 className="text-balance text-2xl font-bold tracking-tight text-heading sm:text-3xl lg:text-4xl">
                Built to Be Found.{' '}
                <span className="text-transparent bg-clip-text bg-linear-to-r from-[#6D28F5] via-[#7B3FE4] to-[#A855F7]">
                  Built to Be Fast.
                </span>
              </h2>

              <p className="mt-4 max-w-lg text-sm leading-relaxed text-body sm:text-base">
                SEO and performance are built directly into the foundation of every product we engineer never patched on after development.
              </p>

              <div className="mt-6">
                
                <Link
                  href="/contact"
                  className="px-6 py-3 rounded-xl bg-surface hover:bg-surface-alt border border-border text-heading text-sm font-semibold transition-all  hover:text-[#5B21E6] inline-flex items-center gap-2"
                >
                  <span>Discuss your architecture</span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            </div>

            {/* Right Compact 2x2 Feature Grid */}
            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4 roles-font">
            {features.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="p-6 rounded-2xl bg-white border border-border space-y-2"
                  > 
                    <Icon className="w-6 h-6 text-primary" /> 
                    <h3 className="display-font font-bold text-base text-heading">{item.title}</h3>
                    <p className="text-xs text-body">
                      {item.desc}
                    </p>
                  </div>
                );
              })}
            </div>

          </div>
        </motion.div>
      </div>
    </section>
  );
}