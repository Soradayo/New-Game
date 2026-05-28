import type { GameState, TurningPointChoice, TurningPointDefinition } from "../../types/game";
import { matchesCondition } from "../conditions";

export interface ChoiceAvailability {
  choice: TurningPointChoice;
  available: boolean;
  reasons: string[];
}

export function getChoiceAvailability(
  state: GameState,
  choice: TurningPointChoice,
): ChoiceAvailability {
  const reasons = choice.requirements
    .filter((requirement) => !matchesCondition(state, requirement.condition))
    .map((requirement) => requirement.reason);

  return {
    choice,
    available: reasons.length === 0,
    reasons,
  };
}

export function hasAvailableTurningPointChoice(
  state: GameState,
  turningPoint: TurningPointDefinition,
): boolean {
  return turningPoint.choices.some((choice) => getChoiceAvailability(state, choice).available);
}
