'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Check, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const features = [
  {
    title: 'Technical SEO',
    desc: 'Crawlable, search-engine native structure',
  },
  {
    title: 'Fast Performance',
    desc: 'Lightweight payloads and sub-second renders',
  },
  {
    title: 'Mobile First',
    desc: 'Fluid responsiveness across every screen size',
  },
  {
    title: 'Structured Data',
    desc: 'Machine-readable semantic schema integration',
  },
];

export function PerformanceSEO() {
  return (
    <section className="relative overflow-hidden border-b border-[#E5E7EB] bg-footer  py-10 sm:py-16 lg:py-20">
      {/* Subtle Glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[320px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#6D28F5]/5 blur-[120px]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 xl:px-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden rounded-3xl border border-[#E5E7EB] bg-[#FAFAFC] p-8 sm:p-12 lg:p-14"
        >
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
            
            {/* Left Narrative */}
            <div className="lg:col-span-5">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#DDD6FE] bg-[#F4F0FF] px-3 py-1 text-xs font-semibold tracking-wider text-[#6D28F5]">
                <Sparkles className="h-3 w-3" />
                <span>Engineered for Discoverability</span>
              </div>

              <h2 className="text-balance text-2xl font-bold tracking-tight text-[#111827] sm:text-3xl lg:text-4xl">
                Built to Be Found.{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6D28F5] via-[#7B3FE4] to-[#A855F7]">
                  Built to Be Fast.
                </span>
              </h2>

              <p className="mt-4 max-w-lg text-sm leading-relaxed text-[#4B5563] sm:text-base">
                SEO and performance are built directly into the foundation of every product we engineer never patched on after development.
              </p>

              <div className="mt-6">
                <Link
                  href="/contact"
                  className="group inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#6D28F5] transition-colors hover:text-[#5B21E6]"
                >
                  <span>Discuss your architecture</span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            </div>

            {/* Right Compact 2x2 Feature Grid */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:col-span-7">
              {features.map((item) => (
                <div
                  key={item.title}
                  className="group flex flex-col justify-center rounded-2xl border border-gray-200/80 bg-white p-5 transition-all duration-300 hover:border-[#DDD6FE] hover:shadow-md hover:shadow-[#6D28F5]/5"
                >
                  <div className="flex items-center gap-2.5 mb-1">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#F4F0FF] text-[#6D28F5]">
                      <Check className="h-4 w-4" strokeWidth={3} />
                    </div>
                    <span className="text-base font-bold text-[#111827]">
                      {item.title}
                    </span>
                  </div>
                  <p className="pl-8 text-sm text-[#6B7280]">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>

          </div>
        </motion.div>
      </div>
    </section>
  );
}