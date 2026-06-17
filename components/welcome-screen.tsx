"use client";

import Link from "next/link";
import { ArrowRight, BarChart3, ShieldCheck, Sparkles, Target, Trophy } from "lucide-react";

interface WelcomeScreenProps {
  isReturningUser?: boolean;
  onEnter?: () => void;
}

export function WelcomeScreen({ isReturningUser = false, onEnter }: WelcomeScreenProps) {
  const enterClassName =
    "flex min-h-14 w-full items-center justify-center gap-3 rounded-full bg-mint px-6 text-base font-black text-slate-950 shadow-[0_0_38px_rgba(125,255,179,0.28)] transition hover:bg-white";

  return (
    <div className="min-h-screen bg-[#030814] text-white">
      <main className="relative mx-auto flex min-h-screen w-full max-w-md overflow-hidden bg-[#030814] shadow-[0_0_80px_rgba(0,0,0,0.55)]">
        <div className="absolute inset-0 bg-[url('/product-arena-intro.png')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(3,8,20,0.74)_0%,rgba(3,8,20,0.16)_29%,rgba(3,8,20,0.34)_51%,rgba(3,8,20,0.88)_72%,rgba(3,8,20,0.98)_100%)]" />
        <div className="absolute inset-x-0 top-0 h-64 bg-[radial-gradient(circle_at_50%_0%,rgba(125,255,179,0.18),transparent_58%)]" />
        <div className="absolute inset-0 bg-hub-grid bg-[size:34px_34px] opacity-[0.07]" />

        <section className="relative z-10 flex min-h-screen w-full flex-col px-5 pb-5 pt-5">
          <div className="flex flex-1 flex-col items-center text-center">
            <div className="grid h-14 w-14 place-items-center rounded-2xl border border-mint/40 bg-mint/10 shadow-[0_0_34px_rgba(125,255,179,0.22)]">
              <ShieldCheck className="h-8 w-8 text-mint" />
            </div>

            <div className="mt-5">
              <h1 className="text-[42px] font-black uppercase leading-[0.9] tracking-[0.01em] text-white drop-shadow-[0_4px_18px_rgba(0,0,0,0.75)]">
                Product
                <span className="block text-mint">Arena</span>
              </h1>
              <p className="mx-auto mt-4 max-w-[284px] text-sm font-bold leading-6 text-slate-100">
                The game for Product Managers who make winning decisions under pressure.
              </p>
            </div>

            <div className="min-h-[270px] w-full" />

            <div className="mt-auto grid w-full grid-cols-3 gap-3">
              {[
                {
                  title: "Real Scenarios",
                  body: "Practice real product dilemmas",
                  icon: Trophy,
                  color: "text-mint",
                  border: "border-mint/20"
                },
                {
                  title: "Make Decisions",
                  body: "Choose your path under pressure",
                  icon: Target,
                  color: "text-cyan",
                  border: "border-cyan/20"
                },
                {
                  title: "Level Up",
                  body: "Earn XP and climb PM ranks",
                  icon: BarChart3,
                  color: "text-violet-300",
                  border: "border-violet-300/20"
                }
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <div key={item.title} className={`rounded-lg border ${item.border} bg-black/34 p-2.5 backdrop-blur-md`}>
                    <div className="mx-auto grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/5">
                      <Icon className={`h-5 w-5 ${item.color}`} />
                    </div>
                    <h2 className="mt-2 text-center text-[11px] font-black leading-4 text-white">{item.title}</h2>
                    <p className="mt-1.5 text-center text-[10px] font-semibold leading-4 text-slate-200">{item.body}</p>
                  </div>
                );
              })}
            </div>

          </div>

          <div className="mt-5 space-y-3">
            {isReturningUser ? (
              <button type="button" onClick={onEnter} className={enterClassName}>
                Enter the Arena
                <ArrowRight className="h-5 w-5" />
              </button>
            ) : (
              <Link
                href="/account?mode=signup&next=/onboarding"
                onClick={onEnter}
                className={enterClassName}
              >
                Enter the Arena
                <ArrowRight className="h-5 w-5" />
              </Link>
            )}
            <Link
              href="/onboarding"
              onClick={onEnter}
              className="flex items-center justify-center gap-2 text-sm font-extrabold text-white underline decoration-white/45 underline-offset-4"
            >
              <Sparkles className="h-4 w-4 text-mint" />
              I&apos;m new here
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
