import { clientApi } from "@/lib/clientApi";
import { serverApi } from "@/lib/serverApi";
import { CreateFaqInput, UpdateFaqInput, FaqFormValues } from "@/schemas/faq.schema";

export function formatFaqItem(item: any): FaqFormValues {
  return {
    id: item.id ? String(item.id) : undefined,
    question: item.question || item.title || "",
    answer: item.answer || item.description || "",
    category: item.category || "general",
    order: item.order !== undefined ? Number(item.order) : 0,
    is_active: item.is_active !== undefined ? Boolean(item.is_active) : (item.is_published !== undefined ? Boolean(item.is_published) : true),
    created_at: item.createdAt ? new Date(item.createdAt).toISOString() : item.created_at || "",
    updated_at: item.updatedAt ? new Date(item.updatedAt).toISOString() : item.updated_at || "",
  };
}

export async function index(
  params?: URLSearchParams
): Promise<{ items: FaqFormValues[]; total: number }> {
  try {
    const queryString = params?.toString() ? `?${params.toString()}` : "";
    const response = await serverApi<any>(`/api/v1/admin/faqs${queryString}`);
    const rawItems = Array.isArray(response) ? response : response?.data?.items || response?.data || response?.items || [];
    const items = rawItems.map(formatFaqItem);
    return { items, total: items.length };
  } catch (error) {
    console.error("FAQs Index API Error:", error);
    return { items: [], total: 0 };
  }
}

export async function show(id: string): Promise<FaqFormValues | null> {
  try {
    const response = await serverApi<any>(`/api/v1/admin/faqs/${id}`);
    const item = response?.data || response;
    return item ? formatFaqItem(item) : null;
  } catch (error) {
    console.error("FAQ Show API Error:", error);
    return null;
  }
}

export async function store(payload: CreateFaqInput) {
  try {
    const response = await clientApi<any>("/api/v1/admin/faqs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return response;
  } catch (error: any) {
    console.error("FAQ Store Error:", error);
    throw error;
  }
}

export async function update(id: string, payload: UpdateFaqInput) {
  try {
    const response = await clientApi<any>(`/api/v1/admin/faqs/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return response;
  } catch (error: any) {
    console.error("FAQ Update Error:", error);
    throw error;
  }
}

export async function destroy(id: string) {
  try {
    const response = await clientApi<any>(`/api/v1/admin/faqs/${id}`, {
      method: "DELETE",
    });
    return response;
  } catch (error: any) {
    console.error("FAQ Delete Error:", error);
    throw error;
  }
}

export async function bulkUpdateStatus(ids: string[], is_active: boolean) {
  try {
    const response = await clientApi<any>("/api/v1/admin/faqs/bulk-status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids, is_active }),
    });
    return response;
  } catch (error: any) {
    console.error("Bulk Status Error:", error);
    throw error;
  }
}

export async function bulkDelete(ids: string[]) {
  try {
    const response = await clientApi<any>("/api/v1/admin/faqs/bulk-delete", {
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

export async function bulkImport(items: CreateFaqInput[]) {
  try {
    const response = await clientApi<any>("/api/v1/admin/faqs/bulk-import", {
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
