import { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageHeader } from "@/components/layout/PageHeader";
import { CTASection } from "@/components/sections/CTASection";
import { FAQAccordion } from "@/components/sections/FAQAccordion";

export const metadata: Metadata = {
  title: "Frequently Asked Questions (FAQ) | Software Engineering & Pricing",
  description: "Find answers to common questions about Apearix software development services, project timelines, 100% IP code ownership, maintenance support, and pricing models.",
  keywords: [
    "Apearix FAQ",
    "Software Development Pricing",
    "Code Ownership IP",
    "SaaS MVP Timeline",
    "Software Maintenance Support"
  ],
  alternates: {
    canonical: "https://www.apearix.com/resources/faq",
  },
  openGraph: {
    title: "Frequently Asked Questions (FAQ) | Apearix",
    description: "Everything you need to know about partnering with Apearix, our development process, code ownership, and pricing.",
    url: "https://www.apearix.com/resources/faq",
    siteName: "Apearix",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Frequently Asked Questions (FAQ) | Apearix",
    description: "Everything you need to know about partnering with Apearix, our development process, code ownership, and pricing.",
    site: "@apearix",
    creator: "@apearix",
  },
};

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
  "@id": "https://www.apearix.com/resources/faq/#webpage",
  "name": "Apearix Frequently Asked Questions",
  "url": "https://www.apearix.com/resources/faq",
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
            <FAQAccordion faqs={faqs} />
          </div>
        </section>

        <CTASection title="Have a question not answered here?" subtitle="Contact our engineering team directly and we will answer all your technical questions." ctaText="Contact Us" />
      </main>
      <Footer />
    </>
  );
}
