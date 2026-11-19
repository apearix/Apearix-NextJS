import { Layers } from "lucide-react";
import { AboutContainer, AboutIconCard, AboutIntro, AboutSection, GradientText } from "./AboutPrimitives";
import { capabilities } from "./about-data";

export function AboutCapabilities() {
  return (
    <AboutSection>
      <AboutContainer>
        <AboutIntro
          icon={Layers}
          eyebrow="What We Do"
          title={
            <>
              Engineering Across the{" "}
              <span className="block sm:inline">
                <GradientText>Digital Spectrum.</GradientText>
              </span>
            </>
          }
          description="Full-cycle engineering capabilities designed to build, optimize, and scale software across the modern digital lifecycle."
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {capabilities.map((item) => (
            <AboutIconCard key={item.title} item={item} />
          ))}
        </div>
      </AboutContainer>
    </AboutSection>
  );
}
