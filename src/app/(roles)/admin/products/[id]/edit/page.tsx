export const dynamic = "force-dynamic";

import { serverApi } from "@/lib/serverApi";
import EditProductClient from "@/components/admin/products/EditProductClient";
import { notFound } from "next/navigation";
import { formatProductItem } from "@/lib/services/admin/products";

export const metadata = {
  title: "Admin - Edit Product",
};

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  let initialData = null;

  try {
    initialData = await serverApi<any>(`/api/v1/admin/products/${resolvedParams.id}`, {
      cache: "no-store",
    });
  } catch (error) {
    console.error("Failed to fetch product for editing:", error);
    notFound();
  }

  const rawItem = initialData?.data || initialData;

  if (!rawItem || (!rawItem.id && !rawItem.name && !rawItem.title)) {
    notFound();
  }

  const product = formatProductItem(rawItem);

  return <EditProductClient product={product} />;
}
