import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import {
  GOOGLE_OAUTH_STATE_COOKIE,
  getGoogleOAuthConfig,
  getGoogleRedirectUri,
  hashOAuthState
} from "@/lib/google-oauth";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/server-auth";

interface GoogleTokenResponse {
  access_token?: string;
  error?: string;
  error_description?: string;
}

interface GoogleUserInfo {
  sub: string;
  email: string;
  email_verified?: boolean;
  name?: string;
  picture?: string;
}

function accountRedirect(request: Request, error?: string) {
  const redirectUrl = new URL("/", request.url);

  if (error) {
    redirectUrl.pathname = "/account";
    redirectUrl.searchParams.set("error", error);
  }

  return redirectUrl;
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const state = requestUrl.searchParams.get("state");
  const error = requestUrl.searchParams.get("error");
  const cookieStore = await cookies();
  const expectedStateHash = cookieStore.get(GOOGLE_OAUTH_STATE_COOKIE)?.value;

  cookieStore.delete(GOOGLE_OAUTH_STATE_COOKIE);

  if (error) {
    return NextResponse.redirect(accountRedirect(request, `Google login was cancelled: ${error}`));
  }

  if (!code || !state || !expectedStateHash || hashOAuthState(state) !== expectedStateHash) {
    return NextResponse.redirect(accountRedirect(request, "Google login could not be verified. Try again."));
  }

  try {
    const { clientId, clientSecret } = getGoogleOAuthConfig();
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: getGoogleRedirectUri(request),
        grant_type: "authorization_code"
      })
    });
    const tokenPayload = (await tokenResponse.json()) as GoogleTokenResponse;

    if (!tokenResponse.ok || !tokenPayload.access_token) {
      throw new Error(tokenPayload.error_description || tokenPayload.error || "Google token exchange failed.");
    }

    const userInfoResponse = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
      headers: {
        Authorization: `Bearer ${tokenPayload.access_token}`
      }
    });

    if (!userInfoResponse.ok) {
      throw new Error("Could not read your Google profile.");
    }

    const googleUser = (await userInfoResponse.json()) as GoogleUserInfo;

    if (!googleUser.email || googleUser.email_verified === false) {
      throw new Error("Use a verified Google email address to log in.");
    }

    const email = googleUser.email.toLowerCase();
    const account =
      (await prisma.userAccount.findFirst({
        where: {
          OR: [{ googleId: googleUser.sub }, { email }]
        }
      })) ??
      (await prisma.userAccount.create({
        data: {
          email,
          googleId: googleUser.sub,
          name: googleUser.name,
          avatarUrl: googleUser.picture
        }
      }));

    const linkedAccount =
      account.googleId === googleUser.sub
        ? account
        : await prisma.userAccount.update({
            where: { id: account.id },
            data: {
              googleId: googleUser.sub,
              name: account.name ?? googleUser.name,
              avatarUrl: account.avatarUrl ?? googleUser.picture
            }
          });

    await createSession(linkedAccount.id);

    return NextResponse.redirect(accountRedirect(request));
  } catch (caught) {
    const message = caught instanceof Error ? caught.message : "Google login failed.";

    return NextResponse.redirect(accountRedirect(request, message));
  }
}
