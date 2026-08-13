import { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageHeader } from "@/components/layout/PageHeader";
import { CTASection } from "@/components/sections/CTASection";
import { CheckCircle2, ShieldCheck, Zap, Sparkles, HeartHandshake, Compass } from "lucide-react";

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
    canonical: "https://www.apearix.com/company/about",
  },
  openGraph: {
    title: "About Us | Apearix Software Engineering",
    description: "Learn about Apearix's mission, vision, engineering philosophy, and 6 core principles for building software.",
    url: "https://www.apearix.com/company/about",
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
  "@id": "https://www.apearix.com/company/about/#webpage",
  "name": "About Apearix | Engineering Philosophy & Standards",
  "url": "https://www.apearix.com/company/about",
  "description": "Apearix is a software engineering company focused on creating modern digital products, enterprise SaaS platforms, and AI automations for ambitious businesses.",
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
      <Navbar />
      <main>
        <PageHeader
          badge="Thoughtfully Built Software"
          title="We build software that moves businesses forward."
          subtitle="Apearix is a software company focused on creating modern digital products for ambitious businesses. We believe technology should be simple, fast, and reliable."
          breadcrumbs={[{ label: "Company", href: "/company/about" }, { label: "About", href: "/company/about" }]}
        />

        {/* Philosophy Section */}
        <section className="py-20 md:py-28 bg-white border-b border-[#E5E7EB]">
          <div className="container max-w-[1280px] mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <span className="text-xs font-bold uppercase tracking-wider text-[#6D28F5] mb-3 block">Our Philosophy</span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#111827] tracking-tight mb-6">
                Good software is invisible.
              </h2>
              <p className="text-base sm:text-lg text-[#4B5563] leading-relaxed">
                Every product we build is designed to solve real problems, improve everyday workflows, and help businesses grow with confidence.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-8 rounded-[12px] bg-[#FAFAFC] border border-[#E5E7EB] shadow-sm">
                <div className="w-12 h-12 rounded-[10px] bg-[#F4F0FF] text-[#6D28F5] flex items-center justify-center mb-6">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[#111827] mb-3">It feels natural.</h3>
                <p className="text-sm text-[#4B5563] leading-relaxed">
                  Interfaces designed around human intuition, reducing friction and training time.
                </p>
              </div>

              <div className="p-8 rounded-[12px] bg-[#FAFAFC] border border-[#E5E7EB] shadow-sm">
                <div className="w-12 h-12 rounded-[10px] bg-[#F4F0FF] text-[#6D28F5] flex items-center justify-center mb-6">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[#111827] mb-3">It responds instantly.</h3>
                <p className="text-sm text-[#4B5563] leading-relaxed">
                  Sub-100ms response times and optimized architecture built for global scale.
                </p>
              </div>

              <div className="p-8 rounded-[12px] bg-[#FAFAFC] border border-[#E5E7EB] shadow-sm">
                <div className="w-12 h-12 rounded-[10px] bg-[#F4F0FF] text-[#6D28F5] flex items-center justify-center mb-6">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[#111827] mb-3">Solves problems simply.</h3>
                <p className="text-sm text-[#4B5563] leading-relaxed">
                  Addressing core business needs without creating technological debt or complexity.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Our 6 Principles */}
        <section className="py-20 md:py-28 bg-[#FAFAFC] border-b border-[#E5E7EB]">
          <div className="container max-w-[1280px] mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <span className="text-xs font-bold uppercase tracking-wider text-[#6D28F5] mb-3 block">Our Standards</span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#111827] tracking-tight mb-4">
                Our Principles
              </h2>
              <p className="text-base sm:text-lg text-[#4B5563] leading-relaxed">
                That's the standard we build toward every single day.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: "Simplicity over complexity.", desc: "Focusing on clear, maintainable solutions instead of convoluted systems." },
                { title: "Quality over quantity.", desc: "Crafting every line of code and pixel with intentional precision." },
                { title: "Performance by default.", desc: "Fast loading speeds and optimized resource usage from day one." },
                { title: "Design with purpose.", desc: "Aesthetics that support user intent and drive measurable results." },
                { title: "Build for the long term.", desc: "Architecting software that scales seamlessly as your business grows." },
                { title: "Earn trust through craftsmanship.", desc: "Delivering reliable, secure, and production-ready code every time." }
              ].map((principle, idx) => (
                <div key={idx} className="p-6 md:p-8 rounded-[12px] bg-white border border-[#E5E7EB] shadow-sm flex items-start gap-4">
                  <CheckCircle2 className="w-6 h-6 text-[#6D28F5] flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-lg font-bold text-[#111827] mb-2">{principle.title}</h3>
                    <p className="text-sm text-[#4B5563] leading-relaxed">{principle.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-20 md:py-28 bg-white border-b border-[#E5E7EB]">
          <div className="container max-w-[1280px] mx-auto px-6 grid md:grid-cols-2 gap-12">
            <div className="p-8 md:p-10 rounded-[12px] bg-[#F4F0FF]/40 border border-[#DDD6FE]">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 rounded-[10px] bg-[#6D28F5] text-white">
                  <Compass className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-[#111827]">Our Mission</h3>
              </div>
              <p className="text-base text-[#4B5563] leading-relaxed">
                To create software that helps businesses work smarter, grow faster, and build confidently in a digital world.
              </p>
            </div>

            <div className="p-8 md:p-10 rounded-[12px] bg-[#FAFAFC] border border-[#E5E7EB]">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 rounded-[10px] bg-[#6D28F5] text-white">
                  <HeartHandshake className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-[#111827]">Our Vision</h3>
              </div>
              <p className="text-base text-[#4B5563] leading-relaxed">
                To become a globally trusted software company known for thoughtful products, exceptional engineering, and meaningful innovation.
              </p>
            </div>
          </div>
        </section>

        <CTASection />
      </main>
      <Footer />
    </>
  );
}
