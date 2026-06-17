"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { CheckCircle2, LoaderCircle, Lock } from "lucide-react";

import { resetPassword } from "@/lib/auth-store";

interface ResetPasswordScreenProps {
  token: string;
}

export function ResetPasswordScreen({ token }: ResetPasswordScreenProps) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!token) {
      setError("This reset link is missing a token. Request a new password reset link.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      await resetPassword(token, password);
      setIsComplete(true);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to reset password.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isComplete) {
    return (
      <section className="rounded-lg border border-mint/25 bg-slate-950/75 p-5 shadow-card backdrop-blur-xl">
        <div className="grid h-14 w-14 place-items-center rounded-lg border border-mint/30 bg-mint/10">
          <CheckCircle2 className="h-8 w-8 text-mint" />
        </div>
        <h2 className="mt-4 text-2xl font-extrabold text-white">Password updated</h2>
        <p className="mt-2 text-sm font-semibold leading-6 text-slate-200">
          Your password has been reset and you are signed in on this device.
        </p>
        <Link
          href="/"
          className="mt-5 flex min-h-12 w-full items-center justify-center rounded-md bg-mint px-4 py-3 text-sm font-extrabold text-slate-950"
        >
          Enter the Arena
        </Link>
      </section>
    );
  }

  return (
    <section className="rounded-lg border border-white/10 bg-slate-950/75 p-5 shadow-card backdrop-blur-xl">
      <p className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-mint">
        Account Recovery
      </p>
      <h2 className="mt-1 text-2xl font-extrabold text-white">Set a new password</h2>
      <p className="mt-2 text-sm font-semibold leading-6 text-slate-300">
        Enter a new 8+ character password for your Product Arena account.
      </p>

      <form onSubmit={onSubmit} className="mt-5 space-y-4">
        <label className="block">
          <span className="text-sm font-extrabold text-white">New password</span>
          <span className="mt-2 flex items-center gap-2 rounded-lg border border-white/10 bg-black/25 px-3 py-3 focus-within:border-mint">
            <Lock className="h-4 w-4 text-violet-300" />
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="new-password"
              placeholder="8+ characters"
              className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-white outline-none placeholder:text-slate-500"
              required
              minLength={8}
            />
          </span>
        </label>

        <label className="block">
          <span className="text-sm font-extrabold text-white">Confirm password</span>
          <span className="mt-2 flex items-center gap-2 rounded-lg border border-white/10 bg-black/25 px-3 py-3 focus-within:border-mint">
            <Lock className="h-4 w-4 text-violet-300" />
            <input
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              autoComplete="new-password"
              placeholder="Repeat password"
              className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-white outline-none placeholder:text-slate-500"
              required
              minLength={8}
            />
          </span>
        </label>

        {error ? (
          <div className="rounded-lg border border-coral/25 bg-coral/10 px-3 py-2">
            <p className="text-sm font-bold leading-5 text-coral">{error}</p>
          </div>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-mint px-4 py-3 text-sm font-extrabold text-slate-950 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-300"
        >
          {isSubmitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
          Reset Password
        </button>
      </form>
    </section>
  );
}
