import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export function AboutCTA() {
  return (
    <section className="relative overflow-hidden bg-footer py-20 text-white sm:py-28 lg:py-32 border-b border-white/6">
      {/* Soft Ambient Purple Glow matching Home CTASection */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-100 w-162.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#6D28F5]/15 blur-[140px]"
      />

      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
        {/* Eyebrow */}
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-purple-300 backdrop-blur-xs">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Let&apos;s Build Together</span>
        </div>

        {/* Main Heading */}
        <h2 className="text-balance text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl md:text-6xl">
          Have an idea? <br />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-[#C4B5FD] via-border-accent to-white">
            Let&apos;s build something meaningful.
          </span>
        </h2>

        {/* Subtitle */}
        <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
          Whether you&apos;re architecting a new SaaS platform, custom web application, or intelligent AI automation, let&apos;s talk about what&apos;s next.
        </p>

        {/* Action Buttons */}
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/contact?type=project"
            className="group inline-flex h-12 w-full items-center justify-center gap-2.5 rounded-xl bg-white px-8 text-sm font-semibold text-heading shadow-[0_8px_24px_rgba(0,0,0,0.25)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary-light active:scale-[0.98] sm:w-auto"
          >
            <span>Start a Project</span>
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
          <Link
            href="/contact"
            className="inline-flex h-12 w-full items-center justify-center gap-2.5 rounded-xl border border-white/20 bg-white/5 px-8 text-sm font-semibold text-white transition-all duration-300 hover:bg-white/10 active:scale-[0.98] sm:w-auto"
          >
            <span>Contact Us</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
