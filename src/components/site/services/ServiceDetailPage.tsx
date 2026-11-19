import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Blend,
  CheckCircle2,
  ChevronDown,
  Circle,
  Code2,
  Cloud,
  Component,
  Grid2X2,
  Layers,
  MousePointer2,
  Palette,
  PenTool,
  Smartphone,
  Sparkles,
  Type,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ServiceOffering } from "@/app/(site)/services/data";
import { CTASection } from "@/components/sections/CTASection";

const iconMap: Record<ServiceOffering["iconName"], LucideIcon> = {
  Sparkles,
  Cloud,
  Smartphone,
  Layers,
  Palette,
  Code2,
};

const serviceThemes: Record<ServiceOffering["slug"], { accent: string; soft: string }> = {
  "ai-automation": { accent: "from-violet-500 to-fuchsia-500", soft: "bg-violet-50" },
  "cloud-devops": { accent: "from-sky-500 to-indigo-500", soft: "bg-sky-50" },
  "mobile-app-development": { accent: "from-cyan-500 to-blue-600", soft: "bg-cyan-50" },
  "saas-development": { accent: "from-purple-500 to-indigo-600", soft: "bg-purple-50" },
  "ui-ux-design": { accent: "from-[#6D28F5] to-[#A855F7]", soft: "bg-purple-50" },
  "web-development": { accent: "from-indigo-500 to-purple-600", soft: "bg-indigo-50" },
};

