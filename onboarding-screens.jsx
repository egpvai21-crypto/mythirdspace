/* eslint-disable */
// Session A — M3S Client App
// 3 screens × 2 breakpoints, presented on a DesignCanvas

// ─── Shared tokens (pulled from tokens.css for inline use) ────────────────
const T = {
  sand50:  '#FBF7F0',
  sand100: '#F5EDE0',
  sand200: '#EADBC4',
  sand300: '#D9C3A3',
  paper:   '#FFFDF8',
  ink:     '#1C140E',
  clay500: '#A8825A',
  clay600: '#8A6640',
  walnut:  '#5E4228',
  espresso800: '#3E2C1C',
  espresso900: '#241810',
  ochre:   '#C99A3F',
  sage:    '#7B8B6F',
  terra:   '#B86B4B',
  hairline:       'rgba(62,44,28,0.12)',
  hairlineStrong: 'rgba(62,44,28,0.22)',
  fDisplay: '"Instrument Serif", "Cormorant Garamond", Georgia, serif',
  fBody:    '"Inter", system-ui, sans-serif',
  fMono:    '"JetBrains Mono", ui-monospace, monospace',
  sh1: '0 1px 2px rgba(62,44,28,0.06)',
  sh2: '0 6px 20px -8px rgba(62,44,28,0.18)',
  sh3: '0 20px 50px -20px rgba(62,44,28,0.35)',
};

// ─── Primitives ───────────────────────────────────────────────────────────
const Eyebrow = ({ children, dotColor = T.walnut, size = 11, color = T.clay600 }) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: 8,
    fontFamily: T.fMono, fontSize: size, letterSpacing: 1.8,
    textTransform: 'uppercase', color, fontWeight: 500,
  }}>
    <span style={{ width: 6, height: 6, borderRadius: 999, background: dotColor, display: 'inline-block', flexShrink: 0 }} />
    <span>{children}</span>
  </div>
);

const MonoLabel = ({ children, size = 10, color = T.clay600, style = {} }) => (
  <div style={{
    fontFamily: T.fMono, fontSize: size, letterSpacing: 1.5,
    textTransform: 'uppercase', color, fontWeight: 500, ...style,
  }}>{children}</div>
);

const PillBtn = ({ children, primary, full, small, style = {}, onClick }) => (
  <button onClick={onClick} style={{
    fontFamily: T.fBody, fontSize: small ? 13 : 14, fontWeight: 600,
    padding: small ? '10px 18px' : '14px 28px',
    borderRadius: 999,
    border: primary ? 'none' : `1px solid ${T.hairlineStrong}`,
    background: primary ? T.walnut : 'transparent',
    color: primary ? T.paper : T.walnut,
    cursor: 'pointer',
    width: full ? '100%' : 'auto',
    boxShadow: primary ? T.sh2 : 'none',
    letterSpacing: 0.1,
    ...style,
  }}>{children}</button>
);

const Chip = ({ children, selected, accent = T.walnut, onClick, style = {} }) => (
  <button onClick={onClick} style={{
    fontFamily: T.fBody, fontSize: 13, fontWeight: 600,
    padding: '9px 16px', borderRadius: 999,
    border: selected ? 'none' : `1px solid ${T.hairlineStrong}`,
    background: selected ? accent : T.sand100,
    color: selected ? T.paper : T.clay600,
    cursor: 'pointer', whiteSpace: 'nowrap',
    transition: 'all .12s',
    ...style,
  }}>{children}</button>
);

// ─── Icons ────────────────────────────────────────────────────────────────
const Icon = {
  home: (size = 24, c = 'currentColor') => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 11l9-7 9 7v9a2 2 0 01-2 2h-4v-7H9v7H5a2 2 0 01-2-2v-9z"/>
    </svg>
  ),
  plan: (size = 24, c = 'currentColor') => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="16" rx="2"/>
      <path d="M3 9h18M8 3v4M16 3v4"/>
    </svg>
  ),
  progress: (size = 24, c = 'currentColor') => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 20h18M6 16V11M11 16V6M16 16v-7M21 16v-3"/>
    </svg>
  ),
  messages: (size = 24, c = 'currentColor') => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12a8 8 0 01-11.6 7.1L4 20l1-4.5A8 8 0 1121 12z"/>
    </svg>
  ),
  arrow: (size = 14, c = 'currentColor') => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M13 6l6 6-6 6"/>
    </svg>
  ),
};

// ─── Bottom nav (mobile + desktop variants) ───────────────────────────────
const NAV_TABS = [
  { id: 'home',      label: 'Home',      icon: Icon.home },
  { id: 'plan',      label: 'Plan',      icon: Icon.plan },
  { id: 'progress',  label: 'Progress',  icon: Icon.progress },
  { id: 'messages',  label: 'Messages',  icon: Icon.messages },
];

function BottomNavMobile({ active }) {
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0,
      background: T.paper, borderTop: `1px solid ${T.hairline}`,
      boxShadow: '0 -4px 16px rgba(62,44,28,0.08)',
      display: 'flex', flexDirection: 'row', alignItems: 'stretch',
      paddingTop: 8, paddingBottom: 22, // safe-area for home indicator
      zIndex: 5,
    }}>
      {NAV_TABS.map((tab) => {
        const isActive = tab.id === active;
        const color = isActive ? T.walnut : T.clay600;
        return (
          <div key={tab.id} style={{
            flex: 1, minWidth: 0,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            gap: 4, padding: '6px 0', position: 'relative',
            opacity: isActive ? 1 : 0.6,
          }}>
            {isActive && (
              <div style={{
                position: 'absolute', top: 0, width: 24, height: 2,
                background: T.walnut, borderRadius: 2,
              }} />
            )}
            <div style={{ color }}>{tab.icon(24, color)}</div>
            <div style={{
              fontFamily: T.fMono, fontSize: 9, letterSpacing: 1.5,
              textTransform: 'uppercase', color, fontWeight: 500,
            }}>{tab.label}</div>
          </div>
        );
      })}
    </div>
  );
}

