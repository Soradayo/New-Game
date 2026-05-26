import { useGameStore } from "../../core/useGameStore";
import { t } from "../../localisation";
import type { Relationship } from "../../types/game";
import { careerCategoryLabel, roleLabel } from "../display";

export function RelationshipsPanel({ relationships }: { relationships: Relationship[] }) {
  const pack = useGameStore((store) => store.data.localisation);

  return (
    <section className="rounded border border-zinc-800 bg-zinc-900/80 p-4">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-400">{t(pack, "ui.panel.relationships")}</h2>
      <div className="space-y-3">
        {relationships.map((relationship) => (
          <div key={relationship.id}>
            <div className="flex items-center justify-between gap-2 text-sm">
              <span>{relationship.name}</span>
              <span className="text-zinc-400">{relationship.bond.toFixed(0)}</span>
            </div>
            <div className="text-xs text-zinc-500">
              {roleLabel(pack, relationship.role)} /{" "}
              {careerCategoryLabel(pack, relationship.careerCategory)}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
