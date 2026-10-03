"use client";

import React, { useState, useRef, DragEvent, ChangeEvent } from "react";
import {
    X,
    UploadCloud,
    Info,
    Download,
    CheckCircle2,
    PlusCircle, 
    XCircle, 
} from "lucide-react";

export type ValidationResult<T> = {
    data: T;
    isValid: boolean;
    warnings?: string[];
    errors?: string[];
};

export interface ColumnDef<T> {
    header: string;
    render: (item: T, row: ValidationResult<T>) => React.ReactNode;
    className?: string;
}

export interface BulkImportModalProps<T> {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    description?: string;
    schemaBadge?: string;
    maxSizeMB?: number;
    sampleData?: T[];
    sampleFileName?: string;
    columns: ColumnDef<T>[];
    validator: (rawItem: any, index: number) => ValidationResult<T>;
    onImport: (validData: T[]) => void | Promise<void>;
}

export function BulkImportModal<T>({
    isOpen,
    onClose,
    title = "Bulk Import Data",
    description = "Upload a JSON file to import multiple records at once.",
    schemaBadge,
    maxSizeMB = 10,
    sampleData,
    sampleFileName = "sample_data.json",
    columns,
    validator,
    onImport,
}: BulkImportModalProps<T>) {
    const [isDragging, setIsDragging] = useState(false);
    const [fileMeta, setFileMeta] = useState<string>("");
    const [validatedRows, setValidatedRows] = useState<ValidationResult<T>[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!isOpen) return null;

    const validCount = validatedRows.filter((r) => r.isValid && (!r.warnings || r.warnings.length === 0)).length;
    const warnCount = validatedRows.filter((r) => r.isValid && r.warnings && r.warnings.length > 0).length;
    const invalidCount = validatedRows.filter((r) => !r.isValid).length;
    const savableCount = validCount + warnCount;

    const handleReset = () => {
        setValidatedRows([]);
        setFileMeta("");
        setErrorMessage(null);
        setIsDragging(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleClose = () => {
        handleReset();
        onClose();
    };

    const processFile = (file: File) => {
        setErrorMessage(null);

        if (!file.name.endsWith(".json") && file.type !== "application/json") {
            setErrorMessage("Kripya valid .json file hi upload karein.");
            return;
        }

        if (file.size > maxSizeMB * 1024 * 1024) {
            setErrorMessage(`File size limit exceed ho gaya hai (${maxSizeMB} MB max).`);
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const parsed = JSON.parse(e.target?.result as string);
                const items = Array.isArray(parsed) ? parsed : [parsed];

                const results = items.map((item, idx) => validator(item, idx));
                setValidatedRows(results);
                setFileMeta(`${file.name} (${items.length} records parsed)`);
            } catch (err: any) {
                setErrorMessage("Invalid JSON format: " + (err?.message || "File parse nahi ho payi."));
            }
        };
        reader.readAsText(file);
    };

    const handleFileDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            processFile(e.dataTransfer.files[0]);
        }
    };

    const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            processFile(e.target.files[0]);
        }
    };

    const handleDownloadSample = () => {
        if (!sampleData) return;
        const blob = new Blob([JSON.stringify(sampleData, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = sampleFileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const handleCommit = async () => {
        const validDataToSubmit = validatedRows.filter((r) => r.isValid).map((r) => r.data);
        if (validDataToSubmit.length === 0) return;

        try {
            setIsSubmitting(true);
            await onImport(validDataToSubmit);
            handleClose();
        } catch (err: any) {
            setErrorMessage(err?.message || "Import fail ho gaya.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#111827]/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                className="bg-white rounded-2xl border border-border shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden text-body"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-surface">
                    <div>
                        <h3 className="text-lg font-bold text-heading">{title}</h3>
                        <p className="text-xs text-muted mt-0.5 flex items-center gap-1.5">
                            <span>{description}</span>
                            {schemaBadge && (
                                <code className="text-primary font-mono text-[11px] bg-primary-light px-1.5 py-0.5 rounded font-medium">
                                    {schemaBadge}
                                </code>
                            )}
                        </p>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-1.5 rounded-lg text-muted hover:text-heading hover:bg-border/40 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content Body */}
                <div className="p-6 overflow-y-auto flex-1 space-y-5">
                    {/* Dropzone */}
                    <div
                        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                        onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
                        onDrop={handleFileDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer flex flex-col items-center justify-center ${isDragging
                                ? "border-primary bg-primary-light/30"
                                : "border-border hover:border-primary/60 bg-surface hover:bg-primary-light/10"
                            }`}
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".json,application/json"
                            className="hidden"
                            onChange={handleFileSelect}
                        />

                        <div className="w-12 h-12 rounded-xl bg-primary-light text-primary flex items-center justify-center mb-3">
                            <UploadCloud className="w-6 h-6" />
                        </div>

                        <h4 className="text-sm font-semibold text-heading">Drag & drop your JSON file here</h4>
                        <p className="text-xs text-muted mt-1">
                            or <span className="text-primary font-medium underline underline-offset-2">browse from your computer</span>
                        </p>
                        <span className="text-[11px] text-muted mt-3 inline-block">
                            JSON format only • Up to {maxSizeMB} MB
                        </span>
                    </div>

                    {/* Sample Download Bar */}
                    {sampleData && (
                        <div className="flex items-center justify-between text-xs bg-surface-alt p-3 rounded-lg border border-border">
                            <div className="flex items-center gap-2 text-muted">
                                <Info className="w-4 h-4 text-primary shrink-0" />
                                <span>Need reference schema? Download the template file to see valid fields.</span>
                            </div>
                            <button
                                type="button"
                                onClick={handleDownloadSample}
                                className="text-xs font-semibold text-primary hover:text-primary-hover flex items-center gap-1.5 shrink-0 ml-2"
                            >
                                <Download className="w-3.5 h-3.5" />
                                Sample JSON
                            </button>
                        </div>
                    )}

                    {/* Error Message */}
                    {errorMessage && (
                        <div className="p-3 text-xs bg-rose-50 text-rose-700 border border-rose-200 rounded-lg flex items-center gap-2">
                            <XCircle className="w-4 h-4 shrink-0" />
                            <span>{errorMessage}</span>
                        </div>
                    )}

                    {/* Validation & Preview Section */}
                    {validatedRows.length > 0 && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-heading flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-primary" />
                                    Import Validation Preview
                                </h4>
                                <span className="text-xs text-muted font-mono">{fileMeta}</span>
                            </div>

                            {/* Stats Chips */}
                            <div className="grid grid-cols-3 gap-3">
                                <div className="p-2.5 rounded-lg border border-emerald-200 bg-emerald-50/50 text-center">
                                    <div className="text-lg font-bold text-emerald-700">{validCount}</div>
                                    <div className="text-[11px] font-medium text-emerald-600">Valid Records</div>
                                </div>
                                <div className="p-2.5 rounded-lg border border-amber-200 bg-amber-50/50 text-center">
                                    <div className="text-lg font-bold text-amber-700">{warnCount}</div>
                                    <div className="text-[11px] font-medium text-amber-600">Needs Attention</div>
                                </div>
                                <div className="p-2.5 rounded-lg border border-rose-200 bg-rose-50/50 text-center">
                                    <div className="text-lg font-bold text-rose-700">{invalidCount}</div>
                                    <div className="text-[11px] font-medium text-rose-600">Invalid (Skipped)</div>
                                </div>
                            </div>

                            {/* Records Preview Table */}
                            <div className="border border-border rounded-lg overflow-hidden max-h-56 overflow-y-auto">
                                <table className="w-full text-xs text-left">
                                    <thead className="bg-surface border-b border-border font-semibold text-muted sticky top-0 z-10">
                                        <tr>
                                            <th className="py-2 px-3 w-12 text-center">State</th>
                                            {columns.map((col, idx) => (
                                                <th key={idx} className={`py-2 px-3 ${col.className || ""}`}>
                                                    {col.header}
                                                </th>
                                            ))}
                                            <th className="py-2 px-3">Remarks</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                        {validatedRows.map((row, idx) => {
                                            const hasWarnings = (row.warnings?.length ?? 0) > 0;
                                            const hasErrors = (row.errors?.length ?? 0) > 0;

                                            return (
                                                <tr key={idx} className={row.isValid ? "bg-white hover:bg-surface" : "bg-rose-50/50"}>
                                                    <td className="py-2 px-3 text-center">
                                                        {row.isValid ? (
                                                            hasWarnings ? (
                                                                <span className="text-amber-600 font-bold" title="Warning">⚠</span>
                                                            ) : (
                                                                <span className="text-emerald-600 font-bold" title="Valid">✓</span>
                                                            )
                                                        ) : (
                                                            <span className="text-rose-600 font-bold" title="Invalid">✕</span>
                                                        )}
                                                    </td>
                                                    {columns.map((col, colIdx) => (
                                                        <td key={colIdx} className={`py-2 px-3 ${col.className || ""}`}>
                                                            {col.render(row.data, row)}
                                                        </td>
                                                    ))}
                                                    <td className="py-2 px-3 text-[11px]">
                                                        {hasErrors ? (
                                                            <span className="text-rose-600">{row.errors?.join(", ")}</span>
                                                        ) : hasWarnings ? (
                                                            <span className="text-amber-600">{row.warnings?.join(", ")}</span>
                                                        ) : (
                                                            <span className="text-emerald-600">Valid</span>
                                                        )}
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

                {/* Footer */}
                <div className="px-6 py-3.5 bg-surface border-t border-border flex items-center justify-between">
                    <button
                        type="button"
                        onClick={handleClose}
                        className="px-4 py-2 text-xs font-semibold text-muted hover:text-heading transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleCommit}
                        disabled={savableCount === 0 || isSubmitting}
                        className="px-4 py-2 bg-primary hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-semibold rounded-lg shadow-sm transition-all flex items-center gap-1.5"
                    >
                        <PlusCircle className="w-3.5 h-3.5" />
                        <span>
                            {isSubmitting
                                ? "Importing..."
                                : savableCount > 0
                                    ? `Import ${savableCount} Valid Records`
                                    : "No Valid Records"}
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
}