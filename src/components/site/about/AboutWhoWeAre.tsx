import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";
import { AboutContainer, AboutIconCard, AboutIntro, AboutSection, GradientText } from "./AboutPrimitives";
import { whoWeAreCards } from "./about-data";

export function AboutWhoWeAre() {
  return (
    <AboutSection>
      <AboutContainer className="grid items-center gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:gap-16">
        <div>
          <AboutIntro
            icon={Compass}
            eyebrow="Who We Are"
            title={
              <>
                More Than a{" "}
                <span className="block">
                  <GradientText>Technology Company.</GradientText>
                </span>
              </>
            }
            description="Apearix brings engineering, problem-solving, and digital experience together to help turn complex business needs into useful technology."
          />
          <p className="mt-4 max-w-xl text-base leading-relaxed text-body sm:text-lg">
            Our work is guided by a simple idea: technology should make a meaningful difference. That means understanding the problem before choosing the tools, designing around the people who use the product, and building systems that can evolve with the business.
          </p>
          <Link
            href="/services"
            className="group mt-8 inline-flex items-center gap-2 text-sm sm:text-base font-semibold text-primary transition hover:text-[#5B21E6]"
          >
            <span>Explore what we do</span>
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {whoWeAreCards.map((item, idx) => (
            <AboutIconCard
              key={item.title}
              item={item}
              className={idx % 2 === 0 ? "sm:translate-y-6" : ""}
            />
          ))}
        </div>
      </AboutContainer>
    </AboutSection>
  );
}
