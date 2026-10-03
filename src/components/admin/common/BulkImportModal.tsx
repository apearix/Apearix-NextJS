"use client";

import React, { useState, useRef, ChangeEvent, DragEvent, useEffect } from "react";
import { X, UploadCloud, Info, CheckCircle2, Download } from "lucide-react";

export interface ImportValidationResult<T> {
  data: T;
  isValid: boolean;
  remarks: string;
}

export interface PreviewColumn<T> {
  header: string;
  render: (item: T) => React.ReactNode;
}

export interface BulkImportModalProps<T> {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  badgeText?: string;
  sampleFileName?: string;
  sampleData?: any[];
  previewColumns?: PreviewColumn<T>[];
  validateRow: (rawItem: any, index: number) => ImportValidationResult<T>;
  onCommit: (importedItems: T[]) => void;
}

export function BulkImportModal<T>({
  isOpen,
  onClose,
  title = "Import Records",
  subtitle = "Bulk upload items using a JSON file.",
  badgeText,
  sampleFileName = "sample_import.json",
  sampleData,
  previewColumns = [],
  validateRow,
  onCommit,
}: Readonly<BulkImportModalProps<T>>) {
  const [isDragging, setIsDragging] = useState(false);
  const [importRecords, setImportRecords] = useState<ImportValidationResult<T>[]>([]);
  const [importFileName, setImportFileName] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  // Background body scroll lock
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  // Modal body me wheel scroll ko trap karna taaki background page scroll na ho
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el || !isOpen) return;

    const handleWheel = (e: WheelEvent) => {
      const isAtTop = el.scrollTop === 0 && e.deltaY < 0;
      const isAtBottom = el.scrollHeight - el.scrollTop <= el.clientHeight + 1 && e.deltaY > 0;

      if (isAtTop || isAtBottom) {
        e.preventDefault();
      }
      e.stopPropagation();
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [isOpen, importRecords.length]);

  if (!isOpen) return null;

  const resetModal = () => {
    setImportRecords([]);
    setImportFileName("");
    setIsDragging(false);
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processImportFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processImportFile(e.target.files[0]);
    }
  };

  const processImportFile = (file: File) => {
    if (!file.name.endsWith(".json") && file.type !== "application/json") {
      alert("Please upload a valid .json file");
      return;
    }
    setImportFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const raw = JSON.parse(event.target?.result as string);
        const list = Array.isArray(raw) ? raw : [raw];
        const validated = list.map((item, index) => validateRow(item, index));
        setImportRecords(validated);
      } catch (err: any) {
        alert("Invalid JSON format: " + err.message);
      }
    };
    reader.readAsText(file);
  };

  const handleDownloadSample = () => {
    if (!sampleData || sampleData.length === 0) return;
    const blob = new Blob([JSON.stringify(sampleData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = sampleFileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const validCount = importRecords.filter((r) => r.isValid).length;
  const invalidCount = importRecords.filter((r) => !r.isValid).length;

  const handleConfirm = () => {
    const validItems = importRecords.filter((r) => r.isValid).map((r) => r.data);
    if (validItems.length === 0) return;
    onCommit(validItems);
    handleClose();
  };

  const handleDropzoneKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      fileInputRef.current?.click();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-heading/60 backdrop-blur-sm animate-in fade-in duration-200 overflow-hidden"
    >
      <div className="bg-white rounded-2xl border border-border shadow-2xl max-w-2xl w-full h-[88vh] max-h-[88vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-surface shrink-0">
          <div>
            <h3 className="text-lg font-bold text-heading">{title}</h3>
            <p className="text-xs text-muted mt-0.5">
              {subtitle}{" "}
              {badgeText && (
                <code className="text-primary font-mono text-[11px] bg-primary-light px-1 py-0.5 rounded">
                  {badgeText}
                </code>
              )}
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 rounded-lg text-muted hover:text-heading hover:bg-border/40 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div
          ref={scrollContainerRef}
          className="p-6 overflow-y-auto flex-1 min-h-0 space-y-4 overscroll-contain"
        >
          {/* Accessible Dropzone */}
          <div
            role="button"
            tabIndex={0}
            aria-label="Upload JSON file"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            onKeyDown={handleDropzoneKeyDown}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer flex flex-col items-center justify-center focus:outline-none! ${
              isDragging
                ? "border-primary bg-primary-light/30"
                : "border-border hover:border-primary/60 bg-surface hover:bg-primary-light/10"
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              accept=".json,application/json"
              className="hidden"
              onChange={handleFileChange}
            />
            <div className="w-12 h-12 rounded-xl bg-primary-light text-primary flex items-center justify-center mb-3">
              <UploadCloud className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-semibold text-heading">
              Drag & drop your JSON file here
            </h4>
            <p className="text-xs text-muted mt-1">
              or{" "}
              <span className="text-primary font-medium underline underline-offset-2">
                browse computer
              </span>
            </p>
            <span className="text-[11px] text-muted/80 mt-2">
              JSON format only • Max 10 MB
            </span>
          </div>

          {/* Sample Download Bar */}
          {sampleData && (
            <div className="flex flex-col sm:flex-row gap-2 items-center justify-between text-xs bg-surface-alt p-3 rounded-lg border border-border">
              <div className="flex items-center gap-2 text-muted">
                <Info className="w-4 h-4 text-primary shrink-0" />
                <span>Download reference JSON schema for error-free bulk importing.</span>
              </div>
              <button
                type="button"
                onClick={handleDownloadSample}
                className="text-xs font-semibold text-primary hover:text-primary-hover flex items-center gap-1 shrink-0 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" /> Sample JSON
              </button>
            </div>
          )}

          {/* Validation Preview */}
          {importRecords.length > 0 && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-heading flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-primary" /> Validation Preview
                </h4>
                <span className="text-xs text-muted font-mono">{importFileName}</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-2.5 rounded-lg border border-emerald-200 bg-emerald-50/50 text-center">
                  <div className="text-base font-bold text-emerald-700">{validCount}</div>
                  <div className="text-[11px] font-medium text-emerald-600">Valid Records</div>
                </div>
                <div className="p-2.5 rounded-lg border border-rose-200 bg-rose-50/50 text-center">
                  <div className="text-base font-bold text-rose-700">{invalidCount}</div>
                  <div className="text-[11px] font-medium text-rose-600">Invalid (Skipped)</div>
                </div>
              </div>

              <div className="border border-border rounded-lg overflow-hidden max-h-52 overflow-y-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-surface border-b border-border font-semibold text-muted sticky top-0">
                    <tr>
                      <th className="py-2 px-3 w-12">State</th>
                      {previewColumns.map((col: PreviewColumn<T>) => (
                        <th key={col.header} className="py-2 px-3">
                          {col.header}
                        </th>
                      ))}
                      <th className="py-2 px-3">Remarks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {importRecords.map((r, i) => {
                      const rowKey =
                        (r.data as any)?.id || (r.data as any)?.slug || `import-row-${i}`;
                      return (
                        <tr key={rowKey} className={r.isValid ? "bg-white" : "bg-rose-50/60"}>
                          <td className="py-2 px-3">
                            {r.isValid ? (
                              <span className="text-emerald-600 font-bold">✓</span>
                            ) : (
                              <span className="text-rose-600 font-bold">✕</span>
                            )}
                          </td>
                          {previewColumns.map((col: PreviewColumn<T>) => (
                            <td key={`${rowKey}-${col.header}`} className="py-2 px-3">
                              {col.render(r.data)}
                            </td>
                          ))}
                          <td
                            className={`py-2 px-3 text-[11px] ${
                              r.isValid ? "text-emerald-700" : "text-rose-700"
                            }`}
                          >
                            {r.remarks}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-surface border-t border-border flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-xs font-semibold text-muted hover:text-heading transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={validCount === 0}
            onClick={handleConfirm}
            className="px-4 py-2 bg-primary hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-semibold rounded-lg shadow-sm transition-all cursor-pointer"
          >
            {validCount > 0 ? `Import ${validCount} Valid Items` : "No Valid Records"}
          </button>
        </div>
      </div>
    </div>
  );
}