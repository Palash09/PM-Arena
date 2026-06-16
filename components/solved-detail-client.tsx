"use client";

import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Lightbulb,
  MessageSquareText,
  Sparkles,
  Target
} from "lucide-react";

import {
  primarySkillGainForAttempt,
  skillLabels,
  useProgress
} from "@/lib/progress-store";
import { Scenario } from "@/lib/types";

interface SolvedDetailClientProps {
  attemptId: string;
  scenarios: Scenario[];
}

export function SolvedDetailClient({ attemptId, scenarios }: SolvedDetailClientProps) {
  const { isHydrated, progress } = useProgress();

  if (!isHydrated) {
    return <div className="h-80 animate-pulse rounded-lg border border-white/10 bg-white/5" />;
  }

  const attempt = progress.attempts.find((item) => item.id === attemptId);

  if (!attempt) {
    return (
      <section className="rounded-lg border border-white/10 bg-white/5 p-5 shadow-card backdrop-blur-md">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-coral">
          Result Not Found
        </p>
        <h2 className="mt-2 text-2xl font-extrabold text-white">This solved question is not in your history.</h2>
        <Link
          href="/solved"
          className="mt-5 inline-flex rounded-lg bg-mint px-4 py-3 text-sm font-extrabold text-slate-950"
        >
          Back to Solved Questions
        </Link>
      </section>
    );
  }

  const scenario =
    scenarios.find((item) => item.id === attempt.scenarioId) ??
    scenarios.find((item) => item.slug === attempt.scenarioSlug);
  const selectedOption = scenario?.options.find((option) => option.id === attempt.selectedOptionId);
  const practiced = primarySkillGainForAttempt(attempt);
  const leaderName = attempt.guest ?? scenario?.guest ?? "Product Leader";
  const productName = attempt.company ?? scenario?.company ?? "Product";
  const resultTone =
    attempt.score >= 80
      ? {
          label: "Excellent Decision",
          accent: "text-mint",
          border: "border-mint/35",
          background: "bg-mint/10"
        }
      : attempt.score >= 60
        ? {
            label: "Solid Decision",
            accent: "text-cyan",
            border: "border-cyan/35",
            background: "bg-cyan/10"
          }
        : {
            label: "Retry Recommended",
            accent: "text-coral",
            border: "border-coral/35",
            background: "bg-coral/10"
          };

  return (
    <section className={`overflow-hidden rounded-lg border ${resultTone.border} bg-slate-950/80 shadow-card`}>
      <div className="relative px-5 pb-5 pt-7 text-center">
        <div className="absolute inset-x-0 top-0 h-28 bg-[linear-gradient(180deg,rgba(125,255,179,0.18),transparent)]" />
        <div className={`relative mx-auto grid h-16 w-16 place-items-center rounded-lg border ${resultTone.border} ${resultTone.background}`}>
          <CheckCircle2 className={`h-10 w-10 ${resultTone.accent}`} />
        </div>
        <p className="relative mt-4 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-cyan">
          {leaderName} - {productName}
        </p>
        <h2 className="relative mt-2 text-2xl font-extrabold text-white">{resultTone.label}</h2>
        <p className="relative mt-1 text-sm font-semibold leading-6 text-slate-300">
          {attempt.scenarioTitle}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-px border-y border-white/10 bg-white/10">
        {[
          ["XP Earned", `+${attempt.xp}`],
          [skillLabels[practiced.skill], `+${practiced.value}`],
          ["Accuracy", `${attempt.score}%`]
        ].map(([label, value]) => (
          <div key={label} className="bg-slate-950/90 p-3 text-center">
            <p className={`text-xl font-black ${resultTone.accent}`}>{value}</p>
            <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.14em] text-slate-400">
              {label}
            </p>
          </div>
        ))}
      </div>

      <div className="space-y-4 p-4">
        <article className="rounded-lg border border-mint/25 bg-mint/10 p-4">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-mint" />
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-mint">
              Your Choice
            </p>
          </div>
          <h3 className="mt-3 text-lg font-extrabold text-white">
            {selectedOption ? `${selectedOption.label} - ${selectedOption.title}` : "Selected option unavailable"}
          </h3>
          {selectedOption ? (
            <p className="mt-2 text-sm font-semibold leading-6 text-slate-200">
              {selectedOption.summary}
            </p>
          ) : null}
        </article>

        <article className="rounded-lg border border-cyan/25 bg-cyan/10 p-4">
          <div className="flex items-center gap-2">
            <MessageSquareText className="h-4 w-4 text-cyan" />
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-cyan">
              Your Reasoning
            </p>
          </div>
          <p className="mt-3 whitespace-pre-wrap text-sm font-semibold leading-6 text-white">
            {attempt.reasoning?.trim() || "No written rationale was saved for this earlier attempt."}
          </p>
        </article>

        <article className="rounded-lg border border-amber-300/25 bg-amber-300/10 p-4">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-amber-300" />
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-amber-300">
              Expert Feedback
            </p>
          </div>
          <p className="mt-3 text-sm font-bold text-white">
            Best approach: {attempt.expertChoice ?? "Expert approach unavailable"}
          </p>
          {attempt.expertQuote ? (
            <p className="mt-3 text-sm italic leading-6 text-slate-200">"{attempt.expertQuote}"</p>
          ) : null}
          {attempt.delta?.length ? (
            <ul className="mt-3 space-y-2 text-sm font-semibold leading-6 text-slate-200">
              {attempt.delta.slice(0, 2).map((item) => (
                <li key={item}>- {item}</li>
              ))}
            </ul>
          ) : null}
        </article>

        <div className="grid grid-cols-2 gap-3">
          {[
            ["Choice", attempt.evaluation.choiceAlignment, Target, "text-mint"],
            ["Reasoning", attempt.evaluation.reasoningAlignment, MessageSquareText, "text-cyan"],
            ["Framework", attempt.evaluation.frameworkCoverage, Lightbulb, "text-amber-300"],
            ["Complete", attempt.evaluation.completeness, Sparkles, "text-violet-300"]
          ].map(([label, value, Icon, color]) => {
            const MetricIcon = Icon as typeof Target;

            return (
              <div key={String(label)} className="rounded-lg border border-white/10 bg-black/25 p-3">
                <MetricIcon className={`h-4 w-4 ${color}`} />
                <p className="mt-3 text-xl font-black text-white">{Math.round(Number(value))}</p>
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-slate-400">
                  {String(label)}
                </p>
              </div>
            );
          })}
        </div>

        <Link
          href="/solved"
          className="flex min-h-12 items-center justify-center gap-2 rounded-md bg-mint px-4 py-3 text-sm font-extrabold text-slate-950"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Solved Questions
        </Link>
      </div>
    </section>
  );
}
