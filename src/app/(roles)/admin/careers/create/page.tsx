import React from "react";
import { PageHeader } from "@/components/admin/common/PageHeader";
import { JobForm } from "@/components/admin/careers/JobForm";

export default function CreateCareerPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Create Job Opening"
        subtitle="Publish a new job vacancy, set role responsibilities, requirements, and compensation"
      />
      <JobForm isEdit={false} />
    </div>
  );
}
