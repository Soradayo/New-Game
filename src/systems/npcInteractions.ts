import { t } from "../localisation";
import { createHistoryEntry } from "./history";
import { matchesCondition } from "./conditions";
import type {
  Condition,
  GameData,
  GameState,
  HistoryStateDiff,
  NpcInteractionDefinition,
  NpcInteractionEffect,
  Relationship,
} from "../types/game";

export interface NpcInteractionAvailability {
  available: boolean;
  reason?: string;
}

export function getNpcInteractionAvailability(
  state: GameState,
  relationshipId: string,
  interaction: NpcInteractionDefinition,
): NpcInteractionAvailability {
  const relationship = state.relationships.find((entry) => entry.id === relationshipId);
  if (!relationship) {
    return { available: false, reason: "system.error.npcMissing" };
  }

  if (relationship.lastInteractionTurn === state.turn) {
    return { available: false, reason: "system.error.npcInteractionAlreadyUsed" };
  }

  const conditions = resolveTargetConditions(interaction.conditions, relationshipId);
  if (!conditions.every((condition) => matchesCondition(state, condition))) {
    return { available: false, reason: "system.error.npcInteractionUnavailable" };
  }

  return { available: true };
}

export function performNpcInteraction(
  state: GameState,
  data: GameData,
  relationshipId: string,
  interactionId: string,
): GameState {
  const relationship = state.relationships.find((entry) => entry.id === relationshipId);
  if (!relationship) {
    throw new Error(t(data.localisation, "system.error.npcMissing"));
  }

  const interaction = data.npcInteractions.find((entry) => entry.id === interactionId);
  if (!interaction) {
    throw new Error(t(data.localisation, "system.error.npcInteractionMissing"));
  }

  const availability = getNpcInteractionAvailability(state, relationshipId, interaction);
  if (!availability.available) {
    throw new Error(t(data.localisation, availability.reason ?? "system.error.npcInteractionUnavailable"));
  }

  const next = applyNpcInteractionEffects(state, relationshipId, interaction.effects);
  const updatedRelationship = next.relationships.find((entry) => entry.id === relationshipId) ?? relationship;
  const params = {
    npc: relationship.name,
    role: relationship.role,
    interaction: interaction.label,
  };

  return {
    ...next,
    history: [
      createHistoryEntry({
        id: `npc-interaction-${state.turn}-${relationshipId}-${interactionId}`,
        turn: state.turn,
        ageMonths: state.player.ageMonths,
        text: renderTemplate(interaction.log, params),
        locKey: interaction.logKey,
        params,
        sourceId: `${relationshipId}:${interactionId}`,
        sourceType: "npcInteraction",
        stateDiff: createRelationshipDiff(relationship, updatedRelationship),
      }),
      ...next.history,
    ].slice(0, 200),
  };
}

function applyNpcInteractionEffects(state: GameState, relationshipId: string, effects: NpcInteractionEffect[]): GameState {
  const next = effects.reduce((current, effect) => applyNpcInteractionEffect(current, relationshipId, effect), state);

  return {
    ...next,
    relationships: next.relationships.map((relationship) =>
      relationship.id === relationshipId ? { ...relationship, lastInteractionTurn: state.turn } : relationship,
    ),
  };
}

function applyNpcInteractionEffect(state: GameState, relationshipId: string, effect: NpcInteractionEffect): GameState {
  if (effect.target === "money" && typeof effect.value === "number") {
    return {
      ...state,
      player: {
        ...state.player,
        money: Math.max(0, state.player.money + effect.value),
      },
    };
  }

  if (effect.target === "world.pressure" && typeof effect.value === "number") {
    return {
      ...state,
      world: {
        ...state.world,
        pressure: clamp(state.world.pressure + effect.value, 0, 100),
      },
    };
  }

  if (effect.target.startsWith("stats.") && typeof effect.value === "number") {
    const stat = effect.target.replace("stats.", "") as keyof typeof state.player.stats;
    return {
      ...state,
      player: {
        ...state.player,
        stats: {
          ...state.player.stats,
          [stat]: clamp(state.player.stats[stat] + effect.value, 0, 100),
        },
      },
    };
  }

  if ((effect.target === "player.lifeTags.add" || effect.target === "player.lifeTags.remove") && typeof effect.value === "string") {
    return {
      ...state,
      player: {
        ...state.player,
        lifeTags: updateStringList(state.player.lifeTags, effect.value, effect.target.endsWith(".add")),
      },
    };
  }

  if ((effect.target === "player.traits.add" || effect.target === "player.traits.remove") && typeof effect.value === "string") {
    return {
      ...state,
      player: {
        ...state.player,
        traits: updateStringList(state.player.traits, effect.value, effect.target.endsWith(".add")),
      },
    };
  }

  return {
    ...state,
    relationships: state.relationships.map((relationship) => {
      if (relationship.id !== relationshipId) return relationship;
      return applyTargetEffect(relationship, effect, state.turn);
    }),
  };
}

function applyTargetEffect(relationship: Relationship, effect: NpcInteractionEffect, turn: number): Relationship {
  const base = { ...relationship, lastInteractionTurn: turn };

  if ((effect.target === "bond" || effect.target === "trust") && typeof effect.value === "number") {
    return {
      ...base,
      [effect.target]: clamp(base[effect.target] + effect.value, -100, 100),
    };
  }

  if ((effect.target === "dependency" || effect.target === "conflict") && typeof effect.value === "number") {
    return {
      ...base,
      [effect.target]: clamp(base[effect.target] + effect.value, 0, 100),
    };
  }

  if ((effect.target === "target.lifeTags.add" || effect.target === "target.lifeTags.remove") && typeof effect.value === "string") {
    return {
      ...base,
      lifeTags: updateStringList(base.lifeTags, effect.value, effect.target.endsWith(".add")),
    };
  }

  if ((effect.target === "target.traits.add" || effect.target === "target.traits.remove") && typeof effect.value === "string") {
    return {
      ...base,
      traits: updateStringList(base.traits, effect.value, effect.target.endsWith(".add")),
    };
  }

  return base;
}

function resolveTargetConditions(conditions: Condition[], relationshipId: string): Condition[] {
  return conditions.map((condition) => resolveTargetCondition(condition, relationshipId));
}

function resolveTargetCondition(condition: Condition, relationshipId: string): Condition {
  if ("all" in condition) {
    return { all: condition.all.map((child) => resolveTargetCondition(child, relationshipId)) };
  }

  if ("any" in condition) {
    return { any: condition.any.map((child) => resolveTargetCondition(child, relationshipId)) };
  }

  if ("not" in condition) {
    return { not: resolveTargetCondition(condition.not, relationshipId) };
  }

  return {
    ...condition,
    target: condition.target.replace("relationship.$target.", `relationship.${relationshipId}.`) as typeof condition.target,
  };
}

function createRelationshipDiff(before: Relationship, after: Relationship): HistoryStateDiff[] {
  const fields: Array<"bond" | "trust" | "dependency" | "conflict"> = ["bond", "trust", "dependency", "conflict"];

  return fields.flatMap((field) => {
    const delta = after[field] - before[field];
    if (delta === 0) return [];

    return [{
      target: "relationships" as const,
      label: field,
      before: before[field],
      after: after[field],
      delta,
    }];
  });
}

function renderTemplate(template: string, params: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => params[key] ?? `{${key}}`);
}

function updateStringList(values: string[], value: string, shouldAdd: boolean): string[] {
  if (shouldAdd) {
    return values.includes(value) ? values : [...values, value];
  }

  return values.filter((entry) => entry !== value);
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
