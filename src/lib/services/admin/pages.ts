import { clientApi } from "@/lib/clientApi";
import { serverApi } from "@/lib/serverApi";
import { CreatePageInput, UpdatePageInput, PageFormValues, PageStatus } from "@/schemas/page.schema";

export function formatPageItem(item: any): PageFormValues {
  return {
    id: item.id ? String(item.id) : undefined,
    title: item.title || "",
    slug: item.slug || "",
    is_manual_slug: Boolean(item.is_manual_slug),
    content: item.content || "",
    status: (item.status as PageStatus) || "published",
    meta_title: item.meta_title || "",
    meta_description: item.meta_description || "",
    published_at: item.published_at ? new Date(item.published_at).toISOString() : "",
    created_at: item.createdAt ? new Date(item.createdAt).toISOString() : item.created_at || "",
    updated_at: item.updatedAt ? new Date(item.updatedAt).toISOString() : item.updated_at || "",
  };
}

export async function index(
  params?: URLSearchParams
): Promise<{ items: PageFormValues[]; total: number }> {
  try {
    const queryString = params?.toString() ? `?${params.toString()}` : "";
    const response = await serverApi<any>(`/api/v1/admin/pages${queryString}`);
    const rawItems = Array.isArray(response) ? response : response?.data?.items || response?.data || response?.items || [];
    const items = rawItems.map(formatPageItem);
    return { items, total: items.length };
  } catch (error) {
    console.error("Pages Index API Error:", error);
    return { items: [], total: 0 };
  }
}

export async function show(id: string): Promise<PageFormValues | null> {
  try {
    const response = await serverApi<any>(`/api/v1/admin/pages/${id}`);
    const item = response?.data || response;
    return item ? formatPageItem(item) : null;
  } catch (error) {
    console.error("Page Show API Error:", error);
    return null;
  }
}

export async function store(payload: CreatePageInput) {
  try {
    const response = await clientApi<any>("/api/v1/admin/pages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return response;
  } catch (error: any) {
    console.error("Page Store Error:", error);
    throw error;
  }
}

export async function update(id: string, payload: UpdatePageInput) {
  try {
    const response = await clientApi<any>(`/api/v1/admin/pages/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return response;
  } catch (error: any) {
    console.error("Page Update Error:", error);
    throw error;
  }
}

export async function destroy(id: string) {
  try {
    const response = await clientApi<any>(`/api/v1/admin/pages/${id}`, {
      method: "DELETE",
    });
    return response;
  } catch (error: any) {
    console.error("Page Delete Error:", error);
    throw error;
  }
}

export async function bulkUpdateStatus(ids: string[], status: PageStatus) {
  try {
    const response = await clientApi<any>("/api/v1/admin/pages/bulk-status", {
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
    const response = await clientApi<any>("/api/v1/admin/pages/bulk-delete", {
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

export async function bulkImport(items: CreatePageInput[]) {
  try {
    const response = await clientApi<any>("/api/v1/admin/pages/bulk-import", {
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
