export const dynamic = 'force-dynamic';

import { serverApi } from "@/lib/serverApi";
import EditFaqClient from "@/components/admin/faqs/EditFaqClient";
import { notFound } from "next/navigation";

export const metadata = {
  title: "Admin - Edit FAQ",
};

export default async function EditFaqPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  let initialData = null;
  
  try {
    initialData = await serverApi<any>(`/api/v1/admin/faqs/${resolvedParams.id}`, { cache: "no-store" });
  } catch (error) {
    console.error("Failed to fetch FAQ for editing:", error);
    notFound();
  }

  const faq = initialData?.data || initialData;

  if (!faq) {
    notFound();
  }

  return <EditFaqClient faq={faq} />;
}
