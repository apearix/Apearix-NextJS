export const dynamic = "force-dynamic";

import { serverApi } from "@/lib/serverApi";
import EditServiceClient from "@/components/admin/services/EditServiceClient";
import { notFound } from "next/navigation";
import { formatServiceItem } from "@/lib/services/admin/services";

export const metadata = {
  title: "Admin - Edit Service",
};

export default async function EditServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  let initialData = null;

  try {
    initialData = await serverApi<any>(`/api/v1/admin/services/${resolvedParams.id}`, {
      cache: "no-store",
    });
  } catch (error) {
    console.error("Failed to fetch service for editing:", error);
    notFound();
  }

  const rawItem = initialData?.data || initialData;

  if (!rawItem || (!rawItem.id && !rawItem.title)) {
    notFound();
  }

  const service = formatServiceItem(rawItem);

  return <EditServiceClient service={service} />;
}
