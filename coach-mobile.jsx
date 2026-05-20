/* Coach Universe — Mobile layouts v2
 * v2 changes (May 2026):
 *  - Logo (image, not text) in top bar
 *  - 4-tab nav: HOME · CALENDAR · INVITES · MORE (sheet)
 *  - Outlook-style MobileCalendarPage with Agenda / 3-Day / Month
 *  - Route mobileTab to: home / calendar / invites / clients / peers
 *                       / profile / integrations / admin (gate)
 *
 * Tier 1 (full mobile):  Today, Invites, Calendar
 * Tier 2 (read-friendly): Clients, Peer calendars (read-only)
 * Tier 3 (soft-gated):    Admin panel, full calendar planning grid
 */

const { useState: mUseState, useEffect: mUseEffect, useMemo: mUseMemo } = React;

// ─── Breakpoints + hook ──────────────────────────────────────────────
const BP = {
  mobile:    '(max-width: 767px)',
  tablet:    '(min-width: 768px) and (max-width: 1023px)',
  desktop:   '(min-width: 1024px)',
  landscape: '(min-width: 568px) and (max-width: 899px) and (orientation: landscape)',
};

function useMediaQuery(query) {
  const [matches, setMatches] = mUseState(false);
  mUseEffect(() => {
    const m = window.matchMedia(query);
    setMatches(m.matches);
    const handler = (e) => setMatches(e.matches);
    m.addEventListener('change', handler);
    return () => m.removeEventListener('change', handler);
  }, [query]);
  return matches;
}

// ─── Demo "now" ──────────────────────────────────────────────────────
const DEMO_NOW = new Date(2026, 3, 20, 9, 13);
const WEEK_START = new Date(2026, 3, 20); // Mon Apr 20
function startOfDay(d) { const x = new Date(d); x.setHours(0,0,0,0); return x; }
function dayIdxFor(d) {
  const diff = Math.floor((startOfDay(d) - startOfDay(WEEK_START)) / 86400000);
  return ((diff % 7) + 7) % 7;
}
function isSameDay(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}
function fmtMobileTime(mins) {
  const h = Math.floor(mins / 60), m = mins % 60;
  const ampm = h < 12 ? 'AM' : 'PM';
  const hh = ((h + 11) % 12) + 1;
  return `${hh}:${String(m).padStart(2, '0')} ${ampm}`;
}
function eventKindLabel(kind) {
  return ({ pt: 'PT Session', group: 'Group Class', pending: 'Pending invite', block: 'Off / Blocked' }[kind] || kind);
}
function kindBorderColor(kind) {
  return ({ pt: 'var(--walnut-700)', group: 'var(--sage-500)', block: 'var(--terracotta-500)', pending: 'var(--ochre-500)' }[kind] || 'var(--walnut-700)');
}
function kindTintBg(kind) {
  return ({ pt: '#EFE2D3', group: '#DEE5D3', block: '#ECCDBF', pending: '#FFF2D8' }[kind] || '#EFE2D3');
}
function statusFor(ev) {
  const nowMins = DEMO_NOW.getHours() * 60 + DEMO_NOW.getMinutes();
  if (ev.kind === 'pending') return { label: 'PENDING',  bg: '#FFF2D8',           fg: '#6A4A10' };
  if (ev.kind === 'block')   return { label: 'BLOCKED',  bg: '#ECCDBF',           fg: '#5A3020' };
  if (ev.end < nowMins)      return { label: 'DONE',     bg: 'var(--sand-200)',   fg: 'var(--clay-600)' };
  return                            { label: 'CONFIRMED',bg: 'var(--sage-200)',   fg: 'var(--sage-500)' };
}

