import { createHash, randomBytes } from "node:crypto";

import { getRequestOrigin } from "@/lib/app-url";

export const GOOGLE_OAUTH_STATE_COOKIE = "product_decision_league_google_state";

export function getGoogleRedirectUri(request: Request) {
  return `${getRequestOrigin(request)}/api/auth/google/callback`;
}

export function getGoogleOAuthConfig() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("Google login is not configured. Add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET.");
  }

  return { clientId, clientSecret };
}

export function createOAuthState() {
  return randomBytes(24).toString("hex");
}

export function hashOAuthState(state: string) {
  return createHash("sha256").update(state).digest("hex");
}
