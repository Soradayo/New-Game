import type { GameData, ModData } from "../types/game";
import { parseAndValidateMod } from "../schema/validateGameData";

export function mergeGameData(base: GameData, mods: ModData[]): GameData {
  return mods.reduce<GameData>((data, mod) => ({
    actions: mergeById(data.actions, mod.actions),
    stances: mergeById(data.stances, mod.stances),
    events: mergeById(data.events, mod.events),
    items: mergeById(data.items, mod.items),
    traits: mergeById(data.traits, mod.traits),
    turningPoints: mergeById(data.turningPoints, mod.turningPoints),
    names: {
      given: [...data.names.given, ...(mod.names?.given ?? [])],
      family: [...data.names.family, ...(mod.names?.family ?? [])],
      npcRoles: [...data.names.npcRoles, ...(mod.names?.npcRoles ?? [])],
    },
  }), base);
}

export function parseMod(raw: string): ModData {
  return parseAndValidateMod(raw);
}

function mergeById<T extends { id: string }>(base: T[], additions: T[] = []): T[] {
  const map = new Map(base.map((item) => [item.id, item]));

  for (const item of additions) {
    map.set(item.id, item);
  }

  return [...map.values()];
}
