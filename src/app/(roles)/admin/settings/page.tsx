import { serverApi } from "@/lib/serverApi";
import { CrudPageClient, FormField } from "@/components/admin/crud/CrudPageClient";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Admin - Settings",
};

export default async function SettingsPage() {
  let initialData = [];
  try {
    const response = await serverApi<any>("/api/v1/admin/settings", { cache: 'no-store' });
    // Handle { data: [...] } or [...] response shapes
    initialData = Array.isArray(response) ? response : (response.data || response.items || []);
  } catch (err) {
    console.error("Failed to fetch Settings:", err);
  }

  const columns = [
    {
        key: "key",
        header: "Key"
    },
    {
        key: "value",
        header: "Value"
    }
];
  const formFields: FormField[] = [
    {
        name: "key",
        label: "Key",
        type: "text",
        required: true
    },
    {
        name: "value",
        label: "Value",
        type: "text",
        required: true
    }
];

  return (
    <CrudPageClient 
      title="Settings" 
      resourceEndpoint="/api/v1/admin/settings" 
      initialData={initialData} 
      columns={columns} 
      formFields={formFields} 
      keyField="id" 
    />
  );
}




