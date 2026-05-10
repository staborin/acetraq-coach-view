import { createFileRoute, useParams } from "@tanstack/react-router";
import { AppLink } from "@/components/AppLink";
import { tournaments } from "@/lib/data";
import { Trophy, ChevronRight, MapPin, Calendar } from "lucide-react";

export const Route = createFileRoute("/player/$playerId/tournaments/")({
  component: TournamentsPage,
});

const stateMeta: Record<string, { label: string; cls: string }> = {
  "set-goals": { label: "Set Goals", cls: "bg-brand text-brand-foreground" },
  "in-progress": { label: "In Progress", cls: "bg-rag-amber/15 text-rag-amber" },
  review: { label: "Review", cls: "bg-rag-amber text-background" },
  reviewed: { label: "Reviewed", cls: "bg-rag-green/15 text-rag-green" },
};

function TournamentsPage() {
  const { playerId } = useParams({ from: "/player/$playerId/tournaments" });

  return (
    <div className="space-y-3">
      <div className="rounded-2xl border border-border/60 bg-surface p-4">
        <p className="text-[11px] uppercase tracking-wider text-brand">Tournaments</p>
        <h2 className="mt-1 text-base font-semibold">Set goals & review competition</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Each tournament moves through a lifecycle: set goals → parent charts → coach reviews.
        </p>
      </div>

      <ul className="space-y-2.5">
        {tournaments.map((t) => {
          const meta = stateMeta[t.state];
          return (
            <li key={t.id}>
              <AppLink
                to={`/player/${playerId}/tournaments/${t.id}`}
                className="block rounded-2xl border border-border/60 bg-surface p-4"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand/10 text-brand">
                    <Trophy className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{t.name}</p>
                    <div className="mt-1 flex items-center gap-3 text-[11px] text-muted-foreground">
                      <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" />{t.date}</span>
                      <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{t.venue}</span>
                    </div>
                    {t.results && (
                      <p className="mt-1 text-[11px] font-medium text-foreground/80">{t.results}</p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${meta.cls}`}>
                      {meta.label}
                    </span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </AppLink>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
