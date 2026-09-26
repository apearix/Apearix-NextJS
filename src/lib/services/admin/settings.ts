import { serverApi } from "@/lib/serverApi";
import { clientApi } from "../../clientApi";

/**
 * Fetches a paginated list of Slider Type from the API.
 */
export async function index(
  params: URLSearchParams | { [key: string]: string | string[] | undefined } = new URLSearchParams()
): Promise<{ records: any[]; total: number }> {
  try {
    const paramsString = params instanceof URLSearchParams ? params.toString() : new URLSearchParams(params as Record<string, string>).toString();
    const response = await serverApi<any>(`/admin/settings?${paramsString}`);

    if (response.status !== 'success' || !response.data?.settings) {
      console.error('API Error: Invalid response structure for fetching Slider Type.', response);
      return { records: [], total: 0 };
    }

    return {
      records: response.data.settings,
      total: response.data.meta.total || 0,
    };
  } catch (error) {
    console.error("Failed to fetch Slider Type data:", error);
    return { records: [], total: 0 };
  }
}

/**
 * Fetches a single reord by its ID.
 */
export async function show(id: string | number): Promise<any> {
  try {
    const response = await serverApi<any>(`/admin/settings/${id}`);

    if (response.status !== 'success' || !response.data) {
      throw new Error('Invalid API response structure for fetching record.');
    }
    const apiTag = response.data?.settings ?? response.data;
    return apiTag;
  } catch (error) {
    console.error(`Failed to fetch record with ID ${id}:`, error);
    throw error;
  }
}

/**
 * Creates or updates multiple settings records.
 *
 * The Nest settings controller exposes POST /admin/settings/bulk-upload for
 * create-or-update behavior. There is no POST /admin/settings/bulk endpoint.
 */
export async function createReportRecordMultiple(recordData: any[]): Promise<any> {
  try {
    const formData = new FormData();
    const group = recordData[0]?.group;

    if (group) formData.append('group', group);
    recordData.forEach((record) => {
      formData.append(record.key, String(record.value ?? ''));
    });

    const response = await clientApi<any>('/admin/settings/bulk-upload', {
      method: 'POST',
      body: formData,
    });

    if (response.status !== 'success' || !response.data) {
      throw new Error(response.message || 'Failed to update settings.');
    }

    return response.data?.settings ?? response.data;
  } catch (error) {
    console.error("Failed to create Record:", error);
    throw error;
  }
}


/**
 * Creates a new record.
 */
export async function create(recordData: any): Promise<any> {
  try {
    const response = await clientApi<any>('/admin/settings', {
      method: 'POST',
      body: recordData,
    });

    if (response.status !== 'success' || !response.data) {
      throw new Error(response.message || 'Failed to create record due to an API error.');
    }
    const apiTag = response.data?.settings ?? response.data;
    return apiTag;
  } catch (error) {
    console.error("Failed to create Record:", error);
    throw error;
  }
}

/**
 * Updates an existing record.
 */
export async function update(id: string | number, recordData: any): Promise<any> {
  try {
    const response = await clientApi<any>(`/admin/slider-types/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(recordData),
    });

    if (response.status !== 'success' || !response.data) {
      throw new Error(response.message || 'Failed to update record due to an API error.');
    }
    const apiTag = response.data?.settings ?? response.data;
    return apiTag;
  } catch (error) {
    console.error(`Failed to update record with ID ${id}:`, error);
    throw error;
  }
}

/**
 * Deletes an record by its ID.
 */
export async function destroy(id: string | number): Promise<{ status: string; message: string }> {
  try {
    const response = await clientApi<{ status: string; message: string }>(`/admin/slider-types/${id}`, {
      method: 'DELETE',
    });
    
    if (response.status !== 'success') {
      throw new Error(response.message || 'Failed to delete record due to an API error.');
    }
    
    return response;
  } catch (error) {
    console.error(`Failed to delete record with ID ${id}:`, error);
    throw error;
  }
}
