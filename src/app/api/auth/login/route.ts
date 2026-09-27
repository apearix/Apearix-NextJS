import { NextResponse } from "next/server";
import { setSessionCookies, extractAuthPayload } from "@/lib/auth/session";
import { login } from "@/lib/services/admin/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { response, data } = await login(body);

    if (!response.ok || data?.status === "error") {
      return NextResponse.json(data || { status: "error", message: "Invalid credentials" }, { status: response.status || 401 });
    }

    if (data?.status === "mfa_required") {
        return NextResponse.json(data);
    }

    // Extract auth payload to ensure role is passed back to frontend
    const auth = extractAuthPayload(data);
    const enrichedData = { ...data, role: auth.role, user: auth.user };
    
    const nextResponse = NextResponse.json(enrichedData);
    setSessionCookies(nextResponse, data);

    return nextResponse;
  } catch (error: any) {
    console.error("Login API Error:", error);
    return NextResponse.json({ status: "error", message: "Internal server error: " + (error.message || String(error)) }, { status: 500 });
  }
}
