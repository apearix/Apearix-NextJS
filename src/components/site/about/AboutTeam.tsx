import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Link2, Globe, Users } from "lucide-react";
import { AboutContainer, AboutIntro, AboutSection, GradientText } from "./AboutPrimitives";

const team = [
  [
    "Riya Sharma",
    "UI/UX Designer",
    "Shapes clear, accessible product experiences from early concepts to high-fidelity design systems.",
    "/image/about/team-riya.jpg",
  ],
  [
    "Kabir Verma",
    "Full Stack Developer",
    "Builds dependable web applications with a focus on maintainable Next.js architecture and robust APIs.",
    "/image/about/team-kabir.jpg",
  ],
  [
    "Arjun Patel",
    "Backend Developer",
    "Architects high-throughput server-side systems, AI agent integrations, and scalable database schemas.",
    "/image/about/team-arjun.jpg",
  ],
  [
    "Ananya Rao",
    "Frontend Developer",
    "Turns intricate UI designs into fluid, responsive interfaces with high Core Web Vitals performance.",
    "/image/about/team-ananya.jpg",
  ],
  [
    "Dev Malhotra",
    "Technical Lead",
    "Guides system architecture, security standards, code quality, and agile engineering practices.",
    "/image/about/team-arjun.jpg",
  ],
  [
    "Neha Kapoor",
    "Project Coordinator",
    "Keeps sprints aligned on deliverables, seamless client communication, and milestone precision.",
    "/image/about/team-riya.jpg",
  ],
] as const;

export function AboutTeam() {
  return (
    <AboutSection id="team" soft>
      <AboutContainer>
        <div className="mb-10 flex flex-col justify-between gap-6 md:mb-14 md:flex-row md:items-end">
          <AboutIntro
            icon={Users}
            eyebrow="The People Behind Apearix"
            title={
              <>
                Good People. Great Ideas.{" "}
                <span className="block sm:inline">
                  <GradientText>Better Technology.</GradientText>
                </span>
              </>
            }
            description="Our multidisciplinary engineering and design team is dedicated to building software that drives measurable business impact."
          />
          <Link
            href="/careers"
            className="group mb-10 md:mb-12 inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full border border-border bg-white px-7 text-sm font-semibold text-heading transition-all duration-300 hover:border-border-accent hover:text-primary active:scale-[0.98]"
          >
            <span>Join Our Team</span>
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {team.map(([name, role, desc, image]) => (
            <article
              key={name}
              className="group overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition-all duration-500 hover:-translate-y-1.5 hover:border-border-accent hover:shadow-2xl hover:shadow-[#6D28F5]/10"
            >
              <div className="relative aspect-[4/3.8] overflow-hidden bg-primary-light">
                <Image
                  src={image}
                  alt={`${name}, ${role}`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <span className="absolute left-3.5 top-3.5 rounded-full border border-border-accent bg-white/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary shadow-sm backdrop-blur-xs">
                  Team Member
                </span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold tracking-tight text-heading sm:text-2xl transition-colors group-hover:text-primary">
                  {name}
                </h3>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-primary sm:text-sm">
                  {role}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-body">
                  {desc}
                </p>
                <div className="mt-5 flex items-center gap-3 border-t border-border pt-4">
                  <a
                    href="https://www.linkedin.com/company/apearix/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${name} LinkedIn`}
                    className="grid h-9 w-9 place-items-center rounded-xl border border-border bg-surface text-muted transition hover:border-border-accent hover:bg-primary-light hover:text-primary"
                  >
                    <Link2 className="h-3.5 w-3.5" />
                  </a>
                  <a
                    href="https://www.apearix.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${name} profile`}
                    className="grid h-9 w-9 place-items-center rounded-xl border border-border bg-surface text-muted transition hover:border-border-accent hover:bg-primary-light hover:text-primary"
                  >
                    <Globe className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </AboutContainer>
    </AboutSection>
  );
}
