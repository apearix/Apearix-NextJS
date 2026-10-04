export const dynamic = 'force-dynamic';

import { serverApi } from "@/lib/serverApi";
import EditPageClient from "@/components/admin/pages/EditPageClient";
import { notFound } from "next/navigation";

export const metadata = {
  title: "Admin - Edit Page",
};

export default async function EditPagePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  let initialData = null;
  
  try {
    initialData = await serverApi<any>(`/api/v1/admin/pages/${resolvedParams.id}`, { cache: "no-store" });
  } catch (error) {
    console.error("Failed to fetch page for editing:", error);
    notFound();
  }

  const page = initialData?.data || initialData;

  if (!page) {
    notFound();
  }

  return <EditPageClient page={page} />;
}
