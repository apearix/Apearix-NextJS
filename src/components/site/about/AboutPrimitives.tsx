import type { ReactNode } from "react";
import type { AboutCard } from "./about-data";
import { Sparkles, type LucideIcon } from "lucide-react";

export function AboutSection({
  children,
  soft = false,
  className = "",
  id,
}: {
  children: ReactNode;
  soft?: boolean;
  className?: string;
  id?: string;
}) {
  return (
    <section
      id={id}
      className={`relative overflow-hidden py-10 sm:py-16 lg:py-20 ${
        soft ? "bg-surface" : "bg-white"
      } ${className}`}
    >
      {/* Ambient background glow consistent with home sections */}
      <div className="pointer-events-none absolute left-1/2 top-1/4 -z-10 h-100 w-175 -translate-x-1/2 rounded-full bg-[#6D28F5]/5 blur-[140px]" />
      {children}
    </section>
  );
}

export function AboutContainer({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  );
}

export function AboutIntro({
  eyebrow,
  title,
  description,
  centered = false,
  icon: Icon = Sparkles,
}: {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  centered?: boolean;
  icon?: LucideIcon | React.ElementType | null;
}) {
  return (
    <div className={`${centered ? "mx-auto text-center" : ""} mb-10 max-w-3xl sm:mb-12`}>
      <div
        className={`mb-5 inline-flex items-center gap-2 rounded-full border border-border-accent bg-primary-light px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#6D28F5] ${
          centered ? "justify-center" : ""
        }`}
      >
        {Icon && <Icon className="h-3.5 w-3.5" />}
        <span>{eyebrow}</span>
      </div>
      <h2 className="text-balance text-3xl font-bold tracking-tight text-heading sm:text-4xl md:text-5xl lg:text-6xl leading-[1.08]">
        {title}
      </h2>
      {description && (
        <p
          className={`mt-4 text-base leading-relaxed text-body sm:text-lg ${
            centered ? "mx-auto max-w-2xl" : "max-w-3xl"
          }`}
        >
          {description}
        </p>
      )}
    </div>
  );
}

export function AboutIconCard({
  item,
  className = "",
}: {
  item: AboutCard;
  className?: string;
}) {
  const Icon = item.icon;
  return (
    <article
      className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-white p-6 transition-all duration-500 hover:-translate-y-1.5 hover:border-border-accent hover:shadow-2xl hover:shadow-[#6D28F5]/10 sm:p-8 ${className}`}
    >
      <div>
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-border-accent bg-primary-light text-primary transition-all duration-500 group-hover:bg-primary group-hover:text-white group-hover:shadow-md">
          <Icon className="h-5 w-5" />
        </div>
        <h3 className="mb-2 text-xl font-bold tracking-tight text-heading sm:text-2xl transition-colors group-hover:text-primary">
          {item.title}
        </h3>
        {item.description && (
          <p className="text-sm leading-relaxed text-body sm:text-base">
            {item.description}
          </p>
        )}
      </div>
    </article>
  );
}

export function GradientText({ children }: { children: ReactNode }) {
  return (
    <span className="text-transparent bg-clip-text bg-linear-to-r from-[#6D28F5] via-[#7B3FE4] to-[#A855F7]">
      {children}
    </span>
  );
}
