import type { GameData, GameState, TurningPointChoice, TurningPointDefinition } from "../../types/game";
import { t } from "../../localisation";
import { applyEffects } from "../effects";
import { getChoiceAvailability } from "./availability";
import { createChoiceLogs } from "./logs";
import { getPendingTurningPoint } from "./resolver";
import { clamp, unique } from "./utils";

export function applyTurningPointChoice(
  state: GameState,
  data: GameData,
  choiceId: string,
): GameState {
  const turningPoint = getPendingTurningPoint(state, data);
  if (!turningPoint) return state;

  const choice = turningPoint.choices.find((item) => item.id === choiceId);
  if (!choice) {
    throw new Error(t(data.localisation, "system.error.turningChoiceFailed"));
  }

  const availability = getChoiceAvailability(state, choice);
  if (!availability.available) {
    throw new Error(availability.reasons[0] ?? t(data.localisation, "system.error.turningChoiceFailed"));
  }

  let nextState = applyEffects(state, choice.effects);
  nextState = applyChoiceState(nextState, turningPoint, choice);
  nextState = applyNpcOutcomes(nextState, choice);

  const logs = createChoiceLogs(state, nextState, turningPoint, choice, data);

  return {
    ...nextState,
    pendingTurningPoint: null,
    history: [...logs, ...nextState.history].slice(0, 200),
  };
}

function applyChoiceState(
  state: GameState,
  turningPoint: TurningPointDefinition,
  choice: TurningPointChoice,
): GameState {
  const lifeTags = unique([
    ...state.player.lifeTags,
    `turning.${turningPoint.id}.${choice.id}`,
    ...choice.grantsTags,
  ]);

  return {
    ...state,
    player: {
      ...state.player,
      educationLevel: choice.educationLevel ?? state.player.educationLevel,
      careerCategory: choice.careerCategory ?? state.player.careerCategory,
      lifeTags,
    },
  };
}

function applyNpcOutcomes(state: GameState, choice: TurningPointChoice): GameState {
  const outcomes = choice.npcOutcomes ?? [];
  if (outcomes.length === 0) return state;

  return {
    ...state,
    relationships: state.relationships.map((relationship) => {
      const outcome = outcomes.find((item) => item.role === relationship.role || item.role === relationship.id);
      if (!outcome) return relationship;

      return {
        ...relationship,
        educationLevel: outcome.educationLevel ?? relationship.educationLevel,
        careerCategory: outcome.careerCategory ?? relationship.careerCategory,
        bond: clamp(relationship.bond + (outcome.bond ?? 0), -100, 100),
        lifeTags: unique([...relationship.lifeTags, ...(outcome.grantsTags ?? [])]),
      };
    }),
  };
}
