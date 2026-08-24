'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

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
    <div className="mx-auto max-w-4xl space-y-3.5">
      {faqs.map((faq, idx) => {
        const isOpen = openIdx === idx;
        return (
          <div
            key={idx}
            className={`overflow-hidden rounded-2xl border transition-all duration-300 ${
              isOpen
                ? 'border-[#DDD6FE] bg-white shadow-lg shadow-[#6D28F5]/5'
                : 'border-[#E5E7EB] bg-[#FAFAFC] hover:border-gray-300 hover:bg-white'
            }`}
          >
            <button
              onClick={() => setOpenIdx(isOpen ? null : idx)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 p-4 text-left font-medium text-[#111827] text-base md:text-lg transition-colors focus-visible:outline-none"
            >
              <span className={`${isOpen ? 'text-[#6D28F5]' : 'text-[#111827]'} transition-colors`}>
                {faq.q}
              </span>
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
                  isOpen ? 'bg-[#F4F0FF] text-[#6D28F5]' : 'bg-white text-[#9CA3AF] border border-gray-200'
                }`}
              >
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-300 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </div>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="border-t border-border p-4 text-sm leading-relaxed text-[#4B5563] sm:px-6 sm:text-base">
                    {faq.a}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}