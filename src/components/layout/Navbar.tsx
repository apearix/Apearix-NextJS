'use client';

import { useState } from 'react';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Menu, X, ChevronDown } from 'lucide-react';
import { cn } from '@/utils/cn';

const serviceLinks = [
  { name: 'Web Development', href: '/services/web-development' },
  { name: 'SaaS Development', href: '/services/saas-development' },
  { name: 'AI Automation', href: '/services/ai-automation' },
  { name: 'UI/UX Design', href: '/services/ui-ux-design' },
  { name: 'Mobile App Development', href: '/services/mobile-app-development' },
  { name: 'Cloud & DevOps', href: '/services/cloud-devops' },
];

const companyLinks = [
  { name: 'About Us', href: '/company/about' },
  { name: 'Careers', href: '/company/careers' },
  { name: 'Contact', href: '/company/contact' },
];

const workLinks = [
  { name: 'Portfolio', href: '/work/portfolio' },
  { name: 'Case Studies', href: '/work/case-studies' },
];

const resourceLinks = [
  { name: 'Blog', href: '/resources/blog' },
  { name: 'FAQ', href: '/resources/faq' },
];

export function Navbar() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > previous && latest > 150) {
      setVisible(false);
    } else {
      setVisible(true);
    }
    setScrolled(latest > 50);
  });

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.nav
          initial={{ y: -100, opacity: 0 }}
          animate={{ 
            y: visible ? 0 : -100, 
            opacity: visible ? 1 : 0 
          }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className={cn(
            "fixed top-4 sm:top-6 left-1/2 -translate-x-1/2 z-50 flex items-center justify-between px-6 py-2.5 rounded-2xl border transition-all duration-300 w-[92%] max-w-[1280px]",
            scrolled 
              ? "bg-white/85 backdrop-blur-md border-[#E5E7EB] shadow-sm" 
              : "bg-white/60 backdrop-blur-sm border-[#E5E7EB]/60"
          )}
        >
          <div className="flex items-center gap-8">
            <Link href="/" className="text-xl font-bold tracking-tight text-[#111827]">
              Apearix
            </Link>
            
            {/* Desktop Navigation Items */}
            <div className="hidden md:flex items-center gap-6">
              {/* Services Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setActiveDropdown('services')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button className="flex items-center gap-1 text-sm font-medium text-[#4B5563] hover:text-[#111827] transition-colors py-1">
                  <span>Services</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                {activeDropdown === 'services' && (
                  <div className="absolute top-full left-0 pt-2 w-56">
                    <div className="bg-white p-2 rounded-[12px] border border-[#E5E7EB] shadow-xl flex flex-col gap-1">
                      {serviceLinks.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="px-3 py-2 text-xs font-medium text-[#4B5563] hover:text-[#6D28F5] hover:bg-[#F4F0FF] rounded-[8px] transition-colors"
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Company Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setActiveDropdown('company')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button className="flex items-center gap-1 text-sm font-medium text-[#4B5563] hover:text-[#111827] transition-colors py-1">
                  <span>Company</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                {activeDropdown === 'company' && (
                  <div className="absolute top-full left-0 pt-2 w-44">
                    <div className="bg-white p-2 rounded-[12px] border border-[#E5E7EB] shadow-xl flex flex-col gap-1">
                      {companyLinks.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="px-3 py-2 text-xs font-medium text-[#4B5563] hover:text-[#6D28F5] hover:bg-[#F4F0FF] rounded-[8px] transition-colors"
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Work Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setActiveDropdown('work')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button className="flex items-center gap-1 text-sm font-medium text-[#4B5563] hover:text-[#111827] transition-colors py-1">
                  <span>Work</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                {activeDropdown === 'work' && (
                  <div className="absolute top-full left-0 pt-2 w-44">
                    <div className="bg-white p-2 rounded-[12px] border border-[#E5E7EB] shadow-xl flex flex-col gap-1">
                      {workLinks.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="px-3 py-2 text-xs font-medium text-[#4B5563] hover:text-[#6D28F5] hover:bg-[#F4F0FF] rounded-[8px] transition-colors"
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Resources Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setActiveDropdown('resources')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button className="flex items-center gap-1 text-sm font-medium text-[#4B5563] hover:text-[#111827] transition-colors py-1">
                  <span>Resources</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                {activeDropdown === 'resources' && (
                  <div className="absolute top-full left-0 pt-2 w-40">
                    <div className="bg-white p-2 rounded-[12px] border border-[#E5E7EB] shadow-xl flex flex-col gap-1">
                      {resourceLinks.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="px-3 py-2 text-xs font-medium text-[#4B5563] hover:text-[#6D28F5] hover:bg-[#F4F0FF] rounded-[8px] transition-colors"
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/company/contact"
              className="hidden sm:inline-flex items-center justify-center h-12 px-6 rounded-[10px] bg-[#6D28F5] hover:bg-[#5B21E6] active:scale-[0.98] text-white text-sm font-medium transition-all shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6D28F5] focus-visible:ring-offset-2"
            >
              Get Started
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation Menu"
              className="md:hidden p-2 rounded-[10px] text-[#111827] hover:bg-[#F4F0FF] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6D28F5]"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </motion.nav>
      </AnimatePresence>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-4 top-20 z-40 p-6 bg-white/95 backdrop-blur-xl rounded-[16px] border border-[#E5E7EB] shadow-2xl md:hidden flex flex-col gap-4 max-h-[80vh] overflow-y-auto"
          >
            <nav className="flex flex-col gap-4">
              <div>
                <span className="text-xs font-bold text-[#6B7280] uppercase tracking-wider block mb-2 px-2">Services</span>
                <div className="grid grid-cols-1 gap-1">
                  {serviceLinks.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-3 py-2 text-sm font-medium text-[#111827] hover:text-[#6D28F5] hover:bg-[#F4F0FF] rounded-[8px]"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-[#6B7280] uppercase tracking-wider block mb-2 px-2">Company</span>
                <div className="grid grid-cols-1 gap-1">
                  {companyLinks.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-3 py-2 text-sm font-medium text-[#111827] hover:text-[#6D28F5] hover:bg-[#F4F0FF] rounded-[8px]"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-[#6B7280] uppercase tracking-wider block mb-2 px-2">Work & Resources</span>
                <div className="grid grid-cols-1 gap-1">
                  {[...workLinks, ...resourceLinks].map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-3 py-2 text-sm font-medium text-[#111827] hover:text-[#6D28F5] hover:bg-[#F4F0FF] rounded-[8px]"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
            </nav>

            <div className="pt-4 border-t border-[#E5E7EB]">
              <Link
                href="/company/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center h-12 px-6 rounded-[10px] bg-[#6D28F5] text-white text-sm font-medium"
              >
                Get Started
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      href={href}
      className="relative text-sm font-medium text-[#4B5563] hover:text-[#111827] transition-colors py-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
      {isHovered && (
        <motion.div
          layoutId="nav-underline"
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#6D28F5] rounded-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        />
      )}
    </Link>
  );
}
