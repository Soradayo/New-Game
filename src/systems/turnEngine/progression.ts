import type { GameState } from "../../types/game";

export function applyPassiveUpdates(state: GameState): GameState {
  return {
    ...state,
    world: {
      ...state.world,
      pressure: Math.min(100, state.world.pressure + 0.2),
    },
  };
}

export function applyGrowth(state: GameState): GameState {
  return {
    ...state,
    player: {
      ...state.player,
      stats: {
        ...state.player.stats,
        mind: Math.min(100, state.player.stats.mind + 0.1),
      },
    },
  };
}

export function applyRelationshipDrift(state: GameState): GameState {
  if (state.turn % 3 !== 0) return state;

  return {
    ...state,
    relationships: state.relationships.map((relationship, index) => ({
      ...relationship,
      bond: Math.max(-100, Math.min(100, relationship.bond + (index % 2 === 0 ? 1 : -1))),
    })),
  };
}

export function applyNpcBehavior(state: GameState): GameState {
  return {
    ...state,
    relationships: state.relationships.map((relationship) => {
      if (relationship.role !== "mentor") return relationship;
      return {
        ...relationship,
        bond: Math.min(100, relationship.bond + 0.5),
      };
    }),
  };
}
