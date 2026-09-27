import { NextResponse } from "next/server";
import { changePassword } from "@/lib/services/admin/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { response, data } = await changePassword(body);

    if (!response.ok || data?.status === "error") {
      return NextResponse.json(data || { status: "error", message: "Failed to reset password" }, { status: response.status || 400 });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Reset Password API Error:", error);
    return NextResponse.json({ status: "error", message: "Internal server error" }, { status: 500 });
  }
}
