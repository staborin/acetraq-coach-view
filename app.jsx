// AceTraq — main app shell, routing, log-session flow

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#1FD3B0"
}/*EDITMODE-END*/;

const ACCENT_PAIRS = {
  '#1FD3B0': '#0FA38A', // teal
  '#3B9EFF': '#1E6FCF', // blue
  '#A88BFF': '#7558D9', // violet
  '#9FE040': '#6FAE1E', // lime
};

function App() {
  const [route, setRoute] = React.useState({ tab: 'home' });
  const [logFlow, setLogFlow] = React.useState(null);

  const goPlayer = (pid) => setRoute({ tab: 'player', pid, sub: 'dash' });
  const goPlayerSub = (sub) => setRoute(r => ({ ...r, sub }));
  const goHome = () => setRoute({ tab: 'home' });
  const goCal = () => setRoute({ tab: 'cal' });
  const goUpd = () => setRoute({ tab: 'upd' });
  const goMe  = () => setRoute({ tab: 'me' });

  const startLog = (pid) => {
    if (pid) setRoute({ tab: 'player', pid, sub: 'fb' });
    else     setLogFlow({ phase: 'pick' });
  };

  let screen;
  if (route.tab === 'home') {
    screen = <HomeScreen
      onPlayer={goPlayer}
      onLogSession={startLog}
      onAlert={(a) => { if (a.pid) goPlayer(a.pid); }}
    />;
  } else if (route.tab === 'cal') {
    screen = <CalendarTab onPlayer={goPlayer}/>;
  } else if (route.tab === 'upd') {
    screen = <UpdatesScreen onAlert={(a) => { if (a.pid) goPlayer(a.pid); }}/>;
  } else if (route.tab === 'me') {
    screen = <ProfileTab/>;
  } else if (route.tab === 'player') {
    screen = <PlayerScreen
      pid={route.pid}
      sub={route.sub}
      onSub={goPlayerSub}
      onBack={goHome}
      onSession={() => goPlayerSub('sess')}
    />;
  }

  const activeNav = (route.tab === 'home' || route.tab === 'player') ? 'home'
                  : route.tab === 'cal' ? 'cal'
                  : route.tab === 'upd' ? 'upd'
                  : route.tab === 'me'  ? 'me' : 'home';

  const screenBg = '#3C638E';

  return (
    <div className="at-app" style={{
      width: '100%', height: '100%', position: 'relative',
      background: screenBg, overflow: 'hidden',
    }}>
      <ThemeStyles/>
      <div className="at-scroll" style={{
        height: '100%', overflowY: 'auto', overflowX: 'hidden',
      }}>
        {screen}
      </div>

      <BottomNav active={activeNav}
        onChange={(id) => {
          if (id === 'home') goHome();
          else if (id === 'cal') goCal();
          else if (id === 'upd') goUpd();
          else if (id === 'me') goMe();
        }}
        onMicTap={() => startLog(null)}
      />

      {logFlow && (
        <LogSessionFlow
          flow={logFlow}
          setFlow={setLogFlow}
          onPickPlayer={(pid) => { setLogFlow(null); setRoute({ tab: 'player', pid, sub: 'fb' }); }}
        />
      )}
    </div>
  );
}

