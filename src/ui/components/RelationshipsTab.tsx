import { useState } from "react";
import { useGameStore } from "../../core/useGameStore";
import { t } from "../../localisation";
import { getNpcInteractionAvailability } from "../../systems/npcInteractions";
import type { NpcInteractionDefinition, Relationship } from "../../types/game";
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
  const [selectedRelationshipId, setSelectedRelationshipId] = useState(state.relationships[0]?.id ?? "");
  const selectedRelationship = state.relationships.find((relationship) => relationship.id === selectedRelationshipId) ??
    state.relationships[0];

  return (
    <div className="grid gap-4 p-4 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
      <div className="grid gap-2">
        {state.relationships.map((relationship) => {
          const isSelected = relationship.id === selectedRelationship?.id;

          return (
            <button
              key={relationship.id}
              type="button"
              className={`rounded border p-3 text-left transition ${
                isSelected
                  ? "border-zinc-100 bg-zinc-100 text-zinc-950"
                  : "border-zinc-800 text-zinc-200 hover:border-zinc-500"
              }`}
              aria-pressed={isSelected}
              onClick={() => setSelectedRelationshipId(relationship.id)}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-medium">{relationship.name}</div>
                  <div className={isSelected ? "text-sm text-zinc-700" : "text-sm text-zinc-500"}>
                    {roleLabel(pack, relationship.role)}
                  </div>
                </div>
                {relationship.lastInteractionTurn === state.turn ? (
                  <span className={`shrink-0 border px-2 py-1 text-xs ${isSelected ? "border-zinc-600" : "border-zinc-700 text-zinc-500"}`}>
                    {t(pack, "ui.npcInteractions.used")}
                  </span>
                ) : null}
              </div>
              <RelationshipMetrics relationship={relationship} isSelected={isSelected} />
              <div className={isSelected ? "mt-2 text-xs text-zinc-700" : "mt-2 text-xs text-zinc-500"}>
                {formatTagIds(pack, relationship.lifeTags).slice(0, 2).join(" / ") || t(pack, "ui.tags.empty")}
              </div>
            </button>
          );
        })}
      </div>
      {selectedRelationship ? (
        <RelationshipDetail
          relationship={selectedRelationship}
          interactions={data.npcInteractions}
          onInteract={performNpcInteraction}
        />
      ) : null}
    </div>
  );
}

function RelationshipDetail({
  relationship,
  interactions,
  onInteract,
}: {
  relationship: Relationship;
  interactions: NpcInteractionDefinition[];
  onInteract: (relationshipId: string, interactionId: string) => void;
}) {
  const { data, state } = useGameStore();
  const pack = data.localisation;

  return (
    <section className="rounded border border-zinc-800 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="text-lg font-medium text-zinc-50">{relationship.name}</div>
          <div className="text-sm text-zinc-500">{roleLabel(pack, relationship.role)}</div>
        </div>
        <div className="text-xs text-zinc-500">
          {educationLevelLabel(pack, relationship.educationLevel)} / {careerCategoryLabel(pack, relationship.careerCategory)}
        </div>
      </div>
      <RelationshipMetrics relationship={relationship} />
      <div className="mt-3 grid gap-1 text-xs text-zinc-500 sm:grid-cols-3">
        <TagLine label={t(pack, "ui.relationship.affiliation")} values={[affiliationLabel(pack, relationship.affiliation)]} />
        <TagLine label={t(pack, "ui.tags.lifeTags")} values={formatTagIds(pack, relationship.lifeTags)} />
        <TagLine label={t(pack, "ui.tags.traits")} values={formatTraitIds(data, relationship.traits)} />
      </div>
      <div className="mt-4 border-t border-zinc-800 pt-4">
        <div className="mb-2 text-xs text-zinc-500">{t(pack, "ui.npcInteractions.title")}</div>
        <div className="grid gap-2 sm:grid-cols-2">
          {interactions.map((interaction) => {
            const availability = getNpcInteractionAvailability(state, relationship.id, interaction);
            const alreadyUsed = relationship.lastInteractionTurn === state.turn;
            const reasonKey = availability.reason ?? "ui.npcInteractions.available";
            const status = availability.available
              ? t(pack, "ui.npcInteractions.available")
              : alreadyUsed
                ? t(pack, "ui.npcInteractions.used")
                : t(pack, "ui.npcInteractions.unavailable");
            const reason = availability.available ? interaction.description : t(pack, reasonKey);

            return (
              <button
                key={interaction.id}
                type="button"
                className="rounded border border-zinc-700 px-3 py-2 text-left text-xs text-zinc-200 transition hover:border-zinc-300 disabled:cursor-not-allowed disabled:border-zinc-800 disabled:opacity-45"
                disabled={!availability.available}
                title={reason}
                onClick={() => onInteract(relationship.id, interaction.id)}
              >
                <span className="flex items-start justify-between gap-3">
                  <span className="font-medium leading-5 text-zinc-50">{interaction.label}</span>
                  <span className="shrink-0 border border-zinc-800 px-1.5 py-0.5 text-zinc-500">{status}</span>
                </span>
                <span className="mt-1 block leading-5 text-zinc-500">{interaction.description}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function RelationshipMetrics({ relationship, isSelected = false }: { relationship: Relationship; isSelected?: boolean }) {
  const pack = useGameStore((store) => store.data.localisation);
  const color = isSelected ? "text-zinc-700" : "text-zinc-500";

  return (
    <div className={`mt-2 grid grid-cols-2 gap-1 text-xs sm:grid-cols-4 ${color}`}>
      <span>{t(pack, "ui.relationship.bond", { value: relationship.bond.toFixed(0) })}</span>
      <span>{t(pack, "ui.relationship.trust", { value: relationship.trust.toFixed(0) })}</span>
      <span>{t(pack, "ui.relationship.dependency", { value: relationship.dependency.toFixed(0) })}</span>
      <span>{t(pack, "ui.relationship.conflict", { value: relationship.conflict.toFixed(0) })}</span>
    </div>
  );
}
