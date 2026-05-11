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

// Radar / spider chart — 4 pillars
function RadarChart({ rags, size = 220, plan }) {
  const cx = size/2, cy = size/2;
  const ringR = [size*0.18, size*0.30, size*0.42];
  const outerR = size*0.42;
  // angles, top -> right -> bottom -> left
  const labels = [
    { k: 'tech', label: 'Technical', ang: -90, color: PillarColor.tech },
    { k: 'tac',  label: 'Tactical',  ang: 0,   color: PillarColor.tac },
    { k: 'phy',  label: 'Physical',  ang: 90,  color: PillarColor.phy },
    { k: 'men',  label: 'Mental',    ang: 180, color: PillarColor.men },
  ];
  // map RAG to value: r=0.45, a=0.7, g=1.0
  const v = (s) => s === 'g' ? 1.0 : s === 'a' ? 0.65 : 0.35;
  const pts = labels.map(l => {
    const r = outerR * v(rags[l.k]);
    const a = (l.ang * Math.PI) / 180;
    return { x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r, color: l.color, ...l };
  });
  const polyPts = pts.map(p => `${p.x},${p.y}`).join(' ');
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size}>
        {ringR.map((r, i) => (
          <circle key={i} cx={cx} cy={cy} r={r} fill="none"
            stroke={i === 2 ? T.borderHi : T.border} strokeDasharray={i === 2 ? '0' : '2 4'}/>
        ))}
        {/* axes */}
        {labels.map((l, i) => {
          const a = (l.ang * Math.PI) / 180;
          return <line key={i} x1={cx} y1={cy}
            x2={cx + Math.cos(a) * outerR} y2={cy + Math.sin(a) * outerR}
            stroke={T.border}/>;
        })}
        <polygon points={polyPts} fill={T.teal + '24'} stroke={T.teal} strokeWidth="1.5"/>
        {pts.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="5" fill={p.color}
            stroke={T.bg} strokeWidth="2"/>
        ))}
      </svg>
      {/* labels positioned around outside */}
      {labels.map((l, i) => {
        const a = (l.ang * Math.PI) / 180;
        const lx = cx + Math.cos(a) * (outerR + 22);
        const ly = cy + Math.sin(a) * (outerR + 22);
        const txt = plan[l.k];
        return (
          <div key={i} style={{
            position: 'absolute', left: lx, top: ly, transform: 'translate(-50%, -50%)',
            textAlign: 'center', minWidth: 70,
          }}>
            <div className="at-eyebrow" style={{ fontSize: 9, color: l.color, letterSpacing: '0.1em' }}>{l.label}</div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 3,
              padding: '2px 7px', borderRadius: 999,
              background: T.surface, border: `1px solid ${T.border}`,
            }}>
              <RAG s={txt.rag} size={6}/>
              <span className="at-mono" style={{ fontSize: 9.5, color: T.text, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {txt.rag === 'g' ? 'On track' : txt.rag === 'a' ? 'Watch' : 'Priority'}
              </span>
            </div>
          </div>
        );
      })}
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
          <RadarChart rags={{ tech: p.tech, tac: p.tac, phy: p.phy, men: p.men }}
            size={230} plan={{
              tech: plan.tech, tac: plan.tac, phy: plan.phy, men: plan.men,
            }}/>
        </div>

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
            ['plan',   'target',   'Development Plan',  '8 active targets'],
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
          { l: 'On track', v: 4, c: T.green },
          { l: 'Watch',    v: 3, c: T.amber },
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
                            <div style={{ fontSize: 13, color: T.text, lineHeight: 1.35 }}>{t.text}</div>
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

Object.assign(window, { PlayerSubTabs, PLAYER_TABS, PlayerDashboard, DevPlan, RadarChart, SessionRow });
