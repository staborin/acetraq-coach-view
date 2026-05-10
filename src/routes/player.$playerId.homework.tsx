import { createFileRoute, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { homework, type Homework } from "@/lib/data";
import { CheckCircle2, AlertCircle, Plus, Minus, Activity } from "lucide-react";

export const Route = createFileRoute("/player/$playerId/homework")({
  component: HomeworkPage,
});

function HomeworkPage() {
  useParams({ from: "/player/$playerId/homework" });
  const [showAdd, setShowAdd] = useState(false);

  const overall = Math.round(
    (homework.reduce((acc, h) => acc + h.done / h.total, 0) / homework.length) * 100,
  );

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-border/60 bg-gradient-to-br from-surface to-surface-2/40 p-4">
        <p className="text-[11px] uppercase tracking-wider text-brand">Homework compliance</p>
        <div className="mt-2 flex items-end justify-between">
          <p className="text-3xl font-semibold">{overall}%</p>
          <span className="inline-flex items-center gap-1 rounded-full bg-rag-amber/15 px-2 py-1 text-[11px] font-medium text-rag-amber">
            <Minus className="h-3 w-3" /> Stable
          </span>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-surface-2">
          <div className="h-full rounded-full bg-brand" style={{ width: `${overall}%` }} />
        </div>
      </section>

      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Active assignments</h3>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="inline-flex items-center gap-1 rounded-full bg-brand px-3 py-1.5 text-xs font-semibold text-brand-foreground"
        >
          <Plus className="h-3.5 w-3.5" /> Add
        </button>
      </div>

      {showAdd && <AddForm onClose={() => setShowAdd(false)} />}

      <ul className="space-y-2.5">
        {homework.map((h) => (
          <HomeworkCard key={h.id} hw={h} />
        ))}
      </ul>

      <section className="rounded-2xl border border-border/60 bg-surface p-4 opacity-80">
        <p className="text-xs font-semibold text-muted-foreground">Archived</p>
        <p className="mt-1 text-[12px] text-muted-foreground">
          Previous assignments will appear here once marked complete.
        </p>
      </section>
    </div>
  );
}

function HomeworkCard({ hw }: { hw: Homework }) {
  const pct = Math.round((hw.done / hw.total) * 100);
  const onTrack = pct >= 70;
  return (
    <li className="rounded-2xl border border-border/60 bg-surface p-3.5">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10 text-brand">
          <Activity className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <p className="text-[13px] font-medium leading-snug">{hw.task}</p>
          <div className="mt-1.5 flex items-center gap-2">
            <span className="rounded-full bg-surface-2 px-2 py-0.5 text-[10px] font-medium">{hw.pillar}</span>
            <span className="text-[10px] text-muted-foreground">{hw.frequency}</span>
          </div>
        </div>
        {onTrack ? (
          <CheckCircle2 className="h-5 w-5 text-rag-green" />
        ) : (
          <AlertCircle className="h-5 w-5 text-rag-amber" />
        )}
      </div>
      <div className="mt-3">
        <div className="mb-1 flex items-center justify-between text-[11px]">
          <span className="text-muted-foreground">This week</span>
          <span className="font-semibold">{hw.done}/{hw.total} completed</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-surface-2">
          <div
            className={`h-full rounded-full ${onTrack ? "bg-rag-green" : "bg-rag-amber"}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </li>
  );
}

function AddForm({ onClose }: { onClose: () => void }) {
  return (
    <div className="rounded-2xl border border-brand/30 bg-brand/5 p-3.5">
      <p className="text-xs font-semibold text-brand">New homework</p>
      <input
        placeholder="Task description"
        className="mt-2 w-full rounded-lg bg-surface p-2 text-[13px] outline-none ring-1 ring-border/60 focus:ring-brand"
      />
      <div className="mt-2 grid grid-cols-2 gap-2">
        <select className="rounded-lg bg-surface p-2 text-[13px] outline-none ring-1 ring-border/60">
          <option>Technical</option>
          <option>Tactical</option>
          <option>Physical</option>
          <option>Mental</option>
        </select>
        <select className="rounded-lg bg-surface p-2 text-[13px] outline-none ring-1 ring-border/60">
          <option>Daily</option>
          <option>3x per week</option>
          <option>5x per week</option>
          <option>Before next session</option>
        </select>
      </div>
      <div className="mt-3 flex gap-2">
        <button onClick={onClose} className="flex-1 rounded-full border border-border py-2 text-xs">
          Cancel
        </button>
        <button onClick={onClose} className="flex-1 rounded-full bg-brand py-2 text-xs font-semibold text-brand-foreground">
          Assign
        </button>
      </div>
    </div>
  );
}
