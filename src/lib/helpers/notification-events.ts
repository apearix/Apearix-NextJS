export const NOTIFICATION_STATE_CHANGED_EVENT =
  "app:notification-state-changed";

export type NotificationRole = "admin" | "user";

export interface NotificationStateChangedDetail {
  role: NotificationRole;
  notification?: unknown;
  unreadCount?: number;
}

export function notifyNotificationStateChanged(
  role: NotificationRole,
  detail: Omit<NotificationStateChangedDetail, "role"> = {},
): void {
  if (typeof window === "undefined") return;

  window.dispatchEvent(
    new CustomEvent(NOTIFICATION_STATE_CHANGED_EVENT, {
      detail: { role, ...detail },
    }),
  );
}

export function isNotificationStateChangeForRole(
  event: Event,
  role: NotificationRole,
): boolean {
  return (event as CustomEvent<NotificationStateChangedDetail>).detail?.role === role;
}
