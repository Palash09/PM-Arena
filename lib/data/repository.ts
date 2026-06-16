import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import {
  buildFallbackEvaluation,
  getPlayerBySlug as getSeedPlayerBySlug,
  getScenarioBySlug as getSeedScenarioBySlug,
  playerCards,
  scenarios,
  skillOrder,
  userProfile
} from "@/lib/data/seed-data";
import {
  EvaluationResult,
  PlayerCard,
  Scenario,
  SkillKey,
  UserProfile
} from "@/lib/types";

type ScenarioRecord = Prisma.ScenarioGetPayload<{
  include: { options: true };
}>;

type UserProfileRecord = Prisma.UserProfileGetPayload<{
  include: {
    stats: true;
    attempts: {
      include: {
        scenario: true;
      };
      orderBy: {
        createdAt: "desc";
      };
      take: 5;
    };
  };
}>;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function toStringArray(value: Prisma.JsonValue | null | undefined): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

function toStatsRecord(value: Prisma.JsonValue | null | undefined): Record<SkillKey, number> {
  const fallback = userProfile.stats;

  if (!isRecord(value)) {
    return {
      strategy: fallback.strategy.value,
      execution: fallback.execution.value,
      leadership: fallback.leadership.value,
      growth: fallback.growth.value,
      analytics: fallback.analytics.value,
      communication: fallback.communication.value
    };
  }

  return {
    strategy: Number(value.strategy ?? fallback.strategy.value),
    execution: Number(value.execution ?? fallback.execution.value),
    leadership: Number(value.leadership ?? fallback.leadership.value),
    growth: Number(value.growth ?? fallback.growth.value),
    analytics: Number(value.analytics ?? fallback.analytics.value),
    communication: Number(value.communication ?? fallback.communication.value)
  };
}

function mapPlayerCard(player: {
  id: string;
  slug: string;
  name: string;
  company: string;
  role: string;
  archetype: string;
  rating: number;
  unlocked: boolean;
  avatarHue: string;
  signatureMove: string;
  quote: string;
  sourceFile: string;
  stats: Prisma.JsonValue;
}): PlayerCard {
  return {
    id: player.id,
    slug: player.slug,
    name: player.name,
    company: player.company,
    role: player.role,
    archetype: player.archetype,
    rating: player.rating,
    unlocked: player.unlocked,
    avatarHue: player.avatarHue,
    signatureMove: player.signatureMove,
    quote: player.quote,
    sourceFile: player.sourceFile,
    stats: toStatsRecord(player.stats)
  };
}

function mapScenario(scenario: ScenarioRecord): Scenario {
  return {
    id: scenario.id,
    slug: scenario.slug,
    title: scenario.title,
    company: scenario.company,
    guest: scenario.guest,
    difficulty: scenario.difficulty,
    stage: scenario.stage,
    decisionType: scenario.decisionType,
    recommendedSkill: scenario.recommendedSkill,
    shortPitch: scenario.shortPitch,
    context: scenario.context,
    stakes: scenario.stakes,
    actualOutcome: scenario.actualOutcome,
    expertReasoning: scenario.expertReasoning,
    sourceQuote: scenario.sourceQuote,
    sourceFile: scenario.sourceFile,
    frameworks: toStringArray(scenario.frameworks),
    options: scenario.options
      .sort((left, right) => left.label.localeCompare(right.label))
      .map((option) => ({
        id: option.id,
        label: option.label,
        title: option.title,
        summary: option.summary,
        pros: toStringArray(option.pros),
        tradeoffs: toStringArray(option.tradeoffs),
        frameworkSignals: toStringArray(option.frameworkSignals),
        isHistoricalChoice: option.isHistoricalChoice
      }))
  };
}

