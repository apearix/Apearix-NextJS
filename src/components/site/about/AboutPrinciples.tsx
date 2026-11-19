import { ShieldCheck } from "lucide-react";
import { AboutContainer, AboutIntro, AboutSection, GradientText } from "./AboutPrimitives";
import { principles } from "./about-data";

export function AboutPrinciples() {
  return (
    <AboutSection soft>
      <AboutContainer>
        <AboutIntro
          icon={ShieldCheck}
          eyebrow="What Guides Us"
          title={
            <>
              The Principles Behind{" "}
              <span className="block sm:inline">
                <GradientText>Everything We Build.</GradientText>
              </span>
            </>
          }
          description="A strong foundation of engineering integrity, transparent communication, and continuous learning defines our standard of work."
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {principles.map((item, index) => {
            const Icon = item.icon;
            const number = String(index + 1).padStart(2, "0");

            return (
              <article
                key={item.title}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-white p-6 transition-all duration-500 hover:-translate-y-1.5 hover:border-border-accent hover:shadow-2xl hover:shadow-[#6D28F5]/10 sm:p-8"
              >
                {/* Number Watermark matching Home WhyApearix & WhatWeBuild */}
                <span className="absolute right-6 top-6 text-7xl font-bold text-muted/10 transition-colors group-hover:text-primary/20 pointer-events-none select-none">
                  {number}
                </span>

                <div>
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-border-accent bg-primary-light text-primary transition-all duration-500 group-hover:bg-primary group-hover:text-white group-hover:shadow-md">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mb-2 text-xl font-bold tracking-tight text-heading sm:text-2xl transition-colors group-hover:text-primary">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-body sm:text-base">
                    {item.description}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </AboutContainer>
    </AboutSection>
  );
}
