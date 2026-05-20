/* Client Profile — full-screen overlay opened from My Clients
 * Tabs: Assessment · Progress · Coach Notes · Nutrition
 */

const { useState: cpUseState, useMemo: cpUseMemo } = React;

// ─── Demo bridge: coach-side client → client-app userId ──────────────────
// In this prototype the client app (profile.jsx) runs as user "riya".
// Coach-Universe shows that same person as invite "Meera P.". So when the
// coach writes nutrition / session notes for "Meera P.", we tag the rows
// with clientId 'riya' so the client app picks them up. Other clients fall
// back to their first-name lowercase.
function clientIdFor(client) {
  if (!client || !client.name) return 'unknown';
  if (client.name === 'Meera P.' || client.name === 'Riya Sharma') return 'riya';
  return client.name.toLowerCase().split(' ')[0];
}

// Coach identity (this prototype: signed-in coach is Lee).
const COACH_ID = 'lee';
const COACH_NAME = 'Lee';

// ─── Nutrition store (localStorage: 'm3s.nutrition') ─────────────────────
function loadNutritionForClient(clientId) {
  try {
    return JSON.parse(localStorage.getItem('m3s.nutrition') || '[]')
      .filter(n => n.clientId === clientId)
      .sort((a, b) => b.date.localeCompare(a.date));
  } catch { return []; }
}
function saveNutritionEntry(entry) {
  let raw = [];
  try { raw = JSON.parse(localStorage.getItem('m3s.nutrition') || '[]'); } catch {}
  const idx = raw.findIndex(n => n.id === entry.id);
  if (idx >= 0) raw[idx] = entry; else raw.push(entry);
  localStorage.setItem('m3s.nutrition', JSON.stringify(raw));
}

// ─── Session notes store (localStorage: 'm3s.sessionNotes') ──────────────
function loadSessionNotes(clientId) {
  try {
    return JSON.parse(localStorage.getItem('m3s.sessionNotes') || '[]')
      .filter(n => n.clientId === clientId)
      .sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  } catch { return []; }
}
function saveSessionNote(note) {
  let raw = [];
  try { raw = JSON.parse(localStorage.getItem('m3s.sessionNotes') || '[]'); } catch {}
  const idx = raw.findIndex(n => n.id === note.id);
  if (idx >= 0) raw[idx] = note; else raw.push(note);
  localStorage.setItem('m3s.sessionNotes', JSON.stringify(raw));
}

// ------- Mock onboarding data for Meera P. -------
const MEERA_ASSESSMENT = {
  basics: {
    title: "Basics",
    fields: [
      { label: "Full name",         value: "Meera Pillai" },
      { label: "Date of birth",     value: "12 Jul 1992 · 33 yrs" },
      { label: "Phone",             value: "+91 98456 22341" },
      { label: "Email",             value: "meera.p@gmail.com" },
      { label: "Emergency contact", value: "Arjun Pillai · +91 98456 99812 · Spouse" },
    ],
  },
  training: {
    title: "Training Background",
    fields: [
      { label: "Experience",        value: "Intermediate · 3 yrs consistent" },
      { label: "Primary goal",      value: "Rebuild lower-body strength post knee rehab" },
      { label: "Days per week",     value: "4 · Mon / Wed / Fri / Sat" },
      { label: "Preferred session", value: "60 min · Mornings before 9am" },
    ],
  },
  injuries: {
    title: "Injuries & Limitations",
    fields: [
      { label: "Free text", value: "Right ACL reconstruction (Jan 2024). Cleared by physio Aug 2024. Mild patellar tracking issues — knee gives slight discomfort under heavy unilateral loading." },
      { label: "Tags",      value: "ACL · Right knee · Patellar tracking · Avoid deep lunges (R)" },
    ],
  },
  body: {
    title: "Body Composition",
    fields: [
      { label: "Weight",         value: "62.4 kg" },
      { label: "Body fat %",     value: "26.8%" },
      { label: "Muscle mass",    value: "42.1 kg" },
      { label: "Visceral fat",   value: "5 (healthy)" },
      { label: "Source",         value: "InBody 770 · 12 Apr 2026" },
    ],
  },
  lifestyle: {
    title: "Lifestyle",
    fields: [
      { label: "Sleep",      value: "6.5 hrs avg · variable" },
      { label: "Stress",     value: "Moderate · 6/10 (work)" },
      { label: "Nutrition",  value: "High protein, vegetarian. Tracks via cronometer." },
      { label: "Hydration",  value: "~2.5 L / day" },
    ],
  },
  coach: {
    title: "Coach Selection",
    fields: [
      { label: "Selected coach", value: "Rahul · Strength & Hyrox Prep" },
      { label: "Programme",      value: "Strength & Recovery · 16 sessions" },
      { label: "Start date",     value: "08 Dec 2025" },
    ],
  },
};

const ASSESSMENT_ORDER = [
  { id: "basics",    eyebrow: "01 · Basics" },
  { id: "training",  eyebrow: "02 · Training Background" },
  { id: "injuries",  eyebrow: "03 · Injuries & Limitations" },
  { id: "body",      eyebrow: "04 · Body Composition" },
  { id: "lifestyle", eyebrow: "05 · Lifestyle" },
  { id: "coach",     eyebrow: "06 · Coach Selection" },
];

// ------- Mock progress data for Meera -------
const MEERA_BCA = [
  { date: "Dec 2025", weight: 64.8, fatPct: 29.2, muscle: 40.6 },
  { date: "Jan 2026", weight: 64.1, fatPct: 28.4, muscle: 40.9 },
  { date: "Feb 2026", weight: 63.5, fatPct: 27.8, muscle: 41.3 },
  { date: "Mar 2026", weight: 62.9, fatPct: 27.1, muscle: 41.8 },
  { date: "Apr 2026", weight: 62.4, fatPct: 26.8, muscle: 42.1 },
];

