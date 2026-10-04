"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Sparkles, Info, Calendar, ChevronDown, Plus, Loader2, Globe } from "lucide-react";
import { toast } from "sonner";
import { updatePageSchema, type UpdatePageInput } from "@/schemas/page.schema";
import { update } from "@/lib/services/admin/pages";
import TiptapEditor from "@/components/common/text-editor/TiptapEditor";
import { SectionCard } from "@/components/admin/common/SectionCard";
import { PageHeader } from "@/components/admin/common/PageHeader";

function generateSlug(title: string): string {
  let slug = title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .slice(0, 150);

  while (slug.startsWith("-")) {
    slug = slug.slice(1);
  }
  while (slug.endsWith("-")) {
    slug = slug.slice(0, -1);
  }
  return slug;
}

export default function EditPageClient({ page }: { page: any }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [autoSlug, setAutoSlug] = useState(!page.is_manual_slug);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm<UpdatePageInput>({
    resolver: zodResolver(updatePageSchema),
    defaultValues: {
      id: String(page.id),
      title: page.title || "",
      slug: page.slug || "",
      is_manual_slug: page.is_manual_slug || false,
      content: page.content || "",
      status: page.status || "published",
      meta_title: page.meta_title || "",
      meta_description: page.meta_description || "",
    },
  });

  const watchedTitle = watch("title");
  const appBaseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  useEffect(() => {
    if (autoSlug && watchedTitle) {
      setValue("slug", generateSlug(watchedTitle), { shouldValidate: true });
    }
  }, [watchedTitle, autoSlug, setValue]);

  const onSubmit: SubmitHandler<UpdatePageInput> = async (data) => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      await update(String(page.id), data);
      toast.success("Page successfully updated!");
      setTimeout(() => {
        router.push("/admin/pages");
      }, 1000);
    } catch (error: any) {
      console.error("Page Update Error:", error);
      toast.error(error?.message || "Failed to update page.");
    } finally {
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
      "Form validation error. Please review the highlighted fields.";
    toast.error(`Validation Error: ${firstMsg}`);
  };

  return (
    <main>
      <PageHeader
        title="Edit Page"
        subtitle="Modify existing static page content and SEO configuration."
        btn={
          <button
            type="submit"
            form="page-edit-form"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary-hover disabled:opacity-60 disabled:cursor-not-allowed disabled:pointer-events-none text-white text-sm font-semibold rounded-lg shadow-sm shadow-primary/20 transition-all active:scale-[0.98] cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Updating...</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>Update Page</span>
              </>
            )}
          </button>
        }
      />

      <form
        id="page-edit-form"
        noValidate
        onSubmit={handleSubmit(onSubmit, onInvalid)}
        className="grid grid-cols-1 gap-6 lg:grid-cols-12"
      >
        {/* Left Column: Core Content (8 Cols) */}
        <section className="space-y-6 lg:col-span-8">
          <SectionCard title="General Information" icon={Info}>
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-heading text-xs font-semibold mb-1">
                Page Title <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                type="text"
                placeholder="Enter page title..."
                maxLength={150}
                {...register("title")}
              />
              <div className="mt-1 flex items-center justify-between text-xs">
                {errors.title ? (
                  <span className="text-red-500">{errors.title.message}</span>
                ) : (
                  <span className="text-muted">Max 150 characters</span>
                )}
                <span className="text-muted">{watchedTitle?.length || 0}/150</span>
              </div>
            </div>

            {/* Slug */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="slug" className="block text-heading text-xs font-semibold">
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
                  className="text-xs text-primary hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className="h-3 w-3" />
                  {autoSlug ? "Manual Slug" : "Auto Slug"}
                </button>
              </div>

              <div className="flex items-center rounded-lg border border-border bg-surface-alt px-3 focus-within:border-primary focus-within:bg-background">
                <span className="text-xs text-muted select-none">
                  {appBaseUrl.replace(/^https?:\/\//, "")}/
                </span>
                <input
                  id="slug"
                  type="text"
                  maxLength={150}
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

            {/* Content Editor */}
            <div className="space-y-2">
              <label htmlFor="content" className="block text-heading text-xs font-semibold">
                Page Content <span className="text-red-500">*</span>
              </label>
              <Controller
                name="content"
                control={control}
                render={({ field }) => (
                  <TiptapEditor
                    content={field.value || ""}
                    onChange={field.onChange}
                    error={errors.content?.message}
                  />
                )}
              />
            </div>
          </SectionCard>

          {/* SEO Section */}
          <SectionCard title="SEO Metadata" icon={Globe}>
            <div>
              <label htmlFor="meta_title" className="block text-heading text-xs font-semibold mb-1">
                Meta Title
              </label>
              <input
                id="meta_title"
                type="text"
                placeholder="SEO meta title..."
                maxLength={100}
                {...register("meta_title")}
              />
              {errors.meta_title && (
                <p className="mt-1 text-xs text-red-500">{errors.meta_title.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="meta_description" className="block text-heading text-xs font-semibold mb-1">
                Meta Description
              </label>
              <textarea
                id="meta_description"
                rows={3}
                placeholder="Brief SEO meta description..."
                maxLength={255}
                {...register("meta_description")}
              />
              {errors.meta_description && (
                <p className="mt-1 text-xs text-red-500">{errors.meta_description.message}</p>
              )}
            </div>
          </SectionCard>
        </section>

        {/* Right Column: Publishing Details (4 Cols) */}
        <aside className="space-y-6 lg:col-span-4">
          <SectionCard title="Publishing Details" icon={Calendar}>
            <div>
              <label htmlFor="status" className="block text-heading text-xs font-semibold mb-1">
                Status
              </label>
              <div className="relative">
                <select
                  id="status"
                  {...register("status")}
                  className="w-full appearance-none"
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-heading opacity-60">
                  <ChevronDown className="h-4 w-4" />
                </div>
              </div>
            </div>
          </SectionCard>
        </aside>
      </form>
    </main>
  );
}
