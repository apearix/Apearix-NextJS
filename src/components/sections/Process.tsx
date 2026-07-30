'use client';

import { motion, useScroll, useSpring } from 'framer-motion';
import { useRef } from 'react';

const steps = [
  {
    title: "Discovery & Ideation",
    description: "We dive deep into your business challenges to identify high-impact opportunities for engineering and AI integration.",
  },
  {
    title: "Architectural Design",
    description: "Our engineers and designers collaborate to map out a scalable, resilient system architecture and user experience.",
  },
  {
    title: "Agile Development",
    description: "High-velocity execution with continuous integration, ensuring transparent progress and rapid feedback loops.",
  },
  {
    title: "Rigorous Deployment",
    description: "Automated testing and multi-stage deployment ensure your product is battle-ready for the real world.",
  },
  {
    title: "Scaling & Optimization",
    description: "Post-launch, we monitor, optimize, and scale your infrastructure to meet growing demand seamlessly.",
  }
];

export function Process() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <section id="process" className="py-24 md:py-32 bg-white">
      <div className="container max-w-[1280px] mx-auto px-6">
        <div className="max-w-3xl mb-16 md:mb-24">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#111827] mb-6 tracking-tight">
            Our Proven <br />
            <span className="text-[#6B7280]">Engineering Process</span>
          </h2>
          <p className="text-lg md:text-xl text-[#4B5563] leading-relaxed">
            A methodical approach to solving complex problems, refined over hundreds of successful deployments.
          </p>
        </div>

        <div ref={containerRef} className="relative max-w-4xl mx-auto">
          {/* Timeline Line */}
          <div className="absolute left-[20px] md:left-1/2 top-0 bottom-0 w-px bg-[#E5E7EB] md:-translate-x-1/2" />
          <motion.div 
            style={{ scaleY, transformOrigin: "top" }}
            className="absolute left-[20px] md:left-1/2 top-0 bottom-0 w-px bg-[#6D28F5] md:-translate-x-1/2" 
          />

          {steps.map((step, index) => (
            <div key={index} className="relative mb-16 md:mb-24 last:mb-0">
              <div className={index % 2 === 0 ? "md:flex-row-reverse flex items-start gap-6 md:gap-24" : "md:flex-row flex items-start gap-6 md:gap-24"}>
                <div className="flex-1 md:text-right hidden md:block">
                  {index % 2 === 0 ? null : (
                    <StepContent step={step} index={index} />
                  )}
                </div>
                
                <div className="relative z-10 flex-shrink-0 w-10 h-10 rounded-full bg-white border-2 border-[#6D28F5] flex items-center justify-center font-bold text-[#6D28F5] shadow-sm text-sm">
                  {index + 1}
                </div>

                <div className="flex-1">
                  {index % 2 === 0 ? (
                    <StepContent step={step} index={index} />
                  ) : (
                    <div className="md:hidden">
                      <StepContent step={step} index={index} />
                    </div>
                  )}
                  {index % 2 !== 0 && (
                     <div className="hidden md:block" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StepContent({ step, index }: { step: any; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: index % 2 === 0 ? 30 : -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <h3 className="text-xl md:text-2xl font-bold text-[#111827] mb-3">{step.title}</h3>
      <p className="text-[#4B5563] text-sm md:text-base leading-relaxed max-w-sm ml-auto md:ml-0 md:mr-0">
        {step.description}
      </p>
    </motion.div>
  );
}
