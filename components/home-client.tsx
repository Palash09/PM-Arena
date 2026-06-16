"use client";

import Link from "next/link";
import {
  Bolt,
  CheckCircle2,
  ChevronRight,
  Trophy,
  Users
} from "lucide-react";

import { OnboardingScreen } from "@/components/onboarding-screen";
import { getNextRankForXp, getRankForXp, rankProgressPercent } from "@/components/rank-config";
import { ScenarioCard } from "@/components/scenario-card";
import { primarySkillGainForAttempt, skillLabels, useProgress } from "@/lib/progress-store";
import { recommendScenario } from "@/lib/recommendations";
import { Scenario } from "@/lib/types";

interface HomeClientProps {
  scenarios: Scenario[];
}

export function HomeClient({ scenarios }: HomeClientProps) {
  const { isHydrated, progress, profile } = useProgress();
  const recommendation = recommendScenario(scenarios, progress);
  const featuredScenario = recommendation?.scenario ?? scenarios[0];
  const quickMatchHref = featuredScenario ? `/scenarios/${featuredScenario.slug}` : "/scenarios";
  const nextRank = getNextRankForXp(profile.xp);
  const completedCount = progress.attempts.length;
  const CurrentRankIcon = getRankForXp(profile.xp).icon;
  const scenarioById = new Map(scenarios.map((scenario) => [scenario.id, scenario]));

  if (!isHydrated) {
    return <div className="h-80 animate-pulse rounded-lg border border-white/10 bg-white/5" />;
  }

  if (!progress.onboarded) {
    return <OnboardingScreen />;
  }

  return (
    <>
      <section className="overflow-hidden rounded-lg border border-violet-400/25 bg-slate-950/80 shadow-card backdrop-blur-xl">
        <div className="bg-[linear-gradient(135deg,rgba(157,91,255,0.28),rgba(17,196,112,0.12))] p-4">
          <div className="flex items-center gap-3">
            <div className="grid h-20 w-20 shrink-0 place-items-center rounded-lg border border-violet-300/40 bg-violet-300/10">
              <CurrentRankIcon className="h-10 w-10 text-violet-200" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-slate-300">Welcome, {profile.name}</p>
              <h2 className="truncate text-2xl font-extrabold text-white">{getRankForXp(profile.xp).title}</h2>
              <p className="mt-1 text-base font-black text-mint">Level {profile.level}</p>
              <p className="text-sm font-bold text-slate-200">{profile.xp.toLocaleString()} XP</p>
            </div>
            <div className="rounded-lg border border-mint/35 bg-black/35 px-3 py-2 text-center">
              <p className="text-2xl font-black text-white">{profile.overallScore}</p>
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-mint">OVR</p>
            </div>
          </div>

          <div className="mt-4">
            <div className="h-2 overflow-hidden rounded-full bg-white/10">
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
              {nextRank ? `${nextRank.xp - profile.xp} to ${nextRank.title}` : "Top track reached"}
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-3">
        <Link
          href={quickMatchHref}
          className="group flex min-h-20 items-center gap-4 rounded-lg border border-mint/30 bg-[linear-gradient(135deg,rgba(18,198,126,0.95),rgba(9,113,128,0.78))] p-4 shadow-glow"
        >
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-white/15">
            <Bolt className="h-7 w-7 fill-white text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-extrabold text-white">Quick Match</h3>
            <p className="truncate text-sm font-semibold text-white/85">Jump into a high-pressure scenario</p>
          </div>
          <ChevronRight className="h-5 w-5 text-white transition group-hover:translate-x-0.5" />
        </Link>

        <div className="grid grid-cols-2 gap-3">
          <Link href="/career" className="rounded-lg border border-amber-300/25 bg-amber-300/10 p-4">
            <Trophy className="h-6 w-6 text-amber-300" />
            <h3 className="mt-4 font-extrabold text-white">Career Mode</h3>
            <p className="mt-1 text-sm font-semibold leading-5 text-slate-200">{completedCount}/{scenarios.length} completed</p>
          </Link>
          <Link href="/report" className="rounded-lg border border-violet-400/25 bg-violet-400/10 p-4">
            <Users className="h-6 w-6 text-violet-300" />
            <h3 className="mt-4 font-extrabold text-white">Competency</h3>
            <p className="mt-1 text-sm font-semibold leading-5 text-slate-200">Radar and focus areas</p>
          </Link>
        </div>
      </section>

      {featuredScenario ? (
        <section className="space-y-3">
          <ScenarioCard scenario={featuredScenario} featured />
        </section>
      ) : null}

      {profile.recentActivity.length ? (
        <section className="rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-slate-300">
                Recent Results
              </p>
              <h3 className="mt-1 text-lg font-extrabold text-white">Form Guide</h3>
            </div>
            <Link href="/solved" className="text-sm font-bold text-cyan">
              View all
            </Link>
          </div>
          <div className="mt-3 space-y-2">
            {[...progress.attempts].reverse().slice(0, 3).map((item) => {
              const practiced = primarySkillGainForAttempt(item);
              const sourceScenario = scenarioById.get(item.scenarioId) ?? scenarios.find((scenario) => scenario.slug === item.scenarioSlug);
              const leaderName = item.guest ?? sourceScenario?.guest ?? "Product Leader";
              const productName = item.company ?? sourceScenario?.company ?? "Product";

              return (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-lg border border-white/10 bg-black/20 px-3 py-2"
              >
                <div className="flex min-w-0 items-center gap-2">
                  <CheckCircle2
                    className={`h-4 w-4 shrink-0 ${
                      item.outcome === "win" ? "text-mint" : "text-violet-300"
                    }`}
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-white">
                      {leaderName} - {productName}
                    </p>
                    <p className="truncate text-xs font-semibold text-slate-300">
                      {skillLabels[practiced.skill]} +{practiced.value}
                    </p>
                  </div>
                </div>
                <span className={item.outcome === "win" ? "text-sm font-extrabold text-mint" : "text-sm font-extrabold text-coral"}>
                  +{item.xp} XP
                </span>
              </div>
            );
            })}
          </div>
        </section>
      ) : null}
    </>
  );
}
