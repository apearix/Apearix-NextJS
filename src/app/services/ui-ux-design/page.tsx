import { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageHeader } from "@/components/layout/PageHeader";
import { CTASection } from "@/components/sections/CTASection";
import { Palette, Eye, Sparkles, Layout, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "UI/UX Design Services | Design Systems & Interactive Prototypes",
  description: "Human-centered digital interface design, tokenized Figma design systems, interactive web/mobile prototypes, and 60fps micro-animations built for conversion.",
  keywords: [
    "UI UX Design Services",
    "Design System Agency",
    "Figma Interactive Prototyping",
    "Product Interface Design",
    "User Experience Engineering"
  ],
  alternates: {
    canonical: "https://www.apearix.com/services/ui-ux-design",
  },
  openGraph: {
    title: "UI/UX Design Services | Design Systems & Prototypes | Apearix",
    description: "Human-centered digital interface design, tokenized design systems, and interactive prototypes.",
    url: "https://www.apearix.com/services/ui-ux-design",
    siteName: "Apearix",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "UI/UX Design Services | Design Systems & Prototypes | Apearix",
    description: "Human-centered digital interface design, tokenized design systems, and prototypes.",
    site: "@apearix",
    creator: "@apearix",
  },
};

const jsonLdService = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": "https://www.apearix.com/services/ui-ux-design/#service",
  "name": "UI/UX Design & Product Interface Services",
  "serviceType": "UI/UX Design Engineering",
  "url": "https://www.apearix.com/services/ui-ux-design",
  "provider": {
    "@id": "https://www.apearix.com/#organization"
  },
  "areaServed": "Global",
  "description": "Human-centered user interface design, tokenized design systems, interactive Figma prototypes, and micro-animations.",
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "UI/UX Design Offerings",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Tokenized Design Systems"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Interactive Figma Prototypes"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Micro-Animations & Interaction Motion"
        }
      }
    ]
  }
};

export default function UIUXDesignPage() {
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
          title="UI/UX Design"
          subtitle="Human-centered digital interfaces designed with clarity, spatial harmony, and mechanical precision. We turn complex user flows into intuitive experiences."
          breadcrumbs={[{ label: "Services", href: "/services/ui-ux-design" }, { label: "UI/UX Design", href: "/services/ui-ux-design" }]}
        />

        <section className="py-20 md:py-28 bg-white border-b border-[#E5E7EB]">
          <div className="container max-w-[1280px] mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <span className="text-xs font-bold uppercase tracking-wider text-[#6D28F5] mb-3 block">Design System Standard</span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#111827] tracking-tight mb-4">
                Design with Purpose
              </h2>
              <p className="text-base sm:text-lg text-[#4B5563] leading-relaxed">
                We design clean, minimal, luxury software interfaces that reduce cognitive load and delight users at first glance.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-8 rounded-[12px] bg-[#FAFAFC] border border-[#E5E7EB] shadow-sm">
                <div className="w-12 h-12 rounded-[10px] bg-[#F4F0FF] text-[#6D28F5] flex items-center justify-center mb-6">
                  <Palette className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[#111827] mb-3">Design Systems</h3>
                <p className="text-sm text-[#4B5563] leading-relaxed">
                  Comprehensive tokenized design systems with strict color palettes, typography scales, and reusable UI component libraries.
                </p>
              </div>

              <div className="p-8 rounded-[12px] bg-[#FAFAFC] border border-[#E5E7EB] shadow-sm">
                <div className="w-12 h-12 rounded-[10px] bg-[#F4F0FF] text-[#6D28F5] flex items-center justify-center mb-6">
                  <Eye className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[#111827] mb-3">Interactive Prototypes</h3>
                <p className="text-sm text-[#4B5563] leading-relaxed">
                  High-fidelity interactive Figma & Framer prototypes to test user flows and validate assumptions before code implementation.
                </p>
              </div>

              <div className="p-8 rounded-[12px] bg-[#FAFAFC] border border-[#E5E7EB] shadow-sm">
                <div className="w-12 h-12 rounded-[10px] bg-[#F4F0FF] text-[#6D28F5] flex items-center justify-center mb-6">
                  <Layout className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[#111827] mb-3">Micro-Animations</h3>
                <p className="text-sm text-[#4B5563] leading-relaxed">
                  Subtle, 60fps Framer Motion feedback loops and state transitions that make interfaces feel alive and responsive.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* <CTASection title="Elevate your product's design." subtitle="Let's build an interface that users love to interact with every day." /> */}
      </main>
      <Footer />
    </>
  );
}
