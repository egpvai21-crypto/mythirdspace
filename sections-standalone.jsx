// Hero, About, Founder, Services, Testimonials sections
const { useState: useS1, useEffect: useE1 } = React;

function Nav({ active, onNav, onBook }) {
  const items = [
    { id: "home", label: "Home" },
    { id: "about", label: "What is M3S" },
    { id: "founder", label: "Founder" },
    { id: "services", label: "Services" },
    { id: "trainers", label: "Trainers" },
    { id: "social", label: "Social" },
    { id: "members", label: "Members" },
    { id: "kenko", label: "Kenko" },
    { id: "book", label: "Book" },
  ];
  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 50,
      background: "rgba(251,247,240,0.85)",
      backdropFilter: "blur(14px)",
      borderBottom: "1px solid var(--hairline)",
    }}>
      <div style={{ maxWidth: 1240, margin: "0 auto", padding: "18px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24 }}>
        <M3SLogo size={34} color="var(--walnut-700)" />
        <div style={{ display: "flex", gap: 2, alignItems: "center", background: "var(--sand-100)", padding: 4, borderRadius: "var(--r-pill)", border: "1px solid var(--hairline)", flexWrap: "wrap" }}>
          {items.map((it) => (
            <button key={it.id}
              onClick={() => onNav(it.id)}
              style={{
                border: "none", background: active === it.id ? "var(--paper)" : "transparent",
                color: active === it.id ? "var(--walnut-700)" : "var(--espresso-800)",
                padding: "7px 13px", borderRadius: "var(--r-pill)", cursor: "pointer",
                fontFamily: "var(--f-body)", fontSize: 12.5, fontWeight: active === it.id ? 600 : 500,
                boxShadow: active === it.id ? "var(--sh-1)" : "none",
                transition: "all .2s", whiteSpace: "nowrap",
              }}
            >{it.label}</button>
          ))}
        </div>
        <Btn size="sm" onClick={onBook} icon={<Icon name="arrow" size={14} color="currentColor" />}>Book a Session</Btn>
      </div>
    </nav>
  );
}

