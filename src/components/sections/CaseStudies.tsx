'use client';

import { motion } from 'framer-motion';
import {
  ArrowRight,
  ExternalLink,
  Receipt,
  Sparkles,
  Workflow,
  Layers,
  CheckCircle2,
} from 'lucide-react';
import Link from 'next/link';

interface Product {
  title: string;
  category: string;
  tagline: string;
  description: string;
  status: string;
  statusType: 'active' | 'building' | 'soon';
  technologies: string[];
  href?: string;
  featured?: boolean;
  icon: React.ElementType;
  mockupType: 'smarttabs' | 'apxbill' | 'labs';
}

const products: Product[] = [
  {
    title: 'SmartTabs',
    category: 'Browser Workspace OS',
    tagline: 'Browser Workspace Operating System',
    description:
      'A revolutionary workspace operating system for Chrome that transforms chaotic browsing into structured, lightning-fast productivity spaces.',
    status: 'Live on Web Store',
    statusType: 'active',
    technologies: ['Chrome Extension', 'Manifest V3', 'React', 'Zustand'],
    href: '#smarttabs',
    featured: true,
    icon: Workflow,
    mockupType: 'smarttabs',
  },
  {
    title: 'ApxBill',
    category: 'Billing & Invoicing',
    tagline: 'Simple, powerful billing and invoicing for modern businesses.',
    description:
      'Automate recurring subscriptions, generate clean PDF invoices, and track revenue health with an uncompromising user interface.',
    status: 'Early Access',
    statusType: 'building',
    technologies: ['Next.js 14', 'Stripe API', 'Tailwind', 'PostgreSQL'],
    href: '#apxbill',
    featured: false,
    icon: Receipt,
    mockupType: 'apxbill',
  },
  {
    title: 'Apearix Labs',
    category: 'Experimental Tech',
    tagline: 'Next-gen AI modules and developer utilities.',
    description:
      'An incubation ground for experimental SaaS products, AI workflows, and developer tools built to push the limits of modern software.',
    status: 'In Development',
    statusType: 'soon',
    technologies: ['AI Agents', 'OpenAI', 'Python', 'TypeScript'],
    href: '#apearix-labs',
    featured: false,
    icon: Sparkles,
    mockupType: 'labs',
  },
];

const statusStyles = {
  active: 'bg-emerald-50 text-emerald-700 border-emerald-200/60 shadow-sm shadow-emerald-500/5',
  building: 'bg-[#F4F0FF] text-[#6D28F5] border-[#DDD6FE] shadow-sm shadow-[#6D28F5]/5',
  soon: 'bg-gray-50 text-gray-600 border-gray-200',
};

