'use client';

import { useState } from 'react';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Menu, X, ChevronDown } from 'lucide-react';
import { cn } from '@/utils/cn';
import Image from 'next/image';

const serviceLinks = [
  { name: 'Web Development', href: '/services/web-development' },
  { name: 'SaaS Development', href: '/services/saas-development' },
  { name: 'AI Automation', href: '/services/ai-automation' },
  { name: 'UI/UX Design', href: '/services/ui-ux-design' },
  { name: 'Mobile App Development', href: '/services/mobile-app-development' }, 
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
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 20) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  });

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-panel-light border-b border-black/5 px-6 py-4 bg-white/80 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        {/* Logo Section */}
        <Link href="/" className="flex items-center  group">
          <div className="relative w-8 h-8 "> 
            <Image 
              src="/logo.png" 
              alt="Textile Logo" 
              fill 
              className="object-cover group-hover:scale-105 transition-transform duration-300" 
              priority
            />
          </div>
          <span className="font-semibold tracking-tight text-xl text-[#1D1D1F]">
            Apearix
          </span>
        </Link>

        {/* Desktop Navigation with Dropdowns */}
        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-[#515154]">
          
          {/* Services Dropdown */}
          <div 
            className="relative py-2"
            onMouseEnter={() => setActiveDropdown('services')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button className="flex items-center gap-1 hover:text-black transition-colors">
              Services <ChevronDown className={`w-4 h-4 transition-transform ${activeDropdown === 'services' ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {activeDropdown === 'services' && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full left-0 w-56 bg-white border border-black/5 shadow-xl rounded-2xl p-2 flex flex-col space-y-1"
                >
                  {serviceLinks.map((link) => (
                    <Link key={link.name} href={link.href} className="px-3 py-2 rounded-lg hover:bg-black/5 text-[#515154] hover:text-black transition-colors">
                      {link.name}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Work Dropdown */}
          <div 
            className="relative py-2"
            onMouseEnter={() => setActiveDropdown('work')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button className="flex items-center gap-1 hover:text-black transition-colors">
              Work <ChevronDown className={`w-4 h-4 transition-transform ${activeDropdown === 'work' ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {activeDropdown === 'work' && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full left-0 w-48 bg-white border border-black/5 shadow-xl rounded-2xl p-2 flex flex-col space-y-1"
                >
                  {workLinks.map((link) => (
                    <Link key={link.name} href={link.href} className="px-3 py-2 rounded-lg hover:bg-black/5 text-[#515154] hover:text-black transition-colors">
                      {link.name}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Company Dropdown */}
          <div 
            className="relative py-2"
            onMouseEnter={() => setActiveDropdown('company')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button className="flex items-center gap-1 hover:text-black transition-colors">
              Company <ChevronDown className={`w-4 h-4 transition-transform ${activeDropdown === 'company' ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {activeDropdown === 'company' && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full left-0 w-48 bg-white border border-black/5 shadow-xl rounded-2xl p-2 flex flex-col space-y-1"
                >
                  {companyLinks.map((link) => (
                    <Link key={link.name} href={link.href} className="px-3 py-2 rounded-lg hover:bg-black/5 text-[#515154] hover:text-black transition-colors">
                      {link.name}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Resources Dropdown */}
          <div 
            className="relative py-2"
            onMouseEnter={() => setActiveDropdown('resources')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button className="flex items-center gap-1 hover:text-black transition-colors">
              Resources <ChevronDown className={`w-4 h-4 transition-transform ${activeDropdown === 'resources' ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {activeDropdown === 'resources' && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full left-0 w-48 bg-white border border-black/5 shadow-xl rounded-2xl p-2 flex flex-col space-y-1"
                >
                  {resourceLinks.map((link) => (
                    <Link key={link.name} href={link.href} className="px-3 py-2 rounded-lg hover:bg-black/5 text-[#515154] hover:text-black transition-colors">
                      {link.name}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </nav>

        {/* Action Button & Mobile Toggle */}
        <div className="flex items-center space-x-4">
          <Link href="/company/contact" className="bg-[#6D28F5] hover:bg-[#5B21E6]  text-white text-xs font-semibold px-5 py-2.5 rounded-full transition-all duration-300">
            Request Demo
          </Link>

          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className="md:hidden text-[#1D1D1F] p-1"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-black/5 px-6 py-6 overflow-y-auto max-h-[80vh]"
          >
            <div className="flex flex-col space-y-6 text-sm font-medium text-[#515154]">
              
              <div>
                <p className="text-xs font-semibold uppercase text-black/40 mb-2">Services</p>
                <div className="flex flex-col space-y-2 pl-2">
                  {serviceLinks.map((link) => (
                    <Link key={link.name} href={link.href} onClick={() => setMobileMenuOpen(false)} className="hover:text-black">
                      {link.name}
                    </Link>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase text-black/40 mb-2">Work</p>
                <div className="flex flex-col space-y-2 pl-2">
                  {workLinks.map((link) => (
                    <Link key={link.name} href={link.href} onClick={() => setMobileMenuOpen(false)} className="hover:text-black">
                      {link.name}
                    </Link>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase text-black/40 mb-2">Company</p>
                <div className="flex flex-col space-y-2 pl-2">
                  {companyLinks.map((link) => (
                    <Link key={link.name} href={link.href} onClick={() => setMobileMenuOpen(false)} className="hover:text-black">
                      {link.name}
                    </Link>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase text-black/40 mb-2">Resources</p>
                <div className="flex flex-col space-y-2 pl-2">
                  {resourceLinks.map((link) => (
                    <Link key={link.name} href={link.href} onClick={() => setMobileMenuOpen(false)} className="hover:text-black">
                      {link.name}
                    </Link>
                  ))}
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}