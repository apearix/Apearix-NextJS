"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("access_token");
  cookieStore.delete("refresh_token");
  cookieStore.delete("token");
  cookieStore.delete("user_role");
  // Keep user_language: it is the existing UI preference and must survive logout.
  cookieStore.delete("user_data");
  cookieStore.delete("user_progress");
  cookieStore.delete("temp_user_id");
  cookieStore.delete("auth_user_id");
  cookieStore.delete("user_timezone");
    redirect("/");

}
