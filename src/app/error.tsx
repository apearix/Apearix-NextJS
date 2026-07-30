'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { RotateCcw, Home } from 'lucide-react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to monitoring service
    console.error('Unhandled runtime error:', error);
  }, [error]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center pt-32 pb-20 bg-[#FAFAFC]">
      <div className="container max-w-[1280px] mx-auto px-6 text-center">
        <span className="inline-block px-4 py-1.5 rounded-full bg-[#DC2626]/10 border border-[#DC2626]/20 text-xs font-bold text-[#DC2626] uppercase tracking-wider mb-6">
          Application Error
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold text-[#111827] tracking-tight mb-4">
          Something went wrong
        </h1>
        <p className="text-base text-[#4B5563] max-w-md mx-auto mb-8 leading-relaxed">
          An unexpected runtime exception occurred. Our engineering team has been notified.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => reset()}
            className="h-12 px-6 rounded-[10px] bg-[#6D28F5] hover:bg-[#5B21E6] text-white font-medium text-sm flex items-center gap-2 transition-colors shadow-sm"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Try Again</span>
          </button>
          <Link
            href="/"
            className="h-12 px-6 rounded-[10px] bg-white border border-[#E5E7EB] text-[#111827] hover:bg-[#FAFAFC] font-medium text-sm flex items-center gap-2 transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Go to Homepage</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
