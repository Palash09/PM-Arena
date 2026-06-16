"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Home, Shield, Trophy, Users } from "lucide-react";

const navItems = [
  { href: "/", label: "Hub", icon: Home },
  { href: "/scenarios", label: "Scenarios", icon: Shield },
  { href: "/report", label: "Report", icon: BarChart3 },
  { href: "/career", label: "Career", icon: Trophy },
  { href: "/players", label: "Squad", icon: Users }
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-3 z-40 px-3">
      <div className="mx-auto grid max-w-md grid-cols-5 gap-1 rounded-lg border border-white/10 bg-slate-950/90 p-1.5 shadow-card backdrop-blur-xl">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-md px-1.5 py-2 text-[11px] font-bold transition ${
                isActive
                  ? "bg-mint text-slate-950"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
