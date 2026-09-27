export interface NotificationNavigationData {
  model?: string | null;
  model_id?: string | number | null;
  type?: string | null;
  link?: string | null;
}

type NotificationPathBuilder = (id: string) => string;
export type NotificationNavigationContext = "admin" | "user";

const adminNotificationPathBuilders: Record<string, NotificationPathBuilder> = {
  USER: (id) => `/admin/users/${id}`,
  ORDER: (id) => `/admin/orders/show/${id}`,
  SUPPORT_TICKET: (id) => `/admin/support-tickets/show/${id}`,
  PAYOUT: (id) => `/admin/payouts/show/${id}`,
  ITEM: (id) => `/admin/items/edit/${id}`,
  SUBSCRIPTION: (id) => `/admin/subscriptions`,
  BLOG: (id) => `/admin/blogs/edit/${id}`,
  NEWSLETTER: (id) => `/admin/newsletter`,
  USER_VERIFICATION_STAGE: (id) =>
    `/admin/user-verification-stages/edit/${id}`,
  USER_KYC: () => "/admin/user-verification-stages/show/kyc",
  WALLET_LOG: (id) => `/admin/wallet-logs?user_id=${id}`,
};

const userNotificationPathBuilders: Record<string, NotificationPathBuilder> = {
  USER: () => "/user/profile",
  ORDER: (id) => `/user/orders/${id}`,
  SUPPORT_TICKET: (id) => `/user/support-tickets`,
  PAYOUT: (id) => `/user/payouts`,
  USER_KYC: (id) => `/user/verify/${id}`,
  USER_VERIFICATION_STAGE: (id) => `/user/verify/${id}`,
  WALLET_LOG: (id) => `/user/wallet/${id}`,
};

const notificationPathBuildersByContext: Record<
  NotificationNavigationContext,
  Record<string, NotificationPathBuilder>
> = {
  admin: adminNotificationPathBuilders,
  user: userNotificationPathBuilders,
};

function normalizeNotificationModel(value?: string | null): string {
  const modelName = value?.split(/[\\/]/).pop() ?? "";

  return modelName
    .trim()
    .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
    .replace(/[\s-]+/g, "_")
    .toUpperCase();
}

export function getNotificationNavigation(
  notification: NotificationNavigationData,
  context: NotificationNavigationContext,
): string | null {
  const model =
    normalizeNotificationModel(notification.model) ||
    normalizeNotificationModel(notification.type);

  // KYC submissions always open the KYC request queue for administrators,
  // even when an older notification contains a legacy link.
  if (context === "admin" && model === "USER_KYC") {
    return adminNotificationPathBuilders.USER_KYC("");
  }

  // Older support-ticket notifications may contain a link without the
  // `/show` segment. Always use the current admin detail route when the
  // notification identifies a support ticket.
  if (
    context === "admin" &&
    model === "SUPPORT_TICKET" &&
    notification.model_id !== null &&
    notification.model_id !== undefined &&
    notification.model_id !== ""
  ) {
    return adminNotificationPathBuilders.SUPPORT_TICKET(
      encodeURIComponent(String(notification.model_id)),
    );
  }

  if (notification.link) {
    try {
      const url = new URL(notification.link, window.location.origin);
      if (url.origin === window.location.origin) {
        return `${url.pathname}${url.search}${url.hash}`;
      }
    } catch {
      // Fall through to the established model-based routing.
    }
  }
  const modelId = notification.model_id;

  if (!model || modelId === null || modelId === undefined || modelId === "") {
    return null;
  }

  const buildPath = notificationPathBuildersByContext[context][model];
  return buildPath ? buildPath(encodeURIComponent(String(modelId))) : null;
}
