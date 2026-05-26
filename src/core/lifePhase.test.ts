import { describe, expect, it } from "vitest";
import { createInitialState } from "./initialState";
import { getLifePhase, getTurnMonths } from "./lifePhase";
import { isLifeComplete, STANDARD_TIME_SCALE } from "./timeScale";
import { baseGameData } from "../data";

describe("life phase progression", () => {
  it("uses the standard time scale turn speed for each phase", () => {
    expect(getLifePhase(72)).toBe("childhood");
    expect(getTurnMonths(72)).toBe(12);

    expect(getLifePhase(144)).toBe("youth");
    expect(getTurnMonths(144)).toBe(6);

    expect(getLifePhase(216)).toBe("youngAdulthood");
    expect(getTurnMonths(216)).toBe(3);

    expect(getLifePhase(360)).toBe("adulthood");
    expect(getTurnMonths(360)).toBe(4);

    expect(getLifePhase(780)).toBe("oldAge");
    expect(getTurnMonths(780)).toBe(12);
  });

  it("keeps the standard full-life length near 180 turns", () => {
    let ageMonths = createInitialState(baseGameData).player.ageMonths;
    let turns = 0;

    while (!isLifeComplete(ageMonths) && turns < 300) {
      ageMonths = Math.min(ageMonths + getTurnMonths(ageMonths), STANDARD_TIME_SCALE.endAgeMonths);
      turns += 1;
    }

    expect(ageMonths).toBe(STANDARD_TIME_SCALE.endAgeMonths);
    expect(turns).toBeGreaterThanOrEqual(170);
    expect(turns).toBeLessThanOrEqual(190);
  });
});
