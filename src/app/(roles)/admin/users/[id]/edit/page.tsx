export const dynamic = 'force-dynamic';

import { serverApi } from "@/lib/serverApi";
import EditUserClient from "@/components/admin/users/EditUserClient";
import { notFound } from "next/navigation";

export const metadata = {
  title: "Admin - Edit User",
};

export default async function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  let initialData = null;
  
  try {
    initialData = await serverApi<any>(`/api/v1/admin/users/${resolvedParams.id}`, { cache: "no-store" });
  } catch (error) {
    console.error("Failed to fetch user for editing:", error);
    notFound();
  }

  // Handle cases where response wraps item in data
  const user = initialData?.data || initialData;

  if (!user) {
    notFound();
  }

  return <EditUserClient user={user} />;
}
