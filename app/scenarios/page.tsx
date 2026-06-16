import { AppShell } from "@/components/app-shell";
import { ScenarioFilters } from "@/components/scenario-filters";
import { ScenarioResults } from "@/components/scenario-results";
import { getScenarios } from "@/lib/data/repository";

const stages = ["ALL", "EARLY", "GROWTH", "SCALE", "TURNAROUND"] as const;
const decisionTypes = ["ALL", "STRATEGY", "PRIORITIZATION", "TEAM", "LAUNCH", "PRICING", "GROWTH"] as const;
const difficulties = ["ALL", "ROOKIE", "PRO", "WORLD_CLASS", "LEGENDARY"] as const;

interface ScenarioMarketPageProps {
  searchParams: Promise<{
    stage?: string;
    type?: string;
    difficulty?: string;
    page?: string;
  }>;
}

export default async function ScenarioMarketPage({
  searchParams
}: ScenarioMarketPageProps) {
  const params = await searchParams;
  const activeStage = params.stage ?? "ALL";
  const activeType = params.type ?? "ALL";
  const activeDifficulty = params.difficulty ?? "ALL";
  const requestedPage = Number(params.page ?? "1");
  const activePage = Number.isFinite(requestedPage) && requestedPage > 0 ? Math.floor(requestedPage) : 1;

  const filteredScenarios = await getScenarios({
    stage: activeStage === "ALL" ? null : activeStage,
    decisionType: activeType === "ALL" ? null : activeType,
    difficulty: activeDifficulty === "ALL" ? null : activeDifficulty
  });

  return (
    <AppShell title="Transfer Market">
      <ScenarioFilters
        activeStage={activeStage}
        activeType={activeType}
        activeDifficulty={activeDifficulty}
        stages={stages}
        decisionTypes={decisionTypes}
        difficulties={difficulties}
      />

      <ScenarioResults
        activeStage={activeStage}
        activeType={activeType}
        activeDifficulty={activeDifficulty}
        activePage={activePage}
        scenarios={filteredScenarios}
      />
    </AppShell>
  );
}
