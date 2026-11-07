import { Metadata } from "next";
import { Navbar } from "@/components/site/layout/Navbar";
import { Footer } from "@/components/site/layout/Footer";
import { PageHeader } from "@/components/site/layout/PageHeader";
import { CareersClient } from "@/components/site/careers/CareersClient";
import { Code, Laptop, Heart, GraduationCap, Clock, ShieldCheck } from "lucide-react";
import { fetchPublishedJobs } from "@/lib/services/site/careers";
import type { JobFormValues } from "@/schemas/career.schema";

export const metadata: Metadata = {
  title: "Careers | Software Engineering & AI Jobs | Apearix",
  description:
    "Join Apearix. Explore remote-first software engineering, AI automation, and UI/UX design roles built around craftsmanship and innovation.",
  keywords: [
    "Software Engineering Jobs",
    "Remote Next.js Jobs",
    "AI Systems Engineer Jobs",
    "UI UX Designer Careers",
    "Apearix Careers",
  ],
  alternates: {
    canonical: "https://www.apearix.com/company/careers",
  },
  openGraph: {
    title: "Careers at Apearix | Join Our Engineering Team",
    description:
      "Join Apearix. Explore engineering, design, and AI automation roles at a remote-first software company.",
    url: "https://www.apearix.com/company/careers",
    siteName: "Apearix",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Careers at Apearix | Join Our Engineering Team",
    description: "Join Apearix. Explore engineering, design, and AI automation roles.",
    site: "@apearix",
    creator: "@apearix",
  },
};

