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
    expect(imported.world.nation).toBe(state.world.nation);
    expect(imported.history[0].text).toBe(state.history[0].text);
    expect(imported.turn).toBe(state.turn);
  });

  it("rejects old save versions so English autosaves do not leak into the Japanese build", () => {
    const oldState = {
      ...createInitialState(baseGameData),
      version: "0.1",
    };

    expect(() => importSave(JSON.stringify(oldState))).toThrow("古い版");
  });
});
