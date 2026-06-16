import { AppShell } from "@/components/app-shell";
import { SolvedClient } from "@/components/solved-client";
import { getScenarios } from "@/lib/data/repository";

export default async function SolvedPage() {
  const scenarios = await getScenarios();

  return (
    <AppShell title="Solved Questions" compact>
      <SolvedClient scenarios={scenarios} />
    </AppShell>
  );
}
