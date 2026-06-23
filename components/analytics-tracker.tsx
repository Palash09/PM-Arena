"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const ANONYMOUS_ID_KEY = "product-arena-anonymous-id-v1";

function getAnonymousId() {
  const existing = window.localStorage.getItem(ANONYMOUS_ID_KEY);

  if (existing) {
    return existing;
  }

  const next =
    typeof window.crypto?.randomUUID === "function"
      ? window.crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

  window.localStorage.setItem(ANONYMOUS_ID_KEY, next);
  return next;
}

export function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const query = searchParams.toString();
    const path = query ? `${pathname}?${query}` : pathname;

    fetch("/api/analytics/track", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      keepalive: true,
      body: JSON.stringify({
        eventType: "page_view",
        anonymousId: getAnonymousId(),
        path,
        referrer: document.referrer || undefined,
        metadata: {
          title: document.title
        }
      })
    }).catch(() => {
      // Analytics should never interrupt the product experience.
    });
  }, [pathname, searchParams]);

  return null;
}
