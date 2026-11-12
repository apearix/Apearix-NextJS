import { Metadata } from "next";
import BlogIndexClient from "./client";
import { fetchBlogCategories, fetchPublishedBlogs } from "@/lib/services/site/blogs";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Engineering Insights & Technical Architecture",
  description:
    "Explore in-depth technical blueprints on Next.js performance, custom AI agent architectures, vector pipelines, design systems, and cloud infrastructure.",
  keywords: [
    "Software Engineering Blog",
    "Apearix Engineering Blog",
    "Next.js Performance Optimization",
    "AI Agent Architecture Guide",
    "Vector Database RAG Deep Dive",
    "DevOps Database Migrations",
  ],
  alternates: {
    canonical: "https://www.apearix.com/blogs",
  },
  openGraph: {
    title: "Engineering Insights & Technical Articles | Apearix",
    description:
      "Read technical articles on Next.js performance, custom AI agent architecture, RAG, and DevOps.",
    url: "https://www.apearix.com/blogs",
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

export default async function BlogPage() {
  const [{ items: blogs }, categories] = await Promise.all([
    fetchPublishedBlogs(),
    fetchBlogCategories(),
  ]);

  return (
    <main>
      <BlogIndexClient initialBlogs={blogs} categories={categories} />
    </main>
  );
}
