import { useState } from "react";
import { useGameStore } from "../../core/useGameStore";
import { t } from "../../localisation";
import {
  careerCategoryLabel,
  educationLevelLabel,
  organizationKindLabel,
  regionLabel,
  roleLabel,
} from "../display";
import { tabLabelKeys, tabs } from "../tabs";
import type { TabKey } from "../tabs";
import type { HistoryEntry } from "../../types/game";

export function InfoTabs({
  activeTab,
  onTabChange,
}: {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
}) {
  const pack = useGameStore((store) => store.data.localisation);

  return (
    <section className="rounded border border-zinc-800 bg-zinc-900/70">
      <div className="flex flex-wrap border-b border-zinc-800">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`tab-button ${activeTab === tab ? "tab-button-active" : ""}`}
            onClick={() => onTabChange(tab)}
          >
            {t(pack, tabLabelKeys[tab])}
          </button>
        ))}
      </div>
      <TabContent activeTab={activeTab} />
    </section>
  );
}

function TabContent({ activeTab }: { activeTab: TabKey }) {
  const { data, state } = useGameStore();
  const pack = data.localisation;

  if (activeTab === "relationships") {
    return (
      <div className="grid gap-3 p-4 md:grid-cols-3">
        {state.relationships.map((relationship) => (
          <div key={relationship.id} className="rounded border border-zinc-800 p-3">
            <div className="font-medium">{relationship.name}</div>
            <div className="text-sm text-zinc-500">{roleLabel(pack, relationship.role)}</div>
            <div className="mt-2 text-sm">{t(pack, "ui.relationship.bond", { value: relationship.bond.toFixed(0) })}</div>
            <div className="mt-1 text-xs text-zinc-500">
              {educationLevelLabel(pack, relationship.educationLevel)} / {careerCategoryLabel(pack, relationship.careerCategory)}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (activeTab === "organization") {
    return (
      <div className="grid gap-2 p-4 md:grid-cols-2">
        {Object.entries(state.world.organizations).map(([kind, name]) => (
          <div key={kind} className="flex justify-between gap-4 text-sm">
            <span className="text-zinc-500">{organizationKindLabel(pack, kind as keyof typeof state.world.organizations)}</span>
            <span>{name}</span>
          </div>
        ))}
      </div>
    );
  }

  if (activeTab === "inventory") {
    return (
      <div className="grid gap-3 p-4 md:grid-cols-3">
        {state.player.inventory.map((itemId) => {
          const item = data.items.find((entry) => entry.id === itemId);
          return (
            <div key={itemId} className="rounded border border-zinc-800 p-3">
              <div className="font-medium">{item?.label ?? itemId}</div>
              <div className="mt-1 text-sm text-zinc-500">{item?.description ?? t(pack, "ui.inventory.unknown")}</div>
            </div>
          );
        })}
      </div>
    );
  }

  if (activeTab === "world state") {
    return (
      <div className="grid gap-3 p-4 md:grid-cols-4">
        <InfoItem label={t(pack, "ui.world.nation")} value={state.world.nation} />
        <InfoItem label={t(pack, "ui.world.archetype")} value={state.world.nationArchetype} />
        <InfoItem label={t(pack, "ui.world.region")} value={regionLabel(pack, state.world.region)} />
        <InfoItem label={t(pack, "ui.world.pressure")} value={state.world.pressure.toFixed(1)} />
      </div>
    );
  }

  return <HistoryList history={state.history} />;
}

function HistoryList({ history }: { history: HistoryEntry[] }) {
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
                className="mt-1 text-xs text-zinc-400 underline decoration-zinc-700 underline-offset-4 hover:text-zinc-100"
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

  return (
    <p className={`${compact ? "text-xs text-zinc-400" : "text-sm text-zinc-300"} leading-6`}>
      <span className="text-zinc-500">{t(pack, "ui.history.turn", { turn: entry.turn })}</span>{" "}
      <span className="text-zinc-600">
        [{t(pack, `enum.historySource.${entry.sourceType}`)} / {t(pack, `enum.importance.${entry.importance}`)}]
      </span>{" "}
      {entry.text}
    </p>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wide text-zinc-500">{label}</div>
      <div className="text-sm font-medium text-zinc-100">{value}</div>
    </div>
  );
}
