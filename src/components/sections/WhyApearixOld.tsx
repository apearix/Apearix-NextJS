'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import { cn } from '@/utils/cn';
import { Cpu, Sparkles, Layout, Globe } from 'lucide-react';

const reasons = [
  {
    title: "Engineering Excellence",
    description: "We don't just write code. We architect scalable, resilient systems that form the backbone of modern enterprise.",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1000&q=80",
    icon: Cpu,
    tag: "Robust Architecture",
    color: "bg-[#F4F0FF]/60"
  },
  {
    title: "AI-First Approach",
    description: "Intelligence is at our core. We integrate advanced AI models to automate complexity and drive decision-making.",
    image: "https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=1000&q=80",
    icon: Sparkles,
    tag: "Neural Automations",
    color: "bg-[#FAFAFC]"
  },
  {
    title: "Design-Led Innovation",
    description: "Beauty is a feature. Our products are intuitive, elegant, and designed to provide a world-class user experience.",
    image: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&w=1000&q=80",
    icon: Layout,
    tag: "Human-Centric UX",
    color: "bg-[#F6F7FB]"
  },
  {
    title: "Global Scalability",
    description: "Built for growth. Our solutions scale seamlessly from startups to global conglomerates without missing a beat.",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1000&q=80",
    icon: Globe,
    tag: "Cloud Infrastructure",
    color: "bg-[#FAFAFC]"
  }
];

export function WhyApearix() {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-75%"]);

  return (
    <section id="solutions" ref={targetRef} className="relative h-[300vh]">
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        <motion.div style={{ x }} className="flex gap-6 sm:gap-8 md:gap-10 px-6 sm:px-12 md:px-20">
          
          {/* Header Card / Intro Column */}
          <div className="flex-shrink-0 w-[280px] sm:w-[360px] md:w-[420px] flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 w-fit rounded-full bg-[#EDE8FF] text-[#6320EE] text-xs font-semibold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Core Values</span>
            </div>
            
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#0F172A] mb-6 leading-tight tracking-tight">
              Why <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6320EE] via-[#7B3FE4] to-[#A855F7]">
                Apearix?
              </span>
            </h2>
            
            <p className="text-base sm:text-lg text-[#64748B] leading-relaxed">
              We bridge the gap between complex engineering and human-centric design. Scroll to see how we redefine software development.
            </p>
          </div>

          {/* Cards with Relevant Images */}
          {reasons.map((reason, index) => {
            const Icon = reason.icon;
            return (
              <div
                key={index}
                className={cn(
                  "group flex-shrink-0 w-[85vw] sm:w-[420px] md:w-[460px] rounded-2xl p-4 sm:p-6 flex flex-col justify-between border border-gray-200/80 hover:border-purple-300 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10 bg-white",
                  reason.color
                )}
              >
                <div>
                  {/* Top Relevant Image Visual Container */}
                  <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden mb-6 bg-gray-100 border border-gray-100">
                    <Image
                      src={reason.image}
                      alt={reason.title}
                      fill
                      sizes="(max-width: 768px) 85vw, 460px"
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                    
                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 opacity-70 group-hover:opacity-50 transition-opacity" />

                    {/* Number Badge Top Right */}
                    <span className="absolute top-3 right-3 text-2xl font-bold text-white/90 drop-shadow-md">
                      0{index + 1}
                    </span>

                    {/* Tag Badge Top Left */}
                    <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 backdrop-blur-md text-[11px] font-semibold text-gray-900 border border-white/50">
                      <Icon className="w-3.5 h-3.5 text-[#6320EE]" />
                      <span>{reason.tag}</span>
                    </div>
                  </div>

                  {/* Text Details */}
                  <div className="px-1">
                    <h3 className="text-2xl sm:text-3xl font-bold text-[#0F172A] mb-3 group-hover:text-[#6320EE] transition-colors">
                      {reason.title}
                    </h3>
                    <p className="text-sm sm:text-base text-[#64748B] leading-relaxed">
                      {reason.description}
                    </p>
                  </div>
                </div>

                {/* Bottom Decorative Accent */}
                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-[#6320EE]">
                  <span>Apearix Standard</span>
                  <span className="w-2 h-2 rounded-full bg-[#6320EE] animate-pulse" />
                </div>
              </div>
            );
          })}

        </motion.div>
      </div>
    </section>
  );
}