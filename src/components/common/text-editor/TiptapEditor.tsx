"use client";

import React, { useState, useRef, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { ResizableImage } from "@/components/common/text-editor/ResizableImageExtension";
import {
    Bold,
    Italic,
    Strikethrough,
    Heading2,
    Heading3,
    List,
    ListOrdered,
    Quote,
    Code,
    Undo,
    Redo,
    Link as LinkIcon,
    ExternalLink,
    Unlink,
    Check,
    X,
    Image as ImageIcon,
    Upload,
} from "lucide-react";

interface TiptapEditorProps {
    content: string;
    onChange: (html: string) => void;
    error?: string;
    placeholder?: string;
}

export default function TiptapEditor({
    content,
    onChange,
    error,
    placeholder = "Start writing your content here...",
}: Readonly<TiptapEditorProps>) {

    // Popover States
    const [showLinkPopover, setShowLinkPopover] = useState(false);
    const [urlInput, setUrlInput] = useState("");

    const [showImagePopover, setShowImagePopover] = useState(false);
    const [imageUrlInput, setImageUrlInput] = useState("");

    // Refs for click outside handling
    const popoverRef = useRef<HTMLDivElement>(null);
    const linkButtonRef = useRef<HTMLButtonElement>(null);
    const imagePopoverRef = useRef<HTMLDivElement>(null);
    const imageButtonRef = useRef<HTMLButtonElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: { levels: [2, 3] },
            }),
            Placeholder.configure({
                placeholder: placeholder,
            }),
            Link.configure({
                openOnClick: false,
                autolink: true,
                HTMLAttributes: {
                    class: "text-[var(--color-primary)] underline hover:opacity-80 cursor-pointer font-medium",
                },
            }),
            ResizableImage.configure({
                inline: false,
                allowBase64: true,
            }),
        ],
        content,
        editorProps: {
            attributes: {
                class:
                    "min-h-[350px] w-full px-4 py-2 focus:outline-none text-[var(--color-heading)] text-sm leading-normal prose prose-sm max-w-none [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-2 [&_li]:my-1 [&_li_p]:my-0 [&_li_p]:leading-snug [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:my-3 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:my-2 [&_blockquote]:border-l-4 [&_blockquote]:border-[var(--color-primary)] [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-3",
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        immediatelyRender: false,
    });

    // Click outside to close both popovers
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            const target = event.target as Node;

            // Link Popover close
            if (
                popoverRef.current &&
                !popoverRef.current.contains(target) &&
                linkButtonRef.current &&
                !linkButtonRef.current.contains(target)
            ) {
                setShowLinkPopover(false);
            }

            // Image Popover close
            if (
                imagePopoverRef.current &&
                !imagePopoverRef.current.contains(target) &&
                imageButtonRef.current &&
                !imageButtonRef.current.contains(target)
            ) {
                setShowImagePopover(false);
            }
        }

        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape") {
                setShowLinkPopover(false);
                setShowImagePopover(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    if (!editor) return null;

    // --- LINK ACTIONS ---
    const handleOpenLinkPopover = () => {
        setShowImagePopover(false);
        const existingUrl = editor.getAttributes("link").href || "";
        setUrlInput(existingUrl);
        setShowLinkPopover((prev) => !prev);
    };

    const handleApplyLink = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!urlInput.trim()) {
            editor.chain().focus().extendMarkRange("link").unsetLink().run();
            setShowLinkPopover(false);
            return;
        }

        let formattedUrl = urlInput.trim();
        if (!/^https?:\/\//i.test(formattedUrl) && !formattedUrl.startsWith("mailto:") && !formattedUrl.startsWith("#")) {
            formattedUrl = `https://${formattedUrl}`;
        }

        editor.chain().focus().extendMarkRange("link").setLink({ href: formattedUrl, target: "_blank" }).run();
        setShowLinkPopover(false);
    };

    const handleRemoveLink = () => {
        editor.chain().focus().extendMarkRange("link").unsetLink().run();
        setUrlInput("");
        setShowLinkPopover(false);
    };

    // --- IMAGE ACTIONS ---
    const handleOpenImagePopover = () => {
        setShowLinkPopover(false);
        setImageUrlInput("");
        setShowImagePopover((prev) => !prev);
    };

    // 1. Insert via Web URL
    const handleApplyImageUrl = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (imageUrlInput.trim()) {
            editor.chain().focus().setImage({ src: imageUrlInput.trim() }).run();
            setImageUrlInput("");
            setShowImagePopover(false);
        }
    };

    // 2. Insert via Local File Upload (Reader/Base64)
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const base64Url = event.target?.result as string;
                if (base64Url) {
                    editor.chain().focus().setImage({ src: base64Url }).run();
                }
            };
            reader.readAsDataURL(file);
        }
        // reset input
        if (fileInputRef.current) fileInputRef.current.value = "";
        setShowImagePopover(false);
    };

    const buttonClass = (isActive: boolean) =>
        `p-1.5 rounded text-xs transition-colors ${isActive
            ? "bg-[var(--color-primary-light)] text-[var(--color-primary)] font-semibold"
            : "text-[var(--color-muted)] hover:bg-[var(--color-surface-alt)] hover:text-[var(--color-heading)]"
        }`;

    const isLinkActive = editor.isActive("link");

    return (
        <div
            className={`rounded-xl border bg-[var(--color-background)] shadow-xs transition-colors ${error ? "border-red-500" : "border-[var(--color-border)]"
                }`}
        >
            {/* Hidden File Input for Image Upload */}
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/png, image/jpeg, image/webp, image/gif"
                className="hidden"
            />

            {/* Floating Toolbar */}
            <div className="relative flex flex-wrap items-center gap-1 border-b border-[var(--color-border)] bg-[var(--color-surface-alt)] px-3 py-2 rounded-t-xl">
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={buttonClass(editor.isActive("bold"))}
                    title="Bold (Ctrl+B)"
                >
                    <Bold className="h-4 w-4" />
                </button>

                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={buttonClass(editor.isActive("italic"))}
                    title="Italic (Ctrl+I)"
                >
                    <Italic className="h-4 w-4" />
                </button>

                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    className={buttonClass(editor.isActive("strike"))}
                    title="Strike"
                >
                    <Strikethrough className="h-4 w-4" />
                </button>

                <div className="mx-1 h-4 w-px bg-[var(--color-border)]" />

                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={buttonClass(editor.isActive("heading", { level: 2 }))}
                    title="Heading 2"
                >
                    <Heading2 className="h-4 w-4" />
                </button>

                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    className={buttonClass(editor.isActive("heading", { level: 3 }))}
                    title="Heading 3"
                >
                    <Heading3 className="h-4 w-4" />
                </button>

                <div className="mx-1 h-4 w-px bg-[var(--color-border)]" />

                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={buttonClass(editor.isActive("bulletList"))}
                    title="Bullet List"
                >
                    <List className="h-4 w-4" />
                </button>

                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={buttonClass(editor.isActive("orderedList"))}
                    title="Ordered List"
                >
                    <ListOrdered className="h-4 w-4" />
                </button>

                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    className={buttonClass(editor.isActive("blockquote"))}
                    title="Blockquote"
                >
                    <Quote className="h-4 w-4" />
                </button>

                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                    className={buttonClass(editor.isActive("codeBlock"))}
                    title="Code Block"
                >
                    <Code className="h-4 w-4" />
                </button>

                <div className="mx-1 h-4 w-px bg-[var(--color-border)]" />

                {/* 1. LINK POPOVER TRIGGER */}
                <div className="relative">
                    <button
                        ref={linkButtonRef}
                        type="button"
                        onClick={handleOpenLinkPopover}
                        className={buttonClass(isLinkActive || showLinkPopover)}
                        title="Insert Link"
                    >
                        <LinkIcon className="h-4 w-4" />
                    </button>

                    {showLinkPopover && (
                        <div
                            ref={popoverRef}
                            className="absolute left-0 top-full mt-2 z-50 flex items-center gap-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] p-1.5 shadow-lg min-w-[320px] max-w-[380px]"
                        >
                            <form onSubmit={handleApplyLink} className="flex flex-1 items-center gap-1.5">
                                <input
                                    type="text"
                                    value={urlInput}
                                    onChange={(e) => setUrlInput(e.target.value)}
                                    placeholder="Paste or enter URL..."
                                    autoFocus
                                    className="flex-1 rounded-md border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-2.5 py-1 text-xs text-[var(--color-heading)] placeholder:text-[var(--color-muted)] focus:border-[var(--color-primary)] focus:bg-[var(--color-background)] focus:outline-none"
                                />
                                <button
                                    type="submit"
                                    className="inline-flex items-center justify-center rounded-md bg-[var(--color-primary)] p-1.5 text-white hover:bg-[var(--color-primary-hover)] transition-colors"
                                    title="Apply link"
                                >
                                    <Check className="h-3.5 w-3.5" />
                                </button>
                            </form>

                            {urlInput && (
                                <a
                                    href={urlInput.startsWith("http") ? urlInput : `https://${urlInput}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="rounded-md p-1.5 text-[var(--color-muted)] hover:bg-[var(--color-surface-alt)] hover:text-[var(--color-heading)]"
                                    title="Open link in new tab"
                                >
                                    <ExternalLink className="h-3.5 w-3.5" />
                                </a>
                            )}

                            {isLinkActive && (
                                <button
                                    type="button"
                                    onClick={handleRemoveLink}
                                    className="rounded-md p-1.5 text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                                    title="Remove link"
                                >
                                    <Unlink className="h-3.5 w-3.5" />
                                </button>
                            )}

                            <button
                                type="button"
                                onClick={() => setShowLinkPopover(false)}
                                className="rounded-md p-1.5 text-[var(--color-muted)] hover:bg-[var(--color-surface-alt)] hover:text-[var(--color-heading)]"
                                title="Cancel"
                            >
                                <X className="h-3.5 w-3.5" />
                            </button>
                        </div>
                    )}
                </div>

                {/* 2. IMAGE POPOVER TRIGGER */}
                <div className="relative">
                    <button
                        ref={imageButtonRef}
                        type="button"
                        onClick={handleOpenImagePopover}
                        className={buttonClass(showImagePopover || editor.isActive("image"))}
                        title="Insert Image"
                    >
                        <ImageIcon className="h-4 w-4" />
                    </button>

                    {showImagePopover && (
                        <div
                            ref={imagePopoverRef}
                            className="absolute left-0 top-full mt-2 z-50 flex flex-col gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] p-3 shadow-xl min-w-[340px]"
                        >
                            <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-2">
                                <span className="text-xs font-semibold text-[var(--color-heading)]">Insert Image</span>
                                <button
                                    type="button"
                                    onClick={() => setShowImagePopover(false)}
                                    className="text-[var(--color-muted)] hover:text-[var(--color-heading)]"
                                >
                                    <X className="h-3.5 w-3.5" />
                                </button>
                            </div>

                            {/* Action 1: Upload from local device */}
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="flex items-center justify-center gap-2 rounded-lg border border-dashed border-[var(--color-border-accent)] bg-[var(--color-primary-light)]/40 px-3 py-2 text-xs font-medium text-[var(--color-primary)] hover:bg-[var(--color-primary-light)] transition-colors"
                            >
                                <Upload className="h-3.5 w-3.5" />
                                Upload Image from Device
                            </button>

                            <div className="flex items-center gap-2 text-[10px] text-[var(--color-muted)] uppercase tracking-wider my-0.5">
                                <div className="h-px flex-1 bg-[var(--color-border)]" />
                                <span>OR VIA URL</span>
                                <div className="h-px flex-1 bg-[var(--color-border)]" />
                            </div>

                            {/* Action 2: Image Web URL */}
                            <form onSubmit={handleApplyImageUrl} className="flex items-center gap-1.5">
                                <input
                                    type="url"
                                    value={imageUrlInput}
                                    onChange={(e) => setImageUrlInput(e.target.value)}
                                    placeholder="https://example.com/photo.jpg"
                                    autoFocus
                                    className="flex-1 rounded-md border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-2.5 py-1 text-xs text-[var(--color-heading)] placeholder:text-[var(--color-muted)] focus:border-[var(--color-primary)] focus:bg-[var(--color-background)] focus:outline-none"
                                />
                                <button
                                    type="submit"
                                    className="inline-flex items-center justify-center rounded-md bg-[var(--color-primary)] p-1.5 text-white hover:bg-[var(--color-primary-hover)] transition-colors"
                                    title="Insert from URL"
                                >
                                    <Check className="h-3.5 w-3.5" />
                                </button>
                            </form>
                        </div>
                    )}
                </div>

                {/* History / Undo-Redo */}
                <div className="ml-auto flex items-center gap-1">
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().undo().run()}
                        disabled={!editor.can().undo()}
                        className="p-1.5 text-[var(--color-muted)] hover:text-[var(--color-heading)] disabled:opacity-40"
                        title="Undo"
                    >
                        <Undo className="h-3.5 w-3.5" />
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().redo().run()}
                        disabled={!editor.can().redo()}
                        className="p-1.5 text-[var(--color-muted)] hover:text-[var(--color-heading)] disabled:opacity-40"
                        title="Redo"
                    >
                        <Redo className="h-3.5 w-3.5" />
                    </button>
                </div>
            </div>

            {/* Editor Content Area */}
            <EditorContent editor={editor} />

            {error && (
                <div className="px-6 pb-3 text-xs font-medium text-red-500">
                    {error}
                </div>
            )}
        </div>
    );
}