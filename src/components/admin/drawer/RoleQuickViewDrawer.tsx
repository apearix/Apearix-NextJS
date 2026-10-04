"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ShieldCheck, Edit3, Users, Key } from "lucide-react";
import { QuickViewDrawer } from "@/components/admin/common/QuickViewDrawer";
import type { RoleFormValues } from "@/schemas/role.schema";
import { formatDateTimeInTimezone } from "@/lib/timezone";

export interface RoleQuickViewDrawerProps {
  role: RoleFormValues | null;
  onClose: () => void;
}

export function RoleQuickViewDrawer({ role, onClose }: Readonly<RoleQuickViewDrawerProps>) {
  const [cachedRole, setCachedRole] = useState<RoleFormValues | null>(role);

  useEffect(() => {
    if (role) {
      setCachedRole(role);
    }
  }, [role]);

  const activeRole = role || cachedRole;

  return (
    <QuickViewDrawer
      isOpen={Boolean(role)}
      onClose={onClose}
      headerContent={
        activeRole ? (
          <div className="flex items-center gap-2 truncate">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary-light text-primary uppercase shrink-0">
              Role
            </span>
            <span className="text-xs text-muted font-mono truncate">
              {activeRole.slug}
            </span>
          </div>
        ) : null
      }
      footerActions={
        activeRole ? (
          <>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-border text-xs font-semibold rounded-lg text-heading hover:bg-white transition-colors cursor-pointer"
            >
              Close
            </button>
            <Link
              href={`/admin/roles/${activeRole.id}/edit`}
              className="px-4 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              Edit Role
            </Link>
          </>
        ) : null
      }
    >
      {activeRole && (
        <>
          {/* Header Card */}
          <div className="flex items-center gap-4 p-4 rounded-xl bg-surface border border-border">
            <div className="w-12 h-12 rounded-xl bg-primary-light border border-primary/20 flex items-center justify-center text-primary font-bold text-lg shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-lg font-bold text-heading leading-tight truncate">
                {activeRole.name}
              </h2>
              <div className="text-xs text-muted font-mono truncate mt-0.5">
                slug: {activeRole.slug}
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted mb-1.5">
              Description
            </h4>
            <p className="text-xs text-body bg-surface p-3 rounded-lg border border-border leading-relaxed">
              {activeRole.description || "No description provided for this role."}
            </p>
          </div>

          {/* Associated Metrics */}
          <div className="bg-surface rounded-xl border border-border p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-surface-alt border border-border flex items-center justify-center text-primary">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-heading">Associated Accounts</div>
                <div className="text-xs text-muted">Users assigned to this role</div>
              </div>
            </div>
            <span className="text-sm font-bold text-primary px-3 py-1 bg-primary-light rounded-lg">
              {activeRole.users_count ?? 0} Users
            </span>
          </div>

          {/* Audit Info */}
          <div className="border border-border rounded-xl p-4 bg-surface-alt space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-heading flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-primary" />
              System Audit Info
            </h4>
            <div className="text-[11px] space-y-1.5 text-muted">
              <div className="flex justify-between">
                <span>Role ID:</span>
                <span className="font-mono text-heading">{activeRole.id || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span>Created Date:</span>
                <span className="text-heading">
                  {activeRole.created_at ? formatDateTimeInTimezone(activeRole.created_at) : "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Last Modified:</span>
                <span className="text-heading">
                  {activeRole.updated_at ? formatDateTimeInTimezone(activeRole.updated_at) : "Just now"}
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </QuickViewDrawer>
  );
}
