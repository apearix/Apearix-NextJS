import { clientApi } from "@/lib/clientApi";

export interface ProfileResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      id: string;
      first_name: string;
      last_name: string;
      email: string;
      phone: string;
      avatar: string;
      dob: string;
      status: string;
      designation?: string;
      bio?: string;
      last_login_at?: string;
      created_at?: string;
      updated_at?: string;
    };
    role: {
      id: string;
      name: string;
      slug: string;
      permissions: string[];
    };
    security: {
      two_factor_enabled: boolean;
      security_score: number;
    };
    preferences: {
      timezone: string;
      email_alerts: boolean;
      security_alerts: boolean;
    };
    sessions: Array<{
      id: string;
      device: string;
      ip: string;
      location: string;
      current: boolean;
      last_active: string;
    }>;
  };
}

export async function fetchProfile(): Promise<ProfileResponse["data"] | null> {
  try {
    const response = await clientApi<ProfileResponse>("/api/v1/admin/profile");
    return response?.data || null;
  } catch (error) {
    console.error("Fetch Profile API Error:", error);
    return null;
  }
}

export async function updateProfile(payload: {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  dob?: string;
  avatar?: string;
}): Promise<ProfileResponse["data"]> {
  const response = await clientApi<ProfileResponse>("/api/v1/admin/profile", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return response.data;
}

export async function changePassword(payload: {
  current_password?: string;
  new_password?: string;
}): Promise<{ success: boolean; message: string }> {
  const response = await clientApi<{ success: boolean; message: string }>("/api/v1/admin/profile/change-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return response;
}

export async function uploadAvatar(file: File): Promise<{ url: string; filename: string }> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await clientApi<any>("/api/v1/admin/users/upload", {
    method: "POST",
    body: formData,
  });

  if (!response?.url) {
    throw new Error(response?.message || "Failed to upload avatar image");
  }

  return response;
}