// PLAYER SCREEN ───────────────────────────────────────
function PlayerScreen({ pid, sub, onSub, onBack, onSession }) {
  const [tourScreen, setTourScreen] = React.useState(null);

  const p = PLAYERS.find(x => x.id === pid);
  if (!p) return null;

  return (
    <div data-screen-label={`Player · ${p.name}`}>
      <div style={{
        position: 'sticky', top: 0, zIndex: 6,
        background: T.bg,
      }}>
        <div style={{
          padding: `${STATUS_BAR_H + 6}px 16px 8px`,
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <button onClick={onBack} className="at-tap" style={{
            width: 36, height: 36, borderRadius: 10, background: T.surface,
            border: `1px solid ${T.border}`, color: T.text,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}><Icon name="chevL" size={18}/></button>
          <Avatar name={p.name} size={32}/>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="at-h3" style={{ color: T.text, lineHeight: 1.1 }}>{p.name.split(' ')[0]}</div>
            <div className="at-meta" style={{ fontSize: 10.5, marginTop: 1 }}>{p.group} · age {p.age}</div>
          </div>
          <PillarStrip tech={p.tech} tac={p.tac} phy={p.phy} men={p.men}/>
        </div>
        <PlayerSubTabs active={sub} onChange={(s) => { setTourScreen(null); onSub(s); }}/>
      </div>

      {sub === 'dash' && <PlayerDashboard pid={pid} onTab={onSub} onSession={onSession}/>}
      {sub === 'plan' && <DevPlan pid={pid}/>}
      {sub === 'sess' && <SessionTracker pid={pid}/>}
      {sub === 'fb'   && <FeedbackScreen pid={pid}/>}
      {sub === 'tour' && !tourScreen && <TournamentsScreen pid={pid} onOpen={(tid) => {
        if (tid === 'surrey') setTourScreen({ kind: 'goals', tid });
        else if (tid === 'kent') setTourScreen({ kind: 'review', tid });
        else setTourScreen({ kind: 'review', tid });
      }}/>}
      {sub === 'tour' && tourScreen && tourScreen.kind === 'goals' && (
        <TournamentSetGoals tid={tourScreen.tid}
          onBack={() => setTourScreen(null)}
          onSubmitted={() => setTourScreen(null)}
        />
      )}
      {sub === 'tour' && tourScreen && tourScreen.kind === 'review' && (
        <TournamentReview tid={tourScreen.tid}
          onBack={() => setTourScreen(null)}
          onReviewed={() => setTourScreen(null)}
        />
      )}
      {sub === 'hw'   && <HomeworkScreen pid={pid}/>}
    </div>
  );
}

// LOG SESSION FLOW ───────────────────────────────────────
function LogSessionFlow({ flow, setFlow, onPickPlayer }) {
  return (
    <ModalShell onClose={() => setFlow(null)}>
      <div className="at-eyebrow">QUICK LOG</div>
      <div className="at-h2" style={{ marginTop: 3 }}>Pick a player</div>
      <div className="at-body" style={{ fontSize: 12.5, marginTop: 4 }}>
        Voice-record your session notes. AceTraq will sort them across the four pillars.
      </div>
      <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 360, overflowY: 'auto' }} className="at-scroll">
        {PLAYERS.map(p => (
          <button key={p.id} onClick={() => onPickPlayer(p.id)} className="at-tap" style={{
            width: '100%', textAlign: 'left',
            background: T.cardHi, border: `1px solid ${T.border}`,
            borderRadius: 11, padding: '10px 12px',
            display: 'flex', alignItems: 'center', gap: 10, color: T.text,
          }}>
            <Avatar name={p.name} size={32}/>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13.5, fontWeight: 600 }}>{p.name}</div>
              <div className="at-meta" style={{ fontSize: 11 }}>{p.group} · last session {p.id === 'tom' ? 'Tue 6 May' : '2d ago'}</div>
            </div>
            <PillarStrip tech={p.tech} tac={p.tac} phy={p.phy} men={p.men} size={5.5}/>
            <Icon name="chevR" size={14} color={T.textMute}/>
          </button>
        ))}
      </div>
    </ModalShell>
  );
}

