"use client";

import Link from "next/link";
import { LogIn, RotateCcw, UserRound } from "lucide-react";

import { getRankForXp } from "@/components/rank-config";
import { useAuth } from "@/lib/auth-store";
import { useProgress } from "@/lib/progress-store";

export function ProfileClient() {
  const { user, isHydrated: isAuthHydrated } = useAuth();
  const { isHydrated, profile, progress, resetProgress } = useProgress();

  if (!isHydrated || !isAuthHydrated) {
    return <div className="h-80 animate-pulse rounded-lg border border-white/10 bg-white/5" />;
  }

  const RankIcon = getRankForXp(profile.xp).icon;

  return (
    <section className="space-y-4">
      <article className="rounded-lg border border-violet-400/25 bg-slate-950/80 p-4 shadow-card backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="grid h-16 w-16 shrink-0 place-items-center rounded-lg border border-mint/30 bg-mint/10">
            <UserRound className="h-8 w-8 text-mint" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-slate-300">PM Profile</p>
            <h2 className="truncate text-2xl font-extrabold text-white">{profile.name}</h2>
            <p className="mt-1 text-sm font-bold text-mint">
              {user ? user.email : "Guest progress"}
            </p>
          </div>
        </div>
      </article>

      <article className="rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="grid h-14 w-14 shrink-0 place-items-center rounded-lg border border-violet-300/40 bg-violet-300/10">
            <RankIcon className="h-7 w-7 text-violet-200" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-xl font-extrabold text-white">{profile.title}</h3>
            <p className="text-sm font-bold text-slate-300">Level {profile.level} - {profile.xp.toLocaleString()} XP</p>
          </div>
          <div className="rounded-lg border border-mint/35 bg-black/35 px-3 py-2 text-center">
            <p className="text-2xl font-black text-white">{profile.overallScore}</p>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-mint">OVR</p>
          </div>
        </div>
      </article>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
          <p className="text-2xl font-black text-white">{progress.attempts.length}</p>
          <p className="mt-1 text-xs font-bold uppercase tracking-[0.1em] text-slate-300">Solved</p>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
          <p className="text-2xl font-black text-white">{profile.streak}</p>
          <p className="mt-1 text-xs font-bold uppercase tracking-[0.1em] text-slate-300">Streak</p>
        </div>
      </div>

      {!user ? (
        <Link
          href="/account"
          className="flex min-h-12 items-center justify-center gap-2 rounded-md bg-mint px-4 py-3 text-sm font-extrabold text-slate-950"
        >
          <LogIn className="h-4 w-4" />
          Sign in to sync progress
        </Link>
      ) : null}

      <button
        type="button"
        onClick={resetProgress}
        className="flex min-h-12 w-full items-center justify-center gap-2 rounded-md border border-coral/25 bg-coral/10 px-4 py-3 text-sm font-extrabold text-coral"
      >
        <RotateCcw className="h-4 w-4" />
        Reset Progress
      </button>
    </section>
  );
}
