import { EntryGate } from "@/components/entry-gate";
import { getScenarios } from "@/lib/data/repository";

export default async function HomePage() {
  const scenarios = await getScenarios();

  return <EntryGate scenarios={scenarios} />;
}
