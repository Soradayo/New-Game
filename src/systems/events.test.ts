import { describe, expect, it } from "vitest";
import type { EventDefinition, GameState } from "../types/game";
import { createInitialState } from "../core/initialState";
import { baseGameData } from "../data";
import { resolveEvent } from "./events";

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
        template: "not this",
      },
      {
        id: "poor-only",
        category: "daily",
        weight: 1,
        conditions: [{ target: "money", op: "lte", value: 5 }],
        effects: [],
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
        {
          id: "turn-1",
          eventId: "same",
          turn: 1,
          ageMonths: 78,
          text: "same",
          category: "daily",
        },
      ],
    };
    const events: EventDefinition[] = [
      {
        id: "same",
        category: "daily",
        weight: 100,
        conditions: [],
        effects: [],
        template: "same",
      },
      {
        id: "other",
        category: "daily",
        weight: 1,
        conditions: [],
        effects: [],
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
        {
          id: "turn-1",
          eventId: "cooling",
          turn: 2,
          ageMonths: 78,
          text: "cooling",
          category: "daily",
        },
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
        template: "cooling",
      },
      {
        id: "available",
        category: "daily",
        weight: 1,
        conditions: [],
        effects: [],
        template: "available",
      },
    ];

    expect(resolveEvent(state, events, 0.1)?.id).toBe("available");
  });
});
