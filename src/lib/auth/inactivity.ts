"use client";

import { getLoginPathForPath, getLoginPathForRole } from "@/lib/auth/routes";
import { unregisterFirebaseMessaging } from "@/lib/firebaseClient";

export const LAST_ACTIVITY_KEY = "auth_last_activity_at";
const DEFAULT_SESSION_LIFETIME_MINUTES = 15;
const LOGOUT_IN_PROGRESS_KEY = "__auth_logout_in_progress__";

export function getClientSessionLifetimeMinutes(value?: unknown) {
  const minutes = Number(value ?? process.env.NEXT_PUBLIC_SESSION_LIFETIME);

  return Number.isFinite(minutes) && minutes > 0
    ? minutes
    : DEFAULT_SESSION_LIFETIME_MINUTES;
}

export function markActivity(timestamp = Date.now()) {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(LAST_ACTIVITY_KEY, String(timestamp));
}

export function getLastActivityAt() {
  if (typeof window === "undefined") return Date.now();

  const value = Number(window.localStorage.getItem(LAST_ACTIVITY_KEY));

  return Number.isFinite(value) && value > 0 ? value : Date.now();
}

export function isIdleExpired(sessionLifetimeMinutes?: number) {
  if (typeof window === "undefined") return false;

  const lifetimeMs =
    getClientSessionLifetimeMinutes(sessionLifetimeMinutes) * 60 * 1000;

  return Date.now() - getLastActivityAt() >= lifetimeMs;
}

export async function logoutForInactivity(redirectTo?: string) {
  if (typeof window === "undefined") return;

  if ((window as any)[LOGOUT_IN_PROGRESS_KEY]) return;
  (window as any)[LOGOUT_IN_PROGRESS_KEY] = true;

  const fallbackPath = getLoginPathForPath(window.location.pathname);
  const role = document.cookie
    .split(";")
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith("user_role="))
    ?.split("=")[1];
  const targetPath = redirectTo ?? (role ? getLoginPathForRole(decodeURIComponent(role)) : fallbackPath);

  try {
    await unregisterFirebaseMessaging();

    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "same-origin",
    });
  } finally {
    window.localStorage.clear();
    window.sessionStorage.clear();
    window.location.replace(targetPath);
  }
}
