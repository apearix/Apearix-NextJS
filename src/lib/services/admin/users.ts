import { clientApi } from "@/lib/clientApi";
import { serverApi } from "@/lib/serverApi";
import { CreateUserInput, UpdateUserInput, UserFormValues, UserStatus } from "@/schemas/user.schema";

export function formatUserItem(item: any): UserFormValues {
  return {
    id: item.id ? String(item.id) : undefined,
    first_name: item.first_name || "",
    last_name: item.last_name || "",
    email: item.email || "",
    phone: item.phone || "",
    avatar: item.avatar || "",
    dob: item.dob ? String(item.dob).slice(0, 10) : "",
    status: (item.status as UserStatus) || "active",
    role_id: item.role_id || item.role?.id || "",
    role: item.role ? { id: String(item.role.id), name: item.role.name || item.role.slug || "User" } : undefined,
    last_login_at: item.last_login_at || item.lastLoginAt || null,
    created_at: item.createdAt ? new Date(item.createdAt).toISOString() : item.created_at || "",
    updated_at: item.updatedAt ? new Date(item.updatedAt).toISOString() : item.updated_at || "",
  };
}

export async function uploadAvatar(file: File): Promise<{ url: string; filename: string }> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await clientApi<any>("/api/v1/admin/users/upload", {
    method: "POST",
    body: formData,
  });

  if (!response?.url) {
    throw new Error(response?.message || "Failed to upload avatar image");
  }

  return response;
}

export async function index(
  params?: URLSearchParams
): Promise<{ items: UserFormValues[]; total: number }> {
  try {
    const queryString = params?.toString() ? `?${params.toString()}` : "";
    const response = await serverApi<any>(`/api/v1/admin/users${queryString}`);
    const rawItems = Array.isArray(response) ? response : response?.data?.items || response?.data || response?.items || [];
    const items = rawItems.map(formatUserItem);
    return { items, total: items.length };
  } catch (error) {
    console.error("Users Index API Error:", error);
    return { items: [], total: 0 };
  }
}

export async function show(id: string): Promise<UserFormValues | null> {
  try {
    const response = await serverApi<any>(`/api/v1/admin/users/${id}`);
    const item = response?.data || response;
    return item ? formatUserItem(item) : null;
  } catch (error) {
    console.error("User Show API Error:", error);
    return null;
  }
}

export async function store(payload: CreateUserInput) {
  try {
    const response = await clientApi<any>("/api/v1/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return response;
  } catch (error: any) {
    console.error("User Store Error:", error);
    throw error;
  }
}

export async function update(id: string, payload: UpdateUserInput) {
  try {
    const response = await clientApi<any>(`/api/v1/admin/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return response;
  } catch (error: any) {
    console.error("User Update Error:", error);
    throw error;
  }
}

export async function destroy(id: string) {
  try {
    const response = await clientApi<any>(`/api/v1/admin/users/${id}`, {
      method: "DELETE",
    });
    return response;
  } catch (error: any) {
    console.error("User Delete Error:", error);
    throw error;
  }
}

export async function bulkUpdateStatus(ids: string[], status: UserStatus) {
  try {
    const response = await clientApi<any>("/api/v1/admin/users/bulk-status", {
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
    const response = await clientApi<any>("/api/v1/admin/users/bulk-delete", {
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

export async function bulkImport(items: CreateUserInput[]) {
  try {
    const response = await clientApi<any>("/api/v1/admin/users/bulk-import", {
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

export async function fetchRoles(): Promise<{ id: string; name: string; slug: string }[]> {
  try {
    const response = await clientApi<any>("/api/v1/admin/roles");
    const raw = Array.isArray(response) ? response : response?.data || response?.items || [];
    return raw.map((r: any) => ({
      id: String(r.id),
      name: r.name || r.slug || "Role",
      slug: r.slug || r.name?.toLowerCase() || "",
    }));
  } catch (error) {
    console.error("Fetch Roles Error:", error);
    return [];
  }
}
