'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';
import { cn } from '@/utils/cn';

const scenes = [
  {
    title: "Intelligence Engine",
    description: "A centralized platform for managing enterprise AI workflows, from data ingestion to model deployment.",
    color: "bg-[#6D28F5]"
  },
  {
    title: "Global Dashboard",
    description: "Real-time monitoring and analytics for distributed cloud infrastructure across 40+ regions.",
    color: "bg-[#5B21E6]"
  },
  {
    title: "Automation Hub",
    description: "Visually map and execute complex business logic with our low-code robotic process automation tools.",
    color: "bg-[#7C3AED]"
  }
];

interface ShowcaseSlideProps {
  scene: (typeof scenes)[0];
  index: number;
  total: number;
  scrollYProgress: MotionValue<number>;
}

function ShowcaseSlide({ scene, index, total, scrollYProgress }: ShowcaseSlideProps) {
  const start = index / total;
  const end = (index + 1) / total;
  const opacity = useTransform(scrollYProgress, [start, start + 0.1, end - 0.1, end], [0, 1, 1, 0]);

  return (
    <motion.div
      style={{ opacity }}
      className={cn(
        "absolute inset-0 p-6 sm:p-12 flex flex-col justify-center text-white",
        scene.color
      )}
    >
      <div className="max-w-xl">
        <span className="text-xs font-bold tracking-[0.2em] uppercase opacity-75 mb-4 block">Product Showcase</span>
        <h3 className="text-3xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight">{scene.title}</h3>
        <p className="text-base sm:text-xl opacity-90 leading-relaxed max-w-lg">
          {scene.description}
        </p>
      </div>
      
      {/* Abstract Visual Elements */}
      <div className="absolute right-12 top-1/2 -translate-y-1/2 w-1/2 aspect-square bg-white/10 rounded-full blur-3xl" />
      <div className="absolute right-24 top-1/2 -translate-y-1/2 w-1/3 h-1/2 bg-white/5 border border-white/10 rounded-[12px] backdrop-blur-sm" />
    </motion.div>
  );
}

export function Showcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  return (
    <section ref={containerRef} className="relative h-[350vh] bg-[#0F172A] text-white">
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        {/* Device Frame Placeholder */}
        <motion.div 
          style={{
            scale: useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0.85, 1, 1, 0.85]),
            opacity: useTransform(scrollYProgress, [0, 0.05, 0.95, 1], [0, 1, 1, 0]),
          }}
          className="relative w-[92%] max-w-[1280px] aspect-video rounded-[16px] border-4 sm:border-8 border-white/10 bg-[#0F172A] overflow-hidden shadow-2xl shadow-[#6D28F5]/20"
        >
          {scenes.map((scene, index) => (
            <ShowcaseSlide
              key={index}
              scene={scene}
              index={index}
              total={scenes.length}
              scrollYProgress={scrollYProgress}
            />
          ))}
        </motion.div>

        {/* Floating background lights */}
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#6D28F5]/15 rounded-full blur-[150px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#5B21E6]/15 rounded-full blur-[150px]" />
        </div>
      </div>
    </section>
  );
}
