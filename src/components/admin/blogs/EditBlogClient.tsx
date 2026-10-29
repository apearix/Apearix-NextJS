"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Sparkles, Info, Calendar, ChevronDown, Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createBlogSchema, type CreateBlogInput } from "@/schemas/blog.schema";
import { update, uploadImage, fetchBlogCategories, fetchBlogAuthors, getAuthorName } from "@/lib/services/admin/blogs";
import { formatForDateTimeLocalInput } from "@/lib/timezone";
import TiptapEditor from "@/components/common/text-editor/TiptapEditor";
import SEOSection from "@/components/admin/common/SEOSection";
import { SectionCard } from "@/components/admin/common/SectionCard";
import { ImageUpload } from "@/components/admin/common/ImageUpload";
import { PageHeader } from "@/components/admin/common/PageHeader";

function generateSlug(title: string): string {
  let slug = title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .slice(0, 220);

  while (slug.startsWith("-")) {
    slug = slug.slice(1);
  }
  while (slug.endsWith("-")) {
    slug = slug.slice(0, -1);
  }
  return slug;
}

function getCurrentDateTimeLocal(): string {
  return formatForDateTimeLocalInput(new Date());
}

export default function EditBlogClient({ blog }: { blog: any }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [autoSlug, setAutoSlug] = useState(!blog.is_manual_slug);
  const [imageUrl, setImageUrl] = useState(blog.featured_image || "");
  const [categories, setCategories] = useState<{ id: string; name: string; slug: string }[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [authors, setAuthors] = useState<{ id: string; name: string }[]>([]);
  const currentMinDateTime = getCurrentDateTimeLocal();

  const initialCategoryId = blog.category_id || blog.publishing?.category_id || blog.category?.id || "";

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm<CreateBlogInput>({
    resolver: zodResolver(createBlogSchema),
    defaultValues: {
      title: blog.title || "",
      slug: blog.slug || "",
      is_manual_slug: blog.is_manual_slug || false,
      excerpt: blog.excerpt || "",
      content: blog.content || "",
      featured_image: blog.featured_image || "",
      publishing: {
        status: blog.publishing?.status || "draft",
        author_id: blog.publishing?.author_id || "1",
        category_id: initialCategoryId,
        published_at: blog.publishing?.published_at ? formatForDateTimeLocalInput(blog.publishing.published_at) : "",
      },
      seo: {
        meta_title: blog.seo?.meta_title || "",
        meta_description: blog.seo?.meta_description || "",
        canonical_url: blog.seo?.canonical_url || "",
      },
    },
  });

  const watchedTitle = watch("title");
  const watchedSlug = watch("slug");
  const watchedMetaTitle = watch("seo.meta_title");
  const watchedMetaDesc = watch("seo.meta_description");

  const appBaseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  useEffect(() => {
    fetchBlogCategories()
      .then((cats) => setCategories(cats))
      .catch((err) => console.error(err))
      .finally(() => setLoadingCategories(false));

    fetchBlogAuthors()
      .then((auths) => {
        const currentAuthorId = blog.publishing?.author_id || blog.author_id || blog.author?.id;
        const currentAuthorName = getAuthorName(currentAuthorId, blog.author, blog.author_name);
        if (currentAuthorId && !auths.some((a) => a.id === currentAuthorId)) {
          setAuthors([{ id: currentAuthorId, name: currentAuthorName }, ...auths]);
        } else {
          setAuthors(auths);
        }
      })
      .catch((err) => console.error(err));
  }, [blog]);

  useEffect(() => {
    if (autoSlug && watchedTitle) {
      setValue("slug", generateSlug(watchedTitle), { shouldValidate: true });
    }
  }, [watchedTitle, autoSlug, setValue]);

  const handleImageChange = async (url: string, file?: File) => {
    if (file) {
      try {
        setIsUploadingImage(true);
        const res = await uploadImage(file);
        setImageUrl(res.url);
        setValue("featured_image", res.url, { shouldValidate: true });
        toast.success("Image uploaded to server storage!");
      } catch (err: any) {
        console.error("Image upload error:", err);
        toast.error(err?.message || "Image upload karne me error aaya.");
      } finally {
        setIsUploadingImage(false);
      }
    } else {
      setImageUrl(url);
      setValue("featured_image", url, { shouldValidate: true });
    }
  };

  const onSubmit: SubmitHandler<CreateBlogInput> = async (data) => {
    if (isSubmitting || isUploadingImage) return;

    try {
      setIsSubmitting(true);
      await update(String(blog.id), { ...data, id: String(blog.id) });
      toast.success("Blog post successfully updated!");
      setTimeout(() => {
        router.push("/admin/blogs");
      }, 1000);
    } catch (error: any) {
      console.error("Update error:", error);
      toast.error(error?.message || "Blog update karne me error aaya.");
      setIsSubmitting(false);
    }
  };

  const onInvalid = (invalidErrors: any) => {
    console.error("Form Validation Errors:", invalidErrors);
    const firstKey = Object.keys(invalidErrors)[0];
    const firstMsg =
      invalidErrors[firstKey]?.message ||
      invalidErrors[firstKey]?.title?.message ||
      invalidErrors[firstKey]?.content?.message ||
      "Form me validation errors hain. Kripya sabhi zaroori fields ko bharein.";
    toast.error(`Validation Error: ${firstMsg}`);
  };

  return (
    <main>
      <PageHeader
        title="Edit Blog"
        subtitle="Update article content, metadata, or status."
        btn={
          <button
            type="submit"
            form="blog-edit-form"
            disabled={isSubmitting || isUploadingImage}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary-hover disabled:opacity-60 disabled:cursor-not-allowed disabled:pointer-events-none text-white text-sm font-semibold rounded-lg shadow-sm shadow-primary/20 transition-all active:scale-[0.98]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        }
      />

      <form
        id="blog-edit-form"
        noValidate
        onSubmit={handleSubmit(onSubmit, onInvalid)}
        className="grid grid-cols-1 gap-6 lg:grid-cols-12"
      >
        {/* Left Column: Core Content (8 Cols) */}
        <section className="space-y-6 lg:col-span-8">
          <SectionCard title="General Information" icon={Info}>
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-heading">
                Post Title <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                type="text"
                placeholder="Enter an engaging title..."
                maxLength={200}
                {...register("title")}
              />
              <div className="mt-1 flex items-center justify-between text-xs">
                {errors.title ? (
                  <span className="text-red-500">{errors.title.message}</span>
                ) : (
                  <span className="text-muted">Max 200 characters</span>
                )}
                <span className="text-muted">{watchedTitle?.length || 0}/200</span>
              </div>
            </div>

            {/* Slug */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="slug" className="block text-heading">
                  URL Slug <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => {
                    const nextAuto = !autoSlug;
                    setAutoSlug(nextAuto);
                    setValue("is_manual_slug", !nextAuto);
                    if (nextAuto && watchedTitle) {
                      setValue("slug", generateSlug(watchedTitle), { shouldValidate: true });
                    }
                  }}
                  className="text-xs text-primary hover:underline flex items-center gap-1"
                >
                  <Sparkles className="h-3 w-3" />
                  {autoSlug ? "Manual Slug" : "Auto Slug"}
                </button>
              </div>

              <div className="flex items-center rounded-lg border border-border bg-surface-alt px-3 focus-within:border-primary focus-within:bg-background">
                <span className="text-xs text-muted select-none">
                  {appBaseUrl.replace(/^https?:\/\//, "")}/blog/
                </span>
                <input
                  id="slug"
                  type="text"
                  maxLength={220}
                  {...register("slug")}
                  onChange={(e) => {
                    setAutoSlug(false);
                    setValue("is_manual_slug", true);
                    void register("slug").onChange(e);
                  }}
                  className="w-full bg-transparent py-2 px-0 text-xs text-heading focus:outline-none border-none outline-none"
                />
              </div>
              {errors.slug && (
                <p className="mt-1 text-xs text-red-500">{errors.slug.message}</p>
              )}
            </div>

            {/* Excerpt */}
            <div>
              <label htmlFor="excerpt" className="block text-heading">
                Excerpt / Summary
              </label>
              <textarea
                id="excerpt"
                rows={4}
                placeholder="Brief description for cards and listings..."
                {...register("excerpt")}
              />
              <p className="mt-1 text-xs text-muted">
                Optional brief summary shown on index listings.
              </p>
            </div>

            {/* Content Editor */}
            <div className="space-y-2">
              <label htmlFor="content" className="block text-heading">
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
          <SEOSection<CreateBlogInput>
            register={register}
            errors={errors}
            baseDomain={appBaseUrl}
            urlPrefix="blog/"
            fieldNamePrefix="seo."
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
              <label htmlFor="status" className="block">
                Status
              </label>
              <div className="relative">
                <select
                  id="status"
                  {...register("publishing.status")}
                  className="w-full appearance-none"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-heading opacity-60">
                  <ChevronDown className="h-4 w-4" />
                </div>
              </div>
            </div>

            {/* Category Select */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="category_id" className="block">
                  Category
                </label>
                <Link
                  href="/admin/categories/create?type=blogs"
                  className="text-[11px] text-primary hover:underline font-medium"
                  target="_blank"
                >
                  + New Category
                </Link>
              </div>
              <div className="relative">
                <select
                  id="category_id"
                  disabled={loadingCategories}
                  {...register("publishing.category_id")}
                  className="w-full appearance-none pr-8"
                >
                  <option value="">Uncategorized</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-heading opacity-60">
                  <ChevronDown className="h-4 w-4" />
                </div>
              </div>
            </div>

            {/* Publish Date & Time */}
            <div>
              <label htmlFor="published_at" className="block">
                Publish Date & Time
              </label>
              <input
                type="datetime-local"
                id="published_at"
                min={currentMinDateTime}
                {...register("publishing.published_at")}
              />
              <p className="mt-1 text-[11px] text-muted">
                Publishing ke liye current ya future timestamp set rakhein.
              </p>
            </div>

            <div>
              <label htmlFor="author_id" className="block">
                Author
              </label>
              <div className="relative">
                <select
                  id="author_id"
                  {...register("publishing.author_id")}
                  className="w-full appearance-none"
                >
                  {authors.length > 0 ? (
                    authors.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name}
                      </option>
                    ))
                  ) : (
                    <>
                      <option value={blog.publishing?.author_id || "1"}>
                        {getAuthorName(blog.publishing?.author_id, blog.author, blog.author_name)}
                      </option>
                      <option value="1">Dharmendra (Admin)</option>
                      <option value="2">Editorial Team</option>
                    </>
                  )}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-heading opacity-60">
                  <ChevronDown className="h-4 w-4" />
                </div>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Featured Image" icon={Sparkles}>
            <div className="relative">
              {isUploadingImage && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70 backdrop-blur-xs rounded-xl">
                  <Loader2 className="w-5 h-5 animate-spin text-primary" />
                </div>
              )}
              <ImageUpload
                value={imageUrl}
                onChange={handleImageChange}
                maxSizeMB={5}
              />
            </div>
          </SectionCard>
        </aside>
      </form>
    </main>
  );
}
