"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { User, Edit3, Mail, Phone, Calendar, ShieldCheck, Clock } from "lucide-react";
import { QuickViewDrawer } from "@/components/admin/common/QuickViewDrawer";
import type { UserFormValues } from "@/schemas/user.schema";
import { formatDateInTimezone, formatDateTimeInTimezone } from "@/lib/timezone";

export interface UserQuickViewDrawerProps {
  user: UserFormValues | null;
  onClose: () => void;
}

export function UserQuickViewDrawer({ user, onClose }: Readonly<UserQuickViewDrawerProps>) {
  const [cachedUser, setCachedUser] = useState<UserFormValues | null>(user);

  useEffect(() => {
    if (user) {
      setCachedUser(user);
    }
  }, [user]);

  const activeUser = user || cachedUser;

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case "active":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Active
          </span>
        );
      case "inactive":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Inactive
          </span>
        );
      case "suspended":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-50 text-orange-700 border border-orange-200 uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span> Suspended
          </span>
        );
      case "blocked":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span> Blocked
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200 uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span> Active
          </span>
        );
    }
  };

  const fullName = activeUser
    ? `${activeUser.first_name || ""} ${activeUser.last_name || ""}`.trim() || activeUser.email
    : "";

  return (
    <QuickViewDrawer
      isOpen={Boolean(user)}
      onClose={onClose}
      headerContent={
        activeUser ? (
          <div className="flex items-center gap-2 truncate">
            {getStatusBadge(activeUser.status)}
            <span className="text-xs text-muted font-mono truncate">
              {activeUser.email}
            </span>
          </div>
        ) : null
      }
      footerActions={
        activeUser ? (
          <>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-border text-xs font-semibold rounded-lg text-heading hover:bg-white transition-colors cursor-pointer"
            >
              Close
            </button>
            <Link
              href={`/admin/users/${activeUser.id}/edit`}
              className="px-4 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              Edit User Profile
            </Link>
          </>
        ) : null
      }
    >
      {activeUser && (
        <>
          {/* Header Card / Avatar */}
          <div className="flex items-center gap-4 p-4 rounded-xl bg-surface border border-border">
            {activeUser.avatar ? (
              <img
                src={activeUser.avatar}
                alt={fullName}
                className="w-16 h-16 rounded-full object-cover border-2 border-border shrink-0 shadow-sm"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-primary-light border-2 border-primary/20 flex items-center justify-center text-primary font-bold text-xl shrink-0 shadow-xs">
                {activeUser.first_name ? activeUser.first_name.charAt(0).toUpperCase() : <User className="w-8 h-8" />}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <h2 className="text-lg font-bold text-heading leading-tight truncate">
                {fullName}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary-light text-primary">
                  <ShieldCheck className="w-3 h-3" />
                  {activeUser.role?.name || "User"}
                </span>
              </div>
            </div>
          </div>

          {/* Contact & Personal Information */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted">
              Contact & Profile Details
            </h4>
            <div className="bg-surface rounded-xl border border-border divide-y divide-border text-xs">
              <div className="p-3 flex items-center justify-between gap-2">
                <span className="text-muted flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-primary" /> Email Address
                </span>
                <span className="font-mono font-medium text-heading truncate">{activeUser.email}</span>
              </div>
              <div className="p-3 flex items-center justify-between gap-2">
                <span className="text-muted flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-primary" /> Phone Number
                </span>
                <span className="font-medium text-heading">{activeUser.phone || "—"}</span>
              </div>
              <div className="p-3 flex items-center justify-between gap-2">
                <span className="text-muted flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-primary" /> Date of Birth
                </span>
                <span className="font-medium text-heading">
                  {activeUser.dob ? formatDateInTimezone(activeUser.dob) : "—"}
                </span>
              </div>
              <div className="p-3 flex items-center justify-between gap-2">
                <span className="text-muted flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-primary" /> Last Login
                </span>
                <span className="font-medium text-heading">
                  {activeUser.last_login_at
                    ? formatDateTimeInTimezone(activeUser.last_login_at)
                    : "Never logged in"}
                </span>
              </div>
            </div>
          </div>

          {/* Timestamps Card */}
          <div className="border border-border rounded-xl p-4 bg-surface-alt space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-heading">
              System Audit Info
            </h4>
            <div className="text-[11px] space-y-1.5 text-muted">
              <div className="flex justify-between">
                <span>Account ID:</span>
                <span className="font-mono text-heading">{activeUser.id || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span>Created Date:</span>
                <span className="text-heading">
                  {activeUser.created_at ? formatDateTimeInTimezone(activeUser.created_at) : "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Last Modified:</span>
                <span className="text-heading">
                  {activeUser.updated_at ? formatDateTimeInTimezone(activeUser.updated_at) : "Just now"}
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </QuickViewDrawer>
  );
}
