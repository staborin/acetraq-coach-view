export type RAG = "green" | "amber" | "red";
export type Pillar = "Technical" | "Tactical" | "Physical" | "Mental";

export const PILLARS: Pillar[] = ["Technical", "Tactical", "Physical", "Mental"];

export type Player = {
  id: string;
  name: string;
  firstName: string;
  ageGroup: string;
  age: number;
  pillars: Record<Pillar, RAG>;
  nextSession: string;
  lastSession: string;
  attentionItems: number;
  currentPhase: string;
  homeworkCompliance: number;
  lastTournament: string;
};

export const players: Player[] = [
  {
    id: "tom",
    name: "Tom Henderson",
    firstName: "Tom",
    ageGroup: "U14",
    age: 13,
    pillars: { Technical: "green", Tactical: "amber", Physical: "green", Mental: "amber" },
    nextSession: "Tue 13 May, 4:00 PM",
    lastSession: "Thu 8 May",
    attentionItems: 2,
    currentPhase:
      "Focusing on transitioning net play from drills to match situations. Physical conditioning programme started for endurance in third sets.",
    homeworkCompliance: 78,
    lastTournament: "Kent Junior Open — May 3",
  },
  {
    id: "mia",
    name: "Mia Patel",
    firstName: "Mia",
    ageGroup: "U12",
    age: 11,
    pillars: { Technical: "amber", Tactical: "green", Physical: "amber", Mental: "green" },
    nextSession: "Wed 14 May, 5:00 PM",
    lastSession: "Mon 5 May",
    attentionItems: 1,
    currentPhase:
      "Building forehand consistency under pressure. Working on tactical patterns to leverage natural court awareness.",
    homeworkCompliance: 64,
    lastTournament: "Bromley Spring Open — Apr 12",
  },
  {
    id: "alex",
    name: "Alex Roberts",
    firstName: "Alex",
    ageGroup: "U14",
    age: 13,
    pillars: { Technical: "green", Tactical: "green", Physical: "amber", Mental: "red" },
    nextSession: "Tue 13 May, 5:00 PM",
    lastSession: "Fri 9 May",
    attentionItems: 3,
    currentPhase:
      "Mental game is the priority — building between-point routine and emotional regulation in tight matches.",
    homeworkCompliance: 41,
    lastTournament: "Surrey Junior — Apr 26",
  },
  {
    id: "sophie",
    name: "Sophie Chen",
    firstName: "Sophie",
    ageGroup: "U16",
    age: 15,
    pillars: { Technical: "green", Tactical: "green", Physical: "green", Mental: "amber" },
    nextSession: "Thu 15 May, 6:00 PM",
    lastSession: "Tue 6 May",
    attentionItems: 0,
    currentPhase:
      "Polishing tournament mindset ahead of regional qualifier. Maintaining all four pillars at competition level.",
    homeworkCompliance: 92,
    lastTournament: "Regional U16 Qualifier — May 1",
  },
  {
    id: "james",
    name: "James Wilson",
    firstName: "James",
    ageGroup: "U12",
    age: 11,
    pillars: { Technical: "amber", Tactical: "red", Physical: "green", Mental: "green" },
    nextSession: "Sat 17 May, 10:00 AM",
    lastSession: "Sat 10 May",
    attentionItems: 2,
    currentPhase:
      "Tactical decision-making is the focus — moving from one-shot mentality to constructing points.",
    homeworkCompliance: 70,
    lastTournament: "Kent U12 Open — Apr 19",
  },
  {
    id: "olivia",
    name: "Olivia Brown",
    firstName: "Olivia",
    ageGroup: "U14",
    age: 13,
    pillars: { Technical: "green", Tactical: "amber", Physical: "amber", Mental: "green" },
    nextSession: "Wed 14 May, 4:00 PM",
    lastSession: "Wed 7 May",
    attentionItems: 1,
    currentPhase:
      "Strengthening movement quality and tactical awareness in baseline rallies.",
    homeworkCompliance: 81,
    lastTournament: "Bromley Spring Open — Apr 12",
  },
  {
    id: "noah",
    name: "Noah Taylor",
    firstName: "Noah",
    ageGroup: "U16",
    age: 15,
    pillars: { Technical: "amber", Tactical: "green", Physical: "green", Mental: "green" },
    nextSession: "Thu 15 May, 7:00 PM",
    lastSession: "Thu 8 May",
    attentionItems: 0,
    currentPhase:
      "Refining serve mechanics — adding kick variation and improving second serve placement.",
    homeworkCompliance: 88,
    lastTournament: "U16 County Cup — Apr 28",
  },
  {
    id: "emma",
    name: "Emma Davis",
    firstName: "Emma",
    ageGroup: "U12",
    age: 11,
    pillars: { Technical: "green", Tactical: "amber", Physical: "green", Mental: "amber" },
    nextSession: "Sat 17 May, 11:00 AM",
    lastSession: "Sat 10 May",
    attentionItems: 1,
    currentPhase:
      "Building point construction and confidence in match situations.",
    homeworkCompliance: 75,
    lastTournament: "Kent U12 Open — Apr 19",
  },
];

