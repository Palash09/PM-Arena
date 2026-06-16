import Image from "next/image";

import { PlayerCard } from "@/lib/types";

interface LeaderRecallItem {
  id: string;
  scenarioTitle: string;
  score: number;
  outcome: "win" | "retry";
  selectedOptionTitle?: string;
  expertChoice?: string;
  expertQuote?: string;
  delta?: string[];
  coaching?: string[];
  frameworks: string[];
  expertReasoning: string;
  actualOutcome: string;
}

interface LeaderCardProps {
  player: PlayerCard;
  unlocked?: boolean;
  recallItems?: LeaderRecallItem[];
}

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

export function LeaderCard({ player, unlocked = player.unlocked, recallItems = [] }: LeaderCardProps) {
  const leaderImageSrc = `/leaders/${player.slug}.png`;
  const hasArtwork = artworkSlugs.has(player.slug);

  return (
    <article className="overflow-hidden rounded-lg border border-white/10 bg-slate-950/70 shadow-card backdrop-blur-xl">
      <div className="grid gap-4 p-3">
        <div className="relative mx-auto aspect-[286/499] w-full max-w-[230px] overflow-hidden rounded-lg bg-black/35">
          {hasArtwork ? (
            <Image
              src={leaderImageSrc}
              alt={`${player.name} PM leader card`}
              fill
              sizes="(max-width: 640px) 230px, 230px"
              className="object-contain"
              priority={player.unlocked}
            />
          ) : (
            <div className={`flex h-full w-full flex-col items-center justify-center bg-gradient-to-br ${player.avatarHue} p-6 text-center`}>
              <div className="grid h-24 w-24 place-items-center rounded-2xl border border-white/20 bg-black/35 shadow-[0_0_30px_rgba(125,255,179,0.16)]">
                <span className="text-4xl font-black text-white">{initialsFor(player.name)}</span>
              </div>
              <p className="mt-5 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-mint">
                Product Leader
              </p>
              <p className="mt-2 text-xl font-black leading-tight text-white">{player.name}</p>
            </div>
          )}
          {!unlocked ? (
            <div className="absolute right-2 top-2 rounded-md border border-white/15 bg-black/55 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white/80">
              Locked
            </div>
          ) : null}
        </div>

        <div>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-mint">
                {player.archetype}
              </p>
              <h2 className="mt-1 truncate text-xl font-extrabold text-white">{player.name}</h2>
            </div>
            <div className="shrink-0 rounded-lg border border-mint/30 bg-mint/10 px-3 py-2 text-center">
              <p className="text-2xl font-black text-white">{player.rating}</p>
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-mint">OVR</p>
            </div>
          </div>
        </div>

        <section className="grid gap-3">
          <div>
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-cyan">
              PM Recall
            </p>
            <h3 className="mt-1 text-lg font-extrabold text-white">Learnings from your answered scenarios</h3>
          </div>

          {recallItems.length ? (
            recallItems.map((item) => {
              const primaryLearning =
                item.delta?.[0] ??
                item.coaching?.[0] ??
                item.expertReasoning;
              const secondaryLearning =
                item.coaching?.find((coaching) => coaching !== primaryLearning) ??
                item.delta?.find((delta) => delta !== primaryLearning) ??
                item.actualOutcome;

              return (
                <article key={item.id} className="rounded-lg border border-cyan/25 bg-cyan/10 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-cyan">
                        Answered Scenario
                      </p>
                      <h4 className="mt-1 text-base font-extrabold leading-5 text-white">
                        {item.scenarioTitle}
                      </h4>
                    </div>
                    <span
                      className={`shrink-0 rounded-md border px-2 py-1 text-xs font-black ${
                        item.outcome === "win"
                          ? "border-mint/35 bg-mint/10 text-mint"
                          : "border-coral/35 bg-coral/10 text-coral"
                      }`}
                    >
                      {item.score}%
                    </span>
                  </div>

                  {item.selectedOptionTitle ? (
                    <p className="mt-3 text-sm font-semibold leading-6 text-slate-100">
                      Your decision: {item.selectedOptionTitle}
                    </p>
                  ) : null}

                  {item.expertChoice ? (
                    <p className="mt-2 text-sm font-semibold leading-6 text-amber-200">
                      Expert approach: {item.expertChoice}
                    </p>
                  ) : null}

                  <div className="mt-3 rounded-lg border border-white/10 bg-black/20 p-3">
                    <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-mint">
                      What to remember
                    </p>
                    <p className="mt-2 text-sm font-semibold leading-6 text-white">{primaryLearning}</p>
                    {secondaryLearning && secondaryLearning !== primaryLearning ? (
                      <p className="mt-2 text-sm font-semibold leading-6 text-slate-200">
                        {secondaryLearning}
                      </p>
                    ) : null}
                  </div>

                  {item.frameworks.length ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {item.frameworks.slice(0, 3).map((framework) => (
                        <span
                          key={framework}
                          className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-bold text-slate-200"
                        >
                          {framework}
                        </span>
                      ))}
                    </div>
                  ) : null}

                  {item.expertQuote ? (
                    <blockquote className="mt-3 text-sm font-semibold italic leading-6 text-slate-200">
                      "{item.expertQuote}"
                    </blockquote>
                  ) : null}
                </article>
              );
            })
          ) : (
            <div className="rounded-lg border border-white/10 bg-white/5 p-4">
              <p className="text-sm font-semibold leading-6 text-slate-200">
                No answered scenarios from {player.name} yet. Complete one of this leader's scenarios to build recall here.
              </p>
            </div>
          )}
        </section>
      </div>
    </article>
  );
}
