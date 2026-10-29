import { clientApi } from "@/lib/clientApi";
import { serverApi } from "@/lib/serverApi";
import { makeDefaultPagination } from "./common";
import {
  type ProductFormValues,
  type CreateProductInput,
  type UpdateProductInput,
} from "@/schemas/product.schema";

export type { ProductFormValues, CreateProductInput, UpdateProductInput };

export interface Product extends ProductFormValues {}

export function formatProductItem(item: any): ProductFormValues {
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
    name: item.name || item.title || "",
    slug: item.slug || "",
    is_manual_slug: item.is_manual_slug !== undefined ? Boolean(item.is_manual_slug) : false,
    category_id: categoryId,
    category: categoryRelation,
    price: item.price !== undefined ? Number(item.price) : 0,
    compare_at_price:
      item.compare_at_price !== undefined && item.compare_at_price !== null
        ? Number(item.compare_at_price)
        : null,
    sku: item.sku || "",
    stock:
      item.stock !== undefined
        ? Number(item.stock)
        : item.quantity !== undefined
        ? Number(item.quantity)
        : 0,
    image_or_thumbnail:
      item.image_or_thumbnail || item.featured_image || item.image || item.thumbnail || "",
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

export async function fetchProductCategories(): Promise<{ id: string; name: string; slug: string }[]> {
  try {
    const response = await clientApi<any>("/api/v1/admin/categories");
    const rawItems = Array.isArray(response)
      ? response
      : response?.data?.items || response?.data || response?.items || [];
    const productCategories = rawItems.filter((c: any) => c.category_type?.slug === "products");
    return productCategories.length > 0 ? productCategories : rawItems;
  } catch (error) {
    console.error("Failed to fetch product categories:", error);
    return [];
  }
}

export async function index(
  params?: URLSearchParams
): Promise<{ items: ProductFormValues[]; pagination: any; total: number }> {
  const page = Number(params?.get("page")) || 1;
  const limit = Number(params?.get("limit")) || 10;
  const queryString = params?.toString() ? `?${params.toString()}` : "";

  try {
    const response = await serverApi<any>(`/api/v1/admin/products${queryString}`);
    const rawItems =
      response?.data?.items || response?.data || (Array.isArray(response) ? response : response?.items || []);
    const items = Array.isArray(rawItems) ? rawItems.map(formatProductItem) : [];
    const apiPagination = response?.data?.pagination || response?.pagination;
    const pagination = apiPagination || makeDefaultPagination(items.length, page, limit);

    return { items, pagination, total: pagination.total ?? items.length };
  } catch (error) {
    console.error("Products API Error:", error);
    return { items: [], pagination: makeDefaultPagination(0, page, limit), total: 0 };
  }
}

export async function show(id: string): Promise<ProductFormValues | null> {
  try {
    const response = await serverApi<any>(`/api/v1/admin/products/${id}`);
    const item = response?.data || response;
    return item ? formatProductItem(item) : null;
  } catch (error) {
    console.error("Product Show Error:", error);
    return null;
  }
}

export async function store(payload: CreateProductInput | any) {
  try {
    const response = await clientApi<any>("/api/v1/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload instanceof FormData ? payload : JSON.stringify(payload),
    });

    return response;
  } catch (error: any) {
    console.error("Product Store Error:", error);
    throw error;
  }
}

export async function update(id: string, payload: UpdateProductInput | any) {
  try {
    return await clientApi<any>(`/api/v1/admin/products/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: payload instanceof FormData ? payload : JSON.stringify(payload),
    });
  } catch (error: any) {
    console.error("Product Update Error:", error);
    throw error;
  }
}

export async function destroy(id: string) {
  try {
    return await clientApi<any>(`/api/v1/admin/products/${id}`, {
      method: "DELETE",
    });
  } catch (error: any) {
    console.error("Product Delete Error:", error);
    throw error;
  }
}

export async function bulkUpdateStatus(ids: string[], is_active: boolean) {
  try {
    const response = await clientApi<any>("/api/v1/admin/products/bulk-status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids, is_active }),
    });
    return response;
  } catch (error) {
    return Promise.all(ids.map((id) => update(id, { is_active })));
  }
}

export async function bulkDelete(ids: string[]) {
  try {
    const response = await clientApi<any>("/api/v1/admin/products/bulk-delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids }),
    });
    return response;
  } catch (error) {
    return Promise.all(ids.map((id) => destroy(id)));
  }
}

export async function bulkImport(items: any[]) {
  try {
    const response = await clientApi<any>("/api/v1/admin/products/bulk-import", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items }),
    });
    return response;
  } catch (error) {
    const created: any[] = [];
    for (const item of items) {
      const res = await store(item);
      created.push(res);
    }
    return { count: created.length, items: created };
  }
}

export async function uploadProductImage(file: File): Promise<{ url: string; filename: string }> {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await clientApi<any>("/api/v1/admin/products/upload", {
      method: "POST",
      body: formData,
    });
    if (response?.url) return response;
  } catch (err) {
    // Fallback
  }

  try {
    const response = await clientApi<any>("/api/v1/admin/blogs/upload", {
      method: "POST",
      body: formData,
    });
    if (response?.url) return response;
  } catch (err) {
    // Fallback
  }

  return { url: URL.createObjectURL(file), filename: file.name };
}
