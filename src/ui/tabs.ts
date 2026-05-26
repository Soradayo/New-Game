export const tabs = ["history", "relationships", "organization", "inventory", "world state"] as const;

export type TabKey = (typeof tabs)[number];

export const tabLabelKeys: Record<TabKey, string> = {
  history: "ui.tabs.history",
  relationships: "ui.tabs.relationships",
  organization: "ui.tabs.organization",
  inventory: "ui.tabs.inventory",
  "world state": "ui.tabs.worldState",
};
