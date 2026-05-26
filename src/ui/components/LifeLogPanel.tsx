import { useGameStore } from "../../core/useGameStore";
import { t } from "../../localisation";
import type { HistoryEntry } from "../../types/game";
import { categoryLabel, formatMonthsAsAge } from "../display";

export function LifeLogPanel({ entries }: { entries: HistoryEntry[] }) {
  const pack = useGameStore((store) => store.data.localisation);

  return (
    <section className="rounded border border-zinc-800 bg-zinc-900/80 p-4">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-400">{t(pack, "ui.panel.lifeLog")}</h2>
      <div className="h-64 space-y-3 overflow-y-auto pr-2">
        {entries.map((entry) => (
          <article key={entry.id} className="border-l border-zinc-700 pl-3">
            <div className="text-xs uppercase tracking-wide text-zinc-500">
              {t(pack, "ui.lifeLog.meta", {
                turn: entry.turn,
                age: formatMonthsAsAge(pack, entry.ageMonths),
                category: categoryLabel(pack, entry.category),
              })}
            </div>
            <p className="mt-1 text-sm leading-6 text-zinc-200">{entry.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