const DEFAULT_SAMPLE_ROLES: JobFormValues[] = [
  {
    id: "sample-1",
    title: "Senior Full Stack Engineer (Next.js & TypeScript)",
    slug: "senior-full-stack-engineer-nextjs-typescript",
    department: "Engineering",
    job_type: "Full-Time",
    workplace_type: "Remote",
    location: "Remote (Worldwide)",
    experience_level: "4+ Years",
    salary_min: 90000,
    salary_max: 130000,
    salary_currency: "USD",
    is_salary_disclosed: true,
    overview:
      "We are looking for a Senior Full Stack Engineer passionate about Next.js App Router, TypeScript, server components, and building 60fps web applications.",
    responsibilities: [
      "Architect and scale modern SaaS platforms using Next.js, Node.js, and PostgreSQL.",
      "Work directly with founding engineers on end-to-end features from schema design to UI polish.",
      "Optimize core web vitals, server-side caching, and client responsiveness.",
    ],
    requirements: [
      "Strong fluency with TypeScript, React 19, and Next.js App Router.",
      "Demonstrated experience building scalable relational database schemas with TypeORM or Prisma.",
      "Deep understanding of async communication, web security, and clean API design.",
    ],
    benefits: [
      "100% Remote-first culture",
      "Apple Silicon Mac hardware allowance",
      "Annual $2,000 learning stipend",
      "Generous paid time off",
    ],
    status: "published",
    is_featured: true,
    order: 1,
  },
  {
    id: "sample-2",
    title: "AI Systems & Automation Engineer",
    slug: "ai-systems-automation-engineer",
    department: "AI R&D",
    job_type: "Full-Time",
    workplace_type: "Remote",
    location: "Remote (Worldwide)",
    experience_level: "3+ Years",
    salary_min: 95000,
    salary_max: 140000,
    salary_currency: "USD",
    is_salary_disclosed: true,
    overview:
      "Build autonomous LLM agents, vector retrieval RAG pipelines, and multi-model workflow automations for enterprise clients.",
    responsibilities: [
      "Develop custom AI agent workflows and tool-calling execution engines.",
      "Design low-latency vector database indexing pipelines using pgvector and Pinecone.",
      "Benchmark model outputs, implement guardrails, and evaluate token efficiencies.",
    ],
    requirements: [
      "Solid experience with Python / TypeScript, LangChain / LlamaIndex, or raw LLM APIs.",
      "Deep understanding of embeddings, semantic search, and prompt optimization.",
      "Background with vector databases, Docker, and cloud orchestration.",
    ],
    benefits: [
      "Direct exposure to cutting-edge AI architectures",
      "Flexible schedule with asynchronous collaboration",
      "Comprehensive health coverage",
    ],
    status: "published",
    is_featured: true,
    order: 2,
  },
  {
    id: "sample-3",
    title: "Senior UI/UX Design Engineer",
    slug: "senior-ui-ux-design-engineer",
    department: "Product Design",
    job_type: "Full-Time",
    workplace_type: "Remote",
    location: "Remote (Worldwide)",
    experience_level: "3-5 Years",
    salary_min: 75000,
    salary_max: 110000,
    salary_currency: "USD",
    is_salary_disclosed: true,
    overview:
      "Bridge the gap between design craftsmanship and code. Build pixel-perfect design systems, interactive prototypes, and fluid micro-animations.",
    responsibilities: [
      "Craft tokenized design systems in Figma and translate them into production React/Tailwind code.",
      "Build interactive micro-animations with Framer Motion and modern CSS.",
      "Conduct user testing and iterate on complex workflows to make software effortless to use.",
    ],
    requirements: [
      "Outstanding portfolio demonstrating both Figma design mastery and front-end code implementation.",
      "Mastery over Tailwind CSS, typography, layout hierarchies, and accessibility standards.",
    ],
    benefits: [
      "Creative freedom to define the Apearix aesthetic",
      "Remote work stipend",
      "Generous health & wellness benefits",
    ],
    status: "published",
    is_featured: false,
    order: 3,
  },
  {
    id: "sample-4",
    title: "Mobile Application Developer (Flutter / React Native)",
    slug: "mobile-application-developer-flutter-react-native",
    department: "Mobile",
    job_type: "Full-Time",
    workplace_type: "Remote",
    location: "Remote (Worldwide)",
    experience_level: "3+ Years",
    salary_min: 80000,
    salary_max: 115000,
    salary_currency: "USD",
    is_salary_disclosed: false,
    overview:
      "Develop silky-smooth 60fps cross-platform iOS & Android mobile applications with offline-first synchronization.",
    responsibilities: [
      "Develop and maintain high-performance mobile applications across iOS and Android.",
      "Integrate biometrics, push notifications, offline local SQLite storage, and deep links.",
      "Manage release pipelines through Apple App Store and Google Play Store.",
    ],
    requirements: [
      "Proven mobile apps shipped on the App Store or Google Play.",
      "Experience with Flutter or React Native, state management, and native bridging.",
    ],
    benefits: [
      "Device allowance and test hardware provided",
      "Flexible hours",
      "Comprehensive insurance coverage",
    ],
    status: "published",
    is_featured: false,
    order: 4,
  },
];

