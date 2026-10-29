import { clientApi } from "@/lib/clientApi";
import { serverApi } from "@/lib/serverApi";
import { CreateBlogInput, UpdateBlogInput, PostFormValues, PostStatus } from "@/schemas/blog.schema";

export const AUTHOR_MAP: Record<string, string> = {
  "1": "Dharmendra (Admin)",
  "2": "Editorial Team",
};

export function registerAuthor(authorId: string, name: string) {
  if (authorId && name) {
    AUTHOR_MAP[authorId] = name;
  }
}

export function getAuthorName(authorId?: string | null, author?: any, authorName?: string | null): string {
  if (authorName && authorName.trim()) {
    if (authorId) AUTHOR_MAP[authorId] = authorName.trim();
    return authorName.trim();
  }

  if (author && typeof author === "object") {
    const fullName = `${author.first_name || ""} ${author.last_name || ""}`.trim();
    if (fullName) {
      if (authorId || author.id) AUTHOR_MAP[authorId || author.id] = fullName;
      return fullName;
    }
    if (author.name) {
      if (authorId || author.id) AUTHOR_MAP[authorId || author.id] = author.name;
      return author.name;
    }
    if (author.email) {
      if (authorId || author.id) AUTHOR_MAP[authorId || author.id] = author.email;
      return author.email;
    }
  }

  if (!authorId) return "Dharmendra (Admin)";
  if (AUTHOR_MAP[authorId]) return AUTHOR_MAP[authorId];

  return "Dharmendra (Admin)";
}

export function formatBlogItem(item: any): PostFormValues {
  const categoryId = item.publishing?.category_id || item.category_id || item.category?.id || "";
  const authorObj = item.author && typeof item.author === "object" ? item.author : null;
  const authorName = item.author_name || (authorObj ? `${authorObj.first_name || ""} ${authorObj.last_name || ""}`.trim() || authorObj.email : undefined);
  const authorId = item.publishing?.author_id || item.author_id || authorObj?.id || "1";

  if (authorId && authorName) {
    AUTHOR_MAP[String(authorId)] = authorName;
  }

  return {
    id: item.id ? String(item.id) : undefined,
    title: item.title || "",
    slug: item.slug || "",
    is_manual_slug: Boolean(item.is_manual_slug),
    excerpt: item.excerpt || "",
    content: item.content || "",
    featured_image: item.featured_image || "",
    category_id: categoryId,
    category: item.category && typeof item.category === "object" ? item.category : null,
    author: authorObj,
    author_name: authorName,
    publishing: {
      status: (item.publishing?.status as PostStatus) || "draft",
      author_id: String(authorId),
      category_id: categoryId,
      published_at: item.publishing?.published_at || "",
    },
    seo: {
      meta_title: item.seo?.meta_title || "",
      meta_description: item.seo?.meta_description || "",
      canonical_url: item.seo?.canonical_url || "",
    },
    updated_at: item.updatedAt ? new Date(item.updatedAt).toISOString() : item.updated_at || "",
  };
}

export async function fetchBlogAuthors(): Promise<{ id: string; name: string }[]> {
  try {
    const response = await clientApi<any>("/api/v1/admin/users");
    const rawItems = Array.isArray(response) ? response : response?.data?.items || response?.data || response?.items || [];
    const authors = rawItems.map((u: any) => {
      const name = `${u.first_name || ""} ${u.last_name || ""}`.trim() || u.email || "Author";
      if (u.id) {
        AUTHOR_MAP[String(u.id)] = name;
      }
      return {
        id: String(u.id),
        name,
      };
    });
    return authors.length > 0 ? authors : [
      { id: "1", name: "Dharmendra (Admin)" },
      { id: "2", name: "Editorial Team" },
    ];
  } catch (error) {
    console.error("Failed to fetch blog authors:", error);
    return [
      { id: "1", name: "Dharmendra (Admin)" },
      { id: "2", name: "Editorial Team" },
    ];
  }
}

export async function fetchBlogCategories(): Promise<{ id: string; name: string; slug: string }[]> {
  try {
    const response = await clientApi<any>("/api/v1/admin/categories");
    const rawItems = Array.isArray(response) ? response : response?.data?.items || response?.data || response?.items || [];
    const blogCategories = rawItems.filter((c: any) => c.category_type?.slug === "blogs");
    return blogCategories.length > 0 ? blogCategories : rawItems;
  } catch (error) {
    console.error("Failed to fetch blog categories:", error);
    return [];
  }
}

export async function uploadImage(file: File): Promise<{ url: string; filename: string }> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await clientApi<any>("/api/v1/admin/blogs/upload", {
    method: "POST",
    body: formData,
  });

  if (!response?.url) {
    throw new Error(response?.message || "Failed to upload image");
  }

  return response;
}

export async function index(
  params?: URLSearchParams
): Promise<{ items: PostFormValues[]; total: number }> {
  try {
    const queryString = params?.toString() ? `?${params.toString()}` : "";
    const response = await serverApi<any>(`/api/v1/admin/blogs${queryString}`);
    const rawItems = Array.isArray(response) ? response : response?.data?.items || response?.items || [];
    const items = rawItems.map(formatBlogItem);
    return { items, total: items.length };
  } catch (error) {
    console.error("Blogs Index API Error:", error);
    return { items: [], total: 0 };
  }
}

export async function show(id: string): Promise<PostFormValues | null> {
  try {
    const response = await serverApi<any>(`/api/v1/admin/blogs/${id}`);
    const item = response?.data || response;
    return item ? formatBlogItem(item) : null;
  } catch (error) {
    console.error("Blog Show API Error:", error);
    return null;
  }
}

export async function store(payload: CreateBlogInput) {
  try {
    const response = await clientApi<any>("/api/v1/admin/blogs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return response;
  } catch (error: any) {
    console.error("Blog Store Error:", error);
    throw error;
  }
}

export async function update(id: string, payload: UpdateBlogInput) {
  try {
    const response = await clientApi<any>(`/api/v1/admin/blogs/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return response;
  } catch (error: any) {
    console.error("Blog Update Error:", error);
    throw error;
  }
}

export async function destroy(id: string) {
  try {
    const response = await clientApi<any>(`/api/v1/admin/blogs/${id}`, {
      method: "DELETE",
    });
    return response;
  } catch (error: any) {
    console.error("Blog Delete Error:", error);
    throw error;
  }
}

export async function bulkUpdateStatus(ids: string[], status: PostStatus) {
  try {
    const response = await clientApi<any>("/api/v1/admin/blogs/bulk-status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids, status }),
    });
    return response;
  } catch (error: any) {
    console.error("Bulk Status Error:", error);
    throw error;
  }
}

export async function bulkDelete(ids: string[]) {
  try {
    const response = await clientApi<any>("/api/v1/admin/blogs/bulk-delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids }),
    });
    return response;
  } catch (error: any) {
    console.error("Bulk Delete Error:", error);
    throw error;
  }
}

export async function bulkImport(items: CreateBlogInput[]) {
  try {
    const response = await clientApi<any>("/api/v1/admin/blogs/bulk-import", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items }),
    });
    return response;
  } catch (error: any) {
    console.error("Bulk Import Error:", error);
    throw error;
  }
}
