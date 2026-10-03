"use client";

import { useEffect, useState } from "react";
import { Eye, EyeOff, ShieldCheck, ArrowRight, Loader2, Sparkles } from "lucide-react";
import { markActivity } from "@/lib/auth/inactivity";
import toast from "react-hot-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

async function readJsonResponse(response: Response) {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export default function AdminLoginClient() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    localStorage.clear();
    sessionStorage.clear();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, identifier: email, password }),
      });

      const data = await readJsonResponse(response);

      if (!response.ok || !data || data.status === "error") {
        const message = data?.message || "Invalid credentials. Please try again.";
        toast.error(message);
        setError(message);
        return;
      }

      const role = data?.data?.role || data?.role || data?.user?.role;
      const userObj = data?.user || data?.data?.user;
      const tokenVal = data?.token || data?.data?.token || data?.access_token;

      if (role || tokenVal || userObj || data?.success) {
        if (userObj) {
          localStorage.setItem("user_data", JSON.stringify(userObj));
          document.cookie = `user_data=${encodeURIComponent(JSON.stringify(userObj))}; path=/; max-age=604800`;
        }
        if (tokenVal) {
          localStorage.setItem("token", tokenVal);
          localStorage.setItem("authToken", tokenVal);
          document.cookie = `token=${encodeURIComponent(tokenVal)}; path=/; max-age=604800`;
        }
        if (role) {
          localStorage.setItem("user_role", role);
          document.cookie = `user_role=${encodeURIComponent(role)}; path=/; max-age=604800`;
        }
        markActivity();

        toast.success("Login successful. Redirecting...");

        // Redirect to dashboard
        router.push("/admin/dashboard");
      } else {
        toast.error("Role not found. Please contact administrator.");
      }
    } catch (err: any) {
      toast.error(err?.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="h-screen w-full flex overflow-hidden bg-background font-geist select-none">
      {/* ================= LEFT SECTION (Branded Visual) ================= */}
      <section className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 bg-footer text-white overflow-hidden border-r border-border-subtle">
        {/* Ambient Glows */}
        <div
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-40"
          style={{ background: "radial-gradient(circle, #6D28F5 0%, transparent 70%)" }}
        />
        <div
          className="absolute -bottom-32 -right-32 w-[30rem] h-[30rem] rounded-full blur-3xl pointer-events-none opacity-25"
          style={{ background: "radial-gradient(circle, #5B21E6 0%, transparent 70%)" }}
        />


        {/* Brand Header */}
        <div className="relative z-10 flex items-center">

          <Image
            src="/logo.png"
            alt="Apearix Logo"
            width={38}
            height={38}
            priority
            className="object-contain"
          />

          <span className="font-medium text-2xl tracking-tight text-white">Apearix</span>
        </div>

        {/* Center Punchline */}
        <div className="relative z-10 max-w-xl my-auto">

          <h1 className="text-4xl lg:text-5xl font-semibold tracking-tight text-white leading-[1.15]">
            Powering intelligent operations at scale.
          </h1>

          <p className="mt-4 text-sm xl:text-base text-gray-400 font-normal leading-relaxed">
            Welcome to the Apearix unified portal. Manage real-time data workflows, security access policies, and enterprise modules from a centralized workspace.
          </p>


        </div>

        {/* Left Bottom Info */}
        <div className="relative z-10 text-sm text-gray-500 flex items-center justify-between">
          <p>© {new Date().getFullYear()} Apearix Inc. All rights reserved.</p>
        </div>
      </section>

      {/* ================= RIGHT SECTION (Form) ================= */}
      <section className="w-full lg:w-1/2 h-full flex flex-col justify-between px-6 sm:px-12 xl:px-20 py-8 bg-surface-alt overflow-y-auto">
        {/* Top spacer for clean vertical alignment */}
        <div className="hidden lg:block w-full h-2" />

        {/* Mobile Branded Header (Visible only on <lg screens) */}
        <div className="flex lg:hidden items-center justify-between pb-6">
          <div className="relative z-10 flex items-center">

            <Image
              src="/logo.png"
              alt="Apearix Logo"
              width={38}
              height={38}
              priority
              className="object-contain"
            />

            <span className="font-medium text-2xl tracking-tight text-heading">Apearix</span>
          </div>

        </div>

        {/* Form Card Container */}
        <div className="w-full max-w-[420px] mx-auto my-auto">
          {/* Form Header */}
          <div className="mb-8">

            <h2 className="text-3xl font-semibold tracking-tight text-heading">
              Welcome back
            </h2>
            <p className="text-body mt-1.5 font-normal">
              Please enter your credentials to access your account.
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-5 p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-600 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block"
              >
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className=""
              />
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block"
              >
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-heading transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Options Row */}
            <div className="flex items-center justify-between text-sm pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none text-muted hover:text-heading transition-colors">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-border text-primary focus:ring-primary focus:ring-offset-0 cursor-pointer accent-[#6D28F5]"
                />
                <span>Remember this device</span>
              </label>

              <Link
                href="/password/forget"
                className="font-medium text-primary hover:text-primary-hover hover:underline transition-all"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 h-11 bg-primary hover:bg-primary-hover active:scale-[0.99] text-white font-medium text-sm rounded-lg transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-70 disabled:pointer-events-none"
              style={{ transitionTimingFunction: "var(--ease-apple)" }}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign in</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="w-full text-center text-sm text-muted pt-6">
          <span>Protected by Apearix.</span>
        </div>
      </section>
    </main>
  );
}