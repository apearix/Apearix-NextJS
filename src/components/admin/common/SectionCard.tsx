import React from "react";
import { LucideIcon } from "lucide-react";

interface SectionCardProps {
    title: string;
    icon?: LucideIcon | React.ComponentType<{ className?: string }>;
    action?: React.ReactNode;
    children: React.ReactNode;
    className?: string;
    contentClassName?: string;
}

export const SectionCard: React.FC<SectionCardProps> = ({
    title,
    icon: Icon,
    action,
    children,
    className = "",
    contentClassName = "",
}) => {
    return (
        <div
            className={`overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] pb-3 shadow-xs ${className}`}
        >
            {/* Section Heading Banner */}
            <div className="relative flex flex-wrap items-center justify-between gap-2 rounded-t-xl border-b border-[var(--color-border)] bg-[var(--color-surface-alt)] px-4 py-2.5">
                <div className="flex items-center gap-2">
                    {Icon && <Icon className="h-4 w-4 text-[var(--color-primary)]" />}
                    <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-heading)]">
                        {title}
                    </span>
                </div>
                {action && <div className="flex items-center gap-2">{action}</div>}
            </div>

            {/* Content Area */}
            <div className={`space-y-4 px-6 py-3 ${contentClassName}`}>
                {children}
            </div>
        </div>
    );
};