// Sample data for AceTraq coach prototype.
// All hardcoded — no backend.

const PLAYERS = [
  { id: 'tom',    name: 'Tom Henderson', age: 13, group: 'U14', tech: 'g', tac: 'a', phy: 'g', men: 'a', alerts: 2, next: 'Tue 13 May · 4:00 PM', focus: 'Net play in matches' },
  { id: 'mia',    name: 'Mia Patel',     age: 11, group: 'U12', tech: 'a', tac: 'g', phy: 'a', men: 'g', alerts: 1, next: 'Wed 14 May · 5:00 PM', focus: 'Forehand consistency' },
  { id: 'alex',   name: 'Alex Roberts',  age: 13, group: 'U14', tech: 'g', tac: 'g', phy: 'a', men: 'r', alerts: 3, next: 'Thu 15 May · 4:00 PM', focus: 'Body language under pressure' },
  { id: 'sophie', name: 'Sophie Chen',   age: 15, group: 'U16', tech: 'g', tac: 'g', phy: 'g', men: 'a', alerts: 0, next: 'Fri 16 May · 6:00 PM', focus: 'Routine consistency' },
  { id: 'james',  name: 'James Wilson',  age: 11, group: 'U12', tech: 'a', tac: 'r', phy: 'g', men: 'g', alerts: 2, next: 'Mon 19 May · 5:00 PM', focus: 'Point construction' },
  { id: 'olivia', name: 'Olivia Brown',  age: 13, group: 'U14', tech: 'g', tac: 'a', phy: 'a', men: 'g', alerts: 1, next: 'Tue 20 May · 4:00 PM', focus: 'Endurance in 3rd sets' },
  { id: 'noah',   name: 'Noah Taylor',   age: 15, group: 'U16', tech: 'a', tac: 'g', phy: 'g', men: 'g', alerts: 0, next: 'Wed 21 May · 6:00 PM', focus: 'Slice backhand variation' },
  { id: 'emma',   name: 'Emma Davis',    age: 11, group: 'U12', tech: 'g', tac: 'a', phy: 'g', men: 'a', alerts: 1, next: 'Thu 22 May · 5:00 PM', focus: 'Approach shot selection' },
];

const ALERTS = [
  { id: 1, kind: 'tournament',  pid: 'tom',    text: 'Tournament charting received',           sub: 'Kent Junior Open · review needed',           when: '2h ago',  pri: 'high' },
  { id: 2, kind: 'homework',    pid: 'alex',   text: 'No homework logged in 5 days',           sub: 'Mental routine drill · daily',                when: 'today',   pri: 'high' },
  { id: 3, kind: 'goals',       pid: 'mia',    text: 'No tournament goals set',                sub: 'Surrey Junior Open · Saturday',               when: '1d',      pri: 'med'  },
  { id: 4, kind: 'slot',        pid: null,     text: 'Cancelled slot · Thu 4:00 PM open',      sub: 'Promote to roster?',                          when: '3h ago',  pri: 'med'  },
  { id: 5, kind: 'payment',     pid: 'james',  text: 'Unpaid sessions × 2',                    sub: 'May 6, May 13 · £80',                         when: '2d',      pri: 'low'  },
];

