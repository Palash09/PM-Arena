"use client";

import { useEffect, useMemo, useState } from "react";

import { getRankForXp } from "@/components/rank-config";
import { authStorageKey, getCurrentUser } from "@/lib/auth-store";
import { CompanyStage, DecisionType, Difficulty, EvaluationResult, Scenario, SkillKey } from "@/lib/types";

export const skillLabels: Record<SkillKey, string> = {
  strategy: "Strategy",
  execution: "Execution",
  leadership: "Leadership",
  growth: "Growth",
  analytics: "Analytics",
  communication: "Communication"
};

export const skillOrder: SkillKey[] = [
  "strategy",
  "execution",
  "leadership",
  "growth",
  "analytics",
  "communication"
];

export interface LocalAttempt {
  id: string;
  scenarioId: string;
  scenarioSlug: string;
  scenarioTitle: string;
  selectedOptionId?: string;
  reasoning?: string;
  skill: SkillKey;
  score: number;
  xp: number;
  outcome: "win" | "retry";
  createdAt: string;
  company?: string;
  guest?: string;
  skillGain?: Partial<Record<SkillKey, number>>;
  expertChoice?: string;
  expertQuote?: string;
  delta?: string[];
  coaching?: string[];
  evaluation: Pick<
    EvaluationResult,
    "choiceAlignment" | "reasoningAlignment" | "frameworkCoverage" | "completeness"
  >;
}

export interface LocalProgressState {
  onboarded: boolean;
  name: string;
  experience: "new" | "associate" | "senior";
  goals: string[];
  focusSkills: SkillKey[];
  practiceTypes: DecisionType[];
  preferredStages: CompanyStage[];
  preferredDifficulties: Difficulty[];
  attempts: LocalAttempt[];
}

interface OnboardingInput {
  name: string;
  experience: LocalProgressState["experience"];
  goals: string[];
  focusSkills: SkillKey[];
  practiceTypes: DecisionType[];
  preferredStages: CompanyStage[];
  preferredDifficulties: Difficulty[];
}

const STORAGE_KEY = "pm-simulator-progress-v1";

export const defaultProgress: LocalProgressState = {
  onboarded: false,
  name: "",
  experience: "new",
  goals: [],
  focusSkills: [],
  practiceTypes: [],
  preferredStages: [],
  preferredDifficulties: [],
  attempts: []
};

const baseByExperience: Record<LocalProgressState["experience"], number> = {
  new: 35,
  associate: 42,
  senior: 50
};

const xpBaseByDifficulty: Record<Difficulty, number> = {
  ROOKIE: 110,
  PRO: 140,
  WORLD_CLASS: 170,
  LEGENDARY: 200
};

export function xpForScenarioAttempt(scenario: Scenario, evaluation: Pick<EvaluationResult, "score">) {
  return Math.max(100, Math.round(xpBaseByDifficulty[scenario.difficulty] + evaluation.score * 0.9));
}

export function rankLabelForXp(xp: number) {
  return getRankForXp(xp).title;
}

function readProgress(): LocalProgressState {
  if (typeof window === "undefined") {
    return defaultProgress;
  }

  try {
    const scopedKey = authStorageKey(STORAGE_KEY);
    const raw =
      window.localStorage.getItem(scopedKey) ??
      window.localStorage.getItem(`${STORAGE_KEY}:guest`) ??
      window.localStorage.getItem(STORAGE_KEY);

    if (raw && !window.localStorage.getItem(scopedKey)) {
      window.localStorage.setItem(scopedKey, raw);
    }

    return raw ? { ...defaultProgress, ...JSON.parse(raw) } : defaultProgress;
  } catch {
    return defaultProgress;
  }
}

function writeProgress(progress: LocalProgressState) {
  const serialized = JSON.stringify(progress);

  window.localStorage.setItem(authStorageKey(STORAGE_KEY), serialized);
  window.dispatchEvent(new Event("pm-progress-updated"));

  if (getCurrentUser()) {
    fetch("/api/progress", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify({ progress })
    }).catch(() => {
      // Keep the local cache as the source of truth if the network is temporarily unavailable.
    });
  }
}

