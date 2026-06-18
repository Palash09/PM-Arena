"use client";

import { useEffect, useState } from "react";

const USER_CACHE_KEY = "pm-simulator-current-user-v1";
const AUTH_EVENT = "pm-auth-updated";

export interface AuthUser {
  email: string;
  name?: string | null;
  avatarUrl?: string | null;
  createdAt: string;
}

async function parseAuthResponse(response: Response) {
  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      payload && typeof payload.error === "string"
        ? payload.error
        : `Authentication request failed with HTTP ${response.status}. Check the server logs.`
    );
  }

  return payload as { user: AuthUser | null };
}

function readCachedUser(): AuthUser | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(USER_CACHE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeCachedUser(user: AuthUser | null) {
  if (user) {
    window.localStorage.setItem(USER_CACHE_KEY, JSON.stringify(user));
  } else {
    window.localStorage.removeItem(USER_CACHE_KEY);
  }

  window.dispatchEvent(new Event(AUTH_EVENT));
}

export function getCurrentUser(): AuthUser | null {
  return readCachedUser();
}

export async function refreshCurrentUser() {
  const payload = await parseAuthResponse(
    await fetch("/api/auth/me", {
      credentials: "include"
    })
  );

  writeCachedUser(payload.user);
  return payload.user;
}

export async function signUp(email: string, password: string) {
  const payload = await parseAuthResponse(
    await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify({ email, password })
    })
  );

  writeCachedUser(payload.user);
}

export async function logIn(email: string, password: string) {
  const payload = await parseAuthResponse(
    await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify({ email, password })
    })
  );

  writeCachedUser(payload.user);
}

export async function requestPasswordReset(email: string) {
  const response = await fetch("/api/auth/password-reset/request", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email })
  });
  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      payload && typeof payload.error === "string"
        ? payload.error
        : `Password reset request failed with HTTP ${response.status}.`
    );
  }

  return payload as { message: string; devResetUrl?: string };
}

export async function resetPassword(token: string, password: string) {
  const payload = await parseAuthResponse(
    await fetch("/api/auth/password-reset/confirm", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify({ token, password })
    })
  );

  writeCachedUser(payload.user);
}

export async function logOut() {
  await fetch("/api/auth/logout", {
    method: "POST",
    credentials: "include"
  });

  writeCachedUser(null);
}

export function authStorageKey(baseKey: string) {
  const user = getCurrentUser();
  return user ? `${baseKey}:user:${user.email}` : `${baseKey}:guest`;
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    let isMounted = true;

    function sync() {
      if (!isMounted) {
        return;
      }

      setUser(getCurrentUser());
      setIsHydrated(true);
    }

    sync();
    refreshCurrentUser().catch(() => {
      writeCachedUser(null);
    });

    window.addEventListener("storage", sync);
    window.addEventListener(AUTH_EVENT, sync);

    return () => {
      isMounted = false;
      window.removeEventListener("storage", sync);
      window.removeEventListener(AUTH_EVENT, sync);
    };
  }, []);

  return { user, isHydrated, logOut };
}