// Tom Henderson development plan
const TOM_PLAN = {
  tech: { rag: 'g', focus: 'Forehand consistency under pressure', targets: [
    { id: 't1', text: 'Commit to full swing on first serve — no pushing', rag: 'g', date: '12 Mar 2026', notes: 'Looks more confident in last 3 sessions.' },
    { id: 't2', text: 'Develop slice backhand as variation',              rag: 'a', date: '12 Mar 2026', notes: 'Still inconsistent at pace; isolate in next block.' },
  ]},
  tac: { rag: 'a', focus: 'Bring the net into the game', targets: [
    { id: 't3', text: 'Come forward to net at least once per service game', rag: 'a', date: '12 Mar 2026', notes: '' },
    { id: 't4', text: 'Use forehand inside-out pattern on second-serve returns', rag: 'a', date: '21 Mar 2026', notes: '' },
  ]},
  phy: { rag: 'g', focus: 'Endurance in third sets', targets: [
    { id: 't5', text: 'Maintain movement intensity through third sets', rag: 'g', date: '12 Mar 2026', notes: '' },
    { id: 't6', text: 'Daily core strengthening routine (5 days/wk)',   rag: 'g', date: '12 Mar 2026', notes: 'Logged 4 of 5 last week.' },
  ]},
  men: { rag: 'a', focus: 'Routine + body language', targets: [
    { id: 't7', text: 'Use between-point routine consistently',           rag: 'a', date: '12 Mar 2026', notes: '' },
    { id: 't8', text: 'Positive body language when losing — no racket drops', rag: 'r', date: '02 Apr 2026', notes: 'Two incidents at Kent. High priority.' },
  ]},
};

const TOM_SESSIONS = [
  { id: 's1', day: 'Tue', date: '13 May', time: '4:00 PM – 5:00 PM', rag: 'g', paid: true,  status: 'Confirmed', upcoming: true },
  { id: 's2', day: 'Thu', date: '15 May', time: '5:00 PM – 6:00 PM', rag: 'a', paid: false, status: 'Awaiting parent', upcoming: true },
  { id: 's3', day: 'Tue', date: '20 May', time: '4:00 PM – 5:00 PM', rag: 'r', paid: false, status: 'Cancelled', upcoming: true, cancelled: true },
  { id: 's4', day: 'Thu', date: '22 May', time: '5:00 PM – 6:00 PM', rag: 'a', paid: false, status: 'Awaiting parent', upcoming: true },
  { id: 's5', day: 'Thu', date: '08 May', time: '5:00 PM – 6:00 PM', rag: 'g', paid: true,  status: 'Completed',  upcoming: false },
  { id: 's6', day: 'Tue', date: '06 May', time: '4:00 PM – 5:00 PM', rag: 'g', paid: true,  status: 'Completed',  upcoming: false },
];

const TOM_TOURNAMENTS = [
  { id: 'kent',    name: 'Kent Junior Open',    venue: 'Beckenham LTC',   date: '03 May 2026', state: 'review',   results: '1W · 1L' },
  { id: 'surrey',  name: 'Surrey Junior Open',  venue: 'Sutton Tennis',   date: '17 May 2026', state: 'upcoming', results: null },
  { id: 'bromley', name: 'Bromley Spring Open', venue: 'Bromley LTA',     date: '12 Apr 2026', state: 'reviewed', results: '3W · 1L' },
];

const KENT_MATCHES = [
  { opp: 'J. Smith',  score: 'W 6-3, 6-4',     result: 'W',
    targets: [
      { pillar: 'tac', label: 'Net play',          target: 'Approach at least once per service game', data: '12 approaches · 8 won', rag: 'g' },
      { pillar: 'men', label: 'Mental discipline', target: 'Routine every point',                     data: 'Routine: consistently · Body language: positive', rag: 'g' },
    ]},
  { opp: 'R. Kumar',  score: 'L 4-6, 6-4, 3-6', result: 'L',
    targets: [
      { pillar: 'tac', label: 'Net play',          target: 'Approach at least once per service game', data: '5 approaches · 2 won',  rag: 'r' },
      { pillar: 'men', label: 'Mental discipline', target: 'Routine every point',                     data: 'Routine: sometimes · Body language: negative', rag: 'r' },
    ]},
];

