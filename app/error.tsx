"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

import { trackAnalyticsEvent } from "@/lib/client-analytics";

export default function ErrorPage({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    void trackAnalyticsEvent("client_render_error", {
      metadata: {
        errorName: error.name,
        hasDigest: Boolean(error.digest)
      }
    });
  }, [error]);

  return (
    <main className="grid min-h-screen place-items-center bg-[#020713] px-5 text-white">
      <section className="w-full max-w-md rounded-xl border border-coral/30 bg-slate-950/90 p-6 text-center shadow-card">
        <AlertTriangle className="mx-auto h-10 w-10 text-coral" />
        <p className="mt-4 font-mono text-[10px] font-black uppercase tracking-[0.2em] text-coral">Match interrupted</p>
        <h1 className="mt-2 text-2xl font-black">This screen could not load.</h1>
        <p className="mt-3 text-sm font-semibold leading-6 text-slate-300">Retry the screen. Your saved account progress will not be removed.</p>
        <button type="button" onClick={reset} className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-mint px-5 py-3 text-sm font-black text-slate-950">
          <RotateCcw className="h-4 w-4" /> Retry
        </button>
        <Link href="/contact" className="mt-4 inline-block text-xs font-bold text-slate-400 hover:text-white">Report the issue</Link>
      </section>
    </main>
  );
}