function BottomNavDesktop({ active }) {
  return (
    <div style={{
      position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)',
      width: 480, height: 72,
      background: T.paper,
      borderTopLeftRadius: 24, borderTopRightRadius: 24,
      borderBottomLeftRadius: 24, borderBottomRightRadius: 24,
      border: `1px solid ${T.hairline}`,
      boxShadow: T.sh3,
      display: 'flex', flexDirection: 'row', alignItems: 'center',
      zIndex: 5,
    }}>
      {NAV_TABS.map((tab) => {
        const isActive = tab.id === active;
        const color = isActive ? T.walnut : T.clay600;
        return (
          <div key={tab.id} style={{
            flex: 1, minWidth: 0,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            gap: 5, padding: '6px 0', position: 'relative',
            opacity: isActive ? 1 : 0.6,
          }}>
            {isActive && (
              <div style={{
                position: 'absolute', top: -1, width: 30, height: 2,
                background: T.walnut, borderRadius: 2,
              }} />
            )}
            <div style={{ color }}>{tab.icon(26, color)}</div>
            <div style={{
              fontFamily: T.fMono, fontSize: 10, letterSpacing: 1.6,
              textTransform: 'uppercase', color, fontWeight: 500,
            }}>{tab.label}</div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Frames ───────────────────────────────────────────────────────────────
function PhoneFrame({ children, time = '9:41' }) {
  return (
    <div style={{
      width: 375, height: 812, position: 'relative',
      background: T.sand50, overflow: 'hidden',
      borderRadius: 0, // canvas card already provides bezel
      fontFamily: T.fBody,
    }}>
      {/* iOS status bar */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 44,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 24px 0', zIndex: 10,
      }}>
        <span style={{
          fontFamily: '-apple-system, system-ui', fontSize: 15, fontWeight: 600,
          color: T.ink, letterSpacing: -0.2,
        }}>{time}</span>
        <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
          <svg width="17" height="11" viewBox="0 0 17 11"><rect x="0" y="6" width="3" height="4" rx="0.6" fill={T.ink}/><rect x="4.5" y="4" width="3" height="6" rx="0.6" fill={T.ink}/><rect x="9" y="2" width="3" height="8" rx="0.6" fill={T.ink}/><rect x="13.5" y="0" width="3" height="10" rx="0.6" fill={T.ink}/></svg>
          <svg width="15" height="11" viewBox="0 0 15 11"><path d="M7.5 2.5C9.5 2.5 11.3 3.3 12.6 4.6L13.5 3.7C12 2.2 9.9 1.2 7.5 1.2C5.1 1.2 3 2.2 1.5 3.7L2.4 4.6C3.7 3.3 5.5 2.5 7.5 2.5Z" fill={T.ink}/><circle cx="7.5" cy="9" r="1.2" fill={T.ink}/></svg>
          <svg width="24" height="11" viewBox="0 0 24 11"><rect x="0.5" y="0.5" width="20" height="10" rx="2.5" stroke={T.ink} strokeOpacity="0.4" fill="none"/><rect x="2" y="2" width="17" height="7" rx="1" fill={T.ink}/></svg>
        </div>
      </div>
      {/* content */}
      <div style={{ position: 'absolute', inset: 0, paddingTop: 44, paddingBottom: 0 }}>
        {children}
      </div>
      {/* home indicator */}
      <div style={{
        position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)',
        width: 134, height: 5, borderRadius: 3, background: T.ink, opacity: 0.5, zIndex: 20,
      }} />
    </div>
  );
}

function BrowserFrame({ children, url = 'app.mythirdspace.in' }) {
  return (
    <div style={{
      width: 1280, height: 800, background: T.paper,
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
      fontFamily: T.fBody,
    }}>
      {/* chrome */}
      <div style={{
        height: 36, background: '#ECE6DA',
        display: 'flex', alignItems: 'center', padding: '0 14px',
        borderBottom: `1px solid ${T.hairline}`, gap: 14, flexShrink: 0,
      }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{ width: 11, height: 11, borderRadius: '50%', background: '#E07A5F' }} />
          <div style={{ width: 11, height: 11, borderRadius: '50%', background: '#E0B85F' }} />
          <div style={{ width: 11, height: 11, borderRadius: '50%', background: '#7B8B6F' }} />
        </div>
        <div style={{
          flex: 1, maxWidth: 420, height: 22, borderRadius: 6,
          background: T.paper, border: `1px solid ${T.hairline}`,
          margin: '0 auto', display: 'flex', alignItems: 'center', padding: '0 10px',
          fontFamily: T.fMono, fontSize: 11, color: T.clay600,
          letterSpacing: 0.3,
        }}>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke={T.clay600} strokeWidth="1.2" style={{ marginRight: 6 }}>
            <rect x="2" y="4" width="6" height="5" rx="1"/><path d="M3.5 4V3a1.5 1.5 0 013 0v1"/>
          </svg>
          {url}
        </div>
        <div style={{ width: 60 }} />
      </div>
      {/* content */}
      <div style={{ flex: 1, overflow: 'hidden', position: 'relative', background: T.sand50 }}>
        {children}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// SCREEN 1 — ONBOARDING STEP 2 OF 5
// ═══════════════════════════════════════════════════════════════════════════

function OnboardingProgress({ step = 2, total = 5, width = '100%' }) {
  return (
    <div style={{ width, display: 'flex', gap: 6 }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{
          flex: 1, height: 3, borderRadius: 999,
          background: i < step ? T.walnut : T.sand200,
        }} />
      ))}
    </div>
  );
}

function Wordmark({ size = 'md' }) {
  const fs = size === 'lg' ? 22 : 18;
  return (
    <div style={{
      fontFamily: T.fDisplay, fontSize: fs, fontStyle: 'italic',
      color: T.walnut, letterSpacing: -0.3, lineHeight: 1,
    }}>
      M3S<span style={{ color: T.clay500, fontStyle: 'normal' }}>·</span>
      <span style={{ fontFamily: T.fMono, fontSize: 10, letterSpacing: 2,
        color: T.clay600, fontStyle: 'normal', marginLeft: 6, textTransform: 'uppercase',
      }}>My Third Space</span>
    </div>
  );
}

const TRAIN_DURATION = ['< 6 months', '6–24 months', '2–5 years', '5+ years'];
const PRIMARY_GOALS  = ['Fat Loss', 'Muscle Gain', 'Performance', 'Injury Rehab', 'General Fitness'];
const INJURY_TAGS    = ['Lower back', 'Knee', 'Shoulder', 'Hip', 'None'];

function OnboardingFields({ compact = false }) {
  const labelGap = compact ? 10 : 14;
  const sectionGap = compact ? 22 : 32;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: sectionGap }}>
      {/* Field 1 — duration */}
      <div>
        <MonoLabel style={{ marginBottom: labelGap }}>How long have you been training?</MonoLabel>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {TRAIN_DURATION.map((d, i) => (
            <Chip key={d} selected={i === 1}>{d}</Chip>
          ))}
        </div>
      </div>

      {/* Field 2 — goal */}
      <div>
        <MonoLabel style={{ marginBottom: labelGap }}>Primary goal</MonoLabel>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {PRIMARY_GOALS.map((g, i) => (
            <Chip key={g} selected={i === 2}>{g}</Chip>
          ))}
        </div>
      </div>

      {/* Field 3 — injuries */}
      <div>
        <MonoLabel style={{ marginBottom: labelGap }}>Injuries or limitations</MonoLabel>
        <div style={{
          background: T.paper, border: `1px solid ${T.hairlineStrong}`,
          borderRadius: 10, padding: '12px 14px',
          minHeight: 64,
          fontFamily: T.fBody, fontSize: 14, color: T.ink, lineHeight: 1.5,
        }}>
          Right shoulder gets cranky on overhead presses — avoid since 2024.
          <span style={{ color: T.clay600, opacity: 0.5 }}> &nbsp;|</span>
        </div>
        <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginTop: 10 }}>
          {INJURY_TAGS.map((tag) => {
            const isSel = tag === 'Shoulder';
            return (
              <button key={tag} style={{
                fontFamily: T.fBody, fontSize: 12, fontWeight: 600,
                padding: '6px 12px', borderRadius: 999,
                border: `1px solid ${isSel ? T.walnut : T.hairlineStrong}`,
                background: isSel ? T.walnut : 'transparent',
                color: isSel ? T.paper : T.clay600,
                cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 5,
              }}>
                {!isSel && <span style={{ fontWeight: 400, fontSize: 13, lineHeight: 1, marginRight: -1 }}>+</span>}
                {tag}
                {isSel && <span style={{ fontWeight: 400, fontSize: 11, opacity: 0.7 }}>×</span>}
              </button>
            );
          })}
        </div>
        <div style={{
          fontFamily: T.fBody, fontSize: 12, color: T.clay600,
          marginTop: 10, lineHeight: 1.5,
        }}>
          Adding tags helps your coach plan safer sessions.
        </div>
      </div>

      {/* Field 4 — stepper */}
      <div>
        <MonoLabel style={{ marginBottom: labelGap }}>Training days per week</MonoLabel>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 0,
          background: T.paper, border: `1px solid ${T.hairlineStrong}`,
          borderRadius: 10, overflow: 'hidden',
        }}>
          <button style={{
            width: 44, height: 44, border: 'none', background: 'transparent',
            color: T.walnut, fontSize: 18, cursor: 'pointer',
          }}>−</button>
          <div style={{
            width: 56, textAlign: 'center', fontFamily: T.fDisplay,
            fontSize: 24, color: T.walnut, fontStyle: 'normal',
          }}>3</div>
          <button style={{
            width: 44, height: 44, border: 'none', background: 'transparent',
            color: T.walnut, fontSize: 18, cursor: 'pointer',
          }}>+</button>
        </div>
        <span style={{
          marginLeft: 12, fontFamily: T.fBody, fontSize: 13,
          color: T.clay600,
        }}>days/week</span>
      </div>
    </div>
  );
}

