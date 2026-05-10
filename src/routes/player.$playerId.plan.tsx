import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { RagDot, RagPill } from "@/components/Rag";
import { developmentPlan, getPlayer, PILLARS, type RAG, type Pillar } from "@/lib/data";
import { useParams } from "@tanstack/react-router";
import { ChevronDown, Plus } from "lucide-react";

export const Route = createFileRoute("/player/$playerId/plan")({
  component: PlanPage,
});

const cycle: Record<RAG, RAG> = { green: "amber", amber: "red", red: "green" };

function PlanPage() {
  const { playerId } = useParams({ from: "/player/$playerId/plan" });
  const player = getPlayer(playerId)!;
  const [open, setOpen] = useState<Pillar | null>("Technical");
  const [statuses, setStatuses] = useState(() => {
    const init: Record<string, RAG> = {};
    PILLARS.forEach((p) => developmentPlan[p].forEach((t) => (init[t.id] = t.status)));
    return init;
  });

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border/60 bg-surface p-4">
        <p className="text-[11px] uppercase tracking-wider text-brand">Development plan</p>
        <h2 className="mt-1 text-base font-semibold">{player.firstName}'s current targets</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          The spine of the development programme — every session, tournament and review references these targets.
        </p>
      </div>

      {PILLARS.map((p) => {
        const isOpen = open === p;
        return (
          <section key={p} className="overflow-hidden rounded-2xl border border-border/60 bg-surface">
            <button
              onClick={() => setOpen(isOpen ? null : p)}
              className="flex w-full items-center justify-between p-4 text-left"
            >
              <div className="flex items-center gap-3">
                <RagDot rag={player.pillars[p]} size={12} />
                <div>
                  <p className="text-sm font-semibold">{p}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {developmentPlan[p].length} active targets
                  </p>
                </div>
              </div>
              <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </button>

            {isOpen && (
              <div className="border-t border-border/60 bg-surface-2/30 p-3">
                <ul className="space-y-2">
                  {developmentPlan[p].map((t) => {
                    const status = statuses[t.id];
                    return (
                      <li key={t.id} className="rounded-xl bg-surface p-3 ring-1 ring-border/40">
                        <div className="flex items-start gap-2">
                          <button
                            onClick={() =>
                              setStatuses((s) => ({ ...s, [t.id]: cycle[status] }))
                            }
                            className="mt-0.5"
                            aria-label="Cycle status"
                          >
                            <RagDot rag={status} size={12} />
                          </button>
                          <div className="flex-1">
                            <p className="text-[13px] leading-snug">{t.text}</p>
                            <div className="mt-2 flex items-center gap-2">
                              <RagPill rag={status} />
                              <span className="text-[10px] text-muted-foreground">Set {t.setOn}</span>
                            </div>
                            {t.notes && (
                              <p className="mt-2 rounded-md bg-surface-2 p-2 text-[11px] italic text-muted-foreground">
                                {t.notes}
                              </p>
                            )}
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
                <button className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border/80 py-2 text-xs font-medium text-muted-foreground hover:bg-surface-2">
                  <Plus className="h-3.5 w-3.5" /> Add {p.toLowerCase()} target
                </button>
              </div>
            )}
          </section>
        );
      })}

      <section className="rounded-2xl border border-border/60 bg-surface p-4">
        <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Quarterly review</p>
        <div className="mt-2 flex items-center justify-between text-sm">
          <div>
            <p className="font-medium">Last review · March 2026</p>
            <p className="text-[11px] text-muted-foreground">Next due · June 2026</p>
          </div>
          <button className="rounded-full bg-brand px-3 py-1.5 text-xs font-semibold text-brand-foreground">
            Start review
          </button>
        </div>
      </section>
    </div>
  );
}
