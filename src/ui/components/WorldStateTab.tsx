import { useGameStore } from "../../core/useGameStore";
import { t } from "../../localisation";
import { regionLabel } from "../display";
import { InfoItem } from "./InfoItem";
import { formatTagIds } from "./infoTabFormat";
import { TagBlock } from "./TagBlock";

export function WorldStateTab() {
  const { data, state } = useGameStore();
  const pack = data.localisation;

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
