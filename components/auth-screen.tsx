"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { CheckCircle2, LoaderCircle, Lock, Mail } from "lucide-react";

import { logIn, signUp, useAuth } from "@/lib/auth-store";

type AuthMode = "login" | "signup";

interface AuthScreenProps {
  initialMode?: AuthMode;
  nextHref?: string;
}

export function AuthScreen({ initialMode = "login", nextHref = "/" }: AuthScreenProps) {
  const { user, isHydrated, logOut } = useAuth();
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const actionHint = error.includes("database")
    ? "Developer action: start local Postgres, or add a hosted DATABASE_URL and run npm run db:push."
    : error.includes("tables")
      ? "Developer action: run npm run db:push against the configured DATABASE_URL."
      : error.includes("already exists")
        ? "Use the Log in tab with this email."
        : error.includes("No account")
          ? "Use the Sign up tab to create an account first."
          : error.includes("password")
            ? "Check the password and try again."
            : "";

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      if (mode === "signup") {
        await signUp(email, password);
      } else {
        await logIn(email, password);
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to authenticate.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!isHydrated) {
    return <div className="h-96 animate-pulse rounded-lg border border-white/10 bg-white/5" />;
  }

  if (user) {
    return (
      <section className="rounded-lg border border-mint/25 bg-slate-950/75 p-5 shadow-card backdrop-blur-xl">
        <div className="grid h-14 w-14 place-items-center rounded-lg border border-mint/30 bg-mint/10">
          <CheckCircle2 className="h-8 w-8 text-mint" />
        </div>
        <h2 className="mt-4 text-2xl font-extrabold text-white">Progress is saved</h2>
        <p className="mt-2 text-sm font-semibold leading-6 text-slate-200">
          Signed in as {user.email}. Your onboarding choices, completed scenarios, leader unlocks, and recommendations are now synced to your account.
        </p>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={logOut}
            className="rounded-md border border-white/10 bg-white/5 px-4 py-3 text-sm font-extrabold text-white"
          >
            Sign out
          </button>
          <Link
            href={nextHref}
            className="rounded-md bg-mint px-4 py-3 text-center text-sm font-extrabold text-slate-950"
          >
            {nextHref === "/onboarding" ? "Continue Setup" : "Go to Hub"}
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-lg border border-white/10 bg-slate-950/75 p-5 shadow-card backdrop-blur-xl">
      <div className="flex rounded-lg border border-white/10 bg-black/25 p-1">
        {[
          ["login", "Log in"],
          ["signup", "Sign up"]
        ].map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => {
              setMode(value as AuthMode);
              setError("");
            }}
            className={`min-h-11 flex-1 rounded-md text-sm font-extrabold ${
              mode === value ? "bg-mint text-slate-950" : "text-slate-200"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mt-5">
        <p className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-mint">
          Account
        </p>
        <h2 className="mt-1 text-2xl font-extrabold text-white">
          {mode === "signup" ? "Create your PM profile" : "Log back in"}
        </h2>
        <p className="mt-2 text-sm font-semibold leading-6 text-slate-300">
          Use an email and password to sync progress and recommendations to your profile.
        </p>
      </div>

      <form onSubmit={onSubmit} className="mt-5 space-y-4">
        <label className="block">
          <span className="text-sm font-extrabold text-white">Email</span>
          <span className="mt-2 flex items-center gap-2 rounded-lg border border-white/10 bg-black/25 px-3 py-3 focus-within:border-mint">
            <Mail className="h-4 w-4 text-cyan" />
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              placeholder="you@example.com"
              className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-white outline-none placeholder:text-slate-500"
              required
            />
          </span>
        </label>

        <label className="block">
          <span className="text-sm font-extrabold text-white">Password</span>
          <span className="mt-2 flex items-center gap-2 rounded-lg border border-white/10 bg-black/25 px-3 py-3 focus-within:border-mint">
            <Lock className="h-4 w-4 text-violet-300" />
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
              placeholder="8+ characters"
              className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-white outline-none placeholder:text-slate-500"
              required
              minLength={8}
            />
          </span>
        </label>

        {error ? (
          <div className="rounded-lg border border-coral/25 bg-coral/10 px-3 py-2">
            <p className="text-sm font-bold leading-5 text-coral">{error}</p>
            {actionHint ? (
              <p className="mt-1 text-xs font-semibold leading-5 text-slate-200">{actionHint}</p>
            ) : null}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-mint px-4 py-3 text-sm font-extrabold text-slate-950 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-300"
        >
          {isSubmitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
          {mode === "signup" ? "Create Account" : "Log In"}
        </button>
      </form>
    </section>
  );
}
