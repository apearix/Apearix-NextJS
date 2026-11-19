import { ShieldCheck } from "lucide-react";
import { AboutContainer, AboutIconCard, AboutIntro, AboutSection, GradientText } from "./AboutPrimitives";
import { commitments } from "./about-data";

export function AboutCommitment() {
  return (
    <AboutSection>
      <AboutContainer>
        <AboutIntro
          icon={ShieldCheck}
          eyebrow="Our Commitment"
          title={
            <>
              Quality Is Not an Extra.{" "}
              <span className="block sm:inline">
                <GradientText>It&apos;s Part of the Process.</GradientText>
              </span>
            </>
          }
          description="Good engineering is measured not only by what ships, but by how reliably it performs, how easily it evolves, and how well it serves end users."
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {commitments.map((item, index) => (
            <AboutIconCard
              key={item.title}
              item={item}
              className={index === commitments.length - 1 ? "sm:col-span-2 lg:col-span-1" : ""}
            />
          ))}
        </div>
      </AboutContainer>
    </AboutSection>
  );
}
