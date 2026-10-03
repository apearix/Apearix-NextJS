export const dynamic = 'force-dynamic';

import { serverApi } from "@/lib/serverApi";
import EditBlogClient from "@/components/admin/blogs/EditBlogClient";
import { notFound } from "next/navigation";

export const metadata = {
  title: "Admin - Edit Blog",
};

export default async function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  let initialData = null;
  
  try {
    initialData = await serverApi<any>(`/api/v1/admin/blogs/${resolvedParams.id}`, { cache: "no-store" });
  } catch (error) {
    console.error("Failed to fetch blog for editing:", error);
    notFound();
  }

  // Handle case where API wraps data
  const blog = initialData?.data || initialData;

  return <EditBlogClient blog={blog} />;
}
