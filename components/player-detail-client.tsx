"use client";

import Link from "next/link";
import { Lock } from "lucide-react";

import { isLeaderUnlocked, useProgress } from "@/lib/progress-store";
import { PlayerCard, Scenario } from "@/lib/types";
import { LeaderCard } from "@/components/leader-card";

interface PlayerDetailClientProps {
  player: PlayerCard;
  scenarios: Scenario[];
}

export function PlayerDetailClient({ player, scenarios }: PlayerDetailClientProps) {
  const { isHydrated, progress } = useProgress();
  const leaderScenarios = scenarios.filter((scenario) => scenario.guest === player.name);
  const leaderScenarioIds = leaderScenarios.map((scenario) => scenario.id);
  const unlocked = isHydrated && isLeaderUnlocked(leaderScenarioIds, progress);

  if (!isHydrated) {
    return <div className="h-96 animate-pulse rounded-lg border border-white/10 bg-white/5" />;
  }

  if (!unlocked) {
    return (
      <section className="rounded-lg border border-white/10 bg-slate-950/75 p-5 text-center shadow-card backdrop-blur-xl">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-lg border border-slate-500/30 bg-slate-500/10">
          <Lock className="h-8 w-8 text-slate-300" />
        </div>
        <h2 className="mt-4 text-2xl font-extrabold text-white">Leader card locked</h2>
        <p className="mt-2 text-sm font-semibold leading-6 text-slate-300">
          Complete a {player.name} scenario to unlock this PM leader recall.
        </p>
        <Link
          href="/players"
          className="mt-5 inline-flex w-full items-center justify-center rounded-md bg-mint px-4 py-3 text-sm font-extrabold text-slate-950"
        >
          Back to Squad
        </Link>
      </section>
    );
  }

  const scenarioById = new Map(scenarios.map((scenario) => [scenario.id, scenario]));
  const recallItems = progress.attempts
    .map((attempt) => {
      const scenario = scenarioById.get(attempt.scenarioId);

      if (!scenario || scenario.guest !== player.name) {
        return null;
      }

      const selectedOption = attempt.selectedOptionId
        ? scenario.options.find((option) => option.id === attempt.selectedOptionId)
        : undefined;

      return {
        id: attempt.id,
        scenarioTitle: scenario.title,
        score: attempt.score,
        outcome: attempt.outcome,
        selectedOptionTitle: selectedOption?.title,
        expertChoice: attempt.expertChoice,
        expertQuote: attempt.expertQuote,
        delta: attempt.delta,
        coaching: attempt.coaching,
        frameworks: scenario.frameworks,
        expertReasoning: scenario.expertReasoning,
        actualOutcome: scenario.actualOutcome
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null)
    .reverse();

  return <LeaderCard player={player} unlocked={unlocked} recallItems={recallItems} />;
}
