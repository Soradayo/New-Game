import type { GameData, ModData } from "../types/game";

export function mergeGameData(base: GameData, mods: ModData[]): GameData {
  return mods.reduce<GameData>((data, mod) => ({
    actions: mergeById(data.actions, mod.actions),
    stances: mergeById(data.stances, mod.stances),
    events: mergeById(data.events, mod.events),
    items: mergeById(data.items, mod.items),
    names: {
      given: [...data.names.given, ...(mod.names?.given ?? [])],
      family: [...data.names.family, ...(mod.names?.family ?? [])],
      npcRoles: [...data.names.npcRoles, ...(mod.names?.npcRoles ?? [])],
    },
  }), base);
}

export function parseMod(raw: string): ModData {
  return JSON.parse(raw) as ModData;
}

function mergeById<T extends { id: string }>(base: T[], additions: T[] = []): T[] {
  const map = new Map(base.map((item) => [item.id, item]));

  for (const item of additions) {
    map.set(item.id, item);
  }

  return [...map.values()];
}
