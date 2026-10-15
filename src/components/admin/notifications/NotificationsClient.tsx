"use client";

import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell,
  BellOff,
  CheckCheck,
  CheckCircle2,
  Trash2,
  Settings,
  Shield,
  CreditCard,
  Server,
  MessageSquare,
  AlertTriangle,
  Clock,
  MoreVertical,
  Search,
  X,
  Filter,
  ArrowUpDown,
  ExternalLink,
  Sparkles,
  Layers,
  ChevronRight,
  Eye,
  EyeOff,
  Copy,
  VolumeX,
  RefreshCw,
  PlusCircle,
  Radio, 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  type NotificationItem,
  type NotificationCategory,
  type NotificationPriority,
  INITIAL_NOTIFICATIONS,
  getStoredNotifications,
  saveNotifications,
  markNotificationAsRead,
  markNotificationAsUnread,
  markAllNotificationsAsRead,
  deleteNotificationItem,
  clearAllNotifications,
  resetNotificationsToDefault,
  addLiveNotification,
  getRelativeTimeString,
  NOTIFICATIONS_UPDATED_EVENT,
} from "@/lib/services/admin/notifications";
import { NotificationDrawer } from "./NotificationDrawer";
import { ConfirmDeleteModal } from "@/components/admin/modals/ConfirmDeleteModal";
import { TablePagination } from "@/components/admin/common/TablePagination";

