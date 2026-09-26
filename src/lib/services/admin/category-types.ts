import { clientApi } from "@/lib/clientApi";
import { makeDefaultPagination } from "./common";
import { serverApi } from "@/lib/serverApi";

/* =========================
   Interfaces
========================= */

export interface CategoryType {
  id: string;
  name: string;
  allowed_level: number;
  code: string;
  remark: string;
  category_count: number;
  is_permanent: number;
  type: number;
  prefix: string;
  secure_id: string;
  created_at: string;
  updated_at: string;
}

export interface CategoryTypePayload {
  name: string;
  code: string;
  allowed_level: number;
  remark?: string;
  is_permanent?: number;
  type: number;
}

/* =========================
   Toggle Flow
========================= */

const flow: "api" | "mock" = "api";

/* =========================
   Index
========================= */

export async function index(
  params: URLSearchParams
): Promise<{ items: CategoryType[]; pagination: any; total: number }> {
  const page = Number(params.get("page")) || 1;
  const limit = Number(params.get("limit")) || 10;


  /* -------- API FLOW -------- */
  try {
    const response = await serverApi<any>(
      `/admin/category-types?${params.toString()}`
    );

    const items: CategoryType[] = response?.data?.items || [];
    const apiPagination = response?.data?.pagination;

    // `category_count` from the category-type endpoint can be inflated by the
    // joins used to build that response. The categories endpoint pagination is
    // the source of truth because it counts the actual filtered records.
    const itemsWithAccurateCounts = await Promise.all(
      items.map(async (item) => {
        try {
          const countParams = new URLSearchParams({
            page: "1",
            limit: "1",
            category_type_id: String(item.id),
          });
          const categoriesResponse = await serverApi<any>(
            `/admin/categories?${countParams.toString()}`,
          );
          const total = Number(categoriesResponse?.data?.pagination?.total);

          return Number.isFinite(total)
            ? { ...item, category_count: total }
            : item;
        } catch {
          return item;
        }
      }),
    );

    const pagination = apiPagination
      ? apiPagination
      : makeDefaultPagination(items.length, page, limit);

    return {
      items: itemsWithAccurateCounts,
      pagination,
      total: pagination.total,
    };
  } catch (error) {
    console.error("CategoryTypes API Error:", error);

    return {
      items: [],
      pagination: makeDefaultPagination(0, page, limit),
      total: 0,
    };
  }
}

/* =========================
   Store
========================= */

export async function store(payload: CategoryTypePayload) {
  try {
    const response = await clientApi<any>(`/admin/category-types`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (response.status !== "success") {
      throw new Error(response.message || "Failed to create record");
    }

    return response;
  } catch (error: any) {
    console.error("CategoryType create error:", error);
    throw error;
  }
}

/* =========================
   Show
========================= */

export async function show(id: string): Promise<CategoryType | null> {
  try {
    const response = await serverApi<any>(
      `/admin/category-types/${id}`
    );
    return response?.data || null;
  } catch (error) {
    console.error("CategoryType fetch error:", error);
    return null;
  }
}

/* =========================
   Update
========================= */

export async function update(
  id: string,
  payload: Partial<CategoryTypePayload>
) {
  try {
    return await clientApi<any>(
      `/admin/category-types/${id}`,
      {
        method: "PATCH",
        body: JSON.stringify(payload),
      }
    );
  } catch (error: any) {
    throw error;
  }
}

/* =========================
   Delete
========================= */

export async function destroy(id: string) {
  const normalizedId = String(id || "").trim();
  if (!normalizedId) {
    throw new Error("Invalid category type ID");
  }

  try {
    return await clientApi<any>(
      `/admin/category-types/${encodeURIComponent(normalizedId)}`,
      {
        method: "DELETE",
      }
    );
  } catch (error: any) {
    console.error("CategoryType delete error:", error);
    throw error;
  }
}
