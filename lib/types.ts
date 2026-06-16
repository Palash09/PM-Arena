export type CompanyStage = "EARLY" | "GROWTH" | "SCALE" | "TURNAROUND";

export type DecisionType =
  | "STRATEGY"
  | "PRIORITIZATION"
  | "TEAM"
  | "LAUNCH"
  | "PRICING"
  | "GROWTH";

export type Difficulty = "ROOKIE" | "PRO" | "WORLD_CLASS" | "LEGENDARY";

export type SkillKey =
  | "strategy"
  | "execution"
  | "leadership"
  | "growth"
  | "analytics"
  | "communication";

export interface SkillStat {
  label: string;
  value: number;
}

export interface RecentActivity {
  id: string;
  title: string;
  score: number;
  outcome: "win" | "retry";
}

export interface PlayerCard {
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
  stats: Record<SkillKey, number>;
}

export interface ScenarioOption {
  id: string;
  label: string;
  title: string;
  summary: string;
  pros: string[];
  tradeoffs: string[];
  frameworkSignals: string[];
  isHistoricalChoice?: boolean;
}

export interface Scenario {
  id: string;
  slug: string;
  title: string;
  company: string;
  guest: string;
  difficulty: Difficulty;
  stage: CompanyStage;
  decisionType: DecisionType;
  recommendedSkill: SkillKey;
  shortPitch: string;
  context: string;
  stakes: string;
  actualOutcome: string;
  expertReasoning: string;
  sourceQuote: string;
  sourceFile: string;
  frameworks: string[];
  options: ScenarioOption[];
}

export interface UserProfile {
  name: string;
  title: string;
  level: number;
  rank: string;
  credibilityScore: number;
  streak: number;
  record: {
    wins: number;
    retries: number;
  };
  focusAreas: string[];
  stats: Record<SkillKey, SkillStat>;
  recentActivity: RecentActivity[];
}

export interface EvaluationResult {
  score: number;
  choiceAlignment: number;
  reasoningAlignment: number;
  frameworkCoverage: number;
  completeness: number;
  verdict: string;
  delta: string[];
  coaching: string[];
  expertChoice: string;
  expertQuote: string;
}
