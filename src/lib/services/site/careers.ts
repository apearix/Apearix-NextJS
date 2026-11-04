import { clientApi } from "@/lib/clientApi";
import { serverApi } from "@/lib/serverApi";
import { JobFormValues } from "@/schemas/career.schema";
import { formatJobItem } from "@/lib/services/admin/careers";

export async function fetchPublishedJobs(params?: {
  search?: string;
  department?: string;
  job_type?: string;
  workplace_type?: string;
}): Promise<{ items: JobFormValues[]; departments: string[]; total: number }> {
  try {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.set("search", params.search);
    if (params?.department && params.department !== "all") {
      searchParams.set("department", params.department);
    }
    if (params?.job_type && params.job_type !== "all") {
      searchParams.set("job_type", params.job_type);
    }
    if (params?.workplace_type && params.workplace_type !== "all") {
      searchParams.set("workplace_type", params.workplace_type);
    }

    const query = searchParams.toString() ? `?${searchParams.toString()}` : "";
    const response = await serverApi<any>(`/api/v1/site/careers${query}`, {
      next: { revalidate: 60, tags: ["careers"] },
    }, false);

    const rawItems = response?.items || response?.data?.items || (Array.isArray(response) ? response : []);
    const departments = response?.departments || [];
    const items = rawItems.map(formatJobItem);

    return {
      items,
      departments,
      total: response?.total || items.length,
    };
  } catch (error) {
    console.error("Fetch Published Jobs Error:", error);
    return { items: [], departments: [], total: 0 };
  }
}

export async function fetchJobBySlug(slug: string): Promise<JobFormValues | null> {
  try {
    const response = await serverApi<any>(`/api/v1/site/careers/${slug}`, {
      next: { revalidate: 60, tags: [`career-${slug}`] },
    }, false);

    const item = response?.data || response;
    return item ? formatJobItem(item) : null;
  } catch (error) {
    console.error(`Fetch Job (${slug}) Error:`, error);
    return null;
  }
}

export async function submitJobApplication(
  jobId: string,
  formData: FormData
): Promise<{ success: boolean; message: string; data?: any }> {
  try {
    const response = await clientApi<any>(
      `/api/v1/site/careers/${jobId}/apply`,
      {
        method: "POST",
        body: formData,
      },
      false
    );
    return response;
  } catch (error: any) {
    console.error("Submit Application Error:", error);
    throw error;
  }
}
