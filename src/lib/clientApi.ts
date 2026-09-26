"use client";

import { markActivity } from "@/lib/auth/inactivity";

async function parseJsonSafe(response: Response) {
  const text = (await response.text()).replace(/^\uFEFF/, "");

  if (!text) return null;

  try {
    const parsed = JSON.parse(text);
    if (typeof parsed === "string") {
      try {
        return JSON.parse(parsed.replace(/^\uFEFF/, ""));
      } catch {
        return { message: parsed };
      }
    }

    return parsed;
  } catch {
    const contentType =
      response.headers.get("content-type")?.toLowerCase() || "";
    const looksLikeHtml =
      contentType.includes("text/html") || /^\s*<!doctype html/i.test(text);
    return looksLikeHtml ? null : { message: text };
  }
}

export async function clientApi<T>(
  path: string,
  options: RequestInit = {},
  requireAuth: boolean = true,
): Promise<T> {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const baseUrl = process.env.NEXT_PUBLIC_NEST_API_BASE_URL?.replace(/\/$/, "") || "";
  const url = normalizedPath.startsWith("http")
    ? normalizedPath
    : `${baseUrl}${normalizedPath}`;
  const isFormData = options.body instanceof FormData;

  const finalOptions: RequestInit = {
    ...options,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...options.headers,
    },
    credentials: "same-origin",
  };

  let response = await fetch(url, finalOptions);

  if (response.status === 401 && requireAuth) {
    const refreshResponse = await fetch("/api/auth/refresh", {
      method: "POST",
      credentials: "same-origin",
    });

    if (refreshResponse.ok) {
      markActivity();
      response = await fetch(url, finalOptions);
    }

    if (response.status === 401) {
      throw new Error("Session expired.");
    }
  }

  const data = await parseJsonSafe(response);

  // Fetch's `ok` flag covers the complete successful HTTP range (200-299),
  // including the 201 returned when a category is created. Return the parsed
  // success response before doing any error-response handling.
  if (response.ok) return data as T;

  const fallbackMessage =
    response.status === 401
      ? "Unauthorized."
      : response.status === 404
        ? "API endpoint not found."
        : "Something went wrong.";

  throw new Error(data?.message || fallbackMessage);
}
