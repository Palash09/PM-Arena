"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

import { skillLabels, skillOrder, useProgress } from "@/lib/progress-store";
import { CompanyStage, DecisionType, Difficulty, SkillKey } from "@/lib/types";

const goals = [
  "Sharpen strategy calls",
  "Practice stakeholder tradeoffs",
  "Build data-backed judgment",
  "Prepare for senior PM scope"
];

const practiceOptions: { label: string; value: DecisionType }[] = [
  { label: "Strategy calls", value: "STRATEGY" },
  { label: "Prioritization", value: "PRIORITIZATION" },
  { label: "Team alignment", value: "TEAM" },
  { label: "Launch decisions", value: "LAUNCH" },
  { label: "Pricing choices", value: "PRICING" },
  { label: "Growth loops", value: "GROWTH" }
];

const stageOptions: { label: string; value: CompanyStage }[] = [
  { label: "Early stage", value: "EARLY" },
  { label: "Growth stage", value: "GROWTH" },
  { label: "Scale stage", value: "SCALE" },
  { label: "Turnaround", value: "TURNAROUND" }
];

const difficultyOptions: { label: string; value: Difficulty }[] = [
  { label: "Rookie", value: "ROOKIE" },
  { label: "Pro", value: "PRO" },
  { label: "World Class", value: "WORLD_CLASS" },
  { label: "Legendary", value: "LEGENDARY" }
];

