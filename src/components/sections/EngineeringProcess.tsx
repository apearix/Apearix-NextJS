'use client';

import { motion } from 'framer-motion';

// --- Content Data ---
const capabilities = [
  {
    title: 'Web Applications',
    description: 'Fast, responsive applications built for real users and real business workflows.',
  },
  {
    title: 'SaaS Platforms',
    description: 'Scalable multi-tenant products with authentication, billing, dashboards and integrations.',
  },
  {
    title: 'Enterprise Systems',
    description: 'Secure internal platforms and business systems designed around complex workflows.',
  },
  {
    title: 'APIs & Services',
    description: 'Reliable APIs and backend services that connect products, data and third-party systems.',
  },
  {
    title: 'Dashboards & Analytics',
    description: 'Operational dashboards that turn business data into useful decisions.',
  },
  {
    title: 'Internal Tools',
    description: 'Purpose-built software that eliminates repetitive work and improves team productivity.',
  },
];

const architectureLayers = [
  'Frontend',
  'Application Layer',
  'APIs & Services',
  'Data & Infrastructure',
  'AI & Automation',
  'Cloud Infrastructure',
];

export function EngineeringProcess() {
  return (
    <section id="engineering" className="bg-white py-10 sm:py-16 lg:py-20 overflow-hidden">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 xl:px-0">
        
        {/* --- Header Section --- */}
        <div className="mx-auto max-w-3xl text-center mb-16 md:mb-24">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-5 inline-flex items-center rounded-full border border-[#E5E7EB] bg-[#F6F7FB] px-4 py-1.5 text-[11px] font-bold tracking-widest text-[#6B7280] uppercase"
          >
            Software Engineering
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-3xl sm:text-5xl lg:text-6xl font-bold text-[#111827] tracking-tight leading-[1.1] mb-6"
          >
            Engineering the Systems <br className="hidden sm:block" />
            Behind Modern Businesses.
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-base sm:text-lg text-[#6B7280] leading-relaxed"
          >
            We design and build reliable software systems—from high-performance web applications and SaaS platforms to APIs, intelligent automation, and cloud infrastructure.
          </motion.p>
        </div>

        {/* --- Central Architecture Visual --- */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1 }}
          className="relative mx-auto max-w-2xl mb-24"
        >
          {/* SVG Architecture Diagram */}
          <div className="relative w-full h-[500px] flex items-center justify-center">
            
            <svg viewBox="0 0 400 500" className="absolute inset-0 w-full h-full overflow-visible">
              
              {/* Background Dashed Main Line */}
              <line x1="200" y1="30" x2="200" y2="470" stroke="#E5E7EB" strokeWidth="2" strokeDasharray="4 4" />
              
              {/* Animated Purple Signal Line */}
              <motion.line 
                x1="200" y1="30" x2="200" y2="470" 
                stroke="#6D28F5" strokeWidth="2"
                strokeDasharray="100 500"
                animate={{ strokeDashoffset: [500, -100] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              />

              {architectureLayers.map((layer, index) => {
                const yPos = 40 + index * 84;
                return (
                  <g key={layer}>
                    {/* Connection Dots */}
                    <circle cx="200" cy={yPos} r="4" fill="#white" stroke="#E5E7EB" strokeWidth="2" />
                    
                    {/* Glowing active dot effect synced with position */}
                    <motion.circle 
                      cx="200" cy={yPos} r="4" fill="#6D28F5"
                      animate={{ scale: [1, 1.5, 1], opacity: [0, 1, 0] }}
                      transition={{ duration: 4, repeat: Infinity, delay: index * 0.65, ease: "easeInOut" }}
                    />
                    
                    {/* Node Boxes */}
                    <rect 
                      x="100" y={yPos - 18} width="200" height="36" rx="18" 
                      fill="#F6F7FB" stroke="#E5E7EB" strokeWidth="1"
                    />
                    <text 
                      x="200" y={yPos + 4} 
                      fill="#111827" fontSize="12" fontWeight="600" textAnchor="middle" letterSpacing="0.02em"
                    >
                      {layer}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
          
          <div className="mt-8 text-center text-sm font-semibold tracking-wide text-[#6D28F5]">
            "We don't just build interfaces. We engineer the systems underneath them."
          </div>
        </motion.div>

        {/* --- Capabilities Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {capabilities.map((cap, index) => (
            <motion.div
              key={cap.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.5, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="group flex flex-col rounded-2xl border border-[#E5E7EB] bg-white p-8 transition-colors duration-300 hover:bg-[#F6F7FB] hover:border-[#D1D5DB]"
            >
              <h3 className="mb-3 text-lg font-bold text-[#111827] group-hover:text-[#6D28F5] transition-colors duration-300">
                {cap.title}
              </h3>
              <p className="text-sm leading-relaxed text-[#6B7280]">
                {cap.description}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}