function Screen1Mobile() {
  return (
    <div style={{
      height: '100%', background: T.sand50, position: 'relative',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Top bar */}
      <div style={{
        padding: '12px 16px 16px', display: 'flex',
        justifyContent: 'space-between', alignItems: 'center',
        flexShrink: 0,
      }}>
        <Wordmark />
        <button style={{
          fontFamily: T.fMono, fontSize: 10, letterSpacing: 1.5,
          textTransform: 'uppercase', color: T.clay600,
          background: 'transparent', border: 'none', cursor: 'pointer',
        }}>Step 2 / 5</button>
      </div>
      {/* Progress bar */}
      <div style={{ padding: '0 16px 28px', flexShrink: 0 }}>
        <OnboardingProgress />
      </div>
      {/* Body */}
      <div className="frame-scroll" style={{
        flex: 1, overflowY: 'auto', padding: '0 16px 24px',
      }}>
        <Eyebrow>Training background</Eyebrow>
        <h1 style={{
          fontFamily: T.fDisplay, fontStyle: 'italic', fontWeight: 400,
          fontSize: 40, lineHeight: 1.05, color: T.espresso900,
          margin: '12px 0 8px', letterSpacing: -0.5,
        }}>Tell us about<br/>your journey</h1>
        <p style={{
          fontFamily: T.fBody, fontSize: 14, lineHeight: 1.6,
          color: T.clay600, margin: '0 0 28px', maxWidth: 320,
        }}>So your coach can build a plan that meets you where you are.</p>

        <OnboardingFields compact />
      </div>
      {/* Footer CTA */}
      <div style={{
        padding: '16px 16px 24px',
        background: T.sand50,
        borderTop: `1px solid ${T.hairline}`,
        flexShrink: 0,
      }}>
        <PillBtn primary full>Continue →</PillBtn>
        <div style={{
          textAlign: 'center', marginTop: 12,
          fontFamily: T.fBody, fontSize: 13, color: T.clay600,
          textDecoration: 'underline', textUnderlineOffset: 3,
          textDecorationColor: T.hairlineStrong,
        }}>Save and finish later</div>
      </div>
    </div>
  );
}

function Screen1Desktop() {
  return (
    <div style={{
      width: '100%', height: '100%', background: T.sand50,
      display: 'flex', flexDirection: 'column', position: 'relative',
    }}>
      {/* Top bar — wordmark only */}
      <div style={{
        padding: '24px 48px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        borderBottom: `1px solid ${T.hairline}`,
      }}>
        <Wordmark size="lg" />
        <MonoLabel size={11}>Step 2 of 5 · Training background</MonoLabel>
      </div>

      {/* Body — split layout */}
      <div style={{
        flex: 1, display: 'grid', gridTemplateColumns: '1fr 1.4fr',
        maxWidth: 1200, width: '100%', margin: '0 auto',
        padding: '56px 48px 24px', gap: 80, overflow: 'hidden',
      }}>
        {/* Left — narrative */}
        <div>
          <div style={{ maxWidth: 320, marginBottom: 40 }}>
            <OnboardingProgress />
            <MonoLabel size={10} style={{ marginTop: 10 }}>2 of 5 complete</MonoLabel>
          </div>
          <Eyebrow>Training background</Eyebrow>
          <h1 style={{
            fontFamily: T.fDisplay, fontStyle: 'italic', fontWeight: 400,
            fontSize: 64, lineHeight: 1.0, color: T.espresso900,
            margin: '16px 0 18px', letterSpacing: -1,
          }}>Tell us<br/>about your<br/>journey.</h1>
          <p style={{
            fontFamily: T.fBody, fontSize: 16, lineHeight: 1.6,
            color: T.clay600, margin: 0, maxWidth: 340,
          }}>Five short steps. We use this so your coach can build a plan that
          actually fits your week — not a stock template.</p>

          <div style={{
            marginTop: 48, padding: '20px 22px',
            background: T.sand100, borderRadius: 16,
            border: `1px solid ${T.hairline}`, maxWidth: 360,
            display: 'flex', gap: 14, alignItems: 'flex-start',
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: T.walnut, color: T.paper,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: T.fDisplay, fontSize: 18, fontStyle: 'italic',
              flexShrink: 0,
            }}>K</div>
            <div>
              <MonoLabel size={9}>Your coach</MonoLabel>
              <div style={{
                fontFamily: T.fDisplay, fontStyle: 'italic',
                fontSize: 18, color: T.espresso900, marginTop: 2,
              }}>Karan Mehta will see this.</div>
            </div>
          </div>
        </div>

        {/* Right — form, scrollable */}
        <div className="frame-scroll" style={{
          maxWidth: 480, overflowY: 'auto', paddingRight: 8, paddingBottom: 24,
        }}>
          <OnboardingFields />

          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginTop: 40 }}>
            <PillBtn primary style={{ minWidth: 200 }}>Continue →</PillBtn>
            <div style={{
              fontFamily: T.fBody, fontSize: 13, color: T.clay600,
              textDecoration: 'underline', textUnderlineOffset: 3,
              textDecorationColor: T.hairlineStrong, cursor: 'pointer',
            }}>Save and finish later</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// SCREEN 2 — DASHBOARD (HOME TAB)
// ═══════════════════════════════════════════════════════════════════════════

function Avatar({ size = 40, letter = 'R' }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: T.walnut, color: T.paper,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: T.fDisplay, fontStyle: 'italic',
      fontSize: size * 0.45, flexShrink: 0,
      boxShadow: T.sh1,
    }}>{letter}</div>
  );
}

