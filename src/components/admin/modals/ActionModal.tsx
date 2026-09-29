"use client";
import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { createPortal } from "react-dom";

interface ActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function ActionModal({ isOpen, onClose, title, children }: ActionModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const content = (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      <div 
        ref={modalRef}
        className="relative bg-background rounded-xl shadow-2xl w-full max-w-lg overflow-hidden border border-border-subtle flex flex-col max-h-[90vh]"
      >
        <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-surface-alt">
          <h2 className="text-lg font-bold text-heading">{title}</h2>
          <button 
            onClick={onClose}
            className="p-1.5 text-muted hover:text-heading bg-background rounded-md transition-colors border border-border"
          >
            <X size={18} />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );

  // Use portal if document is defined, otherwise return null (for SSR)
  if (typeof document !== 'undefined') {
    return createPortal(content, document.body);
  }
  
  return null;
}

