import { useGameStore } from "../../core/useGameStore";
import { t } from "../../localisation";
import { getNpcInteractionAvailability } from "../../systems/npcInteractions";
import {
  affiliationLabel,
  careerCategoryLabel,
  educationLevelLabel,
  roleLabel,
} from "../display";
import { formatTagIds, formatTraitIds } from "./infoTabFormat";
import { TagLine } from "./TagBlock";

export function RelationshipsTab() {
  const { data, state, performNpcInteraction } = useGameStore();
  const pack = data.localisation;

  return (
    <div className="grid gap-3 p-4 md:grid-cols-3">
      {state.relationships.map((relationship) => (
        <div key={relationship.id} className="rounded border border-zinc-800 p-3">
          <div className="font-medium">{relationship.name}</div>
          <div className="text-sm text-zinc-500">{roleLabel(pack, relationship.role)}</div>
          <div className="mt-2 text-sm">{t(pack, "ui.relationship.bond", { value: relationship.bond.toFixed(0) })}</div>
          <div className="mt-1 grid grid-cols-3 gap-1 text-xs text-zinc-500">
            <span>{t(pack, "ui.relationship.trust", { value: relationship.trust.toFixed(0) })}</span>
            <span>{t(pack, "ui.relationship.dependency", { value: relationship.dependency.toFixed(0) })}</span>
            <span>{t(pack, "ui.relationship.conflict", { value: relationship.conflict.toFixed(0) })}</span>
          </div>
          <div className="mt-1 text-xs text-zinc-500">
            {educationLevelLabel(pack, relationship.educationLevel)} / {careerCategoryLabel(pack, relationship.careerCategory)}
          </div>
          <TagLine label={t(pack, "ui.relationship.affiliation")} values={[affiliationLabel(pack, relationship.affiliation)]} />
          <TagLine label={t(pack, "ui.tags.lifeTags")} values={formatTagIds(pack, relationship.lifeTags)} />
          <TagLine label={t(pack, "ui.tags.traits")} values={formatTraitIds(data, relationship.traits)} />
          <div className="mt-3 border-t border-zinc-800 pt-3">
            <div className="mb-2 text-xs text-zinc-500">{t(pack, "ui.npcInteractions.title")}</div>
            <div className="grid gap-2">
              {data.npcInteractions.map((interaction) => {
                const availability = getNpcInteractionAvailability(state, relationship.id, interaction);
                const alreadyUsed = relationship.lastInteractionTurn === state.turn;
                const label = alreadyUsed
                  ? t(pack, "ui.npcInteractions.used")
                  : t(pack, "ui.npcInteractions.unavailable");

                return (
                  <button
                    key={interaction.id}
                    type="button"
                    className="rounded border border-zinc-700 px-2 py-2 text-left text-xs text-zinc-200 transition hover:border-zinc-300 disabled:cursor-not-allowed disabled:opacity-40"
                    disabled={!availability.available}
                    title={availability.available ? interaction.description : label}
                    onClick={() => performNpcInteraction(relationship.id, interaction.id)}
                  >
                    <span className="block font-medium text-zinc-50">{interaction.label}</span>
                    <span className="mt-1 block text-zinc-500">{interaction.description}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
