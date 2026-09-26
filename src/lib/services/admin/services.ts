import { clientApi } from "@/lib/clientApi";
import { makeDefaultPagination } from "./common";
import { serverApi } from "@/lib/serverApi";

export interface ServiceEntity {
  id: string;
  name?: string;
  // expand according to your schema
  created_at?: string;
  updated_at?: string;
}

export async function index(
  params: URLSearchParams
): Promise<{ items: ServiceEntity[]; pagination: any; total: number }> {
  const page = Number(params.get("page")) || 1;
  const limit = Number(params.get("limit")) || 10;

  try {
    const response = await serverApi<any>(`/admin/services?${params.toString()}`);
    const items = response?.data?.items || response?.data || [];
    const apiPagination = response?.data?.pagination;
    const pagination = apiPagination ? apiPagination : makeDefaultPagination(items.length, page, limit);

    return { items, pagination, total: pagination.total || items.length };
  } catch (error) {
    console.error("Services API Error:", error);
    return { items: [], pagination: makeDefaultPagination(0, page, limit), total: 0 };
  }
}

export async function store(payload: any) {
  try {
    const response = await clientApi<any>(`/admin/services`, {
      method: "POST",
      body: payload instanceof FormData ? payload : JSON.stringify(payload),
    });

    return response;
  } catch (error: any) {
    throw error;
  }
}

export async function show(id: string): Promise<ServiceEntity | null> {
  try {
    const response = await serverApi<any>(`/admin/services/${id}`);
    return response?.data || response || null;
  } catch (error) {
    return null;
  }
}

export async function update(id: string, payload: any) {
  try {
    return await clientApi<any>(`/admin/services/${id}`, {
      method: "PATCH",
      body: payload instanceof FormData ? payload : JSON.stringify(payload),
    });
  } catch (error: any) {
    throw error;
  }
}

export async function destroy(id: string) {
  try {
    return await clientApi<any>(`/admin/services/${id}`, {
      method: "DELETE",
    });
  } catch (error: any) {
    throw error;
  }
}
