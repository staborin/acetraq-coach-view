// AceTraq — Player Dashboard + Development Plan + Sessions list (player-scoped)

// Sub-tabs used inside a player
const PLAYER_TABS = [
  { id: 'dash',  label: 'Overview' },
  { id: 'plan',  label: 'Dev Plan' },
  { id: 'sess',  label: 'Sessions' },
  { id: 'fb',    label: 'Feedback' },
  { id: 'tour',  label: 'Tournaments' },
  { id: 'hw',    label: 'Homework' },
];

function PlayerSubTabs({ active, onChange }) {
  return (
    <div className="at-scroll" style={{
      display: 'flex', gap: 4, padding: '0 16px 12px',
      overflowX: 'auto', position: 'sticky', top: STATUS_BAR_H + 50,
      background: T.bg, zIndex: 4, borderBottom: `1px solid ${T.border}`,
    }}>
      {PLAYER_TABS.map(t => (
        <button key={t.id} onClick={() => onChange(t.id)} className="at-tap" style={{
          padding: '7px 12px', borderRadius: 999,
          background: active === t.id ? T.teal : 'transparent',
          color: active === t.id ? '#04231D' : T.textDim,
          border: active === t.id ? 'none' : `1px solid ${T.border}`,
          fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap',
        }}>{t.label}</button>
      ))}
    </div>
  );
}

