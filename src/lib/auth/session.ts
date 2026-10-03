import { NextResponse } from "next/server";
import { DEFAULT_TIMEZONE } from "@/lib/timezone";

// Sync with .env.local keys with fallback defaults
export const ACCESS_COOKIE =
  process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY || "access_token";
export const REFRESH_COOKIE =
  process.env.NEXT_PUBLIC_REFRESH_TOKEN_KEY || "refresh_token";
export const LEGACY_ACCESS_COOKIE = "token";

type CookieValue = string | number | boolean | null | undefined;

const DEFAULT_SESSION_LIFETIME_MINUTES = 15;
const REFRESH_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

/**
 * Backend base URL resolver using environment variables
 */
export function backendBaseUrl(): string {
  const rawUrl =
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.NEST_PUBLIC_API_URL ||
    process.env.NEST_API_BASE_URL ||
    process.env.NEXT_PUBLIC_NEST_API_BASE_URL ||
    "http://localhost:3001/api";

  // Strips trailing slashes and redundant trailing "/api"
  return rawUrl.replace(/\/api\/?$/, "").replace(/\/$/, "");
}

/**
 * Status checks for expired or unauthenticated tokens
 */
export function isAuthenticationFailure(status: number): boolean {
  return status === 401 || status === 403;
}

export function decodeJwtPayload(token?: string): Record<string, any> | null {
  if (!token) return null;

  try {
    const encoded = token.split(".")[1];
    if (!encoded) return null;

    const normalized = encoded.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(
      normalized.length + ((4 - (normalized.length % 4)) % 4),
      "=",
    );

    return JSON.parse(atob(padded));
  } catch {
    return null;
  }
}

export function getAccessTokenRole(token?: string): string | undefined {
  const payload = decodeJwtPayload(token);
  const role = Array.isArray(payload?.roles)
    ? payload.roles[0]
    : payload?.role;

  return role ? String(role).toLowerCase() : undefined;
}

export function authCookieOptions(httpOnly = true, maxAge = REFRESH_COOKIE_MAX_AGE_SECONDS) {
  return {
    httpOnly,
    path: "/",
    maxAge,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
  };
}

export function sessionLifetimeMinutes(data?: any): number {
  const payload = data?.data ?? data ?? {};
  const tokenPayload = payload?.tokenPayload ?? {};
  const value =
    payload?.session_lifetime_minutes ??
    payload?.sessionLifetimeMinutes ??
    tokenPayload?.session_lifetime_minutes ??
    tokenPayload?.sessionLifetimeMinutes ??
    process.env.SESSION_LIFETIME ??
    process.env.NEXT_PUBLIC_SESSION_LIFETIME;

  const minutes = Number(value);
  return Number.isFinite(minutes) && minutes > 0
    ? minutes
    : DEFAULT_SESSION_LIFETIME_MINUTES;
}

export function sessionLifetimeSeconds(data?: any): number {
  return sessionLifetimeMinutes(data) * 60;
}

export function setAuthCookie(
  response: NextResponse,
  name: string,
  value: CookieValue,
  httpOnly = true,
  maxAge = REFRESH_COOKIE_MAX_AGE_SECONDS,
) {
  if (value === null || value === undefined || value === "") return;

  response.cookies.set({
    name,
    value: String(value),
    ...authCookieOptions(httpOnly, maxAge),
  });
}

