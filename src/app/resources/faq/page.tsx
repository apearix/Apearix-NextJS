'use client';

import { useState } from 'react';
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageHeader } from "@/components/layout/PageHeader";
import { CTASection } from "@/components/sections/CTASection";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "What types of software does Apearix build?",
    a: "We specialize in custom web applications (SaaS), mobile applications (iOS & Android), browser extensions (Chrome/Edge), and AI-powered workflow automations."
  },
  {
    q: "How long does a typical software development project take?",
    a: "MVP projects typically take 4 to 8 weeks from discovery to production launch. Larger enterprise SaaS platforms range from 12 to 20 weeks depending on feature scope."
  },
  {
    q: "Who owns the code and intellectual property after launch?",
    a: "You do. 100% of all source code, repositories, IP, design assets, and architecture credentials are fully transferred to your business upon project completion."
  },
  {
    q: "How do you handle project communication and updates?",
    a: "We run asynchronous, transparent communication via dedicated Slack/Teams channels, weekly video sprint reviews, and interactive preview deployments."
  },
  {
    q: "Do you provide ongoing maintenance and technical support?",
    a: "Yes. Launch is just the beginning. We offer dedicated post-launch support retainers for feature expansion, security patches, and cloud monitoring."
  },
  {
    q: "What is your pricing model?",
    a: "We work primarily on fixed-price milestones for clearly defined project scopes, or dedicated monthly engineering sprint retainers for evolving products."
  }
];

const jsonLdFaq = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map((f) => ({
    "@type": "Question",
    "name": f.q,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": f.a
    }
  }))
};

export default function FAQPage() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
      />
      <Navbar />
      <main>
        <PageHeader
          badge="Help & Answers"
          title="Frequently Asked Questions"
          subtitle="Everything you need to know about partnering with Apearix, our development process, code ownership, and pricing."
          breadcrumbs={[{ label: "Resources", href: "/resources/faq" }, { label: "FAQ", href: "/resources/faq" }]}
        />

        <section className="py-20 md:py-28 bg-white border-b border-[#E5E7EB]">
          <div className="container max-w-[1280px] mx-auto px-6">
            <div className="max-w-3xl mx-auto space-y-4">
              {faqs.map((faq, idx) => {
                const isOpen = openIdx === idx;
                return (
                  <div
                    key={idx}
                    className="rounded-[12px] bg-[#FAFAFC] border border-[#E5E7EB] overflow-hidden transition-all"
                  >
                    <button
                      onClick={() => setOpenIdx(isOpen ? null : idx)}
                      className="w-full p-6 text-left flex items-center justify-between gap-4 font-bold text-[#111827] text-base md:text-lg hover:text-[#6D28F5] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6D28F5]"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown className={`w-5 h-5 text-[#6B7280] transition-transform duration-300 ${isOpen ? "rotate-180 text-[#6D28F5]" : ""}`} />
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-6 text-sm md:text-base text-[#4B5563] leading-relaxed border-t border-[#E5E7EB]/60 pt-4">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <CTASection title="Have a question not answered here?" subtitle="Contact our engineering team directly and we will answer all your technical questions." ctaText="Contact Us" />
      </main>
      <Footer />
    </>
  );
}
