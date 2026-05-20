/* eslint-disable */
// M3S — My Profile
// Loads from localStorage(`m3s.journey`) seeded by onboarding-flow.jsx,
// adds inline pencil-edit per field, plus a monthly progress log + graph.

const OT = {
  sand50: '#FBF7F0', sand100: '#F5EDE0', sand200: '#EADBC4', sand300: '#D9C3A3',
  paper: '#FFFDF8', ink: '#1C140E',
  clay500: '#A8825A', clay600: '#8A6640',
  walnut: '#5E4228', espresso800: '#3E2C1C', espresso900: '#241810',
  ochre: '#C99A3F', sage: '#7B8B6F', terra: '#B86B4B',
  ok: '#5E8A5E', warn: '#C97A3F', bad: '#B0463A',
  hairline: 'rgba(62,44,28,0.12)', hairlineStrong: 'rgba(62,44,28,0.22)',
  fDisplay: '"Instrument Serif", "Cormorant Garamond", Georgia, serif',
  fBody: '"Inter", system-ui, sans-serif',
  fMono: '"JetBrains Mono", ui-monospace, monospace',
  sh1: '0 1px 2px rgba(62,44,28,0.06)',
  sh2: '0 6px 20px -8px rgba(62,44,28,0.18)',
  sh3: '0 20px 50px -20px rgba(62,44,28,0.35)',
};

// ─── Primitives ───────────────────────────────────────────────────────────
const OEyebrow = ({ children, dot = OT.walnut, color = OT.clay600, size = 11 }) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: 8,
    fontFamily: OT.fMono, fontSize: size, letterSpacing: 1.8,
    textTransform: 'uppercase', color, fontWeight: 500,
  }}>
    <span style={{ width: 6, height: 6, borderRadius: 999, background: dot, flexShrink: 0 }} />
    <span>{children}</span>
  </div>
);

const OMono = ({ children, size = 10, color = OT.clay600, style = {} }) => (
  <div style={{
    fontFamily: OT.fMono, fontSize: size, letterSpacing: 1.5,
    textTransform: 'uppercase', color, fontWeight: 500, ...style,
  }}>{children}</div>
);

const Pencil = ({ size = 13, color = OT.clay600 }) => (
  <svg className="pencil" width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <path d="M16.474 5.408l2.118 2.118m-1.082-3.2L13.69 8.144 4 17.834V20h2.166l9.69-9.69 3.624-3.624a1.527 1.527 0 0 0-2.16-2.16z"/>
  </svg>
);

const inputStyle = {
  fontFamily: OT.fBody, fontSize: 14, color: OT.espresso900,
  background: OT.paper, border: `1px solid ${OT.hairlineStrong}`,
  borderRadius: 8, padding: '8px 10px', outline: 'none',
  boxSizing: 'border-box',
};

// ─── Rating data store (localStorage) ────────────────────────────────────
const RATING_CRITERIA = [
  { key: 'workout',       label: 'How was the workout?',   hint: 'Overall session intensity and flow' },
  { key: 'form',          label: 'Form coaching',          hint: 'Cues, corrections, technique guidance' },
  { key: 'communication', label: 'Communication',          hint: 'Clarity, listening, encouragement' },
  { key: 'structure',     label: 'Session structure',      hint: 'Warm up, programming, cool down' },
  { key: 'content',       label: 'Programme content',      hint: 'Relevance to your goals' },
];

function loadRatings() {
  try { return JSON.parse(localStorage.getItem('m3s.ratings') || '[]'); }
  catch { return []; }
}
function saveRating(entry) {
  const ratings = loadRatings();
  const idx = ratings.findIndex(r => r.id === entry.id);
  if (idx >= 0) ratings[idx] = entry;
  else ratings.push(entry);
  localStorage.setItem('m3s.ratings', JSON.stringify(ratings));
}
function computeOverall(scores) {
  const vals = Object.values(scores).filter(v => v > 0);
  if (!vals.length) return 0;
  return parseFloat((vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1));
}
function ratingsForCoach(coachId) {
  return loadRatings().filter(r => r.coachId === coachId);
}
function coachAverages(coachId) {
  const rs = ratingsForCoach(coachId);
  if (!rs.length) return null;
  const avg = (key) => {
    const vals = rs.map(r => r.scores[key]).filter(v => v > 0);
    return vals.length
      ? parseFloat((vals.reduce((a,b)=>a+b,0)/vals.length).toFixed(1))
      : 0;
  };
  return {
    overall:       parseFloat((rs.map(r=>r.overall).reduce((a,b)=>a+b,0)/rs.length).toFixed(1)),
    workout:       avg('workout'),
    form:          avg('form'),
    communication: avg('communication'),
    structure:     avg('structure'),
    content:       avg('content'),
    count:         rs.length,
  };
}

const SEED_RATINGS = [
  { id: 'riya_2026-04-20', clientId: 'riya', clientName: 'Riya Sharma',
    coachId: 'lee', coachName: 'Lee', sessionDate: '2026-04-20', sessionType: 'PT Session',
    scores: { workout:5, form:4, communication:5, structure:4, content:5 }, overall: 4.6,
    comment: "Best session in weeks. Thoracic work really helped my overhead finally click.",
    submittedAt: '2026-04-20T09:15:00' },
  { id: 'riya_2026-04-13', clientId: 'riya', clientName: 'Riya Sharma',
    coachId: 'lee', coachName: 'Lee', sessionDate: '2026-04-13', sessionType: 'PT Session',
    scores: { workout:4, form:5, communication:4, structure:4, content:4 }, overall: 4.2,
    comment: "Form cues were incredibly precise. Shoulder felt better after the landmine work.",
    submittedAt: '2026-04-13T08:55:00' },
  { id: 'meera_2026-04-20', clientId: 'meera', clientName: 'Meera P.',
    coachId: 'lee', coachName: 'Lee', sessionDate: '2026-04-20', sessionType: 'PT Session',
    scores: { workout:5, form:5, communication:4, structure:5, content:4 }, overall: 4.6,
    comment: "Loved the progressive overload approach this block.",
    submittedAt: '2026-04-20T10:30:00' },
  { id: 'karan_2026-04-19', clientId: 'karan', clientName: 'Karan S.',
    coachId: 'rahul', coachName: 'Rahul', sessionDate: '2026-04-19', sessionType: 'PT Session',
    scores: { workout:4, form:4, communication:5, structure:4, content:5 }, overall: 4.4,
    comment: "Rahul always knows when to push and when to back off. Great session.",
    submittedAt: '2026-04-19T07:45:00' },
  { id: 'anita_2026-04-18', clientId: 'anita', clientName: 'Anita V.',
    coachId: 'lee', coachName: 'Lee', sessionDate: '2026-04-18', sessionType: 'PT Session',
    scores: { workout:3, form:4, communication:4, structure:3, content:4 }, overall: 3.6,
    comment: "Session was a bit shorter than usual but form coaching was detailed.",
    submittedAt: '2026-04-18T09:05:00' },
  { id: 'vikram_2026-04-17', clientId: 'vikram', clientName: 'Vikram R.',
    coachId: 'deb', coachName: 'Deb', sessionDate: '2026-04-17', sessionType: 'PT Session',
    scores: { workout:5, form:5, communication:5, structure:5, content:5 }, overall: 5.0,
    comment: "Perfect session. Programming was exactly what I needed.",
    submittedAt: '2026-04-17T08:20:00' },
];

if (!localStorage.getItem('m3s.ratings')) {
  localStorage.setItem('m3s.ratings', JSON.stringify(SEED_RATINGS));
}

// ─── Coach roster (copied from onboarding-flow.jsx) ───────────────────────
const COACHES = [
  { id: 'lee', name: 'Lee', role: 'Hypertrophy & Strength', tone: 'sage', initials: 'LE',
    bio: 'Form first, always. The coach who makes the last rep look like the first.',
    cert: 'Hypertrophy · Strength' },
  { id: 'joe', name: 'Joe', role: 'Hypertrophy & Strength', tone: 'espresso', initials: 'JO',
    bio: 'Block-periodised hypertrophy. Muscle you can actually use.', cert: 'Strength · Hypertrophy' },
  { id: 'deb', name: 'Deb', role: 'Strength & Recovery', tone: 'walnut', initials: 'DB',
    bio: 'Post-rehab strength and long-term recovery planning.', cert: 'Strength · Recovery' },
];
const COACH_TONE_BG = {
  espresso: '#3E2C1C', walnut: '#5E4228', terra: '#B86B4B',
  sage: '#7B8B6F', sand: '#D9C3A3', clay: '#A8825A',
};

// ─── Nutrition log — coach-written, client-readable ───────────────────────
// localStorage key: 'm3s.nutrition'
const SEED_NUTRITION = [
  {
    id: 'n1', clientId: 'riya', coachId: 'lee', coachName: 'Lee',
    date: '2026-04-20', period: 'Week 3 of 12',
    mealPlan: { calories: 1800, protein: 140, carbs: 160, fat: 60 },
    notes: 'Keep protein high this block — muscle gain phase. Prioritise whole foods over supplements. Hydration target: 3L/day.',
    tags: ['Muscle Gain', 'High Protein', 'Week 3'],
  },
  {
    id: 'n2', clientId: 'riya', coachId: 'lee', coachName: 'Lee',
    date: '2026-03-30', period: 'Week 1 of 12',
    mealPlan: { calories: 1750, protein: 130, carbs: 170, fat: 58 },
    notes: 'Baseline week. Getting used to the targets. Shoulder still causing issues so holding off heavy pressing.',
    tags: ['Baseline', 'Week 1'],
  },
];

