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

  return (
    <div className="max-h-72 space-y-3 overflow-auto p-4">
      {state.history.map((entry) => (
        <p key={entry.id} className="text-sm leading-6 text-zinc-300">
          <span className="text-zinc-500">{t(pack, "ui.history.turn", { turn: entry.turn })}</span> {entry.text}
        </p>
      ))}
    </div>
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
