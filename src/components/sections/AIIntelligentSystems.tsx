'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Bot } from 'lucide-react';
import Link from 'next/link';

// --- Abstract System Visuals for Cards (SVG) ---
const AgentVisual = () => (
    <svg viewBox="0 0 200 100" className="w-full h-full stroke-current">
        {/* Lines */}
        <path d="M100 20 L100 40" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" />
        <path d="M100 60 L60 80 M100 60 L100 80 M100 60 L140 80" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" />

        {/* Animated Signal */}
        <motion.circle cx="100" cy="20" r="2" fill="#A855F7" animate={{ cy: [20, 40, 60, 80], cx: [100, 100, 100, 140], opacity: [0, 1, 1, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }} />
        <motion.circle cx="100" cy="20" r="2" fill="#A855F7" animate={{ cy: [20, 40, 60, 80], cx: [100, 100, 100, 60], opacity: [0, 1, 1, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: 1 }} />

        {/* Nodes */}
        <rect x="75" y="5" width="50" height="15" rx="2" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.2)" />
        <text x="100" y="14" fill="#A855F7" fontSize="6" fontWeight="bold" textAnchor="middle" letterSpacing="0.05em">AGENT</text>

        <rect x="80" y="40" width="40" height="20" rx="4" fill="rgba(109,40,245,0.2)" stroke="#6D28F5" />
        <text x="100" y="52" fill="white" fontSize="6" fontWeight="bold" textAnchor="middle">CORE</text>

        <circle cx="60" cy="80" r="4" fill="rgba(255,255,255,0.1)" />
        <circle cx="100" cy="80" r="4" fill="rgba(255,255,255,0.1)" />
        <circle cx="140" cy="80" r="4" fill="rgba(255,255,255,0.1)" />

        <text x="60" y="92" fill="rgba(255,255,255,0.4)" fontSize="5" textAnchor="middle">TOOL</text>
        <text x="100" y="92" fill="rgba(255,255,255,0.4)" fontSize="5" textAnchor="middle">DATA</text>
        <text x="140" y="92" fill="rgba(255,255,255,0.4)" fontSize="5" textAnchor="middle">ACTION</text>
    </svg>
);

const RAGVisual = () => (
    <svg viewBox="0 0 200 100" className="w-full h-full stroke-current">
        {/* Lines */}
        <path d="M50 30 L100 50 M150 30 L100 50 M100 65 L100 85" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" />

        {/* Animated Signal */}
        <motion.circle r="2" fill="#A855F7" animate={{ cx: [50, 100, 100], cy: [30, 50, 85], opacity: [0, 1, 0] }} transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }} />
        <motion.circle r="2" fill="#A855F7" animate={{ cx: [150, 100, 100], cy: [30, 50, 85], opacity: [0, 1, 0] }} transition={{ duration: 2.5, repeat: Infinity, ease: "linear", delay: 1.25 }} />

        {/* Nodes */}
        <rect x="35" y="15" width="30" height="15" rx="2" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.2)" />
        <text x="50" y="24" fill="rgba(255,255,255,0.6)" fontSize="5" textAnchor="middle">DOCS</text>

        <rect x="135" y="15" width="30" height="15" rx="2" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.2)" />
        <text x="150" y="24" fill="rgba(255,255,255,0.6)" fontSize="5" textAnchor="middle">DATA</text>

        <rect x="75" y="45" width="50" height="20" rx="4" fill="rgba(109,40,245,0.2)" stroke="#6D28F5" />
        <text x="100" y="57" fill="white" fontSize="6" fontWeight="bold" textAnchor="middle">RETRIEVAL</text>

        <rect x="85" y="80" width="30" height="10" rx="2" fill="rgba(255,255,255,0.1)" />
        <text x="100" y="87" fill="#A855F7" fontSize="5" fontWeight="bold" textAnchor="middle">ANSWER</text>
    </svg>
);

