import { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/site/layout/PageHeader";
import { CTASection } from "@/components/sections/CTASection";
import { SERVICES_DATA, SERVICE_HIGHLIGHT_METRICS } from "./data";
import {
    Puzzle,
    Cpu,
    ShieldCheck,
} from "lucide-react";

import {
    Sparkles,
    Cloud,
    Smartphone,
    Layers,
    Palette,
    Code2,
    ArrowUpRight,
    CheckCircle2,
    Zap,
} from "lucide-react";

export const metadata: Metadata = {
    title: "Engineering Services & AI Solutions | Apearix",
    description:
        "Explore engineering services by Apearix: Custom SaaS platforms, autonomous AI agent workflows, cross-platform mobile apps, and enterprise cloud infrastructure.",
    keywords: [
        "SaaS Development Services",
        "AI Systems Engineering",
        "Flutter Mobile App Development",
        "Next.js Web Development",
        "Custom Software Studio",
        "Apearix Services",
    ],
    alternates: {
        canonical: "https://www.apearix.com/services",
    },
    openGraph: {
        title: "Engineering Services & AI Solutions | Apearix",
        description:
            "Enterprise SaaS architecture, autonomous AI agents, cross-platform mobile apps, and robust cloud systems.",
        url: "https://www.apearix.com/services",
        siteName: "Apearix",
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Engineering Services & AI Solutions | Apearix",
        description:
            "Custom SaaS platforms, autonomous AI agent workflows, and cross-platform mobile apps.",
        site: "@apearix",
        creator: "@apearix",
    },
};

const iconMap = {
    Sparkles,
    Cloud,
    Smartphone,
    Layers,
    Palette,
    Code2,
};

const jsonLdServices = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": "https://www.apearix.com/services/#webpage",
    name: "Apearix Engineering & AI Services",
    url: "https://www.apearix.com/services",
    provider: {
        "@type": "Organization",
        name: "Apearix",
        url: "https://www.apearix.com",
    },
    description:
        "Full-lifecycle software engineering, custom SaaS architecture, AI agent systems, and cross-platform mobile applications.",
    hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Software & AI Engineering Services",
        itemListElement: SERVICES_DATA.map((service, index) => ({
            "@type": "Offer",
            position: index + 1,
            itemOffered: {
                "@type": "Service",
                name: service.title,
                description: service.shortDescription,
            },
        })),
    },
};

