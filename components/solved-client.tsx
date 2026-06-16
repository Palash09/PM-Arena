"use client";

import Link from "next/link";
import { CheckCircle2, ChevronRight } from "lucide-react";

import { primarySkillGainForAttempt, skillLabels, useProgress } from "@/lib/progress-store";
import { Scenario } from "@/lib/types";

interface SolvedClientProps {
  scenarios: Scenario[];
}

export function SolvedClient({ scenarios }: SolvedClientProps) {
  const { isHydrated, progress } = useProgress();

  if (!isHydrated) {
    return <div className="h-80 animate-pulse rounded-lg border border-white/10 bg-white/5" />;
  }

  const attempts = [...progress.attempts].reverse();
  const scenarioById = new Map(scenarios.map((scenario) => [scenario.id, scenario]));
  const scenarioBySlug = new Map(scenarios.map((scenario) => [scenario.slug, scenario]));

  if (!attempts.length) {
    return (
      <section className="rounded-lg border border-white/10 bg-white/5 p-5 shadow-card backdrop-blur-md">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mint">
          No Solved Questions
        </p>
        <h2 className="mt-2 text-2xl font-extrabold text-white">Play a scenario to build history.</h2>
        <Link
          href="/scenarios"
          className="mt-5 inline-flex rounded-lg bg-mint px-4 py-3 text-sm font-extrabold text-slate-950"
        >
          Find Scenarios
        </Link>
      </section>
    );
  }

  return (
    <section className="space-y-3">
      {attempts.map((attempt) => {
        const practiced = primarySkillGainForAttempt(attempt);
        const sourceScenario =
          scenarioById.get(attempt.scenarioId) ?? scenarioBySlug.get(attempt.scenarioSlug);
        const leaderName = attempt.guest ?? sourceScenario?.guest ?? "Product Leader";
        const productName = attempt.company ?? sourceScenario?.company ?? attempt.scenarioTitle;

        return (
          <Link
            key={attempt.id}
            href={`/solved/${encodeURIComponent(attempt.id)}`}
            className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-3 shadow-card backdrop-blur-md"
          >
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-mint/25 bg-mint/10">
              <CheckCircle2 className="h-5 w-5 text-mint" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-extrabold text-white">
                {leaderName} - {productName}
              </p>
              <p className="mt-1 truncate text-xs font-semibold text-slate-300">
                +{attempt.xp} XP - {skillLabels[practiced.skill]} +{practiced.value}
              </p>
            </div>
            <ChevronRight className="h-4 w-4 shrink-0 text-slate-400" />
          </Link>
        );
      })}
    </section>
  );
}
