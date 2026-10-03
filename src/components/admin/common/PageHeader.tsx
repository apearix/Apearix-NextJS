"use client";
import React from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string | React.ReactNode;
  badge?: string | React.ReactNode;
  btn?: string | React.ReactNode;
  onAction?: () => void;
  icon?: React.ElementType;
}

export function PageHeader({
  title,
  subtitle,
  btn,
  icon: Icon,
  badge,
}: Readonly<PageHeaderProps>) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
      <div>
        <div className="flex items-center gap-2.5">
          <h1 className="text-2xl font-bold tracking-tight text-heading">{title}</h1>
         { badge && (
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-surface-alt border border-border text-muted">
              {badge}
            </span>
          )}
        </div>
        {subtitle && (
          <div className="text-muted text-sm mt-1 flex items-center gap-2">
            {Icon && <Icon size={14} />}
            {subtitle}
          </div>
        )}
      </div>
      {btn && (
        <div className="flex items-center gap-2.5">
          {btn}
        </div>
      )}
    </div>
  );
}

