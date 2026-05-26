import { baseRawGameData } from "../data";
import { DEFAULT_LOCALE, mergeLocalisation } from "../localisation";
import { hydrateGameData } from "../localisation/hydrateGameData";
import { mergeGameData } from "../mods/mergeMods";
import type { GameData, LocaleCode, LocalisationPack, ModData } from "../types/game";

export function createContent(mods: ModData[] = [], locale: LocaleCode = DEFAULT_LOCALE): GameData {
  return hydrateGameData(mergeGameData(baseRawGameData, mods), mergeLocalisation(locale, mods));
}

export function createLocalisationPack(mods: ModData[] = [], locale: LocaleCode = DEFAULT_LOCALE): LocalisationPack {
  return mergeLocalisation(locale, mods);
}
