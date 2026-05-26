import ja from "./ja.json";
import enTemplate from "./en.template.json";
import type { LocaleCode, LocalisationPack, LocalisationValue } from "../types/game";

export const DEFAULT_LOCALE: LocaleCode = "ja";
export const LOCALE_STORAGE_KEY = "new-game-locale";

export const baseLocalisation: Record<LocaleCode, LocalisationPack> = {
  ja: ja as LocalisationPack,
  en: enTemplate as LocalisationPack,
};

export function getStoredLocale(): LocaleCode {
  if (typeof localStorage === "undefined") return DEFAULT_LOCALE;
  return normalizeLocale(localStorage.getItem(LOCALE_STORAGE_KEY));
}

export function persistLocale(locale: LocaleCode): void {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(LOCALE_STORAGE_KEY, locale);
}

export function normalizeLocale(value: string | null | undefined): LocaleCode {
  return value === "en" ? "en" : "ja";
}

export function mergeLocalisation(
  locale: LocaleCode,
  mods: Array<{ localisation?: Partial<Record<LocaleCode, LocalisationPack>> }>,
): LocalisationPack {
  return mods.reduce<LocalisationPack>(
    (pack, mod) => ({
      ...pack,
      ...(mod.localisation?.[locale] ?? {}),
    }),
    baseLocalisation[locale],
  );
}

export function t(
  pack: LocalisationPack,
  key: string,
  vars: Record<string, string | number> = {},
): string {
  const value = pack[key];
  if (typeof value !== "string" || value.length === 0) return `missing:${key}`;

  return value.replaceAll(/\{([a-zA-Z0-9]+)\}/g, (_, name: string) => String(vars[name] ?? `{${name}}`));
}

export function tList(pack: LocalisationPack, key: string): string[] {
  const value = pack[key];
  return Array.isArray(value) && value.length > 0 ? value : [`missing:${key}`];
}

export function localiseValue(pack: LocalisationPack, value: LocalisationValue | undefined, key: string): LocalisationValue {
  if (value === undefined || value === "" || (Array.isArray(value) && value.length === 0)) {
    return `missing:${key}`;
  }
  return value;
}
