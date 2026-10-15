export type NotificationCategory =
  | "all"
  | "unread"
  | "activity"
  | "system"
  | "security"
  | "billing";

export type NotificationPriority = "low" | "medium" | "high" | "urgent";

export interface NotificationActor {
  name: string;
  avatar?: string;
  initials?: string;
  role?: string;
}

export interface NotificationCta {
  label: string;
  href?: string;
  action?: string;
  variant?: "primary" | "secondary" | "danger" | "outline";
}

export interface NotificationItem {
  id: string;
  title: string;
  actor?: NotificationActor;
  action: string;
  target?: string;
  targetUrl?: string;
  snippet: string;
  category: "activity" | "system" | "security" | "billing";
  priority: NotificationPriority;
  createdAt: string; // ISO string
  read: boolean;
  cta?: NotificationCta;
  metadata?: {
    ip?: string;
    location?: string;
    browser?: string;
    invoiceId?: string;
    amount?: string;
    affectedResource?: string;
    details?: string;
    [key: string]: any;
  };
  groupCount?: number;
  groupActors?: string[];
}

export const NOTIFICATIONS_STORAGE_KEY = "apearix_admin_notifications_v2";
export const NOTIFICATIONS_UPDATED_EVENT = "apearix:notifications_updated";

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif-1",
    title: "Project Comment",
    actor: {
      name: "Rahul Sharma",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      initials: "RS",
      role: "Lead ML Engineer",
    },
    action: "commented on your project",
    target: "NYAYA AI",
    targetUrl: "/admin/blogs",
    snippet: "The latency in the vector embeddings query dropped by 38% after the Milvus index update. Ready for staging review.",
    category: "activity",
    priority: "medium",
    createdAt: new Date(Date.now() - 6 * 60 * 1000).toISOString(), // 6 mins ago
    read: false,
    cta: {
      label: "Open Discussion",
      href: "/admin/blogs",
      variant: "primary",
    },
    metadata: {
      affectedResource: "NYAYA AI Microservice",
      details: "Thread #4912 in PR #28",
    },
  },
  {
    id: "notif-2",
    title: "Suspicious Login Alert",
    actor: {
      name: "Security Sentinel",
      initials: "SS",
      role: "System Bot",
    },
    action: "detected an unauthorized login attempt from an unknown IP",
    target: "Admin Portal",
    targetUrl: "/admin/profile?tab=security",
    snippet: "New login attempt intercepted from IP 103.21.244.2 (Mumbai, Chrome on macOS). Two-Factor challenge was triggered.",
    category: "security",
    priority: "urgent",
    createdAt: new Date(Date.now() - 24 * 60 * 1000).toISOString(), // 24 mins ago
    read: false,
    cta: {
      label: "Review Security Log",
      href: "/admin/profile?tab=security",
      variant: "danger",
    },
    metadata: {
      ip: "103.21.244.2",
      location: "Mumbai, Maharashtra, IN",
      browser: "Chrome 128.0.0 (macOS Sequoia)",
      riskScore: "High (88/100)",
    },
  },
  {
    id: "notif-3",
    title: "Payment Received",
    action: "successfully processed invoice",
    target: "#INV-2026-089",
    targetUrl: "/admin/settings",
    snippet: "Enterprise Cloud Cluster subscription payment of $2,450.00 was confirmed via Stripe recurring billing.",
    category: "billing",
    priority: "medium",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    read: false,
    cta: {
      label: "View Invoice",
      href: "/admin/settings",
      variant: "outline",
    },
    metadata: {
      invoiceId: "INV-2026-089",
      amount: "$2,450.00 USD",
      method: "Corporate Visa ending in 4091",
      status: "Settled",
    },
  },
  {
    id: "notif-4",
    title: "Scheduled Maintenance Alert",
    action: "scheduled automated cluster maintenance",
    target: "Sirus Core DB",
    targetUrl: "/admin/dashboard",
    snippet: "PostgreSQL 17 replication failover and vacuum optimization window is scheduled for Sunday at 02:00 AM IST (approx 15 mins downtime).",
    category: "system",
    priority: "high",
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
    read: true,
    cta: {
      label: "Maintenance Schedule",
      href: "/admin/dashboard",
      variant: "secondary",
    },
    metadata: {
      affectedResource: "Sirus PostgreSQL Primary + Replica",
      window: "Sunday 02:00 AM - 02:30 AM IST",
      impact: "Read-only mode during switchover",
    },
  },
  {
    id: "notif-5",
    title: "Team Kudos & Likes",
    actor: {
      name: "Ananya Verma",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
      initials: "AV",
      role: "Frontend Architect",
    },
    action: "and 4 others reacted to your architectural doc",
    target: "Building Modern Microservices with NestJS",
    targetUrl: "/admin/blogs",
    snippet: "Team members bookmarked your RFC document and added 5 comments regarding caching strategies.",
    category: "activity",
    priority: "low",
    createdAt: new Date(Date.now() - 14 * 60 * 60 * 1000).toISOString(), // 14 hours ago
    read: true,
    groupCount: 5,
    groupActors: ["Ananya Verma", "Vikram Sen", "Priya Das", "Mohit Jain", "Rohan Mehta"],
    cta: {
      label: "View Reactions",
      href: "/admin/blogs",
      variant: "secondary",
    },
  },
  {
    id: "notif-6",
    title: "Automated Backup Completed",
    action: "finished daily snapshot verification",
    target: "Primary Storage Cluster",
    snippet: "Backup snapshot verified with SHA-256 checksum. Total archive size 18.42 GB stored across AWS S3 Mumbai region.",
    category: "system",
    priority: "low",
    createdAt: new Date(Date.now() - 22 * 60 * 60 * 1000).toISOString(), // 22 hours ago
    read: true,
    metadata: {
      snapshotId: "snp-20261015-0400",
      size: "18.42 GB",
      status: "Verified Healthy",
    },
  },
  {
    id: "notif-7",
    title: "Domain SSL Certificate Auto-Renewed",
    action: "renewed Let's Encrypt wildcard certificate",
    target: "*.apearix.com",
    snippet: "Wildcard SSL certificates for api.apearix.com and admin.apearix.com have been renewed for 90 days with zero downtime.",
    category: "security",
    priority: "low",
    createdAt: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(), // 1.5 days ago
    read: true,
    metadata: {
      validUntil: "15 Jan 2027",
      issuer: "Let's Encrypt Authority X3",
    },
  },
  {
    id: "notif-8",
    title: "Annual License Renewal Reminder",
    action: "sent an upcoming renewal notification",
    target: "Apearix Platform Pro",
    targetUrl: "/admin/settings",
    snippet: "Your annual enterprise tier expires in 14 days. Auto-renew is enabled with default payment method on file.",
    category: "billing",
    priority: "medium",
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(), // 2 days ago
    read: true,
    cta: {
      label: "Manage Subscription",
      href: "/admin/settings",
      variant: "primary",
    },
  },
];

