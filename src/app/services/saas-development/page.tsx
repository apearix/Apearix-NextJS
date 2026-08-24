import { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageHeader } from "@/components/layout/PageHeader";
import { CTASection } from "@/components/sections/CTASection";
import { Layers, Database, Lock, Cpu, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "SaaS Application Development Services | Enterprise Multi-Tenant Platforms",
  description: "Enterprise SaaS development company building multi-tenant web applications, automated Stripe subscription billing, SOC2 security compliance, and scalable cloud architectures.",
  keywords: [
    "SaaS Application Development",
    "Enterprise SaaS Engineering",
    "Multi-Tenant Architecture",
    "Stripe Subscription Integration",
    "Custom B2B SaaS Platform"
  ],
  alternates: {
    canonical: "https://www.apearix.com/services/saas-development",
  },
  openGraph: {
    title: "SaaS Application Development Services | Apearix",
    description: "Enterprise SaaS development company building multi-tenant web applications and scalable platforms.",
    url: "https://www.apearix.com/services/saas-development",
    siteName: "Apearix",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SaaS Application Development Services | Apearix",
    description: "Enterprise SaaS development company building multi-tenant web applications.",
    site: "@apearix",
    creator: "@apearix",
  },
};

const jsonLdService = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": "https://www.apearix.com/services/saas-development/#service",
  "name": "SaaS Application Development Services",
  "serviceType": "SaaS Product Engineering",
  "url": "https://www.apearix.com/services/saas-development",
  "provider": {
    "@id": "https://www.apearix.com/#organization"
  },
  "areaServed": "Global",
  "description": "Custom multi-tenant SaaS application development, subscription billing architectures, role-based access control, and enterprise cloud scalability.",
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "SaaS Engineering Offerings",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Multi-Tenant Architecture"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Stripe & Paddle Billing Integration"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Enterprise Security & SSO Integration"
        }
      }
    ]
  }
};

export default function SaaSDevelopmentPage() {
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
          title="SaaS Development"
          subtitle="Powerful multi-tenant web applications built for scalability, high concurrency, and long-term business value. From MVPs to enterprise platforms."
          breadcrumbs={[{ label: "Services", href: "/services/saas-development" }, { label: "SaaS Development", href: "/services/saas-development" }]}
        />

        <section className="py-20 md:py-28 bg-white border-b border-[#E5E7EB]">
          <div className="container max-w-[1280px] mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <span className="text-xs font-bold uppercase tracking-wider text-[#6D28F5] mb-3 block">Enterprise SaaS</span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#111827] tracking-tight mb-4">
                Architected for Growth & Reliability
              </h2>
              <p className="text-base sm:text-lg text-[#4B5563] leading-relaxed">
                We design and build SaaS products that scale seamlessly from your first 100 users to millions of monthly active users.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-8 rounded-[12px] bg-[#FAFAFC] border border-[#E5E7EB] shadow-sm">
                <div className="w-12 h-12 rounded-[10px] bg-[#F4F0FF] text-[#6D28F5] flex items-center justify-center mb-6">
                  <Layers className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[#111827] mb-3">Multi-Tenant Architecture</h3>
                <p className="text-sm text-[#4B5563] leading-relaxed">
                  Isolated tenant data boundaries, custom subdomains, and granular role-based access control (RBAC).
                </p>
              </div>

              <div className="p-8 rounded-[12px] bg-[#FAFAFC] border border-[#E5E7EB] shadow-sm">
                <div className="w-12 h-12 rounded-[10px] bg-[#F4F0FF] text-[#6D28F5] flex items-center justify-center mb-6">
                  <Database className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[#111827] mb-3">Billing & Subscriptions</h3>
                <p className="text-sm text-[#4B5563] leading-relaxed">
                  Seamless Stripe and Paddle integrations with usage-based billing, tier management, and automated invoicing.
                </p>
              </div>

              <div className="p-8 rounded-[12px] bg-[#FAFAFC] border border-[#E5E7EB] shadow-sm">
                <div className="w-12 h-12 rounded-[10px] bg-[#F4F0FF] text-[#6D28F5] flex items-center justify-center mb-6">
                  <Lock className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[#111827] mb-3">Enterprise Security</h3>
                <p className="text-sm text-[#4B5563] leading-relaxed">
                  SOC2-ready data encryption at rest and in transit, SSO (SAML/OAuth), and automated backup protocols.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* <CTASection title="Have a SaaS product idea?" subtitle="Let's build a production-ready application that users love." /> */}
      </main>
      <Footer />
    </>
  );
}
