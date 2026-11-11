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
        badge="Careers at Apearix"
          title="Build Technology That Moves the World Forward."
          subtitle="Join Apearix to build real-world web apps, smart automation tools, and software that actually makes a difference."
          breadcrumbs={[
            { label: "Company", href: "/about" },
            { label: "Careers", href: "/careers" },
          ]}
        />
 

        {/* Dynamic Open Positions Section */}
        <section className="py-14">
          <div className="container max-w-7xl mx-auto px-6">
            

            {/* Interactive Filterable Careers Client */}
            <CareersClient initialJobs={jobs} departments={departments} />
          </div>
        </section>
      </main>
    </>
  );
}
