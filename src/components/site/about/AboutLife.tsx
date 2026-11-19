import Image from "next/image";
import { Sparkles } from "lucide-react";
import { AboutContainer, AboutIntro, AboutSection, GradientText } from "./AboutPrimitives";

const images = [
  [
    "/image/about/team-collab.jpg",
    "Team collaboration",
    "Sharing ideas, whiteboarding architectures, and solving complex problems together.",
    "md:col-span-7 md:min-h-[360px]",
  ],
  [
    "/image/about/team-ideas.jpg",
    "Ideas in motion",
    "Brainstorming workflows and engineering rapid prototypes.",
    "md:col-span-5 md:min-h-[360px]",
  ],
  [
    "/image/about/team-learning.jpg",
    "Learning together",
    "Continuous upskilling in modern full-stack architectures and AI paradigms.",
    "md:col-span-4 min-h-[220px]",
  ],
  [
    "/image/about/team-creative.jpg",
    "Creative problem-solving",
    "Designing intuitive user experiences around real-world human needs.",
    "md:col-span-4 min-h-[220px]",
  ],
  [
    "/image/about/team-workspace.jpg",
    "Building together",
    "Focused development sprints delivering dependable, high-speed software.",
    "md:col-span-4 min-h-[220px]",
  ],
] as const;

export function AboutLife() {
  return (
    <AboutSection soft>
      <AboutContainer>
        <AboutIntro
          icon={Sparkles}
          eyebrow="Life at Apearix"
          title={
            <>
              Curiosity, Collaboration and{" "}
              <span className="block sm:inline">
                <GradientText>Continuous Growth.</GradientText>
              </span>
            </>
          }
          description="A glimpse into the culture, collaborative conversations, and creative problem-solving behind our engineering teams."
        />

        <div className="grid gap-6 md:grid-cols-12">
          {images.map(([src, title, desc, span]) => (
            <div
              key={title}
              className={`group relative min-h-[260px] overflow-hidden rounded-2xl border border-border shadow-sm transition-all duration-500 hover:-translate-y-1 hover:border-border-accent hover:shadow-2xl hover:shadow-[#6D28F5]/10 ${span}`}
            >
              <Image
                src={src}
                alt={title}
                fill
                className="object-cover transition duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-linear-to-t from-footer/85 via-footer/30 to-transparent" />
              <div className="absolute bottom-0 p-6 text-white sm:p-7">
                <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-purple-200 backdrop-blur-xs">
                  Apearix Culture
                </span>
                <h3 className="mt-3 text-xl font-bold tracking-tight text-white sm:text-2xl">
                  {title}
                </h3>
                {desc && <p className="mt-1.5 text-sm text-white/80 leading-relaxed">{desc}</p>}
              </div>
            </div>
          ))}
        </div>
      </AboutContainer>
    </AboutSection>
  );
}
