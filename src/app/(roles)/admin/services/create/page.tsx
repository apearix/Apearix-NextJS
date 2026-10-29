"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Layers,
  Sparkles,
  ChevronDown,
  Loader2,
  ArrowLeft,
  Layout,
  Code,
  Shield,
  Cpu,
  Smartphone,
  Cloud,
  Database,
  Zap,
  Server,
} from "lucide-react";
import { toast } from "sonner";
import { createServiceSchema, type CreateServiceInput } from "@/schemas/service.schema";
import { store, fetchServiceCategories, uploadServiceImage } from "@/lib/services/admin/services";
import TiptapEditor from "@/components/common/text-editor/TiptapEditor";
import SEOSection from "@/components/admin/common/SEOSection";
import { SectionCard } from "@/components/admin/common/SectionCard";
import { ImageUpload } from "@/components/admin/common/ImageUpload";
import { PageHeader } from "@/components/admin/common/PageHeader";

function generateSlug(text: string): string {
  let slug = text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .slice(0, 220);

  while (slug.startsWith("-")) slug = slug.slice(1);
  while (slug.endsWith("-")) slug = slug.slice(0, -1);
  return slug;
}

const COMMON_ICONS = [
  "layout",
  "code",
  "shield",
  "cpu",
  "smartphone",
  "cloud",
  "database",
  "zap",
  "sparkles",
  "server",
];

