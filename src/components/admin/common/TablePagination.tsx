"use client";

import React from "react";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";

export interface TablePaginationProps {
    currentPage: number;
    totalItems: number;
    pageSize: number;
    pageSizeOptions?: number[];
    onPageChange: (page: number) => void;
    onPageSizeChange: (size: number) => void;
}

export function TablePagination({
    currentPage,
    totalItems,
    pageSize,
    pageSizeOptions = [10, 25, 50],
    onPageChange,
    onPageSizeChange,
}: Readonly<TablePaginationProps>) {
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
    const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

    const startRecord = totalItems === 0 ? 0 : (safeCurrentPage - 1) * pageSize + 1;
    const endRecord = Math.min(safeCurrentPage * pageSize, totalItems);

    // Dynamic pagination range with ellipsis
    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        const delta = 1;

        for (let i = 1; i <= totalPages; i++) {
            if (
                i === 1 ||
                i === totalPages ||
                (i >= safeCurrentPage - delta && i <= safeCurrentPage + delta)
            ) {
                pages.push(i);
            } else if (pages.at(-1) !== "...") {
                pages.push("...");
            }
        }
        return pages;
    };

    const pageNumbers = getPageNumbers();

    return (
        <div className="border-t border-border px-4 py-3 bg-surface flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            {/* Results Summary */}
            <div id="paginationSummary" className="text-muted text-center sm:text-left order-2 sm:order-1">
                Showing <span className="font-semibold text-heading">{startRecord}</span> to{" "}
                <span className="font-semibold text-heading">{endRecord}</span> of{" "}
                <span className="font-semibold text-heading">{totalItems}</span> results
            </div>

            {/* Controls Container */}
            <div className="flex flex-wrap items-center justify-center sm:justify-end gap-3 sm:gap-4 order-1 sm:order-2 w-full sm:w-auto">
                {/* Rows Per Page */}
                <div className="flex items-center gap-2">
                    <span className="text-muted whitespace-nowrap text-xs">Rows per page:</span>
                    <div className="relative inline-flex items-center">
                        <select
                            id="pageSizeSelect"
                            value={pageSize}
                            onChange={(e) => onPageSizeChange(Number(e.target.value))}
                            className="appearance-none py-1 pl-2.5 pr-7 border border-border rounded-lg bg-background text-heading text-xs font-medium focus:outline-none!  transition-colors"
                        >
                            {pageSizeOptions.map((opt) => (
                                <option key={opt} value={opt}>
                                    {opt}
                                </option>
                            ))}
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 text-muted absolute right-2 pointer-events-none transition-transform" />
                    </div>
                </div>

                {/* Page Navigation */}
                <div className="flex items-center gap-1">
                    {/* Previous Page Button */}
                    <button
                        id="prevPageBtn"
                        type="button"
                        disabled={safeCurrentPage <= 1}
                        onClick={() => onPageChange(safeCurrentPage - 1)}
                        className="p-1.5 rounded-lg border border-border bg-background text-muted hover:text-heading hover:bg-surface-alt active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                        aria-label="Previous Page"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>

                    {/* Page Numbers */}
                    <div id="paginationNumbers" className="flex items-center gap-1">
                        {pageNumbers.map((page, idx) => {
                            if (page === "...") {
                                const prevPage = pageNumbers[idx - 1];
                                return (
                                    <span
                                        key={`ellipsis-after-${prevPage}`}
                                        className="min-w-7 h-7 px-1 flex items-center justify-center text-muted select-none text-xs"
                                    >
                                        ...
                                    </span>
                                );
                            }

                            const isCurrent = page === safeCurrentPage;
                            return (
                                <button
                                    key={`page-${page}`}
                                    type="button"
                                    onClick={() => onPageChange(page as number)}
                                    className={`min-w-7 h-7 px-2 flex items-center justify-center rounded-lg border text-xs font-semibold transition-all cursor-pointer ${isCurrent
                                        ? "border-primary bg-primary text-white shadow-2xs"
                                        : "border-border bg-background text-muted hover:text-heading hover:bg-surface-alt font-medium"
                                        }`}
                                >
                                    {page}
                                </button>
                            );
                        })}
                    </div>

                    {/* Next Page Button */}
                    <button
                        id="nextPageBtn"
                        type="button"
                        disabled={safeCurrentPage >= totalPages}
                        onClick={() => onPageChange(safeCurrentPage + 1)}
                        className="p-1.5 rounded-lg border border-border bg-background text-muted hover:text-heading hover:bg-surface-alt active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                        aria-label="Next Page"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}