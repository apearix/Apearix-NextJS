import { serverApi } from "@/lib/serverApi";
import { CrudPageClient, FormField } from "@/components/admin/crud/CrudPageClient";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Admin - Category Types",
};

export default async function CategoryTypesPage() {
  let initialData = [];
  try {
    const response = await serverApi<any>("/api/v1/admin/category-types", { cache: 'no-store' });
    // Handle { data: [...] } or [...] response shapes
    initialData = Array.isArray(response) ? response : (response.data || response.items || []);
  } catch (err) {
    console.error("Failed to fetch Category Types:", err);
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
        key: "description",
        header: "Description"
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
        name: "description",
        label: "Description",
        type: "textarea"
    }
];

  return (
    <CrudPageClient 
      title="Category Types" 
      resourceEndpoint="/api/v1/admin/category-types" 
      initialData={initialData} 
      columns={columns} 
      formFields={formFields} 
      keyField="id" 
    />
  );
}




