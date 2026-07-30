'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Calendar ,Bot, Code2, Activity } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export function Hero() {
  return (
    <section className="relative min-h-screen w-full flex items-center justify-center pt-28 sm:pt-36 lg:pt-25 pb-16 overflow-hidden bg-[#FAF9FF]">
      
      {/* Background Curved Wave & Ambient Glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        {/* Soft violet backdrop glow */}
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] sm:w-[800px] sm:h-[800px] bg-purple-200/40 rounded-full blur-[140px]" />
        
        {/* Abstract background curve styling matching image background */}
        <svg
          className="absolute right-0 top-0 h-full w-full lg:w-3/4 opacity-40 text-purple-100/60 pointer-events-none"
          viewBox="0 0 1000 1000"
          fill="none"
          preserveAspectRatio="none"
        >
          <path
            d="M 500 0 C 800 200, 400 800, 1000 1000 L 1000 0 Z"
            fill="currentColor"
          />
        </svg>
      </div>

      <div className="container max-w-7xl mx-auto px-6relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* LEFT COLUMN: Hero Copy & CTAs */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 flex flex-col items-start text-left"
          >
            {/* Pill Tag */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 mb-8 rounded-full bg-[#EDE8FF] text-[#6320EE] text-[11px] sm:text-xs font-semibold tracking-wider uppercase border border-purple-200/50"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#6320EE]" />
              <span>AI • AUTOMATION • SOFTWARE</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl sm:text-6xl md:text-7xl xl:text-[76px] font-bold text-[#0F172A] tracking-tight leading-[1.05] mb-6"
            >
              Engineering AI. <br />
              Building the <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6320EE] via-[#7B3FE4] to-[#A855F7]">
                Future.
              </span>
            </motion.h1>

            {/* Subtitle Paragraph */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-base sm:text-lg text-[#64748B] max-w-xl mb-9 leading-relaxed font-normal"
            >
              Apearix builds intelligent software, AI systems, and automation solutions that help businesses move faster, work smarter, and scale infinitely.
            </motion.p>

            {/* CTA Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto mb-12"
            >
              <Link
                href="#work"
                className="h-13 px-7 rounded-full bg-gradient-to-r from-[#6320EE] to-[#7B3FE4] text-white font-medium text-sm hover:opacity-95 active:scale-[0.98] transition-all shadow-lg shadow-[#6320EE]/25 flex items-center justify-center gap-2 group"
              >
                <span>Explore Our Work</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="#contact"
                className="h-13 px-7 rounded-full bg-white border border-gray-200/80 text-[#1E293B] font-medium text-sm hover:bg-gray-50 active:scale-[0.98] transition-all shadow-sm flex items-center justify-center gap-2"
              >
                <span>Book a Call</span>
                <Calendar className="w-4 h-4 text-gray-500" />
              </Link>
            </motion.div>

            {/* Social Proof Section */}
            {/* <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex flex-col gap-2.5 pt-2 border-t border-gray-200/60 w-full sm:w-auto"
            >
              <span className="text-xs font-medium text-gray-500 tracking-wide">
                Trusted by visionary teams
              </span>
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2 overflow-hidden">
                  {[
                    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80",
                    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80",
                    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80",
                    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80",
                  ].map((url, idx) => (
                    <div
                      key={idx}
                      className="inline-block h-8 w-8 rounded-full ring-2 ring-white overflow-hidden bg-gray-100"
                    >
                      <img src={url} alt="User Avatar" className="h-full w-full object-cover" />
                    </div>
                  ))}
                </div>
                <span className="text-xs font-semibold text-gray-700">
                  50+ companies growing with Apearix
                </span>
              </div>
            </motion.div> */}
          </motion.div>

          {/* RIGHT COLUMN: 3D Stage / Logo Showcase */}
          <TechVisual/>

        </div>
      </div>
    </section>
  );
} 

export function  TechVisual() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="lg:col-span-5 relative flex items-center justify-center mt-6 lg:mt-0"
    >
      <div className="relative w-full max-w-[480px] lg:max-w-[560px] aspect-square flex items-center justify-center">
        
        {/* Outer Radiant Glow */}
        <div className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-purple-500/20 blur-[90px] pointer-events-none" />

        {/* Outer Rotating Orbit Ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute w-[320px] h-[320px] sm:w-[400px] sm:h-[400px] rounded-full border border-dashed border-purple-300/40 pointer-events-none"
        />

        {/* Counter-Rotating Inner Orbit Ring */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          className="absolute w-[240px] h-[240px] sm:w-[300px] sm:h-[300px] rounded-full border border-purple-400/20 pointer-events-none"
        />

        {/* Floating Feature Node 1: AI Systems */}
        <motion.div
          animate={{ y: [-6, 6, -6] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-2 left-4 sm:left-8 z-30 flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-white/80 backdrop-blur-md border border-purple-100 shadow-xl shadow-purple-500/10"
        >
          <div className="p-1.5 rounded-lg bg-purple-100 text-[#6320EE]">
            <Bot className="w-4 h-4" />
          </div>
          <div className="text-left">
            <p className="text-[10px] uppercase font-bold text-gray-400 leading-tight">Engine</p>
            <p className="text-xs font-semibold text-gray-800">AI Automations</p>
          </div>
        </motion.div>

        {/* Floating Feature Node 2: Full Stack Dev */}
        <motion.div
          animate={{ y: [6, -6, 6] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/3 -right-2 sm:-right-4 z-30 flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-white/80 backdrop-blur-md border border-purple-100 shadow-xl shadow-purple-500/10"
        >
          <div className="p-1.5 rounded-lg bg-indigo-100 text-indigo-600">
            <Code2 className="w-4 h-4" />
          </div>
          <div className="text-left">
            <p className="text-[10px] uppercase font-bold text-gray-400 leading-tight">Software</p>
            <p className="text-xs font-semibold text-gray-800">Scalable Web & Mobile</p>
          </div>
        </motion.div>

        {/* Floating Feature Node 3: Real-time Stats */}
        <motion.div
          animate={{ y: [-8, 4, -8] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-2 left-6 sm:left-12 z-30 flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-white/80 backdrop-blur-md border border-purple-100 shadow-xl shadow-purple-500/10"
        >
          <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-600">
            <Activity className="w-4 h-4" />
          </div>
          <div className="text-left">
            <p className="text-[10px] uppercase font-bold text-gray-400 leading-tight">Performance</p>
            <p className="text-xs font-semibold text-gray-800">99.9% Efficiency</p>
          </div>
        </motion.div>

        {/* Glowing Stage Podium Base */}
        <div className="absolute bottom-6 w-full flex flex-col items-center pointer-events-none">
          <div className="w-[85%] h-12 rounded-[100%] bg-gradient-to-r from-purple-300 via-white to-purple-200 border border-purple-300/60 shadow-lg relative z-10" />
          <div className="w-[88%] h-10 -mt-8 rounded-[100%] bg-purple-600/30 blur-md" />
          <div className="w-[92%] h-16 -mt-6 rounded-[100%] bg-gradient-to-b from-gray-200 to-white border border-gray-300/50 shadow-2xl" />
        </div>

        {/* Centerpiece 3D Floating Apearix Core */}
        <motion.div
          animate={{ y: [-10, 10, -10] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="relative z-20 mb-12 drop-shadow-[0_25px_35px_rgba(99,32,238,0.4)]"
        >
          <div className="relative flex items-center justify-center">
            {/* Ambient Pulse Ring around logo */}
            <span className="absolute animate-ping inline-flex h-32 w-32 rounded-full bg-purple-400 opacity-20" />

            <svg
              width="220"
              height="220"
              viewBox="0 0 200 200"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-44 h-44 sm:w-60 sm:h-60"
            >
              <defs>
                <linearGradient id="apearix-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#A855F7" />
                  <stop offset="50%" stopColor="#6320EE" />
                  <stop offset="100%" stopColor="#4318FF" />
                </linearGradient>
              </defs>

              {/* Outer Triangle Icon Frame */}
              <path
                d="M100 20 L170 150 L140 150 L100 70 L60 150 L30 150 Z"
                fill="url(#apearix-grad)"
              />
              {/* Inner Diamond Core */}
              <path
                d="M100 70 L130 130 L100 160 L70 130 Z"
                fill="url(#apearix-grad)"
                opacity="0.95"
              />
              {/* Base Legs */}
              <path
                d="M30 150 L60 150 L100 185 L140 150 L170 150 L100 210 Z"
                fill="url(#apearix-grad)"
              />
            </svg>
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
}