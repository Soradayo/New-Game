import actions from "./actions.json";
import events from "./events.json";
import items from "./items.json";
import names from "./names.json";
import stances from "./stances.json";
import type { GameData } from "../types/game";

export const baseGameData = {
  actions,
  stances,
  events,
  items,
  names,
} as unknown as GameData;
