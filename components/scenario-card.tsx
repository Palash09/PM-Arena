"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, RotateCcw, Star } from "lucide-react";

import { useProgress } from "@/lib/progress-store";
import { Scenario } from "@/lib/types";

interface ScenarioCardProps {
  scenario: Scenario;
  featured?: boolean;
}

export function ScenarioCard({ scenario, featured = false }: ScenarioCardProps) {
  const { isHydrated, progress } = useProgress();
  const completedAttempts = isHydrated
    ? progress.attempts.filter((attempt) => attempt.scenarioId === scenario.id)
    : [];
  const hasCompleted = completedAttempts.length > 0;
  const bestScore = completedAttempts.length
    ? Math.max(...completedAttempts.map((attempt) => attempt.score))
    : null;

  return (
    <article className="overflow-hidden rounded-lg border border-white/10 bg-white/5 shadow-card backdrop-blur-xl">
      {featured ? (
        <div className="flex items-center justify-between border-b border-white/10 bg-mint/10 px-4 py-2">
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 fill-mint text-mint" />
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-mint">
              Featured Scenario
            </p>
          </div>
          <span className="text-sm font-black text-mint">+270 XP</span>
        </div>
      ) : null}
      <div className="p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-cyan">
              {scenario.company} • {scenario.guest}
            </p>
            {hasCompleted ? (
              <span className="inline-flex items-center gap-1 rounded-md border border-mint/30 bg-mint/10 px-2 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-mint">
                <CheckCircle2 className="h-3 w-3" />
                Completed
              </span>
            ) : null}
          </div>
          <h2 className="mt-2 text-xl font-extrabold leading-tight text-white">
            {scenario.title}
          </h2>
        </div>
        <div className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-right">
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-slate-300">
            Tier
          </p>
          <p className="mt-1 text-sm font-extrabold text-lime">{scenario.difficulty.replace("_", " ")}</p>
        </div>
      </div>
      <p className="mt-4 text-base font-semibold leading-7 text-slate-200">{scenario.shortPitch}</p>
      <div className="mt-4 grid grid-cols-3 gap-2">
        <span className="rounded-lg border border-cyan/25 bg-cyan/10 px-2.5 py-2 text-center text-xs font-black text-cyan">
          {scenario.decisionType}
        </span>
        <span className="rounded-lg border border-lime/20 bg-lime/10 px-2.5 py-2 text-center text-xs font-black text-lime">
          {scenario.stage}
        </span>
        <span className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-2 text-center text-xs font-black text-slate-100">
          {scenario.recommendedSkill}
        </span>
      </div>
      {hasCompleted ? (
        <div className="mt-4 flex items-center gap-2 rounded-lg border border-mint/25 bg-mint/10 px-3 py-2">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-mint" />
          <p className="text-sm font-extrabold leading-5 text-slate-100">
            Already completed{bestScore !== null ? ` • Best score ${bestScore}%` : ""}
          </p>
        </div>
      ) : null}
      <div className="mt-5">
        <Link
          href={`/scenarios/${scenario.slug}`}
          className="flex min-h-12 w-full items-center justify-center gap-2 rounded-lg border border-mint/30 bg-mint px-5 py-3 text-base font-black text-slate-950 shadow-[0_0_24px_rgba(125,255,179,0.2)] transition hover:bg-white"
        >
          {hasCompleted ? "Replay" : "Play"}
          {hasCompleted ? <RotateCcw className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
        </Link>
      </div>
      </div>
    </article>
  );
}
