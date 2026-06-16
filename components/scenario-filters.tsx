"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Check } from "lucide-react";
import { useRouter } from "next/navigation";

interface FilterOption {
  label: string;
  value: string;
}

interface ScenarioFiltersProps {
  activeStage: string;
  activeType: string;
  activeDifficulty: string;
  stages: readonly string[];
  decisionTypes: readonly string[];
  difficulties: readonly string[];
}

function toOptions(values: readonly string[]): FilterOption[] {
  return values.map((value) => ({
    value,
    label: value.replace("_", " ")
  }));
}

function FilterMenu({
  id,
  label,
  value,
  options,
  onChange,
  openMenu,
  setOpenMenu
}: {
  id: string;
  label: string;
  value: string;
  options: FilterOption[];
  onChange: (value: string) => void;
  openMenu: string | null;
  setOpenMenu: (value: string | null) => void;
}) {
  const isOpen = openMenu === id;
  const selected = options.find((option) => option.value === value) ?? options[0];

  return (
    <div>
      <p className="mb-1.5 text-sm font-black text-slate-100">{label}</p>
      <button
        type="button"
        onClick={() => setOpenMenu(isOpen ? null : id)}
        className={`flex h-11 w-full items-center justify-between rounded-lg border px-3 text-left text-sm font-black text-white outline-none transition ${
          isOpen ? "border-mint bg-slate-950" : "border-white/10 bg-slate-950/85"
        }`}
      >
        <span>{selected.label}</span>
        <ChevronDown className={`h-4 w-4 text-slate-300 transition ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen ? (
        <div className="mt-2 max-h-44 overflow-y-auto rounded-lg border border-mint/30 bg-[#050b18]/95 shadow-[0_18px_40px_rgba(0,0,0,0.72)]">
          {options.map((option) => {
            const active = option.value === value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setOpenMenu(null);
                }}
                className={`flex w-full items-center justify-between px-3 py-2.5 text-left text-sm font-bold transition ${
                  active ? "bg-mint text-slate-950" : "text-slate-100 hover:bg-white/10"
                }`}
              >
                {option.label}
                {active ? <Check className="h-4 w-4" /> : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

export function ScenarioFilters({
  activeStage,
  activeType,
  activeDifficulty,
  stages,
  decisionTypes,
  difficulties
}: ScenarioFiltersProps) {
  const router = useRouter();
  const [stage, setStage] = useState(activeStage);
  const [type, setType] = useState(activeType);
  const [difficulty, setDifficulty] = useState(activeDifficulty);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  function applyFilters() {
    const query = new URLSearchParams();

    if (stage !== "ALL") {
      query.set("stage", stage);
    }

    if (type !== "ALL") {
      query.set("type", type);
    }

    if (difficulty !== "ALL") {
      query.set("difficulty", difficulty);
    }

    const result = query.toString();
    router.push(result ? `/scenarios?${result}` : "/scenarios");
  }

  return (
    <section className="rounded-lg border border-white/10 bg-white/5 p-4 shadow-card backdrop-blur-xl">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-cyan">
            Filters
          </p>
          <h2 className="mt-1 text-xl font-extrabold text-white">Shape your market</h2>
        </div>
        <Link href="/scenarios" className="shrink-0 text-sm font-bold text-cyan">
          Clear
        </Link>
      </div>

      <div className="mt-4 grid gap-3">
        <FilterMenu
          id="stage"
          label="Company stage"
          value={stage}
          options={toOptions(stages)}
          onChange={setStage}
          openMenu={openMenu}
          setOpenMenu={setOpenMenu}
        />
        <div className="grid grid-cols-2 gap-3">
          <FilterMenu
            id="type"
            label="Decision type"
            value={type}
            options={toOptions(decisionTypes)}
            onChange={setType}
            openMenu={openMenu}
            setOpenMenu={setOpenMenu}
          />
          <FilterMenu
            id="difficulty"
            label="Difficulty"
            value={difficulty}
            options={toOptions(difficulties)}
            onChange={setDifficulty}
            openMenu={openMenu}
            setOpenMenu={setOpenMenu}
          />
        </div>

        <button
          type="button"
          onClick={applyFilters}
          className="rounded-lg bg-mint px-4 py-3 text-sm font-extrabold text-slate-950"
        >
          Apply Filters
        </button>
      </div>
    </section>
  );
}
