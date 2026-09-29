import { serverApi } from "@/lib/serverApi";
import { CrudPageClient, FormField } from "@/components/admin/crud/CrudPageClient";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Admin - Products",
};

export default async function ProductsPage() {
  let initialData = [];
  try {
    const response = await serverApi<any>("/api/v1/admin/products", { cache: 'no-store' });
    // Handle { data: [...] } or [...] response shapes
    initialData = Array.isArray(response) ? response : (response.data || response.items || []);
  } catch (err) {
    console.error("Failed to fetch Products:", err);
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
        key: "price",
        header: "Price"
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
    },
    {
        name: "price",
        label: "Price",
        type: "number",
        required: true
    }
];

  return (
    <CrudPageClient 
      title="Products" 
      resourceEndpoint="/api/v1/admin/products" 
      initialData={initialData} 
      columns={columns} 
      formFields={formFields} 
      keyField="id" 
    />
  );
}




