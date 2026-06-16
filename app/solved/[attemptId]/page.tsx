import { AppShell } from "@/components/app-shell";
import { SolvedDetailClient } from "@/components/solved-detail-client";
import { getScenarios } from "@/lib/data/repository";

interface SolvedDetailPageProps {
  params: Promise<{
    attemptId: string;
  }>;
}

export default async function SolvedDetailPage({ params }: SolvedDetailPageProps) {
  const { attemptId } = await params;
  const scenarios = await getScenarios();

  return (
    <AppShell title="Solved Result" compact>
      <SolvedDetailClient attemptId={decodeURIComponent(attemptId)} scenarios={scenarios} />
    </AppShell>
  );
}