const MEERA_SESSIONS = [
  { date: "APR 20", type: "PT",       note: "Heavy hinge day — RDL 3×8 @ 50kg. Knee felt stable.",          perf: "up" },
  { date: "APR 17", type: "PT",       note: "Upper push focus. Bench 3×6 @ 32.5kg. Form sharp.",            perf: "up" },
  { date: "APR 15", type: "GROUP",    note: "Saturday Strong class. Skipped pistol squats per protocol.",   perf: "flat" },
  { date: "APR 13", type: "PT",       note: "Light recovery — sleep was 4.5 hrs. Backed off intensity.",    perf: "down" },
];

const MEERA_NOTES_SEED = [
  {
    id: "n-01", date: "APR 20, 2026", type: "PT SESSION",
    body: "Big day — first time pulling 50kg on the RDL since pre-surgery. Bar path stayed clean, no compensation through the right side. We're cleared to push the hinge progression.",
    tags: ["PROGRESSIVE OVERLOAD", "MILESTONE", "FORM FOCUS"],
    media: 2,
  },
  {
    id: "n-02", date: "APR 17, 2026", type: "PT SESSION",
    body: "Bench day. Working up to 32.5kg for triples. Noted slight tendency to flare elbows on the eccentric — cued tucking, fixed within two sets.",
    tags: ["FORM FOCUS"],
    media: 0,
  },
  {
    id: "n-03", date: "APR 13, 2026", type: "PT SESSION",
    body: "Meera came in low-energy — 4.5 hrs sleep, deadline at work. Pivoted to low-intensity mobility + zone 2. Reminded her our system is the floor, not the ceiling.",
    tags: ["RECOVERY NOTE", "NUTRITION FLAG"],
    media: 0,
  },
];

const ALL_TAGS = [
  "FORM FOCUS", "PROGRESSIVE OVERLOAD", "KNEE LOAD",
  "NUTRITION FLAG", "RECOVERY NOTE", "MILESTONE",
];

// ------- Tab pill bar -------
function CPTabs({ tab, setTab }) {
  const tabs = [
    { id: "assessment", label: "Assessment" },
    { id: "progress",   label: "Progress" },
    { id: "notes",      label: "Coach Notes" },
    { id: "nutrition",  label: "Nutrition" },
  ];
  return (
    <div style={{ display: "flex", gap: 8, marginBottom: 32, flexWrap: "wrap" }}>
      {tabs.map(t => {
        const active = tab === t.id;
        return (
          <button key={t.id} onClick={() => setTab(t.id)} className="mono" style={{
            padding: "10px 20px", borderRadius: "var(--r-pill)",
            border: "1px solid " + (active ? "var(--walnut-700)" : "var(--hairline-strong)"),
            background: active ? "var(--walnut-700)" : "var(--paper)",
            color: active ? "var(--paper)" : "var(--walnut-700)",
            cursor: "pointer", fontFamily: "var(--f-mono)",
            fontSize: 11, letterSpacing: 1.8, textTransform: "uppercase",
          }}>{t.label}</button>
        );
      })}
    </div>
  );
}

