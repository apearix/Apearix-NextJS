export const DEFAULT_TIMEZONE = process.env.NEXT_PUBLIC_TIMEZONE || "Asia/Kolkata";
/** Stable timezone used when client-only preferences are unavailable during SSR. */
export const CREATED_AT_SSR_TIMEZONE = "UTC";
export const TIMEZONE_COOKIE = "user_timezone";
export const TIMEZONE_CHANGED_EVENT = "user-timezone-changed";

const TIMEZONE_ALIASES: Readonly<Record<string, string>> = {
  "Asia/Calcutta": DEFAULT_TIMEZONE,
};

export type DateInput = string | number | Date | null | undefined;

export interface FormattedCreatedAt {
  date: string;
  time: string;
  isValid: boolean;
}

export function isValidTimezone(value: unknown): value is string {
  if (typeof value !== "string" || !value.trim()) return false;

  try {
    new Intl.DateTimeFormat("en", { timeZone: value }).format();
    return true;
  } catch {
    return false;
  }
}

export function normalizeTimezone(value: unknown): string {
  const timezone = String(value ?? "").trim();
  const canonical = TIMEZONE_ALIASES[timezone] ?? timezone;
  return isValidTimezone(canonical) ? canonical : DEFAULT_TIMEZONE;
}

export function getUserTimezone(): string {
  if (typeof document === "undefined") return DEFAULT_TIMEZONE;

  const match = document.cookie.match(
    new RegExp(`(?:^|; )${TIMEZONE_COOKIE}=([^;]*)`),
  );
  return normalizeTimezone(match ? decodeURIComponent(match[1]) : null);
}

export function persistUserTimezone(value: string): string {
  const timezone = normalizeTimezone(value);

  if (typeof document !== "undefined") {
    document.cookie = `${TIMEZONE_COOKIE}=${encodeURIComponent(timezone)}; Path=/; SameSite=Lax`;
    window.dispatchEvent(
      new CustomEvent(TIMEZONE_CHANGED_EVENT, { detail: { timezone } }),
    );
  }

  return timezone;
}

export function parseApiDate(value: DateInput): Date | null {
  if (value === null || value === undefined || value === "") return null;
  const normalized =
    typeof value === "string" &&
    /^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}/.test(value) &&
    !/(?:Z|[+-]\d{2}:?\d{2})$/i.test(value)
      ? `${value.replace(" ", "T")}Z`
      : value;
  const date = normalized instanceof Date ? normalized : new Date(normalized);
  return Number.isNaN(date.getTime()) ? null : date;
}

/** Formats a creation timestamp in the authenticated user's IANA timezone. */
export function formatCreatedAt(
  value: DateInput,
  timezone = getUserTimezone(),
): FormattedCreatedAt {
  const date = parseApiDate(value);
  if (!date) return { date: "-", time: "", isValid: false };

  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: normalizeTimezone(timezone),
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).formatToParts(date);
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((item) => item.type === type)?.value || "";

  return {
    date: `${part("day")} ${part("month")} ${part("year")}`,
    time: `${part("hour")}:${part("minute")} ${part("dayPeriod").toUpperCase()}`,
    isValid: true,
  };
}

export function formatDateTimeInTimezone(
  value: DateInput,
  timezone = getUserTimezone(),
  options: Intl.DateTimeFormatOptions = {},
  locale = "en-IN",
): string {
  const date = parseApiDate(value);
  if (!date) return "-";

  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    ...options,
    timeZone: normalizeTimezone(timezone),
  }).format(date);
}

export function formatDateInTimezone(
  value: DateInput,
  timezone = getUserTimezone(),
  options: Intl.DateTimeFormatOptions = {},
  locale = "en-IN",
): string {
  return formatDateTimeInTimezone(
    value,
    timezone,
    {
      year: "numeric", month: "short", day: "2-digit",
      hour: undefined, minute: undefined, second: undefined,
      ...options,
    },
    locale,
  );
}

export function formatTimeInTimezone(
  value: DateInput,
  timezone = getUserTimezone(),
  options: Intl.DateTimeFormatOptions = {},
  locale = "en-IN",
): string {
  return formatDateTimeInTimezone(
    value,
    timezone,
    { hour: "2-digit", minute: "2-digit", year: undefined, month: undefined, day: undefined, ...options },
    locale,
  );
}

export function getTimezoneOptions(): Array<{ value: string; label: string }> {
  const intlWithSupportedValues = Intl as typeof Intl & {
    supportedValuesOf?: (key: "timeZone") => string[];
  };
  const zones = Array.from(new Set([
    DEFAULT_TIMEZONE,
    "Asia/Kolkata",
    ...(intlWithSupportedValues.supportedValuesOf?.("timeZone") || []).map(
      normalizeTimezone,
    ),
  ])).sort((a, b) => a.localeCompare(b));

  return zones.map((timezone) => {
    const abbreviation = new Intl.DateTimeFormat("en", {
      timeZone: timezone,
      timeZoneName: "short",
    })
      .formatToParts(new Date())
      .find((part) => part.type === "timeZoneName")?.value;

    return {
      value: timezone,
      label: abbreviation ? `${timezone} (${abbreviation})` : timezone,
    };
  });
}

export function formatForDateTimeLocalInput(value: DateInput, timezone = getUserTimezone()): string {
  const date = parseApiDate(value);
  if (!date) return "";

  // formatToParts to get exact local values
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: normalizeTimezone(timezone),
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(date);

  const part = (type: Intl.DateTimeFormatPartTypes) => parts.find((p) => p.type === type)?.value || "00";
  
  // Format: YYYY-MM-DDThh:mm (for <input type="datetime-local">)
  // Note: en-US uses hour 24 as 24 instead of 00 sometimes, so we fix 24 to 00.
  let hour = part("hour");
  if (hour === "24") hour = "00";
  
  return `${part("year")}-${part("month")}-${part("day")}T${hour}:${part("minute")}`;
}