// CALENDAR TAB ───────────────────────────────────────
function CalendarTab({ onPlayer }) {
  const [showAdd, setShowAdd] = React.useState(false);
  const days = [
    { d: 'Mon 11', items: [{t:'09:00', who:'Sophie', g:'U16', rag:'g'}, {t:'17:00', who:'James', g:'U12', rag:'g'}] },
    { d: 'Tue 12', items: [] },
    { d: 'Tue 13', items: [{t:'16:00', who:'Tom', g:'U14', rag:'g'}, {t:'17:30', who:'Olivia', g:'U14', rag:'a'}] },
    { d: 'Wed 14', items: [{t:'17:00', who:'Mia', g:'U12', rag:'g'}] },
    { d: 'Thu 15', items: [{t:'16:00', who:'Alex', g:'U14', rag:'g'}, {t:'17:00', who:'Tom', g:'U14', rag:'a'}, {t:'18:00', who:'Slot open', g:'—', rag:'a', open:true}] },
    { d: 'Fri 16', items: [{t:'18:00', who:'Sophie', g:'U16', rag:'g'}] },
    // week 2
    { d: 'Mon 18', items: [{t:'09:00', who:'Slot open', g:'—', rag:'a', open:true}, {t:'17:00', who:'James', g:'U12', rag:'g'}] },
    { d: 'Tue 19', items: [{t:'16:00', who:'Tom', g:'U14', rag:'g'}, {t:'17:30', who:'Mia', g:'U12', rag:'g'}] },
    { d: 'Wed 20', items: [{t:'16:00', who:'Slot open', g:'—', rag:'a', open:true}, {t:'17:00', who:'Olivia', g:'U14', rag:'a'}] },
    { d: 'Thu 21', items: [{t:'16:00', who:'Alex', g:'U14', rag:'g'}, {t:'17:30', who:'Noah', g:'U16', rag:'g'}] },
    { d: 'Fri 22', items: [{t:'17:00', who:'Emma', g:'U12', rag:'g'}, {t:'18:00', who:'Sophie', g:'U16', rag:'g'}] },
    // week 3
    { d: 'Mon 25', items: [{t:'17:00', who:'James', g:'U12', rag:'g'}] },
    { d: 'Tue 26', items: [{t:'16:00', who:'Slot open', g:'—', rag:'a', open:true}, {t:'17:30', who:'Tom', g:'U14', rag:'g'}] },
    { d: 'Wed 27', items: [{t:'17:00', who:'Mia', g:'U12', rag:'g'}, {t:'18:00', who:'Noah', g:'U16', rag:'a'}] },
    { d: 'Thu 28', items: [{t:'16:00', who:'Alex', g:'U14', rag:'g'}] },
    { d: 'Fri 29', items: [{t:'17:00', who:'Slot open', g:'—', rag:'a', open:true}, {t:'18:00', who:'Sophie', g:'U16', rag:'g'}] },
  ];
  return (
    <div className="at-fadein" style={{ paddingBottom: TAB_BAR_H + 80, background: '#3C638E', minHeight: '100%' }}>
      <TopBar greeting="" name="Session calendar" date="MON · 11 MAY 2026" onBell={() => {}} alertCount={0}/>

      <div style={{ padding: '12px 20px 4px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
        {[
          { l: 'Sessions',    v: '24',  c: T.text },
          { l: 'Hours',       v: '28',  c: T.teal, mono: true },
          { l: 'Open Slots',  v: '5',   c: T.amber },
        ].map((s, i) => (
          <div key={i} style={{
            background: 'rgba(10,16,32,0.35)', border: `1px solid ${T.border}`,
            borderRadius: 10, padding: '8px 10px',
          }}>
            <div className="at-eyebrow" style={{ fontSize: 8.5, color: '#FFFFFF', fontWeight: 700 }}>{s.l}</div>
            <div className={s.mono ? 'at-num' : ''} style={{ fontSize: 17, fontWeight: 700, color: s.c, lineHeight: 1.1, marginTop: 2 }}>{s.v}</div>
          </div>
        ))}
      </div>

      {/* Add Slot button — prominent */}
      <div style={{ padding: '12px 20px 0' }}>
        <button onClick={() => setShowAdd(true)} className="at-tap" style={{
          width: '100%', padding: '13px',
          background: `linear-gradient(160deg, ${T.teal}, ${T.tealDark})`,
          color: '#04231D', border: 'none', borderRadius: 12,
          fontSize: 14, fontWeight: 700,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
          boxShadow: `0 6px 16px rgba(31,211,176,0.3)`,
        }}>
          <Icon name="plus" size={16} color="#04231D" stroke={2.4}/> Add Slot
        </button>
      </div>

      <div style={{ padding: '14px 20px 0', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {days.map((day, i) => (
          <div key={i}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <div className="at-mono" style={{
                fontSize: 10.5, fontWeight: 700, color: i === 0 ? T.teal : '#FFFFFF',
                letterSpacing: '0.1em', textTransform: 'uppercase',
              }}>{day.d}{i === 0 ? ' · TODAY' : ''}</div>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.18)' }}/>
              {day.items.length === 0 && (
                <span className="at-meta" style={{ fontSize: 10.5, color: '#FFFFFF', fontWeight: 600 }}>— no sessions</span>
              )}
            </div>
            {day.items.map((it, j) => (
              <div key={j} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '9px 12px',
                background: it.open ? `linear-gradient(90deg, ${T.amber}10, rgba(0,0,0,0.15))` : 'rgba(10,16,32,0.5)',
                border: `1px ${it.open ? 'dashed' : 'solid'} ${it.open ? T.amber + '40' : T.border}`,
                borderRadius: 11, marginBottom: 6,
              }}>
                <div className="at-num" style={{ fontSize: 12.5, fontWeight: 700, color: T.text, width: 48 }}>{it.t}</div>
                <RAG s={it.rag} size={7}/>
                <div style={{ flex: 1, fontSize: 13, color: T.text, fontWeight: 600 }}>
                  {it.open ? <span style={{ color: T.amber, fontWeight: 700, letterSpacing: '0.04em' }}>OPEN SLOT</span>
                    : (<>{it.who}<span style={{ color: T.textMute, fontWeight: 400 }}> · {it.g}</span></>)}
                </div>
                {it.open && (
                  <button style={{
                    padding: '5px 9px', borderRadius: 7,
                    background: T.amber + '24', color: T.amber,
                    border: 'none', fontSize: 10.5, fontWeight: 700,
                  }}>Promote</button>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>

      {showAdd && (
        <ModalShell onClose={() => setShowAdd(false)}>
          <div className="at-h2" style={{ marginBottom: 4 }}>Add slot</div>
          <div className="at-body" style={{ fontSize: 13 }}>Open a new lesson slot for parents to book.</div>
          <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              ['Date',     'Thu 15 May 2026'],
              ['Time',     '6:00 PM – 7:00 PM'],
              ['Court',    'Beckenham · Court 3'],
              ['Visible to', 'All parents'],
            ].map(([l, v], i) => (
              <div key={i} style={{
                background: T.cardHi, border: `1px solid ${T.border}`,
                borderRadius: 11, padding: '10px 12px',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <span className="at-eyebrow" style={{ fontSize: 9 }}>{l}</span>
                <span style={{ fontSize: 13, color: T.text, fontWeight: 600 }}>{v}</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
            <button onClick={() => setShowAdd(false)} style={{
              flex: 1, padding: '12px', borderRadius: 11,
              background: T.surface, border: `1px solid ${T.border}`,
              color: T.textDim, fontSize: 13, fontWeight: 600,
            }}>Cancel</button>
            <button onClick={() => setShowAdd(false)} style={{
              flex: 2, padding: '12px', borderRadius: 11,
              background: T.teal, border: 'none',
              color: '#04231D', fontSize: 13, fontWeight: 700,
            }}>Open slot</button>
          </div>
        </ModalShell>
      )}
    </div>
  );
}

function ProfileTab() {
  return (
    <div className="at-fadein" style={{ paddingBottom: TAB_BAR_H + 80, background: '#3C638E', minHeight: '100%' }}>
      <TopBar greeting="Profile" name="Coach Davies" date="LTA LEVEL 4 · BECKENHAM" onBell={() => {}} alertCount={0}/>
      <div style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
        <Avatar name="Coach Davies" size={64}/>
        <div>
          <div className="at-h2">Mark Davies</div>
          <div className="at-meta" style={{ marginTop: 3 }}>LTA Level 4 · 8 active players</div>
          <div style={{
            marginTop: 6, display: 'inline-flex', alignItems: 'center', gap: 4,
            padding: '3px 7px', borderRadius: 4,
            background: T.teal + '1F', color: T.teal,
            fontSize: 10, fontWeight: 700, letterSpacing: '0.06em',
          }}>
            <Icon name="sparkle" size={10} color={T.teal}/> AceTraq Pro
          </div>
        </div>
      </div>

      <div style={{ padding: '4px 20px 6px' }}>
        <div className="at-eyebrow" style={{ marginBottom: 8 }}>THIS QUARTER</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
          {[
            { l: 'Sessions',     v: '78', s: 'delivered' },
            { l: 'Hours',        v: '92', s: 'on court', c: T.teal },
            { l: 'Tournaments',  v: '14', s: 'reviewed' },
            { l: 'Plan reviews', v: '6',  s: 'completed' },
          ].map((s, i) => (
            <div key={i} className="at-card" style={{ padding: 12 }}>
              <div className="at-eyebrow" style={{ fontSize: 9 }}>{s.l}</div>
              <div className="at-num" style={{ fontSize: 22, fontWeight: 700, color: s.c || T.text, marginTop: 2 }}>{s.v}</div>
              <div className="at-meta" style={{ fontSize: 10.5 }}>{s.s}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: '14px 20px' }}>
        <div className="at-eyebrow" style={{ marginBottom: 8 }}>SETTINGS</div>
        <div className="at-card" style={{ padding: '4px 0' }}>
          {[
            ['user', 'Account & subscription'],
            ['bell', 'Notifications'],
            ['shield', 'Privacy & data'],
            ['book', 'Knowledge base'],
            ['msg', 'Contact AceTraq'],
          ].map(([ic, l], i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '12px 14px',
              borderTop: i === 0 ? 'none' : `1px solid ${T.border}`,
            }}>
              <Icon name={ic} size={16} color={T.textDim}/>
              <span style={{ flex: 1, fontSize: 13, color: T.text }}>{l}</span>
              <Icon name="chevR" size={14} color={T.textMute}/>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ROOT ───────────────────────────────────────────
function Root() {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [bumpKey, setBumpKey] = React.useState(0);

  // Apply accent at runtime — mutate global T then bump key to force re-render
  React.useLayoutEffect(() => {
    const accent = tweaks.accent || '#1FD3B0';
    T.teal = accent;
    T.tealDark = ACCENT_PAIRS[accent] || '#0FA38A';
    setBumpKey(k => k + 1);
  }, [tweaks.accent]);

  return (
    <div style={{
      minHeight: '100vh', width: '100%',
      background: 'radial-gradient(circle at top, #1B2238, #07091A 70%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px', boxSizing: 'border-box',
    }}>
      <ThemeStyles/>
      <IOSDevice width={392} height={846} dark>
        <App key={bumpKey}/>
      </IOSDevice>

      <TweaksPanel title="Tweaks">
        <TweakSection label="Accent">
          <TweakColor
            label="Accent color"
            value={tweaks.accent}
            options={['#1FD3B0', '#3B9EFF', '#A88BFF', '#9FE040']}
            onChange={(v) => setTweak('accent', v)}
          />
        </TweakSection>
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<Root/>);