function NextSessionCard({ wide }) {
  return (
    <div style={{
      background: T.paper, border: `1px solid ${T.hairlineStrong}`,
      borderRadius: 16, boxShadow: T.sh2,
      padding: wide ? '32px 36px' : '22px 22px',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* tag */}
      <div style={{
        position: 'absolute', top: wide ? 32 : 22, right: wide ? 36 : 22,
        background: T.ochre, color: T.paper,
        fontFamily: T.fMono, fontSize: 10, letterSpacing: 1.5,
        textTransform: 'uppercase', fontWeight: 500,
        padding: '5px 11px', borderRadius: 999,
      }}>In 2 days</div>

      <Eyebrow>Your next session</Eyebrow>
      <div style={{
        fontFamily: T.fBody, fontWeight: 600, fontSize: wide ? 14 : 13,
        color: T.espresso800, marginTop: wide ? 18 : 14, letterSpacing: 0.2,
      }}>Tuesday, 29 Apr · 7:00 AM</div>
      <h3 style={{
        fontFamily: T.fDisplay, fontStyle: 'italic', fontWeight: 400,
        fontSize: wide ? 36 : 26, lineHeight: 1.1,
        color: T.espresso900, margin: wide ? '8px 0 6px' : '6px 0 4px',
        letterSpacing: -0.4, maxWidth: wide ? 520 : '85%',
      }}>Strength &amp; Conditioning</h3>
      <div style={{
        fontFamily: T.fBody, fontSize: wide ? 15 : 13, color: T.clay600,
      }}>with Karan Mehta</div>

      <div style={{ display: 'flex', gap: 10, marginTop: wide ? 24 : 18, flexWrap: 'wrap' }}>
        <PillBtn primary small>View plan</PillBtn>
        <PillBtn small>Reschedule</PillBtn>
      </div>
    </div>
  );
}

function ProgressMiniCard({ icon, eyebrow, title, sub, accent = T.ochre, value }) {
  return (
    <div style={{
      background: T.paper, border: `1px solid ${T.hairline}`,
      borderRadius: 16, padding: 18,
      boxShadow: T.sh1, minWidth: 180, flex: 1,
      display: 'flex', flexDirection: 'column', gap: 10,
    }}>
      <Eyebrow dotColor={accent} size={10}>{eyebrow}</Eyebrow>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, marginTop: 4 }}>
        {icon}
        <div style={{
          fontFamily: T.fDisplay, fontStyle: 'italic', fontWeight: 400,
          fontSize: 32, lineHeight: 1, color: T.espresso900, letterSpacing: -0.5,
        }}>{title}</div>
      </div>
      {sub && (
        <div style={{
          fontFamily: T.fBody, fontSize: 12, color: T.clay600, lineHeight: 1.4,
        }}>{sub}</div>
      )}
    </div>
  );
}

