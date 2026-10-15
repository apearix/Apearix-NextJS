import { Metadata } from "next"; 
import BlogIndexClient from "./client";
import { MOCK_BLOGS } from "./data";
export const metadata: Metadata = {
  title: "Engineering Insights & Technical Architecture | Apearix",
  description:
    "Explore in-depth technical blueprints on Next.js performance, custom AI agent architectures, vector pipelines, design systems, and cloud infrastructure.",
  keywords: [
    "Software Engineering Blog",
    "Appsmith Blog Architecture",
    "Next.js Performance Optimization",
    "AI Agent Architecture Guide",
    "Vector Database RAG Deep Dive",
    "DevOps Database Migrations",
  ],
  alternates: {
    canonical: "https://www.apearix.com/resources/blog",
  },
  openGraph: {
    title: "Engineering Insights & Technical Articles | Apearix",
    description:
      "Read technical articles on Next.js performance, custom AI agent architecture, RAG, and DevOps.",
    url: "https://www.apearix.com/resources/blog",
    siteName: "Apearix",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Engineering Insights & Technical Articles | Apearix",
    description:
      "Read technical articles on Next.js performance, custom AI agent architecture, RAG, and DevOps.",
    site: "@apearix",
    creator: "@apearix",
  },
};

export default function BlogPage() {
  return ( 
      <main>
        <BlogIndexClient />
      </main>  
  );
}