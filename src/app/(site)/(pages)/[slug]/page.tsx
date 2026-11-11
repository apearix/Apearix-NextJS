import { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/site/layout/PageHeader";
import { fetchPageBySlug, fetchPublishedPages } from "@/lib/services/site/pages";
import type { PageFormValues } from "@/schemas/page.schema";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

const DEFAULT_SAMPLE_PAGES: Record<string, PageFormValues> = {
  "privacy-policy": {
    id: "sample-privacy-policy",
    title: "Privacy Policy",
    slug: "privacy-policy",
    is_manual_slug: true,
    status: "published",
    meta_title: "Privacy Policy | Apearix",
    meta_description:
      "Read the Apearix Privacy Policy to learn how we collect, process, and secure your personal information across our website, SaaS products, and engineering services.",
    published_at: "2026-01-01T00:00:00.000Z",
    content: ``,
  },
  "terms-and-conditions": {
    id: "sample-terms-and-conditions",
    title: "Terms and Conditions",
    slug: "terms-and-conditions",
    is_manual_slug: true,
    status: "published",
    meta_title: "Terms and Conditions | Apearix",
    meta_description:
      "Review the official Terms and Conditions for Apearix. Learn about our service agreements, software licensing, payments, and platform usage guidelines.",
    published_at: "2026-01-01T00:00:00.000Z",
    content: ``,
  },
};

export async function generateStaticParams() {
  try {
    const { items } = await fetchPublishedPages();
    const liveSlugs = items.map((p) => p.slug).filter(Boolean);
    const sampleSlugs = Object.keys(DEFAULT_SAMPLE_PAGES);
    const uniqueSlugs = Array.from(new Set([...liveSlugs, ...sampleSlugs]));
    return uniqueSlugs.map((slug) => ({ slug }));
  } catch {
    return Object.keys(DEFAULT_SAMPLE_PAGES).map((slug) => ({ slug }));
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug).toLowerCase();
  const fetchedPage = await fetchPageBySlug(decodedSlug);
  const page = fetchedPage || DEFAULT_SAMPLE_PAGES[decodedSlug];

  if (!page || (page.status && page.status !== "published")) {
    return {
      title: "Page Not Found | Apearix",
      description: "The requested page could not be found.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const title = page.meta_title?.trim() || `${page.title} | Apearix`;
  const description =
    page.meta_description?.trim() ||
    `Official ${page.title} documentation and details by Apearix.`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://www.apearix.com/${page.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://www.apearix.com/${page.slug}`,
      siteName: "Apearix",
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      site: "@apearix",
      creator: "@apearix",
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function DynamicCustomPage({ params }: PageProps) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug).toLowerCase();

  const fetchedPage = await fetchPageBySlug(decodedSlug);
  const page = fetchedPage || DEFAULT_SAMPLE_PAGES[decodedSlug];

  if (!page || (page.status && page.status !== "published")) {
    notFound();
  }

  const formattedDate = page.updated_at || page.published_at
    ? new Date(page.updated_at || page.published_at!).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })
    : null;

  const badge = decodedSlug.includes("privacy")
    ? "Legal Compliance"
    : decodedSlug.includes("term")
      ? "Legal Terms"
      : "Information";

  const subtitle = formattedDate
    ? `Last updated: ${formattedDate}. ${page.meta_description || "This document outlines official guidelines and policies."}`
    : page.meta_description || "Official documentation and information.";

  const jsonLdPage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `https://www.apearix.com/${page.slug}#webpage`,
    name: page.title,
    url: `https://www.apearix.com/${page.slug}`,
    description: page.meta_description || page.title,
    publisher: {
      "@id": "https://www.apearix.com/#organization",
      name: "Apearix",
    },
    ...(page.published_at ? { datePublished: page.published_at } : {}),
    ...(page.updated_at ? { dateModified: page.updated_at } : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdPage) }}
      />
      <main>
        <PageHeader
          title={page.title}
          subtitle={subtitle}
          breadcrumbs={[{ label: page.title, href: `/${page.slug}` }]}
        />

        <section className="py-16 bg-white border-b border-border">
          <div className="container max-w-7xl mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <div
                className="prose prose-slate max-w-none text-body leading-relaxed prose-headings:text-heading prose-headings:font-bold prose-headings:tracking-tight prose-h1:text-3xl prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3 prose-p:text-body prose-p:leading-relaxed prose-a:text-[#6D28F5] prose-a:underline prose-a:font-semibold hover:prose-a:opacity-80 prose-ul:list-disc prose-ul:pl-6 prose-ol:list-decimal prose-ol:pl-6 prose-li:my-1.5 prose-code:text-[#6D28F5] prose-code:bg-primary-light prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-xs prose-strong:text-heading prose-strong:font-semibold"
                dangerouslySetInnerHTML={{ __html: page.content || "<p>No content available.</p>" }}
              />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
