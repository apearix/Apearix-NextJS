'use client';

import { motion, type Variants } from 'framer-motion';
import { ArrowRight, Sparkles, Layers, Globe, Code2, Cpu, ShoppingBag, Server } from 'lucide-react';
import Link from 'next/link';

// --- Data Configuration ---
const services = [
    {
        id: '01',
        title: 'Website & SEO',
        description: 'High-performance web experiences engineered for speed, conversion, and top-tier search engine dominance.',
        icon: Globe,
        tags: ['Next.js Performance', 'Core Web Vitals', 'Technical SEO', 'Conversion Architecture'],
    },
    {
        id: '02',
        title: 'Custom Software',
        description: 'Bespoke web applications and backend systems built precisely around complex business workflows and operations.',
        icon: Code2,
        tags: ['Full-Stack Apps', 'Scalable APIs', 'Database Architecture', 'Enterprise Systems'],
    },
    {
        id: '03',
        title: 'Chrome Extensions',
        description: 'Specialized browser tools and productivity extensions that extend functionality and automate browser workflows.',
        icon: Layers,
        tags: ['Manifest V3', 'Browser Automation', 'Productivity Tools', 'Custom UI Popups'],
    },
    {
        id: '04',
        title: 'AI & Automation',
        description: 'Intelligent systems, LLM integrations, and automated pipelines designed to eliminate repetitive manual work.',
        icon: Cpu,
        tags: ['AI Agents & RAG', 'Workflow Automation', 'OpenAI & Claude APIs', 'Smart Assistants'],
    },
    {
        id: '05',
        title: 'E-commerce',
        description: 'Blazing-fast digital storefronts and robust checkout solutions optimized for maximum user conversion and revenue.',
        icon: ShoppingBag,
        tags: ['Headless Commerce', 'Stripe & PayPal', 'Inventory Systems', 'Secure Checkouts'],
    },
    {
        id: '06',
        title: 'Cloud & Maintenance',
        description: 'Zero-downtime deployment, infrastructure monitoring, security updates, and ongoing technical scaling.',
        icon: Server,
        tags: ['Cloud Infrastructure', '24/7 Monitoring', 'Security Hardening', 'Performance Scaling'],
    },
];

// --- Animation Variants ---
const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const cardVariants: Variants = {
    hidden: { opacity: 0, y: 24 },
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
        <section className="bg-surface py-10 sm:py-16 lg:py-20">
            {/* Subtle background glow effect */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-glow rounded-full blur-[140px] pointer-events-none" />

            <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 xl:px-0">

                {/* --- Section Header --- */}
                <div className="ustify-between mb-8 gap-6">
                    <div className="max-w-4xl">
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="inline-flex items-center gap-2 px-3.5 py-1.5 mb-5 rounded-full bg-primary-light text-primary text-xs font-semibold tracking-wider uppercase border border-border-accent/40"
                        >
                            <span>What We Do - Services</span>
                        </motion.div>

                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-heading tracking-tight leading-[1.08]"
                        >
                            Technology That Solves <br className="hidden sm:inline" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-[#7B3FE4] to-accent-purple">
                                Real Business Problems.
                            </span>
                        </motion.h2>
                    </div>

                    <motion.p
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="max-w-5xl text-base leading-relaxed text-body sm:text-lg"
                    >
                        From first line of clean architecture to production scale, we craft dependable digital solutions built around your exact goals.
                    </motion.p>
                </div>

                {/* --- Services Grid --- */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                    className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
                >
                    {services.map((service) => {
                        const { id, title, description, icon: Icon, tags } = service;

                        return (
                            <motion.div
                                key={id}
                                variants={cardVariants}
                                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-white p-6 transition-all duration-500 hover:-translate-y-1.5 hover:border-border-accent hover:shadow-2xl hover:shadow-glow"
                            >
                                {/* Top metadata & Icon */}
                                <span className="absolute right-8 top-8 text-7xl font-bold  text-muted/10 group-hover:text-primary/20 transition-colors">
                                    {id}
                                </span>
                                <div>
                                    <div className="mb-3 flex items-center justify-between">
                                        <div className="w-12 h-12 rounded-2xl bg-surface border border-border flex items-center justify-center text-primary transition-all duration-500 group-hover:bg-primary group-hover:text-white">
                                            <Icon className="w-5 h-5" />
                                        </div>
                                    </div>

                                    <h3 className="mb-2 text-2xl font-bold tracking-tight text-primary">
                                        {title}
                                    </h3>

                                    <p className="mb-3 text-sm leading-relaxed text-body sm:text-base">
                                        {description}
                                    </p>
                                </div>

                                {/* Capability Tags & Action Link */}
                                <div>
                                    <div className="mb-3 flex flex-wrap gap-2 pt-4 border-t border-border-subtle">
                                        {tags.map((tag) => (
                                            <span key={tag}
                                                className="inline-flex items-center px-2.5 py-1 rounded-md bg-surface border border-border text-sm font-medium text-body transition-colors group-hover:border-border-accent/60">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    <Link href="/contact" className="inline-flex items-center gap-2 text-sm font-semibold text-heading transition-colors group-hover:text-primary">
                                        <span>Explore Service</span>
                                        <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                                    </Link>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>

                {/* --- Bottom CTA Bar --- */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-6 rounded-2xl bg-white border border-border p-6 sm:px-8"
                >
                    <div>
                        <h4 className="text-xl font-bold text-heading tracking-tight mb-1">
                            Need a custom software solution tailored to your stack?
                        </h4>
                        <p className="text-sm text-body">
                            Let's discuss your requirements and engineer something extraordinary together.
                        </p>
                    </div>

                    <Link
                        href="/contact"
                        className="group flex py-2.5 shrink-0 items-center gap-2 rounded-full bg-heading px-8 text-sm font-semibold text-white transition-all duration-300 hover:bg-primary active:scale-[0.98]"
                    >
                        <span>Start a Conversation</span>
                        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                </motion.div>

            </div>
        </section>
    );
}