import { t } from "../localisation";
import type { HistoryEntry, LocalisationPack } from "../types/game";

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
