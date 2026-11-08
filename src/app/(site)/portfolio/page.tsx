import { Metadata } from "next";
import { Navbar } from "@/components/site/layout/Navbar";
import { Footer } from "@/components/site/layout/Footer";
import { PageHeader } from "@/components/site/layout/PageHeader";
import { CTASection } from "@/components/sections/CTASection";
import { ArrowUpRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Software Portfolio & Case Showcase | Web, SaaS & AI",
  description: "Explore digital products, enterprise SaaS dashboards, mobile applications, browser extensions, and AI automation engineered by Apearix.",
  keywords: [
    "Software Development Portfolio",
    "SaaS Project Showcase",
    "AI Automation Case Studies",
    "Mobile App Portfolio",
    "Apearix Works"
  ],
  alternates: {
    canonical: "https://www.apearix.com/work/portfolio",
  },
  openGraph: {
    title: "Software Portfolio & Case Showcase | Apearix",
    description: "Explore digital products, mobile applications, browser extensions, and AI automations engineered by Apearix.",
    url: "https://www.apearix.com/work/portfolio",
    siteName: "Apearix",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Software Portfolio & Case Showcase | Apearix",
    description: "Explore digital products, mobile applications, browser extensions, and AI automations.",
    site: "@apearix",
    creator: "@apearix",
  },
};

const jsonLdPortfolio = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "@id": "https://www.apearix.com/work/portfolio/#webpage",
  "name": "Apearix Product Portfolio",
  "url": "https://www.apearix.com/work/portfolio",
  "description": "Selected software products, mobile applications, browser extensions, and AI tools built by Apearix.",
  "mainEntity": {
    "@type": "ItemList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "item": {
          "@type": "SoftwareApplication",
          "name": "Apearix SaaS Dashboard",
          "applicationCategory": "BusinessApplication",
          "operatingSystem": "Web Browser"
        }
      },
      {
        "@type": "ListItem",
        "position": 2,
        "item": {
          "@type": "SoftwareApplication",
          "name": "AI Document Intelligence Engine",
          "applicationCategory": "UtilitiesApplication",
          "operatingSystem": "Cloud API"
        }
      },
      {
        "@type": "ListItem",
        "position": 3,
        "item": {
          "@type": "SoftwareApplication",
          "name": "Workflow Chrome Extension",
          "applicationCategory": "BrowserExtension",
          "operatingSystem": "Google Chrome / Edge"
        }
      },
      {
        "@type": "ListItem",
        "position": 4,
        "item": {
          "@type": "SoftwareApplication",
          "name": "HealthTrack Mobile App",
          "applicationCategory": "HealthApplication",
          "operatingSystem": "iOS / Android"
        }
      }
    ]
  }
};

const projects = [
  {
    title: "Apearix SaaS Dashboard",
    category: "SaaS Platform",
    desc: "An enterprise analytics and workflow management platform built with Next.js, Tailwind CSS, and TypeScript.",
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "Stripe"],
    metrics: "40% Admin Time Reduction",
  },
  {
    title: "AI Document Intelligence Engine",
    category: "AI Automation",
    desc: "Automated OCR and vector retrieval system for extracting insights from complex legal contracts.",
    tags: ["Python", "Pinecone", "OpenAI", "FastAPI"],
    metrics: "99.4% Extraction Accuracy",
  },
  {
    title: "Workflow Chrome Extension",
    category: "Browser Extension",
    desc: "Custom productivity extension built for Microsoft Edge and Google Chrome automating data entry into CRM systems.",
    tags: ["JavaScript", "Chrome Manifest V3", "WebSockets"],
    metrics: "15,000+ Daily Active Users",
  },
  {
    title: "HealthTrack Mobile App",
    category: "Mobile Application",
    desc: "Cross-platform mobile wellness app with real-time biometric Bluetooth device integration.",
    tags: ["Flutter", "Dart", "Firebase", "HealthKit"],
    metrics: "4.9 App Store Rating",
  },
  {
    title: "Fintech Cloud Infrastructure",
    category: "Cloud & DevOps",
    desc: "Zero-downtime AWS infrastructure with automated SOC2 compliance monitoring and multi-region failover.",
    tags: ["AWS", "Terraform", "Docker", "GitHub Actions"],
    metrics: "99.99% Guaranteed Uptime",
  },
  {
    title: "E-Commerce Luxury Portal",
    category: "Web Development",
    desc: "Headless e-commerce platform with sub-80ms page loads and custom 3D interactive product previews.",
    tags: ["Next.js", "Shopify Storefront API", "Three.js"],
    metrics: "+32% Conversion Lift",
  },
];

export default function PortfolioPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdPortfolio) }}
      />
      <main>
        <PageHeader
          badge="Selected Work"
          title="Portfolio"
          subtitle="Explore digital products, mobile applications, browser extensions, and AI automations engineered by Apearix for growing companies."
          breadcrumbs={[{ label: "Portfolio", href: "/portfolio" }]}
        />

        <section className="py-20 md:py-28 bg-white border-b border-border">
          <div className="container max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project, idx) => (
                <div key={idx} className="group p-8 rounded-xl bg-surface border border-border hover:border-border-accent hover:shadow-md transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-3 py-1 bg-primary-light text-[#6D28F5] text-xs font-semibold rounded-full">
                        {project.category}
                      </span>
                      <ArrowUpRight className="w-5 h-5 text-muted group-hover:text-[#6D28F5] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                    </div>

                    <h3 className="text-xl font-bold text-heading mb-3 group-hover:text-[#6D28F5] transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-sm text-body leading-relaxed mb-6">
                      {project.desc}
                    </p>
                  </div>

                  <div>
                    <div className="p-3 mb-6 rounded-lg bg-white border border-border text-xs font-bold text-heading">
                      {project.metrics}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <span key={tag} className="px-2.5 py-1 bg-surface-alt border border-border rounded-md text-xs text-muted">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* <CTASection title="Have a product in mind?" subtitle="Let's add your project to our portfolio of successful software products." /> */}
      </main>
    </>
  );
}
