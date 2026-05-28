import { describe, expect, it } from "vitest";
import { createInitialState } from "../core/initialState";
import { baseGameData } from "../data";
import { resolveEvent } from "./events";
import { getNpcInteractionAvailability, performNpcInteraction } from "./npcInteractions";

describe("NPC interactions", () => {
  it("applies relationship, player, money, and log effects", () => {
    const state = createInitialState(baseGameData);
    const next = performNpcInteraction(state, baseGameData, "sibling", "support");
    const before = state.relationships.find((relationship) => relationship.id === "sibling")!;
    const after = next.relationships.find((relationship) => relationship.id === "sibling")!;

    expect(next.player.money).toBe(state.player.money - 1);
    expect(next.player.lifeTags).toContain("npc.supporter");
    expect(after.bond).toBe(before.bond + 2);
    expect(after.trust).toBe(before.trust + 2);
    expect(after.dependency).toBe(before.dependency + 1);
    expect(after.lifeTags).toContain("npc.supported");
    expect(after.lastInteractionTurn).toBe(state.turn);
    expect(next.history[0].sourceType).toBe("npcInteraction");
    expect(next.history[0].sourceId).toBe("sibling:support");
    expect(next.history[0].locKey).toBe("npcInteraction.support.log");
  });

  it("prevents repeated interaction with the same NPC in one turn", () => {
    const state = createInitialState(baseGameData);
    const next = performNpcInteraction(state, baseGameData, "sibling", "support");

    expect(() => performNpcInteraction(next, baseGameData, "sibling", "consult")).toThrow();
    expect(getNpcInteractionAvailability(next, "sibling", baseGameData.npcInteractions[1]).available).toBe(false);
  });

  it("uses target conditions for the selected NPC", () => {
    const state = createInitialState(baseGameData);
    const cover = baseGameData.npcInteractions.find((interaction) => interaction.id === "cover")!;

    expect(getNpcInteractionAvailability(state, "neighbor", cover).available).toBe(false);
    expect(getNpcInteractionAvailability(state, "sibling", cover).available).toBe(true);
  });

  it("lets follow-up events see NPC interaction tags", () => {
    const state = createInitialState(baseGameData);
    const next = performNpcInteraction(state, baseGameData, "sibling", "support");
    const events = baseGameData.events.filter((event) =>
      event.id === "npc-supported-return" || event.id === "workshop-burn",
    );

    expect(resolveEvent(next, events, 0.1)?.id).toBe("npc-supported-return");
  });
});
