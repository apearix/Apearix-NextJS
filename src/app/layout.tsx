import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { BackToTop } from "@/components/layout/BackToTop";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#6D28F5",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://www.apearix.com"),
  title: {
    default: "Apearix | Software Engineering Company | AI Solutions & SaaS Development",
    template: "%s | Apearix",
  },
  description: "Apearix is a software engineering company specializing in custom web applications, enterprise SaaS platforms, mobile apps, browser extensions, AI-powered software, custom AI agents, chatbots, workflow automation, cloud infrastructure, and modern digital products for businesses.",
  keywords: [
    "Software Engineering Company",
    "Software Development Agency",
    "SaaS Development Services",
    "Custom AI Agents",
    "AI Automation Agency",
    "Next.js Development Company",
    "Web Application Development",
    "Mobile App Development",
    "UI UX Design Agency",
    "Cloud DevOps Engineering",
    "Apearix Software"
  ],
  authors: [{ name: "Apearix Engineering Team", url: "https://www.apearix.com" }],
  creator: "Apearix",
  publisher: "Apearix",
  category: "Technology",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/logo.png", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-icon.png",
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: "Apearix | Software Engineering & AI-Powered Solutions",
    description: "Engineering Intelligence. We build custom web apps, SaaS platforms, AI-powered automations, mobile apps, and resilient cloud architectures.",
    url: "https://www.apearix.com",
    siteName: "Apearix",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://www.apearix.com/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Apearix Software Engineering & AI Solutions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Apearix | Software Engineering & AI Solutions",
    description: "Engineering Intelligence. Building extraordinary digital experiences and intelligent automated systems.",
    site: "@apearix",
    creator: "@apearix",
    images: ["https://www.apearix.com/opengraph-image"],
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "google-site-verification-placeholder",
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION || "yandex-verification-placeholder",
  },
  alternates: {
    canonical: "https://www.apearix.com",
  },
};

const jsonLdOrganization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://www.apearix.com/#organization",
  "name": "Apearix",
  "legalName": "Apearix Software",
  "url": "https://www.apearix.com",
  "logo": "https://www.apearix.com/icon",
  "image": "https://www.apearix.com/opengraph-image",
  "email": "hqapearix@gmail.com",
  "telephone": "+917241131839",
  "sameAs": [
    "https://x.com/apearix",
    "https://www.linkedin.com/company/apearix/",
    "https://github.com/apearix",
    "https://www.instagram.com/apearix/",
    "https://www.facebook.com/apearix"
  ],
  "knowsAbout": [
    "Software Engineering",
    "Web Application Development",
    "SaaS Development",
    "AI Automation",
    "Custom AI Agents",
    "Retrieval-Augmented Generation (RAG)",
    "Vector Databases",
    "Mobile App Development",
    "UI/UX Design",
    "Cloud & DevOps Engineering"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+917241131839",
    "email": "hqapearix@gmail.com",
    "contactType": "customer service",
    "availableLanguage": ["English"]
  },
  "description": "Apearix is a software engineering company building custom web applications, enterprise SaaS platforms, AI-powered automation pipelines, mobile apps, and scalable cloud solutions."
};

const jsonLdWebsite = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://www.apearix.com/#website",
  "name": "Apearix",
  "url": "https://www.apearix.com",
  "publisher": {
    "@id": "https://www.apearix.com/#organization"
  },
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://www.apearix.com/resources/faq?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrganization) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebsite) }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans selection:bg-[#6D28F5] selection:text-white relative bg-white text-[#4B5563]">
        <SmoothScroll>
          {children}
        </SmoothScroll>
        <BackToTop />
      </body>
    </html>
  );
}