function SessionsArc({ size = 48, value = 6, total = 12, color = T.ochre }) {
  const pct = value / total;
  const r = (size - 6) / 2;
  const c = 2 * Math.PI * r;
  const off = c * (1 - pct);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={T.sand200} strokeWidth="3" />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color}
        strokeWidth="3" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={off}
        transform={`rotate(-90 ${size/2} ${size/2})`} />
    </svg>
  );
}

function CoachNoteCard({ wide }) {
  return (
    <div style={{
      background: '#FFF8EE', border: `1px solid ${T.hairline}`,
      borderRadius: 16, boxShadow: T.sh1,
      padding: wide ? 32 : 22, position: 'relative',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
        <Eyebrow dotColor={T.ochre}>From Karan</Eyebrow>
        <MonoLabel size={9}>Sent Friday</MonoLabel>
      </div>
      <p style={{
        fontFamily: T.fBody, fontSize: wide ? 16 : 15, lineHeight: 1.55,
        color: T.espresso900, margin: wide ? '14px 0 0' : '12px 0 0',
        maxWidth: wide ? 600 : '100%',
      }}>“Focus on sleep this week — recovery is where the gains happen. See you Tuesday 💪”</p>
    </div>
  );
}

function DashboardHeader({ wide }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
      gap: 16, marginBottom: wide ? 32 : 20,
    }}>
      <div>
        <Eyebrow>Good morning</Eyebrow>
        <h1 style={{
          fontFamily: T.fDisplay, fontStyle: 'italic', fontWeight: 400,
          fontSize: wide ? 80 : 48, lineHeight: 1.0,
          color: T.espresso900, margin: wide ? '10px 0 6px' : '4px 0 4px',
          letterSpacing: -1,
        }}>Riya</h1>
        <MonoLabel>Week 3 of 12  ·  Coach: Karan</MonoLabel>
      </div>
      <Avatar size={wide ? 52 : 40} />
    </div>
  );
}

function Screen2Mobile() {
  return (
    <div style={{
      height: '100%', background: T.sand50, position: 'relative',
      display: 'flex', flexDirection: 'column',
    }}>
      <div className="frame-scroll" style={{
        flex: 1, overflowY: 'auto', padding: '16px 16px 96px',
      }}>
        <DashboardHeader />

        <div style={{ marginTop: 24 }}>
          <NextSessionCard />
        </div>

        {/* Progress row — horizontal scroll */}
        <div style={{ marginTop: 24 }}>
          <MonoLabel style={{ marginBottom: 10 }}>This week's progress</MonoLabel>
          <div className="frame-scroll" style={{
            display: 'flex', gap: 12, overflowX: 'auto',
            paddingBottom: 4, marginRight: -16, paddingRight: 16,
          }}>
            <ProgressMiniCard
              eyebrow="Sessions"
              title="6 / 12"
              icon={<SessionsArc value={6} total={12} />}
              accent={T.ochre}
            />
            <ProgressMiniCard
              eyebrow="Body comp"
              title="May 5"
              sub="Next check-in"
              accent={T.terra}
            />
            <ProgressMiniCard
              eyebrow="Streak"
              title="4 🔥"
              sub="sessions in a row"
              accent={T.sage}
            />
          </div>
        </div>

        <div style={{ marginTop: 22 }}>
          <CoachNoteCard />
        </div>
      </div>
      <BottomNavMobile active="home" />
    </div>
  );
}

