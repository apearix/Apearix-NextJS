import { serverApi } from "@/lib/serverApi";
import { CrudPageClient, FormField } from "@/components/admin/crud/CrudPageClient";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Admin - Users",
};

export default async function UsersPage() {
  let initialData = [];
  try {
    const response = await serverApi<any>("/api/v1/admin/users", { cache: 'no-store' });
    // Handle { data: [...] } or [...] response shapes
    initialData = Array.isArray(response) ? response : (response.data || response.items || []);
  } catch (err) {
    console.error("Failed to fetch Users:", err);
  }

  const columns = [
    {
        key: "id",
        header: "ID"
    },
    {
        key: "first_name",
        header: "First Name"
    },
    {
        key: "email",
        header: "Email"
    }
];
  const formFields: FormField[] = [
    {
        name: "first_name",
        label: "First Name",
        type: "text",
        required: true
    },
    {
        name: "last_name",
        label: "Last Name",
        type: "text"
    },
    {
        name: "email",
        label: "Email",
        type: "email",
        required: true
    },
    {
        name: "password",
        label: "Password (min 6 chars)",
        type: "password"
    },
    {
        name: "role_id",
        label: "Role ID",
        type: "text",
        required: true
    }
];

  return (
    <CrudPageClient 
      title="Users" 
      resourceEndpoint="/api/v1/admin/users" 
      initialData={initialData} 
      columns={columns} 
      formFields={formFields} 
      keyField="id" 
    />
  );
}




