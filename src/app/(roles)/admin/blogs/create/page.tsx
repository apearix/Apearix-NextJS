"use client";

import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  ArrowLeft, 
  UploadCloud, 
  Image as ImageIcon, 
  Sparkles, 
  Eye, 
  Save, 
  Send, 
  HelpCircle,
  Calendar,
  Globe,
  CheckCircle2,
  Trash2
} from "lucide-react";
import Link from "next/link";
import { blogFormSchema, BlogFormValues } from "@/types/blog";

// Slug generator helper
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 220);
}

export default function CreateBlogPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write");
  const [autoSlug, setAutoSlug] = useState(true);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors, isDirty }
  } = useForm<BlogFormValues>({
    resolver: zodResolver(blogFormSchema),
    defaultValues: {
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      featured_image: "",
      status: "draft",
      author_id: 1, // Default logged-in user ID
      published_at: "",
      meta_title: "",
      meta_description: "",
      canonical_url: "",
    },
  });

  const watchedTitle = watch("title");
  const watchedSlug = watch("slug");
  const watchedContent = watch("content");
  const watchedFeaturedImage = watch("featured_image");
  const watchedMetaTitle = watch("meta_title");
  const watchedMetaDesc = watch("meta_description");
  const watchedStatus = watch("status");

  // Title change hone par slug sync
  useEffect(() => {
    if (autoSlug && watchedTitle) {
      setValue("slug", generateSlug(watchedTitle), { shouldValidate: true });
    }
  }, [watchedTitle, autoSlug, setValue]);

  const onSubmit = async (data: BlogFormValues) => {
    try {
      setIsSubmitting(true);
      console.log("Submitting Blog Data:", data);

      // API Call Example:
      // const res = await fetch("/api/blogs", { method: "POST", body: JSON.stringify(data) });
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert("Blog post successfully created!");
    } catch (error) {
      console.error(error);
      alert("Blog post save karne me error aaya.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-surface)] pb-24 text-[var(--color-body)]">
      {/* Top Floating / Sticky Header */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-background)]/90 px-6 py-4 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/blogs"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--color-border)] text-[var(--color-muted)] hover:bg-[var(--color-surface-alt)] hover:text-[var(--color-heading)] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-lg font-semibold text-[var(--color-heading)]">Create New Article</h1>
            <p className="text-xs text-[var(--color-muted)]">
              {isDirty ? "Unsaved changes" : "Draft saved to memory"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setValue("status", "draft")}
            className="hidden sm:inline-flex items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2 text-sm font-medium text-[var(--color-heading)] shadow-sm hover:bg-[var(--color-surface-alt)] transition-colors"
          >
            <Save className="h-4 w-4 text-[var(--color-muted)]" />
            Save Draft
          </button>

          <button
            type="submit"
            form="blog-create-form"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-primary)] px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[var(--color-primary-hover)] active:scale-95 transition-all disabled:opacity-60"
          >
            <Send className="h-4 w-4" />
            {isSubmitting ? "Publishing..." : "Publish Post"}
          </button>
        </div>
      </header>

      {/* Main Content Form */}
      <main className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        <form id="blog-create-form" onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          
          {/* Left Column: Core Content (8 Cols) */}
          <section className="space-y-6 lg:col-span-8">
            
            {/* Title & Slug Card */}
            <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] p-6 shadow-xs">
              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-[var(--color-heading)] mb-1">
                    Post Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="title"
                    type="text"
                    placeholder="Enter an engaging title..."
                    maxLength={200}
                    {...register("title")}
                    className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2.5 text-base font-medium text-[var(--color-heading)] placeholder:text-[var(--color-muted)] focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all"
                  />
                  <div className="mt-1 flex items-center justify-between text-xs">
                    {errors.title ? (
                      <span className="text-red-500">{errors.title.message}</span>
                    ) : (
                      <span className="text-[var(--color-muted)]">Max 200 characters</span>
                    )}
                    <span className="text-[var(--color-muted)]">{watchedTitle?.length || 0}/200</span>
                  </div>
                </div>

                {/* Slug Input */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor="slug" className="block text-sm font-medium text-[var(--color-heading)]">
                      URL Slug <span className="text-red-500">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setAutoSlug(!autoSlug)}
                      className="text-xs text-[var(--color-primary)] hover:underline flex items-center gap-1"
                    >
                      <Sparkles className="h-3 w-3" />
                      {autoSlug ? "Manual Slug" : "Auto Slug"}
                    </button>
                  </div>
                  <div className="flex items-center rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-3 focus-within:border-[var(--color-primary)] focus-within:bg-[var(--color-background)]">
                    <span className="text-xs text-[var(--color-muted)] select-none">domain.com/blog/</span>
                    <input
                      id="slug"
                      type="text"
                      maxLength={220}
                      {...register("slug")}
                      onChange={(e) => {
                        setAutoSlug(false);
                        register("slug").onChange(e);
                      }}
                      className="w-full bg-transparent py-2 text-sm text-[var(--color-heading)] focus:outline-none"
                    />
                  </div>
                  {errors.slug && <p className="mt-1 text-xs text-red-500">{errors.slug.message}</p>}
                </div>

                {/* Short Excerpt */}
                <div>
                  <label htmlFor="excerpt" className="block text-sm font-medium text-[var(--color-heading)] mb-1">
                    Excerpt / Summary
                  </label>
                  <textarea
                    id="excerpt"
                    rows={2}
                    placeholder="Brief description for cards and listings..."
                    {...register("excerpt")}
                    className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2 text-sm text-[var(--color-heading)] placeholder:text-[var(--color-muted)] focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]"
                  />
                  <p className="mt-1 text-xs text-[var(--color-muted)]">Optional brief summary shown on index listings.</p>
                </div>
              </div>
            </div>

            {/* Content Editor Card */}
            <div className="space-y-2">
                <label className="block text-sm font-medium text-[var(--color-heading)]">
                    Article Content <span className="text-red-500">*</span>
                </label>

                <Controller
                    name="content"
                    control={control}
                    render={({ field }) => (
                        <TiptapEditor
                            content={field.value}
                            onChange={field.onChange}
                            error={errors.content?.message}
                        />
                    )}
                />
            </div>
            
            {/* SEO Optimization Settings Card */}
            <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] p-6 shadow-xs">
              <div className="flex items-center gap-2 mb-4">
                <Globe className="h-5 w-5 text-[var(--color-primary)]" />
                <h2 className="text-base font-semibold text-[var(--color-heading)]">Search Engine Optimization (SEO)</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="meta_title" className="block text-sm font-medium text-[var(--color-heading)] mb-1">
                    Meta Title
                  </label>
                  <input
                    id="meta_title"
                    type="text"
                    maxLength={60}
                    placeholder={watchedTitle || "Default page title will be used"}
                    {...register("meta_title")}
                    className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2 text-sm text-[var(--color-heading)] focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]"
                  />
                  <div className="mt-1 flex justify-between text-xs text-[var(--color-muted)]">
                    <span>Target: 50-60 characters</span>
                    <span>{watchedMetaTitle?.length || 0}/60</span>
                  </div>
                </div>

                <div>
                  <label htmlFor="meta_description" className="block text-sm font-medium text-[var(--color-heading)] mb-1">
                    Meta Description
                  </label>
                  <textarea
                    id="meta_description"
                    rows={3}
                    maxLength={160}
                    placeholder="Brief description that displays in search engine results..."
                    {...register("meta_description")}
                    className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2 text-sm text-[var(--color-heading)] focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]"
                  />
                  <div className="mt-1 flex justify-between text-xs text-[var(--color-muted)]">
                    <span>Target: 150-160 characters</span>
                    <span>{watchedMetaDesc?.length || 0}/160</span>
                  </div>
                </div>

                <div>
                  <label htmlFor="canonical_url" className="block text-sm font-medium text-[var(--color-heading)] mb-1">
                    Canonical URL
                  </label>
                  <input
                    id="canonical_url"
                    type="url"
                    placeholder="https://yourdomain.com/original-article"
                    {...register("canonical_url")}
                    className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2 text-sm text-[var(--color-heading)] focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]"
                  />
                </div>

                {/* Google Search Result Preview */}
                <div className="mt-4 rounded-lg bg-[var(--color-surface-alt)] p-4 border border-[var(--color-border-subtle)]">
                  <p className="text-xs font-semibold text-[var(--color-muted)] mb-2 uppercase tracking-wide">
                    Google Search Preview
                  </p>
                  <p className="text-xs text-blue-700 truncate">
                    https://yourdomain.com/blog/{watchedSlug || "your-slug"}
                  </p>
                  <h3 className="text-base font-medium text-blue-800 hover:underline cursor-pointer truncate">
                    {watchedMetaTitle || watchedTitle || "Your Blog Post Title"}
                  </h3>
                  <p className="text-xs text-[var(--color-muted)] line-clamp-2 mt-0.5">
                    {watchedMetaDesc || "Add a meta description to see how this post will look in search engines."}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Right Column: Meta, Publishing & Featured Image (4 Cols) */}
          <aside className="space-y-6 lg:col-span-4">
            
            {/* Publishing Settings */}
            <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] p-6 shadow-xs space-y-5">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-heading)]">
                Publishing Details
              </h2>

              {/* Status Select */}
              <div>
                <label className="block text-xs font-medium text-[var(--color-heading)] mb-1">Status</label>
                <select
                  {...register("status")}
                  className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-sm text-[var(--color-heading)] focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              {/* Publish Date/Schedule */}
              <div>
                <label className="block text-xs font-medium text-[var(--color-heading)] mb-1">
                  Publish Date & Time
                </label>
                <div className="relative">
                  <input
                    type="datetime-local"
                    {...register("published_at")}
                    className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-xs text-[var(--color-heading)] focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]"
                  />
                </div>
                <p className="mt-1 text-[11px] text-[var(--color-muted)]">
                  Future timestamp rakhein schedule karne k liye.
                </p>
              </div>

              {/* Author Selector */}
              <div>
                <label className="block text-xs font-medium text-[var(--color-heading)] mb-1">Author</label>
                <select
                  {...register("author_id", { valueAsNumber: true })}
                  className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-sm text-[var(--color-heading)] focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]"
                >
                  <option value={1}>Dharmendra (Admin)</option>
                  <option value={2}>Editorial Team</option>
                </select>
              </div>
            </div>

            {/* Featured Image Upload Card */}
            <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] p-6 shadow-xs space-y-4">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-heading)]">
                Featured Image
              </h2>

              {watchedFeaturedImage ? (
                <div className="relative rounded-lg overflow-hidden border border-[var(--color-border)] group">
                  <img
                    src={watchedFeaturedImage}
                    alt="Featured preview"
                    className="h-44 w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setValue("featured_image", "")}
                    className="absolute top-2 right-2 rounded-md bg-white/90 p-1.5 text-red-600 shadow-sm backdrop-blur-xs hover:bg-white transition-all"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-[var(--color-border)] bg-[var(--color-surface-alt)] p-6 text-center hover:border-[var(--color-primary)] transition-colors">
                  <div className="rounded-full bg-[var(--color-primary-light)] p-3 text-[var(--color-primary)] mb-3">
                    <ImageIcon className="h-6 w-6" />
                  </div>
                  <p className="text-xs font-medium text-[var(--color-heading)]">Add cover image URL below</p>
                  <p className="text-[11px] text-[var(--color-muted)] mt-1">PNG, JPG, WebP up to 5MB</p>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-[var(--color-heading)] mb-1">Image URL</label>
                <input
                  type="url"
                  placeholder="https://example.com/cover.jpg"
                  {...register("featured_image")}
                  className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-xs text-[var(--color-heading)] focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]"
                />
                {errors.featured_image && (
                  <p className="mt-1 text-xs text-red-500">{errors.featured_image.message}</p>
                )}
              </div>
            </div>

          </aside>
        </form>
      </main>
    </div>
  );
}