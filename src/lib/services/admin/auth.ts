import { fetchBackendWithFallback, parseJsonResponse } from "@/lib/auth/session";

export async function login(payload: any) {
  const response = await fetchBackendWithFallback(["/api/v1/admin/auth/login"], {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return { response, data: await parseJsonResponse(response) };
}

export async function logout() {
  const response = await fetchBackendWithFallback(["/api/v1/admin/auth/logout"], {
    method: "POST",
  });
  return { response, data: await parseJsonResponse(response) };
}

export async function forgotPassword(payload: any) {
  const response = await fetchBackendWithFallback(["/api/v1/admin/auth/forgot-password"], {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return { response, data: await parseJsonResponse(response) };
}

export async function changePassword(payload: any) {
  const response = await fetchBackendWithFallback(["/api/v1/admin/auth/change-password"], {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return { response, data: await parseJsonResponse(response) };
}

export async function mfaVerify(payload: any) {
  const response = await fetchBackendWithFallback(["/api/v1/admin/auth/mfa-verify"], {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return { response, data: await parseJsonResponse(response) };
}
