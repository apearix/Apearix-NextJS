'use client';
import Link from 'next/link';
export function Footer() {
    return (
        <footer className="relative bg-white text-xs py-3.5 overflow-hidden border-t border-border">
            <div className="mx-auto max-w-8xl relative z-10 justify-between flex items-center">
                <div className="flex items-center gap-2">
                    <Link href="/" className="font-medium text-heading hover:text-primary transition-colors">
                        Apearix
                    </Link>
                    <span>© {new Date().getFullYear()} Apearix Technologies. All rights reserved.</span>
                </div>
                <div className="flex items-center gap-4">
                    <Link href="/legal/privacy-policy" className="hover:text-primary transition-colors">
                        Privacy Policy
                    </Link>
                </div>

            </div>
        </footer>
    );
}
