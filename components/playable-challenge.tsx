"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  ChevronRight,
  Clock3,
  Copy,
  LoaderCircle,
  LockKeyhole,
  Share2,
  ShieldCheck,
  Sparkles,
  Swords,
  Target,
  Trophy
} from "lucide-react";

import {
  CampaignAttribution,
  getAnonymousId,
  getCampaignAttribution,
  trackAnalyticsEvent
} from "@/lib/client-analytics";
import { LegalFooter } from "@/components/legal-footer";
import { useProgress, xpForScenarioAttempt } from "@/lib/progress-store";
import { EvaluationResult, PlayerCard, Scenario } from "@/lib/types";

interface PlayableChallengeProps {
  scenario: Scenario;
  player: PlayerCard | null;
}

function scoreBand(score: number) {
  if (score >= 80) return "elite";
  if (score >= 60) return "strong";
  return "developing";
}

function optionTone(label: string, selected: boolean) {
  if (!selected) {
    return "border-white/10 bg-white/[0.045] hover:border-cyan/50 hover:bg-white/[0.075]";
  }

  if (label === "A") return "border-mint bg-mint/10 shadow-[0_0_32px_rgba(125,255,179,0.14)]";
  if (label === "B") return "border-cyan bg-cyan/10 shadow-[0_0_32px_rgba(109,211,255,0.14)]";
  return "border-amber-300 bg-amber-300/10 shadow-[0_0_32px_rgba(252,211,77,0.14)]";
}

