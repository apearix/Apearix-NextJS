'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Sparkles } from 'lucide-react';

interface CTASectionProps {
  title?: string;
  subtitle?: string;
  primaryCtaText?: string;
  primaryCtaHref?: string;
  secondaryCtaText?: string;
  secondaryCtaHref?: string;
}

export function CTASection({
  title = 'Have a Problem Worth Solving?',
  subtitle = "Let’s turn your idea into software that works, scales and creates real value.",
  primaryCtaText = 'Start a Project',
  primaryCtaHref = '/contact?type=project',
  secondaryCtaText = 'Talk to Apearix',
  secondaryCtaHref = '/contact',
}: CTASectionProps) {
  return (
    <section className="relative overflow-hidden bg-[#0F172A] py-20 text-white sm:py-24 lg:py-32">
      {/* Ambient Purple Glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-0 h-[520px] w-[820px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#6D28F5]/20 blur-[140px]" />

      {/* Subtle Technical Grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
        {/* Eyebrow Tag */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-[#C4B5FD] backdrop-blur-sm"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>Let&apos;s Build What&apos;s Next</span>
        </motion.div>

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mx-auto max-w-4xl text-balance text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
        >
          {title}
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg"
        >
          {subtitle}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          {/* Primary CTA */}
          <Link
            href={primaryCtaHref}
            className="group inline-flex h-[52px] w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-white px-8 text-sm font-bold text-[#111827] shadow-[0_8px_30px_rgba(0,0,0,0.4)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#F4F0FF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4B5FD] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F172A] active:scale-[0.98]"
          >
            <span>{primaryCtaText}</span>
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>

          {/* Secondary CTA */}
          <Link
            href={secondaryCtaHref}
            className="group inline-flex h-[52px] w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-8 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4B5FD] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F172A] active:scale-[0.98]"
          >
            <span>{secondaryCtaText}</span>
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </motion.div>

        {/* Bottom Capabilities Line */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, delay: 0.45 }}
          className="mt-14 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs font-semibold uppercase tracking-widest text-slate-400 sm:text-[13px]"
        >
          <span>AI</span>
          <span className="text-slate-600">·</span>
          <span>Software</span>
          <span className="text-slate-600">·</span>
          <span>SaaS</span>
          <span className="text-slate-600">·</span>
          <span>Automation</span>
          <span className="text-slate-600">·</span>
          <span>Cloud</span>
        </motion.div>
      </div>
    </section>
  );
}