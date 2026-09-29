"use client";
import React, { useState } from "react";
import { AdminPageHeader } from "@/components/admin/layout/AdminPageHeader";
import { DataTable, ColumnDef } from "@/components/admin/data-table/DataTable";
import { ActionModal } from "@/components/admin/modals/ActionModal";
import { ConfirmDeleteModal } from "@/components/admin/modals/ConfirmDeleteModal";
import { clientApi } from "@/lib/clientApi";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

export interface FormField {
  name: string;
  label: string;
  type: "text" | "textarea" | "boolean" | "number" | "select" | "date" | "password" | "email";
  required?: boolean;
  options?: { label: string; value: string | number }[];
}

interface CrudPageProps<T> {
  title: string;
  resourceEndpoint: string;
  initialData: T[];
  columns: ColumnDef<T>[];
  formFields: FormField[];
  keyField: string;
}

export function CrudPageClient<T extends Record<string, any>>({
  title,
  resourceEndpoint,
  initialData,
  columns,
  formFields,
  keyField,
}: CrudPageProps<T>) {
  const router = useRouter();
  const [data, setData] = useState<T[]>(initialData);
  
  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<T | null>(null);
  const [deletingItem, setDeletingItem] = useState<T | null>(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [error, setError] = useState("");

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({});
    setError("");
    setIsFormOpen(true);
  };

  const handleOpenEdit = (item: T) => {
    setEditingItem(item);
    setFormData(item);
    setError("");
    setIsFormOpen(true);
  };

  const handleOpenDelete = (item: T) => {
    setDeletingItem(item);
    setIsDeleteOpen(true);
  };

  const handleFormChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (editingItem) {
        const id = editingItem[keyField];
        const res = await clientApi<T>(`${resourceEndpoint}/${id}`, {
          method: "PATCH",
          body: JSON.stringify(formData),
        });
        setData(data.map((item) => (item[keyField] === id ? { ...item, ...res } : item)));
      } else {
        const res = await clientApi<T>(resourceEndpoint, {
          method: "POST",
          body: JSON.stringify(formData),
        });
        setData([res, ...data]);
      }
      setIsFormOpen(false);
      router.refresh(); // Refresh server state if needed
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingItem) return;
    setIsLoading(true);
    try {
      const id = deletingItem[keyField];
      await clientApi(`${resourceEndpoint}/${id}`, {
        method: "DELETE",
      });
      setData(data.filter((item) => item[keyField] !== id));
      setIsDeleteOpen(false);
      router.refresh();
    } catch (err: any) {
      alert(err.message || "Failed to delete");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 lg:p-8 font-geist bg-surface-alt min-h-screen">
      <AdminPageHeader 
        title={title} 
        actionText={`Add ${title}`} 
        onAction={handleOpenAdd} 
      />

      <DataTable
        data={data}
        columns={columns}
        keyExtractor={(item) => item[keyField] as string | number}
        onEdit={handleOpenEdit}
        onDelete={handleOpenDelete}
      />

      {/* Form Modal */}
      <ActionModal 
        isOpen={isFormOpen} 
        onClose={() => !isLoading && setIsFormOpen(false)}
        title={editingItem ? `Edit ${title}` : `Add ${title}`}
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-200">
              {error}
            </div>
          )}
          
          {formFields.map((field) => (
            <div key={field.name}>
              <label htmlFor={field.name} className="block">
                {field.label} {field.required && <span className="text-red-500">*</span>}
              </label>
              
              {field.type === "textarea" ? (
                <textarea
                  id={field.name}
                  required={field.required}
                  value={formData[field.name] || ""}
                  onChange={(e) => handleFormChange(field.name, e.target.value)}
                  placeholder={`Enter ${field.label}...`}
                />
              ) : field.type === "boolean" ? (
                <label className="flex items-center gap-2 cursor-pointer mt-2">
                  <input
                    id={field.name}
                    type="checkbox"
                    checked={!!formData[field.name]}
                    onChange={(e) => handleFormChange(field.name, e.target.checked)}
                  />
                  <span className="text-sm text-body">Enabled / Yes</span>
                </label>
              ) : field.type === "select" ? (
                <select
                  id={field.name}
                  required={field.required}
                  value={formData[field.name] || ""}
                  onChange={(e) => handleFormChange(field.name, e.target.value)}
                >
                  <option value="">Select option...</option>
                  {field.options?.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  id={field.name}
                  type={field.type}
                  required={field.required}
                  value={formData[field.name] || ""}
                  onChange={(e) => handleFormChange(field.name, field.type === "number" ? Number(e.target.value) : e.target.value)}
                  placeholder={`Enter ${field.label}...`}
                />
              )}
            </div>
          ))}

          <div className="pt-4 flex justify-end gap-3 border-t border-border mt-6">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              disabled={isLoading}
              className="px-4 py-2 text-heading bg-surface-alt hover:bg-surface border border-border rounded-lg font-medium text-sm transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg font-medium text-sm transition-colors flex items-center gap-2"
            >
              {isLoading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </ActionModal>

      {/* Delete Confirmation */}
      <ConfirmDeleteModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        isLoading={isLoading}
      />
    </div>
  );
}


