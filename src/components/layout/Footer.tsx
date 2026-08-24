'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, Phone } from 'lucide-react';
 
function FacebookIcon({ className = "w-5 h-5" }: { className?: string }) {
    return (
        <svg className={className} fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
    );
}

function LinkedInIcon({ className = "w-5 h-5" }: { className?: string }) {
    return (
        <svg className={className} fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
        </svg>
    );
}

function InstagramIcon({ className = "w-5 h-5" }: { className?: string }) {
    return (
        <svg className={className} fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
    );
}

function GithubIcon({ className = "w-5 h-5" }: { className?: string }) {
    return (
        <svg className={className} fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
        </svg>
    );
}

function TwitterIcon({ className = "w-5 h-5" }: { className?: string }) {
    return (
        <svg className={className} fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
    );
}

const socialLinks = [
    {
        name: 'LinkedIn',
        href: 'https://www.linkedin.com/company/apearix/',
        icon: LinkedInIcon,
        hoverColor: 'hover:text-white hover:bg-[#6D28F5]/10 hover:border-white/70',
    },
    {
        name: 'GitHub',
        href: 'https://github.com/apearix',
        icon: GithubIcon,
        hoverColor: 'hover:text-white hover:bg-[#6D28F5]/10 hover:border-white/70',
    },
    {
        name: 'Twitter / X',
        href: 'https://x.com/apearix',
        icon: TwitterIcon,
        hoverColor: 'hover:text-white hover:bg-[#6D28F5]/10 hover:border-white/70',
    },
    {
        name: 'Instagram',
        href: 'https://www.instagram.com/apearix/',
        icon: InstagramIcon,
        hoverColor: 'hover:text-white hover:bg-[#6D28F5]/10 hover:border-white/70',
    },
    {
        name: 'Facebook',
        href: 'https://www.facebook.com/apearix',
        icon: FacebookIcon,
        hoverColor: 'hover:text-white hover:bg-[#6D28F5]/10 hover:border-white/70',
    },
];

const quickLinks = [
    { name: 'About Us', href: '/company/about' },
    { name: 'Careers', href: '/company/careers' },
    { name: 'Portfolio', href: '/work/portfolio' },
    { name: 'Case Studies', href: '/work/case-studies' },
    { name: 'Contact', href: '/company/contact' },
];

const solutionsList = [
    { name: 'Web Development', href: '/services/web-development' },
    { name: 'SaaS Development', href: '/services/saas-development' },
    { name: 'AI Automation', href: '/services/ai-automation' },
    { name: 'UI/UX Design', href: '/services/ui-ux-design' },
    { name: 'Mobile App Dev', href: '/services/mobile-app-development' },
    { name: 'Cloud & DevOps', href: '/services/cloud-devops' },
];
const companyLinks = [
    { name: 'About', href: '/about' },
    { name: 'Work', href: '/work/portfolio' },
    { name: 'Careers', href: '/careers' },
    { name: 'Contact', href: '/contact' },
];

const serviceLinks = [
    { name: 'AI Engineering', href: '/services/ai-engineering' },
    { name: 'Software Development', href: '/services/software-engineering' },
    { name: 'SaaS Development', href: '/services/saas-development' },
    { name: 'Automation', href: '/services/automation' },
    { name: 'Cloud & DevOps', href: '/services/cloud-devops' },
];

const productLinks = [
    { name: 'Apearix Labs', href: '/products' },
    { name: 'SmartTabs', href: '/products#smarttabs' },
    { name: 'AI Products', href: '/products#ai-products' },
    { name: 'Developer Tools', href: '/products#developer-tools' },
];

