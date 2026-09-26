'use server';

import { cookies } from "next/headers";
import {
  backendBaseUrl,
  extractAuthPayload,
  fetchBackendWithFallback,
  parseJsonResponse,
} from "@/lib/auth/session";

type ServerApiRequestInit = RequestInit & {
  next?: {
    revalidate?: number | false;
    tags?: string[];
  };
};

export async function serverApi<T>(
  path: string,
  options: ServerApiRequestInit = {},
  requireAuth: boolean = true
): Promise<T> {

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = backendBaseUrl() + normalizedPath;

  // ----------------------------------------------------
  // TOKEN FETCH
  // ----------------------------------------------------
  let token: string | undefined = undefined;

  try {
    if (requireAuth) {
      const cookieStore = await cookies();
      token =
        cookieStore.get("access_token")?.value ||
        cookieStore.get("token")?.value;
    }
  } catch (err) {
    console.error("[serverApi] Cookie read error:", err);
  }

  // ----------------------------------------------------
  // MERGE OPTIONS
  // ----------------------------------------------------
  const isFormData = options.body instanceof FormData;

  const finalOptions: ServerApiRequestInit = {
    ...options,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...options.headers,
    },
    cache: options.cache ?? (options.next ? undefined : "no-store"),
  };

  const fetchWithToken = (accessToken?: string) =>
    fetch(url, {
      ...finalOptions,
      headers: {
        ...finalOptions.headers,
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
    });

  // ----------------------------------------------------
  // FETCH CALL + one refresh/retry
  // ----------------------------------------------------
  let response: Response;

  try {
    response = await fetchWithToken(token);

    if (response.status === 401 && requireAuth) {
      const cookieStore = await cookies();
      const refreshToken = cookieStore.get("refresh_token")?.value;

      if (refreshToken) {
        const refreshResponse = await fetchBackendWithFallback(
          ["/auth/refresh", "/refresh-token"],
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refresh_token: refreshToken }),
            cache: "no-store",
          },
        );
        const refreshData = await parseJsonResponse(refreshResponse);
        const refreshedToken = extractAuthPayload(refreshData).accessToken;

        if (refreshResponse.ok && refreshData?.status !== "error" && refreshedToken) {
          // A Server Component cannot mutate the response cookies directly;
          // middleware performs the durable cookie update for the next page
          // request. This retry still makes the current render succeed.
          response = await fetchWithToken(refreshedToken);
        }
      }
    }
  } catch (err) {
    console.error("[serverApi] Fetch failed:", err);
    throw err;
  }

  // ----------------------------------------------------
  // HANDLE NON-OK RESPONSES
  // ----------------------------------------------------
  if (!response.ok) {
    let errorJson: any;

    try {
      errorJson = await response.json();
    } catch (err) {
      console.error("[serverApi] Invalid error response:", err);
      throw new Error("API responded with invalid format");
    }

    console.error("[serverApi] API Error:", errorJson);

    throw new Error(errorJson?.message || "API Error");
  }

  // ----------------------------------------------------
  // PARSE SUCCESS JSON
  // ----------------------------------------------------
  try {
    return await response.json();
  } catch (err) {
    console.error("[serverApi] JSON parse error:", err);
    throw err;
  }
}
