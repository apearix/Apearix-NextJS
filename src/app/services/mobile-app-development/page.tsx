import { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageHeader } from "@/components/layout/PageHeader";
import { CTASection } from "@/components/sections/CTASection";
import { Smartphone, Zap, ShieldCheck, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Mobile App Development Services | iOS & Android Apps",
  description: "Native and cross-platform mobile application development for iOS and Android using Flutter and React Native. Offline-first architectures and 60fps UI performance.",
  keywords: [
    "Mobile App Development Services",
    "Flutter App Development Company",
    "React Native Agency",
    "iOS and Android App Developers",
    "Cross-Platform Mobile Apps"
  ],
  alternates: {
    canonical: "https://www.apearix.com/services/mobile-app-development",
  },
  openGraph: {
    title: "Mobile App Development | Flutter & React Native | Apearix",
    description: "Native and cross-platform mobile application development for iOS and Android with 60fps performance.",
    url: "https://www.apearix.com/services/mobile-app-development",
    siteName: "Apearix",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mobile App Development | Flutter & React Native | Apearix",
    description: "Native and cross-platform mobile application development for iOS and Android.",
    site: "@apearix",
    creator: "@apearix",
  },
};

const jsonLdService = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": "https://www.apearix.com/services/mobile-app-development/#service",
  "name": "Mobile Application Development Services",
  "serviceType": "Mobile Application Engineering",
  "url": "https://www.apearix.com/services/mobile-app-development",
  "provider": {
    "@id": "https://www.apearix.com/#organization"
  },
  "areaServed": "Global",
  "description": "Cross-platform mobile applications for iOS & Android built with Flutter and React Native, including App Store deployment and maintenance.",
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Mobile Application Offerings",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Flutter Cross-Platform Development"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Offline-First Syncing & Biometrics"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "App Store & Play Store Deployment"
        }
      }
    ]
  }
};

export default function MobileAppDevelopmentPage() {
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
          title="Mobile App Development"
          subtitle="Native and cross-platform mobile applications designed around real users and real business goals. Built for iOS and Android with smooth 60fps performance."
          breadcrumbs={[{ label: "Services", href: "/services/mobile-app-development" }, { label: "Mobile App Development", href: "/services/mobile-app-development" }]}
        />

        <section className="py-20 md:py-28 bg-white border-b border-[#E5E7EB]">
          <div className="container max-w-[1280px] mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <span className="text-xs font-bold uppercase tracking-wider text-[#6D28F5] mb-3 block">iOS & Android</span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#111827] tracking-tight mb-4">
                Mobile Performance Without Compromise
              </h2>
              <p className="text-base sm:text-lg text-[#4B5563] leading-relaxed">
                Whether you need a Flutter cross-platform app or a native Swift/Kotlin solution, we engineer mobile products that rank at the top of App Stores.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-8 rounded-[12px] bg-[#FAFAFC] border border-[#E5E7EB] shadow-sm">
                <div className="w-12 h-12 rounded-[10px] bg-[#F4F0FF] text-[#6D28F5] flex items-center justify-center mb-6">
                  <Smartphone className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[#111827] mb-3">Cross-Platform Mastery</h3>
                <p className="text-sm text-[#4B5563] leading-relaxed">
                  Single codebase delivery for iOS & Android with Flutter and React Native, cutting development time by 40% without compromising native feel.
                </p>
              </div>

              <div className="p-8 rounded-[12px] bg-[#FAFAFC] border border-[#E5E7EB] shadow-sm">
                <div className="w-12 h-12 rounded-[10px] bg-[#F4F0FF] text-[#6D28F5] flex items-center justify-center mb-6">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[#111827] mb-3">Offline-First & Fast</h3>
                <p className="text-sm text-[#4B5563] leading-relaxed">
                  Local sqlite/WatermelonDB syncing, push notifications, biometrics (FaceID/TouchID), and instant background data refresh.
                </p>
              </div>

              <div className="p-8 rounded-[12px] bg-[#FAFAFC] border border-[#E5E7EB] shadow-sm">
                <div className="w-12 h-12 rounded-[10px] bg-[#F4F0FF] text-[#6D28F5] flex items-center justify-center mb-6">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[#111827] mb-3">App Store Publishing</h3>
                <p className="text-sm text-[#4B5563] leading-relaxed">
                  Complete management of Apple App Store and Google Play Store submission guidelines, compliance, and TestFlight beta distribution.
                </p>
              </div>
            </div>
          </div>
        </section>

        <CTASection title="Ready to launch a mobile application?" subtitle="Let's build an app that users love having on their home screen." />
      </main>
      <Footer />
    </>
  );
}
