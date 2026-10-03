"use client";

import React, { useState, useMemo, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Plus,
  CheckCircle,
  Archive,
  Trash2,
  Eye,
  Copy,
  Edit,
  FileMinus,
  FileText,
  ImageIcon,
  X,
  Loader2,
} from "lucide-react";
import { PageHeader } from "@/components/admin/common/PageHeader";
import { TablePagination } from "@/components/admin/common/TablePagination";
import { TableToolbar } from "@/components/admin/common/TableToolbar";
import { BulkImportModal } from "@/components/admin/common/BulkImportModal";
import { formatDateInTimezone } from "@/lib/timezone";
import { BlogQuickViewDrawer } from "@/components/admin/drawer/BlogQuickViewDrawer";
import { ActionMenu } from "@/components/admin/common/ActionMenu";
import { type PostStatus, type PostFormValues } from "@/schemas/blog.schema";
import {
  index as fetchBlogsApi,
  destroy as deleteBlogApi,
  update as updateBlogApi,
  store as createBlogApi,
  bulkUpdateStatus as bulkUpdateStatusApi,
  bulkDelete as bulkDeleteApi,
  bulkImport as bulkImportApi,
  getAuthorName,
} from "@/lib/services/admin/blogs";

const SAMPLE_BLOG_IMPORT = [
  {
    title: "Optimizing High Throughput APIs in Distributed Systems",
    slug: "optimizing-high-throughput-apis",
    is_manual_slug: false,
    excerpt:
      "Tactics for reducing p99 latency, pooling database connections, and managing backpressure.",
    content:
      "Comprehensive benchmarks and architecture blueprints for high concurrency services...",
    featured_image:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80",
    publishing: {
      status: "published" as PostStatus,
      published_at: "2026-03-30T10:00:00Z",
      author_id: "1",
    },
    seo: {
      meta_title: "Optimizing High Throughput APIs",
      meta_description: "Learn how to reduce p99 latency across distributed microservices.",
      canonical_url: "https://apearix.com/blog/optimizing-high-throughput-apis",
    },
  },
];

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<PostFormValues[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [authorFilter, setAuthorFilter] = useState<string>("all");
  const [sortFilter, setSortFilter] = useState<string>("newest");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // Modals & Panels
  const [drawerPost, setDrawerPost] = useState<PostFormValues | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const loadBlogs = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetchBlogsApi();
      setBlogs(res.items);
    } catch (error) {
      console.error("Error loading blogs:", error);
      showToast("Failed to load blog posts from server.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBlogs();
  }, [loadBlogs]);

  const authorsList = useMemo(() => {
    const set = new Set<string>();
    blogs.forEach((b) => {
      if (b.publishing?.author_id) set.add(b.publishing.author_id);
    });
    return Array.from(set);
  }, [blogs]);

  const counts = useMemo(
    () => ({
      all: blogs.length,
      published: blogs.filter((b) => b.publishing?.status === "published").length,
      draft: blogs.filter((b) => b.publishing?.status === "draft").length,
      archived: blogs.filter((b) => b.publishing?.status === "archived").length,
    }),
    [blogs]
  );

  const filteredBlogs = useMemo(() => {
    return blogs
      .filter((post) => {
        if (statusFilter !== "all" && post.publishing?.status !== statusFilter) return false;
        if (authorFilter !== "all" && post.publishing?.author_id !== authorFilter) return false;
        if (searchQuery.trim() !== "") {
          const q = searchQuery.toLowerCase().trim();
          const matchTitle = (post.title || "").toLowerCase().includes(q);
          const matchSlug = (post.slug || "").toLowerCase().includes(q);
          const matchExcerpt = (post.excerpt || "").toLowerCase().includes(q);
          const authorName = getAuthorName(post.publishing?.author_id);
          const matchAuthor = authorName.toLowerCase().includes(q);
          if (!matchTitle && !matchSlug && !matchExcerpt && !matchAuthor) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortFilter === "newest") {
          return (
            new Date(b.publishing?.published_at || 0).getTime() -
            new Date(a.publishing?.published_at || 0).getTime()
          );
        }
        if (sortFilter === "oldest") {
          return (
            new Date(a.publishing?.published_at || 0).getTime() -
            new Date(b.publishing?.published_at || 0).getTime()
          );
        }
        if (sortFilter === "title_asc") {
          return (a.title || "").localeCompare(b.title || "");
        }
        return 0;
      });
  }, [blogs, statusFilter, authorFilter, searchQuery, sortFilter]);

  const totalItems = filteredBlogs.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const validCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (validCurrentPage - 1) * pageSize;
  const paginatedBlogs = filteredBlogs.slice(startIndex, startIndex + pageSize);

  const allFilteredSelected =
    paginatedBlogs.length > 0 && paginatedBlogs.every((b) => selectedIds.has(b.id!));
  const isIndeterminate =
    paginatedBlogs.some((b) => selectedIds.has(b.id!)) && !allFilteredSelected;

  const toggleSelectAll = (checked: boolean) => {
    const next = new Set(selectedIds);
    if (checked) paginatedBlogs.forEach((b) => next.add(b.id!));
    else paginatedBlogs.forEach((b) => next.delete(b.id!));
    setSelectedIds(next);
  };

  const toggleSelectOne = (id: string, checked: boolean) => {
    const next = new Set(selectedIds);
    if (checked) next.add(id);
    else next.delete(id);
    setSelectedIds(next);
  };

  const handleBulkStatusChange = async (newStatus: PostStatus) => {
    if (selectedIds.size === 0) return;
    try {
      await bulkUpdateStatusApi(Array.from(selectedIds), newStatus);
      showToast(`Updated ${selectedIds.size} posts to ${newStatus}`);
      setSelectedIds(new Set());
      await loadBlogs();
    } catch (error: any) {
      showToast(error?.message || "Failed to update bulk status");
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    if (window.confirm(`Are you sure you want to delete ${selectedIds.size} selected post(s)?`)) {
      try {
        await bulkDeleteApi(Array.from(selectedIds));
        showToast(`Deleted ${selectedIds.size} posts`);
        setSelectedIds(new Set());
        await loadBlogs();
      } catch (error: any) {
        showToast(error?.message || "Failed to delete selected posts");
      }
    }
  };

  const updateSingleStatus = async (id: string, status: PostStatus) => {
    const item = blogs.find((b) => b.id === id);
    if (!item) return;
    try {
      await updateBlogApi(id, {
        id,
        title: item.title,
        slug: item.slug,
        content: item.content,
        publishing: {
          status,
          author_id: item.publishing?.author_id || "1",
          published_at:
            status === "published"
              ? item.publishing?.published_at || new Date().toISOString()
              : item.publishing?.published_at || "",
        },
      });
      showToast(`Post status updated to ${status}`);
      await loadBlogs();
    } catch (error: any) {
      showToast(error?.message || "Failed to update status");
    }
  };

  const duplicateSinglePost = async (id: string) => {
    const item = blogs.find((b) => b.id === id);
    if (!item) return;
    try {
      await createBlogApi({
        title: `${item.title} (Copy)`,
        slug: `${item.slug}-copy`,
        is_manual_slug: true,
        excerpt: item.excerpt,
        content: item.content,
        featured_image: item.featured_image,
        publishing: {
          status: "draft",
          author_id: item.publishing?.author_id || "1",
          published_at: "",
        },
        seo: item.seo,
      });
      showToast(`Duplicated: "${item.title}"`);
      await loadBlogs();
    } catch (error: any) {
      showToast(error?.message || "Failed to duplicate post");
    }
  };

  const deleteSinglePost = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this blog post?")) {
      try {
        await deleteBlogApi(id);
        if (drawerPost?.id === id) setDrawerPost(null);
        showToast("Blog post deleted");
        await loadBlogs();
      } catch (error: any) {
        showToast(error?.message || "Failed to delete blog post");
      }
    }
  };

  const downloadFile = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const handleExport = (type: "all_json" | "filtered_json" | "selected_json" | "csv") => {
    let target: PostFormValues[] = [];
    if (type === "all_json") target = blogs;
    else if (type === "filtered_json") target = filteredBlogs;
    else if (type === "selected_json") target = blogs.filter((b) => selectedIds.has(b.id!));
    else if (type === "csv") target = filteredBlogs;

    if (target.length === 0) {
      showToast("No posts available to export");
      return;
    }

    if (type === "csv") {
      const headers = ["Title", "Slug", "Status", "Author", "Published At", "Excerpt", "Canonical URL"];
      const rows = target.map((p) => [
        `"${(p.title || "").replace(/"/g, '""')}"`,
        `"${p.slug || ""}"`,
        `"${p.publishing?.status || ""}"`,
        `"${(getAuthorName(p.publishing?.author_id)).replace(/"/g, '""')}"`,
        `"${p.publishing?.published_at || ""}"`,
        `"${(p.excerpt || "").replace(/"/g, '""')}"`,
        `"${p.seo?.canonical_url || ""}"`,
      ]);
      const csvStr = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
      const blob = new Blob([csvStr], { type: "text/csv;charset=utf-8;" });
      downloadFile(blob, `apearix_blogs_${new Date().toISOString().slice(0, 10)}.csv`);
      showToast(`Exported ${target.length} posts as CSV`);
    } else {
      const cleanJson = target.map(({ id, updated_at, ...clean }) => clean);
      const jsonStr = JSON.stringify(cleanJson, null, 2);
      const blob = new Blob([jsonStr], { type: "application/json" });
      downloadFile(blob, `apearix_blogs_${type}_${new Date().toISOString().slice(0, 10)}.json`);
      showToast(`Exported ${target.length} posts as JSON`);
    }
  };

  const validateBlogRow = (item: any, index: number) => {
    const warnings: string[] = [];
    const errors: string[] = [];

    if (!item.title || typeof item.title !== "string" || item.title.trim() === "") {
      errors.push("Missing post title");
    }

    let slug = item.slug;
    if (!slug || typeof slug !== "string") {
      if (item.title) {
        slug = item.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
        warnings.push("Auto-slugged");
      } else {
        errors.push("No slug/title");
      }
    } else {
      const cleanSlug = slug.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      if (cleanSlug !== slug) {
        warnings.push("Slug sanitized");
        slug = cleanSlug;
      }
    }

    let status: PostStatus = item.publishing?.status || item.status || "draft";
    if (!["draft", "published", "archived"].includes(status)) {
      warnings.push(`Status '${status}' mapped to draft`);
      status = "draft";
    }

    const author = String(item.publishing?.author_id || item.author_id || item.author || "1");

    const isValid = errors.length === 0;
    const remarks = isValid ? (warnings.length > 0 ? warnings.join(", ") : "Valid") : errors.join(", ");

    const postData: PostFormValues = {
      title: item.title || "Untitled Article",
      slug: slug || "untitled-article",
      is_manual_slug: item.is_manual_slug !== undefined ? Boolean(item.is_manual_slug) : true,
      excerpt: item.excerpt || "",
      content: item.content || "Content imported via JSON batch.",
      featured_image:
        item.featured_image ||
        "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80",
      publishing: {
        status,
        published_at:
          item.publishing?.published_at || (status === "published" ? new Date().toISOString() : ""),
        author_id: author,
      },
      seo: {
        meta_title: item.seo?.meta_title || item.title || "",
        meta_description: item.seo?.meta_description || item.excerpt || "",
        canonical_url: item.seo?.canonical_url || `https://apearix.com/blog/${slug}`,
      },
    };

    return {
      data: postData,
      isValid,
      remarks,
    };
  };

  const handleImportCommit = async (importedPosts: PostFormValues[]) => {
    try {
      const payload = importedPosts.map((post) => ({
        title: post.title,
        slug: post.slug,
        is_manual_slug: post.is_manual_slug,
        excerpt: post.excerpt,
        content: post.content,
        featured_image: post.featured_image,
        publishing: {
          status: post.publishing.status,
          author_id: post.publishing.author_id,
          published_at: post.publishing.published_at || "",
        },
        seo: post.seo,
      }));

      const res = await bulkImportApi(payload);
      const count = res?.count ?? res?.items?.length ?? importedPosts.length;
      showToast(`Successfully imported ${count} blog post(s)!`);
      await loadBlogs();
    } catch (err: any) {
      console.error("Bulk import posts error:", err);
      showToast(err?.message || "Failed to bulk import blog posts");
    }
  };

  return (
    <main>
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-heading text-white text-xs font-semibold rounded-xl shadow-2xl border border-white/10 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <PageHeader
        title="Blogs"
        subtitle="Manage, publish, bulk import and organize your Apearix blog articles."
        badge={`${blogs.length} Articles`}
        btn={
          <Link
            href="/admin/blogs/create"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary-hover text-white text-sm font-semibold rounded-lg shadow-sm shadow-primary/20 transition-all active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" /> Create Blog
          </Link>
        }
      />

      {/* Toolbar */}
      <TableToolbar
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          setCurrentPage(1);
        }}
        searchPlaceholder="Search blogs by title, slug, excerpt or author..."
        filters={[
          {
            id: "status-filter",
            value: statusFilter,
            onChange: (val) => {
              setStatusFilter(val);
              setCurrentPage(1);
            },
            minWidth: "135px",
            options: [
              { label: `Status: All (${counts.all})`, value: "all" },
              { label: `Published (${counts.published})`, value: "published" },
              { label: `Draft (${counts.draft})`, value: "draft" },
              { label: `Archived (${counts.archived})`, value: "archived" },
            ],
          },
          {
            id: "author-filter",
            value: authorFilter,
            onChange: (val) => {
              setAuthorFilter(val);
              setCurrentPage(1);
            },
            minWidth: "140px",
            options: [
              { label: "Author: All", value: "all" },
              ...authorsList.map((authId) => ({
                label: getAuthorName(authId),
                value: authId,
              })),
            ],
          },
        ]}
        sort={{
          value: sortFilter,
          onChange: setSortFilter,
          minWidth: "140px",
          options: [
            { label: "Sort: Newest", value: "newest" },
            { label: "Sort: Oldest", value: "oldest" },
            { label: "Title: A to Z", value: "title_asc" },
          ],
        }}
        onImportClick={() => setIsImportModalOpen(true)}
        exportOptions={[
          {
            id: "all_json",
            label: "All Posts (JSON)",
            badge: ".json",
            onClick: () => handleExport("all_json"),
          },
          {
            id: "filtered_json",
            label: "Filtered View (JSON)",
            badge: ".json",
            onClick: () => handleExport("filtered_json"),
          },
          {
            id: "csv",
            label: "Export as CSV",
            badge: ".csv",
            onClick: () => handleExport("csv"),
          },
        ]}
      />

      {/* Floating Bulk Action Bar */}
      {selectedIds.size > 0 && (
        <div className="mb-4 bg-heading text-white px-4 py-3 rounded-xl shadow-lg flex items-center justify-between gap-4 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex items-center gap-3">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span className="text-xs font-semibold tracking-wide">
              {selectedIds.size} {selectedIds.size === 1 ? "article" : "articles"} selected
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleBulkStatusChange("published")}
              className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium text-white transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> Publish
            </button>
            <button
              onClick={() => handleBulkStatusChange("archived")}
              className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium text-white transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Archive className="w-3.5 h-3.5 text-slate-300" /> Archive
            </button>
            <button
              onClick={() => handleExport("selected_json")}
              className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium text-white transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              Export
            </button>
            <button
              onClick={handleBulkDelete}
              className="px-2.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-xs font-medium text-white transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" /> Delete
            </button>
            <button
              onClick={() => setSelectedIds(new Set())}
              className="p-1 rounded-md text-white/70 hover:text-white cursor-pointer"
              title="Clear selection"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Table Card */}
      <div className="bg-white border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto min-h-95">
          {isLoading ? (
            <div className="py-20 text-center text-muted flex flex-col items-center justify-center gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <span className="text-xs font-medium">Loading blogs...</span>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface border-b border-border text-xs text-muted uppercase tracking-wider font-semibold select-none">
                  <th scope="col" className="py-3.5 pl-4 pr-2 w-10">
                    <input
                      type="checkbox"
                      checked={allFilteredSelected}
                      ref={(el) => {
                        if (el) el.indeterminate = isIndeterminate;
                      }}
                      onChange={(e) => toggleSelectAll(e.target.checked)}
                      className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20 accent-primary cursor-pointer"
                    />
                  </th>
                  <th scope="col" className="py-3.5 px-3 min-w-[320px]">Article</th>
                  <th scope="col" className="py-3.5 px-3 min-w-40">Author</th>
                  <th scope="col" className="py-3.5 px-3 min-w-32.5">Status</th>
                  <th scope="col" className="py-3.5 px-3 min-w-32.5">Published</th>
                  <th scope="col" className="py-3.5 px-3 min-w-30">Updated</th>
                  <th scope="col" className="py-3.5 pr-4 pl-3 text-right w-16">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-sm">
                {paginatedBlogs.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-16 px-4 text-center">
                      <div className="w-12 h-12 mx-auto rounded-2xl bg-primary-light text-primary flex items-center justify-center mb-3">
                        <FileText className="w-6 h-6" />
                      </div>
                      <h3 className="text-base font-semibold text-heading">No blog posts found</h3>
                      <p className="text-xs text-muted max-w-sm mx-auto mt-1 mb-5">
                        No articles match your current search or status filter. Try resetting them or upload a JSON backup.
                      </p>
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => {
                            setSearchQuery("");
                            setStatusFilter("all");
                            setAuthorFilter("all");
                          }}
                          className="px-3 py-1.5 bg-surface hover:bg-surface-alt border border-border text-xs font-semibold text-heading rounded-lg transition-colors cursor-pointer"
                        >
                          Reset Filters
                        </button>
                        <button
                          onClick={() => setIsImportModalOpen(true)}
                          className="px-3 py-1.5 bg-primary hover:bg-primary-hover text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                        >
                          Import JSON
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedBlogs.map((post) => {
                    const isSelected = selectedIds.has(post.id!);
                    const status = post.publishing?.status || "draft";
                    const authorDisplayName = getAuthorName(post.publishing?.author_id);
                    return (
                      <tr
                        key={post.id}
                        onClick={() => setDrawerPost(post)}
                        className={`group hover:bg-surface transition-colors cursor-pointer ${isSelected ? "bg-primary-light/40 border-l-4 border-l-primary" : ""
                          }`}
                      >
                        <td className="py-3.5 pl-4 pr-2 w-10" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => toggleSelectOne(post.id!, e.target.checked)}
                            className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20 accent-primary cursor-pointer"
                          />
                        </td>
                        <td className="py-3.5 px-3 max-w-[320px]">
                          <div className="flex items-start gap-3">
                            {post.featured_image ? (
                              <img
                                src={post.featured_image}
                                alt={post.title}
                                className="w-10 h-10 rounded-lg object-cover border border-border shrink-0 shadow-sm mt-0.5"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-lg bg-primary-light border border-border-accent flex items-center justify-center text-primary shrink-0 mt-0.5">
                                <ImageIcon className="w-4 h-4" />
                              </div>
                            )}
                            <div className="min-w-0 flex-1">
                              {/* 2 lines max with ellipsis (...) */}
                              <div
                                className="font-semibold text-heading text-sm hover:text-primary transition-colors line-clamp-2 leading-snug break-words"
                                title={post.title}
                              >
                                {post.title}
                              </div>
                              <div className="text-xs text-muted font-mono truncate mt-1 flex items-center gap-1.5">
                                <span className="truncate">/blog/{post.slug}</span>
                                {post.is_manual_slug && (
                                  <span className="text-[10px] text-primary bg-primary-light px-1 py-0.5 rounded font-sans font-medium shrink-0">
                                    Custom
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-3">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-surface-alt border border-border flex items-center justify-center text-[10px] font-bold text-heading shrink-0">
                              {authorDisplayName.charAt(0)}
                            </div>
                            <span className="text-xs text-heading font-medium truncate">
                              {authorDisplayName}
                            </span>
                          </div>
                        </td>
                        <td className="py-3.5 px-3">
                          {status === "published" && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Published
                            </span>
                          )}
                          {status === "draft" && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Draft
                            </span>
                          )}
                          {status === "archived" && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span> Archived
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-3 text-xs text-heading">
                          {post.publishing?.published_at
                            ? formatDateInTimezone(post.publishing.published_at, undefined, { month: "short", day: "numeric", year: "numeric" })
                            : "—"}
                        </td>
                        <td className="py-3.5 px-3 text-xs text-muted">
                          {post.updated_at
                            ? formatDateInTimezone(post.updated_at, undefined, { month: "short", day: "numeric", year: "numeric" })
                            : "Just now"}
                        </td>
                        {/* Actions Column */}
                        <td
                          className="py-3.5 pr-4 pl-3 text-right"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ActionMenu
                            items={[
                                {
                                  label: "Edit",
                                  icon: <Edit className="w-3.5 h-3.5 text-muted" />,
                                  onClick: () => window.location.href = `/admin/blogs/${post.id}/edit`,
                                },
                              {
                                label: "View Preview",
                                icon: <Eye className="w-3.5 h-3.5 text-muted" />,
                                onClick: () => setDrawerPost(post),
                              },
                              {
                                label: "Duplicate",
                                icon: <Copy className="w-3.5 h-3.5 text-muted" />,
                                onClick: () => duplicateSinglePost(post.id!),
                                dividerAfter: true,
                              },
                              ...(status === "published"
                                ? [
                                  {
                                    label: "Unpublish",
                                    icon: <FileMinus className="w-3.5 h-3.5" />,
                                    variant: "warning" as const,
                                    onClick: () => updateSingleStatus(post.id!, "draft"),
                                  },
                                ]
                                : [
                                  {
                                    label: "Publish Now",
                                    icon: <CheckCircle className="w-3.5 h-3.5" />,
                                    variant: "success" as const,
                                    onClick: () => updateSingleStatus(post.id!, "published"),
                                  },
                                ]),
                              {
                                label: "Archive",
                                icon: <Archive className="w-3.5 h-3.5" />,
                                onClick: () => updateSingleStatus(post.id!, "archived"),
                                dividerAfter: true,
                              },
                              {
                                label: "Delete",
                                icon: <Trash2 className="w-3.5 h-3.5" />,
                                variant: "danger" as const,
                                onClick: () => deleteSinglePost(post.id!),
                              },
                            ]}
                          />
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        <TablePagination
          currentPage={validCurrentPage}
          totalItems={totalItems}
          pageSize={pageSize}
          pageSizeOptions={[10, 25, 50]}
          onPageChange={(page) => setCurrentPage(page)}
          onPageSizeChange={(newSize) => {
            setPageSize(newSize);
            setCurrentPage(1);
          }}
        />
      </div>

      {/* Universal Reusable Bulk Import Modal */}
      <BulkImportModal<PostFormValues>
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        title="Import Blog Posts"
        subtitle="Bulk upload articles conforming to the"
        badgeText="PostFormValues"
        sampleFileName="apearix_blog_sample.json"
        sampleData={SAMPLE_BLOG_IMPORT}
        validateRow={validateBlogRow}
        previewColumns={[
          {
            header: "Title",
            render: (item) => (
              <span className="font-medium text-heading max-w-[130px] truncate block">
                {item.title}
              </span>
            ),
          },
          {
            header: "Slug",
            render: (item) => (
              <span className="text-muted font-mono text-[10px] max-w-[110px] truncate block">
                /{item.slug}
              </span>
            ),
          },
          {
            header: "Status",
            render: (item) => (
              <span className="capitalize font-medium text-heading">
                {item.publishing?.status}
              </span>
            ),
          },
        ]}
        onCommit={handleImportCommit}
      />

      {/* Quick View Drawer Component */}
      <BlogQuickViewDrawer post={drawerPost} onClose={() => setDrawerPost(null)} />
    </main>
  );
}




