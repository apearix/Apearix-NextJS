"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Info, Sparkles, Plus, Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { updateRoleSchema, type UpdateRoleInput } from "@/schemas/role.schema";
import { update } from "@/lib/services/admin/roles";
import { SectionCard } from "@/components/admin/common/SectionCard";
import { PageHeader } from "@/components/admin/common/PageHeader";

function generateSlug(name: string): string {
  let slug = name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .slice(0, 50);

  while (slug.startsWith("-")) {
    slug = slug.slice(1);
  }
  while (slug.endsWith("-")) {
    slug = slug.slice(0, -1);
  }
  return slug;
}

export default function EditRoleClient({ role }: { role: any }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [autoSlug, setAutoSlug] = useState(!role.is_manual_slug);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<UpdateRoleInput>({
    resolver: zodResolver(updateRoleSchema),
    defaultValues: {
      id: String(role.id),
      name: role.name || "",
      slug: role.slug || "",
      is_manual_slug: role.is_manual_slug || false,
      description: role.description || "",
    },
  });

  const watchedName = watch("name");

  useEffect(() => {
    if (autoSlug && watchedName) {
      setValue("slug", generateSlug(watchedName), { shouldValidate: true });
    }
  }, [watchedName, autoSlug, setValue]);

  const onSubmit: SubmitHandler<UpdateRoleInput> = async (data) => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      await update(String(role.id), data);
      toast.success("Role successfully updated!");
      setTimeout(() => {
        router.push("/admin/roles");
      }, 1000);
    } catch (error: any) {
      console.error("Role Update Error:", error);
      toast.error(error?.message || "Failed to update role.");
    } finally {
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
        title="Edit Role"
        subtitle="Modify existing user role details and description."
        btn={
          <button
            type="submit"
            form="role-edit-form"
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
                <span>Update Role</span>
              </>
            )}
          </button>
        }
      />

      <form
        id="role-edit-form"
        noValidate
        onSubmit={handleSubmit(onSubmit, onInvalid)}
        className="max-w-4xl space-y-6"
      >
        <SectionCard title="Role Information" icon={ShieldCheck}>
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-heading text-xs font-semibold mb-1">
              Role Name <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              type="text"
              placeholder="e.g. Content Manager"
              maxLength={50}
              {...register("name")}
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
            )}
          </div>

          {/* Slug */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="slug" className="block text-heading text-xs font-semibold">
                Identifier Slug
              </label>
              <button
                type="button"
                onClick={() => {
                  const nextAuto = !autoSlug;
                  setAutoSlug(nextAuto);
                  setValue("is_manual_slug", !nextAuto);
                  if (nextAuto && watchedName) {
                    setValue("slug", generateSlug(watchedName), { shouldValidate: true });
                  }
                }}
                className="text-xs text-primary hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="h-3 w-3" />
                {autoSlug ? "Manual Slug" : "Auto Slug"}
              </button>
            </div>

            <input
              id="slug"
              type="text"
              placeholder="content-manager"
              maxLength={50}
              {...register("slug")}
              onChange={(e) => {
                setAutoSlug(false);
                setValue("is_manual_slug", true);
                void register("slug").onChange(e);
              }}
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
              placeholder="Brief description of the permissions and duties for this role..."
              maxLength={255}
              {...register("description")}
            />
            <p className="mt-1 text-xs text-muted">
              Optional description of capabilities assigned to this role.
            </p>
          </div>
        </SectionCard>
      </form>
    </main>
  );
}