async function readServerProgress() {
  if (!getCurrentUser()) {
    return null;
  }

  const response = await fetch("/api/progress", {
    credentials: "include"
  });

  if (!response.ok) {
    return null;
  }

  const payload = (await response.json()) as { progress: LocalProgressState | null };
  return payload.progress;
}

async function writeServerProgress(progress: LocalProgressState) {
  if (!getCurrentUser()) {
    return;
  }

  await fetch("/api/progress", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include",
    body: JSON.stringify({ progress })
  });
}

function clampStat(value: number) {
  return Math.max(20, Math.min(99, Math.round(value)));
}

function buildSkillGain(attempt: {
  skill: SkillKey;
  score: number;
  evaluation: Pick<
    EvaluationResult,
    "choiceAlignment" | "reasoningAlignment" | "frameworkCoverage" | "completeness"
  >;
}): Partial<Record<SkillKey, number>> {
  const gain: Partial<Record<SkillKey, number>> = {};

  gain[attempt.skill] = Math.max(3, Math.round(attempt.score / 10));
  gain.strategy = (gain.strategy ?? 0) + Math.round(attempt.evaluation.choiceAlignment / 22);
  gain.communication = (gain.communication ?? 0) + Math.round(attempt.evaluation.reasoningAlignment / 18);
  gain.analytics = (gain.analytics ?? 0) + Math.round(attempt.evaluation.frameworkCoverage / 10);
  gain.execution = (gain.execution ?? 0) + Math.round(attempt.evaluation.completeness / 2);

  return Object.fromEntries(
    Object.entries(gain).filter(([, value]) => Number(value) > 0)
  ) as Partial<Record<SkillKey, number>>;
}

export function skillGainForAttempt(attempt: LocalAttempt) {
  return attempt.skillGain && Object.keys(attempt.skillGain).length
    ? attempt.skillGain
    : buildSkillGain(attempt);
}

export function primarySkillGainForAttempt(attempt: LocalAttempt) {
  const gains = skillGainForAttempt(attempt);
  const skill = attempt.skill;
  const fallback = Object.entries(gains).sort((left, right) => Number(right[1]) - Number(left[1]))[0];

  return {
    skill: (gains[skill] ? skill : fallback?.[0] ?? skill) as SkillKey,
    value: Number(gains[skill] ?? fallback?.[1] ?? 0)
  };
}

export function buildDerivedProfile(progress: LocalProgressState) {
  const base = baseByExperience[progress.experience];
  const values: Record<SkillKey, number> = {
    strategy: base,
    execution: base,
    leadership: base,
    growth: base,
    analytics: base,
    communication: base
  };

  for (const attempt of progress.attempts) {
    const skillGain = skillGainForAttempt(attempt);

    for (const skill of skillOrder) {
      values[skill] += skillGain[skill] ?? 0;
    }
  }

  for (const skill of progress.focusSkills) {
    values[skill] += 2;
  }

  const xp = progress.attempts.reduce((total, attempt) => total + attempt.xp, 0);
  const latestAttempts = [...progress.attempts].reverse();
  const streak = latestAttempts.findIndex((attempt) => attempt.outcome === "retry");
  const activeStreak = streak === -1 ? latestAttempts.length : streak;
  const wins = progress.attempts.filter((attempt) => attempt.outcome === "win").length;
  const retries = progress.attempts.length - wins;
  const level = Math.max(1, Math.floor(xp / 350) + 1);
  const currentRank = getRankForXp(xp);
  const stats = Object.fromEntries(
    skillOrder.map((skill) => [
      skill,
      {
        label: skillLabels[skill],
        value: clampStat(values[skill])
      }
    ])
  ) as Record<SkillKey, { label: string; value: number }>;
  const overallScore = Math.round(
    skillOrder.reduce((total, skill) => total + stats[skill].value, 0) / skillOrder.length
  );

  return {
    name: progress.name || "New PM",
    title: currentRank.title,
    level,
    rank: `${currentRank.label} Track`,
    xp,
    overallScore,
    streak: activeStreak,
    record: { wins, retries },
    stats,
    recentActivity: latestAttempts.slice(0, 3).map((attempt) => ({
      id: attempt.id,
      title: attempt.scenarioTitle,
      score: attempt.score,
      xp: attempt.xp,
      outcome: attempt.outcome
    }))
  };
}

