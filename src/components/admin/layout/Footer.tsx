'use client';
import Link from 'next/link';
export function Footer() {
    return (
        <footer className="relative bg-white text-sm py-3.5 overflow-hidden border-t border-gray-100">
            <div className="mx-auto max-w-8xl relative z-10">
                <div className="flex flex-row items-center justify-between gap-4 transition-colors hover:text-black">
                    <span className="order-1">© {new Date().getFullYear()} Apearix. All rights reserved.</span>

                    <div className="order-2 flex items-center gap-6">
                        <Link href="/legal/privacy-policy" className="transition-colors hover:text-black">
                            Privacy Policy.
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
