import { serverApi } from "@/lib/serverApi";

export async function getDashboard(month?: string): Promise<any> {
  try {
    const params = new URLSearchParams();

    if (month) {
      params.set("month", month);
    }

    const response = await serverApi<any>(
      `/admin/dashboard${params.size ? `?${params.toString()}` : ""}`,
    );

    return response?.data;
  } catch (error) {
    console.error("getDashboard failed", error);
    throw error;
  }
}
