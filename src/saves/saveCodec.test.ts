import { describe, expect, it } from "vitest";
import { createInitialState } from "../core/initialState";
import { baseGameData } from "../data";
import { exportSave, importSave, SAVE_VERSION } from "./saveCodec";

describe("save codec", () => {
  it("exports and imports the main game state", () => {
    const state = createInitialState(baseGameData);
    const imported = importSave(exportSave(state));

    expect(imported.version).toBe(SAVE_VERSION);
    expect(imported.player.name).toBe(state.player.name);
    expect(imported.player.educationLevel).toBe("primary");
    expect(imported.player.careerCategory).toBe("none");
    expect(imported.player.affiliation).toBe("none");
    expect(imported.player.traits).toEqual([]);
    expect(imported.pendingTurningPoint).toBeNull();
    expect(imported.world.nation).toBe(state.world.nation);
    expect(imported.world.tags).toEqual([]);
    expect(imported.relationships[0].affiliation).toBe(state.relationships[0].affiliation);
    expect(imported.relationships[0].traits).toEqual([]);
    expect(imported.history[0].text).toBe(state.history[0].text);
    expect(imported.history[0].sourceType).toBe("system");
    expect(imported.history[0].sourceId).toBe("opening");
    expect(imported.turn).toBe(state.turn);
  });

  it("rejects old save versions so stale autosaves do not leak into the new structure", () => {
    const oldState = {
      ...createInitialState(baseGameData),
      version: "0.5-causality",
    };

    expect(() => importSave(JSON.stringify(oldState))).toThrow();
  });

  it("rejects saves without structured history fields", () => {
    const oldState = {
      ...createInitialState(baseGameData),
      version: SAVE_VERSION,
      history: [
        {
          id: "old",
          turn: 0,
          ageMonths: 72,
          text: "old",
        },
      ],
    };

    expect(() => importSave(JSON.stringify(oldState))).toThrow();
  });

  it("rejects saves without causality fields", () => {
    const state = createInitialState(baseGameData);
    const invalidState = {
      ...state,
      player: {
        ...state.player,
        traits: undefined,
      },
    };

    expect(() => importSave(JSON.stringify(invalidState))).toThrow();
  });

  it("rejects saves with non-string tags and traits", () => {
    const state = createInitialState(baseGameData);
    const invalidState = {
      ...state,
      player: {
        ...state.player,
        traits: [42],
      },
    };

    expect(() => importSave(JSON.stringify(invalidState))).toThrow();
  });

  it("rejects saves with empty affiliations", () => {
    const state = createInitialState(baseGameData);
    const invalidState = {
      ...state,
      relationships: state.relationships.map((relationship, index) =>
        index === 0 ? { ...relationship, affiliation: "" } : relationship,
      ),
    };

    expect(() => importSave(JSON.stringify(invalidState))).toThrow();
  });
});