export function CaseStudies() {
  return (
    <section
      id="products"
      className="relative overflow-hidden bg-white py-10 sm:py-16 lg:py-20"
    >
      {/* Immersive background glow & grid elements */}
      <div className="pointer-events-none absolute left-1/2 top-1/4 -z-10 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-[#6D28F5]/5 blur-[160px]" />

      <div className="absolute inset-0 -z-20 opacity-30 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#E5E7EB 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 xl:px-0">

        {/* Section Header */}
        <div className="mb-8 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#DDD6FE] bg-[#F4F0FF] px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#6D28F5] shadow-sm"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Featured Products</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-balance text-3xl font-bold tracking-tight text-[#111827] sm:text-4xl md:text-5xl lg:text-6xl"
          >
            Products We&apos;re <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6D28F5] via-[#7B3FE4] to-[#A855F7]">Building.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-5 max-w-3xl text-base leading-relaxed text-[#4B5563] sm:text-lg"
          >
            As a key Apearix differentiator, we don&apos;t just build client software we incubate high-performance proprietary tools designed to redefine digital workflows.
          </motion.p>
        </div>

        {/* Products Bento / Grid Showcase */}
        <div className="grid gap-6 lg:grid-cols-3">
          {products.map((product, index) => {
            const Icon = product.icon;
            const isFeatured = product.featured;

            return (
              <motion.article
                key={product.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.15,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white transition-all duration-500 hover:-translate-y-1 hover:border-[#C4B5FD] hover:shadow-2xl hover:shadow-[#6D28F5]/10 ${isFeatured ? 'lg:col-span-1 border-[#DDD6FE]/80 bg-gradient-to-b from-white via-white to-[#FAFAFC]' : ''
                  }`}
              >
                {/* Premium Mockup / Interactive Visual Stage */}
                <div className={`relative overflow-hidden border-b border-[#E5E7EB] bg-[#F9FAFB] p-6 sm:p-10 min-h-[260px]`}>

                  {/* Subtle Background Pattern */}
                  <div className="absolute inset-0 opacity-50 bg-[radial-gradient(#CBD5E1_1px,transparent_1px)] [background-size:16px_16px]" />

                  {/* Floating ambient light */}
                  <div className="absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#6D28F5]/10 blur-3xl pointer-events-none" />

                  
                  <div className="absolute right-6 top-6 z-10">
                    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold backdrop-blur-md ${statusStyles[product.statusType]}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${product.statusType === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-[#6D28F5]'}`} />
                      {product.status}
                    </span>
                  </div>

                  {/* Dynamic High-End Product UI Mockups */}
                  <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-8 pt-16">
                    {product.mockupType === 'smarttabs' && (
                      <div className="w-full max-w-lg rounded-2xl border border-gray-200/80 bg-white p-5 shadow-2xl shadow-purple-900/10 transition-transform duration-500 group-hover:scale-[1.02]">
                        <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-rose-400" />
                            <div className="w-3 h-3 rounded-full bg-amber-400" />
                            <div className="w-3 h-3 rounded-full bg-emerald-400" />
                          </div>
                          <div className="px-3 py-1 rounded-md bg-gray-50 border border-gray-100 text-[11px] font-mono text-gray-500">
                            smarttabs.extension // workspace-active
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-3 mb-4">
                          {['Client Projects', 'Research Hub', 'Deployment Stack'].map((tabGroup, i) => (
                            <div key={i} className={`p-3 rounded-xl border text-left ${i === 0 ? 'bg-[#F4F0FF] border-[#DDD6FE] text-[#6D28F5]' : 'bg-gray-50/70 border-gray-100 text-gray-700'}`}>
                              <div className="flex items-center gap-1.5 font-semibold text-xs mb-1">
                                <Workflow className="w-3.5 h-3.5" />
                                <span className="truncate">{tabGroup}</span>
                              </div>
                              <div className="text-[10px] text-gray-400">12 tabs optimized</div>
                            </div>
                          ))}
                        </div>
                        <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-between text-xs text-gray-600">
                          <span className="font-medium">Memory Usage Saved: <strong className="text-emerald-600">68%</strong></span>
                          <span className="text-purple-600 font-semibold flex items-center gap-1">Active Sync <CheckCircle2 className="w-3.5 h-3.5" /></span>
                        </div>
                      </div>
                    )}

                    {product.mockupType === 'apxbill' && (
                      <div className="w-full max-w-sm rounded-2xl border border-gray-200/80 bg-white p-5 shadow-2xl shadow-purple-900/10 transition-transform duration-500 group-hover:scale-[1.02]">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-[#6D28F5] text-white flex items-center justify-center font-bold text-xs">
                              AB
                            </div>
                            <div>
                              <div className="text-xs font-bold text-gray-900">ApxBill Engine</div>
                              <div className="text-[10px] text-emerald-600 font-medium">● Gateway Connected</div>
                            </div>
                          </div>
                          <span className="px-2 py-0.5 rounded text-[10px] bg-purple-50 text-[#6D28F5] font-semibold">v2.4 Live</span>
                        </div>
                        <div className="space-y-2 mb-4">
                          <div className="flex justify-between items-center p-2.5 rounded-xl bg-gray-50 border border-gray-100 text-xs">
                            <span className="text-gray-600 font-medium">MRR Growth</span>
                            <span className="font-bold text-gray-900">$24,850.00 <span className="text-emerald-600 font-normal">+18%</span></span>
                          </div>
                          <div className="flex justify-between items-center p-2.5 rounded-xl bg-gray-50 border border-gray-100 text-xs">
                            <span className="text-gray-600 font-medium">Automated Invoices</span>
                            <span className="font-bold text-[#6D28F5]">1,420 Paid</span>
                          </div>
                        </div>
                        <div className="w-full py-2 bg-[#111827] text-white text-center rounded-xl text-xs font-semibold shadow-sm">
                          Create Instant Invoice →
                        </div>
                      </div>
                    )}

                    {product.mockupType === 'labs' && (
                      <div className="w-full max-w-sm rounded-2xl border border-gray-200/80 bg-white p-6 shadow-2xl shadow-purple-900/10 text-center transition-transform duration-500 group-hover:scale-[1.02]">
                        <div className="w-14 h-14 rounded-2xl bg-[#F4F0FF] border border-[#DDD6FE] text-[#6D28F5] flex items-center justify-center mx-auto mb-3 shadow-inner">
                          <Sparkles className="w-7 h-7" />
                        </div>
                        <h4 className="font-bold text-gray-900 text-sm mb-1">Apearix Labs Sandbox</h4>
                        <p className="text-xs text-gray-500 mb-4">Autonomous AI agents & next-gen developer utilities in active testing.</p>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-mono">
                          <span className="w-2 h-2 rounded-full bg-purple-600 animate-ping" />
                          <span>Training Neural Modules...</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6 sm:p-8 flex flex-col justify-between flex-grow">
                  <div>
                    <div className="mb-3 flex items-start justify-between gap-4">
                      <div>
                        <span className="text-xs font-semibold uppercase tracking-wider text-[#6D28F5] block mb-1">
                          {product.category}
                        </span>
                        <h3 className="text-2xl font-bold tracking-tight text-[#111827] sm:text-3xl">
                          {product.title}
                        </h3>
                      </div>

                      {product.href && (
                        <div className="w-10 h-10 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-500 transition-all duration-300 group-hover:border-[#6D28F5] group-hover:bg-[#F4F0FF] group-hover:text-[#6D28F5] shrink-0 shadow-sm">
                          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                        </div>
                      )}
                    </div>

                    <p className="text-sm sm:text-base font-semibold text-gray-900 mb-2">
                      {product.tagline}
                    </p>

                    <p className="text-sm leading-relaxed text-[#4B5563] sm:text-base">
                      {product.description}
                    </p>

                    {/* Technology Tags */}
                    <div className="mt-6 flex flex-wrap gap-2">
                      {product.technologies.map((technology) => (
                        <span
                          key={technology}
                          className="rounded-lg bg-[#F6F7FB] border border-gray-100 px-3 py-1 text-xs font-medium text-[#6B7280]"
                        >
                          {technology}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Bottom Action CTA Link */}
                  {product.href && (
                    <div className="mt-8 border-t border-[#E5E7EB] pt-6 flex items-center justify-between">
                      <Link
                        href={product.href}
                        className="group/link inline-flex items-center gap-2 text-sm font-semibold text-[#6D28F5] transition-colors hover:text-[#5B21E6]"
                      >
                        <span>
                          {product.title === 'SmartTabs'
                            ? 'Explore SmartTabs Workspace'
                            : product.title === 'ApxBill'
                              ? 'Explore ApxBill Platform'
                              : 'Explore Apearix Labs'}
                        </span>
                        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/link:translate-x-1" />
                      </Link>

                      <span className="text-xs text-gray-400 font-medium">
                        {product.statusType === 'active' ? 'Production Ready' : 'In Incubation'}
                      </span>
                    </div>
                  )}
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}