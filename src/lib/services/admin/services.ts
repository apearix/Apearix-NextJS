import { clientApi } from "@/lib/clientApi";
import { serverApi } from "@/lib/serverApi";
import { makeDefaultPagination } from "./common";
import {
  type ServiceFormValues,
  type CreateServiceInput,
  type UpdateServiceInput,
} from "@/schemas/service.schema";

export type { ServiceFormValues, CreateServiceInput, UpdateServiceInput };

export interface ServiceEntity extends ServiceFormValues {}

export function formatServiceItem(item: any): ServiceFormValues {
  const categoryRelation =
    item.category && typeof item.category === "object"
      ? item.category
      : item.category_relation && typeof item.category_relation === "object"
      ? item.category_relation
      : item.category
      ? { id: item.category_id || "", name: String(item.category), slug: String(item.category) }
      : null;

  const categoryId = item.category_id || (item.category?.id ? String(item.category.id) : "");

  return {
    id: item.id ? String(item.id) : undefined,
    title: item.title || item.name || "",
    slug: item.slug || "",
    is_manual_slug: item.is_manual_slug !== undefined ? Boolean(item.is_manual_slug) : false,
    category_id: categoryId,
    category: categoryRelation,
    icon: item.icon || "layout",
    featured_image: item.featured_image || item.image || item.image_or_thumbnail || "",
    excerpt: item.excerpt || "",
    description: item.description || "",
    order: item.order !== undefined ? Number(item.order) : 0,
    is_active:
      item.is_active !== undefined
        ? Boolean(item.is_active)
        : item.status === "active"
        ? true
        : item.is_published !== undefined
        ? Boolean(item.is_published)
        : true,
    seo: {
      meta_title: item.seo?.meta_title || item.meta_title || "",
      meta_description: item.seo?.meta_description || item.meta_description || "",
      canonical_url: item.seo?.canonical_url || item.canonical_url || "",
    },
    created_at: item.createdAt ? new Date(item.createdAt).toISOString() : item.created_at || "",
    updated_at: item.updatedAt ? new Date(item.updatedAt).toISOString() : item.updated_at || "",
  };
}

export async function fetchServiceCategories(): Promise<{ id: string; name: string; slug: string }[]> {
  try {
    const response = await clientApi<any>("/api/v1/admin/categories");
    const rawItems = Array.isArray(response)
      ? response
      : response?.data?.items || response?.data || response?.items || [];
    const serviceCategories = rawItems.filter((c: any) => c.category_type?.slug === "services");
    return serviceCategories.length > 0 ? serviceCategories : rawItems;
  } catch (error) {
    console.error("Failed to fetch service categories:", error);
    return [];
  }
}

export async function index(
  params?: URLSearchParams
): Promise<{ items: ServiceFormValues[]; pagination: any; total: number }> {
  const page = Number(params?.get("page")) || 1;
  const limit = Number(params?.get("limit")) || 10;
  const queryString = params?.toString() ? `?${params.toString()}` : "";

  try {
    const response = await serverApi<any>(`/api/v1/admin/services${queryString}`);
    const rawItems =
      response?.data?.items || response?.data || (Array.isArray(response) ? response : response?.items || []);
    const items = Array.isArray(rawItems) ? rawItems.map(formatServiceItem) : [];
    const apiPagination = response?.data?.pagination || response?.pagination;
    const pagination = apiPagination || makeDefaultPagination(items.length, page, limit);

    return { items, pagination, total: pagination.total ?? items.length };
  } catch (error) {
    console.error("Services API Error:", error);
    return { items: [], pagination: makeDefaultPagination(0, page, limit), total: 0 };
  }
}

export async function show(id: string): Promise<ServiceFormValues | null> {
  try {
    const response = await serverApi<any>(`/api/v1/admin/services/${id}`);
    const item = response?.data || response;
    return item ? formatServiceItem(item) : null;
  } catch (error) {
    console.error("Service Show Error:", error);
    return null;
  }
}

export async function store(payload: CreateServiceInput | any) {
  try {
    const response = await clientApi<any>("/api/v1/admin/services", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload instanceof FormData ? payload : JSON.stringify(payload),
    });

    return response;
  } catch (error: any) {
    console.error("Service Store Error:", error);
    throw error;
  }
}

export async function update(id: string, payload: UpdateServiceInput | any) {
  try {
    return await clientApi<any>(`/api/v1/admin/services/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: payload instanceof FormData ? payload : JSON.stringify(payload),
    });
  } catch (error: any) {
    console.error("Service Update Error:", error);
    throw error;
  }
}

export async function destroy(id: string) {
  try {
    return await clientApi<any>(`/api/v1/admin/services/${id}`, {
      method: "DELETE",
    });
  } catch (error: any) {
    console.error("Service Delete Error:", error);
    throw error;
  }
}

export async function bulkUpdateStatus(ids: string[], is_active: boolean) {
  try {
    const response = await clientApi<any>("/api/v1/admin/services/bulk-status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids, is_active }),
    });
    return response;
  } catch (error) {
    // Graceful fallback to individual updates if bulk endpoint is not available
    return Promise.all(ids.map((id) => update(id, { is_active })));
  }
}

export async function bulkDelete(ids: string[]) {
  try {
    const response = await clientApi<any>("/api/v1/admin/services/bulk-delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids }),
    });
    return response;
  } catch (error) {
    // Graceful fallback to individual deletes
    return Promise.all(ids.map((id) => destroy(id)));
  }
}

export async function bulkImport(items: any[]) {
  try {
    const response = await clientApi<any>("/api/v1/admin/services/bulk-import", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items }),
    });
    return response;
  } catch (error) {
    // Graceful fallback to sequential creation
    const created: any[] = [];
    for (const item of items) {
      const res = await store(item);
      created.push(res);
    }
    return { count: created.length, items: created };
  }
}

export async function uploadServiceImage(file: File): Promise<{ url: string; filename: string }> {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await clientApi<any>("/api/v1/admin/services/upload", {
      method: "POST",
      body: formData,
    });
    if (response?.url) return response;
  } catch (err) {
    // Fallback to blogs upload or local object URL
  }

  try {
    const response = await clientApi<any>("/api/v1/admin/blogs/upload", {
      method: "POST",
      body: formData,
    });
    if (response?.url) return response;
  } catch (err) {
    // Fallback to client Object URL
  }

  return { url: URL.createObjectURL(file), filename: file.name };
}
