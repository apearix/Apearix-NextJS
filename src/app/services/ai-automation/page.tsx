import { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageHeader } from "@/components/layout/PageHeader";
import { CTASection } from "@/components/sections/CTASection";
import { Bot, Cpu, Workflow, Sparkles, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "AI Automation Services",
  description: "Integrate custom AI agents, LLM pipelines, vector databases (RAG), and intelligent workflow automation into your business processes.",
  alternates: {
    canonical: "https://www.apearix.com/services/ai-automation",
  },
  openGraph: {
    title: "AI Automation Services | Apearix",
    description: "Integrate custom AI agents, LLM pipelines, and intelligent workflow automation.",
    url: "https://www.apearix.com/services/ai-automation",
  },
};

const jsonLdService = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "AI Automation Services",
  "provider": {
    "@type": "Organization",
    "name": "Apearix"
  },
  "serviceType": "AI Automation",
  "areaServed": "Global"
};

export default function AIAutomationPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdService) }}
      />
      <Navbar />
      <main>
        <PageHeader
          badge="Services"
          title="AI Automation"
          subtitle="Automate repetitive business workflows with intelligent AI systems. Integrate LLMs, vector databases, and custom AI agents into your operational processes."
          breadcrumbs={[{ label: "Services", href: "/services/ai-automation" }, { label: "AI Automation", href: "/services/ai-automation" }]}
        />

        <section className="py-20 md:py-28 bg-white border-b border-[#E5E7EB]">
          <div className="container max-w-[1280px] mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <span className="text-xs font-bold uppercase tracking-wider text-[#6D28F5] mb-3 block">Intelligent Workflows</span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#111827] tracking-tight mb-4">
                Work Smarter with AI Integration
              </h2>
              <p className="text-base sm:text-lg text-[#4B5563] leading-relaxed">
                We turn manual, time-consuming business processes into automated, intelligent software loops that save hundreds of hours monthly.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-8 rounded-[12px] bg-[#FAFAFC] border border-[#E5E7EB] shadow-sm">
                <div className="w-12 h-12 rounded-[10px] bg-[#F4F0FF] text-[#6D28F5] flex items-center justify-center mb-6">
                  <Bot className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[#111827] mb-3">Custom AI Agents</h3>
                <p className="text-sm text-[#4B5563] leading-relaxed">
                  Autonomous agents trained on your proprietary data to handle customer inquiries, document analysis, and data extraction.
                </p>
              </div>

              <div className="p-8 rounded-[12px] bg-[#FAFAFC] border border-[#E5E7EB] shadow-sm">
                <div className="w-12 h-12 rounded-[10px] bg-[#F4F0FF] text-[#6D28F5] flex items-center justify-center mb-6">
                  <Workflow className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[#111827] mb-3">Workflow Automation</h3>
                <p className="text-sm text-[#4B5563] leading-relaxed">
                  Connect CRMs, ERPs, emails, and databases into cohesive self-executing automation pipelines.
                </p>
              </div>

              <div className="p-8 rounded-[12px] bg-[#FAFAFC] border border-[#E5E7EB] shadow-sm">
                <div className="w-12 h-12 rounded-[10px] bg-[#F4F0FF] text-[#6D28F5] flex items-center justify-center mb-6">
                  <Cpu className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[#111827] mb-3">RAG & Vector Search</h3>
                <p className="text-sm text-[#4B5563] leading-relaxed">
                  Retrieval-Augmented Generation architectures with Pinecone and pgvector for accurate semantic search across company knowledge.
                </p>
              </div>
            </div>
          </div>
        </section>

        <CTASection title="Want to automate your business operations?" subtitle="Schedule a discovery call to audit your processes and identify high-ROI AI automation opportunities." />
      </main>
      <Footer />
    </>
  );
}
