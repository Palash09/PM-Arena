"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { Lock, ShieldCheck } from "lucide-react";

import { isLeaderUnlocked, skillLabels, useProgress } from "@/lib/progress-store";
import { PlayerCard, Scenario } from "@/lib/types";

interface PlayerGridProps {
  initialPage?: number;
  players: PlayerCard[];
  scenarios: Scenario[];
}

const pageSize = 10;
const artworkSlugs = new Set([
  "bret-taylor",
  "ravi-mehta",
  "madhavan-ramanujam",
  "eoghan-mccabe",
  "melanie-perkins",
  "robby-stein",
  "albert-cheng",
  "jason-cohen",
  "grant-lee",
  "nick-turley",
  "howie-liu",
  "tomer-cohen",
  "stewart-butterfield",
  "asha-sharma",
  "jeetu-patel",
  "matt-macinnis",
  "molly-graham",
  "jeanne-grosser",
  "elena-verna",
  "chip-huyen",
  "nicole-forsgren",
  "dhanji-prasanna",
  "edwin-chen",
  "jason-droege",
  "jenny-wen",
  "boris-cherny",
  "sherwin-wu",
  "scott-wu",
  "dan-shipper",
  "jen-abel"
]);

function initialsFor(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export function PlayerGrid({ initialPage = 1, players, scenarios }: PlayerGridProps) {
  const { isHydrated, progress } = useProgress();
  const rankedPlayers = useMemo(
    () =>
      players
        .map((player, index) => {
          const leaderScenarios = scenarios.filter((scenario) => scenario.guest === player.name);
          const leaderScenarioIds = leaderScenarios.map((scenario) => scenario.id);
          const unlocked = isHydrated && isLeaderUnlocked(leaderScenarioIds, progress);

          return {
            index,
            leaderScenarios,
            player,
            unlocked
          };
        })
        .sort((left, right) => {
          if (left.unlocked !== right.unlocked) {
            return left.unlocked ? -1 : 1;
          }

          return left.index - right.index;
        }),
    [isHydrated, players, progress, scenarios]
  );
  const totalPages = Math.max(1, Math.ceil(rankedPlayers.length / pageSize));
  const activePage = Math.min(Math.max(initialPage, 1), totalPages);
  const visiblePlayers = useMemo(
    () => rankedPlayers.slice((activePage - 1) * pageSize, activePage * pageSize),
    [activePage, rankedPlayers]
  );
  const pageStart = rankedPlayers.length ? (activePage - 1) * pageSize + 1 : 0;
  const pageEnd = Math.min(activePage * pageSize, rankedPlayers.length);

  return (
    <section className="space-y-4">
      <div className="rounded-lg border border-white/10 bg-slate-950/65 p-4 shadow-card backdrop-blur-xl">
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-mint">
          Product Leaders
        </p>
        <div className="mt-1 flex items-end justify-between gap-3">
          <h2 className="text-xl font-extrabold text-white">Squad Cards</h2>
          <p className="text-sm font-bold text-slate-200">
            {pageStart}-{pageEnd} of {rankedPlayers.length}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
      {visiblePlayers.map(({ leaderScenarios, player, unlocked }) => {
        const practiceSkills = Array.from(new Set(leaderScenarios.map((scenario) => scenario.recommendedSkill)));
        const practiceLabel = practiceSkills.length
          ? practiceSkills
              .slice(0, 2)
              .map((skill) => skillLabels[skill])
              .join(" / ")
          : player.archetype;
        const cardClassName =
          "group grid h-[136px] grid-cols-[1fr_74px] gap-3 overflow-hidden rounded-lg border border-white/10 bg-slate-950/75 p-3 shadow-card transition";
        const cardContent = (
          <>
            <div className="flex min-w-0 flex-col justify-between">
              <div className="min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-2xl font-black leading-none text-white">{player.rating}</p>
                  {unlocked ? (
                    <ShieldCheck className="h-4 w-4 shrink-0 text-mint" />
                  ) : (
                    <Lock className="h-4 w-4 shrink-0 text-slate-500" />
                  )}
                </div>
                <p className="font-mono text-[9px] font-bold uppercase tracking-[0.12em] text-mint">OVR</p>
              </div>
              <div className="min-w-0">
                <h2 className="line-clamp-2 text-[15px] font-extrabold leading-tight text-white">
                  {player.name}
                </h2>
                <p className="mt-1 line-clamp-2 text-[11px] font-black leading-4 text-mint">
                  {practiceLabel}
                </p>
              </div>
            </div>
            <div className={`relative h-[112px] w-[74px] overflow-hidden rounded-md bg-black/30 ${unlocked ? "" : "opacity-70"}`}>
              {artworkSlugs.has(player.slug) ? (
                <Image
                  src={`/leaders/${player.slug}.png`}
                  alt={`${player.name} PM leader card`}
                  fill
                  sizes="74px"
                  className={`object-contain drop-shadow-[0_0_10px_rgba(125,255,179,0.16)] ${
                    unlocked ? "" : "grayscale opacity-50"
                  }`}
                />
              ) : (
                <div className={`grid h-full w-full place-items-center bg-gradient-to-br ${player.avatarHue}`}>
                  <div className="grid h-12 w-12 place-items-center rounded-lg border border-white/15 bg-black/35">
                    <span className="text-lg font-black text-white">{initialsFor(player.name)}</span>
                  </div>
                </div>
              )}
            </div>
          </>
        );

        return unlocked ? (
          <Link
            key={player.id}
            href={`/players/${player.slug}`}
            className={`${cardClassName} hover:border-mint/35`}
          >
            {cardContent}
          </Link>
        ) : (
          <div
            key={player.id}
            aria-disabled="true"
            className={`${cardClassName} cursor-not-allowed opacity-85`}
          >
            {cardContent}
          </div>
        );
      })}
      </div>

      {totalPages > 1 ? (
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 rounded-lg border border-white/10 bg-slate-950/70 p-3">
          {activePage === 1 ? (
            <span className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-center text-sm font-extrabold text-white opacity-40">
              Previous
            </span>
          ) : (
            <Link
              href={`/players?page=${activePage - 1}`}
              className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-center text-sm font-extrabold text-white"
            >
              Previous
            </Link>
          )}
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-slate-300">
            {activePage} / {totalPages}
          </p>
          {activePage === totalPages ? (
            <span className="rounded-md border border-mint/25 bg-mint/10 px-3 py-2 text-center text-sm font-extrabold text-mint opacity-40">
              Next
            </span>
          ) : (
            <Link
              href={`/players?page=${activePage + 1}`}
              className="rounded-md border border-mint/25 bg-mint/10 px-3 py-2 text-center text-sm font-extrabold text-mint"
            >
              Next
            </Link>
          )}
        </div>
      ) : null}
    </section>
  );
}
