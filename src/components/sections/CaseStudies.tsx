'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/utils/cn';

const projects = [
  {
    title: "NexGen Logistics",
    category: "AI & Automation",
    description: "Optimizing global supply chains with predictive AI and real-time tracking systems.",
    bg: "bg-[#FAFAFC]",
  },
  {
    title: "FinSafe Core",
    category: "FinTech / Enterprise",
    description: "Building a high-security, low-latency banking core for the next generation of finance.",
    bg: "bg-[#F6F7FB]",
  },
  {
    title: "Orbit Cloud",
    category: "Cloud Infrastructure",
    description: "A distributed cloud platform serving millions of requests with zero downtime.",
    bg: "bg-[#F4F0FF]/50",
  }
];

export function CaseStudies() {
  return (
    <section id="work" className="py-24 md:py-32 bg-white">
      <div className="container max-w-[1280px] mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 md:mb-20 gap-8">
          <div className="max-w-2xl">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#111827] mb-6 tracking-tight">
              Extraordinary <br />
              <span className="text-[#6B7280]">Case Studies</span>
            </h2>
            <p className="text-lg md:text-xl text-[#4B5563] leading-relaxed">
              We take pride in our work. Here are some of the complex problems we've solved for our global partners.
            </p>
          </div>
          <button className="group flex items-center gap-2 text-[#6D28F5] font-bold hover:gap-3 transition-all">
            View All Projects <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="group cursor-pointer flex flex-col justify-between p-6 sm:p-8 rounded-[12px] border border-[#E5E7EB] hover:border-[#DDD6FE] hover:shadow-md transition-all duration-300"
            >
              <div>
                <div className={cn(
                  "relative aspect-[16/10] rounded-[10px] border border-[#E5E7EB] overflow-hidden mb-6 p-6 flex flex-col justify-end",
                  project.bg
                )}>
                  <span className="inline-block w-fit px-3 py-1 text-xs font-semibold tracking-wider uppercase text-[#6D28F5] bg-white border border-[#DDD6FE] rounded-full shadow-sm">
                    {project.category}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-[#111827] mb-3 group-hover:text-[#6D28F5] transition-colors">{project.title}</h3>
                <p className="text-sm md:text-base text-[#4B5563] leading-relaxed mb-6">
                  {project.description}
                </p>
              </div>

              <div className="flex items-center gap-2 text-sm font-semibold text-[#6D28F5] group-hover:gap-3 transition-all pt-4 border-t border-[#E5E7EB]">
                <span>Read Full Case Study</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