// Radar / spider chart — 8 axes, 4 pillar wedges with 3D dividers
function RadarChart({ pid, size = 280 }) {
  const axes = PLAYER_AXES[pid] || PLAYER_AXES.tom;
  const cx = size / 2, cy = size / 2;
  const outerR = size * 0.36;
  const ringR = [outerR * 0.33, outerR * 0.66, outerR];
  const n = 8;
  const step = (2 * Math.PI) / n;
  const startAng = -Math.PI / 2; // top

  const ang = (i) => startAng + i * step;
  const pt = (a, r) => ({ x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r });

  // Each pillar = 2 axes = 90° wedge
  const pillarWedges = [
    { start: 0, k: 'tech' },
    { start: 2, k: 'tac' },
    { start: 4, k: 'phy' },
    { start: 6, k: 'men' },
  ];

  const ragColor = (s) => s === 'g' ? T.green : s === 'a' ? T.amber : T.red;

  // Wedge path (90° sector)
  const wedgePath = (fromIdx) => {
    const a1 = ang(fromIdx) - step / 2;
    const a2 = ang(fromIdx + 1) + step / 2;
    const r = outerR + 8;
    const p1 = pt(a1, r);
    const p2 = pt(a2, r);
    return `M${cx},${cy} L${p1.x},${p1.y} A${r},${r} 0 0 1 ${p2.x},${p2.y} Z`;
  };

  // Alternating wedge shades for subtle distinction
  const wedgeShades = ['rgba(255,255,255,0.04)', 'rgba(255,255,255,0.08)'];

  // Data polygon
  const dataPts = axes.map((a, i) => pt(ang(i), outerR * (a.value / 100)));
  const polyStr = dataPts.map(p => `${p.x},${p.y}`).join(' ');

  // Divider angles (between pillar boundaries)
  const divAngles = pillarWedges.map(w => ang(w.start) - step / 2);

  return (
    <div style={{ position: 'relative', width: size, height: size, margin: '0 auto' }}>
      <svg width={size} height={size}>
        <defs>
          {/* Glow filter for 3D dividers */}
          <filter id="divGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur"/>
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          {/* Drop shadow for wedge edges */}
          <filter id="wedgeShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="rgba(0,0,0,0.5)"/>
          </filter>
        </defs>

        {/* Wedge backgrounds */}
        {pillarWedges.map((w, i) => (
          <path key={i} d={wedgePath(w.start)}
            fill={wedgeShades[i % 2]} stroke="none" />
        ))}

        {/* Concentric grid rings */}
        {ringR.map((r, i) => (
          <circle key={i} cx={cx} cy={cy} r={r} fill="none"
            stroke="rgba(255,255,255,0.10)" strokeWidth={i === 2 ? 1.2 : 0.6}
            strokeDasharray={i < 2 ? '3 5' : '0'} />
        ))}

        {/* Axis lines (thin) */}
        {axes.map((a, i) => {
          const end = pt(ang(i), outerR);
          return <line key={i} x1={cx} y1={cy} x2={end.x} y2={end.y}
            stroke="rgba(255,255,255,0.06)" strokeWidth={0.5} />;
        })}

        {/* 3D pillar divider lines — shadow layer */}
        {divAngles.map((a, i) => {
          const end = pt(a, outerR + 10);
          return <line key={'s' + i} x1={cx} y1={cy} x2={end.x} y2={end.y}
            stroke="rgba(0,0,0,0.6)" strokeWidth={4} />;
        })}
        {/* 3D pillar divider lines — highlight layer */}
        {divAngles.map((a, i) => {
          const end = pt(a, outerR + 10);
          return <line key={'h' + i} x1={cx} y1={cy} x2={end.x} y2={end.y}
            stroke="rgba(255,255,255,0.25)" strokeWidth={1.5} />;
        })}

        {/* Data polygon */}
        <polygon points={polyStr} fill={T.teal + '30'} stroke={T.teal} strokeWidth={2} />

        {/* Data points with RAG-colored dots */}
        {dataPts.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r={6} fill={ragColor(axes[i].rag)} opacity={0.25} />
            <circle cx={p.x} cy={p.y} r={4} fill={ragColor(axes[i].rag)}
              stroke={T.bg} strokeWidth={1.5} />
          </g>
        ))}
      </svg>

      {/* Sub-category labels (small, near axes) */}
      {axes.map((a, i) => {
        const lp = pt(ang(i), outerR + 20);
        return (
          <div key={i} style={{
            position: 'absolute', left: lp.x, top: lp.y,
            transform: 'translate(-50%, -50%)', textAlign: 'center',
            pointerEvents: 'none', whiteSpace: 'nowrap',
          }}>
            <div style={{
              fontSize: 9, fontWeight: 500, color: T.textDim,
              letterSpacing: '0.02em',
            }}>{a.label}</div>
          </div>
        );
      })}

      {/* Pillar labels (large, bold, outside) */}
      {pillarWedges.map((w, i) => {
        const midAng = ang(w.start + 0.5); // midpoint between the 2 axes
        const lp = pt(midAng, outerR + 42);
        const labels = { tech: 'TECHNICAL', tac: 'TACTICAL', phy: 'PHYSICAL', men: 'MENTAL' };
        return (
          <div key={i} style={{
            position: 'absolute', left: lp.x, top: lp.y,
            transform: 'translate(-50%, -50%)', textAlign: 'center',
            pointerEvents: 'none',
          }}>
            <div style={{
              fontSize: 9, fontWeight: 800, letterSpacing: '0.16em',
              color: PillarColor[w.k],
            }}>{labels[w.k]}</div>
          </div>
        );
      })}
    </div>
  );
}

// Status pill grid — 2×4 below radar
function SubCategoryPills({ pid }) {
  const axes = PLAYER_AXES[pid] || PLAYER_AXES.tom;
  const ragColor = (s) => s === 'g' ? T.green : s === 'a' ? T.amber : T.red;
  // Group by pillar for visual grouping
  const pillars = ['tech', 'tac', 'phy', 'men'];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, padding: '0 20px' }}>
      {axes.map((a, i) => (
        <div key={i} style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: T.card, border: `1px solid ${T.border}`,
          borderRadius: 10, padding: '8px 11px',
        }}>
          <span style={{
            width: 8, height: 8, borderRadius: 999,
            background: ragColor(a.rag), flexShrink: 0,
          }} />
          <span style={{ fontSize: 11.5, fontWeight: 600, color: T.text, flex: 1 }}>{a.label}</span>
          <span style={{
            fontSize: 9, fontWeight: 600,
            color: ragColor(a.rag), textTransform: 'uppercase',
          }}>
            {a.rag === 'g' ? 'On track' : a.rag === 'a' ? 'Watch' : 'Priority'}
          </span>
        </div>
      ))}
    </div>
  );
}

