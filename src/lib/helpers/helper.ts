import { getDashboardPathForRole } from "@/lib/auth/routes";
import {
  DEFAULT_TIMEZONE,
  formatDateTimeInTimezone,
  getUserTimezone,
  parseApiDate,
} from "@/lib/timezone";

const SHORT_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Format date into readable string or custom format
export function formatDate(
  dateStr: string | Date | undefined | null,
  format?: string,
  locale: string = "en-IN",
  formatType: "12" | "24" = "24"
): string {
  if (!dateStr) return "-";
  let timezone = getUserTimezone();
  if (!timezone) timezone = "UTC";
  const date = parseApiDate(dateStr);
  if (!date) return "-";

  if (format) {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit", hour12: false,
    }).formatToParts(date);
    const part = (type: Intl.DateTimeFormatPartTypes) =>
      parts.find((item) => item.type === type)?.value || "";
    const dd = part("day");
    const d = String(Number(dd));
    const MM = part("month");
    const M = String(Number(MM));
    const mmm = SHORT_MONTHS[Number(MM) - 1];
    const yyyy = part("year");
    const yy = yyyy.slice(-2);
    const hour = Number(part("hour")) % 24;
    const HH = String(hour).padStart(2, "0");
    const hh = String(hour % 12 || 12).padStart(2, "0");
    const a = hour < 12 ? "AM" : "PM";

    return format
      .replace(/dd/g, dd)
      .replace(/d/g, d)
      .replace(/MM/g, MM)
      .replace(/M/g, M)
      .replace(/mmm/g, mmm)
      .replace(/yyyy/g, yyyy)
      .replace(/yy/g, yy)
      .replace(/HH/g, HH)
      .replace(/hh/g, hh)
      .replace(/mm/g, part("minute"))
      .replace(/a/g, formatType === "12" ? a : "");
  }

  // Default readable format based on formatType
  return formatDateTimeInTimezone(date, timezone, { hour12: formatType === "12" }, locale);
}

// FormatDateTime
export function formatDateTime(
  dateStr: string | Date | undefined | null,
  locale: string = "en-IN",
  formatType: "12" | "24" = "24"
): string {
  if (!dateStr) return "-";

  const date = parseApiDate(dateStr);
  if (!date) return "-";
  let timezone = getUserTimezone();

  if (!timezone) timezone = "UTC";
  return formatDateTimeInTimezone(date, timezone, { hour12: formatType === "12" }, locale);
}

export function formatCurrency(
  amount: number | string,
  currency: string = "USD",
  locale: string = "en-IN"
): string {
  const num = Number(amount);
  if (isNaN(num)) return "-";

  const user_currency = getCookie("user_currency");

  // Find currency data

 const currencies = [
    { code: 'USD', symbol: '$', rate: 1 },
    { code: 'EUR', symbol: '€', rate: 0.92 },
    { code: 'INR', symbol: '₹', rate: 83.10 },
    { code: 'CAD', symbol: 'C$', rate: 1.36 },
  ];

  const curr = currencies.find((c) => c.code === user_currency);
  const symbol = curr ? curr.symbol : "₹";

  // If no rate found → use original amount
  const rate = curr ? curr.rate : 1;

  // Apply exchange rate
  const convertedAmount = num * rate;

  // Format
  // Format using Intl but REMOVE default symbol
  const formatted = new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  })
    .format(convertedAmount)
    .replace(/[^0-9.,\s-]+/g, "") // remove original currency symbol
    .trim();

  // Add custom symbol manually
  return `${symbol}${formatted}`;
}

