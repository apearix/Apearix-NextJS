export interface ServiceProcessStep {
  step: string;
  title: string;
  description: string;
}

export interface ServiceFAQ {
  question: string;
  answer: string;
}

export interface ServiceOffering {
  id: string;
  slug:
    | "ai-automation"
    | "cloud-devops"
    | "mobile-app-development"
    | "saas-development"
    | "ui-ux-design"
    | "web-development";
  title: string;
  badge: string;
  tagline: string;
  shortDescription: string;
  fullOverview: string;
  iconName: "Sparkles" | "Cloud" | "Smartphone" | "Layers" | "Palette" | "Code2";
  featured?: boolean;
  order: number;
  metrics: {
    stat: string;
    label: string;
  };
  deliverables: string[];
  subCapabilities: {
    title: string;
    description: string;
  }[];
  techStack: string[];
  process: ServiceProcessStep[];
  faqs: ServiceFAQ[];
}

export const SERVICES_DATA: ServiceOffering[] = [
  {
    id: "srv-ai-automation",
    slug: "ai-automation",
    title: "AI & Workflow Automation",
    badge: "Agentic AI",
    tagline: "Autonomous multi-agent workflows, vector RAG pipelines, and enterprise LLM integrations.",
    shortDescription:
      "Transform human bottlenecks into self-executing systems. We engineer resilient autonomous agents, custom retrieval-augmented generation (RAG) engines, and automated document intelligence platforms.",
    fullOverview:
      "Apearix builds enterprise-ready AI orchestration layers that interact with your production databases, APIs, and file repositories. From fine-tuned prompt pipelines and guardrailed tool calling to hybrid semantic vector retrieval, we build systems designed for measurable token efficiency, high inference speed, and zero hallucination tolerance.",
    iconName: "Sparkles",
    featured: true,
    order: 1,
    metrics: {
      stat: "85%+",
      label: "Manual Effort Reduction",
    },
    deliverables: [
      "Autonomous Multi-Agent Task Orchestration",
      "Enterprise RAG & Hybrid Vector Search Systems",
      "Automated OCR & Document Structuring Ingestion",
      "Custom Model Tool-Calling & API Connectors",
      "Inference Latency & Token Optimization Guardrails",
    ],
    subCapabilities: [
      {
        title: "Agentic Tool Swarms",
        description: "Autonomous reasoning loops capable of query parsing, third-party API calling, and structured database mutations.",
      },
      {
        title: "Enterprise Vector Knowledge Bases",
        description: "Hybrid keyword + semantic embeddings indexing via pgvector and Pinecone with continuous re-ranking algorithms.",
      },
      {
        title: "Intelligent Data Processing",
        description: "Zero-data-leakage OCR ingestion pipelines converting PDFs, scanned invoices, and unstructured logs into validated JSON schemas.",
      },
    ],
    techStack: ["Python", "FastAPI", "Pinecone", "pgvector", "LangChain", "OpenAI / Claude APIs", "Docker"],
    process: [
      {
        step: "01",
        title: "Knowledge Audit & Schema Mapping",
        description: "Evaluating corporate knowledge sources, token security compliance, and targeted automated outcomes.",
      },
      {
        step: "02",
        title: "Pipeline & Agent Prototyping",
        description: "Implementing retrieval chunking heuristics, agentic state machines, and system guardrail validations.",
      },
      {
        step: "03",
        title: "Evaluation & Production Scaling",
        description: "Benchmarking retrieval accuracy against test suites, optimizing token economics, and cloud deployment.",
      },
    ],
    faqs: [
      {
        question: "Can our proprietary data remain strictly private?",
        answer: "Yes. We configure private cloud instances, strict zero-data-retention APIs, or fully self-hosted local LLMs to safeguard customer data.",
      },
      {
        question: "How do you mitigate AI hallucinations in business-critical processes?",
        answer: "We enforce strict JSON output schemas, hybrid vector verification checks, deterministic fallback logic, and human-in-the-loop triggers.",
      },
    ],
  },
  {
    id: "srv-cloud-devops",
    slug: "cloud-devops",
    title: "Cloud Architecture & DevOps",
    badge: "Infrastructure",
    tagline: "Zero-downtime microservices, containerization, and automated CI/CD continuous delivery.",
    shortDescription:
      "Enterprise infrastructure designed for extreme reliability. We configure automated cloud topologies, blue/green release pipelines, container orchestration, and continuous telemetry monitoring.",
    fullOverview:
      "We design resilient, self-healing cloud setups across AWS, Google Cloud, and dedicated VPS nodes. Through declarative Infrastructure as Code (IaC), container clusters, and hardened network security, Apearix protects your deployments from latency spikes, cascading service failures, and human deployment errors.",
    iconName: "Cloud",
    featured: false,
    order: 2,
    metrics: {
      stat: "99.99%",
      label: "Guaranteed Production Uptime",
    },
    deliverables: [
      "Infrastructure as Code (IaC via Terraform & Docker)",
      "Zero-Downtime Blue/Green Deployments",
      "Automated GitHub Actions CI/CD Delivery Pipelines",
      "SOC2-Compliant Security, Secrets & VPC Hardening",
      "Centralized APM, Log Aggregation & Incident Alerts",
    ],
    subCapabilities: [
      {
        title: "Continuous Delivery Automations",
        description: "Hermetic container build workflows with automated integration suites, branch previews, and canary rollouts.",
      },
      {
        title: "Database Topologies & Caching",
        description: "High-availability PostgreSQL replication, read replicas, automated point-in-time recovery, and Redis caching layers.",
      },
      {
        title: "Hardened Network Edge",
        description: "Cloudflare enterprise routing, WAF rules, DDoS mitigation, and SSL/TLS automation for all service gateways.",
      },
    ],
    techStack: ["Docker", "AWS / GCP", "Terraform", "GitHub Actions", "PostgreSQL", "Redis", "Nginx"],
    process: [
      {
        step: "01",
        title: "Infrastructure & Security Audit",
        description: "Assessing current server load patterns, network topology, backup resilience, and deployment vulnerabilities.",
      },
      {
        step: "02",
        title: "Declarative Code Configuration",
        description: "Codifying all server resources into reproducible Terraform blueprints and containerizing runtime environments.",
      },
      {
        step: "03",
        title: "Automated Pipeline Handover",
        description: "Wiring webhook-triggered test pipelines, canary stages, and real-time observability telemetry dashboards.",
      },
    ],
    faqs: [
      {
        question: "How do you handle zero-downtime database migrations?",
        answer: "We use multi-phase expand/contract schema evolution patterns and automated rollback scripts to ensure zero user disruptions.",
      },
      {
        question: "Do you support self-hosted or dedicated bare-metal setups?",
        answer: "Yes, we architect for AWS/GCP hyperscalers as well as dedicated bare-metal setups using Docker Swarm or lightweight Kubernetes.",
      },
    ],
  },
  {
    id: "srv-mobile-app-dev",
    slug: "mobile-app-development",
    title: "Mobile App Development",
    badge: "Cross-Platform",
    tagline: "Silky 60fps native iOS & Android applications powered by Flutter and Dart.",
    shortDescription:
      "Craft modern mobile experiences with unified codebases. We build cross-platform mobile apps complete with offline-first synchronization, real-time telemetry, and hardware integrations.",
    fullOverview:
      "Apearix engineers performance-first mobile products. By leveraging Flutter and Dart, we deliver applications that look, feel, and perform like handwritten native Swift and Kotlin apps. Every product includes offline-first local databases, real-time push alerts, biometric protection, and deep-link routing.",
    iconName: "Smartphone",
    featured: false,
    order: 3,
    metrics: {
      stat: "60 FPS",
      label: "Fluid Native Frame Delivery",
    },
    deliverables: [
      "Unified iOS & Android Releases from a Single Codebase",
      "Offline-First SQLite, Isar & Room Cache Synchronization",
      "Biometric Authentication & Native Hardware Bridges",
      "Live GPS Telemetry & Background Tracking Engines",
      "Automated Play Store & App Store Distribution Pipelines",
    ],
    subCapabilities: [
      {
        title: "Reactive State Architecture",
        description: "Maintainable state management via Riverpod / BLoC separating business logic from UI paint loops cleanly.",
      },
      {
        title: "Background Processing & Sync",
        description: "Continuous background sync queues that queue network mutations and sync automatically when internet connectivity returns.",
      },
      {
        title: "Platform Hardware Channels",
        description: "Custom native Kotlin & Swift bridging for specialized hardware access: Bluetooth peripherals, camera lenses, and sensors.",
      },
    ],
    techStack: ["Flutter", "Dart", "Firebase", "SQLite", "Riverpod", "Android SDK", "iOS Xcode"],
    process: [
      {
        step: "01",
        title: "Mobile UX & Architecture Plan",
        description: "Formulating offline-first sync topologies, screen routing graphs, and design system component standards.",
      },
      {
        step: "02",
        title: "Feature Sprints & Hardware Bridges",
        description: "Writing typed UI layouts, native platform bridges, local persistent stores, and unit-tested business logic.",
      },
      {
        step: "03",
        title: "TestFlight & Release Certification",
        description: "Running automated device farm regression tests, resolving store compliance checks, and publishing to stores.",
      },
    ],
    faqs: [
      {
        question: "Does Flutter compromise performance compared to pure native code?",
        answer: "No. Flutter compiles directly to machine ARM code and renders via Impeller, ensuring consistent 60–120 FPS performance.",
      },
      {
        question: "Can you assist with App Store and Google Play rejections?",
        answer: "Yes, our team handles metadata compliance, privacy manifest declarations, permissions justifications, and store approvals.",
      },
    ],
  },
  {
    id: "srv-saas-development",
    slug: "saas-development",
    title: "SaaS Product Engineering",
    badge: "Cloud Software",
    tagline: "End-to-end multi-tenant SaaS platforms built for scale, recurring monetization, and speed.",
    shortDescription:
      "Turn product visions into scalable cloud software. We engineer multi-tenant SaaS backends, tiered subscription systems, administrative dashboards, and self-serve onboarding journeys.",
    fullOverview:
      "Building a viable SaaS demands more than typical web pages. Apearix architects complete subscription platforms built for recurring revenue, tenant isolation, compliance audit logs, Stripe/Razorpay billing cycles, and low-latency client performance using modern Next.js and NestJS foundations.",
    iconName: "Layers",
    featured: true,
    order: 4,
    metrics: {
      stat: "4x Faster",
      label: "Time-to-Market MVP Cadence",
    },
    deliverables: [
      "Multi-Tenant Database Architectures (Schema & Row-Level Isolation)",
      "Automated Recurring Billing (Stripe / Razorpay Subscriptions)",
      "Enterprise Role-Based Access Control (RBAC) & Team Workspaces",
      "Real-Time Analytics Dashboards & Data Visualization",
      "Developer-Facing REST & Webhook API Ecosystems",
    ],
    subCapabilities: [
      {
        title: "Tenant Isolation Security",
        description: "Configuring schema-level or row-level tenant security to guarantee total data privacy between enterprise accounts.",
      },
      {
        title: "Lifecycle Billing Automations",
        description: "Handling trial flows, plan upgrades, usage metering, payment retries, dunning emails, and tax invoice generation.",
      },
      {
        title: "Granular Team Permissions",
        description: "Configurable workspace invitations, permission matrix tables, audit logging, and single sign-on (SSO) connectors.",
      },
    ],
    techStack: ["Next.js", "NestJS", "TypeScript", "PostgreSQL", "TypeORM", "Tailwind CSS", "Stripe"],
    process: [
      {
        step: "01",
        title: "Data Modeling & Multi-Tenancy Strategy",
        description: "Establishing tenant isolation models, database normalization, subscription tiers, and API contract designs.",
      },
      {
        step: "02",
        title: "Core Platform Development",
        description: "Constructing authentication, workspace onboarding, payment webhooks, and performant data tables.",
      },
      {
        step: "03",
        title: "Hardening & Production Launch",
        description: "Enforcing API rate limits, edge caching, webhook idempotency, and automated database backups.",
      },
    ],
    faqs: [
      {
        question: "How do you protect cross-tenant data leakage?",
        answer: "We implement rigorous database Row-Level Security (RLS) policies and tenant-scoped database sessions across every query.",
      },
      {
        question: "Can we support both credit card and regional payment gateways?",
        answer: "Yes, we integrate unified billing engines supporting Stripe, Razorpay, LemonSqueezy, and wire invoice workflows.",
      },
    ],
  },
  {
    id: "srv-ui-ux-design",
    slug: "ui-ux-design",
    title: "UI/UX & Design Systems",
    badge: "Design Systems",
    tagline: "Tokenized design systems, accessible ergonomics, and pixel-precise front-end handoffs.",
    shortDescription:
      "Bridge the void between aesthetic design and code implementation. We build cohesive, accessible design tokens in Figma and convert them into battle-tested React UI systems.",
    fullOverview:
      "Great software pairs visual refinement with interaction speed. We design clean layouts, contrast-tested typography scales, responsive grids, and micro-interactions. Every Figma component directly reflects Tailwind CSS variables to eliminate design-to-code friction.",
    iconName: "Palette",
    featured: false,
    order: 5,
    metrics: {
      stat: "WCAG 2.1",
      label: "AA Accessibility Compliance",
    },
    deliverables: [
      "Tokenized Figma Design System Libraries (Dark & Light Modes)",
      "High-Fidelity Interactive Prototypes & User Flow Diagrams",
      "Pixel-Matched Tailwind CSS Component Implementations",
      "Micro-Animations, Page Transitions & Skeleton Loaders",
      "Full Product Usability Audits & Friction Elimination",
    ],
    subCapabilities: [
      {
        title: "Design Tokens in Production",
        description: "Harmonizing typography scales, spacing units, and color palettes into semantic CSS variables for instant themes.",
      },
      {
        title: "Complex Workspace UX",
        description: "Designing uncluttered information architectures for dense data tables, modal drawers, and multi-step workflows.",
      },
      {
        title: "Motion & Feedback Dynamics",
        description: "Crafting micro-interactions with Framer Motion that provide immediate, tactile feedback for user actions.",
      },
    ],
    techStack: ["Figma", "Tailwind CSS", "Framer Motion", "Radix UI", "CSS Variables", "Design Tokens"],
    process: [
      {
        step: "01",
        title: "User Journey & Wireframe Scaffolding",
        description: "Mapping core conversion funnels, screen states, navigation hierarchies, and content density priorities.",
      },
      {
        step: "02",
        title: "Tokenized System Definition",
        description: "Establishing primary colors, high-contrast typography, interactive button states, and Figma variables.",
      },
      {
        step: "03",
        title: "Code Sync & Interactive Handoff",
        description: "Translating layouts directly into clean, modular Tailwind CSS and accessible React JSX components.",
      },
    ],
    faqs: [
      {
        question: "Do you design both Dark and Light mode interfaces?",
        answer: "Yes. All design components are built with matched token pairs for seamless, system-respecting dark and light modes.",
      },
      {
        question: "Will developers receive organized Figma files?",
        answer: "Absolutely. Our Figma files are fully organized using auto-layout, named token variables, and detailed component states.",
      },
    ],
  },
  {
    id: "srv-web-development",
    slug: "web-development",
    title: "Modern Web Engineering",
    badge: "Full-Stack Web",
    tagline: "Sub-second load times, dynamic App Router architecture, and enterprise SEO performance.",
    shortDescription:
      "Craft high-velocity web applications that perform under traffic. We build modern frontends and robust backends with Next.js, TypeScript, and clean modular APIs.",
    fullOverview:
      "Modern web platforms need instant rendering, top-notch SEO discovery, and strict type safety. Apearix builds websites using the Next.js App Router, React Server Components (RSC), and edge computing. The result is instant navigation, clean code architecture, and high search engine rankings.",
    iconName: "Code2",
    featured: true,
    order: 6,
    metrics: {
      stat: "< 100ms",
      label: "First Contentful Paint Target",
    },
    deliverables: [
      "Next.js App Router & React Server Component (RSC) Architecture",
      "Search Engine Optimization (Structured JSON-LD & Dynamic Sitemaps)",
      "High-Performance Edge Caching & Incremental Static Regeneration (ISR)",
      "Type-Safe API Routes with Zod Runtime Schema Validation",
      "Dynamic CMS Integrations & Real-Time Content Publishing",
    ],
    subCapabilities: [
      {
        title: "React Server Components",
        description: "Minimizing client bundle sizes by moving data-heavy queries and operations directly to the server tier.",
      },
      {
        title: "Technical SEO & Performance",
        description: "Structured Schema.org markup, optimized image delivery, and sub-second page performance across devices.",
      },
      {
        title: "Secure API Communication",
        description: "Zod-validated API endpoints, strict CORS policies, and rate-limited route handlers preventing abuse.",
      },
    ],
    techStack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Node.js", "PostgreSQL", "Zod"],
    process: [
      {
        step: "01",
        title: "Architecture & Component Tree Planning",
        description: "Designing route structures, Server vs Client component boundaries, and schema data models.",
      },
      {
        step: "02",
        title: "Full-Stack Implementation",
        description: "Developing responsive UI screens, connecting type-safe API queries, and verifying data validation flows.",
      },
      {
        step: "03",
        title: "Vitals Hardening & Deployment",
        description: "Running Core Web Vitals audits, verifying OpenGraph cards and metadata, and deploying to production.",
      },
    ],
    faqs: [
      {
        question: "Why do you use Next.js App Router for web applications?",
        answer: "It provides optimal SEO indexing, instant server-side page hydration, and small JavaScript bundles sent to browsers.",
      },
      {
        question: "Can this scale to hundreds of thousands of monthly visitors?",
        answer: "Yes. By using edge caching and ISR, pages are served directly from global CDNs with minimal server compute load.",
      },
    ],
  },
];

export const SERVICE_HIGHLIGHT_METRICS = [
  { value: "99.9%", label: "Uptime & Production Reliability" },
  { value: "85%+", label: "Workflow Automation Gains" },
  { value: "Sub-100ms", label: "Core API Response Times" },
  { value: "Clean-Code", label: "Type-Safe Architecture" },
];