import { Milestone } from "lucide-react";
import { AboutContainer, AboutIntro, AboutSection, GradientText } from "./AboutPrimitives";

const milestones = [
  [
    "The Starting Point",
    "A commitment to solving real business problems through thoughtful software engineering and high-performance digital experiences.",
  ],
  [
    "Building With Intent",
    "Unifying product thinking, UI/UX design, and clean architecture into one collaborative, agile engineering process.",
  ],
  [
    "Looking Ahead",
    "Continuously exploring next-generation AI agents, autonomous workflows, and scalable cloud systems that stand the test of time.",
  ],
] as const;

export function AboutJourney() {
  return (
    <AboutSection soft>
      <AboutContainer className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16 items-start">
        <AboutIntro
          icon={Milestone}
          eyebrow="Our Journey"
          title={
            <>
              Built With a Vision to Create{" "}
              <span className="block">
                <GradientText>Something Meaningful.</GradientText>
              </span>
            </>
          }
        />

        <div>
          <p className="text-base leading-relaxed text-body sm:text-lg">
            Apearix is shaped by the belief that good technology begins with curiosity and grows through disciplined execution. The journey is about bringing ideas, people, and engineering together to solve practical problems.
          </p>
          <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">
            As digital needs continue to evolve, our focus remains on learning, building, and improving—creating products and solutions that are useful today and adaptable for what comes next.
          </p>

          <div className="mt-10 border-l-2 border-border-accent pl-6 sm:pl-8">
            {milestones.map(([title, desc]) => (
              <div key={title} className="relative pb-10 last:pb-0">
                <span className="absolute -left-[31px] sm:-left-[39px] top-1 h-3.5 w-3.5 rounded-full border-2 border-primary bg-white shadow-sm" />
                <div className="text-lg font-bold text-heading sm:text-xl">
                  {title}
                </div>
                <p className="mt-2 text-sm leading-relaxed text-body sm:text-base">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </AboutContainer>
    </AboutSection>
  );
}
