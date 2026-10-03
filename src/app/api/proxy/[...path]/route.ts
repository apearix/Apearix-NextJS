import { NextRequest, NextResponse } from "next/server";
import { backendBaseUrl } from "@/lib/auth/session";

async function handleRequest(req: NextRequest, context: any) {
  const params = await context.params;
  const path = params.path.join("/");
  const url = `${backendBaseUrl()}/${path}${req.nextUrl.search}`;

  const headers = new Headers(req.headers);
  const token = req.cookies.get("access_token")?.value || req.cookies.get("token")?.value;
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  // Remove host/origin headers to prevent issues with the backend server
  headers.delete("host");
  headers.delete("origin");
  headers.delete("referer");

  let body: any = undefined;
  if (req.method !== "GET" && req.method !== "HEAD") {
    body = await req.blob();
  }

  try {
    const response = await fetch(url, {
      method: req.method,
      headers,
      body,
      redirect: "manual",
      duplex: "half",
    } as any);

    const responseHeaders = new Headers(response.headers);
    responseHeaders.delete("content-encoding");

    return new NextResponse(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  } catch (error: any) {
    console.error("[Proxy Error]:", error);
    return NextResponse.json({ message: "Proxy Error", error: error.message }, { status: 500 });
  }
}

export const GET = handleRequest;
export const POST = handleRequest;
export const PUT = handleRequest;
export const PATCH = handleRequest;
export const DELETE = handleRequest;
export const OPTIONS = handleRequest;
