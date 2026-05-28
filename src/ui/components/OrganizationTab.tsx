import { useGameStore } from "../../core/useGameStore";
import { organizationKindLabel } from "../display";

export function OrganizationTab() {
  const { data, state } = useGameStore();
  const pack = data.localisation;

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