export function isLeaderUnlocked(leaderScenarioIds: string[], progress: LocalProgressState) {
  return progress.attempts.some((attempt) => leaderScenarioIds.includes(attempt.scenarioId));
}

export function useProgress() {
  const [progress, setProgress] = useState<LocalProgressState>(defaultProgress);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function sync() {
      const cached = readProgress();

      if (!isMounted) {
        return;
      }

      setProgress(cached);
      setIsHydrated(true);

      if (!getCurrentUser()) {
        return;
      }

      const serverProgress = await readServerProgress();

      if (!isMounted) {
        return;
      }

      if (serverProgress) {
        window.localStorage.setItem(authStorageKey(STORAGE_KEY), JSON.stringify(serverProgress));
        setProgress({ ...defaultProgress, ...serverProgress });
        return;
      }

      if (cached.onboarded || cached.attempts.length) {
        await writeServerProgress(cached);
      }
    }

    sync();
    window.addEventListener("storage", sync);
    window.addEventListener("pm-auth-updated", sync);
    window.addEventListener("pm-progress-updated", sync);

    return () => {
      isMounted = false;
      window.removeEventListener("storage", sync);
      window.removeEventListener("pm-auth-updated", sync);
      window.removeEventListener("pm-progress-updated", sync);
    };
  }, []);

  const profile = useMemo(() => buildDerivedProfile(progress), [progress]);

  function completeOnboarding(input: OnboardingInput) {
    const next = {
      ...defaultProgress,
      onboarded: true,
      name: input.name.trim() || "New PM",
      experience: input.experience,
      goals: input.goals,
      focusSkills: input.focusSkills,
      practiceTypes: input.practiceTypes,
      preferredStages: input.preferredStages,
      preferredDifficulties: input.preferredDifficulties
    };

    setProgress(next);
    writeProgress(next);
  }

  function recordAttempt(input: {
    scenario: Scenario;
    evaluation: EvaluationResult;
    optionId?: string;
    reasoning?: string;
  }) {
    const xp = xpForScenarioAttempt(input.scenario, input.evaluation);
    const attempt: LocalAttempt = {
      id: `${input.scenario.id}-${Date.now()}`,
      scenarioId: input.scenario.id,
      scenarioSlug: input.scenario.slug,
      scenarioTitle: input.scenario.title,
      selectedOptionId: input.optionId,
      reasoning: input.reasoning?.trim(),
      skill: input.scenario.recommendedSkill,
      score: input.evaluation.score,
      xp,
      outcome: input.evaluation.score >= 60 ? "win" : "retry",
      createdAt: new Date().toISOString(),
      company: input.scenario.company,
      guest: input.scenario.guest,
      skillGain: buildSkillGain({
        skill: input.scenario.recommendedSkill,
        score: input.evaluation.score,
        evaluation: input.evaluation
      }),
      expertChoice: input.evaluation.expertChoice,
      expertQuote: input.evaluation.expertQuote,
      delta: input.evaluation.delta,
      coaching: input.evaluation.coaching,
      evaluation: {
        choiceAlignment: input.evaluation.choiceAlignment,
        reasoningAlignment: input.evaluation.reasoningAlignment,
        frameworkCoverage: input.evaluation.frameworkCoverage,
        completeness: input.evaluation.completeness
      }
    };

    const next = {
      ...progress,
      attempts: [...progress.attempts, attempt]
    };

    setProgress(next);
    writeProgress(next);
  }

  function resetProgress() {
    setProgress(defaultProgress);
    writeProgress(defaultProgress);
  }

  return {
    isHydrated,
    progress,
    profile,
    completeOnboarding,
    recordAttempt,
    resetProgress
  };
}
