"use client";
import React from "react";
import { Edit, Trash2 } from "lucide-react";

export interface ColumnDef<T> {
  key: string;
  header: string;
  cell?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  keyExtractor: (item: T) => string | number;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  isLoading?: boolean;
}

export function DataTable<T>({
  data,
  columns,
  keyExtractor,
  onEdit,
  onDelete,
  isLoading,
}: DataTableProps<T>) {
  if (isLoading) {
    return (
      <div className="w-full h-48 flex items-center justify-center bg-background rounded-xl border border-border-subtle shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-background rounded-xl border border-border-subtle shadow-[0_2px_12px_rgba(0,0,0,0.02)] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-alt text-muted text-xs uppercase tracking-wider">
              {columns.map((col) => (
                <th key={col.key} className="px-6 py-4 font-medium">
                  {col.header}
                </th>
              ))}
              {(onEdit || onDelete) && (
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-border text-sm">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (onEdit || onDelete ? 1 : 0)}
                  className="px-6 py-8 text-center text-muted"
                >
                  No records found.
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr
                  key={keyExtractor(item)}
                  className="hover:bg-surface/50 transition-colors group"
                >
                  {columns.map((col) => {
                    const val = (item as any)[col.key];

                    let renderedContent: React.ReactNode;
                    if (col.cell) {
                      renderedContent = col.cell(item);
                    } else if (col.key === "price" && (typeof val === "number" || typeof val === "string")) {
                      const num = Number(val);
                      renderedContent = isNaN(num) ? String(val) : `$${num.toFixed(2)}`;
                    } else if (col.key === "is_active" || typeof val === "boolean") {
                      renderedContent = (
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            val
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-zinc-100 text-zinc-600 border border-zinc-200"
                          }`}
                        >
                          {val ? "Active" : "Inactive"}
                        </span>
                      );
                    } else if (typeof val === "object" && val !== null) {
                      renderedContent = (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-surface-alt border border-border text-primary">
                          {val.name || val.title || val.slug || "-"}
                        </span>
                      );
                    } else {
                      renderedContent = String(val ?? "-");
                    }

                    return (
                      <td key={col.key} className="px-6 py-4">
                        <span className="text-heading font-medium">
                          {renderedContent}
                        </span>
                      </td>
                    );
                  })}
                  {(onEdit || onDelete) && (
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {onEdit && (
                          <button
                            onClick={() => onEdit(item)}
                            className="p-1.5 text-muted hover:text-primary bg-surface-alt hover:bg-primary-light rounded transition-colors"
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={() => onDelete(item)}
                            className="p-1.5 text-muted hover:text-red-500 bg-surface-alt hover:bg-red-50 rounded transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
