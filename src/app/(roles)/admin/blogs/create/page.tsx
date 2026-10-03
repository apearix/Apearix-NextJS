"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Sparkles,
  Info,
  Calendar,
  ChevronDown,
  Plus,
} from "lucide-react";
import { toast } from "sonner";
import {
  createBlogSchema,
  type CreateBlogInput,
} from "@/schemas/blog.schema";
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

export default function CreateBlogPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [autoSlug, setAutoSlug] = useState(true);
  const [imageUrl, setImageUrl] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm<CreateBlogInput>({
    resolver: zodResolver(createBlogSchema) as any,
    defaultValues: {
      title: "",
      slug: "",
      is_manual_slug: false,
      excerpt: "",
      content: "",
      featured_image: "",
      status: "draft",
      author_id: "1",
      published_at: "",
      meta_title: "",
      meta_description: "",
      canonical_url: "",
    },
  });

  const watchedTitle = watch("title");
  const watchedSlug = watch("slug");
  const watchedMetaTitle = watch("meta_title");
  const watchedMetaDesc = watch("meta_description");

  const appBaseUrl =
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  useEffect(() => {
    if (autoSlug && watchedTitle) {
      setValue("slug", generateSlug(watchedTitle), { shouldValidate: true });
    }
  }, [watchedTitle, autoSlug, setValue]);

  const onSubmit: SubmitHandler<CreateBlogInput> = async (data) => {
    try {
      setIsSubmitting(true);
      console.log("Submitting Blog Data:", data);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("Blog post successfully created!");
      setTimeout(() => {
        router.push("/admin/blogs");
      }, 1200);

    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Blog post save karne me error aaya.");
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
          <button
            type="submit"
            form="blog-create-form"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary-hover text-white text-sm font-semibold rounded-lg shadow-sm shadow-primary/20 transition-all active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            {isSubmitting ? "Creating..." : "Create Blog"}
          </button>
        }
      />

      <form
        id="blog-create-form"
        onSubmit={handleSubmit(onSubmit)}
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
                    setValue("is_manual_slug", !nextAuto, { shouldDirty: true });
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
                  className="w-full bg-transparent py-2 px-0 text-xs text-heading focus:outline-none! outline-0! border-none!"
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
                  {...register("status")}
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

            <div>
              <label htmlFor="published_at" className="block">
                Publish Date & Time
              </label>
              <input
                type="datetime-local"
                id="published_at"
                {...register("published_at")}
              />
              <p className="mt-1 text-[11px] text-muted">
                Future timestamp rakhein schedule karne k liye.
              </p>
            </div>

            <div>
              <label htmlFor="author_id" className="block">
                Author
              </label>
              <div className="relative">
                <select
                  id="author_id"
                  {...register("author_id")}
                  className="w-full appearance-none"
                >
                  <option value="1">Dharmendra (Admin)</option>
                  <option value="2">Editorial Team</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-heading opacity-60">
                  <ChevronDown className="h-4 w-4" />
                </div>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Featured Image" icon={Sparkles}>
            <ImageUpload
              value={imageUrl}
              onChange={(url) => {
                setImageUrl(url);
                setValue("featured_image", url, { shouldValidate: true });
              }}
              maxSizeMB={5}
            />
          </SectionCard>
        </aside>
      </form>
    </main>
  );
}