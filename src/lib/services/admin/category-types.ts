import { clientApi } from "@/lib/clientApi";
import { serverApi } from "@/lib/serverApi";
import { CreateCategoryTypeInput, UpdateCategoryTypeInput, CategoryTypeFormValues } from "@/schemas/category-type.schema";

export function formatCategoryTypeItem(item: any): CategoryTypeFormValues {
  return {
    id: item.id ? String(item.id) : undefined,
    name: item.name || "",
    slug: item.slug || "",
    description: item.description || "",
    is_active: item.is_active !== undefined ? Boolean(item.is_active) : true,
    created_at: item.created_at || item.createdAt || "",
    updated_at: item.updated_at || item.updatedAt || "",
    deleted_at: item.deleted_at || null,
  };
}

export async function index(
  params?: URLSearchParams
): Promise<{ items: CategoryTypeFormValues[]; total: number }> {
  try {
    const queryString = params?.toString() ? `?${params.toString()}` : "";
    const response = await serverApi<any>(`/api/v1/admin/category-types${queryString}`);
    const rawItems = Array.isArray(response) ? response : response?.data?.items || response?.data || response?.items || [];
    const items = rawItems.map(formatCategoryTypeItem);
    return { items, total: items.length };
  } catch (error) {
    console.error("CategoryTypes Index API Error:", error);
    return { items: [], total: 0 };
  }
}

export async function show(id: string): Promise<CategoryTypeFormValues | null> {
  try {
    const response = await serverApi<any>(`/api/v1/admin/category-types/${id}`);
    const item = response?.data || response;
    return item ? formatCategoryTypeItem(item) : null;
  } catch (error) {
    console.error("CategoryType Show API Error:", error);
    return null;
  }
}

export async function store(payload: CreateCategoryTypeInput) {
  try {
    const response = await clientApi<any>("/api/v1/admin/category-types", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return response;
  } catch (error: any) {
    console.error("CategoryType Store Error:", error);
    throw error;
  }
}

export async function update(id: string, payload: UpdateCategoryTypeInput) {
  try {
    const response = await clientApi<any>(`/api/v1/admin/category-types/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return response;
  } catch (error: any) {
    console.error("CategoryType Update Error:", error);
    throw error;
  }
}

export async function destroy(id: string) {
  try {
    const response = await clientApi<any>(`/api/v1/admin/category-types/${id}`, {
      method: "DELETE",
    });
    return response;
  } catch (error: any) {
    console.error("CategoryType Delete Error:", error);
    throw error;
  }
}

export async function bulkUpdateStatus(ids: string[], is_active: boolean) {
  try {
    const response = await clientApi<any>("/api/v1/admin/category-types/bulk-status", {
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
    const response = await clientApi<any>("/api/v1/admin/category-types/bulk-delete", {
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

export async function bulkImport(items: CreateCategoryTypeInput[]) {
  try {
    const response = await clientApi<any>("/api/v1/admin/category-types/bulk-import", {
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
