import type { Metadata } from "next";

import { AppShell } from "@/components/app-shell";
import { CareerClient } from "@/components/career-client";
import { getScenarios } from "@/lib/data/repository";

export const metadata: Metadata = {
  title: "PM Career",
  description: "Track your Product Decision League rating, skills, and scenario progression.",
  alternates: {
    canonical: "/career"
  }
};

export default async function CareerPage() {
  const scenarios = await getScenarios();

  return (
    <AppShell title="Product Decision League Career">
      <CareerClient scenarios={scenarios} />
    </AppShell>
  );
}
