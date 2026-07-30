import { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageHeader } from "@/components/layout/PageHeader";
import { CTASection } from "@/components/sections/CTASection";
import { Clock, ArrowUpRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Engineering Insights & Articles",
  description: "Read technical articles on Next.js performance optimization, custom AI agent architecture, design systems, and DevOps.",
  alternates: {
    canonical: "https://www.apearix.com/resources/blog",
  },
  openGraph: {
    title: "Engineering Insights & Articles | Apearix",
    description: "Read technical articles on Next.js performance, custom AI agent architecture, and DevOps.",
    url: "https://www.apearix.com/resources/blog",
  },
};

const jsonLdBlog = {
  "@context": "https://schema.org",
  "@type": "Blog",
  "name": "Apearix Engineering Insights",
  "url": "https://www.apearix.com/resources/blog",
  "description": "Technical articles and deep dives on software development, AI, and design systems."
};

const articles = [
  {
    title: "Building High-Performance Next.js Web Apps with Sub-100ms Load Times",
    category: "Engineering Deep Dive",
    date: "July 24, 2026",
    readTime: "6 min read",
    snippet: "A practical guide to optimizing Next.js App Router performance using streaming SSR, edge caching, and asset bundling.",
  },
  {
    title: "Designing Custom AI Agents for Enterprise Workflow Automation",
    category: "AI Architecture",
    date: "July 18, 2026",
    readTime: "8 min read",
    snippet: "How to combine LLMs, pgvector, and deterministic state machines to build reliable AI agents that do not hallucinate.",
  },
  {
    title: "The 8pt Spacing Grid: Achieving Apple-Level UI Consistency in Web Apps",
    category: "UI/UX Design",
    date: "July 10, 2026",
    readTime: "5 min read",
    snippet: "Why mathematical spacing systems create visual harmony and streamline developer handoff across design teams.",
  },
  {
    title: "Zero-Downtime Database Migrations in Multi-Tenant SaaS Environments",
    category: "DevOps & Cloud",
    date: "June 28, 2026",
    readTime: "7 min read",
    snippet: "Strategies for running backward-compatible schema changes on active production PostgreSQL databases.",
  },
];

export default function BlogPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBlog) }}
      />
      <Navbar />
      <main>
        <PageHeader
          badge="Engineering Insights"
          title="Insights & Articles"
          subtitle="Deep dives into software architecture, AI automation, modern frontend development, and digital product design."
          breadcrumbs={[{ label: "Resources", href: "/resources/blog" }, { label: "Blog", href: "/resources/blog" }]}
        />

        <section className="py-20 md:py-28 bg-white border-b border-[#E5E7EB]">
          <div className="container max-w-[1280px] mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {articles.map((article, idx) => (
                <article key={idx} className="group p-8 rounded-[12px] bg-[#FAFAFC] border border-[#E5E7EB] hover:border-[#DDD6FE] hover:shadow-md transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-4 mb-4">
                      <span className="px-3 py-1 bg-[#F4F0FF] text-[#6D28F5] text-xs font-semibold rounded-full">
                        {article.category}
                      </span>
                      <div className="flex items-center gap-2 text-xs text-[#6B7280]">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{article.readTime}</span>
                      </div>
                    </div>

                    <h2 className="text-xl sm:text-2xl font-bold text-[#111827] mb-3 group-hover:text-[#6D28F5] transition-colors leading-snug">
                      {article.title}
                    </h2>
                    <p className="text-sm text-[#4B5563] leading-relaxed mb-6">
                      {article.snippet}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-[#E5E7EB]">
                    <span className="text-xs font-medium text-[#6B7280]">{article.date}</span>
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-[#6D28F5]">
                      <span>Read Article</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <CTASection title="Subscribe to Engineering Insights" subtitle="Get periodic updates on AI breakthroughs, architecture deep dives, and product launches." ctaText="Contact Our Team" />
      </main>
      <Footer />
    </>
  );
}
