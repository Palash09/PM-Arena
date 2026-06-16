import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { PlayerDetailClient } from "@/components/player-detail-client";
import { getPlayerBySlug, getScenarios } from "@/lib/data/repository";

interface PlayerDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function PlayerDetailPage({ params }: PlayerDetailPageProps) {
  const { slug } = await params;
  const [player, scenarios] = await Promise.all([getPlayerBySlug(slug), getScenarios()]);

  if (!player) {
    notFound();
  }

  return (
    <AppShell title={player.name} compact>
      <Link href="/players" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-300">
        <ArrowLeft className="h-4 w-4" />
        Squad
      </Link>
      <PlayerDetailClient
        player={player}
        scenarios={scenarios}
      />
    </AppShell>
  );
}
