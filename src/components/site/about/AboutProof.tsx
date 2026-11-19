import Image from "next/image";
import { ArrowRight, BriefcaseBusiness, Clock3, Globe2, Layers3, Sparkles } from "lucide-react";
import Link from "next/link";
import { AboutContainer } from "./AboutPrimitives";

const proofItems = [
  { value: "4+", label: "Years Experience", icon: Clock3 },
  { value: "25+", label: "Projects Completed", icon: BriefcaseBusiness },
  { value: "8+", label: "Capability Areas", icon: Layers3 },
  { value: "6+", label: "Industries Mapped", icon: Globe2 },
];

const imageWords = [
  ["Purpose", "left-[10%] top-[15%] rotate-[-90deg] text-purple-100"],
  ["Clarity", "left-[27%] top-[9%] rotate-[-90deg] text-purple-200"],
  ["Build", "left-[29%] top-[36%] text-5xl text-white sm:text-6xl"],
  ["Trust", "left-[25%] top-[54%] text-5xl text-white sm:text-6xl"],
  ["Strategy", "left-[48%] top-[14%] rotate-[-90deg] text-purple-100"],
  ["People", "left-[63%] top-[12%] rotate-90 text-purple-200"],
  ["Progress", "left-[63%] top-[41%] rotate-90 text-purple-100"],
  ["Impact", "left-[64%] top-[66%] rotate-90 text-purple-200"],
  ["Engineering", "left-[41%] top-[79%] text-purple-100"],
];

export function AboutProof() {
  return (
    <section className="relative overflow-hidden bg-surface py-10 sm:py-16 lg:py-20">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/3 -z-10 h-100 w-175 -translate-x-1/2 rounded-full bg-[#6D28F5]/5 blur-[140px]" />

      <AboutContainer>
        <div className="grid items-center gap-12 lg:grid-cols-[1.02fr_.98fr] lg:gap-16">
          {/* Creative Imagery Block */}
          <div className="relative aspect-[1.08/1] min-h-[360px] overflow-hidden rounded-3xl border border-border bg-footer shadow-2xl shadow-purple-950/15 sm:min-h-[480px]">
            <Image
              src="/image/about/team-collab.jpg"
              alt="Apearix team collaboration"
              fill
              className="object-cover object-center opacity-65"
              sizes="(max-width: 1024px) 100vw, 52vw"
            />
            <div className="absolute inset-0 bg-linear-to-br from-footer/85 via-primary/40 to-footer/80" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(15,23,42,.4)_100%)]" />
            {imageWords.map(([word, className]) => (
              <span
                key={word}
                className={`absolute font-extrabold uppercase leading-none tracking-[-.06em] ${className}`}
              >
                {word}
              </span>
            ))}
            <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between border-t border-white/20 pt-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/80">
              <span>Apearix / Engineering</span>
              <span>Built for what&apos;s next</span>
            </div>
          </div>

          {/* Text and Metrics Block */}
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border-accent bg-primary-light px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#6D28F5]">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Apearix at a Glance</span>
            </div>

            <h2 className="max-w-xl text-balance text-3xl font-bold tracking-tight text-heading sm:text-4xl lg:text-5xl leading-[1.12]">
              We bring engineering, problem-solving and digital experience together.
            </h2>

            <p className="mt-4 max-w-xl text-base leading-relaxed text-body sm:text-lg">
              From understanding the problem to improving the product after launch, our work is shaped around clarity, reliability, and long-term business value.
            </p>

            <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-border pt-8 sm:grid-cols-4 sm:gap-x-8">
              {proofItems.map(({ value, label, icon: Icon }) => (
                <div key={label}>
                  <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl border border-border-accent bg-primary-light text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="text-3xl font-bold tracking-tight text-primary sm:text-4xl md:text-5xl">
                    {value}
                  </div>
                  <div className="mt-1.5 text-xs font-semibold uppercase tracking-wider text-heading sm:text-sm">
                    {label}
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/services"
              className="group mt-9 inline-flex items-center gap-2 text-sm sm:text-base font-semibold text-primary transition hover:text-[#5B21E6]"
            >
              <span>Explore how we work</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </AboutContainer>
    </section>
  );
}
