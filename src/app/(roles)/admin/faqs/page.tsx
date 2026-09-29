import { serverApi } from "@/lib/serverApi";
import { CrudPageClient, FormField } from "@/components/admin/crud/CrudPageClient";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Admin - FAQs",
};

export default async function FAQsPage() {
  let initialData = [];
  try {
    const response = await serverApi<any>("/api/v1/admin/faqs", { cache: 'no-store' });
    // Handle { data: [...] } or [...] response shapes
    initialData = Array.isArray(response) ? response : (response.data || response.items || []);
  } catch (err) {
    console.error("Failed to fetch FAQs:", err);
  }

  const columns = [
    {
        key: "id",
        header: "ID"
    },
    {
        key: "question",
        header: "Question"
    }
];
  const formFields: FormField[] = [
    {
        name: "question",
        label: "Question",
        type: "text",
        required: true
    },
    {
        name: "answer",
        label: "Answer",
        type: "textarea",
        required: true
    }
];

  return (
    <CrudPageClient 
      title="FAQs" 
      resourceEndpoint="/api/v1/admin/faqs" 
      initialData={initialData} 
      columns={columns} 
      formFields={formFields} 
      keyField="id" 
    />
  );
}




