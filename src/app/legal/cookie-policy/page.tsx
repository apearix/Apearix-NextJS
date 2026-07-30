import { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageHeader } from "@/components/layout/PageHeader";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "Apearix Cookie Policy explaining our privacy-first stance and essential session cookies.",
  alternates: {
    canonical: "https://www.apearix.com/legal/cookie-policy",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function CookiePolicyPage() {
  return (
    <>
      <Navbar />
      <main>
        <PageHeader
          badge="Privacy Notice"
          title="Cookie Policy"
          subtitle="Last updated: July 30, 2026. Explanation of how Apearix uses essential session cookies and local browser storage."
          breadcrumbs={[{ label: "Legal", href: "/legal/cookie-policy" }, { label: "Cookie Policy", href: "/legal/cookie-policy" }]}
        />

        <section className="py-20 md:py-28 bg-white border-b border-[#E5E7EB]">
          <div className="container max-w-[1280px] mx-auto px-6">
            <div className="max-w-3xl mx-auto prose prose-slate text-[#4B5563] space-y-8 leading-relaxed">
              <div>
                <h2 className="text-2xl font-bold text-[#111827] mb-4">1. What Are Cookies</h2>
                <p>
                  Cookies are small text files stored on your device by your web browser when visiting websites. They help remember user preferences and maintain secure session states.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-[#111827] mb-4">2. How We Use Cookies</h2>
                <p>
                  Apearix uses only essential first-party cookies necessary for core website performance, security, and session management. We do not deploy invasive third-party cross-site tracking cookies.
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
