import { cache } from "react";
import { serverApi } from "@/lib/serverApi";
import { DEFAULT_TIMEZONE, parseApiDate } from "@/lib/timezone";

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
}

export interface BlogTocItem {
  id: string;
  label: string;
  level: 2 | 3;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  snippet: string;
  category: string;
  categorySlug: string | null;
  date: string;
  publishedAt: string | null;
  updatedAt: string | null;
  readTime: string;
  contentHtml: string;
  tocItems: BlogTocItem[];
  featured: boolean;
  coverImage: string;
  author: {
    id?: string;
    name: string;
    role: string;
    avatar: string;
  };
  tags: string[];
  seo: {
    metaTitle: string;
    metaDescription: string;
    canonicalUrl: string;
  };
}

export interface PaginatedBlogsMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface RawSiteAuthor {
  id?: string | number | null;
  first_name?: string | null;
  last_name?: string | null;
  name?: string | null;
  role?: string | null;
  avatar?: string | null;
}

interface RawSiteCategory {
  id?: string | number | null;
  name?: string | null;
  slug?: string | null;
}

export interface RawSiteBlog {
  id?: string | number | null;
  slug?: string | null;
  title?: string | null;
  excerpt?: string | null;
  content?: string | null;
  featured_image?: string | null;
  featured?: boolean | null;
  tags?: unknown[] | null;
  author?: RawSiteAuthor | null;
  author_name?: string | null;
  category?: RawSiteCategory | null;
  published_at?: string | null;
  created_at?: string | null;
  createdAt?: string | null;
  updated_at?: string | null;
  updatedAt?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
  canonical_url?: string | null;
}

interface ListWrapper<T> {
  items?: T[];
}

type SiteApiListResponse<T> =
  | T[]
  | {
      data?: T[] | ListWrapper<T>;
      items?: T[];
      meta?: Partial<PaginatedBlogsMeta>;
    };

type SiteApiSingleResponse<T> = T | { data?: T };

function extractListItems<T>(response: SiteApiListResponse<T>): T[] {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  if (response?.data && !Array.isArray(response.data) && Array.isArray(response.data.items)) {
    return response.data.items;
  }
  if (Array.isArray(response?.items)) return response.items;
  return [];
}

const HTML_ENTITY_MAP: Record<string, string> = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
  "&#x27;": "'",
  "&apos;": "'",
  "&nbsp;": " ",
  "&ndash;": "-",
  "&mdash;": "—",
  "&lsquo;": "'",
  "&rsquo;": "'",
  "&ldquo;": '"',
  "&rdquo;": '"',
};

