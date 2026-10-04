export const dynamic = 'force-dynamic';

import { serverApi } from "@/lib/serverApi";
import EditCategoryClient from "./EditCategoryClient";
import { notFound } from "next/navigation";

export const metadata = {
  title: "Admin - Edit Category",
};

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  let initialData = null;
  
  try {
    initialData = await serverApi<any>(`/api/v1/admin/categories/${resolvedParams.id}`, { cache: "no-store" });
  } catch (error) {
    console.error("Failed to fetch Category for editing:", error);
    notFound();
  }

  const category = initialData?.data || initialData;

  if (!category) {
    notFound();
  }

  return <EditCategoryClient category={category} />;
}
