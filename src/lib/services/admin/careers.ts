import { clientApi } from "@/lib/clientApi";
import { serverApi } from "@/lib/serverApi";
import {
  CreateJobInput,
  UpdateJobInput,
  JobFormValues,
} from "@/schemas/career.schema";

export function formatJobItem(item: any): JobFormValues {
  return {
    id: item.id ? String(item.id) : undefined,
    title: item.title || "",
    slug: item.slug || "",
    department: item.department || "Engineering",
    job_type: item.job_type || "Full-Time",
    workplace_type: item.workplace_type || "Remote",
    location: item.location || "Remote",
    experience_level: item.experience_level || "",
    salary_min: item.salary_min !== null && item.salary_min !== undefined ? Number(item.salary_min) : null,
    salary_max: item.salary_max !== null && item.salary_max !== undefined ? Number(item.salary_max) : null,
    salary_currency: item.salary_currency || "USD",
    is_salary_disclosed: Boolean(item.is_salary_disclosed),
    overview: item.overview || "",
    responsibilities: Array.isArray(item.responsibilities) ? item.responsibilities : [],
    requirements: Array.isArray(item.requirements) ? item.requirements : [],
    benefits: Array.isArray(item.benefits) ? item.benefits : [],
    status: item.status || "published",
    is_featured: Boolean(item.is_featured),
    order: item.order !== undefined ? Number(item.order) : 0,
    deadline: item.deadline ? new Date(item.deadline).toISOString() : null,
    applicant_count: item.applicant_count !== undefined ? Number(item.applicant_count) : 0,
    views_count: item.views_count !== undefined ? Number(item.views_count) : 0,
    created_at: item.created_at || item.createdAt || "",
    updated_at: item.updated_at || item.updatedAt || "",
  };
}

export async function index(
  params?: URLSearchParams
): Promise<{ items: JobFormValues[]; total: number }> {
  try {
    const queryString = params?.toString() ? `?${params.toString()}` : "";
    const response = await serverApi<any>(`/api/v1/admin/careers${queryString}`);
    const rawItems = Array.isArray(response)
      ? response
      : response?.data?.items || response?.data || response?.items || [];
    const items = rawItems.map(formatJobItem);
    return { items, total: items.length };
  } catch (error) {
    console.error("Careers Index API Error:", error);
    return { items: [], total: 0 };
  }
}

export async function show(id: string): Promise<JobFormValues | null> {
  try {
    const response = await serverApi<any>(`/api/v1/admin/careers/${id}`);
    const item = response?.data || response;
    return item ? formatJobItem(item) : null;
  } catch (error) {
    console.error("Career Show API Error:", error);
    return null;
  }
}

export async function store(payload: CreateJobInput) {
  try {
    const response = await clientApi<any>("/api/v1/admin/careers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return response;
  } catch (error: any) {
    console.error("Career Store Error:", error);
    throw error;
  }
}

export async function update(id: string, payload: UpdateJobInput) {
  try {
    const response = await clientApi<any>(`/api/v1/admin/careers/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return response;
  } catch (error: any) {
    console.error("Career Update Error:", error);
    throw error;
  }
}

export async function destroy(id: string) {
  try {
    const response = await clientApi<any>(`/api/v1/admin/careers/${id}`, {
      method: "DELETE",
    });
    return response;
  } catch (error: any) {
    console.error("Career Delete Error:", error);
    throw error;
  }
}

export async function bulkUpdateStatus(ids: string[], status: string) {
  try {
    const response = await clientApi<any>("/api/v1/admin/careers/bulk-status", {
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
    const response = await clientApi<any>("/api/v1/admin/careers/bulk-delete", {
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

export async function getStats() {
  try {
    const response = await serverApi<any>("/api/v1/admin/careers/stats");
    return response?.data || response;
  } catch (error) {
    console.error("Career Stats Error:", error);
    return { totalJobs: 0, activeJobs: 0, totalApplications: 0 };
  }
}