export function NotificationsClient() {
  const router = useRouter();

  // Core Data States
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLiveActive, setIsLiveActive] = useState<boolean>(true);

  // Filter & Search States
  const [activeTab, setActiveTab] = useState<NotificationCategory>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "unread" | "priority">("newest");
  const [isGrouped, setIsGrouped] = useState<boolean>(true);
  const [mutedCategories, setMutedCategories] = useState<string[]>([]);

  // Pagination States
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // Selected Notification for Drawer
  const [selectedNotification, setSelectedNotification] = useState<NotificationItem | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  // Modals & Popovers
  const [isClearModalOpen, setIsClearModalOpen] = useState<boolean>(false);
  const [openMeatballId, setOpenMeatballId] = useState<string | null>(null);

  // Toast Notification State
  const [toast, setToast] = useState<{ msg: string; type?: "success" | "info" | "error" } | null>(null);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showToast = useCallback((msg: string, type: "success" | "info" | "error" = "success") => {
    setToast({ msg, type });
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = setTimeout(() => {
      setToast(null);
    }, 3500);
  }, []);

  // Sync notifications from localStorage / Initial load
  const loadNotifications = useCallback(() => {
    try {
      const items = getStoredNotifications();
      setNotifications(items);
    } catch (err) {
      console.error("Error loading notifications:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNotifications();

    // Fetch from backend if available
    import("@/lib/services/admin/notifications")
      .then(({ fetchNotificationsFromApi }) => {
        fetchNotificationsFromApi().then((items) => {
          if (items && items.length > 0) setNotifications(items);
        }).catch(() => {});
      })
      .catch(() => {});

    const handleExternalUpdate = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail?.items) {
        setNotifications(customEvent.detail.items);
      } else {
        loadNotifications();
      }
    };

    window.addEventListener(NOTIFICATIONS_UPDATED_EVENT, handleExternalUpdate);

    return () => {
      window.removeEventListener(NOTIFICATIONS_UPDATED_EVENT, handleExternalUpdate);
    };
  }, [loadNotifications]); 
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-meatball-container]")) {
        setOpenMeatballId(null);
      }
    };
    document.addEventListener("mousedown", handleDocumentClick);
    return () => {
      document.removeEventListener("mousedown", handleDocumentClick);
    };
  }, []);

  // Real-time Simulation: Auto-generate periodic realistic notification if live is active
  useEffect(() => {
    if (!isLiveActive) return;

    const sampleLiveEvents: Partial<NotificationItem>[] = [
      {
        title: "Database Index Rebuilt",
        action: "finished re-indexing high-frequency tables in",
        target: "Analytics DB",
        snippet: "Query performance improved by 24% after automated pg_repack indexing.",
        category: "system",
        priority: "low",
        cta: { label: "View Metrics", href: "/admin/dashboard", variant: "secondary" },
        metadata: { engine: "PostgreSQL 17", duration: "42s" },
      },
      {
        title: "API Key Generated",
        actor: { name: "Priyanshi Patel", initials: "PP", role: "DevOps Engineer" },
        action: "generated a new read-only production token for",
        target: "Prometheus Monitoring",
        snippet: "Scoped token 'sc-prod-metrics-v3' generated with 30-day expiration.",
        category: "security",
        priority: "medium",
        cta: { label: "Review Keys", href: "/admin/settings", variant: "outline" },
        metadata: { ip: "103.44.112.90", scope: "read:metrics" },
      },
      {
        title: "New User Registration",
        actor: { name: "Kabir Mehra", initials: "KM", role: "Enterprise Client" },
        action: "completed onboarding for",
        target: "Apearix Cloud Suite",
        snippet: "New enterprise workspace configured with 10 team seats activated.",
        category: "activity",
        priority: "low",
        cta: { label: "View User", href: "/admin/users", variant: "primary" },
      },
    ];

    // Background interval every 75 seconds for natural live behavior
    const interval = setInterval(() => {
      const randomEvent = sampleLiveEvents[Math.floor(Math.random() * sampleLiveEvents.length)];
      const added = addLiveNotification(randomEvent);
      showToast(`New alert received: ${added.title}`, "info");
    }, 75000);

    return () => clearInterval(interval);
  }, [isLiveActive, showToast]);

  // Quick Action Handlers
  const handleMarkAllRead = () => {
    const updated = markAllNotificationsAsRead();
    setNotifications(updated);
    showToast("All notifications marked as read");
  };

  const handleToggleRead = (id: string, currentRead: boolean) => {
    let updated: NotificationItem[];
    if (currentRead) {
      updated = markNotificationAsUnread(id);
      showToast("Notification marked as unread", "info");
    } else {
      updated = markNotificationAsRead(id);
      showToast("Notification marked as read", "success");
    }
    setNotifications(updated);
    if (selectedNotification?.id === id) {
      setSelectedNotification(updated.find((item) => item.id === id) || null);
    }
  };

  const handleDelete = (id: string) => {
    const updated = deleteNotificationItem(id);
    setNotifications(updated);
    showToast("Notification removed", "info");
    if (selectedNotification?.id === id) {
      setSelectedNotification(null);
      setIsDrawerOpen(false);
    }
  };

  const handleClearAll = () => {
    const updated = clearAllNotifications();
    setNotifications(updated);
    setIsClearModalOpen(false);
    showToast("All notifications cleared");
  };

  const handleRestoreDefaults = () => {
    const restored = resetNotificationsToDefault();
    setNotifications(restored);
    showToast("Restored default notifications");
  };

  const handleSimulateNewAlert = () => {
    const newAlert = addLiveNotification({
      title: "Real-time Test Alert",
      actor: { name: "System Sentinel", initials: "SS", role: "Real-time Bot" },
      action: "simulated a live system event for",
      target: "Apearix Admin Hub",
      snippet: "Real-time event synchronized across active tabs and the navbar bell badge.",
      category: "system",
      priority: "high",
      cta: { label: "Inspect Live State", href: "/admin/dashboard", variant: "primary" },
      metadata: { testId: `sim-${Date.now()}`, timestamp: new Date().toISOString() },
    });
    showToast(`Live alert triggered: "${newAlert.title}"`, "success");
  };

  const handleMuteCategory = (category: string) => {
    if (!mutedCategories.includes(category)) {
      setMutedCategories([...mutedCategories, category]);
      showToast(`Muted future "${category}" notifications`, "info");
    } else {
      setMutedCategories(mutedCategories.filter((c) => c !== category));
      showToast(`Unmuted "${category}" notifications`, "info");
    }
  };

  const handleCopyDetails = (item: NotificationItem) => {
    const text = `[${item.category.toUpperCase()}] ${item.title}: ${item.snippet} (${new Date(item.createdAt).toLocaleString()})`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      showToast("Notification details copied to clipboard");
    }
  };

  const handleCardClick = (item: NotificationItem) => {
    if (!item.read) {
      const updated = markNotificationAsRead(item.id);
      setNotifications(updated);
    }
    setSelectedNotification(item);
    setIsDrawerOpen(true);
  };

  // Counts for Badges
  const counts = useMemo(() => {
    const unread = notifications.filter((n) => !n.read).length;
    const activity = notifications.filter((n) => n.category === "activity").length;
    const system = notifications.filter((n) => n.category === "system").length;
    const security = notifications.filter((n) => n.category === "security").length;
    const billing = notifications.filter((n) => n.category === "billing").length;

    return {
      all: notifications.length,
      unread,
      activity,
      system,
      security,
      billing,
    };
  }, [notifications]);

  // Filtered & Sorted notifications
  const filteredNotifications = useMemo(() => {
    let result = [...notifications];

    // Filter by Tab
    if (activeTab === "unread") {
      result = result.filter((n) => !n.read);
    } else if (activeTab !== "all") {
      result = result.filter((n) => n.category === activeTab);
    }

    // Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((n) => {
        return (
          n.title.toLowerCase().includes(q) ||
          n.snippet.toLowerCase().includes(q) ||
          n.action.toLowerCase().includes(q) ||
          (n.target && n.target.toLowerCase().includes(q)) ||
          (n.actor?.name && n.actor.name.toLowerCase().includes(q)) ||
          n.category.toLowerCase().includes(q)
        );
      });
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === "oldest") {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      if (sortBy === "unread") {
        if (a.read === b.read) {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        return a.read ? 1 : -1;
      }
      if (sortBy === "priority") {
        const priorityOrder: Record<NotificationPriority, number> = {
          urgent: 4,
          high: 3,
          medium: 2,
          low: 1,
        };
        const pDiff = (priorityOrder[b.priority] || 1) - (priorityOrder[a.priority] || 1);
        if (pDiff !== 0) return pDiff;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return 0;
    });

    return result;
  }, [notifications, activeTab, searchQuery, sortBy]);

  // Paginated notifications
  const paginatedNotifications = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredNotifications.slice(start, start + pageSize);
  }, [filteredNotifications, currentPage, pageSize]);

  // Group notifications by date bucket for structured layout
  const groupedNotifications = useMemo(() => {
    if (!isGrouped) return { All: paginatedNotifications };

    const groups: Record<string, NotificationItem[]> = {};
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const yesterday = today - 24 * 60 * 60 * 1000;

    paginatedNotifications.forEach((item) => {
      const itemDate = new Date(item.createdAt);
      const itemDay = new Date(itemDate.getFullYear(), itemDate.getMonth(), itemDate.getDate()).getTime();

      let groupKey = "Earlier";
      if (itemDay === today) {
        groupKey = "Today";
      } else if (itemDay === yesterday) {
        groupKey = "Yesterday";
      }

      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(item);
    });

    return groups;
  }, [paginatedNotifications, isGrouped]);

  // Reset to page 1 when filter or tab changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery, sortBy]);

  // Category Configuration
  const tabs: { id: NotificationCategory; label: string; count: number }[] = [
    { id: "all", label: "All Alerts", count: counts.all },
    { id: "unread", label: "Unread", count: counts.unread },
    { id: "activity", label: "Mentions & Activity", count: counts.activity },
    { id: "system", label: "System & Platform", count: counts.system },
    { id: "security", label: "Security", count: counts.security },
    { id: "billing", label: "Billing & Finance", count: counts.billing },
  ];

  // Helper for Contextual Icon Box
  const renderCategoryIcon = (category: string) => {
    switch (category) {
      case "security":
        return (
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200/80 text-emerald-600 flex items-center justify-center shrink-0 shadow-xs">
            <Shield className="w-5 h-5" />
          </div>
        );
      case "billing":
        return (
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200/80 text-blue-600 flex items-center justify-center shrink-0 shadow-xs">
            <CreditCard className="w-5 h-5" />
          </div>
        );
      case "system":
        return (
          <div className="w-10 h-10 rounded-xl bg-purple-50 border border-primary/20 text-primary flex items-center justify-center shrink-0 shadow-xs">
            <Server className="w-5 h-5" />
          </div>
        );
      case "activity":
      default:
        return (
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200/80 text-indigo-600 flex items-center justify-center shrink-0 shadow-xs">
            <MessageSquare className="w-5 h-5" />
          </div>
        );
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 text-xs font-semibold rounded-xl shadow-2xl border transition-all duration-200 animate-in fade-in slide-in-from-bottom-2 ${
            toast.type === "error"
              ? "bg-rose-950 text-rose-100 border-rose-800"
              : toast.type === "info"
              ? "bg-surface-alt text-heading border-border"
              : "bg-heading text-white border-white/10"
          }`}
        >
          {toast.type === "error" ? (
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
          ) : toast.type === "info" ? (
            <Radio className="w-4 h-4 text-primary shrink-0 animate-pulse" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          )}
          <span>{toast.msg}</span>
        </div>
      )}

      {/* ============================================================ */}
      {/* 1. HEADER & QUICK ACTIONS                                      */}
      {/* ============================================================ */}
      <div className="relative overflow-hidden rounded-2xl border border-border-accent/40 bg-gradient-to-r from-primary-light/60 via-surface to-background p-6 md:p-8">
        <div className="absolute right-0 top-0 -mt-6 -mr-6 h-48 w-48 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                <Sparkles size={13} />
                Live Notification Center
              </span>

              {/* Live sync pulse badge */}
              <button
                type="button"
                onClick={() => setIsLiveActive(!isLiveActive)}
                className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium border transition-colors cursor-pointer ${
                  isLiveActive
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100/70"
                    : "bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200"
                }`}
                title="Click to toggle automatic real-time sync simulation"
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isLiveActive ? "bg-emerald-500 animate-pulse" : "bg-gray-400"
                  }`}
                />
                <span>{isLiveActive ? "Sync Active" : "Sync Paused"}</span>
              </button>
            </div>

            <div className="flex items-baseline gap-3">
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-heading">
                Notifications
              </h1>
              {counts.unread > 0 ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-bold rounded-full bg-primary text-white shadow-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                  {counts.unread} unread
                </span>
              ) : (
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  All caught up
                </span>
              )}
            </div>

            <p className="text-muted text-xs md:text-sm">
              Review critical system alerts, team actions, transaction invoices, and security logs in real time.
            </p>
          </div>

          {/* Quick Action CTAs */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
            {/* Simulate live alert */}
            <button
              type="button"
              onClick={handleSimulateNewAlert}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-surface-alt border border-border text-heading text-xs font-semibold rounded-xl shadow-xs transition-all active:scale-[0.98] cursor-pointer"
              title="Push a test notification to test real-time updates"
            >
              <PlusCircle className="w-3.5 h-3.5 text-primary" />
              <span>Simulate Alert</span>
            </button>

            {/* Mark all as read */}
            {counts.unread > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-semibold rounded-xl shadow-xs transition-all active:scale-[0.98] cursor-pointer"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark all read</span>
              </button>
            )}

            {/* Notification Preferences / Settings Link */}
            <Link
              href="/admin/profile?tab=preferences"
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-surface-alt border border-border text-heading text-xs font-semibold rounded-xl shadow-xs transition-all active:scale-[0.98] cursor-pointer"
              title="Configure email, push, and security alert preferences"
            >
              <Settings className="w-3.5 h-3.5 text-muted" />
              <span className="hidden sm:inline">Preferences</span>
            </Link>

            {/* Clear / Archive All */}
            {notifications.length > 0 && (
              <button
                type="button"
                onClick={() => setIsClearModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:border-rose-300 hover:text-rose-600 border border-border text-heading text-xs font-semibold rounded-xl shadow-xs transition-all active:scale-[0.98] cursor-pointer"
                title="Clear all alerts"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Clear All</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2. SMART TABS & FILTERS                                        */}
      {/* ============================================================ */}
      <div className="bg-white rounded-2xl border border-border shadow-xs p-4 space-y-4">
        {/* Horizontal Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar border-b border-border/60">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? "text-primary bg-primary-light/70 shadow-xs"
                    : "text-muted hover:text-heading hover:bg-surface-alt"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold transition-colors ${
                    isActive
                      ? "bg-primary text-white"
                      : "bg-surface border border-border text-muted"
                  }`}
                >
                  {tab.count}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="activeTabUnderline"
                    className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary rounded-full"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Search, Sort & View Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search notifications by title, actor, or keyword..."
              className="w-full pl-9 pr-9 py-2 text-xs rounded-xl border border-border bg-surface hover:bg-white focus:bg-white text-heading placeholder:text-muted focus:outline-none focus:border-primary transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-heading cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Controls: Sort Dropdown & Grouping Toggle */}
          <div className="flex items-center gap-2 justify-end">
            {/* Sort Selector */}
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-border bg-surface text-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-muted shrink-0" />
              <label htmlFor="sortSelect" className="sr-only">Sort by</label>
              <select
                id="sortSelect"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent border-none text-xs font-semibold text-heading focus:outline-none p-0 cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="unread">Unread First</option>
                <option value="priority">Priority Order</option>
              </select>
            </div>

            {/* Group Similar Toggle */}
            <button
              type="button"
              onClick={() => setIsGrouped(!isGrouped)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-colors cursor-pointer ${
                isGrouped
                  ? "bg-primary-light border-primary/30 text-primary"
                  : "bg-surface border-border text-muted hover:text-heading"
              }`}
              title="Group notifications chronologically (Today, Yesterday, Earlier)"
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Grouped</span>
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 3. & 4. NOTIFICATION CARDS & INTERACTIVE STATES               */}
      {/* ============================================================ */}
      {isLoading ? (
        /* Loading Skeleton */
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="p-4 rounded-2xl border border-border bg-white animate-pulse flex items-start gap-4"
            >
              <div className="w-10 h-10 rounded-xl bg-gray-200 shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded-md w-1/3" />
                <div className="h-3 bg-gray-100 rounded-md w-3/4" />
                <div className="h-2.5 bg-gray-100 rounded-md w-1/4 mt-2" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredNotifications.length === 0 ? (
        /* Empty State */
        <div className="p-12 text-center rounded-2xl border border-border bg-white shadow-xs flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-primary-light text-primary flex items-center justify-center shadow-xs">
            <BellOff className="w-8 h-8" />
          </div>
          <div className="space-y-1 max-w-md">
            <h3 className="text-lg font-bold text-heading">
              {searchQuery
                ? "No matching alerts found"
                : activeTab === "unread"
                ? "All caught up!"
                : "No notifications here"}
            </h3>
            <p className="text-xs sm:text-sm text-muted">
              {searchQuery
                ? `No alerts matched your search query "${searchQuery}". Try searching with different keywords.`
                : activeTab === "unread"
                ? "You have reviewed all your pending alerts. Great job keeping your workspace clean!"
                : "There are currently no notifications in this category."}
            </p>
          </div>

          <div className="flex items-center gap-3 pt-2">
            {searchQuery ? (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-surface-alt border border-border text-heading hover:bg-border/30 transition-colors cursor-pointer"
              >
                Clear Search
              </button>
            ) : notifications.length === 0 ? (
              <button
                type="button"
                onClick={handleRestoreDefaults}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-primary hover:bg-primary-hover text-white transition-colors cursor-pointer shadow-xs"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Restore Sample Alerts
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setActiveTab("all")}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-primary hover:bg-primary-hover text-white transition-colors cursor-pointer shadow-xs"
              >
                View All Alerts
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Notification Groups & Items */
        <div className="space-y-6">
          {Object.entries(groupedNotifications).map(([groupTitle, items]) => {
            if (items.length === 0) return null;
            return (
              <div key={groupTitle} className="space-y-3">
                {isGrouped && (
                  <div className="flex items-center gap-2 px-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted">
                      {groupTitle}
                    </span>
                    <span className="text-[11px] font-semibold text-muted/60">
                      ({items.length})
                    </span>
                    <div className="flex-1 h-px bg-border/60 ml-2" />
                  </div>
                )}

                <div className="space-y-2.5">
                  <AnimatePresence>
                    {items.map((item) => {
                      const isUnread = !item.read;
                      const hasAvatar = Boolean(item.actor?.avatar);

                      return (
                        <motion.div
                          key={item.id}
                          layout
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.98 }}
                          transition={{ duration: 0.2 }}
                          onClick={() => handleCardClick(item)}
                          className={`group relative rounded-2xl border p-4 sm:p-5 transition-all duration-200 cursor-pointer ${
                            isUnread
                              ? "bg-primary/[0.025] hover:bg-primary/[0.05] border-primary/25 shadow-xs"
                              : "bg-white hover:bg-surface-alt/70 border-border"
                          }`}
                        >
                          <div className="flex items-start gap-3.5 sm:gap-4">
                            {/* Unread Left Dot Indicator */}
                            <div className="pt-2 sm:pt-2.5 shrink-0">
                              <span
                                className={`block w-2.5 h-2.5 rounded-full transition-all ${
                                  isUnread
                                    ? "bg-primary ring-4 ring-primary/20 animate-pulse"
                                    : "bg-transparent"
                                }`}
                                title={isUnread ? "Unread alert" : "Read"}
                              />
                            </div>

                            {/* Visual Anchor (Avatar or Contextual Icon Box) */}
                            <div className="relative shrink-0">
                              {item.actor ? (
                                item.actor.avatar ? (
                                  <img
                                    src={item.actor.avatar}
                                    alt={item.actor.name}
                                    className="w-10 h-10 rounded-xl object-cover ring-2 ring-white shadow-xs"
                                  />
                                ) : (
                                  <div className="w-10 h-10 rounded-xl bg-primary text-white font-bold text-xs flex items-center justify-center shadow-xs">
                                    {item.actor.initials || "SS"}
                                  </div>
                                )
                              ) : (
                                renderCategoryIcon(item.category)
                              )}

                              {/* Tiny Category Overlay on Avatar */}
                              {item.actor && (
                                <span className="absolute -bottom-1 -right-1 p-0.5 rounded-full bg-white shadow-xs">
                                  {item.category === "security" && (
                                    <Shield className="w-3.5 h-3.5 text-emerald-600 bg-emerald-50 rounded-full p-0.5" />
                                  )}
                                  {item.category === "billing" && (
                                    <CreditCard className="w-3.5 h-3.5 text-blue-600 bg-blue-50 rounded-full p-0.5" />
                                  )}
                                  {item.category === "system" && (
                                    <Server className="w-3.5 h-3.5 text-primary bg-purple-50 rounded-full p-0.5" />
                                  )}
                                  {item.category === "activity" && (
                                    <MessageSquare className="w-3.5 h-3.5 text-indigo-600 bg-indigo-50 rounded-full p-0.5" />
                                  )}
                                </span>
                              )}
                            </div>

                            {/* Content Area */}
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  {/* Category Tag */}
                                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-surface-alt border border-border text-muted">
                                    {item.category}
                                  </span>

                                  {/* Priority Tag */}
                                  {item.priority === "urgent" && (
                                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200">
                                      Urgent
                                    </span>
                                  )}
                                  {item.priority === "high" && (
                                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200">
                                      High
                                    </span>
                                  )}

                                  {/* Title */}
                                  <h4 className="text-xs sm:text-sm font-bold text-heading truncate">
                                    {item.title}
                                  </h4>
                                </div>

                                {/* Timestamp */}
                                <div
                                  className="text-[11px] text-muted flex items-center gap-1 shrink-0"
                                  title={new Date(item.createdAt).toLocaleString()}
                                >
                                  <Clock className="w-3 h-3" />
                                  <span>{getRelativeTimeString(item.createdAt)}</span>
                                </div>
                              </div>

                              {/* Bold Actor & Action Sentence */}
                              <p className="text-xs sm:text-sm text-heading leading-snug">
                                {item.actor ? (
                                  <>
                                    <span className="font-bold text-heading">
                                      {item.actor.name}
                                    </span>{" "}
                                    <span className="text-body">{item.action}</span>{" "}
                                    {item.target && (
                                      <span className="font-semibold text-primary underline-offset-2 hover:underline">
                                        {item.target}
                                      </span>
                                    )}
                                  </>
                                ) : (
                                  <>
                                    <span className="text-body">{item.action}</span>{" "}
                                    {item.target && (
                                      <span className="font-semibold text-heading">
                                        {item.target}
                                      </span>
                                    )}
                                  </>
                                )}
                              </p>

                              {/* Snippet / Preview Text */}
                              <p className="text-xs text-muted mt-1 line-clamp-2 leading-relaxed">
                                {item.snippet}
                              </p>

                              {/* Action Row: CTA & Actions */}
                              <div className="flex flex-wrap items-center justify-between gap-3 mt-3 pt-2.5 border-t border-border/40">
                                <div className="flex items-center gap-2">
                                  {/* Direct CTA */}
                                  {item.cta && (
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        if (!item.read) handleToggleRead(item.id, false);
                                        if (item.cta?.href) {
                                          router.push(item.cta.href);
                                        } else {
                                          setSelectedNotification(item);
                                          setIsDrawerOpen(true);
                                        }
                                      }}
                                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-xs cursor-pointer ${
                                        item.cta.variant === "danger"
                                          ? "bg-rose-600 hover:bg-rose-700 text-white"
                                          : item.cta.variant === "outline"
                                          ? "bg-white hover:bg-surface-alt border border-border text-heading"
                                          : "bg-primary hover:bg-primary-hover text-white"
                                      }`}
                                    >
                                      <span>{item.cta.label}</span>
                                      <ChevronRight className="w-3.5 h-3.5" />
                                    </button>
                                  )}

                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedNotification(item);
                                      setIsDrawerOpen(true);
                                    }}
                                    className="text-xs font-semibold text-muted hover:text-heading px-2 py-1 rounded-md hover:bg-surface-alt transition-colors"
                                  >
                                    Inspect Log
                                  </button>
                                </div>

                                {/* Row Meatball Options Menu (...) */}
                                <div
                                  className="relative"
                                  data-meatball-container="true"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setOpenMeatballId(
                                        openMeatballId === item.id ? null : item.id
                                      )
                                    }
                                    className="p-1.5 rounded-lg text-muted hover:text-heading hover:bg-surface-alt transition-colors cursor-pointer"
                                    aria-label="More options"
                                  >
                                    <MoreVertical className="w-4 h-4" />
                                  </button>

                                  {openMeatballId === item.id && (
                                    <div className="absolute right-0 bottom-full mb-1 sm:bottom-auto sm:top-full sm:mt-1 w-48 bg-white rounded-xl shadow-xl border border-border py-1 z-30 animate-in fade-in zoom-in-95 duration-150">
                                      {/* Toggle read */}
                                      <button
                                        type="button"
                                        onClick={() => {
                                          handleToggleRead(item.id, item.read);
                                          setOpenMeatballId(null);
                                        }}
                                        className="w-full flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-heading hover:bg-surface-alt transition-colors"
                                      >
                                        {item.read ? (
                                          <>
                                            <EyeOff className="w-3.5 h-3.5 text-muted" />
                                            Mark as unread
                                          </>
                                        ) : (
                                          <>
                                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                            Mark as read
                                          </>
                                        )}
                                      </button>

                                      {/* Copy info */}
                                      <button
                                        type="button"
                                        onClick={() => {
                                          handleCopyDetails(item);
                                          setOpenMeatballId(null);
                                        }}
                                        className="w-full flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-heading hover:bg-surface-alt transition-colors"
                                      >
                                        <Copy className="w-3.5 h-3.5 text-muted" />
                                        Copy alert details
                                      </button>

                                      {/* Mute type */}
                                      <button
                                        type="button"
                                        onClick={() => {
                                          handleMuteCategory(item.category);
                                          setOpenMeatballId(null);
                                        }}
                                        className="w-full flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-heading hover:bg-surface-alt transition-colors"
                                      >
                                        <VolumeX className="w-3.5 h-3.5 text-muted" />
                                        {mutedCategories.includes(item.category)
                                          ? `Unmute ${item.category}`
                                          : `Mute ${item.category}`}
                                      </button>

                                      <div className="h-px bg-border my-1" />

                                      {/* Delete item */}
                                      <button
                                        type="button"
                                        onClick={() => {
                                          handleDelete(item.id);
                                          setOpenMeatballId(null);
                                        }}
                                        className="w-full flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                        Delete alert
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              </div>
            );
          })}

          {/* Pagination Controls */}
          {filteredNotifications.length > pageSize && (
            <div className="rounded-2xl border border-border overflow-hidden shadow-xs mt-6">
              <TablePagination
                currentPage={currentPage}
                totalItems={filteredNotifications.length}
                pageSize={pageSize}
                pageSizeOptions={[10, 20, 50]}
                onPageChange={(page) => setCurrentPage(page)}
                onPageSizeChange={(size) => {
                  setPageSize(size);
                  setCurrentPage(1);
                }}
              />
            </div>
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/* 5. DRAWERS & MODALS                                           */}
      {/* ============================================================ */}
      {/* Quick View Drawer */}
      <NotificationDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        notification={selectedNotification}
        onToggleRead={handleToggleRead}
        onDelete={handleDelete}
      />

      {/* Clear All Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={isClearModalOpen}
        onClose={() => setIsClearModalOpen(false)}
        onConfirm={handleClearAll}
        title="Clear All Notifications"
        message="Are you sure you want to remove all notifications? This will delete all current alerts from your notification center."
      />
    </div>
  );
}