// ─── Icons ───────────────────────────────────────────────────────────
function Icn({ d, size = 22, fill, stroke = 'currentColor', sw = 1.6 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill || 'none'} stroke={fill ? 'none' : stroke}
         strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">{d}</svg>
  );
}
const ICON = {
  homeOutline: <Icn size={22} d={<><path d="M3 11.5L12 4l9 7.5"/><path d="M5 10v10h14V10"/></>} />,
  calendarOutline: <Icn size={22} d={<><rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 9.5h17"/><path d="M8 3v4M16 3v4"/></>} />,
  calendarFilled: (
    <svg width={22} height={22} viewBox="0 0 24 24" fill="currentColor">
      <path d="M7 2.5a.7.7 0 0 1 .7.7v1.3h8.6V3.2a.7.7 0 1 1 1.4 0v1.3h.6A2.5 2.5 0 0 1 20.8 7v11.5A2.5 2.5 0 0 1 18.3 21H5.7a2.5 2.5 0 0 1-2.5-2.5V7A2.5 2.5 0 0 1 5.7 4.5h.6V3.2A.7.7 0 0 1 7 2.5zM4.8 9.5v9c0 .5.4.9.9.9h12.6c.5 0 .9-.4.9-.9v-9H4.8z"/>
    </svg>
  ),
  envelope: <Icn size={22} d={<><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3.5 6l8.5 7 8.5-7"/></>} />,
  dots: (
    <svg width={22} height={22} viewBox="0 0 24 24" fill="currentColor">
      <circle cx="5" cy="12" r="1.8"/><circle cx="12" cy="12" r="1.8"/><circle cx="19" cy="12" r="1.8"/>
    </svg>
  ),
  chevL: <Icn size={20} sw={2} d={<path d="M15 5l-7 7 7 7"/>} />,
  chevR: <Icn size={20} sw={2} d={<path d="M9 5l7 7-7 7"/>} />,
  chevDown: <Icn size={16} sw={2} d={<path d="M6 9l6 6 6-6"/>} />,
  chevRowR: <Icn size={16} sw={2} d={<path d="M9 5l7 7-7 7"/>} />,
  plus: <Icn size={26} sw={2} d={<><path d="M12 5v14"/><path d="M5 12h14"/></>} />,
  // More-sheet row glyphs
  user:    <Icn size={20} d={<><circle cx="12" cy="8" r="3.5"/><path d="M5 20c0-3.5 3-6 7-6s7 2.5 7 6"/></>} />,
  plug:    <Icn size={20} d={<><path d="M9 10V4M15 10V4"/><rect x="6.5" y="10" width="11" height="6" rx="2"/><path d="M12 16v4"/></>} />,
  users:   <Icn size={20} d={<><circle cx="9" cy="9" r="3"/><path d="M3 19c0-3 2.7-5 6-5s6 2 6 5"/><circle cx="17" cy="8" r="2.4"/><path d="M15 14c3 0 6 1.6 6 4"/></>} />,
  peer:    <Icn size={20} d={<><circle cx="12" cy="12" r="8"/><path d="M4 12h16M12 4c2.5 3 2.5 13 0 16M12 4c-2.5 3-2.5 13 0 16"/></>} />,
  lock:    <Icn size={20} d={<><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></>} />,
  shield:  <Icn size={20} d={<path d="M12 3l8 3v6c0 4.5-3.5 8-8 9-4.5-1-8-4.5-8-9V6l8-3z"/>} />,
  swap:    <Icn size={20} d={<><path d="M4 7h13l-3-3M20 17H7l3 3"/></>} />,
  signOut: <Icn size={20} d={<><path d="M15 5h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-3"/><path d="M10 12h10M16 8l4 4-4 4"/></>} />,
};

// ─── Mobile Top Bar — LOGO + avatar dropdown ─────────────────────────
function MobileTopBar({ coach, onLogout, onLogoTap }) {
  const [open, setOpen] = mUseState(false);
  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 30,
      background: 'var(--espresso-900)', color: 'var(--sand-100)',
      height: 56, padding: '0 16px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      borderBottom: '1px solid rgba(255,253,248,0.08)',
    }}>
      <button onClick={onLogoTap} aria-label="My Third Space — Home" style={{
        background: 'transparent', border: 'none', padding: 0, cursor: 'pointer',
        display: 'flex', alignItems: 'center', height: 40,
      }}>
        <img
          src="assets/mts-logo.png"
          alt="My Third Space"
          style={{
            height: 28, width: 'auto', objectFit: 'contain', display: 'block',
            filter: 'brightness(0) saturate(100%) invert(96%) sepia(8%) saturate(454%) hue-rotate(345deg) brightness(101%) contrast(91%)',
          }}
        />
      </button>

      <button onClick={() => window.location.href = window.location.pathname} title="Switch to desktop view" style={{
        background: 'transparent', border: '1px solid rgba(255,253,248,0.2)',
        color: 'rgba(255,253,248,0.6)', borderRadius: 999,
        fontFamily: 'var(--f-mono)', fontSize: 9, letterSpacing: 1.5,
        padding: '4px 10px', cursor: 'pointer', whiteSpace: 'nowrap',
      }}>Desktop →</button>
      <div style={{ position: 'relative' }}>
        <button onClick={() => setOpen(v => !v)} aria-label="Profile menu" style={{
          width: 36, height: 36, border: 'none', background: 'transparent',
          padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <CoachAvatar coach={coach} size={32} />
        </button>
        {open && (
          <>
            <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 40 }} />
            <div style={{
              position: 'absolute', top: 44, right: 0, zIndex: 41,
              minWidth: 220, background: 'var(--paper)', color: 'var(--espresso-900)',
              borderRadius: 'var(--r-md)', boxShadow: 'var(--sh-3)',
              border: '1px solid var(--hairline)', overflow: 'hidden',
            }}>
              <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--hairline)' }}>
                <div style={{ fontSize: 14, fontWeight: 500 }}>{coach.name}</div>
                <div style={{ fontSize: 12, color: 'var(--clay-600)' }}>{coach.role}</div>
              </div>
              <button onClick={onLogout} style={mobileMenuItemStyle}>Sign out</button>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
const mobileMenuItemStyle = {
  width: '100%', padding: '12px 14px', background: 'transparent',
  border: 'none', textAlign: 'left', fontFamily: 'var(--f-body)',
  fontSize: 14, color: 'var(--espresso-900)', cursor: 'pointer',
};

// ─── Bottom nav — 4 tabs (Home / Calendar / Invites / More) ──────────
const PRIMARY_TABS = ['home', 'calendar', 'invites'];

// Simple house SVG icon for HOME
const HomeIcon = ({ size = 22, active }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'}
    stroke="currentColor" strokeWidth={active ? 0 : 1.7} strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 11.5L12 4l9 7.5" strokeWidth={1.7} fill="none" stroke="currentColor" />
    <path d="M5 10v10h5v-5h4v5h5V10" fill={active ? 'currentColor' : 'none'}
      stroke={active ? 'none' : 'currentColor'} strokeWidth={1.7} />
  </svg>
);

function MobileBottomNav({ tab, primaryActive, onPrimaryTap, onMoreTap, pendingCount }) {
  const items = [
    { id: 'home',     label: 'HOME',     getIcon: (a) => <HomeIcon size={22} active={a} />,           kind: 'primary' },
    { id: 'calendar', label: 'CAL',      getIcon: (a) => a ? ICON.calendarFilled : ICON.calendarOutline, kind: 'primary' },
    { id: 'invites',  label: 'INVITES',  getIcon: ()  => ICON.envelope,                                kind: 'primary' },
    { id: 'more',     label: 'MORE',     getIcon: ()  => ICON.dots,                                    kind: 'more' },
  ];
  return (
    <nav style={{
      position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 30,
      background: 'var(--espresso-900)',
      borderTop: '1px solid rgba(255,253,248,0.08)',
      paddingBottom: 'env(safe-area-inset-bottom, 0px)',
    }}>
      <div style={{
        display: 'flex',
        height: 58, alignItems: 'stretch',
      }}>
        {items.map(t => {
          const active = (t.kind === 'primary' && primaryActive === t.id) ||
                         (t.kind === 'more' && primaryActive === 'more');
          return (
            <button key={t.id}
              onClick={() => t.kind === 'more' ? onMoreTap() : onPrimaryTap(t.id)}
              aria-label={t.label}
              style={{
                flex: 1, minWidth: 0,
                background: 'transparent', border: 'none', cursor: 'pointer',
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                justifyContent: 'center', gap: 4, position: 'relative',
                borderTop: '2px solid ' + (active ? 'var(--ochre-500)' : 'transparent'),
                padding: '6px 2px 4px',
                color: active ? 'var(--ochre-500)' : 'var(--sand-300)',
              }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                color: active ? 'var(--ochre-500)' : 'var(--sand-300)',
              }}>{t.getIcon(active)}</span>
              <span className="mono" style={{
                fontSize: 8, letterSpacing: 0.8, lineHeight: 1,
                color: active ? 'var(--ochre-500)' : 'var(--clay-600)',
              }}>{t.label}</span>
              {t.id === 'invites' && pendingCount > 0 && (
                <span style={{
                  position: 'absolute', top: 6, left: 'calc(50% + 4px)',
                  minWidth: 16, height: 16, borderRadius: 999,
                  background: 'var(--terracotta-500)', color: 'var(--paper)',
                  fontFamily: 'var(--f-mono)', fontSize: 9, fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  padding: '0 5px',
                }}>{pendingCount}</span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

// ─── Soft Gate (Tier 3) ──────────────────────────────────────────────
function SoftGate({ feature, onBack }) {
  const isCal = feature === 'Calendar planning';
  return (
    <div style={{
      minHeight: '100vh', background: 'var(--espresso-900)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24,
    }}>
      <div style={{ maxWidth: 320, textAlign: 'center' }}>
        <div className="mono" style={{ color: 'var(--ochre-500)', marginBottom: 16 }}>
          ● {feature.toUpperCase()}
        </div>
        <h2 className="serif" style={{
          fontSize: 32, color: 'var(--paper)', margin: '0 0 16px',
          fontStyle: 'italic', lineHeight: 1.15,
        }}>This view works best on a wider screen.</h2>
        <p style={{
          color: 'rgba(255,253,248,0.7)', fontSize: 15, lineHeight: 1.6,
          margin: '0 0 32px',
        }}>
          {isCal
            ? 'Full planning grid shows every coach side-by-side. Use a tablet or laptop.'
            : 'Admin panel has dense tables and bulk actions. Open it on a tablet or laptop.'}
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button onClick={onBack} style={{
            padding: '12px 24px', borderRadius: 999, border: 'none',
            background: 'var(--ochre-500)', color: 'var(--espresso-900)',
            fontFamily: 'var(--f-body)', fontWeight: 600, fontSize: 14, cursor: 'pointer',
          }}>← Back to coach view</button>
          <a href="mailto:?subject=Open M3S on a bigger screen&body=Open this link on your laptop: https://mythirdspace.fit/coach-universe.html"
             style={{
               color: 'var(--ochre-500)', textDecoration: 'none',
               fontFamily: 'var(--f-body)', fontSize: 13, padding: '8px 0',
             }}>Email myself this link →</a>
        </div>
      </div>
    </div>
  );
}

// ─── Orientation hint ────────────────────────────────────────────────
function OrientationHint() {
  const landscape = useMediaQuery(BP.landscape);
  const [dismissed, setDismissed] = mUseState(() => {
    try { return sessionStorage.getItem('m3s.landHint') === '1'; } catch { return false; }
  });
  if (!landscape || dismissed) return null;
  return (
    <div style={{
      position: 'fixed', left: '50%', bottom: 88, transform: 'translateX(-50%)',
      zIndex: 35, background: 'var(--paper)', color: 'var(--espresso-900)',
      borderRadius: 'var(--r-md)', boxShadow: 'var(--sh-2)',
      border: '1px solid var(--hairline)',
      padding: '10px 12px 10px 14px',
      display: 'flex', alignItems: 'center', gap: 12, maxWidth: 'calc(100vw - 32px)',
    }}>
      <div>
        <div className="mono" style={{ color: 'var(--clay-600)', fontSize: 9 }}>TIP</div>
        <div style={{ fontSize: 13, lineHeight: 1.35 }}>Rotate or open on a tablet for more space.</div>
      </div>
      <button onClick={() => {
        try { sessionStorage.setItem('m3s.landHint', '1'); } catch {}
        setDismissed(true);
      }} aria-label="Dismiss" style={{
        width: 28, height: 28, borderRadius: 999, border: 'none', background: 'var(--sand-100)',
        color: 'var(--clay-600)', cursor: 'pointer', fontSize: 14,
      }}>✕</button>
    </div>
  );
}

// ─── HOME (today's "Up next") ────────────────────────────────────────
function MobileHomeTab({ coach, events, openClient, clients, onJumpToCalendar }) {
  const todayIdx = dayIdxFor(DEMO_NOW);
  const today = events[todayIdx] || [];
  const sorted = [...today].sort((a, b) => a.start - b.start);
  const nowMins = DEMO_NOW.getHours() * 60 + DEMO_NOW.getMinutes();
  const upcoming = sorted.find(e => e.end > nowMins && e.kind !== 'block');
  const within4h = upcoming && (upcoming.start - nowMins) <= 240 && (upcoming.start - nowMins) >= -15;

  const dayName   = DEMO_NOW.toLocaleDateString('en-US', { weekday: 'long' });
  const dateLabel = DEMO_NOW.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const [expandedId, setExpandedId] = mUseState(null);

  function clientNameFromTitle(title) {
    const m = /·\s+(.+)$/.exec(title);
    return m ? m[1].trim() : title;
  }
  function clientFromTitle(title) {
    const n = clientNameFromTitle(title);
    return (clients || []).find(c => n.startsWith(c.name.split(' ')[0]));
  }
  function countdownLabel(mins) {
    const diff = mins - nowMins;
    if (diff < 0)  return 'STARTED';
    if (diff < 60) return `IN ${diff} MINUTES`;
    const h = Math.floor(diff / 60), m = diff % 60;
    return m ? `IN ${h}H ${m}M` : `IN ${h}H`;
  }

  return (
    <div style={{ padding: 16, paddingBottom: 96 }}>
      <div className="mono" style={{
        color: 'var(--clay-600)', marginBottom: 10,
        display: 'inline-flex', alignItems: 'center', gap: 8,
      }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--ochre-500)' }} />
        TODAY · {dayName.toUpperCase()}, {dateLabel.toUpperCase()}
      </div>
      <h1 className="serif" style={{
        fontSize: 28, fontStyle: 'italic', margin: '0 0 18px',
        color: 'var(--espresso-900)', lineHeight: 1.1, letterSpacing: '-0.01em',
      }}>{upcoming ? 'Up next.' : "You're free."}</h1>

      {within4h && (
        <div style={{
          background: 'var(--paper)', borderRadius: 'var(--r-xl)',
          padding: 20, boxShadow: 'var(--sh-2)',
          border: '1px solid var(--hairline)', marginBottom: 24,
        }}>
          <span className="mono" style={{
            display: 'inline-block',
            background: 'var(--ochre-500)', color: 'var(--espresso-900)',
            padding: '4px 10px', borderRadius: 999,
            fontSize: 10, fontWeight: 700, letterSpacing: 1.4, marginBottom: 14,
          }}>{countdownLabel(upcoming.start)}</span>
          <div style={{ fontFamily: 'var(--f-body)', fontWeight: 700, fontSize: 24, color: 'var(--espresso-900)', lineHeight: 1 }}>
            {fmtMobileTime(upcoming.start)}
          </div>
          <div className="serif" style={{
            fontSize: 22, fontStyle: 'italic', color: 'var(--walnut-700)',
            margin: '6px 0 2px', letterSpacing: '-0.01em',
          }}>{clientNameFromTitle(upcoming.title)}</div>
          <div style={{ color: 'var(--clay-600)', fontSize: 14, marginBottom: 14 }}>
            {eventKindLabel(upcoming.kind)} · {upcoming.end - upcoming.start} min
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {(() => {
              const cl = clientFromTitle(upcoming.title);
              return cl ? (
                <button onClick={() => openClient(cl)} style={mobilePillPrimary}>View client →</button>
              ) : null;
            })()}
            <button onClick={onJumpToCalendar} style={mobilePillGhost}>Full calendar →</button>
          </div>
        </div>
      )}

      {sorted.length === 0 && (
        <div style={{ background: 'var(--sage-200)', borderRadius: 'var(--r-lg)', padding: 24, textAlign: 'center' }}>
          <div className="serif" style={{ fontSize: 22, fontStyle: 'italic', color: 'var(--espresso-900)', margin: 0 }}>No sessions today. Enjoy.</div>
          <button onClick={onJumpToCalendar} style={{
            marginTop: 14, background: 'transparent', border: 'none',
            color: 'var(--walnut-700)', fontSize: 13, cursor: 'pointer', fontFamily: 'var(--f-body)',
          }}>Plan tomorrow →</button>
        </div>
      )}

      {sorted.length > 0 && (
        <>
          <div className="mono" style={{ color: 'var(--clay-600)', marginBottom: 10 }}>— {sorted.length} EVENTS TODAY</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {sorted.map(ev => {
              const status = statusFor(ev);
              const isExp = expandedId === ev.id;
              const cl = clientFromTitle(ev.title);
              const isClient = ev.kind === 'pt' || ev.kind === 'pending';
              return (
                <div key={ev.id} style={{
                  background: 'var(--paper)', borderRadius: 'var(--r-md)',
                  border: '1px solid var(--hairline)', overflow: 'hidden',
                }}>
                  <button onClick={() => setExpandedId(isExp ? null : ev.id)} style={{
                    width: '100%', textAlign: 'left', background: 'transparent', border: 'none',
                    padding: '12px 14px', cursor: 'pointer',
                    display: 'grid', gridTemplateColumns: '54px 1fr auto',
                    gap: 12, alignItems: 'center',
                  }}>
                    <span className="mono" style={{ color: 'var(--clay-600)', fontSize: 11, letterSpacing: 1 }}>
                      {fmtMobileTime(ev.start)}
                    </span>
                    <span style={{ minWidth: 0 }}>
                      <div style={{
                        fontWeight: 500, fontSize: 14, color: 'var(--espresso-900)',
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                      }}>{clientNameFromTitle(ev.title)}</div>
                      <div className="mono" style={{ color: 'var(--clay-600)', fontSize: 9, marginTop: 2 }}>
                        {eventKindLabel(ev.kind).toUpperCase()}
                      </div>
                    </span>
                    <span className="mono" style={{
                      background: status.bg, color: status.fg,
                      padding: '3px 8px', borderRadius: 999,
                      fontSize: 9, fontWeight: 700, letterSpacing: 1.2, whiteSpace: 'nowrap',
                    }}>{status.label}</span>
                  </button>
                  {isExp && (
                    <div style={{ borderTop: '1px solid var(--hairline)', padding: '10px 14px 12px', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {cl && isClient && <button onClick={() => openClient(cl)} style={mobilePillPrimary}>View client →</button>}
                      <button style={mobilePillGhost}>Note →</button>
                      <button style={mobilePillGhost}>Reschedule</button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

const mobilePillPrimary = {
  padding: '8px 14px', borderRadius: 999, border: 'none',
  background: 'var(--walnut-700)', color: 'var(--paper)',
  fontFamily: 'var(--f-body)', fontSize: 12, fontWeight: 500, cursor: 'pointer',
};
const mobilePillGhost = {
  padding: '8px 14px', borderRadius: 999,
  background: 'transparent', color: 'var(--walnut-700)',
  border: '1px solid var(--hairline-strong)',
  fontFamily: 'var(--f-body)', fontSize: 12, cursor: 'pointer',
};

// ─── INVITES ─────────────────────────────────────────────────────────
function MobileInvitesTab({ invites, setInvites, toast }) {
  const [filter, setFilter] = mUseState('ALL');
  const [expandedId, setExpandedId] = mUseState(null);
  const pending = invites.filter(i => i.status === 'pending');

  const filtered = filter === 'WAITLIST'
    ? invites.filter(i => i.status === 'alternate-sent')
    : filter === 'NEW'
    ? pending.filter(i => /hr|hrs/.test(i.requestedAt))
    : pending;

  function accept(inv) {
    setInvites(invites.map(i => i.id === inv.id ? { ...i, status: 'accepted' } : i));
    toast(`Confirmed — ${inv.member}`);
  }
  function reject(inv) {
    setInvites(invites.map(i => i.id === inv.id ? { ...i, status: 'rejected' } : i));
    toast(`Declined — ${inv.member}`);
  }
  function reassign() { toast('Reassign flow opens here'); }

  return (
    <div style={{ padding: 16, paddingBottom: 96 }}>
      <div className="mono" style={{
        color: 'var(--clay-600)', marginBottom: 10,
        display: 'inline-flex', alignItems: 'center', gap: 8,
      }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--ochre-500)' }} />
        PT INVITES · {pending.length} PENDING
      </div>
      <h1 className="serif" style={{
        fontSize: 28, fontStyle: 'italic', margin: '0 0 18px',
        color: 'var(--espresso-900)', lineHeight: 1.1, letterSpacing: '-0.01em',
      }}>Awaiting your response.</h1>

      <div className="tab-row" style={{
        display: 'flex', gap: 8, marginBottom: 16,
        overflowX: 'auto', scrollbarWidth: 'none',
        marginLeft: -16, marginRight: -16, padding: '0 16px',
      }}>
        {['ALL', 'NEW', 'WAITLIST'].map(k => {
          const active = filter === k;
          return (
            <button key={k} onClick={() => setFilter(k)} className="mono" style={{
              padding: '8px 14px', borderRadius: 999, whiteSpace: 'nowrap',
              border: '1px solid ' + (active ? 'var(--walnut-700)' : 'var(--hairline-strong)'),
              background: active ? 'var(--walnut-700)' : 'var(--paper)',
              color: active ? 'var(--paper)' : 'var(--walnut-700)',
              fontFamily: 'var(--f-mono)', fontSize: 9, letterSpacing: 1.5, cursor: 'pointer',
            }}>{k}</button>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div style={{
          background: 'var(--paper)', border: '1px solid var(--hairline)',
          borderRadius: 'var(--r-lg)', padding: 32, textAlign: 'center', color: 'var(--clay-600)',
        }}>
          <div style={{ fontSize: 32, opacity: 0.3, marginBottom: 6 }}>✓</div>
          All caught up.
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filtered.map(inv => {
          const isExp = expandedId === inv.id;
          return (
            <div key={inv.id} style={{
              background: 'var(--paper)', borderRadius: 'var(--r-lg)',
              border: '1px solid var(--hairline)', boxShadow: 'var(--sh-1)', padding: 16,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: '50%',
                  background: 'var(--sand-200)', color: 'var(--walnut-700)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--f-display)', fontStyle: 'italic', fontSize: 15, flexShrink: 0,
                }}>{inv.memberInitials}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: 'var(--f-body)', fontWeight: 600, fontSize: 14, color: 'var(--espresso-900)' }}>{inv.member}</div>
                </div>
                <span className="mono" style={{ color: 'var(--clay-600)', fontSize: 9, whiteSpace: 'nowrap' }}>{inv.requestedAt.toUpperCase()}</span>
              </div>

              <div style={{ fontSize: 14, color: 'var(--espresso-900)', marginTop: 10 }}>
                {inv.day} · <strong style={{ fontWeight: 600 }}>{inv.time}</strong>
              </div>
              <div style={{ marginTop: 8 }}>
                <span className="mono" style={{
                  background: 'var(--sand-100)', color: 'var(--walnut-700)',
                  padding: '4px 10px', borderRadius: 999,
                  fontSize: 9, letterSpacing: 1.5, fontWeight: 600,
                  border: '1px solid var(--hairline)',
                }}>STRENGTH</span>
              </div>

              <button onClick={() => setExpandedId(isExp ? null : inv.id)} style={{
                background: 'transparent', border: 'none', cursor: 'pointer',
                color: 'var(--clay-600)', fontSize: 13, padding: '10px 0 0',
                fontFamily: 'var(--f-body)', fontStyle: 'italic', display: 'inline-block',
              }}>{isExp ? '— hide notes' : `"${inv.note.slice(0, 56)}${inv.note.length > 56 ? '…' : ''}"`}</button>
              {isExp && (
                <p style={{
                  marginTop: 8, padding: 12, borderRadius: 'var(--r-md)',
                  background: 'var(--sand-50)', border: '1px solid var(--hairline)',
                  fontSize: 13, lineHeight: 1.5, color: 'var(--espresso-800)', fontStyle: 'italic',
                }}>"{inv.note}"</p>
              )}

              {inv.status === 'pending' ? (
                <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
                  <button onClick={() => accept(inv)} style={{
                    flex: 1, padding: '10px 12px', borderRadius: 999, border: 'none',
                    background: 'var(--sage-500)', color: 'var(--paper)',
                    fontFamily: 'var(--f-body)', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  }}>✓ Accept</button>
                  <button onClick={() => reject(inv)} style={{
                    padding: '10px 14px', borderRadius: 999,
                    background: 'transparent', color: 'var(--clay-600)',
                    border: '1px solid var(--hairline-strong)',
                    fontFamily: 'var(--f-body)', fontSize: 13, cursor: 'pointer',
                  }}>✗ Reject</button>
                  <button onClick={reassign} style={{
                    padding: '10px 14px', borderRadius: 999,
                    background: 'transparent', color: 'var(--clay-600)',
                    border: '1px solid var(--hairline-strong)',
                    fontFamily: 'var(--f-body)', fontSize: 13, cursor: 'pointer',
                  }}>→ Reassign</button>
                </div>
              ) : (
                <div style={{ marginTop: 14 }}>
                  <span className="mono" style={{
                    background: inv.status === 'accepted' ? 'var(--sage-200)' : 'var(--terracotta-200)',
                    color: inv.status === 'accepted' ? 'var(--sage-500)' : 'var(--terracotta-500)',
                    padding: '5px 12px', borderRadius: 999,
                    fontSize: 10, fontWeight: 700, letterSpacing: 1.5,
                  }}>{inv.status.toUpperCase()}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── CLIENTS LIST ────────────────────────────────────────────────────
function MobileClientsTab({ coach, clients, openClient }) {
  const statusMeta = {
    active: { label: 'ACTIVE',      bg: 'var(--sage-200)',       fg: 'var(--sage-500)',       dot: 'var(--sage-500)' },
    hold:   { label: 'ON HOLD',     bg: 'var(--sand-200)',       fg: 'var(--clay-600)',       dot: 'var(--clay-600)' },
    ending: { label: 'ENDING SOON', bg: 'var(--terracotta-200)', fg: 'var(--terracotta-500)', dot: 'var(--terracotta-500)' },
  };

  return (
    <div style={{ padding: 16, paddingBottom: 96 }}>
      <div className="mono" style={{
        color: 'var(--clay-600)', marginBottom: 10,
        display: 'inline-flex', alignItems: 'center', gap: 8,
      }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--ochre-500)' }} />
        MY CLIENTS · {clients.length} TOTAL
      </div>
      <h1 className="serif" style={{
        fontSize: 28, fontStyle: 'italic', margin: '0 0 18px',
        color: 'var(--espresso-900)', lineHeight: 1.1, letterSpacing: '-0.01em',
      }}>The people on your roster.</h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {clients.map(c => {
          const pct = Math.round((c.done / c.total) * 100);
          const meta = statusMeta[c.status];
          return (
            <div key={c.id} style={{
              background: 'var(--paper)', borderRadius: 'var(--r-lg)',
              border: '1px solid var(--hairline-strong)', boxShadow: 'var(--sh-1)',
              padding: 16, display: 'flex', flexDirection: 'column', gap: 12,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <CoachAvatar coach={{ initials: c.initials, tone: c.tone }} size={42} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: 'var(--f-body)', fontWeight: 600, fontSize: 15, color: 'var(--espresso-900)' }}>{c.name}</div>
                  <div className="mono" style={{ color: 'var(--clay-600)', fontSize: 9, marginTop: 2 }}>{c.programme.toUpperCase()}</div>
                </div>
                <span className="mono" style={{
                  background: meta.bg, color: meta.fg,
                  padding: '4px 10px', borderRadius: 999,
                  fontSize: 9, letterSpacing: 1.5, fontWeight: 700,
                  display: 'inline-flex', alignItems: 'center', gap: 5, whiteSpace: 'nowrap',
                }}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: meta.dot }} />
                  {meta.label}
                </span>
              </div>

              <div>
                <div className="mono" style={{ color: 'var(--clay-600)', fontSize: 10, marginBottom: 6, letterSpacing: 1.4 }}>
                  SESSION {c.done} / {c.total} · LAST {c.lastSession}
                </div>
                <div style={{ width: '100%', height: 4, background: 'var(--sand-200)', borderRadius: 999, overflow: 'hidden' }}>
                  <div style={{ width: pct + '%', height: '100%', background: 'var(--ochre-500)' }} />
                </div>
              </div>

              <button onClick={() => openClient(c)} style={{
                padding: '10px 14px', borderRadius: 999,
                background: 'var(--walnut-700)', color: 'var(--paper)', border: 'none',
                fontFamily: 'var(--f-body)', fontSize: 13, fontWeight: 500, cursor: 'pointer',
              }}>View profile</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── MOBILE CALENDAR (Agenda / 3-Day / Month) ────────────────────────
function MobileCalendarPage({ coach, events, onEventTap, onNewBlock }) {
  // calDate is anchored to the demo Apr-2026 week so events render.
  const [calDate, setCalDate] = mUseState(new Date(2026, 3, 20));
  const [calView, setCalView] = mUseState('3day');

  function shiftBy(days) {
    const d = new Date(calDate); d.setDate(d.getDate() + days); setCalDate(d);
  }
  function shiftMonth(n) {
    const d = new Date(calDate); d.setMonth(d.getMonth() + n); setCalDate(d);
  }
  const monthLabel = calDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const showToday = !isSameDay(calDate, DEMO_NOW);

  return (
    <div style={{ paddingBottom: 96 }}>
      {/* Sticky header */}
      <div style={{
        position: 'sticky', top: 56, zIndex: 12, background: 'var(--paper)',
        padding: '12px 16px', borderBottom: '1px solid var(--hairline)',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: 10, gap: 12,
        }}>
          <div className="serif" style={{
            fontSize: 24, fontStyle: 'italic', color: 'var(--espresso-900)', letterSpacing: '-0.01em',
          }}>{monthLabel}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <button aria-label="Previous" onClick={() => calView === 'month' ? shiftMonth(-1) : shiftBy(calView === '3day' ? -3 : -1)} style={iconBtn}>
              {ICON.chevL}
            </button>
            {showToday && (
              <button onClick={() => setCalDate(new Date(2026, 3, 20))} className="mono" style={{
                padding: '4px 10px', borderRadius: 999,
                background: 'var(--sand-100)', color: 'var(--clay-600)',
                border: '1px solid var(--hairline)',
                fontSize: 9, letterSpacing: 1.5, cursor: 'pointer',
              }}>TODAY</button>
            )}
            <button aria-label="Next" onClick={() => calView === 'month' ? shiftMonth(1) : shiftBy(calView === '3day' ? 3 : 1)} style={iconBtn}>
              {ICON.chevR}
            </button>
          </div>
        </div>

        {/* Segmented view switcher */}
        <div style={{
          display: 'flex',
          background: 'var(--sand-100)', borderRadius: 999, padding: 4, height: 32,
        }}>
          {[['day','AGENDA'], ['3day','3-DAY'], ['month','MONTH']].map(([id, label]) => {
            const active = calView === id;
            return (
              <button key={id} onClick={() => setCalView(id)} className="mono" style={{
                flex: 1, border: 'none', borderRadius: 999, cursor: 'pointer',
                background: active ? 'var(--paper)' : 'transparent',
                color:      active ? 'var(--walnut-700)' : 'var(--clay-600)',
                boxShadow:  active ? 'var(--sh-1)' : 'none',
                fontSize: 9, letterSpacing: 1.2, fontFamily: 'var(--f-mono)',
              }}>{label}</button>
            );
          })}
        </div>
      </div>

      {calView === 'day'   && <CalAgendaView   date={calDate} events={events} onTap={onEventTap} />}
      {calView === '3day'  && <CalThreeDayView date={calDate} events={events} onTap={onEventTap} onShift={shiftBy} />}
      {calView === 'month' && <CalMonthView    date={calDate} events={events} onPickDay={(d) => { setCalDate(d); setCalView('day'); }} />}

      <button onClick={onNewBlock} aria-label="Block time" style={{
        position: 'fixed', right: 16, bottom: 88, zIndex: 25,
        width: 56, height: 56, borderRadius: '50%',
        background: 'var(--walnut-700)', color: 'var(--paper)',
        border: 'none', cursor: 'pointer', boxShadow: 'var(--sh-3)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>{ICON.plus}</button>
    </div>
  );
}

const iconBtn = {
  width: 36, height: 36, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  borderRadius: 999, border: 'none', background: 'transparent',
  color: 'var(--clay-600)', cursor: 'pointer',
};

// ── Agenda view ──
function CalAgendaView({ date, events, onTap }) {
  const idx = dayIdxFor(date);
  const day = (events[idx] || []).slice().sort((a,b) => a.start - b.start);
  const totalMins = day.reduce((s, e) => s + (e.end - e.start), 0);
  const hours = (totalMins / 60).toFixed(totalMins % 60 ? 1 : 0);
  const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
  const dateLabel = date.toLocaleDateString('en-US', { day: 'numeric', month: 'long' });

  const isToday = isSameDay(date, DEMO_NOW);
  const nowMins = DEMO_NOW.getHours() * 60 + DEMO_NOW.getMinutes();

  return (
    <div>
      <div style={{ padding: '14px 16px 8px' }}>
        <div style={{ fontFamily: 'var(--f-body)', fontWeight: 600, fontSize: 16, color: 'var(--espresso-900)' }}>
          {dayName}, {dateLabel}
        </div>
        <div className="mono" style={{ color: 'var(--clay-600)', fontSize: 9, marginTop: 3, letterSpacing: 1.4 }}>
          {day.length} {day.length === 1 ? 'EVENT' : 'EVENTS'} · {hours}H SCHEDULED
        </div>
      </div>

      {day.length === 0 && (
        <div style={{ padding: '48px 24px', textAlign: 'center' }}>
          <div className="mono" style={{ color: 'var(--clay-600)', marginBottom: 6 }}>NO EVENTS</div>
          <div style={{ fontSize: 13, color: 'var(--clay-600)', fontStyle: 'italic' }}>You're free today. Enjoy.</div>
        </div>
      )}

      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {day.map(ev => {
          const status = statusFor(ev);
          const currentLine = isToday && nowMins >= ev.start && nowMins <= ev.end;
          return (
            <button key={ev.id} onClick={() => onTap && onTap(ev, idx)} style={{
              all: 'unset', cursor: 'pointer',
              background: 'var(--paper)', borderRadius: 'var(--r-md)',
              padding: '12px 14px', border: '1px solid var(--hairline)',
              display: 'grid', gridTemplateColumns: '64px 1fr', gap: 14,
              position: 'relative', overflow: 'hidden',
            }}>
              <div>
                <div className="mono" style={{ color: 'var(--espresso-900)', fontSize: 11, letterSpacing: 0.5, fontWeight: 600 }}>
                  {fmtMobileTime(ev.start)}
                </div>
                <div className="mono" style={{ color: 'var(--clay-600)', fontSize: 9, marginTop: 2 }}>
                  {ev.end - ev.start} MIN
                </div>
              </div>
              <div style={{
                borderLeft: '3px solid ' + kindBorderColor(ev.kind),
                paddingLeft: 12, minWidth: 0,
              }}>
                <div style={{
                  fontWeight: 600, fontSize: 14, color: 'var(--espresso-900)',
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>{ev.title.replace(/^(PT|Group|Invite|Off)\s*·\s*/, '')}</div>
                <div className="mono" style={{ color: 'var(--clay-600)', fontSize: 9, marginTop: 3, letterSpacing: 1.2 }}>
                  {eventKindLabel(ev.kind).toUpperCase()}
                </div>
              </div>
              <span className="mono" style={{
                position: 'absolute', top: 12, right: 12,
                background: status.bg, color: status.fg,
                padding: '3px 8px', borderRadius: 999,
                fontSize: 9, fontWeight: 700, letterSpacing: 1.2,
              }}>{status.label}</span>
              {currentLine && (
                <div style={{
                  position: 'absolute', left: 0, right: 0, bottom: -1, height: 2,
                  background: 'var(--terracotta-500)',
                }} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── 3-Day view ──
function CalThreeDayView({ date, events, onTap, onShift }) {
  const HOUR_PX = 56;
  const START_H = 6, END_H = 21;
  const hours = []; for (let h = START_H; h <= END_H; h++) hours.push(h);
  const days = [0,1,2].map(i => { const d = new Date(date); d.setDate(d.getDate() + i); return d; });
  const nowMins = DEMO_NOW.getHours() * 60 + DEMO_NOW.getMinutes();

  return (
    <div>
      {/* Day headers */}
      <div style={{
        position: 'sticky', top: 'calc(56px + 84px)', zIndex: 8,
        display: 'grid', gridTemplateColumns: '52px repeat(3, 1fr)',
        background: 'var(--paper)', borderBottom: '1px solid var(--hairline)',
      }}>
        <div />
        {days.map((d, i) => {
          const today = isSameDay(d, DEMO_NOW);
          return (
            <div key={i} style={{ padding: '10px 0', textAlign: 'center', borderLeft: '1px solid var(--hairline)' }}>
              <div className="mono" style={{ color: 'var(--clay-600)', fontSize: 9, letterSpacing: 1.2 }}>
                {d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()}
              </div>
              <div style={{
                fontFamily: 'var(--f-body)', fontWeight: 600, fontSize: 18,
                color: today ? 'var(--ochre-500)' : 'var(--espresso-900)', marginTop: 2,
              }}>{d.getDate()}</div>
            </div>
          );
        })}
      </div>

      {/* Swipe handlers via simple buttons */}
      <div style={{
        display: 'grid', gridTemplateColumns: '52px repeat(3, 1fr)',
        position: 'relative', minHeight: hours.length * HOUR_PX,
      }}>
        <div>
          {hours.map(h => (
            <div key={h} className="mono" style={{
              height: HOUR_PX, padding: '4px 6px 0 0',
              fontSize: 9, color: 'var(--clay-600)', textAlign: 'right',
              letterSpacing: 1,
            }}>{fmtMobileTime(h * 60).replace(':00 ', ' ')}</div>
          ))}
        </div>
        {days.map((d, di) => {
          const idx = dayIdxFor(d);
          const dayEv = (events[idx] || []);
          const isToday = isSameDay(d, DEMO_NOW);
          return (
            <div key={di} style={{
              borderLeft: '1px solid var(--hairline)', position: 'relative',
              minHeight: hours.length * HOUR_PX,
            }}>
              {hours.map(h => (
                <div key={h} style={{ height: HOUR_PX, borderTop: '1px solid var(--hairline)' }} />
              ))}
              {isToday && nowMins >= START_H * 60 && nowMins <= END_H * 60 && (
                <div style={{
                  position: 'absolute', left: 0, right: 0,
                  top: ((nowMins - START_H * 60) / 60) * HOUR_PX,
                  height: 2, background: 'var(--terracotta-500)', zIndex: 4,
                }} />
              )}
              {dayEv.map(ev => {
                const start = Math.max(ev.start, START_H * 60);
                const end = Math.min(ev.end, END_H * 60 + 60);
                if (end <= start) return null;
                const top = ((start - START_H * 60) / 60) * HOUR_PX;
                const h = Math.max(22, ((end - start) / 60) * HOUR_PX - 2);
                return (
                  <button key={ev.id} onClick={() => onTap && onTap(ev, idx)} style={{
                    position: 'absolute', top, height: h,
                    left: '2.5%', width: '95%',
                    background: kindTintBg(ev.kind),
                    borderLeft: '3px solid ' + kindBorderColor(ev.kind),
                    borderRadius: 6, padding: '4px 6px',
                    cursor: 'pointer', textAlign: 'left',
                    overflow: 'hidden', border: '1px solid rgba(0,0,0,0.04)',
                    borderLeftWidth: 3,
                    display: 'flex', flexDirection: 'column', gap: 1,
                  }}>
                    <span className="mono" style={{ fontSize: 8, color: 'var(--espresso-800)', letterSpacing: 0.5 }}>
                      {fmtMobileTime(ev.start)}
                    </span>
                    <span style={{
                      fontWeight: 600, fontSize: 11, color: 'var(--espresso-900)',
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                      lineHeight: 1.2,
                    }}>{ev.title.replace(/^(PT|Group|Invite|Off)\s*·\s*/, '')}</span>
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Month view ──
function CalMonthView({ date, events, onPickDay }) {
  const y = date.getFullYear(), m = date.getMonth();
  const first = new Date(y, m, 1);
  // Start from Sunday of the week containing the 1st
  const startGrid = new Date(first);
  startGrid.setDate(first.getDate() - first.getDay());
  const cells = []; for (let i = 0; i < 42; i++) {
    const d = new Date(startGrid); d.setDate(startGrid.getDate() + i); cells.push(d);
  }

  function eventsForDate(d) {
    // Map the demo events (keyed 0..6 from Mon Apr 20) onto real dates in the week of Apr 20
    const diff = Math.floor((startOfDay(d) - startOfDay(WEEK_START)) / 86400000);
    if (diff >= 0 && diff < 7) return events[diff] || [];
    return [];
  }

  return (
    <div>
      {/* DOW header */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)',
        background: 'var(--paper)', borderBottom: '1px solid var(--hairline)',
      }}>
        {['S','M','T','W','T','F','S'].map((d, i) => (
          <div key={i} className="mono" style={{
            padding: '10px 0', textAlign: 'center',
            color: 'var(--clay-600)', fontSize: 9, letterSpacing: 1.2,
          }}>{d}</div>
        ))}
      </div>

      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)',
        gridAutoRows: 'minmax(76px, 1fr)',
      }}>
        {cells.map((d, i) => {
          const inMonth = d.getMonth() === m;
          const today = isSameDay(d, DEMO_NOW);
          const dayEv = eventsForDate(d);
          return (
            <button key={i} onClick={() => onPickDay(d)} style={{
              all: 'unset', cursor: 'pointer',
              borderRight: '1px solid var(--hairline)',
              borderBottom: '1px solid var(--hairline)',
              padding: 6, minHeight: 76, display: 'flex', flexDirection: 'column', gap: 3,
              background: inMonth ? 'var(--paper)' : 'var(--sand-50)',
              opacity: inMonth ? 1 : 0.6,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                <span style={{
                  width: 22, height: 22, borderRadius: '50%',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 500,
                  background: today ? 'var(--ochre-500)' : 'transparent',
                  color: today ? 'var(--espresso-900)' : (inMonth ? 'var(--espresso-900)' : 'var(--clay-600)'),
                }}>{d.getDate()}</span>
              </div>
              {dayEv.slice(0, 3).map(ev => (
                <div key={ev.id} style={{
                  height: 4, borderRadius: 2,
                  background: kindBorderColor(ev.kind),
                  width: '100%',
                }} />
              ))}
              {dayEv.length > 3 && (
                <div className="mono" style={{ color: 'var(--clay-600)', fontSize: 8, letterSpacing: 0.6 }}>
                  +{dayEv.length - 3}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── MORE bottom sheet ───────────────────────────────────────────────
function MobileMoreSheet({ coach, isAdmin, onClose, onPick, onLogout, onSwitchCoach }) {
  const sections = [
    { title: 'ACCOUNT', rows: [
      { id: 'profile',      icon: ICON.user,   label: 'My Profile',     sub: 'Photo, bio, ratings' },
      { id: 'integrations', icon: ICON.plug,   label: 'Integrations',   sub: 'Google Calendar sync' },
    ]},
    { title: 'COACHING', rows: [
      { id: 'clients',  icon: ICON.users, label: 'My Clients',     sub: 'Roster, sessions, notes' },
      { id: 'peers',    icon: ICON.peer,  label: 'Peer Calendars', sub: 'See teammate schedules' },
      { id: 'block',    icon: ICON.lock,  label: 'Block Time',     sub: 'Add unavailability' },
    ]},
  ];
  if (isAdmin) {
    sections.push({ title: 'ADMIN', rows: [
      { id: 'admin', icon: ICON.shield, label: 'Admin Panel', sub: 'Tablet / desktop only ↗', dim: true },
    ]});
  }
  sections.push({ title: 'SESSION', rows: [
    { id: 'switch', icon: ICON.swap,    label: 'Switch coach (demo)' },
    { id: 'signout',icon: ICON.signOut, label: 'Sign out', danger: true },
  ]});

  function handle(id) {
    if (id === 'switch')  { onClose(); onSwitchCoach(); return; }
    if (id === 'signout') { onClose(); onLogout();      return; }
    onPick(id); // also closes
  }

  return (
    <>
      <div onClick={onClose} style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: 'rgba(36,24,16,0.5)',
        animation: 'mfade .15s ease',
      }} />
      <div role="dialog" aria-modal="true" style={{
        position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 101,
        background: 'var(--paper)',
        borderTopLeftRadius: 'var(--r-xl)', borderTopRightRadius: 'var(--r-xl)',
        maxHeight: '80vh', overflowY: 'auto',
        paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 12px)',
        boxShadow: '0 -8px 32px rgba(0,0,0,0.18)',
        animation: 'msheetUp .22s cubic-bezier(0.2, 0.8, 0.2, 1)',
      }}>
        <div style={{ width: 36, height: 4, background: 'var(--clay-600)', opacity: 0.4, borderRadius: 999, margin: '12px auto 8px' }} />
        <div style={{ padding: '4px 24px 16px' }}>
          <div className="mono" style={{ color: 'var(--clay-600)', fontSize: 9, letterSpacing: 1.5 }}>MORE</div>
          <div style={{ fontFamily: 'var(--f-body)', fontSize: 14, color: 'var(--espresso-900)', marginTop: 2 }}>
            {coach.name}
          </div>
        </div>

        {sections.map((sec, sIdx) => (
          <div key={sec.title} style={{ padding: '0 24px', marginBottom: 8 }}>
            <div className="mono" style={{
              color: 'var(--clay-600)', fontSize: 9, letterSpacing: 1.5,
              padding: '16px 0 6px',
            }}>─── {sec.title} ───</div>
            <div>
              {sec.rows.map((row, rIdx) => (
                <button key={row.id} onClick={() => handle(row.id)} style={{
                  width: '100%', background: 'transparent', border: 'none', cursor: 'pointer',
                  textAlign: 'left', padding: '14px 0',
                  borderTop: rIdx === 0 ? 'none' : '1px solid var(--hairline)',
                  display: 'flex', alignItems: 'center', gap: 14,
                  color: row.danger ? 'var(--terracotta-500)' : 'var(--espresso-900)',
                  opacity: row.dim ? 0.7 : 1,
                }}>
                  <span style={{
                    width: 20, height: 20, color: row.danger ? 'var(--terracotta-500)' : 'var(--clay-600)',
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>{row.icon}</span>
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 500 }}>{row.label}</div>
                    {row.sub && (
                      <div className="mono" style={{
                        color: 'var(--clay-600)', fontSize: 9, letterSpacing: 1.2, marginTop: 2,
                      }}>{row.sub}</div>
                    )}
                  </span>
                  <span style={{ color: 'var(--clay-600)', flexShrink: 0 }}>{ICON.chevRowR}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes mfade   { from {opacity:0} to {opacity:1} }
        @keyframes msheetUp{ from {transform: translateY(20px); opacity:0} to {transform: translateY(0); opacity:1} }
      `}</style>
    </>
  );
}

// ─── Mobile back-bar wrapper for re-used desktop pages ──────────────
function MobileSubpage({ title, onBack, dense, children }) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--sand-50)' }}>
      <div style={{
        position: 'sticky', top: 56, zIndex: 12,
        background: 'var(--paper)', borderBottom: '1px solid var(--hairline)',
        padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <button onClick={onBack} aria-label="Back" style={{
          width: 32, height: 32, borderRadius: 999, border: 'none',
          background: 'var(--sand-100)', color: 'var(--walnut-700)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer',
        }}>{ICON.chevL}</button>
        <div className="serif" style={{
          fontSize: 18, fontStyle: 'italic', color: 'var(--espresso-900)',
        }}>{title}</div>
      </div>
      <div style={{ padding: dense ? '8px 12px 96px' : '16px 16px 96px' }}>
        {children}
      </div>
    </div>
  );
}

// ─── Mobile shell — orchestrator ─────────────────────────────────────
function MobileShell(props) {
  const {
    coach, clients, invites, setInvites, events, setEvents,
    adminData, toast, onLogout,
  } = props;

  const [mobileTab, setMobileTab] = mUseState('home');
  const [moreSheetOpen, setMoreSheetOpen] = mUseState(false);

  // Allow parent preview page to jump to a tab via postMessage
  mUseEffect(() => {
    function handler(e) {
      if (e.data && e.data.type === 'jumpMobileTab') {
        const t = e.data.tab;
        setMoreSheetOpen(t === 'more');
        if (t !== 'more') setMobileTab(t);
      }
    }
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);
  const [openClientObj, setOpenClientObj] = mUseState(null);
  const [gate, setGate] = mUseState(null);
  const [showBlock, setShowBlock] = mUseState(false);
  const [selectedEvent, setSelectedEvent] = mUseState(null);
  const pendingCount = invites.filter(i => i.status === 'pending').length;

  // primaryActive — which bottom-nav tab to highlight
  const primaryActive =
    moreSheetOpen ? 'more'
    : PRIMARY_TABS.includes(mobileTab) ? mobileTab
    : 'more';

  function handlePrimary(id) {
    setMoreSheetOpen(false);
    setOpenClientObj(null);
    setMobileTab(id);
  }
  function handleMoreOpen() { setMoreSheetOpen(true); }
  function handleMorePick(id) {
    setMoreSheetOpen(false);
    if (id === 'block') { setShowBlock(true); return; }
    if (id === 'admin') { setGate('Admin panel'); return; }
    setOpenClientObj(null);
    setMobileTab(id);
  }

  // SoftGate full viewport
  if (gate) return <SoftGate feature={gate} onBack={() => setGate(null)} />;

  // Client profile overlay (read-only)
  if (openClientObj && window.ClientProfile) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--sand-50)' }}>
        <MobileTopBar coach={coach} onLogout={onLogout} onLogoTap={() => { setOpenClientObj(null); setMobileTab('home'); }} />
        <div style={{ padding: '12px 16px 96px' }}>
          <button onClick={() => setOpenClientObj(null)} style={{
            background: 'transparent', border: 'none', color: 'var(--walnut-700)',
            fontFamily: 'var(--f-body)', fontSize: 14, cursor: 'pointer',
            padding: '8px 0 14px', display: 'inline-flex', alignItems: 'center', gap: 6,
          }}>← Clients</button>
          <div className="mono" style={{
            background: 'var(--sand-200)', color: 'var(--walnut-700)',
            padding: '8px 12px', borderRadius: 'var(--r-md)',
            fontSize: 9, letterSpacing: 1.4, marginBottom: 14,
            border: '1px solid var(--hairline)',
          }}>📱 READ-FRIENDLY VIEW · OPEN ON TABLET/DESKTOP TO EDIT OVERRIDES</div>
          <window.ClientProfile client={openClientObj} onBack={() => setOpenClientObj(null)} readOnly={true} compact={true} />
        </div>
        <MobileBottomNav tab={mobileTab} primaryActive={'clients' === mobileTab ? 'more' : primaryActive}
          onPrimaryTap={handlePrimary} onMoreTap={handleMoreOpen} pendingCount={pendingCount} />
      </div>
    );
  }

  // Pick body
  let body = null;
  if (mobileTab === 'home') {
    body = (
      <MobileHomeTab coach={coach} events={events} clients={clients}
        openClient={(c) => setOpenClientObj(c)}
        onJumpToCalendar={() => setMobileTab('calendar')} />
    );
  } else if (mobileTab === 'calendar') {
    body = (
      <MobileCalendarPage coach={coach} events={events}
        onEventTap={(ev, di) => setSelectedEvent({ ev, dayIdx: di })}
        onNewBlock={() => setShowBlock(true)} />
    );
  } else if (mobileTab === 'invites') {
    body = <MobileInvitesTab invites={invites} setInvites={setInvites} toast={toast} />;
  } else if (mobileTab === 'clients') {
    body = (
      <MobileSubpage title="My Clients" onBack={() => setMobileTab('home')}>
        <MobileClientsTab coach={coach} clients={clients}
          openClient={(c) => setOpenClientObj(c)} />
      </MobileSubpage>
    );
  } else if (mobileTab === 'profile') {
    body = (
      <MobileSubpage title="My Profile" onBack={() => setMobileTab('home')} dense>
        <MobilePlaceholder
          label="Profile editor"
          msg="The full editor is rich on desktop. Lite mobile edit lands in v2.1."
        />
      </MobileSubpage>
    );
  } else if (mobileTab === 'integrations') {
    body = (
      <MobileSubpage title="Integrations" onBack={() => setMobileTab('home')} dense>
        <MobilePlaceholder
          label="Google Calendar sync"
          msg="Tap below to send the connection link to your email and finish on desktop."
          cta="Email myself this link →"
        />
      </MobileSubpage>
    );
  } else if (mobileTab === 'peers') {
    body = (
      <MobileSubpage title="Peer Calendars" onBack={() => setMobileTab('home')} dense>
        <MobilePlaceholder
          label="Read-only peer view"
          msg="Peer calendars are best on a wider screen. Tablet shows everyone side-by-side."
        />
      </MobileSubpage>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--sand-50)' }}>
      <MobileTopBar coach={coach} onLogout={onLogout} onLogoTap={() => setMobileTab('home')} />
      {body}
      <MobileBottomNav
        tab={mobileTab} primaryActive={primaryActive}
        onPrimaryTap={handlePrimary} onMoreTap={handleMoreOpen}
        pendingCount={pendingCount}
      />
      {moreSheetOpen && (
        <MobileMoreSheet
          coach={coach} isAdmin={!!adminData}
          onClose={() => setMoreSheetOpen(false)}
          onPick={handleMorePick}
          onLogout={onLogout}
          onSwitchCoach={onLogout}
        />
      )}
      {showBlock && window.BlockTimeModal && (
        <window.BlockTimeModal onClose={() => setShowBlock(false)} onSave={(blk) => {
          if (setEvents) {
            setEvents(prev => ({ ...prev, [blk.dayIdx]: [...(prev[blk.dayIdx] || []), blk.ev] }));
          }
          setShowBlock(false);
          toast("Time blocked — members won't see this slot");
        }} />
      )}
      {selectedEvent && window.EventDrawer && (
        <window.EventDrawer selected={selectedEvent} onClose={() => setSelectedEvent(null)} onDelete={() => setSelectedEvent(null)} />
      )}
      <OrientationHint />
    </div>
  );
}

// Tiny placeholder card for sub-pages we don't fully re-skin for mobile yet
function MobilePlaceholder({ label, msg, cta }) {
  return (
    <div style={{
      background: 'var(--paper)', border: '1px solid var(--hairline)',
      borderRadius: 'var(--r-lg)', padding: 24, textAlign: 'center',
    }}>
      <div className="mono" style={{ color: 'var(--clay-600)', marginBottom: 10 }}>{label.toUpperCase()}</div>
      <p style={{
        margin: '0 0 20px', color: 'var(--espresso-800)', fontSize: 14, lineHeight: 1.55,
      }}>{msg}</p>
      {cta && (
        <a href="mailto:?subject=Open M3S on desktop&body=https://mythirdspace.fit/coach-universe.html" style={{
          display: 'inline-block', padding: '10px 18px', borderRadius: 999,
          background: 'var(--walnut-700)', color: 'var(--paper)',
          fontFamily: 'var(--f-body)', fontSize: 13, fontWeight: 500, textDecoration: 'none',
        }}>{cta}</a>
      )}
    </div>
  );
}

// Expose to coach-universe.jsx
Object.assign(window, {
  useMediaQuery, BP,
  MobileShell, SoftGate, OrientationHint, MobileCalendarPage,
});
