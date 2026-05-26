import type { ModData, RawGameData } from "../types/game";
import { parseAndValidateMod } from "../schema/validateGameData";

export function mergeGameData(base: RawGameData, mods: ModData[]): RawGameData {
  return mods.reduce<RawGameData>((data, mod) => ({
    actions: mergeById(data.actions, mod.actions),
    stances: mergeById(data.stances, mod.stances),
    events: mergeById(data.events, mod.events),
    items: mergeById(data.items, mod.items),
    traits: mergeById(data.traits, mod.traits),
    turningPoints: mergeById(data.turningPoints, mod.turningPoints),
    names: {
      npcRoles: [...data.names.npcRoles, ...(mod.names?.npcRoles ?? [])],
    },
    localisation: {
      ja: {
        ...(data.localisation?.ja ?? {}),
        ...(mod.localisation?.ja ?? {}),
      },
      en: {
        ...(data.localisation?.en ?? {}),
        ...(mod.localisation?.en ?? {}),
      },
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
