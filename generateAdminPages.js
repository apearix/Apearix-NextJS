const fs = require('fs');
const path = require('path');

const resources = [
  {
    name: 'Category Types',
    folder: 'category-types',
    endpoint: '/admin/category-types',
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true },
      { name: 'description', label: 'Description', type: 'textarea' },
    ],
    columns: [
      { key: 'id', header: 'ID' },
      { key: 'name', header: 'Name' },
      { key: 'description', header: 'Description' },
    ]
  },
  {
    name: 'Categories',
    folder: 'categories',
    endpoint: '/admin/categories',
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true },
      { name: 'slug', label: 'Slug', type: 'text', required: true },
      { name: 'category_type_id', label: 'Category Type ID', type: 'text', required: true },
    ],
    columns: [
      { key: 'id', header: 'ID' },
      { key: 'name', header: 'Name' },
      { key: 'slug', header: 'Slug' },
    ]
  },
  {
    name: 'Blogs',
    folder: 'blogs',
    endpoint: '/admin/blogs',
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'slug', label: 'Slug', type: 'text', required: true },
      { name: 'content', label: 'Content', type: 'textarea', required: true },
      { name: 'isPublished', label: 'Published', type: 'boolean' },
    ],
    columns: [
      { key: 'id', header: 'ID' },
      { key: 'title', header: 'Title' },
      { key: 'isPublished', header: 'Published' },
    ]
  },
  {
    name: 'Pages',
    folder: 'pages',
    endpoint: '/admin/pages',
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'slug', label: 'Slug', type: 'text', required: true },
      { name: 'content', label: 'Content', type: 'textarea', required: true },
    ],
    columns: [
      { key: 'id', header: 'ID' },
      { key: 'title', header: 'Title' },
      { key: 'slug', header: 'Slug' },
    ]
  },
  {
    name: 'FAQs',
    folder: 'faqs',
    endpoint: '/admin/faqs',
    fields: [
      { name: 'question', label: 'Question', type: 'text', required: true },
      { name: 'answer', label: 'Answer', type: 'textarea', required: true },
    ],
    columns: [
      { key: 'id', header: 'ID' },
      { key: 'question', header: 'Question' },
    ]
  },
  {
    name: 'Products',
    folder: 'products',
    endpoint: '/admin/products',
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'price', label: 'Price', type: 'number', required: true },
    ],
    columns: [
      { key: 'id', header: 'ID' },
      { key: 'name', header: 'Name' },
      { key: 'price', header: 'Price' },
    ]
  },
  {
    name: 'Services',
    folder: 'services',
    endpoint: '/admin/services',
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true },
      { name: 'description', label: 'Description', type: 'textarea' },
    ],
    columns: [
      { key: 'id', header: 'ID' },
      { key: 'name', header: 'Name' },
    ]
  },
  {
    name: 'Roles',
    folder: 'roles',
    endpoint: '/admin/roles',
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true },
      { name: 'description', label: 'Description', type: 'textarea' },
    ],
    columns: [
      { key: 'id', header: 'ID' },
      { key: 'name', header: 'Name' },
    ]
  },
  {
    name: 'Users',
    folder: 'users',
    endpoint: '/admin/users',
    fields: [
      { name: 'first_name', label: 'First Name', type: 'text', required: true },
      { name: 'last_name', label: 'Last Name', type: 'text' },
      { name: 'email', label: 'Email', type: 'email', required: true },
      { name: 'password', label: 'Password (min 6 chars)', type: 'password' },
      { name: 'role_id', label: 'Role ID', type: 'text', required: true },
    ],
    columns: [
      { key: 'id', header: 'ID' },
      { key: 'first_name', header: 'First Name' },
      { key: 'email', header: 'Email' },
    ]
  },
  {
    name: 'Settings',
    folder: 'settings',
    endpoint: '/admin/settings',
    fields: [
      { name: 'key', label: 'Key', type: 'text', required: true },
      { name: 'value', label: 'Value', type: 'text', required: true },
    ],
    columns: [
      { key: 'key', header: 'Key' },
      { key: 'value', header: 'Value' },
    ]
  }
];

const basePath = path.join(__dirname, 'src/app/(roles)/admin');

for (const res of resources) {
  const dirPath = path.join(basePath, res.folder);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  const code = `
import { serverApi } from "@/lib/serverApi";
import { CrudPageClient } from "@/components/admin/crud/CrudPageClient";

export const metadata = {
  title: "Admin - ${res.name}",
};

export default async function ${res.name.replace(/\s+/g, '')}Page() {
  let initialData = [];
  try {
    const response = await serverApi("${res.endpoint}", { cache: 'no-store' });
    // Handle { data: [...] } or [...] response shapes
    initialData = Array.isArray(response) ? response : (response.data || response.items || []);
  } catch (err) {
    console.error("Failed to fetch ${res.name}:", err);
  }

  const columns = ${JSON.stringify(res.columns, null, 4).replace(/"([^"]+)":/g, '$1:')};
  const formFields = ${JSON.stringify(res.fields, null, 4).replace(/"([^"]+)":/g, '$1:')};

  return (
    <CrudPageClient 
      title="${res.name}" 
      resourceEndpoint="${res.endpoint}" 
      initialData={initialData} 
      columns={columns} 
      formFields={formFields} 
      keyExtractor={(item) => item.id || item.key} 
    />
  );
}
`.trim();

  fs.writeFileSync(path.join(dirPath, 'page.tsx'), code);
  console.log("Created " + res.name + " page.");
}
