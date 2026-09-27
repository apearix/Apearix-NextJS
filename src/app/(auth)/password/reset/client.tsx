"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation"; 
import { ADMIN_LOGIN_PATH } from "@/lib/auth/routes";
import Link from "next/link";

import {
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
} from "lucide-react";

export default function ResetPasswordClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get("token") || "";

  // Form States
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  // Feedback States
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!token) {
      setError("Reset link is invalid or missing.");
      setLoading(false);
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          password: newPassword,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Unable to reset password.");
      }

      setStatus(data?.message || "Password reset successfully!");

      // Auto-redirect after success
      setTimeout(() => {
        router.push(ADMIN_LOGIN_PATH);
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-surface-alt px-4 font-geist text-body">
      <div className="w-full max-w-md">
        <div className="bg-background rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-border-subtle overflow-hidden">
          <div className="p-8">
            {/* Logo placeholder */}
            <div className="flex justify-center mb-6 h-12 items-center">
              <h1 className="text-3xl font-bold text-brand-purple">Apearix</h1>
            </div>

            {!status ? (
              <>
                <div className="text-center mb-8">
                  <h3 className="text-xl font-bold text-heading">
                    Set New Password
                  </h3>
                  <p className="text-muted mt-2 text-sm">
                    Enter a new secure password for your account.
                  </p>
                </div>

                {error && (
                  <div className="mb-6 rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600 text-center font-medium flex items-center justify-center gap-2">
                    <AlertCircle size={18} />
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* New Password */}
                  <div>
                    <label className="block text-sm font-medium text-heading mb-1.5">
                      New Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted">
                        <Lock size={18} />
                      </div>
                      <input
                        type={showPass ? "text" : "password"}
                        className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-border bg-background focus:ring-4 focus:ring-glow focus:border-primary outline-none transition-all"
                        placeholder="Enter New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPass(!showPass)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted hover:text-heading transition-colors"
                      >
                        {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-sm font-medium text-heading mb-1.5">
                      Confirm Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted">
                        <ShieldCheck size={18} />
                      </div>
                      <input
                        type={showConfirmPass ? "text" : "password"}
                        className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-border bg-background focus:ring-4 focus:ring-glow focus:border-primary outline-none transition-all"
                        placeholder="Enter Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPass(!showConfirmPass)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted hover:text-heading transition-colors"
                      >
                        {showConfirmPass ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-primary hover:bg-primary-hover text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 mt-2"
                    style={{ transitionTimingFunction: "var(--ease-apple)" }}
                  >
                    {isLoading ? "Updating..." : "Update Password"}
                  </button>
                </form>
              </>
            ) : (
              /* Success View */
              <div className="text-center py-6">
                <div className="flex justify-center mb-4">
                  <div className="bg-primary-light p-4 rounded-full">
                    <CheckCircle2 size={48} className="text-primary" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-heading">
                  Password Updated
                </h3>
                <p className="text-muted mt-2">{status}</p>
                <div className="mt-8">
                  <Link
                    href={ADMIN_LOGIN_PATH}
                    className="w-full bg-primary hover:bg-primary-hover text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 mt-2"
                  >
                    Go to Login
                  </Link>
                </div>
              </div>
            )}
            <p className="mt-8 text-center text-sm text-muted">
              © {new Date().getFullYear()} Apearix
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

