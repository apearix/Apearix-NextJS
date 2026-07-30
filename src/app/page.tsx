import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AIEngine } from "@/components/sections/AIEngine";
import { Capabilities } from "@/components/sections/Capabilities";
import { CaseStudies } from "@/components/sections/CaseStudies";
import { Hero } from "@/components/sections/Hero";
import { Metrics } from "@/components/sections/Metrics";
import { Process } from "@/components/sections/Process";
import { Showcase } from "@/components/sections/Showcase";
import { TechStack } from "@/components/sections/TechStack";
import { Testimonials } from "@/components/sections/Testimonials";
import { TrustedBy } from "@/components/sections/TrustedBy";
import { WhyApearix } from "@/components/sections/WhyApearix";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <TrustedBy />
      <WhyApearix />
      <Capabilities />
      <Process />
      <TechStack />
      <AIEngine />
      <Showcase />
      <CaseStudies />
      <Metrics />
      <Testimonials />
      <Footer />
    </>
  );
}
