"use client";
import React from "react";
import { Plus } from "lucide-react";

interface AdminPageHeaderProps {
  title: string;
  subtitle?: string | React.ReactNode;
  actionText?: string;
  onAction?: () => void;
  icon?: React.ElementType;
}

export function AdminPageHeader({
  title,
  subtitle,
  actionText,
  onAction,
  icon: Icon,
}: AdminPageHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div>
        <h1 className="text-2xl font-bold text-heading">{title}</h1>
        {subtitle && (
          <div className="text-muted text-sm mt-1 flex items-center gap-2">
            {Icon && <Icon size={14} />}
            {subtitle}
          </div>
        )}
      </div>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors shadow-sm"
        >
          <Plus size={18} />
          {actionText}
        </button>
      )}
    </div>
  );
}

