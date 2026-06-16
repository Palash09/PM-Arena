import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { ScenarioPlayClient } from "@/components/scenario-play-client";
import { getScenarioBySlug } from "@/lib/data/repository";

interface ScenarioDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ScenarioDetailPage({ params }: ScenarioDetailPageProps) {
  const { slug } = await params;
  const scenario = await getScenarioBySlug(slug);

  if (!scenario) {
    notFound();
  }

  return (
    <AppShell title="Scenario Detail" compact>
      <Link href="/scenarios" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-300">
        <ArrowLeft className="h-4 w-4" />
        Market
      </Link>
      <ScenarioPlayClient scenario={scenario} />
    </AppShell>
  );
}
