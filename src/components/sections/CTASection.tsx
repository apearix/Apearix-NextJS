'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function CTASection() {
  return (
    <section className="relative overflow-hidden bg-[#0F172A] py-20 text-white sm:py-28 lg:py-32 border-b border-white/[0.06]">
      {/* Soft Ambient Purple Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[400px] w-[650px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#6D28F5]/15 blur-[140px]"
      />

      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
        {/* Main Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{
            duration: 0.65,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="text-balance text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl md:text-6xl"
        >
          Have an idea? <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C4B5FD] via-[#DDD6FE] to-white">
            Let&apos;s build it.
          </span>
        </motion.h2>

        {/* Conversational Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{
            duration: 0.6,
            delay: 0.1,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="mx-auto mt-6 max-w-lg text-base leading-relaxed text-slate-300 sm:text-lg"
        >
          Tell us what you&apos;re building, what you&apos;re trying to solve, or where you want to go next.
        </motion.p>

        {/* Single Primary Action Button */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{
            duration: 0.6,
            delay: 0.2,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="mt-9 flex justify-center"
        >
          <Link
            href="/contact?type=project"
            className="group inline-flex h-12 items-center justify-center gap-2.5 rounded-xl bg-white px-8 text-sm font-semibold text-[#111827] shadow-[0_8px_24px_rgba(0,0,0,0.25)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#F4F0FF] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4B5FD]"
          >
            <span>Start a Project</span>
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}