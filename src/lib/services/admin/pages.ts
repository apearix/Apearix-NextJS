import { clientApi } from "@/lib/clientApi";
import { makeDefaultPagination } from "./common";
import { serverApi } from "@/lib/serverApi";

export interface LegalPages {
  status_meta: any;
  id: string;
  title: string;
  slug: string;
  content: string;
  status: string | number;
  meta: string;

  is_permanent: number;
  prefix: string;
  secure_id: string;
  created_at: string;
  updated_at: string;
  media: any[];
}

export const parseLegalPageMeta = (metaStr: string) => {
  try {
    return JSON.parse(metaStr || "{}");
  } catch {
    return {};
  }
};

const flow: "api" | "mock" = "api";

export async function index(
  params: URLSearchParams
): Promise<{ items: LegalPages[]; pagination: any; total: number }> {
  const page = Number(params.get("page")) || 1;
  const limit = Number(params.get("limit")) || 10;

  try {
    const response = await serverApi<any>(`/admin/legal-pages?${params.toString()}`);
    const items = response?.data?.items || [];
    const apiPagination = response?.data?.pagination;
    const pagination = apiPagination ? apiPagination : makeDefaultPagination(items.length, page, limit);

    return { items, pagination, total: pagination.total };
  } catch (error) {
    console.error("LegalPages API Error:", error);
    return { items: [], pagination: makeDefaultPagination(0, page, limit), total: 0 };
  }
}

export async function store(payload: FormData) {
  try {
    const response = await clientApi<any>(`/admin/legal-pages`, {
      method: "POST",
      body: payload, // Pattern: Reference uses body, for files we send FormData
    });
    if (response.status !== "success" && response.statusCode !== 201) {
      throw new Error(response.message || "Failed to create record");
    }
    return response;
  } catch (error: any) {
    throw error;
  }
}

export async function show(id: string): Promise<LegalPages | null> {
  try {
    const response = await serverApi<any>(`/admin/legal-pages/${id}`);
    return response?.data || null;
  } catch (error) {
    return null;
  }
}

export async function update(id: string, payload: FormData) {
  try {
    return await clientApi<any>(`/admin/legal-pages/${id}`, {
      method: "PATCH",
      body: payload,
    });
  } catch (error: any) {
    throw error;
  }
}

export async function destroy(id: string) {
  try {
    return await clientApi<any>(`/admin/legal-pages/${id}`, {
      method: "DELETE",
    });
  } catch (error: any) {
    throw error;
  }
}

export async function bulkUpdateStatus(ids: string[], status: number) {
  try {
    return await clientApi<any>(`/admin/legal-pages/bulk-status`, {
      method: "POST",
      body: JSON.stringify({ ids, status }),
    });
  } catch (error: any) {
    throw error;
  }
}