export const getPlayer = (id: string) => players.find((p) => p.id === id);

export const alerts = [
  { id: "1", text: "Tom's tournament charting data received — review needed", playerId: "tom", tone: "info" as const },
  { id: "2", text: "Alex hasn't completed homework in 5 days", playerId: "alex", tone: "warn" as const },
  { id: "3", text: "Mia's session tomorrow — no goals set for Saturday tournament", playerId: "mia", tone: "warn" as const },
  { id: "4", text: "Cancelled slot: Thursday 4pm now available — promote to roster?", tone: "info" as const },
];

// --- Player-specific data (for Tom, used as deep example) ---

export type Target = { id: string; text: string; status: RAG; setOn: string; notes?: string };

export const developmentPlan: Record<Pillar, Target[]> = {
  Technical: [
    { id: "t1", text: "Commit to full swing on first serve — no pushing", status: "green", setOn: "12 Mar 2026" },
    { id: "t2", text: "Develop slice backhand as variation", status: "amber", setOn: "12 Mar 2026", notes: "Progressing in drills, not yet in match play." },
  ],
  Tactical: [
    { id: "ta1", text: "Come forward to net at least once per service game", status: "amber", setOn: "12 Mar 2026" },
    { id: "ta2", text: "Use forehand inside-out pattern on second serve returns", status: "amber", setOn: "12 Mar 2026" },
  ],
  Physical: [
    { id: "p1", text: "Maintain movement intensity through third sets", status: "green", setOn: "12 Mar 2026" },
    { id: "p2", text: "Daily core strengthening routine (5 days/week)", status: "green", setOn: "12 Mar 2026" },
  ],
  Mental: [
    { id: "m1", text: "Use between-point routine consistently", status: "amber", setOn: "12 Mar 2026" },
    { id: "m2", text: "Positive body language when losing — no racket drops", status: "red", setOn: "12 Mar 2026", notes: "Two visible incidents at Kent Open." },
  ],
};

export type Session = {
  id: string;
  date: string;
  day: string;
  time: string;
  status: "confirmed" | "unconfirmed" | "cancelled";
  paid: boolean;
  past?: boolean;
};

export const sessions: Session[] = [
  { id: "s1", date: "Tue 6 May", day: "Tuesday", time: "4:00 PM — 5:00 PM", status: "confirmed", paid: true, past: true },
  { id: "s2", date: "Thu 8 May", day: "Thursday", time: "5:00 PM — 6:00 PM", status: "confirmed", paid: true, past: true },
  { id: "s3", date: "Tue 13 May", day: "Tuesday", time: "4:00 PM — 5:00 PM", status: "confirmed", paid: false },
  { id: "s4", date: "Thu 15 May", day: "Thursday", time: "5:00 PM — 6:00 PM", status: "unconfirmed", paid: false },
  { id: "s5", date: "Tue 20 May", day: "Tuesday", time: "4:00 PM — 5:00 PM", status: "cancelled", paid: false },
  { id: "s6", date: "Thu 22 May", day: "Thursday", time: "5:00 PM — 6:00 PM", status: "unconfirmed", paid: false },
];

export type Tournament = {
  id: string;
  name: string;
  date: string;
  venue: string;
  state: "set-goals" | "in-progress" | "review" | "reviewed";
  results?: string;
};

export const tournaments: Tournament[] = [
  { id: "surrey-may", name: "Surrey Junior Open", date: "May 17", venue: "Surrey LTC", state: "set-goals" },
  { id: "kent-may", name: "Kent Junior Open", date: "May 3", venue: "Beckenham", state: "review", results: "1W — 1L" },
  { id: "bromley-apr", name: "Bromley Spring Open", date: "Apr 12", venue: "Bromley TC", state: "reviewed", results: "2W — 1L" },
];

