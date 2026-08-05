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
    default: "Apearix | Software Engineering Company | AI-Powered Solutions & Automation",
    template: "%s | Apearix",
  },
  description: "Apearix is a software engineering company building custom web applications, SaaS platforms, mobile apps, browser extensions, AI-powered software, AI agents, chatbots, workflow automation, cloud solutions, and modern digital products for businesses.",
  keywords: [
    "Software Development Company",
    "SaaS Development",
    "AI Automation",
    "Website Development",
    "Mobile App Development",
    "UI UX Design Agency",
    "Cloud DevOps Engineering",
    "Apearix Software"
  ],
  authors: [{ name: "Dharmendra Barman", url: "https://www.apearix.com" }],
  creator: "Apearix",
  publisher: "Apearix",
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
    title: "Apearix | Thoughtfully Built Software",
    description: "We build software that moves businesses forward. Web Development, SaaS Platforms, AI Automations, and Mobile Apps.",
    url: "https://www.apearix.com",
    siteName: "Apearix",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Apearix | Thoughtfully Built Software",
    description: "Engineering Intelligence. Building extraordinary digital experiences and automated systems.",
    site: "@apearix",
    creator: "@apearix",
  },
  verification: {
    google: "google-site-verification-placeholder",
    yandex: "yandex-verification-placeholder",
  },
  alternates: {
    canonical: "https://www.apearix.com",
  },
};

const jsonLdOrganization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Apearix",
  "url": "https://www.apearix.com",
  "logo": "https://www.apearix.com/icon",
  "email": "hqapearix@gmail.com",
  "telephone": "+917241131839",
  "sameAs": [
    "https://x.com/apearix",
    "https://www.linkedin.com/company/apearix/",
    "https://github.com/apearix",
    "https://www.instagram.com/apearix/",
    "https://www.facebook.com/apearix"
  ],
  "description": "Apearix is a software development company focused on creating modern digital products for ambitious businesses."
};

const jsonLdWebsite = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Apearix",
  "url": "https://www.apearix.com",
  "publisher": {
    "@type": "Organization",
    "name": "Apearix"
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
