import React from "react";
import { JobForm } from "@/components/admin/careers/JobForm";

export const metadata = {
  title: "Admin - Create Job Opening",
};

export default function CreateCareerPage() {
  return <JobForm isEdit={false} />;
}
