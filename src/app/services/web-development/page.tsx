import { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageHeader } from "@/components/layout/PageHeader";
import { CTASection } from "@/components/sections/CTASection";
import { Monitor, Zap, Search, ShieldCheck, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Website Development Services | Next.js & React Web Apps",
  description: "Ultra-fast website development engineered for speed, 100/100 Core Web Vitals, enterprise SEO performance, semantic HTML5, and high business conversion.",
  keywords: [
    "Website Development Services",
    "Next.js Web Development Agency",
    "React Frontend Engineering",
    "High Performance Websites",
    "Core Web Vitals Optimization"
  ],
  alternates: {
    canonical: "https://www.apearix.com/services/web-development",
  },
  openGraph: {
    title: "Website Development Services | Next.js & React | Apearix",
    description: "Ultra-fast website development engineered for speed, SEO performance, and business conversion.",
    url: "https://www.apearix.com/services/web-development",
    siteName: "Apearix",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Website Development Services | Next.js & React | Apearix",
    description: "Ultra-fast website development engineered for speed, SEO performance, and conversion.",
    site: "@apearix",
    creator: "@apearix",
  },
};

const jsonLdService = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": "https://www.apearix.com/services/web-development/#service",
  "name": "Website Development & Engineering Services",
  "serviceType": "Web Development Engineering",
  "url": "https://www.apearix.com/services/web-development",
  "provider": {
    "@id": "https://www.apearix.com/#organization"
  },
  "areaServed": "Global",
  "description": "Modern websites built for speed, performance, Core Web Vitals, technical SEO, and business conversion.",
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Web Development Offerings",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Next.js & React SSR Development"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "100/100 Core Web Vitals Optimization"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Technical & Semantic SEO Architecture"
        }
      }
    ]
  }
};

export default function WebDevelopmentPage() {
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
          title="Website Development"
          subtitle="Modern websites built for speed, performance, and business growth. We create digital experiences that are responsive, accessible, and designed to convert visitors into customers."
          breadcrumbs={[{ label: "Services", href: "/services/web-development" }, { label: "Web Development", href: "/services/web-development" }]}
        />

        {/* Feature Grid */}
        <section className="py-20 md:py-28 bg-white border-b border-[#E5E7EB]">
          <div className="container max-w-[1280px] mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <span className="text-xs font-bold uppercase tracking-wider text-[#6D28F5] mb-3 block">Craftsmanship</span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#111827] tracking-tight mb-4">
                Built for Performance & Credibility
              </h2>
              <p className="text-base sm:text-lg text-[#4B5563] leading-relaxed">
                Your website is the front door to your business. We engineer sites that load in milliseconds and deliver seamless experiences across every device.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-8 rounded-[12px] bg-[#FAFAFC] border border-[#E5E7EB] shadow-sm">
                <div className="w-12 h-12 rounded-[10px] bg-[#F4F0FF] text-[#6D28F5] flex items-center justify-center mb-6">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[#111827] mb-3">Ultra-Fast Loading</h3>
                <p className="text-sm text-[#4B5563] leading-relaxed">
                  Optimized Core Web Vitals with 100/100 Lighthouse scores, server-side rendering, and image compression.
                </p>
              </div>

              <div className="p-8 rounded-[12px] bg-[#FAFAFC] border border-[#E5E7EB] shadow-sm">
                <div className="w-12 h-12 rounded-[10px] bg-[#F4F0FF] text-[#6D28F5] flex items-center justify-center mb-6">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[#111827] mb-3">SEO-Ready Architecture</h3>
                <p className="text-sm text-[#4B5563] leading-relaxed">
                  Semantic HTML5, OpenGraph metadata, JSON-LD structured data, and clean routing for maximum organic visibility.
                </p>
              </div>

              <div className="p-8 rounded-[12px] bg-[#FAFAFC] border border-[#E5E7EB] shadow-sm">
                <div className="w-12 h-12 rounded-[10px] bg-[#F4F0FF] text-[#6D28F5] flex items-center justify-center mb-6">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[#111827] mb-3">Responsive & Secure</h3>
                <p className="text-sm text-[#4B5563] leading-relaxed">
                  Flawless fluid responsiveness across 320px–1920px viewports with HTTPS, SSL, and modern security headers.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Tech Stack Details */}
        <section className="py-20 md:py-28 bg-[#FAFAFC] border-b border-[#E5E7EB]">
          <div className="container max-w-[1280px] mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <span className="text-xs font-bold uppercase tracking-wider text-[#6D28F5] mb-3 block">Modern Stack</span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#111827] tracking-tight mb-4">
                Technologies We Master
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {['Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Vercel', 'GraphQL', 'Node.js', 'Sanity CMS'].map((tech, i) => (
                <div key={i} className="p-6 rounded-[12px] bg-white border border-[#E5E7EB] shadow-sm flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#6D28F5]" />
                  <span className="font-bold text-[#111827] text-sm">{tech}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* <CTASection title="Ready to launch a high-performance website?" subtitle="Get in touch to discuss your goals, design preferences, and timeline." /> */}
      </main>
      <Footer />
    </>
  );
}
