import actions from "./actions.json";
import events from "./events.json";
import items from "./items.json";
import names from "./names.json";
import npcInteractions from "./npcInteractions.json";
import stances from "./stances.json";
import traits from "./traits.json";
import turningPoints from "./turningPoints.json";
import type { RawGameData } from "../types/game";
import { validateGameData } from "../schema/validateGameData";
import { baseLocalisation, DEFAULT_LOCALE } from "../localisation";
import { hydrateGameData } from "../localisation/hydrateGameData";

export const baseRawGameData = validateGameData({
  actions,
  stances,
  events,
  items,
  traits,
  turningPoints,
  names,
  npcInteractions,
} as unknown, "base") as RawGameData;

export const baseGameData = hydrateGameData(baseRawGameData, baseLocalisation[DEFAULT_LOCALE]);
