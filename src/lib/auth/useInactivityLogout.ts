"use client";

import { useEffect, useRef } from "react";
import {
  getClientSessionLifetimeMinutes,
  isIdleExpired,
  logoutForInactivity,
  markActivity,
} from "./inactivity";

const ACTIVITY_EVENTS = [
  "mousemove",
  "mousedown",
  "keydown",
  "scroll",
  "touchstart",
] as const;

export function useInactivityLogout(sessionLifetimeMinutes?: number) {
  const timeoutRef = useRef<number | null>(null);
  const lifetimeMinutes = getClientSessionLifetimeMinutes(sessionLifetimeMinutes);

  useEffect(() => {
    const clearTimer = () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };

    const scheduleLogout = () => {
      clearTimer();

      timeoutRef.current = window.setTimeout(() => {
        if (isIdleExpired(lifetimeMinutes)) {
          void logoutForInactivity();
          return;
        }

        scheduleLogout();
      }, lifetimeMinutes * 60 * 1000);
    };

    const handleActivity = () => {
      markActivity();
      scheduleLogout();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        if (isIdleExpired(lifetimeMinutes)) {
          void logoutForInactivity();
          return;
        }

        handleActivity();
      }
    };

    if (!window.localStorage.getItem("auth_last_activity_at")) {
      markActivity();
    }

    ACTIVITY_EVENTS.forEach((eventName) => {
      window.addEventListener(eventName, handleActivity, { passive: true });
    });
    document.addEventListener("visibilitychange", handleVisibilityChange);
    scheduleLogout();

    return () => {
      clearTimer();
      ACTIVITY_EVENTS.forEach((eventName) => {
        window.removeEventListener(eventName, handleActivity);
      });
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [lifetimeMinutes]);
}
