import type { GameState, SavePayload } from "../types/game";
import { baseLocalisation, DEFAULT_LOCALE, t } from "../localisation";

export const SAVE_VERSION = "0.6-causality-hardening";

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

  if (
    !parsed.player ||
    !parsed.world ||
    !isCausalityPlayer(parsed.player) ||
    !isCausalityWorld(parsed.world) ||
    !Array.isArray(parsed.relationships) ||
    !isCausalityRelationships(parsed.relationships) ||
    !Array.isArray(parsed.history) ||
    !isStructuredHistory(parsed.history)
  ) {
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
    relationships: parsed.relationships,
    history: parsed.history,
  };
}

function isCausalityPlayer(player: unknown): boolean {
  return (
    typeof player === "object" &&
    player !== null &&
    typeof (player as { affiliation?: unknown }).affiliation === "string" &&
    (player as { affiliation: string }).affiliation.length > 0 &&
    isStringArray((player as { lifeTags?: unknown }).lifeTags) &&
    isStringArray((player as { traits?: unknown }).traits)
  );
}

function isCausalityWorld(world: unknown): boolean {
  return (
    typeof world === "object" &&
    world !== null &&
    isStringArray((world as { tags?: unknown }).tags)
  );
}

function isCausalityRelationships(relationships: unknown[]): boolean {
  return relationships.every((relationship) =>
    typeof relationship === "object" &&
    relationship !== null &&
    typeof (relationship as { affiliation?: unknown }).affiliation === "string" &&
    (relationship as { affiliation: string }).affiliation.length > 0 &&
    isStringArray((relationship as { lifeTags?: unknown }).lifeTags) &&
    isStringArray((relationship as { traits?: unknown }).traits)
  );
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function isStructuredHistory(history: unknown[]): boolean {
  return history.every((entry) =>
    typeof entry === "object" &&
    entry !== null &&
    typeof (entry as { id?: unknown }).id === "string" &&
    typeof (entry as { turn?: unknown }).turn === "number" &&
    typeof (entry as { ageMonths?: unknown }).ageMonths === "number" &&
    typeof (entry as { text?: unknown }).text === "string" &&
    typeof (entry as { sourceId?: unknown }).sourceId === "string" &&
    typeof (entry as { sourceType?: unknown }).sourceType === "string" &&
    typeof (entry as { importance?: unknown }).importance === "string"
  );
}
