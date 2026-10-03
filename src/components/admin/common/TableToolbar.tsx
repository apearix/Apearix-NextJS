"use client";

import React, { useState, useRef, useEffect } from "react";
import { Search, X, ChevronDown, ArrowUpDown, Download } from "lucide-react";

export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterConfig {
  id: string;
  value: string;
  onChange: (val: string) => void;
  options: FilterOption[];
  minWidth?: string;
}

export interface SortConfig {
  value: string;
  onChange: (val: string) => void;
  options: FilterOption[];
  minWidth?: string;
}

export interface ExportOption {
  id: string;
  label: string;
  badge?: string;
  onClick: () => void;
}

export interface TableToolbarProps {
  // Search (Optional)
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  searchPlaceholder?: string;

  // Filters (Optional Array of dropdowns)
  filters?: FilterConfig[];

  // Sorting (Optional)
  sort?: SortConfig;

  // Import Action (Optional)
  onImportClick?: () => void;
  importLabel?: string;

  // Export Menu (Optional)
  exportOptions?: ExportOption[];
  exportLabel?: string;

  // Extra Custom Controls / Slot (Optional)
  children?: React.ReactNode;
}

export function TableToolbar({
  searchQuery,
  onSearchChange,
  searchPlaceholder = "Search...",
  filters = [],
  sort,
  onImportClick,
  importLabel = "Import",
  exportOptions = [],
  exportLabel = "Export",
  children,
}: Readonly<TableToolbarProps>) {
  const [showExportMenu, setShowExportMenu] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);

  // Click outside to close export menu
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (exportRef.current && !exportRef.current.contains(e.target as Node)) {
        setShowExportMenu(false);
      }
    };
    if (showExportMenu) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [showExportMenu]);

  return (
    <div className="bg-white border border-border rounded-xl p-3 mb-4 shadow-xs flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
      {/* Search Input (Rendered only if onSearchChange is passed) */}
      {onSearchChange !== undefined && (
        <div className="relative flex-1 min-w-65">
          <Search className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchQuery ?? ""}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-8 py-2 rounded-lg border border-border bg-surface text-sm text-heading placeholder:text-muted focus:outline-none focus:border-primary focus:bg-white transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-heading cursor-pointer"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* Filters & Actions Area */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Dynamic Select Filters */}
        {filters.map((f) => (
          <div
            key={f.id}
            className="relative"
            style={{ minWidth: f.minWidth ?? "135px" }}
          >
            <select
              value={f.value}
              onChange={(e) => f.onChange(e.target.value)}
              className="w-full text-xs font-medium py-2 pl-3 pr-8 rounded-lg border border-border bg-surface text-heading appearance-none cursor-pointer focus:outline-none focus:border-primary transition-colors"
            >
              {f.options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-muted absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        ))}

        {/* Sort Select */}
        {sort && (
          <div
            className="relative"
            style={{ minWidth: sort.minWidth ?? "140px" }}
          >
            <select
              value={sort.value}
              onChange={(e) => sort.onChange(e.target.value)}
              className="w-full text-xs font-medium py-2 pl-3 pr-8 rounded-lg border border-border bg-surface text-heading appearance-none cursor-pointer focus:outline-none focus:border-primary transition-colors"
            >
              {sort.options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ArrowUpDown className="w-3.5 h-3.5 text-muted absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        )}

        {/* Divider if buttons exist */}
        {(onImportClick || exportOptions.length > 0 || children) && (
          <div className="h-6 w-px bg-border mx-1 hidden sm:block" />
        )}

        {/* Import Action */}
        {onImportClick && (
          <button
            type="button"
            onClick={onImportClick}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-surface text-heading border border-border text-xs font-semibold rounded-lg transition-colors shadow-xs hover:border-border-accent cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-primary rotate-180" />
            {importLabel}
          </button>
        )}

        {/* Export Dropdown */}
        {exportOptions.length > 0 && (
          <div className="relative inline-block text-left" ref={exportRef}>
            <button
              type="button"
              onClick={() => setShowExportMenu((prev) => !prev)}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-surface text-heading border border-border text-xs font-semibold rounded-lg transition-colors shadow-xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-body" />
              {exportLabel}
              <ChevronDown className="w-3.5 h-3.5 text-muted" />
            </button>

            {showExportMenu && (
              <div className="absolute right-0 mt-1.5 w-52 bg-white rounded-xl shadow-xl border border-border py-1.5 z-40 font-medium text-xs">
                <div className="px-3 py-1 text-[10px] uppercase tracking-wider font-semibold text-muted">
                  Export Options
                </div>
                {exportOptions.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      opt.onClick();
                      setShowExportMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-surface flex items-center justify-between text-heading cursor-pointer transition-colors"
                  >
                    <span>{opt.label}</span>
                    {opt.badge && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-surface-alt border text-muted">
                        {opt.badge}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
        {/* Extra Custom Controls / Slot */}
        {children}
      </div>
    </div>
  );
}