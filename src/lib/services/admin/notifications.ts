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
    createdAt: new Date(Date.now() - 6 * 60 * 1000).toISOString(),
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
    createdAt: new Date(Date.now() - 24 * 60 * 1000).toISOString(),
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
];

// Play pleasant web audio chime on new high/urgent notifications
export function playNotificationChime(priority: NotificationPriority = "medium") {
  if (typeof window === "undefined") return;
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    const now = ctx.currentTime;
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    gain.connect(ctx.destination);
    osc1.connect(gain);
    osc2.connect(gain);

    const freq1 = priority === "urgent" ? 784 : 523.25;
    const freq2 = priority === "urgent" ? 1046.5 : 659.25;

    osc1.frequency.setValueAtTime(freq1, now);
    osc2.frequency.setValueAtTime(freq2, now + 0.1);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);

    osc1.start(now);
    osc1.stop(now + 0.15);
    osc2.start(now + 0.1);
    osc2.stop(now + 0.45);
  } catch {
    // Ignore audio autoplay restrictions
  }
}

// Safely access browser local storage cache
export function getStoredNotifications(): NotificationItem[] {
  if (typeof window === "undefined") {
    return INITIAL_NOTIFICATIONS;
  }
  try {
    const raw = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
    if (!raw) {
      return INITIAL_NOTIFICATIONS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_NOTIFICATIONS;
  } catch (err) {
    console.error("Failed to read notifications cache:", err);
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
    console.error("Failed to save notifications cache:", err);
  }
}

export async function fetchNotificationsFromApi(query?: {
  category?: string;
  unreadOnly?: boolean;
  search?: string;
  sortBy?: "newest" | "oldest" | "unread" | "priority";
  page?: number;
  limit?: number;
}): Promise<{ items: NotificationItem[]; total: number; unread: number }> {
  try {
    const { clientApi } = await import("@/lib/clientApi");
    const params = new URLSearchParams();
    if (query?.category && query.category !== "all") params.set("category", query.category);
    if (query?.unreadOnly) params.set("unreadOnly", "true");
    if (query?.search) params.set("search", query.search);
    if (query?.sortBy) params.set("sortBy", query.sortBy);
    if (query?.page) params.set("page", query.page.toString());
    if (query?.limit) params.set("limit", query.limit.toString());

    const qs = params.toString() ? `?${params.toString()}` : "";
    const res = await clientApi<any>(`/api/v1/admin/notifications${qs}`);

    if (res?.data?.items && Array.isArray(res.data.items)) {
      if (!query?.search && (!query?.category || query.category === "all") && (!query?.page || query.page === 1)) {
        saveNotifications(res.data.items);
      }
      return {
        items: res.data.items,
        total: res.data.total ?? res.data.items.length,
        unread: res.unread ?? 0,
      };
    }

    const cached = getStoredNotifications();
    return { items: cached, total: cached.length, unread: cached.filter((i) => !i.read).length };
  } catch (err) {
    console.warn("fetchNotificationsFromApi fallback to cache:", err);
    const cached = getStoredNotifications();
    return { items: cached, total: cached.length, unread: cached.filter((i) => !i.read).length };
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

/**
 * Trigger a real simulated alert via backend database API (Testing & Demo)
 */
export async function addLiveNotification(item: Partial<NotificationItem>): Promise<NotificationItem> {
  const newItemPayload = {
    title: item.title || "Live Alert",
    action: item.action || "triggered an event",
    snippet: item.snippet || "New platform activity occurred.",
    category: item.category || "system",
    priority: item.priority || "medium",
    actor: item.actor,
    target: item.target,
    targetUrl: item.targetUrl,
    cta: item.cta,
    metadata: item.metadata,
    groupCount: item.groupCount,
    groupActors: item.groupActors,
  };

  try {
    const { clientApi } = await import("@/lib/clientApi");
    const res = await clientApi<any>("/api/v1/admin/notifications/simulate", {
      method: "POST",
      body: JSON.stringify(newItemPayload),
    });

    if (res?.data) {
      const savedItem: NotificationItem = res.data;
      const current = getStoredNotifications();
      const updated = [savedItem, ...current.filter((n) => n.id !== savedItem.id)];
      saveNotifications(updated);
      return savedItem;
    }
  } catch (e) {
    console.warn("Simulate API error, fallback locally:", e);
  }

  // Fallback if offline
  const fallbackItem: NotificationItem = {
    id: `notif-${Date.now()}`,
    ...newItemPayload,
    createdAt: new Date().toISOString(),
    read: false,
  } as NotificationItem;

  const current = getStoredNotifications();
  const updated = [fallbackItem, ...current];
  saveNotifications(updated);
  return fallbackItem;
}

/**
 * Setup Real-time Server-Sent Events (SSE) Stream
 */
export function subscribeToNotificationStream(
  onEvent?: (event: { type: string; payload?: any }) => void
): () => void {
  if (typeof window === "undefined") return () => {};

  let eventSource: EventSource | null = null;
  let isClosed = false;

  const connect = () => {
    if (isClosed) return;
    try {
      // Connect through Next.js proxy route
      eventSource = new EventSource("/api/proxy/api/v1/admin/notifications/stream");

      eventSource.onmessage = (event) => {
        try {
          if (!event.data) return;
          const data = JSON.parse(event.data);
          if (data.type === "HEARTBEAT") return;

          if (data.type === "NOTIFICATION_CREATED" && data.payload) {
            const newItem: NotificationItem = data.payload;
            const current = getStoredNotifications();
            const exists = current.some((n) => n.id === newItem.id);
            if (!exists) {
              const updated = [newItem, ...current];
              saveNotifications(updated);
              playNotificationChime(newItem.priority);
            }
          } else if (data.type === "NOTIFICATION_UPDATED" && data.payload) {
            const current = getStoredNotifications();
            const updated = current.map((n) =>
              n.id === data.payload.id ? { ...n, read: data.payload.read } : n
            );
            saveNotifications(updated);
          } else if (data.type === "ALL_NOTIFICATIONS_READ") {
            const current = getStoredNotifications();
            const updated = current.map((n) => ({ ...n, read: true }));
            saveNotifications(updated);
          } else if (data.type === "NOTIFICATION_DELETED" && data.payload) {
            const current = getStoredNotifications();
            const updated = current.filter((n) => n.id !== data.payload.id);
            saveNotifications(updated);
          } else if (data.type === "ALL_NOTIFICATIONS_CLEARED") {
            saveNotifications([]);
          }

          if (onEvent) {
            onEvent(data);
          }
        } catch (err) {
          console.error("Error parsing SSE event:", err);
        }
      };

      eventSource.onerror = () => {
        if (eventSource) {
          eventSource.close();
          eventSource = null;
        }
        if (!isClosed) {
          setTimeout(connect, 7000);
        }
      };
    } catch (err) {
      console.warn("Failed to establish SSE stream:", err);
    }
  };

  connect();

  return () => {
    isClosed = true;
    if (eventSource) {
      eventSource.close();
      eventSource = null;
    }
  };
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
