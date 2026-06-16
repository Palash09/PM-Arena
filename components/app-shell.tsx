import { ReactNode } from "react";
import Link from "next/link";
import { UserRound } from "lucide-react";

import { BottomNav } from "@/components/bottom-nav";

interface AppShellProps {
  title: string;
  compact?: boolean;
  children: ReactNode;
}

export function AppShell({ title, compact = false, children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-[#030814] text-white">
      <div className="relative mx-auto min-h-screen w-full max-w-md overflow-hidden bg-[#030814] shadow-[0_0_80px_rgba(0,0,0,0.5)]">
        <div className="absolute inset-0 bg-[url('/app-background.png')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(3,8,20,0.22)_0%,rgba(3,8,20,0.45)_31%,rgba(3,8,20,0.72)_62%,rgba(3,8,20,0.96)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_8%,rgba(255,138,102,0.16),transparent_22%),radial-gradient(circle_at_18%_72%,rgba(125,255,179,0.18),transparent_26%),radial-gradient(circle_at_82%_44%,rgba(109,211,255,0.12),transparent_24%)]" />
        <div className="absolute inset-0 bg-hub-grid bg-[size:32px_32px] opacity-[0.06]" />
        <div className="relative z-10 flex min-h-screen flex-col px-4 pb-28 pt-4">
          <header className={`${compact ? "mb-2" : "mb-3"} border-b border-white/10 pb-3`}>
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <p className="text-[21px] font-black uppercase leading-6 tracking-[0.02em] text-mint">
                  Product Arena
                </p>
                <h1 className="mt-1 text-[24px] font-extrabold leading-[1.05] text-white">
                  {title}
                </h1>
              </div>
              <Link
                href="/profile"
                aria-label="Open user profile"
                className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-mint/30 bg-mint/10 text-mint shadow-[0_0_28px_rgba(125,255,179,0.18)]"
              >
                <UserRound className="h-6 w-6" />
              </Link>
            </div>
          </header>
          <main className="space-y-4">{children}</main>
        </div>
        <BottomNav />
      </div>
    </div>
  );
}
