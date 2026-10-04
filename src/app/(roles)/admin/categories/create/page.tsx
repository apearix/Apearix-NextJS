"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Folder, ChevronDown, Plus, Loader2, Settings, Globe } from "lucide-react";
import { toast } from "sonner";
import { createCategorySchema, type CreateCategoryInput } from "@/schemas/category.schema";
import { store, fetchCategoryTypes } from "@/lib/services/admin/categories";
import { SectionCard } from "@/components/admin/common/SectionCard";
import { PageHeader } from "@/components/admin/common/PageHeader";

export default function CreateCategoryPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categoryTypes, setCategoryTypes] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    fetchCategoryTypes().then(setCategoryTypes).catch(console.error);
  }, []);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CreateCategoryInput>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      icon_or_image: "",
      order: 0,
      is_active: true,
      category_type_id: "",
      meta_title: "",
      meta_description: "",
    },
  });

  const watchedName = watch("name");

  const onSubmit: SubmitHandler<CreateCategoryInput> = async (data) => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      await store(data);
      toast.success("Category successfully created!");
      setTimeout(() => {
        router.push("/admin/category");
      }, 1000);
    } catch (error: any) {
      console.error("Category Store Error:", error);
      toast.error(error?.message || "Failed to create Category.");
      setIsSubmitting(false);
    }
  };

  const onInvalid = (invalidErrors: any) => {
    console.error("Form Validation Errors:", invalidErrors);
    const firstKey = Object.keys(invalidErrors)[0];
    const firstMsg =
      invalidErrors[firstKey]?.message ||
      "Form validation error. Please review the highlighted fields.";
    toast.error(`Validation Error: ${firstMsg}`);
  };

  return (
    <main>
      <PageHeader
        title="Create Category"
        subtitle="Add a new category with description, icon, and SEO parameters."
        btn={
          <button
            type="submit"
            form="category-create-form"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary-hover disabled:opacity-60 disabled:cursor-not-allowed disabled:pointer-events-none text-white text-sm font-semibold rounded-lg shadow-sm shadow-primary/20 transition-all active:scale-[0.98] cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Creating...</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>Create Category</span>
              </>
            )}
          </button>
        }
      />

      <form
        id="category-create-form"
        noValidate
        onSubmit={handleSubmit(onSubmit, onInvalid)}
        className="grid grid-cols-1 gap-6 lg:grid-cols-12"
      >
        {/* Left Column: General & SEO Info (8 Cols) */}
        <section className="space-y-6 lg:col-span-8">
          <SectionCard title="General Information" icon={Folder}>
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-heading text-xs font-semibold mb-1">
                Category Name <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                type="text"
                placeholder="e.g. Web Development"
                maxLength={150}
                {...register("name")}
              />
              <div className="mt-1 flex items-center justify-between text-xs">
                {errors.name ? (
                  <span className="text-red-500">{errors.name.message}</span>
                ) : (
                  <span className="text-muted">Max 150 characters</span>
                )}
                <span className="text-muted">{watchedName?.length || 0}/150</span>
              </div>
            </div>

            {/* Slug */}
            <div>
              <label htmlFor="slug" className="block text-heading text-xs font-semibold mb-1">
                Slug (Optional)
              </label>
              <input
                id="slug"
                type="text"
                placeholder="e.g. web-development (auto-generated if empty)"
                maxLength={160}
                {...register("slug")}
              />
              {errors.slug && (
                <p className="mt-1 text-xs text-red-500">{errors.slug.message}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-heading text-xs font-semibold mb-1">
                Description
              </label>
              <textarea
                id="description"
                rows={4}
                placeholder="Write a short summary about this category..."
                {...register("description")}
                className="w-full p-3 text-xs border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              />
              {errors.description && (
                <p className="mt-1 text-xs text-red-500">{errors.description.message}</p>
              )}
            </div>

            {/* Icon or Image URL */}
            <div>
              <label htmlFor="icon_or_image" className="block text-heading text-xs font-semibold mb-1">
                Icon or Image URL
              </label>
              <input
                id="icon_or_image"
                type="text"
                placeholder="https://example.com/icon.png or /icons/web.svg"
                {...register("icon_or_image")}
              />
              {errors.icon_or_image && (
                <p className="mt-1 text-xs text-red-500">{errors.icon_or_image.message}</p>
              )}
            </div>
          </SectionCard>

          {/* SEO Metadata */}
          <SectionCard title="SEO Optimization" icon={Globe}>
            <div>
              <label htmlFor="meta_title" className="block text-heading text-xs font-semibold mb-1">
                Meta Title
              </label>
              <input
                id="meta_title"
                type="text"
                placeholder="Meta title for search engines..."
                maxLength={100}
                {...register("meta_title")}
              />
            </div>

            <div>
              <label htmlFor="meta_description" className="block text-heading text-xs font-semibold mb-1">
                Meta Description
              </label>
              <textarea
                id="meta_description"
                rows={3}
                placeholder="Meta description for search engines..."
                maxLength={255}
                {...register("meta_description")}
                className="w-full p-3 text-xs border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              />
            </div>
          </SectionCard>
        </section>

        {/* Right Column: Settings & Type (4 Cols) */}
        <aside className="space-y-6 lg:col-span-4">
          <SectionCard title="Category Settings" icon={Settings}>
            {/* Category Type */}
            {categoryTypes.length > 0 && (
              <div>
                <label htmlFor="category_type_id" className="block text-heading text-xs font-semibold mb-1">
                  Category Type
                </label>
                <div className="relative">
                  <select
                    id="category_type_id"
                    className="w-full appearance-none"
                    {...register("category_type_id")}
                  >
                    <option value="">Select Category Type...</option>
                    {categoryTypes.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-heading opacity-60">
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </div>
                {errors.category_type_id && (
                  <p className="mt-1 text-xs text-red-500">{errors.category_type_id.message}</p>
                )}
              </div>
            )}

            {/* Display Order */}
            <div>
              <label htmlFor="order" className="block text-heading text-xs font-semibold mb-1">
                Display Order
              </label>
              <input
                id="order"
                type="number"
                min={0}
                placeholder="0"
                {...register("order", { valueAsNumber: true })}
              />
              {errors.order && (
                <p className="mt-1 text-xs text-red-500">{errors.order.message}</p>
              )}
            </div>

            {/* Status Select */}
            <div>
              <label htmlFor="is_active" className="block text-heading text-xs font-semibold mb-1">
                Status
              </label>
              <div className="relative">
                <select
                  id="is_active"
                  className="w-full appearance-none"
                  onChange={(e) => {
                    const isActive = e.target.value === "true";
                    register("is_active").onChange({
                      target: { name: "is_active", value: isActive },
                    });
                  }}
                  defaultValue="true"
                >
                  <option value="true">Active (Visible)</option>
                  <option value="false">Inactive (Hidden)</option>
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
