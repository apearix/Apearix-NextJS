"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Info, ShieldCheck, ChevronDown, Plus, Loader2, Sparkles, UserCheck } from "lucide-react";
import { toast } from "sonner";
import { createUserSchema, type CreateUserInput } from "@/schemas/user.schema";
import { store, uploadAvatar, fetchRoles } from "@/lib/services/admin/users";
import { SectionCard } from "@/components/admin/common/SectionCard";
import { ImageUpload } from "@/components/admin/common/ImageUpload";
import { PageHeader } from "@/components/admin/common/PageHeader";

export default function CreateUserPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [roles, setRoles] = useState<{ id: string; name: string }[]>([]);
  const [isLoadingRoles, setIsLoadingRoles] = useState(true);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateUserInput>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      password: "",
      avatar: "",
      dob: "",
      status: "active",
      role_id: "",
    },
  });

  useEffect(() => {
    async function loadRoles() {
      try {
        setIsLoadingRoles(true);
        const data = await fetchRoles();
        setRoles(data);
        if (data.length > 0) {
          setValue("role_id", data[0].id, { shouldValidate: true });
        }
      } catch (err) {
        console.error("Error loading roles:", err);
      } finally {
        setIsLoadingRoles(false);
      }
    }
    loadRoles();
  }, [setValue]);

  const handleAvatarChange = async (url: string, file?: File) => {
    if (file) {
      try {
        setIsUploadingImage(true);
        const res = await uploadAvatar(file);
        setAvatarUrl(res.url);
        setValue("avatar", res.url, { shouldValidate: true });
        toast.success("Avatar image uploaded successfully!");
      } catch (err: any) {
        console.error("Avatar upload error:", err);
        toast.error(err?.message || "Failed to upload avatar image.");
      } finally {
        setIsUploadingImage(false);
      }
    } else {
      setAvatarUrl(url);
      setValue("avatar", url, { shouldValidate: true });
    }
  };

  const onSubmit: SubmitHandler<CreateUserInput> = async (data) => {
    if (isSubmitting || isUploadingImage) return;

    try {
      setIsSubmitting(true);
      await store(data);
      toast.success("User successfully created!");
      setTimeout(() => {
        router.push("/admin/users");
      }, 1000);
    } catch (error: any) {
      console.error("User Store Error:", error);
      toast.error(error?.message || "Failed to create user.");
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
        title="Create User"
        subtitle="Add a new user account, assign access role and configure status."
        btn={
          <button
            type="submit"
            form="user-create-form"
            disabled={isSubmitting || isUploadingImage}
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
                <span>Create User</span>
              </>
            )}
          </button>
        }
      />

      <form
        id="user-create-form"
        noValidate
        onSubmit={handleSubmit(onSubmit, onInvalid)}
        className="grid grid-cols-1 gap-6 lg:grid-cols-12"
      >
        {/* Left Column: Personal Information (8 Cols) */}
        <section className="space-y-6 lg:col-span-8">
          <SectionCard title="Personal Information" icon={Info}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* First Name */}
              <div>
                <label htmlFor="first_name" className="block text-heading text-xs font-semibold mb-1">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="first_name"
                  type="text"
                  placeholder="John"
                  maxLength={50}
                  {...register("first_name")}
                />
                {errors.first_name && (
                  <p className="mt-1 text-xs text-red-500">{errors.first_name.message}</p>
                )}
              </div>

              {/* Last Name */}
              <div>
                <label htmlFor="last_name" className="block text-heading text-xs font-semibold mb-1">
                  Last Name
                </label>
                <input
                  id="last_name"
                  type="text"
                  placeholder="Doe"
                  maxLength={50}
                  {...register("last_name")}
                />
                {errors.last_name && (
                  <p className="mt-1 text-xs text-red-500">{errors.last_name.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-heading text-xs font-semibold mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="john.doe@example.com"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-heading text-xs font-semibold mb-1">
                  Phone Number
                </label>
                <input
                  id="phone"
                  type="text"
                  placeholder="+919876543210"
                  {...register("phone")}
                />
                {errors.phone && (
                  <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-heading text-xs font-semibold mb-1">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  {...register("password")}
                />
                {errors.password ? (
                  <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
                ) : (
                  <p className="mt-1 text-[11px] text-muted">Minimum 8 characters required</p>
                )}
              </div>

              {/* Date of Birth */}
              <div>
                <label htmlFor="dob" className="block text-heading text-xs font-semibold mb-1">
                  Date of Birth
                </label>
                <input
                  id="dob"
                  type="date"
                  {...register("dob")}
                />
                {errors.dob && (
                  <p className="mt-1 text-xs text-red-500">{errors.dob.message}</p>
                )}
              </div>
            </div>
          </SectionCard>
        </section>

        {/* Right Column: Role, Status & Avatar (4 Cols) */}
        <aside className="space-y-6 lg:col-span-4">
          <SectionCard title="Role & Account Status" icon={ShieldCheck}>
            {/* Role Select */}
            <div>
              <label htmlFor="role_id" className="block text-heading text-xs font-semibold mb-1">
                Role <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                {isLoadingRoles ? (
                  <div className="flex items-center gap-2 p-2.5 bg-surface border border-border rounded-lg text-xs text-muted">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> Loading roles...
                  </div>
                ) : (
                  <select
                    id="role_id"
                    {...register("role_id")}
                    className="w-full appearance-none"
                  >
                    {roles.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                )}
                {!isLoadingRoles && (
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-heading opacity-60">
                    <ChevronDown className="h-4 w-4" />
                  </div>
                )}
              </div>
              {errors.role_id && (
                <p className="mt-1 text-xs text-red-500">{errors.role_id.message}</p>
              )}
            </div>

            {/* Status Select */}
            <div>
              <label htmlFor="status" className="block text-heading text-xs font-semibold mb-1">
                Account Status
              </label>
              <div className="relative">
                <select
                  id="status"
                  {...register("status")}
                  className="w-full appearance-none"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                  <option value="blocked">Blocked</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-heading opacity-60">
                  <ChevronDown className="h-4 w-4" />
                </div>
              </div>
              {errors.status && (
                <p className="mt-1 text-xs text-red-500">{errors.status.message}</p>
              )}
            </div>
          </SectionCard>

          <SectionCard title="Avatar Image" icon={Sparkles}>
            <div className="relative">
              {isUploadingImage && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70 backdrop-blur-xs rounded-xl">
                  <Loader2 className="w-5 h-5 animate-spin text-primary" />
                </div>
              )}
              <ImageUpload
                value={avatarUrl}
                onChange={handleAvatarChange}
                maxSizeMB={5}
              />
            </div>
          </SectionCard>
        </aside>
      </form>
    </main>
  );
}
