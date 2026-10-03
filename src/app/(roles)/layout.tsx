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
    <div className="pt-18.5">
      <Navbar />
      {children}
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