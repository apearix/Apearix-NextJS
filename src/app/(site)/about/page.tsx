import { Metadata } from "next";
import { AboutHero } from "@/components/site/about/AboutHero";
import { AboutProof } from "@/components/site/about/AboutProof";
import { AboutWhoWeAre } from "@/components/site/about/AboutWhoWeAre";
import { AboutJourney } from "@/components/site/about/AboutJourney";
import { AboutPurpose } from "@/components/site/about/AboutPurpose";
import { AboutPrinciples } from "@/components/site/about/AboutPrinciples";
import { AboutLeadership } from "@/components/site/about/AboutLeadership";
import { AboutTeam } from "@/components/site/about/AboutTeam";
import { AboutCapabilities } from "@/components/site/about/AboutCapabilities";
import { AboutIndustries } from "@/components/site/about/AboutIndustries";
import { AboutApproach } from "@/components/site/about/AboutApproach";
import { ModernTechStack } from "@/components/sections/ModernTechStack";
import { AboutCommitment } from "@/components/site/about/AboutCommitment";
import { AboutLife } from "@/components/site/about/AboutLife";
import { AboutWhyApearix } from "@/components/site/about/AboutWhyApearix";
import { AboutCTA } from "@/components/site/about/AboutCTA";

export const metadata: Metadata = {
  title: "About Us | Engineering Philosophy & Software Standards",
  description: "Learn about Apearix's mission, engineering vision, architectural philosophy, and 6 core principles for building high-performance software and AI systems.",
  keywords: [
    "About Apearix",
    "Software Engineering Philosophy",
    "Custom Software Company",
    "AI Development Standards",
    "Clean Engineering Principles"
  ],
  alternates: {
    canonical: "https://www.apearix.com/about",
  },
  openGraph: {
    title: "About Us | Apearix Software Engineering",
    description: "Learn about Apearix's mission, vision, engineering philosophy, and 6 core principles for building software.",
    url: "https://www.apearix.com/about",
    siteName: "Apearix",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us | Apearix Software Engineering",
    description: "Learn about Apearix's mission, vision, engineering philosophy, and principles.",
    site: "@apearix",
    creator: "@apearix",
  },
};

const jsonLdAbout = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  "@id": "https://www.apearix.com/about/#webpage",
  "name": "About Apearix | Engineering Philosophy & Standards",
  "url": "https://www.apearix.com/about",
  "description": "Apearix is a software engineering company focused on creating modern digital products, enterprise SaaS platforms, and AI automatons for ambitious businesses.",
  "mainEntity": {
    "@type": "Organization",
    "name": "Apearix",
    "url": "https://www.apearix.com",
    "slogan": "Engineering Intelligence. Software built for businesses that want to grow.",
    "knowsAbout": [
      "Software Architecture",
      "Custom AI Agents",
      "Next.js App Router",
      "SaaS Engineering",
      "Cloud Infrastructure"
    ]
  }
};

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdAbout) }}
      />
      <main>
        <AboutHero />
        <AboutProof />
        <AboutWhoWeAre />
        <AboutJourney />
        <AboutPurpose />
        <AboutPrinciples />
        <AboutLeadership />
        <AboutTeam />
        <AboutCapabilities />
        <AboutIndustries />
        <AboutApproach />
        <ModernTechStack />
        <AboutCommitment />
        <AboutLife />
        <AboutWhyApearix />
        <AboutCTA />
      </main>
    </>
  );
}
