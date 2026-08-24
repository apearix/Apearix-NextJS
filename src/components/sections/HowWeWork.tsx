'use client';

import { motion, useScroll, useSpring } from 'framer-motion';
import { Workflow } from 'lucide-react';
import { useRef } from 'react';

const steps = [
    {
        number: '01',
        title: 'Discover',
        subtitle: 'Understand before we build.',
        description:
            'We learn about your business, goals, users, workflows, and challenges to understand what actually needs to be solved.',
        output: 'Goals · Requirements · Scope',
    },
    {
        number: '02',
        title: 'Plan',
        subtitle: 'Turn the idea into a clear roadmap.',
        description:
            'We define the right solution, technology, architecture, priorities, timeline, and milestones before development begins.',
        output: 'Strategy · Architecture · Roadmap',
    },
    {
        number: '03',
        title: 'Design & Build',
        subtitle: 'Turn the plan into a working product.',
        description:
            'We design intuitive experiences and develop the product in focused iterations, keeping you involved throughout the process.',
        output: 'UI/UX · Development · Iterations',
    },
    {
        number: '04',
        title: 'Test & Launch',
        subtitle: 'Make it ready for the real world.',
        description:
            'We test functionality, performance, responsiveness, security, and integrations before deploying the product to production.',
        output: 'QA · Optimization · Deployment',
    },
    {
        number: '05',
        title: 'Grow',
        subtitle: 'Launch is the beginning, not the end.',
        description:
            'We help monitor, maintain, improve, and scale your product as your users and business grow.',
        output: 'Support · Optimization · Scaling',
    },
];

export function HowWeWork() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start center', 'end center'],
    });

    const scaleY = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001,
    });

    return (
        <section id="process" className="bg-white py-10 sm:py-16 lg:py-20">
            <div className="max-w-7xl mx-auto px-6 xl:px-0">
                <div className="max-w-3xl mb-16 md:mb-24">
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-80px' }}
                        transition={{ duration: 0.5 }}
                        className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#DDD6FE] bg-[#F4F0FF] px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#6D28F5]"
                    >
                        <Workflow className="h-3.5 w-3.5" />
                        <span>How We Work</span>
                    </motion.div>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#111827] mb-6 tracking-tight">
                        Apearix Process <br />
                        <span className="text-[#6D28F5]">From Idea to Impact.</span>
                    </h2>
                    <p className="text-lg md:text-xl text-[#4B5563] leading-relaxed">
                        A clear, collaborative process designed to turn business challenges into reliable digital products from the first conversation to launch and beyond.
                    </p>
                </div>

                <div ref={containerRef} className="relative max-w-4xl mx-auto">
                    {/* Timeline Line */}
                    <div className="absolute left-[20px] md:left-1/2 top-0 bottom-0 w-px bg-[#E5E7EB] md:-translate-x-1/2" />
                    <motion.div
                        style={{ scaleY, transformOrigin: 'top' }}
                        className="absolute left-[20px] md:left-1/2 top-0 bottom-0 w-px bg-[#6D28F5] md:-translate-x-1/2"
                    />

                    {steps.map((step, index) => {
                        const isEvenIndex = index % 2 === 0; // 0, 2, 4 -> Left on Desktop (Steps 01, 03, 05)

                        return (
                            <div key={step.number} className="relative mb-16 md:mb-24 last:mb-0">
                                <div className="flex items-start gap-6 md:gap-12">
                                    {/* Left Slot (Desktop Only) */}
                                    <div className="hidden md:flex flex-1 justify-end text-right">
                                        {isEvenIndex ? (
                                            <StepContent step={step} isLeft={true} />
                                        ) : (
                                            <div className="w-full" />
                                        )}
                                    </div>

                                    {/* Center Step Badge */}
                                    <div className="relative z-10 flex-shrink-0 w-10 h-10 rounded-full bg-white border-2 border-[#6D28F5] flex items-center justify-center font-bold text-[#6D28F5] shadow-sm text-sm">
                                        {step.number}
                                    </div>

                                    {/* Right Slot (Mobile + Desktop) */}
                                    <div className="flex-1 text-left">
                                        {!isEvenIndex ? (
                                            <StepContent step={step} isLeft={false} />
                                        ) : (
                                            <>
                                                {/* On mobile, show step 01/03/05 on the right of the badge */}
                                                <div className="md:hidden">
                                                    <StepContent step={step} isLeft={false} />
                                                </div>
                                                {/* On desktop, keep the right column empty to balance grid */}
                                                <div className="hidden md:block w-full" />
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

function StepContent({ step, isLeft }: { step: any; isLeft: boolean }) {
    return (
        <motion.div
            initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className={`max-w-sm ${isLeft ? 'md:ml-auto md:mr-0' : 'md:mr-auto md:ml-0'}`}
        >
            <h3 className="text-xl md:text-2xl font-bold text-heading mb-2">{step.title}</h3>
            <div className={`flex items-center gap-2 text-xs font-medium pb-2 ${isLeft ? 'md:justify-end' : 'justify-start'}`}>
                <span className="text-[#6D28F5] font-semibold">{step.output}</span>
            </div>
            <p className="text-[#4B5563] text-sm md:text-base leading-relaxed">
                {step.description}
            </p>
        </motion.div>
    );
}