function Screen2Desktop() {
  return (
    <div style={{ width: '100%', height: '100%', background: T.sand50, position: 'relative' }}>
      <div className="frame-scroll" style={{
        height: '100%', overflowY: 'auto', overflowX: 'hidden',
        padding: '56px 0 140px',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 48px' }}>
          <DashboardHeader wide />

          {/* Hero next session + side stack */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 24,
            alignItems: 'stretch',
          }}>
            <NextSessionCard wide />
            <CoachNoteCard wide />
          </div>

          {/* Progress row */}
          <div style={{ marginTop: 32 }}>
            <MonoLabel style={{ marginBottom: 14 }}>This week's progress</MonoLabel>
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18,
            }}>
              <ProgressMiniCard
                eyebrow="Sessions"
                title="6 / 12"
                sub="50% through your block"
                icon={<SessionsArc value={6} total={12} />}
                accent={T.ochre}
              />
              <ProgressMiniCard
                eyebrow="Body comp"
                title="May 5"
                sub="Next check-in · 9 days"
                accent={T.terra}
              />
              <ProgressMiniCard
                eyebrow="Streak"
                title="4 🔥"
                sub="sessions in a row · best is 7"
                accent={T.sage}
              />
            </div>
          </div>
        </div>
      </div>
      <BottomNavDesktop active="home" />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// SCREEN 3 — BODY COMP LOG (PROGRESS TAB)
// ═══════════════════════════════════════════════════════════════════════════

function TrendChart({ width = 300, height = 140 }) {
  // Two lines: body fat % (walnut), muscle (ochre).
  // Three x-axis dates: Mar 1 / Mar 22 / Apr 11 + the implicit "now" point.
  const xs = [0.05, 0.35, 0.65, 0.95];
  const fat = [24.8, 23.5, 22.7, 22.1];
  const musc = [69.1, 69.6, 69.9, 70.3];

  // Map values to y-pixels — independent scales, line styles convey which is which
  const fatMin = 21.5, fatMax = 25.2;
  const muscMin = 68.5, muscMax = 70.8;
  const padTop = 18, padBot = 30;
  const yFat = (v) => padTop + (fatMax - v) / (fatMax - fatMin) * (height - padTop - padBot);
  const yMusc = (v) => padTop + (muscMax - v) / (muscMax - muscMin) * (height - padTop - padBot);

  const path = (vals, yFn) => {
    return vals.map((v, i) => {
      const x = xs[i] * width;
      const y = yFn(v);
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
    }).join(' ');
  };

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ overflow: 'visible' }}>
      {/* baseline */}
      <line x1={0} x2={width} y1={height - padBot + 0.5} y2={height - padBot + 0.5}
        stroke={T.hairline} strokeWidth="1" />

      {/* fat line */}
      <path d={path(fat, yFat)} fill="none" stroke={T.walnut} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {fat.map((v, i) => (
        <circle key={`f${i}`} cx={xs[i] * width} cy={yFat(v)} r={i === fat.length - 1 ? 4 : 3}
          fill={T.paper} stroke={T.walnut} strokeWidth="2" />
      ))}

      {/* muscle line */}
      <path d={path(musc, yMusc)} fill="none" stroke={T.ochre} strokeWidth="2"
        strokeDasharray="4 3" strokeLinecap="round" strokeLinejoin="round" />
      {musc.map((v, i) => (
        <circle key={`m${i}`} cx={xs[i] * width} cy={yMusc(v)} r={i === musc.length - 1 ? 4 : 3}
          fill={T.paper} stroke={T.ochre} strokeWidth="2" />
      ))}

      {/* x-axis labels */}
      {[
        { x: xs[0], lbl: 'Mar 1' },
        { x: xs[1], lbl: 'Mar 22' },
        { x: xs[2], lbl: 'Apr 11' },
        { x: xs[3], lbl: 'Today' },
      ].map((p, i) => (
        <text key={i} x={p.x * width} y={height - 8}
          textAnchor={i === 0 ? 'start' : i === 3 ? 'end' : 'middle'}
          fontFamily={T.fMono} fontSize="9" letterSpacing="1" fill={T.clay600}
          style={{ textTransform: 'uppercase' }}>
          {p.lbl}
        </text>
      ))}
    </svg>
  );
}

function StatChip({ label, value, accent }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'baseline', gap: 8,
      padding: '8px 14px', borderRadius: 999,
      background: T.sand100, border: `1px solid ${T.hairline}`,
    }}>
      <span style={{
        width: 6, height: 6, borderRadius: 999, background: accent,
        display: 'inline-block', alignSelf: 'center',
      }} />
      <span style={{
        fontFamily: T.fMono, fontSize: 9, letterSpacing: 1.5,
        textTransform: 'uppercase', color: T.clay600, fontWeight: 500,
      }}>{label}</span>
      <span style={{
        fontFamily: T.fDisplay, fontStyle: 'italic',
        fontSize: 18, color: T.espresso900, lineHeight: 1,
      }}>{value}</span>
    </div>
  );
}

function NumField({ label, unit, value, full = false }) {
  return (
    <div style={{ flex: full ? '1 1 100%' : '1 1 calc(50% - 6px)' }}>
      <MonoLabel size={9} style={{ marginBottom: 6 }}>{label}</MonoLabel>
      <div style={{
        background: T.paper, border: `1px solid ${T.hairlineStrong}`,
        borderRadius: 10, padding: '12px 14px',
        display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
      }}>
        <span style={{
          fontFamily: T.fDisplay, fontSize: 22, color: T.espresso900,
          fontStyle: 'italic',
        }}>{value}</span>
        <span style={{
          fontFamily: T.fMono, fontSize: 10, letterSpacing: 1.4,
          textTransform: 'uppercase', color: T.clay600,
        }}>{unit}</span>
      </div>
    </div>
  );
}

