import { serverApi } from "@/lib/serverApi";
import { CrudPageClient, FormField } from "@/components/admin/crud/CrudPageClient";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Admin - Blogs",
};

export default async function BlogsPage() {
  let initialData = [];
  try {
    const response = await serverApi<any>("/api/v1/admin/blogs", { cache: 'no-store' });
    // Handle { data: [...] } or [...] response shapes
    initialData = Array.isArray(response) ? response : (response.data || response.items || []);
  } catch (err) {
    console.error("Failed to fetch Blogs:", err);
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
        key: "isPublished",
        header: "Published"
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
    },
    {
        name: "isPublished",
        label: "Published",
        type: "boolean"
    }
];

  return (
    <CrudPageClient 
      title="Blogs" 
      resourceEndpoint="/api/v1/admin/blogs" 
      initialData={initialData} 
      columns={columns} 
      formFields={formFields} 
      keyField="id" 
    />
  );
}




