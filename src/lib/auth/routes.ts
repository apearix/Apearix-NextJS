export const LOGIN_PATH = "/login";
export const ADMIN_LOGIN_PATH = LOGIN_PATH;
// export const USER_LOGIN_PATH = LOGIN_PATH; // Removed as per Apearix plan

export function getDashboardPathForRole(role?: string | null): string {
  const normalizedRole = String(role || "").toLowerCase().trim();

  if (normalizedRole === "admin") {
    return "/admin/dashboard";
  }

  // User panel scope is reserved for future expansion (6-7 months later)
  // if (normalizedRole === "user") {
  //   return "/user/dashboard";
  // }

  return LOGIN_PATH;
}
 
export function getLoginPathForRole(_role?: string | null): string {
  return LOGIN_PATH;
}
 
export function getLoginPathForPath(pathname?: string | null): string {
  if (pathname && pathname !== LOGIN_PATH) {
    return `${LOGIN_PATH}?redirect=${encodeURIComponent(pathname)}`;
  }
  return LOGIN_PATH;
}