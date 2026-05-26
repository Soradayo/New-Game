import type {
  AbilityKey,
  CareerCategory,
  EducationLevel,
  EventDefinition,
  LifePhase,
  LocalisationPack,
  OrganizationKind,
  Region,
  SocialClass,
} from "../types/game";
import { t } from "../localisation";

export function lifePhaseLabel(pack: LocalisationPack, value: LifePhase): string {
  return t(pack, `enum.lifePhase.${value}`);
}

export function abilityLabel(pack: LocalisationPack, value: AbilityKey): string {
  return t(pack, `enum.ability.${value}`);
}

export function educationLevelLabel(pack: LocalisationPack, value: EducationLevel): string {
  return t(pack, `enum.education.${value}`);
}

export function careerCategoryLabel(pack: LocalisationPack, value: CareerCategory): string {
  return t(pack, `enum.career.${value}`);
}

export function classLabel(pack: LocalisationPack, value: SocialClass): string {
  return t(pack, `enum.class.${value}`);
}

export function regionLabel(pack: LocalisationPack, value: Region): string {
  return t(pack, `enum.region.${value}`);
}

export function organizationKindLabel(pack: LocalisationPack, value: OrganizationKind): string {
  return t(pack, `enum.organization.${value}`);
}

export function roleLabel(pack: LocalisationPack, value: string): string {
  const translated = t(pack, `enum.role.${value}`);
  return translated.startsWith("missing:") ? value : translated;
}

export function categoryLabel(pack: LocalisationPack, value: EventDefinition["category"] | string): string {
  const translated = t(pack, `enum.category.${value}`);
  return translated.startsWith("missing:") ? value : translated;
}

export function formatMonthsAsAge(pack: LocalisationPack, ageMonths: number): string {
  const years = Math.floor(ageMonths / 12);
  const months = ageMonths % 12;

  if (months === 0) return t(pack, "format.age.years", { years });
  return t(pack, "format.age.yearsMonths", { years, months });
}