function VisceralStepper() {
  return (
    <div style={{ flex: '1 1 100%' }}>
      <MonoLabel size={9} style={{ marginBottom: 6 }}>Visceral fat (1–15)</MonoLabel>
      <div style={{
        background: T.paper, border: `1px solid ${T.hairlineStrong}`,
        borderRadius: 10, padding: 4,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <button style={{
          width: 36, height: 36, border: 'none', background: 'transparent',
          color: T.walnut, fontSize: 16, cursor: 'pointer', borderRadius: 8,
        }}>−</button>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
          <span style={{
            fontFamily: T.fDisplay, fontStyle: 'italic',
            fontSize: 22, color: T.espresso900,
          }}>5</span>
          <span style={{ fontFamily: T.fMono, fontSize: 10, color: T.clay600, letterSpacing: 1 }}>/ 15</span>
        </div>
        <button style={{
          width: 36, height: 36, border: 'none', background: 'transparent',
          color: T.walnut, fontSize: 16, cursor: 'pointer', borderRadius: 8,
        }}>+</button>
      </div>
    </div>
  );
}

const SOURCES = ['DEXA', 'InBody', 'Trainer', 'Self'];

function SourceRow() {
  return (
    <div>
      <MonoLabel size={9} style={{ marginBottom: 8 }}>Data source</MonoLabel>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {SOURCES.map((s, i) => (
          <Chip key={s} selected={i === 1} style={{ fontSize: 12, padding: '7px 14px' }}>
            {s.toUpperCase()}
          </Chip>
        ))}
      </div>
    </div>
  );
}

function NoteInput() {
  return (
    <div>
      <MonoLabel size={9} style={{ marginBottom: 6 }}>Note (optional)</MonoLabel>
      <input
        defaultValue=""
        placeholder="Anything to flag?"
        style={{
          width: '100%', boxSizing: 'border-box',
          background: T.paper, border: `1px solid ${T.hairlineStrong}`,
          borderRadius: 10, padding: '12px 14px',
          fontFamily: T.fBody, fontSize: 14, color: T.ink, outline: 'none',
        }}
      />
    </div>
  );
}

function PriorEntries({ wide }) {
  const rows = [
    { d: 'Apr 11', wt: '64.2 kg', bf: '22.7%', mm: '69.9 kg', src: 'INBODY' },
    { d: 'Mar 22', wt: '64.6 kg', bf: '23.5%', mm: '69.6 kg', src: 'INBODY' },
    { d: 'Mar 01', wt: '65.1 kg', bf: '24.8%', mm: '69.1 kg', src: 'DEXA'  },
  ];
  return (
    <div style={{
      background: T.paper, border: `1px solid ${T.hairline}`,
      borderRadius: 16, padding: wide ? '20px 24px' : '14px 16px',
    }}>
      <Eyebrow size={10}>Prior entries</Eyebrow>
      <div style={{ marginTop: 14 }}>
        {rows.map((r, i) => (
          <div key={i} style={{
            display: 'grid',
            gridTemplateColumns: wide ? '90px 1fr 1fr 1fr 80px' : '70px 1fr 1fr 60px',
            gap: 10, alignItems: 'baseline',
            padding: '10px 0',
            borderTop: i === 0 ? 'none' : `1px solid ${T.hairline}`,
          }}>
            <MonoLabel size={10}>{r.d}</MonoLabel>
            <span style={{ fontFamily: T.fDisplay, fontStyle: 'italic', fontSize: 16, color: T.espresso900 }}>{r.wt}</span>
            <span style={{ fontFamily: T.fDisplay, fontStyle: 'italic', fontSize: 16, color: T.walnut }}>{r.bf}</span>
            {wide && <span style={{ fontFamily: T.fDisplay, fontStyle: 'italic', fontSize: 16, color: T.ochre }}>{r.mm}</span>}
            <MonoLabel size={9} style={{ textAlign: 'right' }}>{r.src}</MonoLabel>
          </div>
        ))}
      </div>
    </div>
  );
}

function Screen3Mobile() {
  return (
    <div style={{
      height: '100%', background: T.sand50, position: 'relative',
      display: 'flex', flexDirection: 'column',
    }}>
      <div className="frame-scroll" style={{
        flex: 1, overflowY: 'auto', padding: '16px 16px 96px',
      }}>
        {/* Top header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <Eyebrow>Body composition</Eyebrow>
          <MonoLabel size={10}>Riya · Wk 3</MonoLabel>
        </div>
        <h2 style={{
          fontFamily: T.fDisplay, fontStyle: 'italic', fontWeight: 400,
          fontSize: 36, lineHeight: 1.05,
          color: T.espresso900, margin: '8px 0 16px', letterSpacing: -0.5,
        }}>Trends</h2>

        {/* Trend chart card */}
        <div style={{
          background: T.paper, border: `1px solid ${T.hairline}`,
          borderRadius: 16, padding: '18px 16px 14px', boxShadow: T.sh1,
        }}>
          <TrendChart width={310} height={140} />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 14 }}>
            <StatChip label="Body fat" value="22.1%" accent={T.walnut} />
            <StatChip label="Muscle" value="70.3 kg" accent={T.ochre} />
          </div>
        </div>

        {/* New entry card */}
        <div style={{
          background: T.paper, border: `1px solid ${T.hairlineStrong}`,
          borderRadius: 16, padding: '20px 18px',
          boxShadow: T.sh2, marginTop: 18,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Eyebrow>New entry</Eyebrow>
            <MonoLabel size={10}>Sat · 26 Apr</MonoLabel>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 16 }}>
            <NumField label="Weight"        unit="kg" value="63.8" />
            <NumField label="Body fat"      unit="%"  value="22.1" />
            <NumField label="Muscle mass"   unit="kg" value="70.3" />
            <VisceralStepper />
          </div>
          <div style={{ marginTop: 18 }}><SourceRow /></div>
          <div style={{ marginTop: 14 }}><NoteInput /></div>
        </div>

        {/* Prior entries */}
        <div style={{ marginTop: 18 }}>
          <PriorEntries />
        </div>

        {/* Save CTA */}
        <div style={{ marginTop: 24 }}>
          <PillBtn primary full>Save check-in</PillBtn>
          <MonoLabel size={9} style={{ textAlign: 'center', marginTop: 10, opacity: 0.7 }}>
            Data visible to your coach
          </MonoLabel>
        </div>
      </div>
      <BottomNavMobile active="progress" />
    </div>
  );
}

