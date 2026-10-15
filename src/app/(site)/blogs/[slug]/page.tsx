import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/site/layout/Navbar";
import { Footer } from "@/components/site/layout/Footer";
import BlogShowClient from "./client";
import { MOCK_BLOGS } from "../data"; // <-- client.tsx ke badle data.ts se import karein

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return MOCK_BLOGS.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = MOCK_BLOGS.find((item) => item.slug === slug);

  if (!post) {
    return {
      title: "Article Not Found | Apearix",
    };
  }

  return {
    title: `${post.title} | Apearix Engineering Insights`,
    description: post.snippet,
    keywords: [...post.tags, post.category, "Software Architecture", "Engineering"],
    alternates: {
      canonical: `https://www.apearix.com/resources/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.snippet,
      url: `https://www.apearix.com/resources/blog/${post.slug}`,
      siteName: "Apearix",
      type: "article",
      publishedTime: post.date,
      authors: [post.author.name],
      images: [
        {
          url: post.coverImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.snippet,
      images: [post.coverImage],
      creator: "@apearix",
    },
  };
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const post = MOCK_BLOGS.find((item) => item.slug === slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = MOCK_BLOGS.filter(
    (item) => item.slug !== slug && (item.category === post.category || true)
  ).slice(0, 2);
 
  return ( 
      <main  >
        <BlogShowClient post={post} relatedPosts={relatedPosts} />
      </main> 
  );
}