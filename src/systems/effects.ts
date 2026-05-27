import type { CareerCategory, EducationLevel, Effect, GameState, Region, Relationship } from "../types/game";

export function applyEffects(state: GameState, effects: Effect[]): GameState {
  return effects.reduce(applyEffect, state);
}

function applyEffect(state: GameState, effect: Effect): GameState {
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

  if (effect.target === "world.region" && typeof effect.value === "string") {
    return {
      ...state,
      world: {
        ...state.world,
        region: effect.value as Region,
      },
    };
  }

  if (effect.target === "affiliation" && typeof effect.value === "string") {
    return {
      ...state,
      player: {
        ...state.player,
        affiliation: effect.value,
      },
    };
  }

  if ((effect.target === "world.tags.add" || effect.target === "world.tags.remove") && typeof effect.value === "string") {
    return {
      ...state,
      world: {
        ...state.world,
        tags: updateStringList(state.world.tags, effect.value, effect.target.endsWith(".add")),
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

  if (effect.target.startsWith("relationship.")) {
    return applyRelationshipEffect(state, effect);
  }

  if (effect.target === "inventory.add" && typeof effect.value === "string") {
    if (state.player.inventory.includes(effect.value)) return state;

    return {
      ...state,
      player: {
        ...state.player,
        inventory: [...state.player.inventory, effect.value],
      },
    };
  }

  return state;
}

function applyRelationshipEffect(state: GameState, effect: Effect): GameState {
  const targetParts = effect.target.split(".");
  const relationshipId = targetParts[1];

  if (targetParts.length === 2 && typeof effect.value === "number") {
    const value = effect.value;
    return {
      ...state,
      relationships: state.relationships.map((relationship) => {
        if (relationshipId !== "all" && relationship.id !== relationshipId) {
          return relationship;
        }

        return {
          ...relationship,
          bond: clamp(relationship.bond + value, -100, 100),
        };
      }),
    };
  }

  if (relationshipId === "all") {
    return applyAllRelationshipFieldEffect(state, targetParts, effect);
  }

  return {
    ...state,
    relationships: state.relationships.map((relationship) => {
      if (relationship.id !== relationshipId) return relationship;
      return applySingleRelationshipFieldEffect(relationship, targetParts, effect);
    }),
  };
}

function applyAllRelationshipFieldEffect(state: GameState, targetParts: string[], effect: Effect): GameState {
  if (typeof effect.value !== "string") return state;

  const field = targetParts[2];
  const action = targetParts[3];
  if ((field !== "lifeTags" && field !== "traits") || (action !== "add" && action !== "remove")) return state;

  return {
    ...state,
    relationships: state.relationships.map((relationship) => ({
      ...relationship,
      [field]: updateStringList(relationship[field], effect.value as string, action === "add"),
    })),
  };
}

function applySingleRelationshipFieldEffect(relationship: Relationship, targetParts: string[], effect: Effect): Relationship {
  const field = targetParts[2];
  const action = targetParts[3];

  if ((field === "lifeTags" || field === "traits") && (action === "add" || action === "remove") && typeof effect.value === "string") {
    return {
      ...relationship,
      [field]: updateStringList(relationship[field], effect.value, action === "add"),
    };
  }

  if (field === "affiliation" && typeof effect.value === "string") {
    return {
      ...relationship,
      affiliation: effect.value,
    };
  }

  if (field === "careerCategory" && typeof effect.value === "string") {
    return {
      ...relationship,
      careerCategory: effect.value as CareerCategory,
    };
  }

  if (field === "educationLevel" && typeof effect.value === "string") {
    return {
      ...relationship,
      educationLevel: effect.value as EducationLevel,
    };
  }

  return relationship;
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
