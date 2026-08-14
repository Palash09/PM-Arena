export const flagshipChallengeSlugs = [
  "linkedin-feed-purpose",
  "rippling-understaffed-focus",
  "lovable-growth-reinvention"
] as const;

export type FlagshipChallengeSlug = (typeof flagshipChallengeSlugs)[number];

export function isFlagshipChallenge(slug: string): slug is FlagshipChallengeSlug {
  return flagshipChallengeSlugs.includes(slug as FlagshipChallengeSlug);
}

export const flagshipChallengeDetails = [
  {
    slug: "linkedin-feed-purpose",
    lane: "Strategy",
    guest: "Tomer Cohen",
    company: "LinkedIn"
  },
  {
    slug: "rippling-understaffed-focus",
    lane: "Prioritization",
    guest: "Matt MacInnis",
    company: "Rippling"
  },
  {
    slug: "lovable-growth-reinvention",
    lane: "Growth",
    guest: "Elena Verna",
    company: "Lovable"
  }
] as const;
