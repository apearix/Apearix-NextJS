'use client';

import { motion } from 'framer-motion';
import {
  ArrowRight,
  ExternalLink,
  FlaskConical,
  Sparkles,
  Workflow,
} from 'lucide-react';
import Link from 'next/link';

interface Product {
  title: string;
  category: string;
  description: string;
  status: string;
  statusType: 'active' | 'building' | 'soon';
  technologies: string[];
  href?: string;
  featured?: boolean;
  icon: React.ElementType;
}

const products: Product[] = [
  {
    title: 'SmartTabs',
    category: 'Browser Productivity',
    description:
      'A workspace operating system for Chrome that helps people organize, launch and manage their browser workflows.',
    status: 'In Development',
    statusType: 'active',
    technologies: ['Chrome Extension', 'React', 'TypeScript'],
    href: '#smarttabs',
    featured: true,
    icon: Workflow,
  },
  {
    title: 'AI Products',
    category: 'Artificial Intelligence',
    description:
      'Our first generation of intelligent software powered by AI, automation and modern cloud infrastructure.',
    status: 'Coming Soon',
    statusType: 'soon',
    technologies: ['AI', 'Automation', 'Cloud'],
    href: '#ai-products',
    icon: Sparkles,
  },
  {
    title: 'Apearix Labs',
    category: 'Product Innovation',
    description:
      'An experimental space for new SaaS products, developer tools, automation systems and intelligent software.',
    status: 'Building',
    statusType: 'building',
    technologies: ['SaaS', 'Developer Tools', 'AI'],
    href: '#apearix-labs',
    icon: FlaskConical,
  },
];

const statusStyles = {
  active: 'bg-[#F4F0FF] text-[#6D28F5] border-[#DDD6FE]',
  building: 'bg-gray-50 text-gray-700 border-gray-200',
  soon: 'bg-gray-50 text-gray-500 border-gray-200',
};

export function CaseStudies() {
  return (
    <section
      id="products"
      className="relative overflow-hidden bg-white py-10 sm:py-16 lg:py-20"
    >
      {/* Ambient background */}
      <div className="pointer-events-none absolute left-1/2 top-1/3 -z-10 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-[#6D28F5]/5 blur-[140px]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 xl:px-0">
        {/* Header */}
        <div className="mb-12 max-w-3xl sm:mb-16">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#DDD6FE] bg-[#F4F0FF] px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#6D28F5]"
          >
            <FlaskConical className="h-3.5 w-3.5" />
            <span>Apearix Labs</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-balance text-3xl font-bold tracking-tight text-[#111827] sm:text-4xl md:text-5xl lg:text-6xl"
          >
            Products We&apos;re <span className="text-[#6D28F5]">Building.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-5 max-w-2xl text-base leading-7 text-[#4B5563] sm:text-lg"
          >
            We don&apos;t just build software for businesses. We build
            intelligent products that solve real problems and create lasting
            value.
          </motion.p>
        </div>

        {/* Products Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {products.map((product, index) => {
            const Icon = product.icon;
            return (
              <motion.article
                key={product.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className={`group h-fit relative overflow-hidden rounded-2xl border bg-white transition-all duration-300 hover:border-[#C4B5FD] hover:shadow-xl hover:shadow-[#6D28F5]/10 ${
                  product.featured
                    ? 'lg:col-span-2 border-[#DDD6FE]'
                    : 'border-[#E5E7EB]'
                }`}
              >
                {/* Featured visual area */}
                <div
                  className={`relative overflow-hidden border-b border-[#E5E7EB] bg-[#FAFAFC] ${
                    product.featured
                      ? 'min-h-[280px] sm:min-h-[340px]'
                      : 'min-h-[190px]'
                  }`}
                >
                  {/* Subtle Grid */}
                  <div
                    className="absolute inset-0 opacity-40"
                    style={{
                      backgroundImage:
                        'linear-gradient(#E5E7EB 1px, transparent 1px), linear-gradient(90deg, #E5E7EB 1px, transparent 1px)',
                      backgroundSize: '32px 32px',
                    }}
                  />

                  {/* Purple Glow */}
                  <div className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#6D28F5]/10 blur-3xl" />

                  {/* Product Icon Centerpiece */}
                  <div className="absolute inset-0 flex items-center justify-center p-8">
                    <div
                      className={`relative flex items-center justify-center rounded-2xl border border-[#DDD6FE] bg-white shadow-lg shadow-[#6D28F5]/10 transition-transform duration-500 group-hover:scale-105 ${
                        product.featured
                          ? 'h-28 w-28 sm:h-36 sm:w-36'
                          : 'h-20 w-20'
                      }`}
                    >
                      <Icon
                        className={`text-[#6D28F5] ${
                          product.featured
                            ? 'h-12 w-12 sm:h-14 sm:w-14'
                            : 'h-9 w-9'
                        }`}
                        strokeWidth={1.5}
                      />
                    </div>
                  </div>

                  {/* Category Badge */}
                  <div className="absolute left-5 top-5">
                    <span className="rounded-full border border-white/80 bg-white/90 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#4B5563] shadow-sm backdrop-blur">
                      {product.category}
                    </span>
                  </div>

                  {/* Status Badge */}
                  <div className="absolute bottom-5 right-5">
                    <span
                      className={`rounded-full border px-3 py-1.5 text-[11px] font-semibold ${statusStyles[product.statusType]}`}
                    >
                      {product.status}
                    </span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6 sm:p-7">
                  <div className="mb-3 flex items-start justify-between gap-4">
                    <h3 className="text-xl font-bold tracking-tight text-[#111827] sm:text-2xl">
                      {product.title}
                    </h3>

                    {product.href && (
                      <ArrowRight className="mt-1 h-5 w-5 shrink-0 text-[#9CA3AF] transition-all duration-300 group-hover:translate-x-1 group-hover:text-[#6D28F5]" />
                    )}
                  </div>

                  <p className="text-sm leading-6 text-[#4B5563] sm:text-base">
                    {product.description}
                  </p>

                  {/* Technology Tags */}
                  <div className="mt-6 flex flex-wrap gap-2">
                    {product.technologies.map((technology) => (
                      <span
                        key={technology}
                        className="rounded-md bg-[#F6F7FB] px-2.5 py-1 text-xs font-medium text-[#6B7280]"
                      >
                        {technology}
                      </span>
                    ))}
                  </div>

                  {/* Bottom CTA Link */}
                  {product.href && (
                    <div className="mt-7 border-t border-[#E5E7EB] pt-5">
                      <Link
                        href={product.href}
                        className="group/link inline-flex items-center gap-2 text-sm font-semibold text-[#6D28F5] transition-colors hover:text-[#5B21E6]"
                      >
                        <span>
                          {product.title === 'SmartTabs'
                            ? 'Explore SmartTabs'
                            : product.statusType === 'soon'
                              ? 'Coming Soon'
                              : 'Explore Labs'}
                        </span>

                        {product.statusType !== 'soon' ? (
                          <ArrowRight className="h-4 w-4 transition-transform group-hover/link:translate-x-1" />
                        ) : (
                          <ExternalLink className="h-3.5 w-3.5" />
                        )}
                      </Link>
                    </div>
                  )}
                </div>
              </motion.article>
            );
          })}
        </div>

        {/* Bottom Closing Statement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-10 border-t border-[#E5E7EB] pt-8"
        >
          <p className="max-w-3xl text-sm leading-6 text-[#6B7280] sm:text-base">
            We&apos;re building our first generation of software products with
            a focus on intelligence, automation, productivity and real-world
            business value.
          </p>
        </motion.div>
      </div>
    </section>
  );
}