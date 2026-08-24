'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import ApearixFlow from '@/components/common/ApearixFlow';
import { useEffect, useState } from 'react';

export function Hero() {
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsDesktop(mediaQuery.matches);
    update();
    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  return (
    <section className="relative w-full sm:min-h-screen overflow-hidden bg-white flex items-center pt-30 pb-10 sm:pt-28 sm:pb-20 lg:pt-20 lg:pb-16">

      {/* Technical Grid */}
      <div aria-hidden="true"
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage:
            'linear-gradient(#111827 1px, transparent 1px), linear-gradient(90deg, #111827 1px, transparent 1px)',
          backgroundSize: '2px 2px',
        }} />

      {/* Ambient Purple Glow - Top Right */}
      <div aria-hidden="true"
        className="absolute -top-40 right-[-180px] sm:right-[-120px] lg:right-[-80px] w-[420px] h-[420px] sm:w-[620px] sm:h-[620px] lg:w-[760px] lg:h-[760px] rounded-full bg-[radial-gradient(circle_at_center,rgba(109,40,245,0.10)_0%,rgba(109,40,245,0.04)_35%,transparent_70%)] blur-3xl pointer-events-none"
      />

      {/* Ambient Purple Glow - Bottom Left */}
      <div aria-hidden="true"
        className="absolute bottom-[-220px] left-[-220px] w-[420px] h-[420px] rounded-full bg-[radial-gradient(circle_at_center,rgba(109,40,245,0.06)_0%,transparent_70%)] blur-3xl pointer-events-none"
      />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 sm:px-6  xl:px-0">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-12 lg:gap-6">

          {/* =========================
              LEFT — HERO CONTENT
          ========================== */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 flex flex-col items-start text-left"
          >
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="inline-flex items-center rounded-full border border-[#6D28F5]/10 bg-[#f7f4ff] px-3.5 py-1.5 text-[11px] font-semibold tracking-wide text-[#6D28F5] mb-5 sm:mb-4 sm:text-sm"
            >
              Software · AI · SaaS · Automation
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-4xl text-[2.7rem] font-bold leading-[1.04] tracking-[-0.035em] text-[#111827] sm:text-6xl md:text-7xl lg:text-[4.5rem] xl:text-[5rem]"
            >
              We Engineer Software{' '}
              <span className="block">
                for{' '}
                <span className="bg-gradient-to-r from-[#6D28F5] to-[#A855F7] bg-clip-text text-transparent">
                  What’s Next.
                </span>
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="mt-5 max-w-xl text-[15px] leading-7 text-[#6B7280] sm:mt-6 sm:text-lg sm:leading-8"
            >
              Apearix builds intelligent software, AI-powered products, SaaS platforms, and scalable digital systems that help businesses move faster and build what’s next.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="mt-7 flex w-full flex-col gap-3 sm:mt-8 sm:w-auto sm:flex-row"
            >
              {/* Primary CTA */}
              <Link
                href="/contact"
                className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-7 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(109,40,245,0.20)] transition-all duration-300 hover:bg-[#5B21E6] hover:shadow-[0_10px_30px_rgba(109,40,245,0.28)] active:scale-[0.98] sm:w-auto"
              >
                <span>Build with Apearix</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>

              {/* Secondary CTA */}
              <Link
                href="/work/portfolio"
                className="inline-flex h-12 w-full items-center justify-center rounded-full border   bg-white px-7 text-sm font-semibold text-[#111827] transition-all duration-300 border-[#D8CCFA] hover:bg-[#FAF9FF] active:scale-[0.98] sm:w-auto"
              >
                Explore Our Work
              </Link>
            </motion.div>

           
          </motion.div>

          {/* =========================
              RIGHT — Apearix Flow
          ========================== */}
          {isDesktop && <ApearixFlow />}
        </div>
      </div>
    </section>
  );
}

