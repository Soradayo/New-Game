import { useGameStore } from "../../core/useGameStore";
import { t } from "../../localisation";
import { formatTagIds, formatTraitIds } from "./infoTabFormat";
import { TagBlock } from "./TagBlock";

export function InventoryTab() {
  const { data, state } = useGameStore();
  const pack = data.localisation;

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
