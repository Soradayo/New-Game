import { describe, expect, it } from "vitest";
import { createInitialState } from "../core/initialState";
import { baseGameData } from "../data";
import { applyEffects } from "./effects";

describe("effects", () => {
  it("applies player, relationship, world, and inventory effects", () => {
    const state = createInitialState(baseGameData);
    const next = applyEffects(state, [
      { target: "money", value: 5 },
      { target: "stats.mind", value: 3 },
      { target: "relationship.all", value: 2 },
      { target: "world.pressure", value: 4 },
      { target: "inventory.add", value: "worn-tools" },
    ]);

    expect(next.player.money).toBe(state.player.money + 5);
    expect(next.player.stats.mind).toBe(state.player.stats.mind + 3);
    expect(next.relationships[0].bond).toBe(state.relationships[0].bond + 2);
    expect(next.world.pressure).toBe(state.world.pressure + 4);
    expect(next.player.inventory).toContain("worn-tools");
  });
});
