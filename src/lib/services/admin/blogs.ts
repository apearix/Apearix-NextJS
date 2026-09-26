import { clientApi } from '@/lib/clientApi';
import { mockBlogs } from '@/lib/mocks/admin/blogs'; 
import { makeDefaultPagination } from './common';
import { serverApi } from '@/lib/serverApi';
import { translateMessage } from '@/lib/translate-message';
import { getUiTranslator } from '@/lib/ui-translator';

export interface BlogUser {
  id: string;
  first_name: string;
  last_name: string;
}

export interface Blogs {
  id: string; 
  secure_id: string;
  title: string;
  slug: string;
  type: number;
  category_id: number;
  user_id: number;
  description: string;
  short_description: string;
  is_published: boolean;
  is_system: number;
  views: number;
  prefix: string;
  created_at: string;
  updated_at: string;
  meta: {
    seo_title: string;
    seo_keywords: string;
    seo_description: string;
  };
  user: BlogUser;
  status_meta: Statuses;
  category: {
    id: number;
    name: string;
  }
}

export interface Statuses {
  value: number;
  name: string;
  code: string;
}

export interface Role {
  id: number;
  name: string;
  code: string;
}

export interface BlogMasters {
  statuses: Statuses[];
  roles: Role[];
}

// TOGGLE THIS: 'api' or 'mock'
const flow: 'api' | 'mock' = 'api'; 

// --- API Functions ---

export async function index(
  params: URLSearchParams
): Promise<{ items: Blogs[]; pagination: any; total: number }> {

  const page = Number(params.get('page')) || 1;
  const limit = Number(params.get('limit')) || 10;

  if (flow === 'mock') {
    console.log('--- Using Mock Data Flow ---');
    await new Promise(resolve => setTimeout(resolve, 500));
    const total = mockBlogs.length;
    return {
      items: mockBlogs as any,
      pagination: makeDefaultPagination(total, page, limit),
      total,
    };
  }

  try {
    const response = await serverApi<any>(
      `/admin/blogs?${params.toString()}`
    );

    // Based on your response: data contains items and pagination
    const items = response?.data?.items || [];
    const apiPagination = response?.data?.pagination;

    const pagination = apiPagination
      ? apiPagination
      : makeDefaultPagination(items.length, page, limit);

    return {
      items,
      pagination,
      total: pagination.total || 0,
    };
  } catch (error) {
    console.error('API Error:', error);
    return {
      items: [],
      pagination: makeDefaultPagination(0, page, limit),
      total: 0,
    };
  }
}

export async function store(payload: any) {
  try {
    const response = await clientApi<any>(`/admin/blogs`, {
      method: "POST",
      body: payload,
    });

    if (response.status !== "success") {
      throw new Error(response.message || "Failed to create record");
    }

    return response;
  } catch (error: any) {
    console.error("Blog create error:", error);
    throw error;
  }
}

export async function show(id: string): Promise<Blogs | null> {
  try {
    const response = await serverApi<any>(`/admin/blogs/${id}`);
    // Extracting .data from the response
    return response?.data || null;
  } catch (error) {
    console.error("Fetch Error:", error);
    return null;
  }
}

export async function update(id: string, payload: any) {
  try {
    const response = await clientApi<any>(`/admin/blogs/${id}`, {
      method: "PATCH",
      body: payload,
    });
    return response;
  } catch (error: any) {
    console.error("Blog update error:", error);
    throw error;
  }
}

export async function destroy(id: string | number) {
  try {
    const response = await clientApi<any>(`/admin/blogs/${id}`, {
      method: "DELETE",
    });

    if (response?.status === "error") {
      const trans = await getUiTranslator();
      throw new Error(
        translateMessage(trans, response?.message, "failed_to_delete_blog"),
      );
    }

    return response;
  } catch (error: any) {
    console.error("Blog delete error:", error);
    throw error;
  }
}


export async function bulkUpdateStatus(payload: {
  ids: number[];
  is_published: boolean;
}) {
  try {
    const response = await clientApi<any>(`/admin/blogs/bulk-status`, {
      method: "POST",
       body: JSON.stringify(payload),
    });

    return response;
  } catch (error: any) {
    console.error("Bulk status update error:", error);
    throw error;
  }
}
