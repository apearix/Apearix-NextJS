"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, Send, CheckCircle2 } from "lucide-react";
import { ADMIN_LOGIN_PATH } from "@/lib/auth/routes";

async function readJsonResponse(response: Response) {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export default function ForgetPasswordClient() {
  const [email, setEmail] = useState("");
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const normalizedEmail = email.trim().toLowerCase();
    
    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalizedEmail }),
      });

      const data = await readJsonResponse(response);

      if (!response.ok || !data || data.status === "error") {
        const message = data?.message === "user_not_found" 
          ? "We couldn't find an account with this email address." 
          : (data?.message || "Something went wrong. Please try again.");
        setError(message);
        return;
      }

      setSubmittedEmail(normalizedEmail);
      setIsSubmitted(true);
    } catch (err: any) {
      setError(err?.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
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

            {!isSubmitted ? (
              <>
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-semibold text-heading">
                    Forgot Password
                  </h2>
                  <p className="text-sm text-muted mt-2">
                    Enter your email address and we'll send you a link to reset your password.
                  </p>
                </div>

                {error && (
                  <div className="mb-6 rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600 text-center font-medium">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off">
                  <div>
                    <label className="block text-sm font-medium text-heading mb-1.5">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:ring-4 focus:ring-glow focus:border-primary outline-none transition-all"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-primary hover:bg-primary-hover text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
                    style={{ transitionTimingFunction: "var(--ease-apple)" }}
                  >
                    {isLoading ? "Sending..." : "Send Reset Link"}
                    {!isLoading && <Send size={18} />}
                  </button>

                  <div className="text-center mt-4">
                    <Link
                      href={ADMIN_LOGIN_PATH}
                      className="text-primary hover:text-primary-hover text-sm font-semibold inline-flex items-center gap-1 transition-colors"
                    >
                      <ChevronLeft size={18} />
                      Back to Login
                    </Link>
                  </div>
                </form>
              </>
            ) : (
              /* Success State */
              <div className="text-center py-4">
                <div className="flex justify-center mb-4">
                  <div className="bg-primary-light p-3 rounded-full">
                    <CheckCircle2 size={40} className="text-primary" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-heading">
                  Check your email
                </h3>
                <p className="text-muted mt-2 text-sm">
                  We have sent a password reset link to <br />
                  <span className="font-semibold text-heading">{submittedEmail}</span>
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="mt-6 text-primary hover:text-primary-hover transition-colors text-sm font-medium"
                >
                  Didn't receive the email? Click to retry
                </button>
                <div className="mt-6">
                  <Link
                    href={ADMIN_LOGIN_PATH}
                    className="block w-full bg-surface border border-border text-heading hover:bg-border-accent font-medium py-2.5 rounded-lg transition-colors text-center"
                  >
                    Return to Login
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
