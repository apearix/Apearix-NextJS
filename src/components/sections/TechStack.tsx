'use client';

import { motion } from 'framer-motion';
import { Cpu, Layers, Server, Cloud, Code2, Sparkles } from 'lucide-react';

interface TechItem {
  name: string;
  category: 'Frontend' | 'Backend' | 'AI & Data' | 'Cloud & DevOps';
  description: string;
  svgIcon: string;
}

const techStack: TechItem[] = [
  {
    name: "React",
    category: "Frontend",
    description: "UI Engine",
    svgIcon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg"
  },
  {
    name: "Next.js",
    category: "Frontend",
    description: "Full-Stack Web",
    svgIcon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg"
  },
  {
    name: "TypeScript",
    category: "Frontend",
    description: "Type Safety",
    svgIcon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg"
  },
  {
    name: "Python",
    category: "AI & Data",
    description: "AI Workflows",
    svgIcon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg"
  },
  {
    name: "PyTorch",
    category: "AI & Data",
    description: "Deep Learning",
    svgIcon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg"
  },
  {
    name: "TensorFlow",
    category: "AI & Data",
    description: "ML Architecture",
    svgIcon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg"
  },
  {
    name: "Node.js",
    category: "Backend",
    description: "Async Runtime",
    svgIcon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg"
  },
  {
    name: "Go",
    category: "Backend",
    description: "High Performance",
    svgIcon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg"
  },
  {
    name: "PostgreSQL",
    category: "Backend",
    description: "Relational DB",
    svgIcon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg"
  },
  {
    name: "Docker",
    category: "Cloud & DevOps",
    description: "Containerization",
    svgIcon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg"
  },
  {
    name: "Kubernetes",
    category: "Cloud & DevOps",
    description: "Orchestration",
    svgIcon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg"
  },
  {
    name: "AWS",
    category: "Cloud & DevOps",
    description: "Global Cloud",
    svgIcon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg"
  }
];

const marqueeNames = [
  "React", "Next.js", "TypeScript", "Python", "PyTorch", "TensorFlow",
  "Node.js", "Go", "PostgreSQL", "Docker", "Kubernetes", "AWS",
  "GraphQL", "Redis", "TailwindCSS", "Framer Motion", "Three.js", "GCP"
];

export function TechStack() {
  return (
    <section className="py-20 md:py-28 bg-[#FAF9FF] relative overflow-hidden">
      
      {/* Background Soft Glow Radial Ambient */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-purple-200/25 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="container max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 mb-5 rounded-full bg-[#EDE8FF] text-[#6320EE] text-xs font-semibold tracking-wider uppercase border border-purple-200/50"
          >
            <Code2 className="w-3.5 h-3.5 text-[#6320EE]" />
            <span>Modern Stack</span>
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-5xl md:text-6xl font-bold text-[#0F172A] mb-6 tracking-tight leading-[1.08]"
          >
            Our World-Class <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6320EE] via-[#7B3FE4] to-[#A855F7]">
              Technology Stack.
            </span>
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg md:text-xl text-[#64748B] leading-relaxed font-normal"
          >
            We use the most advanced tools and frameworks to build performance-first, future-proof enterprise software.
          </motion.p>
        </div>

        {/* Minimalist Marquee Ribbon Ticker */}
        <div className="mb-16 relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)] pointer-events-none">
          <motion.div 
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="flex items-center gap-8 whitespace-nowrap w-max"
          >
            {[...marqueeNames, ...marqueeNames].map((tech, i) => (
              <div 
                key={i} 
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-200/70 text-xs sm:text-sm font-semibold text-gray-700 shadow-sm"
              >
                <span className="w-2 h-2 rounded-full bg-[#6320EE]" />
                <span>{tech}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Pro Minimalist Grid Showcase */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-5">
          {techStack.map((tech, index) => (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -6 }}
              className="group relative flex flex-col items-center text-center justify-between p-5 sm:p-6 rounded-2xl bg-white border border-gray-200/80 hover:border-purple-300 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 cursor-pointer"
            >
              {/* Category Indicator Dot */}
              <div className="w-full flex items-center justify-between text-[10px] uppercase font-bold text-gray-400 mb-4">
                <span className="truncate">{tech.category}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-gray-200 group-hover:bg-[#6320EE] transition-colors" />
              </div>

              {/* Icon Container */}
              <div className="w-12 h-12 mb-4 p-2.5 rounded-xl bg-gray-50 group-hover:bg-purple-50 transition-colors flex items-center justify-center">
                <img 
                  src={tech.svgIcon} 
                  alt={tech.name} 
                  className="w-full h-full object-contain filter group-hover:scale-110 transition-transform duration-300"
                />
              </div>

              {/* Text Info */}
              <div>
                <h3 className="text-sm sm:text-base font-bold text-[#0F172A] group-hover:text-[#6320EE] transition-colors">
                  {tech.name}
                </h3>
                <p className="text-[11px] text-[#64748B] mt-0.5">
                  {tech.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}