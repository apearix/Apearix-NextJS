"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FolderTree, ChevronDown, Plus, Loader2, Settings } from "lucide-react";
import { toast } from "sonner";
import { createCategoryTypeSchema, type CreateCategoryTypeInput } from "@/schemas/category-type.schema";
import { store } from "@/lib/services/admin/category-types";
import { SectionCard } from "@/components/admin/common/SectionCard";
import { PageHeader } from "@/components/admin/common/PageHeader";

export default function CreateCategoryTypePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CreateCategoryTypeInput>({
    resolver: zodResolver(createCategoryTypeSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      is_active: true,
    },
  });

  const watchedName = watch("name");

  const onSubmit: SubmitHandler<CreateCategoryTypeInput> = async (data) => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      await store(data);
      toast.success("Category Type successfully created!");
      setTimeout(() => {
        router.push("/admin/category-types");
      }, 1000);
    } catch (error: any) {
      console.error("CategoryType Store Error:", error);
      toast.error(error?.message || "Failed to create Category Type.");
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
        title="Create Category Type"
        subtitle="Add a new classification category type group."
        btn={
          <button
            type="submit"
            form="category-type-create-form"
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
                <span>Create Type</span>
              </>
            )}
          </button>
        }
      />

      <form
        id="category-type-create-form"
        noValidate
        onSubmit={handleSubmit(onSubmit, onInvalid)}
        className="grid grid-cols-1 gap-6 lg:grid-cols-12"
      >
        {/* Left Column: General Info (8 Cols) */}
        <section className="space-y-6 lg:col-span-8">
          <SectionCard title="General Information" icon={FolderTree}>
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-heading text-xs font-semibold mb-1">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                type="text"
                placeholder="e.g. Blog Categories"
                maxLength={100}
                {...register("name")}
              />
              <div className="mt-1 flex items-center justify-between text-xs">
                {errors.name ? (
                  <span className="text-red-500">{errors.name.message}</span>
                ) : (
                  <span className="text-muted">Max 100 characters</span>
                )}
                <span className="text-muted">{watchedName?.length || 0}/100</span>
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
                placeholder="e.g. blog-categories (auto-generated if empty)"
                maxLength={100}
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
                placeholder="Write a short summary about this category type..."
                {...register("description")}
                className="w-full p-3 text-xs border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              />
              {errors.description && (
                <p className="mt-1 text-xs text-red-500">{errors.description.message}</p>
              )}
            </div>
          </SectionCard>
        </section>

        {/* Right Column: Settings (4 Cols) */}
        <aside className="space-y-6 lg:col-span-4">
          <SectionCard title="Type Settings" icon={Settings}>
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
