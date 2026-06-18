import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import {
  GOOGLE_OAUTH_STATE_COOKIE,
  createOAuthState,
  getGoogleOAuthConfig,
  getGoogleRedirectUri,
  hashOAuthState
} from "@/lib/google-oauth";

export async function GET(request: Request) {
  try {
    const { clientId } = getGoogleOAuthConfig();
    const state = createOAuthState();
    const cookieStore = await cookies();

    cookieStore.set(GOOGLE_OAUTH_STATE_COOKIE, hashOAuthState(state), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 10 * 60
    });

    const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
    authUrl.searchParams.set("client_id", clientId);
    authUrl.searchParams.set("redirect_uri", getGoogleRedirectUri(request));
    authUrl.searchParams.set("response_type", "code");
    authUrl.searchParams.set("scope", "openid email profile");
    authUrl.searchParams.set("state", state);
    authUrl.searchParams.set("prompt", "select_account");

    return NextResponse.redirect(authUrl);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Google login failed to start.";
    const redirectUrl = new URL("/account", request.url);
    redirectUrl.searchParams.set("error", message);

    return NextResponse.redirect(redirectUrl);
  }
}
