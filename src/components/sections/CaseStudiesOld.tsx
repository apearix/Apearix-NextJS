'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowRight, Sparkles } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface Project {
  title: string;
  category: string;
  description: string;
  image: string;
  metrics: string;
  href: string;
}

const projects: Project[] = [
  {
    title: "NexGen Logistics",
    category: "AI & Automation",
    description: "Optimizing global supply chains with predictive AI models and real-time autonomous routing.",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80",
    metrics: "40% Cost Reduced",
    href: "#case-study-nexgen",
  },
  {
    title: "FinSafe Core",
    category: "FinTech / Enterprise",
    description: "Building a high-security, low-latency banking core infrastructure for modern digital finance.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
    metrics: "99.99% Latency Drop",
    href: "#case-study-finsafe",
  },
  {
    title: "Orbit Cloud",
    category: "Cloud Infrastructure",
    description: "Distributed cloud micro-services architecture serving millions of concurrent global requests.",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
    metrics: "10M+ Daily Requests",
    href: "#case-study-orbit",
  },
];

export function CaseStudies() {
  return (
    <section id="work" className="py-10 md:py-20 bg-[#FAF9FF] relative overflow-hidden">
      
      {/* Background Soft Glow Ambient */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-purple-200/30 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="container max-w-7xl mx-auto px-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12  gap-6">
          <div className="max-w-2xl">
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full bg-[#EDE8FF] text-[#6320EE] text-xs font-semibold tracking-wider uppercase"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Selected Portfolio</span>
            </motion.div>

            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#0F172A] tracking-tight leading-[1.08]"
            >
              Extraordinary <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6320EE] via-[#7B3FE4] to-[#A855F7]">
                Case Studies.
              </span>
            </motion.h2>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link 
              href="#projects"
              className="group inline-flex items-center gap-2 text-sm sm:text-base font-semibold text-[#6320EE] hover:text-[#4318FF] transition-all"
            >
              <span>View All Projects</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="group relative flex flex-col justify-between rounded-2xl bg-white border border-gray-200/80 p-4 sm:p-5 hover:border-purple-300 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300"
            >
              <div>
                {/* Image Showcase Container */}
                <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden mb-6 bg-gray-100 border border-gray-100">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                  
                  {/* Subtle Dark Gradient Overlay for Readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10 opacity-60 group-hover:opacity-40 transition-opacity" />

                  {/* Top Glass Badge */}
                  <div className="absolute top-3 left-3 z-10">
                    <span className="inline-block px-3 py-1 text-[11px] font-semibold tracking-wider uppercase text-gray-900 bg-white/80 backdrop-blur-md rounded-full border border-white/50 shadow-sm">
                      {project.category}
                    </span>
                  </div>

                  {/* Bottom Metric Chip */}
                  <div className="absolute bottom-3 right-3 z-10">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold text-white bg-purple-600/80 backdrop-blur-md rounded-lg border border-purple-400/30">
                      ⚡ {project.metrics}
                    </span>
                  </div>
                </div>

                {/* Title & Description */}
                <div className="px-1">
                  <h3 className="text-xl sm:text-2xl font-bold text-[#0F172A] mb-2.5 group-hover:text-[#6320EE] transition-colors flex items-center justify-between">
                    <span>{project.title}</span>
                    <ArrowUpRight className="w-5 h-5 text-gray-400 group-hover:text-[#6320EE] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all opacity-0 group-hover:opacity-100" />
                  </h3>
                  <p className="text-sm text-[#64748B] leading-relaxed mb-6 line-clamp-3">
                    {project.description}
                  </p>
                </div>
              </div>

              {/* Bottom Card Footer / CTA */}
              <div className="pt-4 px-1 border-t border-gray-100 flex items-center justify-between text-xs sm:text-sm font-semibold text-[#6320EE] group-hover:text-[#4318FF] transition-colors">
                <span>Read Full Case Study</span>
                <div className="w-7 h-7 rounded-full bg-purple-50 group-hover:bg-[#6320EE] text-[#6320EE] group-hover:text-white flex items-center justify-center transition-all">
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}