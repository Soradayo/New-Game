import { t } from "../localisation";
import type { HistoryEntry, HistoryStateDiff, LocalisationPack } from "../types/game";

export function historyMetaLabel(pack: LocalisationPack, entry: HistoryEntry): string | null {
  if (!shouldShowHistoryMeta(entry)) return null;

  const source = t(pack, `enum.historySource.${entry.sourceType}`);
  const importance = t(pack, `enum.importance.${entry.importance}`);
  return `${source} / ${importance}`;
}

function shouldShowHistoryMeta(entry: HistoryEntry): boolean {
  return entry.sourceType !== "event" ||
    entry.importance === "major" ||
    entry.importance === "turningPoint";
}

export function historyDiffLabel(pack: LocalisationPack, diff: HistoryStateDiff): string {
  const labelKey = diff.label ? `enum.historyDiff.${diff.label}` : `enum.historyDiff.${diff.target}`;
  const translated = t(pack, labelKey);
  const label = translated.startsWith("missing:") ? diff.label ?? diff.target : translated;
  const delta = typeof diff.delta === "number" && diff.delta > 0 ? `+${diff.delta}` : diff.delta;

  if (delta !== undefined) return `${label} ${delta}`;
  if (diff.after !== undefined) return `${label}: ${diff.after}`;
  return label;
}