function Screen3Desktop() {
  return (
    <div style={{ width: '100%', height: '100%', background: T.sand50, position: 'relative' }}>
      <div className="frame-scroll" style={{
        height: '100%', overflowY: 'auto', overflowX: 'hidden',
        padding: '48px 0 140px',
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 48px' }}>
          {/* Header */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
            marginBottom: 36,
          }}>
            <div>
              <Eyebrow>Body composition</Eyebrow>
              <h1 style={{
                fontFamily: T.fDisplay, fontStyle: 'italic', fontWeight: 400,
                fontSize: 64, lineHeight: 1.0,
                color: T.espresso900, margin: '12px 0 0', letterSpacing: -1,
              }}>Trends &amp; check-in.</h1>
            </div>
            <MonoLabel size={11}>Riya · Week 3 · 4 entries</MonoLabel>
          </div>

          {/* Two-col: chart + prior entries */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 24 }}>
            <div style={{
              background: T.paper, border: `1px solid ${T.hairline}`,
              borderRadius: 16, padding: 28, boxShadow: T.sh1,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <Eyebrow>Body composition trends</Eyebrow>
                <div style={{ display: 'flex', gap: 14, alignItems: 'center', fontFamily: T.fMono, fontSize: 10, color: T.clay600, letterSpacing: 1.4, textTransform: 'uppercase' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    <svg width="20" height="3"><line x1="0" x2="20" y1="1.5" y2="1.5" stroke={T.walnut} strokeWidth="2" /></svg>
                    Body fat
                  </span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    <svg width="20" height="3"><line x1="0" x2="20" y1="1.5" y2="1.5" stroke={T.ochre} strokeWidth="2" strokeDasharray="4 3" /></svg>
                    Muscle
                  </span>
                </div>
              </div>
              <div style={{ marginTop: 18 }}>
                <TrendChart width={620} height={220} />
              </div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 18 }}>
                <StatChip label="Body fat"   value="22.1%"   accent={T.walnut} />
                <StatChip label="Muscle"     value="70.3 kg" accent={T.ochre} />
                <StatChip label="Δ 6 weeks"  value="−2.7%"   accent={T.sage} />
                <StatChip label="Weight"     value="63.8 kg" accent={T.terra} />
              </div>
            </div>

            <PriorEntries wide />
          </div>

          {/* Log card */}
          <div style={{
            background: T.paper, border: `1px solid ${T.hairlineStrong}`,
            borderRadius: 16, padding: 32, boxShadow: T.sh2, marginTop: 24,
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 36,
          }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Eyebrow>New entry</Eyebrow>
                <MonoLabel size={10}>Saturday · 26 Apr</MonoLabel>
              </div>
              <h3 style={{
                fontFamily: T.fDisplay, fontStyle: 'italic', fontWeight: 400,
                fontSize: 28, lineHeight: 1.1, color: T.espresso900,
                margin: '10px 0 6px', letterSpacing: -0.4,
              }}>Log today's check-in.</h3>
              <p style={{ fontFamily: T.fBody, fontSize: 14, color: T.clay600, margin: 0, lineHeight: 1.5 }}>
                Numbers come from your last InBody scan. Edit anything before saving.
              </p>

              <div style={{ marginTop: 24 }}><SourceRow /></div>
              <div style={{ marginTop: 20 }}><NoteInput /></div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginTop: 28 }}>
                <PillBtn primary style={{ minWidth: 200 }}>Save check-in</PillBtn>
                <MonoLabel size={9}>Data visible to your coach</MonoLabel>
              </div>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignContent: 'flex-start' }}>
              <NumField label="Weight"      unit="kg" value="63.8" />
              <NumField label="Body fat"    unit="%"  value="22.1" />
              <NumField label="Muscle mass" unit="kg" value="70.3" />
              <VisceralStepper />
            </div>
          </div>
        </div>
      </div>
      <BottomNavDesktop active="progress" />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// CANVAS
// ═══════════════════════════════════════════════════════════════════════════

function SessionACanvas() {
  return (
    <DesignCanvas>
      <DCSection
        id="onb"
        title="Screen 1 · Onboarding — Step 2 of 5"
        subtitle="Training background. No bottom nav — pre-app. Wordmark only."
      >
        <DCArtboard id="m1" label="Mobile · 375×812" width={375} height={812}>
          <PhoneFrame><Screen1Mobile /></PhoneFrame>
        </DCArtboard>
        <DCArtboard id="d1" label="Desktop · 1280×800" width={1280} height={800}>
          <BrowserFrame url="app.mythirdspace.in/onboarding/2"><Screen1Desktop /></BrowserFrame>
        </DCArtboard>
      </DCSection>

      <DCSection
        id="dash"
        title="Screen 2 · Client Dashboard (Home)"
        subtitle="Riya · Week 3 of 12 · Coach Karan. Bottom nav with Home active."
      >
        <DCArtboard id="m2" label="Mobile · 375×812" width={375} height={812}>
          <PhoneFrame><Screen2Mobile /></PhoneFrame>
        </DCArtboard>
        <DCArtboard id="d2" label="Desktop · 1280×800" width={1280} height={800}>
          <BrowserFrame url="app.mythirdspace.in/home"><Screen2Desktop /></BrowserFrame>
        </DCArtboard>
      </DCSection>

      <DCSection
        id="bodycomp"
        title="Screen 3 · Body Composition Log (Progress)"
        subtitle="Filled state · 3 prior entries · Progress tab active."
      >
        <DCArtboard id="m3" label="Mobile · 375×812" width={375} height={812}>
          <PhoneFrame><Screen3Mobile /></PhoneFrame>
        </DCArtboard>
        <DCArtboard id="d3" label="Desktop · 1280×800" width={1280} height={800}>
          <BrowserFrame url="app.mythirdspace.in/progress/body"><Screen3Desktop /></BrowserFrame>
        </DCArtboard>
      </DCSection>

      <DCPostIt top={20} left={60} rotate={-3} width={220}>
        Session A · 3 screens × 2 breakpoints. Drag arrows on labels to reorder. Click any to focus (←/→/Esc).
      </DCPostIt>
    </DesignCanvas>
  );
}

Object.assign(window, { SessionACanvas });
