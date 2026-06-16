"use client";

import Link from "next/link";

import { ScenarioCard } from "@/components/scenario-card";
import { useProgress } from "@/lib/progress-store";
import { Scenario } from "@/lib/types";

const pageSize = 3;

interface ScenarioResultsProps {
  activeStage: string;
  activeType: string;
  activeDifficulty: string;
  activePage: number;
  scenarios: Scenario[];
}

export function ScenarioResults({
  activeStage,
  activeType,
  activeDifficulty,
  activePage,
  scenarios
}: ScenarioResultsProps) {
  const { isHydrated, progress } = useProgress();
  const completedScenarioIds = new Set(progress.attempts.map((attempt) => attempt.scenarioId));
  const orderedScenarios = isHydrated
    ? [...scenarios].sort((left, right) => {
        const leftCompleted = completedScenarioIds.has(left.id);
        const rightCompleted = completedScenarioIds.has(right.id);

        if (leftCompleted !== rightCompleted) {
          return leftCompleted ? 1 : -1;
        }

        return 0;
      })
    : scenarios;
  const totalPages = Math.max(1, Math.ceil(orderedScenarios.length / pageSize));
  const currentPage = Math.min(activePage, totalPages);
  const visibleScenarios = orderedScenarios.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  function hrefForPage(page: number) {
    const query = new URLSearchParams();

    if (activeStage !== "ALL") {
      query.set("stage", activeStage);
    }

    if (activeType !== "ALL") {
      query.set("type", activeType);
    }

    if (activeDifficulty !== "ALL") {
      query.set("difficulty", activeDifficulty);
    }

    if (page > 1) {
      query.set("page", String(page));
    }

    const result = query.toString();
    return result ? `/scenarios?${result}` : "/scenarios";
  }

  return (
    <>
      <section className="space-y-4">
        {visibleScenarios.length ? (
          visibleScenarios.map((scenario) => (
            <ScenarioCard key={scenario.id} scenario={scenario} />
          ))
        ) : (
          <div className="rounded-lg border border-dashed border-white/15 bg-black/30 p-5 text-base font-bold leading-7 text-slate-200">
            No scenarios match those filters. Clear filters or broaden the market.
          </div>
        )}
      </section>

      {orderedScenarios.length > pageSize ? (
        <nav className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-3 backdrop-blur-xl">
          <Link
            href={hrefForPage(Math.max(1, currentPage - 1))}
            aria-disabled={currentPage === 1}
            className={`rounded-md px-3 py-2 text-sm font-extrabold ${
              currentPage === 1
                ? "pointer-events-none text-slate-500"
                : "bg-white/10 text-white"
            }`}
          >
            Previous
          </Link>
          <p className="text-sm font-black text-slate-100">
            Page {currentPage} of {totalPages}
          </p>
          <Link
            href={hrefForPage(Math.min(totalPages, currentPage + 1))}
            aria-disabled={currentPage === totalPages}
            className={`rounded-md px-3 py-2 text-sm font-extrabold ${
              currentPage === totalPages
                ? "pointer-events-none text-slate-500"
                : "bg-mint text-slate-950"
            }`}
          >
            Next
          </Link>
        </nav>
      ) : null}
    </>
  );
}
