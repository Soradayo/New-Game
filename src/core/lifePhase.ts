import type { LifePhase } from "../types/game";
import { STANDARD_TIME_SCALE } from "./timeScale";

export function getLifePhase(ageMonths: number): LifePhase {
  const ageYears = ageMonths / 12;

  if (ageYears < 12) return "childhood";
  if (ageYears < 18) return "youth";
  if (ageYears < 30) return "youngAdulthood";
  if (ageYears < 65) return "adulthood";
  return "oldAge";
}

export function getTurnMonths(ageMonths: number): number {
  const phase = getLifePhase(ageMonths);

  return STANDARD_TIME_SCALE.turnMonths[phase];
}

export function formatAge(ageMonths: number): string {
  const years = Math.floor(ageMonths / 12);
  const months = ageMonths % 12;

  if (months === 0) return `${years}`;
  return `${years}y ${months}m`;
}
