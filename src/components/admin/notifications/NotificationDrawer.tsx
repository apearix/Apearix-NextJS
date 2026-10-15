"use client";

import React from "react";
import Link from "next/link";
import {
  Bell,
  Shield,
  CreditCard,
  Server,
  MessageSquare,
  AlertTriangle,
  Clock,
  ExternalLink,
  Trash2,
  CheckCircle,
  Eye,
  EyeOff,
  Globe,
  Monitor,
  FileText,
  User,
  Sparkles,
} from "lucide-react";
import { QuickViewDrawer } from "@/components/admin/common/QuickViewDrawer";
import {
  type NotificationItem,
  getRelativeTimeString,
} from "@/lib/services/admin/notifications";

interface NotificationDrawerProps {
  notification: NotificationItem | null;
  isOpen: boolean;
  onClose: () => void;
  onToggleRead: (id: string, currentRead: boolean) => void;
  onDelete: (id: string) => void;
}

export function NotificationDrawer({
  notification,
  isOpen,
  onClose,
  onToggleRead,
  onDelete,
}: Readonly<NotificationDrawerProps>) {
  if (!notification) return null;

  const getCategoryTheme = (category: string) => {
    switch (category) {
      case "security":
        return {
          icon: Shield,
          color: "text-emerald-600",
          bg: "bg-emerald-50 border-emerald-200",
          badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
        };
      case "billing":
        return {
          icon: CreditCard,
          color: "text-blue-600",
          bg: "bg-blue-50 border-blue-200",
          badge: "bg-blue-50 text-blue-700 border-blue-200",
        };
      case "system":
        return {
          icon: Server,
          color: "text-purple-600",
          bg: "bg-purple-50 border-purple-200",
          badge: "bg-purple-50 text-purple-700 border-purple-200",
        };
      case "activity":
      default:
        return {
          icon: MessageSquare,
          color: "text-indigo-600",
          bg: "bg-indigo-50 border-indigo-200",
          badge: "bg-indigo-50 text-indigo-700 border-indigo-200",
        };
    }
  };

  const theme = getCategoryTheme(notification.category);
  const CategoryIcon = theme.icon;

  const headerContent = (
    <div className="flex items-center gap-3">
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center border ${theme.bg}`}
      >
        <CategoryIcon className={`w-5 h-5 ${theme.color}`} />
      </div>
      <div>
        <div className="flex items-center gap-2">
          <span
            className={`text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border ${theme.badge}`}
          >
            {notification.category}
          </span>
          {notification.priority === "urgent" && (
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
              Urgent Priority
            </span>
          )}
          {notification.priority === "high" && (
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
              High
            </span>
          )}
        </div>
        <h3 className="text-base font-bold text-heading mt-0.5">
          {notification.title}
        </h3>
      </div>
    </div>
  );

  const footerActions = (
    <div className="flex items-center justify-between w-full">
      <button
        type="button"
        onClick={() => {
          onDelete(notification.id);
          onClose();
        }}
        className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
      >
        <Trash2 className="w-4 h-4" />
        Delete Alert
      </button>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onToggleRead(notification.id, notification.read)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold border border-border text-heading hover:bg-surface-alt rounded-lg transition-colors cursor-pointer"
        >
          {notification.read ? (
            <>
              <EyeOff className="w-4 h-4 text-muted" />
              Mark as Unread
            </>
          ) : (
            <>
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              Mark as Read
            </>
          )}
        </button>

        {notification.targetUrl && (
          <Link
            href={notification.targetUrl}
            onClick={onClose}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-primary hover:bg-primary-hover text-white rounded-lg transition-colors cursor-pointer shadow-xs"
          >
            <span>Open Link</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>
    </div>
  );

  return (
    <QuickViewDrawer
      isOpen={isOpen}
      onClose={onClose}
      headerContent={headerContent}
      footerActions={footerActions}
      maxWidthClass="max-w-xl"
    >
      {/* Overview Block */}
      <div className="space-y-4">
        {/* Status & Relative Time Card */}
        <div className="flex items-center justify-between p-3.5 rounded-xl bg-surface border border-border">
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                notification.read ? "bg-gray-300" : "bg-primary animate-pulse"
              }`}
            />
            <span className="text-xs font-semibold text-heading">
              {notification.read ? "Read Notification" : "Unread Notification"}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-muted">
            <Clock className="w-3.5 h-3.5" />
            <span>{getRelativeTimeString(notification.createdAt)}</span>
          </div>
        </div>

        {/* Actor Info if available */}
        {notification.actor && (
          <div className="p-4 rounded-xl bg-surface-alt border border-border flex items-center gap-3.5">
            {notification.actor.avatar ? (
              <img
                src={notification.actor.avatar}
                alt={notification.actor.name}
                className="w-12 h-12 rounded-xl object-cover ring-2 ring-white shadow-xs"
              />
            ) : (
              <div className="w-12 h-12 rounded-xl bg-primary text-white font-bold flex items-center justify-center text-sm shadow-xs">
                {notification.actor.initials || "SS"}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-heading">
                  {notification.actor.name}
                </h4>
                {notification.actor.role && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-surface border border-border text-muted">
                    {notification.actor.role}
                  </span>
                )}
              </div>
              <p className="text-xs text-muted mt-0.5">
                {notification.action}{" "}
                {notification.target && (
                  <span className="font-semibold text-heading">
                    {notification.target}
                  </span>
                )}
              </p>
            </div>
          </div>
        )}

        {/* Message / Snippet Details */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-heading uppercase tracking-wider">
            Event Description
          </label>
          <div className="p-4 rounded-xl border border-border bg-white text-sm text-body leading-relaxed whitespace-pre-wrap">
            {notification.snippet}
          </div>
        </div>

        {/* Grouped Actors (if any) */}
        {notification.groupActors && notification.groupActors.length > 0 && (
          <div className="space-y-2">
            <label className="text-xs font-bold text-heading uppercase tracking-wider">
              Interacted Members ({notification.groupActors.length})
            </label>
            <div className="flex flex-wrap gap-1.5">
              {notification.groupActors.map((actorName, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface border border-border text-xs font-medium text-heading"
                >
                  <User className="w-3 h-3 text-primary" />
                  {actorName}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Metadata Details Table */}
        {notification.metadata && Object.keys(notification.metadata).length > 0 && (
          <div className="space-y-2">
            <label className="text-xs font-bold text-heading uppercase tracking-wider">
              Diagnostic & Audit Metadata
            </label>
            <div className="rounded-xl border border-border overflow-hidden divide-y divide-border bg-white text-xs">
              {Object.entries(notification.metadata).map(([key, val]) => (
                <div
                  key={key}
                  className="flex items-center justify-between p-3 hover:bg-surface-alt/50 transition-colors"
                >
                  <span className="font-medium text-muted capitalize">
                    {key.replace(/([A-Z])/g, " $1")}
                  </span>
                  <span className="font-mono text-heading font-semibold text-right max-w-[280px] truncate">
                    {String(val)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Raw Event ID & Timestamp */}
        <div className="pt-2 text-[11px] text-muted flex items-center justify-between border-t border-border">
          <span>Event ID: {notification.id}</span>
          <span>{new Date(notification.createdAt).toLocaleString()}</span>
        </div>
      </div>
    </QuickViewDrawer>
  );
}