export default function ServicesPage() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdServices) }}
            />
            <main className="w-full bg-background selection:bg-primary-light selection:text-primary">
                {/* Page Header */}
                <PageHeader
                    title="Engineering Disciplined Digital Products & AI Architectures"
                    subtitle="From high-concurrency SaaS applications to autonomous AI workflows and 60fps mobile experiences. We build software engineered for production reliability."
                    breadcrumbs={[{ label: "Services", href: "/services" }]}
                />

                {/* ----------------- METRICS TICKER ----------------- */}
                <section className="border-b border-border bg-surface py-8">
                    <div className="container max-w-7xl mx-auto px-4 sm:px-6 xl:px-0">
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
                            {SERVICE_HIGHLIGHT_METRICS.map((metric, idx) => (
                                <div key={idx} className="flex flex-col items-center justify-center p-3">
                                    <span className="text-2xl sm:text-3xl font-bold text-heading tracking-tight">
                                        {metric.value}
                                    </span>
                                    <span className="text-xs sm:text-sm text-muted mt-1 font-medium">
                                        {metric.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ----------------- SERVICES GRID ----------------- */}
                <section className="py-16 md:py-24 bg-background">
                    <div className="container max-w-7xl mx-auto px-4 sm:px-6 xl:px-0">
                        <div className="max-w-2xl mb-12">
                            <span className="text-xs font-bold uppercase tracking-wider text-primary">
                                Capabilities & Practice Areas
                            </span>
                            <h2 className="text-2xl sm:text-3xl font-bold text-heading mt-2 tracking-tight">
                                Complete Engineering Capabilities
                            </h2>
                            <p className="text-sm sm:text-base text-body mt-2 leading-relaxed">
                                Every service is backed by clean code standards, modular architectures, and scalable technology foundations.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                            {SERVICES_DATA.map((service) => {
                                const IconComponent = iconMap[service.iconName] || Layers;

                                return (
                                    <div
                                        key={service.id}
                                        className="group relative rounded-2xl bg-surface border border-border hover:border-border-accent hover:shadow-xl hover:shadow-glow/40 transition-all duration-300 p-6 sm:p-8 flex flex-col justify-between"
                                    >
                                        <div>
                                            {/* Top Bar: Icon + Badge */}
                                            <div className="flex items-center justify-between mb-5">
                                                <div className="w-12 h-12 rounded-xl bg-primary-light border border-border-accent flex items-center justify-center text-primary group-hover:scale-105 transition-transform duration-200">
                                                    <IconComponent className="w-6 h-6 stroke-[1.8]" />
                                                </div>
                                                <span className="px-3 py-1 bg-surface-alt border border-border text-heading text-xs font-medium rounded-full">
                                                    {service.badge}
                                                </span>
                                            </div>

                                            {/* Title & Tagline */}
                                            <h3 className="text-xl font-semibold text-heading group-hover:text-primary transition-colors leading-snug mb-2">
                                                <Link href={`/services/${service.slug}`} className="hover:underline focus:outline-none">
                                                    {service.title}
                                                </Link>
                                            </h3>
                                            <p className="text-xs font-medium text-primary/90 mb-3">
                                                {service.tagline}
                                            </p>
                                            <p className="text-sm text-body leading-relaxed mb-6">
                                                {service.shortDescription}
                                            </p>

                                            {/* Deliverables / Scope Bullet Points */}
                                            <div className="space-y-2 mb-6 pt-4 border-t border-border">
                                                <div className="text-xs font-medium   tracking-wider text-heading">
                                                    Key Deliverables:-
                                                </div>
                                                {service.deliverables.map((item, idx) => (
                                                    <div key={idx} className="flex items-start gap-2 text-xs text-body">
                                                        <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                                                        <span>{item}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Bottom Area: Metrics, Tech Tags & Action CTA */}
                                        <div>
                                            <div className="px-3.5 py-2 mb-5 rounded-lg bg-surface-alt border border-border flex items-center justify-between text-xs">
                                                <div className="flex items-center gap-1.5 text-primary font-bold">
                                                    <Zap className="w-3.5 h-3.5 text-primary shrink-0" />
                                                    <span>{service.metrics.stat}</span>
                                                </div>
                                                <span className="text-[11px] font-medium text-muted truncate max-w-45">
                                                    {service.metrics.label}
                                                </span>
                                            </div>

                                            <div className="flex flex-wrap gap-1.5 mb-6">
                                                {service.techStack.map((tech) => (
                                                    <span
                                                        key={tech}
                                                        className="px-2 py-0.5 rounded text-xs   bg-surface-alt border border-border text-muted"
                                                    >
                                                        {tech}
                                                    </span>
                                                ))}
                                            </div>

                                            <Link
                                                href={`/services/${service.slug}`}
                                                className="inline-flex items-center justify-between w-full pt-4 border-t border-border text-xs sm:text-sm font-semibold text-primary group-hover:text-primary-hover"
                                            >
                                                <span>Explore Architecture</span>
                                                <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* ----------------- HOW WE DELIVER (PROCESS) ----------------- */}
                <section className="py-16 md:py-20 bg-surface border-y border-border">
                    <div className="container max-w-7xl mx-auto px-4 sm:px-6 xl:px-0">
                        <div className="text-center max-w-2xl mx-auto mb-14">
                            <span className="text-xs font-bold uppercase tracking-wider text-primary">
                                Our Delivery Standard
                            </span>
                            <h2 className="text-2xl sm:text-3xl font-bold text-heading mt-2 tracking-tight">
                                Architecture to Production in Weeks
                            </h2>
                            <p className="text-sm sm:text-base text-body mt-2">
                                A predictable engineering lifecycle designed to eliminate friction and launch reliable code.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            {[
                                {
                                    step: "01",
                                    title: "Blueprint & Schema",
                                    desc: "We define data models, API boundaries, security vectors, and UI component hierarchies.",
                                },
                                {
                                    step: "02",
                                    title: "Sprint Implementation",
                                    desc: "High-velocity development using typed contracts, automated tests, and staging environments.",
                                },
                                {
                                    step: "03",
                                    title: "Audit & Hardening",
                                    desc: "End-to-end load testing, OWASP security validations, and Core Web Vitals optimization.",
                                },
                                {
                                    step: "04",
                                    title: "Deployment & Scaling",
                                    desc: "Zero-downtime production release, CI/CD pipeline handover, and ongoing telemetry monitoring.",
                                },
                            ].map((item) => (
                                <div
                                    key={item.step}
                                    className="p-6 rounded-xl bg-background border border-border hover:border-border-accent transition-all duration-200"
                                >
                                    <span className="text-2xl font-black text-primary/40 block mb-3 font-mono">
                                        {item.step}
                                    </span>
                                    <h3 className="text-base font-bold text-heading mb-2">
                                        {item.title}
                                    </h3>
                                    <p className="text-xs sm:text-sm text-body leading-relaxed">
                                        {item.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ----------------- CALL TO ACTION ----------------- */}

            </main>
        </>
    );
}