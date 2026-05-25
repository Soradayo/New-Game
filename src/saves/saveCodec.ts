import type { GameState, SavePayload } from "../types/game";

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
    throw new Error("この保存データは古い版のため読み込めません。");
  }

  if (!parsed.player || !parsed.world || !Array.isArray(parsed.history)) {
    throw new Error("保存データに必要な項目がありません。");
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
