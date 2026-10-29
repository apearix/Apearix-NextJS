"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Package,
  Sparkles,
  ChevronDown,
  Loader2,
  ArrowLeft,
  DollarSign,
  Barcode,
  Layers,
} from "lucide-react";
import { toast } from "sonner";
import { updateProductSchema, type UpdateProductInput } from "@/schemas/product.schema";
import { update, fetchProductCategories, uploadProductImage } from "@/lib/services/admin/products";
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

export default function EditProductClient({ product }: { product: any }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [autoSlug, setAutoSlug] = useState(!product.is_manual_slug);
  const [imageUrl, setImageUrl] = useState(product.image_or_thumbnail || product.featured_image || "");
  const [categories, setCategories] = useState<{ id: string; name: string; slug: string }[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const initialCategoryId = product.category_id || product.category?.id || "";

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm<UpdateProductInput>({
    resolver: zodResolver(updateProductSchema),
    defaultValues: {
      id: String(product.id),
      name: product.name || product.title || "",
      slug: product.slug || "",
      is_manual_slug: Boolean(product.is_manual_slug),
      category_id: initialCategoryId,
      price: product.price !== undefined ? Number(product.price) : 0,
      compare_at_price:
        product.compare_at_price !== undefined && product.compare_at_price !== null
          ? Number(product.compare_at_price)
          : null,
      sku: product.sku || "",
      stock: product.stock !== undefined ? Number(product.stock) : 0,
      image_or_thumbnail: imageUrl,
      description: product.description || "",
      order: product.order !== undefined ? Number(product.order) : 0,
      is_active: product.is_active !== undefined ? Boolean(product.is_active) : true,
      seo: {
        meta_title: product.seo?.meta_title || "",
        meta_description: product.seo?.meta_description || "",
        canonical_url: product.seo?.canonical_url || "",
      },
    },
  });

  const watchedName = watch("name");
  const watchedSlug = watch("slug");
  const watchedMetaTitle = watch("seo.meta_title");
  const watchedMetaDesc = watch("seo.meta_description");
  const watchedCanonical = watch("seo.canonical_url");

  useEffect(() => {
    fetchProductCategories()
      .then((cats) => setCategories(cats))
      .catch((err) => console.error(err))
      .finally(() => setLoadingCategories(false));
  }, []);

  // Name -> Slug auto sync
  useEffect(() => {
    if (autoSlug && watchedName) {
      const generated = generateSlug(watchedName);
      setValue("slug", generated, { shouldValidate: true });
    }
  }, [watchedName, autoSlug, setValue]);

  const onSubmit: SubmitHandler<UpdateProductInput> = async (data) => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      await update(String(product.id), {
        ...data,
        is_manual_slug: !autoSlug,
        image_or_thumbnail: imageUrl,
      });

      toast.success("Product updated successfully!");
      setTimeout(() => {
        router.push("/admin/products");
      }, 1000);
    } catch (error: any) {
      console.error("Product Update Error:", error);
      toast.error(error?.message || "Failed to update product.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onInvalid = (invalidErrors: any) => {
    console.error("Form Validation Errors:", invalidErrors);
    const firstKey = Object.keys(invalidErrors)[0];
    const firstMsg =
      invalidErrors[firstKey]?.message ||
      invalidErrors[firstKey]?.name?.message ||
      invalidErrors[firstKey]?.price?.message ||
      "Please correct the highlighted form errors.";
    toast.error(`Validation Error: ${firstMsg}`);
  };

  return (
    <main className="max-w-7xl mx-auto pb-16">
      <PageHeader
        title="Edit Product"
        subtitle={`Editing "${product.name || "Product"}"`}
        btn={
          <div className="flex items-center gap-2">
            <Link
              href="/admin/products"
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-surface hover:bg-surface-alt border border-border text-heading text-sm font-semibold rounded-lg transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-muted" /> Back to Products
            </Link>
            <button
              type="submit"
              form="product-edit-form"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-hover disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg shadow-sm shadow-primary/20 transition-all active:scale-[0.98] cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>Save Changes</span>
              )}
            </button>
          </div>
        }
      />

      <form
        id="product-edit-form"
        onSubmit={handleSubmit(onSubmit, onInvalid)}
        className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* Left Column (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* General Information */}
          <SectionCard
            title="Product Information"
            subtitle="Core product name, URL slug, and brand identity."
          >
            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-heading mb-1.5">
                  Product Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Enterprise Security Suite"
                  {...register("name")}
                  className={`w-full px-3.5 py-2.5 rounded-lg border ${
                    errors.name ? "border-rose-500 ring-1 ring-rose-500/20" : "border-border"
                  } bg-white text-sm text-heading placeholder:text-muted focus:outline-none focus:border-primary transition-all`}
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-rose-500">{errors.name.message}</p>
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
                      if (next && watchedName) {
                        setValue("slug", generateSlug(watchedName), { shouldValidate: true });
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
                    /products/
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
            </div>
          </SectionCard>

          {/* Pricing & Inventory */}
          <SectionCard
            title="Pricing & Inventory"
            subtitle="Manage product pricing, discounts, SKU and stock counts."
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Regular Price */}
              <div>
                <label className="block text-sm font-medium text-heading mb-1.5">
                  Regular Price ($) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted text-sm">$</span>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="99.00"
                    {...register("price")}
                    className={`w-full pl-8 pr-3.5 py-2.5 rounded-lg border ${
                      errors.price ? "border-rose-500 ring-1 ring-rose-500/20" : "border-border"
                    } bg-white text-sm text-heading focus:outline-none focus:border-primary transition-all`}
                  />
                </div>
                {errors.price && (
                  <p className="mt-1 text-xs text-rose-500">{errors.price.message}</p>
                )}
              </div>

              {/* Compare at price */}
              <div>
                <label className="block text-sm font-medium text-heading mb-1.5">
                  Compare-at Price ($)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted text-sm">$</span>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="129.00"
                    {...register("compare_at_price")}
                    className="w-full pl-8 pr-3.5 py-2.5 rounded-lg border border-border bg-white text-sm text-heading focus:outline-none focus:border-primary transition-all"
                  />
                </div>
              </div>

              {/* SKU */}
              <div>
                <label className="block text-sm font-medium text-heading mb-1.5">
                  SKU / Code
                </label>
                <div className="relative">
                  <Barcode className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="APX-PROD-001"
                    {...register("sku")}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-lg border border-border bg-white text-sm text-heading font-mono focus:outline-none focus:border-primary transition-all"
                  />
                </div>
              </div>

              {/* Stock */}
              <div>
                <label className="block text-sm font-medium text-heading mb-1.5">
                  Stock Quantity
                </label>
                <div className="relative">
                  <Layers className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="number"
                    placeholder="100"
                    {...register("stock")}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-lg border border-border bg-white text-sm text-heading focus:outline-none focus:border-primary transition-all"
                  />
                </div>
              </div>
            </div>
          </SectionCard>

          {/* Description Editor */}
          <SectionCard
            title="Product Description"
            subtitle="Comprehensive specifications, details, and feature highlights."
          >
            <div>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <TiptapEditor
                    content={field.value || ""}
                    onChange={field.onChange}
                    placeholder="Write detailed product descriptions, features, and specs..."
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
              title: watchedName,
              slug: watchedSlug,
              meta_title: watchedMetaTitle,
              meta_description: watchedMetaDesc,
              canonical_url: watchedCanonical,
            }}
            urlPrefix="products/"
            fieldNamePrefix="seo."
          />
        </div>

        {/* Right Column (1 Col) */}
        <div className="space-y-6">
          {/* Status & Category Card */}
          <SectionCard title="Publishing & Category">
            <div className="space-y-4">
              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-heading mb-1.5">
                  Product Category
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
                  <span className="text-xs text-muted">Visible in catalog when active</span>
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

          {/* Product Image Card */}
          <SectionCard
            title="Product Image"
            subtitle="Upload main product thumbnail or catalog photo."
          >
            <div>
              <ImageUpload
                value={imageUrl}
                onChange={async (newUrl, file) => {
                  if (file) {
                    try {
                      const res = await uploadProductImage(file);
                      setImageUrl(res.url);
                      setValue("image_or_thumbnail", res.url);
                    } catch (e) {
                      setImageUrl(newUrl);
                      setValue("image_or_thumbnail", newUrl);
                    }
                  } else {
                    setImageUrl(newUrl);
                    setValue("image_or_thumbnail", newUrl);
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
