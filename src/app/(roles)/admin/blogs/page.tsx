"use client";

import React, { useState, useMemo, useRef } from "react";
import Link from "next/link";
import {
  Plus,
  CheckCircle,
  Archive,
  Trash2,
  MoreVertical,
  Eye,
  Edit3,
  Copy,
  FileMinus,
  FileText,
  ImageIcon,
  X,
} from "lucide-react";
import { PageHeader } from "@/components/admin/common/PageHeader";
import { TablePagination } from "@/components/admin/common/TablePagination";
import { TableToolbar } from "@/components/admin/common/TableToolbar";
import { BulkImportModal } from "@/components/admin/common/BulkImportModal";
import { BlogQuickViewDrawer } from "@/components/admin/drawer/BlogQuickViewDrawer";
import { ActionMenu } from "@/components/admin/common/ActionMenu";

export type PostStatus = "draft" | "published" | "archived";

export interface PostFormValues {
  id?: string;
  title: string;
  slug: string;
  is_manual_slug: boolean;
  excerpt?: string;
  content: string;
  featured_image?: string;
  publishing: {
    status: PostStatus;
    published_at?: string | null;
    author_id: string;
  };
  seo: {
    meta_title?: string;
    meta_description?: string;
    canonical_url?: string;
  };
  updated_at?: string;
}

