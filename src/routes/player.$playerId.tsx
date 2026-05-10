import { createFileRoute, Outlet, useParams } from "@tanstack/react-router";
import { MobileShell, PageHeader } from "@/components/MobileShell";
import { PlayerTabs } from "@/components/PlayerTabs";
import { getPlayer } from "@/lib/data";

export const Route = createFileRoute("/player/$playerId")({
  component: PlayerLayout,
});

function PlayerLayout() {
  const { playerId } = useParams({ from: "/player/$playerId" });
  const player = getPlayer(playerId);

  if (!player) {
    return (
      <MobileShell header={<PageHeader title="Not found" showBack />}>
        <p className="mt-8 text-center text-sm text-muted-foreground">Player not found.</p>
      </MobileShell>
    );
  }

  return (
    <MobileShell header={<PageHeader title={player.name} subtitle={`${player.ageGroup} · Age ${player.age}`} showBack />}>
      <PlayerTabs playerId={playerId} />
      <div className="pt-4">
        <Outlet />
      </div>
    </MobileShell>
  );
}