function decodeHtmlEntities(text: string): string {
  return text.replace(
    /&(?:amp|lt|gt|quot|#39|#x27|apos|nbsp|ndash|mdash|lsquo|rsquo|ldquo|rdquo);/gi,
    (entity) => HTML_ENTITY_MAP[entity.toLowerCase()] ?? entity
  );
}

function stripHtmlTags(html: string): string {
  return decodeHtmlEntities(html.replace(/<[^>]*>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function slugifyHeading(text: string): string {
  const slug = text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return slug || "section";
}

function calculateReadTime(content: string): string {
  const plainText = stripHtmlTags(content);
  if (!plainText) return "1 min read";
  const words = plainText.split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
}

function formatBlogDate(dateValue?: string | Date | null): string {
  const parsed = parseApiDate(dateValue);
  if (!parsed) return "";

  return new Intl.DateTimeFormat("en-US", {
    timeZone: DEFAULT_TIMEZONE,
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(parsed);
}

function buildSnippet(excerpt: string | null | undefined, content: string): string {
  const cleanExcerpt = excerpt?.trim();
  if (cleanExcerpt) return cleanExcerpt;

  const plainContent = stripHtmlTags(content);
  if (!plainContent) return "";
  if (plainContent.length <= 165) return plainContent;
  return `${plainContent.slice(0, 162).trimEnd()}...`;
}

export function processBlogContent(rawContent?: string | null): {
  contentHtml: string;
  tocItems: BlogTocItem[];
} {
  const trimmed = rawContent?.trim() || "";
  if (!trimmed) {
    return {
      contentHtml: "<p>No content available.</p>",
      tocItems: [],
    };
  }

  const hasHtmlTags = /<[a-z][\s\S]*>/i.test(trimmed);
  if (!hasHtmlTags) {
    const paragraphs = trimmed
      .split(/\r?\n\r?\n|\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => `<p>${escapeHtml(line)}</p>`)
      .join("");

    return {
      contentHtml: paragraphs || `<p>${escapeHtml(trimmed)}</p>`,
      tocItems: [],
    };
  }

  const allHeadings: BlogTocItem[] = [];
  const usedIds = new Map<string, number>();

  const contentHtml = trimmed.replace(
    /<h([23])([^>]*)>([\s\S]*?)<\/h\1>/gi,
    (fullMatch, levelStr: string, attrs: string, innerHtml: string) => {
      const label = stripHtmlTags(innerHtml);
      if (!label) return fullMatch;

      const existingIdMatch = attrs.match(/\sid\s*=\s*["']([^"']+)["']/i);
      let id: string;
      let nextAttrs = attrs;

      if (existingIdMatch?.[1]) {
        id = existingIdMatch[1];
        usedIds.set(id, (usedIds.get(id) ?? 0) + 1);
      } else {
        const baseId = slugifyHeading(label);
        const count = usedIds.get(baseId) ?? 0;
        usedIds.set(baseId, count + 1);
        id = count === 0 ? baseId : `${baseId}-${count + 1}`;
        nextAttrs = `${attrs} id="${id}"`;
      }

      allHeadings.push({
        id,
        label,
        level: Number(levelStr) as 2 | 3,
      });

      return `<h${levelStr}${nextAttrs}>${innerHtml}</h${levelStr}>`;
    }
  );

  const h2Headings = allHeadings.filter((item) => item.level === 2);
  const tocItems = h2Headings.length > 0 ? h2Headings : allHeadings;

  return { contentHtml, tocItems };
}

export function formatSiteBlogItem(item: RawSiteBlog, isFeatured = false): BlogPost {
  const rawContent = typeof item?.content === "string" ? item.content : "";
  const { contentHtml, tocItems } = processBlogContent(rawContent);

  const authorObj = item?.author && typeof item.author === "object" ? item.author : null;
  const authorName = authorObj
    ? [authorObj.first_name, authorObj.last_name].filter(Boolean).join(" ").trim() ||
      authorObj.name ||
      "Apearix Editorial"
    : item?.author_name?.trim() || "Apearix Editorial";

  const rawDate = item?.published_at || item?.created_at || item?.createdAt || null;
  const parsedDate = parseApiDate(rawDate);
  const publishedAt = parsedDate ? parsedDate.toISOString() : null;

  const rawUpdated = item?.updated_at || item?.updatedAt || null;
  const parsedUpdated = parseApiDate(rawUpdated);
  const updatedAt = parsedUpdated ? parsedUpdated.toISOString() : null;

  const categoryObj = item?.category && typeof item.category === "object" ? item.category : null;
  const categoryName = categoryObj?.name?.trim() || "General";
  const categorySlug = categoryObj?.slug?.trim() || null;

  const tags = Array.isArray(item?.tags)
    ? item.tags.map((t: unknown) => String(t).trim()).filter(Boolean)
    : [];

  return {
    id: String(item?.id || item?.slug || ""),
    slug: String(item?.slug || ""),
    title: String(item?.title || ""),
    snippet: buildSnippet(item?.excerpt, rawContent),
    category: categoryName,
    categorySlug,
    date: formatBlogDate(rawDate),
    publishedAt,
    updatedAt,
    readTime: calculateReadTime(rawContent || item?.excerpt || ""),
    contentHtml,
    tocItems,
    featured: Boolean(item?.featured) || isFeatured,
    coverImage: typeof item?.featured_image === "string" ? item.featured_image.trim() : "",
    author: {
      id: authorObj?.id ? String(authorObj.id) : undefined,
      name: authorName,
      role: authorObj?.role?.trim() || "Apearix Engineering",
      avatar: typeof authorObj?.avatar === "string" ? authorObj.avatar.trim() : "",
    },
    tags,
    seo: {
      metaTitle: typeof item?.meta_title === "string" ? item.meta_title.trim() : "",
      metaDescription:
        typeof item?.meta_description === "string" ? item.meta_description.trim() : "",
      canonicalUrl: typeof item?.canonical_url === "string" ? item.canonical_url.trim() : "",
    },
  };
}

export async function fetchPublishedBlogs(params?: {
  search?: string;
  category?: string;
  page?: number;
  limit?: number;
}): Promise<{
  items: BlogPost[];
  total: number;
  meta?: PaginatedBlogsMeta;
}> {
  try {
    const searchParams = new URLSearchParams();
    if (params?.search?.trim()) {
      searchParams.set("search", params.search.trim());
    }
    if (
      params?.category?.trim() &&
      params.category !== "all" &&
      params.category !== "All Articles"
    ) {
      searchParams.set("category", params.category.trim());
    }
    if (params?.page !== undefined && params.page > 0) {
      searchParams.set("page", String(params.page));
    }
    if (params?.limit !== undefined && params.limit > 0) {
      searchParams.set("limit", String(params.limit));
    }

    const query = searchParams.toString() ? `?${searchParams.toString()}` : "";
    const response = await serverApi<SiteApiListResponse<RawSiteBlog>>(
      `/api/v1/blogs${query}`,
      {
        next: { revalidate: 60, tags: ["blogs"] },
      },
      false
    );

    const validItems = extractListItems(response);
    const isFirstPage = !params?.page || params.page === 1;
    const items = validItems.map((item, idx) =>
      formatSiteBlogItem(item, isFirstPage && idx === 0)
    );

    const rawMeta = !Array.isArray(response) ? response?.meta : undefined;
    const meta: PaginatedBlogsMeta | undefined = rawMeta
      ? {
          total: Number(rawMeta.total ?? items.length),
          page: Number(rawMeta.page ?? 1),
          limit: Number(rawMeta.limit ?? items.length),
          totalPages: Number(rawMeta.totalPages ?? 1),
        }
      : undefined;

    return {
      items,
      total: meta?.total ?? items.length,
      meta,
    };
  } catch (error) {
    console.error("Fetch Published Blogs Error:", error);
    return { items: [], total: 0 };
  }
}

export async function fetchBlogCategories(): Promise<BlogCategory[]> {
  try {
    const response = await serverApi<SiteApiListResponse<RawSiteCategory>>(
      "/api/v1/categories?type=blogs",
      {
        next: { revalidate: 60, tags: ["blogs", "blog-categories"] },
      },
      false
    );

    return extractListItems(response)
      .filter(
        (c): c is RawSiteCategory & { id: string | number; name: string; slug: string } =>
          Boolean(c && c.id != null && c.name && c.slug)
      )
      .map((c) => ({
        id: String(c.id),
        name: String(c.name).trim(),
        slug: String(c.slug).trim(),
      }));
  } catch (error) {
    console.error("Fetch Blog Categories Error:", error);
    return [];
  }
}

export const fetchBlogBySlug = cache(async (slugOrId: string): Promise<BlogPost | null> => {
  const cleanSlug = slugOrId?.trim();
  if (!cleanSlug) return null;

  try {
    const response = await serverApi<SiteApiSingleResponse<RawSiteBlog>>(
      `/api/v1/blogs/${encodeURIComponent(cleanSlug)}`,
      {
        next: { revalidate: 60, tags: [`blog-${cleanSlug}`, "blogs"] },
      },
      false
    );

    const item =
      response && typeof response === "object" && "data" in response && response.data && !Array.isArray(response.data)
        ? response.data
        : (response as RawSiteBlog);

    if (!item || !item.id || !item.slug) {
      return null;
    }

    return formatSiteBlogItem(item);
  } catch (error) {
    console.error(`Fetch Blog (${cleanSlug}) Error:`, error);
    return null;
  }
});
