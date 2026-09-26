import { clientApi } from "@/lib/clientApi";

export async function login(payload: any) {
  try {
    const response = await clientApi<any>(`/admin/auth/login`, {
      method: "POST",
      body: JSON.stringify(payload),
    }, false); // don't requireAuth on login
    return response;
  } catch (error) {
    throw error;
  }
}

export async function logout() {
  try {
    const response = await clientApi<any>(`/admin/auth/logout`, {
      method: "POST",
    });
    return response;
  } catch (error) {
    throw error;
  }
}

export async function forgotPassword(payload: any) {
  try {
    const response = await clientApi<any>(`/admin/auth/forgot-password`, {
      method: "POST",
      body: JSON.stringify(payload),
    }, false); // don't requireAuth on forgot-password
    return response;
  } catch (error) {
    throw error;
  }
}

export async function changePassword(payload: any) {
  try {
    const response = await clientApi<any>(`/admin/auth/change-password`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return response;
  } catch (error) {
    throw error;
  }
}
