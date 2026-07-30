'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { Users, Globe, Zap, Award } from 'lucide-react';

const stats = [
  { label: "Active Users", value: 2.5, suffix: "M+", icon: Users },
  { label: "Global Regions", value: 42, suffix: "", icon: Globe },
  { label: "Uptime SLA", value: 99.99, suffix: "%", icon: Zap },
  { label: "Awards Won", value: 15, suffix: "+", icon: Award },
];

export function Metrics() {
  return (
    <section className="py-24 md:py-32 bg-[#FAFAFC] border-y border-[#E5E7EB]">
      <div className="container max-w-[1280px] mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, index) => (
            <StatItem key={index} {...stat} />
          ))}
        </div>
      </div>
    </section>
  );
}

function StatItem({ label, value, suffix, icon: Icon }: any) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = value;
      const duration = 2000;
      const increment = end / (duration / 16);
      
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(start);
        }
      }, 16);
      
      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return (
    <div ref={ref} className="flex flex-col items-center text-center">
      <div className="p-3.5 bg-white rounded-[12px] shadow-sm mb-5 border border-[#E5E7EB]">
        <Icon className="w-6 h-6 text-[#6D28F5]" />
      </div>
      <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#111827] mb-2 tracking-tight">
        {count.toLocaleString(undefined, { minimumFractionDigits: value % 1 === 0 ? 0 : 2, maximumFractionDigits: 2 })}
        {suffix}
      </div>
      <div className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-[#6B7280]">
        {label}
      </div>
    </div>
  );
}
