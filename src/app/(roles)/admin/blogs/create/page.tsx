"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Sparkles, Info, Calendar, ChevronDown, Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createBlogSchema, type CreateBlogInput } from "@/schemas/blog.schema";
import { store, uploadImage, fetchBlogCategories, fetchBlogAuthors } from "@/lib/services/admin/blogs";
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

// Asia/Kolkata timezone support ke sath current datetime-local string
function getCurrentDateTimeLocal(): string {
  if (typeof formatForDateTimeLocalInput === "function") {
    return formatForDateTimeLocalInput(new Date());
  }

  const now = new Date();
  const options: Intl.DateTimeFormatOptions = {
    timeZone: process.env.NEXT_PUBLIC_TIMEZONE || "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  };
  const parts = new Intl.DateTimeFormat("en-GB", options).formatToParts(now);
  const find = (type: string) => parts.find((p) => p.type === type)?.value || "00";
  return `${find("year")}-${find("month")}-${find("day")}T${find("hour")}:${find("minute")}`;
}

export default function CreateBlogPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [autoSlug, setAutoSlug] = useState(true);
  const [imageUrl, setImageUrl] = useState("");
  const [currentMinDateTime, setCurrentMinDateTime] = useState<string>(() => getCurrentDateTimeLocal());
  const [categories, setCategories] = useState<{ id: string; name: string; slug: string }[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [authors, setAuthors] = useState<{ id: string; name: string }[]>([]);

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
      title: "",
      slug: "",
      is_manual_slug: false,
      excerpt: "",
      content: "",
      featured_image: "",
      publishing: {
        status: "draft",
        author_id: "1",
        category_id: "",
        published_at: currentMinDateTime,
      },
      seo: {
        meta_title: "",
        meta_description: "",
        canonical_url: "",
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
        setAuthors(auths);
        if (auths.length > 0) {
          setValue("publishing.author_id", auths[0].id);
        }
      })
      .catch((err) => console.error(err));
  }, [setValue]);

  useEffect(() => {
    const interval = setInterval(() => {
      const nowTime = getCurrentDateTimeLocal();
      setCurrentMinDateTime(nowTime);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

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

    const freshCurrentMin = getCurrentDateTimeLocal();
    if (data.publishing?.published_at && data.publishing.published_at < freshCurrentMin) {
      toast.error("Past time allow nahi hai. Kripya current ya future time select karein.");
      setValue("publishing.published_at", freshCurrentMin, { shouldValidate: true });
      return;
    }

    try {
      setIsSubmitting(true);
      await store(data);
      toast.success("Blog post successfully created!");
      setTimeout(() => {
        router.push("/admin/blogs");
      }, 1000);
    } catch (error: any) {
      console.error("Submission error:", error);
      toast.error(error?.message || "Blog post save karne me error aaya.");
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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Enter") return;

      const activeEl = document.activeElement as HTMLElement | null;

      if (
        activeEl?.tagName === "TEXTAREA" ||
        activeEl?.isContentEditable ||
        activeEl?.closest(".ProseMirror") ||
        e.shiftKey
      ) {
        return;
      }

      if (isSubmitting || isUploadingImage) return;

      e.preventDefault();
      handleSubmit(onSubmit, onInvalid)();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleSubmit, onSubmit, onInvalid, isSubmitting, isUploadingImage]);

  return (
    <main>
      <PageHeader
        title="Create Blogs"
        subtitle="Draft, optimize SEO, and publish a new article on Apearix."
        btn={
          <button
            type="submit"
            form="blog-create-form"
            disabled={isSubmitting || isUploadingImage}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary-hover disabled:opacity-60 disabled:cursor-not-allowed disabled:pointer-events-none text-white text-sm font-semibold rounded-lg shadow-sm shadow-primary/20 transition-all active:scale-[0.98]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Creating...</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>Create Blog</span>
              </>
            )}
          </button>
        }
      />

      <form
        id="blog-create-form"
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
                onChange={(e) => {
                  const val = e.target.value;
                  const nowLocal = getCurrentDateTimeLocal();
                  if (val && val < nowLocal) {
                    toast.error("Past time select nahi kar sakte. Current time set kar diya gaya hai.");
                    setValue("publishing.published_at", nowLocal, { shouldValidate: true });
                    return;
                  }
                  register("publishing.published_at").onChange(e);
                }}
              />
              <p className="mt-1 text-[11px] text-muted">
                Sirf current ya future time select kar sakte hain (Timezone: {process.env.NEXT_PUBLIC_TIMEZONE || "Asia/Kolkata"}).
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
