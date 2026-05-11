// AceTraq design tokens + primitive components
// Design language: deep navy/charcoal surfaces, teal CTA, RAG status,
// Sora for headings, JetBrains Mono for stats. Avoid emoji.

const T = {
  // surfaces
  bg:        '#0A1020',
  surface:   '#121B30',
  card:      '#172339',
  cardHi:    '#1E2C46',
  border:    'rgba(255,255,255,0.07)',
  borderHi:  'rgba(255,255,255,0.13)',
  // text
  text:      '#E8ECF4',
  textDim:   '#A9B2C5',
  textMute:  '#6C7691',
  // accent
  teal:      '#1FD3B0',
  tealDark:  '#0FA38A',
  blue:      '#5AA5FF',
  // RAG
  green:     '#34D17A',
  amber:     '#F4B53A',
  red:       '#F26060',
  // light surfaces (used inside white "content" sheets per brief)
  sheet:     '#F6F7FA',
  sheetCard: '#FFFFFF',
};

// CSS injected once
function ThemeStyles() {
  return (
    <style>{`
      .at-app { font-family: 'Sora', -apple-system, system-ui, sans-serif; color: ${T.text}; background: ${T.bg}; }
      .at-app, .at-app * { box-sizing: border-box; -webkit-font-smoothing: antialiased; }
      .at-app button { font-family: inherit; cursor: pointer; }
      .at-mono { font-family: 'JetBrains Mono', ui-monospace, monospace; font-feature-settings: "tnum" 1; }
      .at-num { font-family: 'JetBrains Mono', ui-monospace, monospace; font-feature-settings: "tnum" 1; letter-spacing: -0.01em; }
      .at-h1 { font-family: 'Sora'; font-weight: 700; font-size: 26px; letter-spacing: -0.02em; line-height: 1.1; }
      .at-h2 { font-family: 'Sora'; font-weight: 700; font-size: 20px; letter-spacing: -0.015em; line-height: 1.2; }
      .at-h3 { font-family: 'Sora'; font-weight: 600; font-size: 16px; letter-spacing: -0.01em; line-height: 1.25; }
      .at-eyebrow { font-family: 'JetBrains Mono', monospace; font-size: 10.5px; font-weight: 500; letter-spacing: 0.14em; text-transform: uppercase; color: ${T.textMute}; }
      .at-body { font-size: 14px; line-height: 1.45; color: ${T.textDim}; }
      .at-meta { font-size: 12px; line-height: 1.4; color: ${T.textMute}; }
      .at-card { background: ${T.card}; border: 1px solid ${T.border}; border-radius: 16px; }
      .at-card-light { background: ${T.sheetCard}; border-radius: 16px; box-shadow: 0 1px 2px rgba(11,18,32,0.04), 0 4px 14px rgba(11,18,32,0.06); }
      .at-divider { height: 1px; background: ${T.border}; }
      .at-divider-light { height: 1px; background: rgba(11,18,32,0.06); }
      .at-tap { transition: transform .12s ease, background .12s ease; }
      .at-tap:active { transform: scale(0.98); }
      .at-scroll::-webkit-scrollbar { width: 0; height: 0; }
      .at-fadein { animation: atFade .25s ease-out; }
      @keyframes atFade { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: none; } }
      @keyframes atPulse { 0%,100% { opacity: 1; } 50% { opacity: .35; } }
      .at-pulse { animation: atPulse 1.4s ease-in-out infinite; }
      @keyframes atRipple { 0% { transform: scale(.6); opacity: .9; } 100% { transform: scale(2.2); opacity: 0; } }
      .at-ripple { animation: atRipple 1.6s ease-out infinite; }
    `}</style>
  );
}

// RAG dot
function RAG({ s, size = 9, ring = false }) {
  const c = s === 'g' ? T.green : s === 'a' ? T.amber : s === 'r' ? T.red : T.textMute;
  return (
    <span style={{
      display: 'inline-block', width: size, height: size, borderRadius: 999,
      background: c,
      boxShadow: ring ? `0 0 0 3px ${c}26` : 'none',
      flexShrink: 0,
    }} />
  );
}

