import type { Effect, GameState } from "../types/game";

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

  if (effect.target.startsWith("relationship.") && typeof effect.value === "number") {
    const relationshipId = effect.target.replace("relationship.", "");
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

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
