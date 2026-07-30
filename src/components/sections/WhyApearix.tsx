'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { cn } from '@/utils/cn';

const reasons = [
  {
    title: "Engineering Excellence",
    description: "We don't just write code. We architect scalable, resilient systems that form the backbone of modern enterprise.",
    color: "bg-[#F4F0FF]/60"
  },
  {
    title: "AI-First Approach",
    description: "Intelligence is at our core. We integrate advanced AI models to automate complexity and drive decision-making.",
    color: "bg-[#FAFAFC]"
  },
  {
    title: "Design-Led Innovation",
    description: "Beauty is a feature. Our products are intuitive, elegant, and designed to provide a world-class user experience.",
    color: "bg-[#F6F7FB]"
  },
  {
    title: "Global Scalability",
    description: "Built for growth. Our solutions scale seamlessly from startups to global conglomerates without missing a beat.",
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
    <section id="solutions" ref={targetRef} className="relative h-[300vh] bg-white">
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        <motion.div style={{ x }} className="flex gap-6 sm:gap-8 md:gap-12 px-6 sm:px-12 md:px-24">
          <div className="flex-shrink-0 w-[280px] sm:w-[380px] md:w-[460px] flex flex-col justify-center">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#111827] mb-6 leading-tight tracking-tight">
              Why <br />
              <span className="text-[#6D28F5]">Apearix?</span>
            </h2>
            <p className="text-base sm:text-lg text-[#4B5563] leading-relaxed">
              We bridge the gap between complex engineering and human-centric design. Scroll to see how we redefine software development.
            </p>
          </div>

          {reasons.map((reason, index) => (
            <div
              key={index}
              className={cn(
                "flex-shrink-0 w-[82vw] sm:w-[420px] md:w-[460px] h-auto min-h-[420px] sm:min-h-[460px] md:min-h-[500px] rounded-[12px] p-6 sm:p-8 md:p-10 flex flex-col justify-end border border-[#E5E7EB] transition-all duration-300 hover:border-[#DDD6FE] shadow-sm",
                reason.color
              )}
            >
              <span className="text-5xl md:text-6xl font-bold text-[#111827]/10 mb-6 md:mb-8">0{index + 1}</span>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#111827] mb-4">{reason.title}</h3>
              <p className="text-sm sm:text-base text-[#4B5563] leading-relaxed">
                {reason.description}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
