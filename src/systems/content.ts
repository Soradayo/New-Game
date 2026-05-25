import { baseGameData } from "../data";
import { mergeGameData } from "../mods/mergeMods";
import type { GameData, ModData } from "../types/game";

export function createContent(mods: ModData[] = []): GameData {
  return mergeGameData(baseGameData, mods);
}
