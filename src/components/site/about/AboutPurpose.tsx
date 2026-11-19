import { Target, Telescope } from "lucide-react";
import { AboutContainer, AboutIntro, AboutSection, GradientText } from "./AboutPrimitives";

export function AboutPurpose() {
  return (
    <AboutSection>
      <AboutContainer>
        <AboutIntro
          centered
          icon={Target}
          eyebrow="Our Purpose"
          title={
            <>
              Driven by Purpose.{" "}
              <span className="block sm:inline">
                <GradientText>Built for Impact.</GradientText>
              </span>
            </>
          }
          description="Clear intentions guide everything we build, ensuring every product delivers measurable business value."
        />

        <div className="grid gap-6 md:grid-cols-2">
          {/* Mission Card */}
          <article className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-white p-8 md:p-10 shadow-sm transition-all duration-500 hover:-translate-y-1.5 hover:border-border-accent hover:shadow-2xl hover:shadow-[#6D28F5]/10">
            <div>
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-border-accent bg-primary-light text-primary transition-all duration-500 group-hover:bg-primary group-hover:text-white group-hover:shadow-md">
                  <Target className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-bold tracking-tight text-heading sm:text-3xl transition-colors group-hover:text-primary">
                  Our Mission
                </h3>
              </div>
              <p className="mt-6 text-base leading-relaxed text-body sm:text-lg">
                To engineer reliable, scalable, and meaningful digital solutions that solve real-world problems and help forward-thinking businesses move forward with confidence.
              </p>
            </div>
          </article>

          {/* Vision Card */}
          <article className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-white p-8 md:p-10 shadow-sm transition-all duration-500 hover:-translate-y-1.5 hover:border-border-accent hover:shadow-2xl hover:shadow-[#6D28F5]/10">
            <div>
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-border-accent bg-primary-light text-primary transition-all duration-500 group-hover:bg-primary group-hover:text-white group-hover:shadow-md">
                  <Telescope className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-bold tracking-tight text-heading sm:text-3xl transition-colors group-hover:text-primary">
                  Our Vision
                </h3>
              </div>
              <p className="mt-6 text-base leading-relaxed text-body sm:text-lg">
                To become a trusted global technology partner recognized for engineering excellence, purposeful innovation, and digital experiences that stand the test of time.
              </p>
            </div>
          </article>
        </div>
      </AboutContainer>
    </AboutSection>
  );
}