// Available target-observation pairings (for setting tournament goals)
const PAIRINGS = [
  { id: 'p1', pillar: 'tech', area: 'Serve',          target: 'Go for first serve — full swing',                tracks: 'Double faults · Aces',                 suggested: false },
  { id: 'p2', pillar: 'tech', area: 'Net play',       target: 'Come forward at least once per service game',     tracks: 'Net approaches · Points won at net',   suggested: true  },
  { id: 'p3', pillar: 'tac',  area: 'Return of serve',target: 'Step inside baseline on 2nd-serve returns',        tracks: 'Frequency · Break points earned',      suggested: true  },
  { id: 'p4', pillar: 'tac',  area: 'Point construction', target: 'Play the forehand inside-out pattern',         tracks: 'Approach (went / safe / mixed)',       suggested: false },
  { id: 'p5', pillar: 'men',  area: 'Mental discipline',  target: 'Use between-point routine every point',        tracks: 'Routine · Body language',              suggested: true  },
  { id: 'p6', pillar: 'men',  area: 'Resilience',     target: 'After lost game, win first point of next',         tracks: 'Response to adversity',                suggested: false },
  { id: 'p7', pillar: 'phy',  area: 'Movement',       target: 'Keep feet moving until last point',                tracks: 'Energy per set',                       suggested: false },
];

const TOM_HOMEWORK = [
  { id: 'h1', task: '50 forehand feeds against wall',     hint: 'Contact-point focus, racket-face square',
    pillar: 'tech', freq: 'Daily',     done: 4, total: 7, on: true },
  { id: 'h2', task: 'Core strengthening circuit',         hint: 'Planks, sit-ups, Russian twists',
    pillar: 'phy',  freq: '5 × week',  done: 3, total: 5, on: true  },
  { id: 'h3', task: '5-min visualisation before bed',     hint: 'Picture yourself winning at the net',
    pillar: 'men',  freq: 'Daily',     done: 6, total: 7, on: true  },
];

const TOM_RECENT = [
  { kind: 'feedback',   text: 'Session feedback sent',                when: 'Tue 6 May' },
  { kind: 'tournament', text: 'Charting received · Kent Junior Open', when: 'Sat 3 May' },
  { kind: 'homework',   text: '50 ball feeds completed',              when: 'Fri 2 May' },
  { kind: 'session',    text: 'Session completed · 60 min',           when: 'Thu 1 May' },
];

const TOM_FEEDBACK_HISTORY = [
  { id: 'f1', date: 'Tue 6 May',  preview: 'Better commitment on first serve. Slice backhand still rushed.', sent: true },
  { id: 'f2', date: 'Thu 1 May',  preview: 'Tactical block — net approaches up. Routine slipping mid-rally.', sent: true },
  { id: 'f3', date: 'Tue 29 Apr', preview: 'Movement quality good through third set drill.',                  sent: true },
];

// AI summary for the latest fake recording (review state)
const FEEDBACK_DRAFT = {
  duration: '04:32',
  pillars: {
    tech: ['Forehand: solid contact under pressure today, especially on cross-court patterns.', 'Slice backhand: still pulling head up at contact — losing depth.'],
    tac:  ['Net approaches: came in 4 times in the live game — converted 3.', 'Pattern play: fell back into baseline rallies in the tiebreak.'],
    phy:  ['Movement looked sharp through both sets. No drop-off in the third drill.'],
    men:  ['Routine: applied consistently in first set, slipped after 4-2 down.', 'Body language: positive throughout, no racket drops today.'],
  },
  workOn: [
    { pillar: 'tech', text: 'Slice backhand: keep head still through contact (10 min cross-court drill before next session).' },
    { pillar: 'tac',  text: 'Force at least one net approach per service game in next match — even on point-of-no-return rallies.' },
    { pillar: 'men',  text: 'Reset routine after every break point, won or lost.' },
  ],
};

Object.assign(window, {
  PLAYERS, ALERTS, TOM_PLAN, TOM_SESSIONS, TOM_TOURNAMENTS, KENT_MATCHES,
  PAIRINGS, TOM_HOMEWORK, TOM_RECENT, TOM_FEEDBACK_HISTORY, FEEDBACK_DRAFT,
});
