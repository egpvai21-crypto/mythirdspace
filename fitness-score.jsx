/* eslint-disable */
// M3S Fitness Score — shared module
// Loaded by profile.html, onboarding.html, coach-universe.html.
// Computes a 3-dimension score (Strength · Conditioning · Metabolic Health),
// renders gauge visualisation, and supports coach overrides + comments that
// flow back to the user's profile via localStorage('m3s.coachScoreOverrides').

const FS_OT = {
  sand50: '#FBF7F0', sand100: '#F5EDE0', sand200: '#EADBC4',
  paper: '#FFFDF8',
  clay500: '#A8825A', clay600: '#8A6640',
  walnut: '#5E4228', espresso800: '#3E2C1C', espresso900: '#241810',
  ochre: '#C99A3F', sage: '#7B8B6F', terra: '#B86B4B',
  ok: '#5E8A5E', warn: '#C97A3F', bad: '#B0463A',
  hairline: 'rgba(62,44,28,0.12)', hairlineStrong: 'rgba(62,44,28,0.22)',
  fDisplay: '"Instrument Serif", "Cormorant Garamond", Georgia, serif',
  fBody: '"Inter", system-ui, sans-serif',
  fMono: '"JetBrains Mono", ui-monospace, monospace',
};

// ─── Scoring logic ────────────────────────────────────────────────────────
function computeM3SScores(profile, bcaData, bloodData, mskData) {
  let strength = 5.0;
  if (profile.experience === '5+ years')    strength += 2.0;
  if (profile.experience === '2–5 years')   strength += 1.0;
  if (profile.experience === '6–24 months') strength += 0.0;
  if (profile.experience === '<6 months')   strength -= 1.0;
  if (profile.goal === 'Muscle Gain')       strength += 0.5;
  if (profile.goal === 'Strength')          strength += 0.8;
  if ((profile.daysPerWeek || 3) >= 4)      strength += 0.5;
  strength -= ((profile.injuries || []).length * 0.3);
  const mskPenalty = (mskData || [])
    .filter(m => m.status === 'Restricted' || m.status === 'Limited').length * 0.3;
  strength -= mskPenalty;
  strength = Math.min(10, Math.max(0, parseFloat(strength.toFixed(1))));

  let conditioning = 5.0;
  const [m5 = 30, s5 = 0] = (profile.running5k || '30:00').split(':').map(Number);
  const secs5k = m5 * 60 + s5;
  if (secs5k < 1380) conditioning += 2.5;
  else if (secs5k < 1620) conditioning += 1.5;
  else if (secs5k < 1860) conditioning += 0.5;
  else if (secs5k > 2100) conditioning -= 1.0;
  conditioning += (((profile.runRating || 5) - 5) * 0.3);
  if (profile.runFrequency === '4x / week')  conditioning += 1.0;
  if (profile.runFrequency === '3x / week')  conditioning += 0.6;
  if (profile.runFrequency === '2x / week')  conditioning += 0.2;
  if (profile.runFrequency === 'Never')      conditioning -= 1.0;
  conditioning = Math.min(10, Math.max(0, parseFloat(conditioning.toFixed(1))));

  let metabolic = 5.0;
  (bloodData || []).forEach(m => {
    if (m.status === 'Optimal' || m.status === 'Normal') metabolic += 0.3;
    if (m.status === 'High' || m.status === 'Low')       metabolic -= 0.4;
    if (m.status === 'Deficient')                        metabolic -= 0.7;
  });
  (bcaData || []).forEach(m => {
    if (m.accent === 'ok')   metabolic += 0.3;
    if (m.accent === 'warn') metabolic -= 0.3;
    if (m.accent === 'bad')  metabolic -= 0.5;
  });
  metabolic = Math.min(10, Math.max(0, parseFloat(metabolic.toFixed(1))));

  const overall = parseFloat(((strength + conditioning + metabolic) / 3).toFixed(1));
  return { overall, strength, conditioning, metabolic };
}

function m3sScoreLabel(n) {
  if (n >= 8.5) return 'Elite';
  if (n >= 7.0) return 'Advanced';
  if (n >= 5.5) return 'Intermediate';
  if (n >= 3.5) return 'Developing';
  return 'Foundation';
}

