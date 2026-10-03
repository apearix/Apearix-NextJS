import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  Image as ImageIcon,
  UploadCloud,
  Trash2,
  Link as LinkIcon,
  AlertCircle,
} from "lucide-react";

export interface ImageUploadProps {
  value?: string;
  onChange: (value: string, file?: File) => void;
  label?: string;
  error?: string;
  maxSizeMB?: number;
  acceptedFormats?: string[];
  helperText?: string;
  className?: string;
}

const DEFAULT_ACCEPTED = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
];

export const ImageUpload: React.FC<ImageUploadProps> = ({
  value = "",
  onChange,
  label,
  error,
  maxSizeMB = 5,
  acceptedFormats = DEFAULT_ACCEPTED,
  helperText = "PNG, JPG, WebP, GIF or SVG up to 5MB (16:9 recommended)",
  className = "",
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [internalError, setInternalError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previousBlobUrl = useRef<string | null>(null);

  // Clean up generated object URLs to prevent browser memory leaks
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
      setInternalError("Invalid file type. Only image files are allowed.");
      return false;
    }

    const maxBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxBytes) {
      setInternalError(`File size exceeds maximum limit of ${maxSizeMB}MB.`);
      return false;
    }

    return true;
  };

  const handleFileProcess = (file: File) => {
    if (!validateFile(file)) return;

    if (previousBlobUrl.current?.startsWith("blob:")) {
      URL.revokeObjectURL(previousBlobUrl.current);
    }

    const previewUrl = URL.createObjectURL(file);
    previousBlobUrl.current = previewUrl;
    onChange(previewUrl, file);
  };

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
        handleFileProcess(files[0]);
      }
    },
    [maxSizeMB, acceptedFormats]
  );

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileProcess(files[0]);
    }
  };

  const handleClear = () => {
    setInternalError(null);
    if (previousBlobUrl.current?.startsWith("blob:")) {
      URL.revokeObjectURL(previousBlobUrl.current);
      previousBlobUrl.current = null;
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onChange("", undefined);
  };

  const displayedError = error || internalError;

  return (
    <div className={`space-y-3 pt-2 ${className}`}>
      {label && <label htmlFor="image-upload" className="block text-heading">
        {label}
      </label>}

      {/* Hidden File Input */}
      <input
        id="image-upload"
        ref={fileInputRef}
        type="file"
        accept={acceptedFormats.join(",")}
        onChange={handleFileInputChange}
        className="hidden"
      />

      {/* Main Container - Exact aspect-video (16:9) in both states */}
      {value ? (
        <div className="group relative aspect-video w-full overflow-hidden rounded-xl border border-border bg-surface-alt transition-all">
          <img
            src={value}
            alt="Featured preview"
            className="h-full w-full object-cover"
            onError={() =>
              setInternalError("Unable to load image from the provided URL.")
            }
          />

          {/* Hover Actions Overlay */}
          <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/25 opacity-0 backdrop-blur-[2px] transition-opacity group-hover:opacity-100">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="rounded-lg bg-background/90 px-3 py-1.5 text-xs font-semibold text-heading shadow-md backdrop-blur-sm transition-all hover:bg-background"
            >
              Change Image
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="rounded-lg bg-background/90 p-2 text-red-600 shadow-md backdrop-blur-sm transition-all hover:bg-red-50"
              title="Remove image"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`flex aspect-video w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-4 text-center transition-all duration-200 ${
            isDragging
              ? "border-primary bg-primary-light/50 scale-[0.99]"
              : "border-border bg-surface-alt hover:border-primary/60 hover:bg-surface"
          }`}
        >
          <div className="mb-2 rounded-full bg-primary-light p-3 text-primary ring-4 ring-primary-light/30">
            {isDragging ? (
              <UploadCloud className="h-6 w-6 animate-bounce" />
            ) : (
              <ImageIcon className="h-6 w-6" />
            )}
          </div>
          <p className="text-xs font-semibold text-heading">
            <span className="text-primary hover:underline">Click to upload</span> or drag and drop
          </p>
          <p className="mt-1 text-[11px] text-muted">{helperText}</p>
        </div>
      )}

      {/* Direct Link Input */}
      <div className="space-y-1.5">
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted">
            <LinkIcon className="h-4 w-4" />
          </div>
          <input
            type="url"
            value={value}
            onChange={(e) => {
              setInternalError(null);
              onChange(e.target.value);
            }}
            placeholder="Or paste an image URL (https://...)"
            className="pl-9 text-xs"
          />
        </div>

        {/* Validation Errors */}
        {displayedError && (
          <div className="flex items-center gap-1.5 pt-0.5 text-xs text-red-500">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            <span>{displayedError}</span>
          </div>
        )}
      </div>
    </div>
  );
};