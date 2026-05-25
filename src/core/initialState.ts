import type { GameData, GameState, Relationship } from "../types/game";
import { SAVE_VERSION } from "../saves/saveCodec";

export function createInitialState(data: GameData): GameState {
  const playerName = `${data.names.given[0]} ${data.names.family[0]}`;

  return {
    version: SAVE_VERSION,
    turn: 0,
    selectedActionId: data.actions[0]?.id ?? "study",
    selectedStanceId: data.stances[0]?.id ?? "cautious",
    player: {
      name: playerName,
      ageMonths: 72,
      socialClass: "worker",
      affiliation: "なし",
      money: 12,
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
      nation: "ヴェイル",
      nationArchetype: "商業国家",
      region: "industrial",
      organizations: {
        state: "市民登記局",
        corporation: "メロウ工業",
        academia: "ロー・ホール学院",
        religion: "灯火教会",
        underground: "赤い糸",
      },
      pressure: 12,
    },
    relationships: createInitialRelationships(data),
    history: [
      {
        id: "opening",
        turn: 0,
        ageMonths: 72,
        text: `${playerName}は、名前と地区と、まだ意味のわからない負債を持って始まる。`,
        category: "daily",
      },
    ],
  };
}

function createInitialRelationships(data: GameData): Relationship[] {
  return data.names.npcRoles.map((role, index) => ({
    id: role,
    name: `${data.names.given[index + 1] ?? "レン"} ${data.names.family[index + 1] ?? "ヴェイル"}`,
    role,
    bond: 10 - index * 3,
  }));
}
