"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface QuickViewDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  headerContent?: React.ReactNode;
  footerActions?: React.ReactNode;
  children: React.ReactNode;
  maxWidthClass?: string;
}

export function QuickViewDrawer({
  isOpen,
  onClose,
  headerContent,
  footerActions,
  children,
  maxWidthClass = "max-w-lg",
}: Readonly<QuickViewDrawerProps>) {
  // ESC key listener to close & Body/Lenis Scroll Lock
  useEffect(() => {
    if (!isOpen) return;

    // 1. ESC Key Listener
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);

    // 2. Lock Background Scroll (Standard + Lenis support)
    const originalBodyOverflow = document.body.style.overflow;
    const originalBodyPaddingRight = document.body.style.paddingRight;
    
    // Prevent layout shift when scrollbar disappears
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    document.body.style.overflow = "hidden";
    document.documentElement.classList.add("lenis-stopped");

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalBodyOverflow;
      document.body.style.paddingRight = originalBodyPaddingRight;
      document.documentElement.classList.remove("lenis-stopped");
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 overflow-hidden"
        >
          {/* Backdrop Fade In / Out */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 bg-heading/40 backdrop-blur-xs"
          />

          {/* Drawer Container */}
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10 pointer-events-none">
            {/* Sliding Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className={`w-screen ${maxWidthClass} bg-white shadow-2xl border-l border-border flex flex-col pointer-events-auto h-full`}
            >
              {/* Header */}
              <div className="px-6 py-4 bg-surface border-b border-border flex items-center justify-between gap-3 shrink-0">
                <div className="min-w-0 flex-1">{headerContent}</div>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-muted hover:text-heading hover:bg-border/30 transition-colors cursor-pointer"
                  aria-label="Close drawer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body with data-lenis-prevent so drawer itself scrolls properly */}
              <div
                data-lenis-prevent="true"
                className="p-6 overflow-y-auto overscroll-contain flex-1 space-y-5"
              >
                {children}
              </div>

              {/* Footer */}
              {footerActions && (
                <div className="px-6 py-4 bg-surface border-t border-border flex items-center justify-end gap-2 shrink-0">
                  {footerActions}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}