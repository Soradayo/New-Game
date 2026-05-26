import type { GameState, SavePayload } from "../types/game";
import { baseLocalisation, DEFAULT_LOCALE, t } from "../localisation";

export const SAVE_VERSION = "0.3-ja";

export function exportSave(state: GameState): string {
  const payload: SavePayload = {
    ...state,
    version: SAVE_VERSION,
  };

  return JSON.stringify(payload, null, 2);
}

export function importSave(raw: string): GameState {
  const parsed = JSON.parse(raw) as Partial<SavePayload>;

  if (parsed.version !== SAVE_VERSION) {
    throw new Error(t(baseLocalisation[DEFAULT_LOCALE], "system.error.oldSave"));
  }

  if (!parsed.player || !parsed.world || !Array.isArray(parsed.history)) {
    throw new Error(t(baseLocalisation[DEFAULT_LOCALE], "system.error.invalidSave"));
  }

  return {
    version: parsed.version ?? SAVE_VERSION,
    turn: parsed.turn ?? 0,
    selectedActionId: parsed.selectedActionId ?? "study",
    selectedStanceId: parsed.selectedStanceId ?? "cautious",
    pendingTurningPoint: parsed.pendingTurningPoint ?? null,
    player: parsed.player,
    world: parsed.world,
    relationships: parsed.relationships ?? [],
    history: parsed.history,
  };
}
