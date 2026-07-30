import { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageHeader } from "@/components/layout/PageHeader";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Apearix Privacy Policy outlining how we collect, use, and safeguard personal information.",
  alternates: {
    canonical: "https://www.apearix.com/legal/privacy-policy",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <Navbar />
      <main>
        <PageHeader
          badge="Legal Compliance"
          title="Privacy Policy"
          subtitle="Last updated: July 30, 2026. This policy outlines how Apearix collects, uses, and safeguards your information."
          breadcrumbs={[{ label: "Legal", href: "/legal/privacy-policy" }, { label: "Privacy Policy", href: "/legal/privacy-policy" }]}
        />

        <section className="py-20 md:py-28 bg-white border-b border-[#E5E7EB]">
          <div className="container max-w-[1280px] mx-auto px-6">
            <div className="max-w-3xl mx-auto prose prose-slate text-[#4B5563] space-y-8 leading-relaxed">
              <div>
                <h2 className="text-2xl font-bold text-[#111827] mb-4">1. Information We Collect</h2>
                <p>
                  We collect information you provide directly to us when contacting us, submitting project inquiries, or subscribing to engineering insights. This may include your name, work email address, phone number, and project description.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-[#111827] mb-4">2. How We Use Your Information</h2>
                <p>
                  Apearix uses collected information solely to respond to project inquiries, deliver requested software services, fulfill legal obligations, and send periodic updates if explicitly subscribed. We never sell or share your personal data with third parties.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-[#111827] mb-4">3. Data Security & Storage</h2>
                <p>
                  We implement industry-standard encryption protocols (TLS 1.3 / AES-256) to protect data transmitted and stored across our systems. Access to confidential client data is strictly restricted to authorized engineering personnel under non-disclosure agreements.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-[#111827] mb-4">4. Your Rights</h2>
                <p>
                  You have the right to request access to, correction of, or deletion of your personal data at any time by emailing us directly at <a href="mailto:hqapearix@gmail.com" className="text-[#6D28F5] underline font-semibold">hqapearix@gmail.com</a>.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
