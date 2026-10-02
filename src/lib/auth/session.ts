import { NextResponse } from "next/server";
import { DEFAULT_TIMEZONE } from "@/lib/timezone";

const ACCESS_COOKIE = "access_token";
const REFRESH_COOKIE = "refresh_token";
const LEGACY_ACCESS_COOKIE = "token";

type CookieValue = string | number | boolean | null | undefined;

const DEFAULT_SESSION_LIFETIME_MINUTES = 15;
const REFRESH_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

/**
 * The backend uses 403 as well as 401 when an access token is missing,
 * expired, or no longer valid. Both statuses may therefore be refreshed once;
 * callers must still return the retry response so a real permission denial is
 * not hidden.
 */
export function isAuthenticationFailure(status: number) {
  return status === 401 || status === 403;
}

export function decodeJwtPayload(token?: string) {
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

export function getAccessTokenRole(token?: string) {
  const payload = decodeJwtPayload(token);
  const role = Array.isArray(payload?.roles)
    ? payload.roles[0]
    : payload?.role;

  return role ? String(role).toLowerCase() : undefined;
}

export function backendBaseUrl() {
  const baseUrl =
    process.env.NEST_API_BASE_URL || process.env.NEXT_PUBLIC_NEST_API_BASE_URL || process.env.NEST_PUBLIC_API_URL || "http://localhost:4000";

  if (!baseUrl) {
    throw new Error("NEST_API_BASE_URL is not configured.");
  }

  return baseUrl.replace(/\/api\/?$/, "").replace(/\/$/, "");
}

export function authCookieOptions(httpOnly = true, maxAge = 60 * 60 * 24 * 7) {
  return {
    httpOnly,
    path: "/",
    maxAge,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
  };
}

export function sessionLifetimeMinutes(data?: any) {
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

export function sessionLifetimeSeconds(data?: any) {
  return sessionLifetimeMinutes(data) * 60;
}

export function setAuthCookie(
  response: NextResponse,
  name: string,
  value: CookieValue,
  httpOnly = true,
  maxAge = 60 * 60 * 24 * 7,
) {
  if (value === null || value === undefined || value === "") return;

  response.cookies.set({
    name,
    value: String(value),
    ...authCookieOptions(httpOnly, maxAge),
  });
}

export function clearAuthCookies(response: NextResponse) {
  [
    ACCESS_COOKIE,
    REFRESH_COOKIE,
    LEGACY_ACCESS_COOKIE,
    "user_role",
    "user_data",
    "user_progress",
    "temp_user_id",
    "auth_user_id",
    "user_timezone",
  ].forEach((name) => {
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

export function getCookieValue(request: Request, name: string) {
  const cookieHeader = request.headers.get("cookie");
  if (!cookieHeader) return undefined;

  const match = cookieHeader
    .split(";")
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith(`${name}=`));

  return match ? decodeURIComponent(match.slice(name.length + 1)) : undefined;
}

export function getAccessToken(request: Request) {
  return (
    getCookieValue(request, ACCESS_COOKIE) ||
    getCookieValue(request, LEGACY_ACCESS_COOKIE)
  );
}

export function getRefreshToken(request: Request) {
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
  const user = payload?.user ?? payload?.authUser ?? data?.user ?? null;
  const accessToken =
    payload?.access_token ??
    payload?.token ??
    tokenPayload?.access_token ??
    tokenPayload?.token;
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
  const sessionMaxAge = REFRESH_COOKIE_MAX_AGE_SECONDS;

  setAuthCookie(response, ACCESS_COOKIE, auth.accessToken, true, sessionMaxAge);
  setAuthCookie(response, REFRESH_COOKIE, auth.refreshToken, true, REFRESH_COOKIE_MAX_AGE_SECONDS);
  setAuthCookie(response, "user_role", auth.role, false, sessionMaxAge);
  setAuthCookie(response, "user_language", auth.language, false, sessionMaxAge);
  setAuthCookie(response, "user_data", JSON.stringify(auth.user || {}), false, sessionMaxAge);
  setAuthCookie(response, "user_progress", auth.progress, false, sessionMaxAge);
  setAuthCookie(
    response,
    "user_timezone",
    auth.timezone || DEFAULT_TIMEZONE,
    false,
    sessionMaxAge,
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

/**
 * Refresh a backend session through the same endpoint fallback used by the
 * browser-facing auth routes. Keeping this here prevents server-rendered and
 * proxied requests from drifting into separate refresh flows.
 */
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


