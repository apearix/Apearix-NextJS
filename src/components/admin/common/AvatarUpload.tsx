"use client";

import React, { useState, useRef, useCallback, useEffect, useId } from "react";
import {
  Camera,
  Trash2,
  Link as LinkIcon,
  AlertCircle,
  Crop as CropIcon,
  ZoomIn,
  ZoomOut,
  Check,
  X,
  User as UserIcon,
} from "lucide-react";

export interface AvatarUploadProps {
  value?: string;
  onChange: (value: string, file?: File) => void;
  label?: string;
  error?: string;
  maxSizeMB?: number;
  acceptedFormats?: string[];
  helperText?: string;
  className?: string;
  nameInitials?: string;
  outputSize?: number;
}

const DEFAULT_ACCEPTED = ["image/jpeg", "image/png", "image/webp"];

export const AvatarUpload: React.FC<AvatarUploadProps> = ({
  value = "",
  onChange,
  label = "Profile Picture",
  error,
  maxSizeMB = 5,
  acceptedFormats = DEFAULT_ACCEPTED,
  helperText = "Square JPG, PNG, or WebP up to 5MB",
  className = "",
  nameInitials = "",
  outputSize = 400,
}) => {
  const uniqueId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previousBlobUrl = useRef<string | null>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [internalError, setInternalError] = useState<string | null>(null);

  // Modal & Cropping states
  const [isCropOpen, setIsCropOpen] = useState(false);
  const [rawImageSrc, setRawImageSrc] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const imageRef = useRef<HTMLImageElement | null>(null);

  // Memory cleanup on unmount
  useEffect(() => {
    return () => {
      if (previousBlobUrl.current?.startsWith("blob:")) {
        URL.revokeObjectURL(previousBlobUrl.current);
      }
    };
  }, []);

  const validateFile = (file: File): boolean => {
    setInternalError(null);
    if (!acceptedFormats.includes(file.type)) {
      setInternalError("Invalid file type. Only JPG, PNG, and WebP are allowed.");
      return false;
    }
    const maxBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxBytes) {
      setInternalError(`File size exceeds maximum limit of ${maxSizeMB}MB.`);
      return false;
    }
    return true;
  };

  const handleFileSelected = (file: File) => {
    if (!validateFile(file)) return;
    const reader = new FileReader();
    reader.onload = () => {
      setRawImageSrc(reader.result as string);
      setZoom(1);
      setPan({ x: 0, y: 0 });
      setIsCropOpen(true);
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelected(files[0]);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Drag & drop handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        handleFileSelected(files[0]);
      }
    },
    [maxSizeMB, acceptedFormats]
  );

  const handleClear = () => {
    setInternalError(null);
    if (previousBlobUrl.current?.startsWith("blob:")) {
      URL.revokeObjectURL(previousBlobUrl.current);
      previousBlobUrl.current = null;
    }
    onChange("", undefined);
  };

  // Native HTML5 Canvas Crop Logic
  const handleApplyCrop = () => {
    if (!rawImageSrc || !imageRef.current) return;

    const img = imageRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = outputSize;
    canvas.height = outputSize;
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      setInternalError("Failed to initialize canvas for cropping");
      return;
    }

    const previewBoxSize = 260; // Dimensions of modal crop window

    // Calculate source bounds
    const centerSourceX =
      img.naturalWidth / 2 - (pan.x * (img.naturalWidth / previewBoxSize)) / zoom;
    const centerSourceY =
      img.naturalHeight / 2 - (pan.y * (img.naturalHeight / previewBoxSize)) / zoom;
    const sWidth = img.naturalWidth / zoom;
    const sHeight = img.naturalHeight / zoom;
    const sx = centerSourceX - sWidth / 2;
    const sy = centerSourceY - sHeight / 2;

    ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, outputSize, outputSize);

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          setInternalError("Could not process cropped image.");
          return;
        }

        if (previousBlobUrl.current?.startsWith("blob:")) {
          URL.revokeObjectURL(previousBlobUrl.current);
        }

        const croppedFile = new File([blob], `avatar-${Date.now()}.webp`, {
          type: "image/webp",
        });

        const newPreviewUrl = URL.createObjectURL(croppedFile);
        previousBlobUrl.current = newPreviewUrl;

        onChange(newPreviewUrl, croppedFile);
        setIsCropOpen(false);
        setRawImageSrc(null);
      },
      "image/webp",
      0.9
    );
  };

  // Pan controls
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsPanning(true);
    dragStartRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPanning) return;
    setPan({
      x: e.clientX - dragStartRef.current.x,
      y: e.clientY - dragStartRef.current.y,
    });
  };

  const handleMouseUp = () => setIsPanning(false);

  const displayedError = error || internalError;

  // Extracted render logic to avoid nested ternary operators (SonarQube/Clean Code compliant)
  const renderAvatarContent = () => {
    if (value) {
      return (
        <img
          src={value}
          alt="Avatar Preview"
          className="w-full h-full object-cover"
          onError={() => setInternalError("Unable to load image from URL.")}
        />
      );
    }

    if (nameInitials) {
      return (
        <span className="text-2xl font-bold text-primary select-none">
          {nameInitials.slice(0, 2).toUpperCase()}
        </span>
      );
    }

    return <UserIcon className="w-10 h-10 text-muted/60" />;
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {label && (
        <label
          htmlFor={uniqueId}
          className="block text-xs font-semibold text-heading uppercase tracking-wider"
        >
          {label}
        </label>
      )}

      {/* Hidden File Input */}
      <input
        id={uniqueId}
        ref={fileInputRef}
        type="file"
        accept={acceptedFormats.join(",")}
        onChange={handleFileInputChange}
        className="hidden"
      />

      {/* Profile Avatar Card Container */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 p-4 rounded-2xl border border-border bg-surface-alt/50">
        {/* Circular Avatar Frame */}
        <div className="relative group shrink-0">
          <button
            type="button"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative w-28 h-28 rounded-full overflow-hidden border-2 cursor-pointer transition-all duration-300 flex items-center justify-center shadow-xs bg-surface p-0 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${isDragging
              ? "border-primary ring-4 ring-primary-light scale-102"
              : "border-border group-hover:border-primary/60 group-hover:shadow-md"
              }`}
            aria-label="Upload or change profile avatar"
          >
            {renderAvatarContent()}

            {/* Hover Camera Overlay */}
            <div className="absolute inset-0 bg-heading/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[11px] font-medium backdrop-blur-[2px]">
              <Camera className="w-5 h-5 mb-0.5" />
              <span>Change</span>
            </div>
          </button>

          {/* Quick Action Badges */}
          {value && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute -top-1 -right-1 p-1.5 rounded-full bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-100 shadow-xs transition-colors cursor-pointer"
              title="Remove avatar"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Content & URL Controls */}
        <div className="flex-1 space-y-3 w-full">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3.5 py-1.5 bg-primary hover:bg-primary-hover text-white text-xs font-semibold rounded-lg shadow-sm transition-all active:scale-[0.98] cursor-pointer"
              >
                Upload Photo
              </button>
              {value && (
                <button
                  type="button"
                  onClick={() => {
                    setRawImageSrc(value);
                    setZoom(1);
                    setPan({ x: 0, y: 0 });
                    setIsCropOpen(true);
                  }}
                  className="px-3 py-1.5 bg-background border border-border hover:border-primary/50 text-heading text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <CropIcon className="w-3.5 h-3.5 text-primary" /> Recrop
                </button>
              )}
            </div>
            <p className="text-[11px] text-muted mt-1.5">{helperText}</p>
          </div>

          {/* Direct Link Input */}
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted">
              <LinkIcon className="h-3.5 w-3.5" />
            </div>
            <input
              type="text"
              value={value}
              onChange={(e) => {
                setInternalError(null);
                onChange(e.target.value);
              }}
              placeholder="Or paste image URL (https://...)"
              className="pl-8 text-xs py-2 bg-background"
            />
          </div>

          {/* Errors */}
          {displayedError && (
            <div className="flex items-center gap-1.5 text-xs text-rose-600 font-medium">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              <span>{displayedError}</span>
            </div>
          )}
        </div>
      </div>

      {/* Client-side Crop & Position Modal */}
      {isCropOpen && rawImageSrc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-background w-full max-w-md rounded-2xl border border-border shadow-2xl overflow-hidden p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="text-base font-bold text-heading">Crop & Adjust Avatar</h3>
                <p className="text-xs text-muted">Drag to center your face inside the circle</p>
              </div>
              <button
                type="button"
                onClick={() => setIsCropOpen(false)}
                className="p-1 rounded-lg text-muted hover:text-heading hover:bg-surface-alt transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Interactive Canvas Viewport */}
            <div className="flex justify-center">
              <div
                className="relative w-65 h-65 rounded-full overflow-hidden bg-surface-alt border-2 border-primary shadow-inner cursor-grab active:cursor-grabbing select-none"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                {/* Image undergoing transforms */}
                <img
                  ref={imageRef}
                  src={rawImageSrc}
                  alt="Crop preview"
                  draggable={false}
                  className="absolute pointer-events-none max-w-none origin-center"
                  style={{
                    transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                    left: "50%",
                    top: "50%",
                    marginLeft: imageRef.current ? -imageRef.current.width / 2 : 0,
                    marginTop: imageRef.current ? -imageRef.current.height / 2 : 0,
                  }}
                  onLoad={(e) => {
                    const target = e.currentTarget;
                    target.style.marginLeft = `${-target.naturalWidth / 2}px`;
                    target.style.marginTop = `${-target.naturalHeight / 2}px`;
                  }}
                />
                {/* Circular Guide Ring */}
                <div className="absolute inset-0 pointer-events-none rounded-full ring-1 ring-white/40 shadow-[0_0_0_9999px_rgba(0,0,0,0.4)]" />
              </div>
            </div>

            {/* Zoom Slider Control */}
            <div className="space-y-1.5 pt-2">
              <div className="flex items-center justify-between text-xs font-semibold text-heading">
                <span className="flex items-center gap-1 text-muted">
                  <ZoomOut size={14} /> Zoom
                </span>
                <span>{Math.round(zoom * 100)}%</span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="0.5"
                  max="3"
                  step="0.05"
                  value={zoom}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="w-full accent-primary h-1.5 bg-surface-alt rounded-lg cursor-pointer"
                />
                <ZoomIn size={16} className="text-muted" />
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border">
              <button
                type="button"
                onClick={() => setIsCropOpen(false)}
                className="px-4 py-2 border border-border text-heading text-xs font-semibold rounded-xl hover:bg-surface-alt transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApplyCrop}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-semibold rounded-xl shadow-md shadow-primary/25 transition-all active:scale-[0.98] cursor-pointer"
              >
                <Check size={14} /> Save & Crop
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};