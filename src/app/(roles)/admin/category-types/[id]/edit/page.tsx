export const dynamic = 'force-dynamic';

import { serverApi } from "@/lib/serverApi";
import EditCategoryTypeClient from "./EditCategoryTypeClient";
import { notFound } from "next/navigation";

export const metadata = {
  title: "Admin - Edit Category Type",
};

export default async function EditCategoryTypePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  let initialData = null;
  
  try {
    initialData = await serverApi<any>(`/api/v1/admin/category-types/${resolvedParams.id}`, { cache: "no-store" });
  } catch (error) {
    console.error("Failed to fetch Category Type for editing:", error);
    notFound();
  }

  const categoryType = initialData?.data || initialData;

  if (!categoryType) {
    notFound();
  }

  return <EditCategoryTypeClient categoryType={categoryType} />;
}
