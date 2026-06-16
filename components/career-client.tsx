"use client";

import Link from "next/link";
import { ChevronRight, Lock, Sparkles, Zap } from "lucide-react";

import { getNextRankForXp, getRankForXp, rankProgressPercent, rankThresholds } from "@/components/rank-config";
import { useProgress } from "@/lib/progress-store";
import { Scenario } from "@/lib/types";

interface CareerClientProps {
  scenarios: Scenario[];
}

export function CareerClient({ scenarios }: CareerClientProps) {
  const { isHydrated, profile, progress } = useProgress();

  if (!isHydrated) {
    return <div className="h-80 animate-pulse rounded-lg border border-white/10 bg-white/5" />;
  }

  const currentRank = getRankForXp(profile.xp);
  const CurrentRankIcon = currentRank.icon;
  const nextRank = getNextRankForXp(profile.xp);
  const nextScenarios = scenarios
    .filter((scenario) => !progress.attempts.some((attempt) => attempt.scenarioId === scenario.id))
    .slice(0, 3);

  return (
    <>
      <section className="overflow-hidden rounded-lg border border-violet-400/25 bg-slate-950/80 shadow-card backdrop-blur-xl">
        <div className="bg-[linear-gradient(135deg,rgba(157,91,255,0.28),rgba(17,196,112,0.12))] p-4">
          <div className="flex items-center gap-3">
            <div className="grid h-20 w-20 shrink-0 place-items-center rounded-lg border border-violet-300/40 bg-violet-300/10">
              <CurrentRankIcon className="h-10 w-10 text-violet-200" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-slate-300">Current Rank</p>
              <h2 className="truncate text-2xl font-extrabold text-white">{currentRank.title}</h2>
              <p className="mt-1 text-base font-black text-mint">Level {profile.level}</p>
              <p className="text-sm font-bold text-slate-200">{profile.xp.toLocaleString()} XP</p>
            </div>
            <div className="rounded-lg border border-mint/35 bg-black/35 px-3 py-2 text-center">
              <p className="text-2xl font-black text-white">{profile.overallScore}</p>
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-mint">OVR</p>
            </div>
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-violet-300 via-mint to-amber-300"
              style={{
                width: nextRank
                  ? `${rankProgressPercent(profile.xp)}%`
                  : "100%"
              }}
            />
          </div>
          <p className="mt-2 text-right text-xs text-slate-400">
            {nextRank ? `Next: ${nextRank.title} (${nextRank.xp - profile.xp} XP)` : "Top track reached"}
          </p>
        </div>

        <div className="grid grid-cols-4 gap-px bg-white/10">
          {rankThresholds.map((rank) => {
            const Icon = rank.icon;
            const active = profile.xp >= rank.xp;

            return (
              <div key={rank.label} className="bg-slate-950/90 p-3 text-center">
                <Icon className={`mx-auto h-5 w-5 ${active ? "text-mint" : "text-slate-600"}`} />
                <p className={`mt-2 text-[10px] font-bold ${active ? "text-white" : "text-slate-500"}`}>
                  {rank.label}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-amber-300" />
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-amber-300">
            Unlocks
          </p>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          {[
            ["Leader Card 1", "After 1 match", progress.attempts.length >= 1],
            ["Leader Card 3", "After 3 matches", progress.attempts.length >= 3],
            ["Senior Track", "1,200 XP", profile.xp >= 1200],
            ["Group Track", "2,400 XP", profile.xp >= 2400]
          ].map(([title, detail, active]) => (
            <div key={String(title)} className="rounded-lg border border-white/10 bg-black/25 p-3">
              {active ? <Zap className="h-5 w-5 text-mint" /> : <Lock className="h-5 w-5 text-slate-500" />}
              <p className="mt-3 text-xs font-extrabold text-white">{title}</p>
              <p className="mt-1 text-[10px] text-slate-500">{detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-violet-200">
              Upcoming Challenges
            </p>
            <h2 className="mt-1 text-lg font-extrabold text-white">Next matches</h2>
          </div>
          <Link href="/scenarios" className="text-xs font-semibold text-cyan">
            View all
          </Link>
        </div>
        {(nextScenarios.length ? nextScenarios : scenarios.slice(0, 3)).map((scenario, index) => (
          <Link
            key={scenario.id}
            href={`/scenarios/${scenario.slug}`}
            className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-3 backdrop-blur-xl"
          >
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-lg border border-white/10 bg-black/25">
              <span className="text-lg font-black text-mint">0{index + 1}</span>
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-sm font-extrabold text-white">{scenario.title}</h3>
              <p className="mt-1 truncate text-xs text-slate-400">
                {scenario.difficulty.replace("_", " ")} - {scenario.decisionType}
              </p>
            </div>
            <ChevronRight className="h-5 w-5 text-slate-500" />
          </Link>
        ))}
      </section>
    </>
  );
}
