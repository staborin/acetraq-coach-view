// AceTraq — Tournaments (list / set goals / review) + Homework

// TOURNAMENTS LIST ────────────────────────────────────────────
function TournamentsScreen({ pid, onOpen }) {
  return (
    <div className="at-fadein" style={{ paddingBottom: 18 }}>
      <div style={{ padding: '12px 20px 4px' }}>
        <div className="at-h2">Tournaments</div>
        <div className="at-meta" style={{ marginTop: 3 }}>3 in current cycle · 1 awaiting review</div>
      </div>

      {/* spotlight: tournament awaiting review */}
      <div style={{ padding: '10px 20px 6px' }}>
        <button onClick={() => onOpen('kent')} className="at-tap" style={{
          width: '100%', textAlign: 'left',
          background: `linear-gradient(135deg, ${T.amber}1A, ${T.card})`,
          border: `1px solid ${T.amber}40`,
          borderRadius: 16, padding: 16,
          display: 'flex', flexDirection: 'column', gap: 10,
          color: T.text,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 8px', borderRadius: 5,
                background: T.amber + '24', color: T.amber, fontSize: 10, fontWeight: 700, letterSpacing: '0.06em',
              }}>
                <Icon name="bell" size={11} color={T.amber}/> CHARTING RECEIVED
              </div>
              <div className="at-h3" style={{ marginTop: 8 }}>Kent Junior Open</div>
              <div className="at-meta" style={{ marginTop: 2 }}>3 May 2026 · Beckenham LTC</div>
            </div>
            <Icon name="trophy" size={28} color={T.amber}/>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <div className="at-num" style={{ fontSize: 14, fontWeight: 600, color: T.text }}>1W · 1L</div>
            <span style={{ width: 3, height: 3, borderRadius: 999, background: T.textMute }}/>
            <div className="at-meta" style={{ fontSize: 12 }}>2 matches · charting on all 4 targets</div>
            <Icon name="chevR" size={14} color={T.amber} style={{ marginLeft: 'auto' }}/>
          </div>
        </button>
      </div>

      {/* upcoming */}
      <div style={{ padding: '8px 20px 6px' }}>
        <div className="at-eyebrow" style={{ marginBottom: 8 }}>UPCOMING</div>
        <button onClick={() => onOpen('surrey')} className="at-tap" style={{
          width: '100%', textAlign: 'left', color: T.text,
          background: T.card, border: `1px solid ${T.border}`,
          borderRadius: 14, padding: 14,
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{
            width: 44, textAlign: 'center', flexShrink: 0,
            background: T.cardHi, borderRadius: 9, padding: '6px 0',
          }}>
            <div className="at-mono" style={{ fontSize: 9, color: T.textMute }}>SAT</div>
            <div className="at-num" style={{ fontSize: 18, fontWeight: 700, color: T.text }}>17</div>
            <div className="at-mono" style={{ fontSize: 8.5, color: T.textMute }}>MAY</div>
          </div>
          <div style={{ flex: 1 }}>
            <div className="at-h3">Surrey Junior Open</div>
            <div className="at-meta" style={{ marginTop: 2 }}>Sutton Tennis · in 6 days</div>
            <div style={{
              marginTop: 7, display: 'inline-flex', alignItems: 'center', gap: 5,
              padding: '3px 8px', borderRadius: 5,
              background: T.red + '20', color: T.red, fontSize: 10, fontWeight: 700, letterSpacing: '0.06em',
            }}>
              <Icon name="target" size={11} color={T.red}/> NO GOALS SET
            </div>
          </div>
          <Icon name="chevR" size={16} color={T.textMute}/>
        </button>
      </div>

      {/* completed */}
      <div style={{ padding: '14px 20px 6px' }}>
        <div className="at-eyebrow" style={{ marginBottom: 8 }}>COMPLETED</div>
        <button onClick={() => onOpen('bromley')} className="at-tap" style={{
          width: '100%', textAlign: 'left', color: T.text,
          background: T.card, border: `1px solid ${T.border}`,
          borderRadius: 14, padding: 14,
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{
            width: 44, textAlign: 'center', flexShrink: 0,
            background: T.cardHi, borderRadius: 9, padding: '6px 0',
          }}>
            <div className="at-mono" style={{ fontSize: 9, color: T.textMute }}>SUN</div>
            <div className="at-num" style={{ fontSize: 18, fontWeight: 700, color: T.text }}>12</div>
            <div className="at-mono" style={{ fontSize: 8.5, color: T.textMute }}>APR</div>
          </div>
          <div style={{ flex: 1 }}>
            <div className="at-h3">Bromley Spring Open</div>
            <div className="at-meta" style={{ marginTop: 2 }}>3W · 1L · Reviewed</div>
          </div>
          <div style={{
            padding: '3px 7px', borderRadius: 5,
            background: T.green + '24', color: T.green,
            fontSize: 10, fontWeight: 700, letterSpacing: '0.06em',
            display: 'inline-flex', alignItems: 'center', gap: 4,
          }}>
            <Icon name="check" size={11} color={T.green}/> REVIEWED
          </div>
        </button>
      </div>
    </div>
  );
}

// SET GOALS (upcoming tournament) ─────────────────────────────
function TournamentSetGoals({ tid, onBack, onSubmitted }) {
  const [picked, setPicked] = React.useState(['p2', 'p5']);
  const [done, setDone] = React.useState(false);
  const toggle = (id) => {
    setPicked(p => p.includes(id) ? p.filter(x => x !== id) : (p.length >= 3 ? p : [...p, id]));
  };

  if (done) {
    return (
      <div className="at-fadein" style={{
        height: 'calc(100% - 6px)', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', padding: '0 24px',
      }}>
        <div style={{
          width: 88, height: 88, borderRadius: 999,
          background: T.teal + '24', color: T.teal,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}><Icon name="check" size={44} color={T.teal} stroke={2.4}/></div>
        <div className="at-h2" style={{ marginTop: 16, textAlign: 'center' }}>Goals sent to Tom's parent</div>
        <div className="at-body" style={{ marginTop: 6, textAlign: 'center' }}>
          They'll chart these targets at the Surrey Junior Open. Make sure to share them with Tom before the tournament.
        </div>
        <button onClick={onSubmitted} style={{
          marginTop: 22, padding: '11px 20px', borderRadius: 11,
          background: T.teal, color: '#04231D', border: 'none',
          fontSize: 13, fontWeight: 700,
        }}>Back to tournaments</button>
      </div>
    );
  }

  const grouped = {
    tech: PAIRINGS.filter(p => p.pillar === 'tech'),
    tac:  PAIRINGS.filter(p => p.pillar === 'tac'),
    men:  PAIRINGS.filter(p => p.pillar === 'men'),
    phy:  PAIRINGS.filter(p => p.pillar === 'phy'),
  };

  return (
    <div className="at-fadein" style={{ paddingBottom: 110 }}>
      <div style={{ padding: '8px 20px 12px', borderBottom: `1px solid ${T.border}` }}>
        <div className="at-eyebrow">SAT 17 MAY · SUTTON TENNIS</div>
        <div className="at-h2" style={{ marginTop: 3 }}>Goals · Surrey Junior Open</div>
        <div className="at-body" style={{ marginTop: 4, fontSize: 13 }}>
          Pick <b style={{ color: T.text }}>2-3 target-observation pairings</b>. Tom plays the targets; the parent charts the observations.
        </div>
        <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ display: 'flex', gap: 4 }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{
                width: 32, height: 4, borderRadius: 2,
                background: picked.length > i ? T.teal : T.border,
              }}/>
            ))}
          </div>
          <span className="at-mono" style={{ fontSize: 11, color: T.textDim }}>{picked.length} of 3 selected</span>
        </div>
      </div>

      {/* recommended panel */}
      <div style={{ padding: '12px 20px 4px' }}>
        <div style={{
          background: T.teal + '12', border: `1px solid ${T.teal}33`,
          borderRadius: 11, padding: '10px 12px',
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <Icon name="sparkle" size={16} color={T.teal}/>
          <div style={{ flex: 1, fontSize: 12, color: T.textDim }}>
            <span style={{ color: T.teal, fontWeight: 600 }}>Recommended</span> based on Tom's plan: tactical (amber) and mental (priority).
          </div>
        </div>
      </div>

      {/* groups */}
      {['tech', 'tac', 'men', 'phy'].map(k => (
        <div key={k} style={{ padding: '14px 20px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 8 }}>
            <span style={{
              fontSize: 9.5, fontWeight: 700, letterSpacing: '0.08em',
              padding: '3px 7px', borderRadius: 4,
              background: PillarColor[k] + '20', color: PillarColor[k],
            }}>{PillarLabel[k].toUpperCase()}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {grouped[k].map(p => {
              const isPicked = picked.includes(p.id);
              return (
                <button key={p.id} onClick={() => toggle(p.id)} className="at-tap" style={{
                  width: '100%', textAlign: 'left',
                  background: isPicked ? `linear-gradient(135deg, ${T.teal}1A, ${T.card})` : T.card,
                  border: `1px solid ${isPicked ? T.teal + '70' : T.border}`,
                  borderRadius: 13, padding: 13, color: T.text,
                  position: 'relative',
                }}>
                  {p.suggested && (
                    <span style={{
                      position: 'absolute', top: -7, right: 12,
                      fontSize: 9, fontWeight: 700, letterSpacing: '0.08em',
                      padding: '2px 7px', borderRadius: 4,
                      background: T.teal, color: '#04231D',
                    }}>SUGGESTED</span>
                  )}
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                    <div style={{
                      width: 22, height: 22, borderRadius: 6, flexShrink: 0,
                      background: isPicked ? T.teal : 'transparent',
                      border: `1.5px solid ${isPicked ? T.teal : T.borderHi}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      marginTop: 2,
                    }}>
                      {isPicked && <Icon name="check" size={13} color="#04231D" stroke={3}/>}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div className="at-mono" style={{ fontSize: 10, color: T.textMute, fontWeight: 600, letterSpacing: '0.06em' }}>{p.area.toUpperCase()}</div>
                      <div style={{ fontSize: 13.5, fontWeight: 600, color: T.text, marginTop: 3, lineHeight: 1.3 }}>
                        <span style={{ color: PillarColor[k], fontWeight: 700 }}>Tom: </span>{p.target}
                      </div>
                      <div style={{
                        marginTop: 7, padding: '6px 9px', borderRadius: 7,
                        background: T.bg, fontSize: 11.5, color: T.textDim,
                        display: 'flex', alignItems: 'center', gap: 5,
                      }}>
                        <Icon name="eq" size={11} color={T.textMute}/>
                        <span><span style={{ color: T.textMute }}>parent tracks:</span> {p.tracks}</span>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {/* bottom action */}
      <div style={{
        position: 'absolute', bottom: TAB_BAR_H + 6, left: 0, right: 0,
        padding: '10px 20px',
        background: `linear-gradient(to top, ${T.bg} 60%, transparent)`,
        zIndex: 10,
      }}>
        <button disabled={picked.length < 2} onClick={() => setDone(true)} style={{
          width: '100%', padding: '14px',
          background: picked.length >= 2 ? T.teal : T.surface,
          color: picked.length >= 2 ? '#04231D' : T.textMute,
          border: `1px solid ${picked.length >= 2 ? T.teal : T.border}`,
          borderRadius: 13, fontSize: 13.5, fontWeight: 700,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        }}>
          <Icon name="send" size={14} color={picked.length >= 2 ? '#04231D' : T.textMute}/>
          {picked.length >= 2 ? `Send ${picked.length} goals to parent` : 'Pick at least 2 pairings'}
        </button>
        <div className="at-meta" style={{ textAlign: 'center', marginTop: 6, fontSize: 11 }}>
          Don't forget to share these targets with Tom before the tournament.
        </div>
      </div>
    </div>
  );
}

// REVIEW (completed tournament) ──────────────────────────────
function TournamentReview({ tid, onBack, onReviewed }) {
  const [rags, setRags] = React.useState({}); // matchIdx_targetIdx -> rag
  const [reviewed, setReviewed] = React.useState(false);
  const cycle = (key, cur) => {
    const order = ['g', 'a', 'r'];
    const next = order[(order.indexOf(rags[key] || cur) + 1) % 3];
    setRags(s => ({ ...s, [key]: next }));
  };

  if (reviewed) {
    return (
      <div className="at-fadein" style={{
        height: 'calc(100% - 6px)', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', padding: '0 24px',
      }}>
        <div style={{
          width: 88, height: 88, borderRadius: 999,
          background: T.green + '24', color: T.green,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}><Icon name="check" size={44} color={T.green} stroke={2.4}/></div>
        <div className="at-h2" style={{ marginTop: 16, textAlign: 'center' }}>Kent review complete</div>
        <div className="at-body" style={{ marginTop: 6, textAlign: 'center' }}>
          Sent to Tom's parent. Targets will roll into next quarterly review.
        </div>
        <button onClick={onReviewed} style={{
          marginTop: 22, padding: '11px 20px', borderRadius: 11,
          background: T.teal, color: '#04231D', border: 'none',
          fontSize: 13, fontWeight: 700,
        }}>Back</button>
      </div>
    );
  }

  return (
    <div className="at-fadein" style={{ paddingBottom: 100 }}>
      <div style={{ padding: '8px 20px 12px', borderBottom: `1px solid ${T.border}` }}>
        <div className="at-eyebrow">SAT 03 MAY · BECKENHAM LTC</div>
        <div className="at-h2" style={{ marginTop: 3 }}>Kent Junior Open</div>
        <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
          <div className="at-num" style={{ fontSize: 18, fontWeight: 700 }}>1W · 1L</div>
          <span className="at-meta" style={{ alignSelf: 'center' }}>· 2 matches charted</span>
        </div>
      </div>

      {KENT_MATCHES.map((m, mi) => (
        <div key={mi} style={{ padding: '12px 20px 0' }}>
          <div className="at-card" style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 30, height: 30, borderRadius: 8,
                background: m.result === 'W' ? T.green + '24' : T.red + '24',
                color: m.result === 'W' ? T.green : T.red,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14, fontWeight: 700,
              }}>{m.result}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: T.text }}>vs. {m.opp}</div>
                <div className="at-num at-meta" style={{ fontSize: 12, marginTop: 1 }}>{m.score}</div>
              </div>
            </div>

            <div className="at-divider"/>

            {m.targets.map((tg, ti) => {
              const k = `${mi}_${ti}`;
              const cur = rags[k] || tg.rag;
              return (
                <div key={ti} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{
                      fontSize: 9.5, fontWeight: 700, letterSpacing: '0.06em',
                      padding: '2px 6px', borderRadius: 4,
                      background: PillarColor[tg.pillar] + '20', color: PillarColor[tg.pillar],
                    }}>{PillarLabel[tg.pillar].toUpperCase()}</span>
                    <div style={{ fontSize: 12, color: T.text, fontWeight: 600 }}>{tg.label}</div>
                  </div>
                  <div className="at-meta" style={{ fontSize: 12, color: T.textDim }}>{tg.target}</div>
                  <div style={{
                    background: T.cardHi, borderRadius: 9, padding: '9px 11px',
                    display: 'flex', alignItems: 'center', gap: 8,
                    border: `1px solid ${T.border}`,
                  }}>
                    <Icon name="eq" size={13} color={T.textMute}/>
                    <span className="at-mono" style={{ fontSize: 11.5, color: T.text, fontWeight: 600, flex: 1 }}>{tg.data}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    <span className="at-meta" style={{ fontSize: 11 }}>Coach assessment</span>
                    <div style={{ display: 'flex', gap: 4, marginLeft: 'auto' }}>
                      {[['g', 'achieved'], ['a', 'partial'], ['r', 'missed']].map(([rk, lbl]) => (
                        <button key={rk} onClick={() => setRags(s => ({ ...s, [k]: rk }))} style={{
                          padding: '4px 9px', borderRadius: 7,
                          background: cur === rk ? (rk === 'g' ? T.green : rk === 'a' ? T.amber : T.red) + '24' : 'transparent',
                          border: `1px solid ${cur === rk ? (rk === 'g' ? T.green : rk === 'a' ? T.amber : T.red) + '60' : T.border}`,
                          color: cur === rk ? (rk === 'g' ? T.green : rk === 'a' ? T.amber : T.red) : T.textMute,
                          fontSize: 10.5, fontWeight: 600,
                          display: 'flex', alignItems: 'center', gap: 4,
                        }}>
                          <RAG s={rk} size={6}/>{lbl}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* coach notes */}
      <div style={{ padding: '14px 20px 0' }}>
        <div className="at-eyebrow" style={{ marginBottom: 8 }}>COACH NOTES</div>
        <div className="at-card" style={{ padding: 12 }}>
          <div style={{ fontSize: 13, color: T.textDim, fontStyle: 'italic', lineHeight: 1.5 }}>
            "Net play turned the first match. Lost the routine in the second when behind — promote into next plan as red."
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
            <button style={{
              padding: '7px 11px', borderRadius: 9,
              background: T.cardHi, border: `1px solid ${T.border}`,
              color: T.textDim, fontSize: 11, fontWeight: 600,
              display: 'inline-flex', alignItems: 'center', gap: 4,
            }}><Icon name="edit" size={11}/> Edit</button>
            <button style={{
              padding: '7px 11px', borderRadius: 9,
              background: T.cardHi, border: `1px solid ${T.border}`,
              color: T.textDim, fontSize: 11, fontWeight: 600,
              display: 'inline-flex', alignItems: 'center', gap: 4,
            }}><Icon name="mic-sm" size={11}/> Voice note</button>
          </div>
        </div>
      </div>

      <div style={{
        position: 'absolute', bottom: TAB_BAR_H + 6, left: 0, right: 0,
        padding: '10px 20px',
        background: `linear-gradient(to top, ${T.bg} 60%, transparent)`,
      }}>
        <button onClick={() => setReviewed(true)} style={{
          width: '100%', padding: '14px',
          background: T.teal, color: '#04231D', border: 'none',
          borderRadius: 13, fontSize: 13.5, fontWeight: 700,
        }}>Mark as reviewed</button>
      </div>
    </div>
  );
}

// HOMEWORK ──────────────────────────────────────────────────
function HomeworkScreen({ pid }) {
  const [adding, setAdding] = React.useState(false);
  return (
    <div className="at-fadein" style={{ paddingBottom: 18 }}>
      <div style={{ padding: '12px 20px 4px' }}>
        <div className="at-h2">Homework</div>
        <div className="at-meta" style={{ marginTop: 3 }}>3 active assignments · parent logs completion</div>
      </div>

      {/* compliance summary */}
      <div style={{ padding: '12px 20px 8px' }}>
        <div className="at-card" style={{ padding: 16, display: 'flex', alignItems: 'center', gap: 16 }}>
          <ComplianceRing pct={78} size={68}/>
          <div style={{ flex: 1 }}>
            <div className="at-eyebrow" style={{ fontSize: 9 }}>OVERALL COMPLIANCE</div>
            <div className="at-num" style={{ fontSize: 26, fontWeight: 700, color: T.text, lineHeight: 1.1 }}>78%</div>
            <div style={{
              marginTop: 4, display: 'inline-flex', alignItems: 'center', gap: 4,
              padding: '2px 7px', borderRadius: 4,
              background: T.textMute + '24', color: T.textDim,
              fontSize: 10.5, fontWeight: 600,
            }}>
              <Icon name="eq" size={11} color={T.textDim}/> Stable · last 4 weeks
            </div>
          </div>
        </div>
      </div>

      {/* active assignments */}
      <div style={{ padding: '8px 20px 6px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, alignItems: 'baseline' }}>
          <div className="at-eyebrow">ACTIVE</div>
          <button onClick={() => setAdding(true)} style={{
            background: 'transparent', border: 'none',
            color: T.teal, fontSize: 12, fontWeight: 600,
            display: 'flex', alignItems: 'center', gap: 3,
          }}>
            <Icon name="plus" size={13} color={T.teal}/> Add
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {TOM_HOMEWORK.map(h => <HomeworkCard key={h.id} h={h}/>)}
        </div>
      </div>

      {/* archived hint */}
      <div style={{ padding: '14px 20px' }}>
        <div className="at-eyebrow" style={{ marginBottom: 8 }}>COMPLETED</div>
        <div className="at-card" style={{ padding: 12 }}>
          {[
            { task: 'Shadow swing 3 sets of 20', done: 'Apr 28', pillar: 'tech' },
            { task: 'Match-watch: Sinclair vs Park', done: 'Apr 22', pillar: 'tac' },
          ].map((c, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0',
              borderTop: i === 0 ? 'none' : `1px solid ${T.border}`,
            }}>
              <Icon name="check" size={14} color={T.green} stroke={2.4}/>
              <div style={{ flex: 1, fontSize: 12.5, color: T.textDim }}>{c.task}</div>
              <span className="at-mono" style={{ fontSize: 10, color: T.textMute }}>{c.done}</span>
            </div>
          ))}
        </div>
      </div>

      {adding && <AddHomeworkSheet onClose={() => setAdding(false)}/>}
    </div>
  );
}

function HomeworkCard({ h }) {
  const pct = Math.round(h.done / h.total * 100);
  const onTrack = pct >= 70;
  return (
    <div className="at-card" style={{ padding: 13 }}>
      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10, flexShrink: 0,
          background: PillarColor[h.pillar] + '1A',
          color: PillarColor[h.pillar],
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon name={h.pillar === 'tech' ? 'racket' : h.pillar === 'phy' ? 'dumb' : h.pillar === 'men' ? 'shield' : 'target'} size={18}/>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13.5, fontWeight: 600, color: T.text, lineHeight: 1.3 }}>{h.task}</div>
          <div className="at-meta" style={{ marginTop: 2, fontSize: 11 }}>{h.hint}</div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginTop: 8 }}>
            <span style={{
              fontSize: 9.5, fontWeight: 700, letterSpacing: '0.06em',
              padding: '2px 5px', borderRadius: 4,
              background: PillarColor[h.pillar] + '20', color: PillarColor[h.pillar],
            }}>{PillarLabel[h.pillar].toUpperCase()}</span>
            <span className="at-mono" style={{ fontSize: 10.5, color: T.textMute }}>{h.freq}</span>
          </div>
        </div>
      </div>
      {/* week progress dots */}
      <div style={{ marginTop: 11, display: 'flex', gap: 5, alignItems: 'center' }}>
        {Array.from({ length: h.total }, (_, i) => (
          <div key={i} style={{
            flex: 1, height: 6, borderRadius: 3,
            background: i < h.done ? (onTrack ? T.green : T.amber) : T.cardHi,
          }}/>
        ))}
        <span className="at-num" style={{
          marginLeft: 6, fontSize: 11, color: T.text, fontWeight: 600,
        }}>{h.done}/{h.total}</span>
      </div>
    </div>
  );
}

function ComplianceRing({ pct, size = 64 }) {
  const r = size/2 - 5;
  const c = 2 * Math.PI * r;
  const off = c * (1 - pct/100);
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={T.cardHi} strokeWidth="6"/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={T.teal} strokeWidth="6"
          strokeDasharray={c} strokeDashoffset={off} strokeLinecap="round"
          transform={`rotate(-90 ${size/2} ${size/2})`}/>
      </svg>
      <div style={{
        position: 'absolute', inset: 0, display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        fontSize: 13, fontWeight: 700, color: T.text,
      }} className="at-num">{pct}</div>
    </div>
  );
}

function AddHomeworkSheet({ onClose }) {
  return (
    <ModalShell onClose={onClose}>
      <div className="at-h2" style={{ marginBottom: 4 }}>Add homework</div>
      <div className="at-body" style={{ fontSize: 12.5 }}>Tom's parent will see this in their feed.</div>

      <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div>
          <div className="at-eyebrow" style={{ marginBottom: 5 }}>TASK</div>
          <div style={{
            background: T.bg, border: `1px solid ${T.border}`, borderRadius: 11,
            padding: '11px 12px', color: T.textMute, fontSize: 13,
          }}>
            e.g. 50 forehand feeds against the wall
          </div>
        </div>

        <div>
          <div className="at-eyebrow" style={{ marginBottom: 5 }}>PILLAR</div>
          <div style={{ display: 'flex', gap: 6 }}>
            {['tech', 'tac', 'phy', 'men'].map((k, i) => (
              <button key={k} style={{
                flex: 1, padding: '9px',
                background: i === 0 ? PillarColor[k] + '20' : T.bg,
                border: `1px solid ${i === 0 ? PillarColor[k] + '60' : T.border}`,
                color: i === 0 ? PillarColor[k] : T.textDim,
                borderRadius: 9, fontSize: 11, fontWeight: 600,
              }}>{PillarLabel[k]}</button>
            ))}
          </div>
        </div>

        <div>
          <div className="at-eyebrow" style={{ marginBottom: 5 }}>FREQUENCY</div>
          <div style={{ display: 'flex', gap: 6 }}>
            {['Daily', '5×/wk', '3×/wk', 'Before next'].map((f, i) => (
              <button key={f} style={{
                flex: 1, padding: '9px',
                background: i === 0 ? T.cardHi : T.bg,
                border: `1px solid ${i === 0 ? T.borderHi : T.border}`,
                color: i === 0 ? T.text : T.textDim,
                borderRadius: 9, fontSize: 11, fontWeight: 600,
              }}>{f}</button>
            ))}
          </div>
        </div>
      </div>

      <button style={{
        marginTop: 18, width: '100%', padding: '13px',
        background: T.teal, color: '#04231D', border: 'none',
        borderRadius: 12, fontSize: 13, fontWeight: 700,
      }} onClick={onClose}>Send to parent</button>
    </ModalShell>
  );
}

Object.assign(window, { TournamentsScreen, TournamentSetGoals, TournamentReview, HomeworkScreen });
