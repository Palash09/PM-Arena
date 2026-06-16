"use client";

import { AppShell } from "@/components/app-shell";
import { HomeClient } from "@/components/home-client";
import { WelcomeScreen } from "@/components/welcome-screen";
import { useAuth } from "@/lib/auth-store";
import { useProgress } from "@/lib/progress-store";
import { Scenario } from "@/lib/types";

interface EntryGateProps {
  scenarios: Scenario[];
}

export function EntryGate({ scenarios }: EntryGateProps) {
  const { user, isHydrated: authHydrated } = useAuth();
  const { progress, isHydrated: progressHydrated } = useProgress();

  if (!authHydrated || !progressHydrated) {
    return (
      <div className="min-h-screen bg-[#030814] text-white">
        <div className="mx-auto min-h-screen w-full max-w-md bg-[#030814] px-5 py-7">
          <div className="h-[calc(100vh-56px)] animate-pulse rounded-lg border border-white/10 bg-white/5" />
        </div>
      </div>
    );
  }

  if (!user && !progress.onboarded && progress.attempts.length === 0) {
    return <WelcomeScreen />;
  }

  return (
    <AppShell title="Home Hub">
      <HomeClient scenarios={scenarios} />
    </AppShell>
  );
}
