import type { Metadata } from "next";
import { NotificationsClient } from "@/components/admin/notifications/NotificationsClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Notifications | Apearix Admin",
  description:
    "Review real-time system alerts, team activity, transaction invoices, and security logs.",
};

export default function AdminNotificationsPage() {
  return <NotificationsClient />;
}
