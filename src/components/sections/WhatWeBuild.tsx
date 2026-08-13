'use client';

import { motion, type Variants } from 'framer-motion';
import { ArrowUpRight, ArrowRight, Blocks } from 'lucide-react';
import Link from 'next/link';

// --- Abstract Engineering Visuals (SVGs) ---
const AIVisual = () => (
    <svg viewBox="0 0 100 100" fill="none" className="w-full h-full stroke-current">
        <circle cx="50" cy="50" r="4" className="fill-[#6D28F5] stroke-none" />
        <circle cx="20" cy="80" r="3" />
        <circle cx="80" cy="80" r="3" />
        <circle cx="50" cy="20" r="3" />
        <path d="M50 46V23 M46 52L22 78 M54 52L78 78" strokeWidth="1.5" strokeDasharray="2 2" className="group-hover:stroke-[#6D28F5] transition-colors duration-500" />
    </svg>
);

const SaaSVisual = () => (
    <svg viewBox="0 0 100 100" fill="none" className="w-full h-full stroke-current">
        <rect x="30" y="20" width="40" height="24" rx="4" strokeWidth="1.5" className="group-hover:stroke-[#6D28F5] transition-colors duration-500" />
        <circle cx="25" cy="75" r="5" />
        <circle cx="50" cy="75" r="5" />
        <circle cx="75" cy="75" r="5" />
        <path d="M50 44V60 M50 60H25V70 M50 60H75V70" strokeWidth="1.5" strokeDasharray="2 2" />
    </svg>
);

const SoftwareVisual = () => (
    <svg viewBox="0 0 100 100" fill="none" className="w-full h-full stroke-current">
        <rect x="15" y="40" width="20" height="20" rx="2" strokeWidth="1.5" />
        <rect x="65" y="20" width="20" height="20" rx="2" strokeWidth="1.5" className="group-hover:stroke-[#6D28F5] transition-colors duration-500" />
        <rect x="65" y="60" width="20" height="20" rx="2" strokeWidth="1.5" className="group-hover:stroke-[#6D28F5] transition-colors duration-500" />
        <path d="M35 50H50V30H65 M50 50V70H65" strokeWidth="1.5" strokeDasharray="2 2" />
    </svg>
);

const AutomationVisual = () => (
    <svg viewBox="0 0 100 100" fill="none" className="w-full h-full stroke-current">
        <circle cx="20" cy="50" r="4" />
        <circle cx="80" cy="50" r="4" className="fill-[#6D28F5] stroke-none" />
        <path d="M24 50H40" strokeWidth="1.5" strokeDasharray="2 2" />
        <rect x="40" y="40" width="20" height="20" rx="2" strokeWidth="1.5" className="group-hover:stroke-[#6D28F5] transition-colors duration-500" />
        <path d="M60 50H76" strokeWidth="1.5" strokeDasharray="2 2" />
    </svg>
);

const DigitalProductsVisual = () => (
    <svg viewBox="0 0 100 100" fill="none" className="w-full h-full stroke-current">
        <rect x="25" y="25" width="50" height="50" rx="6" strokeWidth="1.5" className="group-hover:stroke-[#6D28F5] transition-colors duration-500" />
        <rect x="35" y="35" width="30" height="10" rx="2" strokeWidth="1" />
        <circle cx="40" cy="60" r="3" />
        <circle cx="50" cy="60" r="3" />
        <circle cx="60" cy="60" r="3" />
    </svg>
);

const BrowserVisual = () => (
    <svg viewBox="0 0 100 100" fill="none" className="w-full h-full stroke-current">
        <rect x="20" y="30" width="60" height="40" rx="4" strokeWidth="1.5" />
        <path d="M20 42H80" strokeWidth="1.5" />
        <circle cx="30" cy="36" r="1.5" />
        <circle cx="36" cy="36" r="1.5" className="group-hover:fill-[#6D28F5] transition-colors duration-500" />
        <circle cx="42" cy="36" r="1.5" />
    </svg>
);

