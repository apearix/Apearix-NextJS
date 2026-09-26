import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  ADMIN_LOGIN_PATH,
  USER_LOGIN_PATH,
  getDashboardPathForRole,
  getLoginPathForPath,
} from "@/lib/auth/routes";
import {
  clearAuthCookies,
  fetchBackendWithFallback,
  parseJsonResponse,
  setSessionCookies,
} from "@/lib/auth/session";

const REFRESH_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

function isExpiredAccessToken(token?: string) {
  if (!token) return true;

  try {
    const payload = token.split(".")[1];
    if (!payload) return true;

    const decoded = JSON.parse(
      atob(payload.replace(/-/g, "+").replace(/_/g, "/")),
    );

    return (
      typeof decoded.exp === "number" &&
      decoded.exp <= Math.floor(Date.now() / 1000)
    );
  } catch { 
    return true;
  }
}

async function refreshSession(req: NextRequest, res: NextResponse) {
  const refreshToken = req.cookies.get("refresh_token")?.value;
  if (!refreshToken) return false;

  try {
    const refreshResponse = await fetchBackendWithFallback(
      ["/auth/refresh", "/refresh-token"],
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: refreshToken }),
        cache: "no-store",
      },
    );
    const data = await parseJsonResponse(refreshResponse);

    if (!refreshResponse.ok || data?.status === "error") return false;

    setSessionCookies(res, data);
    return true;
  } catch (error) {
    console.error("[middleware] Session refresh failed:", error);
    return false;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const url = req.nextUrl.clone();

  // =======================================================
  // Ignore Next.js internals & static assets
  // =======================================================
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname.startsWith("/images") ||
    pathname.match(/\.(ico|png|jpg|jpeg|svg|css|js|webp)$/)
  ) {
    return NextResponse.next();
  }

  const res = NextResponse.next();

  // =======================================================
  // Auth cookies
  // =======================================================
  const token =
    req.cookies.get("access_token")?.value || req.cookies.get("token")?.value;
  const refreshToken = req.cookies.get("refresh_token")?.value;
  const role = req.cookies.get("user_role")?.value?.toLowerCase();
  let hasSession = Boolean(token || refreshToken);

  // =======================================================
  // Auth pages
  // =======================================================
  const authPages = [ADMIN_LOGIN_PATH, USER_LOGIN_PATH, "/login"];

  if (authPages.includes(pathname)) {
    if (hasSession && role) {
      url.pathname = getDashboardPathForRole(role);
      return NextResponse.redirect(url);
    }

    if (pathname === "/login") {
      url.pathname = ADMIN_LOGIN_PATH;
      const redirectResponse = NextResponse.redirect(url);
      clearAuthCookies(redirectResponse);
      return redirectResponse;
    }

    clearAuthCookies(res);
    return res;
  }

  // =======================================================
  // Protected dashboard routes ONLY
  // =======================================================
  const protectedRoutes = [
    { prefix: "/admin", roles: ["admin"] },
    { prefix: "/user", roles: ["user", "company"] },
  ];

  const matchedRoute = protectedRoutes.find((r) =>
    pathname.startsWith(r.prefix),
  );

  // Refresh expired access token before rendering protected routes
  if (matchedRoute && isExpiredAccessToken(token)) {
    hasSession = refreshToken ? await refreshSession(req, res) : false;
  }

  // =======================================================
  // Not logged in -> block dashboards
  // =======================================================
  if (matchedRoute && !hasSession) {
    url.pathname = getLoginPathForPath(matchedRoute.prefix);
    const redirectResponse = NextResponse.redirect(url);
    clearAuthCookies(redirectResponse);
    return redirectResponse;
  }

  // =======================================================
  // Logged in but wrong role -> redirect to correct dashboard
  // =======================================================
  if (matchedRoute && role && !matchedRoute.roles.includes(role)) {
    url.pathname = getDashboardPathForRole(role);
    return NextResponse.redirect(url);
  }

  // =======================================================
  // Refresh auxiliary cookies if present
  // =======================================================
  const cookiesToRefresh = ["user_role", "user_data", "user_language"];

  cookiesToRefresh.forEach((name) => {
    const value = req.cookies.get(name)?.value;

    if (value) {
      res.cookies.set({
        name,
        value,
        path: "/",
        maxAge: REFRESH_COOKIE_MAX_AGE_SECONDS,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      });
    }
  });

  return res;
}

// Next.js standard config matcher: static files & API routes ko skip karne ke liye
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};