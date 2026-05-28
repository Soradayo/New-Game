import { useGameStore } from "../../core/useGameStore";
import { t } from "../../localisation";
import { tabLabelKeys, tabs } from "../tabs";
import type { TabKey } from "../tabs";
import { HistoryTab } from "./HistoryTab";
import { InventoryTab } from "./InventoryTab";
import { OrganizationTab } from "./OrganizationTab";
import { RelationshipsTab } from "./RelationshipsTab";
import { WorldStateTab } from "./WorldStateTab";

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
  const state = useGameStore((store) => store.state);

  if (activeTab === "relationships") {
    return <RelationshipsTab />;
  }

  if (activeTab === "organization") {
    return <OrganizationTab />;
  }

  if (activeTab === "inventory") {
    return <InventoryTab />;
  }

  if (activeTab === "world state") {
    return <WorldStateTab />;
  }

  return <HistoryTab history={state.history} />;
}
