import { serverApi } from "@/lib/serverApi";
import { PageFormValues } from "@/schemas/page.schema";
import { formatPageItem } from "@/lib/services/admin/pages";

export async function fetchPublishedPages(params?: {
  search?: string;
}): Promise<{ items: PageFormValues[]; total: number }> {
  try {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.set("search", params.search);

    const query = searchParams.toString() ? `?${searchParams.toString()}` : "";
    const response = await serverApi<any>(
      `/api/v1/pages${query}`,
      {
        next: { revalidate: 60, tags: ["pages"] },
      },
      false
    );

    const rawItems = Array.isArray(response)
      ? response
      : response?.items || response?.data?.items || response?.data || [];

    const items = Array.isArray(rawItems) ? rawItems.map(formatPageItem) : [];

    return {
      items,
      total: response?.total || items.length,
    };
  } catch (error) {
    console.error("Fetch Published Pages Error:", error);
    return { items: [], total: 0 };
  }
}

export async function fetchPageBySlug(slug: string): Promise<PageFormValues | null> {
  const normalizedSlug = slug.trim().toLowerCase();

  try {
    // 1. Try single page endpoint if supported by backend
    try {
      const response = await serverApi<any>(
        `/api/v1/pages/${normalizedSlug}`,
        {
          next: { revalidate: 60, tags: [`page-${normalizedSlug}`, "pages"] },
        },
        false
      );

      const item = response?.data || response;
      if (item && item.slug && !Array.isArray(item)) {
        return formatPageItem(item);
      }
    } catch {
      // Backend may not have a slug-specific route, fallback to list search
    }

    // 2. Fetch full list from /api/v1/pages and find matching slug
    const { items } = await fetchPublishedPages();
    const found = items.find(
      (p) => p.slug?.trim().toLowerCase() === normalizedSlug
    );

    return found || null;
  } catch (error) {
    console.error(`Fetch Page (${slug}) Error:`, error);
    return null;
  }
}
