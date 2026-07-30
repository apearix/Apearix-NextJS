'use client';

import { motion } from 'framer-motion';

const companies = [
  "Linear", "Stripe", "Vercel", "Apple", "Tesla", "OpenAI", 
  "Notion", "Framer", "Raycast", "Arc", "Sentry", "GitHub"
];

export function TrustedBy() {
  return (
    <section className="py-16 md:py-24 bg-white border-y border-[#E5E7EB] overflow-hidden relative">
      {/* Edge gradient masks for seamless fade */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-24 md:w-32 bg-gradient-to-r from-white to-transparent z-10" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-24 md:w-32 bg-gradient-to-l from-white to-transparent z-10" />

      <div className="container max-w-[1280px] mx-auto px-6 mb-8 md:mb-12 text-center">
        <p className="text-xs md:text-sm font-semibold tracking-widest uppercase text-[#6B7280]">
          Powering the next generation of industry leaders
        </p>
      </div>

      <div className="relative flex overflow-x-hidden">
        <motion.div
          animate={{ x: ["0%", "-25%"] }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 30,
              ease: "linear",
            },
          }}
          className="flex whitespace-nowrap w-max"
        >
          {[...companies, ...companies, ...companies, ...companies].map((company, index) => (
            <div
              key={index}
              className="flex items-center justify-center px-10 md:px-12 text-2xl md:text-3xl font-bold text-[#111827]/25 hover:text-[#111827]/50 transition-colors cursor-default"
            >
              {company}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

