"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { HelpCircle, ChevronDown, Plus, Loader2, Settings } from "lucide-react";
import { toast } from "sonner";
import { updateFaqSchema, type UpdateFaqInput } from "@/schemas/faq.schema";
import { update } from "@/lib/services/admin/faqs";
import TiptapEditor from "@/components/common/text-editor/TiptapEditor";
import { SectionCard } from "@/components/admin/common/SectionCard";
import { PageHeader } from "@/components/admin/common/PageHeader";

export default function EditFaqClient({ faq }: { faq: any }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialIsActive = faq.is_active !== undefined ? Boolean(faq.is_active) : true;

  const {
    register,
    handleSubmit,
    watch,
    control,
    setValue,
    formState: { errors },
  } = useForm<UpdateFaqInput>({
    resolver: zodResolver(updateFaqSchema),
    defaultValues: {
      id: String(faq.id),
      question: faq.question || faq.title || "",
      answer: faq.answer || faq.description || "",
      category: faq.category || "general",
      order: faq.order !== undefined ? Number(faq.order) : 0,
      is_active: initialIsActive,
    },
  });

  const watchedQuestion = watch("question");

  const onSubmit: SubmitHandler<UpdateFaqInput> = async (data) => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      await update(String(faq.id), data);
      toast.success("FAQ successfully updated!");
      setTimeout(() => {
        router.push("/admin/faqs");
      }, 1000);
    } catch (error: any) {
      console.error("FAQ Update Error:", error);
      toast.error(error?.message || "Failed to update FAQ.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onInvalid = (invalidErrors: any) => {
    console.error("Form Validation Errors:", invalidErrors);
    const firstKey = Object.keys(invalidErrors)[0];
    const firstMsg =
      invalidErrors[firstKey]?.message ||
      invalidErrors[firstKey]?.question?.message ||
      invalidErrors[firstKey]?.answer?.message ||
      "Form validation error. Please review the highlighted fields.";
    toast.error(`Validation Error: ${firstMsg}`);
  };

  return (
    <main>
      <PageHeader
        title="Edit FAQ"
        subtitle="Modify existing FAQ question, answer details and category."
        btn={
          <button
            type="submit"
            form="faq-edit-form"
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
                <span>Update FAQ</span>
              </>
            )}
          </button>
        }
      />

      <form
        id="faq-edit-form"
        noValidate
        onSubmit={handleSubmit(onSubmit, onInvalid)}
        className="grid grid-cols-1 gap-6 lg:grid-cols-12"
      >
        {/* Left Column: Core Question & Answer (8 Cols) */}
        <section className="space-y-6 lg:col-span-8">
          <SectionCard title="General Information" icon={HelpCircle}>
            {/* Question */}
            <div>
              <label htmlFor="question" className="block text-heading text-xs font-semibold mb-1">
                Question <span className="text-red-500">*</span>
              </label>
              <input
                id="question"
                type="text"
                placeholder="e.g. How do I reset my password?"
                maxLength={300}
                {...register("question")}
              />
              <div className="mt-1 flex items-center justify-between text-xs">
                {errors.question ? (
                  <span className="text-red-500">{errors.question.message}</span>
                ) : (
                  <span className="text-muted">Max 300 characters</span>
                )}
                <span className="text-muted">{watchedQuestion?.length || 0}/300</span>
              </div>
            </div>

            {/* Answer Editor */}
            <div className="space-y-2">
              <label htmlFor="answer" className="block text-heading text-xs font-semibold">
                Answer Details <span className="text-red-500">*</span>
              </label>
              <Controller
                name="answer"
                control={control}
                render={({ field }) => (
                  <TiptapEditor
                    content={field.value || ""}
                    onChange={field.onChange}
                    error={errors.answer?.message}
                  />
                )}
              />
            </div>
          </SectionCard>
        </section>

        {/* Right Column: Settings, Category & Order (4 Cols) */}
        <aside className="space-y-6 lg:col-span-4">
          <SectionCard title="FAQ Settings" icon={Settings}>
            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-heading text-xs font-semibold mb-1">
                Category
              </label>
              <div className="relative">
                <input
                  id="category"
                  type="text"
                  placeholder="general, billing, account..."
                  maxLength={50}
                  {...register("category")}
                />
              </div>
              {errors.category && (
                <p className="mt-1 text-xs text-red-500">{errors.category.message}</p>
              )}
            </div>

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
                  defaultValue={initialIsActive ? "true" : "false"}
                  onChange={(e) => {
                    const isActive = e.target.value === "true";
                    setValue("is_active", isActive, { shouldValidate: true });
                  }}
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
