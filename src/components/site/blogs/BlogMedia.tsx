"use client";

import React, { useState } from "react";
import Image from "next/image";
import { BookOpen } from "lucide-react";

const OPTIMIZABLE_HOSTS = new Set([
  "res.cloudinary.com",
  "images.unsplash.com",
  "source.unsplash.com",
]);

function isValidImageSrc(src: string): boolean {
  return (
    src.startsWith("/") ||
    src.startsWith("https://") ||
    src.startsWith("http://") ||
    src.startsWith("data:image/")
  );
}

function shouldOptimizeImage(src: string): boolean {
  if (src.startsWith("/")) {
    return (
      !src.startsWith("/api/") &&
      !src.startsWith("/storage/") &&
      !src.startsWith("/apearix/storage/")
    );
  }
  try {
    const parsed = new URL(src);
    return parsed.protocol === "https:" && OPTIMIZABLE_HOSTS.has(parsed.hostname);
  } catch {
    return false;
  }
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "A";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

interface BlogCoverImageProps {
  src?: string | null;
  alt: string;
  sizes: string;
  className?: string;
  preload?: boolean;
}

export function BlogCoverImage({
  src,
  alt,
  sizes,
  className = "object-cover",
  preload = false,
}: Readonly<BlogCoverImageProps>) {
  const cleanSrc = src?.trim() || "";
  const [erroredSrc, setErroredSrc] = useState<string | null>(null);
  const hasError = erroredSrc === cleanSrc;

  if (!cleanSrc || !isValidImageSrc(cleanSrc) || hasError) {
    return (
      <div
        className="absolute inset-0 flex flex-col items-center justify-center bg-linear-to-br from-primary-light via-surface-alt to-surface text-primary/40"
        aria-hidden="true"
      >
        <BookOpen className="w-10 h-10 stroke-[1.5]" />
      </div>
    );
  }

  return (
    <Image
      src={cleanSrc}
      alt={alt}
      fill
      sizes={sizes}
      preload={preload}
      unoptimized={!shouldOptimizeImage(cleanSrc)}
      className={className}
      onError={() => setErroredSrc(cleanSrc)}
    />
  );
}

interface BlogAuthorAvatarProps {
  src?: string | null;
  name: string;
  sizes?: string;
  textClassName?: string;
}

export function BlogAuthorAvatar({
  src,
  name,
  sizes = "48px",
  textClassName = "text-[11px]",
}: Readonly<BlogAuthorAvatarProps>) {
  const cleanSrc = src?.trim() || "";
  const [erroredSrc, setErroredSrc] = useState<string | null>(null);
  const hasError = erroredSrc === cleanSrc;

  if (!cleanSrc || !isValidImageSrc(cleanSrc) || hasError) {
    return (
      <span
        className={`flex h-full w-full items-center justify-center bg-primary-light font-bold text-primary select-none ${textClassName}`}
      >
        {getInitials(name)}
      </span>
    );
  }

  return (
    <Image
      src={cleanSrc}
      alt={name}
      fill
      sizes={sizes}
      unoptimized={!shouldOptimizeImage(cleanSrc)}
      className="object-cover"
      onError={() => setErroredSrc(cleanSrc)}
    />
  );
}
