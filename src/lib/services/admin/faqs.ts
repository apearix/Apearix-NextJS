import { clientApi } from "@/lib/clientApi";
import { makeDefaultPagination } from "./common";
import { serverApi } from "@/lib/serverApi";

export interface FAQ {
  id: string;
  category_id: number;
  title: string;
  slug: string;
  description: string;
  is_published: number;
  is_permanent: number;
  role_id: number;
  created_at: string;
  updated_at: string;
  secure_id: string;
  prefix: string;
  category?: { name: string };
}

const flow: "api" | "mock" = "api";

export async function index(
  params: URLSearchParams
): Promise<{ items: FAQ[]; pagination: any; total: number }> {
  const page = Number(params.get("page")) || 1;
  const limit = Number(params.get("limit")) || 10;

  try {
    const response = await serverApi<any>(`/admin/faqs?${params.toString()}`);
    const items = response?.data?.items || [];
    const apiPagination = response?.data?.pagination;
    const pagination = apiPagination ? apiPagination : makeDefaultPagination(items.length, page, limit);

    return { items, pagination, total: pagination.total };
  } catch (error) {
    console.error("FAQ API Error:", error);
    return { items: [], pagination: makeDefaultPagination(0, page, limit), total: 0 };
  }
}

export async function store(payload: Partial<FAQ>) {
  try {
    const response = await clientApi<any>(`/admin/faqs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (response.status !== "success" && response.statusCode !== 201) {
      throw new Error(response.message || "Failed to create record");
    }
    return response;
  } catch (error: any) {
    throw error;
  }
}

export async function show(id: string): Promise<FAQ | null> {
  try {
    const response = await serverApi<any>(`/admin/faqs/${id}`);
    return response?.data || null;
  } catch (error) {
    return null;
  }
}

export async function update(id: string, payload: Partial<FAQ>) {
  try {
    return await clientApi<any>(`/admin/faqs/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (error: any) {
    throw error;
  }
}

export async function destroy(id: string) {
  try {
    return await clientApi<any>(`/admin/faqs/${id}`, {
      method: "DELETE",
    });
  } catch (error: any) {
    throw error;
  }
}
