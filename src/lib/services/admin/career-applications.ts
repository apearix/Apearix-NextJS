import { clientApi } from "@/lib/clientApi";
import { serverApi } from "@/lib/serverApi";
import { ApplicationItem } from "@/schemas/career.schema";

export function formatApplicationItem(item: any): ApplicationItem {
  return {
    id: String(item.id),
    job_id: String(item.job_id),
    job: item.job ? item.job : undefined,
    first_name: item.first_name || "",
    last_name: item.last_name || "",
    email: item.email || "",
    phone: item.phone || "",
    resume_url: item.resume_url || "",
    resume_filename: item.resume_filename || "",
    portfolio_url: item.portfolio_url || "",
    linkedin_url: item.linkedin_url || "",
    github_url: item.github_url || "",
    cover_letter: item.cover_letter || "",
    current_ctc: item.current_ctc || "",
    expected_ctc: item.expected_ctc || "",
    notice_period: item.notice_period || "",
    status: item.status || "applied",
    rating: item.rating !== undefined ? Number(item.rating) : 0,
    admin_notes: item.admin_notes || "",
    created_at: item.created_at || item.createdAt || "",
    updated_at: item.updated_at || item.updatedAt || "",
  };
}

export async function index(
  params?: URLSearchParams
): Promise<{ items: ApplicationItem[]; total: number }> {
  try {
    const queryString = params?.toString() ? `?${params.toString()}` : "";
    const response = await serverApi<any>(
      `/api/v1/admin/careers/applications${queryString}`
    );
    const rawItems = Array.isArray(response)
      ? response
      : response?.data?.items || response?.data || response?.items || [];
    const items = rawItems.map(formatApplicationItem);
    return { items, total: items.length };
  } catch (error) {
    console.error("Applications Index API Error:", error);
    return { items: [], total: 0 };
  }
}

export async function show(id: string): Promise<ApplicationItem | null> {
  try {
    const response = await serverApi<any>(
      `/api/v1/admin/careers/applications/${id}`
    );
    const item = response?.data || response;
    return item ? formatApplicationItem(item) : null;
  } catch (error) {
    console.error("Application Show API Error:", error);
    return null;
  }
}

export async function updateStatus(
  id: string,
  status: ApplicationItem["status"]
) {
  try {
    const response = await clientApi<any>(
      `/api/v1/admin/careers/applications/${id}/status`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      }
    );
    return response;
  } catch (error: any) {
    console.error("Application Update Status Error:", error);
    throw error;
  }
}

export async function updateNotes(
  id: string,
  payload: { admin_notes?: string; rating?: number }
) {
  try {
    const response = await clientApi<any>(
      `/api/v1/admin/careers/applications/${id}/notes`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );
    return response;
  } catch (error: any) {
    console.error("Application Update Notes Error:", error);
    throw error;
  }
}

export async function destroy(id: string) {
  try {
    const response = await clientApi<any>(
      `/api/v1/admin/careers/applications/${id}`,
      {
        method: "DELETE",
      }
    );
    return response;
  } catch (error: any) {
    console.error("Application Delete Error:", error);
    throw error;
  }
}

export async function getStats() {
  try {
    const response = await serverApi<any>(
      "/api/v1/admin/careers/applications/stats"
    );
    return response?.data || response;
  } catch (error) {
    console.error("Applications Stats Error:", error);
    return {
      total: 0,
      applied: 0,
      reviewing: 0,
      shortlisted: 0,
      interviewing: 0,
      offered: 0,
      hired: 0,
      rejected: 0,
    };
  }
}
