import { serverApi } from "@/lib/serverApi";
import { CrudPageClient, FormField } from "@/components/admin/crud/CrudPageClient";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Admin - Pages",
};

export default async function PagesPage() {
  let initialData = [];
  try {
    const response = await serverApi<any>("/api/v1/admin/pages", { cache: 'no-store' });
    // Handle { data: [...] } or [...] response shapes
    initialData = Array.isArray(response) ? response : (response.data || response.items || []);
  } catch (err) {
    console.error("Failed to fetch Pages:", err);
  }

  const columns = [
    {
        key: "id",
        header: "ID"
    },
    {
        key: "title",
        header: "Title"
    },
    {
        key: "slug",
        header: "Slug"
    }
];
  const formFields: FormField[] = [
    {
        name: "title",
        label: "Title",
        type: "text",
        required: true
    },
    {
        name: "slug",
        label: "Slug",
        type: "text",
        required: true
    },
    {
        name: "content",
        label: "Content",
        type: "textarea",
        required: true
    }
];

  return (
    <CrudPageClient 
      title="Pages" 
      resourceEndpoint="/api/v1/admin/pages" 
      initialData={initialData} 
      columns={columns} 
      formFields={formFields} 
      keyField="id" 
    />
  );
}