// Pillar abbrev tag
function Pillar({ k, dim = false }) {
  const map = { tech: 'TEC', tac: 'TAC', phy: 'PHY', men: 'MEN' };
  const colorMap = { tech: T.teal, tac: T.blue, phy: '#C792EA', men: '#FFB55C' };
  return (
    <span className="at-mono" style={{
      fontSize: 9.5, fontWeight: 600, letterSpacing: '0.1em',
      padding: '3px 6px', borderRadius: 4,
      background: dim ? `${colorMap[k]}1A` : `${colorMap[k]}24`,
      color: colorMap[k],
    }}>{map[k]}</span>
  );
}
const PillarColor = { tech: '#1FD3B0', tac: '#5AA5FF', phy: '#C792EA', men: '#FFB55C' };
const PillarLabel = { tech: 'Technical', tac: 'Tactical', phy: 'Physical', men: 'Mental' };

// Avatar — initials with hash color
function Avatar({ name, size = 36, ring = false, status }) {
  const initials = name.split(' ').map(w => w[0]).slice(0, 2).join('');
  const palette = ['#1FD3B0', '#5AA5FF', '#C792EA', '#FFB55C', '#F26060', '#34D17A', '#7A8BFF'];
  const hash = [...name].reduce((a, c) => a + c.charCodeAt(0), 0);
  const bg = palette[hash % palette.length];
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <div style={{
        width: size, height: size, borderRadius: 999,
        background: `linear-gradient(135deg, ${bg}, ${bg}AA)`,
        color: '#0A1020', fontWeight: 700, fontSize: size * 0.36,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: ring ? `0 0 0 2px ${T.bg}, 0 0 0 3.5px ${bg}` : 'none',
        letterSpacing: '-0.02em',
      }}>{initials}</div>
      {status && (
        <span style={{
          position: 'absolute', bottom: -1, right: -1, width: 10, height: 10,
          borderRadius: 999, background: status === 'g' ? T.green : status === 'a' ? T.amber : T.red,
          boxShadow: `0 0 0 2px ${T.card}`,
        }}/>
      )}
    </div>
  );
}

// Pillar mini-strip (4 dots) used on player cards
function PillarStrip({ tech, tac, phy, men, size = 7 }) {
  return (
    <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
      <RAG s={tech} size={size} />
      <RAG s={tac} size={size} />
      <RAG s={phy} size={size} />
      <RAG s={men} size={size} />
    </div>
  );
}

