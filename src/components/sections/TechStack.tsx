'use client';

import { motion } from 'framer-motion';

const techs = [
  "React", "Next.js", "TypeScript", "Node.js", "Python", "PyTorch",
  "TensorFlow", "AWS", "GCP", "Kubernetes", "Docker", "PostgreSQL",
  "Redis", "GraphQL", "TailwindCSS", "Framer Motion", "Three.js", "Go"
];

export function TechStack() {
  return (
    <section className="py-24 md:py-32 bg-white overflow-hidden">
      <div className="container max-w-[1280px] mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#111827] mb-6 tracking-tight">
            Our World-Class <br />
            <span className="text-[#6B7280]">Technology Stack</span>
          </h2>
          <p className="text-lg md:text-xl text-[#4B5563] leading-relaxed">
            We use the most advanced tools and frameworks to build performance-first, future-proof applications.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 md:gap-6">
          {techs.map((tech, index) => (
            <motion.div
              key={tech}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.04 }}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              className="flex items-center justify-center p-6 rounded-[12px] bg-[#FAFAFC] border border-[#E5E7EB] group hover:border-[#DDD6FE] hover:shadow-sm transition-all"
            >
              <span className="text-sm font-bold text-[#4B5563] group-hover:text-[#111827] transition-colors">
                {tech}
              </span>
            </motion.div>
          ))}
        </div>
        
        {/* Abstract connection lines background */}
        <div className="absolute left-0 right-0 h-[500px] -z-10 opacity-20 pointer-events-none">
           <svg className="w-full h-full">
              <defs>
                <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#7C3AED" stopOpacity="0" />
                  <stop offset="50%" stopColor="#7C3AED" stopOpacity="1" />
                  <stop offset="100%" stopColor="#7C3AED" stopOpacity="0" />
                </linearGradient>
              </defs>
              <motion.path
                d="M-100 250 Q 500 50 1100 250 T 2300 250"
                stroke="url(#line-gradient)"
                strokeWidth="2"
                fill="none"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
              />
           </svg>
        </div>
      </div>
    </section>
  );
}
