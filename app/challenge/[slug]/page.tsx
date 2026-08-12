import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PlayableChallenge } from "@/components/playable-challenge";
import { getPlayers, getScenarioBySlug } from "@/lib/data/repository";

interface ChallengePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: ChallengePageProps): Promise<Metadata> {
  const { slug } = await params;
  const scenario = await getScenarioBySlug(slug);

  if (!scenario) {
    return {
      title: "PM Decision Challenge"
    };
  }

  const title = `${scenario.title} | PM Decision Challenge`;
  const description = `You are the PM at ${scenario.company}. Make the call, defend your reasoning, and compare it with ${scenario.guest}'s real-world approach.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/challenge/${scenario.slug}`
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: `/challenge/${scenario.slug}`
    },
    twitter: {
      card: "summary_large_image",
      title,
      description
    }
  };
}

export default async function ChallengePage({ params }: ChallengePageProps) {
  const { slug } = await params;
  const scenario = await getScenarioBySlug(slug);

  if (!scenario) {
    notFound();
  }

  const players = await getPlayers();
  const player = players.find((candidate) => candidate.name === scenario.guest) ?? null;

  return <PlayableChallenge scenario={scenario} player={player} />;
}
