import { describe, expect, it } from "vitest";
import { createInitialState } from "../core/initialState";
import { baseGameData } from "../data";
import { matchesCondition } from "./conditions";

describe("conditions", () => {
  it("evaluates all, any, and not condition groups", () => {
    const state = createInitialState(baseGameData);

    expect(matchesCondition(state, {
      all: [
        { target: "ageMonths", op: "gte", value: 72 },
        { target: "money", op: "gt", value: 0 },
      ],
    })).toBe(true);

    expect(matchesCondition(state, {
      any: [
        { target: "money", op: "lt", value: 0 },
        { target: "educationLevel", op: "eq", value: "primary" },
      ],
    })).toBe(true);

    expect(matchesCondition(state, {
      not: { target: "world.tags", op: "has", value: "war" },
    })).toBe(true);
  });

  it("evaluates numeric, string, and list conditions", () => {
    const baseState = createInitialState(baseGameData);
    const state = {
      ...baseState,
      player: {
        ...baseState.player,
        lifeTags: ["turning.first-school-crossroad.night-study"],
        traits: ["observant"],
      },
      world: {
        ...baseState.world,
        tags: ["strike-rumor"],
      },
      relationships: baseState.relationships.map((relationship) =>
        relationship.id === "mentor"
          ? {
            ...relationship,
            affiliation: "school",
            traits: ["stubborn"],
          }
          : relationship,
      ),
    };

    expect(matchesCondition(state, { target: "relationship.mentor.bond", op: "gte", value: 4 })).toBe(true);
    expect(matchesCondition(state, { target: "careerCategory", op: "eq", value: "none" })).toBe(true);
    expect(matchesCondition(state, { target: "world.region", op: "neq", value: "capital" })).toBe(true);
    expect(matchesCondition(state, { target: "player.lifeTags", op: "has", value: "turning.first-school-crossroad.night-study" })).toBe(true);
    expect(matchesCondition(state, { target: "player.traits", op: "has", value: "observant" })).toBe(true);
    expect(matchesCondition(state, { target: "relationship.mentor.affiliation", op: "eq", value: "school" })).toBe(true);
    expect(matchesCondition(state, { target: "relationship.mentor.traits", op: "has", value: "stubborn" })).toBe(true);
    expect(matchesCondition(state, { target: "world.tags", op: "notHas", value: "plague" })).toBe(true);
  });

  it("keeps affiliation as a stable internal id", () => {
    const state = createInitialState(baseGameData);

    expect(state.player.affiliation).toBe("none");
    expect(state.relationships[0].affiliation).toBe("none");
    expect(matchesCondition(state, { target: "affiliation", op: "eq", value: "none" })).toBe(true);
  });

  it("does not satisfy neq conditions for missing relationships", () => {
    const state = createInitialState(baseGameData);

    expect(matchesCondition(state, {
      target: "relationship.mod-only.affiliation",
      op: "neq",
      value: "school",
    })).toBe(false);
  });
});
