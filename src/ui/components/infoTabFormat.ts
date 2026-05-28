import type { GameData } from "../../types/game";
import { tagLabel } from "../display";

export function formatTraitIds(data: GameData, traitIds: string[]): string[] {
  return traitIds.map((id) => data.traits.find((trait) => trait.id === id)?.label ?? id);
}

export function formatTagIds(pack: GameData["localisation"], tagIds: string[]): string[] {
  return tagIds.map((id) => tagLabel(pack, id));
}
