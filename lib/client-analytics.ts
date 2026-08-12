"use client";

const ANONYMOUS_ID_KEY = "product-decision-league-anonymous-id-v1";
const LEGACY_ANONYMOUS_ID_KEY = "product-arena-anonymous-id-v1";
const FIRST_TOUCH_KEY = "product-decision-league-first-touch-v1";

export interface CampaignAttribution {
  source?: string;
  medium?: string;
  campaign?: string;
  content?: string;
  term?: string;
}

interface StoredAttribution extends CampaignAttribution {
  landingPath?: string;
  capturedAt?: string;
}

interface TrackEventOptions {
  path?: string;
  referrer?: string;
  metadata?: Record<string, unknown>;
}

export function getAnonymousId() {
  try {
    const existing =
      window.localStorage.getItem(ANONYMOUS_ID_KEY) ??
      window.localStorage.getItem(LEGACY_ANONYMOUS_ID_KEY);

    if (existing) {
      window.localStorage.setItem(ANONYMOUS_ID_KEY, existing);
      return existing;
    }

    const next =
      typeof window.crypto?.randomUUID === "function"
        ? window.crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

    window.localStorage.setItem(ANONYMOUS_ID_KEY, next);
    return next;
  } catch {
    return undefined;
  }
}

function attributionFromCurrentUrl(): CampaignAttribution {
  const params = new URLSearchParams(window.location.search);

  return {
    source: params.get("utm_source") || undefined,
    medium: params.get("utm_medium") || undefined,
    campaign: params.get("utm_campaign") || undefined,
    content: params.get("utm_content") || undefined,
    term: params.get("utm_term") || undefined
  };
}

function hasCampaignAttribution(attribution: CampaignAttribution) {
  return Object.values(attribution).some(Boolean);
}

export function captureFirstTouchAttribution(): StoredAttribution {
  const current = attributionFromCurrentUrl();

  try {
    const stored = window.localStorage.getItem(FIRST_TOUCH_KEY);

    if (stored) {
      return JSON.parse(stored) as StoredAttribution;
    }

    if (!hasCampaignAttribution(current)) {
      return {};
    }

    const firstTouch: StoredAttribution = {
      ...current,
      landingPath: `${window.location.pathname}${window.location.search}`,
      capturedAt: new Date().toISOString()
    };

    window.localStorage.setItem(FIRST_TOUCH_KEY, JSON.stringify(firstTouch));
    return firstTouch;
  } catch {
    return current;
  }
}

export function getCampaignAttribution(): StoredAttribution {
  return captureFirstTouchAttribution();
}

export async function trackAnalyticsEvent(
  eventType: string,
  options: TrackEventOptions = {}
) {
  try {
    await fetch("/api/analytics/track", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      keepalive: true,
      body: JSON.stringify({
        eventType,
        anonymousId: getAnonymousId(),
        path: options.path ?? `${window.location.pathname}${window.location.search}`,
        referrer: options.referrer ?? (document.referrer || undefined),
        metadata: options.metadata
      })
    });
  } catch {
    // Analytics should never interrupt the product experience.
  }
}
