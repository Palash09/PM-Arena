import { Crown, Gem, Medal, Rocket, Shield, Sparkles, Star, Trophy } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface RankConfig {
  label: "Rookie" | "Associate" | "Senior" | "Group" | "Director" | "Principal" | "VP" | "CPO";
  title: string;
  xp: number;
  icon: LucideIcon;
}

export const rankThresholds = [
  { label: "Rookie", title: "Rookie PM", xp: 0, icon: Shield },
  { label: "Associate", title: "Associate PM", xp: 450, icon: Trophy },
  { label: "Senior", title: "Senior PM", xp: 1200, icon: Medal },
  { label: "Group", title: "Group PM", xp: 2400, icon: Gem },
  { label: "Director", title: "Director PM", xp: 4200, icon: Crown },
  { label: "Principal", title: "Principal PM", xp: 6500, icon: Star },
  { label: "VP", title: "VP Product", xp: 9000, icon: Rocket },
  { label: "CPO", title: "Chief Product Officer", xp: 12500, icon: Sparkles }
] satisfies RankConfig[];

export function getRankForXp(xp: number) {
  return [...rankThresholds].reverse().find((rank) => xp >= rank.xp) ?? rankThresholds[0];
}

export function getNextRankForXp(xp: number) {
  return rankThresholds.find((rank) => rank.xp > xp) ?? null;
}

export function rankProgressPercent(xp: number) {
  const currentRank = getRankForXp(xp);
  const nextRank = getNextRankForXp(xp);

  if (!nextRank) {
    return 100;
  }

  const rankSpan = nextRank.xp - currentRank.xp;
  const currentProgress = xp - currentRank.xp;

  return Math.max(0, Math.min(100, (currentProgress / rankSpan) * 100));
}
