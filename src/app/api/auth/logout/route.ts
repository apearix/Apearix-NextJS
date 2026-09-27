import { NextResponse } from "next/server";
import { logout } from "@/lib/services/admin/auth";
import { clearAuthCookies } from "@/lib/auth/session";

export async function POST() {
  try {
    // Notify the backend that the user is logging out
    await logout();

    // Clear session cookies securely
    const response = NextResponse.json({ status: "success", message: "Logged out successfully" });
    clearAuthCookies(response);

    return response;
  } catch (error: any) {
    console.error("Logout API Error:", error);
    // Still clear cookies on error to ensure user is logged out locally
    const response = NextResponse.json({ status: "error", message: "Internal server error during logout" }, { status: 500 });
    clearAuthCookies(response);
    return response;
  }
}
