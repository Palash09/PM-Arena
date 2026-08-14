"use client";

import { useEffect } from "react";

import { trackAnalyticsEvent } from "@/lib/client-analytics";

const MAX_REPORTED_ERRORS = 5;

export function ErrorMonitor() {
  useEffect(() => {
    const fingerprints = new Set<string>();

    function report(source: string, error: unknown) {
      if (fingerprints.size >= MAX_REPORTED_ERRORS) return;

      const name = error instanceof Error ? error.name : typeof error;
      const fingerprint = `${source}:${name}`;

      if (fingerprints.has(fingerprint)) return;
      fingerprints.add(fingerprint);

      void trackAnalyticsEvent("client_error", {
        metadata: {
          source,
          errorName: name,
          hasStack: error instanceof Error && Boolean(error.stack)
        }
      });
    }

    function onError(event: ErrorEvent) {
      report("window_error", event.error ?? event.message);
    }

    function onUnhandledRejection(event: PromiseRejectionEvent) {
      report("unhandled_rejection", event.reason);
    }

    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onUnhandledRejection);

    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onUnhandledRejection);
    };
  }, []);

  return null;
}
