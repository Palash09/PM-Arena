"use client";

import Link from "next/link";
import { AlertTriangle, Crown, LineChart, ShieldCheck, Sparkles } from "lucide-react";

import { skillGainForAttempt, skillOrder, useProgress } from "@/lib/progress-store";
import { SkillKey } from "@/lib/types";

const statCodes: Record<SkillKey, string> = {
  strategy: "STR",
  execution: "EXE",
  leadership: "LEA",
  growth: "GRO",
  analytics: "ANA",
  communication: "COM"
};

export function ReportClient() {
  const { isHydrated, progress, profile } = useProgress();

  if (!isHydrated) {
    return <div className="h-80 animate-pulse rounded-lg border border-white/10 bg-white/5" />;
  }

  const values = skillOrder.map((skill) => profile.stats[skill].value);
  const latestSkillGain = progress.attempts.length ? skillGainForAttempt(progress.attempts.at(-1)!) : {};
  const average = Math.round(values.reduce((total, value) => total + value, 0) / values.length);
  const topSkill = skillOrder.reduce((best, skill) =>
    profile.stats[skill].value > profile.stats[best].value ? skill : best
  );
  const weakSkill = skillOrder.reduce((weakest, skill) =>
    profile.stats[skill].value < profile.stats[weakest].value ? skill : weakest
  );
  const improvingSkill = skillOrder
    .filter((skill) => skill !== topSkill && skill !== weakSkill)
    .sort((left, right) => profile.stats[left].value - profile.stats[right].value)[0];
  const radarSize = 300;
  const radarCenter = radarSize / 2;
  const maxRadius = 88;
  const radarAxes = skillOrder.map((skill, index) => {
    const angle = -Math.PI / 2 + (index * Math.PI * 2) / skillOrder.length;
    const valueRadius = (profile.stats[skill].value / 100) * maxRadius;
    const labelRadius = maxRadius + 38;

    return {
      skill,
      code: statCodes[skill],
      value: profile.stats[skill].value,
      gain: latestSkillGain[skill] ?? 0,
      axisX: radarCenter + Math.cos(angle) * maxRadius,
      axisY: radarCenter + Math.sin(angle) * maxRadius,
      labelX: radarCenter + Math.cos(angle) * labelRadius,
      labelY: radarCenter + Math.sin(angle) * labelRadius,
      pointX: radarCenter + Math.cos(angle) * valueRadius,
      pointY: radarCenter + Math.sin(angle) * valueRadius
    };
  });
  const radarPolygon = radarAxes.map((axis) => `${axis.pointX},${axis.pointY}`).join(" ");
  const gridPolygons = [0.25, 0.5, 0.75, 1].map((scale) =>
    skillOrder
      .map((_, index) => {
        const angle = -Math.PI / 2 + (index * Math.PI * 2) / skillOrder.length;
        return `${radarCenter + Math.cos(angle) * maxRadius * scale},${radarCenter + Math.sin(angle) * maxRadius * scale}`;
      })
      .join(" ")
  );

  if (!progress.attempts.length) {
    return (
      <section className="rounded-lg border border-white/10 bg-white/5 p-5 shadow-card backdrop-blur-md">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mint">
          No Match Data Yet
        </p>
        <h2 className="mt-2 text-2xl font-extrabold text-white">Play scenarios to build your radar.</h2>
        <p className="mt-3 text-sm leading-6 text-slate-300">
          Your competency report starts empty. Each completed decision updates ratings, focus
          areas, streaks, and coaching recommendations.
        </p>
        <Link
          href="/scenarios"
          className="mt-5 inline-flex rounded-lg bg-mint px-4 py-3 text-sm font-extrabold text-slate-950"
        >
          Start First Scenario
        </Link>
      </section>
    );
  }

  return (
    <>
      <section className="rounded-lg border border-white/10 bg-white/5 p-4 shadow-card backdrop-blur-md">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-cyan">
              Last {Math.min(progress.attempts.length, 30)} Decisions
            </p>
            <h2 className="mt-1 text-xl font-extrabold text-white">Your Competency Report</h2>
          </div>
          <div className="rounded-lg border border-mint/30 bg-mint/10 px-3 py-2 text-center">
            <p className="text-3xl font-black text-mint">{average}</p>
            <p className="font-mono text-[10px] uppercase text-slate-400">OVR</p>
          </div>
        </div>

        <div className="mt-5 rounded-lg border border-mint/30 bg-white/[0.06] p-2 backdrop-blur-[1px]">
          <svg
            viewBox={`0 0 ${radarSize} ${radarSize}`}
            role="img"
            aria-label="Competency radar chart"
            className="mx-auto block w-full max-w-[300px]"
          >
            <defs>
              <radialGradient id="radarFill" cx="50%" cy="50%" r="55%">
                <stop offset="0%" stopColor="#7dffb3" stopOpacity="0.42" />
                <stop offset="100%" stopColor="#6dd3ff" stopOpacity="0.16" />
              </radialGradient>
            </defs>
            {gridPolygons.map((points, index) => (
              <polygon
                key={points}
                points={points}
                fill="none"
                stroke={index === gridPolygons.length - 1 ? "rgba(125,255,179,0.42)" : "rgba(255,255,255,0.16)"}
                strokeWidth={index === gridPolygons.length - 1 ? 1.4 : 1}
              />
            ))}
            {radarAxes.map((axis) => (
              <line
                key={axis.skill}
                x1={radarCenter}
                y1={radarCenter}
                x2={axis.axisX}
                y2={axis.axisY}
                stroke="rgba(255,255,255,0.16)"
                strokeWidth="1"
              />
            ))}
            <polygon
              points={radarPolygon}
              fill="url(#radarFill)"
              stroke="#7dffb3"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            {radarAxes.map((axis) => (
              <g key={axis.skill}>
                <circle cx={axis.pointX} cy={axis.pointY} r="4" fill="#7dffb3" stroke="#04101c" strokeWidth="2" />
                <text
                  x={axis.labelX}
                  y={axis.labelY - 10}
                  textAnchor="middle"
                  className="fill-white text-[11px] font-black"
                >
                  {axis.value}
                </text>
                {axis.gain > 0 ? (
                  <text
                    x={axis.labelX}
                    y={axis.labelY + 2}
                    textAnchor="middle"
                    className="fill-mint text-[9px] font-black"
                  >
                    +{axis.gain}
                  </text>
                ) : null}
                <text
                  x={axis.labelX}
                  y={axis.labelY + 14}
                  textAnchor="middle"
                  className="fill-slate-200 text-[9px] font-bold"
                >
                  {axis.code}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </section>

      <section className="grid grid-cols-3 gap-3">
        {[
          {
            label: "Top Strength",
            value: profile.stats[topSkill].label,
            note: "Strongest signal.",
            icon: Crown,
            color: "text-amber-300",
            border: "border-amber-300/30",
            bg: "bg-amber-300/10 backdrop-blur-[2px]"
          },
          {
            label: "Improving",
            value: profile.stats[improvingSkill].label,
            note: "Next growth lane.",
            icon: LineChart,
            color: "text-mint",
            border: "border-mint/30",
            bg: "bg-mint/10 backdrop-blur-[2px]"
          },
          {
            label: "Weak Spot",
            value: profile.stats[weakSkill].label,
            note: "Needs reps.",
            icon: AlertTriangle,
            color: "text-coral",
            border: "border-coral/30",
            bg: "bg-coral/10 backdrop-blur-[2px]"
          }
        ].map((item) => {
          const Icon = item.icon;

          return (
            <article key={item.label} className={`rounded-lg border ${item.border} ${item.bg} p-3`}>
              <Icon className={`h-5 w-5 ${item.color}`} />
              <p className="mt-4 font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-slate-300">
                {item.label}
              </p>
              <h3 className="mt-1 text-sm font-extrabold text-white">{item.value}</h3>
              <p className="mt-2 text-xs font-semibold leading-5 text-slate-300">{item.note}</p>
            </article>
          );
        })}
      </section>

      <section className="rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-violet-300" />
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-violet-200">
            Spaced Repetition
          </p>
        </div>
        <div className="mt-4 grid gap-2">
          {(progress.focusSkills.length ? progress.focusSkills : [weakSkill]).map((skill, index) => (
            <div key={skill} className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.06] p-3">
              <div className="flex min-w-0 items-center gap-3">
                <ShieldCheck className="h-4 w-4 shrink-0 text-mint" />
                <p className="truncate text-sm font-bold text-white">{profile.stats[skill].label}</p>
              </div>
              <span className="shrink-0 rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs font-bold text-slate-300">
                Due in {index + 1}d
              </span>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
