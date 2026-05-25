import type { LifePhase } from "../types/game";

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

  const monthsByPhase: Record<LifePhase, number> = {
    childhood: 6,
    youth: 3,
    youngAdulthood: 0.5,
    adulthood: 1,
    oldAge: 12,
  };

  return monthsByPhase[phase];
}

export function formatAge(ageMonths: number): string {
  const years = Math.floor(ageMonths / 12);
  const months = ageMonths % 12;

  if (months === 0) return `${years}`;
  return `${years}y ${months}m`;
}