const resourceLinks = [
    { name: 'Blog', href: '#' },
    { name: 'Documentation', href: '#' },
    { name: 'FAQ', href: '#' },
];
export function Footer() {
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        if (email.trim()) {
            setSubscribed(true);
            setTimeout(() => {
                setEmail('');
                setSubscribed(false);
            }, 4000);
        }
    };

    return (
        <footer className="relative bg-footer text-white pt-12 sm:pt-20 pb-8 overflow-hidden border-t border-white/10">
            {/* Background Ambient Glows */}
            <div className="absolute top-0 left-1/4 w-150 h-150 bg-[#6D28F5]/15 rounded-full blur-[160px] pointer-events-none z-0" />
            <div className="absolute bottom-0 right-1/4 w-125 h-125 bg-[#5B21E6]/10 rounded-full blur-[160px] pointer-events-none z-0" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 xl:px-0  relative z-10">
                {/* Top Grid Section */}
                <div className="grid grid-cols-2 md:grid-cols-12 gap-6 sm:gap-12 pb-12 sm:pb-16 border-b border-white/10">
                    {/* Column 1: Brand & Tagline */}
                    <div className="col-span-2 md:col-span-6 lg:col-span-4  space-y-2 sm:space-y-4">
                        <div className="flex items-center gap-3">
                            <Link href="/" className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
                                <span>Apearix</span>
                            </Link>
                        </div>

                        <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-sm">
                            Engineering Intelligence. Building extraordinary digital experiences, intelligent automated systems, and enterprise cloud solutions.
                        </p>

                        {/* Direct Contact Card */}
                        <div className="space-y-3 pt-2">
                            <a
                                href="mailto:contact@apearix.com"
                                className="group flex items-center gap-3 text-sm text-slate-300 hover:text-white transition-colors"
                            >
                                <div className="p-2 rounded-[10px] bg-white/5 border border-white/10 group-hover:border-[#6D28F5]/50 group-hover:bg-[#6D28F5]/10 transition-all">
                                    <Mail className="w-4 h-4 text-[#6D28F5]" />
                                </div>
                                <span className="font-medium">contact@apearix.com</span>
                            </a>

                            <a
                                href="tel:+917241131839"
                                className="group flex items-center gap-3 text-sm text-slate-300 hover:text-white transition-colors"
                            >
                                <div className="p-2 rounded-[10px] bg-white/5 border border-white/10 group-hover:border-[#6D28F5]/50 group-hover:bg-[#6D28F5]/10 transition-all">
                                    <Phone className="w-4 h-4 text-[#6D28F5]" />
                                </div>
                                <span className="font-medium">+91 72411 31839</span>
                            </a>
                        </div>
                    </div>


                    <div className="md:col-span-3 lg:col-span-2 space-y-4 md:pt-1">
                        <h4 className="text-sm font-bold uppercase tracking-wider text-white">
                            Company
                        </h4>
                        <ul className="sm:space-y-2.5">
                            {companyLinks.map((sol) => (
                                <li key={sol.name}>
                                    <Link
                                        href={sol.href}
                                        className="text-sm text-slate-400 hover:text-white hover:translate-x-1 inline-block transition-all duration-200"
                                    >
                                        {sol.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="md:col-span-3 lg:col-span-2 space-y-4 md:pt-1">
                        <h4 className="text-sm font-bold uppercase tracking-wider text-white">
                            Services
                        </h4>
                        <ul className="sm:space-y-2.5">
                            {serviceLinks.map((sol) => (
                                <li key={sol.name}>
                                    <Link
                                        href={sol.href}
                                        className="text-sm text-slate-400 hover:text-white hover:translate-x-1 inline-block transition-all duration-200"
                                    >
                                        {sol.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="md:col-span-3 lg:col-span-2 space-y-4 md:pt-1">
                        <h4 className="text-sm font-bold uppercase tracking-wider text-white">
                            Products
                        </h4>
                        <ul className="sm:space-y-2.5">
                            {productLinks.map((sol) => (
                                <li key={sol.name}>
                                    <Link
                                        href={sol.href}
                                        className="text-sm text-slate-400 hover:text-white hover:translate-x-1 inline-block transition-all duration-200"
                                    >
                                        {sol.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="md:col-span-3 lg:col-span-2 space-y-4 md:pt-1">
                        <h4 className="text-sm font-bold uppercase tracking-wider text-white">
                            Resources
                        </h4>
                        <ul className="sm:space-y-2.5">
                            {resourceLinks.map((sol) => (
                                <li key={sol.name}>
                                    <Link
                                        href={sol.href}
                                        className="text-sm text-slate-400 hover:text-white hover:translate-x-1 inline-block transition-all duration-200"
                                    >
                                        {sol.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                </div>

                {/* Bottom Copyright & Legal Links Bar */}
                <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-400">
                    <span className="order-3 md:order-1">© {new Date().getFullYear()} Apearix. All rights reserved.</span>
                    {/* Social Icons Bar */}
                    <div className="order-1 md:order-2  flex flex-wrap items-center gap-2.5 justify-center">
                        {socialLinks.map((social) => (
                            <a
                                key={social.name}
                                href={social.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={social.name}
                                className={`p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 transition-all duration-200 ${social.hoverColor} active:scale-95`}
                            >
                                <social.icon className="w-4 h-4" />
                            </a>
                        ))}
                    </div>

                    <div className="order-2 md:order-3 flex items-center gap-6">
                        <Link href="/legal/privacy-policy" className="hover:text-white transition-colors">
                            Privacy Policy
                        </Link>
                        <Link href="/legal/terms-and-conditions" className="hover:text-white transition-colors">
                            Terms of Service
                        </Link>
                        {/* <Link href="/legal/cookie-policy" className="hover:text-white transition-colors">
                            Cookie Policy
                        </Link> */}
                    </div>
                </div>
            </div>
        </footer>
    );
}
