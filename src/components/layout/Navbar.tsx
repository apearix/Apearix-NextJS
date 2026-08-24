'use client';

import { useState, useEffect } from 'react';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown, ArrowRight } from 'lucide-react';
import Apearix from '../common/Apearix';

// --- Navigation Configuration ---
const navigation = {
  services: [
    { name: 'AI Engineering', href: '/services/ai-engineering', desc: 'AI Agents, RAG & Automation' },
    { name: 'Software Engineering', href: '/services/software-engineering', desc: 'Web & Mobile Applications' },
    { name: 'SaaS Development', href: '/services/saas-development', desc: 'End-to-end product builds' },
    { name: 'Cloud & DevOps', href: '/services/cloud-devops', desc: 'Architecture & CI/CD' },
    { name: 'Product Design', href: '/services/product-design', desc: 'UI/UX & Design Systems' },
  ],
  solutions: [
    { name: 'AI Automation', href: '/solutions/ai-automation', desc: 'Streamline workflows intelligently' },
    { name: 'Business Systems', href: '/solutions/business-systems', desc: 'Scalable enterprise software' },
    { name: 'Internal Tools', href: '/solutions/internal-tools', desc: 'Custom operational dashboards' },
    { name: 'Digital Transformation', href: '/solutions/digital-transformation', desc: 'Modernize legacy infrastructure' },
  ],
  products: [
    { name: 'Apearix Labs', href: '/products/labs', desc: 'Experimental internal tools' },
    { name: 'Our Products', href: '/products', desc: 'Products we are building' },
  ],
  directLinks: [
    { name: 'Work', href: '/work' },
    { name: 'About', href: '/about' },
  ]
};

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const pathname = usePathname();
  const { scrollY } = useScroll();

  // Scroll State Listener
  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 20);
  });

  // Keyboard Accessibility: Close dropdown on Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveDropdown(null);
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  // Utility to check active states
  const isActive = (path: string) => pathname?.startsWith(path);

  // Lock page scroll while mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Reusable Desktop Dropdown Component
  const DesktopDropdown = ({ title, id, items }: { title: string, id: string, items: any[] }) => (
    <div
      className="relative py-2"
      onMouseEnter={() => setActiveDropdown(id)}
      onMouseLeave={() => setActiveDropdown(null)}
      onFocus={() => setActiveDropdown(id)}
    >
      <button
        className={`flex items-center gap-1 transition-colors ${isActive(`/${id}`) || activeDropdown === id ? 'text-black' : 'hover:text-black'}`}
        aria-expanded={activeDropdown === id}
        aria-haspopup="menu"
      >
        {title}
        <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${activeDropdown === id ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {activeDropdown === id && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10, transition: { duration: 0.1 } }}
            className="absolute top-full left-1/2 -translate-x-1/2 w-[320px] bg-white border border-black/5 shadow-xl rounded-2xl p-3 flex flex-col"
            role="menu"
          >
            {items.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                role="menuitem"
                className="group p-3 rounded-xl hover:bg-surface-alt transition-colors"
                onClick={() => setActiveDropdown(null)}
              >
                <div className="font-medium text-[var(--color-heading)] group-hover:text-primary transition-colors">
                  {link.name}
                </div>
                <div className="text-xs text-[var(--color-muted)] mt-0.5">
                  {link.desc}
                </div>
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
        ? 'bg-white/80 backdrop-blur-md border-b border-stone-200 shadow-xs py-3'
        : 'bg-transparent border-transparent py-4'
        }`}  >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 xl:px-0 flex justify-between items-center">

        {/* Apearix Logo */}
        <Link href="/" className="group z-50 leading-none outline-none focus:outline-none focus-visible:outline-none" onClick={() => setMobileMenuOpen(false)}>
          <Apearix />
        </Link>

        {/* --- Desktop Navigation --- */}
        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
          <DesktopDropdown title="Services" id="services" items={navigation.services} />
          <DesktopDropdown title="Solutions" id="solutions" items={navigation.solutions} />
          <DesktopDropdown title="Products" id="products" items={navigation.products} />

          {navigation.directLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`py-2 transition-colors ${isActive(link.href) ? 'text-primary' : 'hover:text-black'}`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* --- Desktop CTA & Mobile Toggle --- */}
        <div className="flex items-center space-x-4 z-50">
          <Link
            href="/contact"
            className="hidden md:inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white text-sm font-medium px-5 py-2.5 rounded-full transition-all duration-300 group"
          >
            Let's Build
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-heading p-1 focus-visible:outline-none cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* --- Mobile Menu Drawer --- */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="absolute top-full left-0 right-0 bg-white border-y border-[var(--color-border)] px-6 py-6 overflow-y-auto overscroll-contain touch-pan-y [-webkit-overflow-scrolling:touch] max-h-[calc(100dvh-4.5rem)] shadow-xl md:hidden z-[60]"
          >
            <div className="flex flex-col space-y-6 text-heading text-base font-medium">

              {/* Mobile Dropdown Sections */}
              {[
                { title: 'Services', items: navigation.services },
                { title: 'Solutions', items: navigation.solutions },
                { title: 'Products', items: navigation.products }
              ].map((section) => (
                <div key={section.title} className="border-b border-[var(--color-border-subtle)] pb-4">
                  <p className="text-sm font-semibold uppercase text-muted mb-4 tracking-wider">
                    {section.title}
                  </p>
                  <div className="flex flex-col space-y-4 pl-2">
                    {section.items.map((link) => (
                      <Link
                        key={link.name}
                        href={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-sm  hover:text-primary transition-colors"
                      >
                        {link.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}

              {/* Mobile Direct Links */}
              <div className="flex flex-col space-y-4 pt-2">
                {navigation.directLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

              {/* Mobile CTA */}
              <div className="pt-4 pb-2">
                <Link
                  href="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full  bg-primary text-white text-sm font-medium px-5 py-3.5 rounded-xl transition-all active:scale-[0.98]"
                >
                  Let's Build
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
