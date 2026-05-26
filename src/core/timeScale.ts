import type { LifePhase } from "../types/game";

export interface TimeScaleProfile {
  id: "standard";
  label: string;
  endAgeMonths: number;
  maxFastForwardTurns: number;
  turnMonths: Record<LifePhase, number>;
}

export const STANDARD_TIME_SCALE: TimeScaleProfile = {
  id: "standard",
  label: "標準",
  endAgeMonths: 80 * 12,
  maxFastForwardTurns: 120,
  turnMonths: {
    childhood: 12,
    youth: 6,
    youngAdulthood: 3,
    adulthood: 4,
    oldAge: 12,
  },
};

export function isLifeComplete(ageMonths: number): boolean {
  return ageMonths >= STANDARD_TIME_SCALE.endAgeMonths;
}