const AutomationVisual = () => (
    <svg viewBox="0 0 200 100" className="w-full h-full stroke-current">
        {/* Lines */}
        <path d="M30 50 L170 50" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" />

        {/* Animated Signal */}
        <motion.rect x="30" y="49" width="10" height="2" fill="#A855F7" animate={{ x: [30, 80, 130, 170], opacity: [0, 1, 1, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }} />

        {/* Nodes */}
        <circle cx="30" cy="50" r="5" fill="rgba(255,255,255,0.2)" />
        <text x="30" y="65" fill="rgba(255,255,255,0.4)" fontSize="5" textAnchor="middle">TRIGGER</text>

        <rect x="70" y="40" width="20" height="20" rx="4" fill="rgba(109,40,245,0.2)" stroke="#6D28F5" />
        <text x="80" y="52" fill="white" fontSize="5" fontWeight="bold" textAnchor="middle">DECIDE</text>

        <rect x="120" y="40" width="20" height="20" rx="4" fill="rgba(109,40,245,0.2)" stroke="#6D28F5" />
        <text x="130" y="52" fill="white" fontSize="5" fontWeight="bold" textAnchor="middle">ACT</text>

        <circle cx="170" cy="50" r="5" fill="rgba(255,255,255,0.2)" />
        <text x="170" y="65" fill="#A855F7" fontSize="5" fontWeight="bold" textAnchor="middle">RESULT</text>
    </svg>
);

const AssistantVisual = () => (
    <svg viewBox="0 0 200 100" className="w-full h-full stroke-current">
        {/* Lines */}
        <path d="M100 20 L100 45" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" />
        <path d="M100 65 L60 85 M100 65 L140 85" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" />

        {/* Animated Signal */}
        <motion.circle r="2" fill="#A855F7" animate={{ cx: [100, 100, 60], cy: [20, 55, 85], opacity: [0, 1, 0] }} transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }} />
        <motion.circle r="2" fill="#A855F7" animate={{ cx: [100, 100, 140], cy: [20, 55, 85], opacity: [0, 1, 0] }} transition={{ duration: 2.5, repeat: Infinity, ease: "linear", delay: 1 }} />

        {/* Nodes */}
        <circle cx="100" cy="15" r="5" fill="rgba(255,255,255,0.2)" />
        <text x="100" y="28" fill="rgba(255,255,255,0.4)" fontSize="5" textAnchor="middle">USER</text>

        <rect x="75" y="45" width="50" height="20" rx="10" fill="rgba(109,40,245,0.2)" stroke="#6D28F5" />
        <text x="100" y="57" fill="white" fontSize="6" fontWeight="bold" textAnchor="middle">ASSISTANT</text>

        <rect x="40" y="85" width="40" height="10" rx="2" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.2)" />
        <text x="60" y="92" fill="#A855F7" fontSize="5" textAnchor="middle">CONTEXT</text>

        <rect x="120" y="85" width="40" height="10" rx="2" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.2)" />
        <text x="140" y="92" fill="#A855F7" fontSize="5" textAnchor="middle">ACTION</text>
    </svg>
);

// --- Content Setup ---
const aiCapabilities = [
    {
        id: '01',
        title: 'AI Agents',
        description: 'Systems that can reason, use tools, and execute multi-step tasks with minimal human intervention.',
        tags: ['Reasoning', 'Tool Use', 'Task Execution', 'Multi-step Workflows'],
        Visual: AgentVisual,
    },
    {
        id: '02',
        title: 'RAG & Knowledge Systems',
        description: 'Turn your business knowledge into intelligent, context-aware answers and experiences.',
        tags: ['Knowledge Retrieval', 'Semantic Search', 'Document Intelligence', 'Context-aware AI'],
        Visual: RAGVisual,
    },
    {
        id: '03',
        title: 'AI Automation',
        description: 'Automate repetitive workflows with intelligent systems that understand inputs, make decisions, and take action.',
        tags: ['Workflow Automation', 'Decision Systems', 'API Actions', 'Business Processes'],
        Visual: AutomationVisual,
    },
    {
        id: '04',
        title: 'AI Assistants',
        description: 'Context-aware assistants designed around your business, your users, and the work that matters.',
        tags: ['Business Assistants', 'Conversational AI', 'Context', 'Task Support'],
        Visual: AssistantVisual,
    },
];

const pipelineSteps = ['Context', 'Reasoning', 'Decision', 'Action', 'Outcome'];

