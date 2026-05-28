import { useState } from "react";
import { useGameStore } from "../../core/useGameStore";
import { t } from "../../localisation";
import type { HistoryEntry } from "../../types/game";
import { historyDiffLabel, historyMetaLabel } from "../historyDisplay";

export function HistoryTab({ history }: { history: HistoryEntry[] }) {
  const pack = useGameStore((store) => store.data.localisation);
  const [openSummaries, setOpenSummaries] = useState<Record<string, boolean>>({});
  const visibleEntries = history.filter((entry) => !entry.hiddenBySummary);

  return (
    <div className="max-h-72 space-y-3 overflow-auto p-4">
      {visibleEntries.map((entry) => {
        const relatedLogs = entry.sourceType === "summary" && entry.summaryGroupId
          ? history.filter((candidate) =>
            candidate.hiddenBySummary &&
            candidate.summaryGroupId === entry.summaryGroupId,
          )
          : [];
        const isOpen = Boolean(entry.summaryGroupId && openSummaries[entry.summaryGroupId]);

        return (
          <article key={entry.id} className="text-sm leading-6 text-zinc-300">
            <HistoryLine entry={entry} />
            {relatedLogs.length > 0 ? (
              <button
                type="button"
                className="summary-toggle-button mt-2"
                onClick={() => {
                  if (!entry.summaryGroupId) return;
                  setOpenSummaries((current) => ({
                    ...current,
                    [entry.summaryGroupId!]: !current[entry.summaryGroupId!],
                  }));
                }}
              >
                {isOpen
                  ? t(pack, "ui.history.collapseSummary")
                  : t(pack, "ui.history.expandSummary", { count: relatedLogs.length })}
              </button>
            ) : null}
            {isOpen ? (
              <div className="mt-2 space-y-2 border-l border-zinc-800 pl-3">
                {[...relatedLogs].reverse().map((related) => (
                  <HistoryLine key={related.id} entry={related} compact />
                ))}
              </div>
            ) : null}
          </article>
        );
      })}
    </div>
  );
}

function HistoryLine({ entry, compact = false }: { entry: HistoryEntry; compact?: boolean }) {
  const pack = useGameStore((store) => store.data.localisation);
  const meta = historyMetaLabel(pack, entry);

  return (
    <p className={`${compact ? "text-xs text-zinc-400" : "text-sm text-zinc-300"} leading-6`}>
      <span className="text-zinc-500">{t(pack, "ui.history.turn", { turn: entry.turn })}</span>{" "}
      {meta ? <span className="text-zinc-600">[{meta}]</span> : null}
      {meta ? " " : null}
      {entry.text}
      {entry.stateDiff && entry.stateDiff.length > 0 ? (
        <span className="ml-2 inline-flex flex-wrap gap-1 align-middle">
          {entry.stateDiff.map((diff, index) => (
            <span key={`${diff.target}-${diff.label ?? "value"}-${index}`} className="border border-zinc-800 px-1.5 py-0.5 text-xs text-zinc-500">
              {historyDiffLabel(pack, diff)}
            </span>
          ))}
        </span>
      ) : null}
    </p>
  );
}
