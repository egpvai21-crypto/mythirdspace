// Hero, About, Founder, Services, Testimonials sections
const { useState: useS1, useEffect: useE1 } = React;

// — Nav icons (inline SVG, currentColor) ————————————————————————
// All icons: 24×24 viewBox, 1.5px stroke, round caps/joins, no fill (matches
// the editorial line style of the existing <Icon /> set in ui.jsx).
const NavIcon = {
  home: (s = 22) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3.5 10.8 12 4l8.5 6.8V19a1.5 1.5 0 0 1-1.5 1.5h-4V14h-6v6.5H5A1.5 1.5 0 0 1 3.5 19v-8.2z"/>
    </svg>
  ),
  // About / "What is M3S" — three overlapping circles, the third-space mark.
  about: (s = 22) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8.4" cy="10" r="4.6"/>
      <circle cx="15.6" cy="10" r="4.6"/>
      <circle cx="12" cy="15.4" r="4.6"/>
    </svg>
  ),
  // Founder / "Shwe" — a single person bust inside a soft frame (distinct from `trainers`, which is multiple).
  founder: (s = 22) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="9.2" r="3.2"/>
      <path d="M5.8 20c.7-3.4 3.2-5.1 6.2-5.1s5.5 1.7 6.2 5.1"/>
      <path d="M3.5 12a8.5 8.5 0 1 1 17 0"/>
    </svg>
  ),
  services: (s = 22) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 6.5h12M8 12h12M8 17.5h12"/>
      <circle cx="4.2" cy="6.5" r="1.1"/><circle cx="4.2" cy="12" r="1.1"/><circle cx="4.2" cy="17.5" r="1.1"/>
    </svg>
  ),
  trainers: (s = 22) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="8.2" r="3"/>
      <path d="M3.4 19c.6-3 3-4.5 5.6-4.5s5 1.5 5.6 4.5"/>
      <circle cx="16.6" cy="6.4" r="2.3"/>
      <path d="M15 14.4c.6-.7 1.5-1 2-1 2.1 0 3.8 1.3 4.3 3.1"/>
    </svg>
  ),
  book: (s = 22) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3.5" y="5.5" width="17" height="15" rx="2.5"/>
      <path d="M3.5 10h17M8 3.5v4M16 3.5v4"/>
      <circle cx="12" cy="15" r="1.4" fill="currentColor" stroke="none"/>
    </svg>
  ),
  // Kenko — a bowl with steam (cafe / food side of the studio).
  kenko: (s = 22) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12.5h18a8.4 8.4 0 0 1-8.4 7H11.4A8.4 8.4 0 0 1 3 12.5z"/>
      <path d="M9 4.5c-.8 1 -.8 2 0 3M12 4c-.8 1 -.8 2 0 3M15 4.5c-.8 1 -.8 2 0 3"/>
    </svg>
  ),
  // Social — speech bubble.
  social: (s = 22) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.5 12a8 8 0 0 1-11.6 7.1L4 20.5l1.4-4.6A8 8 0 1 1 20.5 12z"/>
    </svg>
  ),
  user: (s = 22) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="9" r="3.5"/><path d="M5.5 19c1-3 3.5-4.5 6.5-4.5s5.5 1.5 6.5 4.5"/>
    </svg>
  ),
};

const NAV_ITEMS = [
  { id: "home",     label: "Home",     icon: NavIcon.home },
  { id: "about",    label: "About",    icon: NavIcon.about },
  { id: "founder",  label: "Shwe",     icon: NavIcon.founder },
  { id: "services", label: "Services", icon: NavIcon.services },
  { id: "trainers", label: "Trainers", icon: NavIcon.trainers },
  { id: "book",     label: "Book",     icon: NavIcon.book },
  { id: "kenko",    label: "Kenko",    icon: NavIcon.kenko },
  { id: "social",   label: "Social",   icon: NavIcon.social },
];

