import type { GameData, GameState, PendingTurningPoint, TurningPointDefinition } from "../../types/game";
import { matchesCondition } from "../conditions";
import { hasAvailableTurningPointChoice } from "./availability";
import { chooseWeighted, createPendingTurningPoint } from "./utils";

const TURNING_POINT_TRIGGER_CHANCE = 0.35;

export function resolveTurningPoint(
  state: GameState,
  data: GameData,
  randomValue: number,
): PendingTurningPoint | null {
  if (state.pendingTurningPoint) return null;

  const candidates = data.turningPoints.filter((turningPoint) =>
    isTurningPointEligible(state, turningPoint),
  );
  if (candidates.length === 0) return null;

  const guaranteed = candidates.filter((turningPoint) =>
    state.player.ageMonths >= turningPoint.ageWindow.guaranteedByMonths,
  );
  if (guaranteed.length > 0) {
    const selected = chooseWeighted(guaranteed, randomValue);
    return createPendingTurningPoint(selected, state);
  }

  if (randomValue > TURNING_POINT_TRIGGER_CHANCE) return null;

  const selected = chooseWeighted(candidates, randomValue / TURNING_POINT_TRIGGER_CHANCE);
  return createPendingTurningPoint(selected, state);
}

export function getPendingTurningPoint(
  state: GameState,
  data: GameData,
): TurningPointDefinition | null {
  if (!state.pendingTurningPoint) return null;
  return data.turningPoints.find((turningPoint) => turningPoint.id === state.pendingTurningPoint?.id) ?? null;
}

function isTurningPointEligible(state: GameState, turningPoint: TurningPointDefinition): boolean {
  const ageMonths = state.player.ageMonths;
  const alreadyResolved = state.player.lifeTags.some((tag) =>
    tag === `turning.${turningPoint.id}` || tag.startsWith(`turning.${turningPoint.id}.`),
  );

  return !alreadyResolved &&
    ageMonths >= turningPoint.ageWindow.minMonths &&
    ageMonths <= turningPoint.ageWindow.maxMonths &&
    turningPoint.conditions.every((condition) => matchesCondition(state, condition)) &&
    hasAvailableTurningPointChoice(state, turningPoint);
}