if (!localStorage.getItem('m3s.nutrition')) {
  localStorage.setItem('m3s.nutrition', JSON.stringify(SEED_NUTRITION));
}

function loadNutrition(clientId) {
  try {
    return JSON.parse(localStorage.getItem('m3s.nutrition') || '[]')
      .filter(n => n.clientId === clientId)
      .sort((a, b) => b.date.localeCompare(a.date));
  } catch { return []; }
}

// ─── Session notes — coach-written, client read-only ─────────────────────
// localStorage key: 'm3s.sessionNotes' (written by client-profile.jsx in coach-universe)
function loadMySessionNotes() {
  try {
    return JSON.parse(localStorage.getItem('m3s.sessionNotes') || '[]')
      .filter(n => n.clientId === 'riya')
      .sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  } catch { return []; }
}

const fmtSlot = (v) => {
  const m = v.match(/^(\d+):(\d+)$/);
  if (!m) return v;
  const h = parseInt(m[1], 10), mm = m[2];
  const period = h < 12 ? 'AM' : 'PM';
  const hh = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${hh}:${mm} ${period}`;
};

// ─── Profile state hook ───────────────────────────────────────────────────
const DEFAULT_JOURNEY = {
  name: 'Riya Sharma', age: '32', gender: 'Female', phone: '98230 12345', photo: null,
  experience: '6–24 months', goal: 'Muscle Gain', daysPerWeek: 4,
  notes: "Want visible upper-body muscle by Sept for my sister's wedding. I run 3x/week and want to keep that.",
  injuries: ['Shoulder'],
  injuryNotes: 'Right shoulder cranky on overhead press since 2024. PT-cleared but avoid heavy OHP.',
  slots: ['7:00', '7:30', '18:00', '18:30'], customSlots: [], coachId: 'lee',
  running5k: '28:40', running2k: '10:15', runRating: 6, runFrequency: '3x / week', runInjuryFlag: false,
};

function useProfile() {
  const [profile, setProfile] = React.useState(() => {
    try {
      const raw = localStorage.getItem('m3s.journey');
      if (raw) return { ...DEFAULT_JOURNEY, ...JSON.parse(raw) };
    } catch {}
    return DEFAULT_JOURNEY;
  });
  const update = (patch) => setProfile((p) => {
    const next = { ...p, ...patch };
    try { localStorage.setItem('m3s.journey', JSON.stringify(next)); } catch {}
    return next;
  });
  return [profile, update];
}

// ─── Editable field row ───────────────────────────────────────────────────
function EditableField({ label, value, onSave, multiline, type = 'text', options }) {
  const [editing, setEditing] = React.useState(false);
  const [draft, setDraft] = React.useState(value);
  React.useEffect(() => { if (!editing) setDraft(value); }, [value, editing]);
  const startEdit = () => { setDraft(value); setEditing(true); };
  const commit = () => { onSave(draft); setEditing(false); };
  const cancel = () => { setDraft(value); setEditing(false); };

  return (
    <div className={`field-row${editing ? ' editing' : ''}`} style={{
      display: 'grid', gridTemplateColumns: '140px 1fr auto',
      gap: 14, alignItems: multiline ? 'flex-start' : 'center',
      padding: '12px 0', borderTop: `1px solid ${OT.hairline}`,
    }}>
      <div style={{
        fontFamily: OT.fMono, fontSize: 9.5, letterSpacing: 1.4,
        color: OT.clay600, textTransform: 'uppercase', paddingTop: multiline ? 10 : 0,
      }}>{label}</div>
      {editing ? (
        options ? (
          <select value={draft} onChange={(e) => setDraft(e.target.value)} style={{ ...inputStyle, width: '100%' }}>
            {options.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        ) : multiline ? (
          <textarea value={draft} onChange={(e) => setDraft(e.target.value)} rows={3}
            style={{ ...inputStyle, width: '100%', resize: 'vertical', lineHeight: 1.5 }} autoFocus />
        ) : (
          <input type={type} value={draft} onChange={(e) => setDraft(e.target.value)}
            style={{ ...inputStyle, width: '100%' }} autoFocus
            onKeyDown={(e) => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') cancel(); }} />
        )
      ) : (
        <div style={{
          fontFamily: OT.fBody, fontSize: 14, color: OT.espresso900,
          lineHeight: multiline ? 1.55 : 1.3, fontWeight: 500,
          whiteSpace: multiline ? 'pre-wrap' : 'normal',
        }}>{value || <span style={{ color: OT.clay600, fontWeight: 400 }}>— not set —</span>}</div>
      )}
      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        {editing ? (
          <>
            <button onClick={cancel} style={miniBtn(false)}>Cancel</button>
            <button onClick={commit} style={miniBtn(true)}>Save</button>
          </>
        ) : (
          <button onClick={startEdit} className="pencil" aria-label={`Edit ${label}`} style={{
            background: 'transparent', border: 'none', cursor: 'pointer', padding: 6,
            display: 'flex', alignItems: 'center',
          }}>
            <Pencil />
          </button>
        )}
      </div>
    </div>
  );
}

const miniBtn = (primary) => ({
  fontFamily: OT.fBody, fontSize: 12, fontWeight: 600,
  padding: '6px 12px', borderRadius: 6,
  border: primary ? 'none' : `1px solid ${OT.hairlineStrong}`,
  background: primary ? OT.walnut : OT.paper,
  color: primary ? OT.paper : OT.espresso900,
  cursor: 'pointer',
});

// ─── Section card wrapper ─────────────────────────────────────────────────
function Section({ eyebrow, title, children, dot, accessory }) {
  return (
    <section style={{
      background: OT.paper, border: `1px solid ${OT.hairline}`,
      borderRadius: 16, padding: '24px 26px', boxShadow: OT.sh1, marginBottom: 18,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 6 }}>
        <div>
          <OEyebrow dot={dot}>{eyebrow}</OEyebrow>
          <h2 style={{
            fontFamily: OT.fDisplay, fontStyle: 'italic', fontWeight: 400,
            fontSize: 26, lineHeight: 1.15, color: OT.espresso900,
            margin: '6px 0 0', letterSpacing: -0.4,
          }}>{title}</h2>
        </div>
        {accessory}
      </div>
      <div style={{ marginTop: 12 }}>{children}</div>
    </section>
  );
}

// ─── Topbar ───────────────────────────────────────────────────────────────
function Topbar({ name }) {
  return (
    <header style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '18px 36px', borderBottom: `1px solid ${OT.hairline}`,
      background: OT.sand50,
    }}>
      <a href="index.html" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
        <img src="assets/mts-logo.png" alt="My Third Space" style={{
          height: 34, width: 'auto', objectFit: 'contain', display: 'block',
          filter: 'brightness(0) saturate(100%) invert(20%) sepia(40%) saturate(850%) hue-rotate(355deg) brightness(85%) contrast(95%)',
        }}/>
      </a>
      <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
        <a href="index.html" style={{
          fontFamily: OT.fBody, fontSize: 13, color: OT.clay600,
          textDecoration: 'none', fontWeight: 500,
        }}>← Home</a>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '6px 12px 6px 6px', borderRadius: 999,
          background: OT.paper, border: `1px solid ${OT.hairline}`,
        }}>
          <Avatar name={name} size={26} />
          <div style={{ fontFamily: OT.fBody, fontSize: 13, fontWeight: 600, color: OT.espresso900 }}>
            {name?.split(' ')[0] || 'You'}
          </div>
        </div>
      </div>
    </header>
  );
}

function Avatar({ name, size = 64, photo }) {
  const initials = (name || 'U').split(/\s+/).map(s => s[0]).filter(Boolean).slice(0, 2).join('').toUpperCase() || 'U';
  if (photo) return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: `url(${photo}) center/cover`, flexShrink: 0 }} />
  );
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: OT.walnut, color: OT.paper,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: OT.fDisplay, fontStyle: 'italic',
      fontSize: size * 0.4, flexShrink: 0,
    }}>{initials}</div>
  );
}

// ─── Hero strip ───────────────────────────────────────────────────────────
function ProfileHero({ profile }) {
  const coach = COACHES.find(c => c.id === profile.coachId) || COACHES[0];
  return (
    <div style={{
      background: OT.espresso900, color: OT.paper, borderRadius: 18,
      padding: '28px 30px', position: 'relative', overflow: 'hidden',
      marginBottom: 22, boxShadow: OT.sh3,
    }}>
      <div style={{
        position: 'absolute', top: -50, right: -50, width: 220, height: 220,
        borderRadius: '50%', background: 'rgba(201,154,63,0.15)',
      }} />
      <div style={{ position: 'relative', display: 'flex', gap: 22, alignItems: 'center' }}>
        <Avatar name={profile.name} photo={profile.photo} size={84} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <OMono color="rgba(255,253,248,0.55)" size={9}>Member · since Apr 2025</OMono>
          <h1 style={{
            fontFamily: OT.fDisplay, fontStyle: 'italic', fontWeight: 400,
            fontSize: 34, lineHeight: 1.1, color: OT.paper,
            margin: '6px 0 4px', letterSpacing: -0.5,
          }}>{profile.name}</h1>
          <div style={{ fontFamily: OT.fBody, fontSize: 13.5, color: 'rgba(255,253,248,0.75)' }}>
            {profile.age} · {profile.gender} · {profile.goal}
          </div>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '10px 14px 10px 10px', borderRadius: 12,
          background: 'rgba(255,253,248,0.08)', border: `1px solid rgba(255,253,248,0.12)`,
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: '50%',
            background: COACH_TONE_BG[coach.tone], color: OT.paper,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: OT.fDisplay, fontStyle: 'italic', fontSize: 16,
          }}>{coach.initials}</div>
          <div>
            <OMono color="rgba(255,253,248,0.55)" size={8.5}>Coach</OMono>
            <div style={{ fontFamily: OT.fBody, fontSize: 14, fontWeight: 600, color: OT.paper, marginTop: 2 }}>
              {coach.name} · {coach.role.split(' & ')[0]}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Time slots editor ────────────────────────────────────────────────────
function SlotsEditor({ slots, customSlots, onUpdate }) {
  const all = [];
  for (let h = 6; h <= 20; h++) {
    all.push(`${h}:00`);
    if (h < 20) all.push(`${h}:30`);
  }
  const sel = new Set(slots);
  const toggle = (v) => {
    const next = sel.has(v) ? slots.filter(s => s !== v) : [...slots, v];
    onUpdate({ slots: next });
  };
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6 }}>
        {all.map(s => {
          const active = sel.has(s);
          return (
            <button key={s} onClick={() => toggle(s)} style={{
              padding: '8px 4px', borderRadius: 8,
              border: active ? 'none' : `1px solid ${OT.hairlineStrong}`,
              background: active ? OT.walnut : OT.paper,
              color: active ? OT.paper : OT.clay600,
              fontFamily: OT.fBody, fontSize: 12, fontWeight: 600,
              cursor: 'pointer', textAlign: 'center',
            }}>{fmtSlot(s)}</button>
          );
        })}
      </div>
      {customSlots && customSlots.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
          {customSlots.map((c, i) => (
            <span key={i} style={{
              fontFamily: OT.fBody, fontSize: 12, fontWeight: 600,
              padding: '6px 10px', borderRadius: 999,
              background: OT.sand200, color: OT.espresso900,
            }}>{c}</span>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Body composition ─────────────────────────────────────────────────────
function BCAReadout() {
  const insights = [
    { label: 'Body fat',     value: '24.8%',   range: 'Slightly high (target 22%)', accent: OT.warn },
    { label: 'Muscle mass',  value: '49.2 kg', range: 'On track for height',       accent: OT.ok },
    { label: 'Visceral fat', value: '8',       range: 'Healthy (1–12 range)',      accent: OT.ok },
    { label: 'Metabolic age',value: '34',      range: '2 yrs above chronological', accent: OT.warn },
  ];
  return (
    <div>
      <div style={{
        padding: '10px 14px', background: OT.sand100, borderRadius: 8,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: 12,
      }}>
        <div style={{ fontFamily: OT.fMono, fontSize: 10, letterSpacing: 1.4, color: OT.clay600 }}>
          INBODY_APRIL.PDF · UPLOADED 12 APR 2025
        </div>
        <button style={miniBtn(false)}>Re-upload</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {insights.map(it => (
          <div key={it.label} style={{
            padding: 14, borderRadius: 10, background: OT.sand50,
            border: `1px solid ${OT.hairline}`,
          }}>
            <OMono size={9}>{it.label}</OMono>
            <div style={{
              fontFamily: OT.fDisplay, fontStyle: 'italic', fontSize: 26,
              color: OT.espresso900, marginTop: 4, lineHeight: 1,
            }}>{it.value}</div>
            <div style={{
              marginTop: 6, fontFamily: OT.fBody, fontSize: 11.5,
              color: it.accent, lineHeight: 1.4,
            }}>{it.range}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Blood readout ────────────────────────────────────────────────────────
function BloodReadout() {
  const flags = [
    { name: 'Vit D',    value: '18', unit: 'ng/mL', target: '30–80',  status: 'Deficient',  accent: OT.bad },
    { name: 'LDL',      value: '148', unit: 'mg/dL', target: '<100',   status: 'High',       accent: OT.warn },
    { name: 'HbA1c',    value: '5.3', unit: '%',    target: '<5.7',   status: 'Optimal',    accent: OT.ok },
    { name: 'Ferritin', value: '52',  unit: 'ng/mL', target: '30–200', status: 'Optimal',    accent: OT.ok },
    { name: 'TSH',      value: '2.1', unit: 'mIU/L', target: '0.4–4',  status: 'Normal',     accent: OT.ok },
  ];
  return (
    <div>
      <div style={{
        padding: '10px 14px', background: OT.sand100, borderRadius: 8,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: 12,
      }}>
        <div style={{ fontFamily: OT.fMono, fontSize: 10, letterSpacing: 1.4, color: OT.clay600 }}>
          REDCLIFFE_PANEL.PDF · UPLOADED 9 APR 2025
        </div>
        <button style={miniBtn(false)}>Re-upload</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
        {flags.map(f => (
          <div key={f.name} style={{
            padding: 12, borderRadius: 10, background: OT.sand50,
            border: `1px solid ${OT.hairline}`, position: 'relative',
          }}>
            <OMono size={9}>{f.name}</OMono>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 4 }}>
              <div style={{ fontFamily: OT.fDisplay, fontStyle: 'italic', fontSize: 22, color: OT.espresso900, lineHeight: 1 }}>{f.value}</div>
              <div style={{ fontFamily: OT.fMono, fontSize: 9, color: OT.clay600 }}>{f.unit}</div>
            </div>
            <div style={{
              marginTop: 6, fontFamily: OT.fBody, fontSize: 11,
              color: f.accent, fontWeight: 600,
            }}>{f.status}</div>
            <div style={{
              marginTop: 2, fontFamily: OT.fMono, fontSize: 9,
              letterSpacing: 1, color: OT.clay600,
            }}>TARGET {f.target}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── MSK readout ──────────────────────────────────────────────────────────
function MSKReadout({ profile }) {
  const items = [
    { area: 'Shoulders',   status: 'Restricted', detail: 'Right shoulder OHP-restricted, PT-cleared. Avoid heavy OHP.', accent: OT.warn },
    { area: 'Hips',        status: 'Tight',      detail: 'Hip flexors short — daily 90/90 mobility prescribed.',        accent: OT.warn },
    { area: 'Thoracic',    status: 'Limited',    detail: 'Thoracic mobility limits overhead position. 10-min prep.',    accent: OT.warn },
    { area: 'Knees',       status: 'Cleared',    detail: 'Pain-free under load. Tracks well in squat.',                  accent: OT.ok },
    { area: 'Lower back',  status: 'Cleared',    detail: 'Hinge pattern clean. No referred pain.',                       accent: OT.ok },
  ];
  return (
    <div>
      {items.map((it, i) => (
        <div key={it.area} style={{
          display: 'grid', gridTemplateColumns: '120px 110px 1fr',
          gap: 14, alignItems: 'center', padding: '12px 0',
          borderTop: i === 0 ? 'none' : `1px solid ${OT.hairline}`,
        }}>
          <div style={{ fontFamily: OT.fBody, fontSize: 14, fontWeight: 600, color: OT.espresso900 }}>
            {it.area}
          </div>
          <div style={{
            fontFamily: OT.fMono, fontSize: 10, letterSpacing: 1.2,
            color: it.accent, fontWeight: 600, textTransform: 'uppercase',
          }}>● {it.status}</div>
          <div style={{ fontFamily: OT.fBody, fontSize: 13, color: OT.clay600, lineHeight: 1.5 }}>
            {it.detail}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Running section ──────────────────────────────────────────────────────
function RunningReadout({ profile, update }) {
  const freqs = ['Never', '1x / week', '2x / week', '3x / week', '4x+ / week'];
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {[
          { label: '5K', value: profile.running5k, key: 'running5k' },
          { label: '2K', value: profile.running2k, key: 'running2k' },
          { label: 'Self-rating', value: `${profile.runRating}/10`, key: null },
          { label: 'Frequency', value: profile.runFrequency, key: null },
        ].map(s => (
          <div key={s.label} style={{
            padding: 14, borderRadius: 10, background: OT.sand50,
            border: `1px solid ${OT.hairline}`,
          }}>
            <OMono size={9}>{s.label}</OMono>
            <div style={{
              fontFamily: s.label === 'Frequency' ? OT.fBody : OT.fMono,
              fontSize: s.label === 'Frequency' ? 16 : 22,
              fontWeight: s.label === 'Frequency' ? 600 : 500,
              color: OT.espresso900, marginTop: 6, lineHeight: 1,
            }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 18, padding: 16, background: OT.espresso900, color: OT.paper, borderRadius: 12 }}>
        <OMono color="rgba(255,253,248,0.55)" size={9}>What your coach will do with this</OMono>
        <div style={{
          fontFamily: OT.fBody, fontSize: 13.5, color: OT.paper, marginTop: 8, lineHeight: 1.55,
        }}>
          Aerobic base is solid; top-end is the gap. We pair 1× tempo run + short intervals
          weekly to lift VO₂ without hurting hypertrophy recovery.
          <strong style={{ color: OT.ochre, fontWeight: 600 }}> 2K pace anchors VO₂max</strong> — re-test month 2.
        </div>
      </div>

      {profile.runInjuryFlag && (
        <div style={{
          marginTop: 12, padding: '10px 14px', background: 'rgba(201,122,63,0.12)',
          borderRadius: 8, fontFamily: OT.fBody, fontSize: 12.5, color: OT.warn, fontWeight: 500,
        }}>
          ⚠ You flagged knee/shin/foot pain — coach will limit run frequency to 1×/wk.
        </div>
      )}
    </div>
  );
}

// ─── Milestones ───────────────────────────────────────────────────────────
const MILESTONES = [
  { wk: 'Week 0',  label: 'Baseline',      detail: 'Bloods, BCA, MSK locked. Plan signed off by Lee.', state: 'done' },
  { wk: 'Week 4',  label: 'Volume base',   detail: '12 sets/wk on chest+back. Vit D 30+. OHP-free.',   state: 'done' },
  { wk: 'Week 8',  label: 'Re-test',       detail: 'Repeat bloods + BCA. LDL trending down. BF −1.5%.', state: 'current' },
  { wk: 'Week 12', label: 'Visible delta', detail: 'Upper-body hypertrophy visible. 5K −30 sec/km.',   state: 'pending' },
];

function MilestonesStepper() {
  return (
    <div style={{ position: 'relative' }}>
      <div style={{
        position: 'absolute', top: 11, left: '12.5%', right: '12.5%',
        height: 2, background: OT.hairline, zIndex: 0,
      }} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', position: 'relative', zIndex: 1 }}>
        {MILESTONES.map((m, i) => {
          const done = m.state === 'done';
          const cur = m.state === 'current';
          return (
            <div key={m.wk} style={{ padding: '0 8px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{
                width: 24, height: 24, borderRadius: '50%',
                background: done ? OT.walnut : (cur ? OT.ochre : OT.paper),
                border: `2px solid ${done ? OT.walnut : (cur ? OT.ochre : OT.hairlineStrong)}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: done ? OT.paper : (cur ? OT.paper : OT.clay600),
                fontFamily: OT.fMono, fontSize: 10, fontWeight: 700,
                boxShadow: cur ? '0 0 0 4px rgba(201,154,63,0.18)' : 'none',
                marginBottom: 10,
              }}>
                {done ? (
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6.5L4.5 9L10 3" stroke={OT.paper} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : (i + 1)}
              </div>
              <OMono size={9} style={{ textAlign: 'center' }}>{m.wk}</OMono>
              <div style={{
                fontFamily: OT.fBody, fontSize: 13, fontWeight: 600,
                color: OT.espresso900, marginTop: 2, textAlign: 'center',
              }}>{m.label}</div>
              <div style={{
                fontFamily: OT.fBody, fontSize: 11.5, color: OT.clay600,
                marginTop: 6, lineHeight: 1.45, textAlign: 'center',
              }}>{m.detail}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Monthly progress: seeded data + log + graph ──────────────────────────
const PROGRESS_LOG = [
  { month: 'Apr 2025', weight: 67.4, bodyFat: 26.1, run5k: '29:55', setsWk: 8,  note: 'Baseline week. Onboarding complete.' },
  { month: 'May 2025', weight: 67.0, bodyFat: 25.4, run5k: '29:20', setsWk: 11, note: 'Hit 11 sets/wk on chest+back. Shoulder pain reducing.' },
  { month: 'Jun 2025', weight: 66.7, bodyFat: 24.8, run5k: '28:40', setsWk: 12, note: 'Re-test pending. Vit D 24 → trending up. Sleep avg 7h12m.' },
];

function ProgressLog() {
  return (
    <div>
      {/* Graph */}
      <ProgressGraph />

      {/* Log entries */}
      <div style={{ marginTop: 22 }}>
        <OEyebrow>Monthly log</OEyebrow>
        <div style={{ marginTop: 10 }}>
          {PROGRESS_LOG.slice().reverse().map((m, i) => (
            <div key={m.month} style={{
              display: 'grid',
              gridTemplateColumns: '110px repeat(4, 1fr) 2.2fr',
              gap: 14, alignItems: 'center', padding: '14px 0',
              borderTop: `1px solid ${OT.hairline}`,
            }}>
              <div>
                <OMono size={9}>{m.month.split(' ')[1]}</OMono>
                <div style={{
                  fontFamily: OT.fDisplay, fontStyle: 'italic',
                  fontSize: 22, color: OT.espresso900, lineHeight: 1,
                }}>{m.month.split(' ')[0]}</div>
              </div>
              <Stat k="Weight" v={`${m.weight} kg`} />
              <Stat k="Body fat" v={`${m.bodyFat}%`} />
              <Stat k="5K time" v={m.run5k} />
              <Stat k="Sets/wk" v={m.setsWk} />
              <div style={{ fontFamily: OT.fBody, fontSize: 13, color: OT.clay600, lineHeight: 1.5 }}>
                {m.note}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const Stat = ({ k, v }) => (
  <div>
    <OMono size={9}>{k}</OMono>
    <div style={{ fontFamily: OT.fMono, fontSize: 14, color: OT.espresso900, marginTop: 4, fontWeight: 500 }}>
      {v}
    </div>
  </div>
);

// ─── Multi-line progress graph (SVG) ──────────────────────────────────────
const SERIES = [
  { key: 'weight',  label: 'Weight (kg)',   color: OT.walnut, values: PROGRESS_LOG.map(p => p.weight),
    yMin: 65, yMax: 70 },
  { key: 'bodyFat', label: 'Body fat (%)',  color: OT.ochre,  values: PROGRESS_LOG.map(p => p.bodyFat),
    yMin: 23, yMax: 27 },
  { key: 'setsWk',  label: 'Sets / week',   color: OT.sage,   values: PROGRESS_LOG.map(p => p.setsWk),
    yMin: 6, yMax: 14 },
];
const RUN_SECONDS = PROGRESS_LOG.map(p => {
  const [m, s] = p.run5k.split(':').map(Number);
  return m * 60 + s;
});
SERIES.push({
  key: 'run5k', label: '5K time',   color: OT.terra,
  values: RUN_SECONDS,
  yMin: Math.min(...RUN_SECONDS) - 30, yMax: Math.max(...RUN_SECONDS) + 30,
  format: (v) => `${Math.floor(v / 60)}:${String(Math.round(v - Math.floor(v / 60) * 60)).padStart(2, '0')}`,
});

function ProgressGraph() {
  const [active, setActive] = React.useState('weight');
  const series = SERIES.find(s => s.key === active);
  const W = 720, H = 220, PAD_L = 50, PAD_R = 20, PAD_T = 16, PAD_B = 36;
  const innerW = W - PAD_L - PAD_R;
  const innerH = H - PAD_T - PAD_B;
  const N = series.values.length;
  const x = (i) => PAD_L + (i / (N - 1)) * innerW;
  const y = (v) => PAD_T + innerH - ((v - series.yMin) / (series.yMax - series.yMin)) * innerH;
  const path = series.values.map((v, i) => `${i === 0 ? 'M' : 'L'} ${x(i)} ${y(v)}`).join(' ');
  const fmt = series.format || ((v) => v.toFixed(1));

  return (
    <div style={{
      background: OT.sand50, border: `1px solid ${OT.hairline}`,
      borderRadius: 12, padding: 16,
    }}>
      <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
        {SERIES.map(s => {
          const sel = s.key === active;
          return (
            <button key={s.key} onClick={() => setActive(s.key)} style={{
              padding: '7px 12px', borderRadius: 999,
              border: sel ? 'none' : `1px solid ${OT.hairlineStrong}`,
              background: sel ? s.color : OT.paper,
              color: sel ? OT.paper : OT.espresso900,
              fontFamily: OT.fBody, fontSize: 12, fontWeight: 600,
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <span style={{
                width: 8, height: 8, borderRadius: '50%',
                background: sel ? OT.paper : s.color,
              }} />
              {s.label}
            </button>
          );
        })}
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block' }}>
        {/* Grid */}
        {[0, 0.25, 0.5, 0.75, 1].map((t, i) => {
          const yy = PAD_T + innerH * t;
          const v = series.yMax - (series.yMax - series.yMin) * t;
          return (
            <g key={i}>
              <line x1={PAD_L} x2={W - PAD_R} y1={yy} y2={yy} stroke={OT.hairline} strokeWidth="1" />
              <text x={PAD_L - 8} y={yy + 3.5} textAnchor="end"
                style={{ fontFamily: OT.fMono, fontSize: 9, fill: OT.clay600 }}>
                {fmt(v)}
              </text>
            </g>
          );
        })}

        {/* X labels */}
        {PROGRESS_LOG.map((p, i) => (
          <text key={p.month} x={x(i)} y={H - 12} textAnchor="middle"
            style={{ fontFamily: OT.fMono, fontSize: 9, fill: OT.clay600, letterSpacing: 1 }}>
            {p.month.toUpperCase()}
          </text>
        ))}

        {/* Area gradient */}
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={series.color} stopOpacity="0.18" />
            <stop offset="100%" stopColor={series.color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d={`${path} L ${x(N-1)} ${PAD_T + innerH} L ${x(0)} ${PAD_T + innerH} Z`}
          fill="url(#areaGrad)"
        />

        {/* Line */}
        <path d={path} fill="none" stroke={series.color} strokeWidth="2.5"
          strokeLinecap="round" strokeLinejoin="round" />

        {/* Points + labels */}
        {series.values.map((v, i) => (
          <g key={i}>
            <circle cx={x(i)} cy={y(v)} r="5"
              fill={OT.paper} stroke={series.color} strokeWidth="2.5" />
            <text x={x(i)} y={y(v) - 12} textAnchor="middle"
              style={{ fontFamily: OT.fMono, fontSize: 10, fontWeight: 600, fill: OT.espresso900 }}>
              {fmt(v)}
            </text>
          </g>
        ))}
      </svg>

      {/* Delta callout */}
      <div style={{
        marginTop: 8, padding: '10px 14px', background: OT.paper,
        borderRadius: 8, border: `1px solid ${OT.hairline}`,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <OMono size={9}>3-month delta</OMono>
        {(() => {
          const first = series.values[0];
          const last = series.values[N - 1];
          const diff = last - first;
          const pos = diff > 0;
          // For weight, body fat, 5K time → DOWN is good
          const goodDown = series.key !== 'setsWk';
          const isGood = goodDown ? diff < 0 : diff > 0;
          const color = isGood ? OT.ok : (Math.abs(diff) < 0.05 ? OT.clay600 : OT.warn);
          return (
            <div style={{
              fontFamily: OT.fMono, fontSize: 13, fontWeight: 600, color,
            }}>
              {pos ? '+' : '−'}{fmt(Math.abs(diff))} {isGood ? '· trending well' : ''}
            </div>
          );
        })()}
      </div>
    </div>
  );
}

// ─── Star rating (reusable) ───────────────────────────────────────────────
function StarRating({ value, onChange, readonly = false }) {
  const [hover, setHover] = React.useState(0);
  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {[1,2,3,4,5].map(star => (
        <span
          key={star}
          onClick={() => !readonly && onChange && onChange(star)}
          onMouseEnter={() => !readonly && setHover(star)}
          onMouseLeave={() => !readonly && setHover(0)}
          style={{
            fontSize: 22, cursor: readonly ? 'default' : 'pointer',
            color: star <= (hover || value) ? OT.ochre : OT.sand200,
            transition: 'color 0.1s',
            userSelect: 'none',
          }}
        >★</span>
      ))}
    </div>
  );
}

// ─── Rate the session (client → coach) ────────────────────────────────────
function RateSessionSection({ profile }) {
  const coach = COACHES.find(c => c.id === profile.coachId) || COACHES[0];

  const today = new Date().toISOString().split('T')[0];
  const entryId = `riya_${today}`;

  const [pastVersion, setPastVersion] = React.useState(0);
  const past = React.useMemo(() => loadRatings()
    .filter(r => r.clientId === 'riya' && r.coachId === coach.id)
    .sort((a, b) => b.sessionDate.localeCompare(a.sessionDate)),
    [coach.id, pastVersion]);

  const alreadyRated = past.some(r => r.id === entryId);

  const [scores, setScores] = React.useState({
    workout: 0, form: 0, communication: 0, structure: 0, content: 0,
  });
  const [comment, setComment] = React.useState('');
  const [submitted, setSubmitted] = React.useState(alreadyRated);

  function setScore(key, val) {
    setScores(prev => ({ ...prev, [key]: val }));
  }
  function submit() {
    const overall = computeOverall(scores);
    const entry = {
      id: entryId,
      clientId: 'riya', clientName: profile.name,
      coachId: coach.id, coachName: coach.name,
      sessionDate: today, sessionType: 'PT Session',
      scores, overall, comment,
      submittedAt: new Date().toISOString(),
    };
    saveRating(entry);
    setSubmitted(true);
    setPastVersion(v => v + 1);
  }

  const canSubmit = Object.values(scores).every(v => v > 0);

  return (
    <div>
      {!submitted ? (
        <div style={{
          background: OT.sand50, border: `1px solid ${OT.hairline}`,
          borderRadius: 10, padding: 18, marginBottom: 20,
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18,
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: COACH_TONE_BG[coach.tone], color: OT.paper,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: OT.fDisplay, fontStyle: 'italic', fontSize: 14,
            }}>{coach.initials}</div>
            <div>
              <OMono size={9}>Rate your session with</OMono>
              <div style={{
                fontFamily: OT.fBody, fontSize: 14,
                fontWeight: 600, color: OT.espresso900, marginTop: 2,
              }}>{coach.name} · Today</div>
            </div>
          </div>

          {RATING_CRITERIA.map((c, i) => (
            <div key={c.key} style={{
              display: 'grid', gridTemplateColumns: '1fr auto',
              alignItems: 'center', padding: '12px 0',
              borderTop: i === 0 ? 'none' : `1px solid ${OT.hairline}`,
            }}>
              <div>
                <div style={{
                  fontFamily: OT.fBody, fontSize: 14,
                  fontWeight: 500, color: OT.espresso900,
                }}>{c.label}</div>
                <div style={{
                  fontFamily: OT.fBody, fontSize: 12,
                  color: OT.clay600, marginTop: 2,
                }}>{c.hint}</div>
              </div>
              <StarRating
                value={scores[c.key]}
                onChange={(v) => setScore(c.key, v)}
              />
            </div>
          ))}

          <div style={{ marginTop: 16 }}>
            <OMono size={9} style={{ marginBottom: 6 }}>
              Comment (optional)
            </OMono>
            <textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Anything else to share about the session?"
              rows={3}
              style={{
                width: '100%', boxSizing: 'border-box',
                padding: '10px 12px', borderRadius: 8,
                border: `1px solid ${OT.hairlineStrong}`,
                background: OT.paper, fontFamily: OT.fBody,
                fontSize: 13, color: OT.espresso900,
                resize: 'vertical', outline: 'none',
              }}
            />
          </div>

          <button
            onClick={submit}
            disabled={!canSubmit}
            style={{
              marginTop: 14, padding: '11px 22px',
              borderRadius: 999, border: 'none',
              background: canSubmit ? OT.walnut : OT.sand200,
              color: canSubmit ? OT.paper : OT.clay600,
              fontFamily: OT.fBody, fontSize: 14,
              fontWeight: 600, cursor: canSubmit ? 'pointer' : 'default',
              boxShadow: canSubmit ? OT.sh2 : 'none',
            }}
          >
            Submit rating →
          </button>

          {!canSubmit && (
            <div style={{
              marginTop: 8, fontFamily: OT.fBody,
              fontSize: 12, color: OT.clay600,
            }}>Rate all 5 criteria to submit.</div>
          )}
        </div>
      ) : (
        <div style={{
          padding: '12px 16px', borderRadius: 10,
          background: OT.sand100, border: `1px solid ${OT.hairline}`,
          marginBottom: 20, fontFamily: OT.fBody,
          fontSize: 13, color: OT.espresso800,
        }}>
          ✓ Rating submitted for today's session with {coach.name}.
          Overall: <strong style={{ color: OT.walnut }}>
            {computeOverall(scores) || past[0]?.overall}/5
          </strong>
        </div>
      )}

      {past.length > 0 && (
        <div>
          <OMono size={9} style={{ marginBottom: 10 }}>
            Your previous ratings
          </OMono>
          {past.slice(0, 5).map((r, i) => (
            <div key={r.id} style={{
              padding: '12px 0',
              borderTop: i === 0 ? 'none' : `1px solid ${OT.hairline}`,
            }}>
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <div>
                  <OMono size={9}>{r.sessionDate} · {r.sessionType}</OMono>
                  {r.comment && (
                    <div style={{
                      fontFamily: OT.fBody, fontSize: 13,
                      color: OT.espresso800, marginTop: 4,
                      fontStyle: 'italic', lineHeight: 1.4,
                    }}>"{r.comment}"</div>
                  )}
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: 16 }}>
                  <div style={{
                    fontFamily: OT.fDisplay, fontStyle: 'italic',
                    fontSize: 22, color: OT.espresso900, lineHeight: 1,
                  }}>{r.overall}</div>
                  <OMono size={9} style={{ color: OT.clay600 }}>/ 5</OMono>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Coach session notes (read-only feed for the client) ─────────────────
function CoachNotesClientView() {
  const notes = loadMySessionNotes();

  if (notes.length === 0) {
    return (
      <div style={{
        padding: '14px 16px', background: OT.sand50,
        border: `1px solid ${OT.hairline}`, borderRadius: 10,
        fontFamily: OT.fBody, fontSize: 13, color: OT.clay600,
      }}>
        No session notes yet. Your coach's notes will appear here after your first session.
      </div>
    );
  }

  // Format ISO date "2026-04-20" → "APR 20, 2026"
  const fmt = (iso) => {
    if (!iso) return '';
    const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!m) return iso;
    const month = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'][parseInt(m[2],10)-1];
    return `${month} ${parseInt(m[3],10)}, ${m[1]}`;
  };

  return (
    <div>
      {notes.slice(0, 5).map((note, i) => (
        <div key={note.id} style={{
          padding: '14px 0',
          borderTop: i === 0 ? 'none' : `1px solid ${OT.hairline}`,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, gap: 8, flexWrap: 'wrap' }}>
            <OMono size={9}>{fmt(note.date)} · {note.sessionType || 'PT SESSION'}</OMono>
            <OMono size={9} style={{ color: OT.clay600 }}>{note.coachName || 'Coach'}</OMono>
          </div>
          <div style={{
            fontFamily: OT.fBody, fontSize: 14, color: OT.espresso800,
            lineHeight: 1.6, fontStyle: 'italic',
          }}>"{note.text || note.body || ''}"</div>
          {note.tags && note.tags.length > 0 && (
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
              {note.tags.map(tag => (
                <div key={tag} style={{
                  padding: '2px 8px', borderRadius: 999,
                  background: OT.sand100, border: `1px solid ${OT.hairline}`,
                  fontFamily: OT.fMono, fontSize: 9, letterSpacing: 1.2,
                  textTransform: 'uppercase', color: OT.clay600,
                }}>{tag}</div>
              ))}
            </div>
          )}
        </div>
      ))}
      {notes.length > 5 && (
        <div style={{ marginTop: 12, fontFamily: OT.fBody, fontSize: 12, color: OT.clay600 }}>
          Showing 5 of {notes.length} notes.
        </div>
      )}
    </div>
  );
}

// ─── Nutrition section (coach-edited, client read-only) ───────────────────
function NutritionSection({ profile }) {
  const entries = loadNutrition('riya');
  const latest = entries[0];

  if (!latest) return (
    <div style={{
      padding: '16px 20px', background: OT.sand50,
      border: `1px solid ${OT.hairline}`, borderRadius: 10,
      fontFamily: OT.fBody, fontSize: 13, color: OT.clay600,
    }}>
      No nutrition plan set yet. Your coach will add one after your first session.
    </div>
  );

  const coach = COACHES.find(c => c.id === latest.coachId);

  return (
    <div>
      {/* Coach + period header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '8px 12px', background: OT.sand100,
        border: `1px solid ${OT.hairline}`, borderRadius: 8, marginBottom: 16,
      }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <div style={{
            width: 28, height: 28, borderRadius: '50%',
            background: COACH_TONE_BG[coach?.tone || 'walnut'],
            color: OT.paper, display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontFamily: OT.fDisplay,
            fontStyle: 'italic', fontSize: 11,
          }}>
            {coach?.initials || 'CO'}
          </div>
          <div>
            <OMono size={9}>Set by {latest.coachName}</OMono>
            <div style={{
              fontFamily: OT.fBody, fontSize: 12, color: OT.espresso900, marginTop: 1,
            }}>{latest.period} · Updated {latest.date}</div>
          </div>
        </div>
        <div style={{
          padding: '3px 10px', borderRadius: 999,
          background: OT.sand200, fontFamily: OT.fMono,
          fontSize: 9, letterSpacing: 1.2, textTransform: 'uppercase',
          color: OT.clay600,
        }}>Coach edits only</div>
      </div>

      {/* 4-col macro grid — BCAReadout pattern */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12,
        marginBottom: 16,
      }}>
        {[
          { label: 'Calories', value: `${latest.mealPlan.calories}`, range: 'kcal / day' },
          { label: 'Protein',  value: `${latest.mealPlan.protein}g`, range: 'per day target' },
          { label: 'Carbs',    value: `${latest.mealPlan.carbs}g`,   range: 'per day target' },
          { label: 'Fat',      value: `${latest.mealPlan.fat}g`,     range: 'per day target' },
        ].map(t => (
          <div key={t.label} style={{
            padding: 14, borderRadius: 10,
            background: OT.sand50, border: `1px solid ${OT.hairline}`,
          }}>
            <OMono size={9}>{t.label}</OMono>
            <div style={{
              fontFamily: OT.fDisplay, fontStyle: 'italic', fontSize: 26,
              color: OT.espresso900, marginTop: 4, lineHeight: 1,
            }}>{t.value}</div>
            <div style={{
              marginTop: 6, fontFamily: OT.fBody, fontSize: 11.5,
              color: OT.clay600, lineHeight: 1.4,
            }}>{t.range}</div>
          </div>
        ))}
      </div>

      {/* Tags */}
      {latest.tags.length > 0 && (
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
          {latest.tags.map(tag => (
            <div key={tag} style={{
              padding: '3px 10px', borderRadius: 999,
              background: OT.sand100, border: `1px solid ${OT.hairline}`,
              fontFamily: OT.fMono, fontSize: 9, letterSpacing: 1.2,
              textTransform: 'uppercase', color: OT.clay600,
            }}>{tag}</div>
          ))}
        </div>
      )}

      {/* Coach note */}
      {latest.notes && (
        <div style={{
          padding: '12px 14px', background: '#FFF8EE',
          border: `1px solid ${OT.hairline}`, borderRadius: 10,
          marginBottom: 16,
        }}>
          <OMono size={9} style={{ marginBottom: 6 }}>
            Coach note from {latest.coachName}
          </OMono>
          <div style={{
            fontFamily: OT.fBody, fontSize: 13.5,
            color: OT.espresso800, lineHeight: 1.6, fontStyle: 'italic',
          }}>“{latest.notes}”</div>
        </div>
      )}

      {/* History — past entries */}
      {entries.length > 1 && (
        <div>
          <OMono size={9} style={{ marginBottom: 8 }}>Previous plans</OMono>
          {entries.slice(1).map((e) => (
            <div key={e.id} style={{
              padding: '10px 0', borderTop: `1px solid ${OT.hairline}`,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <div>
                <OMono size={9}>{e.date} · {e.period}</OMono>
                <div style={{
                  fontFamily: OT.fBody, fontSize: 12, color: OT.espresso800, marginTop: 2,
                }}>
                  {e.mealPlan.calories} kcal · {e.mealPlan.protein}g protein
                </div>
              </div>
              <OMono size={9} style={{ color: OT.clay600 }}>{e.coachName}</OMono>
            </div>
          ))}
        </div>
      )}

      {/* Read-only footer */}
      <div style={{
        marginTop: 14, fontFamily: OT.fBody, fontSize: 12, color: OT.clay600,
      }}>
        This plan is set by your coach and updates after each programme review.
        <strong style={{ color: OT.walnut }}> Speak to {latest.coachName}</strong> to adjust targets.
      </div>
    </div>
  );
}

// ─── Session decline banner — desktop variant ───────────────────────────────
function DTerraBtn({ children, onClick }) {
  const [hov, setHov] = React.useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        padding: '11px 22px', borderRadius: 999, border: 'none',
        background: hov ? '#9C5A3A' : '#B86B4B', color: OT.paper,
        fontFamily: OT.fBody, fontSize: 14, fontWeight: 600,
        cursor: 'pointer', transition: 'background .18s', flexShrink: 0,
      }}>
      {children}
    </button>
  );
}
function DTerraGhostBtn({ children, onClick }) {
  const [hov, setHov] = React.useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        padding: '10px 22px', borderRadius: 999,
        border: '1.5px solid rgba(184,107,75,0.45)',
        background: hov ? 'rgba(184,107,75,0.09)' : 'transparent',
        color: '#B86B4B',
        fontFamily: OT.fBody, fontSize: 14, fontWeight: 500,
        cursor: 'pointer', transition: 'background .18s', flexShrink: 0,
      }}>
      {children}
    </button>
  );
}
function DeclineBanner({ state, onAccept, onDecline }) {
  const terra = '#B86B4B';
  const eyebrow = (color, label) => (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 7,
      fontFamily: OT.fMono, fontSize: 10, letterSpacing: 1.8,
      textTransform: 'uppercase', color, marginBottom: 9,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: color, display: 'inline-block', flexShrink: 0 }} />
      {label}
    </div>
  );
  const headline = (text) => (
    <div style={{ fontFamily: OT.fBody, fontSize: 16, fontWeight: 600, color: OT.espresso900, marginBottom: 8, lineHeight: 1.25 }}>{text}</div>
  );
  const body = (text) => (
    <div style={{ fontFamily: OT.fBody, fontSize: 14, color: OT.espresso800, lineHeight: 1.62 }}>{text}</div>
  );

  if (state === 'accepted') return (
    <>
      <style>{`@keyframes m3sPDrain { from { width:100%; } to { width:0%; } }`}</style>
      <div style={{ background: '#EEF5EE', borderLeft: '3px solid ' + OT.sage, borderRadius: '0 14px 14px 0', padding: '13px 22px 13px', marginBottom: 16, position: 'relative', overflow: 'hidden' }}>
        <div style={{ fontFamily: OT.fMono, fontSize: 12, letterSpacing: '0.6px', color: OT.sage, lineHeight: 1.45 }}>
          ✓ Confirmed with Coach Meera · Tuesday, 29 Apr · 7:00 AM
        </div>
        <div style={{ position: 'absolute', bottom: 0, left: 0, height: 2, background: OT.ochre, width: '100%', animation: 'm3sPDrain 4s linear forwards' }} />
      </div>
    </>
  );

  if (state === 'declined') return (
    <div style={{ background: OT.sand100, borderLeft: '3px solid ' + OT.clay500, borderRadius: '0 14px 14px 0', padding: '14px 22px', marginBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontFamily: OT.fMono, fontSize: 10, letterSpacing: 1.8, textTransform: 'uppercase', color: OT.clay500, marginBottom: 7 }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: OT.clay500, display: 'inline-block', flexShrink: 0 }} />
        Session voided · 1 credit added to your package
      </div>
      <div style={{ fontFamily: OT.fBody, fontSize: 13, fontStyle: 'italic', color: OT.clay600, lineHeight: 1.55 }}>
        Your credit will appear in your package summary within a few minutes.
      </div>
    </div>
  );

  return (
    <div style={{ background: '#FEF0CC', borderLeft: '4px solid ' + terra, borderRadius: '0 14px 14px 0', padding: '16px 22px', marginBottom: 16 }}>
      {eyebrow(terra, 'ACTION NEEDED')}
      {headline('Your session has been updated')}
      <p style={{ fontFamily: OT.fBody, fontSize: 14, color: OT.espresso800, lineHeight: 1.62, margin: '0 0 18px' }}>
        Coach Lee is unavailable on Tuesday, 29 Apr at 7:00 AM.
        Coach Meera is available at the same time. Confirm by 8&nbsp;PM
        tonight or you'll be auto-confirmed with Coach Meera.
      </p>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <DTerraBtn onClick={onAccept}>Accept Coach Meera</DTerraBtn>
        <DTerraGhostBtn onClick={onDecline}>Decline &amp; get session credit</DTerraGhostBtn>
      </div>
    </div>
  );
}

// ─── Confirm decline modal (desktop) ────────────────────────────────
function ConfirmDeclineModal({ onConfirm, onBack }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(36,24,16,0.45)', backdropFilter: 'blur(4px)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ background: OT.paper, borderRadius: 20, padding: '36px 40px', maxWidth: 460, width: '100%', boxShadow: OT.sh3 }}>
        <h2 style={{ fontFamily: OT.fDisplay, fontStyle: 'italic', fontWeight: 400, fontSize: 32, color: OT.espresso900, lineHeight: 1.1, marginBottom: 14 }}>Are you sure?</h2>
        <p style={{ fontFamily: OT.fBody, fontSize: 15, color: OT.espresso800, lineHeight: 1.65, marginBottom: 28 }}>
          If you decline, this session will be voided and 1 session credit will be added to your package. You can book a future session with Coach Lee when they&apos;re available.
        </p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <DTerraBtn onClick={onConfirm}>Yes, decline &amp; credit me</DTerraBtn>
          <DTerraGhostBtn onClick={onBack}>Go back</DTerraGhostBtn>
        </div>
      </div>
    </div>
  );
}

// ─── Client Dashboard (HOME tab) ──────────────────────────────────────────
function ClientDashboard() {
  const [profile] = useProfile();
  const [bannerState, setBannerState] = React.useState('pending');
  const coach = COACHES.find(c => c.id === profile.coachId) || COACHES[0];
  const sessionCoachName = bannerState === 'accepted' ? 'Meera' : coach.name;

  // Time-based greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'GOOD MORNING' : hour < 17 ? 'GOOD AFTERNOON' : 'GOOD EVENING';

  return (
    <div style={{ maxWidth: 920, margin: '0 auto', padding: '24px 24px 100px' }}>

      {/* ── HERO CARD ── */}
      <div style={{
        background: OT.espresso900, borderRadius: 18, padding: '24px 28px',
        marginBottom: 20, boxShadow: OT.sh3, position: 'relative', overflow: 'hidden',
      }}>
        {/* decorative circle */}
        <div style={{
          position: 'absolute', top: -40, right: -40, width: 180, height: 180,
          borderRadius: '50%', background: 'rgba(201,154,63,0.12)',
        }} />
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <OMono color="rgba(255,253,248,0.5)" size={9}>{greeting}</OMono>
            <div style={{
              fontFamily: OT.fDisplay, fontStyle: 'italic', fontSize: 34,
              color: OT.paper, margin: '6px 0 4px', letterSpacing: -0.5,
            }}>{profile.name || 'Riya'}</div>
            <OMono color="rgba(255,253,248,0.45)" size={9}>
              WEEK 3 OF 12 · COACH: {coach.name.toUpperCase()}
            </OMono>
          </div>
          <Avatar name={profile.name} photo={profile.photo} size={52} />
        </div>
      </div>

      {/* ── SESSION UPDATE BANNER ── */}
      <DeclineBanner
        state={bannerState === 'confirming' ? 'pending' : bannerState}
        onAccept={() => setBannerState('accepted')}
        onDecline={() => setBannerState('confirming')}
      />

      {/* ── CONFIRM DECLINE MODAL ── */}
      {bannerState === 'confirming' && (
        <ConfirmDeclineModal
          onConfirm={() => setBannerState('declined')}
          onBack={() => setBannerState('pending')}
        />
      )}

      {/* ── NEXT SESSION CARD ── */}
      <div style={{
        background: OT.paper, borderRadius: 16, padding: 20,
        border: `1px solid ${OT.hairline}`, boxShadow: OT.sh2, marginBottom: 16,
        opacity: bannerState === 'declined' ? 0.5 : 1,
        transition: 'opacity .3s',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <OEyebrow>YOUR NEXT SESSION</OEyebrow>
          {bannerState === 'accepted' && (
            <span style={{ fontFamily: OT.fMono, fontSize: 9, letterSpacing: '1.4px', textTransform: 'uppercase', color: OT.ochre, background: 'rgba(201,154,63,0.12)', padding: '3px 8px', borderRadius: 999, border: '1px solid rgba(201,154,63,0.28)' }}>REASSIGNED</span>
          )}
        </div>
        <div style={{
          fontFamily: OT.fBody, fontWeight: 600, fontSize: 17,
          color: OT.espresso900, margin: '10px 0 2px',
        }}>Tuesday, 29 Apr · 7:00 AM</div>
        <div style={{
          fontFamily: OT.fDisplay, fontStyle: 'italic', fontSize: 22,
          color: OT.espresso900, marginBottom: 4,
        }}>Strength & Conditioning</div>
        {bannerState !== 'declined' && (
          <div style={{ fontFamily: OT.fBody, fontSize: 13, color: OT.clay600 }}>with {sessionCoachName}</div>
        )}
        {bannerState === 'declined' && (
          <div style={{ marginTop: 8 }}>
            <div style={{ fontFamily: OT.fDisplay, fontStyle: 'italic', fontSize: 20, color: OT.espresso900, lineHeight: 1.1, marginBottom: 10 }}>No upcoming sessions.</div>
            <div style={{ fontFamily: OT.fBody, fontSize: 14, fontWeight: 600, color: OT.walnut, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>Book your next with Coach Lee <span>→</span></div>
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }}>
          <div style={{
            padding: '4px 12px', borderRadius: 999,
            background: 'rgba(201,154,63,0.15)', color: OT.ochre,
            fontFamily: OT.fMono, fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase',
          }}>IN 2 DAYS</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={{
              padding: '8px 16px', borderRadius: 999, border: 'none',
              background: OT.walnut, color: OT.paper,
              fontFamily: OT.fBody, fontWeight: 600, fontSize: 13, cursor: 'pointer',
              boxShadow: OT.sh2,
            }}>View plan</button>
            <button style={{
              padding: '8px 16px', borderRadius: 999,
              border: `1px solid ${OT.hairlineStrong}`, background: 'transparent',
              color: OT.walnut, fontFamily: OT.fBody, fontSize: 13, cursor: 'pointer',
            }}>Reschedule</button>
          </div>
        </div>
      </div>

      {/* ── PROGRESS ROW ── */}
      <OEyebrow style={{ marginBottom: 10 }}>YOUR PROGRESS</OEyebrow>
      <div style={{ display: 'flex', gap: 10, overflowX: 'auto', marginBottom: 20, paddingBottom: 4 }}>
        {[
          { label: 'SESSIONS', value: '6', sub: 'of 12 completed', fill: 50 },
          { label: 'BODY COMP', value: 'May 5', sub: 'DEXA check-in', fill: null },
          { label: 'STREAK',    value: '4',    sub: 'sessions 🔥',   fill: null },
        ].map(card => (
          <div key={card.label} style={{
            background: OT.sand100, borderRadius: 14, padding: '14px 18px',
            border: `1px solid ${OT.hairline}`, flexShrink: 0, minWidth: 130,
          }}>
            <OMono size={9}>{card.label}</OMono>
            <div style={{
              fontFamily: OT.fDisplay, fontStyle: 'italic', fontSize: 30,
              color: OT.espresso900, lineHeight: 1, margin: '6px 0 4px',
            }}>{card.value}</div>
            <div style={{ fontFamily: OT.fBody, fontSize: 12, color: OT.clay600 }}>
              {card.sub}
            </div>
            {card.fill !== null && (
              <div style={{ height: 3, borderRadius: 999, background: OT.sand200, marginTop: 8 }}>
                <div style={{ height: '100%', borderRadius: 999, width: `${card.fill}%`, background: OT.ochre }} />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ── COACH NOTE ── */}
      <div style={{
        background: '#FFF8EE', borderRadius: 14, padding: 18,
        border: `1px solid ${OT.hairline}`, marginBottom: 20,
      }}>
        <OEyebrow dot={OT.ochre}>FROM {coach.name.toUpperCase()}</OEyebrow>
        <div style={{
          fontFamily: OT.fBody, fontSize: 15, color: OT.espresso800,
          lineHeight: 1.6, margin: '10px 0 10px',
        }}>
          "Focus on sleep this week — recovery is where the gains happen. See you Tuesday 💪"
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <OMono size={9}>SENT FRIDAY</OMono>
          <button style={{
            padding: '5px 12px', borderRadius: 999,
            border: `1px solid ${OT.hairline}`, background: 'transparent',
            color: OT.clay600, fontFamily: OT.fBody, fontSize: 12, cursor: 'pointer',
          }}>Reply →</button>
        </div>
      </div>

      {/* ── QUICK ACTIONS ── */}
      <OEyebrow style={{ marginBottom: 12 }}>QUICK ACTIONS</OEyebrow>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {[
          { label: 'Log body weight',    sub: 'Last: 67.4 kg · Apr 21',   icon: '⚖' },
          { label: 'Upload BCA scan',    sub: 'Next check-in: May 5',      icon: '↑' },
          { label: "This week's plan",   sub: '4 sessions · 2 remaining',  icon: '☰' },
          { label: `Message ${coach.name}`, sub: 'Last reply: yesterday', icon: '💬' },
        ].map(action => (
          <div key={action.label} style={{
            background: OT.sand100, borderRadius: 12, padding: '14px 16px',
            border: `1px solid ${OT.hairline}`, cursor: 'pointer',
            display: 'flex', alignItems: 'flex-start', gap: 12,
          }}>
            <div style={{ fontSize: 18, lineHeight: 1, marginTop: 1 }}>{action.icon}</div>
            <div>
              <div style={{ fontFamily: OT.fBody, fontWeight: 500, fontSize: 13, color: OT.espresso900 }}>
                {action.label}
              </div>
              <div style={{ fontFamily: OT.fBody, fontSize: 11, color: OT.clay600, marginTop: 2 }}>
                {action.sub}
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────
function ProfilePageContent() {
  const [profile, update] = useProfile();

  return (
    <main style={{ maxWidth: 920, margin: '0 auto', padding: '32px 24px 80px' }}>
        <ProfileHero profile={profile} />

        {/* Fitness score — hero card, stands alone (renders its own chrome) */}
        <div style={{ marginBottom: 18 }}>
          <FitnessScoreSection profile={profile} />
        </div>

        {/* About you */}
        <Section eyebrow="About you" title="Your details." dot={OT.walnut}>
          <EditableField label="Name"   value={profile.name}   onSave={(v) => update({ name: v })} />
          <EditableField label="Age"    value={profile.age}    onSave={(v) => update({ age: v })} />
          <EditableField label="Gender" value={profile.gender} onSave={(v) => update({ gender: v })}
            options={['Female', 'Male', 'Non-binary', 'Prefer not to say']} />
          <EditableField label="Phone"  value={profile.phone}  onSave={(v) => update({ phone: v })} />
        </Section>

        {/* Journey */}
        <Section eyebrow="Your journey" title="Goals & history." dot={OT.ochre}>
          <EditableField label="Experience" value={profile.experience} onSave={(v) => update({ experience: v })}
            options={['Brand new', '<6 months', '6–24 months', '2–5 years', '5+ years']} />
          <EditableField label="Primary goal" value={profile.goal} onSave={(v) => update({ goal: v })}
            options={['Muscle Gain', 'Fat Loss', 'Strength', 'Hyrox', 'General Fitness', 'Recovery / Rehab']} />
          <EditableField label="Days / week" value={String(profile.daysPerWeek)}
            onSave={(v) => update({ daysPerWeek: parseInt(v, 10) || 4 })} type="number" />
          <EditableField label="Why this matters" value={profile.notes} multiline
            onSave={(v) => update({ notes: v })} />
          <EditableField label="Injuries" value={(profile.injuries || []).join(', ') || 'None'}
            onSave={(v) => update({ injuries: v.split(',').map(s => s.trim()).filter(Boolean) })} />
          <EditableField label="Injury notes" value={profile.injuryNotes} multiline
            onSave={(v) => update({ injuryNotes: v })} />
        </Section>

        {/* Time slots */}
        <Section eyebrow="Preferred times" title="When you train." dot={OT.terra}>
          <SlotsEditor slots={profile.slots} customSlots={profile.customSlots} onUpdate={update} />
          <div style={{
            marginTop: 14, fontFamily: OT.fBody, fontSize: 12.5, color: OT.clay600,
          }}>
            <strong style={{ color: OT.walnut }}>{profile.slots.length}</strong> slot{profile.slots.length === 1 ? '' : 's'} selected.
            Coach is matched against your live availability.
          </div>
        </Section>

        {/* Body composition */}
        <Section eyebrow="Body composition" title="Last scan." dot={OT.ochre}>
          <BCAReadout />
        </Section>

        {/* Blood */}
        <Section eyebrow="Blood report" title="Last panel." dot={OT.bad}>
          <BloodReadout />
        </Section>

        {/* MSK */}
        <Section eyebrow="MSK assessment" title="Movement screen." dot={OT.warn}>
          <MSKReadout profile={profile} />
        </Section>

        {/* Running */}
        <Section eyebrow="Running" title="Conditioning baseline." dot={OT.terra}
          accessory={(
            <div style={{ display: 'flex', gap: 6 }}>
              <button onClick={() => {
                const v = prompt('Latest 5K time (mm:ss)', profile.running5k);
                if (v) update({ running5k: v });
              }} style={miniBtn(false)}>Update 5K</button>
              <button onClick={() => {
                const v = prompt('Latest 2K time (mm:ss)', profile.running2k);
                if (v) update({ running2k: v });
              }} style={miniBtn(false)}>Update 2K</button>
            </div>
          )}>
          <RunningReadout profile={profile} update={update} />
        </Section>

        {/* Session notes from coach */}
        <Section eyebrow="From your coach" title="Session notes." dot={OT.walnut}>
          <CoachNotesClientView />
        </Section>

        {/* Nutrition */}
        <Section eyebrow="Nutrition plan" title="Your targets." dot={OT.sage}>
          <NutritionSection profile={profile} />
        </Section>

        {/* Milestones */}
        <Section eyebrow="12-week plan" title="Your milestones." dot={OT.walnut}>
          <MilestonesStepper />
        </Section>

        {/* Progress */}
        <Section eyebrow="Monthly progress" title="How it's tracking." dot={OT.sage}
          accessory={<button style={miniBtn(true)}>+ Log this month</button>}>
          <ProgressLog />
        </Section>

        {/* Coach rating */}
        <Section eyebrow="Rate your coach" title="How was your session?"
          dot={OT.ochre}>
          <RateSessionSection profile={profile} />
        </Section>
      </main>
  );
}

// ─── App shell — tab switcher ─────────────────────────────────────────────
function App() {
  const [tab, setTab] = React.useState('home');
  const [profile] = useProfile();

  return (
    <div style={{ minHeight: '100vh', background: OT.sand50 }}>
      {/* Sticky header — Topbar + tab strip locked together */}
      <div style={{ position: 'sticky', top: 0, zIndex: 50, background: OT.sand50 }}>
        <Topbar name={profile.name} />

        {/* Tab switcher bar */}
        <div style={{
          display: 'flex', borderBottom: `1px solid ${OT.hairline}`,
          background: OT.paper, padding: '0 24px',
        }}>
        {[
          { id: 'home',    label: 'Home' },
          { id: 'profile', label: 'My Profile' },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              padding: '14px 20px', border: 'none', background: 'none',
              fontFamily: OT.fMono, fontSize: 10, letterSpacing: 1.5,
              textTransform: 'uppercase', cursor: 'pointer',
              color: tab === t.id ? OT.walnut : OT.clay600,
              borderBottom: tab === t.id
                ? `2px solid ${OT.walnut}`
                : '2px solid transparent',
              marginBottom: -1,
              transition: 'color 0.15s',
            }}
          >
            {t.label}
          </button>
        ))}
        </div>
      </div>

      {/* Tab content — conditional render */}
      {tab === 'home'
        ? <ClientDashboard />
        : <ProfilePageContent />
      }
    </div>
  );
}

Object.assign(window, { App, ClientDashboard, ProfilePageContent });
