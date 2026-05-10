import type { RAG } from "@/lib/data";
import { cn } from "@/lib/utils";

const map: Record<RAG, string> = {
  green: "bg-rag-green",
  amber: "bg-rag-amber",
  red: "bg-rag-red",
};

export function RagDot({ rag, size = 10, className }: { rag: RAG; size?: number; className?: string }) {
  return (
    <span
      className={cn("inline-block rounded-full shadow-[0_0_0_2px_rgba(0,0,0,0.18)]", map[rag], className)}
      style={{ width: size, height: size }}
      aria-label={rag}
    />
  );
}

export function RagPill({ rag, label }: { rag: RAG; label?: string }) {
  const text = label ?? (rag === "green" ? "On track" : rag === "amber" ? "Attention" : "Priority");
  const tone =
    rag === "green"
      ? "bg-rag-green/15 text-rag-green border-rag-green/30"
      : rag === "amber"
      ? "bg-rag-amber/15 text-rag-amber border-rag-amber/30"
      : "bg-rag-red/15 text-rag-red border-rag-red/30";
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium", tone)}>
      <RagDot rag={rag} size={7} />
      {text}
    </span>
  );
}