export default function CreateServicePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [autoSlug, setAutoSlug] = useState(true);
  const [imageUrl, setImageUrl] = useState("");
  const [categories, setCategories] = useState<{ id: string; name: string; slug: string }[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm<CreateServiceInput>({
    resolver: zodResolver(createServiceSchema),
    defaultValues: {
      title: "",
      slug: "",
      is_manual_slug: false,
      category_id: "",
      icon: "layout",
      featured_image: "",
      excerpt: "",
      description: "",
      order: 0,
      is_active: true,
      seo: {
        meta_title: "",
        meta_description: "",
        canonical_url: "",
      },
    },
  });

  const watchedTitle = watch("title");
  const watchedSlug = watch("slug");
  const watchedIcon = watch("icon");
  const watchedMetaTitle = watch("seo.meta_title");
  const watchedMetaDesc = watch("seo.meta_description");
  const watchedCanonical = watch("seo.canonical_url");

  useEffect(() => {
    fetchServiceCategories()
      .then((cats) => {
        setCategories(cats);
        if (cats.length > 0) {
          setValue("category_id", cats[0].id);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoadingCategories(false));
  }, [setValue]);

  // Title -> Slug auto sync
  useEffect(() => {
    if (autoSlug && watchedTitle) {
      const generated = generateSlug(watchedTitle);
      setValue("slug", generated, { shouldValidate: true });
    }
  }, [watchedTitle, autoSlug, setValue]);

  const onSubmit: SubmitHandler<CreateServiceInput> = async (data) => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      await store({
        ...data,
        is_manual_slug: !autoSlug,
        featured_image: imageUrl,
      });

      toast.success("Service created successfully!");
      setTimeout(() => {
        router.push("/admin/services");
      }, 1000);
    } catch (error: any) {
      console.error("Service Store Error:", error);
      toast.error(error?.message || "Failed to create service.");
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
      invalidErrors[firstKey]?.slug?.message ||
      "Please review the highlighted fields.";
    toast.error(`Validation Error: ${firstMsg}`);
  };

  return (
    <main className="max-w-7xl mx-auto pb-16">
      <PageHeader
        title="Create Service"
        subtitle="Add a new service offering to your agency catalog."
        btn={
          <div className="flex items-center gap-2">
            <Link
              href="/admin/services"
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-surface hover:bg-surface-alt border border-border text-heading text-sm font-semibold rounded-lg transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-muted" /> Back to Services
            </Link>
            <button
              type="submit"
              form="service-create-form"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-hover disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg shadow-sm shadow-primary/20 transition-all active:scale-[0.98] cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating...</span>
                </>
              ) : (
                <span>Publish Service</span>
              )}
            </button>
          </div>
        }
      />

      <form
        id="service-create-form"
        onSubmit={handleSubmit(onSubmit, onInvalid)}
        className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* Left Column (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* General Information */}
          <SectionCard
            title="Service Information"
            subtitle="Core service details, display titles, and URL configuration."
          >
            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-heading mb-1.5">
                  Service Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. AI Automation & Workflow Engineering"
                  {...register("title")}
                  className={`w-full px-3.5 py-2.5 rounded-lg border ${
                    errors.title ? "border-rose-500 ring-1 ring-rose-500/20" : "border-border"
                  } bg-white text-sm text-heading placeholder:text-muted focus:outline-none focus:border-primary transition-all`}
                />
                {errors.title && (
                  <p className="mt-1 text-xs text-rose-500">{errors.title.message}</p>
                )}
              </div>

              {/* Slug */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-sm font-medium text-heading">
                    Slug <span className="text-rose-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const next = !autoSlug;
                      setAutoSlug(next);
                      if (next && watchedTitle) {
                        setValue("slug", generateSlug(watchedTitle), { shouldValidate: true });
                      }
                    }}
                    className="text-xs text-primary hover:underline flex items-center gap-1 font-medium cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3" />
                    {autoSlug ? "Manual Slug" : "Auto-generate"}
                  </button>
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-muted font-mono select-none">
                    /services/
                  </span>
                  <input
                    type="text"
                    {...register("slug")}
                    disabled={autoSlug}
                    className={`w-full pl-22 pr-3.5 py-2.5 rounded-lg border ${
                      errors.slug ? "border-rose-500 ring-1 ring-rose-500/20" : "border-border"
                    } ${
                      autoSlug ? "bg-surface text-muted cursor-not-allowed" : "bg-white text-heading"
                    } font-mono text-xs focus:outline-none focus:border-primary transition-all`}
                  />
                </div>
                {errors.slug && (
                  <p className="mt-1 text-xs text-rose-500">{errors.slug.message}</p>
                )}
              </div>

              {/* Short Excerpt */}
              <div>
                <label className="block text-sm font-medium text-heading mb-1.5">
                  Short Excerpt / Summary
                </label>
                <textarea
                  rows={3}
                  placeholder="A concise summary of what this service offers..."
                  {...register("excerpt")}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-white text-sm text-heading placeholder:text-muted focus:outline-none focus:border-primary transition-all resize-y"
                />
              </div>
            </div>
          </SectionCard>

          {/* Description Editor */}
          <SectionCard
            title="Service Description & Details"
            subtitle="Provide rich formatted content, features, and scope of work."
          >
            <div>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <TiptapEditor
                    content={field.value || ""}
                    onChange={field.onChange}
                    placeholder="Describe the full scope, deliverables, and architecture..."
                  />
                )}
              />
            </div>
          </SectionCard>

          {/* SEO Section */}
          <SEOSection
            register={register}
            errors={errors}
            watchedValues={{
              title: watchedTitle,
              slug: watchedSlug,
              meta_title: watchedMetaTitle,
              meta_description: watchedMetaDesc,
              canonical_url: watchedCanonical,
            }}
            urlPrefix="services/"
            fieldNamePrefix="seo."
          />
        </div>

        {/* Right Column (1 Col) */}
        <div className="space-y-6">
          {/* Status & Category Card */}
          <SectionCard title="Publishing & Organization">
            <div className="space-y-4">
              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-heading mb-1.5">
                  Category
                </label>
                <div className="relative">
                  <select
                    {...register("category_id")}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-white text-sm text-heading appearance-none focus:outline-none focus:border-primary transition-all pr-9 cursor-pointer"
                  >
                    <option value="">Select Category (Optional)</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-muted absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Icon Selector / Input */}
              <div>
                <label className="block text-sm font-medium text-heading mb-1.5">
                  Icon Identifier
                </label>
                <input
                  type="text"
                  placeholder="e.g. layout, code, shield, cpu"
                  {...register("icon")}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-white text-sm text-heading placeholder:text-muted focus:outline-none focus:border-primary transition-all"
                />
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {COMMON_ICONS.map((ic) => (
                    <button
                      key={ic}
                      type="button"
                      onClick={() => setValue("icon", ic)}
                      className={`text-[11px] px-2 py-0.5 rounded-md border transition-colors cursor-pointer ${
                        watchedIcon === ic
                          ? "bg-primary-light border-border-accent text-primary font-semibold"
                          : "bg-surface border-border text-muted hover:text-heading"
                      }`}
                    >
                      {ic}
                    </button>
                  ))}
                </div>
              </div>

              {/* Display Order */}
              <div>
                <label className="block text-sm font-medium text-heading mb-1.5">
                  Display Order
                </label>
                <input
                  type="number"
                  {...register("order")}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-white text-sm text-heading focus:outline-none focus:border-primary transition-all"
                />
              </div>

              {/* Active Toggle Switch */}
              <div className="pt-3 border-t border-border flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium text-heading block">Status Active</span>
                  <span className="text-xs text-muted">Visible on site when active</span>
                </div>
                <Controller
                  name="is_active"
                  control={control}
                  render={({ field }) => (
                    <button
                      type="button"
                      role="switch"
                      aria-checked={field.value}
                      onClick={() => field.onChange(!field.value)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        field.value ? "bg-primary" : "bg-slate-300"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                          field.value ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  )}
                />
              </div>
            </div>
          </SectionCard>

          {/* Featured Image Card */}
          <SectionCard
            title="Featured Media"
            subtitle="Upload or select an illustrative image for this service."
          >
            <div>
              <ImageUpload
                value={imageUrl}
                onChange={async (newUrl, file) => {
                  if (file) {
                    try {
                      const res = await uploadServiceImage(file);
                      setImageUrl(res.url);
                      setValue("featured_image", res.url);
                    } catch (e) {
                      setImageUrl(newUrl);
                      setValue("featured_image", newUrl);
                    }
                  } else {
                    setImageUrl(newUrl);
                    setValue("featured_image", newUrl);
                  }
                }}
              />
            </div>
          </SectionCard>
        </div>
      </form>
    </main>
  );
}