export function OnboardingScreen() {
  const { progress, completeOnboarding } = useProgress();
  const [name, setName] = useState("");
  const [experience, setExperience] = useState<"new" | "associate" | "senior">("new");
  const [selectedGoals, setSelectedGoals] = useState<string[]>([goals[0]]);
  const [focusSkills, setFocusSkills] = useState<SkillKey[]>(["strategy", "communication"]);
  const [practiceTypes, setPracticeTypes] = useState<DecisionType[]>([]);
  const [preferredStages, setPreferredStages] = useState<CompanyStage[]>([]);
  const [preferredDifficulties, setPreferredDifficulties] = useState<Difficulty[]>([]);

  function toggleGoal(goal: string) {
    setSelectedGoals((current) =>
      current.includes(goal) ? current.filter((item) => item !== goal) : [...current, goal]
    );
  }

  function toggleSkill(skill: SkillKey) {
    setFocusSkills((current) =>
      current.includes(skill) ? current.filter((item) => item !== skill) : [...current, skill]
    );
  }

  function toggleItem<T extends string>(item: T, setter: (next: (current: T[]) => T[]) => void) {
    setter((current) =>
      current.includes(item) ? current.filter((entry) => entry !== item) : [...current, item]
    );
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    completeOnboarding({
      name,
      experience,
      goals: selectedGoals,
      focusSkills,
      practiceTypes,
      preferredStages,
      preferredDifficulties
    });
  }

  if (progress.onboarded) {
    return (
      <section className="rounded-lg border border-white/10 bg-slate-950/75 p-5 shadow-card backdrop-blur-xl">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mint">
          Profile Ready
        </p>
        <h2 className="mt-2 text-2xl font-extrabold text-white">Your PM career is set up.</h2>
        <p className="mt-3 text-sm leading-6 text-slate-300">
          Head back to the hub to start your first decision match.
        </p>
        <Link
          href="/"
          className="mt-5 inline-flex items-center gap-2 rounded-lg bg-mint px-4 py-3 text-sm font-extrabold text-slate-950"
        >
          Go to Hub
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <section className="rounded-lg border border-white/10 bg-slate-950/75 p-5 shadow-card backdrop-blur-xl">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mint">
          First Match Setup
        </p>
        <h2 className="mt-2 text-3xl font-extrabold leading-tight text-white">
          Build your PM career profile.
        </h2>
        <p className="mt-3 text-sm leading-6 text-slate-300">
          Start at Level 1 with no preloaded progress. Your decisions will create your ratings,
          unlocks, streak, and report.
        </p>

        <label className="mt-5 block">
          <span className="text-sm font-bold text-white">Name</span>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Your name"
            className="mt-2 w-full rounded-lg border border-white/10 bg-black/35 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-mint"
          />
        </label>
      </section>

      <section className="rounded-lg border border-white/10 bg-white/5 p-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-cyan">
          Experience Level
        </p>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {[
            ["new", "New PM"],
            ["associate", "Associate"],
            ["senior", "Senior"]
          ].map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setExperience(value as typeof experience)}
              className={`rounded-lg border px-2 py-3 text-xs font-extrabold ${
                experience === value
                  ? "border-mint bg-mint text-slate-950"
                  : "border-white/10 bg-black/25 text-slate-300"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-white/10 bg-white/5 p-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-violet-200">
          Goals
        </p>
        <div className="mt-3 grid gap-2">
          {goals.map((goal) => {
            const active = selectedGoals.includes(goal);

            return (
              <button
                key={goal}
                type="button"
                onClick={() => toggleGoal(goal)}
                className={`flex items-center justify-between rounded-lg border px-3 py-3 text-left text-sm font-bold ${
                  active
                    ? "border-mint/35 bg-mint/10 text-white"
                    : "border-white/10 bg-black/25 text-slate-300"
                }`}
              >
                {goal}
                {active ? <CheckCircle2 className="h-4 w-4 text-mint" /> : null}
              </button>
            );
          })}
        </div>
      </section>

      <section className="rounded-lg border border-white/10 bg-white/5 p-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-amber-300">
          Focus Competencies
        </p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {skillOrder.map((skill) => {
            const active = focusSkills.includes(skill);

            return (
              <button
                key={skill}
                type="button"
                onClick={() => toggleSkill(skill)}
                className={`rounded-lg border px-3 py-3 text-left text-xs font-extrabold ${
                  active
                    ? "border-amber-300/40 bg-amber-300/10 text-white"
                    : "border-white/10 bg-black/25 text-slate-300"
                }`}
              >
                {skillLabels[skill]}
              </button>
            );
          })}
        </div>
      </section>

      <section className="rounded-lg border border-white/10 bg-white/5 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-mint">
              Practice Preferences
            </p>
            <h3 className="mt-1 text-lg font-extrabold text-white">Personalize recommendations</h3>
          </div>
          <button
            type="button"
            onClick={() => {
              setPracticeTypes([]);
              setPreferredStages([]);
              setPreferredDifficulties([]);
            }}
            className="shrink-0 text-sm font-bold text-cyan"
          >
            Skip
          </button>
        </div>

        <div className="mt-4 space-y-4">
          <div>
            <p className="text-sm font-black text-slate-100">What decisions do you want to practice?</p>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {practiceOptions.map((option) => {
                const active = practiceTypes.includes(option.value);

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => toggleItem(option.value, setPracticeTypes)}
                    className={`rounded-lg border px-3 py-3 text-left text-xs font-extrabold ${
                      active
                        ? "border-mint/40 bg-mint/10 text-white"
                        : "border-white/10 bg-black/25 text-slate-300"
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className="text-sm font-black text-slate-100">Company context</p>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {stageOptions.map((option) => {
                const active = preferredStages.includes(option.value);

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => toggleItem(option.value, setPreferredStages)}
                    className={`rounded-lg border px-3 py-3 text-left text-xs font-extrabold ${
                      active
                        ? "border-cyan/40 bg-cyan/10 text-white"
                        : "border-white/10 bg-black/25 text-slate-300"
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className="text-sm font-black text-slate-100">Challenge level</p>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {difficultyOptions.map((option) => {
                const active = preferredDifficulties.includes(option.value);

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => toggleItem(option.value, setPreferredDifficulties)}
                    className={`rounded-lg border px-3 py-3 text-left text-xs font-extrabold ${
                      active
                        ? "border-amber-300/40 bg-amber-300/10 text-white"
                        : "border-white/10 bg-black/25 text-slate-300"
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <button
        type="submit"
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-mint px-5 py-4 text-sm font-extrabold text-slate-950"
      >
        Enter the Arena
        <ArrowRight className="h-4 w-4" />
      </button>
    </form>
  );
}
