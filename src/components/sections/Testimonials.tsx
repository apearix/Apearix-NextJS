'use client';

import { motion } from 'framer-motion';

const testimonials = [
  {
    quote: "Apearix didn't just build our app; they redefined our entire digital strategy. Their AI expertise is second to none.",
    author: "Sarah Chen",
    role: "CTO, NexGen Logistics"
  },
  {
    quote: "The level of engineering precision and design elegance they bring to the table is something I've never seen before.",
    author: "James Wilson",
    role: "Founder, FinSafe Core"
  },
  {
    quote: "They are more than a vendor; they are a strategic partner that truly understands the future of software.",
    author: "Elena Rodriguez",
    role: "VP Engineering, Orbit Cloud"
  },
  {
    quote: "Working with Apearix felt like having a world-class R&D team embedded directly within our company.",
    author: "Michael Chang",
    role: "Director of Innovation, Global Corp"
  }
];

export function Testimonials() {
  return (
    <section className="py-24 md:py-32 bg-[#FAFAFC] overflow-hidden relative">
      {/* Edge gradient masks for seamless fade */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-[#FAFAFC] to-transparent z-10" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-[#FAFAFC] to-transparent z-10" />

      <div className="container max-w-[1280px] mx-auto px-6 mb-16 md:mb-20 text-center">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#111827] mb-4 tracking-tight">
          Trusted by <span className="text-[#6D28F5]">Visionary Leaders</span>
        </h2>
      </div>

      <div className="relative flex overflow-x-hidden">
        <motion.div
          animate={{ x: ["0%", "-25%"] }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 35,
              ease: "linear",
            },
          }}
          className="flex whitespace-nowrap w-max"
        >
          {[...testimonials, ...testimonials, ...testimonials, ...testimonials].map((t, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-[320px] sm:w-[420px] md:w-[540px] px-3 md:px-4 pb-1"
            >
              <div className="bg-white p-6 md:p-8 rounded-[12px] border border-[#E5E7EB] shadow-sm whitespace-normal h-full flex flex-col justify-between hover:shadow-md hover:border-[#DDD6FE] transition-all duration-300">
                <p className="text-base md:text-xl text-[#111827] font-medium leading-relaxed mb-6 md:mb-8 italic">
                  "{t.quote}"
                </p>
                <div>
                  <div className="font-bold text-[#111827] text-sm md:text-base">{t.author}</div>
                  <div className="text-[#6B7280] text-xs font-semibold tracking-wider uppercase mt-1">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

