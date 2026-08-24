'use client';

import { motion } from 'framer-motion';
import {
  ArrowUpRight,
  Gauge,
  Handshake,
  Layers3,
  Rocket,
  Sparkles,
  Target,
  TrendingUp,
} from 'lucide-react';

const principles = [
  {
    number: '01',
    title: 'Business First',
    description:
      'We start with the problem, not the technology. We understand your goals, users, workflows, and requirements before choosing the right solution.',
    icon: Target,
    accent: 'Business',
  },
  {
    number: '02',
    title: 'Engineering Excellence',
    description:
      'We focus on clean architecture, maintainable code, security, performance, and long-term reliability not just getting features shipped.',
    icon: Layers3,
    accent: 'Engineering',
  },
  {
    number: '03',
    title: 'Performance & SEO',
    description:
      'We build fast, discoverable digital experiences with performance and technical SEO considered from the foundation.',
    icon: Gauge,
    accent: 'Performance',
  },
  {
    number: '04',
    title: 'Product Thinking',
    description:
      'We look beyond individual features to understand users, workflows, and the business outcomes behind the product.',
    icon: Rocket,
    accent: 'Product',
  },
  {
    number: '05',
    title: 'Built to Scale',
    description:
      'We create foundations that can evolve from an MVP into a reliable production system as your users, data, and business grow.',
    icon: TrendingUp,
    accent: 'Scalability',
  },
  {
    number: '06',
    title: 'Long-Term Partnership',
    description:
      'From deployment and maintenance to improvements and new features, we stay involved to help your product evolve after launch.',
    icon: Handshake,
    accent: 'Partnership',
  },
];

export function WhyApearix() {
  return (
    <section
      id="why-apearix"
      className="relative overflow-hidden bg-surface py-10 sm:py-16 lg:py-20"
    >
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/4 -z-10 h-[500px] w-[850px] -translate-x-1/2 rounded-full bg-[#6D28F5]/5 blur-[150px]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 xl:px-0">

        {/* Header Section */}
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5 }}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#DDD6FE] bg-[#F4F0FF] px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#6D28F5]"
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
            Built With Purpose.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6D28F5] via-[#7B3FE4] to-[#A855F7]">
              Built to Last.
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 max-w-3xl text-base leading-relaxed text-[#4B5563] sm:text-lg"
          >
            We combine business understanding, strong engineering, modern technology, and long-term thinking to build digital products that create real value.
          </motion.p>
        </div>

        {/* Principles Grid (3x2 Layout optimized for client trust & value props) */}
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white p-6 transition-all duration-500 hover:-translate-y-1.5 hover:border-[#C4B5FD] hover:shadow-2xl hover:shadow-[#6D28F5]/10 sm:p-9"
              >
                <span className="absolute right-6 top-6 text-7xl font-bold  text-muted/10 group-hover:text-primary/20 transition-colors">
                      {principle.number}
                    </span>
                <div>
                  {/* Number & Icon Header */}
                  <div className="flex items-start justify-between mb-6"> 
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#DDD6FE] bg-[#F4F0FF] text-[#6D28F5] transition-all duration-500 group-hover:bg-[#6D28F5] group-hover:text-white group-hover:shadow-md">
                      <Icon className="h-5 w-5" strokeWidth={1.8} />
                    </div> 
                  </div>

                  {/* Accent & Title */}
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#6D28F5] block mb-2">
                    {principle.accent}
                  </span>

                  <h3 className="text-2xl font-bold tracking-tight text-[#111827] mb-3">
                    {principle.title}
                  </h3>

                  <p className="text-sm leading-relaxed text-[#4B5563] sm:text-base">
                    {principle.description}
                  </p>
                </div>

                {/* Bottom link indicator */}
                <div className="mt-4 pt-4 border-t border-[#E5E7EB] flex items-center justify-between text-sm font-semibold text-[#6D28F5]">
                  <span className="text-[#9CA3AF] font-normal">Apearix Standard</span>
                  <div className="inline-flex items-center gap-1 transition-transform duration-300 group-hover:translate-x-1">
                    <span>Explore</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </div>
                </div>

                {/* Bottom Hover Accent Bar */}
                <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-[#6D28F5] to-[#A855F7] transition-all duration-500 group-hover:w-full" />
              </motion.article>
            );
          })}
        </div>

        {/* Bottom Closing Statement Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 rounded-2xl border border-[#E5E7EB] bg-white p-6 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-6"
        >
          <div>
            <p className="text-lg font-bold text-[#111827] tracking-tight mb-1">
              From idea to deployment and beyond.
            </p>
            <p className="text-sm text-[#6B7280]">
              We build with the long term in mind, ensuring your software scales gracefully as your enterprise expands.
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2 rounded-full bg-[#F4F0FF] border border-[#DDD6FE] px-5 py-2.5 text-xs font-semibold tracking-wider text-[#6D28F5]">
            <span>Engineering with intent</span>
            <ArrowUpRight className="h-4 w-4" />
          </div>
        </motion.div>

      </div>
    </section>
  );
}