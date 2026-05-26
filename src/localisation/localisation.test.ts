import { describe, expect, it } from "vitest";
import { baseRawGameData } from "../data";
import { createContent } from "../systems/content";
import { hydrateGameData } from "./hydrateGameData";
import { baseLocalisation, t } from ".";

describe("localisation", () => {
  it("hydrates base content from ja localisation", () => {
    const data = hydrateGameData(baseRawGameData, baseLocalisation.ja);

    expect(data.actions[0].label).toBe("学ぶ");
    expect(data.events[0].template).toContain("工場の鐘");
    expect(data.turningPoints[0].choices[0].outcomeSummary).toContain("学びの時間");
    expect(data.names.given[0]).toBe("イラ");
  });

  it("shows missing keys for untranslated values", () => {
    expect(t(baseLocalisation.en, "ui.header.name")).toBe("missing:ui.header.name");

    const data = createContent([], "en");
    expect(data.actions[0].label).toBe("missing:action.study.label");
  });
});
