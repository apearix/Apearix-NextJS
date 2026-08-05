import { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageHeader } from "@/components/layout/PageHeader";
import { Mail, Phone, MapPin, Send, MessageSquare } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us | Start Your Software Project",
  description: "Get in touch with Apearix to discuss your web application, SaaS platform, AI automation, or mobile app project. Book an engineering consultation.",
  keywords: [
    "Contact Apearix",
    "Hire Software Developers",
    "Software Engineering Consultation",
    "AI Agency Contact",
    "SaaS Development Inquiry"
  ],
  alternates: {
    canonical: "https://www.apearix.com/company/contact",
  },
  openGraph: {
    title: "Contact Apearix | Software Engineering & AI Consultation",
    description: "Get in touch with Apearix to discuss your software project or book a consultation.",
    url: "https://www.apearix.com/company/contact",
    siteName: "Apearix",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Apearix | Software Engineering Consultation",
    description: "Get in touch with Apearix to discuss your software project or book a consultation.",
    site: "@apearix",
    creator: "@apearix",
  },
};

const jsonLdContact = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  "@id": "https://www.apearix.com/company/contact/#webpage",
  "name": "Contact Apearix",
  "url": "https://www.apearix.com/company/contact",
  "description": "Contact Apearix software engineering team for project inquiries, technical audits, and consultations.",
  "mainEntity": {
    "@type": "ContactPoint",
    "email": "hqapearix@gmail.com",
    "telephone": "+917241131839",
    "contactType": "customer service",
    "availableLanguage": ["English"],
    "hoursAvailable": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "09:00",
      "closes": "18:00"
    }
  }
};

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdContact) }}
      />
      <Navbar />
      <main>
        <PageHeader
          badge="Get In Touch"
          title="Let's build software that lasts."
          subtitle="Whether you are starting with a new idea or scaling an existing product, our engineering team is ready to collaborate."
          breadcrumbs={[{ label: "Company", href: "/company/about" }, { label: "Contact", href: "/company/contact" }]}
        />

        <section className="py-20 md:py-28 bg-white border-b border-[#E5E7EB]">
          <div className="container max-w-[1280px] mx-auto px-6 grid lg:grid-cols-12 gap-12">
            
            {/* Left Direct Details */}
            <div className="lg:col-span-5 space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-[#111827] tracking-tight mb-4">
                  Start Your Project
                </h2>
                <p className="text-base text-[#4B5563] leading-relaxed">
                  Fill out the form or reach out directly. We typically respond within 24 hours on business days.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4 p-6 rounded-[12px] bg-[#FAFAFC] border border-[#E5E7EB]">
                  <div className="p-3 rounded-[10px] bg-[#F4F0FF] text-[#6D28F5]">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#111827] uppercase tracking-wider mb-1">Email Inquiry</h3>
                    <a href="mailto:hqapearix@gmail.com" className="text-base font-semibold text-[#6D28F5] hover:underline">
                      hqapearix@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-6 rounded-[12px] bg-[#FAFAFC] border border-[#E5E7EB]">
                  <div className="p-3 rounded-[10px] bg-[#F4F0FF] text-[#6D28F5]">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#111827] uppercase tracking-wider mb-1">Direct Phone</h3>
                    <a href="tel:+917241131839" className="text-base font-semibold text-[#111827]">
                      +91 72411 31839
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-6 rounded-[12px] bg-[#FAFAFC] border border-[#E5E7EB]">
                  <div className="p-3 rounded-[10px] bg-[#F4F0FF] text-[#6D28F5]">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#111827] uppercase tracking-wider mb-1">Consultation</h3>
                    <p className="text-sm text-[#4B5563]">
                      Schedule a 30-minute discovery call to discuss architectural scope and timelines.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Contact Form */}
            <div className="lg:col-span-7 p-8 md:p-10 rounded-[12px] bg-[#FAFAFC] border border-[#E5E7EB] shadow-sm">
              <form className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="full-name" className="block text-xs font-bold uppercase tracking-wider text-[#111827] mb-2">
                      Full Name *
                    </label>
                    <input
                      id="full-name"
                      type="text"
                      required
                      placeholder="Jane Doe"
                      className="w-full h-12 px-4 rounded-[10px] bg-white border border-[#E5E7EB] text-[#111827] placeholder-[#6B7280] text-sm focus:outline-none focus:border-[#6D28F5] focus:ring-1 focus:ring-[#6D28F5]"
                    />
                  </div>

                  <div>
                    <label htmlFor="work-email" className="block text-xs font-bold uppercase tracking-wider text-[#111827] mb-2">
                      Work Email *
                    </label>
                    <input
                      id="work-email"
                      type="email"
                      required
                      placeholder="jane@company.com"
                      className="w-full h-12 px-4 rounded-[10px] bg-white border border-[#E5E7EB] text-[#111827] placeholder-[#6B7280] text-sm focus:outline-none focus:border-[#6D28F5] focus:ring-1 focus:ring-[#6D28F5]"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="project-type" className="block text-xs font-bold uppercase tracking-wider text-[#111827] mb-2">
                      Project Category
                    </label>
                    <select
                      id="project-type"
                      className="w-full h-12 px-4 rounded-[10px] bg-white border border-[#E5E7EB] text-[#111827] text-sm focus:outline-none focus:border-[#6D28F5]"
                    >
                      <option value="web">Web Development</option>
                      <option value="saas">SaaS Application</option>
                      <option value="ai">AI Automation</option>
                      <option value="mobile">Mobile Application</option>
                      <option value="design">UI/UX Design</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="estimated-budget" className="block text-xs font-bold uppercase tracking-wider text-[#111827] mb-2">
                      Estimated Budget
                    </label>
                    <select
                      id="estimated-budget"
                      className="w-full h-12 px-4 rounded-[10px] bg-white border border-[#E5E7EB] text-[#111827] text-sm focus:outline-none focus:border-[#6D28F5]"
                    >
                      <option value="10k-25k">$10k – $25k</option>
                      <option value="25k-50k">$25k – $50k</option>
                      <option value="50k-100k">$50k – $100k</option>
                      <option value="100k+">$100k+</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-xs font-bold uppercase tracking-wider text-[#111827] mb-2">
                    Project Overview *
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    required
                    placeholder="Tell us about your business goals, target audience, and key required features..."
                    className="w-full p-4 rounded-[10px] bg-white border border-[#E5E7EB] text-[#111827] placeholder-[#6B7280] text-sm focus:outline-none focus:border-[#6D28F5] focus:ring-1 focus:ring-[#6D28F5]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full h-12 px-6 rounded-[10px] bg-[#6D28F5] hover:bg-[#5B21E6] text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6D28F5]"
                >
                  <span>Submit Inquiry</span>
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>

          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