export default async function CareersPage() {
  const { items: fetchedJobs, departments: fetchedDepts } =
    await fetchPublishedJobs();

  // Use live database jobs if available; fallback to sample positions if DB is empty
  const jobs = fetchedJobs.length > 0 ? fetchedJobs : DEFAULT_SAMPLE_ROLES;

  const departments =
    fetchedDepts.length > 0
      ? fetchedDepts
      : Array.from(new Set(jobs.map((j) => j.department)));

  // Generate dynamic Google Jobs Schema.org JSON-LD
  const jsonLdCareers = {
    "@context": "https://schema.org",
    "@type": "CareersPage",
    "@id": "https://www.apearix.com/company/careers/#webpage",
    name: "Careers at Apearix",
    url: "https://www.apearix.com/company/careers",
    description:
      "Explore open software engineering, design, and AI automation roles at Apearix.",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: jobs.map((job, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        item: {
          "@type": "JobPosting",
          title: job.title,
          description: job.overview,
          employmentType:
            job.job_type === "Contract"
              ? "CONTRACTOR"
              : job.job_type === "Internship"
                ? "INTERN"
                : "FULL_TIME",
          jobLocation: {
            "@type": "Place",
            address: {
              "@type": "PostalAddress",
              addressCountry: job.location || "Remote",
            },
          },
          hiringOrganization: {
            "@id": "https://www.apearix.com/#organization",
            name: "Apearix",
            sameAs: "https://www.apearix.com",
          },
        },
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdCareers) }}
      />
      <main>
        <PageHeader
          badge="Join Our Team"
          title="Build software people enjoy using."
          subtitle="We are looking for engineers, designers, and thinkers who care about craftsmanship, performance, and building meaningful digital products."
          breadcrumbs={[
            { label: "Company", href: "/about" },
            { label: "Careers", href: "/careers" },
          ]}
        />

        {/* Benefits & Culture */}
        <section className="py-20 md:py-28 bg-white border-b border-border">
          <div className="container max-w-7xl mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <span className="text-xs font-bold uppercase tracking-wider text-[#6D28F5] mb-3 block">
                Engineering Culture
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#111827] tracking-tight mb-4">
                Why Work at Apearix?
              </h2>
              <p className="text-base sm:text-lg text-[#4B5563] leading-relaxed">
                We believe in small, autonomous teams that prioritize deep work,
                clear communication, and high technical standards over
                bureaucracy.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Laptop className="w-6 h-6" />,
                  title: "Remote-First Environment",
                  desc: "Work from wherever you are most productive with flexible hours and asynchronous communication.",
                },
                {
                  icon: <Code className="w-6 h-6" />,
                  title: "Craftsmanship Focus",
                  desc: "We prioritize clean code, modern tech stacks (Next.js, TypeScript, AI), and zero legacy bloat.",
                },
                {
                  icon: <GraduationCap className="w-6 h-6" />,
                  title: "Continuous Learning",
                  desc: "Annual learning stipends, book allowances, and dedicated time for experimental R&D.",
                },
                {
                  icon: <Clock className="w-6 h-6" />,
                  title: "Work-Life Harmony",
                  desc: "Sustainable workloads, zero artificial crunch time, and generous paid time off.",
                },
                {
                  icon: <Heart className="w-6 h-6" />,
                  title: "Health & Wellness",
                  desc: "Comprehensive health coverage and wellness stipends for mind and body.",
                },
                {
                  icon: <ShieldCheck className="w-6 h-6" />,
                  title: "Top-Tier Hardware",
                  desc: "Apple Silicon hardware setups, 4K displays, and premium software licenses.",
                },
              ].map((perk, i) => (
                <div
                  key={i}
                  className="p-8 rounded-[12px] bg-[#FAFAFC] border border-[#E5E7EB] shadow-sm hover:border-[#DDD6FE] transition-colors"
                >
                  <div className="w-12 h-12 rounded-[10px] bg-[#F4F0FF] text-[#6D28F5] flex items-center justify-center mb-6">
                    {perk.icon}
                  </div>
                  <h3 className="text-xl font-bold text-[#111827] mb-3">
                    {perk.title}
                  </h3>
                  <p className="text-sm text-[#4B5563] leading-relaxed">
                    {perk.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Dynamic Open Positions Section */}
        <section className="py-20 md:py-28 bg-[#FAFAFC] border-b border-[#E5E7EB]">
          <div className="container max-w-7xl mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center mb-14">
              <span className="text-xs font-bold uppercase tracking-wider text-[#6D28F5] mb-3 block">
                Openings
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#111827] tracking-tight mb-4">
                Open Roles
              </h2>
              <p className="text-base sm:text-lg text-[#4B5563] leading-relaxed">
                Explore our current openings and help us craft extraordinary
                software.
              </p>
            </div>

            {/* Interactive Filterable Careers Client */}
            <CareersClient initialJobs={jobs} departments={departments} />
          </div>
        </section>
      </main>
    </>
  );
}