// Player Dashboard
function PlayerDashboard({ pid, onTab, onSession }) {
  const [showParents, setShowParents] = React.useState(false);
  const p = PLAYERS.find(x => x.id === pid);
  const plan = TOM_PLAN; // demo: same plan shape for any player
  const upcoming = TOM_SESSIONS.filter(s => s.upcoming && !s.cancelled).slice(0, 2);
  return (
    <div className="at-fadein" style={{ paddingBottom: 18 }}>
      {/* hero header */}
      <div style={{ padding: '8px 20px 18px', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: -40,
          background: `radial-gradient(closest-side, ${T.teal}1A, transparent 70%)`,
          pointerEvents: 'none',
        }}/>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14, position: 'relative' }}>
          <Avatar name={p.name} size={64}/>
          <div style={{ flex: 1 }}>
            <div className="at-h1" style={{ fontSize: 22 }}>{p.name}</div>
            <div className="at-meta" style={{ marginTop: 2, fontSize: 12 }}>
              <span style={{ color: T.text }}>{p.group}</span> · age {p.age} · {p.alerts} items need attention
            </div>
          </div>
        </div>

        {/* radar */}
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', padding: '4px 0 8px' }}>
          <RadarChart pid={pid} size={260}/>
        </div>

        {/* 8-axis status pills */}
        <SubCategoryPills pid={pid}/>

        {/* current phase summary */}
        <div className="at-card" style={{ padding: 14, marginTop: 8 }}>
          <div className="at-eyebrow" style={{ marginBottom: 6 }}>CURRENT PHASE · APR – JUN 26</div>
          <div style={{ fontSize: 13.5, lineHeight: 1.5, color: T.text }}>
            Transitioning <b style={{ color: T.teal }}>net play</b> from drills into match situations.
            Conditioning programme started for endurance in third sets.
            Mental focus on between-point routine and body language under pressure.
          </div>
        </div>
      </div>

      {/* quick stats */}
      <div style={{ padding: '0 20px 16px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
        {[
          { l: 'Last session',  v: 'Tue 6 May',         s: '60-min · forehand block' },
          { l: 'Next session',  v: 'Tue 13 May',        s: '4:00 PM · confirmed', c: T.teal },
          { l: 'Last tourney',  v: 'Kent Junior Open',  s: '3 May · 1W 1L' },
          { l: 'Homework',      v: '78%',               s: 'compliance · stable', mono: true },
        ].map((s, i) => (
          <div key={i} className="at-card" style={{ padding: 11 }}>
            <div className="at-eyebrow" style={{ fontSize: 9 }}>{s.l}</div>
            <div className={s.mono ? 'at-num' : ''} style={{
              fontSize: s.mono ? 22 : 14, fontWeight: s.mono ? 700 : 600,
              color: s.c || T.text, marginTop: 3, lineHeight: 1.15,
            }}>{s.v}</div>
            <div className="at-meta" style={{ fontSize: 10.5, marginTop: 2 }}>{s.s}</div>
          </div>
        ))}
      </div>

      {/* sub-page links */}
      <div style={{ padding: '0 20px 16px' }}>
        <div className="at-h3" style={{ marginBottom: 10 }}>Jump to</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
          {[
            ['plan',   'target',   'Development Plan',  '10 active targets'],
            ['fb',     'mic',      'Session Feedback',  '12 logs'],
            ['sess',   'calendar', 'Sessions',          '6 this month'],
            ['tour',   'trophy',   'Tournaments',       '3 · 1 to review'],
            ['hw',     'book',     'Homework',          '3 active · 78%'],
            ['parent', 'user',     'Parent Details',    'Phone · WhatsApp · Email'],
          ].map(([id, ic, label, sub]) => (
            <button key={id} onClick={() => id === 'parent' ? setShowParents(true) : onTab(id)} className="at-tap" style={{
              textAlign: 'left', background: T.card, border: `1px solid ${T.border}`,
              borderRadius: 14, padding: '12px 12px', color: T.text,
              display: 'flex', flexDirection: 'column', gap: 6,
            }}>
              <div style={{
                width: 30, height: 30, borderRadius: 8,
                background: T.cardHi, color: T.teal,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon name={ic} size={16} color={T.teal}/>
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{label}</div>
              <div className="at-meta" style={{ fontSize: 10.5 }}>{sub}</div>
            </button>
          ))}
        </div>
      </div>

      {/* upcoming sessions condensed */}
      <div style={{ padding: '0 20px 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
          <div className="at-h3">Upcoming sessions</div>
          <button onClick={() => onTab('sess')} style={{
            background: 'none', border: 'none', color: T.teal, fontSize: 12, fontWeight: 600,
            display: 'flex', alignItems: 'center', gap: 2,
          }}>View all <Icon name="chevR" size={12} color={T.teal}/></button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {upcoming.map(s => <SessionRow key={s.id} s={s} onTap={() => onSession(s.id)}/>)}
        </div>
      </div>

      {/* recent activity */}
      <div style={{ padding: '0 20px 16px' }}>
        <div className="at-h3" style={{ marginBottom: 10 }}>Recent activity</div>
        <div className="at-card" style={{ padding: '6px 0' }}>
          {TOM_RECENT.map((r, i) => {
            const iconMap = { feedback: 'mic', tournament: 'trophy', homework: 'book', session: 'calendar' };
            return (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px',
                borderTop: i === 0 ? 'none' : `1px solid ${T.border}`,
              }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                  background: T.cardHi, color: T.textDim,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}><Icon name={iconMap[r.kind]} size={13}/></div>
                <div style={{ flex: 1, fontSize: 13, color: T.text }}>{r.text}</div>
                <div className="at-mono" style={{ fontSize: 10.5, color: T.textMute }}>{r.when}</div>
              </div>
            );
          })}
        </div>
      </div>

      {showParents && (
        <ModalShell onClose={() => setShowParents(false)}>
          <div className="at-eyebrow">PARENT DETAILS</div>
          <div className="at-h2" style={{ marginTop: 4 }}>{p.name.split(' ')[0]}'s parents</div>
          <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { name: p.id === 'tom' ? 'Sarah Henderson' : p.id === 'mia' ? 'Raj Patel' : p.id === 'alex' ? 'Helen Roberts' : `${p.name.split(' ')[1]} parent`, rel: 'Primary contact',
                phone: p.id === 'tom' ? '+44 7700 900142' : p.id === 'mia' ? '+44 7700 900388' : '+44 7700 900221',
                email: p.id === 'tom' ? 'sarah.h@example.co.uk' : p.id === 'mia' ? 'raj.patel@example.co.uk' : `${p.name.split(' ')[1].toLowerCase()}@example.co.uk`,
              },
            ].map((c, i) => (
              <div key={i} style={{
                background: T.cardHi, border: `1px solid ${T.border}`,
                borderRadius: 12, padding: 14,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <Avatar name={c.name} size={38}/>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: T.text }}>{c.name}</div>
                    <div className="at-meta" style={{ fontSize: 11 }}>{c.rel}</div>
                  </div>
                </div>
                {[
                  ['Phone', c.phone, 'wave'],
                  ['WhatsApp', c.phone, 'msg'],
                  ['Email', c.email, 'send'],
                ].map(([l, v, ic], j) => (
                  <div key={j} style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '9px 0',
                    borderTop: j === 0 ? `1px solid ${T.border}` : `1px solid ${T.border}`,
                  }}>
                    <div style={{
                      width: 30, height: 30, borderRadius: 8,
                      background: T.teal + '1F', color: T.teal,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}><Icon name={ic} size={14} color={T.teal}/></div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="at-eyebrow" style={{ fontSize: 9 }}>{l}</div>
                      <div style={{ fontSize: 13, color: T.text, fontWeight: 600, marginTop: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{v}</div>
                    </div>
                    <button style={{
                      padding: '6px 11px', borderRadius: 8,
                      background: T.teal, color: '#04231D', border: 'none',
                      fontSize: 11, fontWeight: 700,
                    }}>{l === 'Email' ? 'Mail' : 'Open'}</button>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </ModalShell>
      )}
    </div>
  );
}

// Reusable session row (used on dashboard + session tracker)
function SessionRow({ s, onTap, onConfirm, onCancel }) {
  return (
    <div style={{
      background: T.card, border: `1px solid ${T.border}`, borderRadius: 12,
      padding: '11px 13px', display: 'flex', gap: 12, alignItems: 'center',
      opacity: s.cancelled ? 0.55 : 1,
    }}>
      <div style={{
        width: 44, textAlign: 'center', flexShrink: 0,
        background: T.cardHi, borderRadius: 9, padding: '6px 0',
      }}>
        <div className="at-mono" style={{ fontSize: 9, color: T.textMute, fontWeight: 600, letterSpacing: '0.08em' }}>{s.day.toUpperCase()}</div>
        <div className="at-num" style={{ fontSize: 16, color: T.text, fontWeight: 700, lineHeight: 1 }}>{s.date.split(' ')[0]}</div>
        <div className="at-mono" style={{ fontSize: 8.5, color: T.textMute, textTransform: 'uppercase' }}>{s.date.split(' ')[1]}</div>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="at-num" style={{
          fontSize: 13, color: T.text, fontWeight: 600,
          textDecoration: s.cancelled ? 'line-through' : 'none',
        }}>{s.time}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 4 }}>
          <RAG s={s.rag} size={7}/>
          <span style={{ fontSize: 11, color: T.textDim }}>{s.status}</span>
          <span style={{ width: 3, height: 3, borderRadius: 999, background: T.textMute }}/>
          <span style={{
            fontSize: 11, color: s.paid ? T.green : T.amber, fontWeight: 600,
            display: 'inline-flex', alignItems: 'center', gap: 3,
          }}>
            <Icon name={s.paid ? 'check' : 'pound'} size={11}/>
            {s.paid ? 'Paid' : 'Unpaid'}
          </span>
        </div>
      </div>
      {onConfirm && !s.cancelled && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {s.rag === 'a' && <button onClick={onConfirm} style={{
            background: T.teal, color: '#04231D', border: 'none',
            padding: '5px 9px', borderRadius: 7, fontSize: 11, fontWeight: 700,
          }}>Confirm</button>}
          <button onClick={onCancel} style={{
            background: 'transparent', color: T.red, border: `1px solid ${T.red}40`,
            padding: '4px 8px', borderRadius: 7, fontSize: 10, fontWeight: 600,
          }}>Cancel</button>
        </div>
      )}
    </div>
  );
}

// Development Plan
function DevPlan({ pid }) {
  const plan = TOM_PLAN;
  const [open, setOpen] = React.useState({ tech: true, tac: true, phy: false, men: true });
  const [statusOverrides, setStatusOverrides] = React.useState({});
  const cycle = (id, cur) => {
    const order = ['g', 'a', 'r'];
    const next = order[(order.indexOf(statusOverrides[id] || cur) + 1) % 3];
    setStatusOverrides(s => ({ ...s, [id]: next }));
  };

  return (
    <div className="at-fadein" style={{ paddingBottom: 18 }}>
      <div style={{ padding: '14px 20px 8px' }}>
        <div className="at-eyebrow">DEVELOPMENT PLAN · Q2 2026</div>
        <div className="at-h2" style={{ marginTop: 4 }}>The spine of Tom's training.</div>
        <div className="at-body" style={{ marginTop: 4, fontSize: 13 }}>
          Targets across all four pillars. Tap to update status. Reviewed quarterly.
        </div>
      </div>

      {/* progress overview */}
      <div style={{ padding: '8px 20px 4px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
        {[
          { l: 'On track', v: 3, c: T.green },
          { l: 'Watch',    v: 6, c: T.amber },
          { l: 'Priority', v: 1, c: T.red },
        ].map((s, i) => (
          <div key={i} className="at-card" style={{ padding: '10px 12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 7, height: 7, borderRadius: 999, background: s.c }}/>
              <span className="at-eyebrow" style={{ fontSize: 9 }}>{s.l}</span>
            </div>
            <div className="at-num" style={{ fontSize: 22, fontWeight: 700, color: T.text, marginTop: 2 }}>{s.v}</div>
          </div>
        ))}
      </div>

      {/* pillars */}
      <div style={{ padding: '14px 20px 6px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {['tech', 'tac', 'phy', 'men'].map(k => {
          const pill = plan[k];
          const isOpen = open[k];
          return (
            <div key={k} className="at-card" style={{ overflow: 'hidden' }}>
              <button onClick={() => setOpen(o => ({ ...o, [k]: !o[k] }))} style={{
                width: '100%', textAlign: 'left', padding: 14,
                background: 'transparent', border: 'none', color: T.text,
                display: 'flex', alignItems: 'center', gap: 11,
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: PillarColor[k] + '1A',
                  border: `1px solid ${PillarColor[k]}30`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: PillarColor[k], fontSize: 11, fontWeight: 700,
                }}>{ {tech: 'TEC', tac: 'TAC', phy: 'PHY', men: 'MEN'}[k] }</div>
                <div style={{ flex: 1 }}>
                  <div className="at-h3" style={{ color: T.text }}>{PillarLabel[k]}</div>
                  <div className="at-meta" style={{ marginTop: 2 }}>{pill.focus}</div>
                </div>
                <RAG s={pill.rag} size={9} ring/>
                <Icon name={isOpen ? 'chevU' : 'chevD'} size={16} color={T.textMute}/>
              </button>
              {isOpen && (
                <div style={{ padding: '0 12px 12px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {pill.targets.map(t => {
                    const rag = statusOverrides[t.id] || t.rag;
                    return (
                      <div key={t.id} style={{
                        background: T.cardHi, border: `1px solid ${T.border}`,
                        borderRadius: 11, padding: 11,
                      }}>
                        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                          <button onClick={() => cycle(t.id, t.rag)} style={{
                            width: 26, height: 26, borderRadius: 8, flexShrink: 0,
                            background: (rag === 'g' ? T.green : rag === 'a' ? T.amber : T.red) + '20',
                            border: `1px solid ${(rag === 'g' ? T.green : rag === 'a' ? T.amber : T.red)}40`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}>
                            <RAG s={rag} size={10}/>
                          </button>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 13, color: T.text, lineHeight: 1.35 }}>
                              {t.text}
                              {t.sub && SUB_LABELS[t.sub] && (
                                <span style={{
                                  marginLeft: 6, fontSize: 9.5, fontWeight: 600,
                                  padding: '2px 6px', borderRadius: 4,
                                  background: PillarColor[k] + '1A', color: PillarColor[k],
                                  verticalAlign: 'middle',
                                }}>{SUB_LABELS[t.sub]}</span>
                              )}
                            </div>
                            <div className="at-meta" style={{ marginTop: 4, fontSize: 11, display: 'flex', gap: 8 }}>
                              <span>set {t.date}</span>
                              {t.notes && <span style={{ color: T.textDim, fontStyle: 'italic' }}>· "{t.notes}"</span>}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <button style={{
                    background: 'transparent', border: `1px dashed ${T.borderHi}`,
                    color: T.textDim, padding: '9px', borderRadius: 10,
                    fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
                  }}>
                    <Icon name="plus" size={13}/> Add target to {PillarLabel[k]}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* quarterly review */}
      <div style={{ padding: '16px 20px 6px' }}>
        <div className="at-card" style={{
          padding: 16, display: 'flex', gap: 12, alignItems: 'center',
          background: `linear-gradient(135deg, ${T.cardHi}, ${T.card})`,
        }}>
          <div style={{
            width: 44, height: 44, borderRadius: 11,
            background: T.teal + '1F', color: T.teal,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}><Icon name="sparkle" size={20}/></div>
          <div style={{ flex: 1 }}>
            <div className="at-h3">Quarterly review</div>
            <div className="at-meta" style={{ marginTop: 2 }}>Last: 12 Mar 2026 · Next due 12 Jun</div>
          </div>
          <button style={{
            background: T.teal, color: '#04231D', border: 'none',
            padding: '8px 12px', borderRadius: 9, fontSize: 12, fontWeight: 700,
          }}>Start</button>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { PlayerSubTabs, PLAYER_TABS, PlayerDashboard, DevPlan, RadarChart, SubCategoryPills, SessionRow });