// ------- Override field -------
function OverrideField({ field, sectionId, readOnly }) {
  const [open, setOpen] = cpUseState(false);
  const [val, setVal] = cpUseState("");
  const [saved, setSaved] = cpUseState(null); // { text, date }

  return (
    <div style={{ display: readOnly ? "block" : "grid", gridTemplateColumns: "180px 1fr", gap: 24, padding: "16px 0", borderBottom: "1px solid var(--hairline)" }}>
      <div className="mono" style={{ color: "var(--clay-600)", paddingTop: 4, marginBottom: readOnly ? 6 : 0 }}>{field.label}</div>
      <div>
        <div style={{
          padding: "10px 14px", borderRadius: "var(--r-md)",
          background: "var(--sand-50)", border: "1px solid var(--hairline)",
          fontSize: 14, color: "var(--espresso-900)", lineHeight: 1.5,
        }}>{field.value}</div>

        {!saved && !open && !readOnly && (
          <button onClick={() => setOpen(true)} className="mono" style={{
            marginTop: 8, padding: "4px 10px", borderRadius: "var(--r-pill)",
            background: "transparent", border: "1px dashed var(--hairline-strong)",
            color: "var(--clay-600)", cursor: "pointer", fontSize: 10, letterSpacing: 1.5,
          }}>+ Override</button>
        )}

        {saved && !open && (
          <div style={{ marginTop: 10 }}>
            <div className="mono" style={{ display: "inline-flex", alignItems: "center", gap: 6,
              background: "var(--sage-200)", color: "var(--sage-500)",
              padding: "3px 10px", borderRadius: "var(--r-pill)",
              fontSize: 10, letterSpacing: 1.5, fontWeight: 600,
            }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--sage-500)" }} />
              COACH · {saved.date}
            </div>
            <div style={{
              marginTop: 8, padding: "10px 14px", borderRadius: "var(--r-md)",
              background: "var(--paper)", border: "1px solid var(--hairline-strong)",
              fontSize: 14, color: "var(--espresso-900)", lineHeight: 1.5, fontStyle: "italic",
            }}>{saved.text}</div>
            <button onClick={() => { setOpen(true); setVal(saved.text); }} className="mono" style={{
              marginTop: 8, padding: "4px 10px", borderRadius: "var(--r-pill)",
              background: "transparent", border: "none", color: "var(--clay-600)",
              cursor: "pointer", fontSize: 10, letterSpacing: 1.5,
              display: readOnly ? "none" : "inline-block",
            }}>Edit override</button>
          </div>
        )}

        {open && (
          <div style={{ marginTop: 10 }}>
            <div className="mono" style={{ color: "var(--clay-600)", marginBottom: 6 }}>Coach note / override</div>
            <textarea value={val} onChange={e => setVal(e.target.value)} rows={3}
              placeholder="What's the more accurate / current picture?"
              style={{
                width: "100%", padding: "10px 14px", borderRadius: "var(--r-md)",
                background: "var(--paper)", border: "1px solid var(--hairline-strong)",
                fontFamily: "var(--f-body)", fontSize: 14, color: "var(--ink)",
                resize: "vertical", outline: "none",
              }} />

            {sectionId === "injuries" && <InjuryUploader />}

            <div style={{ display: "flex", gap: 8, marginTop: 10, justifyContent: "flex-end" }}>
              <button onClick={() => { setOpen(false); setVal(saved?.text || ""); }} className="mono" style={{
                padding: "8px 14px", borderRadius: "var(--r-pill)",
                background: "transparent", border: "1px solid var(--hairline-strong)",
                color: "var(--clay-600)", cursor: "pointer", fontSize: 10, letterSpacing: 1.5,
              }}>Cancel</button>
              <button onClick={() => {
                if (!val.trim()) return;
                setSaved({ text: val, date: "APR 20, 2026" });
                setOpen(false);
              }} style={{
                padding: "8px 16px", borderRadius: "var(--r-pill)",
                background: "var(--walnut-700)", color: "var(--paper)", border: "none",
                cursor: "pointer", fontFamily: "var(--f-body)", fontSize: 12, fontWeight: 500,
              }}>Save override</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function InjuryUploader() {
  return (
    <div style={{ marginTop: 12 }}>
      <button style={{
        width: "100%", padding: "16px", borderRadius: "var(--r-md)",
        background: "var(--paper)", border: "1px dashed var(--ochre-500)",
        cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
        gap: 10, color: "var(--clay-600)", fontFamily: "var(--f-body)",
      }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M3 15a4 4 0 0 0 4 4h10a5 5 0 0 0 1.7-9.7 6 6 0 0 0-11.7-.5A4 4 0 0 0 3 13" />
          <path d="M12 12v7M9 15l3-3 3 3" />
        </svg>
        <span className="mono">Drag or tap to upload · image or video</span>
      </button>
      <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
        {[1,2].map(i => (
          <div key={i} style={{
            width: 64, height: 64, borderRadius: "var(--r-md)",
            background: "var(--sand-200)", border: "1px solid var(--hairline)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "var(--clay-600)", fontFamily: "var(--f-mono)", fontSize: 9, letterSpacing: 1,
          }}>◱ IMG</div>
        ))}
      </div>
    </div>
  );
}

// ------- Assessment tab -------
function AssessmentTab({ profileData, readOnly }) {
  const [open, setOpen] = cpUseState({ basics: false, training: false, injuries: true, body: false, lifestyle: false, coach: false });

  // Build assessment data — overlay live profile data if present
  const assessment = cpUseMemo(() => {
    const base = JSON.parse(JSON.stringify(MEERA_ASSESSMENT));
    if (!profileData) return base;
    const p = profileData;
    if (p.name)        base.basics.fields[0].value = p.name;
    if (p.age)         base.basics.fields[1].value = p.age + (p.gender ? ` · ${p.gender}` : "");
    if (p.phone)       base.basics.fields[2].value = p.phone;
    if (p.experience)  base.training.fields[0].value = p.experience;
    if (p.goal)        base.training.fields[1].value = p.goal;
    if (p.daysPerWeek) base.training.fields[2].value = p.daysPerWeek + " days / week";
    if (p.injuryNotes) base.injuries.fields[0].value = p.injuryNotes;
    if (p.injuries && p.injuries.length) base.injuries.fields[1].value = p.injuries.join(" · ");
    if (p.notes)       base.lifestyle.fields = [
      ...base.lifestyle.fields,
      { label: "Coach notes", value: p.notes },
    ];
    if (p.coachId)     base.coach.fields[0].value = p.coachId;
    return base;
  }, [profileData]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 880 }}>
      {/* M3S Fitness Score — coach-editable. Changes here surface on the client's profile. */}
      <FitnessScoreSection profile={profileData || {}} coachEditable />

      {ASSESSMENT_ORDER.map(s => {
        const data = assessment[s.id];
        const isOpen = open[s.id];
        return (
          <div key={s.id} style={{
            background: "var(--paper)", borderRadius: "var(--r-lg)",
            border: "1px solid var(--hairline-strong)", overflow: "hidden",
          }}>
            <button onClick={() => setOpen({ ...open, [s.id]: !isOpen })} style={{
              width: "100%", padding: "18px 22px", display: "flex",
              alignItems: "center", justifyContent: "space-between", gap: 16,
              background: "transparent", border: "none", cursor: "pointer",
              fontFamily: "var(--f-body)", textAlign: "left",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <span className="mono" style={{ color: "var(--clay-600)" }}>{s.eyebrow}</span>
                <span style={{ fontFamily: "var(--f-display)", fontSize: 22, fontStyle: "italic", color: "var(--espresso-900)" }}>
                  {data.title}
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span className="mono" style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  background: "var(--sand-100)", color: "var(--walnut-700)",
                  padding: "4px 10px", borderRadius: "var(--r-pill)",
                  fontSize: 9, letterSpacing: 1.5, border: "1px solid var(--hairline)",
                }}>
                  <span style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--sage-500)" }} />
                  Client · Verified
                </span>
                <span style={{ fontSize: 18, color: "var(--clay-600)", transform: isOpen ? "rotate(180deg)" : "none", transition: "transform .2s" }}>⌄</span>
              </div>
            </button>

            {isOpen && (
              <div style={{ padding: "0 22px 18px", borderTop: "1px solid var(--hairline)" }}>
                {data.fields.map((f, i) => (
                  <OverrideField key={i} field={f} sectionId={s.id} readOnly={readOnly} />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ------- Tiny SVG line chart -------
function ProgressChart({ data }) {
  const W = 760, H = 240, pad = { l: 50, r: 24, t: 24, b: 36 };
  const innerW = W - pad.l - pad.r;
  const innerH = H - pad.t - pad.b;

  const fatVals = data.map(d => d.fatPct);
  const muscleVals = data.map(d => d.muscle);
  const all = [...fatVals, ...muscleVals];
  const min = Math.floor(Math.min(...all) - 2);
  const max = Math.ceil(Math.max(...all) + 2);

  const x = i => pad.l + (i / (data.length - 1)) * innerW;
  const y = v => pad.t + (1 - (v - min) / (max - min)) * innerH;

  const line = vals => vals.map((v, i) => `${i ? "L" : "M"} ${x(i)} ${y(v)}`).join(" ");

  const lastFat = data[data.length - 1].fatPct;
  const firstFat = data[0].fatPct;
  const lastMuscle = data[data.length - 1].muscle;
  const firstMuscle = data[0].muscle;

  return (
    <div style={{
      background: "var(--paper)", borderRadius: "var(--r-lg)",
      border: "1px solid var(--hairline-strong)", padding: 24, boxShadow: "var(--sh-2)",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", marginBottom: 16, flexWrap: "wrap", gap: 12 }}>
        <div>
          <div className="mono" style={{ color: "var(--clay-600)", marginBottom: 6 }}>— Body composition · 5 months</div>
          <div style={{ fontFamily: "var(--f-display)", fontSize: 28, fontStyle: "italic", color: "var(--espresso-900)" }}>
            Steady, controlled trend
          </div>
        </div>
        <div style={{ display: "flex", gap: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 18, height: 2, background: "var(--walnut-700)" }} />
            <span className="mono" style={{ color: "var(--walnut-700)" }}>Fat %</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 18, height: 2, background: "var(--ochre-500)" }} />
            <span className="mono" style={{ color: "var(--clay-600)" }}>Muscle (kg)</span>
          </div>
        </div>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto", display: "block" }}>
        {/* Date labels */}
        {data.map((d, i) => (
          <text key={i} x={x(i)} y={H - 14} textAnchor="middle"
            fontFamily="var(--f-mono)" fontSize="10" fill="#8A6640" letterSpacing="1.2">
            {d.date.toUpperCase()}
          </text>
        ))}

        {/* Fat line */}
        <path d={line(fatVals)} fill="none" stroke="#5E4228" strokeWidth="2" />
        {fatVals.map((v, i) => (
          <circle key={"f"+i} cx={x(i)} cy={y(v)} r="4" fill="#FFFDF8" stroke="#5E4228" strokeWidth="2" />
        ))}

        {/* Muscle line */}
        <path d={line(muscleVals)} fill="none" stroke="#C99A3F" strokeWidth="2" />
        {muscleVals.map((v, i) => (
          <circle key={"m"+i} cx={x(i)} cy={y(v)} r="4" fill="#FFFDF8" stroke="#C99A3F" strokeWidth="2" />
        ))}

        {/* End-point value labels */}
        <text x={x(fatVals.length-1) + 10} y={y(lastFat) + 4}
          fontFamily="var(--f-mono)" fontSize="11" fill="#5E4228" fontWeight="600">
          {lastFat}%
        </text>
        <text x={x(muscleVals.length-1) + 10} y={y(lastMuscle) + 4}
          fontFamily="var(--f-mono)" fontSize="11" fill="#C99A3F" fontWeight="600">
          {lastMuscle}kg
        </text>
      </svg>

      {/* Stat chips */}
      <div style={{ display: "flex", gap: 12, marginTop: 16, flexWrap: "wrap", paddingTop: 16, borderTop: "1px solid var(--hairline)" }}>
        <StatChip label="Fat % delta" value={`${(lastFat - firstFat).toFixed(1)} pts`} dir="down" />
        <StatChip label="Muscle delta" value={`+${(lastMuscle - firstMuscle).toFixed(1)} kg`} dir="up" />
        <StatChip label="Sessions" value="8 of 16" dir="flat" />
        <StatChip label="Adherence" value="94%" dir="up" />
      </div>
    </div>
  );
}

function StatChip({ label, value, dir }) {
  const tone = dir === "up" ? { bg: "var(--sage-200)", fg: "var(--sage-500)" }
            : dir === "down" ? { bg: "var(--sage-200)", fg: "var(--sage-500)" }
            : { bg: "var(--sand-200)", fg: "var(--clay-600)" };
  return (
    <div style={{
      padding: "10px 14px", borderRadius: "var(--r-md)",
      background: "var(--sand-50)", border: "1px solid var(--hairline)",
      display: "flex", flexDirection: "column", gap: 4, minWidth: 120,
    }}>
      <span className="mono" style={{ color: "var(--clay-600)" }}>{label}</span>
      <span style={{ fontFamily: "var(--f-display)", fontSize: 22, fontStyle: "italic", color: "var(--espresso-900)" }}>{value}</span>
    </div>
  );
}

// ------- Progress tab -------
function ProgressTab() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 980 }}>
      <ProgressChart data={MEERA_BCA} />

      {/* Session log table */}
      <div style={{
        background: "var(--paper)", borderRadius: "var(--r-lg)",
        border: "1px solid var(--hairline-strong)", overflow: "hidden", boxShadow: "var(--sh-2)",
      }}>
        <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--hairline)" }}>
          <div className="mono" style={{ color: "var(--clay-600)", marginBottom: 4 }}>— Session log · last 4</div>
          <div style={{ fontFamily: "var(--f-display)", fontSize: 24, fontStyle: "italic", color: "var(--espresso-900)" }}>
            Recent sessions
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "100px 100px 1fr 130px",
          padding: "12px 24px", borderBottom: "1px solid var(--hairline)", background: "var(--sand-50)" }}>
          <span className="mono" style={{ color: "var(--clay-600)" }}>Date</span>
          <span className="mono" style={{ color: "var(--clay-600)" }}>Type</span>
          <span className="mono" style={{ color: "var(--clay-600)" }}>Coach note</span>
          <span className="mono" style={{ color: "var(--clay-600)" }}>Performance</span>
        </div>

        {MEERA_SESSIONS.map((s, i) => {
          const perfMeta = s.perf === "up"
            ? { arrow: "↑", bg: "var(--sage-200)", fg: "var(--sage-500)", label: "Trending up" }
            : s.perf === "down"
            ? { arrow: "↓", bg: "var(--terracotta-200)", fg: "var(--terracotta-500)", label: "Backed off" }
            : { arrow: "→", bg: "var(--sand-200)", fg: "var(--clay-600)", label: "Held" };
          return (
            <div key={i} style={{
              display: "grid", gridTemplateColumns: "100px 100px 1fr 130px",
              padding: "16px 24px", alignItems: "center", gap: 12,
              borderBottom: i < MEERA_SESSIONS.length - 1 ? "1px solid var(--hairline)" : "none",
            }}>
              <span className="mono" style={{ color: "var(--espresso-900)", fontWeight: 600 }}>{s.date}</span>
              <span className="mono" style={{
                display: "inline-flex", alignSelf: "start",
                background: "var(--sand-100)", color: "var(--walnut-700)",
                padding: "3px 10px", borderRadius: "var(--r-pill)",
                fontSize: 10, letterSpacing: 1.5, border: "1px solid var(--hairline)",
              }}>{s.type}</span>
              <span style={{ fontSize: 14, color: "var(--espresso-900)", lineHeight: 1.5 }}>{s.note}</span>
              <span className="mono" style={{
                display: "inline-flex", alignItems: "center", gap: 6, alignSelf: "start",
                background: perfMeta.bg, color: perfMeta.fg,
                padding: "4px 10px", borderRadius: "var(--r-pill)",
                fontSize: 10, letterSpacing: 1.5, fontWeight: 600,
              }}>
                <span style={{ fontSize: 12 }}>{perfMeta.arrow}</span>
                {perfMeta.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ------- Notes tab -------
function NotesTab({ client }) {
  const clientId = clientIdFor(client);

  // Notes feed: prefer localStorage; fall back to seed for first-time view.
  const [notes, setNotes] = cpUseState(() => {
    const stored = loadSessionNotes(clientId);
    return stored.length > 0 ? stored : MEERA_NOTES_SEED;
  });
  const [adding, setAdding] = cpUseState(false);
  const [draft, setDraft] = cpUseState({ date: "APR 20, 2026", type: "PT SESSION", body: "", tags: [] });

  function toggleTag(t) {
    setDraft(d => ({ ...d, tags: d.tags.includes(t) ? d.tags.filter(x => x !== t) : [...d.tags, t] }));
  }

  function post() {
    if (!draft.body.trim()) return;
    const today = new Date().toISOString().split('T')[0]; // ISO date for sorting; UI shows draft.date for display
    const note = {
      id: clientId + "_" + Date.now(),
      clientId, coachId: COACH_ID, coachName: COACH_NAME,
      date: today,
      displayDate: draft.date,
      sessionType: draft.type,
      text: draft.body,
      tags: draft.tags,
      hasMedia: false,
    };
    saveSessionNote(note);
    // Re-load from store, but keep seed rows visible until a real one exists.
    const stored = loadSessionNotes(clientId);
    setNotes(stored.length > 0 ? stored : MEERA_NOTES_SEED);
    setDraft({ date: "APR 20, 2026", type: "PT SESSION", body: "", tags: [] });
    setAdding(false);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14, maxWidth: 760 }}>
      {/* Add note card */}
      {!adding ? (
        <button onClick={() => setAdding(true)} style={{
          background: "transparent", border: "1px dashed var(--ochre-500)",
          borderRadius: "var(--r-lg)", padding: 24, cursor: "pointer",
          display: "flex", alignItems: "center", gap: 14,
          color: "var(--clay-600)", fontFamily: "var(--f-body)",
        }}>
          <span style={{
            width: 32, height: 32, borderRadius: "50%",
            background: "var(--ochre-500)", color: "var(--espresso-900)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18, fontWeight: 600, flexShrink: 0,
          }}>+</span>
          <span className="mono" style={{ color: "var(--walnut-700)" }}>Add session note</span>
        </button>
      ) : (
        <div style={{
          background: "var(--paper)", borderRadius: "var(--r-lg)",
          border: "1px solid var(--ochre-500)", padding: 24, boxShadow: "var(--sh-2)",
        }}>
          <div className="mono" style={{ color: "var(--clay-600)", marginBottom: 14 }}>— New session note</div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 12, marginBottom: 14 }}>
            <input value={draft.date} onChange={e => setDraft({ ...draft, date: e.target.value })}
              className="mono" style={{
              padding: "10px 14px", borderRadius: "var(--r-md)",
              background: "var(--sand-50)", border: "1px solid var(--hairline-strong)",
              fontFamily: "var(--f-mono)", fontSize: 11, letterSpacing: 1.5, color: "var(--espresso-900)",
              outline: "none", textTransform: "uppercase",
            }} />
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {["PT SESSION", "GROUP", "CHECK-IN"].map(t => {
                const active = draft.type === t;
                return (
                  <button key={t} onClick={() => setDraft({ ...draft, type: t })} className="mono" style={{
                    padding: "6px 14px", borderRadius: "var(--r-pill)",
                    border: "1px solid " + (active ? "var(--walnut-700)" : "var(--hairline-strong)"),
                    background: active ? "var(--walnut-700)" : "var(--paper)",
                    color: active ? "var(--paper)" : "var(--walnut-700)",
                    cursor: "pointer", fontSize: 10, letterSpacing: 1.5,
                  }}>{t}</button>
                );
              })}
            </div>
          </div>

          <textarea value={draft.body} onChange={e => setDraft({ ...draft, body: e.target.value })} rows={4}
            placeholder="What happened in this session? Cues, loads, observations…"
            style={{
              width: "100%", padding: "14px 16px", borderRadius: "var(--r-md)",
              background: "var(--paper)", border: "1px solid var(--hairline-strong)",
              fontFamily: "var(--f-body)", fontSize: 15, color: "var(--ink)",
              resize: "vertical", outline: "none", marginBottom: 14, lineHeight: 1.5,
            }} />

          <div className="mono" style={{ color: "var(--clay-600)", marginBottom: 8 }}>Tags</div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
            {ALL_TAGS.map(t => {
              const active = draft.tags.includes(t);
              return (
                <button key={t} onClick={() => toggleTag(t)} className="mono" style={{
                  padding: "5px 12px", borderRadius: "var(--r-pill)",
                  border: "1px solid " + (active ? "var(--walnut-700)" : "var(--hairline-strong)"),
                  background: active ? "var(--walnut-700)" : "var(--paper)",
                  color: active ? "var(--paper)" : "var(--walnut-700)",
                  cursor: "pointer", fontSize: 10, letterSpacing: 1.5,
                }}>{t}</button>
              );
            })}
          </div>

          <button style={{
            width: "100%", padding: "14px", borderRadius: "var(--r-md)",
            background: "var(--paper)", border: "1px dashed var(--ochre-500)",
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            gap: 10, color: "var(--clay-600)", fontFamily: "var(--f-body)", marginBottom: 16,
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 15a4 4 0 0 0 4 4h10a5 5 0 0 0 1.7-9.7 6 6 0 0 0-11.7-.5A4 4 0 0 0 3 13" />
              <path d="M12 12v7M9 15l3-3 3 3" />
            </svg>
            <span className="mono">Drag or tap to upload · image or video</span>
          </button>

          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <button onClick={() => { setAdding(false); setDraft({ date: "APR 20, 2026", type: "PT SESSION", body: "", tags: [] }); }} className="mono" style={{
              padding: "10px 16px", borderRadius: "var(--r-pill)",
              background: "transparent", border: "1px solid var(--hairline-strong)",
              color: "var(--clay-600)", cursor: "pointer", fontSize: 10, letterSpacing: 1.5,
            }}>Cancel</button>
            <button onClick={post} style={{
              padding: "10px 22px", borderRadius: "var(--r-pill)",
              background: "var(--walnut-700)", color: "var(--paper)", border: "none",
              cursor: "pointer", fontFamily: "var(--f-body)", fontSize: 13, fontWeight: 500,
            }}>Post note</button>
          </div>
        </div>
      )}

      {/* Note feed */}
      {notes.map(n => {
        // Support both shapes: stored notes (text/sessionType/displayDate) and seed notes (body/type/date)
        const body = n.text || n.body || '';
        const type = n.sessionType || n.type || 'PT SESSION';
        const displayDate = n.displayDate || (n.date && n.date.match(/^\d{4}-\d{2}-\d{2}$/)
          ? (() => {
              const [y, m, d] = n.date.split('-');
              const month = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'][parseInt(m,10)-1];
              return `${month} ${parseInt(d,10)}, ${y}`;
            })()
          : n.date);
        const tags = n.tags || [];
        const media = typeof n.media === 'number' ? n.media : 0;
        const fromCoach = n.coachName ? ` · ${n.coachName}` : '';
        return (
        <div key={n.id} style={{
          background: "var(--paper)", borderRadius: "var(--r-lg)",
          border: "1px solid var(--hairline)", padding: 24, boxShadow: "var(--sh-1)",
          position: "relative",
        }}>
          <button title="Edit note" style={{
            position: "absolute", top: 18, right: 18,
            width: 30, height: 30, borderRadius: "50%",
            background: "transparent", border: "1px solid var(--hairline)",
            cursor: "pointer", color: "var(--clay-600)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z" />
            </svg>
          </button>

          <div className="mono" style={{ color: "var(--clay-600)", marginBottom: 12 }}>
            {displayDate} · {type}{fromCoach}
          </div>
          <p style={{
            fontSize: 16, lineHeight: 1.55, color: "var(--espresso-900)", margin: "0 0 14px",
          }}>{body}</p>
          {tags.length > 0 && (
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {tags.map(t => (
                <span key={t} className="mono" style={{
                  padding: "3px 10px", borderRadius: "var(--r-pill)",
                  background: "var(--sand-100)", color: "var(--walnut-700)",
                  fontSize: 9, letterSpacing: 1.5, border: "1px solid var(--hairline)",
                }}>{t}</span>
              ))}
            </div>
          )}
          {media > 0 && (
            <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
              {Array.from({ length: media }).map((_, i) => (
                <div key={i} style={{
                  width: 84, height: 84, borderRadius: "var(--r-md)",
                  background: "var(--sand-200)", border: "1px solid var(--hairline)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "var(--clay-600)", fontFamily: "var(--f-mono)", fontSize: 9, letterSpacing: 1,
                }}>◱ MEDIA</div>
              ))}
            </div>
          )}
        </div>
        );
      })}
    </div>
  );
}

// ------- Nutrition tab (coach write view) -------
function NutritionCoachTab({ client }) {
  const clientId = clientIdFor(client);
  const clientName = (client && client.name) || 'Client';

  const [entries, setEntries] = cpUseState(() => loadNutritionForClient(clientId));
  const [showForm, setShowForm] = cpUseState(false);
  const [form, setForm] = cpUseState({
    calories: '', protein: '', carbs: '', fat: '', notes: '', tags: '', period: '',
  });

  const current = entries[0];

  function openEdit() {
    if (current) {
      setForm({
        calories: String(current.mealPlan?.calories ?? ''),
        protein:  String(current.mealPlan?.protein  ?? ''),
        carbs:    String(current.mealPlan?.carbs    ?? ''),
        fat:      String(current.mealPlan?.fat      ?? ''),
        notes:    current.notes || '',
        tags:     (current.tags || []).join(', '),
        period:   current.period || '',
      });
    }
    setShowForm(true);
  }

  function save() {
    const entry = {
      id: clientId + '_' + Date.now(),
      clientId, coachId: COACH_ID, coachName: COACH_NAME,
      date: new Date().toISOString().split('T')[0],
      period: form.period,
      mealPlan: {
        calories: parseInt(form.calories) || 0,
        protein:  parseInt(form.protein)  || 0,
        carbs:    parseInt(form.carbs)    || 0,
        fat:      parseInt(form.fat)      || 0,
      },
      notes: form.notes,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
    };
    saveNutritionEntry(entry);
    setEntries(loadNutritionForClient(clientId));
    setShowForm(false);
    setForm({ calories: '', protein: '', carbs: '', fat: '', notes: '', tags: '', period: '' });
  }

  const macroCell = {
    padding: 14, borderRadius: "var(--r-md)",
    background: "var(--sand-50)", border: "1px solid var(--hairline)",
    textAlign: "center",
  };
  const macroLabel = {
    fontFamily: "var(--f-mono)", fontSize: 9, letterSpacing: 1.5,
    textTransform: "uppercase", color: "var(--clay-600)", marginBottom: 6,
  };
  const macroValue = {
    fontFamily: "var(--f-display)", fontStyle: "italic", fontSize: 26,
    color: "var(--espresso-900)", lineHeight: 1,
  };

  const inputStyle = {
    width: "100%", padding: "10px 12px", borderRadius: "var(--r-md)",
    background: "var(--paper)", border: "1px solid var(--hairline-strong)",
    fontFamily: "var(--f-body)", fontSize: 14, color: "var(--espresso-900)",
    outline: "none", boxSizing: "border-box",
  };
  const fieldLabel = {
    fontFamily: "var(--f-mono)", fontSize: 9, letterSpacing: 1.5,
    textTransform: "uppercase", color: "var(--clay-600)", marginBottom: 6,
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14, maxWidth: 760 }}>
      {/* Current plan */}
      {current && (
        <div style={{
          background: "var(--paper)", borderRadius: "var(--r-lg)",
          border: "1px solid var(--hairline)", boxShadow: "var(--sh-1)",
          padding: 20,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14, gap: 12, flexWrap: "wrap" }}>
            <div>
              <div className="mono" style={{ color: "var(--clay-600)", marginBottom: 4 }}>
                Current plan
              </div>
              <div style={{
                fontFamily: "var(--f-display)", fontStyle: "italic", fontWeight: 400,
                fontSize: 22, color: "var(--espresso-900)", lineHeight: 1.2,
              }}>{current.period || '—'}</div>
            </div>
            <button onClick={openEdit} title="Edit plan" style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "6px 12px", borderRadius: "var(--r-pill)",
              background: "transparent", border: "1px solid var(--hairline-strong)",
              color: "var(--walnut-700)", cursor: "pointer",
              fontFamily: "var(--f-mono)", fontSize: 10, letterSpacing: 1.5,
            }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z" />
              </svg>
              Edit
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 14 }}>
            <div style={macroCell}>
              <div style={macroLabel}>Calories</div>
              <div style={macroValue}>{current.mealPlan?.calories ?? '—'}</div>
              <div className="mono" style={{ color: "var(--clay-600)", marginTop: 4, fontSize: 9 }}>kcal</div>
            </div>
            <div style={macroCell}>
              <div style={macroLabel}>Protein</div>
              <div style={macroValue}>{current.mealPlan?.protein ?? '—'}</div>
              <div className="mono" style={{ color: "var(--clay-600)", marginTop: 4, fontSize: 9 }}>g</div>
            </div>
            <div style={macroCell}>
              <div style={macroLabel}>Carbs</div>
              <div style={macroValue}>{current.mealPlan?.carbs ?? '—'}</div>
              <div className="mono" style={{ color: "var(--clay-600)", marginTop: 4, fontSize: 9 }}>g</div>
            </div>
            <div style={macroCell}>
              <div style={macroLabel}>Fat</div>
              <div style={macroValue}>{current.mealPlan?.fat ?? '—'}</div>
              <div className="mono" style={{ color: "var(--clay-600)", marginTop: 4, fontSize: 9 }}>g</div>
            </div>
          </div>

          {current.notes && (
            <div style={{
              padding: "12px 14px", background: "#FFF8EE",
              borderRadius: "var(--r-md)", border: "1px solid var(--hairline)",
              fontStyle: "italic", color: "var(--espresso-900)",
              fontSize: 14, lineHeight: 1.55,
            }}>"{current.notes}"</div>
          )}

          {current.tags && current.tags.length > 0 && (
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 12 }}>
              {current.tags.map(t => (
                <span key={t} className="mono" style={{
                  padding: "3px 10px", borderRadius: "var(--r-pill)",
                  background: "var(--sand-100)", color: "var(--walnut-700)",
                  fontSize: 9, letterSpacing: 1.5, border: "1px solid var(--hairline)",
                }}>{t}</span>
              ))}
            </div>
          )}

          <div className="mono" style={{ marginTop: 14, color: "var(--clay-600)", fontSize: 9 }}>
            Set {current.date} · {current.coachName || 'Coach'}
          </div>
        </div>
      )}

      {/* Set new plan button */}
      {!showForm && (
        <button onClick={() => { setForm({ calories: '', protein: '', carbs: '', fat: '', notes: '', tags: '', period: '' }); setShowForm(true); }}
          style={{
            background: "transparent", border: "1px dashed var(--ochre-500)",
            borderRadius: "var(--r-lg)", padding: 18, cursor: "pointer",
            display: "flex", alignItems: "center", gap: 14,
            color: "var(--clay-600)", fontFamily: "var(--f-body)",
          }}>
          <span style={{
            width: 32, height: 32, borderRadius: "50%",
            background: "var(--ochre-500)", color: "var(--espresso-900)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18, fontWeight: 600, flexShrink: 0,
          }}>+</span>
          <span className="mono" style={{ color: "var(--walnut-700)" }}>
            {current ? 'Set new nutrition plan' : 'Set first nutrition plan'}
          </span>
        </button>
      )}

      {/* New / edit form */}
      {showForm && (
        <div style={{
          background: "var(--paper)", borderRadius: "var(--r-lg)",
          border: "1px solid var(--ochre-500)", padding: 20, boxShadow: "var(--sh-2)",
        }}>
          <div className="mono" style={{ color: "var(--clay-600)", marginBottom: 16 }}>
            — Set nutrition plan for {clientName}
          </div>

          {/* Period */}
          <div style={{ marginBottom: 14 }}>
            <div style={fieldLabel}>Period</div>
            <input value={form.period} onChange={e => setForm({ ...form, period: e.target.value })}
              placeholder="e.g. Week 3 of 12" style={inputStyle} />
          </div>

          {/* Macros */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 14 }}>
            <div>
              <div style={fieldLabel}>Calories (kcal)</div>
              <input type="number" value={form.calories} onChange={e => setForm({ ...form, calories: e.target.value })}
                placeholder="1800" style={{ ...inputStyle, textAlign: "center" }} />
            </div>
            <div>
              <div style={fieldLabel}>Protein (g)</div>
              <input type="number" value={form.protein} onChange={e => setForm({ ...form, protein: e.target.value })}
                placeholder="140" style={{ ...inputStyle, textAlign: "center" }} />
            </div>
            <div>
              <div style={fieldLabel}>Carbs (g)</div>
              <input type="number" value={form.carbs} onChange={e => setForm({ ...form, carbs: e.target.value })}
                placeholder="160" style={{ ...inputStyle, textAlign: "center" }} />
            </div>
            <div>
              <div style={fieldLabel}>Fat (g)</div>
              <input type="number" value={form.fat} onChange={e => setForm({ ...form, fat: e.target.value })}
                placeholder="60" style={{ ...inputStyle, textAlign: "center" }} />
            </div>
          </div>

          {/* Coach note */}
          <div style={{ marginBottom: 14 }}>
            <div style={fieldLabel}>Coach note</div>
            <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })}
              rows={4} placeholder="Guidance, weekly focus, context…"
              style={{ ...inputStyle, resize: "vertical", lineHeight: 1.5 }} />
          </div>

          {/* Tags */}
          <div style={{ marginBottom: 16 }}>
            <div style={fieldLabel}>Tags (comma separated)</div>
            <input value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })}
              placeholder="Muscle Gain, High Protein, Week 3" style={inputStyle} />
          </div>

          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <button onClick={() => setShowForm(false)} className="mono" style={{
              padding: "10px 16px", borderRadius: "var(--r-pill)",
              background: "transparent", border: "1px solid var(--hairline-strong)",
              color: "var(--clay-600)", cursor: "pointer", fontSize: 10, letterSpacing: 1.5,
            }}>Cancel</button>
            <button onClick={save} style={{
              padding: "10px 22px", borderRadius: "var(--r-pill)",
              background: "var(--walnut-700)", color: "var(--paper)", border: "none",
              cursor: "pointer", fontFamily: "var(--f-body)", fontSize: 13, fontWeight: 500,
            }}>Save nutrition plan →</button>
          </div>
        </div>
      )}

      {/* History */}
      {entries.length > 1 && (
        <div style={{ marginTop: 12 }}>
          <div className="mono" style={{ color: "var(--clay-600)", marginBottom: 8 }}>
            — Previous plans
          </div>
          <div>
            {entries.slice(1).map((e, i) => (
              <div key={e.id} style={{
                display: "grid", gridTemplateColumns: "180px 1fr auto",
                gap: 14, alignItems: "center", padding: "12px 0",
                borderTop: `1px solid var(--hairline)`,
              }}>
                <div className="mono" style={{ color: "var(--clay-600)" }}>
                  {e.date} · {e.period || '—'}
                </div>
                <div style={{ fontFamily: "var(--f-body)", fontSize: 13, color: "var(--espresso-900)" }}>
                  {e.mealPlan?.calories ?? '—'} kcal · {e.mealPlan?.protein ?? '—'}g protein
                </div>
                <div className="mono" style={{ color: "var(--clay-600)", textAlign: "right" }}>
                  {e.coachName || '—'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ------- Top-level overlay -------
function ClientProfile({ client, onBack, readOnly, compact }) {
  const [tab, setTab] = cpUseState("assessment");

  // Pull live or seed profile via the data bridge in coach-universe.jsx
  const profileData = cpUseMemo(
    () => (window.loadClientProfile ? window.loadClientProfile(client.name) : null),
    [client.name]
  );
  const isLive = profileData && profileData.source === 'live';
  const sourceMeta = isLive
    ? { bg: "var(--sage-200)", fg: "var(--sage-500)", dot: "var(--sage-500)", label: "Live data" }
    : { bg: "var(--sand-100)", fg: "var(--clay-600)", dot: "var(--clay-600)", label: "Demo data" };

  return (
    <div>
      {/* Header bar */}
      <button onClick={onBack} style={{
        background: "transparent", border: "none", color: "var(--clay-600)",
        fontFamily: "var(--f-body)", fontSize: 14, cursor: "pointer",
        display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 20,
        padding: 0,
      }}>
        ← <span>My Clients</span>
      </button>

      <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 28, flexWrap: "wrap" }}>
        <CoachAvatar coach={{ initials: client.initials, tone: client.tone }} size={64} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="mono" style={{ color: "var(--clay-600)", marginBottom: 6 }}>
            — Client · {client.programme}
          </div>
          <h2 className="serif" style={{ fontSize: 44, margin: 0, color: "var(--espresso-900)", fontStyle: "italic" }}>
            {(profileData && profileData.name) || client.name}
          </h2>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <span className="mono" style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: sourceMeta.bg, color: sourceMeta.fg,
            padding: "6px 12px", borderRadius: "var(--r-pill)",
            border: "1px solid var(--hairline)", fontWeight: 600,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: sourceMeta.dot }} />
            {sourceMeta.label}
          </span>
          <span className="mono" style={{
            background: "var(--sand-100)", color: "var(--walnut-700)",
            padding: "8px 14px", borderRadius: "var(--r-pill)",
            border: "1px solid var(--hairline)",
          }}>Session {client.done} of {client.total}</span>
        </div>
      </div>

      <CPTabs tab={tab} setTab={setTab} />

      {tab === "assessment" && <AssessmentTab profileData={profileData} readOnly={readOnly} />}
      {tab === "progress"   && <ProgressTab />}
      {tab === "notes"      && <NotesTab client={client} />}
      {tab === "nutrition"  && <NutritionCoachTab client={client} />}
    </div>
  );
}

window.ClientProfile = ClientProfile;
