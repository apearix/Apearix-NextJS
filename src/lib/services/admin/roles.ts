import { clientApi } from "@/lib/clientApi";
import { serverApi } from "@/lib/serverApi";
import { CreateRoleInput, UpdateRoleInput, RoleFormValues } from "@/schemas/role.schema";

export function formatRoleItem(item: any): RoleFormValues {
  return {
    id: item.id ? String(item.id) : undefined,
    name: item.name || "",
    slug: item.slug || (item.name ? item.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") : ""),
    is_manual_slug: Boolean(item.is_manual_slug),
    description: item.description || "",
    users_count: Array.isArray(item.users) ? item.users.length : (item.users_count || 0),
    created_at: item.createdAt ? new Date(item.createdAt).toISOString() : item.created_at || "",
    updated_at: item.updatedAt ? new Date(item.updatedAt).toISOString() : item.updated_at || "",
  };
}

export async function index(
  params?: URLSearchParams
): Promise<{ items: RoleFormValues[]; total: number }> {
  try {
    const queryString = params?.toString() ? `?${params.toString()}` : "";
    const response = await serverApi<any>(`/api/v1/admin/roles${queryString}`);
    const rawItems = Array.isArray(response) ? response : response?.data?.items || response?.data || response?.items || [];
    const items = rawItems.map(formatRoleItem);
    return { items, total: items.length };
  } catch (error) {
    console.error("Roles Index API Error:", error);
    return { items: [], total: 0 };
  }
}

export async function show(id: string): Promise<RoleFormValues | null> {
  try {
    const response = await serverApi<any>(`/api/v1/admin/roles/${id}`);
    const item = response?.data || response;
    return item ? formatRoleItem(item) : null;
  } catch (error) {
    console.error("Role Show API Error:", error);
    return null;
  }
}

export async function store(payload: CreateRoleInput) {
  try {
    const slug = payload.slug || payload.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const response = await clientApi<any>("/api/v1/admin/roles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, slug }),
    });
    return response;
  } catch (error: any) {
    console.error("Role Store Error:", error);
    throw error;
  }
}

export async function update(id: string, payload: UpdateRoleInput) {
  try {
    const slug = payload.slug || (payload.name ? payload.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") : undefined);
    const response = await clientApi<any>(`/api/v1/admin/roles/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, ...(slug ? { slug } : {}) }),
    });
    return response;
  } catch (error: any) {
    console.error("Role Update Error:", error);
    throw error;
  }
}

export async function destroy(id: string) {
  try {
    const response = await clientApi<any>(`/api/v1/admin/roles/${id}`, {
      method: "DELETE",
    });
    return response;
  } catch (error: any) {
    console.error("Role Delete Error:", error);
    throw error;
  }
}

export async function bulkDelete(ids: string[]) {
  try {
    const response = await clientApi<any>("/api/v1/admin/roles/bulk-delete", {
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

export async function bulkImport(items: CreateRoleInput[]) {
  try {
    const formattedItems = items.map((item) => ({
      ...item,
      slug: item.slug || item.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
    }));
    const response = await clientApi<any>("/api/v1/admin/roles/bulk-import", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: formattedItems }),
    });
    return response;
  } catch (error: any) {
    console.error("Bulk Import Error:", error);
    throw error;
  }
}