function initialsFor(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export function PlayableChallenge({ scenario, player }: PlayableChallengeProps) {
  const { recordAttempt } = useProgress();
  const [selectedOptionId, setSelectedOptionId] = useState("");
  const [reasoning, setReasoning] = useState("");
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [shareState, setShareState] = useState<"idle" | "copied" | "shared">("idle");
  const startedRef = useRef(false);
  const attributionRef = useRef<CampaignAttribution>({});

  const selectedOption = scenario.options.find((option) => option.id === selectedOptionId);

  useEffect(() => {
    attributionRef.current = getCampaignAttribution();
    void trackAnalyticsEvent("challenge_view", {
      metadata: {
        scenarioId: scenario.id,
        scenarioSlug: scenario.slug,
        company: scenario.company,
        guest: scenario.guest,
        ...attributionRef.current
      }
    });
  }, [scenario.company, scenario.guest, scenario.id, scenario.slug]);

  function chooseOption(optionId: string, optionLabel: string) {
    setSelectedOptionId(optionId);

    if (!startedRef.current) {
      startedRef.current = true;
      void trackAnalyticsEvent("challenge_started", {
        metadata: {
          scenarioId: scenario.id,
          scenarioSlug: scenario.slug,
          optionLabel,
          ...attributionRef.current
        }
      });
    }
  }

  async function submitDecision(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedOption) {
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    const submittedReasoning =
      reasoning.trim() ||
      `I chose ${selectedOption.title} because ${selectedOption.summary}`;

    try {
      const response = await fetch("/api/game/evaluate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          scenarioId: scenario.id,
          optionId: selectedOption.id,
          reasoning: submittedReasoning,
          anonymousId: getAnonymousId()
        })
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error ?? "The decision could not be scored.");
      }

      const result = (await response.json()) as EvaluationResult;
      setEvaluation(result);
      recordAttempt({
        scenario,
        evaluation: result,
        optionId: selectedOption.id,
        reasoning: submittedReasoning
      });
      void trackAnalyticsEvent("challenge_completed", {
        metadata: {
          scenarioId: scenario.id,
          scenarioSlug: scenario.slug,
          optionLabel: selectedOption.label,
          score: result.score,
          scoreBand: scoreBand(result.score),
          usedCustomReasoning: Boolean(reasoning.trim()),
          ...attributionRef.current
        }
      });
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "The decision could not be scored. Try again."
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function shareChallenge() {
    if (!evaluation) return;

    const url = new URL(`/challenge/${scenario.slug}`, window.location.origin);
    url.searchParams.set("utm_source", "share");
    url.searchParams.set("utm_medium", "challenge");
    url.searchParams.set("utm_campaign", scenario.slug);
    url.searchParams.set("utm_content", `result_${scoreBand(evaluation.score)}`);

    const shareData = {
      title: `${scenario.title} | Product Decision League`,
      text: `I scored ${evaluation.score}/100 on the ${scenario.company} product decision. What would you do?`,
      url: url.toString()
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        setShareState("shared");
        void trackAnalyticsEvent("challenge_shared", {
          metadata: {
            scenarioId: scenario.id,
            scenarioSlug: scenario.slug,
            scoreBand: scoreBand(evaluation.score),
            method: "native"
          }
        });
        return;
      }

      await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
      setShareState("copied");
      void trackAnalyticsEvent("challenge_shared", {
        metadata: {
          scenarioId: scenario.id,
          scenarioSlug: scenario.slug,
          scoreBand: scoreBand(evaluation.score),
          method: "clipboard"
        }
      });
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }

      setErrorMessage("Copy the page URL to share this challenge.");
    }
  }

  function trackLeagueCta(location: string, destination: string) {
    void trackAnalyticsEvent("challenge_cta_clicked", {
      metadata: {
        scenarioId: scenario.id,
        scenarioSlug: scenario.slug,
        leaderSlug: player?.slug,
        location,
        destination,
        ...attributionRef.current
      }
    });
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#020713] text-white">
      <div className="pointer-events-none fixed inset-y-0 left-1/2 w-full max-w-md -translate-x-1/2 bg-[url('/product-decision-league-background.png')] bg-cover bg-center" />
      <div className="pointer-events-none fixed inset-y-0 left-1/2 w-full max-w-md -translate-x-1/2 bg-[linear-gradient(180deg,rgba(3,8,20,0.28)_0%,rgba(3,8,20,0.52)_30%,rgba(3,8,20,0.82)_62%,rgba(3,8,20,0.98)_100%)]" />
      <div className="pointer-events-none fixed inset-y-0 left-1/2 w-full max-w-md -translate-x-1/2 bg-[radial-gradient(circle_at_50%_8%,rgba(255,138,102,0.18),transparent_24%),radial-gradient(circle_at_15%_68%,rgba(125,255,179,0.16),transparent_28%)]" />
      <div className="pointer-events-none fixed inset-y-0 left-1/2 w-full max-w-md -translate-x-1/2 bg-hub-grid bg-[size:30px_30px] opacity-[0.07]" />

      <div className="relative mx-auto min-h-screen w-full max-w-md px-4 pb-10 pt-[max(20px,env(safe-area-inset-top))] sm:px-5">
        <header className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
          <Link href="/" className="group flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-lg border border-mint/35 bg-mint/10">
              <Swords className="h-5 w-5 text-mint" />
            </span>
            <span>
              <span className="block text-[12px] font-black uppercase tracking-[0.06em]">Product Decision League</span>
              <span className="block font-mono text-[9px] uppercase tracking-[0.2em] text-slate-400">
                Playable PM challenge
              </span>
            </span>
          </Link>
          <span className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.16em] text-slate-300">
            No login
          </span>
        </header>

        {!evaluation ? (
          <>
            <section className="relative mt-5 overflow-hidden rounded-xl border border-amber-300/35 bg-[#07101f]/85 shadow-[0_24px_80px_rgba(0,0,0,0.52)] backdrop-blur-xl">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_20%,rgba(251,191,36,0.22),transparent_38%),linear-gradient(135deg,rgba(255,138,102,0.13),transparent_58%)]" />
              <div className="relative grid min-h-[218px] grid-cols-[minmax(0,1fr)_126px] gap-2 p-4 pb-0">
                <div className="pb-4">
                  <p className="font-mono text-[9px] font-black uppercase tracking-[0.22em] text-amber-300">
                    Featured product leader
                  </p>
                  <h2 className="mt-3 text-[27px] font-black leading-[0.95] tracking-[-0.035em] text-white">
                    {scenario.guest}
                  </h2>
                  <p className="mt-2 text-xs font-bold uppercase tracking-[0.08em] text-slate-300">
                    {player?.role ?? "Product leader"}
                  </p>
                  <div className="mt-4 inline-flex items-center gap-2 rounded-md border border-white/10 bg-black/30 px-2.5 py-2">
                    <span className="text-2xl font-black leading-none text-amber-300">
                      {player?.rating ?? "PL"}
                    </span>
                    <span className="font-mono text-[8px] font-bold uppercase leading-3 tracking-[0.14em] text-slate-300">
                      Leader<br />rating
                    </span>
                  </div>
                  <p className="mt-4 max-w-[190px] text-[11px] font-semibold leading-4 text-slate-300">
                    This challenge reconstructs a real decision from {scenario.guest}&apos;s experience at {scenario.company}.
                  </p>
                </div>

                <div className="relative self-end">
                  <div className="relative mx-auto aspect-[286/499] w-full overflow-hidden rounded-t-xl">
                    {player ? (
                      <Image
                        src={`/leaders/${player.slug}.png`}
                        alt={`${player.name} Product Decision League leader card`}
                        fill
                        sizes="126px"
                        className="object-contain object-bottom drop-shadow-[0_12px_25px_rgba(0,0,0,0.6)]"
                        priority
                      />
                    ) : (
                      <div className="grid h-full place-items-center rounded-t-xl border border-white/10 bg-gradient-to-b from-amber-300/20 to-black/50">
                        <span className="text-3xl font-black text-white">{initialsFor(scenario.guest)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="relative flex items-center justify-between border-t border-white/10 bg-black/35 px-4 py-2.5">
                <span className="font-mono text-[8px] font-bold uppercase tracking-[0.18em] text-slate-400">
                  Signature move
                </span>
                <span className="text-right text-[11px] font-black text-mint">
                  {player?.signatureMove ?? scenario.frameworks[0]}
                </span>
              </div>
            </section>

            <section className="pb-5 pt-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-md border border-coral/30 bg-coral/10 px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-coral">
                  You make the call
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-300">
                  <Clock3 className="h-3.5 w-3.5 text-cyan" /> 2 minute challenge
                </span>
              </div>

              <p className="mt-5 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-cyan">
                {scenario.company} / {scenario.decisionType.replace("_", " ")}
              </p>
              <h1 className="mt-3 text-[34px] font-black leading-[0.98] tracking-[-0.04em] text-white sm:text-[42px]">
                {scenario.title}
              </h1>
              <p className="mt-4 text-base font-semibold leading-7 text-slate-200">
                {scenario.shortPitch}
              </p>
            </section>

            <section className="overflow-hidden rounded-xl border border-white/10 bg-slate-950/70 shadow-card backdrop-blur-xl">
              <div className="border-b border-white/10 bg-[linear-gradient(135deg,rgba(109,211,255,0.14),rgba(125,255,179,0.05))] p-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-cyan" />
                  <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-cyan">
                    The briefing
                  </p>
                </div>
                <p className="mt-3 text-[15px] font-semibold leading-7 text-slate-100">
                  {scenario.context}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-px bg-white/10">
                <div className="bg-[#07101f] p-3.5">
                  <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-slate-400">Pressure</p>
                  <p className="mt-1 text-sm font-black text-coral">HIGH STAKES</p>
                </div>
                <div className="bg-[#07101f] p-3.5">
                  <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-slate-400">Skill tested</p>
                  <p className="mt-1 text-sm font-black uppercase text-mint">{scenario.recommendedSkill}</p>
                </div>
              </div>
            </section>

            <form onSubmit={submitDecision} className="mt-5 space-y-4">
              <section>
                <div className="mb-3 flex items-end justify-between gap-3">
                  <div>
                    <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-amber-300">
                      Decision point
                    </p>
                    <h2 className="mt-1 text-xl font-black">What would you do?</h2>
                  </div>
                  <span className="text-xs font-semibold text-slate-400">Pick one</span>
                </div>

                <div className="space-y-2.5">
                  {scenario.options.map((option) => {
                    const isSelected = option.id === selectedOptionId;

                    return (
                      <label
                        key={option.id}
                        className={`block cursor-pointer rounded-xl border p-3.5 transition ${optionTone(option.label, isSelected)}`}
                      >
                        <input
                          type="radio"
                          name="optionId"
                          value={option.id}
                          checked={isSelected}
                          onChange={() => chooseOption(option.id, option.label)}
                          className="sr-only"
                        />
                        <div className="grid grid-cols-[42px_1fr_auto] items-start gap-3">
                          <span className="grid h-10 w-10 place-items-center rounded-lg border border-white/15 bg-black/25 text-base font-black">
                            {option.label}
                          </span>
                          <span>
                            <span className="block text-sm font-black leading-5 text-white">{option.title}</span>
                            <span className="mt-1 block text-xs font-semibold leading-5 text-slate-300">
                              {option.summary}
                            </span>
                          </span>
                          <span className={`mt-2 h-4 w-4 rounded-full border ${isSelected ? "border-mint bg-mint" : "border-white/30"}`} />
                        </div>
                      </label>
                    );
                  })}
                </div>
              </section>

              <section className="rounded-xl border border-white/10 bg-white/[0.045] p-4">
                <div className="flex items-center justify-between gap-3">
                  <label htmlFor="challenge-reasoning" className="text-sm font-black text-white">
                    Defend your call <span className="font-semibold text-slate-400">(optional)</span>
                  </label>
                  <span className="font-mono text-[9px] text-slate-400">{reasoning.length}/220</span>
                </div>
                <textarea
                  id="challenge-reasoning"
                  value={reasoning}
                  onChange={(event) => setReasoning(event.target.value.slice(0, 220))}
                  rows={3}
                  placeholder="One sentence: what is the key tradeoff?"
                  className="mt-3 w-full resize-none rounded-lg border border-white/10 bg-black/30 px-3.5 py-3 text-sm font-semibold leading-6 text-white outline-none placeholder:text-slate-500 focus:border-cyan"
                />
              </section>

              <button
                type="submit"
                disabled={!selectedOption || isLoading}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-mint px-5 py-4 text-sm font-black uppercase tracking-[0.08em] text-[#03110a] transition hover:bg-white disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
              >
                {isLoading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <LockKeyhole className="h-4 w-4" />}
                Lock decision and reveal
              </button>

              {errorMessage ? (
                <p className="rounded-lg border border-coral/30 bg-coral/10 px-4 py-3 text-sm font-bold text-coral">
                  {errorMessage}
                </p>
              ) : null}
            </form>
          </>
        ) : (
          <section className="pb-4 pt-7">
            <div className="overflow-hidden rounded-xl border border-mint/30 bg-slate-950/75 shadow-[0_24px_90px_rgba(0,0,0,0.55)] backdrop-blur-xl">
              <div className="relative overflow-hidden border-b border-white/10 px-5 pb-6 pt-7 text-center">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(125,255,179,0.22),transparent_58%)]" />
                <div className="relative mx-auto grid h-14 w-14 place-items-center rounded-xl border border-mint/35 bg-mint/10">
                  <Target className="h-7 w-7 text-mint" />
                </div>
                <p className="relative mt-4 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-mint">
                  Decision scored
                </p>
                <div className="relative mt-2 flex items-end justify-center gap-1">
                  <span className="text-6xl font-black leading-none tracking-[-0.07em] text-white">{evaluation.score}</span>
                  <span className="mb-1 text-lg font-black text-slate-400">/100</span>
                </div>
                <p className="relative mx-auto mt-4 max-w-md text-sm font-semibold leading-6 text-slate-200">
                  {evaluation.verdict}
                </p>
              </div>

              <div className="space-y-4 p-4">
                <div className="rounded-xl border border-amber-300/25 bg-amber-300/10 p-4">
                  <div className="grid grid-cols-[64px_1fr] items-center gap-3">
                    <div className="relative aspect-[286/499] w-16 overflow-hidden rounded-md border border-amber-300/25 bg-black/35">
                      {player ? (
                        <Image
                          src={`/leaders/${player.slug}.png`}
                          alt=""
                          fill
                          sizes="64px"
                          className="object-contain"
                        />
                      ) : (
                        <span className="grid h-full place-items-center text-sm font-black text-amber-300">
                          {initialsFor(scenario.guest)}
                        </span>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-amber-300" />
                        <p className="font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-amber-300">
                          Real-world reveal
                        </p>
                      </div>
                      <p className="mt-2 text-sm font-black text-white">{scenario.guest}</p>
                      <p className="text-[11px] font-bold text-slate-400">{scenario.company} product decision</p>
                    </div>
                  </div>
                  <p className="mt-3 text-base font-black text-white">{evaluation.expertChoice}</p>
                  <p className="mt-2 text-sm italic leading-6 text-slate-300">"{evaluation.expertQuote}"</p>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    ["Choice", evaluation.choiceAlignment, "40"],
                    ["Reasoning", evaluation.reasoningAlignment, "30"],
                    ["Framework", evaluation.frameworkCoverage, "20"],
                    ["Completeness", evaluation.completeness, "10"]
                  ].map(([label, value, max]) => (
                    <div key={label} className="rounded-lg border border-white/10 bg-white/5 p-3">
                      <p className="text-xl font-black text-white">{Math.round(Number(value))}<span className="text-xs text-slate-500">/{max}</span></p>
                      <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.14em] text-slate-400">{label}</p>
                    </div>
                  ))}
                </div>

                <div className="rounded-xl border border-cyan/25 bg-cyan/10 p-4">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-cyan" />
                    <p className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-cyan">Your coaching delta</p>
                  </div>
                  <p className="mt-3 text-sm font-semibold leading-6 text-slate-100">
                    {evaluation.delta[0] ?? evaluation.coaching[0]}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={shareChallenge}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-white px-5 py-4 text-sm font-black text-slate-950 transition hover:bg-mint"
                >
                  {shareState === "idle" ? <Share2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {shareState === "shared" ? "Challenge shared" : shareState === "copied" ? "Challenge link copied" : "Challenge another PM"}
                </button>

                <div className="overflow-hidden rounded-xl border border-mint/30 bg-[linear-gradient(135deg,rgba(125,255,179,0.16),rgba(109,211,255,0.08))]">
                  <div className="p-4">
                    <div className="flex items-center gap-2">
                      <Trophy className="h-4 w-4 text-mint" />
                      <p className="font-mono text-[9px] font-black uppercase tracking-[0.18em] text-mint">
                        Reward unlocked
                      </p>
                    </div>
                    <h3 className="mt-2 text-lg font-black text-white">
                      {player ? `${player.name} is now in your squad` : "Your PM career has started"}
                    </h3>
                    <p className="mt-1.5 text-xs font-semibold leading-5 text-slate-300">
                      This decision is saved locally with +{xpForScenarioAttempt(scenario, evaluation)} XP. Open Product Decision League to inspect the leader card, your coaching recall, and the next scenario.
                    </p>
                  </div>
                  <Link
                    href={
                      player
                        ? `/players/${player.slug}?utm_source=challenge&utm_medium=leader_unlock&utm_campaign=${scenario.slug}`
                        : `/scenarios?utm_source=challenge&utm_medium=product&utm_campaign=${scenario.slug}`
                    }
                    onClick={() =>
                      trackLeagueCta(
                        "reward_unlock",
                        player ? `/players/${player.slug}` : "/scenarios"
                      )
                    }
                    className="flex w-full items-center justify-between border-t border-mint/20 bg-mint px-4 py-3.5 text-sm font-black text-[#03110a] transition hover:bg-white"
                  >
                    {player ? `Open ${player.name}'s leader card` : "Enter Product Decision League"}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>

                <Link
                  href={`/scenarios?utm_source=challenge&utm_medium=market&utm_campaign=${scenario.slug}`}
                  onClick={() => trackLeagueCta("scenario_market", "/scenarios")}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-xs font-black text-slate-200"
                >
                  Browse more real-world decisions <ChevronRight className="h-3.5 w-3.5" />
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    setEvaluation(null);
                    setSelectedOptionId("");
                    setReasoning("");
                    setShareState("idle");
                  }}
                  className="flex w-full items-center justify-center gap-1 text-xs font-bold text-slate-400 hover:text-white"
                >
                  Review the decision <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </section>
        )}

        <footer className="mt-8 border-t border-white/10 py-5 text-center">
          <p className="text-xs font-semibold leading-5 text-slate-500">
            Based on a real product leadership conversation. Short excerpts are attributed to the featured guest.
          </p>
          <LegalFooter compact />
        </footer>
      </div>
    </main>
  );
}
