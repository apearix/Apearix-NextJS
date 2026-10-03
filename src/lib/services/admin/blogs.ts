import { clientApi } from "@/lib/clientApi";
import { serverApi } from "@/lib/serverApi";
import { CreateBlogInput, UpdateBlogInput, PostFormValues, PostStatus } from "@/schemas/blog.schema";

export const AUTHOR_MAP: Record<string, string> = {
  "1": "Dharmendra (Admin)",
  "2": "Editorial Team",
};

export function getAuthorName(authorId?: string): string {
  if (!authorId) return "Dharmendra (Admin)";
  return AUTHOR_MAP[authorId] || authorId;
}

export function formatBlogItem(item: any): PostFormValues {
  return {
    id: item.id ? String(item.id) : undefined,
    title: item.title || "",
    slug: item.slug || "",
    is_manual_slug: Boolean(item.is_manual_slug),
    excerpt: item.excerpt || "",
    content: item.content || "",
    featured_image: item.featured_image || "",
    publishing: {
      status: (item.publishing?.status as PostStatus) || "draft",
      author_id: item.publishing?.author_id || "1",
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
