import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SERVICES_DATA } from "../data";
import { ServiceDetailPage } from "@/components/site/services/ServiceDetailPage";

type ServiceRouteParams = { slug: string };

export function generateStaticParams() {
  return SERVICES_DATA.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: { params: Promise<ServiceRouteParams> }): Promise<Metadata> {
  const { slug } = await params;
  const service = SERVICES_DATA.find((item) => item.slug === slug);

  if (!service) return { title: "Service not found | Apearix" };

  return {
    title: `${service.title} | Apearix`,
    description: service.shortDescription,
    keywords: [service.title, service.badge, "Apearix services", "software engineering"],
    alternates: { canonical: `https://www.apearix.com/services/${service.slug}` },
    openGraph: {
      title: `${service.title} | Apearix`,
      description: service.shortDescription,
      url: `https://www.apearix.com/services/${service.slug}`,
      siteName: "Apearix",
      locale: "en_US",
      type: "website",
    },
  };
}

export default async function ServicePage({ params }: { params: Promise<ServiceRouteParams> }) {
  const { slug } = await params;
  const service = SERVICES_DATA.find((item) => item.slug === slug);

  if (!service) notFound();

  const jsonLdService = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `https://www.apearix.com/services/${service.slug}/#service`,
    name: service.title,
    serviceType: service.badge,
    url: `https://www.apearix.com/services/${service.slug}`,
    provider: { "@type": "Organization", name: "Apearix", url: "https://www.apearix.com" },
    areaServed: "Global",
    description: service.shortDescription,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdService) }} />
      <ServiceDetailPage service={service} />
    </>
  );
}
