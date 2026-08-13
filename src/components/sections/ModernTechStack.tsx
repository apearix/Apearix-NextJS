'use client';

import { motion } from 'framer-motion';
import { Layers, Server, Sparkles } from 'lucide-react';

const techCategories = [
  {
    icon: Layers,
    title: 'Core Engineering',
    items: ['Next.js', 'React', 'TypeScript', 'Node.js', 'PostgreSQL'],
    delay: 0.1,
  },
  {
    icon: Server,
    title: 'Infrastructure',
    items: ['Docker', 'AWS', 'Cloud Architecture', 'REST APIs', 'CI/CD'],
    delay: 0.2,
  },
  {
    icon: Sparkles,
    title: 'Intelligence',
    items: ['AI Models', 'Automation', 'AI Agents', 'RAG Systems', 'LLMs'],
    delay: 0.3,
  },
];

export function ModernTechStack() {
  return (
    <section className="bg-white py-10 sm:py-16 lg:py-20 overflow-hidden border-y border-[#E5E7EB]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 xl:px-0">
        
        {/* --- Header --- */}
        <div className="mx-auto max-w-3xl text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-5 inline-flex items-center rounded-full border border-[#E5E7EB] bg-[#F6F7FB] px-4 py-1.5 text-[11px] font-bold tracking-widest text-[#6B7280] uppercase"
          >
            Engineering with a Modern Stack
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#111827] mb-6"
          >
            Built with Modern Technology.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg text-[#6B7280] leading-relaxed max-w-2xl mx-auto"
          >
            We use proven technologies and modern engineering practices to build fast, reliable and scalable digital products.
          </motion.p>
        </div>

        {/* --- Categorized Tech Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16">
          {techCategories.map((category) => {
            const Icon = category.icon;

            return (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, delay: category.delay }}
                className="flex flex-col"
              >
                {/* Category Header */}
                <div className="flex items-center gap-3 mb-6 border-b border-[#E5E7EB] pb-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F4F0FF] text-[#6D28F5]">
                    <Icon className="h-4 w-4" />
                  </div>
                  <h3 className="text-lg font-bold text-[#111827]">
                    {category.title}
                  </h3>
                </div>

                {/* Tech Items List */}
                <ul className="flex flex-col gap-3">
                  {category.items.map((item) => (
                    <li 
                      key={item} 
                      className="group flex items-center gap-3 text-[15px] font-medium text-[#4B5563] transition-colors hover:text-[#111827]"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-[#E5E7EB] transition-colors group-hover:bg-[#6D28F5]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}