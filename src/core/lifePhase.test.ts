import { describe, expect, it } from "vitest";
import { getLifePhase, getTurnMonths } from "./lifePhase";

describe("life phase progression", () => {
  it("uses the configured turn speed for each phase", () => {
    expect(getLifePhase(72)).toBe("childhood");
    expect(getTurnMonths(72)).toBe(6);

    expect(getLifePhase(144)).toBe("youth");
    expect(getTurnMonths(144)).toBe(3);

    expect(getLifePhase(216)).toBe("youngAdulthood");
    expect(getTurnMonths(216)).toBe(0.5);

    expect(getLifePhase(360)).toBe("adulthood");
    expect(getTurnMonths(360)).toBe(1);

    expect(getLifePhase(780)).toBe("oldAge");
    expect(getTurnMonths(780)).toBe(12);
  });
});
