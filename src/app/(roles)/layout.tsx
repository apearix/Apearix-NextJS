import type { ReactNode } from "react";
import { Navbar } from "@/components/admin/layout/Navbar";
import { Footer } from "@/components/admin/layout/Footer";
import { Toaster } from "@/components/admin/common/Toaster";

export default function SiteLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <div className="roles-font bg-surface min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 pt-20">
        {children}
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}