// Inline icons (stroke-based, 20-px grid)
const Icon = ({ name, size = 20, color = 'currentColor', stroke = 1.7 }) => {
  const p = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: color, strokeWidth: stroke, strokeLinecap: 'round', strokeLinejoin: 'round' };
  switch (name) {
    case 'home': return <svg {...p}><path d="M3 11l9-7 9 7v9a2 2 0 0 1-2 2h-4v-7h-6v7H5a2 2 0 0 1-2-2v-9z"/></svg>;
    case 'calendar': return <svg {...p}><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>;
    case 'mic': return <svg {...p}><rect x="9" y="3" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg>;
    case 'msg': return <svg {...p}><path d="M21 12a8 8 0 0 1-11.6 7.1L3 21l1.9-6.4A8 8 0 1 1 21 12z"/></svg>;
    case 'user': return <svg {...p}><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>;
    case 'bell': return <svg {...p}><path d="M6 8a6 6 0 0 1 12 0c0 7 3 8 3 8H3s3-1 3-8M10 21a2 2 0 0 0 4 0"/></svg>;
    case 'plus': return <svg {...p}><path d="M12 5v14M5 12h14"/></svg>;
    case 'chevR': return <svg {...p}><path d="M9 6l6 6-6 6"/></svg>;
    case 'chevL': return <svg {...p}><path d="M15 6l-6 6 6 6"/></svg>;
    case 'chevD': return <svg {...p}><path d="M6 9l6 6 6-6"/></svg>;
    case 'chevU': return <svg {...p}><path d="M6 15l6-6 6 6"/></svg>;
    case 'check': return <svg {...p}><path d="M5 13l4 4L19 7"/></svg>;
    case 'x': return <svg {...p}><path d="M6 6l12 12M18 6L6 18"/></svg>;
    case 'edit': return <svg {...p}><path d="M14 4l6 6L9 21H3v-6L14 4z"/></svg>;
    case 'send': return <svg {...p}><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>;
    case 'play': return <svg {...p}><path d="M6 4l14 8-14 8V4z" fill={color}/></svg>;
    case 'pause': return <svg {...p}><rect x="6" y="4" width="4" height="16" fill={color}/><rect x="14" y="4" width="4" height="16" fill={color}/></svg>;
    case 'stop': return <svg {...p}><rect x="6" y="6" width="12" height="12" rx="2" fill={color}/></svg>;
    case 'trophy': return <svg {...p}><path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4zM7 4H4v3a3 3 0 0 0 3 3M17 4h3v3a3 3 0 0 1-3 3"/></svg>;
    case 'target': return <svg {...p}><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5" fill={color}/></svg>;
    case 'dumb': return <svg {...p}><path d="M2 12h2M20 12h2M6 7v10M18 7v10M9 10h6v4H9z"/></svg>;
    case 'book': return <svg {...p}><path d="M4 4h7a3 3 0 0 1 3 3v14a2 2 0 0 0-2-2H4V4zM20 4h-7a3 3 0 0 0-3 3v14a2 2 0 0 1 2-2h8V4z"/></svg>;
    case 'clock': return <svg {...p}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>;
    case 'arrow-up': return <svg {...p}><path d="M12 19V5M5 12l7-7 7 7"/></svg>;
    case 'arrow-dn': return <svg {...p}><path d="M12 5v14M19 12l-7 7-7-7"/></svg>;
    case 'arrow-rt': return <svg {...p}><path d="M5 12h14M12 5l7 7-7 7"/></svg>;
    case 'eq': return <svg {...p}><path d="M5 12h14"/></svg>;
    case 'search': return <svg {...p}><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>;
    case 'filter': return <svg {...p}><path d="M3 5h18l-7 9v6l-4-2v-4L3 5z"/></svg>;
    case 'pound': return <svg {...p}><path d="M7 21h11M9 21V9a4 4 0 0 1 8 0M6 14h10"/></svg>;
    case 'flag': return <svg {...p}><path d="M5 21V4M5 4h12l-2 4 2 4H5"/></svg>;
    case 'flame': return <svg {...p}><path d="M12 2c1 4 5 5 5 10a5 5 0 0 1-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3-1-5 1-9z"/></svg>;
    case 'list': return <svg {...p}><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg>;
    case 'grid': return <svg {...p}><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>;
    case 'pin': return <svg {...p}><path d="M12 22s7-7 7-12a7 7 0 1 0-14 0c0 5 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/></svg>;
    case 'volume': return <svg {...p}><path d="M11 5L6 9H2v6h4l5 4V5zM15 9a4 4 0 0 1 0 6"/></svg>;
    case 'shield': return <svg {...p}><path d="M12 3l8 3v6c0 5-4 8-8 9-4-1-8-4-8-9V6l8-3z"/></svg>;
    case 'sparkle': return <svg {...p}><path d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6L12 3zM19 14l.8 2.2L22 17l-2.2.8L19 20l-.8-2.2L16 17l2.2-.8L19 14z"/></svg>;
    case 'racket': return <svg {...p}><circle cx="9" cy="9" r="6"/><path d="M5.2 13l-2.7 4.3a2 2 0 0 0 .3 2.5l1.4 1.4a2 2 0 0 0 2.5.3L11 18.8M9 5v8M5 9h8"/></svg>;
    case 'tennis': return <svg {...p}><circle cx="12" cy="12" r="9"/><path d="M3.6 8a9 9 0 0 1 16.8 0M3.6 16a9 9 0 0 0 16.8 0"/></svg>;
    case 'wave': return <svg {...p}><path d="M3 12c2-3 4-3 6 0s4 3 6 0 4-3 6 0"/></svg>;
    case 'mic-sm': return <svg {...p} strokeWidth={2}><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0"/></svg>;
    default: return null;
  }
};

Object.assign(window, { T, ThemeStyles, RAG, Pillar, PillarColor, PillarLabel, Avatar, PillarStrip, Icon });
