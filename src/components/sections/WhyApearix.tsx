'use client';

import { motion } from 'framer-motion';
import {
  ArrowUpRight,
  BrainCircuit,
  Layers3,
  Rocket,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

const principles = [
  {
    number: '01',
    title: 'Engineering First',
    description:
      'We care about architecture, performance, maintainability and long-term reliability—not just getting features shipped.',
    icon: Layers3,
    accent: 'Architecture',
  },
  {
    number: '02',
    title: 'AI-Native Thinking',
    description:
      'We design modern systems with intelligence and automation in mind, using AI where it creates real value.',
    icon: BrainCircuit,
    accent: 'Intelligence',
  },
  {
    number: '03',
    title: 'Product Thinking',
    description:
      'We look beyond individual features to understand users, workflows and the business outcome behind the product.',
    icon: Rocket,
    accent: 'Product',
  },
  {
    number: '04',
    title: 'Built to Scale',
    description:
      'We build foundations that can evolve from an MVP into a reliable production system as your users, data and business grow.',
    icon: ShieldCheck,
    accent: 'Scalability',
  },
];

export function WhyApearix() {
  return (
    <section
      id="why-apearix"
      className="relative overflow-hidden bg-[#FAFAFC] py-10 sm:py-16 lg:py-20"
    >
      {/* Ambient background */}
      <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[420px] w-[760px] -translate-x-1/2 rounded-full bg-[#6D28F5]/5 blur-[130px]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 xl:px-0">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5 }}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#DDD6FE] bg-[#F4F0FF] px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#6D28F5]"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Why Apearix</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-balance text-3xl font-bold tracking-tight text-[#111827] sm:text-4xl md:text-5xl lg:text-6xl"
          >
            Built Different.
            <br />
            <span className="text-[#6D28F5]">Engineered to Last.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-6 max-w-2xl text-base leading-7 text-[#4B5563] sm:text-lg"
          >
            We combine strong engineering principles, AI-native thinking and
            product-focused execution to build software that works today—and
            is ready for what comes next.
          </motion.p>
        </div>

        {/* Principles Grid */}
        <div className="mt-14 grid gap-5 sm:mt-16 md:grid-cols-2 lg:grid-cols-4">
          {principles.map((principle, index) => {
            const Icon = principle.icon;

            return (
              <motion.article
                key={principle.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.08,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="group relative flex min-h-[330px] flex-col overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#C4B5FD] hover:shadow-xl hover:shadow-[#6D28F5]/10 sm:p-7"
              >
                {/* Number & Icon */}
                <div className="flex items-start justify-between">
                  <span className="font-mono text-sm font-semibold tracking-wider text-[#9CA3AF]">
                    {principle.number}
                  </span>

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#DDD6FE] bg-[#F4F0FF] text-[#6D28F5] transition-all duration-300 group-hover:bg-[#6D28F5] group-hover:text-white">
                    <Icon className="h-5 w-5" strokeWidth={1.8} />
                  </div>
                </div>

                {/* Content Accent */}
                <div className="mt-10">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#6D28F5]">
                    {principle.accent}
                  </span>

                  <h3 className="mt-2 text-xl font-bold tracking-tight text-[#111827] sm:text-2xl">
                    {principle.title}
                  </h3>

                  <p className="mt-4 text-sm leading-6 text-[#4B5563] sm:text-base">
                    {principle.description}
                  </p>
                </div>

                {/* Bottom line / Aesthetic Element */}
                <div className="mt-auto flex items-center justify-between border-t border-[#E5E7EB] pt-5">
                  <span className="text-xs font-medium text-[#9CA3AF]">
                    Apearix Standard
                  </span>

                  <ArrowUpRight className="h-4 w-4 text-[#9CA3AF] transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#6D28F5]" />
                </div>

                {/* Bottom Hover Accent Bar */}
                <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-[#6D28F5] transition-all duration-500 group-hover:w-full" />
              </motion.article>
            );
          })}
        </div>

        {/* Bottom Statement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-12 border-t border-[#E5E7EB] pt-8 sm:mt-16 sm:pt-10"
        >
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-2xl text-sm leading-6 text-[#6B7280] sm:text-base">
              From architecture to deployment, every decision is made with
              the product&apos;s long-term success in mind.
            </p>

            <div className="flex shrink-0 items-center gap-2 text-sm font-semibold text-[#6D28F5]">
              <span>Engineering with intent</span>
              <ArrowUpRight className="h-4 w-4" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}