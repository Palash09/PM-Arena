import { ArrowLeft, Swords } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

import { LegalFooter } from "@/components/legal-footer";

interface LegalPageProps {
  eyebrow: string;
  title: string;
  summary: string;
  children: ReactNode;
}

export function LegalPage({ eyebrow, title, summary, children }: LegalPageProps) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#020713] text-white">
      <div className="pointer-events-none fixed inset-0 bg-[url('/product-decision-league-background.png')] bg-cover bg-center opacity-30" />
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(180deg,rgba(2,7,19,0.68),rgba(2,7,19,0.98))]" />
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(125,255,179,0.14),transparent_38%)]" />

      <div className="relative mx-auto w-full max-w-3xl px-5 pb-10 pt-[max(20px,env(safe-area-inset-top))] sm:px-8">
        <header className="flex items-center justify-between border-b border-white/10 pb-4">
          <Link href="/" className="flex items-center gap-3 text-sm font-black text-white">
            <span className="grid h-10 w-10 place-items-center rounded-lg border border-mint/35 bg-mint/10">
              <Swords className="h-5 w-5 text-mint" />
            </span>
            Product Decision League
          </Link>
          <Link href="/" aria-label="Return to the league" className="rounded-lg border border-white/10 bg-white/5 p-2.5 text-slate-300 hover:text-white">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </header>

        <article className="mt-8 overflow-hidden rounded-xl border border-white/10 bg-slate-950/80 shadow-card backdrop-blur-xl">
          <div className="border-b border-white/10 bg-[linear-gradient(135deg,rgba(125,255,179,0.14),rgba(109,211,255,0.05))] p-5 sm:p-8">
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-mint">{eyebrow}</p>
            <h1 className="mt-3 text-3xl font-black leading-tight sm:text-4xl">{title}</h1>
            <p className="mt-3 max-w-2xl text-sm font-semibold leading-6 text-slate-300">{summary}</p>
            <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.12em] text-slate-500">Effective August 14, 2026</p>
          </div>
          <div className="legal-copy space-y-7 p-5 text-sm font-medium leading-7 text-slate-300 sm:p-8">
            {children}
          </div>
        </article>

        <LegalFooter />
      </div>
    </main>
  );
}
