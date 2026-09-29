"use client";

import React, { useState, useRef } from "react";
import { NodeViewWrapper, NodeViewProps } from "@tiptap/react";
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  Trash2,
} from "lucide-react";

export default function ResizableImageComponent({
  node,
  updateAttributes,
  deleteNode,
  selected,
}: Readonly<NodeViewProps>) {
  const [resizing, setResizing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { src, alt, width = "100%", alignment = "center" } = node.attrs;

  // Handle Drag to Resize
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setResizing(true);

    const startX = e.clientX;
    const initialWidth = containerRef.current?.getBoundingClientRect().width || 300;
    const parentWidth = containerRef.current?.parentElement?.getBoundingClientRect().width || 800;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const newPixelWidth = Math.max(120, Math.min(initialWidth + deltaX, parentWidth));
      const percentageWidth = Math.round((newPixelWidth / parentWidth) * 100);
      updateAttributes({ width: `${percentageWidth}%` });
    };

    const onMouseUp = () => {
      setResizing(false);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  // Align Classes
  const alignClass =
    alignment === "left"
      ? "justify-start"
      : alignment === "right"
        ? "justify-end"
        : "justify-center";

  return (
    <NodeViewWrapper className={`my-4 flex w-full ${alignClass} select-none`}>
      <div
        ref={containerRef}
        style={{ width: width || "100%" }}
        className={`group relative inline-block transition-shadow ${selected ? "ring-2 ring-[var(--color-primary)] ring-offset-2 rounded-lg" : ""
          }`}
      >
        {/* The Image */}
        <img
          src={src}
          alt={alt || ""}
          className="h-auto w-full rounded-lg border border-[var(--color-border)] object-cover shadow-xs"
        />

        {/* Floating Quick Action Toolbar (Preset sizes + Alignment + Delete) */}
        {(selected || resizing) && (
          <div className="absolute -top-11 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-2 py-1 shadow-lg">
            {/* Quick Size Presets */}
            <button
              type="button"
              onClick={() => updateAttributes({ width: "25%" })}
              className={`px-1.5 py-0.5 text-[11px] rounded ${width === "25%" ? "bg-[var(--color-primary-light)] text-[var(--color-primary)] font-semibold" : "text-[var(--color-muted)] hover:text-[var(--color-heading)]"}`}
            >
              25%
            </button>
            <button
              type="button"
              onClick={() => updateAttributes({ width: "50%" })}
              className={`px-1.5 py-0.5 text-[11px] rounded ${width === "50%" ? "bg-[var(--color-primary-light)] text-[var(--color-primary)] font-semibold" : "text-[var(--color-muted)] hover:text-[var(--color-heading)]"}`}
            >
              50%
            </button>
            <button
              type="button"
              onClick={() => updateAttributes({ width: "100%" })}
              className={`px-1.5 py-0.5 text-[11px] rounded ${width === "100%" ? "bg-[var(--color-primary-light)] text-[var(--color-primary)] font-semibold" : "text-[var(--color-muted)] hover:text-[var(--color-heading)]"}`}
            >
              100%
            </button>

            <div className="mx-1 h-3.5 w-px bg-[var(--color-border)]" />

            {/* Alignments */}
            <button
              type="button"
              onClick={() => updateAttributes({ alignment: "left" })}
              className={`p-1 rounded ${alignment === "left" ? "text-[var(--color-primary)]" : "text-[var(--color-muted)] hover:text-[var(--color-heading)]"}`}
              title="Align Left"
            >
              <AlignLeft className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => updateAttributes({ alignment: "center" })}
              className={`p-1 rounded ${alignment === "center" ? "text-[var(--color-primary)]" : "text-[var(--color-muted)] hover:text-[var(--color-heading)]"}`}
              title="Align Center"
            >
              <AlignCenter className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => updateAttributes({ alignment: "right" })}
              className={`p-1 rounded ${alignment === "right" ? "text-[var(--color-primary)]" : "text-[var(--color-muted)] hover:text-[var(--color-heading)]"}`}
              title="Align Right"
            >
              <AlignRight className="h-3.5 w-3.5" />
            </button>

            <div className="mx-1 h-3.5 w-px bg-[var(--color-border)]" />

            {/* Delete Node */}
            <button
              type="button"
              onClick={deleteNode}
              className="p-1 rounded text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors"
              title="Delete Image"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {/* Drag Resize Corner Handle (Bottom Right) */}
        {selected && (
          <div
            onMouseDown={handleMouseDown}
            className="absolute -bottom-1.5 -right-1.5 h-4 w-4 cursor-nwse-resize rounded-full border-2 border-white bg-[var(--color-primary)] shadow-md hover:scale-125 transition-transform"
            title="Drag to resize"
          />
        )}
      </div>
    </NodeViewWrapper>
  );
}