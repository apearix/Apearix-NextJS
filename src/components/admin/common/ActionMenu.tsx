"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { MoreVertical } from "lucide-react";

export interface ActionMenuItem {
    label: string;
    icon?: React.ReactNode;
    onClick?: () => void;
    href?: string;
    variant?: "default" | "success" | "warning" | "danger";
    dividerAfter?: boolean;
}

export interface ActionMenuProps {
    items: ActionMenuItem[];
    align?: "left" | "right";
    buttonClassName?: string;
    ariaLabel?: string;
}

export function ActionMenu({
    items,
    align = "right",
    buttonClassName = "px-1 py-2 rounded-md text-muted hover:text-heading hover:bg-surface-alt transition-colors focus:outline-none border border-border cursor-pointer",
    ariaLabel = "Row actions",
}: Readonly<ActionMenuProps>) {
    const [isOpen, setIsOpen] = useState(false);
    const [position, setPosition] = useState<{ top: number; left: number; isAbove: boolean }>({
        top: 0,
        left: 0,
        isAbove: false,
    });

    const buttonRef = useRef<HTMLButtonElement | null>(null);
    const menuRef = useRef<HTMLDivElement | null>(null);

    // Position calculation relative to viewport
    const updatePosition = useCallback(() => {
        if (!buttonRef.current) return;
        const rect = buttonRef.current.getBoundingClientRect();
        const menuWidth = 176; // w-44 = 11rem = 176px
        const estimatedHeight = items.length * 36 + 16;
        const viewportHeight = window.innerHeight;
        const spaceBelow = viewportHeight - rect.bottom;

        // Check if opening above is better
        const openAbove = spaceBelow < estimatedHeight && rect.top > estimatedHeight;

        let targetLeft = align === "right" ? rect.right - menuWidth : rect.left;
        if (targetLeft < 8) targetLeft = 8;
        if (targetLeft + menuWidth > window.innerWidth - 8) {
            targetLeft = window.innerWidth - menuWidth - 8;
        }

        setPosition({
            top: openAbove ? rect.top - 6 : rect.bottom + 6,
            left: targetLeft,
            isAbove: openAbove,
        });
    }, [align, items.length]);

    const toggleMenu = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!isOpen) updatePosition();
        setIsOpen((prev) => !prev);
    };

    // Close on outside click, scroll, resize
    useEffect(() => {
        if (!isOpen) return;

        const handleOutsideClick = (e: MouseEvent) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(e.target as Node) &&
                buttonRef.current &&
                !buttonRef.current.contains(e.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        const handleDismissOnScroll = () => {
            setIsOpen(false);
        };

        window.addEventListener("scroll", handleDismissOnScroll, true);
        window.addEventListener("resize", handleDismissOnScroll);
        document.addEventListener("mousedown", handleOutsideClick);

        return () => {
            window.removeEventListener("scroll", handleDismissOnScroll, true);
            window.removeEventListener("resize", handleDismissOnScroll);
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, [isOpen]);

    const getVariantStyles = (variant?: string) => {
        switch (variant) {
            case "danger":
                return "text-rose-600 hover:bg-rose-50";
            case "warning":
                return "text-amber-700 hover:bg-amber-50";
            case "success":
                return "text-emerald-700 hover:bg-emerald-50";
            default:
                return "text-heading hover:bg-surface";
        }
    };

    return (
        <>
            <button
                ref={buttonRef}
                type="button"
                onClick={toggleMenu}
                className={buttonClassName}
                aria-label={ariaLabel}
                aria-expanded={isOpen}
            >
                <MoreVertical className="w-3.5 h-3.5" />
            </button>

            {isOpen &&
                typeof document !== "undefined" &&
                createPortal(
                    <div
                        ref={menuRef}
                        role="menu"
                        tabIndex={-1}
                        style={{
                            position: "fixed",
                            top: `${position.top}px`,
                            left: `${position.left}px`,
                            transform: position.isAbove ? "translateY(-100%)" : "none",
                        }}
                        onClick={(e) => e.stopPropagation()}
                        onKeyDown={(e) => {
                            if (e.key === "Escape") {
                                setIsOpen(false);
                            }
                        }}
                        className="w-44 bg-white rounded-xl shadow-2xl border border-border py-1.5 z-9999 font-medium text-xs text-left animate-in fade-in duration-150 select-none"
                    >
                        {items.map((item, index) => {
                            const baseClassName = `w-full px-3 py-1.5 flex items-center gap-2 cursor-pointer transition-colors text-xs ${getVariantStyles(
                                item.variant
                            )}`;

                            return (
                                <React.Fragment key={`${item.label}-${index}`}>
                                    {item.href ? (
                                        <a
                                            role="menuitem"
                                            href={item.href}
                                            onClick={() => setIsOpen(false)}
                                            className={baseClassName}
                                        >
                                            {item.icon}
                                            <span>{item.label}</span>
                                        </a>
                                    ) : (
                                        <button
                                            role="menuitem"
                                            type="button"
                                            onClick={() => {
                                                item.onClick?.();
                                                setIsOpen(false);
                                            }}
                                            className={baseClassName}
                                        >
                                            {item.icon}
                                            <span>{item.label}</span>
                                        </button>
                                    )}
                                    {item.dividerAfter && <div className="my-1 border-t border-border" />}
                                </React.Fragment>
                            );
                        })}
                    </div>,
                    document.body
                )}
        </>
    );
}