function m3sScoreReasons(dim, profile, bcaData, bloodData, mskData) {
  if (dim === 'strength') return [
    `Experience: ${profile.experience || 'not set'}`,
    `Training days: ${profile.daysPerWeek || '?'}× per week`,
    `Injuries: ${(profile.injuries || []).join(', ') || 'none'}`,
    `MSK flags: ${(mskData || []).filter(m =>
      m.status === 'Restricted' || m.status === 'Limited'
    ).map(m => m.area).join(', ') || 'none'}`,
  ];
  if (dim === 'conditioning') return [
    `5K time: ${profile.running5k || 'not set'}`,
    `2K time: ${profile.running2k || 'not set'}`,
    `Self-rating: ${profile.runRating || '?'}/10`,
    `Run frequency: ${profile.runFrequency || 'not set'}`,
  ];
  if (dim === 'metabolic') return [
    ...(bloodData || []).map(m => `${m.name}: ${m.value} ${m.unit} — ${m.status}`),
    ...(bcaData || []).map(m => `${m.label}: ${m.value} — ${m.range}`),
  ];
  return [];
}

// ─── Coach overrides (shared via localStorage) ────────────────────────────
const COACH_OVERRIDES_KEY = 'm3s.coachScoreOverrides';

function readCoachOverrides() {
  try {
    const raw = localStorage.getItem(COACH_OVERRIDES_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

function writeCoachOverrides(next) {
  try { localStorage.setItem(COACH_OVERRIDES_KEY, JSON.stringify(next)); } catch {}
  // Notify any other open views in same tab
  try { window.dispatchEvent(new CustomEvent('m3s:coach-overrides', { detail: next })); } catch {}
}

// Merge coach overrides into computed scores. Override value (if present) replaces the system score.
function applyCoachOverrides(systemScores, overrides) {
  const merged = { ...systemScores };
  let any = false;
  ['strength', 'conditioning', 'metabolic'].forEach(d => {
    if (overrides[d] && typeof overrides[d].value === 'number') {
      merged[d] = overrides[d].value;
      any = true;
    }
  });
  if (any) {
    merged.overall = parseFloat(((merged.strength + merged.conditioning + merged.metabolic) / 3).toFixed(1));
  }
  // Overall-only override
  if (overrides.overall && typeof overrides.overall.value === 'number') {
    merged.overall = overrides.overall.value;
  }
  return merged;
}

// ─── Gauge SVG ────────────────────────────────────────────────────────────
const DIM_COLOR = {
  overall: FS_OT.ochre,
  strength: '#D9863A',     // warm amber
  conditioning: '#8FA67A', // sage-green
  metabolic: '#C67358',    // terra
};

function M3SGauge({ value = 0, max = 10, size = 'lg', color = FS_OT.ochre, label, sublabel, overridden = false, dark = true }) {
  const dims = size === 'lg'
    ? { W: 280, H: 200, cx: 140, cy: 158, rInner: 100, rOuter: 128, numFont: 64, ticks: 56, tickW: 2.2, axisFont: 11 }
    : { W: 160, H: 116, cx: 80,  cy: 92,  rInner: 56,  rOuter: 74,  numFont: 32, ticks: 36, tickW: 1.6, axisFont: 9 };

  // Arc spans π (left) → 2π (right), sweeping through top
  const ang = (t) => Math.PI + t * Math.PI;
  const pct = Math.max(0, Math.min(1, value / max));
  const activeCount = Math.round(pct * dims.ticks);

  const trackColor = dark ? 'rgba(255,253,248,0.10)' : FS_OT.hairlineStrong;
  const numColor = dark ? FS_OT.paper : FS_OT.espresso900;
  const labelColor = dark ? 'rgba(255,253,248,0.6)' : FS_OT.clay600;
  const axisColor = dark ? 'rgba(255,253,248,0.45)' : FS_OT.clay600;

  // Numerals every 2 across the /10 scale (0, 2, 4, 6, 8, 10)
  const numerals = [0, 2, 4, 6, 8, 10];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', userSelect: 'none' }}>
      <svg viewBox={`0 0 ${dims.W} ${dims.H}`} width={dims.W} style={{ display: 'block', maxWidth: '100%', height: 'auto' }}>
        {/* Tick marks */}
        {Array.from({ length: dims.ticks }).map((_, i) => {
          const t = i / (dims.ticks - 1);
          const a = ang(t);
          const x1 = dims.cx + dims.rInner * Math.cos(a);
          const y1 = dims.cy + dims.rInner * Math.sin(a);
          const x2 = dims.cx + dims.rOuter * Math.cos(a);
          const y2 = dims.cy + dims.rOuter * Math.sin(a);
          const active = i < activeCount;
          // Subtle fade on inactive
          const stroke = active ? color : trackColor;
          // Active ticks slightly longer at the tip for visual weight
          const w = active ? dims.tickW : dims.tickW * 0.7;
          return (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={stroke} strokeWidth={w} strokeLinecap="round"
              opacity={active ? (0.55 + 0.45 * (i / dims.ticks)) : 1} />
          );
        })}

        {/* Axis numerals — outside the arc */}
        {numerals.map((n) => {
          const t = n / 10;
          const a = ang(t);
          const r = dims.rOuter + (size === 'lg' ? 18 : 12);
          const x = dims.cx + r * Math.cos(a);
          const y = dims.cy + r * Math.sin(a);
          return (
            <text key={n} x={x} y={y + 3} textAnchor="middle"
              style={{ fontFamily: FS_OT.fMono, fontSize: dims.axisFont, fill: axisColor, fontWeight: 500 }}>
              {n}
            </text>
          );
        })}

        {/* Center: big number */}
        <text x={dims.cx} y={dims.cy - (size === 'lg' ? 14 : 6)} textAnchor="middle"
          style={{
            fontFamily: FS_OT.fDisplay, fontStyle: 'italic',
            fontSize: dims.numFont, fill: numColor, fontWeight: 400,
            letterSpacing: -1,
          }}>
          {value.toFixed(1)}
        </text>
      </svg>

      {(label || sublabel) && (
        <div style={{ textAlign: 'center', marginTop: size === 'lg' ? -8 : -4 }}>
          {label && (
            <div style={{
              fontFamily: FS_OT.fBody, fontSize: size === 'lg' ? 15 : 12,
              fontWeight: 600, color: numColor, letterSpacing: 0.2,
            }}>{label}</div>
          )}
          {sublabel && (
            <div style={{
              fontFamily: FS_OT.fDisplay, fontStyle: 'italic',
              fontSize: size === 'lg' ? 16 : 13,
              color, marginTop: 2,
              display: 'inline-flex', alignItems: 'center', gap: 6,
            }}>
              {sublabel}
              {overridden && (
                <span title="Adjusted by your coach" style={{
                  fontFamily: FS_OT.fMono, fontSize: 8, letterSpacing: 1.2,
                  padding: '2px 6px', borderRadius: 3,
                  background: dark ? 'rgba(201,154,63,0.18)' : 'rgba(201,154,63,0.15)',
                  color: FS_OT.ochre, fontStyle: 'normal', textTransform: 'uppercase',
                }}>Coach</span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Coach override editor (per-dimension) ────────────────────────────────
function CoachOverrideEditor({ dim, systemValue, current, onSave, onClear }) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(current?.value ?? systemValue);
  const [comment, setComment] = React.useState(current?.comment ?? '');

  React.useEffect(() => {
    setValue(current?.value ?? systemValue);
    setComment(current?.comment ?? '');
  }, [current, systemValue, open]);

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} style={{
        fontFamily: FS_OT.fMono, fontSize: 9, letterSpacing: 1.4,
        padding: '6px 10px', borderRadius: 4, textTransform: 'uppercase',
        border: `1px solid ${FS_OT.hairlineStrong}`,
        background: 'transparent', color: FS_OT.walnut,
        cursor: 'pointer', fontWeight: 600,
      }}>
        {current ? '✎ Edit override' : '+ Coach override'}
      </button>
    );
  }
  return (
    <div style={{
      marginTop: 10, padding: 12, background: FS_OT.paper,
      border: `1px solid ${FS_OT.walnut}`, borderRadius: 8,
    }}>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 8 }}>
        <div style={{ fontFamily: FS_OT.fMono, fontSize: 9, letterSpacing: 1.4, color: FS_OT.clay600, textTransform: 'uppercase' }}>
          Override score
        </div>
        <input type="number" min="0" max="10" step="0.1"
          value={value} onChange={(e) => setValue(parseFloat(e.target.value))}
          style={{
            fontFamily: FS_OT.fMono, fontSize: 14, fontWeight: 600,
            padding: '6px 10px', width: 70, borderRadius: 6,
            border: `1px solid ${FS_OT.hairlineStrong}`, color: FS_OT.espresso900,
          }} />
        <div style={{ fontFamily: FS_OT.fMono, fontSize: 10, color: FS_OT.clay600 }}>
          / 10 · system: {systemValue}
        </div>
      </div>
      <textarea
        placeholder="Why? (clients see this comment on their profile)"
        value={comment} onChange={(e) => setComment(e.target.value)}
        rows={2}
        style={{
          width: '100%', boxSizing: 'border-box',
          fontFamily: FS_OT.fBody, fontSize: 13, lineHeight: 1.5,
          padding: '8px 10px', borderRadius: 6, resize: 'vertical',
          border: `1px solid ${FS_OT.hairlineStrong}`, color: FS_OT.espresso900,
          background: FS_OT.sand50,
        }} />
      <div style={{ display: 'flex', gap: 6, marginTop: 8, justifyContent: 'flex-end' }}>
        {current && (
          <button onClick={() => { onClear(); setOpen(false); }} style={miniBtn(false, true)}>
            Clear
          </button>
        )}
        <button onClick={() => setOpen(false)} style={miniBtn(false)}>Cancel</button>
        <button onClick={() => { onSave({ value, comment }); setOpen(false); }} style={miniBtn(true)}>
          Save override
        </button>
      </div>
    </div>
  );
}

const miniBtn = (primary, danger) => ({
  fontFamily: FS_OT.fBody, fontSize: 12, fontWeight: 600,
  padding: '6px 12px', borderRadius: 6,
  border: primary ? 'none' : `1px solid ${FS_OT.hairlineStrong}`,
  background: primary ? FS_OT.walnut : 'transparent',
  color: danger ? FS_OT.bad : (primary ? FS_OT.paper : FS_OT.espresso900),
  cursor: 'pointer',
});

// ─── Main section ─────────────────────────────────────────────────────────
function FitnessScoreSection({ profile = {}, coachEditable = false }) {
  // Hardcoded BCA/Blood/MSK data — same values referenced across profile + onboarding
  const bcaData = [
    { label: 'Body fat',     value: '24.8%',   range: 'Slightly high',  accent: FS_OT.warn },
    { label: 'Muscle mass',  value: '49.2 kg', range: 'On track',       accent: FS_OT.ok },
    { label: 'Visceral fat', value: '8',       range: 'Healthy',        accent: FS_OT.ok },
    { label: 'Metabolic age',value: '34',      range: '2 yrs above',    accent: FS_OT.warn },
  ];
  const bloodData = [
    { name: 'Vit D',    value: '18',  unit: 'ng/mL', status: 'Deficient' },
    { name: 'LDL',      value: '148', unit: 'mg/dL', status: 'High' },
    { name: 'HbA1c',    value: '5.3', unit: '%',     status: 'Optimal' },
    { name: 'Ferritin', value: '52',  unit: 'ng/mL', status: 'Optimal' },
    { name: 'TSH',      value: '2.1', unit: 'mIU/L', status: 'Normal' },
  ];
  const mskData = [
    { area: 'Shoulders', status: 'Restricted' },
    { area: 'Hips',      status: 'Tight' },
    { area: 'Thoracic',  status: 'Limited' },
    { area: 'Knees',     status: 'Cleared' },
    { area: 'Lower back',status: 'Cleared' },
  ];

  const [overrides, setOverrides] = React.useState(readCoachOverrides);
  const [expanded, setExpanded] = React.useState(null);

  React.useEffect(() => {
    const onUpdate = () => setOverrides(readCoachOverrides());
    const onStorage = (e) => { if (e.key === COACH_OVERRIDES_KEY) setOverrides(readCoachOverrides()); };
    window.addEventListener('m3s:coach-overrides', onUpdate);
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener('m3s:coach-overrides', onUpdate);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  const systemScores = computeM3SScores(profile, bcaData, bloodData, mskData);
  const scores = applyCoachOverrides(systemScores, overrides);

  function saveOverride(dim, payload) {
    const next = { ...overrides, [dim]: payload };
    setOverrides(next);
    writeCoachOverrides(next);
  }
  function clearOverride(dim) {
    const next = { ...overrides };
    delete next[dim];
    setOverrides(next);
    writeCoachOverrides(next);
  }

  const dims = ['strength', 'conditioning', 'metabolic'];
  const dimLabels = { strength: 'Strength', conditioning: 'Conditioning', metabolic: 'Metabolic' };

  return (
    <div style={{
      background: FS_OT.espresso900, color: FS_OT.paper,
      borderRadius: 18, padding: '24px 26px 22px',
      boxShadow: '0 20px 50px -20px rgba(62,44,28,0.35)',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Soft accent halo */}
      <div style={{
        position: 'absolute', top: -90, left: '50%', transform: 'translateX(-50%)',
        width: 360, height: 360, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(201,154,63,0.18), transparent 60%)',
        pointerEvents: 'none',
      }} />

      {/* Header label */}
      <div style={{ position: 'relative', textAlign: 'center', marginBottom: 6 }}>
        <div style={{
          fontFamily: FS_OT.fMono, fontSize: 10, letterSpacing: 2,
          color: 'rgba(255,253,248,0.55)', textTransform: 'uppercase', fontWeight: 500,
        }}>M3S Fitness Score</div>
      </div>

      {/* Overall — hero gauge */}
      <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', marginTop: 8 }}>
        <M3SGauge
          value={scores.overall} max={10} size="lg"
          color={DIM_COLOR.overall}
          label="Fitness Level"
          sublabel={m3sScoreLabel(scores.overall)}
          overridden={!!overrides.overall}
          dark
        />
      </div>

      {/* Coach override for overall (coach-only) */}
      {coachEditable && (
        <div style={{
          position: 'relative', marginTop: 14, padding: '12px 14px',
          background: 'rgba(255,253,248,0.06)', borderRadius: 10,
          border: `1px solid rgba(255,253,248,0.12)`,
        }}>
          <div style={{
            fontFamily: FS_OT.fMono, fontSize: 9, letterSpacing: 1.5,
            color: 'rgba(255,253,248,0.6)', textTransform: 'uppercase', marginBottom: 8,
          }}>Coach input · overall</div>
          <CoachOverrideOnDark
            current={overrides.overall} systemValue={systemScores.overall}
            onSave={(v) => saveOverride('overall', v)}
            onClear={() => clearOverride('overall')} />
        </div>
      )}

      {/* Per-dimension gauges */}
      <div style={{
        position: 'relative', marginTop: 22,
        display: 'flex', gap: 14, justifyContent: 'space-around', alignItems: 'flex-start',
        paddingTop: 18, borderTop: '1px solid rgba(255,253,248,0.08)',
        flexWrap: 'wrap',
      }}>
        {dims.map(d => (
          <div key={d} style={{ flex: '1 1 140px', minWidth: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <M3SGauge
              value={scores[d]} max={10} size="sm"
              color={DIM_COLOR[d]}
              label={dimLabels[d]}
              sublabel={m3sScoreLabel(scores[d])}
              overridden={!!overrides[d]}
              dark
            />
            <button
              onClick={() => setExpanded(expanded === d ? null : d)}
              style={{
                background: expanded === d ? 'rgba(255,253,248,0.10)' : 'transparent',
                border: `1px solid rgba(255,253,248,${expanded === d ? '0.22' : '0.14'})`,
                borderRadius: 999, padding: '5px 12px',
                fontFamily: FS_OT.fMono, fontSize: 8.5, letterSpacing: 1.3,
                color: 'rgba(255,253,248,0.75)', cursor: 'pointer',
                textTransform: 'uppercase', fontWeight: 600,
              }}>
              {expanded === d ? 'Hide breakdown ↑' : 'See breakdown ↓'}
            </button>
          </div>
        ))}
      </div>

      {/* Drill-down panel */}
      {expanded && (
        <div style={{
          position: 'relative', marginTop: 16, padding: '14px 16px',
          background: 'rgba(255,253,248,0.05)', borderRadius: 10,
          border: '1px solid rgba(255,253,248,0.10)',
        }}>
          <div style={{
            fontFamily: FS_OT.fMono, fontSize: 9, letterSpacing: 1.6,
            color: 'rgba(255,253,248,0.55)', textTransform: 'uppercase', marginBottom: 10,
          }}>
            Why {dimLabels[expanded]} is {scores[expanded]}/10
          </div>

          {/* Reasons */}
          {m3sScoreReasons(expanded, profile, bcaData, bloodData, mskData).map((r, i) => (
            <div key={i} style={{
              padding: '7px 0',
              borderTop: i === 0 ? 'none' : '1px solid rgba(255,253,248,0.08)',
              fontFamily: FS_OT.fBody, fontSize: 13, color: 'rgba(255,253,248,0.85)',
              lineHeight: 1.5,
            }}>{r}</div>
          ))}

          {/* Coach comment row */}
          <div style={{
            padding: '10px 12px', marginTop: 10, borderRadius: 8,
            background: overrides[expanded]
              ? 'rgba(201,154,63,0.12)' : 'rgba(255,253,248,0.04)',
            border: `1px solid ${overrides[expanded] ? 'rgba(201,154,63,0.35)' : 'rgba(255,253,248,0.08)'}`,
          }}>
            <div style={{
              fontFamily: FS_OT.fMono, fontSize: 8.5, letterSpacing: 1.4,
              color: overrides[expanded] ? FS_OT.ochre : 'rgba(255,253,248,0.5)',
              textTransform: 'uppercase', marginBottom: 6, fontWeight: 600,
            }}>
              Coach input · {expanded}
            </div>
            {overrides[expanded] ? (
              <>
                <div style={{
                  fontFamily: FS_OT.fBody, fontSize: 13, color: FS_OT.paper,
                  lineHeight: 1.55, fontStyle: overrides[expanded].comment ? 'normal' : 'italic',
                }}>
                  {overrides[expanded].comment || 'Coach adjusted score without comment.'}
                </div>
                <div style={{
                  marginTop: 6, fontFamily: FS_OT.fMono, fontSize: 9,
                  letterSpacing: 1.2, color: 'rgba(255,253,248,0.55)',
                }}>
                  ADJUSTED · system was {systemScores[expanded]}/10
                </div>
              </>
            ) : (
              <div style={{
                fontFamily: FS_OT.fBody, fontStyle: 'italic', fontSize: 13,
                color: 'rgba(255,253,248,0.55)', lineHeight: 1.5,
              }}>
                {coachEditable
                  ? 'No coach override yet — add one below.'
                  : 'No coach comment yet — request a review at your next session.'}
              </div>
            )}

            {coachEditable && (
              <div style={{ marginTop: 10 }}>
                <CoachOverrideOnDark
                  current={overrides[expanded]} systemValue={systemScores[expanded]}
                  onSave={(v) => saveOverride(expanded, v)}
                  onClear={() => clearOverride(expanded)} />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer note */}
      <div style={{
        position: 'relative', marginTop: 16, paddingTop: 14,
        borderTop: '1px solid rgba(255,253,248,0.08)',
        fontFamily: FS_OT.fBody, fontSize: 12, color: 'rgba(255,253,248,0.6)',
        lineHeight: 1.5, textAlign: 'center',
      }}>
        {coachEditable
          ? <>Adjust any dimension if the system score doesn{'\u2019'}t reflect what you{'\u2019'}re seeing in person — your client{'\u2019'}s profile updates live.</>
          : <>Calculated from your BCA, blood panel, MSK assessment &amp; running data. <strong style={{ color: FS_OT.ochre, fontWeight: 600 }}>Coach input</strong> can override any dimension.</>}
      </div>
    </div>
  );
}

// ─── Coach override editor (dark variant, used inside dark card) ──────────
function CoachOverrideOnDark({ current, systemValue, onSave, onClear }) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(current?.value ?? systemValue);
  const [comment, setComment] = React.useState(current?.comment ?? '');

  React.useEffect(() => {
    setValue(current?.value ?? systemValue);
    setComment(current?.comment ?? '');
  }, [current, systemValue, open]);

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} style={{
        fontFamily: FS_OT.fMono, fontSize: 9, letterSpacing: 1.4,
        padding: '7px 12px', borderRadius: 4, textTransform: 'uppercase',
        border: '1px solid rgba(255,253,248,0.28)',
        background: 'transparent', color: FS_OT.ochre,
        cursor: 'pointer', fontWeight: 600,
      }}>
        {current ? '✎ Edit override' : '+ Add coach override'}
      </button>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 8, flexWrap: 'wrap' }}>
        <div style={{
          fontFamily: FS_OT.fMono, fontSize: 9, letterSpacing: 1.4,
          color: 'rgba(255,253,248,0.7)', textTransform: 'uppercase',
        }}>Override</div>
        <input type="number" min="0" max="10" step="0.1"
          value={value} onChange={(e) => setValue(parseFloat(e.target.value) || 0)}
          style={{
            fontFamily: FS_OT.fMono, fontSize: 14, fontWeight: 600,
            padding: '6px 10px', width: 80, borderRadius: 6,
            border: '1px solid rgba(255,253,248,0.25)',
            background: 'rgba(0,0,0,0.25)', color: FS_OT.paper,
          }} />
        <div style={{ fontFamily: FS_OT.fMono, fontSize: 10, color: 'rgba(255,253,248,0.5)' }}>
          / 10 · system: {systemValue}
        </div>
      </div>
      <textarea
        placeholder="Why? (your client sees this on their profile)"
        value={comment} onChange={(e) => setComment(e.target.value)}
        rows={2}
        style={{
          width: '100%', boxSizing: 'border-box',
          fontFamily: FS_OT.fBody, fontSize: 13, lineHeight: 1.5,
          padding: '8px 10px', borderRadius: 6, resize: 'vertical',
          border: '1px solid rgba(255,253,248,0.20)',
          background: 'rgba(0,0,0,0.25)', color: FS_OT.paper,
        }} />
      <div style={{ display: 'flex', gap: 6, marginTop: 8, justifyContent: 'flex-end' }}>
        {current && (
          <button onClick={() => { onClear(); setOpen(false); }} style={{
            fontFamily: FS_OT.fBody, fontSize: 12, fontWeight: 600,
            padding: '6px 12px', borderRadius: 6,
            border: '1px solid rgba(176,70,58,0.5)', background: 'transparent',
            color: FS_OT.bad, cursor: 'pointer',
          }}>Clear</button>
        )}
        <button onClick={() => setOpen(false)} style={{
          fontFamily: FS_OT.fBody, fontSize: 12, fontWeight: 600,
          padding: '6px 12px', borderRadius: 6,
          border: '1px solid rgba(255,253,248,0.25)', background: 'transparent',
          color: FS_OT.paper, cursor: 'pointer',
        }}>Cancel</button>
        <button onClick={() => { onSave({ value, comment }); setOpen(false); }} style={{
          fontFamily: FS_OT.fBody, fontSize: 12, fontWeight: 600,
          padding: '6px 12px', borderRadius: 6, border: 'none',
          background: FS_OT.ochre, color: FS_OT.espresso900, cursor: 'pointer',
        }}>Save</button>
      </div>
    </div>
  );
}

// Expose
Object.assign(window, {
  computeM3SScores, m3sScoreLabel, m3sScoreReasons,
  readCoachOverrides, writeCoachOverrides, applyCoachOverrides,
  M3SGauge, FitnessScoreSection,
});
