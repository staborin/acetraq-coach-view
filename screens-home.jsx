// AceTraq — Home (Squad Overview) + bottom nav + app chrome
// Mobile-first 390-px viewport.

const STATUS_BAR_H = 12;      // top padding (no device frame)
const TAB_BAR_H = 78;        // bottom tab bar inc. home indicator gap

// Top header (dark navy, used on Home + most root tabs)
function TopBar({ greeting, name, date, onBell, alertCount = 0, bg = T.bg, hideBorder = false }) {
  return (
    <div style={{
      padding: `${STATUS_BAR_H + 8}px 20px 14px`,
      background: bg,
      position: 'sticky', top: 0, zIndex: 5,
      borderBottom: hideBorder ? 'none' : `1px solid ${T.border}`,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div className="at-eyebrow" style={{ marginBottom: 4 }}>{date}</div>
          <div className="at-h1" style={{ color: T.text }}>
            {greeting ? <>{greeting}, <span style={{ color: T.teal }}>{name}</span></> : <span style={{ color: T.text }}>{name}</span>}
          </div>
        </div>
        <button onClick={onBell} className="at-tap" style={{
          width: 40, height: 40, borderRadius: 12,
          background: T.surface, border: `1px solid ${T.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: T.textDim, position: 'relative', flexShrink: 0,
        }}>
          <Icon name="bell" size={18}/>
          {alertCount > 0 && (
            <span style={{
              position: 'absolute', top: -4, right: -4, minWidth: 18, height: 18, padding: '0 5px',
              borderRadius: 999, background: T.red, color: '#fff',
              fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: `0 0 0 2px ${T.bg}`,
            }}>{alertCount}</span>
          )}
        </button>
      </div>
    </div>
  );
}

// Reusable simple top bar with title + back
function ScreenBar({ title, onBack, right }) {
  return (
    <div style={{
      padding: `${STATUS_BAR_H + 8}px 16px 12px`,
      background: T.bg,
      position: 'sticky', top: 0, zIndex: 5,
      display: 'flex', alignItems: 'center', gap: 8,
      borderBottom: `1px solid ${T.border}`,
    }}>
      {onBack && (
        <button onClick={onBack} className="at-tap" style={{
          width: 36, height: 36, borderRadius: 10, background: T.surface,
          border: `1px solid ${T.border}`, color: T.text,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}><Icon name="chevL" size={18}/></button>
      )}
      <div className="at-h2" style={{ flex: 1, color: T.text }}>{title}</div>
      {right}
    </div>
  );
}

// Bottom nav (5 items, mic centered + raised)
function BottomNav({ active, onChange, onMicTap }) {
  const items = [
    { id: 'home', icon: 'home', label: 'Squad' },
    { id: 'upd',  icon: 'bell', label: 'Updates' },
    { id: 'rec',  icon: 'mic', label: 'Record', center: true },
    { id: 'cal',  icon: 'calendar', label: 'Calendar' },
    { id: 'me',   icon: 'user', label: 'Profile' },
  ];
  return (
    <div style={{
      position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 30,
      paddingBottom: 22, paddingTop: 6,
      background: `linear-gradient(to top, ${T.bg} 70%, transparent)`,
    }}>
      <div style={{
        margin: '0 12px', height: 60, borderRadius: 22,
        background: 'rgba(18,27,48,0.85)', border: `1px solid ${T.border}`,
        backdropFilter: 'blur(14px) saturate(150%)', WebkitBackdropFilter: 'blur(14px) saturate(150%)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-around', position: 'relative',
      }}>
        {items.map(it => {
          if (it.center) {
            return (
              <button key={it.id} onClick={onMicTap} className="at-tap" style={{
                width: 54, height: 54, borderRadius: 999,
                background: `linear-gradient(160deg, ${T.teal}, ${T.tealDark})`,
                color: '#04231D', border: 'none',
                marginTop: -28,
                boxShadow: `0 8px 22px rgba(31,211,176,0.4), 0 0 0 4px rgba(18,27,48,0.85)`,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon name="mic-sm" size={22} color="#04231D"/>
              </button>
            );
          }
          const isAct = active === it.id;
          return (
            <button key={it.id} onClick={() => onChange(it.id)} style={{
              flex: 1, background: 'transparent', border: 'none',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
              color: isAct ? T.teal : T.textMute, padding: '6px 0',
            }}>
              <Icon name={it.icon} size={20} color={isAct ? T.teal : T.textMute}/>
              <span style={{ fontSize: 9.5, fontWeight: 600, letterSpacing: '0.04em' }}>{it.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Alert row
function AlertRow({ a, onTap }) {
  const player = PLAYERS.find(p => p.id === a.pid);
  const iconMap = { tournament: 'trophy', homework: 'book', goals: 'target', slot: 'calendar', payment: 'pound' };
  const colorMap = { high: T.red, med: T.amber, low: T.blue };
  const accent = colorMap[a.pri];
  return (
    <button onClick={onTap} className="at-tap" style={{
      width: '100%', textAlign: 'left',
      background: T.card, border: `1px solid ${T.border}`,
      borderRadius: 14, padding: '12px 14px',
      display: 'flex', gap: 12, alignItems: 'center',
      borderLeft: `3px solid ${accent}`,
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: 10, flexShrink: 0,
        background: `${accent}1F`, color: accent,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon name={iconMap[a.kind]} size={17}/>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'baseline' }}>
          <div style={{ fontSize: 13.5, fontWeight: 600, color: T.text, lineHeight: 1.25 }}>
            {player ? <span style={{ color: T.text }}>{player.name.split(' ')[0]} · </span> : null}{a.text}
          </div>
        </div>
        <div className="at-meta" style={{ marginTop: 2 }}>{a.sub}</div>
      </div>
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <div className="at-mono" style={{ fontSize: 10, color: T.textMute }}>{a.when}</div>
      </div>
    </button>
  );
}

// Player card row on home
function PlayerCard({ p, onTap, onLog }) {
  const [nextDate, nextTime] = (p.next || '').split(' · ');
  return (
    <div className="at-tap" onClick={onTap} style={{
      background: T.card, border: `1px solid ${T.border}`,
      borderRadius: 16, padding: 14,
      display: 'flex', flexDirection: 'column', gap: 10,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Avatar name={p.name} size={42}/>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            <span className="at-h3" style={{ color: T.text }}>{p.name}</span>
            <span className="at-mono" style={{ fontSize: 10, color: T.textMute, padding: '2px 5px', border: `1px solid ${T.border}`, borderRadius: 4 }}>{p.group}</span>
          </div>
          <div className="at-meta" style={{ marginTop: 2 }}>Focus · {p.focus}</div>
        </div>
        {p.alerts > 0 && (
          <div style={{
            padding: '3px 8px', borderRadius: 999,
            background: `${T.amber}1F`, color: T.amber,
            fontSize: 11, fontWeight: 600,
            display: 'flex', alignItems: 'center', gap: 4,
          }}>
            <span style={{ width: 5, height: 5, borderRadius: 999, background: T.amber }}/>{p.alerts}
          </div>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
          {[['T', p.tech], ['Ta', p.tac], ['P', p.phy], ['M', p.men]].map(([l, s], i) => (
            <div key={i} style={{
              width: 22, height: 22, borderRadius: 6,
              background: (s === 'g' ? T.green : s === 'a' ? T.amber : T.red) + '24',
              color: s === 'g' ? T.green : s === 'a' ? T.amber : T.red,
              fontSize: 9, fontWeight: 700, letterSpacing: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>{l}</div>
          ))}
        </div>
        <div style={{ flex: 1, textAlign: 'right' }}>
          <div className="at-meta" style={{ fontSize: 11 }}>Next session</div>
          <div className="at-mono" style={{ fontSize: 11.5, color: T.text, fontWeight: 600, marginTop: 1, lineHeight: 1.3 }}>
            <div>{nextDate}</div>
            {nextTime && <div style={{ color: T.textDim, fontSize: 10.5 }}>{nextTime}</div>}
          </div>
        </div>
        <button onClick={(e) => { e.stopPropagation(); onLog(); }} className="at-tap" style={{
          padding: '8px 11px', borderRadius: 10,
          background: T.cardHi, border: `1px solid ${T.borderHi}`,
          color: T.text, fontSize: 12, fontWeight: 600,
          display: 'flex', alignItems: 'center', gap: 5,
        }}>
          <Icon name="mic-sm" size={13}/> Log
        </button>
      </div>
    </div>
  );
}

// Home screen (Squad)
function HomeScreen({ onPlayer, onLogSession, onAlert }) {
  return (
    <div className="at-fadein" style={{ paddingBottom: TAB_BAR_H + 80, background: '#3C638E', minHeight: '100%' }}>
      <TopBar greeting="Morning" name="Mark" date="MON · 11 MAY 2026"
        onBell={() => {}} alertCount={ALERTS.length} bg={T.bg} />

      {/* squad-at-a-glance metrics strip */}
      <div style={{ padding: '14px 20px 6px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
        {[
          { l: 'Squad',         v: '3', s: 'players',       c: T.text  },
          { l: '1:1 Sessions',  v: '6', s: 'this week',     c: T.teal  },
          { l: 'Open Slots',    v: '5', s: 'next 2 weeks',  c: T.amber },
        ].map((s, i) => (
          <div key={i} style={{
            background: 'rgba(10,16,32,0.35)', border: `1px solid ${T.border}`,
            borderRadius: 12, padding: '10px 12px',
          }}>
            <div className="at-eyebrow" style={{ fontSize: 9, color: '#FFFFFF', fontWeight: 700 }}>{s.l}</div>
            <div className="at-num" style={{ fontSize: 22, fontWeight: 700, color: s.c, lineHeight: 1.1, marginTop: 2 }}>{s.v}</div>
            <div className="at-meta" style={{ fontSize: 10.5, color: '#FFFFFF', fontWeight: 600 }}>{s.s}</div>
          </div>
        ))}
      </div>

      {/* My Players */}
      <div style={{ padding: '20px 20px 6px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
          <div className="at-h3" style={{ color: T.text }}>My Players</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {PLAYERS.filter(p => ['tom','mia','alex'].includes(p.id)).map(p => (
            <PlayerCard key={p.id} p={p}
              onTap={() => onPlayer(p.id)}
              onLog={() => onLogSession(p.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// UPDATES SCREEN ───────────────────────────────────────
const EXTRA_UPDATES = [
  { id: 101, kind: 'session',     pid: 'sophie', text: 'Session completed · summary saved',     sub: '60 min · forehand block',                when: '4d',  pri: 'low'  },
  { id: 102, kind: 'homework',    pid: 'mia',    text: 'Homework streak hit 7 days',            sub: 'Forehand wall feeds',                    when: '5d',  pri: 'low'  },
  { id: 103, kind: 'tournament',  pid: 'noah',   text: 'Bromley Spring Open review filed',      sub: '3W · 1L · uploaded by parent',           when: '6d',  pri: 'low'  },
  { id: 104, kind: 'payment',     pid: 'sophie', text: 'Invoice paid · £160',                   sub: 'May block · cleared',                    when: '1w',  pri: 'low'  },
  { id: 105, kind: 'goals',       pid: 'olivia', text: 'Q1 plan review marked complete',        sub: 'Quarterly review · 12 Mar',              when: '1w',  pri: 'low'  },
  { id: 106, kind: 'slot',        pid: null,     text: 'Court availability extended',           sub: 'Beckenham · Sun added',                  when: '2w',  pri: 'low'  },
];

function UpdatesScreen({ onAlert }) {
  const unread = ALERTS.map(a => ({ ...a, unread: true }));
  const read = EXTRA_UPDATES.map(a => ({ ...a, unread: false }));
  const all = [...unread, ...read];
  const unreadCount = unread.length;

  return (
    <div className="at-fadein" style={{ paddingBottom: TAB_BAR_H + 80, background: '#3C638E', minHeight: '100%' }}>
      <TopBar greeting="Updates" name={`${unreadCount} unread`} date="INBOX · ALL ACTIVITY"
        onBell={() => {}} alertCount={unreadCount} />

      <div style={{ padding: '14px 20px 6px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {all.map((a, i) => {
          const showDivider = i === unreadCount && unreadCount > 0;
          return (
            <React.Fragment key={a.id}>
              {showDivider && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 2px' }}>
                  <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.18)' }}/>
                  <span className="at-eyebrow" style={{ fontSize: 9, color: '#FFFFFF', fontWeight: 700 }}>READ</span>
                  <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.18)' }}/>
                </div>
              )}
              <div style={{ position: 'relative' }}>
                <AlertRow a={a} onTap={() => onAlert(a)}/>
                {a.unread && (
                  <span style={{
                    position: 'absolute', top: 14, right: 12,
                    width: 9, height: 9, borderRadius: 999, background: T.teal,
                    boxShadow: '0 0 0 2px rgba(0,0,0,0.25)',
                  }}/>
                )}
                {!a.unread && (
                  <span style={{
                    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.18)', borderRadius: 14, pointerEvents: 'none',
                  }}/>
                )}
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

Object.assign(window, { HomeScreen, UpdatesScreen, BottomNav, TopBar, ScreenBar, AlertRow, STATUS_BAR_H, TAB_BAR_H });
