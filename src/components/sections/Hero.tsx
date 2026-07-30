'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { HeroScene } from '@/components/3d/HeroScene';
import { ChevronDown, ArrowRight, Check, Sparkles, Activity, ShieldCheck, Zap } from 'lucide-react';
import Link from 'next/link';

export function Hero() {
  const { scrollY } = useScroll();
  const scrollOpacity = useTransform(scrollY, [0, 50], [1, 0]);
  const scrollYOffset = useTransform(scrollY, [0, 50], [0, 10]);

  return (
    <section className="relative min-h-[90vh] lg:min-h-screen w-full flex flex-col items-center justify-start pt-32 sm:pt-36 md:pt-44 lg:pt-48 pb-20 overflow-hidden">
      <HeroScene />
      
      {/* Layered Background Glows & Mesh Grid */}
      <div className="absolute -top-28 left-1/2 -translate-x-1/2 w-[700px] h-[500px] sm:w-[900px] sm:h-[600px] bg-gradient-to-b from-[#6D28F5]/15 via-[#5B21E6]/10 to-transparent rounded-full blur-[140px] pointer-events-none -z-20" />
      <div className="absolute top-[35%] -right-24 w-[420px] h-[420px] bg-[#6D28F5]/10 rounded-full blur-[120px] pointer-events-none -z-20 animate-pulse" style={{ animationDuration: '9s' }} />
      <div className="absolute top-[50%] -left-20 w-[350px] h-[350px] bg-[#5B21E6]/10 rounded-full blur-[100px] pointer-events-none -z-20" />
      <div className="absolute inset-0 bg-[radial-gradient(#111827_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.03] pointer-events-none -z-20" />

      {/* Main Content Container */}
      <div className="container max-w-[1280px] mx-auto px-6 relative z-10 flex flex-col items-center text-center">
        
        {/* Pill Badge */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 text-xs font-semibold tracking-wider uppercase text-[#6D28F5] bg-[#F4F0FF] rounded-full border border-[#DDD6FE] shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#6D28F5] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#6D28F5]"></span>
            </span>
            <span>Software Development Agency</span>
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[84px] font-bold tracking-tight text-[#111827] mb-6 leading-[0.96] text-balance max-w-5xl"
        >
          Software Built for Businesses <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] to-[#5B21E6]">
            That Grow.
          </span>
        </motion.h1>

        {/* Subtitle Paragraph */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-[#4B5563] mb-8 leading-relaxed text-balance font-normal"
        >
          We build websites, mobile apps, browser extensions, and AI automations that help businesses launch faster, work smarter, and grow with confidence.
        </motion.p>

        {/* CTA Buttons Row - Hero Height 56px (h-14), Radius 10px */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10 w-full sm:w-auto"
        >
          <Link 
            href="#contact"
            className="w-full sm:w-auto h-14 px-8 rounded-[10px] bg-[#6D28F5] text-white font-medium text-sm hover:bg-[#5B21E6] active:scale-[0.98] transition-all duration-200 shadow-md shadow-[#6D28F5]/20 flex items-center justify-center gap-2 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6D28F5] focus-visible:ring-offset-2"
          >
            <span>Start Your Project</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <Link 
            href="#work"
            className="w-full sm:w-auto h-14 px-8 rounded-[10px] bg-white border border-[#DDD6FE] text-[#6D28F5] hover:bg-[#F4F0FF] font-medium text-sm transition-all flex items-center justify-center gap-1.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6D28F5]"
          >
            <span>View Our Work</span>
            <ArrowRight className="w-4 h-4 text-[#6D28F5] group-hover:translate-x-1 transition-all" />
          </Link>
        </motion.div>

        {/* Trust & Credibility Checklist */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs sm:text-sm font-medium text-[#4B5563] mb-14"
        >
          <span className="flex items-center gap-1.5">
            <Check className="w-4 h-4 text-[#6D28F5] stroke-[2.5]" /> Website Development
          </span>
          <span className="flex items-center gap-1.5">
            <Check className="w-4 h-4 text-[#6D28F5] stroke-[2.5]" /> App Development
          </span>
          <span className="flex items-center gap-1.5">
            <Check className="w-4 h-4 text-[#6D28F5] stroke-[2.5]" /> AI Automation
          </span>
          <span className="flex items-center gap-1.5">
            <Check className="w-4 h-4 text-[#6D28F5] stroke-[2.5]" /> Browser Extensions
          </span>
        </motion.div>

        {/* Floating Glass Showcase Frame - Radius 12px/16px */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-4xl relative mt-2"
        >
          <div className="relative rounded-[16px] border border-[#E5E7EB] bg-white/70 backdrop-blur-xl p-4 sm:p-6 shadow-xl shadow-[#6D28F5]/5 overflow-hidden">
            <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-4 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#E5E7EB]" />
                <div className="w-3 h-3 rounded-full bg-[#E5E7EB]" />
                <div className="w-3 h-3 rounded-full bg-[#E5E7EB]" />
              </div>
              <div className="px-4 py-1 rounded-full bg-[#FAFAFC] text-[11px] font-medium text-[#6B7280] border border-[#E5E7EB]">
                apearix.com/platform-overview
              </div>
              <div className="flex items-center gap-2 text-[#6B7280] text-xs">
                <ShieldCheck className="w-4 h-4 text-[#6D28F5]" />
                <span className="hidden sm:inline">Encrypted & Scalable</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
              <div className="p-4 rounded-[12px] bg-white border border-[#E5E7EB] shadow-sm flex flex-col justify-between">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">AI Automation</span>
                  <Zap className="w-4 h-4 text-[#6D28F5]" />
                </div>
                <div className="text-2xl font-bold text-[#111827] mb-1">99.9%</div>
                <div className="text-xs text-[#6D28F5] font-medium">⚡ Automated Workflow Efficiency</div>
              </div>

              <div className="p-4 rounded-[12px] bg-white border border-[#E5E7EB] shadow-sm flex flex-col justify-between">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Product Speed</span>
                  <Activity className="w-4 h-4 text-[#6D28F5]" />
                </div>
                <div className="text-2xl font-bold text-[#111827] mb-1">100ms</div>
                <div className="text-xs text-[#6D28F5] font-medium">🚀 Ultra-fast Global Response</div>
              </div>

              <div className="p-4 rounded-[12px] bg-white border border-[#E5E7EB] shadow-sm flex flex-col justify-between">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Reliability</span>
                  <Sparkles className="w-4 h-4 text-[#6D28F5]" />
                </div>
                <div className="text-2xl font-bold text-[#111827] mb-1">Zero Latency</div>
                <div className="text-xs text-[#6D28F5] font-medium">✦ High-Scale Architecture</div>
              </div>
            </div>
          </div>
        </motion.div>

      </div>

      {/* Auto-fading Scroll Indicator */}
      <motion.div
        style={{ opacity: scrollOpacity, y: scrollYOffset }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 z-30 pointer-events-none"
      >
        <span className="text-[10px] font-bold tracking-widest uppercase text-[#6B7280]">Scroll to explore</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="w-4 h-4 text-[#6B7280]" />
        </motion.div>
      </motion.div>
    </section>
  );
}

