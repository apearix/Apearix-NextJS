import { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageHeader } from "@/components/layout/PageHeader";
import { CTASection } from "@/components/sections/CTASection";
import { ArrowRight, Code, Laptop, Heart, GraduationCap, Clock, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Careers",
  description: "Join Apearix. Explore engineering, design, and AI automation roles at a remote-first software company focused on craftsmanship.",
  alternates: {
    canonical: "https://www.apearix.com/company/careers",
  },
  openGraph: {
    title: "Careers | Apearix",
    description: "Join Apearix. Explore engineering, design, and AI automation roles.",
    url: "https://www.apearix.com/company/careers",
  },
};

const jsonLdCareers = {
  "@context": "https://schema.org",
  "@type": "CareersPage",
  "name": "Careers at Apearix",
  "url": "https://www.apearix.com/company/careers",
  "description": "Explore open software engineering, design, and AI automation roles at Apearix."
};

export default function CareersPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdCareers) }}
      />
      <Navbar />
      <main>
        <PageHeader
          badge="Join Our Team"
          title="Build software people enjoy using."
          subtitle="We are looking for engineers, designers, and thinkers who care about craftsmanship, performance, and building meaningful digital products."
          breadcrumbs={[{ label: "Company", href: "/company/about" }, { label: "Careers", href: "/company/careers" }]}
        />

        {/* Benefits & Culture */}
        <section className="py-20 md:py-28 bg-white border-b border-[#E5E7EB]">
          <div className="container max-w-[1280px] mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <span className="text-xs font-bold uppercase tracking-wider text-[#6D28F5] mb-3 block">Engineering Culture</span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#111827] tracking-tight mb-4">
                Why Work at Apearix?
              </h2>
              <p className="text-base sm:text-lg text-[#4B5563] leading-relaxed">
                We believe in small, autonomous teams that prioritize deep work, clear communication, and high technical standards over bureaucracy.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: <Laptop className="w-6 h-6" />, title: "Remote-First Environment", desc: "Work from wherever you are most productive with flexible hours and asynchronous communication." },
                { icon: <Code className="w-6 h-6" />, title: "Craftsmanship Focus", desc: "We prioritize clean code, modern tech stacks (Next.js, TypeScript, AI), and zero legacy bloat." },
                { icon: <GraduationCap className="w-6 h-6" />, title: "Continuous Learning", desc: "Annual learning stipends, book allowances, and dedicated time for experimental R&D." },
                { icon: <Clock className="w-6 h-6" />, title: "Work-Life Harmony", desc: "Sustainable workloads, zero artificial crunch time, and generous paid time off." },
                { icon: <Heart className="w-6 h-6" />, title: "Health & Wellness", desc: "Comprehensive health coverage and wellness stipends for mind and body." },
                { icon: <ShieldCheck className="w-6 h-6" />, title: "Top-Tier Hardware", desc: "Apple Silicon hardware setups, 4K displays, and premium software licenses." }
              ].map((perk, i) => (
                <div key={i} className="p-8 rounded-[12px] bg-[#FAFAFC] border border-[#E5E7EB] shadow-sm">
                  <div className="w-12 h-12 rounded-[10px] bg-[#F4F0FF] text-[#6D28F5] flex items-center justify-center mb-6">
                    {perk.icon}
                  </div>
                  <h3 className="text-xl font-bold text-[#111827] mb-3">{perk.title}</h3>
                  <p className="text-sm text-[#4B5563] leading-relaxed">{perk.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Open Positions */}
        <section className="py-20 md:py-28 bg-[#FAFAFC] border-b border-[#E5E7EB]">
          <div className="container max-w-[1280px] mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <span className="text-xs font-bold uppercase tracking-wider text-[#6D28F5] mb-3 block">Openings</span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#111827] tracking-tight mb-4">
                Open Roles
              </h2>
              <p className="text-base sm:text-lg text-[#4B5563] leading-relaxed">
                Explore our current openings and help us craft extraordinary software.
              </p>
            </div>

            <div className="space-y-4 max-w-4xl mx-auto">
              {[
                { title: "Senior Full Stack Engineer (Next.js & TypeScript)", dept: "Engineering", type: "Full-Time", location: "Remote" },
                { title: "AI Systems & Automation Engineer", dept: "AI R&D", type: "Full-Time", location: "Remote" },
                { title: "Senior UI/UX Design Engineer", dept: "Product Design", type: "Full-Time", location: "Remote" },
                { title: "Mobile Application Developer (Flutter / React Native)", dept: "Mobile", type: "Full-Time", location: "Remote" }
              ].map((job, idx) => (
                <div key={idx} className="p-6 md:p-8 rounded-[12px] bg-white border border-[#E5E7EB] hover:border-[#DDD6FE] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all">
                  <div>
                    <h3 className="text-xl font-bold text-[#111827] mb-2">{job.title}</h3>
                    <div className="flex items-center gap-3 text-xs text-[#6B7280]">
                      <span className="px-2.5 py-1 bg-[#F4F0FF] text-[#6D28F5] font-semibold rounded-full">{job.dept}</span>
                      <span>{job.type}</span>
                      <span>•</span>
                      <span>{job.location}</span>
                    </div>
                  </div>
                  <a
                    href="mailto:hqapearix@gmail.com?subject=Application for Role"
                    className="h-12 px-6 rounded-[10px] bg-[#6D28F5] hover:bg-[#5B21E6] text-white font-medium text-sm flex items-center gap-2 transition-colors"
                  >
                    <span>Apply Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        <CTASection title="Don't see your role?" subtitle="Send your resume and portfolio to hqapearix@gmail.com. We are always interested in connecting with extraordinary talent." ctaText="Contact Our Team" />
      </main>
      <Footer />
    </>
  );
}
