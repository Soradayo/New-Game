import { useGameStore } from "../../core/useGameStore";
import type { AbilityKey } from "../../types/game";
import { t } from "../../localisation";
import { abilityLabel } from "../display";

export function AbilityPanel({ stats }: { stats: Record<AbilityKey, number> }) {
  const pack = useGameStore((store) => store.data.localisation);

  return (
    <section className="rounded border border-zinc-800 bg-zinc-900/80 p-4">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-400">{t(pack, "ui.panel.abilities")}</h2>
      <div className="space-y-3">
        {Object.entries(stats).map(([key, value]) => (
          <div key={key}>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span>{abilityLabel(pack, key as AbilityKey)}</span>
              <span className="text-zinc-400">{value.toFixed(1)}</span>
            </div>
            <div className="h-2 rounded bg-zinc-800">
              <div className="h-2 rounded bg-cyan-500" style={{ width: `${Math.min(100, value)}%` }} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
