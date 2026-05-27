import type { GameData, GameState, Relationship } from "../types/game";
import { SAVE_VERSION } from "../saves/saveCodec";
import { baseLocalisation, DEFAULT_LOCALE, t } from "../localisation";
import { createHistoryEntry } from "../systems/history";

export function createInitialState(data: GameData, pack = baseLocalisation[DEFAULT_LOCALE]): GameState {
  const playerName = `${data.names.given[0]} ${data.names.family[0]}`;

  return {
    version: SAVE_VERSION,
    turn: 0,
    selectedActionId: data.actions[0]?.id ?? "study",
    selectedStanceId: data.stances[0]?.id ?? "cautious",
    pendingTurningPoint: null,
    player: {
      name: playerName,
      ageMonths: 72,
      socialClass: "worker",
      affiliation: "none",
      money: 12,
      educationLevel: "primary",
      careerCategory: "none",
      lifeTags: [],
      traits: [],
      stats: {
        body: 10,
        mind: 10,
        craft: 10,
        social: 10,
        spirit: 10,
      },
      inventory: ["cheap-primer"],
    },
    world: {
      nation: t(pack, "world.nation.veil"),
      nationArchetype: t(pack, "world.nationArchetype.commercial"),
      region: "industrial",
      organizations: {
        state: t(pack, "world.organization.state"),
        corporation: t(pack, "world.organization.corporation"),
        academia: t(pack, "world.organization.academia"),
        religion: t(pack, "world.organization.religion"),
        underground: t(pack, "world.organization.underground"),
      },
      pressure: 12,
      tags: [],
    },
    relationships: createInitialRelationships(data, pack),
    history: [
      createHistoryEntry({
        id: "opening",
        turn: 0,
        ageMonths: 72,
        text: t(pack, "system.opening", { name: playerName }),
        locKey: "system.opening",
        params: { name: playerName },
        sourceId: "opening",
        sourceType: "system",
      }),
    ],
  };
}

function createInitialRelationships(data: GameData, pack = baseLocalisation[DEFAULT_LOCALE]): Relationship[] {
  return data.names.npcRoles.map((role, index) => ({
    id: role,
    name: `${data.names.given[index + 1] ?? t(pack, "system.fallbackName.given")} ${data.names.family[index + 1] ?? t(pack, "system.fallbackName.family")}`,
    role,
    bond: 10 - index * 3,
    ageMonths: 72 + index * 12,
    educationLevel: "primary",
    careerCategory: "none",
    affiliation: "none",
    lifeTags: [],
    traits: [],
  }));
}
