"use client";

import { FormEvent, useState } from "react";
import { CheckCircle2, LoaderCircle, MessageSquareText, Send } from "lucide-react";

const categories = [
  "Product feedback",
  "Scoring feedback",
  "Bug report",
  "Feature request"
] as const;

export function FeedbackForm() {
  const [category, setCategory] = useState<(typeof categories)[number]>("Product feedback");
  const [rating, setRating] = useState<number>();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          category,
          rating,
          message,
          path: `${window.location.pathname}${window.location.search}`
        })
      });
      const payload = (await response.json().catch(() => null)) as { error?: string } | null;

      if (!response.ok) {
        throw new Error(payload?.error || "Unable to send feedback.");
      }

      setMessage("");
      setRating(undefined);
      setIsSent(true);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to send feedback.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="relative overflow-hidden rounded-lg border border-cyan/25 bg-slate-950/80 p-5 shadow-card backdrop-blur-xl">
      <div className="pointer-events-none absolute -right-16 -top-20 h-44 w-44 rounded-full bg-cyan/10 blur-3xl" />
      <div className="relative">
        <div className="flex items-start gap-3">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-cyan/25 bg-cyan/10">
            <MessageSquareText className="h-5 w-5 text-cyan" />
          </div>
          <div>
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-cyan">
              Manager hotline
            </p>
            <h2 className="mt-1 text-xl font-extrabold text-white">Shape the next season</h2>
            <p className="mt-1 text-sm font-semibold leading-6 text-slate-300">
              Share a bug, a scoring concern, or what would make your next decision run better.
            </p>
          </div>
        </div>

        {isSent ? (
          <div className="mt-5 rounded-lg border border-mint/25 bg-mint/10 p-4">
            <div className="flex items-center gap-2 text-mint">
              <CheckCircle2 className="h-5 w-5" />
              <p className="text-sm font-extrabold">Feedback delivered</p>
            </div>
            <p className="mt-2 text-sm font-semibold leading-6 text-slate-200">
              Thanks. You can send another note if there is anything else we should know.
            </p>
            <button
              type="button"
              onClick={() => setIsSent(false)}
              className="mt-3 text-sm font-extrabold text-cyan underline underline-offset-4"
            >
              Send another
            </button>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="mt-5 space-y-5">
            <fieldset>
              <legend className="text-sm font-extrabold text-white">What is this about?</legend>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {categories.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setCategory(option)}
                    aria-pressed={category === option}
                    className={`min-h-11 rounded-md border px-3 py-2 text-left text-xs font-extrabold transition ${
                      category === option
                        ? "border-cyan/50 bg-cyan/15 text-cyan"
                        : "border-white/10 bg-black/25 text-slate-300 hover:border-white/25"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend className="text-sm font-extrabold text-white">
                How useful has the league felt? <span className="text-slate-500">Optional</span>
              </legend>
              <div className="mt-2 grid grid-cols-5 gap-2" aria-label="Usefulness rating">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setRating(value)}
                    aria-pressed={rating === value}
                    aria-label={`${value} out of 5`}
                    className={`min-h-11 rounded-md border text-sm font-black transition ${
                      rating === value
                        ? "border-mint/50 bg-mint text-slate-950"
                        : "border-white/10 bg-black/25 text-slate-300 hover:border-white/25"
                    }`}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </fieldset>

            <label className="block">
              <span className="flex items-center justify-between text-sm font-extrabold text-white">
                Your feedback
                <span className="font-mono text-[10px] text-slate-500">{message.length}/2000</span>
              </span>
              <textarea
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                minLength={20}
                maxLength={2000}
                required
                rows={5}
                placeholder="Tell us what happened, what you expected, or what we should build next."
                className="mt-2 w-full resize-y rounded-lg border border-white/10 bg-black/30 px-3 py-3 text-sm font-semibold leading-6 text-white outline-none placeholder:text-slate-500 focus:border-cyan"
              />
            </label>

            {error ? (
              <p className="rounded-md border border-coral/25 bg-coral/10 px-3 py-2 text-sm font-bold leading-5 text-coral">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={isSubmitting || message.trim().length < 20}
              className="flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-cyan px-4 py-3 text-sm font-extrabold text-slate-950 transition hover:bg-mint disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-300"
            >
              {isSubmitting ? (
                <LoaderCircle className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              {isSubmitting ? "Sending feedback" : "Send to Product Decision League"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
