"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Sparkles,
  Info,
  Calendar,
  ChevronDown, 
  Plus,
} from "lucide-react";
import { blogFormSchema, BlogFormValues } from "../blog";
import TiptapEditor from "@/components/common/text-editor/TiptapEditor";
import SEOSection from "@/components/admin/common/SEOSection";
import { SectionCard } from "@/components/admin/common/SectionCard";
import { ImageUpload } from "@/components/admin/common/ImageUpload";
import { PageHeader } from "@/components/admin/common/PageHeader";

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
  const [autoSlug, setAutoSlug] = useState(true);
  const [imageUrl, setImageUrl] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors, isDirty },
  } = useForm<BlogFormValues>({
    resolver: zodResolver(blogFormSchema),
    defaultValues: {
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      featured_image: "",
      status: "draft",
      author_id: 1,
      published_at: "",
      meta_title: "",
      meta_description: "",
      canonical_url: "",
    },
  });

  const watchedTitle = watch("title");
  const watchedSlug = watch("slug");
  const watchedFeaturedImage = watch("featured_image");
  const watchedMetaTitle = watch("meta_title");
  const watchedMetaDesc = watch("meta_description");

  const appBaseUrl =
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  useEffect(() => {
    if (autoSlug && watchedTitle) {
      setValue("slug", generateSlug(watchedTitle), { shouldValidate: true });
    }
  }, [watchedTitle, autoSlug, setValue]);

  const onSubmit = async (data: BlogFormValues) => {
    try {
      setIsSubmitting(true);
      console.log("Submitting Blog Data:", data);
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
    <main>
      <PageHeader
        title="Create Blogs"
        subtitle="Draft, optimize SEO, and publish a new article on Apearix."
        btn={
          <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary-hover text-white text-sm font-semibold rounded-lg shadow-sm shadow-primary/20 transition-all active:scale-[0.98]">
         <Plus className="w-4 h-4" />
          Create Blog
        </button>
        }
      />

      <form id="blog-create-form" onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-6 lg:grid-cols-12">

        {/* Left Column: Core Content (8 Cols) */}
        <section className="space-y-6 lg:col-span-8">
          <SectionCard title="General Information" icon={Info}>
            {/* Title */}
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
                className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all"
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

            {/* Slug */}
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
                <span className="text-xs text-[var(--color-muted)] select-none">
                  {appBaseUrl.replace(/^https?:\/\//, "")}/blog/
                </span>
                <input
                  id="slug"
                  type="text"
                  maxLength={220}
                  {...register("slug")}
                  onChange={(e) => {
                    setAutoSlug(false);
                    register("slug").onChange(e);
                  }}
                  className="w-full bg-transparent py-2 px-0 text-xs text-[var(--color-heading)] focus:outline-none! outline-0! border-none!"
                />
              </div>
              {errors.slug && <p className="mt-1 text-xs text-red-500">{errors.slug.message}</p>}
            </div>

            {/* Excerpt */}
            <div>
              <label htmlFor="excerpt" className="block text-sm font-medium text-[var(--color-heading)] mb-1">
                Excerpt / Summary
              </label>
              <textarea
                id="excerpt"
                rows={4}
                placeholder="Brief description for cards and listings..."
                {...register("excerpt")}
                className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2 text-sm text-[var(--color-heading)] placeholder:text-[var(--color-muted)] focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]"
              />
              <p className="mt-1 text-xs text-[var(--color-muted)]">Optional brief summary shown on index listings.</p>
            </div>
            {/* Content Editor */}
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
          </SectionCard>


          {/* Reusable Independent SEO Section */}
          <SEOSection<BlogFormValues>
            register={register}
            errors={errors}
            baseDomain={appBaseUrl}
            urlPrefix="blog/"
            watchedValues={{
              meta_title: watchedMetaTitle,
              meta_description: watchedMetaDesc,
              slug: watchedSlug,
              title: watchedTitle,
            }}
          />
        </section>

        {/* Right Column: Meta & Featured Image (4 Cols) */}
        <aside className="space-y-6 lg:col-span-4">
          <SectionCard title="Publishing Details" icon={Calendar}>

            <div>
              <label className="block">Status</label>
              <div className="relative">
                <select
                  {...register("status")}
                  className="w-full appearance-none"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
                {/* Chevron Icon */}
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-[var(--color-heading)] opacity-60">
                  <ChevronDown className="h-4 w-4" />
                </div>
              </div>
            </div>

            <div>
              <label className="block">
                Publish Date & Time
              </label>
              <input
                type="datetime-local"
                {...register("published_at")}
              />
              <p className="mt-1 text-[11px] text-[var(--color-muted)]">
                Future timestamp rakhein schedule karne k liye.
              </p>
            </div>

            <div>
              <label className="block">Author</label>
              <div className="relative">

                <select
                  {...register("author_id", { valueAsNumber: true })}
                  className="w-full appearance-none"
                >
                  <option value={1}>Dharmendra (Admin)</option>
                  <option value={2}>Editorial Team</option>
                </select>
                {/* Chevron Icon */}
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-[var(--color-heading)] opacity-60">
                  <ChevronDown className="h-4 w-4" />
                </div>
              </div>
            </div>
          </SectionCard>
          <SectionCard title="Featured Image" icon={Sparkles}>
            <ImageUpload
              value={imageUrl}
              onChange={(url) => setImageUrl(url)}
              maxSizeMB={5}
            />
          </SectionCard>

        </aside>
      </form>
    </main>
  );
}