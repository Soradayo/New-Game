import type { Condition, EventDefinition, GameState } from "../types/game";

export function resolveEvent(
  state: GameState,
  events: EventDefinition[],
  randomValue: number,
): EventDefinition | null {
  const matchingCandidates = events.filter((event) =>
    event.conditions.every((condition) => matchesCondition(state, condition)) &&
    isOffCooldown(state, event),
  );
  const candidates = avoidImmediateRepeat(matchingCandidates, state.history[0]?.eventId);

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

  const lastOccurrence = state.history.find((entry) => entry.eventId === event.id);
  if (!lastOccurrence) return true;

  return state.turn - lastOccurrence.turn > cooldownTurns;
}

function matchesCondition(state: GameState, condition: Condition): boolean {
  const actual = readConditionValue(state, condition.target);

  switch (condition.op) {
    case "gt":
      return actual > condition.value;
    case "gte":
      return actual >= condition.value;
    case "lt":
      return actual < condition.value;
    case "lte":
      return actual <= condition.value;
    case "eq":
      return actual === condition.value;
  }
}

function readConditionValue(state: GameState, target: Condition["target"]): number {
  if (target === "ageMonths") return state.player.ageMonths;
  if (target === "money") return state.player.money;
  if (target === "world.pressure") return state.world.pressure;

  const stat = target.replace("stats.", "") as keyof typeof state.player.stats;
  return state.player.stats[stat];
}
