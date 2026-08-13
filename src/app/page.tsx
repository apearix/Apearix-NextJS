import { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AIEngine } from "@/components/sections/AIEngine";
import { Capabilities } from "@/components/sections/Capabilities";
import { CaseStudies } from "@/components/sections/CaseStudies";
import { Hero } from "@/components/sections/Hero";
import { Metrics } from "@/components/sections/Metrics";
import { Process } from "@/components/sections/Process";
import { Showcase } from "@/components/sections/Showcase";
import { TechStack } from "@/components/sections/TechStack";
import { Testimonials } from "@/components/sections/Testimonials";
import { ModernTechStack } from "@/components/sections/ModernTechStack";
import { WhyApearix } from "@/components/sections/WhyApearix";
import { WhatWeBuild } from "@/components/sections/WhatWeBuild";
import { AIIntelligentSystems } from "@/components/sections/AIIntelligentSystems";
import { EngineeringProcess } from "@/components/sections/EngineeringProcess";
import { CTASection } from "@/components/sections/CTASectionOld";

export const metadata: Metadata = {
  title: "Apearix | Software Engineering Company | AI-Powered Solutions & SaaS Development",
  description: "Apearix designs and builds high-performance web applications, enterprise SaaS platforms, custom AI agents, AI workflow automations, mobile apps, and scalable cloud systems.",
  alternates: {
    canonical: "https://www.apearix.com",
  },
  openGraph: {
    title: "Apearix | Software Engineering Company | AI-Powered Solutions & SaaS",
    description: "Apearix builds software that moves businesses forward. Custom Web Apps, Enterprise SaaS, AI Automations, Mobile Apps, and Cloud DevOps.",
    url: "https://www.apearix.com",
    siteName: "Apearix",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Apearix | Software Engineering Company | AI-Powered Solutions & SaaS",
    description: "Engineering Intelligence. Building extraordinary digital experiences and automated systems.",
    site: "@apearix",
    creator: "@apearix",
  },
};

const jsonLdProfessionalService = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": "https://www.apearix.com/#service",
  "name": "Apearix Software Engineering & AI Agency",
  "url": "https://www.apearix.com",
  "logo": "https://www.apearix.com/icon",
  "image": "https://www.apearix.com/opengraph-image",
  "email": "contact@apearix.com",
  "telephone": "+917241131839",
  "priceRange": "$$$",
  "description": "Apearix is a full-service software engineering agency building custom web applications, SaaS products, AI workflow automations, and mobile applications.",
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "Global"
  },
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Software Engineering Services",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Website Development",
          "url": "https://www.apearix.com/services/web-development"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "SaaS Application Development",
          "url": "https://www.apearix.com/services/saas-development"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "AI Automation & Custom Agents",
          "url": "https://www.apearix.com/services/ai-automation"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "UI/UX Design Systems",
          "url": "https://www.apearix.com/services/ui-ux-design"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Mobile Application Development",
          "url": "https://www.apearix.com/services/mobile-app-development"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Cloud & DevOps Infrastructure",
          "url": "https://www.apearix.com/services/cloud-devops"
        }
      }
    ]
  }
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdProfessionalService) }}
      />
      <Navbar />
      <main>
        <Hero />
        <TechStack />
        <WhatWeBuild />
        <AIIntelligentSystems />
        <EngineeringProcess />
        <ModernTechStack />
        <CaseStudies />
        <WhyApearix />
        <CTASection />

        {/* <Capabilities /> */}
        {/* <Process /> */}
        {/* <AIEngine /> */}
        {/* <Showcase /> */}
        {/* <Metrics /> */}
        {/* <Testimonials /> */}
      </main>
      <Footer />
    </>
  );
}

