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

  // Remove host/origin/encoding headers to prevent issues with upstream proxy & decompression
  headers.delete("host");
  headers.delete("origin");
  headers.delete("referer");
  headers.delete("accept-encoding");
  headers.delete("content-length");

  let body: any = undefined;
  if (req.method !== "GET" && req.method !== "HEAD") {
    const blob = await req.blob();
    if (blob.size > 0) {
      body = blob;
    }
  }

  try {
    const response = await fetch(url, {
      method: req.method,
      headers,
      body,
      redirect: "manual",
      duplex: "half",
    } as any);

    const contentType = response.headers.get("content-type") || "";

    // Support streaming responses like Server-Sent Events (SSE)
    if (contentType.includes("text/event-stream")) {
      return new NextResponse(response.body, {
        status: response.status,
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache, no-transform",
          Connection: "keep-alive",
        },
      });
    }

    const responseHeaders = new Headers(response.headers);
    // Remove headers that conflict with Next.js response body streaming
    responseHeaders.delete("content-encoding");
    responseHeaders.delete("content-length");
    responseHeaders.delete("transfer-encoding");
    responseHeaders.delete("connection");
    responseHeaders.delete("keep-alive");

    const dataBuffer = await response.arrayBuffer();

    return new NextResponse(dataBuffer, {
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
