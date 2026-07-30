'use client';

import { motion } from 'framer-motion';
import { Brain, Cloud, Database, Cpu, Smartphone, Globe, ShieldCheck, Zap } from 'lucide-react';
import { cn } from '@/utils/cn';

const capabilities = [
  {
    title: "Artificial Intelligence",
    description: "Custom LLMs, computer vision, and predictive analytics integrated into your workflow.",
    icon: Brain,
    className: "md:col-span-2 md:row-span-2 bg-[#F4F0FF]/50 border-[#DDD6FE]",
    color: "text-[#6D28F5]"
  },
  {
    title: "Cloud Infrastructure",
    description: "Scalable, secure cloud architectures built on AWS, Azure, and GCP.",
    icon: Cloud,
    className: "bg-[#FAFAFC]",
    color: "text-[#6D28F5]"
  },
  {
    title: "Enterprise Software",
    description: "Robust internal tools and ERP systems designed for performance.",
    icon: Database,
    className: "bg-[#FAFAFC]",
    color: "text-[#6D28F5]"
  },
  {
    title: "Custom Web Apps",
    description: "High-performance web applications using the latest frameworks.",
    icon: Globe,
    className: "bg-[#FAFAFC]",
    color: "text-[#6D28F5]"
  },
  {
    title: "Mobile Experiences",
    description: "Native and cross-platform mobile apps with buttery smooth UX.",
    icon: Smartphone,
    className: "bg-[#FAFAFC]",
    color: "text-[#6D28F5]"
  },
  {
    title: "Edge Computing",
    description: "Low-latency processing at the edge for real-time applications.",
    icon: Cpu,
    className: "md:col-span-2 bg-[#F6F7FB]",
    color: "text-[#6D28F5]"
  },
  {
    title: "Cybersecurity",
    description: "Enterprise-grade security audits and implementation.",
    icon: ShieldCheck,
    className: "bg-[#FAFAFC]",
    color: "text-[#6D28F5]"
  },
  {
    title: "Automation",
    description: "Streamline operations with intelligent robotic process automation.",
    icon: Zap,
    className: "bg-[#FAFAFC]",
    color: "text-[#6D28F5]"
  }
];

export function Capabilities() {
  return (
    <section id="capabilities" className="py-10 md:py-20 bg-slate-50">
      <div className="container max-w-7xl mx-auto px-6">
        <div className="max-w-3xl mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#111827] mb-6 tracking-tight">
            Comprehensive <br />
            <span className="text-primary">Engineering Capabilities</span>
          </h2>
          <p className="text-lg md:text-xl text-[#4B5563] leading-relaxed">
            From experimental AI research to global-scale infrastructure, we provide the technical firepower to build anything.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {capabilities.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={cn(
                "group relative p-6 md:p-8 rounded-[12px] border border-[#E5E7EB] overflow-hidden hover:border-[#DDD6FE] hover:shadow-md transition-all duration-200",
                item.className
              )}
            >
              <div className={cn("p-3 rounded-[10px] bg-white w-fit mb-6 shadow-sm border border-[#E5E7EB]", item.color)}>
                <item.icon className="w-6 h-6 text-[#6D28F5]" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-[#111827] mb-3">{item.title}</h3>
              <p className="text-[#4B5563] text-sm md:text-base leading-relaxed">{item.description}</p>
              
              {/* Subtle background interaction */}
              <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-5 transition-opacity text-[#6D28F5] pointer-events-none">
                <item.icon className="w-24 h-24" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
