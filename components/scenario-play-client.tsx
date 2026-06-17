"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronRight,
  Lightbulb,
  LoaderCircle,
  Lock,
  MessageSquareText,
  RotateCcw,
  Sparkles,
  Target,
  Trophy
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { useProgress, xpForScenarioAttempt } from "@/lib/progress-store";
import { EvaluationResult, Scenario } from "@/lib/types";

interface ScenarioPlayClientProps {
  scenario: Scenario;
}

function scoreTone(score: number) {
  if (score >= 80) {
    return {
      title: "Excellent Decision!",
      accent: "text-mint",
      border: "border-mint/35",
      background: "bg-mint/10"
    };
  }

  if (score >= 60) {
    return {
      title: "Solid Decision",
      accent: "text-cyan",
      border: "border-cyan/35",
      background: "bg-cyan/10"
    };
  }

  return {
    title: "Retry Recommended",
    accent: "text-coral",
    border: "border-coral/35",
    background: "bg-coral/10"
  };
}

export function ScenarioPlayClient({ scenario }: ScenarioPlayClientProps) {
  const { recordAttempt } = useProgress();
  const [selectedOption, setSelectedOption] = useState<string>(scenario.options[0]?.id ?? "");
  const [reasoning, setReasoning] = useState("");
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const selected = useMemo(
    () => scenario.options.find((option) => option.id === selectedOption),
    [scenario.options, selectedOption]
  );

  useEffect(() => {
    if (evaluation) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [evaluation]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const optionId = String(formData.get("optionId") ?? "");
    const answer = String(formData.get("reasoning") ?? "");

    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/game/evaluate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          scenarioId: scenario.id,
          optionId,
          reasoning: answer
        })
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error ?? "We could not score this decision. Try again.");
      }

      const payload = (await response.json()) as EvaluationResult;
      setEvaluation(payload);
      recordAttempt({ scenario, evaluation: payload, optionId, reasoning: answer });
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "We could not score this decision. Check your connection and try again."
      );
    } finally {
      setIsLoading(false);
    }
  }

  if (evaluation) {
    const tone = scoreTone(evaluation.score);
    const scoreBreakdown: { label: string; value: number; icon: LucideIcon; color: string }[] = [
      { label: "Choice", value: evaluation.choiceAlignment, icon: Target, color: "text-mint" },
      {
        label: "Reasoning",
        value: evaluation.reasoningAlignment,
        icon: MessageSquareText,
        color: "text-cyan"
      },
      {
        label: "Framework",
        value: evaluation.frameworkCoverage,
        icon: Lightbulb,
        color: "text-amber-300"
      },
      {
        label: "Completeness",
        value: evaluation.completeness,
        icon: Sparkles,
        color: "text-violet-300"
      }
    ];

    return (
      <section className={`overflow-hidden rounded-lg border ${tone.border} bg-slate-950/80 shadow-card`}>
        <div className="relative px-5 pb-5 pt-7 text-center">
          <div className="absolute inset-x-0 top-0 h-28 bg-[linear-gradient(180deg,rgba(125,255,179,0.18),transparent)]" />
          <div className={`relative mx-auto grid h-16 w-16 place-items-center rounded-lg border ${tone.border} ${tone.background}`}>
            <CheckCircle2 className={`h-10 w-10 ${tone.accent}`} />
          </div>
          <h2 className="relative mt-4 text-2xl font-extrabold text-white">{tone.title}</h2>
          <p className="relative mt-1 text-sm text-slate-300">{evaluation.verdict}</p>
        </div>

        <div className="grid grid-cols-3 gap-px border-y border-white/10 bg-white/10">
          {[
            ["XP Earned", `+${xpForScenarioAttempt(scenario, evaluation)}`],
            ["Streak", evaluation.score >= 60 ? "Live" : "Paused"],
            ["Accuracy", `${evaluation.score}%`]
          ].map(([label, value]) => (
            <div key={label} className="bg-slate-950/90 p-3 text-center">
              <p className={`text-xl font-black ${tone.accent}`}>{value}</p>
              <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.14em] text-slate-400">
                {label}
              </p>
            </div>
          ))}
        </div>

        <div className="space-y-4 p-4">
          <div className="rounded-lg border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-cyan/15 text-sm font-black text-cyan">
                GB
              </div>
              <div>
                <p className="font-bold text-white">{scenario.guest}</p>
                <p className="text-xs text-slate-400">Expert perspective</p>
              </div>
              <span className="ml-auto rounded-md border border-violet-300/25 bg-violet-300/10 px-2 py-1 text-[10px] font-bold text-violet-200">
                EXPERT
              </span>
            </div>
            <p className="mt-4 text-sm font-bold text-amber-300">
              Best approach: {evaluation.expertChoice}
            </p>
            <p className="mt-3 text-sm italic leading-6 text-slate-300">"{evaluation.expertQuote}"</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {scoreBreakdown.map((item) => {
              const Icon = item.icon;

              return (
              <div key={item.label} className="rounded-lg border border-white/10 bg-black/25 p-3">
                <Icon className={`h-4 w-4 ${item.color}`} />
                <p className="mt-3 text-xl font-black text-white">{Math.round(item.value)}</p>
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-slate-400">
                  {item.label}
                </p>
              </div>
            );
            })}
          </div>

          <div className="rounded-lg border border-amber-300/25 bg-amber-300/10 p-4">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-amber-300" />
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-amber-300">
                Framework
              </p>
            </div>
            <p className="mt-2 text-sm font-bold text-white">{scenario.frameworks[0]}</p>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-300">
              {evaluation.delta.slice(0, 2).map((item) => (
                <li key={item}>- {item}</li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setEvaluation(null)}
              className="inline-flex items-center justify-center gap-2 rounded-md border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold text-white"
            >
              <RotateCcw className="h-4 w-4" />
              Review
            </button>
            <a
              href="/report"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-mint px-4 py-3 text-sm font-extrabold text-slate-950"
            >
              Continue
              <ChevronRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>
    );
  }

  return (
    <div className="space-y-4">
      <section className="overflow-hidden rounded-lg border border-white/10 bg-slate-950/75 shadow-card">
        <div className="border-b border-white/10 bg-[linear-gradient(135deg,rgba(157,91,255,0.22),rgba(17,196,112,0.14))] p-4">
          <div className="flex items-center justify-between gap-3">
            <span className="rounded-md border border-violet-300/30 bg-violet-300/10 px-3 py-1 text-[10px] font-extrabold text-violet-200">
              {scenario.difficulty.replace("_", " ")}
            </span>
            <span className="text-sm font-extrabold text-mint">+270 XP</span>
          </div>
          <h2 className="mt-4 text-2xl font-extrabold leading-tight text-white">{scenario.title}</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {[scenario.decisionType, scenario.stage, scenario.company].map((item) => (
              <span
                key={item}
                className="rounded-md border border-white/10 bg-black/25 px-2.5 py-1 text-[11px] font-bold text-slate-200"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-4 p-4">
          <div>
            <div className="flex items-center gap-2">
              <BriefcaseBusiness className="h-4 w-4 text-cyan" />
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-cyan">
                Situation
              </p>
            </div>
            <p className="mt-3 text-base font-semibold leading-7 text-slate-100">{scenario.context}</p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "Stake", value: "High", icon: Target, color: "text-coral" },
              { label: "Skill", value: scenario.recommendedSkill, icon: BarChart3, color: "text-mint" }
            ].map((metric) => {
              const Icon = metric.icon;

              return (
                <div key={metric.label} className="rounded-lg border border-white/10 bg-white/5 p-3">
                  <Icon className={`h-4 w-4 ${metric.color}`} />
                  <p className="mt-3 truncate text-sm font-extrabold text-white">{metric.value}</p>
                  <p className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-slate-300">
                    {metric.label}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="rounded-lg border border-coral/25 bg-coral/10 p-4">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-coral" />
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-coral">
                Key Metrics at Stake
              </p>
            </div>
            <p className="mt-3 text-base font-semibold leading-7 text-slate-100">{scenario.stakes}</p>
          </div>

          <div>
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-slate-300">
              Frameworks in Play
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {scenario.frameworks.map((framework) => (
                <span
                  key={framework}
                  className="rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-200"
                >
                  {framework}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

    <form onSubmit={onSubmit} className="space-y-4">
      <section className="rounded-lg border border-white/10 bg-slate-950/70 p-4 shadow-card">
        <div className="text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-cyan">Decision</p>
          <h2 className="mt-2 text-2xl font-extrabold text-white">What's your decision?</h2>
          <p className="mt-1 text-sm font-semibold text-slate-200">Choose the path you can defend.</p>
        </div>

        <div className="mt-5 space-y-3">
          {scenario.options.map((option) => {
            const isSelected = selectedOption === option.id;
            const accent =
              option.label === "A"
                ? "border-mint/45 bg-mint/10 text-mint"
                : option.label === "B"
                  ? "border-cyan/45 bg-cyan/10 text-cyan"
                  : "border-amber-300/45 bg-amber-300/10 text-amber-300";

            return (
              <label
                key={option.id}
                className={`block cursor-pointer rounded-lg border p-3 transition ${
                  isSelected
                    ? `${accent} shadow-glow`
                    : "border-white/10 bg-white/5 text-slate-300 hover:border-cyan/40"
                }`}
              >
                <input
                  type="radio"
                  name="optionId"
                  value={option.id}
                  checked={isSelected}
                  onChange={() => setSelectedOption(option.id)}
                  className="sr-only"
                />
                <div className="grid grid-cols-[44px_1fr] gap-3">
                  <div className={`grid h-11 w-11 place-items-center rounded-lg border text-lg font-black ${accent}`}>
                    {option.label}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-base font-extrabold text-white">{option.title}</h3>
                      <span className="shrink-0 rounded-md border border-white/10 bg-black/25 px-2 py-1 text-[10px] font-bold text-slate-300">
                        {option.frameworkSignals[0]}
                      </span>
                    </div>
                    <p className="mt-1 text-sm font-semibold leading-5 text-slate-100">{option.summary}</p>
                    <p className="mt-2 text-sm font-semibold leading-5 text-slate-300">
                      {option.tradeoffs[0] ?? "Tradeoff clarity required"}
                    </p>
                  </div>
                </div>
              </label>
            );
          })}
        </div>
      </section>

      <section className="rounded-lg border border-white/10 bg-white/5 p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <MessageSquareText className="h-4 w-4 text-violet-300" />
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-violet-200">
              Reasoning
            </p>
          </div>
          <span className="text-xs font-bold text-slate-300">{reasoning.length}/400</span>
        </div>
        <textarea
          name="reasoning"
          value={reasoning}
          onChange={(event) => setReasoning(event.target.value.slice(0, 400))}
          required
          rows={5}
          placeholder="Name the key factors, tradeoffs, and assumptions behind your choice."
          className="mt-3 w-full resize-none rounded-lg border border-white/10 bg-black/30 px-4 py-3 text-sm font-semibold leading-6 text-white outline-none placeholder:text-slate-400 focus:border-cyan"
        />
      </section>

      <button
        type="submit"
        disabled={isLoading || !selectedOption || !reasoning.trim()}
        className="flex w-full items-center justify-center gap-2 rounded-md bg-blue-500 px-5 py-4 text-sm font-extrabold text-white transition hover:bg-mint hover:text-slate-950 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-300"
      >
        {isLoading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
        Lock In Decision
      </button>

      {errorMessage ? (
        <div
          role="alert"
          className="rounded-lg border border-coral/35 bg-coral/15 px-4 py-3 text-sm font-bold leading-6 text-white"
        >
          {errorMessage}
        </div>
      ) : null}

      {selected ? (
        <p className="text-center text-xs font-bold leading-5 text-slate-300">
          Selected: {selected.title}
        </p>
      ) : null}
    </form>
    </div>
  );
}
