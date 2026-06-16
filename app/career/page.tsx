import { AppShell } from "@/components/app-shell";
import { CareerClient } from "@/components/career-client";
import { getScenarios } from "@/lib/data/repository";

export default async function CareerPage() {
  const scenarios = await getScenarios();

  return (
    <AppShell title="Career Arena">
      <CareerClient scenarios={scenarios} />
    </AppShell>
  );
}
