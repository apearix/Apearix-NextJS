import Link from "next/link";
import { ArrowRight, BrainCircuit, Code2, Layers3, PencilRuler, Rocket, Search, Sparkles, Users, Workflow } from "lucide-react";
import { AboutContainer, GradientText } from "./AboutPrimitives";

const workflow = [
  [Search, "Discover"],
  [PencilRuler, "Design"],
  [Code2, "Build"],
  [Rocket, "Improve"],
] as const;

export function AboutHero() {
  return (
    <section className="relative w-full overflow-hidden bg-white flex items-center pt-30 pb-12 sm:pt-32 sm:pb-16 lg:pt-36 lg:pb-20">
      {/* Technical Grid Pattern */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(#111827 1px, transparent 1px), linear-gradient(90deg, #111827 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Ambient Purple Glow - Top Right */}
      <div
        aria-hidden="true"
        className="absolute -top-40 -right-45 sm:-right-30 lg:-right-20 w-105 h-105 sm:w-155 sm:h-155 lg:w-190 lg:h-190 rounded-full bg-[radial-gradient(circle_at_center,rgba(109,40,245,0.10)_0%,rgba(109,40,245,0.04)_35%,transparent_70%)] blur-3xl pointer-events-none"
      />

      {/* Ambient Purple Glow - Bottom Left */}
      <div
        aria-hidden="true"
        className="absolute -bottom-55 -left-55 w-105 h-105 rounded-full bg-[radial-gradient(circle_at_center,rgba(109,40,245,0.06)_0%,transparent_70%)] blur-3xl pointer-events-none"
      />

      <AboutContainer className="relative z-10 grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
        {/* Left Column: Narrative */}
        <div className="lg:col-span-7 flex flex-col items-start text-left">
          {/* Eyebrow Badge */}
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border-accent bg-primary-light px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#6D28F5]">
            <Sparkles className="h-3.5 w-3.5" />
            <span>About Apearix</span>
          </div>

          {/* Headline */}
          <h1 className="max-w-4xl text-[2.7rem] font-bold leading-[1.04] tracking-[-0.035em] text-heading sm:text-6xl md:text-7xl lg:text-[4.2rem]">
            We Build Technology That{" "}
            <span className="block">
              <GradientText>Moves Businesses Forward.</GradientText>
            </span>
          </h1>

          {/* Description */}
          <p className="mt-5 max-w-xl text-[15px] leading-7 text-muted sm:mt-6 sm:text-lg sm:leading-8">
            Apearix is a software engineering company focused on building meaningful digital products, intelligent AI systems, and scalable SaaS platforms that help ambitious businesses grow.
          </p>

          {/* CTAs */}
          <div className="mt-7 flex w-full flex-col gap-3 sm:mt-8 sm:w-auto sm:flex-row">
            <Link
              href="/services"
              className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-7 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(109,40,245,0.20)] transition-all duration-300 hover:bg-[#5B21E6] hover:shadow-[0_10px_30px_rgba(109,40,245,0.28)] active:scale-[0.98] sm:w-auto"
            >
              <span>Explore Our Services</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
            <a
              href="#team"
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full border border-border bg-white px-7 text-sm font-semibold text-heading transition-all duration-300 hover:border-border-accent hover:text-primary active:scale-[0.98] sm:w-auto"
            >
              <span>Meet Our Team</span>
              <Users className="h-4 w-4" />
            </a>
          </div>

          {/* Micro Value Props */}
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs sm:text-sm font-medium text-muted">
            <span className="inline-flex items-center gap-2">
              <Code2 className="h-4 w-4 text-primary" />
              <span>Engineering-led</span>
            </span>
            <span className="inline-flex items-center gap-2">
              <Workflow className="h-4 w-4 text-primary" />
              <span>Business-focused</span>
            </span>
            <span className="inline-flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span>Future-ready</span>
            </span>
          </div>
        </div>

        {/* Right Column: High-End Engineering System Card */}
        <div className="lg:col-span-5 relative mx-auto w-full max-w-lg rounded-3xl border border-border bg-white p-6 shadow-2xl shadow-purple-900/10 sm:p-8">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-white shadow-sm">
                <Sparkles className="h-4 w-4" />
              </span>
              <span className="text-sm font-bold text-heading">Apearix / Engineering System</span>
            </div>
            <span className="rounded-full border border-border-accent bg-primary-light px-3 py-1 text-[11px] font-semibold text-primary">
              Built for what&apos;s next
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 py-5">
            <div className="rounded-2xl border border-border-accent/40 bg-primary-light/50 p-4 transition-all hover:bg-primary-light">
              <Layers3 className="h-5 w-5 text-primary" />
              <div className="mt-6 text-sm font-bold text-heading">Web apps & SaaS</div>
              <p className="mt-1 text-xs leading-5 text-muted">Reliable products shaped around real workflows.</p>
            </div>
            <div className="rounded-2xl border border-border bg-surface p-4 transition-all hover:bg-surface-alt">
              <BrainCircuit className="h-5 w-5 text-primary" />
              <div className="mt-6 text-sm font-bold text-heading">AI & automation</div>
              <p className="mt-1 text-xs leading-5 text-muted">Intelligent systems that make work simpler.</p>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-heading">From idea to impact</span>
              <Workflow className="h-4 w-4 text-primary" />
            </div>
            <div className="mt-4 grid grid-cols-4 gap-2">
              {workflow.map(([Icon, label], index) => (
                <div key={label} className="relative rounded-xl border border-border bg-white px-2 py-3 text-center">
                  {index < workflow.length - 1 && (
                    <span className="absolute right-[-8px] top-1/2 z-10 hidden h-px w-2.5 bg-border-accent sm:block" />
                  )}
                  <Icon className="mx-auto h-4 w-4 text-primary" />
                  <span className="mt-2 block text-[11px] font-semibold text-muted">{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 divide-x divide-white/15 rounded-2xl bg-footer px-3 py-4 text-center text-white">
            <div>
              <div className="text-xl font-bold tracking-tight text-white">4+</div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-purple-200">Years</div>
            </div>
            <div>
              <div className="text-xl font-bold tracking-tight text-white">25+</div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-purple-200">Projects</div>
            </div>
            <div>
              <div className="text-xl font-bold tracking-tight text-white">8+</div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-purple-200">Capabilities</div>
            </div>
          </div>
        </div>
      </AboutContainer>
    </section>
  );
}
