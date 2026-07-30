import { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageHeader } from "@/components/layout/PageHeader";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Apearix Terms and Conditions governing software development services, intellectual property transfer, and website usage.",
  alternates: {
    canonical: "https://www.apearix.com/legal/terms-and-conditions",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main>
        <PageHeader
          badge="Legal Terms"
          title="Terms & Conditions"
          subtitle="Last updated: July 30, 2026. Terms governing the use of Apearix services, website, and software development deliverables."
          breadcrumbs={[{ label: "Legal", href: "/legal/terms-and-conditions" }, { label: "Terms & Conditions", href: "/legal/terms-and-conditions" }]}
        />

        <section className="py-20 md:py-28 bg-white border-b border-[#E5E7EB]">
          <div className="container max-w-[1280px] mx-auto px-6">
            <div className="max-w-3xl mx-auto prose prose-slate text-[#4B5563] space-y-8 leading-relaxed">
              <div>
                <h2 className="text-2xl font-bold text-[#111827] mb-4">1. Acceptance of Terms</h2>
                <p>
                  By accessing the Apearix website or engaging Apearix for software development services, you agree to be bound by these Terms and Conditions and all applicable laws and regulations.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-[#111827] mb-4">2. Intellectual Property & Code Transfer</h2>
                <p>
                  Unless otherwise specified in a Master Services Agreement (MSA), upon full payment of project invoices, Apearix transfers full ownership of custom client software deliverables, source code, and design assets to the client.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-[#111827] mb-4">3. Limitation of Liability</h2>
                <p>
                  In no event shall Apearix or its suppliers be liable for any indirect, incidental, or consequential damages arising out of the use of or inability to use our software products or website.
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