export function AIIntelligentSystems() {
    return (
        <section className="relative w-full bg-[#0F172A]  py-10 sm:py-16 lg:py-20 overflow-hidden">

            {/* Deep Purple Ambient Glows */}
            <div className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle_at_top_left,rgba(109,40,245,0.12)_0%,transparent_60%)] blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[800px] h-[800px] rounded-full bg-[radial-gradient(circle_at_bottom_right,rgba(109,40,245,0.08)_0%,transparent_60%)] blur-3xl pointer-events-none" />

            <div className="container relative z-10 mx-auto max-w-7xl px-4 sm:px-6 xl:px-0">

                {/* --- Header Section (Left Aligned) --- */}
                <div className="max-w-3xl mb-16 lg:mb-24">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="gap-2 px-3 py-1 mb-4 inline-flex items-center rounded-full border border-[#6D28F5]/20 bg-[#6D28F5]/10 px-3.5 py-1.5 text-[11px] sm:text-xs font-semibold tracking-wider uppercase text-[#A855F7]"
                    ><Bot className="w-3.5 h-3.5" />
                        AI & Intelligent Systems
                    </motion.div>
                   


                    <motion.h2
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1, duration: 0.6 }}
                        className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.1]"
                    >
                        Intelligence, Built <br className="hidden sm:block" />
                        Into Your Software.
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        className="mt-6 text-base sm:text-lg text-white/65 leading-relaxed max-w-2xl"
                    >
                        We integrate AI into real products—not as a gimmick, but as an intelligent layer that can understand, reason, automate, and act.
                    </motion.p>
                </div>

                {/* --- Central Abstract Engine Visual (Optional/Top-level flow) --- */}
                <div className="hidden lg:flex w-full justify-center mb-16 pointer-events-none opacity-80">
                    <svg width="800" height="120" viewBox="0 0 800 120" fill="none" className="max-w-4xl w-full">
                        <path d="M100 60 L300 60" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />
                        <path d="M500 60 L700 60" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />
                        <path d="M400 10 L400 40" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />
                        <path d="M400 80 L400 110" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />

                        {/* Central Node */}
                        <rect x="320" y="40" width="160" height="40" rx="6" fill="rgba(109,40,245,0.15)" stroke="#6D28F5" />
                        <text x="400" y="64" fill="white" fontSize="12" fontWeight="bold" textAnchor="middle" letterSpacing="0.1em">AI ENGINE</text>

                        {/* Peripherals */}
                        <rect x="10" y="45" width="90" height="30" rx="4" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.1)" />
                        <text x="55" y="64" fill="rgba(255,255,255,0.6)" fontSize="10" fontWeight="bold" textAnchor="middle" letterSpacing="0.05em">CONTEXT</text>

                        <rect x="700" y="45" width="90" height="30" rx="4" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.1)" />
                        <text x="745" y="64" fill="#A855F7" fontSize="10" fontWeight="bold" textAnchor="middle" letterSpacing="0.05em">ACTION</text>

                        <rect x="340" y="0" width="120" height="24" rx="4" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.1)" />
                        <text x="400" y="16" fill="rgba(255,255,255,0.6)" fontSize="10" fontWeight="bold" textAnchor="middle" letterSpacing="0.05em">KNOWLEDGE</text>

                        <rect x="340" y="96" width="120" height="24" rx="4" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.1)" />
                        <text x="400" y="112" fill="#A855F7" fontSize="10" fontWeight="bold" textAnchor="middle" letterSpacing="0.05em">AUTOMATION</text>

                        {/* Dynamic Pulses */}
                        <motion.circle r="3" fill="#A855F7" animate={{ cx: [50, 300], cy: [60, 60], opacity: [0, 1, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} />
                        <motion.circle r="3" fill="#A855F7" animate={{ cx: [500, 750], cy: [60, 60], opacity: [0, 1, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: 1 }} />
                    </svg>
                </div>

                {/* --- 2x2 AI Capability Cards --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {aiCapabilities.map((card, index) => (
                        <motion.div
                            key={card.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.1 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-white/[0.035] border border-white/[0.08] p-8 sm:p-10 hover:border-[#6D28F5]/45 hover:bg-white/[0.05] transition-colors duration-500"
                        >
                            <div className="relative z-10 mb-10">
                                <div className="mb-4 text-xs font-bold tracking-widest text-[#6D28F5]">
                                    {card.id}
                                </div>
                                <h3 className="mb-3 text-xl sm:text-2xl font-bold text-white">
                                    {card.title}
                                </h3>
                                <p className="mb-6 text-sm sm:text-base text-white/65 leading-relaxed max-w-sm">
                                    {card.description}
                                </p>
                                <div className="flex flex-wrap gap-x-4 gap-y-2">
                                    {card.tags.map((tag) => (
                                        <span key={tag} className="text-xs font-medium text-white/40">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Animated SVG Visual */}
                            <div className="relative z-0 h-32 w-full mt-auto opacity-70 group-hover:opacity-100 transition-opacity duration-500">
                                <card.Visual />
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* --- AI Pipeline Strip --- */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="mt-20 flex flex-col items-center justify-center border-t border-white/10 pt-16"
                >
                    <h4 className="mb-8 text-sm sm:text-base font-semibold tracking-wide text-white/80">
                        From Intelligence to Action.
                    </h4>

                    <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4">
                        {pipelineSteps.map((step, idx) => (
                            <div key={step} className="flex items-center gap-2 sm:gap-4">
                                <div className="flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-4 py-2 sm:px-6 sm:py-2.5">
                                    <span className="text-xs sm:text-sm font-medium text-white/70">
                                        {step}
                                    </span>
                                </div>
                                {idx !== pipelineSteps.length - 1 && (
                                    <ArrowRight className="h-4 w-4 text-[#6D28F5]" />
                                )}
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* --- Closing Statement & CTA --- */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="mt-24 flex flex-col items-center text-center"
                >
                    <p className="mb-8 max-w-xl text-lg sm:text-xl font-medium leading-relaxed text-white/90">
                        AI should do more than answer. It should understand, decide, and act.
                    </p>
                    <Link
                        href="/solutions/ai" // Temporarily route to /contact if AI page isn't ready
                        className="group flex h-12 items-center gap-2 rounded-full bg-[#6D28F5] px-8 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#A855F7] hover:shadow-[0_0_30px_rgba(168,85,247,0.3)] active:scale-[0.98]"
                    >
                        Explore AI Solutions
                        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                </motion.div>

            </div>
        </section>
    );
}