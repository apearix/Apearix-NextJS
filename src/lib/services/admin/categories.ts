// import { makeDefaultPagination } from "./common";
// import { mockCategories } from "@/lib/mocks/admin/categories";
// import { clientApi } from "@/lib/clientApi";
// import { serverApi } from "@/lib/serverApi";

// export interface Category {
//   id: string;
//   name: string;
//   slug: string;
//   level: number;
//   category_type_id: number;
//   parent_id: number;
//   created_at: string;
//   updated_at: string;
//   secure_id: string;
//   prefix: string;
//   children_count?: number;
//   media?: Array<{
//     id: string;
//     file_name: string;
//     url: string;
//     secure_id: string;
//     prefix: string;
//   }>;
// }

// export interface CategoryMasters {
//   categoryTypes: { id: number; name: string }[];
// }

// const flow: "api" | "mock" = "api";

// /* =========================
//    INDEX
// ========================= */
// export async function index(params: URLSearchParams) {
//   const page = Number(params.get("page")) || 1;
//   const limit = Number(params.get("limit")) || 10;

//   if (flow === "mock") {
//     await new Promise((r) => setTimeout(r, 500));
//     const total = mockCategories.length;

//     return {
//       items: mockCategories,
//       typeData: null,
//       pagination: makeDefaultPagination(total, page, limit),
//       total,
//     };
//   }

//   try {
//     const response = await serverApi<any>(`/admin/categories?${params.toString()}`);
//     const items: Category[] = response?.data?.items || [];
//     const apiPagination = response?.data?.pagination;
//     const typeData = response?.data?.typeData || [];

//     const pagination = apiPagination || makeDefaultPagination(items.length, page, limit);

//     // As with category_count, children_count may be duplicated by API joins.
//     // Recount against the uniquely filtered category result set.
//     const itemsWithAccurateCounts = await Promise.all(
//       items.map(async (item) => {
//         if (Number(item.level) >= Number(typeData?.allowed_level ?? item.level)) {
//           return { ...item, children_count: 0 };
//         }

//         try {
//           const countParams = new URLSearchParams({
//             page: "1",
//             limit: "1",
//             category_type_id: String(item.category_type_id),
//             parent_id: String(item.id),
//           });
//           const childrenResponse = await serverApi<any>(
//             `/admin/categories?${countParams.toString()}`,
//           );
//           const total = Number(childrenResponse?.data?.pagination?.total);

//           return Number.isFinite(total)
//             ? { ...item, children_count: total }
//             : item;
//         } catch {
//           return item;
//         }
//       }),
//     );

//     return { items: itemsWithAccurateCounts, typeData, pagination, total: pagination.total };
//   } catch (error) {
//     console.error(error);
//     return { items: [],typeData : null, pagination: makeDefaultPagination(0, page, limit), total: 0 };
//   }
// }

// /* =========================
//    SHOW
// ========================= */
// export async function show(id: string) {
//   try {
//     const response = await serverApi<any>(`/admin/categories/${id}`);
//     return response?.data || null;
//   } catch (error) {
//     console.error(error);
//     return null;
//   }
// }

// /* =========================
//    STORE
// ========================= */
// export async function store(payload: any) {
//   const response = await clientApi<any>(`/admin/categories`, {
//     method: "POST",
//     body: payload,
//   });

//   if (!response || response.status !== "success" || !response.data) {
//     throw new Error(response?.message || "Unexpected category response");
//   }

//   return response;
// }

// /* =========================
//    UPDATE
// ========================= */
// export async function update(id: string, payload: any) {
//   try {
//     const response = await clientApi<any>(`/admin/categories/${id}`, {
//       method: "PATCH",
//       body: payload,
//     });
//     return response;
//   } catch (error) {
//     console.error(error);
//     throw error;
//   }
// }

// /* =========================
//    DESTROY
// ========================= */
// export async function destroy(id: string) {
//   try {
//     const response = await clientApi<any>(`/admin/categories/${id}`, { method: "DELETE" });
//     return response;
//   } catch (error) {
//     console.error(error);
//     throw error;
//   }
// }