function mapUserProfile(profile: UserProfileRecord): UserProfile {
  const statEntries = Object.fromEntries(
    profile.stats.map((stat) => [
      stat.key,
      {
        label: stat.label,
        value: stat.value
      }
    ])
  ) as UserProfile["stats"];

  return {
    name: profile.name,
    title: profile.title,
    level: profile.level,
    rank: profile.rank,
    credibilityScore: profile.credibilityScore,
    streak: profile.streak,
    record: {
      wins: profile.wins,
      retries: profile.retries
    },
    focusAreas: toStringArray(profile.focusAreas),
    stats: {
      strategy: statEntries.strategy ?? userProfile.stats.strategy,
      execution: statEntries.execution ?? userProfile.stats.execution,
      leadership: statEntries.leadership ?? userProfile.stats.leadership,
      growth: statEntries.growth ?? userProfile.stats.growth,
      analytics: statEntries.analytics ?? userProfile.stats.analytics,
      communication: statEntries.communication ?? userProfile.stats.communication
    },
    recentActivity: profile.attempts.map((attempt) => ({
      id: attempt.id,
      title: attempt.scenario.title,
      score: attempt.score,
      outcome: attempt.score >= 60 ? "win" : "retry"
    }))
  };
}

let shouldSkipDatabase = false;

async function withFallback<T>(query: () => Promise<T>, fallback: () => T | Promise<T>): Promise<T> {
  if (shouldSkipDatabase) {
    return await fallback();
  }

  try {
    return await query();
  } catch (error) {
    if (
      error instanceof Error &&
      (error.message.includes("Can't reach database server") ||
        error.message.includes("ECONNREFUSED") ||
        error.message.includes("connect ECONNREFUSED"))
    ) {
      shouldSkipDatabase = true;
    }

    return await fallback();
  }
}

export async function getUserProfile(): Promise<UserProfile> {
  return withFallback(
    async () => {
      const profile = await prisma.userProfile.findFirst({
        include: {
          stats: true,
          attempts: {
            include: {
              scenario: true
            },
            orderBy: {
              createdAt: "desc"
            },
            take: 5
          }
        },
        orderBy: {
          createdAt: "asc"
        }
      });

      return profile ? mapUserProfile(profile) : userProfile;
    },
    () => userProfile
  );
}

interface ScenarioFilters {
  stage?: string | null;
  difficulty?: string | null;
  decisionType?: string | null;
}

function scenarioMatchesFilters(scenario: Scenario, filters: ScenarioFilters) {
  const stageMatch = !filters.stage || scenario.stage === filters.stage;
  const difficultyMatch = !filters.difficulty || scenario.difficulty === filters.difficulty;
  const typeMatch = !filters.decisionType || scenario.decisionType === filters.decisionType;

  return stageMatch && difficultyMatch && typeMatch;
}

function sortScenariosForMarket(items: Scenario[]) {
  const difficultyOrder = {
    ROOKIE: 0,
    PRO: 1,
    WORLD_CLASS: 2,
    LEGENDARY: 3
  };

  return [...items].sort((left, right) => {
    const difficultyDelta = difficultyOrder[left.difficulty] - difficultyOrder[right.difficulty];

    if (difficultyDelta !== 0) {
      return difficultyDelta;
    }

    return left.title.localeCompare(right.title);
  });
}

export async function getScenarios(filters: ScenarioFilters = {}): Promise<Scenario[]> {
  return withFallback(
    async () => {
      const where: Prisma.ScenarioWhereInput = {};

      if (filters.stage) {
        where.stage = filters.stage as Prisma.EnumCompanyStageFilter["equals"];
      }

      if (filters.difficulty) {
        where.difficulty = filters.difficulty as Prisma.EnumDifficultyFilter["equals"];
      }

      if (filters.decisionType) {
        where.decisionType = filters.decisionType as Prisma.EnumDecisionTypeFilter["equals"];
      }

      const rows = await prisma.scenario.findMany({
        where,
        include: {
          options: true
        },
        orderBy: [{ difficulty: "asc" }, { title: "asc" }]
      });

      const dbScenarios = rows.map(mapScenario);
      const dbScenarioIds = new Set(dbScenarios.map((scenario) => scenario.id));
      const seedOnlyScenarios = scenarios.filter((scenario) => {
        return !dbScenarioIds.has(scenario.id) && scenarioMatchesFilters(scenario, filters);
      });

      return sortScenariosForMarket([...dbScenarios, ...seedOnlyScenarios]);
    },
    () =>
      sortScenariosForMarket(scenarios.filter((scenario) => scenarioMatchesFilters(scenario, filters)))
  );
}

