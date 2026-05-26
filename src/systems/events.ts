import type { EventDefinition, GameState } from "../types/game";
import { matchesCondition } from "./conditions";

export function resolveEvent(
  state: GameState,
  events: EventDefinition[],
  randomValue: number,
): EventDefinition | null {
  const matchingCandidates = events.filter((event) =>
    event.conditions.every((condition) => matchesCondition(state, condition)) &&
    isOffCooldown(state, event),
  );
  const lastEventSourceId = state.history.find((entry) => entry.sourceType === "event")?.sourceId;
  const candidates = avoidImmediateRepeat(matchingCandidates, lastEventSourceId);

  const totalWeight = candidates.reduce((sum, event) => sum + event.weight, 0);
  if (totalWeight <= 0) return null;

  let cursor = randomValue * totalWeight;

  for (const event of candidates) {
    cursor -= event.weight;
    if (cursor <= 0) return event;
  }

  return candidates.at(-1) ?? null;
}

function avoidImmediateRepeat(
  events: EventDefinition[],
  lastEventId: string | undefined,
): EventDefinition[] {
  if (!lastEventId || events.length <= 1) return events;

  const withoutLastEvent = events.filter((event) => event.id !== lastEventId);
  return withoutLastEvent.length > 0 ? withoutLastEvent : events;
}

function isOffCooldown(state: GameState, event: EventDefinition): boolean {
  const cooldownTurns = event.cooldownTurns ?? 0;
  if (cooldownTurns <= 0) return true;

  const lastOccurrence = state.history.find((entry) =>
    entry.sourceType === "event" && entry.sourceId === event.id,
  );
  if (!lastOccurrence) return true;

  return state.turn - lastOccurrence.turn > cooldownTurns;
}
