'use client';

import { useState } from 'react';
import { ChevronDown } from "lucide-react";

export interface FAQItem {
  q: string;
  a: string;
}

interface FAQAccordionProps {
  faqs: FAQItem[];
}

export function FAQAccordion({ faqs }: FAQAccordionProps) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {faqs.map((faq, idx) => {
        const isOpen = openIdx === idx;
        return (
          <div
            key={idx}
            className="rounded-[12px] bg-[#FAFAFC] border border-[#E5E7EB] overflow-hidden transition-all"
          >
            <button
              onClick={() => setOpenIdx(isOpen ? null : idx)}
              className="w-full p-6 text-left flex items-center justify-between gap-4 font-bold text-[#111827] text-base md:text-lg hover:text-[#6D28F5] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6D28F5]"
            >
              <span>{faq.q}</span>
              <ChevronDown className={`w-5 h-5 text-[#6B7280] transition-transform duration-300 ${isOpen ? "rotate-180 text-[#6D28F5]" : ""}`} />
            </button>
            {isOpen && (
              <div className="px-6 pb-6 text-sm md:text-base text-[#4B5563] leading-relaxed border-t border-[#E5E7EB]/60 pt-4">
                {faq.a}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