const INITIAL_BLOGS: PostFormValues[] = [
  {
    id: "post_1",
    title: "How AI Agents are Changing Modern Enterprise Software in 2026",
    slug: "how-ai-agents-are-changing-modern-enterprise",
    is_manual_slug: false,
    excerpt:
      "Autonomous intelligent workflows and multi-agent coordination frameworks are reshaping SaaS architectures and productivity.",
    content:
      "Detailed deep dive into autonomous workflows, tool calling, and deterministic runtime guarantees across large engineering teams...",
    featured_image:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80",
    publishing: {
      status: "published",
      published_at: "2026-03-28T10:30:00Z",
      author_id: "Dharmendra (Admin)",
    },
    seo: {
      meta_title: "How AI Agents are Changing Modern Enterprise Software",
      meta_description:
        "Explore the profound shifts in enterprise computing driven by autonomous multi-agent systems.",
      canonical_url: "https://apearix.com/blog/how-ai-agents-are-changing-modern-enterprise",
    },
    updated_at: "2 hours ago",
  },
  {
    id: "post_2",
    title: "Building Micro-frontends with Next.js 16 and Module Federation",
    slug: "building-micro-frontends-nextjs-16",
    is_manual_slug: true,
    excerpt:
      "A practical guide to scalable decoupled client architectures without sacrificing SSR performance and type safety.",
    content:
      "Architecting large scale frontends requires team independence. Here is how we decoupled our design system...",
    featured_image:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=80",
    publishing: {
      status: "published",
      published_at: "2026-03-24T14:15:00Z",
      author_id: "Rahul Sharma",
    },
    seo: {
      meta_title: "Next.js 16 Micro-frontends Tutorial",
      meta_description:
        "Learn how to assemble zero-latency micro-frontends with the latest Next.js features.",
      canonical_url: "https://apearix.com/blog/building-micro-frontends-nextjs-16",
    },
    updated_at: "5 hours ago",
  },
];

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
      status: "published",
      published_at: "2026-03-30T10:00:00Z",
      author_id: "Dharmendra (Admin)",
    },
    seo: {
      meta_title: "Optimizing High Throughput APIs",
      meta_description: "Learn how to reduce p99 latency across distributed microservices.",
      canonical_url: "https://apearix.com/blog/optimizing-high-throughput-apis",
    },
  },
];

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<PostFormValues[]>(INITIAL_BLOGS);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [authorFilter, setAuthorFilter] = useState<string>("all");
  const [sortFilter, setSortFilter] = useState<string>("newest");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // Modals & Panels
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
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
      published: blogs.filter((b) => b.publishing.status === "published").length,
      draft: blogs.filter((b) => b.publishing.status === "draft").length,
      archived: blogs.filter((b) => b.publishing.status === "archived").length,
    }),
    [blogs]
  );

  const filteredBlogs = useMemo(() => {
    return blogs
      .filter((post) => {
        if (statusFilter !== "all" && post.publishing.status !== statusFilter) return false;
        if (authorFilter !== "all" && post.publishing.author_id !== authorFilter) return false;
        if (searchQuery.trim() !== "") {
          const q = searchQuery.toLowerCase().trim();
          const matchTitle = (post.title || "").toLowerCase().includes(q);
          const matchSlug = (post.slug || "").toLowerCase().includes(q);
          const matchExcerpt = (post.excerpt || "").toLowerCase().includes(q);
          const matchAuthor = (post.publishing.author_id || "").toLowerCase().includes(q);
          if (!matchTitle && !matchSlug && !matchExcerpt && !matchAuthor) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortFilter === "newest") {
          return (
            new Date(b.publishing.published_at || 0).getTime() -
            new Date(a.publishing.published_at || 0).getTime()
          );
        }
        if (sortFilter === "oldest") {
          return (
            new Date(a.publishing.published_at || 0).getTime() -
            new Date(b.publishing.published_at || 0).getTime()
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

  const handleBulkStatusChange = (newStatus: PostStatus) => {
    if (selectedIds.size === 0) return;
    setBlogs((prev) =>
      prev.map((post) => {
        if (selectedIds.has(post.id!)) {
          return {
            ...post,
            publishing: {
              ...post.publishing,
              status: newStatus,
              published_at:
                newStatus === "published" && !post.publishing.published_at
                  ? new Date().toISOString()
                  : post.publishing.published_at,
            },
            updated_at: "Just now",
          };
        }
        return post;
      })
    );
    showToast(`Updated ${selectedIds.size} posts to ${newStatus}`);
    setSelectedIds(new Set());
  };

  const handleBulkDelete = () => {
    if (selectedIds.size === 0) return;
    if (window.confirm(`Are you sure you want to delete ${selectedIds.size} selected post(s)?`)) {
      setBlogs((prev) => prev.filter((p) => !selectedIds.has(p.id!)));
      showToast(`Deleted ${selectedIds.size} posts`);
      setSelectedIds(new Set());
    }
  };

  const updateSingleStatus = (id: string, status: PostStatus) => {
    setBlogs((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
            ...p,
            publishing: {
              ...p.publishing,
              status,
              published_at:
                status === "published" && !p.publishing.published_at
                  ? new Date().toISOString()
                  : p.publishing.published_at,
            },
            updated_at: "Just now",
          }
          : p
      )
    );
    setActiveMenuId(null);
    showToast(`Post status updated to ${status}`);
  };

  const duplicateSinglePost = (id: string) => {
    const item = blogs.find((b) => b.id === id);
    if (!item) return;
    const duplicated: PostFormValues = {
      ...JSON.parse(JSON.stringify(item)),
      id: "post_" + Date.now(),
      title: `${item.title} (Copy)`,
      slug: `${item.slug}-copy`,
      publishing: { ...item.publishing, status: "draft", published_at: null },
      updated_at: "Just now",
    };
    setBlogs((prev) => [duplicated, ...prev]);
    setActiveMenuId(null);
    showToast(`Duplicated: "${duplicated.title}"`);
  };

  const deleteSinglePost = (id: string) => {
    if (window.confirm("Are you sure you want to delete this blog post?")) {
      setBlogs((prev) => prev.filter((p) => p.id !== id));
      setActiveMenuId(null);
      if (drawerPost?.id === id) setDrawerPost(null);
      showToast("Blog post deleted");
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
        `"${p.publishing.status || ""}"`,
        `"${(p.publishing.author_id || "").replace(/"/g, '""')}"`,
        `"${p.publishing.published_at || ""}"`,
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
    }

    let status: PostStatus = item.publishing?.status || item.status || "draft";
    if (!["draft", "published", "archived"].includes(status)) {
      warnings.push(`Status '${status}' mapped to draft`);
      status = "draft";
    }

    const author = item.publishing?.author_id || item.author || "Dharmendra (Admin)";
    if (!item.publishing?.author_id && !item.author) {
      warnings.push("Defaulted author to Admin");
    }

    const isValid = errors.length === 0;
    const remarks = isValid ? (warnings.length > 0 ? warnings.join(", ") : "Valid") : errors.join(", ");

    const postData: PostFormValues = {
      id: "imported_" + Date.now() + "_" + index,
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
          item.publishing?.published_at || (status === "published" ? new Date().toISOString() : null),
        author_id: author,
      },
      seo: {
        meta_title: item.seo?.meta_title || item.title || "",
        meta_description: item.seo?.meta_description || item.excerpt || "",
        canonical_url: item.seo?.canonical_url || `https://apearix.com/blog/${slug}`,
      },
      updated_at: "Just now",
    };

    return {
      data: postData,
      isValid,
      remarks,
    };
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
              ...authorsList.map((auth) => ({ label: auth, value: auth })),
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
              className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium text-white transition-colors flex items-center gap-1.5"
            >
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> Publish
            </button>
            <button
              onClick={() => handleBulkStatusChange("archived")}
              className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium text-white transition-colors flex items-center gap-1.5"
            >
              <Archive className="w-3.5 h-3.5 text-slate-300" /> Archive
            </button>
            <button
              onClick={() => handleExport("selected_json")}
              className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium text-white transition-colors flex items-center gap-1.5"
            >
              Export
            </button>
            <button
              onClick={handleBulkDelete}
              className="px-2.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-xs font-medium text-white transition-colors flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" /> Delete
            </button>
            <button
              onClick={() => setSelectedIds(new Set())}
              className="p-1 rounded-md text-white/70 hover:text-white"
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
                        className="px-3 py-1.5 bg-surface hover:bg-surface-alt border border-border text-xs font-semibold text-heading rounded-lg transition-colors"
                      >
                        Reset Filters
                      </button>
                      <button
                        onClick={() => setIsImportModalOpen(true)}
                        className="px-3 py-1.5 bg-primary hover:bg-primary-hover text-white text-xs font-semibold rounded-lg transition-colors"
                      >
                        Import JSON
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedBlogs.map((post) => {
                  const isSelected = selectedIds.has(post.id!);
                  const status = post.publishing.status;
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
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-3">
                          {post.featured_image ? (
                            <img
                              src={post.featured_image}
                              alt={post.title}
                              className="w-10 h-10 rounded-lg object-cover border border-border shrink-0 shadow-sm"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-primary-light border border-border-accent flex items-center justify-center text-primary shrink-0">
                              <ImageIcon className="w-4 h-4" />
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <div
                              className="font-semibold text-heading truncate text-sm hover:text-primary transition-colors"
                              title={post.title}
                            >
                              {post.title}
                            </div>
                            <div className="text-xs text-muted font-mono truncate mt-0.5 flex items-center gap-1.5">
                              <span>/blog/{post.slug}</span>
                              {post.is_manual_slug && (
                                <span className="text-[10px] text-primary bg-primary-light px-1 py-0.2 rounded font-sans font-medium">
                                  Custom
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-surface-alt border border-border flex items-center justify-center text-[10px] font-bold text-heading">
                            {post.publishing.author_id ? post.publishing.author_id.charAt(0) : "A"}
                          </div>
                          <span className="text-xs text-heading font-medium truncate">
                            {post.publishing.author_id}
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
                        {post.publishing.published_at
                          ? new Date(post.publishing.published_at).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                          : "—"}
                      </td>
                      <td className="py-3.5 px-3 text-xs text-muted">
                        {post.updated_at || "Just now"}
                      </td>
                      {/* Actions Column */}
                      <td
                        className="py-3.5 pr-4 pl-3 text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ActionMenu
                          items={[
                            {
                              label: "View Preview",
                              icon: <Eye className="w-3.5 h-3.5 text-muted" />,
                              onClick: () => setDrawerPost(post),
                            },
                            {
                              label: "Edit in Form",
                              icon: <Edit3 className="w-3.5 h-3.5 text-muted" />,
                              href: `/admin/blogs/edit/${post.id}`,
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
        onCommit={(importedPosts) => {
          setBlogs((prev) => [...importedPosts, ...prev]);
          showToast(`Successfully imported ${importedPosts.length} blog post(s)!`);
        }}
      />

      {/* Quick View Drawer Component */}
      <BlogQuickViewDrawer post={drawerPost} onClose={() => setDrawerPost(null)} />
    </main>
  );
}