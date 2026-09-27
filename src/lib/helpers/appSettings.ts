import { index } from "../services/admin/settings";


interface AppSettingsCookie {
  data: Record<string, string>;
  timestamp: number;
}

/**
 * Set a cookie (browser only)
 */
export function setCookieData(name: string, value: string, days = 7) {
  if (typeof document === "undefined") return; // server guard

  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/`;
}

/**
 * Get all settings from cookie (browser only)
 */
export function getAllSettingsFromCookie(): Record<string, string> | null {
  if (typeof document === "undefined") return null; // server guard

  const match = document.cookie.match(new RegExp('(^| )app_settings=([^;]+)'));
  if (!match) return null;

  try {
    const cookie: AppSettingsCookie = JSON.parse(decodeURIComponent(match[2]));

    const now = Date.now();
    const twentyFourHours = 24 * 60 * 60 * 1000;

    if (!cookie.timestamp || now - cookie.timestamp > twentyFourHours) {
      return null; // expired
    }

    return cookie.data;
  } catch {
    return null;
  }
}

/**
 * Synchronously get a setting by key (safe for server)
 */
export function getSettingByKey(key: string): string {
  const settings = getAllSettingsFromCookie();
  return settings?.[key] ?? "";
}

/**
 * Synchronously get multiple settings by keys (safe for server)
 */
export function getSettingsByKeys(keys: string[]): Record<string, string> {
  const settings = getAllSettingsFromCookie() || {};
  const result: Record<string, string> = {};
  keys.forEach((key) => {
    result[key] = settings[key] ?? "";
  });
  return result;
}

/**
 * Call once on app load to fetch settings from API and store in cookie
 */
export async function initializeSettings(): Promise<void> {
  try {
    const { records } = await index({ page: "1", limit: "100" });
    const newSettings: Record<string, string> = {};
    records.forEach((record: any) => {
      newSettings[record.key] = record.value;
    });

    // Store data + timestamp in cookie (browser only)
    const cookieValue: AppSettingsCookie = {
      data: newSettings,
      timestamp: Date.now(),
    };

    setCookieData("app_settings", JSON.stringify(cookieValue));
  } catch (error) {
    console.error("Failed to fetch settings from API", error);
  }
}
