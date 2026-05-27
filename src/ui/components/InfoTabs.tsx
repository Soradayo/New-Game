import { useState } from "react";
import { useGameStore } from "../../core/useGameStore";
import { t } from "../../localisation";
import {
  affiliationLabel,
  careerCategoryLabel,
  educationLevelLabel,
  organizationKindLabel,
  regionLabel,
  roleLabel,
  tagLabel,
} from "../display";
import { tabLabelKeys, tabs } from "../tabs";
import type { TabKey } from "../tabs";
import type { GameData, HistoryEntry } from "../../types/game";
import { historyMetaLabel } from "../historyDisplay";

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
            <TagLine label={t(pack, "ui.relationship.affiliation")} values={[affiliationLabel(pack, relationship.affiliation)]} />
            <TagLine label={t(pack, "ui.tags.lifeTags")} values={formatTagIds(pack, relationship.lifeTags)} />
            <TagLine label={t(pack, "ui.tags.traits")} values={formatTraitIds(data, relationship.traits)} />
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
      <div className="space-y-4 p-4">
        <div className="grid gap-3 md:grid-cols-3">
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
        <div className="grid gap-3 md:grid-cols-2">
          <TagBlock label={t(pack, "ui.tags.lifeTags")} values={formatTagIds(pack, state.player.lifeTags)} />
          <TagBlock label={t(pack, "ui.tags.traits")} values={formatTraitIds(data, state.player.traits)} />
        </div>
      </div>
    );
  }

  if (activeTab === "world state") {
    return (
      <div className="space-y-4 p-4">
        <div className="grid gap-3 md:grid-cols-4">
          <InfoItem label={t(pack, "ui.world.nation")} value={state.world.nation} />
          <InfoItem label={t(pack, "ui.world.archetype")} value={state.world.nationArchetype} />
          <InfoItem label={t(pack, "ui.world.region")} value={regionLabel(pack, state.world.region)} />
          <InfoItem label={t(pack, "ui.world.pressure")} value={state.world.pressure.toFixed(1)} />
        </div>
        <TagBlock label={t(pack, "ui.tags.worldTags")} values={formatTagIds(pack, state.world.tags)} />
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

function TagLine({ label, values }: { label: string; values: string[] }) {
  const pack = useGameStore((store) => store.data.localisation);
  const displayValues = values.length > 0 ? values.join(" / ") : t(pack, "ui.tags.empty");

  return (
    <div className="mt-1 text-xs text-zinc-600">
      {label}: {displayValues}
    </div>
  );
}

function TagBlock({ label, values }: { label: string; values: string[] }) {
  const pack = useGameStore((store) => store.data.localisation);

  return (
    <div className="rounded border border-zinc-800 p-3">
      <div className="text-xs uppercase tracking-wide text-zinc-500">{label}</div>
      <div className="mt-2 flex flex-wrap gap-2">
        {values.length > 0 ? values.map((value) => (
          <span key={value} className="border border-zinc-700 px-2 py-1 text-xs text-zinc-300">
            {value}
          </span>
        )) : (
          <span className="text-sm text-zinc-500">{t(pack, "ui.tags.empty")}</span>
        )}
      </div>
    </div>
  );
}

function formatTraitIds(data: GameData, traitIds: string[]): string[] {
  return traitIds.map((id) => data.traits.find((trait) => trait.id === id)?.label ?? id);
}

function formatTagIds(pack: GameData["localisation"], tagIds: string[]): string[] {
  return tagIds.map((id) => tagLabel(pack, id));
}
