"use client";

import Link from "next/link";
import { LogOut, UserRound } from "lucide-react";

import { useAuth } from "@/lib/auth-store";

export function AuthStatus() {
  const { user, isHydrated, logOut } = useAuth();

  if (!isHydrated) {
    return <div className="h-8 w-16 rounded-md border border-white/10 bg-white/5" />;
  }

  if (!user) {
    return (
      <Link
        href="/account"
        className="inline-flex items-center gap-1.5 rounded-md border border-mint/30 bg-mint/10 px-2.5 py-2 text-xs font-black text-mint"
      >
        <UserRound className="h-3.5 w-3.5" />
        Sign in
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        href="/account"
        className="max-w-[92px] truncate rounded-md border border-white/10 bg-white/5 px-2.5 py-2 text-xs font-black text-slate-100"
      >
        {user.email}
      </Link>
      <button
        type="button"
        onClick={logOut}
        aria-label="Sign out"
        className="grid h-8 w-8 place-items-center rounded-md border border-white/10 bg-white/5 text-slate-200"
      >
        <LogOut className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
