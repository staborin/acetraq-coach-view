import type { Pillar, RAG } from "@/lib/data";
import { PILLARS } from "@/lib/data";

const ragValue: Record<RAG, number> = { green: 0.95, amber: 0.6, red: 0.3 };
const ragColor: Record<RAG, string> = {
  green: "var(--rag-green)",
  amber: "var(--rag-amber)",
  red: "var(--rag-red)",
};

export function PillarRadar({ pillars, size = 220 }: { pillars: Record<Pillar, RAG>; size?: number }) {
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 28;

  // angles: top=Technical, right=Tactical, bottom=Physical, left=Mental
  const angles: Record<Pillar, number> = {
    Technical: -Math.PI / 2,
    Tactical: 0,
    Physical: Math.PI / 2,
    Mental: Math.PI,
  };

  const pointFor = (pillar: Pillar, val: number) => {
    const a = angles[pillar];
    return [cx + Math.cos(a) * r * val, cy + Math.sin(a) * r * val];
  };

  const polyPoints = PILLARS.map((p) => pointFor(p, ragValue[pillars[p]]).join(",")).join(" ");

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
      {/* grid */}
      {[0.33, 0.66, 1].map((g, i) => (
        <polygon
          key={i}
          points={PILLARS.map((p) => pointFor(p, g).join(",")).join(" ")}
          fill="none"
          stroke="var(--border)"
          strokeOpacity={0.7}
        />
      ))}
      {/* axes */}
      {PILLARS.map((p) => {
        const [x, y] = pointFor(p, 1);
        return <line key={p} x1={cx} y1={cy} x2={x} y2={y} stroke="var(--border)" strokeOpacity={0.5} />;
      })}
      {/* shape */}
      <polygon
        points={polyPoints}
        fill="color-mix(in oklab, var(--brand) 28%, transparent)"
        stroke="var(--brand)"
        strokeWidth={2}
      />
      {/* points */}
      {PILLARS.map((p) => {
        const [x, y] = pointFor(p, ragValue[pillars[p]]);
        return <circle key={p} cx={x} cy={y} r={4.5} fill={ragColor[pillars[p]]} stroke="white" strokeWidth={1.5} />;
      })}
      {/* labels */}
      {PILLARS.map((p) => {
        const [x, y] = pointFor(p, 1.22);
        return (
          <text
            key={p}
            x={x}
            y={y}
            fill="currentColor"
            fontSize={11}
            fontWeight={600}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-foreground"
          >
            {p}
          </text>
        );
      })}
    </svg>
  );
}
