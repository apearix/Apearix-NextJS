import { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogShowClient from "./client";
import { fetchBlogBySlug, fetchPublishedBlogs } from "@/lib/services/site/blogs";

export const revalidate = 60;

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

const APP_BASE_URL = (process.env.NEXT_PUBLIC_APP_URL || "https://www.apearix.com").replace(/\/$/, "");

function resolveOgImageUrl(coverImage?: string): string | null {
  if (!coverImage) return null;
  if (coverImage.startsWith("http://") || coverImage.startsWith("https://")) {
    return coverImage;
  }
  if (coverImage.startsWith("/")) {
    return `${APP_BASE_URL}${coverImage}`;
  }
  return null;
}

export async function generateStaticParams() {
  try {
    const { items } = await fetchPublishedBlogs();
    return items
      .map((post) => post.slug)
      .filter(Boolean)
      .map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const post = await fetchBlogBySlug(decodedSlug);

  if (!post) {
    return {
      title: "Article Not Found",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const resolvedTitle = post.seo.metaTitle
    ? /apearix/i.test(post.seo.metaTitle)
      ? { absolute: post.seo.metaTitle }
      : post.seo.metaTitle
    : `${post.title} | Engineering Insights`;
  const metaDescription = post.seo.metaDescription || post.snippet;
  const canonicalUrl = post.seo.canonicalUrl || `https://www.apearix.com/blogs/${post.slug}`;
  const ogImageUrl = resolveOgImageUrl(post.coverImage);

  return {
    title: resolvedTitle,
    description: metaDescription,
    keywords: [...post.tags, post.category, "Software Architecture", "Engineering"].filter(Boolean),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: post.seo.metaTitle || post.title,
      description: metaDescription,
      url: canonicalUrl,
      siteName: "Apearix",
      type: "article",
      ...(post.publishedAt ? { publishedTime: post.publishedAt } : {}),
      authors: [post.author.name],
      ...(ogImageUrl
        ? {
            images: [
              {
                url: ogImageUrl,
                width: 1200,
                height: 630,
                alt: post.title,
              },
            ],
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: post.seo.metaTitle || post.title,
      description: metaDescription,
      ...(ogImageUrl ? { images: [ogImageUrl] } : {}),
      creator: "@apearix",
    },
  };
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  const [post, { items: allBlogs }] = await Promise.all([
    fetchBlogBySlug(decodedSlug),
    fetchPublishedBlogs(),
  ]);

  if (!post) {
    notFound();
  }

  const otherPosts = allBlogs.filter(
    (item) => item.slug !== post.slug && item.id !== post.id
  );
  const sameCategoryPosts = otherPosts.filter(
    (item) => item.category === post.category
  );
  const fallbackPosts = otherPosts.filter(
    (item) => item.category !== post.category
  );
  const relatedPosts = [...sameCategoryPosts, ...fallbackPosts].slice(0, 3);

  const canonicalUrl = post.seo.canonicalUrl || `https://www.apearix.com/blogs/${post.slug}`;
  const ogImageUrl = resolveOgImageUrl(post.coverImage);

  const jsonLdArticle = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${canonicalUrl}#article`,
    headline: post.title,
    description: post.seo.metaDescription || post.snippet,
    url: canonicalUrl,
    ...(ogImageUrl ? { image: ogImageUrl } : {}),
    ...(post.publishedAt ? { datePublished: post.publishedAt } : {}),
    ...(post.updatedAt ? { dateModified: post.updatedAt } : {}),
    author: {
      "@type": "Person",
      name: post.author.name,
    },
    publisher: {
      "@id": "https://www.apearix.com/#organization",
      name: "Apearix",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdArticle) }}
      />
      <main>
        <BlogShowClient post={post} relatedPosts={relatedPosts} />
      </main>
    </>
  );
}
