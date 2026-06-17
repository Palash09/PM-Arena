"use client";

import { useEffect, useState } from "react";

import { AppShell } from "@/components/app-shell";
import { HomeClient } from "@/components/home-client";
import { WelcomeScreen } from "@/components/welcome-screen";
import { useAuth } from "@/lib/auth-store";
import { useProgress } from "@/lib/progress-store";
import { Scenario } from "@/lib/types";

interface EntryGateProps {
  scenarios: Scenario[];
}

const INTRO_SESSION_KEY = "product-arena-intro-entered-v1";

export function EntryGate({ scenarios }: EntryGateProps) {
  const { user, isHydrated: authHydrated } = useAuth();
  const { progress, isHydrated: progressHydrated } = useProgress();
  const [introHydrated, setIntroHydrated] = useState(false);
  const [hasEnteredArena, setHasEnteredArena] = useState(false);

  useEffect(() => {
    setHasEnteredArena(window.sessionStorage.getItem(INTRO_SESSION_KEY) === "true");
    setIntroHydrated(true);
  }, []);

  function enterArena() {
    window.sessionStorage.setItem(INTRO_SESSION_KEY, "true");
    setHasEnteredArena(true);
  }

  if (!authHydrated || !progressHydrated || !introHydrated) {
    return (
      <div className="min-h-screen bg-[#030814] text-white">
        <div className="mx-auto min-h-screen w-full max-w-md bg-[#030814] px-5 py-7">
          <div className="h-[calc(100vh-56px)] animate-pulse rounded-lg border border-white/10 bg-white/5" />
        </div>
      </div>
    );
  }

  if (!hasEnteredArena) {
    return (
      <WelcomeScreen
        isReturningUser={Boolean(user) || progress.onboarded || progress.attempts.length > 0}
        onEnter={enterArena}
      />
    );
  }

  return (
    <AppShell title="Home Hub">
      <HomeClient scenarios={scenarios} />
    </AppShell>
  );
}
