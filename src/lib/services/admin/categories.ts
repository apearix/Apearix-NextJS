import { clientApi } from "@/lib/clientApi";
import { serverApi } from "@/lib/serverApi";
import { CreateCategoryInput, UpdateCategoryInput, CategoryFormValues } from "@/schemas/category.schema";

export function formatCategoryItem(item: any): CategoryFormValues {
  return {
    id: item.id ? String(item.id) : undefined,
    name: item.name || "",
    slug: item.slug || "",
    description: item.description || "",
    icon_or_image: item.icon_or_image || item.image || "",
    order: item.order !== undefined ? Number(item.order) : 0,
    is_active: item.is_active !== undefined ? Boolean(item.is_active) : true,
    category_type_id: item.category_type_id || item.category_type?.id || "",
    parent_id: item.parent_id || item.parent?.id || "",
    meta_title: item.meta_title || "",
    meta_description: item.meta_description || "",
    created_at: item.created_at || item.createdAt || "",
    updated_at: item.updated_at || item.updatedAt || "",
    deleted_at: item.deleted_at || null,
    category_type: item.category_type || null,
    parent: item.parent || null,
  };
}

export async function index(
  params?: URLSearchParams
): Promise<{ items: CategoryFormValues[]; total: number }> {
  try {
    const queryString = params?.toString() ? `?${params.toString()}` : "";
    const response = await serverApi<any>(`/api/v1/admin/categories${queryString}`);
    const rawItems = Array.isArray(response) ? response : response?.data?.items || response?.data || response?.items || [];
    const items = rawItems.map(formatCategoryItem);
    return { items, total: items.length };
  } catch (error) {
    console.error("Categories Index API Error:", error);
    return { items: [], total: 0 };
  }
}

export async function show(id: string): Promise<CategoryFormValues | null> {
  try {
    const response = await serverApi<any>(`/api/v1/admin/categories/${id}`);
    const item = response?.data || response;
    return item ? formatCategoryItem(item) : null;
  } catch (error) {
    console.error("Category Show API Error:", error);
    return null;
  }
}

export async function store(payload: CreateCategoryInput) {
  try {
    const response = await clientApi<any>("/api/v1/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return response;
  } catch (error: any) {
    console.error("Category Store Error:", error);
    throw error;
  }
}

export async function update(id: string, payload: UpdateCategoryInput) {
  try {
    const response = await clientApi<any>(`/api/v1/admin/categories/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return response;
  } catch (error: any) {
    console.error("Category Update Error:", error);
    throw error;
  }
}

export async function destroy(id: string) {
  try {
    const response = await clientApi<any>(`/api/v1/admin/categories/${id}`, {
      method: "DELETE",
    });
    return response;
  } catch (error: any) {
    console.error("Category Delete Error:", error);
    throw error;
  }
}

export async function bulkUpdateStatus(ids: string[], is_active: boolean) {
  try {
    const response = await clientApi<any>("/api/v1/admin/categories/bulk-status", {
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
    const response = await clientApi<any>("/api/v1/admin/categories/bulk-delete", {
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

export async function bulkImport(items: CreateCategoryInput[]) {
  try {
    const response = await clientApi<any>("/api/v1/admin/categories/bulk-import", {
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

export async function fetchCategoryTypes() {
  try {
    const response = await clientApi<any>("/api/v1/admin/category-types");
    const raw = Array.isArray(response) ? response : response?.data || response?.items || [];
    return raw.map((t: any) => ({ id: String(t.id), name: String(t.name), slug: String(t.slug) }));
  } catch (error) {
    console.error("Fetch Category Types Error:", error);
    return [];
  }
}
