import type { GameState, PendingTurningPoint, TurningPointDefinition } from "../../types/game";

export function chooseWeighted(
  candidates: TurningPointDefinition[],
  randomValue: number,
): TurningPointDefinition {
  const totalWeight = candidates.reduce((sum, turningPoint) => sum + turningPoint.weight, 0);
  let cursor = randomValue * totalWeight;

  for (const turningPoint of candidates) {
    cursor -= turningPoint.weight;
    if (cursor <= 0) return turningPoint;
  }

  return candidates.at(-1) ?? candidates[0];
}

export function createPendingTurningPoint(
  turningPoint: TurningPointDefinition,
  state: GameState,
): PendingTurningPoint {
  return {
    id: turningPoint.id,
    turn: state.turn,
    ageMonths: state.player.ageMonths,
  };
}

export function unique(values: string[]): string[] {
  return [...new Set(values)];
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