export function ServiceDetailPage({ service }: { service: ServiceOffering }) {
  const Icon = iconMap[service.iconName];
  const theme = serviceThemes[service.slug];

  return (
    <main className="w-full bg-white text-heading">
      <section className="relative overflow-hidden border-b border-border bg-linear-to-br from-white via-surface to-primary-light pt-28 sm:pt-32 lg:pt-36">
        <div className="pointer-events-none absolute -right-32 top-12 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute left-1/3 top-0 h-72 w-72 rounded-full bg-purple-200/30 blur-3xl" />
        {service.slug === "ui-ux-design" && <UiUxHero service={service} />}
        <div className={`relative mx-auto grid w-full max-w-7xl gap-12 px-4 pb-16 sm:px-6 sm:pb-20 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:px-8 lg:pb-28 ${service.slug === "ui-ux-design" ? "hidden" : ""}`}>
          <div>
            <Link href="/services" className="mb-8 flex w-fit items-center gap-2 text-xs font-semibold text-muted transition hover:text-primary">
              <ArrowRight className="h-3.5 w-3.5 rotate-180" /> All services
            </Link>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border-accent bg-white/80 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-primary shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" /> {service.badge}
            </div>
            <h1 className="max-w-3xl text-balance text-4xl font-bold leading-[1.05] tracking-tight text-heading sm:text-5xl lg:text-7xl">
              {service.title.split(" ").slice(0, -1).join(" ")} <span className={`bg-linear-to-r ${theme.accent} bg-clip-text text-transparent`}>{service.title.split(" ").slice(-1)}</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-body sm:text-xl">{service.tagline}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/contact?type=project" className="group inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-200 transition hover:-translate-y-0.5 hover:bg-primary-hover">
                Start a conversation <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
              <Link href="#approach" className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-5 py-3 text-sm font-semibold text-heading transition hover:border-border-accent hover:text-primary">
                See our approach <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="relative lg:pl-8">
            <div className="relative overflow-hidden rounded-[2rem] border border-white/80 bg-white/85 p-5 shadow-2xl shadow-purple-200/50 backdrop-blur sm:p-7">
              <div className={`absolute inset-x-0 top-0 h-1.5 bg-linear-to-r ${theme.accent}`} />
              <div className="flex items-center justify-between border-b border-border pb-5">
                <div className="flex items-center gap-3">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${theme.soft} text-primary`}><Icon className="h-6 w-6" /></div>
                  <div><p className="text-sm font-bold text-heading">Apearix / Studio</p><p className="mt-1 text-xs text-muted">{service.badge}</p></div>
                </div>
                <span className="rounded-full bg-primary-light px-3 py-1 text-[11px] font-bold text-primary">Built for growth</span>
              </div>
              <div className="grid gap-3 pt-5 sm:grid-cols-2">
                {service.subCapabilities.map((item, index) => (
                  <div key={item.title} className="rounded-2xl border border-border bg-surface p-4">
                    <span className="text-xs font-bold text-primary">0{index + 1}</span>
                    <h2 className="mt-3 text-sm font-bold text-heading">{item.title}</h2>
                    <p className="mt-2 text-xs leading-5 text-muted">{item.description}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between rounded-2xl bg-heading px-4 py-3 text-white">
                <span className="text-xs font-medium text-white/70">Outcome we target</span>
                <span className="text-sm font-bold">{service.metrics.stat} <span className="font-normal text-white/70">{service.metrics.label}</span></span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-white py-14 sm:py-18 lg:py-20">
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[.8fr_1.2fr] lg:gap-20 lg:px-8">
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-widest text-primary">The opportunity</p>
            <h2 className="text-balance text-3xl font-bold leading-tight tracking-tight sm:text-4xl">Make the complex feel simple.</h2>
          </div>
          <div>
            <p className="text-lg leading-8 text-body">{service.shortDescription}</p>
            <p className="mt-5 text-base leading-8 text-muted">{service.fullOverview}</p>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-surface py-16 sm:py-20 lg:py-28" id="capabilities">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 max-w-2xl">
            <p className="mb-4 text-xs font-bold uppercase tracking-widest text-primary">What we bring</p>
            <h2 className="text-balance text-3xl font-bold leading-tight tracking-tight sm:text-5xl">A system that works beautifully.</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {service.subCapabilities.map((item, index) => (
              <article key={item.title} className="rounded-3xl border border-border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-border-accent hover:shadow-lg sm:p-7">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-light text-sm font-bold text-primary">0{index + 1}</div>
                <h3 className="mt-6 text-xl font-bold text-heading">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-body">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-white py-16 sm:py-20 lg:py-28">
        <div className="mx-auto grid w-full max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[.85fr_1.15fr] lg:gap-24 lg:px-8">
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-widest text-primary">Included in the work</p>
            <h2 className="text-balance text-3xl font-bold leading-tight tracking-tight sm:text-5xl">Everything needed to move forward.</h2>
            <p className="mt-5 max-w-md text-base leading-7 text-body">Clear deliverables, thoughtful decisions and production-ready implementation from the first sprint to launch.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {service.deliverables.map((item) => <div key={item} className="flex gap-3 rounded-2xl border border-border bg-surface p-4 text-sm leading-6 text-body"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" /> <span>{item}</span></div>)}
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-surface py-16 sm:py-20 lg:py-28" id="approach">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 max-w-2xl"><p className="mb-4 text-xs font-bold uppercase tracking-widest text-primary">How we work</p><h2 className="text-balance text-3xl font-bold leading-tight tracking-tight sm:text-5xl">A calm, clear path from idea to impact.</h2></div>
          <div className="grid gap-3 md:grid-cols-3">
            {service.process.map((item) => <article key={item.step} className="relative rounded-3xl border border-border bg-white p-6 sm:p-7"><span className="text-5xl font-black tracking-tight text-primary/15">{item.step}</span><h3 className="mt-5 text-xl font-bold text-heading">{item.title}</h3><p className="mt-3 text-sm leading-7 text-body">{item.description}</p></article>)}
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-white py-16 sm:py-20 lg:py-24">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div><p className="mb-3 text-xs font-bold uppercase tracking-widest text-primary">Technology that fits</p><h2 className="text-3xl font-bold tracking-tight sm:text-4xl">The right tools for the job.</h2></div>
          <div className="flex max-w-2xl flex-wrap gap-2">{service.techStack.map((tech) => <span key={tech} className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium text-body"><Circle className="h-2 w-2 fill-primary text-primary" />{tech}</span>)}</div>
        </div>
      </section>

      <section className="border-b border-border bg-surface py-16 sm:py-20 lg:py-24">
        <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8"><div className="mb-10 text-center"><p className="mb-3 text-xs font-bold uppercase tracking-widest text-primary">Questions, answered</p><h2 className="text-3xl font-bold tracking-tight sm:text-4xl">A little more clarity.</h2></div><div className="space-y-3">{service.faqs.map((faq) => <details key={faq.question} className="group rounded-2xl border border-border bg-white px-5 py-4"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-heading [&::-webkit-details-marker]:hidden">{faq.question}<ChevronDown className="h-4 w-4 shrink-0 text-primary transition group-open:rotate-180" /></summary><p className="max-w-2xl pt-4 text-sm leading-7 text-body">{faq.answer}</p></details>)}</div></div>
      </section>

      <CTASection />
    </main>
  );
}

function UiUxHero({ service }: { service: ServiceOffering }) {
  return (
    <div className="relative mx-auto grid w-full max-w-7xl gap-14 px-4 pb-16 sm:px-6 sm:pb-20 lg:grid-cols-[.9fr_1.1fr] lg:items-center lg:gap-20 lg:px-8 lg:pb-28">
      <div>
        <Link href="/services" className="mb-8 flex w-fit items-center gap-2 text-xs font-semibold text-muted transition hover:text-primary">
          <ArrowRight className="h-3.5 w-3.5 rotate-180" /> All services
        </Link>
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border-accent bg-white/80 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-primary shadow-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" /> {service.badge}
        </div>
        <h1 className="max-w-2xl text-balance text-5xl font-bold leading-[.98] tracking-[-.045em] text-heading sm:text-6xl lg:text-[5.4rem]">
          Design products <span className="bg-linear-to-r from-[#6D28F5] via-[#8B5CF6] to-[#C084FC] bg-clip-text text-transparent">people love to use.</span>
        </h1>
        <p className="mt-7 max-w-xl text-lg leading-8 text-body sm:text-xl">{service.tagline}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/contact?type=project" className="group inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-200 transition hover:-translate-y-0.5 hover:bg-primary-hover">
            Start a design project <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
          <Link href="#capabilities" className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-5 py-3 text-sm font-semibold text-heading transition hover:border-border-accent hover:text-primary">
            Explore our craft <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-xs font-semibold text-muted">
          <span className="inline-flex items-center gap-2"><Component className="h-4 w-4 text-primary" /> Systems thinking</span>
          <span className="inline-flex items-center gap-2"><Blend className="h-4 w-4 text-primary" /> Accessible by default</span>
          <span className="inline-flex items-center gap-2"><PenTool className="h-4 w-4 text-primary" /> Ready for code</span>
        </div>
      </div>

      <div className="relative min-h-105 sm:min-h-125 lg:min-h-135">
        <div className="absolute -right-5 top-2 h-28 w-28 rounded-full bg-purple-300/30 blur-2xl" />
        <div className="absolute -bottom-6 left-8 h-36 w-36 rounded-full bg-fuchsia-300/20 blur-3xl" />
        <div className="relative mt-2 rotate-[1.5deg] rounded-[2rem] border border-white/90 bg-white/90 p-3 shadow-2xl shadow-purple-200/60 backdrop-blur sm:p-4 lg:mt-8">
          <div className="overflow-hidden rounded-[1.35rem] border border-border bg-[#F7F5FF]">
            <div className="flex h-12 items-center justify-between border-b border-border bg-white px-4 sm:px-5">
              <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-[#FF6B7A]" /><span className="h-2.5 w-2.5 rounded-full bg-[#FFC857]" /><span className="h-2.5 w-2.5 rounded-full bg-[#4FD1A5]" /></div>
              <div className="flex items-center gap-2 rounded-lg bg-surface px-3 py-1.5 text-[10px] font-bold text-muted"><Palette className="h-3.5 w-3.5 text-primary" /> Apearix Design System</div>
              <div className="hidden items-center gap-2 text-[10px] font-bold text-muted sm:flex"><span className="h-2 w-2 rounded-full bg-emerald-400" /> Saved</div>
            </div>
            <div className="grid min-h-95 grid-cols-[42px_1fr] sm:grid-cols-[54px_1fr] lg:min-h-105">
              <div className="flex flex-col items-center gap-5 border-r border-border bg-white py-5 text-muted"><Grid2X2 className="h-4 w-4 text-primary" /><PenTool className="h-4 w-4" /><Type className="h-4 w-4" /><Layers className="h-4 w-4" /><div className="mt-auto h-6 w-6 rounded-full bg-primary-light" /></div>
              <div className="relative p-4 sm:p-6">
                <div className="mb-4 flex items-center justify-between"><div><p className="text-[10px] font-bold uppercase tracking-widest text-primary">Product experience</p><p className="mt-1 text-xs text-muted">Homepage / Hero state</p></div><button type="button" className="rounded-lg bg-heading px-3 py-2 text-[10px] font-bold text-white">Preview</button></div>
                <div className="relative overflow-hidden rounded-2xl bg-heading p-5 text-white shadow-xl sm:p-7">
                  <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/50 blur-2xl" /><div className="absolute bottom-0 right-8 h-24 w-24 rounded-full bg-fuchsia-400/30 blur-2xl" />
                  <div className="relative max-w-xs"><span className="inline-flex rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[9px] font-semibold text-purple-100">MAKE IT MATTER</span><p className="mt-5 text-2xl font-bold leading-tight sm:text-3xl">Ideas that feel as good as they work.</p><p className="mt-3 max-w-55 text-[10px] leading-5 text-white/60">A clear system for bold, useful digital products.</p><div className="mt-5 flex gap-2"><span className="rounded-lg bg-white px-3 py-2 text-[10px] font-bold text-heading">Get started <ArrowUpRight className="ml-1 inline h-3 w-3" /></span><span className="rounded-lg border border-white/20 px-3 py-2 text-[10px] font-bold text-white/80">View work</span></div></div>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2"><div className="rounded-xl border border-border bg-white p-3"><div className="mb-3 h-2 w-8 rounded-full bg-primary/20" /><div className="h-1.5 w-full rounded-full bg-surface" /><div className="mt-2 h-1.5 w-3/4 rounded-full bg-surface" /></div><div className="rounded-xl border border-border bg-white p-3"><MousePointer2 className="h-4 w-4 text-primary" /><p className="mt-3 text-[9px] font-bold text-heading">Interaction</p></div><div className="rounded-xl border border-border bg-white p-3"><div className="flex gap-1"><span className="h-4 w-4 rounded-full bg-[#6D28F5]" /><span className="h-4 w-4 rounded-full bg-[#C084FC]" /><span className="h-4 w-4 rounded-full bg-[#F3E8FF]" /></div><p className="mt-3 text-[9px] font-bold text-heading">Tokens</p></div></div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute -left-3 bottom-5 rounded-2xl border border-white bg-white px-4 py-3 shadow-xl shadow-purple-200/50 sm:-left-8"><div className="flex items-center gap-2"><span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary-light"><Sparkles className="h-3.5 w-3.5 text-primary" /></span><div><p className="text-[10px] font-bold text-heading">Design → Build</p><p className="text-[9px] text-muted">One connected workflow</p></div></div></div>
        <div className="absolute -right-2 top-16 rounded-full border border-white bg-white px-3 py-2 text-[10px] font-bold text-primary shadow-lg shadow-purple-200/40 sm:-right-7">01 Research</div>
      </div>
    </div>
  );
}
