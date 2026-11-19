import { Globe2 } from "lucide-react";
import { AboutContainer, AboutIconCard, AboutIntro, AboutSection, GradientText } from "./AboutPrimitives";
import { industries } from "./about-data";

export function AboutIndustries() {
  return (
    <AboutSection soft>
      <AboutContainer>
        <AboutIntro
          centered
          icon={Globe2}
          eyebrow="Industry Focus"
          title={
            <>
              Technology That Adapts to{" "}
              <span className="block sm:inline">
                <GradientText>Different Industries.</GradientText>
              </span>
            </>
          }
          description="Flexible engineering architectures crafted around specific operational requirements, compliance standards, and user journeys."
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {industries.map((item) => (
            <AboutIconCard key={item.title} item={item} />
          ))}
        </div>
      </AboutContainer>
    </AboutSection>
  );
}