// Helper to safely access browser storage
export function getStoredNotifications(): NotificationItem[] {
  if (typeof window === "undefined") {
    return INITIAL_NOTIFICATIONS;
  }
  try {
    const raw = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(INITIAL_NOTIFICATIONS));
      return INITIAL_NOTIFICATIONS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_NOTIFICATIONS;
  } catch (err) {
    console.error("Failed to read notifications from localStorage:", err);
    return INITIAL_NOTIFICATIONS;
  }
}

export function saveNotifications(items: NotificationItem[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(
      new CustomEvent(NOTIFICATIONS_UPDATED_EVENT, { detail: { items } })
    );
  } catch (err) {
    console.error("Failed to save notifications to localStorage:", err);
  }
}

export async function fetchNotificationsFromApi(): Promise<NotificationItem[]> {
  try {
    const { clientApi } = await import("@/lib/clientApi");
    const res = await clientApi<any>("/api/v1/admin/notifications");
    if (res?.data?.items && Array.isArray(res.data.items)) {
      saveNotifications(res.data.items);
      return res.data.items;
    }
    return getStoredNotifications();
  } catch {
    return getStoredNotifications();
  }
}

export function markNotificationAsRead(id: string): NotificationItem[] {
  const current = getStoredNotifications();
  const updated = current.map((item) =>
    item.id === id ? { ...item, read: true } : item
  );
  saveNotifications(updated);

  if (typeof window !== "undefined") {
    import("@/lib/clientApi")
      .then(({ clientApi }) => {
        clientApi(`/api/v1/admin/notifications/${id}/read`, { method: "PATCH" }).catch(() => {});
      })
      .catch(() => {});
  }
  return updated;
}

