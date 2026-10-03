"use client";

import { useState, useEffect, useRef } from "react";
import {
  motion,
  useScroll,
  useMotionValueEvent,
  AnimatePresence,
} from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  ChevronDown,
  Bell,
  BellOff,
  Check,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import { getAuthUser } from "@/lib/helpers/helper";
import Apearix from "@/components/common/Apearix";

const mockNotifications = [
  {
    id: 1,
    title: "Report Finalized",
    desc: "Q4 Security Review Meeting report is ready for download.",
    time: "2 min ago",
    type: "success",
    read: false,
  },
  {
    id: 2,
    title: "Payment Required",
    desc: "Invoice #INV-2024-001 is pending payment.",
    time: "1 hour ago",
    type: "alert",
    read: false,
  },
  {
    id: 3,
    title: "System Update",
    desc: "Sirus platform maintenance scheduled for Sunday.",
    time: "1 day ago",
    type: "info",
    read: true,
  },
];

// --- Navigation Configuration ---
const navigation = {
  content: [
    {
      name: "Blogs",
      href: "/admin/blogs",
      desc: "Manage articles, news & blog posts",
    },
    {
      name: "Pages",
      href: "/admin/pages",
      desc: "Create and update static web pages",
    },
    {
      name: "Categories",
      href: "/admin/categories",
      desc: "Organize items into structured categories",
    },
    {
      name: "Category Types",
      href: "/admin/category-types",
      desc: "Manage taxonomy groups & type definitions",
    },
    {
      name: "FAQs",
      href: "/admin/faqs",
      desc: "Frequently asked questions and answers",
    },
  ],
  management: [
    {
      name: "Users",
      href: "/admin/users",
      desc: "Manage user accounts, profiles & access",
    },
    {
      name: "Roles",
      href: "/admin/roles",
      desc: "Control permissions & administrative roles",
    },
    {
      name: "Products",
      href: "/admin/products",
      desc: "Manage product catalog, inventory & details",
    },
    {
      name: "Services",
      href: "/admin/services",
      desc: "Configure offered services & packages",
    },
  ],
  directLinks: [
    { name: "Dashboard", href: "/admin/dashboard" },
    { name: "Settings", href: "/admin/settings" },
  ],
};

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Profile & Notification states
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [authUser, setAuthUser] = useState<any>(null);

  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const pathname = usePathname();
  const { scrollY } = useScroll();

  const hasUnread = mockNotifications.some((n) => !n.read);

  // Scroll State Listener
  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 20);
  });

  const renderAuthSection = () => {
    if (!mounted) {
      return (
        <div
          aria-hidden="true"
          className="flex items-center md:gap-1.5 md:p-1.5 md:pr-2 rounded-full border border-gray-200 bg-white animate-pulse select-none"
        >
          <div className="w-8 h-8 rounded-full bg-gray-200 shrink-0 ring-2 ring-white" />
          <div className="hidden md:flex flex-col gap-1 leading-tight text-left">
            <div className="h-2.5 w-14 bg-gray-200 rounded-sm" />
            <div className="h-2 w-9 bg-gray-100 rounded-xs" />
          </div>
          <div className="hidden md:block w-2 h-2 bg-gray-200 rounded-xs shrink-0 mx-0.5" />
        </div>
      );
    }

    if (authUser) {
      return (
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className={`group flex items-center md:gap-1.5 md:p-1.5 md:pr-2 rounded-full border transition-all outline-none ${
              profileOpen
                ? "bg-gray-50 border-gray-300"
                : "bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50"
            }`}
          >
            {authUser.avatar ? (
              <img
                src={authUser.avatar}
                alt="Avatar"
                className="w-8 h-8 rounded-full object-cover ring-2 ring-white"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 text-white flex items-center justify-center text-xs font-semibold ring-2 ring-white">
                {authUser.initials}
              </div>
            )}

            <div className="text-left hidden md:flex flex-col leading-tight">
              <p className="text-xs font-semibold text-gray-700">
                {authUser.name?.length > 12
                  ? authUser.name.split(" ")[0]
                  : authUser.name}
              </p>
              <p className="text-[10px] font-medium text-gray-400">
                {authUser.role}
              </p>
            </div>

            <ChevronDown
              className={`hidden md:block w-3 h-3 text-gray-400 transition-transform ${
                profileOpen ? "rotate-180 text-gray-600" : ""
              }`}
            />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-3 w-72 bg-white/95 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-2xl ring-1 ring-black/5 z-50">
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center justify-between bg-primary/10 border border-primary/20 rounded-2xl p-4 shadow-sm">
                  <div className="flex flex-col gap-0.5">
                    <p className="text-xs text-primary font-semibold tracking-wide">
                      Token Balance
                    </p>
                    <p className="font-bold text-gray-900 tracking-tight">
                      {authUser.credits}
                    </p>
                  </div>

                  <Link
                    href="/admin/wallet"
                    onClick={closeDropdowns}
                    className="group flex items-center justify-center bg-primary border border-primary/20 hover:border-primary/30 px-3 py-1.5 rounded-lg active:scale-95 transition-all duration-200 ease-in-out"
                  >
                    <span className="text-xs font-semibold text-white">
                      Recharge
                    </span>
                  </Link>
                </div>
              </div>

              <div className="p-2 space-y-1">
                <Link
                  href="/admin/profile"
                  onClick={closeDropdowns}
                  className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-600 rounded-xl hover:bg-gray-50 hover:text-indigo-600"
                >
                  <User className="w-4 h-4" />
                  My Profile
                </Link>

                <Link
                  href="/admin/settings"
                  onClick={closeDropdowns}
                  className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-600 rounded-xl hover:bg-gray-50 hover:text-indigo-600"
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </Link>
              </div>

              <div className="p-2 border-t border-gray-100">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-600 rounded-xl hover:bg-red-50 hover:text-red-600 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  Log Out
                </button>
              </div>
            </div>
          )}
        </div>
      );
    }

    return (
      <Link
        href="/login"
        className="px-5 py-2 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition"
      >
        Login
      </Link>
    );
  };
  
  useEffect(() => {
    setMounted(true);
    if (typeof document === "undefined") return;

    try {
      const { user, role } = getAuthUser();
      if (user) {
        const userName =
          user.name ||
          user.full_name ||
          (user.first_name
            ? `${user.first_name} ${user.last_name}`.trim()
            : "Apearix");

        setAuthUser({
          name: userName,
          role: role,
          avatar: user.avatar,
          initials: userName
            ?.split(" ")
            .map((n: string) => n[0])
            .join("")
            .toUpperCase(),
          credits: user.credits ?? "240.00",
        });
      } else {
        setAuthUser(null);
      }
    } catch {
      setAuthUser(null);
    }
  }, []);

  // Keyboard Accessibility & Click Outside
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveDropdown(null);
        setProfileOpen(false);
        setNotifOpen(false);
      }
    };

    function handleClickOutside(event: MouseEvent) {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
      if (
        notifRef.current &&
        !notifRef.current.contains(event.target as Node)
      ) {
        setNotifOpen(false);
      }
    }

    document.addEventListener("keydown", handleEscape);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("currentUser");
    localStorage.removeItem("userRole");
    window.location.href = "/";
  };

  const closeDropdowns = () => {
    setProfileOpen(false);
    setNotifOpen(false);
    setMobileMenuOpen(false);
  };

  const isActive = (path: string) => pathname?.startsWith(path);

  // Lock page scroll while mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  // Reusable Desktop Dropdown Component
  const DesktopDropdown = ({
    title,
    id,
    items,
  }: {
    title: string;
    id: string;
    items: any[];
  }) => (
    <div
      className="relative py-2"
      onMouseEnter={() => setActiveDropdown(id)}
      onMouseLeave={() => setActiveDropdown(null)}
      onFocus={() => setActiveDropdown(id)}
    >
      <button
        className={`flex items-center gap-1 transition-colors ${
          isActive(`/${id}`) || activeDropdown === id
            ? "text-black"
            : "hover:text-black"
        }`}
        aria-expanded={activeDropdown === id}
        aria-haspopup="menu"
      >
        {title}
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-300 ${
            activeDropdown === id ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {activeDropdown === id && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10, transition: { duration: 0.1 } }}
            className="absolute top-full left-1/2 -translate-x-1/2 w-[320px] bg-white border border-black/5 shadow-xl rounded-2xl p-3 flex flex-col z-50"
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
                <div className="font-medium text-heading group-hover:text-primary transition-colors">
                  {link.name}
                </div>
                <div className="text-xs text-muted mt-0.5">{link.desc}</div>
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 backdrop-blur-md border-b border-stone-200 shadow-xs py-3"
          : "bg-transparent border-transparent py-4"
      }`}
    >
      <div className="mx-auto max-w-8xl flex justify-between items-center">
        {/* Logo */}
        <Link
          href="/"
          className="group z-50 leading-none outline-none focus:outline-none focus-visible:outline-none shrink-0"
          onClick={() => setMobileMenuOpen(false)}
        >
          <Apearix />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
          <DesktopDropdown
            title="Services"
            id="services"
            items={navigation.content}
          />
          <DesktopDropdown
            title="Products"
            id="products"
            items={navigation.management}
          />
          {navigation.directLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`py-2 transition-colors ${
                isActive(link.href) ? "text-primary" : "hover:text-black"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Right Section: Notification, Profile & Mobile Hamburger */}
        <div className="flex items-center gap-2 md:gap-4 z-50">
          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className={`relative p-2 rounded-full hover:bg-gray-100 transition-colors ${
                notifOpen ? "bg-indigo-50 text-indigo-600" : "text-gray-600"
              }`}
            >
              <Bell className="w-5 h-5" />
              {hasUnread && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
              )}
            </button>

            {notifOpen && (
              <div className="absolute right-0 mt-3 w-72 sm:w-80 bg-white/95 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-2xl ring-1 ring-black/5 overflow-hidden animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-200 origin-top-right z-50">
                <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                  <h3 className="text-sm font-semibold text-gray-900">
                    Notifications
                  </h3>
                  {mockNotifications.length > 0 && hasUnread && (
                    <button className="text-xs text-indigo-600 hover:text-indigo-700 font-medium">
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-[350px] overflow-y-auto">
                  {mockNotifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                      <div className="bg-gray-50 p-4 rounded-full mb-3">
                        <BellOff className="w-6 h-6 text-gray-400" />
                      </div>
                      <p className="text-sm font-medium text-gray-900">
                        No notifications
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        You're all caught up!
                      </p>
                    </div>
                  ) : (
                    mockNotifications.map((notif) => (
                      <div
                        key={notif.id}
                        className="px-3 py-3 hover:bg-gray-50 flex gap-2 border-b border-gray-50 last:border-0 cursor-pointer"
                      >
                        <div className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-blue-600 bg-blue-100">
                          <Check size={14} className="text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {notif.title}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                            {notif.desc}
                          </p>
                          <p className="text-[10px] text-gray-400 mt-1.5">
                            {notif.time}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {mockNotifications.length > 0 && (
                  <div className="p-2 border-t border-gray-100 bg-gray-50/50 text-center">
                    <Link
                      href="/admin/notifications"
                      onClick={closeDropdowns}
                      className="text-xs font-medium text-gray-600 hover:text-indigo-600"
                    >
                      View all activity
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>

          {renderAuthSection()}

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-heading p-1 focus-visible:outline-none cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="absolute top-full left-0 right-0 bg-white border-y border-border px-6 py-6 overflow-y-auto overscroll-contain touch-pan-y max-h-[calc(100dvh-4.5rem)] shadow-xl md:hidden z-[60]"
          >
            <div className="flex flex-col space-y-6 text-heading text-base font-medium">
              {[
                { title: "Services", items: navigation.content },
                { title: "Products", items: navigation.management },
              ].map((section) => (
                <div
                  key={section.title}
                  className="border-b border-border-subtle pb-4"
                >
                  <p className="text-sm font-semibold uppercase text-muted mb-4 tracking-wider">
                    {section.title}
                  </p>
                  <div className="flex flex-col space-y-4 pl-2">
                    {section.items.map((link) => (
                      <Link
                        key={link.name}
                        href={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-sm hover:text-primary transition-colors"
                      >
                        {link.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}

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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