// --- Data Configuration ---
const categories = [
    {
        id: '01',
        title: 'AI Engineering',
        description: 'We build intelligent systems that understand context, reason through tasks, and help businesses automate real work.',
        tags: ['AI Agents', 'RAG Systems', 'LLM Applications', 'AI Assistants', 'AI Automation', 'AI Workflows'],
        Visual: AIVisual,
    },
    {
        id: '02',
        title: 'SaaS Development',
        description: 'We engineer scalable SaaS products built for real users, teams, workflows, and recurring growth.',
        tags: ['Multi-tenant SaaS', 'Dashboards', 'Subscriptions', 'Enterprise Platforms', 'User Management', 'Role-based Systems'],
        Visual: SaaSVisual,
    },
    {
        id: '03',
        title: 'Software Engineering',
        description: 'From web applications to backend systems, we engineer reliable software around real business requirements.',
        tags: ['Web Applications', 'Backend Systems', 'APIs', 'Business Platforms', 'Admin Systems', 'Custom Software'],
        Visual: SoftwareVisual,
    },
    {
        id: '04',
        title: 'Automation & Integration',
        description: 'We connect systems, workflows, and intelligent actions to eliminate repetitive work and improve how businesses operate.',
        tags: ['AI Workflows', 'Business Automation', 'API Integrations', 'Workflow Systems', 'Process Automation', 'System Integrations'],
        Visual: AutomationVisual,
    },
    {
        id: '05',
        title: 'Digital Products',
        description: 'We turn ideas into polished digital products designed around real users, business goals, and measurable outcomes.',
        tags: ['Product Development', 'MVP Development', 'Internal Tools', 'Business Platforms', 'Product Prototyping', 'Custom UI/UX'],
        Visual: DigitalProductsVisual,
    },
    {
        id: '06',
        title: 'Developer & Browser Products',
        description: 'We build focused software tools that extend the browser, improve productivity, and solve specialized workflows.',
        tags: ['Browser Extensions', 'Developer Tools', 'Productivity Software', 'Automation Tools', 'Browser-based Products', 'Workflow Utilities'],
        Visual: BrowserVisual,
    },
];

// --- Animation Variants ---
const containerVariants: Variants = {
    hidden: {
        opacity: 0,
    },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};


const cardVariants: Variants = {
    hidden: {
        opacity: 0,
        y: 20,
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: [0.16, 1, 0.3, 1] as const,
        },
    },
};

export function WhatWeBuild() {
    return (
        <section className="bg-[#FAFAFC] py-10 sm:py-16 lg:py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 xl:px-0">
                <div className="gap-6">
                    <div className="max-w-2xl">
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full bg-[#EDE8FF] text-[#6320EE] text-xs font-semibold tracking-wider uppercase"
                        >
                            <Blocks className="w-3.5 h-3.5" />
                            <span>What We Build</span>
                        </motion.div>

                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#0F172A] tracking-tight leading-[1.08]"
                        >
                            From Ideas to<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6320EE] via-[#7B3FE4] to-[#A855F7]">
                                Intelligent Products.
                            </span>
                        </motion.h2>
                    </div>
                    <motion.p
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="mt-6 max-w-2xl text-base leading-relaxed text-[#6B7280] sm:text-lg"
                    >
                        From first architecture to production and scale, we engineer digital products designed to solve real business problems.
                    </motion.p>
                </div>



                {/* --- Editorial Grid --- */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                    className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3 xl:grid-cols-3 xl:gap-6"
                >
                    {categories.map((category) => {
                        const { id, title, description, tags, Visual } = category;

                        return (
                            <motion.div
                                key={id}
                                variants={cardVariants}
                                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-gray-200 bg-white p-8 transition-all duration-300 hover:-translate-y-1 hover:border-[#6D28F5]/30 hover:shadow-xl hover:shadow-[#6D28F5]/5 sm:p-10"
                            >
                                {/* Abstract Visual Watermark */}
                                <div className="absolute -bottom-8 -right-8 h-48 w-48 text-gray-100 transition-colors duration-500 group-hover:text-purple-50/50 pointer-events-none">
                                    <Visual />
                                </div>

                                <div className="relative z-10">
                                    <div className="mb-6 flex items-center justify-between">
                                        <span className="text-sm font-semibold tracking-wider text-[#6D28F5]">
                                            {id}
                                        </span>
                                        <ArrowUpRight className="h-5 w-5 text-gray-300 transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-[#6D28F5]" />
                                    </div>

                                    <h3 className="mb-4 text-xl font-bold text-[#111827] sm:text-2xl">
                                        {title}
                                    </h3>

                                    <p className="mb-8 max-w-sm text-sm leading-relaxed text-[#6B7280] sm:text-base">
                                        {description}
                                    </p>
                                </div>

                                {/* Capability Tags */}
                                <div className="relative z-10 flex flex-wrap gap-x-4 gap-y-2">
                                    {tags.map((tag) => (
                                        <span key={tag} className="text-xs font-medium text-[#4B5563] sm:text-sm">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>

                {/* --- Bottom CTA --- */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="mt-10 flex flex-col items-center justify-center text-center sm:mt-16"
                >
                    <p className="mb-4 text-sm font-medium text-[#6B7280]">
                        Have an idea worth building?
                    </p>
                    <Link
                        href="/contact"
                        className="group flex h-12 items-center gap-2 rounded-full bg-[#111827] px-8 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#6D28F5] hover:shadow-[0_8px_24px_rgba(109,40,245,0.25)] active:scale-[0.98]"
                    >
                        Build with Apearix
                        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                </motion.div>

            </div>

        </section>
    );
}