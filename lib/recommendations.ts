import { LocalProgressState, skillLabels } from "@/lib/progress-store";
import { Scenario } from "@/lib/types";

export interface ScenarioRecommendation {
  scenario: Scenario;
  reason: string;
  score: number;
}

const decisionTypeLabels: Record<string, string> = {
  STRATEGY: "strategy decisions",
  PRIORITIZATION: "prioritization reps",
  TEAM: "team alignment",
  LAUNCH: "launch decisions",
  PRICING: "pricing judgment",
  GROWTH: "growth loops"
};

function formatValue(value: string) {
  return value.replace("_", " ").toLowerCase();
}

function scoreScenario(scenario: Scenario, progress: LocalProgressState) {
  let score = 0;
  const reasons: string[] = [];

  if (progress.focusSkills.includes(scenario.recommendedSkill)) {
    score += 5;
    reasons.push(`${skillLabels[scenario.recommendedSkill]} focus`);
  }

  if (progress.practiceTypes.includes(scenario.decisionType)) {
    score += 4;
    reasons.push(decisionTypeLabels[scenario.decisionType] ?? formatValue(scenario.decisionType));
  }

  if (progress.preferredStages.includes(scenario.stage)) {
    score += 3;
    reasons.push(`${formatValue(scenario.stage)} company context`);
  }

  if (progress.preferredDifficulties.includes(scenario.difficulty)) {
    score += 2;
    reasons.push(`${formatValue(scenario.difficulty)} challenge level`);
  }

  if (!progress.attempts.some((attempt) => attempt.scenarioId === scenario.id)) {
    score += 1;
  }

  return {
    reasons,
    score
  };
}

export function recommendScenario(
  scenarios: Scenario[],
  progress: LocalProgressState
): ScenarioRecommendation | null {
  if (!scenarios.length) {
    return null;
  }

  const completedScenarioIds = new Set(progress.attempts.map((attempt) => attempt.scenarioId));
  const candidates = scenarios.filter((scenario) => !completedScenarioIds.has(scenario.id));
  const pool = candidates.length ? candidates : scenarios;
  const ranked = pool
    .map((scenario) => ({
      scenario,
      ...scoreScenario(scenario, progress)
    }))
    .sort((left, right) => right.score - left.score);
  const top = ranked[0];
  const reason = top.reasons.length
    ? `Recommended for ${top.reasons.slice(0, 2).join(" + ")}.`
    : "Recommended as the next unplayed PM decision rep.";

  return {
    scenario: top.scenario,
    reason,
    score: top.score
  };
}
