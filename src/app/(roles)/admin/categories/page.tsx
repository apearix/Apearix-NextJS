import { serverApi } from "@/lib/serverApi";
import { CrudPageClient, FormField } from "@/components/admin/crud/CrudPageClient";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Admin - Categories",
};

export default async function CategoriesPage() {
  let initialData = [];
  try {
    const response = await serverApi<any>("/api/v1/admin/categories", { cache: 'no-store' });
    // Handle { data: [...] } or [...] response shapes
    initialData = Array.isArray(response) ? response : (response.data || response.items || []);
  } catch (err) {
    console.error("Failed to fetch Categories:", err);
  }

  const columns = [
    {
        key: "id",
        header: "ID"
    },
    {
        key: "name",
        header: "Name"
    },
    {
        key: "slug",
        header: "Slug"
    }
];
  const formFields: FormField[] = [
    {
        name: "name",
        label: "Name",
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
        name: "category_type_id",
        label: "Category Type ID",
        type: "text",
        required: true
    }
];

  return (
    <CrudPageClient 
      title="Categories" 
      resourceEndpoint="/api/v1/admin/categories" 
      initialData={initialData} 
      columns={columns} 
      formFields={formFields} 
      keyField="id" 
    />
  );
}




