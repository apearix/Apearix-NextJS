import { Navbar } from "@/components/admin/layout/Navbar";
import { Footer } from "@/components/admin/layout/Footer";
import type { ReactNode } from "react";

export default function SiteLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <div className="pt-18.5">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}