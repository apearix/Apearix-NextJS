"use client";
import { motion } from 'framer-motion';
import { ArrowUp } from "lucide-react";
export function BackToTop() {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <motion.button
            onClick={scrollToTop}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Back to top"
            className="z-10 fixed bottom-6 right-6 p-3 rounded-[10px] bg-white border border-[#E5E7EB] text-[#111827] hover:text-[#6D28F5] hover:bg-[#F4F0FF] hover:border-[#DDD6FE] shadow-md transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6D28F5]"
        >
            <ArrowUp className="w-4 h-4" />
        </motion.button>
    );
}   