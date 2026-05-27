import { useGameStore } from "../../core/useGameStore";
import { t } from "../../localisation";
import type { GameData, LocalisationPack, Relationship } from "../../types/game";
import { affiliationLabel, careerCategoryLabel, roleLabel, tagLabel } from "../display";

export function RelationshipsPanel({ relationships }: { relationships: Relationship[] }) {
  const data = useGameStore((store) => store.data);
  const pack = data.localisation;

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
            <div className="mt-1 text-xs text-zinc-600">
              {t(pack, "ui.relationship.affiliation")}: {affiliationLabel(pack, relationship.affiliation)}
            </div>
            <CompactTagLine label={t(pack, "ui.tags.lifeTags")} values={formatTagIds(pack, relationship.lifeTags)} />
            <CompactTagLine label={t(pack, "ui.tags.traits")} values={formatTraitIds(data, relationship.traits)} />
          </div>
        ))}
      </div>
    </section>
  );
}

function CompactTagLine({ label, values }: { label: string; values: string[] }) {
  if (values.length === 0) return null;

  return (
    <div className="mt-1 flex flex-wrap items-center gap-1">
      <span className="mr-1 text-[10px] text-zinc-600">{label}</span>
      {values.map((value) => (
        <span key={value} className="border border-zinc-800 px-1.5 py-0.5 text-[10px] text-zinc-500">
          {value}
        </span>
      ))}
    </div>
  );
}

function formatTraitIds(data: GameData, traitIds: string[]): string[] {
  return traitIds.map((id) => data.traits.find((trait) => trait.id === id)?.label ?? id);
}

function formatTagIds(pack: LocalisationPack, tagIds: string[]): string[] {
  return tagIds.map((id) => tagLabel(pack, id));
}
