import { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageHeader } from "@/components/layout/PageHeader";
import { CTASection } from "@/components/sections/CTASection";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Case Studies",
  description: "Detailed technical case studies on scaling mid-market SaaS platforms and engineering custom AI contract review automation.",
  alternates: {
    canonical: "https://www.apearix.com/work/case-studies",
  },
  openGraph: {
    title: "Case Studies | Apearix",
    description: "Detailed technical case studies on scaling SaaS platforms and AI automation.",
    url: "https://www.apearix.com/work/case-studies",
  },
};

const jsonLdCaseStudies = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "name": "Apearix Case Studies",
  "url": "https://www.apearix.com/work/case-studies",
  "description": "In-depth case studies detailing client challenges, custom solutions, and metrics achieved."
};

const caseStudies = [
  {
    title: "Scaling Mid-Market SaaS Platform to 100k Active Users",
    client: "NexusFlow Enterprise",
    problem: "Disjointed tools causing workflow friction, slow load times (>4s), and high operational cost for mid-sized enterprises.",
    solution: "Rebuilt core architecture with Next.js App Router, edge caching, unified PostgreSQL database, and automated Stripe billing.",
    result: "Reduced admin work by 40%, improved page load speed to 65ms, and supported 100,000+ daily active users seamlessly.",
    tags: ["Next.js", "TypeScript", "PostgreSQL", "Stripe"],
  },
  {
    title: "Automating Legal Contract Review with Custom RAG Pipeline",
    client: "LexiTech Legal Systems",
    problem: "Legal teams spent 15+ hours weekly manually auditing multi-page vendor agreements for compliance risks.",
    solution: "Engineered a custom OpenAI & Pinecone Vector RAG pipeline embedded into a secure Chrome extension.",
    result: "Cut contract review time down from 15 hours to 10 minutes with 99.4% accuracy across compliance flags.",
    tags: ["AI Automation", "Pinecone", "Chrome Extension", "FastAPI"],
  },
];

export default function CaseStudiesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdCaseStudies) }}
      />
      <Navbar />
      <main>
        <PageHeader
          badge="In-Depth Analysis"
          title="Case Studies"
          subtitle="Detailed technical breakdowns of real business challenges, custom software solutions, and measurable long-term results."
          breadcrumbs={[{ label: "Work", href: "/work/portfolio" }, { label: "Case Studies", href: "/work/case-studies" }]}
        />

        <section className="py-20 md:py-28 bg-white border-b border-[#E5E7EB]">
          <div className="container max-w-[1280px] mx-auto px-6 space-y-16">
            {caseStudies.map((study, idx) => (
              <div key={idx} className="p-8 md:p-12 rounded-[12px] bg-[#FAFAFC] border border-[#E5E7EB] shadow-sm grid md:grid-cols-12 gap-8 items-start">
                <div className="md:col-span-8 space-y-6">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-[#F4F0FF] text-[#6D28F5] text-xs font-semibold rounded-full">
                      {study.client}
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-bold text-[#111827] tracking-tight">
                    {study.title}
                  </h2>

                  <div className="space-y-4 text-sm sm:text-base leading-relaxed text-[#4B5563]">
                    <p><strong className="text-[#111827]">Problem:</strong> {study.problem}</p>
                    <p><strong className="text-[#111827]">Solution:</strong> {study.solution}</p>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2">
                    {study.tags.map((tag) => (
                      <span key={tag} className="px-3 py-1 bg-white border border-[#E5E7EB] rounded-[6px] text-xs font-medium text-[#6B7280]">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="md:col-span-4 p-6 rounded-[10px] bg-white border border-[#E5E7EB] space-y-4">
                  <div className="flex items-center gap-2 text-[#6D28F5] font-bold text-xs uppercase tracking-wider">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Key Outcome</span>
                  </div>
                  <p className="text-base font-bold text-[#111827] leading-snug">
                    {study.result}
                  </p>
                  <Link
                    href="/company/contact"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[#6D28F5] hover:text-[#5B21E6] pt-2"
                  >
                    <span>Discuss Similar Solution</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        <CTASection title="Want measurable results for your business?" subtitle="Let's analyze your technical bottlenecks and build software that scales." />
      </main>
      <Footer />
    </>
  );
}