function ProfileMenu({ user, onMyProfile, onSignOut, onSignIn }) {
  const [open, setOpen] = useS1(false);
  const ref = React.useRef(null);
  useE1(() => {
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  if (!user) {
    return (
      <button onClick={onSignIn} style={{
        background: "transparent", border: "1px solid var(--hairline-strong)",
        padding: "8px 14px", borderRadius: "var(--r-pill)", cursor: "pointer",
        fontFamily: "var(--f-body)", fontSize: 13, fontWeight: 600, color: "var(--walnut-700)",
        whiteSpace: "nowrap",
      }}>Sign in</button>
    );
  }

  const initials = (user.name || "U").trim().split(/\s+/).map(w => w[0]).slice(0, 2).join("").toUpperCase();

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button onClick={() => setOpen(v => !v)} aria-label="Profile menu" style={{
        width: 38, height: 38, borderRadius: "50%",
        background: "var(--espresso-900)", color: "var(--paper)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "var(--f-body)", fontSize: 13, fontWeight: 700,
        border: "none", cursor: "pointer", letterSpacing: 0.4,
        boxShadow: "var(--sh-1)",
      }}>{initials}</button>

      {open && (
        <div style={{
          position: "absolute", right: 0, top: "calc(100% + 10px)", zIndex: 100,
          background: "var(--paper)", border: "1px solid var(--hairline-strong)",
          borderRadius: 14, boxShadow: "var(--sh-3)",
          minWidth: 240, padding: 8, fontFamily: "var(--f-body)",
        }}>
          {/* User block */}
          <div style={{ padding: "10px 12px 12px", borderBottom: "1px solid var(--hairline)" }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--espresso-900)" }}>{user.name}</div>
            <div style={{ fontSize: 11.5, color: "var(--clay-600)", marginTop: 2, fontFamily: "var(--f-mono)", letterSpacing: 0.4 }}>
              {user.phone || user.email || "Member"}
            </div>
          </div>
          <button onClick={() => { setOpen(false); onMyProfile(); }} style={menuItemStyle}>
            <span style={{ display: "inline-flex" }}>{NavIcon.user(16)}</span> My profile
          </button>
          <button onClick={() => { setOpen(false); onSignOut(); }} style={{ ...menuItemStyle, color: "var(--clay-600)" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>
            </svg> Sign out
          </button>
        </div>
      )}
    </div>
  );
}

const menuItemStyle = {
  display: "flex", alignItems: "center", gap: 10,
  width: "100%", textAlign: "left",
  padding: "10px 12px", border: "none", background: "transparent",
  fontFamily: "var(--f-body)", fontSize: 13.5, color: "var(--espresso-900)",
  cursor: "pointer", borderRadius: 8,
};

function Nav({ active, onNav, onBook, user, onSignIn, onSignOut, onMyProfile }) {
  const [isMobile, setIsMobile] = useS1(() => typeof window !== "undefined" && window.innerWidth < 960);
  const [scrolled, setScrolled] = useS1(false);

  useE1(() => {
    const onResize = () => setIsMobile(window.innerWidth < 960);
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => { window.removeEventListener("resize", onResize); window.removeEventListener("scroll", onScroll); };
  }, []);

  const navBg = scrolled ? "rgba(251,247,240,0.94)" : "rgba(251,247,240,0.82)";
  const navBorder = scrolled ? "1px solid var(--hairline)" : "1px solid transparent";

  return (
    <>
    {/* DESKTOP: top nav — logo + icon-only center + profile/CTA right. Sticky, always visible. */}
    {/* MOBILE: top bar — logo + Book + profile avatar. Always visible. */}
    <nav style={{
      position: "sticky", top: 0, zIndex: 50,
      background: navBg,
      backdropFilter: "saturate(140%) blur(14px)",
      WebkitBackdropFilter: "saturate(140%) blur(14px)",
      borderBottom: navBorder,
      transition: "background .2s ease, border-color .2s ease",
    }}>
      <div style={{
        maxWidth: 1240, margin: "0 auto",
        padding: isMobile ? "12px 18px" : "16px 32px",
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
      }}>
        <button
          onClick={() => onNav("home")}
          style={{ background: "transparent", border: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center", gap: 10 }}
          aria-label="My Third Space — home"
        >
          <M3SLogo size={isMobile ? 28 : 34} color="var(--walnut-700)" />
        </button>

        {/* Desktop center: icon + label nav */}
        {!isMobile && (
          <div style={{
            display: "flex", gap: 2, alignItems: "stretch",
            background: "var(--sand-100)", padding: 6, borderRadius: 18,
            border: "1px solid var(--hairline)",
          }}>
            {NAV_ITEMS.map((it) => {
              const isActive = active === it.id;
              return (
                <button key={it.id}
                  onClick={() => onNav(it.id)}
                  aria-label={it.label}
                  style={{
                    minWidth: 56, padding: "6px 9px 5px",
                    border: "none", borderRadius: 12,
                    background: isActive ? "var(--paper)" : "transparent",
                    color: isActive ? "var(--walnut-700)" : "var(--espresso-800)",
                    display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
                    cursor: "pointer",
                    boxShadow: isActive ? "var(--sh-1)" : "none",
                    transition: "all .15s",
                  }}
                >
                  {it.icon(20)}
                  <span style={{
                    fontFamily: "var(--f-mono)", fontSize: 9.5, letterSpacing: 1.3,
                    textTransform: "uppercase", fontWeight: isActive ? 600 : 500,
                    lineHeight: 1,
                  }}>{it.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Right cluster */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {!isMobile && (
            <Btn size="sm" onClick={onBook} icon={<Icon name="arrow" size={14} color="currentColor" />}>Book a Session</Btn>
          )}
          {isMobile && (
            <button onClick={onBook} style={{
              border: "1px solid var(--walnut-700)",
              background: "var(--walnut-700)", color: "var(--paper)",
              padding: "8px 14px", borderRadius: "var(--r-pill)", cursor: "pointer",
              fontFamily: "var(--f-body)", fontSize: 12.5, fontWeight: 600,
              letterSpacing: 0.2, whiteSpace: "nowrap",
            }}>Book</button>
          )}
          <ProfileMenu user={user} onSignIn={onSignIn} onSignOut={onSignOut} onMyProfile={onMyProfile} />
        </div>
      </div>
    </nav>

    {/* MOBILE bottom nav — fixed, icons + label, always visible */}
    {isMobile && <MobileBottomNav active={active} onNav={onNav} />}
    </>
  );
}

function MobileBottomNav({ active, onNav }) {
  return (
    <div style={{
      position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 49,
      background: "rgba(251,247,240,0.96)",
      backdropFilter: "saturate(140%) blur(14px)",
      WebkitBackdropFilter: "saturate(140%) blur(14px)",
      borderTop: "1px solid var(--hairline)",
      boxShadow: "0 -4px 16px rgba(62,44,28,0.06)",
      display: "flex", alignItems: "stretch",
      paddingBottom: "env(safe-area-inset-bottom, 8px)",
      paddingTop: 6,
    }}>
      {NAV_ITEMS.map((it) => {
        const isActive = active === it.id;
        const color = isActive ? "var(--walnut-700)" : "var(--clay-600)";
        return (
          <button key={it.id}
            onClick={() => onNav(it.id)}
            style={{
              flex: 1, minWidth: 0,
              border: "none", background: "transparent",
              padding: "6px 0 10px",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
              cursor: "pointer", color, position: "relative",
              opacity: isActive ? 1 : 0.75,
            }}
          >
            {isActive && (
              <span style={{
                position: "absolute", top: 0, width: 22, height: 2,
                background: "var(--walnut-700)", borderRadius: 2,
              }} />
            )}
            {it.icon(22)}
            <span style={{
              fontFamily: "var(--f-mono)", fontSize: 9, letterSpacing: 1.4,
              textTransform: "uppercase", fontWeight: 500,
            }}>{it.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function Hero({ onExplore, onBook, onGetStarted, isLoggedIn = false, variant = "third-space" }) {
  // Default routing: logged out → onboarding, logged in → dashboard.
  // Parent can override via onGetStarted prop.
  onGetStarted = onGetStarted || (() => {
    if (isLoggedIn) console.log("[route] → /dashboard");
    else console.log("[route] → /onboarding");
  });
  const variants = {
    "third-space": { pre: "Home, work,", em: "My Third Space." },
    "future-self": { pre: "Train for your", em: "future self." },
    "welcome":     { pre: "Welcome to", em: "my third space." },
  };
  const v = variants[variant] || variants["third-space"];
  const stats = [
    { v: "11", l: "Coaches, each certified" },
    { v: "<20", l: "Members per class" },
    { v: "110+", l: "Hyrox finishers so far" },
    { v: "400+", l: "Members, growing slowly on purpose" },
  ];
  return (
    <section id="home" style={{ position: "relative", padding: "28px 32px 40px", minHeight: "calc(100vh - 80px)", display: "flex", flexDirection: "column" }}>
      <div style={{ maxWidth: 1320, margin: "0 auto", width: "100%", flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Eyebrow row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 16 }}>
          <div style={{ fontFamily: "var(--f-mono)", fontSize: 11, letterSpacing: 2.5, textTransform: "uppercase", color: "var(--clay-600)" }}>
            Indiranagar · Bengaluru
          </div>
          <div style={{ fontFamily: "var(--f-mono)", fontSize: 11, letterSpacing: 2.5, textTransform: "uppercase", color: "var(--clay-600)" }}>
            Open today · 5:30 AM – 9:30 PM
          </div>
        </div>

        {/* Headline + image side-by-side */}
        <div style={{ display: "grid", gridTemplateColumns: "1.05fr 1fr", gap: 48, alignItems: "stretch", flex: 1, minHeight: 0 }}>
          {/* Left column: heading, copy, CTAs */}
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", paddingBottom: 8 }}>
            <h1 style={{
              fontFamily: "var(--f-display)", fontWeight: 400,
              fontSize: "clamp(56px, 7.2vw, 116px)", lineHeight: 0.95, letterSpacing: -2,
              color: "var(--espresso-900)", margin: 0,
            }}>
              {v.pre}<br />
              <em style={{ fontStyle: "italic", color: "var(--walnut-700)" }}>{v.em}</em>
            </h1>
            <p style={{ fontSize: 18, lineHeight: 1.55, color: "var(--espresso-800)", margin: "28px 0 0", maxWidth: 440 }}>
              A holistic studio in the quiet middle of your week — where movement, breath, and measurement meet.
            </p>
            <div style={{ display: "flex", gap: 12, marginTop: 24, flexWrap: "wrap", alignItems: "center" }}>
              <Btn onClick={onBook}>Book a session</Btn>
              <Btn variant="secondary" onClick={onGetStarted}>
                Get started →
              </Btn>
            </div>
          </div>

          {/* Right column: hero image — soft rounded corners, no border, full opacity */}
          <div style={{ position: "relative", minHeight: 460, alignSelf: "stretch", borderRadius: 28, overflow: "hidden" }}>
            <img
              src="assets/hero-studio-vertical.jpg"
              alt="M3S studio interior — the runway"
              style={{
                position: "absolute", inset: 0, width: "100%", height: "100%",
                objectFit: "cover", display: "block",
              }}
            />
            {/* Soft bottom gradient for caption legibility */}
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(30,20,14,0) 55%, rgba(30,20,14,0.7))", pointerEvents: "none" }} />
            <div style={{ position: "absolute", left: 28, right: 28, bottom: 24, color: "var(--paper)" }}>
              <div style={{ fontFamily: "var(--f-mono)", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", opacity: 0.85 }}>The Studio</div>
              <div style={{ fontFamily: "var(--f-display)", fontSize: "clamp(20px, 2.2vw, 30px)", lineHeight: 1.1, marginTop: 6, maxWidth: 360 }}>
                3,200 sqft. Natural light. No mirrors on the ceiling.
              </div>
            </div>
          </div>
        </div>

        {/* Quick stats strip — kept inside first fold */}
        <div style={{ marginTop: 32, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24, borderTop: "1px solid var(--hairline)", paddingTop: 20 }}>
          {stats.map((s, i) => (
            <div key={i}>
              <div style={{ fontFamily: "var(--f-display)", fontSize: 44, lineHeight: 1, color: "var(--walnut-700)" }}>{s.v}</div>
              <div style={{ fontFamily: "var(--f-mono)", fontSize: 10.5, letterSpacing: 1.2, color: "var(--clay-600)", marginTop: 8, textTransform: "uppercase" }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AboutM3S() {
  const pillars = [
    { icon: "dumbbell", title: "Move", body: "Strength, mobility, and cardio programmed like medicine — dosed for your goals, not the algorithm." },
    { icon: "leaf", title: "Nourish", body: "Blood panels, body composition, and a registered dietitian translating data to dinner." },
    { icon: "moon", title: "Rest", body: "Sauna, plunge, sleep coaching, and breathwork. Recovery you can schedule, not just hope for." },
    { icon: "sparkle", title: "Learn", body: "Workshops with visiting practitioners — dance, gymnastics, martial arts — so you never plateau." },
  ];
  return (
    <Section id="about" bg="var(--sand-100)">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.3fr", gap: 80, alignItems: "start" }}>
        <div style={{ position: "sticky", top: 120 }}>
          <EyebrowTitle
            eyebrow="What is M3S"
            title={<>A third space, by design.</>}
            lead="Not your home. Not your office. A studio built for the hours that actually change how you feel — movement, measurement, and recovery under one vaulted roof."
          />
          <div style={{ marginTop: 32, display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Chip tone="sage">Holistic</Chip>
            <Chip tone="terra">Evidence-led</Chip>
            <Chip>Slow growth</Chip>
            <Chip tone="sage">Coach-owned</Chip>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20 }}>
          {pillars.map((p, i) => (
            <Card key={i} tone={i === 0 ? "walnut" : i === 2 ? "espresso" : "paper"} hoverable style={{ padding: 32, minHeight: 240 }}>
              <Icon name={p.icon} size={28} color={i === 0 || i === 2 ? "var(--sand-200)" : "var(--walnut-700)"} />
              <div style={{ fontFamily: "var(--f-display)", fontSize: 36, marginTop: 24, lineHeight: 1 }}>{p.title}</div>
              <div style={{ fontSize: 14, lineHeight: 1.6, marginTop: 14, opacity: 0.9 }}>{p.body}</div>
              <div style={{ fontFamily: "var(--f-mono)", fontSize: 10, letterSpacing: 2, opacity: 0.5, marginTop: 24 }}>0{i + 1} / 04</div>
            </Card>
          ))}
        </div>
      </div>
    </Section>
  );
}

function Founder() {
  return (
    <Section id="founder" bg="var(--sand-50)">
      <div style={{ display: "grid", gridTemplateColumns: "0.9fr 1.1fr", gap: 80, alignItems: "center" }}>
        <div style={{ position: "relative" }}>
          <div style={{ borderRadius: "var(--r-lg)", overflow: "hidden", aspectRatio: "4/5", border: "1px solid var(--hairline)" }}>
            <img src="assets/shwetambari.png" alt="Shwetambari Shetty" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", display: "block" }} />
          </div>
          <div style={{
            position: "absolute", bottom: -24, right: -24, background: "var(--walnut-700)", color: "var(--paper)",
            padding: "20px 26px", borderRadius: "var(--r-md)", boxShadow: "var(--sh-2)",
          }}>
            <div style={{ fontFamily: "var(--f-mono)", fontSize: 10, letterSpacing: 2, opacity: 0.7, textTransform: "uppercase" }}>Founder</div>
            <div style={{ fontFamily: "var(--f-display)", fontSize: 28, marginTop: 4, lineHeight: 1 }}>Shwetambari Shetty</div>
          </div>
        </div>

        <div>
          <EyebrowTitle
            eyebrow="Founder's Note"
            title={<>"I exercise for my <em style={{ fontStyle: "italic", color: "var(--sage-500)" }}>future self.</em>"</>}
          />
          <div style={{ marginTop: 36, fontSize: 17, lineHeight: 1.7, color: "var(--espresso-800)", display: "flex", flexDirection: "column", gap: 20 }}>
            <p style={{ margin: 0 }}>
              Growing old is inevitable. Aging gracefully is in your hands. I built M3S to help people get strong for their older self — because I watched my mother go from the healthiest woman I knew to multiple falls a day from Parkinson's, and every doctor said the same thing: <em>she needs to exercise.</em>
            </p>
            <p style={{ margin: 0 }}>
              So we start early. We start now. It's not how many years we live — it's how well we live the years we have. Look your best, feel your best, age gracefully.
            </p>
            <div style={{ fontFamily: "var(--f-mono)", fontSize: 12, letterSpacing: 2, color: "var(--clay-600)", marginTop: 8 }}>
              #ATMYTHIRDSPACE
            </div>
          </div>

          <div style={{ marginTop: 40, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 0, borderTop: "1px solid var(--hairline)", borderBottom: "1px solid var(--hairline)" }}>
            {[
              { k: "15+ yrs", v: "Coaching fitness" },
              { k: "Dance Fitness", v: "Founder" },
              { k: "Indiranagar", v: "Home studio" },
            ].map((s, i) => (
              <div key={i} style={{ padding: "24px 0", borderLeft: i === 0 ? "none" : "1px solid var(--hairline)", paddingLeft: i === 0 ? 0 : 24 }}>
                <div style={{ fontFamily: "var(--f-display)", fontSize: 26, color: "var(--walnut-700)", lineHeight: 1 }}>{s.k}</div>
                <div style={{ fontFamily: "var(--f-mono)", fontSize: 10, letterSpacing: 1.5, color: "var(--clay-600)", marginTop: 8, textTransform: "uppercase" }}>{s.v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}

function Services({ onBook }) {
  const [active, setActive] = useS1(SERVICES[0].id);
  const [mIdx, setMIdx] = useS1(0);
  const mobileRef = React.useRef(null);
  const isMobile = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(max-width: 899px)").matches;

  const tones = {
    walnut:   { bg: "var(--walnut-700)", fg: "var(--paper)" },
    espresso: { bg: "var(--espresso-800)", fg: "var(--paper)" },
    sand:     { bg: "var(--sand-100)", fg: "var(--espresso-900)" },
    sage:     { bg: "var(--sage-500)", fg: "var(--paper)" },
    terra:    { bg: "var(--terracotta-500)", fg: "var(--paper)" },
  };

  const svcImage = (s) => {
    if (s.id === "approach") return <ApproachDiagram />;
    const map = {
      pt: "assets/pt-session.png",
      group: "assets/group-workout.png",
      work: "assets/workshops.jpg?v=17",
      recover: "assets/sauna.png",
    };
    const src = map[s.id];
    return src
      ? <img src={src} alt={s.kind} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
      : <Placeholder label={s.kind.toLowerCase()} tone="sand" w={800} h={600} />;
  };

  const current = SERVICES.find(s => s.id === active) || SERVICES[0];
  const activeIdx = SERVICES.findIndex(s => s.id === active);

  const step = (dir) => {
    // Desktop: swap active
    const n = SERVICES.length;
    const nextIdx = (activeIdx + dir + n) % n;
    setActive(SERVICES[nextIdx].id);
    // Mobile: scroll carousel
    const el = mobileRef.current;
    if (el) {
      const target = Math.max(0, Math.min(n - 1, mIdx + dir));
      el.scrollTo({ left: target * el.clientWidth, behavior: "smooth" });
    }
  };

  const ArrowBtn = ({ dir, dim = false }) => (
    <button
      onClick={() => step(dir)}
      aria-label={dir < 0 ? "Previous service" : "Next service"}
      style={{
        width: 44, height: 44, borderRadius: 999,
        border: "1px solid rgba(245,237,224,0.28)",
        background: dim ? "transparent" : "rgba(245,237,224,0.06)",
        color: "var(--sand-100)", cursor: "pointer",
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        transition: "background .2s, border-color .2s, transform .15s",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = "var(--sand-100)"; e.currentTarget.style.color = "var(--espresso-900)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = dim ? "transparent" : "rgba(245,237,224,0.06)"; e.currentTarget.style.color = "var(--sand-100)"; }}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ transform: dir < 0 ? "scaleX(-1)" : "none" }}>
        <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );

  // Track mobile carousel scroll → dots
  useE1(() => {
    const el = mobileRef.current;
    if (!el) return;
    const onScroll = () => {
      const idx = Math.round(el.scrollLeft / el.clientWidth);
      setMIdx(Math.max(0, Math.min(SERVICES.length - 1, idx)));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section id="services" className="m3s-services" style={{
      background: "var(--espresso-900)", color: "var(--sand-100)",
      minHeight: "100vh", display: "flex", flexDirection: "column",
      padding: "72px 0 56px",
    }}>
      <div style={{ maxWidth: 1240, margin: "0 auto", padding: "0 32px", width: "100%", flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Header row — compact */}
        <div className="svc-head" style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 32, alignItems: "end", marginBottom: 28 }}>
          <div>
            <div style={{ fontFamily: "var(--f-mono)", fontSize: 11, letterSpacing: 2.5, textTransform: "uppercase", color: "var(--sand-300)", opacity: 0.7 }}>Offerings</div>
            <h2 style={{
              fontFamily: "var(--f-display)", fontWeight: 400,
              fontSize: "clamp(40px, 5.5vw, 72px)", lineHeight: 1, letterSpacing: -1.5,
              color: "var(--sand-100)", margin: "10px 0 0",
            }}>
              Five ways we work with you.
            </h2>
          </div>
          <div className="svc-count" style={{ fontFamily: "var(--f-mono)", fontSize: 11, letterSpacing: 2, color: "var(--sand-300)", opacity: 0.85, textAlign: "right", display: "flex", alignItems: "center", gap: 12 }}>
            <span>0{activeIdx + 1} / 0{SERVICES.length}</span>
            <span className="svc-arrows" style={{ display: "inline-flex", gap: 8 }}>
              <ArrowBtn dir={-1} />
              <ArrowBtn dir={1} />
            </span>
          </div>
        </div>

        {/* Desktop split view */}
        <div className="svc-desktop" style={{
          display: "grid", gridTemplateColumns: "0.9fr 1.3fr",
          gap: 48, flex: 1, minHeight: 0,
        }}>
          {/* Left rail — list + description + CTAs */}
          <div style={{ display: "flex", flexDirection: "column", minHeight: 0 }}>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, borderTop: "1px solid rgba(245,237,224,0.14)" }}>
              {SERVICES.map((s, i) => {
                const on = s.id === active;
                return (
                  <li key={s.id} style={{ borderBottom: "1px solid rgba(245,237,224,0.14)" }}>
                    <button
                      onClick={() => setActive(s.id)}
                      onMouseEnter={() => setActive(s.id)}
                      style={{
                        width: "100%", textAlign: "left", border: "none", background: "transparent",
                        padding: "16px 0", color: on ? "var(--sand-100)" : "rgba(245,237,224,0.7)",
                        cursor: "pointer", display: "grid", gridTemplateColumns: "36px 1fr auto", alignItems: "center", gap: 14,
                        fontFamily: "var(--f-body)", transition: "color .2s",
                      }}
                    >
                      <span style={{ fontFamily: "var(--f-mono)", fontSize: 11, opacity: on ? 0.8 : 0.5 }}>0{i + 1}</span>
                      <span style={{
                        fontFamily: "var(--f-display)", fontStyle: on ? "italic" : "normal",
                        fontSize: "clamp(20px, 2.1vw, 28px)", lineHeight: 1.1, letterSpacing: -0.3,
                      }}>
                        {s.kind}
                      </span>
                      <span style={{
                        width: on ? 36 : 8, height: 1, background: "var(--sand-100)",
                        transition: "width .25s ease", opacity: on ? 1 : 0.4,
                      }} />
                    </button>
                  </li>
                );
              })}
            </ul>

            <div style={{ marginTop: 24, paddingTop: 20, borderTop: "1px solid rgba(245,237,224,0.14)" }}>
              <p style={{ fontSize: 15, lineHeight: 1.55, color: "var(--sand-200)", margin: 0, maxWidth: 440 }}>
                {current.desc}
              </p>
              <div style={{ marginTop: 20, display: "flex", flexWrap: "wrap", gap: 8 }}>
                {current.items.map((it, i) => (
                  <span key={i} style={{
                    fontFamily: "var(--f-mono)", fontSize: 10.5, letterSpacing: 1.5,
                    textTransform: "uppercase", color: "var(--sand-200)",
                    border: "1px solid rgba(245,237,224,0.22)", padding: "6px 10px", borderRadius: "var(--r-pill)",
                  }}>{it}</span>
                ))}
              </div>
              <div style={{ marginTop: 24, display: "flex", gap: 12 }}>
                <Btn onClick={onBook}>Book this →</Btn>
                <Btn variant="ghost" style={{ color: "var(--sand-100)", opacity: 0.75 }}>Learn more</Btn>
              </div>
            </div>
          </div>

          {/* Right panel — big art + tagline */}
          <div style={{
            position: "relative", borderRadius: "var(--r-xl)", overflow: "hidden",
            background: tones[current.tone].bg, color: tones[current.tone].fg,
            minHeight: 0, display: "flex", flexDirection: "column",
          }}>
            <div style={{ flex: 1, position: "relative", minHeight: 0 }}>
              <div key={current.id} style={{
                position: "absolute", inset: 0, animation: "svcFade .35s ease",
              }}>
                {svcImage(current)}
              </div>
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(30,20,14,0) 45%, rgba(30,20,14,0.78))", pointerEvents: "none" }} />
            </div>
            <div style={{
              position: "absolute", left: 32, right: 32, bottom: 28,
              color: tones[current.tone].fg,
            }}>
              <div style={{ fontFamily: "var(--f-mono)", fontSize: 11, letterSpacing: 2, opacity: 0.8, textTransform: "uppercase" }}>
                {current.kind}
              </div>
              <h3 style={{
                fontFamily: "var(--f-display)", fontWeight: 400,
                fontSize: "clamp(28px, 3.2vw, 48px)", lineHeight: 1.05, letterSpacing: -0.8,
                margin: "8px 0 0",
              }}>
                {current.tagline}
              </h3>
            </div>
          </div>
        </div>

        {/* Mobile carousel */}
        <div className="svc-mobile" style={{ display: "none", flex: 1, flexDirection: "column", minHeight: 0 }}>
          <div
            ref={mobileRef}
            style={{
              display: "flex", overflowX: "auto", scrollSnapType: "x mandatory",
              gap: 12, paddingBottom: 8, flex: 1, minHeight: 0,
              scrollbarWidth: "none",
            }}
          >
            {SERVICES.map((s, i) => {
              const t = tones[s.tone];
              return (
                <article key={s.id} style={{
                  flex: "0 0 100%", scrollSnapAlign: "start",
                  borderRadius: "var(--r-xl)", overflow: "hidden",
                  background: t.bg, color: t.fg,
                  display: "flex", flexDirection: "column",
                }}>
                  <div style={{ position: "relative", flex: "0 0 auto", aspectRatio: "4/3", overflow: "hidden" }}>
                    {svcImage(s)}
                    <div style={{ position: "absolute", top: 14, left: 14, fontFamily: "var(--f-mono)", fontSize: 10, letterSpacing: 2, color: "var(--paper)", textTransform: "uppercase", background: "rgba(30,20,14,0.55)", padding: "5px 9px", borderRadius: "var(--r-pill)" }}>
                      0{i + 1} / 0{SERVICES.length}
                    </div>
                  </div>
                  <div style={{ padding: "18px 18px 20px", flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
                    <div style={{ fontFamily: "var(--f-mono)", fontSize: 10.5, letterSpacing: 2, opacity: 0.75, textTransform: "uppercase" }}>{s.kind}</div>
                    <h3 style={{
                      fontFamily: "var(--f-display)", fontWeight: 400,
                      fontSize: 26, lineHeight: 1.1, letterSpacing: -0.5,
                      margin: "6px 0 10px",
                    }}>{s.tagline}</h3>
                    <p style={{ fontSize: 13.5, lineHeight: 1.5, margin: 0, opacity: 0.92 }}>{s.desc}</p>
                    <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {s.items.slice(0, 4).map((it, j) => (
                        <span key={j} style={{
                          fontFamily: "var(--f-mono)", fontSize: 9.5, letterSpacing: 1.2,
                          textTransform: "uppercase", padding: "4px 8px",
                          border: `1px solid ${t.fg === "var(--paper)" ? "rgba(255,253,248,0.28)" : "rgba(30,20,14,0.2)"}`,
                          borderRadius: "var(--r-pill)", opacity: 0.9,
                        }}>{it}</span>
                      ))}
                    </div>
                    <div style={{ marginTop: "auto", paddingTop: 14, display: "flex", gap: 10 }}>
                      <Btn size="sm" onClick={onBook} variant={s.tone === "sand" ? "primary" : "secondary"} style={s.tone !== "sand" ? { color: t.fg, borderColor: t.fg } : undefined}>
                        Book this →
                      </Btn>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Dots + arrows */}
          <div style={{ marginTop: 14, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {SERVICES.map((s, i) => (
                <button key={s.id}
                  onClick={() => {
                    const el = mobileRef.current;
                    if (el) el.scrollTo({ left: i * el.clientWidth, behavior: "smooth" });
                  }}
                  aria-label={`Go to ${s.kind}`}
                  style={{
                    width: mIdx === i ? 22 : 7, height: 7, border: "none",
                    borderRadius: 999, background: mIdx === i ? "var(--sand-100)" : "rgba(245,237,224,0.35)",
                    transition: "width .25s, background .2s", cursor: "pointer", padding: 0,
                  }} />
              ))}
            </div>
            <div style={{ display: "inline-flex", gap: 8 }}>
              <ArrowBtn dir={-1} />
              <ArrowBtn dir={1} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <Section bg="var(--sand-100)">
      <EyebrowTitle eyebrow="From the floor" title="Members, in their words." align="center" />
      <div style={{ marginTop: 64, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
        {TESTIMONIALS.map((t, i) => (
          <Card key={i} tone={i === 1 ? "walnut" : "paper"} style={{ padding: 36 }}>
            <div style={{ fontFamily: "var(--f-display)", fontSize: 48, lineHeight: 0.8, opacity: 0.4 }}>"</div>
            <div style={{ fontFamily: "var(--f-display)", fontSize: 24, lineHeight: 1.3, marginTop: -20 }}>{t.q}</div>
            <div style={{ marginTop: 32, paddingTop: 20, borderTop: `1px solid ${i === 1 ? "rgba(255,253,248,0.18)" : "var(--hairline)"}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{t.by}</div>
                <div style={{ fontFamily: "var(--f-mono)", fontSize: 10, letterSpacing: 1.5, opacity: 0.65, marginTop: 4, textTransform: "uppercase" }}>{t.role}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Section>
  );
}

function Footer() {
  return (
    <footer style={{ background: "var(--espresso-900)", color: "var(--sand-200)", padding: "80px 32px 40px" }}>
      <div style={{ maxWidth: 1240, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 40 }}>
          <div>
            <M3SLogo size={40} color="var(--sand-100)" />
            <p style={{ fontSize: 14, lineHeight: 1.6, marginTop: 24, opacity: 0.7, maxWidth: 320 }}>
              A holistic studio for the hours between home and work. Built for your future self.
            </p>
          </div>
          {[
            { h: "Visit", l: ["HAL 2nd Stage, Indiranagar", "Bengaluru 560008", "Get directions →"] },
            { h: "Hours", l: ["Mon–Fri · 5:30 AM – 9:30 PM", "Sat · 7 AM – 6 PM", "Sun · 9 AM – 6 PM"] },
            { h: "Contact", l: ["hello@mythirdspace.fit", "+91 81239 01143", "@my.thirdspace"] },
          ].map((col, i) => (
            <div key={i}>
              <div style={{ fontFamily: "var(--f-mono)", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", opacity: 0.6, marginBottom: 16 }}>{col.h}</div>
              {col.l.map((x, j) => <div key={j} style={{ fontSize: 14, padding: "6px 0", opacity: 0.85 }}>{x}</div>)}
            </div>
          ))}
        </div>
        <div style={{ marginTop: 60, paddingTop: 24, borderTop: "1px solid rgba(245,237,224,0.12)", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 24, flexWrap: "wrap", fontFamily: "var(--f-mono)", fontSize: 11, opacity: 0.75 }}>
          <span style={{ opacity: 0.8 }}>© 2026 My Third Space</span>
          <div style={{ display: "flex", gap: 28, alignItems: "center", flexWrap: "wrap" }}>
            <a href="coach-universe.html" style={{ color: "var(--sand-200)", textDecoration: "none", letterSpacing: 2, textTransform: "uppercase", display: "inline-flex", alignItems: "center", gap: 8, borderBottom: "1px solid rgba(245,237,224,0.35)", paddingBottom: 2 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--ochre-500)" }} />
              Coach Universe →
            </a>
            <span style={{ opacity: 0.7 }}>#ATMYTHIRDSPACE</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function ApproachDiagram() {
  // Editorial, on-brand composed SVG showing the 5-step assessment flow.
  // Palette: sand paper over deep walnut. Hand-drawn-ish marks, mono labels.
  const steps = [
    { n: "01", label: "1-1 CONSULT",    angle: -90 },
    { n: "02", label: "BLOOD TEST",     angle: -18 },
    { n: "03", label: "BODY COMP",      angle:  54 },
    { n: "04", label: "FITNESS",        angle: 126 },
    { n: "05", label: "NUTRITION",      angle: 198 },
  ];
  const cx = 300, cy = 240, R = 140;
  const pt = (a) => {
    const rad = (a * Math.PI) / 180;
    return { x: cx + R * Math.cos(rad), y: cy + R * Math.sin(rad) };
  };

  return (
    <div style={{
      width: "100%", height: "100%",
      background: "var(--sand-100)",
      position: "relative", overflow: "hidden",
      border: "1px solid rgba(255,253,248,0.12)",
      borderRadius: "var(--r-md)",
    }}>
      {/* subtle diagonal paper texture */}
      <svg width="100%" height="100%" viewBox="0 0 600 480" preserveAspectRatio="xMidYMid slice" style={{ display: "block" }}>
        <defs>
          <pattern id="appr-stripe" width="18" height="18" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="18" height="18" fill="#F3E7D0"/>
            <line x1="0" y1="0" x2="0" y2="18" stroke="#E8D7B5" strokeWidth="1"/>
          </pattern>
          <radialGradient id="appr-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FBF7F0" stopOpacity="0.9"/>
            <stop offset="100%" stopColor="#F3E7D0" stopOpacity="0"/>
          </radialGradient>
        </defs>
        <rect width="600" height="480" fill="url(#appr-stripe)"/>
        <circle cx={cx} cy={cy} r="200" fill="url(#appr-glow)"/>

        {/* outer guide ring */}
        <circle cx={cx} cy={cy} r={R} fill="none" stroke="#5E4228" strokeOpacity="0.18" strokeDasharray="2 6" strokeWidth="1"/>
        <circle cx={cx} cy={cy} r={R + 30} fill="none" stroke="#5E4228" strokeOpacity="0.1" strokeWidth="0.75"/>

        {/* connecting spokes */}
        {steps.map((s, i) => {
          const p = pt(s.angle);
          return <line key={"ln"+i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="#5E4228" strokeOpacity="0.22" strokeWidth="0.75"/>;
        })}

        {/* center badge — "YOU" */}
        <circle cx={cx} cy={cy} r="52" fill="#5E4228"/>
        <circle cx={cx} cy={cy} r="52" fill="none" stroke="#3E2C1C" strokeWidth="1.5"/>
        <text x={cx} y={cy - 4} textAnchor="middle" fontFamily="Fraunces, serif" fontStyle="italic" fontSize="30" fill="#FBF7F0" fontWeight="400">you</text>
        <text x={cx} y={cy + 18} textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="8" letterSpacing="2" fill="#EADBC4" opacity="0.7">BASELINE</text>

        {/* step nodes */}
        {steps.map((s, i) => {
          const p = pt(s.angle);
          // label offset outward
          const rad = (s.angle * Math.PI) / 180;
          const lx = cx + (R + 34) * Math.cos(rad);
          const ly = cy + (R + 34) * Math.sin(rad);
          const anchor = Math.cos(rad) > 0.3 ? "start" : Math.cos(rad) < -0.3 ? "end" : "middle";
          return (
            <g key={"nd"+i}>
              <circle cx={p.x} cy={p.y} r="22" fill="#FBF7F0" stroke="#5E4228" strokeWidth="1.5"/>
              <circle cx={p.x} cy={p.y} r="22" fill="none" stroke="#5E4228" strokeOpacity="0.3" strokeWidth="4"/>
              {/* tiny glyph per step */}
              <StepGlyph n={i} x={p.x} y={p.y} />
              {/* number + label */}
              <text x={lx} y={ly - 4} textAnchor={anchor} fontFamily="JetBrains Mono, monospace" fontSize="10" letterSpacing="1.5" fill="#8A6640">{s.n}</text>
              <text x={lx} y={ly + 10} textAnchor={anchor} fontFamily="JetBrains Mono, monospace" fontSize="11" letterSpacing="1.5" fill="#3E2C1C" fontWeight="600">{s.label}</text>
            </g>
          );
        })}

        {/* corner callouts */}
        <g opacity="0.65">
          <text x="32" y="36" fontFamily="JetBrains Mono, monospace" fontSize="9" letterSpacing="2" fill="#5E4228">[ COMPREHENSIVE APPROACH ]</text>
          <text x="568" y="36" textAnchor="end" fontFamily="JetBrains Mono, monospace" fontSize="9" letterSpacing="2" fill="#5E4228">FIG. 01</text>
          <text x="32" y="456" fontFamily="JetBrains Mono, monospace" fontSize="9" letterSpacing="2" fill="#5E4228">MEASURE · MOVE · RECOVER</text>
          <text x="568" y="456" textAnchor="end" fontFamily="JetBrains Mono, monospace" fontSize="9" letterSpacing="2" fill="#5E4228">M3S / BENGALURU</text>
        </g>
      </svg>
    </div>
  );
}

function StepGlyph({ n, x, y }) {
  // 5 minimal glyphs for: consult, blood, body-comp, fitness, nutrition
  const s = 10; // half-size
  const stroke = "#5E4228", sw = 1.4;
  const common = { stroke, strokeWidth: sw, fill: "none", strokeLinecap: "round", strokeLinejoin: "round" };
  if (n === 0) return ( // two-person chat
    <g {...common}>
      <circle cx={x-5} cy={y-3} r="2.6"/>
      <path d={`M ${x-9} ${y+6} Q ${x-5} ${y+1} ${x-1} ${y+6}`}/>
      <circle cx={x+5} cy={y-3} r="2.6"/>
      <path d={`M ${x+1} ${y+6} Q ${x+5} ${y+1} ${x+9} ${y+6}`}/>
    </g>
  );
  if (n === 1) return ( // blood drop
    <g {...common}>
      <path d={`M ${x} ${y-8} Q ${x+7} ${y} ${x+4} ${y+5} Q ${x} ${y+9} ${x-4} ${y+5} Q ${x-7} ${y} ${x} ${y-8} Z`}/>
      <path d={`M ${x-1} ${y+2} Q ${x-3} ${y-1} ${x-1} ${y-3}`} strokeOpacity="0.5"/>
    </g>
  );
  if (n === 2) return ( // body-comp: bars
    <g {...common}>
      <rect x={x-8} y={y-2} width="3.5" height="9"/>
      <rect x={x-2} y={y-6} width="3.5" height="13"/>
      <rect x={x+4} y={y} width="3.5" height="7"/>
    </g>
  );
  if (n === 3) return ( // fitness: heartbeat
    <g {...common}>
      <path d={`M ${x-9} ${y} L ${x-4} ${y} L ${x-2} ${y-6} L ${x+1} ${y+6} L ${x+3} ${y} L ${x+9} ${y}`}/>
    </g>
  );
  // n===4 nutrition: bowl + leaf
  return (
    <g {...common}>
      <path d={`M ${x-8} ${y+1} Q ${x} ${y+10} ${x+8} ${y+1}`}/>
      <line x1={x-8} y1={y+1} x2={x+8} y2={y+1}/>
      <path d={`M ${x} ${y-7} Q ${x+5} ${y-5} ${x+3} ${y-1} Q ${x-1} ${y-2} ${x} ${y-7} Z`}/>
    </g>
  );
}

function PTScene() {
  // Composed editorial scene: coach spotting a student on a dumbbell row,
  // M3S wordmark painted on the back wall. Stylized, on-brand.
  return (
    <div style={{ width: "100%", height: "100%", borderRadius: "var(--r-md)", overflow: "hidden", position: "relative" }}>
      <svg viewBox="0 0 600 480" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" style={{ display: "block" }}>
        <defs>
          {/* warm backlight */}
          <linearGradient id="pt-wall" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#6B4D31"/>
            <stop offset="55%" stopColor="#5E4228"/>
            <stop offset="100%" stopColor="#3E2C1C"/>
          </linearGradient>
          <radialGradient id="pt-sun" cx="75%" cy="18%" r="55%">
            <stop offset="0%" stopColor="#EADBC4" stopOpacity="0.55"/>
            <stop offset="60%" stopColor="#B86B4B" stopOpacity="0.12"/>
            <stop offset="100%" stopColor="#3E2C1C" stopOpacity="0"/>
          </radialGradient>
          {/* wood floor */}
          <linearGradient id="pt-floor" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#3E2C1C"/>
            <stop offset="100%" stopColor="#2A1C10"/>
          </linearGradient>
          {/* window light shaft */}
          <linearGradient id="pt-shaft" x1="0" x2="0.6" y1="0" y2="1">
            <stop offset="0%" stopColor="#FBF7F0" stopOpacity="0.18"/>
            <stop offset="100%" stopColor="#FBF7F0" stopOpacity="0"/>
          </linearGradient>
          {/* skin + fabric tones */}
          <linearGradient id="pt-skin" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#D7A982"/>
            <stop offset="100%" stopColor="#B68566"/>
          </linearGradient>
        </defs>

        {/* back wall */}
        <rect width="600" height="360" fill="url(#pt-wall)"/>
        <rect width="600" height="360" fill="url(#pt-sun)"/>
        {/* light shaft from top-right */}
        <polygon points="420,0 600,0 600,260 340,360 300,360" fill="url(#pt-shaft)"/>

        {/* subtle wall studs / battens */}
        {[80, 170, 260, 440, 530].map((x, i) => (
          <line key={i} x1={x} y1="0" x2={x} y2="360" stroke="#FBF7F0" strokeOpacity="0.05" strokeWidth="1"/>
        ))}

        {/* M3S wordmark on back wall (painted, low-contrast) */}
        <g opacity="0.22" transform="translate(60, 70)">
          <text x="0" y="0" fontFamily="Fraunces, serif" fontStyle="italic" fontWeight="400" fontSize="120" fill="#FBF7F0" letterSpacing="-2">M3S</text>
          <rect x="3" y="18" width="200" height="2" fill="#FBF7F0" opacity="0.6"/>
          <text x="3" y="42" fontFamily="JetBrains Mono, monospace" fontSize="11" letterSpacing="6" fill="#FBF7F0">MY THIRD SPACE</text>
        </g>

        {/* floor */}
        <rect y="360" width="600" height="120" fill="url(#pt-floor)"/>
        {/* floor planks */}
        {[380, 410, 440, 470].map((y, i) => (
          <line key={"fp"+i} x1="0" y1={y} x2="600" y2={y} stroke="#1A1108" strokeOpacity="0.5" strokeWidth="1"/>
        ))}
        {/* floor shadow pool under figures */}
        <ellipse cx="300" cy="410" rx="180" ry="18" fill="#000" opacity="0.35"/>

        {/* --- Rack in background, left --- */}
        <g opacity="0.65">
          <rect x="22" y="180" width="6" height="200" fill="#2A1C10"/>
          <rect x="110" y="180" width="6" height="200" fill="#2A1C10"/>
          <rect x="18" y="210" width="100" height="4" fill="#2A1C10"/>
          <rect x="18" y="250" width="100" height="4" fill="#2A1C10"/>
          <rect x="18" y="290" width="100" height="4" fill="#2A1C10"/>
          {/* plates on rack */}
          <circle cx="45" cy="230" r="10" fill="#1A1108"/>
          <circle cx="90" cy="230" r="10" fill="#1A1108"/>
          <circle cx="45" cy="270" r="12" fill="#1A1108"/>
          <circle cx="90" cy="270" r="12" fill="#1A1108"/>
        </g>

        {/* --- Bench in foreground center --- */}
        <g>
          <rect x="230" y="330" width="140" height="16" rx="4" fill="#2A1C10"/>
          <rect x="240" y="346" width="8" height="40" fill="#1A1108"/>
          <rect x="352" y="346" width="8" height="40" fill="#1A1108"/>
          <rect x="225" y="338" width="150" height="3" fill="#5E4228" opacity="0.4"/>
        </g>

        {/* ====== STUDENT — seated on bench, rowing dumbbell ====== */}
        {/* torso */}
        <g>
          {/* leggings */}
          <path d="M 260 330 Q 256 296 272 282 L 318 282 Q 334 296 330 330 Z" fill="#2A1C10"/>
          {/* white crop tee */}
          <path d="M 266 282 Q 262 252 280 240 L 312 240 Q 328 252 324 282 Z" fill="#FBF7F0"/>
          {/* tee shadow */}
          <path d="M 266 282 Q 266 272 276 268 L 314 268 Q 324 272 324 282 Z" fill="#E2D0B3" opacity="0.7"/>
          {/* M3S tiny logo on chest */}
          <text x="295" y="262" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="6" letterSpacing="1" fill="#5E4228">M3S</text>

          {/* head */}
          <circle cx="296" cy="224" r="16" fill="url(#pt-skin)"/>
          {/* ponytail */}
          <path d="M 308 218 Q 320 214 324 226 Q 326 240 316 244 Q 310 240 308 230 Z" fill="#1A1108"/>
          {/* hair front */}
          <path d="M 280 218 Q 282 208 296 206 Q 310 206 312 218 Q 304 214 296 214 Q 288 214 280 218 Z" fill="#1A1108"/>

          {/* right arm (rowing — pulling back) */}
          <path d="M 318 250 Q 338 250 350 264 L 352 276 Q 336 276 322 268 Z" fill="url(#pt-skin)"/>
          {/* forearm pulling dumbbell up */}
          <path d="M 348 264 Q 362 260 368 248 L 362 238 Q 350 248 346 258 Z" fill="url(#pt-skin)"/>
          {/* dumbbell */}
          <g transform="translate(356, 232)">
            <rect x="0" y="4" width="22" height="6" rx="2" fill="#1A1108"/>
            <rect x="-6" y="-2" width="8" height="18" rx="2" fill="#2A1C10"/>
            <rect x="20" y="-2" width="8" height="18" rx="2" fill="#2A1C10"/>
            <rect x="-8" y="-4" width="4" height="22" rx="1" fill="#B86B4B"/>
            <rect x="28" y="-4" width="4" height="22" rx="1" fill="#B86B4B"/>
          </g>

          {/* left arm resting on knee */}
          <path d="M 274 250 Q 258 254 250 274 L 258 282 Q 270 270 278 264 Z" fill="url(#pt-skin)"/>
        </g>

        {/* ====== COACH — standing right, cueing form ====== */}
        <g>
          {/* shadow leg */}
          <path d="M 432 386 L 442 300 L 466 300 L 470 386 Z" fill="#1A1108"/>
          {/* front leg */}
          <path d="M 448 386 L 456 300 L 478 300 L 482 386 Z" fill="#2A1C10"/>
          {/* torso — dark tee */}
          <path d="M 430 300 Q 426 258 446 246 L 486 246 Q 506 258 502 300 Z" fill="#1A1108"/>
          {/* tee highlight */}
          <path d="M 434 270 Q 448 262 466 262 Q 484 262 498 270" stroke="#3E2C1C" strokeWidth="2" fill="none"/>
          {/* M3S logo on coach tee */}
          <text x="466" y="285" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="7" letterSpacing="1.5" fill="#B86B4B">M3S</text>

          {/* coach head */}
          <circle cx="466" cy="228" r="17" fill="#B68566"/>
          {/* short hair */}
          <path d="M 450 222 Q 452 210 466 208 Q 480 208 482 222 Q 480 216 466 216 Q 452 216 450 222 Z" fill="#1A1108"/>
          {/* beard hint */}
          <path d="M 456 236 Q 466 244 476 236" stroke="#2A1C10" strokeWidth="1.5" fill="none"/>

          {/* extended arm — pointing at student's back (form cue) */}
          <path d="M 438 260 Q 404 258 380 270 L 378 280 Q 404 274 438 274 Z" fill="#B68566"/>
          {/* pointing hand */}
          <circle cx="378" cy="275" r="7" fill="#B68566"/>
          <rect x="368" y="272" width="12" height="2.5" rx="1" fill="#B68566"/>

          {/* other arm holding clipboard */}
          <path d="M 498 270 Q 516 276 520 300 L 510 306 Q 502 290 498 280 Z" fill="#B68566"/>
          {/* clipboard */}
          <rect x="500" y="300" width="24" height="30" rx="2" fill="#EADBC4" stroke="#1A1108" strokeWidth="1"/>
          <line x1="504" y1="308" x2="520" y2="308" stroke="#5E4228" strokeWidth="1"/>
          <line x1="504" y1="314" x2="520" y2="314" stroke="#5E4228" strokeWidth="1"/>
          <line x1="504" y1="320" x2="516" y2="320" stroke="#5E4228" strokeWidth="1"/>
          <rect x="508" y="296" width="8" height="4" rx="1" fill="#1A1108"/>
        </g>

        {/* --- foreground floor dumbbell --- */}
        <g transform="translate(150, 396)">
          <rect x="0" y="2" width="28" height="8" rx="2" fill="#1A1108"/>
          <circle cx="-2" cy="6" r="10" fill="#2A1C10"/>
          <circle cx="30" cy="6" r="10" fill="#2A1C10"/>
          <circle cx="-2" cy="6" r="6" fill="#1A1108"/>
          <circle cx="30" cy="6" r="6" fill="#1A1108"/>
        </g>

        {/* --- motion cue arrow from coach hand to student back --- */}
        <g opacity="0.55">
          <path d="M 372 272 Q 352 260 336 252" stroke="#EADBC4" strokeWidth="1.3" strokeDasharray="3 4" fill="none"/>
          <path d="M 340 248 L 334 252 L 338 258" stroke="#EADBC4" strokeWidth="1.3" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        </g>

        {/* editorial callouts */}
        <g opacity="0.75">
          <text x="32" y="36" fontFamily="JetBrains Mono, monospace" fontSize="9" letterSpacing="2" fill="#EADBC4">[ PERSONAL TRAINING · 1:1 ]</text>
          <text x="568" y="36" textAnchor="end" fontFamily="JetBrains Mono, monospace" fontSize="9" letterSpacing="2" fill="#EADBC4">FIG. 02</text>
          <text x="32" y="462" fontFamily="JetBrains Mono, monospace" fontSize="9" letterSpacing="2" fill="#EADBC4">60 MIN · ONE COACH · YOUR PLAN</text>
          <text x="568" y="462" textAnchor="end" fontFamily="JetBrains Mono, monospace" fontSize="9" letterSpacing="2" fill="#EADBC4">M3S / INDIRANAGAR</text>
        </g>
      </svg>
    </div>
  );
}

Object.assign(window, { Nav, Hero, AboutM3S, Founder, Services, Testimonials, Footer, ApproachDiagram, PTScene });
