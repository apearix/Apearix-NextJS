import { clientApi } from "@/lib/clientApi";

export interface UploadedMediaResponse {
  success?: boolean;
  url: string;
  filename: string;
}

/**
 * Shared multipart image upload helper for admin upload endpoints backed by Cloudinary.
 */
export async function uploadAdminImage(
  endpoint: string,
  file: File,
  errorMessage = "Failed to upload image to Cloudinary",
): Promise<UploadedMediaResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await clientApi<UploadedMediaResponse>(endpoint, {
    method: "POST",
    body: formData,
  });

  if (!response?.url) {
    throw new Error(errorMessage);
  }

  return response;
}

/**
 * Uploads rich-text or general admin media directly to Cloudinary under `apearix/<folder>`.
 */
export function uploadMediaImage(
  file: File,
  folder = "editor",
): Promise<UploadedMediaResponse> {
  const query = new URLSearchParams({ folder }).toString();
  return uploadAdminImage(`/api/v1/admin/media/upload?${query}`, file);
}
