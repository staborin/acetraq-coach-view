// AceTraq — Session Feedback (record/review/history) + Session Tracker

// SESSION FEEDBACK ────────────────────────────────────────────
function FeedbackScreen({ pid, onSent }) {
  const [phase, setPhase] = React.useState('idle'); // idle | recording | processing | review | sent
  const [tab, setTab] = React.useState('new');      // new | history
  const [edits, setEdits] = React.useState({});
  const [elapsed, setElapsed] = React.useState(0);

  React.useEffect(() => {
    if (phase !== 'recording') return;
    const t = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(t);
  }, [phase]);

  const fmtTime = (s) => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;

  const player = PLAYERS.find(x => x.id === pid);

  if (tab === 'history' && phase === 'idle') {
    return (
      <div className="at-fadein" style={{ paddingBottom: 18 }}>
        <FeedbackTabs tab={tab} onTab={setTab}/>
        <div style={{ padding: '14px 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {TOM_FEEDBACK_HISTORY.map(f => (
            <div key={f.id} className="at-card" style={{ padding: 13 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <span className="at-mono" style={{ fontSize: 11, color: T.text, fontWeight: 600 }}>{f.date}</span>
                <span style={{
                  fontSize: 10, fontWeight: 600,
                  padding: '2px 6px', borderRadius: 5,
                  background: T.green + '1F', color: T.green,
                }}>SENT</span>
              </div>
              <div className="at-body" style={{ fontSize: 13 }}>{f.preview}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // PROCESSING
  if (phase === 'processing') {
    return (
      <div className="at-fadein" style={{
        height: 'calc(100% - 6px)', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', padding: '0 24px',
      }}>
        <div style={{
          width: 80, height: 80, borderRadius: 999,
          background: T.teal + '1F', color: T.teal,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon name="sparkle" size={32} color={T.teal}/>
        </div>
        <div className="at-h2" style={{ marginTop: 16 }}>Structuring your notes…</div>
        <div className="at-body" style={{ marginTop: 6, textAlign: 'center', fontSize: 13 }}>
          Mapping observations to the four pillars and pulling out things to work on.
        </div>
        <div style={{ marginTop: 20, width: '100%', maxWidth: 240, height: 3, borderRadius: 2, background: T.surface, overflow: 'hidden' }}>
          <div style={{
            height: '100%', width: '40%', borderRadius: 2,
            background: `linear-gradient(90deg, transparent, ${T.teal}, transparent)`,
            animation: 'atSlide 1.4s ease-in-out infinite',
          }}/>
          <style>{`@keyframes atSlide { 0% { transform: translateX(-100%); } 100% { transform: translateX(350%); }}`}</style>
        </div>
      </div>
    );
  }

  // REVIEW STATE
  if (phase === 'review') {
    const draft = FEEDBACK_DRAFT;
    return (
      <div className="at-fadein" style={{ paddingBottom: 18 }}>
        <div style={{ padding: '12px 20px 10px', display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'space-between' }}>
          <div>
            <div className="at-eyebrow">AI DRAFT · 4:32 RECORDED</div>
            <div className="at-h2" style={{ marginTop: 3 }}>Session feedback for {player.name.split(' ')[0]}</div>
          </div>
          <button onClick={() => setPhase('idle')} style={{
            padding: '6px 10px', background: 'transparent',
            border: `1px solid ${T.border}`, borderRadius: 8,
            color: T.textDim, fontSize: 11, fontWeight: 600,
          }}>Re-record</button>
        </div>

        <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {['tech', 'tac', 'phy', 'men'].map(k => {
            const section = draft.pillars[k];
            const subs = Object.keys(section);
            return (
            <div key={k} className="at-card" style={{ padding: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <span style={{
                  fontSize: 10.5, fontWeight: 700, letterSpacing: '0.06em',
                  padding: '3px 8px', borderRadius: 5,
                  background: PillarColor[k] + '20', color: PillarColor[k],
                }}>{PillarLabel[k].toUpperCase()}</span>
                <button style={{
                  marginLeft: 'auto', background: 'transparent', border: 'none',
                  color: T.textMute, display: 'flex', alignItems: 'center', gap: 3,
                  fontSize: 11, fontWeight: 600,
                }}><Icon name="edit" size={11}/> Edit</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {subs.map(sub => (
                  <div key={sub}>
                    <div style={{
                      fontSize: 10.5, fontWeight: 700, color: PillarColor[k],
                      marginBottom: 4, opacity: 0.75, letterSpacing: '0.04em',
                    }}>{SUB_LABELS[sub] || sub}</div>
                    <ul style={{ margin: 0, paddingLeft: 16, display: 'flex', flexDirection: 'column', gap: 4 }}>
                      {section[sub].map((s, i) => (
                        <li key={i} style={{ fontSize: 13, color: T.text, lineHeight: 1.45 }}>{s}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )})}

          {/* things to work on */}
          <div style={{
            background: `linear-gradient(135deg, ${T.teal}14, ${T.card})`,
            border: `1px solid ${T.teal}40`,
            borderRadius: 16, padding: 14,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <Icon name="target" size={16} color={T.teal}/>
              <div className="at-h3" style={{ color: T.teal, letterSpacing: '0.02em' }}>Things to work on</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {draft.workOn.map((w, i) => (
                <div key={i} style={{
                  background: T.bg, borderRadius: 10, padding: '10px 12px',
                  borderLeft: `3px solid ${PillarColor[w.pillar]}`,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span className="at-eyebrow" style={{ fontSize: 9, color: PillarColor[w.pillar] }}>{PillarLabel[w.pillar].toUpperCase()}</span>
                    {w.sub && SUB_LABELS[w.sub] && (
                      <span style={{
                        fontSize: 8.5, fontWeight: 600, padding: '1px 5px', borderRadius: 3,
                        background: PillarColor[w.pillar] + '1A', color: PillarColor[w.pillar],
                      }}>{SUB_LABELS[w.sub]}</span>
                    )}
                  </div>
                  <div style={{ fontSize: 13, color: T.text, marginTop: 3, lineHeight: 1.4 }}>{w.text}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* sticky footer */}
        <div style={{ padding: '16px 20px 4px', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button onClick={() => { setPhase('idle'); setElapsed(0); }} style={{
            flex: '1 1 30%', padding: '12px', borderRadius: 12,
            background: T.surface, border: `1px solid ${T.border}`,
            color: T.textDim, fontSize: 12.5, fontWeight: 600,
          }}>Save draft</button>
          <button onClick={() => { setPhase('sent'); setTimeout(() => { setPhase('idle'); setElapsed(0); }, 1400); }} style={{
            flex: '1 1 30%', padding: '12px', borderRadius: 12,
            background: T.cardHi, border: `1px solid ${T.borderHi}`,
            color: T.text, fontSize: 12.5, fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
          }}>
            <Icon name="check" size={13} color={T.text}/> Submit
          </button>
          <button onClick={() => { setPhase('sent'); setTimeout(() => { setPhase('idle'); setElapsed(0); onSent && onSent(); }, 1400); }} style={{
            flex: '1 1 100%', padding: '13px', borderRadius: 12,
            background: T.teal, border: 'none',
            color: '#04231D', fontSize: 13, fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          }}>
            <Icon name="send" size={14} color="#04231D"/> Send to parent
          </button>
        </div>
      </div>
    );
  }

  // SENT
  if (phase === 'sent') {
    return (
      <div className="at-fadein" style={{
        height: 'calc(100% - 6px)', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', padding: '0 24px',
      }}>
        <div style={{
          width: 88, height: 88, borderRadius: 999,
          background: T.green + '24', color: T.green,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon name="check" size={40} color={T.green} stroke={2.4}/>
        </div>
        <div className="at-h2" style={{ marginTop: 16 }}>Sent to {player.name.split(' ')[0]}'s parent</div>
        <div className="at-body" style={{ marginTop: 6, textAlign: 'center' }}>
          They'll get a push notification. You can edit and resend within 24 h.
        </div>
      </div>
    );
  }

  // IDLE / RECORDING (default)
  const recording = phase === 'recording';
  return (
    <div className="at-fadein" style={{ paddingBottom: 18 }}>
      <FeedbackTabs tab={tab} onTab={setTab}/>
      <div style={{
        height: 'calc(100% - 56px)', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', padding: '20px 24px 60px',
        textAlign: 'center', minHeight: 480,
      }}>
        <div className="at-eyebrow">{recording ? 'RECORDING' : 'NEW SESSION FEEDBACK'}</div>
        <div className="at-h2" style={{ marginTop: 6 }}>
          {recording ? `Listening to your session notes for ${player.name.split(' ')[0]}…` : `Voice-log a session for ${player.name.split(' ')[0]}`}
        </div>
        <div className="at-body" style={{ marginTop: 8, fontSize: 13, maxWidth: 280 }}>
          {recording
            ? 'Speak naturally. AceTraq sorts your notes into the four pillars and surfaces things to work on.'
            : 'Tap to record. We\'ll structure it across the four pillars when you stop.'}
        </div>

        {/* big mic */}
        <div style={{ position: 'relative', margin: '36px 0' }}>
          {recording && (
            <React.Fragment>
              <div className="at-ripple" style={{
                position: 'absolute', inset: 0, borderRadius: 999,
                background: T.teal + '22',
              }}/>
              <div className="at-ripple" style={{
                position: 'absolute', inset: 0, borderRadius: 999,
                background: T.teal + '22',
                animationDelay: '0.6s',
              }}/>
            </React.Fragment>
          )}
          <button onClick={() => {
            if (recording) {
              setPhase('processing');
              setTimeout(() => setPhase('review'), 1600);
            } else {
              setPhase('recording'); setElapsed(0);
            }
          }} style={{
            position: 'relative', width: 132, height: 132, borderRadius: 999,
            background: recording
              ? `linear-gradient(160deg, ${T.red}, #C73B3B)`
              : `linear-gradient(160deg, ${T.teal}, ${T.tealDark})`,
            border: 'none', color: recording ? '#fff' : '#04231D',
            boxShadow: `0 18px 40px ${recording ? T.red : T.teal}55`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon name={recording ? 'stop' : 'mic'} size={48} color={recording ? '#fff' : '#04231D'} stroke={2}/>
          </button>
        </div>

        <div className="at-num" style={{
          fontSize: 32, fontWeight: 700,
          color: recording ? T.text : T.textMute,
          letterSpacing: '0.04em',
        }}>{fmtTime(elapsed)}</div>

        {recording && (
          <div style={{ display: 'flex', gap: 3, marginTop: 14, alignItems: 'flex-end', height: 30 }}>
            {[8, 16, 22, 14, 26, 10, 20, 28, 14, 22, 8, 18, 24, 12].map((h, i) => (
              <div key={i} style={{
                width: 3, height: h, borderRadius: 2,
                background: T.teal,
                animation: `atBar ${0.5 + (i % 5) * 0.1}s ease-in-out ${i * 0.05}s infinite alternate`,
              }}/>
            ))}
            <style>{`@keyframes atBar { from { height: 4px; } to { } }`}</style>
          </div>
        )}
      </div>
    </div>
  );
}

function FeedbackTabs({ tab, onTab }) {
  return (
    <div style={{
      padding: '12px 20px 8px', display: 'flex', gap: 4,
      background: T.bg, borderBottom: `1px solid ${T.border}`,
    }}>
      {[['new', 'New'], ['history', 'History · 12']].map(([k, l]) => (
        <button key={k} onClick={() => onTab(k)} style={{
          padding: '7px 13px', borderRadius: 9,
          background: tab === k ? T.cardHi : 'transparent',
          color: tab === k ? T.text : T.textMute,
          border: tab === k ? `1px solid ${T.borderHi}` : `1px solid transparent`,
          fontSize: 12, fontWeight: 600,
        }}>{l}</button>
      ))}
    </div>
  );
}

// SESSION TRACKER ────────────────────────────────────────────────
function SessionTracker({ pid }) {
  const [view, setView] = React.useState('list'); // list | cal
  const [confirmModal, setConfirmModal] = React.useState(null);
  const [overrides, setOverrides] = React.useState({}); // session id -> updated session
  const [promoteSlot, setPromoteSlot] = React.useState(null); // session id

  const sessions = TOM_SESSIONS.map(s => ({ ...s, ...(overrides[s.id] || {}) }));

  const upcoming = sessions.filter(s => s.upcoming);
  const past = sessions.filter(s => !s.upcoming);

  const stats = {
    total: sessions.length,
    confirmed: sessions.filter(s => s.rag === 'g').length,
    unconf: sessions.filter(s => s.rag === 'a').length,
    cancelled: sessions.filter(s => s.cancelled).length,
    unpaid: sessions.filter(s => !s.paid && !s.cancelled).length,
  };

  return (
    <div className="at-fadein" style={{ paddingBottom: 24 }}>
      {/* view toggle */}
      <div style={{ padding: '12px 20px 6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="at-h2">Sessions</div>
        <div style={{ display: 'flex', gap: 2, padding: 3, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10 }}>
          {[['list', 'list'], ['cal', 'grid']].map(([k, ic]) => (
            <button key={k} onClick={() => setView(k)} style={{
              width: 30, height: 26, borderRadius: 7,
              background: view === k ? T.cardHi : 'transparent', border: 'none',
              color: view === k ? T.text : T.textMute,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}><Icon name={ic} size={14}/></button>
          ))}
        </div>
      </div>

      {/* summary stats row */}
      <div className="at-scroll" style={{
        padding: '6px 20px 10px', display: 'flex', gap: 8, overflowX: 'auto',
      }}>
        {[
          { l: 'this month', v: stats.total, c: T.text },
          { l: 'confirmed',  v: stats.confirmed, c: T.green },
          { l: 'awaiting',   v: stats.unconf, c: T.amber },
          { l: 'cancelled',  v: stats.cancelled, c: T.red },
          { l: 'unpaid',     v: stats.unpaid, c: T.amber },
        ].map((s, i) => (
          <div key={i} style={{
            background: T.surface, border: `1px solid ${T.border}`,
            borderRadius: 10, padding: '8px 12px', minWidth: 80, flexShrink: 0,
          }}>
            <div className="at-eyebrow" style={{ fontSize: 9 }}>{s.l}</div>
            <div className="at-num" style={{ fontSize: 19, fontWeight: 700, color: s.c, lineHeight: 1.1 }}>{s.v}</div>
          </div>
        ))}
      </div>

      {view === 'cal' ? (
        <CalendarView sessions={sessions}/>
      ) : (
        <React.Fragment>
          <div style={{ padding: '4px 20px 6px' }}>
            <div className="at-eyebrow" style={{ marginBottom: 8 }}>UPCOMING</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {upcoming.map(s => (
                <SessionRow key={s.id} s={s}
                  onConfirm={() => setOverrides(o => ({ ...o, [s.id]: { rag: 'g', status: 'Confirmed' }}))}
                  onCancel={() => setConfirmModal(s)}
                />
              ))}
            </div>
            {sessions.find(s => s.cancelled) && (
              <button onClick={() => setPromoteSlot('s3')} style={{
                marginTop: 10, width: '100%',
                background: T.teal + '14', border: `1px dashed ${T.teal}50`,
                color: T.teal, padding: '10px', borderRadius: 11,
                fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              }}>
                <Icon name="sparkle" size={13} color={T.teal}/> Promote cancelled slot · Tue 20 May
              </button>
            )}
          </div>

          <div style={{ padding: '14px 20px 6px' }}>
            <div className="at-eyebrow" style={{ marginBottom: 8 }}>PAST</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {past.map(s => <SessionRow key={s.id} s={s}/>)}
            </div>
          </div>
        </React.Fragment>
      )}

      {/* cancel-confirm modal */}
      {confirmModal && (
        <ModalShell onClose={() => setConfirmModal(null)}>
          <div className="at-h2" style={{ marginBottom: 6 }}>Cancel this session?</div>
          <div className="at-body" style={{ fontSize: 13.5 }}>
            {confirmModal.day} {confirmModal.date} · {confirmModal.time}
          </div>
          <div className="at-body" style={{ marginTop: 8, fontSize: 13 }}>
            The parent will be notified immediately. You can promote the slot to other players afterwards.
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
            <button onClick={() => setConfirmModal(null)} style={{
              flex: 1, padding: '12px', borderRadius: 11,
              background: T.surface, border: `1px solid ${T.border}`,
              color: T.textDim, fontSize: 13, fontWeight: 600,
            }}>Keep it</button>
            <button onClick={() => {
              setOverrides(o => ({ ...o, [confirmModal.id]: { rag: 'r', status: 'Cancelled', cancelled: true }}));
              setConfirmModal(null);
            }} style={{
              flex: 1, padding: '12px', borderRadius: 11,
              background: T.red, border: 'none',
              color: '#fff', fontSize: 13, fontWeight: 700,
            }}>Cancel session</button>
          </div>
        </ModalShell>
      )}

      {promoteSlot && (
        <ModalShell onClose={() => setPromoteSlot(null)}>
          <div className="at-h2" style={{ marginBottom: 4 }}>Offer slot to other players?</div>
          <div className="at-body" style={{ fontSize: 13 }}>
            Suggested based on session frequency and current focus areas.
          </div>
          <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {['mia', 'james', 'olivia'].map(id => {
              const pl = PLAYERS.find(p => p.id === id);
              return (
                <div key={id} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '10px 12px', background: T.cardHi,
                  border: `1px solid ${T.border}`, borderRadius: 11,
                }}>
                  <Avatar name={pl.name} size={34}/>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 600 }}>{pl.name}</div>
                    <div className="at-meta">{pl.group} · last session 4d ago</div>
                  </div>
                  <button style={{
                    background: T.teal, color: '#04231D', border: 'none',
                    padding: '6px 11px', borderRadius: 7, fontSize: 11.5, fontWeight: 700,
                  }}>Offer</button>
                </div>
              );
            })}
          </div>
        </ModalShell>
      )}
    </div>
  );
}

function CalendarView({ sessions }) {
  // simple May 2026 calendar grid; map sessions onto dates
  const dayMap = {};
  sessions.forEach(s => {
    const d = parseInt(s.date.split(' ')[0]);
    if (!dayMap[d]) dayMap[d] = [];
    dayMap[d].push(s);
  });
  const offset = 4; // May 1 2026 = Friday (visual approx)
  const cells = Array.from({ length: 35 }, (_, i) => i - offset + 1);
  return (
    <div style={{ padding: '4px 20px' }}>
      <div className="at-card" style={{ padding: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, alignItems: 'center' }}>
          <div className="at-h3">May 2026</div>
          <div style={{ display: 'flex', gap: 4 }}>
            {['<', '>'].map((c, i) => (
              <button key={i} style={{
                width: 26, height: 26, borderRadius: 7,
                background: T.cardHi, border: `1px solid ${T.border}`,
                color: T.textDim, fontSize: 11,
              }}>{c}</button>
            ))}
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 6 }}>
          {['M','T','W','T','F','S','S'].map((d, i) => (
            <div key={i} className="at-mono" style={{ textAlign: 'center', fontSize: 9.5, color: T.textMute, padding: 4 }}>{d}</div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
          {cells.map((d, i) => {
            if (d < 1 || d > 31) return <div key={i} style={{ aspectRatio: '1' }}/>;
            const s = dayMap[d];
            const isToday = d === 11;
            return (
              <div key={i} style={{
                aspectRatio: '1', borderRadius: 8,
                background: isToday ? T.teal + '20' : 'transparent',
                border: isToday ? `1px solid ${T.teal}60` : `1px solid transparent`,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                position: 'relative', padding: 4,
              }}>
                <span className="at-num" style={{
                  fontSize: 12, fontWeight: 600,
                  color: isToday ? T.teal : (s ? T.text : T.textMute),
                }}>{d}</span>
                {s && (
                  <div style={{ display: 'flex', gap: 2, marginTop: 2 }}>
                    {s.map((ss, j) => <RAG key={j} s={ss.rag} size={4}/>)}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// generic modal shell (bottom-sheet)
function ModalShell({ children, onClose }) {
  return (
    <div onClick={onClose} style={{
      position: 'absolute', inset: 0, background: 'rgba(5,8,16,0.6)',
      backdropFilter: 'blur(4px)', zIndex: 80,
      display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
    }}>
      <div onClick={e => e.stopPropagation()} className="at-fadein" style={{
        width: '100%', background: T.surface,
        borderTopLeftRadius: 22, borderTopRightRadius: 22,
        padding: '14px 20px 30px',
        borderTop: `1px solid ${T.borderHi}`,
        animation: 'atSheet .25s ease-out',
      }}>
        <div style={{ width: 38, height: 4, borderRadius: 2, background: T.borderHi, margin: '0 auto 14px' }}/>
        {children}
        <style>{`@keyframes atSheet { from { transform: translateY(20px); } to { transform: none; }}`}</style>
      </div>
    </div>
  );
}

Object.assign(window, { FeedbackScreen, SessionTracker, ModalShell });
