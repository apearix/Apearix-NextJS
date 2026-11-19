import Image from "next/image";
import { Link2, Globe, Award } from "lucide-react";
import { AboutContainer, AboutIntro, AboutSection, GradientText } from "./AboutPrimitives";

export function AboutLeadership() {
  return (
    <AboutSection>
      <AboutContainer>
        <AboutIntro
          icon={Award}
          eyebrow="The Leadership"
          title={
            <>
              Leadership That{" "}
              <span className="block sm:inline">
                <GradientText>Shapes Our Direction.</GradientText>
              </span>
            </>
          }
          description="A clear point of view, uncompromising engineering standards, and a long-term approach to building durable software systems."
        />

        <article className="overflow-hidden rounded-3xl border border-border bg-white shadow-xl shadow-purple-900/5 transition-all duration-500 hover:border-border-accent hover:shadow-2xl hover:shadow-[#6D28F5]/10">
          <div className="grid lg:grid-cols-[0.8fr_1.2fr]">
            {/* Founder Portrait */}
            <div className="relative min-h-[360px] overflow-hidden bg-primary-light sm:min-h-[440px] lg:min-h-[480px]">
              <Image
                src="/image/about/founder.jpg"
                alt="Apearix founder portrait"
                fill
                className="object-cover object-center transition-transform duration-700 hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
              <div className="absolute inset-0 bg-linear-to-t from-footer/70 via-transparent to-primary/10" />
              <span className="absolute bottom-6 left-6 rounded-full border border-white/40 bg-white/95 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary shadow-sm backdrop-blur-md">
                Founder / CEO
              </span>
            </div>

            {/* Founder Details */}
            <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-12">
              <div className="text-xs font-semibold uppercase tracking-wider text-primary">
                Leadership Profile
              </div>
              <h3 className="mt-3 text-3xl font-bold tracking-tight text-heading sm:text-4xl md:text-5xl">
                Aarav Mehta
              </h3>
              <p className="mt-2 text-sm sm:text-base font-semibold text-primary">
                Founder &amp; Chief Executive Officer
              </p>

              <p className="mt-6 text-base leading-relaxed text-body sm:text-lg">
                A product-minded technology entrepreneur focused on turning complex ideas into intuitive, useful digital experiences. Aarav&apos;s leadership philosophy centers on clean architecture, purposeful innovation, and lasting client partnerships.
              </p>

              <div className="mt-6 rounded-2xl border-l-2 border-primary bg-primary-light/50 p-4 text-sm sm:text-base italic leading-relaxed text-muted">
                &ldquo;Build with clarity, take ownership of the details, and continuously improve what you launch.&rdquo;
              </div>

              <div className="mt-6 flex flex-wrap gap-2.5">
                <span className="rounded-full border border-border-accent bg-primary-light px-3.5 py-1.5 text-xs font-semibold text-primary">
                  Product Strategy
                </span>
                <span className="rounded-full border border-border-accent bg-primary-light px-3.5 py-1.5 text-xs font-semibold text-primary">
                  Software Architecture
                </span>
                <span className="rounded-full border border-border-accent bg-primary-light px-3.5 py-1.5 text-xs font-semibold text-primary">
                  AI Systems
                </span>
              </div>

              <div className="mt-7 flex gap-3">
                <a
                  href="https://www.linkedin.com/company/apearix/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Apearix LinkedIn"
                  className="grid h-11 w-11 place-items-center rounded-2xl border border-border bg-surface text-muted transition hover:border-border-accent hover:bg-primary-light hover:text-primary"
                >
                  <Link2 className="h-4 w-4" />
                </a>
                <a
                  href="https://www.apearix.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Apearix website"
                  className="grid h-11 w-11 place-items-center rounded-2xl border border-border bg-surface text-muted transition hover:border-border-accent hover:bg-primary-light hover:text-primary"
                >
                  <Globe className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </article>
      </AboutContainer>
    </AboutSection>
  );
}
