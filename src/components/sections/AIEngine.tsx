'use client';

import { motion } from 'framer-motion';
import { Brain, Sparkles, Zap, Shield, Globe, Database } from 'lucide-react';

const orbitingItems = [
  { icon: Brain, label: "Neural Networks", angle: 0 },
  { icon: Sparkles, label: "Generative AI", angle: 60 },
  { icon: Zap, label: "Real-time Processing", angle: 120 },
  { icon: Shield, label: "Safety & Ethics", angle: 180 },
  { icon: Globe, label: "Global Inference", angle: 240 },
  { icon: Database, label: "Vector Storage", angle: 300 },
];

export function AIEngine() {
  return (
    <section className="py-24 md:py-32 bg-white overflow-hidden">
      <div className="container max-w-[1280px] mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#111827] mb-6 tracking-tight">
            The AI <br />
            <span className="text-[#6D28F5]">Intelligence Engine</span>
          </h2>
          <p className="text-lg md:text-xl text-[#4B5563] leading-relaxed">
            A proprietary orchestration layer that coordinates specialized AI models to solve complex engineering challenges with unprecedented efficiency.
          </p>
        </div>

        <div className="relative h-[480px] sm:h-[560px] md:h-[600px] w-full flex items-center justify-center">
          {/* Central Core */}
          <motion.div
            animate={{ 
              scale: [1, 1.05, 1],
              rotate: [0, 180, 360]
            }}
            transition={{ 
              duration: 25, 
              repeat: Infinity, 
              ease: "linear" 
            }}
            className="relative z-10 w-32 h-32 sm:w-40 sm:h-40 md:w-44 md:h-44 rounded-[16px] bg-gradient-to-br from-[#7C3AED] to-[#5B21E6] flex items-center justify-center shadow-xl shadow-[#6D28F5]/30"
          >
            <Brain className="w-12 h-12 sm:w-16 sm:h-16 text-white" />
            <div className="absolute inset-0 bg-white/20 rounded-[16px] blur-xl animate-pulse" />
          </motion.div>

          {/* Orbital Rings */}
          <div className="absolute inset-0 border border-[#DDD6FE]/40 rounded-full scale-[0.55] sm:scale-[0.6] -z-10" />
          <div className="absolute inset-0 border border-[#DDD6FE]/20 rounded-full scale-[0.75] sm:scale-[0.8] -z-10" />

          {/* Orbiting Cards */}
          {orbitingItems.map((item, index) => (
            <motion.div
              key={index}
              animate={{ 
                rotate: 360 
              }}
              transition={{ 
                duration: 35, 
                repeat: Infinity, 
                ease: "linear",
                delay: -index * 5.8
              }}
              className="absolute w-full h-full flex items-center justify-center pointer-events-none"
            >
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 35, repeat: Infinity, ease: "linear", delay: -index * 5.8 }}
                className="pointer-events-auto bg-white border border-[#E5E7EB] p-3 sm:p-4 rounded-[12px] shadow-sm flex items-center gap-3 w-44 sm:w-52 md:w-56 -translate-y-[150px] sm:-translate-y-[210px] md:-translate-y-[260px] hover:border-[#DDD6FE] transition-colors"
              >
                <div className="p-2 bg-[#F4F0FF] rounded-[8px]">
                  <item.icon className="w-4 h-4 sm:w-5 sm:h-5 text-[#6D28F5]" />
                </div>
                <span className="text-xs sm:text-sm font-bold text-[#111827] whitespace-nowrap">{item.label}</span>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
