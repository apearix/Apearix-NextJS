'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowUpRight, FileStack } from 'lucide-react';

// --- Direct Brand-Accurate Vector SVGs ---
const NextJsIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 180 180" width="20" height="20" fill="none" {...props}>
    <mask id="mask0_next" maskUnits="userSpaceOnUse" x="0" y="0" width="180" height="180" style={{ maskType: 'alpha' }}>
      <circle cx="90" cy="90" r="90" fill="black" />
    </mask>
    <g mask="url(#mask0_next)">
      <circle cx="90" cy="90" r="90" fill="currentColor" />
      <path d="M149.508 157.52L69.142 54H54V125.97H66.1136V69.3836L139.999 164.845C143.333 162.614 146.509 160.165 149.508 157.52Z" fill="white" />
      <rect x="115" y="54" width="12" height="72" fill="white" />
    </g>
  </svg>
);

const ReactIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="-11.5 -10.23174 23 20.46348" width="20" height="20" fill="none" stroke="currentColor" {...props}>
    <circle cx="0" cy="0" r="2.05" fill="currentColor" stroke="none" />
    <g strokeWidth="1">
      <ellipse rx="11" ry="4.2" />
      <ellipse rx="11" ry="4.2" transform="rotate(60)" />
      <ellipse rx="11" ry="4.2" transform="rotate(120)" />
    </g>
  </svg>
);

const TypeScriptIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 128 128" width="20" height="20" fill="currentColor" {...props}>
    <path d="M1.5 0h125c.8 0 1.5.7 1.5 1.5v125c0 .8-.7 1.5-1.5 1.5H1.5c-.8 0-1.5-.7-1.5-1.5V1.5C0 .7.7 0 1.5 0z" fill="#3178C6" />
    <path d="M68.5 86.8c1.7 2.8 4 5 7 6.6s6.5 2.4 10.4 2.4c3.4 0 6.4-.6 9-1.8s4.6-3 6.1-5.3 2.2-5.1 2.2-8.3c0-3.3-.8-6.1-2.4-8.3s-3.8-4.1-6.6-5.5-6.3-2.6-10.4-3.6c-3-.7-5.5-1.5-7.6-2.5s-3.7-2.3-4.8-4-1.7-4-1.7-6.9c0-3.1.9-5.7 2.7-8s4.3-3.9 7.4-5 6.8-1.6 10.9-1.6c4 0 7.6.7 10.8 2s5.8 3.3 7.8 6l-8.4 7.2c-1.3-1.8-3-3.1-5-4s-4.3-1.3-6.8-1.3c-3 0-5.4.6-7.3 1.7s-2.8 2.8-2.8 5.1c0 2 .7 3.6 2.1 4.8s3.4 2.2 6 2.9c2.6.7 5.5 1.5 8.7 2.4 3.7 1 6.9 2.3 9.6 3.9s4.8 3.7 6.2 6.4c1.4 2.7 2.1 6.1 2.1 10.1 0 4.1-1.1 7.6-3.3 10.6s-5.3 5.3-9.2 6.8-8.5 2.3-13.8 2.3c-6 0-11.2-1.2-15.6-3.6s-7.8-5.9-10.1-10.4l9.7-6.7zM43.8 36.4H17.6V26h64.2v10.4H55.6v63.9H43.8V36.4z" fill="#FFF" />
  </svg>
);

const LaravelIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" {...props}>
    <path d="M22.5 5.5l-9.5-5.5-9.5 5.5v11l9.5 5.5 9.5-5.5v-11zm-9.5-3.2l6.7 3.9-2.9 1.7-6.7-3.9 2.9-1.7zm-7.5 4.3l6.7-3.9v3.4l-3.8 2.2v4.8l-2.9-1.7v-4.8zm8.5 12.6l-6.7-3.9 2.9-1.7 6.7 3.9-2.9 1.7zm1-4.8l-6.7-3.9v-3.4l6.7 3.9v3.4zm0-5.6l-6.7-3.9 2.9-1.7 6.7 3.9-2.9 1.7zm6.5 2.1l-2.9 1.7-2.8-1.6v-3.4l5.7-3.3v6.6z" />
  </svg>
);

const PhpIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" {...props}>
    <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm-4.8 13.5H5.4l1.2-6.5h2.5c1.4 0 2.2.6 1.9 2-.3 1.6-1.5 2.5-2.8 2.5H7l-.6 3.1h.8zm6.5 0h-1.8l1.2-6.5h1.8l-.3 1.8h1.2c1.4 0 2.2.6 1.9 2-.3 1.6-1.5 2.5-2.8 2.5h-1.2l-.6 3.1zm4.8-2.6c.3-1.6 1.5-2.5 2.8-2.5h1.2l-.6 3.1h-.8l-.4 2H19l1.1-6.5h2.5c1.4 0 2.2.6 1.9 2-.3 1.5-1.4 2.4-2.7 2.4h-1.4l-.6 3.1h-1.8l.5-2.6zM7.5 10.3l-.4 2.2h.8c.6 0 1.1-.3 1.2-.9.1-.5-.1-.9-.7-.9h-.9zm6.5 0l-.4 2.2h.8c.6 0 1.1-.3 1.2-.9.1-.5-.1-.9-.7-.9h-.9z" />
  </svg>
);

const PostgreSqlIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" {...props}>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.8 14.5c-.8.8-2.2 1.3-3.8 1.3-1.6 0-3-.5-3.8-1.3-.4-.4-.6-.9-.6-1.5 0-1.4 1.2-2.5 2.8-3.1-.4-.5-.7-1.1-.7-1.8 0-1.6 1.3-2.9 3-2.9s3 1.3 3 2.9c0 .7-.3 1.3-.7 1.8 1.6.6 2.8 1.7 2.8 3.1 0 .6-.2 1.1-.6 1.5z" />
  </svg>
);

const MySqlIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" {...props}>
    <path d="M12 3C6.5 3 2 6.5 2 11c0 3.2 2.3 6 5.8 7.2l-.7 2.8 3.4-1.9c.5.1 1 .1 1.5.1 5.5 0 10-3.5 10-8s-4.5-8-10-8zm-2.8 10.7c-.8 0-1.5-.7-1.5-1.5s.7-1.5 1.5-1.5 1.5.7 1.5 1.5-.7 1.5-1.5 1.5zm5.6 0c-.8 0-1.5-.7-1.5-1.5s.7-1.5 1.5-1.5 1.5.7 1.5 1.5-.7 1.5-1.5 1.5z" />
  </svg>
);

const RedisIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" {...props}>
    <path d="M2 7.5L12 2l10 5.5L12 13 2 7.5zm0 4.5l10 5.5 10-5.5V15l-10 5.5L2 15v-3zm0 4.5l10 5.5 10-5.5V19.5L12 25 2 19.5v-3z" />
  </svg>
);

const TailwindCssIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" {...props}>
    <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.336 6.182 14.975 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.336 13.382 8.975 12 6.001 12z" />
  </svg>
);

const AiIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
  </svg>
);

const ChromeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" {...props}>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3.6c2.5 0 4.7 1.4 5.8 3.5H12l-2.6-4.5c.8-.2 1.7-.3 2.6-.3zm-6.8 3c1.5-2.2 4-3.6 6.8-3.6l3 5.2H7.2c-.7-.5-1.4-1-2-1.6zm.4 5.4c0-1.4.4-2.7 1.1-3.8l3.4 5.9-2.4 4.1C5.8 18.5 5.6 16.8 5.6 14zm6.4 6.4c-2.3 0-4.3-1.1-5.5-2.8l2.9-5.1 2.6 4.5V20.4zm5.7-2.3l-3.3-5.7h6.6c.1.5.2 1.1.2 1.6 0 3-1.4 5.6-3.5 7.1zM12 8.5c1.9 0 3.5 1.6 3.5 3.5S13.9 15.5 12 15.5 8.5 13.9 8.5 12 10.1 8.5 12 8.5z" />
  </svg>
);

const DockerIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" {...props}>
    <path d="M13.983 11.078h2.119a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.119a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185m-2.954-5.43h2.118a.186.186 0 00.186-.186V3.574a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185m0 2.716h2.118a.187.187 0 00.186-.186V6.29a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.887c0 .102.082.186.185.186m-2.93 0h2.12a.186.186 0 00.184-.186V6.29a.185.185 0 00-.185-.185H8.1a.185.185 0 00-.185.185v1.887c0 .102.083.186.185.186m-2.964 0h2.119a.186.186 0 00.185-.186V6.29a.185.185 0 00-.185-.185H5.136a.186.186 0 00-.186.185v1.887c0 .102.084.186.186.186m5.893 2.715h2.118a.186.186 0 00.186-.186V9.006a.186.186 0 00-.186-.186h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185m-2.929 0h2.119a.185.185 0 00.185-.186V9.006a.185.185 0 00-.185-.186H8.1a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185m-2.964 0h2.119a.185.185 0 00.185-.186V9.006a.185.185 0 00-.185-.186H5.136a.186.186 0 00-.186.185v1.888c0 .102.084.185.186.185m-2.928 0h2.119a.185.185 0 00.185-.186V9.006a.185.185 0 00-.186-.186h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185M23.77 10.97c-.265-.18-.847-.236-1.428-.19-1.282.102-2.316.924-2.612 1.54-.537-.09-1.242-.142-2.022-.142H1.996c-.347 0-.68.102-.958.29-.327.22-.538.56-.538.947 0 4.148 2.766 8.35 8.163 8.35 6.094 0 9.878-3.414 10.912-7.595.698.058 1.94-.176 2.658-.936.435-.46.732-1.077.537-2.264" />
  </svg>
);

const CloudflareIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" {...props}>
    <path d="M18.244 14.5c.07-.3.1-.62.1-.95 0-2.37-1.92-4.3-4.29-4.3-.96 0-1.85.32-2.57.85C10.744 8.24 8.944 7 6.804 7c-3.11 0-5.63 2.52-5.63 5.63 0 .68.12 1.33.34 1.94-.96.65-1.51 1.74-1.51 2.93 0 1.93 1.57 3.5 3.5 3.5h14.74c2.07 0 3.76-1.68 3.76-3.75 0-1.64-1.06-3.03-2.54-3.54l-.21-.21z" />
  </svg>
);

// --- Complete 13-Tech Stack Configuration ---
const technologies = [
  { name: 'Next.js', category: 'Frontend', Icon: NextJsIcon, color: '#000000' },
  { name: 'React', category: 'UI Library', Icon: ReactIcon, color: '#087EA4' },
  { name: 'TypeScript', category: 'Language', Icon: TypeScriptIcon, color: '#3178C6' },
  { name: 'Laravel', category: 'Backend', Icon: LaravelIcon, color: '#FF2D20' },
  { name: 'PHP', category: 'Backend', Icon: PhpIcon, color: '#777BB4' },
  { name: 'PostgreSQL', category: 'Database', Icon: PostgreSqlIcon, color: '#336791' },
  { name: 'MySQL', category: 'Database', Icon: MySqlIcon, color: '#00758F' },
  { name: 'Redis', category: 'Cache / Queue', Icon: RedisIcon, color: '#DC382D' },
  { name: 'Tailwind CSS', category: 'Styling', Icon: TailwindCssIcon, color: '#06B6D4' },
  { name: 'AI & LLMs', category: 'Intelligence', Icon: AiIcon, color: '#6D28F5' },
  { name: 'Chrome Extensions', category: 'Browser OS', Icon: ChromeIcon, color: '#4285F4' },
  { name: 'Docker', category: 'DevOps', Icon: DockerIcon, color: '#2496ED' },
  { name: 'Cloudflare', category: 'Edge / CDN', Icon: CloudflareIcon, color: '#F38020' },
];

export function ModernTechStack() {
  return (
    <section className="relative overflow-hidden border-y border-[#E5E7EB] bg-white py-10 sm:py-16 lg:py-20">
      {/* Background Soft Glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[450px] w-[750px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#6D28F5]/5 blur-[150px]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 xl:px-0">
        {/* Header */}
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#DDD6FE] bg-[#F4F0FF] px-3.5 py-1.5 text-xs font-semibold   tracking-wider text-[#6D28F5]"
          >
            <FileStack className="h-3.5 w-3.5" />
            <span>Technology & Architecture</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-balance text-3xl font-bold tracking-tight text-[#111827] sm:text-4xl md:text-5xl"
          >
            Built With{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6D28F5] via-[#7B3FE4] to-[#A855F7]">
              Modern Technology.
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 text-base leading-relaxed text-[#6B7280] sm:text-lg"
          >
            We choose proven, maintainable, and type-safe tools to deliver speed, scalability, and long-term architectural stability.
          </motion.p>
        </div>

        {/* Modern Vector-Powered Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-3 sm:gap-4"
        >
          {technologies.map((tech) => {
            const { Icon } = tech;
            return (
              <div
                key={tech.name}
                className="group relative flex items-center gap-2 rounded-2xl border border-[#E5E7EB] bg-[#FAFAFC] px-4 py-3 transition-all duration-300 hover:-translate-y-1 hover:border-[#C4B5FD] hover:bg-white hover:shadow-xl hover:shadow-sm"
              >
                {/* SVG Icon Container with dynamic hover tone */}
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl p-0.5 transition-all duration-300 group-hover:scale-105 group-hover:border-transparent"
                  style={{ color: tech.color }}
                >
                  <Icon className="h-full w-full object-contain" />
                </div>

                {/* Typography */}
                <div className="flex flex-col text-left">
                  <span className="text-sm font-bold text-[#111827] transition-colors group-hover:text-[#6D28F5]">
                    {tech.name}
                  </span>
                  <span className="text-xs font-medium text-[#9CA3AF]">
                    {tech.category}
                  </span>
                </div>
              </div>
            );
          })}
        </motion.div>

        {/* Footer Sub-Banner */}
        <div className="mt-12 flex items-center justify-center gap-2 text-center text-sm text-muted font-medium ">
          <span>Built with Care</span>
          <span className="text-gray-300">•</span>
          <span>Fast & Reliable</span>
          <span className="text-gray-300">•</span>
          <span>Built to Scale</span>
        </div>
      </div>
    </section>
  );
}