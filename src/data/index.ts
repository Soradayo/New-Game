import actions from "./actions.json";
import events from "./events.json";
import items from "./items.json";
import names from "./names.json";
import stances from "./stances.json";
import traits from "./traits.json";
import type { GameData } from "../types/game";
import { validateGameData } from "../schema/validateGameData";

export const baseGameData = validateGameData({
  actions,
  stances,
  events,
  items,
  traits,
  names,
} as unknown, "base") as GameData;
