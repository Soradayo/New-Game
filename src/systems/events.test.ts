import { describe, expect, it } from "vitest";
import type { EventDefinition, GameState } from "../types/game";
import { createInitialState } from "../core/initialState";
import { baseGameData } from "../data";
import { resolveEvent } from "./events";
import { createHistoryEntry } from "./history";

describe("event resolver", () => {
  it("excludes events with unmet conditions", () => {
    const state: GameState = {
      ...createInitialState(baseGameData),
      player: {
        ...createInitialState(baseGameData).player,
        money: 3,
      },
    };
    const events: EventDefinition[] = [
      {
        id: "rich-only",
        category: "daily",
        weight: 100,
        conditions: [{ target: "money", op: "gte", value: 100 }],
        effects: [],
        templateKey: "test.rich",
        template: "not this",
      },
      {
        id: "poor-only",
        category: "daily",
        weight: 1,
        conditions: [{ target: "money", op: "lte", value: 5 }],
        effects: [],
        templateKey: "test.poor",
        template: "this",
      },
    ];

    expect(resolveEvent(state, events, 0.1)?.id).toBe("poor-only");
  });

  it("avoids immediately repeating the previous event when alternatives exist", () => {
    const state: GameState = {
      ...createInitialState(baseGameData),
      turn: 2,
      history: [
        createHistoryEntry({
          id: "turn-1",
          turn: 1,
          ageMonths: 78,
          text: "same",
          sourceId: "same",
          sourceType: "event",
        }),
      ],
    };
    const events: EventDefinition[] = [
      {
        id: "same",
        category: "daily",
        weight: 100,
        conditions: [],
        effects: [],
        templateKey: "test.same",
        template: "same",
      },
      {
        id: "other",
        category: "daily",
        weight: 1,
        conditions: [],
        effects: [],
        templateKey: "test.other",
        template: "other",
      },
    ];

    expect(resolveEvent(state, events, 0.1)?.id).toBe("other");
  });

  it("respects event cooldown windows", () => {
    const state: GameState = {
      ...createInitialState(baseGameData),
      turn: 3,
      history: [
        createHistoryEntry({
          id: "turn-1",
          turn: 2,
          ageMonths: 78,
          text: "cooling",
          sourceId: "cooling",
          sourceType: "event",
        }),
      ],
    };
    const events: EventDefinition[] = [
      {
        id: "cooling",
        category: "daily",
        weight: 100,
        cooldownTurns: 2,
        conditions: [],
        effects: [],
        templateKey: "test.cooling",
        template: "cooling",
      },
      {
        id: "available",
        category: "daily",
        weight: 1,
        conditions: [],
        effects: [],
        templateKey: "test.available",
        template: "available",
      },
    ];

    expect(resolveEvent(state, events, 0.1)?.id).toBe("available");
  });
});
