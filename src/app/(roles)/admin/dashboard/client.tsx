"use client";

import React, { useCallback, useRef, useState, useEffect } from "react";
import Link from "next/link";
import {
  FileText,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Eye,
  Edit,
  Trash2,
  Package,
  Wrench,
  Plus,
  Sparkles,
  Activity,
  Server,
  Database,
  ArrowRight,
  Loader2,
  CheckCircle,
} from "lucide-react";
import { clientApi } from "@/lib/clientApi";
import { ActionMenu } from "@/components/admin/common/ActionMenu";
import { BlogQuickViewDrawer } from "@/components/admin/drawer/BlogQuickViewDrawer";
import { type PostFormValues } from "@/schemas/blog.schema";
import { formatDateInTimezone } from "@/lib/timezone";
import {
  index as fetchBlogsApi,
  destroy as deleteBlogApi,
  getAuthorName,
} from "@/lib/services/admin/blogs";

export default function DashboardClient() {
  const [blogs, setBlogs] = useState<PostFormValues[]>([]);
  const [dashboardData, setDashboardData] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const [drawerPost, setDrawerPost] = useState<PostFormValues | null>(null);

  // Toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const loadDashboardData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [blogsRes, dashRes] = await Promise.all([
        fetchBlogsApi(),
        clientApi<any>("/api/v1/admin/dashboard").catch(() => ({})),
      ]);
      setBlogs(blogsRes.items || []);
      setDashboardData(dashRes?.data || dashRes || {});
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      showToast("Failed to load dashboard data from server.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const deleteSinglePost = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this blog post?")) {
      try {
        await deleteBlogApi(id);
        if (drawerPost?.id === id) setDrawerPost(null);
        showToast("Blog post deleted successfully");
        await loadDashboardData();
      } catch (error: any) {
        showToast(error?.message || "Failed to delete blog post");
      }
    }
  };

  const stats = [
    {
      title: "Total Blogs",
      value: String(dashboardData.totalBlogs || blogs.length || "0"),
      trend: "+12.5%",
      isPositive: true,
      icon: FileText,
      description: "Active content pieces",
    },
    {
      title: "Categories",
      value: String(dashboardData.totalCategories || "0"),
      trend: "+2.4%",
      isPositive: true,
      icon: Layers,
      description: "Taxonomy groupings",
    },
    {
      title: "Products",
      value: String(dashboardData.totalProducts || "0"),
      trend: "+5.1%",
      isPositive: true,
      icon: Package,
      description: "Catalog entries",
    },
    {
      title: "Services",
      value: String(dashboardData.totalServices || "0"),
      trend: "+1.2%",
      isPositive: true,
      icon: Wrench,
      description: "Service offerings",
    },
  ];

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const recentBlogs = blogs.slice(0, 5);

  return (
    <main className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-heading text-white text-xs font-semibold rounded-xl shadow-2xl border border-white/10 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-border-accent/40 bg-gradient-to-r from-primary-light/60 via-surface to-background p-6 md:p-8">
        <div className="absolute right-0 top-0 -mt-6 -mr-6 h-48 w-48 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-2">
              <Sparkles size={13} /> Apearix Console
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-heading">
              Platform Overview
            </h1>
            <p className="text-muted text-sm flex items-center gap-2">
              <Calendar size={14} className="text-muted/70" />
              <span>{currentDate}</span>
              <span className="text-muted/40">•</span>
              <span className="text-primary font-medium">Asia/Kolkata</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/admin/blogs"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-background border border-border hover:border-primary/40 text-heading text-sm font-semibold rounded-xl shadow-xs transition-all active:scale-[0.98]"
            >
              Browse Articles
            </Link>
            <Link
              href="/admin/blogs/create"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary-hover text-white text-sm font-semibold rounded-xl shadow-md shadow-primary/25 transition-all active:scale-[0.98]"
            >
              <Plus size={16} /> Create Blog
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="relative group bg-background rounded-2xl p-5 border border-border hover:border-border-accent/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-lg hover:shadow-glow/20 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-11 h-11 rounded-xl bg-primary-light flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-200">
                  <Icon size={20} strokeWidth={2.2} />
                </div>
                <span
                  className={`inline-flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full border ${
                    stat.isPositive
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-rose-50 text-rose-700 border-rose-200"
                  }`}
                >
                  {stat.isPositive ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                  {stat.trend}
                </span>
              </div>
              <h3 className="text-3xl font-extrabold text-heading tracking-tight mb-1">
                {stat.value}
              </h3>
              <p className="text-heading text-sm font-semibold">{stat.title}</p>
              <p className="text-xs text-muted mt-0.5">{stat.description}</p>
            </div>
          );
        })}
      </div>

      {/* 2-Column Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Recent Blogs Table (8 Cols) */}
        <div className="lg:col-span-8 bg-background rounded-2xl border border-border shadow-[0_2px_12px_rgba(0,0,0,0.02)] overflow-hidden">
          <div className="px-5 md:px-6 py-4 border-b border-border flex items-center justify-between bg-surface/50">
            <div>
              <h2 className="text-base font-bold text-heading">Recent Articles</h2>
              <p className="text-xs text-muted mt-0.5">Latest published & draft posts across sections</p>
            </div>
            <Link
              href="/admin/blogs"
              className="inline-flex items-center gap-1 text-primary hover:text-primary-hover text-xs font-semibold group"
            >
              View directory
              <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="overflow-x-auto min-h-60">
            {isLoading ? (
              <div className="py-16 text-center text-muted flex flex-col items-center justify-center gap-2">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
                <span className="text-xs font-medium">Loading recent articles...</span>
              </div>
            ) : recentBlogs.length === 0 ? (
              <div className="py-16 text-center text-muted">
                <FileText className="w-8 h-8 mx-auto mb-2 opacity-40 text-primary" />
                <p className="text-sm font-medium text-heading">No articles found</p>
                <p className="text-xs text-muted mt-1 mb-4">Create your first blog post to populate your feed.</p>
                <Link
                  href="/admin/blogs/create"
                  className="px-3.5 py-2 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary-hover transition-colors"
                >
                  Create Blog
                </Link>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-alt/70 text-muted text-[11px] uppercase tracking-wider font-semibold border-b border-border">
                    <th className="px-6 py-3.5">Title & Date</th>
                    <th className="px-6 py-3.5">Author</th>
                    <th className="px-6 py-3.5">Status</th>
                    <th className="px-6 py-3.5">Updated</th>
                    <th className="px-6 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-sm">
                  {recentBlogs.map((blog) => {
                    const status = blog.publishing?.status || "draft";
                    const authorName = getAuthorName(blog.publishing?.author_id);
                    const formattedDate = blog.publishing?.published_at
                      ? formatDateInTimezone(blog.publishing.published_at, undefined, { month: "short", day: "numeric", year: "numeric" })
                      : blog.updated_at
                      ? formatDateInTimezone(blog.updated_at, undefined, { month: "short", day: "numeric", year: "numeric" })
                      : "Unscheduled";

                    const updatedDate = blog.updated_at
                      ? formatDateInTimezone(blog.updated_at, undefined, { month: "short", day: "numeric" })
                      : "Recently";

                    return (
                      <tr
                        key={blog.id}
                        onClick={() => setDrawerPost(blog)}
                        className="hover:bg-surface/70 transition-colors group cursor-pointer"
                      >
                        <td className="px-6 py-4">
                          <p className="font-semibold text-heading truncate max-w-[240px] group-hover:text-primary transition-colors" title={blog.title}>
                            {blog.title}
                          </p>
                          <span className="text-[11px] text-muted">{formattedDate}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2.5 py-1 bg-surface-alt border border-border text-body rounded-md text-xs font-medium">
                            {authorName}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                              status === "published"
                                ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                                : status === "draft"
                                ? "bg-neutral-100 border-neutral-200 text-neutral-700"
                                : "bg-amber-50 border-amber-200 text-amber-700"
                            }`}
                          >
                            {status === "published" && (
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span>
                            )}
                            {status === "draft" && (
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5"></span>
                            )}
                            <span className="capitalize">{status}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4 text-heading font-semibold text-xs">{updatedDate}</td>
                        <td
                          className="py-3.5 pr-4 pl-3 text-right"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ActionMenu
                            items={[
                              {
                                label: "Edit",
                                icon: <Edit className="w-3.5 h-3.5 text-muted" />,
                                onClick: () => window.location.href = `/admin/blogs/${blog.id}/edit`,
                              },
                              {
                                label: "View Preview",
                                icon: <Eye className="w-3.5 h-3.5 text-muted" />,
                                onClick: () => setDrawerPost(blog),
                              },
                              {
                                label: "Delete",
                                icon: <Trash2 className="w-3.5 h-3.5" />,
                                variant: "danger" as const,
                                onClick: () => deleteSinglePost(blog.id!),
                              },
                            ]}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Right Column: Analytics & Health (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Activity / Traffic Card */}
          <div className="bg-background rounded-2xl border border-border shadow-[0_2px_12px_rgba(0,0,0,0.02)] p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-heading">Weekly Engagement</h3>
                <p className="text-xs text-muted">Page views performance</p>
              </div>
              <span className="text-xs font-semibold text-primary bg-primary-light px-2 py-0.5 rounded-md">
                +18.4%
              </span>
            </div>

            {/* Micro Bar Chart */}
            <div className="h-40 flex items-end gap-2.5 pt-4 mb-3">
              {[
                { day: "M", val: 42 },
                { day: "T", val: 68 },
                { day: "W", val: 52 },
                { day: "T", val: 88 },
                { day: "F", val: 72 },
                { day: "S", val: 94 },
                { day: "S", val: 100, active: true },
              ].map((item, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                  <div
                    className={`w-full rounded-md transition-all duration-300 ${
                      item.active
                        ? "bg-primary shadow-sm shadow-primary/40"
                        : "bg-primary-light group-hover:bg-primary/50"
                    }`}
                    style={{ height: `${item.val}%` }}
                  />
                  <span
                    className={`text-[11px] font-medium ${
                      item.active ? "text-primary font-bold" : "text-muted"
                    }`}
                  >
                    {item.day}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* System Health Status */}
          <div className="bg-background rounded-2xl border border-border shadow-[0_2px_12px_rgba(0,0,0,0.02)] p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-heading flex items-center gap-2">
                <Activity size={16} className="text-primary" />
                Infrastructure Health
              </h3>
              <span className="inline-flex items-center gap-1.5 text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                All Live
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-surface-alt border border-border/80">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-white border border-border text-primary">
                    <Server size={14} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-heading">NestJS Backend</p>
                    <p className="text-[10px] text-muted">Port 3001 • REST API</p>
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-emerald-600">Online</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-surface-alt border border-border/80">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-white border border-border text-primary">
                    <Database size={14} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-heading">Primary Database</p>
                    <p className="text-[10px] text-muted">PostgreSQL • Pool active</p>
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-emerald-600">Connected</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick View Drawer */}
      <BlogQuickViewDrawer
        post={drawerPost}
        onClose={() => setDrawerPost(null)}
      />
    </main>
  );
}