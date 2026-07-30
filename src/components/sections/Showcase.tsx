'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';
import Image from 'next/image';
import { cn } from '@/utils/cn';
import { Sparkles, Globe, Cpu, ArrowUpRight } from 'lucide-react';

const scenes = [
  {
    title: "Intelligence Engine",
    description: "A centralized platform for managing enterprise AI workflows, from data ingestion to automated model deployment.",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
    badge: "AI Orchestration",
    stat: "99.9% Model Accuracy",
    icon: Cpu,
    color: "from-[#6320EE] to-[#4318FF]"
  },
  {
    title: "Global Dashboard",
    description: "Real-time monitoring and advanced analytics for distributed cloud infrastructure across 40+ global regions.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
    badge: "Cloud Infrastructure",
    stat: "40+ Latency Nodes",
    icon: Globe,
    color: "from-[#5B21E6] to-[#3B0764]"
  },
  {
    title: "Automation Hub",
    description: "Visually map and execute complex business logic with our low-code robotic process automation tools.",
    image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80",
    badge: "Low-Code RPA",
    stat: "10x Deployment Speed",
    icon: Sparkles,
    color: "from-[#7C3AED] to-[#6320EE]"
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
  const opacity = useTransform(scrollYProgress, [start, start + 0.08, end - 0.08, end], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [start, start + 0.1, end - 0.1, end], [0.95, 1, 1, 0.95]);

  const Icon = scene.icon;

  return (
    <motion.div
      style={{ opacity, scale }}
      className={cn(
        "absolute inset-0 p-6 sm:p-10 lg:p-16 flex flex-col lg:flex-row items-center justify-between gap-8 sm:gap-12 text-white bg-gradient-to-br",
        scene.color
      )}
    >
      {/* Left Content Column */}
      <div className="max-w-xl text-left z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 mb-6 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-semibold tracking-wider uppercase">
          <Icon className="w-3.5 h-3.5 text-purple-200" />
          <span>{scene.badge}</span>
        </div>

        <h3 className="text-3xl sm:text-5xl md:text-6xl font-bold mb-6 leading-[1.08] tracking-tight">
          {scene.title}
        </h3>

        <p className="text-base sm:text-lg md:text-xl text-white/80 leading-relaxed font-normal mb-8">
          {scene.description}
        </p>

        {/* Live Stat Tag */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-black/20 backdrop-blur-sm border border-white/10 text-xs sm:text-sm font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>{scene.stat}</span>
        </div>
      </div>

      {/* Right Column: High-Res Glassmorphic Image Frame */}
      <div className="relative w-full lg:w-[50%] aspect-[16/10] rounded-2xl overflow-hidden border border-white/20 shadow-2xl shadow-black/40 group">
        
        {/* Unsplash Image */}
        <Image
          src={scene.image}
          alt={scene.title}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
          priority
        />

        {/* Subtle Dark Glass Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

        {/* Floating Top Glass Overlay Chip */}
        <div className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/40 backdrop-blur-md border border-white/15 text-[11px] font-medium text-white/90">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
          Live Interface Preview
        </div>

        {/* Hover External Link Icon */}
        <div className="absolute bottom-4 right-4 z-20 p-2.5 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 text-white group-hover:bg-white group-hover:text-black transition-all">
          <ArrowUpRight className="w-4 h-4" />
        </div>
      </div>

      {/* Background Soft Glows */}
      <div className="absolute right-12 top-1/2 -translate-y-1/2 w-1/2 aspect-square bg-white/10 rounded-full blur-3xl pointer-events-none" />
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
        
        {/* Device Frame Display Container */}
        <motion.div 
          style={{
            scale: useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0.85, 1, 1, 0.85]),
            opacity: useTransform(scrollYProgress, [0, 0.05, 0.95, 1], [0, 1, 1, 0]),
          }}
          className="relative w-[92%] max-w-[1280px] aspect-video sm:aspect-[16/9] rounded-2xl border-4 sm:border-8 border-white/10 bg-[#0F172A] overflow-hidden shadow-2xl shadow-[#6320EE]/20"
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

        {/* Ambient Lights */}
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#6320EE]/20 rounded-full blur-[160px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#7B3FE4]/20 rounded-full blur-[160px]" />
        </div>
      </div>
    </section>
  );
}