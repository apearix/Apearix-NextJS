export const dynamic = 'force-dynamic';

import { serverApi } from "@/lib/serverApi";
import EditRoleClient from "@/components/admin/roles/EditRoleClient";
import { notFound } from "next/navigation";

export const metadata = {
  title: "Admin - Edit Role",
};

export default async function EditRolePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  let initialData = null;
  
  try {
    initialData = await serverApi<any>(`/api/v1/admin/roles/${resolvedParams.id}`, { cache: "no-store" });
  } catch (error) {
    console.error("Failed to fetch role for editing:", error);
    notFound();
  }

  const role = initialData?.data || initialData;

  if (!role) {
    notFound();
  }

  return <EditRoleClient role={role} />;
}