export function markNotificationAsUnread(id: string): NotificationItem[] {
  const current = getStoredNotifications();
  const updated = current.map((item) =>
    item.id === id ? { ...item, read: false } : item
  );
  saveNotifications(updated);

  if (typeof window !== "undefined") {
    import("@/lib/clientApi")
      .then(({ clientApi }) => {
        clientApi(`/api/v1/admin/notifications/${id}/unread`, { method: "PATCH" }).catch(() => {});
      })
      .catch(() => {});
  }
  return updated;
}

export function markAllNotificationsAsRead(): NotificationItem[] {
  const current = getStoredNotifications();
  const updated = current.map((item) => ({ ...item, read: true }));
  saveNotifications(updated);

  if (typeof window !== "undefined") {
    import("@/lib/clientApi")
      .then(({ clientApi }) => {
        clientApi("/api/v1/admin/notifications/mark-all-read", { method: "POST" }).catch(() => {});
      })
      .catch(() => {});
  }
  return updated;
}

export function deleteNotificationItem(id: string): NotificationItem[] {
  const current = getStoredNotifications();
  const updated = current.filter((item) => item.id !== id);
  saveNotifications(updated);

  if (typeof window !== "undefined") {
    import("@/lib/clientApi")
      .then(({ clientApi }) => {
        clientApi(`/api/v1/admin/notifications/${id}`, { method: "DELETE" }).catch(() => {});
      })
      .catch(() => {});
  }
  return updated;
}

export function clearAllNotifications(): NotificationItem[] {
  const empty: NotificationItem[] = [];
  saveNotifications(empty);

  if (typeof window !== "undefined") {
    import("@/lib/clientApi")
      .then(({ clientApi }) => {
        clientApi("/api/v1/admin/notifications/clear-all", { method: "DELETE" }).catch(() => {});
      })
      .catch(() => {});
  }
  return empty;
}

export function resetNotificationsToDefault(): NotificationItem[] {
  saveNotifications(INITIAL_NOTIFICATIONS);
  return INITIAL_NOTIFICATIONS;
}

export function addLiveNotification(item: Partial<NotificationItem>): NotificationItem {
  const current = getStoredNotifications();
  const newItem: NotificationItem = {
    id: `notif-${Date.now()}`,
    title: item.title || "Live Alert",
    action: item.action || "triggered an event",
    snippet: item.snippet || "New platform activity occurred.",
    category: item.category || "system",
    priority: item.priority || "medium",
    createdAt: new Date().toISOString(),
    read: false,
    actor: item.actor,
    target: item.target,
    targetUrl: item.targetUrl,
    cta: item.cta,
    metadata: item.metadata,
    groupCount: item.groupCount,
    groupActors: item.groupActors,
  };

  const updated = [newItem, ...current];
  saveNotifications(updated);

  if (typeof window !== "undefined") {
    import("@/lib/clientApi")
      .then(({ clientApi }) => {
        clientApi("/api/v1/admin/notifications/simulate", {
          method: "POST",
          body: JSON.stringify(newItem),
        }).catch(() => {});
      })
      .catch(() => {});
  }

  return newItem;
}

// Relative time formatting helper
export function getRelativeTimeString(isoDate: string): string {
  try {
    const timestamp = new Date(isoDate).getTime();
    if (isNaN(timestamp)) return "Just now";

    const diffMs = Date.now() - timestamp;
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSecs < 45) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) {
      const time = new Date(isoDate).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
      return `Yesterday at ${time}`;
    }
    if (diffDays < 7) return `${diffDays}d ago`;

    return new Date(isoDate).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return "Recently";
  }
}