export async function getScenarioBySlug(slug: string): Promise<Scenario | null> {
  return withFallback(
    async () => {
      const row = await prisma.scenario.findUnique({
        where: { slug },
        include: {
          options: true
        }
      });

      return row ? mapScenario(row) : getSeedScenarioBySlug(slug) ?? null;
    },
    () => getSeedScenarioBySlug(slug) ?? null
  );
}

export async function getScenarioById(id: string): Promise<Scenario | null> {
  return withFallback(
    async () => {
      const row = await prisma.scenario.findUnique({
        where: { id },
        include: {
          options: true
        }
      });

      return row ? mapScenario(row) : scenarios.find((scenario) => scenario.id === id) ?? null;
    },
    () => scenarios.find((scenario) => scenario.id === id) ?? null
  );
}

export async function getPlayers(): Promise<PlayerCard[]> {
  return withFallback(
    async () => {
      const rows = await prisma.playerCard.findMany({
        orderBy: [{ rating: "desc" }, { name: "asc" }]
      });

      const dbPlayers = rows.map(mapPlayerCard);
      const dbPlayerIds = new Set(dbPlayers.map((player) => player.id));
      const seedOnlyPlayers = playerCards.filter((player) => !dbPlayerIds.has(player.id));

      return [...dbPlayers, ...seedOnlyPlayers].sort((left, right) => {
        const ratingDelta = right.rating - left.rating;

        if (ratingDelta !== 0) {
          return ratingDelta;
        }

        return left.name.localeCompare(right.name);
      });
    },
    () => playerCards
  );
}

export async function getPlayerBySlug(slug: string): Promise<PlayerCard | null> {
  return withFallback(
    async () => {
      const row = await prisma.playerCard.findUnique({
        where: { slug }
      });

      return row ? mapPlayerCard(row) : getSeedPlayerBySlug(slug) ?? null;
    },
    () => getSeedPlayerBySlug(slug) ?? null
  );
}

export async function recordGameAttempt(input: {
  scenarioId: string;
  optionId: string;
  reasoning: string;
  evaluation: EvaluationResult;
}) {
  try {
    const profile = await prisma.userProfile.findFirst({
      orderBy: {
        createdAt: "asc"
      }
    });

    if (!profile) {
      return;
    }

    await prisma.gameAttempt.create({
      data: {
        profileId: profile.id,
        scenarioId: input.scenarioId,
        optionId: input.optionId,
        reasoning: input.reasoning,
        score: input.evaluation.score,
        choiceAlignment: input.evaluation.choiceAlignment,
        reasoningAlignment: input.evaluation.reasoningAlignment,
        frameworkCoverage: input.evaluation.frameworkCoverage,
        completeness: input.evaluation.completeness,
        verdict: input.evaluation.verdict,
        delta: input.evaluation.delta,
        coaching: input.evaluation.coaching
      }
    });

    await prisma.userProfile.update({
      where: { id: profile.id },
      data: {
        credibilityScore: {
          increment: Math.max(4, Math.round(input.evaluation.score / 8))
        },
        wins: input.evaluation.score >= 60 ? { increment: 1 } : undefined,
        retries: input.evaluation.score < 60 ? { increment: 1 } : undefined,
        streak: input.evaluation.score >= 60 ? { increment: 1 } : 0
      }
    });
  } catch {
    return;
  }
}

export function getFallbackEvaluation(
  scenarioId: string,
  optionId: string,
  reasoning: string
) {
  return buildFallbackEvaluation(scenarioId, optionId, reasoning);
}

export function getSkillOrder() {
  return skillOrder;
}