function Hero({ onExplore, onBook, variant = "third-space" }) {
  const variants = {
    "third-space": { pre: "Home, work,", em: "My Third Space." },
    "future-self": { pre: "Train for your", em: "future self." },
    "welcome":     { pre: "Welcome to", em: "my third space." },
  };
  const v = variants[variant] || variants["third-space"];
  return (
    <section id="home" style={{ position: "relative", padding: "60px 32px 100px" }}>
      <div style={{ maxWidth: 1240, margin: "0 auto" }}>
        {/* Eyebrow row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 48, flexWrap: "wrap", gap: 16 }}>
          <div style={{ fontFamily: "var(--f-mono)", fontSize: 11, letterSpacing: 2.5, textTransform: "uppercase", color: "var(--clay-600)" }}>
            Indiranagar · Bengaluru
          </div>
          <div style={{ fontFamily: "var(--f-mono)", fontSize: 11, letterSpacing: 2.5, textTransform: "uppercase", color: "var(--clay-600)" }}>
            Open today · 5:30 AM – 9:30 PM
          </div>
        </div>

        {/* Headline */}
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 60, alignItems: "end" }}>
          <div>
            <h1 style={{
              fontFamily: "var(--f-display)", fontWeight: 400,
              fontSize: "clamp(64px, 9vw, 140px)", lineHeight: 0.95, letterSpacing: -2,
              color: "var(--espresso-900)", margin: 0,
            }}>
              {v.pre}<br />
              <em style={{ fontStyle: "italic", color: "var(--walnut-700)" }}>{v.em}</em>
            </h1>
          </div>
          <div style={{ paddingBottom: 20 }}>
            <p style={{ fontSize: 18, lineHeight: 1.55, color: "var(--espresso-800)", margin: 0, maxWidth: 360 }}>
              A holistic studio in the quiet middle of your week — where movement, breath, and measurement meet.
            </p>
            <div style={{ display: "flex", gap: 12, marginTop: 28 }}>
              <Btn onClick={onBook}>Book a session</Btn>
              <Btn variant="secondary" onClick={onExplore}>What is M3S →</Btn>
            </div>
          </div>
        </div>

        {/* Hero image frame */}
        <div style={{ marginTop: 64, position: "relative", borderRadius: "var(--r-xl)", overflow: "hidden", aspectRatio: "16/7", border: "1px solid var(--hairline)", background: "var(--walnut-800)" }}>
          <img src={(window.__resources && window.__resources.heroStudio) || "assets/hero-studio.png"} alt="M3S studio interior" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(30,20,14,0) 40%, rgba(30,20,14,0.7))" }} />
          <div style={{ position: "absolute", left: 40, bottom: 40, color: "var(--paper)" }}>
            <div style={{ fontFamily: "var(--f-mono)", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", opacity: 0.75 }}>The Studio</div>
            <div style={{ fontFamily: "var(--f-display)", fontSize: 42, lineHeight: 1, marginTop: 8 }}>3,200 sqft. Natural light. No mirrors on the ceiling.</div>
          </div>
          <div style={{ position: "absolute", right: 40, bottom: 40, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6, color: "var(--paper)" }}>
            <div style={{ fontFamily: "var(--f-mono)", fontSize: 10, letterSpacing: 2, opacity: 0.75 }}>FIG. 01</div>
          </div>
        </div>

        {/* Quick stats strip */}
        <div style={{ marginTop: 48, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24, borderTop: "1px solid var(--hairline)", paddingTop: 32 }}>
          {[
            { v: "8", l: "Coaches, each certified" },
            { v: "20", l: "Members per class" },
            { v: "110+", l: "Hyrox batches so far" },
            { v: "400+", l: "Members, growing slowly on purpose" },
          ].map((s, i) => (
            <div key={i}>
              <div style={{ fontFamily: "var(--f-display)", fontSize: 52, lineHeight: 1, color: "var(--walnut-700)" }}>{s.v}</div>
              <div style={{ fontFamily: "var(--f-mono)", fontSize: 11, letterSpacing: 1.2, color: "var(--clay-600)", marginTop: 10, textTransform: "uppercase" }}>{s.l}</div>
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
            <img src={(window.__resources && window.__resources.founder) || "assets/shwetambari.png"} alt="Shwetambari Shetty" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", display: "block" }} />
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
  const scrollRef = React.useRef(null);

  // Sync active tab on scroll
  useE1(() => {
    const handler = () => {
      const els = SERVICES.map(s => document.getElementById("svc-" + s.id));
      const top = window.scrollY + 200;
      for (let i = els.length - 1; i >= 0; i--) {
        if (els[i] && els[i].offsetTop <= top) { setActive(SERVICES[i].id); return; }
      }
    };
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const jumpTo = (id) => {
    const el = document.getElementById("svc-" + id);
    if (el) window.scrollTo({ top: el.offsetTop - 100, behavior: "smooth" });
  };

  return (
    <section id="services" style={{ background: "var(--espresso-900)", color: "var(--sand-100)", padding: "140px 0 0" }}>
      <div style={{ maxWidth: 1240, margin: "0 auto", padding: "0 32px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "end", marginBottom: 64 }}>
          <EyebrowTitle
            eyebrow="Offerings"
            title={<>Five ways<br />we work with you.</>}
            color="var(--sand-100)"
          />
          <div>
            <p style={{ fontSize: 17, lineHeight: 1.6, color: "var(--sand-200)", margin: 0, maxWidth: 460 }}>
              Scroll through below, or jump to any service. Every path starts the same way: an honest conversation about what you want the next decade to feel like.
            </p>
          </div>
        </div>

        {/* Sticky sub-nav */}
        <div style={{
          position: "sticky", top: 76, zIndex: 20,
          background: "rgba(36,24,16,0.9)", backdropFilter: "blur(10px)",
          borderTop: "1px solid rgba(245,237,224,0.12)", borderBottom: "1px solid rgba(245,237,224,0.12)",
          marginBottom: 40, padding: "14px 0", display: "flex", gap: 8, overflowX: "auto",
        }}>
          {SERVICES.map((s, i) => (
            <button key={s.id}
              onClick={() => jumpTo(s.id)}
              style={{
                border: `1px solid ${active === s.id ? "var(--sand-100)" : "rgba(245,237,224,0.2)"}`,
                background: active === s.id ? "var(--sand-100)" : "transparent",
                color: active === s.id ? "var(--espresso-900)" : "var(--sand-100)",
                padding: "10px 18px", borderRadius: "var(--r-pill)", cursor: "pointer",
                fontFamily: "var(--f-body)", fontSize: 13, fontWeight: 500, whiteSpace: "nowrap",
                transition: "all .2s",
              }}
            >
              <span style={{ fontFamily: "var(--f-mono)", fontSize: 10, marginRight: 8, opacity: 0.7 }}>0{i + 1}</span>
              {s.kind}
            </button>
          ))}
        </div>

        {/* Service rows */}
        <div ref={scrollRef}>
          {SERVICES.map((s, i) => (
            <ServiceRow key={s.id} service={s} index={i} onBook={onBook} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceRow({ service, index, onBook }) {
  const R = (window.__resources || {});
  const srcPt     = R.pt        || "assets/pt-session.png";
  const srcGroup  = R.group     || "assets/group-workout.png";
  const srcWork   = R.workshops || "assets/workshops.png";
  const srcRec    = R.sauna     || "assets/sauna.png";
  const tones = {
    walnut:   { bg: "var(--walnut-700)", fg: "var(--paper)", accent: "var(--sand-200)" },
    espresso: { bg: "var(--espresso-800)", fg: "var(--paper)", accent: "var(--sand-300)" },
    sand:     { bg: "var(--sand-100)", fg: "var(--espresso-900)", accent: "var(--walnut-700)" },
    sage:     { bg: "var(--sage-500)", fg: "var(--paper)", accent: "var(--sand-200)" },
    terra:    { bg: "var(--terracotta-500)", fg: "var(--paper)", accent: "var(--sand-200)" },
  };
  const t = tones[service.tone];
  return (
    <div id={"svc-" + service.id} style={{
      background: t.bg, color: t.fg,
      borderRadius: "var(--r-xl)",
      padding: "64px", marginBottom: 24,
      display: "grid", gridTemplateColumns: "0.8fr 1.2fr", gap: 64,
    }}>
      <div>
        <div style={{ fontFamily: "var(--f-mono)", fontSize: 11, letterSpacing: 2, opacity: 0.7, textTransform: "uppercase" }}>
          0{index + 1} / 0{SERVICES.length} · {service.kind}
        </div>
        <h3 style={{
          fontFamily: "var(--f-display)", fontWeight: 400,
          fontSize: "clamp(40px, 4.5vw, 60px)", lineHeight: 1.05, letterSpacing: -1,
          margin: "16px 0 0",
        }}>{service.tagline}</h3>
        <div style={{ marginTop: 28, borderRadius: "var(--r-md)", overflow: "hidden", aspectRatio: "5/4" }}>
          {service.id === "approach"
            ? <ApproachDiagram />
            : service.id === "pt"
            ? <img src={srcPt} alt="1:1 coaching at M3S" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", display: "block" }} />
            : service.id === "group"
            ? <img src={srcGroup} alt="Group workout at M3S" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            : service.id === "work"
            ? <img src={srcWork} alt="Workshop at M3S" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", display: "block" }} />
            : service.id === "recover"
            ? <img src={srcRec} alt="Infrared sauna at M3S" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", display: "block" }} />
            : <Placeholder label={service.kind.toLowerCase()} tone={service.tone === "sand" ? "walnut" : "sand"} w={600} h={480} />}
        </div>
      </div>
      <div style={{ paddingTop: 40 }}>
        <p style={{ fontSize: 19, lineHeight: 1.55, margin: 0, opacity: 0.92 }}>{service.desc}</p>

        <div style={{ marginTop: 40, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0, borderTop: `1px solid ${t.fg === "var(--paper)" ? "rgba(255,253,248,0.18)" : "var(--hairline)"}` }}>
          {service.items.map((it, i) => (
            <div key={i} style={{
              padding: "18px 0",
              borderBottom: `1px solid ${t.fg === "var(--paper)" ? "rgba(255,253,248,0.12)" : "var(--hairline)"}`,
              paddingLeft: i % 2 === 1 ? 20 : 0,
              display: "flex", alignItems: "center", gap: 14,
            }}>
              <span style={{ fontFamily: "var(--f-mono)", fontSize: 11, opacity: 0.5 }}>0{i + 1}</span>
              <span style={{ fontSize: 16 }}>{it}</span>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 36, display: "flex", gap: 12 }}>
          <Btn onClick={onBook} variant={service.tone === "sand" ? "primary" : "secondary"} style={service.tone !== "sand" ? { color: t.fg, borderColor: t.fg } : undefined}>
            Book this →
          </Btn>
          <Btn variant="ghost" style={{ color: t.fg, opacity: 0.75 }}>Learn more</Btn>
        </div>
      </div>
    </div>
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
        <div style={{ marginTop: 60, paddingTop: 24, borderTop: "1px solid rgba(245,237,224,0.12)", display: "flex", justifyContent: "space-between", fontFamily: "var(--f-mono)", fontSize: 11, opacity: 0.6 }}>
          <span>© 2026 My Third Space</span>
          <span>#ATMYTHIRDSPACE</span>
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
