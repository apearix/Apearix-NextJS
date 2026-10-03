import { Navbar } from "@/components/admin/layout/Navbar";
import { Footer } from "@/components/admin/layout/Footer";
import { Toaster } from "sonner";
import type { ReactNode } from "react";

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
      <Toaster
        position="bottom-right"
        toastOptions={{
          className: "!bg-white !text-heading !border !border-border !shadow-lg !rounded-xl !text-xs !py-3 !px-4"
        }}
      />
    </div>
  );
}