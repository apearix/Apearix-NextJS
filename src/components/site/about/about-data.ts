import type { LucideIcon } from "lucide-react";
import {
  Accessibility,
  Award,
  Blocks,
  Braces,
  BriefcaseBusiness,
  BrainCircuit,
  Cloud,
  CloudCog,
  Code2,
  Cpu,
  Database,
  GraduationCap,
  Handshake,
  HeartHandshake,
  HeartPulse,
  Landmark,
  Layers3,
  Lightbulb,
  LockKeyhole,
  Map,
  MessagesSquare,
  Monitor,
  MonitorSmartphone,
  Network,
  PencilRuler,
  Puzzle,
  RefreshCw,
  Rocket,
  Search,
  Server,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  SlidersHorizontal,
  Sparkles,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";

export type AboutCard = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export const whoWeAreCards: AboutCard[] = [
  { title: "Problem-first thinking", description: "Start with the real challenge, then shape the right technical response.", icon: Lightbulb },
  { title: "Purposeful engineering", description: "Build for clarity, maintainability and the needs of the people using it.", icon: Blocks },
  { title: "Thoughtful experiences", description: "Connect useful functionality with accessible, intuitive interfaces.", icon: MonitorSmartphone },
  { title: "Long-term perspective", description: "Make technology decisions with future improvement and growth in mind.", icon: TrendingUp },
];

export const principles: AboutCard[] = [
  { title: "Innovation", description: "We explore better ways to solve problems through technology.", icon: Lightbulb },
  { title: "Ownership", description: "We take responsibility for the quality and impact of our work.", icon: Handshake },
  { title: "Transparency", description: "We value clear communication and honest collaboration.", icon: MessagesSquare },
  { title: "Excellence", description: "We focus on quality, performance and attention to detail.", icon: Award },
  { title: "Collaboration", description: "We believe great outcomes come from working together.", icon: Users },
  { title: "Continuous Learning", description: "We keep learning, improving and adapting to new technologies.", icon: GraduationCap },
];

export const capabilities: AboutCard[] = [
  { title: "Custom Software Development", description: "Purpose-built applications shaped around business workflows.", icon: Code2 },
  { title: "Web Application Development", description: "Responsive, maintainable web platforms and experiences.", icon: Monitor },
  { title: "Website Development", description: "Clear, fast and conversion-aware digital experiences.", icon: Sparkles },
  { title: "AI & Workflow Automation", description: "Intelligent integrations and streamlined repetitive processes.", icon: BrainCircuit },
  { title: "E-commerce Solutions", description: "Storefronts and commerce journeys built around customers.", icon: ShoppingBag },
  { title: "Cloud & Infrastructure", description: "Deployment and infrastructure foundations for growth.", icon: Cloud },
  { title: "Digital Products", description: "Browser extensions, SaaS products and focused utilities.", icon: Puzzle },
  { title: "Maintenance & Support", description: "Ongoing improvements, fixes and technical assistance.", icon: HeartHandshake },
];

export const industries: AboutCard[] = [
  { title: "FinTech & Finance", description: "Digital workflows and tools for financial operations.", icon: Landmark },
  { title: "Healthcare", description: "Useful digital experiences for health-focused services.", icon: HeartPulse },
  { title: "Education & EdTech", description: "Learning platforms and tools that support education.", icon: GraduationCap },
  { title: "E-commerce & Retail", description: "Connected shopping, commerce and business operations.", icon: ShoppingCart },
  { title: "SaaS & Technology", description: "Scalable platforms and software-led services.", icon: Layers3 },
  { title: "Startups & Growing Businesses", description: "Practical technology foundations for evolving teams.", icon: Rocket },
];

export const approach: AboutCard[] = [
  { title: "Discover", description: "Understand business goals, requirements and challenges.", icon: Search },
  { title: "Strategize", description: "Define the solution, scope, technology and roadmap.", icon: Map },
  { title: "Design", description: "Create user-focused interfaces and experiences.", icon: PencilRuler },
  { title: "Develop", description: "Build reliable, scalable and maintainable software.", icon: Code2 },
  { title: "Test", description: "Validate functionality, quality, security and performance.", icon: ShieldCheck },
  { title: "Launch & Improve", description: "Deploy, monitor and continuously improve the solution.", icon: Rocket },
];

export const technologies = [
  { title: "Frontend", icon: Monitor, items: ["React", "Next.js", "TypeScript", "Tailwind CSS"] },
  { title: "Backend", icon: Server, items: ["Node.js", "NestJS", "Laravel", "REST APIs"] },
  { title: "Database", icon: Database, items: ["PostgreSQL", "MySQL", "MongoDB"] },
  { title: "Cloud & Tools", icon: CloudCog, items: ["Git", "Docker", "Cloud Infrastructure", "CI/CD"] },
];

export const commitments: AboutCard[] = [
  { title: "Clean, maintainable code", description: "", icon: Braces },
  { title: "Responsive-first development", description: "", icon: MonitorSmartphone },
  { title: "Performance optimization", description: "", icon: Zap },
  { title: "Security-conscious engineering", description: "", icon: LockKeyhole },
  { title: "Scalable architecture", description: "", icon: Network },
  { title: "Accessibility & usability", description: "", icon: Accessibility },
  { title: "Reliable deployment and long-term maintainability", description: "", icon: RefreshCw },
];

export const whyApearix: AboutCard[] = [
  { title: "Business-first thinking", description: "Technology choices start with the outcome the business needs.", icon: BriefcaseBusiness },
  { title: "Tailored engineering", description: "Solutions are shaped around real requirements and context.", icon: SlidersHorizontal },
  { title: "Modern technology", description: "Use the right tools for reliability, performance and scale.", icon: Cpu },
  { title: "User-focused experiences", description: "Make products understandable, accessible and useful.", icon: HeartHandshake },
  { title: "Transparent collaboration", description: "Keep communication clear throughout the work.", icon: MessagesSquare },
  { title: "Continuous improvement", description: "Treat launch as a milestone, not the end of the process.", icon: RefreshCw },
];
