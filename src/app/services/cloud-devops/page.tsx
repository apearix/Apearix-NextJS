import { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageHeader } from "@/components/layout/PageHeader";
import { CTASection } from "@/components/sections/CTASection";
import { Cloud, Server, ShieldCheck, Cpu, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Cloud & DevOps Engineering",
  description: "Enterprise cloud infrastructure, automated CI/CD pipelines, Terraform IaC, and 99.99% high availability monitoring.",
  alternates: {
    canonical: "https://www.apearix.com/services/cloud-devops",
  },
  openGraph: {
    title: "Cloud & DevOps Engineering | Apearix",
    description: "Enterprise cloud infrastructure, automated CI/CD pipelines, and high availability.",
    url: "https://www.apearix.com/services/cloud-devops",
  },
};

const jsonLdService = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Cloud & DevOps Engineering",
  "provider": {
    "@type": "Organization",
    "name": "Apearix"
  },
  "serviceType": "Cloud DevOps",
  "areaServed": "Global"
};

export default function CloudDevOpsPage() {
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
          title="Cloud & DevOps"
          subtitle="Enterprise-grade cloud infrastructure, automated CI/CD pipelines, containerization, and zero-downtime deployment environments built for high availability."
          breadcrumbs={[{ label: "Services", href: "/services/cloud-devops" }, { label: "Cloud & DevOps", href: "/services/cloud-devops" }]}
        />

        <section className="py-20 md:py-28 bg-white border-b border-[#E5E7EB]">
          <div className="container max-w-[1280px] mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <span className="text-xs font-bold uppercase tracking-wider text-[#6D28F5] mb-3 block">High Availability</span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#111827] tracking-tight mb-4">
                Reliable Cloud Infrastructure
              </h2>
              <p className="text-base sm:text-lg text-[#4B5563] leading-relaxed">
                We eliminate deployment bottlenecks, optimize server costs, and ensure your products maintain 99.99% uptime under peak load.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-8 rounded-[12px] bg-[#FAFAFC] border border-[#E5E7EB] shadow-sm">
                <div className="w-12 h-12 rounded-[10px] bg-[#F4F0FF] text-[#6D28F5] flex items-center justify-center mb-6">
                  <Cloud className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[#111827] mb-3">AWS & Edge Hosting</h3>
                <p className="text-sm text-[#4B5563] leading-relaxed">
                  Infrastructure as Code (Terraform/CloudFormation) deploying serverless, edge computing, and auto-scaling ECS/EKS clusters.
                </p>
              </div>

              <div className="p-8 rounded-[12px] bg-[#FAFAFC] border border-[#E5E7EB] shadow-sm">
                <div className="w-12 h-12 rounded-[10px] bg-[#F4F0FF] text-[#6D28F5] flex items-center justify-center mb-6">
                  <Server className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[#111827] mb-3">CI/CD Automation</h3>
                <p className="text-sm text-[#4B5563] leading-relaxed">
                  GitHub Actions and GitLab CI pipelines for automated linting, unit testing, preview deployments, and zero-downtime releases.
                </p>
              </div>

              <div className="p-8 rounded-[12px] bg-[#FAFAFC] border border-[#E5E7EB] shadow-sm">
                <div className="w-12 h-12 rounded-[10px] bg-[#F4F0FF] text-[#6D28F5] flex items-center justify-center mb-6">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[#111827] mb-3">Monitoring & Security</h3>
                <p className="text-sm text-[#4B5563] leading-relaxed">
                  Real-time Datadog/Sentry error monitoring, automated database backups, DDoS protection, and SSL/TLS management.
                </p>
              </div>
            </div>
          </div>
        </section>

        <CTASection title="Optimize your cloud infrastructure today." subtitle="Let's audit your DevOps stack and build a resilient infrastructure pipeline." />
      </main>
      <Footer />
    </>
  );
}
