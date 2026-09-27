import { NextResponse } from "next/server";
import { setSessionCookies } from "@/lib/auth/session";
import { mfaVerify } from "@/lib/services/admin/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { response, data } = await mfaVerify(body);

    if (!response.ok || data?.status === "error") {
      return NextResponse.json(data || { status: "error", message: "Invalid MFA code" }, { status: response.status || 401 });
    }

    const nextResponse = NextResponse.json(data);
    setSessionCookies(nextResponse, data);

    return nextResponse;
  } catch (error: any) {
    console.error("MFA Verify API Error:", error);
    return NextResponse.json({ status: "error", message: "Internal server error" }, { status: 500 });
  }
}
