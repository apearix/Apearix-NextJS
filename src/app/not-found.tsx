import Link from 'next/link';
import { ArrowLeft, Home } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="min-h-[80vh] flex items-center justify-center pt-32 pb-20 bg-gradient-to-b from-white via-[#FAFAFC] to-[#F4F0FF]/40">
        <div className="container max-w-[1280px] mx-auto px-6 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#F4F0FF] border border-[#DDD6FE] text-xs font-bold text-[#6D28F5] uppercase tracking-wider mb-6">
            404 Error
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#111827] tracking-tight mb-4">
            Page Not Found
          </h1>
          <p className="text-base sm:text-lg text-[#4B5563] max-w-md mx-auto mb-10 leading-relaxed">
            The page you are looking for does not exist or has been moved. Explore our solutions or return to the homepage.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/"
              className="h-12 px-6 rounded-[10px] bg-[#6D28F5] hover:bg-[#5B21E6] text-white font-medium text-sm flex items-center gap-2 transition-colors shadow-sm"
            >
              <Home className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
            <Link
              href="/contact"
              className="h-12 px-6 rounded-[10px] bg-white border border-[#E5E7EB] text-[#111827] hover:bg-[#FAFAFC] font-medium text-sm flex items-center gap-2 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Contact Support</span>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
