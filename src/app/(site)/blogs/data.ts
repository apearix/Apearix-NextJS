export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  snippet: string;
  category: "Engineering Deep Dive" | "AI Architecture" | "UI/UX Design" | "DevOps & Cloud" | "Product & Scale";
  date: string;
  readTime: string;
  featured?: boolean;
  coverImage: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  tags: string[];
}

export const MOCK_BLOGS: BlogPost[] = [
  {
    id: "post-1",
    slug: "building-high-performance-nextjs-web-apps",
    title: "Building High-Performance Next.js Web Apps with Sub-100ms Load Times",
    snippet: "A deep architectural breakdown on optimizing Next.js App Router performance using streaming SSR, edge caching, server actions, and precision asset bundling.",
    category: "Engineering Deep Dive",
    date: "July 24, 2026",
    readTime: "6 min read",
    featured: true,
    coverImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop",
    author: {
      name: "Dharmendra Kumar",
      role: "Principal Systems Architect",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
    },
    tags: ["Next.js", "Performance", "Web Vitals", "SSR"],
  },
  {
    id: "post-2",
    slug: "designing-custom-ai-agents-enterprise-workflow",
    title: "Designing Custom AI Agents for Enterprise Workflow Automation",
    snippet: "How to unify multi-model LLMs, pgvector indexing, and deterministic finite state machines to construct mission-critical autonomous agents.",
    category: "AI Architecture",
    date: "July 18, 2026",
    readTime: "8 min read",
    featured: false,
    coverImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=900&auto=format&fit=crop",
    author: {
      name: "Vikram Rathore",
      role: "Lead AI Engineer",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
    },
    tags: ["AI Agents", "RAG", "pgvector", "LangChain"],
  },
  {
    id: "post-3",
    slug: "8pt-spacing-grid-system-ui-consistency",
    title: "The 8pt Spacing Grid: Achieving Apple-Level UI Consistency in Modern Web Apps",
    snippet: "Mathematical layout systems that turn fragmented design handoffs into pixel-perfect frontend tokens across enterprise dashboard interfaces.",
    category: "UI/UX Design",
    date: "July 10, 2026",
    readTime: "5 min read",
    featured: false,
    coverImage: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?q=80&w=900&auto=format&fit=crop",
    author: {
      name: "Sneha Patel",
      role: "Head of Product Design",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
    },
    tags: ["Design Systems", "Figma", "CSS", "Micro-Interactions"],
  },
  {
    id: "post-4",
    slug: "zero-downtime-database-migrations-multi-tenant-saas",
    title: "Zero-Downtime Database Migrations in Multi-Tenant SaaS Environments",
    snippet: "Battle-tested expand/contract patterns for rolling out backward-compatible PostgreSQL schema migrations with zero read/write locks.",
    category: "DevOps & Cloud",
    date: "June 28, 2026",
    readTime: "7 min read",
    featured: false,
    coverImage: "https://images.unsplash.com/photo-1618401471353-b98aedd04e11?q=80&w=900&auto=format&fit=crop",
    author: {
      name: "Arjun Verma",
      role: "Staff Infrastructure Engineer",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop",
    },
    tags: ["PostgreSQL", "DevOps", "Kubernetes", "High Availability"],
  },
  {
    id: "post-5",
    slug: "event-driven-microservices-kafka-go",
    title: "Orchestrating High-Throughput Event Streams with Apache Kafka and Go",
    snippet: "Handling 250,000 requests/sec with minimal memory footprint, distributed consumer rebalancing, and exactly-once processing semantics.",
    category: "Engineering Deep Dive",
    date: "June 14, 2026",
    readTime: "9 min read",
    featured: false,
    coverImage: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=900&auto=format&fit=crop",
    author: {
      name: "Dharmendra Kumar",
      role: "Principal Systems Architect",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
    },
    tags: ["Kafka", "Golang", "Microservices", "Event-Driven"],
  },
  {
    id: "post-6",
    slug: "security-compliance-in-modern-cloud-platforms",
    title: "SOC2 Type II & HIPAA Compliance as Code for Next-Gen SaaS Platforms",
    snippet: "How we automated our cloud infrastructure audit trails, access controls, and encrypted secrets lifecycle inside GitHub Actions CI/CD pipelines.",
    category: "DevOps & Cloud",
    date: "May 30, 2026",
    readTime: "6 min read",
    featured: false,
    coverImage: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=900&auto=format&fit=crop",
    author: {
      name: "Rohit Nair",
      role: "Security Engineering Lead",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop",
    },
    tags: ["Security", "SOC2", "Cloud Infrastructure", "Compliance"],
  },
];