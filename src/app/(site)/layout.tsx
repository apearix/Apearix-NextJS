import type { ReactNode } from "react";
import { Navbar } from "@/components/site/layout/Navbar";
import { Footer } from "@/components/site/layout/Footer";
import { BackToTop } from "@/components/site/layout/BackToTop"; 

export default function SiteLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
      <BackToTop />
    </>
  );
}