export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { JobForm } from "@/components/admin/careers/JobForm";
import { show as fetchJobApi } from "@/lib/services/admin/careers";

export const metadata = {
  title: "Admin - Edit Job Opening",
};

export default async function EditCareerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let job = null;

  try {
    job = await fetchJobApi(id);
  } catch (error) {
    console.error("Failed to fetch job for editing:", error);
    notFound();
  }

  if (!job) {
    notFound();
  }

  return <JobForm initialData={job} isEdit={true} />;
}