export function clearAuthCookies(response: NextResponse) {
  const cookiesToClear = [
    ACCESS_COOKIE,
    REFRESH_COOKIE,
    LEGACY_ACCESS_COOKIE,
    "user_role",
    "user_data",
    "user_progress",
    "temp_user_id",
    "auth_user_id",
    "user_timezone",
    "user_language",
  ];

  cookiesToClear.forEach((name) => {
    response.cookies.set({
      name,
      value: "",
      path: "/",
      expires: new Date(0),
      maxAge: 0,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
  });
}

export function getCookieValue(request: Request, name: string): string | undefined {
  const cookieHeader = request.headers.get("cookie");
  if (!cookieHeader) return undefined;

  const match = cookieHeader
    .split(";")
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith(`${name}=`));

  return match ? decodeURIComponent(match.slice(name.length + 1)) : undefined;
}

export function getAccessToken(request: Request): string | undefined {
  return (
    getCookieValue(request, ACCESS_COOKIE) ||
    getCookieValue(request, LEGACY_ACCESS_COOKIE)
  );
}

export function getRefreshToken(request: Request): string | undefined {
  return getCookieValue(request, REFRESH_COOKIE);
}

export async function parseJsonResponse(response: Response) {
  const text = await response.text();
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
}

export function extractAuthPayload(data: any) {
  const payload = data?.data ?? data ?? {};
  const tokenPayload = payload?.tokenPayload ?? {};
  const rawUser = payload?.user ?? payload?.authUser ?? data?.user ?? null;
  const accessToken =
    payload?.access_token ??
    payload?.token ??
    tokenPayload?.access_token ??
    tokenPayload?.token;

  const decoded = decodeJwtPayload(accessToken);
  const user = rawUser
    ? { ...(decoded || {}), ...rawUser }
    : decoded ?? null;

  const roleValue =
    user?.role ??
    user?.roles?.[0]?.name ??
    user?.roles?.[0] ??
    payload?.role ??
    data?.role ??
    getAccessTokenRole(accessToken);

  return {
    accessToken,
    refreshToken:
      payload?.refresh_token ??
      payload?.refreshToken ??
      tokenPayload?.refresh_token ??
      tokenPayload?.refreshToken,
    user,
    role: roleValue ? String(roleValue).toLowerCase() : undefined,
    language:
      payload?.language ??
      user?.preferences?.language ??
      user?.language,
    progress: user?.progress,
    timezone: user?.timezone,
  };
}

export function setSessionCookies(response: NextResponse, data: any) {
  const auth = extractAuthPayload(data);
  const accessMaxAge = sessionLifetimeSeconds(data); // 15 mins (Dynamic/Configurable)
  const refreshMaxAge = REFRESH_COOKIE_MAX_AGE_SECONDS; // 7 days

  // Access token cookie (Short lived)
  setAuthCookie(response, ACCESS_COOKIE, auth.accessToken, true, accessMaxAge);
  
  // Refresh token cookie (Long lived)
  setAuthCookie(response, REFRESH_COOKIE, auth.refreshToken, true, refreshMaxAge);

  // Client non-sensitive cookies
  setAuthCookie(response, "user_role", auth.role, false, refreshMaxAge);
  setAuthCookie(response, "user_language", auth.language, false, refreshMaxAge);
  setAuthCookie(response, "user_data", JSON.stringify(auth.user || {}), false, refreshMaxAge);
  setAuthCookie(response, "user_progress", auth.progress, false, refreshMaxAge);
  setAuthCookie(
    response,
    "user_timezone",
    auth.timezone || DEFAULT_TIMEZONE,
    false,
    refreshMaxAge,
  );

  return auth;
}

export async function fetchBackendWithFallback(
  paths: string[],
  init: RequestInit,
) {
  let lastResponse: Response | null = null;

  for (const path of paths) {
    const response = await fetch(`${backendBaseUrl()}${path}`, init);
    lastResponse = response;

    if (response.status !== 404) {
      return response;
    }
  }

  return lastResponse!;
}

export async function refreshBackendSession(refreshToken: string) {
  const response = await fetchBackendWithFallback(
    ["/api/v1/admin/auth/refresh", "/admin/auth/refresh", "/refresh-token"],
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
      cache: "no-store",
    },
  );
  const data = await parseJsonResponse(response);

  if (!response.ok || data?.status === "error") {
    return { response, data, auth: null };
  }

  const auth = extractAuthPayload(data);
  return {
    response,
    data,
    auth: auth.accessToken ? auth : null,
  };
}