// Capitalize first letter of a string
export function capitalize(str: string): string {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Truncate text with ellipsis
export function truncateText(str: string, length: number = 50): string {
  if (!str) return "";
  return str.length > length ? str.substring(0, length) + "..." : str;
}

// Check if object is empty
export function isEmpty(obj: object): boolean {
  return Object.keys(obj).length === 0;
}

// Safe JSON parse
export function safeJSONParse<T>(value: string, fallback: T): T {
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function nl2br(value: string | number | null | undefined) {
  if (value === null || value === undefined) {
    return { __html: "" };
  }

  // Convert number to string safely
  const str = String(value);

  // Preserve leading spaces and multiple spaces
  const preserved = str.replace(/ {2}/g, " &nbsp;"); // preserve double spaces
  const withLeadingSpace = preserved.replace(/^ /gm, "&nbsp;");

  // Replace newline characters with <br />
  const html = withLeadingSpace.replace(/\n/g, "<br />");

  return { __html: html };
}


// helpers/url.ts
export function ensureHttps(url?: string): string | undefined {
  return url;
  // if (!url) return url; // handle undefined/null
  // return url.startsWith('http://') ? url.replace(/^http:/, 'https:') : url;
}


export function isAuthClient(): boolean {
  return !!getCookie("user_role");
}

export function authRoleClient(requiredRole: string): boolean {
  return getCookie("user_role") === requiredRole;
}

// helper to read cookie
export function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null; // SSR-safe
  const match = document.cookie.match(new RegExp('(?:^|;\\s*)' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[1]) : null;
}

export function parseCookies(cookieHeader: string | null) {
  if (!cookieHeader) return {};
  return Object.fromEntries(
    cookieHeader.split(';').map(c => {
      const [k, v] = c.trim().split('=');
      return [k, decodeURIComponent(v)];
    })
  );
}

export function authRole(): string | null {
  return getCookie("user_role");
}

export interface AuthUser {
  id: number;
  first_name: string;
  last_name: string;
  full_name: string;
  wallet_balance: any;
  email: string;
  avatar: string;
  roles?: { id: number; name: string; prefix: string }[];
  [key: string]: any; 
}

export function getAuthUser(): { user: AuthUser | null; role: string | null } {
  if (typeof document === "undefined") return { user: null, role: null }; // SSR safety

  let user: AuthUser | null = null;
  let role: string | null = null;

  try {
    const rawUserData = getCookie("user_data");
    if (rawUserData) {
      const parsed = JSON.parse(rawUserData);
      user = typeof parsed === "string" ? JSON.parse(parsed) : parsed;
    }
  } catch (e) {
    user = null;
  }

  // Fallback to localStorage if cookie user is not found or empty
  if (!user || (typeof user === "object" && Object.keys(user).length === 0)) {
    try {
      const localUserData =
        localStorage.getItem("user_data") ||
        localStorage.getItem("currentUser") ||
        localStorage.getItem("user");
      if (localUserData) {
        const parsed = JSON.parse(localUserData);
        user = typeof parsed === "string" ? JSON.parse(parsed) : parsed;
      }
    } catch (e) {
      // ignore
    }
  }

  try {
    const rawRole =
      getCookie("user_role") ||
      (typeof window !== "undefined"
        ? localStorage.getItem("user_role") || localStorage.getItem("role")
        : null);
    if (rawRole) {
      role = capitalizeFirst(rawRole);
    }
  } catch (e) {
    // ignore
  }

  return { user, role };
}

export function getAuthUserFullName(): string {
  const { user } = getAuthUser();
  if (!user) return "Guest";
  const actualUser = (user as any)?.user || user;
  return (
    actualUser.full_name ||
    actualUser.name ||
    (actualUser.first_name ? `${actualUser.first_name} ${actualUser.last_name || ""}`.trim() : null) ||
    actualUser.username ||
    "User"
  );
}

export function getAuthUserId(): number | null {
  const { user } = getAuthUser();
  return user?.id ?? null;
}

export function getAuthUserWalletBalance() {
  const { user } = getAuthUser();
  return user?.wallet_balance ?? null;
}

function capitalizeFirst(str: string) {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function insertCustomMarkup(text: string, customMarkup = []) {
  text = text || '';

  const defaultMarkup = [
    { pattern: /\*\*(.*?)\*\*/g, replacement: '<strong>$1</strong>' },
    { pattern: /``(.*?)``/g, replacement: '<em>$1</em>' },
  ];

  const allMarkup = defaultMarkup.concat(customMarkup);

  allMarkup.forEach(rule => {
    text = text.replace(rule.pattern, rule.replacement);
  });

  text = text.replace(
    /(?<!\S)((?:https?|ftp):\/\/\S+?\/?\S+?)(?!\S)/gi,
    match => `<a target="_blank" href="${match}">${match}</a>`
  );

  return text.replace(/\n/g, '<br>');
}

export function redirectToDashboard(role: string | null) {
  window.location.href = getDashboardPathForRole(role);
}

export function diffForHuman(dateStr: string): string {
  if (!dateStr) return "-";

  const date = parseApiDate(dateStr);
  if (!date) return "-";
  const now = new Date();

  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  const diffMonth = Math.floor(diffDay / 30);
  const diffYear = Math.floor(diffDay / 365);

  if (diffSec < 60) return "just now";
  if (diffMin < 60) return `${diffMin} minute${diffMin > 1 ? "s" : ""} ago`;
  if (diffHour < 24) return `${diffHour} hour${diffHour > 1 ? "s" : ""} ago`;
  if (diffDay < 30) return `${diffDay} day${diffDay > 1 ? "s" : ""} ago`;
  if (diffMonth < 12) return `${diffMonth} month${diffMonth > 1 ? "s" : ""} ago`;
  return `${diffYear} year${diffYear > 1 ? "s" : ""} ago`;
}

export const isValidFile = (file: File, accept: string): boolean => {
  const allowedTypes = accept.split(",").map(t => t.trim());

  return allowedTypes.some(type => {
    if (type === ".jpg" || type === ".jpeg") return file.type === "image/jpeg";
    if (type === ".png") return file.type === "image/png";
    if (type === ".pdf") return file.type === "application/pdf";
    if (type === "image/*") return file.type.startsWith("image/");
    return false;
  });
};

export const sanitizeFileName = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/\s+/g, "_")   
    .replace(/[^a-z0-9._-]/g, ""); 
};

export function setCookieData(name: string, value: string, days = 7) {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/`;
}

export function saveSettingsToCookie(settings: Record<string, any>, cookieName = "app_settings", days = 7) {
  // Convert settings object to JSON string
  const jsonValue = JSON.stringify(settings);
  setCookieData(cookieName, jsonValue, days);
}

export function getUserBioFormat(user: any) {
  const business = user.business_payload ? JSON.parse(user.business_payload) : null;

  const legalAddress = business?.legal_address;
  const actualAddress = business?.actual_address;

  const fullLegalAddress =
    legalAddress?.address || legalAddress?.country || legalAddress?.state || legalAddress?.city
      ? `${legalAddress?.address ?? ''}, ${legalAddress?.city ?? ''}, ${legalAddress?.state ?? ''}, ${legalAddress?.country ?? ''}`.replace(/(, )+/g, ', ').replace(/^,|,$/g, '')
      : '';

  const fullActualAddress =
    actualAddress?.address || actualAddress?.country || actualAddress?.state || actualAddress?.city
      ? `${actualAddress?.address ?? ''}, ${actualAddress?.city ?? ''}, ${actualAddress?.state ?? ''}, ${actualAddress?.country ?? ''}`.replace(/(, )+/g, ', ').replace(/^,|,$/g, '')
      : '';

  const line = (label: string, value: any) =>
    value !== undefined && value !== null && value !== ''
      ? `${label}: ${value}`
      : '';

  const lines = [
    line('Name', user.full_name),
    line('Username', user.username),
    line('Email', user.email),
    line('Phone', `${user.country_code ? '+' + user.country_code : ''} ${user.phone}`.trim()),
    line('Role', user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : ''),
    line('Title', user.title),
    line('Bio', user.bio),
    line('Gender', user.gender),
    line('DOB', user.dob),
    line('Business Type', business?.business_type === 1 ? 'Individual' : business?.business_type === 2 ? 'Company' : ''),
    line('Company Name', business?.company_name),
    line('Designation', business?.designation),
    line('Legal Address', fullLegalAddress),
    line('Actual Address', fullActualAddress),
    line('Account Status', user.status === 1 ? 'Active' : 'Inactive'),
    line('Verified', user.is_verified ? 'Yes' : 'No'),
    line('User ID', user.prefix),
  ];

  return lines.filter(Boolean).join('\n');
}

export function parseJSON(value: any) {
  try {
    if (typeof value === "object") return value; // already an object
    return JSON.parse(value);
  } catch (err) {
    return value; // return as-is if not valid JSON
  }
}

export function getDefaultTimeZone() {
  return "Asia/Kolkata";
}

export function getLastSeen(lastSeen: string | Date | null | undefined) {
  if (!lastSeen) {
    return 'A while ago';
  }

  const date = parseApiDate(lastSeen);
  if (!date) return 'A while ago';
  const now = new Date();

  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = diffMs / (1000 * 60);

  if (diffMinutes <= 5) {
    return ' Online';
  }

  const diffHours = diffMinutes / 60;
  const diffDays = diffHours / 24;

  let text = "";

  if (diffMinutes < 60) text = `${Math.floor(diffMinutes)} min ago`;
  else if (diffHours < 24) text = `${Math.floor(diffHours)} hrs ago`;
  else text = `${Math.floor(diffDays)} days ago`;

  return `${text}`;
}

export function getGreetingBasedOnTime(timezone = "UTC") {
  try {
    const date = new Date().toLocaleString("en-US", { timeZone: timezone });
    const hour = new Date(date).getHours();

    if (hour >= 20) return "good_night";
    if (hour >= 17) return "good_evening";
    if (hour >= 12) return "good_afternoon";
    return "good_morning";
  } catch (error) {
    // fallback if timezone is invalid
    const hour = new Date().getUTCHours();
    if (hour >= 20) return "good_night";
    if (hour >= 17) return "good_evening";
    if (hour >= 12) return "good_afternoon";
    return "good_morning";
  }
}

export function generateExportFilename(moduleName: string, userName: string = "User") {
  const now = new Date();
  const date = now.toISOString().slice(0, 10).replace(/-/g, "_");
  const time = now.toTimeString().slice(0, 8).replace(/:/g, "");
  const appName = process.env.NEXT_PUBLIC_APP_NAME || "zStarter";

  return `${moduleName}_Exported_At_${date}_${time}_via_${appName}_By_${userName}.xlsx`;
}

export function getUserLanguageFromCookie() {
  try {
    const langCookie = getCookie("user_language")?.toString().toLowerCase();

    return langCookie === "hi" ? "hi" : "en";
  } catch (error) {
    return "en";
  }
}

export function exportTableToExcel(tableId: string, filename: string = 'export') {
  const table = document.getElementById(tableId);

  if (!table) {
    console.error(`Table with ID '${tableId}' not found.`);
    return;
  }

  const clonedTable = table.cloneNode(true) as HTMLTableElement;
  const noExportElements = clonedTable.querySelectorAll('.no-export');
  noExportElements.forEach((el) => el.remove());
  
  // Use legacy Excel MIME type
  const dataType = 'application/vnd.ms-excel';
  const downloadLink = document.createElement('a');
  
  // Add Byte Order Mark (BOM) to support UTF-8 characters
  const content = `\uFEFF${clonedTable.outerHTML}`;
  
  const blob = new Blob([content], {
    type: dataType
  });

  const url = URL.createObjectURL(blob);
  downloadLink.href = url;
  
  downloadLink.download = filename.endsWith(".xlsx") ? filename : `${filename}.xlsx`;

  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}

export const focusErrorField = (
  errors: Record<string, string>,
  fieldRefs: Record<string, any>,
) => {
  if (Object.keys(errors).length === 0) return;

  const firstKey = Object.keys(errors)[0];
  const ref = fieldRefs[firstKey];

  if (ref?.current) {
    ref.current.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });

    if ("focus" in ref.current) {
      ref.current.focus();
    }
  }
};
export const getTimeBasedGreeting = (date: Date = new Date()): string => {
  const hour = date.getHours();

  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  if (hour < 21) return "Good Evening";

  return "Good Night";
};

export const formatDateFormat = (dateString: string | null) => {
  if (!dateString) return "";
  return dateString.split("T")[0];
};

export const formattedDateTime = (dateString: string | null) => {
  if (!dateString) return "";

  const date = parseApiDate(dateString);
  if (!date) return "";

  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: DEFAULT_TIMEZONE,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((item) => item.type === type)?.value || "";

  return `${part("day")}-${part("month")}-${part("year")} ${part("hour")}:${part("minute")}`;
};


