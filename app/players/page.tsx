import { AppShell } from "@/components/app-shell";
import { PlayerGrid } from "@/components/player-grid";
import { getPlayers, getScenarios } from "@/lib/data/repository";

interface PlayersPageProps {
  searchParams: Promise<{
    page?: string;
  }>;
}

export default async function PlayersPage({ searchParams }: PlayersPageProps) {
  const params = await searchParams;
  const requestedPage = Number(params.page);
  const initialPage = Number.isFinite(requestedPage) && requestedPage > 0 ? Math.floor(requestedPage) : 1;
  const [playerCards, scenarios] = await Promise.all([getPlayers(), getScenarios()]);

  return (
    <AppShell title="Product Leader Cards" compact>
      <PlayerGrid initialPage={initialPage} players={playerCards} scenarios={scenarios} />
    </AppShell>
  );
}
