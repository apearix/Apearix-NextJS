import { serverApi } from "@/lib/serverApi";
import { clientApi } from "../../clientApi";

/**
 * Fetches a paginated list of Settings from the API.
 */
export async function index(
  params: URLSearchParams | { [key: string]: string | string[] | undefined } = new URLSearchParams()
): Promise<{ records: any[]; total: number }> {
  try {
    const paramsString = params instanceof URLSearchParams ? params.toString() : new URLSearchParams(params as Record<string, string>).toString();
    const response = await serverApi<any>(`/api/v1/admin/settings?${paramsString}`);

    if (response?.data) {
      return {
        records: Array.isArray(response.data) ? response.data : [response.data],
        total: Array.isArray(response.data) ? response.data.length : 1,
      };
    }

    return { records: [], total: 0 };
  } catch (error) {
    console.error("Failed to fetch settings data:", error);
    return { records: [], total: 0 };
  }
}

/**
 * Fetches settings.
 */
export async function show(id: string | number): Promise<any> {
  try {
    const response = await serverApi<any>(`/api/v1/admin/settings`);
    return response?.data ?? response;
  } catch (error) {
    console.error(`Failed to fetch settings:`, error);
    throw error;
  }
}

/**
 * Creates or updates settings records.
 */
export async function update(recordData: any): Promise<any> {
  try {
    const response = await clientApi<any>(`/api/v1/admin/settings`, {
      method: 'PATCH',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(recordData),
    });

    return response?.data ?? response;
  } catch (error) {
    console.error(`Failed to update settings:`, error);
    throw error;
  }
}
