"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

import { getCampaignAttribution, trackAnalyticsEvent } from "@/lib/client-analytics";

export function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const query = searchParams.toString();
    const path = query ? `${pathname}?${query}` : pathname;
    const accountCreatedWith = searchParams.get("account_created");

    void trackAnalyticsEvent("page_view", {
      path,
      metadata: {
        title: document.title,
        ...getCampaignAttribution()
      }
    });

    if (accountCreatedWith) {
      const eventKey = `product-decision-league-account-created:${accountCreatedWith}`;

      if (!window.sessionStorage.getItem(eventKey)) {
        window.sessionStorage.setItem(eventKey, "tracked");
        void trackAnalyticsEvent("account_created", {
          metadata: {
            provider: accountCreatedWith,
            ...getCampaignAttribution()
          }
        });
      }

      const cleanUrl = new URL(window.location.href);
      cleanUrl.searchParams.delete("account_created");
      window.history.replaceState({}, "", `${cleanUrl.pathname}${cleanUrl.search}${cleanUrl.hash}`);
    }
  }, [pathname, searchParams]);

  return null;
}