export type Pairing = {
  id: string;
  pillar: Pillar;
  category: string;
  target: string;
  observation: string;
  recommended?: boolean;
};

export const pairings: Pairing[] = [
  { id: "pa1", pillar: "Technical", category: "Serve", target: "Go for first serve — full swing", observation: "Track double faults (count) + aces (count)" },
  { id: "pa2", pillar: "Technical", category: "Net Play", target: "Come forward at least once per service game", observation: "Net approaches (count) + points won at net (count)", recommended: true },
  { id: "pa3", pillar: "Tactical", category: "Return of Serve", target: "Step inside baseline on second serve returns", observation: "Frequency (most/sometimes/rarely) + break points earned (count)", recommended: true },
  { id: "pa4", pillar: "Tactical", category: "Point Construction", target: "Play the forehand pattern", observation: "Approach (went for shots / played safe / mixed)" },
  { id: "pa5", pillar: "Mental", category: "Mental Discipline", target: "Use between-point routine every point", observation: "Routine usage + body language", recommended: true },
  { id: "pa6", pillar: "Mental", category: "Resilience", target: "When you lose a game, win first point of next", observation: "Response to adversity" },
  { id: "pa7", pillar: "Physical", category: "Physical", target: "Keep feet moving to the last point", observation: "Energy per set (strong/OK/dropped off)" },
];

export type Homework = {
  id: string;
  task: string;
  pillar: Pillar;
  frequency: string;
  done: number;
  total: number;
};

export const homework: Homework[] = [
  { id: "h1", task: "50 forehand feeds against wall — contact point focus", pillar: "Technical", frequency: "Daily", done: 4, total: 7 },
  { id: "h2", task: "Core strengthening routine (planks, sit-ups, Russian twists)", pillar: "Physical", frequency: "5x/week", done: 3, total: 5 },
  { id: "h3", task: "5-minute visualisation before bed — picture yourself winning at the net", pillar: "Mental", frequency: "Daily", done: 6, total: 7 },
];

export const sessionFeedbackHistory = [
  { id: "sf1", date: "8 May 2026", preview: "Strong serving session. Net play improving — ready to test in tournament.", status: "sent" as const },
  { id: "sf2", date: "6 May 2026", preview: "Worked on forehand inside-out. Footwork still recovering after change of direction.", status: "sent" as const },
  { id: "sf3", date: "1 May 2026", preview: "Tactical patterns drill. Discussed Kent Open prep.", status: "sent" as const },
];

export const aiFeedbackDraft: Record<Pillar, string> = {
  Technical:
    "Serve looking sharp — full swing on first serve consistent through the session. Slice backhand connecting cleanly off the live ball, but still defaulting to topspin under pressure.",
  Tactical:
    "Net approaches happened naturally in pattern drills. Forehand inside-out pattern executed well off short balls. Decision-making improving — chose the right ball to attack 7/10 times.",
  Physical:
    "Movement quality strong throughout. Kept feet active through all three drill sets without dropping intensity. Core work showing — better recovery between exchanges.",
  Mental:
    "Between-point routine present in first half of session, slipped when fatigued. One frustration moment after a missed putaway, recovered well. Body language stayed positive overall.",
};

export const thingsToWorkOn = [
  "Trust the slice backhand in match-pressure rallies — not just on neutral balls.",
  "Maintain between-point routine in the second half of training.",
  "Continue net approach pattern — bring it into Surrey Junior Open this Saturday.",
];

export type MatchCharting = {
  opponent: string;
  score: string;
  result: "W" | "L";
  pairings: { pairingId: string; data: string; rag: RAG }[];
};

export const kentOpenMatches: MatchCharting[] = [
  {
    opponent: "J. Smith",
    score: "6-3 6-4",
    result: "W",
    pairings: [
      { pairingId: "pa2", data: "12 approaches, 8 points won at net", rag: "green" },
      { pairingId: "pa5", data: "Routine: consistently · Body language: positive", rag: "green" },
    ],
  },
  {
    opponent: "R. Kumar",
    score: "4-6 6-4 3-6",
    result: "L",
    pairings: [
      { pairingId: "pa2", data: "5 approaches, 2 points won at net", rag: "red" },
      { pairingId: "pa5", data: "Routine: sometimes · Body language: negative", rag: "red" },
    ],
  },
];
