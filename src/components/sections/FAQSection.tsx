'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, MessageCircleQuestion, ArrowRight, FileStack } from 'lucide-react';
import Link from 'next/link';
import { FAQAccordion, type FAQItem } from './FAQAccordion';

const faqs: FAQItem[] = [
    {
        q: 'What services does Apearix provide?',
        a: 'We engineer end-to-end digital solutions across Website & SEO development, Custom Software & Web Applications, Chrome Extensions & Browser OS tools, AI & Workflow Automation, E-commerce, and Cloud Infrastructure.',
    },
    {
        q: 'How much does a website cost?',
        a: 'Every project is scoped individually based on complexity, architectural depth, and custom requirements. We prioritize high ROI and provide transparent milestone estimates before writing a single line of code.',
    },
    {
        q: 'Do you work with startups and small businesses?',
        a: 'Yes. We partner with ambitious founders, growing businesses, and established enterprises. Whether launching a lean MVP or scaling an enterprise platform, we adapt our engineering process to your stage.',
    },
    {
        q: 'Can you deploy on our own server?',
        a: 'Absolutely. We configure and deploy to your preferred infrastructure—including AWS, DigitalOcean, Hetzner, VPS, Cloudflare, or dedicated bare-metal servers—with automated CI/CD pipelines and security hardening.',
    },
    {
        q: 'Do you provide ongoing maintenance?',
        a: 'Yes. Launch is only the beginning. We provide long-term maintenance, uptime monitoring, security patching, performance optimization, and continuous feature development as your product evolves.',
    },
    {
        q: 'Can you integrate AI into an existing application?',
        a: 'Yes. We build custom RAG pipelines, autonomous agent workflows, and LLM integrations into existing software architectures and databases without requiring a complete rebuild.',
    },
    {
        q: 'Do you develop Chrome Extensions?',
        a: 'Yes. We architect production-ready Manifest V3 extensions, browser workflow automations, and productivity tools with secure storage, cross-browser support, and Web Store compliance.',
    },
    {
        q: 'How long does a project take?',
        a: 'Timelines vary by scope. Focused websites and Chrome extensions typically take 2 to 4 weeks, while complex full-stack web applications and custom AI systems range from 6 to 12 weeks delivered in agile milestone sprints.',
    },
];

export function FAQSection() {
    // Structured Data Schema for Google Rich Snippets
    const faqSchema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.q,
            acceptedAnswer: {
                '@type': 'Answer',
                text: faq.a,
            },
        })),
    };

    return (
        <section id="faq" className="relative overflow-hidden bg-white py-10 sm:py-16 lg:py-20">
            {/* Inject Structured Data for SEO */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />

            {/* Ambient background glow */}
            <div className="pointer-events-none absolute left-1/2 top-1/3 -z-10 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-[#6D28F5]/5 blur-[150px]" />

            <div className="mx-auto max-w-7xl px-4 sm:px-6 xl:px-0">
                <div className="mx-auto mb-12 max-w-3xl text-center">
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#DDD6FE] bg-[#F4F0FF] px-3.5 py-1.5 text-xs font-semibold   tracking-wider text-[#6D28F5]"
                    >
                        <Sparkles className="h-3.5 w-3.5" />
                        <span>Got Questions?</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-balance text-3xl font-bold tracking-tight text-[#111827] sm:text-4xl md:text-5xl"
                    >
                        Frequently Asked{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6D28F5] via-[#7B3FE4] to-[#A855F7]">
                            Questions.
                        </span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="mt-4 text-base leading-relaxed text-[#6B7280] sm:text-lg"
                    >
                        Clear answers about how we collaborate, build, deploy, and scale digital products.
                    </motion.p>
                </div>
            </div>

            {/* Accordion Component */}
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.25 }}
            >
                <FAQAccordion faqs={faqs} />
            </motion.div> 
                 
        </section >
    );
}