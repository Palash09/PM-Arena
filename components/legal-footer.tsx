import Link from "next/link";

const links = [
  ["Privacy", "/privacy"],
  ["Terms", "/terms"],
  ["Attribution", "/attribution"],
  ["Contact", "/contact"]
] as const;

interface LegalFooterProps {
  compact?: boolean;
}

export function LegalFooter({ compact = false }: LegalFooterProps) {
  return (
    <footer className={`${compact ? "mt-5 pb-2" : "mt-8 border-t border-white/10 pb-2 pt-5"}`}>
      <nav aria-label="Legal and support" className="flex flex-wrap justify-center gap-x-4 gap-y-2">
        {links.map(([label, href]) => (
          <Link
            key={href}
            href={href}
            className="text-[11px] font-bold text-slate-400 transition hover:text-mint"
          >
            {label}
          </Link>
        ))}
      </nav>
      {!compact ? (
        <p className="mt-3 text-center text-[10px] font-semibold leading-4 text-slate-600">
          Product Decision League is an independent learning simulation.
        </p>
      ) : null}
    </footer>
  );
}
