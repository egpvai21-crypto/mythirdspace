// Trainers grid, Social (IG), Members portal, Kenko Life
const { useState: useXS, useMemo: useXM } = React;

// ============ TRAINER PROFILE OVERLAY ============
function TrainerProfile({ trainer, onClose, onBook }) {
  if (!trainer) return null;
  const V = "?v=15";
  const imgMap = { rahul: "assets/rahul.jpg" + V, joe: "assets/joe.jpg" + V, aakash: "assets/aakash.jpg" + V, deepika: "assets/deepika.jpg" + V, lee: "assets/lee.jpg" + V, deb: "assets/deb.jpg" + V, tarun: "assets/tarun.jpg" + V, pilates: "assets/anisha.jpg" + V, shahbaz: "assets/shahbaz.jpg" + V, santo: "assets/santo.jpg" + V };
  const imgSrc = imgMap[trainer.id] || null;
  React.useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, []);
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 200, background: "rgba(30,20,14,0.55)",
      backdropFilter: "blur(8px)", overflowY: "auto", padding: "40px 20px",
    }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{
        maxWidth: "min(1180px, calc(100vw - 40px))", margin: "0 auto", background: "var(--paper)",
        borderRadius: "var(--r-xl)", overflow: "hidden", boxShadow: "var(--sh-3)",
        border: "1px solid var(--hairline-strong)",
      }}>
        {/* Top bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 32px", borderBottom: "1px solid var(--hairline)" }}>
          <div style={{ fontFamily: "var(--f-mono)", fontSize: 11, letterSpacing: 2, color: "var(--clay-600)", textTransform: "uppercase" }}>
            Coach Profile · M3S
          </div>
          <button onClick={onClose} style={{ border: "1px solid var(--hairline)", background: "var(--sand-50)", borderRadius: "var(--r-pill)", padding: "8px 18px", cursor: "pointer", fontFamily: "var(--f-mono)", fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase" }}>Close ✕</button>
        </div>

        {/* Hero */}
        <div style={{ display: "grid", gridTemplateColumns: "minmax(280px, 0.85fr) 1.15fr", gap: 0, alignItems: "stretch" }}>
          <div style={{ aspectRatio: "4/5", background: "var(--espresso-900)", position: "relative", overflow: "hidden" }}>
            {imgSrc
              ? <img src={imgSrc} alt={trainer.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              : <Placeholder label="" tone={trainer.tone} w={450} h={800} />}
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(30,20,14,0) 60%, rgba(30,20,14,0.7))" }} />
            <div style={{ position: "absolute", left: 24, bottom: 24, right: 24, color: "var(--paper)" }}>
              <div style={{ fontFamily: "var(--f-mono)", fontSize: 10, letterSpacing: 2, opacity: 0.85, textTransform: "uppercase" }}>{trainer.cert}</div>
              <h2 style={{ fontFamily: "var(--f-display)", fontSize: 72, fontWeight: 400, lineHeight: 0.95, margin: "6px 0 0" }}>{trainer.name}</h2>
            </div>
          </div>
          <div style={{ padding: "48px 48px 40px", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "var(--sand-50)" }}>
            <div>
              <div style={{ fontFamily: "var(--f-mono)", fontSize: 10, letterSpacing: 2, color: "var(--clay-600)", textTransform: "uppercase", marginBottom: 16 }}>About</div>
              <h3 style={{ fontFamily: "var(--f-display)", fontSize: 38, fontWeight: 400, lineHeight: 1.1, margin: "0 0 20px", color: "var(--espresso-900)" }}>
                {trainer.role}
              </h3>
              <p style={{ fontSize: 17, lineHeight: 1.65, color: "var(--espresso-800)", margin: 0 }}>{trainer.bio}</p>
              <p style={{ fontSize: 15, lineHeight: 1.65, color: "var(--espresso-800)", opacity: 0.78, margin: "16px 0 0" }}>
                {trainer.name.split(" ")[0]} works with members across strength blocks, Hyrox prep, and return-to-training after injury. Expect honest feedback, small-group attention, and programming you can actually follow.
              </p>

              <div style={{ marginTop: 32 }}>
                <div style={{ fontFamily: "var(--f-mono)", fontSize: 10, letterSpacing: 2, color: "var(--clay-600)", textTransform: "uppercase", marginBottom: 12 }}>Core competencies</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {trainer.specialties.map(s => <Chip key={s}>{s}</Chip>)}
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 12, marginTop: 40 }}>
              {trainer.ptEligible
                ? <Btn onClick={() => { onBook && onBook(); onClose(); }}>Book with {trainer.name.split(" ")[0]} →</Btn>
                : <div style={{ fontFamily: "var(--f-mono)", fontSize: 11, letterSpacing: 1.5, color: "var(--clay-600)", textTransform: "uppercase", padding: "12px 0" }}>Group classes only — see the schedule</div>}
            </div>
          </div>
        </div>

        {/* Stats band */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", borderTop: "1px solid var(--hairline)", borderBottom: "1px solid var(--hairline)", background: "var(--paper)" }}>
          {[
            { v: "10+ yrs", l: "On the floor" },
            { v: "3×/wk", l: "Avg. member cadence" },
            { v: "220+", l: "Members coached" },
            { v: "★ 4.9", l: "Member rating" },
          ].map((s, i) => (
            <div key={i} style={{ padding: 28, borderRight: i < 3 ? "1px solid var(--hairline)" : "none" }}>
              <div style={{ fontFamily: "var(--f-display)", fontSize: 32, color: "var(--walnut-700)" }}>{s.v}</div>
              <div style={{ fontFamily: "var(--f-mono)", fontSize: 10, letterSpacing: 1.5, color: "var(--clay-600)", textTransform: "uppercase", marginTop: 4 }}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* Media gallery */}
        <div style={{ padding: "56px 48px 24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", marginBottom: 24 }}>
            <div>
              <div style={{ fontFamily: "var(--f-mono)", fontSize: 10, letterSpacing: 2, color: "var(--clay-600)", textTransform: "uppercase" }}>Gallery</div>
              <h4 style={{ fontFamily: "var(--f-display)", fontSize: 36, fontWeight: 400, margin: "6px 0 0", color: "var(--espresso-900)" }}>On the floor with {trainer.name.split(" ")[0]}</h4>
            </div>
            <div style={{ fontFamily: "var(--f-mono)", fontSize: 10, letterSpacing: 1.5, color: "var(--clay-600)" }}>COMING SOON · ADD MEDIA</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr 1fr", gap: 12 }}>
            <div style={{ aspectRatio: "4/5", position: "relative", borderRadius: "var(--r-md)", overflow: "hidden", background: "var(--sand-200)" }}>
              <Placeholder label="" tone={trainer.tone} w={500} h={625} />
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(251,247,240,0.9)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, color: "var(--walnut-700)" }}>▶</div>
              </div>
              <div style={{ position: "absolute", left: 16, bottom: 16, fontFamily: "var(--f-mono)", fontSize: 10, letterSpacing: 1.5, color: "var(--paper)", textTransform: "uppercase" }}>Video · Form walkthrough</div>
            </div>
            <div style={{ aspectRatio: "4/5", borderRadius: "var(--r-md)", overflow: "hidden" }}>
              <Placeholder label="" tone="walnut" w={400} h={500} />
            </div>
            <div style={{ aspectRatio: "4/5", borderRadius: "var(--r-md)", overflow: "hidden" }}>
              <Placeholder label="" tone="sand" w={400} h={500} />
            </div>
          </div>
        </div>

        <div style={{ padding: "24px 48px 48px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div style={{ fontFamily: "var(--f-mono)", fontSize: 11, letterSpacing: 1.5, color: "var(--clay-600)", textTransform: "uppercase" }}>
            Press ESC to close
          </div>
          <Btn onClick={() => { onBook && onBook(); onClose(); }}>See {trainer.name.split(" ")[0]}'s schedule →</Btn>
        </div>
      </div>
    </div>
  );
}

// ============ TRAINERS ============
function TrainersSection() {
  const [active, setActive] = useXS(TRAINERS[0].id);
  const [profileId, setProfileId] = useXS(null);
  const t = TRAINERS.find(x => x.id === active);
  const profile = profileId ? TRAINERS.find(x => x.id === profileId) : null;
  const scrollToBook = () => {
    const el = document.getElementById("book");
    if (el) window.scrollTo({ top: el.offsetTop - 80, behavior: "smooth" });
  };
  return (
    <Section id="trainers" bg="var(--sand-100)">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "end", marginBottom: 56 }}>
        <EyebrowTitle eyebrow="Our Team" title={<>Coaches, not<br/><em style={{ fontStyle: "italic", color: "var(--sage-500)" }}>influencers.</em></>} />
        <p style={{ fontSize: 17, lineHeight: 1.6, color: "var(--espresso-800)", opacity: 0.85, margin: 0, maxWidth: 460 }}>
          Ten certified practitioners, each with a decade or more on the floor. Hover to preview — tap any coach to open their profile.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 40 }}>
        {TRAINERS.map(tr => (
          <button key={tr.id}
            onMouseEnter={() => setActive(tr.id)}
            onClick={() => setProfileId(tr.id)}
            style={{
              border: "none", padding: 0, cursor: "pointer", background: "transparent", textAlign: "left",
              transition: "all .3s",
            }}>
            <div style={{ aspectRatio: "3/4", borderRadius: "var(--r-lg)", overflow: "hidden", position: "relative",
              border: active === tr.id ? "2px solid var(--walnut-700)" : "1px solid var(--hairline)",
              transform: active === tr.id ? "translateY(-6px)" : "none",
              boxShadow: active === tr.id ? "var(--sh-3)" : "var(--sh-1)",
              transition: "all .3s",
            }}>
              {(() => {
                const map = { rahul: "assets/rahul.jpg?v=15", joe: "assets/joe.jpg?v=15", aakash: "assets/aakash.jpg?v=15", deepika: "assets/deepika.jpg?v=15", lee: "assets/lee.jpg?v=15", deb: "assets/deb.jpg?v=15", tarun: "assets/tarun.jpg?v=15", pilates: "assets/anisha.jpg?v=15", shahbaz: "assets/shahbaz.jpg?v=15", santo: "assets/santo.jpg?v=15" };
                const src = map[tr.id];
                return src
                  ? <img src={src} alt={tr.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                  : <Placeholder label="" tone={tr.tone} w={400} h={520} />;
              })()}
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(30,20,14,0) 78%, rgba(30,20,14,0.45))", pointerEvents: "none" }} />
              <div style={{ position: "absolute", left: 14, bottom: 14, right: 14, color: "var(--paper)", textShadow: "0 2px 8px rgba(0,0,0,0.6)" }}>
                <div style={{ fontFamily: "var(--f-display)", fontSize: 22, lineHeight: 1 }}>{tr.name.split(" ")[0]}</div>
                <div style={{ fontFamily: "var(--f-mono)", fontSize: 9, letterSpacing: 1.5, opacity: 0.85, marginTop: 4, textTransform: "uppercase" }}>{tr.cert}</div>
              </div>
            </div>
          </button>
        ))}
      </div>

      <Card tone="paper" style={{ padding: 40, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 24 }}>
        <div>
          <div style={{ fontFamily: "var(--f-mono)", fontSize: 10, letterSpacing: 2, color: "var(--clay-600)", textTransform: "uppercase", marginBottom: 6 }}>Tap any coach above</div>
          <div style={{ fontFamily: "var(--f-display)", fontSize: 28, color: "var(--espresso-900)", lineHeight: 1.15 }}>
            Open a profile to see their full bio, core competencies, and schedule.
          </div>
        </div>
        <Btn onClick={scrollToBook}>Book a session →</Btn>
      </Card>

      <TrainerProfile trainer={profile} onClose={() => setProfileId(null)} onBook={scrollToBook} />
    </Section>
  );
}

// ============ SOCIAL / INSTAGRAM ============
function SocialSection() {
  return (
    <Section id="social" bg="var(--sand-50)">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "end", marginBottom: 48 }}>
        <EyebrowTitle eyebrow="@my.thirdspace" title={<>The floor,<br/>in pictures.</>} />
        <div style={{ textAlign: "right" }}>
          <p style={{ fontSize: 16, lineHeight: 1.6, color: "var(--espresso-800)", opacity: 0.85, margin: 0, marginLeft: "auto", maxWidth: 440 }}>
            Live from our Instagram. Workshops, member stories, ice-bath Mondays, and the occasional coach in mid-hysterics.
          </p>
          <div style={{ marginTop: 20 }}>
            <Btn as="a" href="https://www.instagram.com/my.thirdspace/" variant="secondary" size="sm">Follow →</Btn>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {IG_POSTS.map((p, i) => <IGPost key={i} p={p} i={i} />)}
      </div>

      <div style={{ marginTop: 40, padding: 24, background: "var(--sand-100)", borderRadius: "var(--r-lg)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
        <div style={{ display: "flex", gap: 40 }}>
          <div>
            <div style={{ fontFamily: "var(--f-display)", fontSize: 32, color: "var(--walnut-700)" }}>12.4K</div>
            <div style={{ fontFamily: "var(--f-mono)", fontSize: 10, letterSpacing: 1.5, color: "var(--clay-600)", textTransform: "uppercase", marginTop: 2 }}>Followers</div>
          </div>
          <div>
            <div style={{ fontFamily: "var(--f-display)", fontSize: 32, color: "var(--walnut-700)" }}>482</div>
            <div style={{ fontFamily: "var(--f-mono)", fontSize: 10, letterSpacing: 1.5, color: "var(--clay-600)", textTransform: "uppercase", marginTop: 2 }}>Posts</div>
          </div>
          <div>
            <div style={{ fontFamily: "var(--f-display)", fontSize: 32, color: "var(--walnut-700)" }}>6.2%</div>
            <div style={{ fontFamily: "var(--f-mono)", fontSize: 10, letterSpacing: 1.5, color: "var(--clay-600)", textTransform: "uppercase", marginTop: 2 }}>Engagement</div>
          </div>
        </div>
        <div style={{ fontFamily: "var(--f-mono)", fontSize: 11, letterSpacing: 1.5, color: "var(--clay-600)", textTransform: "uppercase" }}>
          #ATMYTHIRDSPACE
        </div>
      </div>
    </Section>
  );
}

function IGPost({ p, i }) {
  const [hover, setHover] = useXS(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ position: "relative", aspectRatio: "1/1", borderRadius: "var(--r-md)", overflow: "hidden", cursor: "pointer", border: "1px solid var(--hairline)" }}
    >
      <Placeholder label={p.tag.toLowerCase()} tone={p.tone} w={500} h={500} />
      <div style={{
        position: "absolute", inset: 0,
        background: hover ? "rgba(30,20,14,0.78)" : "linear-gradient(180deg, rgba(30,20,14,0) 50%, rgba(30,20,14,0.45))",
        display: "flex", flexDirection: "column", justifyContent: "space-between",
        padding: 18, color: "var(--paper)",
        transition: "background .3s",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ fontFamily: "var(--f-mono)", fontSize: 9, letterSpacing: 2, padding: "4px 8px", background: "rgba(255,253,248,0.2)", borderRadius: 4, backdropFilter: "blur(4px)" }}>
            {p.tag}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 4, fontFamily: "var(--f-mono)", fontSize: 11 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M12 21s-7-4.5-7-11a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 6.5-7 11-7 11z"/></svg>
            {p.likes}
          </div>
        </div>
        <div style={{ fontFamily: "var(--f-body)", fontSize: 13, lineHeight: 1.5, opacity: hover ? 1 : 0, transition: "opacity .25s" }}>
          {p.cap}
        </div>
      </div>
    </div>
  );
}

// ============ MEMBERS PORTAL ============
function MembersSection() {
  const [loggedIn, setLoggedIn] = useXS(false);
  const [method, setMethod] = useXS(null); // google, phone
  const [val, setVal] = useXS("");
  const [otpSent, setOtpSent] = useXS(false);

  const login = () => { setLoggedIn(true); };

  return (
    <Section id="members" bg="var(--espresso-900)" style={{ color: "var(--sand-100)" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "end", marginBottom: 56 }}>
        <EyebrowTitle eyebrow="Members" title={<>Your body,<br/><em style={{ fontStyle: "italic", color: "var(--terracotta-500)" }}>measured.</em></>} color="var(--sand-100)" />
        <p style={{ fontSize: 17, lineHeight: 1.6, color: "var(--sand-200)", margin: 0, maxWidth: 440 }}>
          Log in to sync your wearable, upload BCA scans, and track how the work is translating. No spreadsheets. No guessing.
        </p>
      </div>

      {!loggedIn ? (
        <MembersLogin method={method} setMethod={setMethod} val={val} setVal={setVal} otpSent={otpSent} setOtpSent={setOtpSent} onLogin={login} />
      ) : (
        <MembersDashboard onSignOut={() => { setLoggedIn(false); setMethod(null); setVal(""); setOtpSent(false); }} />
      )}
    </Section>
  );
}

function MembersLogin({ method, setMethod, val, setVal, otpSent, setOtpSent, onLogin }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
      <div style={{ background: "var(--sand-50)", color: "var(--ink)", padding: 48, borderRadius: "var(--r-xl)" }}>
        <div style={{ fontFamily: "var(--f-mono)", fontSize: 10, letterSpacing: 2, color: "var(--clay-600)", textTransform: "uppercase", marginBottom: 12 }}>Sign in · no password</div>
        <h3 style={{ fontFamily: "var(--f-display)", fontSize: 44, fontWeight: 400, margin: 0, lineHeight: 1.05, color: "var(--espresso-900)" }}>Welcome back.</h3>
        <p style={{ fontSize: 14, color: "var(--espresso-800)", opacity: 0.8, marginTop: 10 }}>
          Members see their training history, BCA trends, and upcoming bookings.
        </p>

        <div style={{ marginTop: 32, display: "flex", flexDirection: "column", gap: 12 }}>
          <button onClick={() => { setMethod("google"); setTimeout(onLogin, 400); }}
            style={{
              display: "flex", alignItems: "center", gap: 14, padding: "16px 20px",
              background: "var(--paper)", border: "1.5px solid var(--hairline-strong)",
              borderRadius: "var(--r-md)", cursor: "pointer",
              fontFamily: "var(--f-body)", fontSize: 15, fontWeight: 500, color: "var(--espresso-900)",
              transition: "all .2s",
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = "var(--walnut-700)"}
            onMouseLeave={e => e.currentTarget.style.borderColor = "var(--hairline-strong)"}>
            <GoogleG />
            Continue with Google
            <span style={{ marginLeft: "auto", fontFamily: "var(--f-mono)", fontSize: 10, color: "var(--clay-600)", letterSpacing: 1 }}>→</span>
          </button>

          <div style={{ textAlign: "center", fontFamily: "var(--f-mono)", fontSize: 10, letterSpacing: 2, color: "var(--clay-600)", padding: "8px 0" }}>OR</div>

          <div style={{ padding: 18, border: `1.5px solid ${method === "phone" ? "var(--walnut-700)" : "var(--hairline-strong)"}`, borderRadius: "var(--r-md)", background: "var(--paper)" }}>
            <label style={{ fontFamily: "var(--f-mono)", fontSize: 10, letterSpacing: 2, color: "var(--clay-600)", textTransform: "uppercase" }}>Phone number</label>
            <div style={{ display: "flex", gap: 8, marginTop: 8, alignItems: "center" }}>
              <span style={{ fontFamily: "var(--f-mono)", fontSize: 15, color: "var(--walnut-700)" }}>+91</span>
              <input
                type="tel" value={val} onChange={e => { setMethod("phone"); setVal(e.target.value); }}
                placeholder="98200 12345"
                style={{ flex: 1, border: "none", background: "transparent", outline: "none", fontFamily: "var(--f-body)", fontSize: 16, color: "var(--espresso-900)" }}
              />
            </div>
            {otpSent && (
              <div style={{ marginTop: 16, padding: 14, background: "var(--sand-100)", borderRadius: "var(--r-sm)" }}>
                <div style={{ fontFamily: "var(--f-mono)", fontSize: 10, letterSpacing: 2, color: "var(--clay-600)", textTransform: "uppercase" }}>OTP sent to +91 {val}</div>
                <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                  {[0,1,2,3].map(i => (
                    <input key={i} maxLength={1} defaultValue={["9","1","2","4"][i]} style={{
                      width: 44, height: 48, textAlign: "center",
                      border: "1.5px solid var(--hairline-strong)", borderRadius: "var(--r-sm)",
                      background: "var(--paper)", fontFamily: "var(--f-mono)", fontSize: 20, fontWeight: 600,
                      color: "var(--walnut-700)", outline: "none",
                    }}/>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Btn onClick={() => { if (!otpSent && val.length >= 5) setOtpSent(true); else if (otpSent) onLogin(); }}
            disabled={val.length < 5} style={{ marginTop: 8, justifyContent: "center" }}>
            {otpSent ? "Verify & Sign In" : "Send OTP"}
          </Btn>
        </div>

        <div style={{ marginTop: 24, fontSize: 12, lineHeight: 1.6, color: "var(--espresso-800)", opacity: 0.7 }}>
          By continuing you agree to our Terms and Privacy. We'll never spam — we're a gym.
        </div>
      </div>

      <div style={{ padding: 48, borderRadius: "var(--r-xl)", background: "var(--walnut-700)", color: "var(--sand-100)" }}>
        <div style={{ fontFamily: "var(--f-mono)", fontSize: 10, letterSpacing: 2, opacity: 0.7, textTransform: "uppercase" }}>What's inside</div>
        <h3 style={{ fontFamily: "var(--f-display)", fontSize: 40, fontWeight: 400, margin: "12px 0 24px", lineHeight: 1.05 }}>Training, measured.</h3>

        {[
          { icon: "clock", title: "Wearable sync", body: "Connect Garmin, Apple Watch, WHOOP, Oura. Your sleep, HRV, and training load — in one view." },
          { icon: "heart", title: "BCA history", body: "Upload your Tanita MC-780 scan. We turn the paper into graphs and insights." },
          { icon: "calendar", title: "Booking history", body: "Every session, every coach, every note. Rebook a favorite in one tap." },
          { icon: "leaf", title: "Kenko meal log", body: "Order-ahead from our in-house cafe; meals link to your training days." },
        ].map((f, i) => (
          <div key={i} style={{ padding: "18px 0", borderBottom: i < 3 ? "1px solid rgba(245,237,224,0.15)" : "none", display: "flex", gap: 18, alignItems: "flex-start" }}>
            <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(255,253,248,0.1)", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Icon name={f.icon} size={18} color="var(--sand-100)" />
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 600 }}>{f.title}</div>
              <div style={{ fontSize: 13, lineHeight: 1.55, opacity: 0.8, marginTop: 4 }}>{f.body}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function GoogleG() {
  return (
    <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden>
      <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.4l6.7-6.7C35.5 2.3 30 0 24 0 14.6 0 6.6 5.4 2.6 13.2l7.8 6c1.9-5.7 7.3-9.7 13.6-9.7z"/>
      <path fill="#4285F4" d="M46.5 24.5c0-1.5-.1-3-.4-4.5H24v9h12.7c-.5 3-2.3 5.6-4.8 7.3l7.4 5.7c4.3-4 6.7-9.8 6.7-17.5z"/>
      <path fill="#FBBC05" d="M10.4 28.8c-.5-1.4-.8-2.9-.8-4.4s.3-3 .8-4.4l-7.8-6C1 17.3 0 20.5 0 24s1 6.7 2.6 9.5l7.8-4.7z"/>
      <path fill="#34A853" d="M24 48c6 0 11-2 14.7-5.4l-7.4-5.7c-2 1.4-4.6 2.2-7.3 2.2-6.3 0-11.7-4-13.6-9.6l-7.8 4.7C6.6 42.6 14.6 48 24 48z"/>
    </svg>
  );
}

function MembersDashboard({ onSignOut }) {
  const [bcaUploaded, setBcaUploaded] = useXS(true); // pre-loaded sample for demo
  const [wearables, setWearables] = useXS({ garmin: true, apple: false, whoop: true, oura: false });
  const latest = BCA_HISTORY[BCA_HISTORY.length - 1];
  const first = BCA_HISTORY[0];

  return (
    <div style={{ background: "var(--sand-50)", color: "var(--ink)", borderRadius: "var(--r-xl)", padding: 40 }}>
      {/* Top bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 28, borderBottom: "1px solid var(--hairline)", flexWrap: "wrap", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 48, height: 48, borderRadius: "50%", background: "var(--walnut-700)", color: "var(--paper)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--f-display)", fontSize: 22 }}>K</div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 600, color: "var(--espresso-900)" }}>Hi, Karan</div>
            <div style={{ fontFamily: "var(--f-mono)", fontSize: 10, letterSpacing: 1.5, color: "var(--clay-600)", textTransform: "uppercase", marginTop: 2 }}>Member · 18 months</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 24, fontFamily: "var(--f-mono)", fontSize: 11, letterSpacing: 1, color: "var(--clay-600)", textTransform: "uppercase" }}>
          <span>SESSIONS: 142</span>
          <span>STREAK: 18 DAYS</span>
          <button onClick={onSignOut} style={{ border: "none", background: "transparent", color: "var(--walnut-700)", cursor: "pointer", fontFamily: "inherit", fontSize: "inherit", letterSpacing: "inherit", textTransform: "inherit" }}>Sign out →</button>
        </div>
      </div>

      {/* Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 24, marginTop: 32 }}>
        {/* Left: BCA graphs */}
        <div>
          <Card tone="paper" style={{ padding: 32 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 24 }}>
              <div>
                <div style={{ fontFamily: "var(--f-mono)", fontSize: 10, letterSpacing: 2, color: "var(--clay-600)", textTransform: "uppercase" }}>Body Composition · Tanita MC-780</div>
                <h3 style={{ fontFamily: "var(--f-display)", fontSize: 30, fontWeight: 400, margin: "6px 0 0", color: "var(--espresso-900)" }}>Your trajectory, six months.</h3>
              </div>
              <button style={{ padding: "8px 14px", background: "var(--sand-100)", border: "1px solid var(--hairline)", borderRadius: "var(--r-pill)", fontFamily: "var(--f-mono)", fontSize: 10, letterSpacing: 1.5, color: "var(--walnut-700)", cursor: "pointer", textTransform: "uppercase" }}>
                + Upload New Scan
              </button>
            </div>

            <BCAChart />

            <div style={{ marginTop: 24, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0, borderTop: "1px solid var(--hairline)" }}>
              {[
                { k: "Weight", v: `${latest.weight} kg`, d: latest.weight - first.weight, unit: "kg" },
                { k: "Body Fat", v: `${latest.fatPct}%`, d: latest.fatPct - first.fatPct, unit: "%" },
                { k: "Muscle Mass", v: `${latest.muscle} kg`, d: latest.muscle - first.muscle, unit: "kg" },
                { k: "Metabolic Age", v: `${latest.metabolicAge} yrs`, d: latest.metabolicAge - first.metabolicAge, unit: "yr" },
              ].map((m, i) => {
                const isGoodDown = m.k === "Weight" || m.k === "Body Fat" || m.k === "Metabolic Age";
                const good = isGoodDown ? m.d < 0 : m.d > 0;
                return (
                  <div key={i} style={{ padding: "20px 16px", borderRight: i < 3 ? "1px solid var(--hairline)" : "none" }}>
                    <div style={{ fontFamily: "var(--f-mono)", fontSize: 10, letterSpacing: 1.5, color: "var(--clay-600)", textTransform: "uppercase" }}>{m.k}</div>
                    <div style={{ fontFamily: "var(--f-display)", fontSize: 30, color: "var(--espresso-900)", marginTop: 6, lineHeight: 1 }}>{m.v}</div>
                    <div style={{ fontFamily: "var(--f-mono)", fontSize: 11, color: good ? "var(--sage-500)" : "var(--terracotta-500)", marginTop: 6 }}>
                      {m.d > 0 ? "↑" : "↓"} {Math.abs(m.d).toFixed(1)} {m.unit} vs Oct
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          <Card tone="paper" style={{ padding: 32, marginTop: 24 }}>
            <div style={{ fontFamily: "var(--f-mono)", fontSize: 10, letterSpacing: 2, color: "var(--clay-600)", textTransform: "uppercase" }}>Insights · from your last scan</div>
            <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { tone: "sage", title: "Visceral fat dropped to 12", body: "Down from 14 in October. You're now in the Normal range. Keep the Zone 2 cardio on Tue/Thu." },
                { tone: "walnut", title: "Muscle mass up 1.6 kg", body: "Strong signal from the progressive overload block. Nisha recommends bumping protein to 170g/day." },
                { tone: "terra", title: "Right-side arm asymmetry", body: "4.4 kg left vs 4.2 kg right. Suggest unilateral dumbbell work — mention to Shwetambari next session." },
              ].map((ins, i) => (
                <div key={i} style={{ padding: 16, background: "var(--sand-100)", borderLeft: `3px solid var(--${ins.tone === "sage" ? "sage-500" : ins.tone === "walnut" ? "walnut-700" : "terracotta-500"})`, borderRadius: "var(--r-sm)" }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "var(--espresso-900)" }}>{ins.title}</div>
                  <div style={{ fontSize: 13, lineHeight: 1.55, color: "var(--espresso-800)", marginTop: 4, opacity: 0.9 }}>{ins.body}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right: Wearables + upcoming */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <Card tone="paper" style={{ padding: 28 }}>
            <div style={{ fontFamily: "var(--f-mono)", fontSize: 10, letterSpacing: 2, color: "var(--clay-600)", textTransform: "uppercase" }}>Wearables</div>
            <div style={{ fontFamily: "var(--f-display)", fontSize: 22, color: "var(--espresso-900)", marginTop: 4 }}>Sync your data</div>
            <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                { id: "garmin", label: "Garmin Connect", body: "HR, VO2, sleep, running dynamics" },
                { id: "apple", label: "Apple Watch", body: "Activity rings, HRV, workouts" },
                { id: "whoop", label: "WHOOP 4.0", body: "Recovery, strain, sleep stages" },
                { id: "oura", label: "Oura Ring", body: "Sleep score, readiness, body temp" },
              ].map(w => {
                const on = wearables[w.id];
                return (
                  <button key={w.id} onClick={() => setWearables({ ...wearables, [w.id]: !on })}
                    style={{
                      display: "flex", alignItems: "center", gap: 12, padding: 14,
                      borderRadius: "var(--r-md)",
                      border: `1px solid ${on ? "var(--sage-500)" : "var(--hairline)"}`,
                      background: on ? "var(--sage-200)" : "var(--paper)",
                      cursor: "pointer", textAlign: "left", transition: "all .2s",
                    }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: on ? "var(--sage-500)" : "var(--sand-200)", color: on ? "var(--paper)" : "var(--walnut-700)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--f-mono)", fontSize: 11, fontWeight: 600 }}>
                      {w.id[0].toUpperCase()}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "var(--espresso-900)" }}>{w.label}</div>
                      <div style={{ fontFamily: "var(--f-mono)", fontSize: 10, letterSpacing: 1, color: "var(--clay-600)", marginTop: 2 }}>{w.body}</div>
                    </div>
                    <div style={{ fontFamily: "var(--f-mono)", fontSize: 10, letterSpacing: 1.5, color: on ? "#4a5a41" : "var(--clay-600)", textTransform: "uppercase" }}>
                      {on ? "● SYNCED" : "+ CONNECT"}
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>

          <Card tone="walnut" style={{ padding: 28 }}>
            <div style={{ fontFamily: "var(--f-mono)", fontSize: 10, letterSpacing: 2, opacity: 0.7, textTransform: "uppercase" }}>Upcoming</div>
            <div style={{ fontFamily: "var(--f-display)", fontSize: 22, marginTop: 4 }}>Tomorrow · 6:30 AM</div>
            <div style={{ marginTop: 16, padding: 14, background: "rgba(255,253,248,0.08)", borderRadius: "var(--r-sm)", display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--sand-200)", color: "var(--walnut-700)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--f-display)", fontSize: 14 }}>SS</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>Strength w/ Shwetambari</div>
                <div style={{ fontFamily: "var(--f-mono)", fontSize: 10, opacity: 0.7, marginTop: 2 }}>60 MIN · M3S INDIRANAGAR</div>
              </div>
            </div>
            <Btn variant="secondary" size="sm" style={{ marginTop: 16, color: "var(--sand-100)", borderColor: "var(--sand-200)" }}>Reschedule</Btn>
          </Card>
        </div>
      </div>
    </div>
  );
}

function BCAChart() {
  // Plot weight, fat%, muscle over 4 time points
  const w = 620, h = 200, pad = 40;
  const dates = BCA_HISTORY.map(r => r.date);
  const series = [
    { key: "weight", label: "Weight (kg)", color: "#5E4228", range: [90, 100] },
    { key: "fatPct", label: "Body Fat %", color: "#B86B4B", range: [20, 26] },
    { key: "muscle", label: "Muscle (kg)", color: "#7B8B6F", range: [67, 71] },
  ];
  const toX = i => pad + (i / (BCA_HISTORY.length - 1)) * (w - pad * 2);
  const toY = (v, [lo, hi]) => h - pad - ((v - lo) / (hi - lo)) * (h - pad * 2);

  return (
    <div>
      <svg viewBox={`0 0 ${w} ${h}`} style={{ width: "100%", height: "auto" }}>
        {/* Gridlines */}
        {[0, 0.25, 0.5, 0.75, 1].map((p, i) => (
          <line key={i} x1={pad} x2={w - pad} y1={pad + p * (h - pad * 2)} y2={pad + p * (h - pad * 2)} stroke="#EADBC4" strokeWidth="1" strokeDasharray={i === 0 || i === 4 ? "0" : "2,3"} />
        ))}
        {/* Date labels */}
        {dates.map((d, i) => (
          <text key={i} x={toX(i)} y={h - 12} textAnchor="middle" fontFamily="JetBrains Mono" fontSize="10" fill="#8A6640" letterSpacing="1">{d.toUpperCase()}</text>
        ))}
        {/* Series */}
        {series.map(s => {
          const pts = BCA_HISTORY.map((r, i) => `${toX(i)},${toY(r[s.key], s.range)}`).join(" ");
          return (
            <g key={s.key}>
              <polyline points={pts} fill="none" stroke={s.color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
              {BCA_HISTORY.map((r, i) => (
                <circle key={i} cx={toX(i)} cy={toY(r[s.key], s.range)} r="4" fill="#FBF7F0" stroke={s.color} strokeWidth="2.5" />
              ))}
            </g>
          );
        })}
      </svg>
      <div style={{ display: "flex", gap: 20, marginTop: 12, flexWrap: "wrap" }}>
        {series.map(s => (
          <div key={s.key} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 12, height: 3, background: s.color, borderRadius: 2 }}></span>
            <span style={{ fontFamily: "var(--f-mono)", fontSize: 11, color: "var(--clay-600)", letterSpacing: 0.5 }}>{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============ KENKO LIFE ============
// Architecture: All menu data lives in window.KENKO_MENU (data.js).
// Update prices / add items / add categories by editing that object only.
// No JSX change needed.
function KenkoSection({ user }) {
  const C = window.KENKO_CONFIG;
  const cur = C.currency;
  const allItems = React.useMemo(
    () => window.KENKO_MENU.categories.flatMap(c => c.items),
    []
  );
  const itemById = React.useMemo(() => {
    const m = {};
    allItems.forEach(it => { m[it.id] = it; });
    return m;
  }, [allItems]);

  const [isMobile, setIsMobile] = React.useState(() => typeof window !== "undefined" && window.innerWidth < 760);
  React.useEffect(() => {
    const onR = () => setIsMobile(window.innerWidth < 760);
    window.addEventListener("resize", onR);
    return () => window.removeEventListener("resize", onR);
  }, []);

  // ── State ────────────────────────────────
  const [view, setView] = React.useState("menu"); // 'menu' | 'cart' | 'confirm'
  const [cart, setCart] = React.useState({});      // { [itemId]: qty }
  const [pickupTime, setPickupTime] = React.useState("");
  const [whatsappInput, setWhatsappInput] = React.useState("");
  const [editContact, setEditContact] = React.useState(false);

  // ── Cart helpers ─────────────────────────
  const addToCart = (id) => setCart(p => ({ ...p, [id]: (p[id] || 0) + 1 }));
  const removeFromCart = (id) => setCart(p => {
    const n = { ...p };
    if (n[id] > 1) n[id]--; else delete n[id];
    return n;
  });
  const cartCount = () => Object.values(cart).reduce((s, q) => s + q, 0);
  const cartTotal = () => Object.entries(cart).reduce((s, [id, q]) => s + (itemById[id]?.price || 0) * q, 0);

  // ── Time slots: 7:00 AM → 9:00 PM, past slots disabled ─────────
  const getPickupSlots = React.useCallback(() => {
    const now = new Date();
    const openingMins = 7 * 60;
    const closingMins = C.closingTime.h * 60 + C.closingTime.m;
    const earliestAvailable = Math.ceil((now.getHours() * 60 + now.getMinutes() + 15) / 15) * 15;
    const slots = [];
    for (let m = openingMins; m <= closingMins; m += C.pickupSlotMinutes) {
      const h = Math.floor(m / 60), min = m % 60;
      const value = `${String(h).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
      const suffix = h < 12 ? "AM" : "PM";
      const dispH = h > 12 ? h - 12 : h === 0 ? 12 : h;
      const display = `${dispH}:${String(min).padStart(2, "0")} ${suffix}`;
      slots.push({ value, display, disabled: m < earliestAvailable });
    }
    return slots;
  }, [C]);

  // ── Auth helpers ────────────────────────
  const loggedInPhone = user?.phone || "";
  const isLoggedIn = !!loggedInPhone;
  const maskedPhone = (() => {
    if (!loggedInPhone) return "";
    const digits = loggedInPhone.replace(/\D/g, "");
    if (digits.length < 4) return loggedInPhone;
    return `9XXXX XX${digits.slice(-3)}`;
  })();

  // ── Order submission ───────────────────
  const buildOrderText = (waNum) => {
    const lines = allItems
      .filter(it => cart[it.id])
      .map(it => `  ${cart[it.id]}× ${it.name} — ${cur}${it.price * cart[it.id]}`)
      .join("\n");
    const total = cartTotal();
    return encodeURIComponent(
      `🥗 *New Kenko Order*\n\n${lines}\n\n*Total: ${cur}${total}*\nPickup: ${pickupTime}\nCustomer WA: ${waNum}\n\nPayment collected at pickup.`
    );
  };
  const submitOrder = (waNum) => {
    const text = buildOrderText(waNum);
    window.open(`https://wa.me/${C.whatsappNumber}?text=${text}`, "_blank");
    if (C.petpoojaWebhook) {
      const payload = {
        items: allItems.filter(it => cart[it.id]).map(it => ({ id: it.id, name: it.name, qty: cart[it.id], price: it.price })),
        total: cartTotal(),
        pickupTime,
        customerWhatsapp: waNum,
      };
      fetch(C.petpoojaWebhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }).catch(() => {});
    }
    setView("confirm");
  };

  // ── Hero header (always shown above the menu/cart/confirm view) ──
  const heroBlock = (
    <div style={{
      padding: isMobile ? 28 : 56, borderRadius: "var(--r-xl)",
      background: "var(--sage-500)", color: "var(--paper)",
      display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1.2fr 1fr",
      gap: isMobile ? 28 : 60, alignItems: "center",
      marginBottom: 40, position: "relative", overflow: "hidden",
    }}>
      <div>
        <div style={{ fontFamily: "var(--f-mono)", fontSize: 11, letterSpacing: 2.5, opacity: 0.85, textTransform: "uppercase" }}>
          Kenko Life × M3S
        </div>
        <h2 style={{
          fontFamily: "var(--f-display)", fontSize: "clamp(38px, 6vw, 80px)",
          fontWeight: 400, lineHeight: 1.02, margin: "16px 0 20px", letterSpacing: -1,
        }}>
          Meals that<br/><em style={{ fontStyle: "italic" }}>match the work.</em>
        </h2>
        <p style={{ fontSize: isMobile ? 15 : 17, lineHeight: 1.6, margin: 0, opacity: 0.95, maxWidth: 440 }}>
          Our in-house cafe, run by Kenko Life — whole-food bowls, cold-pressed juice, and protein that doesn't taste like protein. Order ahead; pick up after class.
        </p>
        <div style={{ display: "flex", gap: 12, marginTop: 28, flexWrap: "wrap" }}>
          <Btn
            as="a"
            href={`https://wa.me/${C.whatsappNumber}?text=${encodeURIComponent("Hi Kenko! I'd like to chat about a custom order.")}`}
            style={{ background: "var(--paper)", color: "var(--sage-500)", borderColor: "var(--paper)" }}
          >
            <WhatsAppIcon /> Contact on WhatsApp
          </Btn>
          <Btn variant="ghost" style={{ color: "var(--paper)" }} onClick={() => {
            const el = document.getElementById("kenko-menu-start");
            if (el) {
              const top = el.getBoundingClientRect().top + window.scrollY - 100;
              window.scrollTo({ top, behavior: "smooth" });
            }
          }}>See menu →</Btn>
        </div>
      </div>
      <div style={{ borderRadius: "var(--r-lg)", overflow: "hidden", aspectRatio: "1/1" }}>
        <img src="assets/kenko-bowls.jpg" alt="Kenko Life meal bowls" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
      </div>
    </div>
  );

  return (
    <Section id="kenko" bg="var(--sand-100)" pad={isMobile ? "56px 0 72px" : "96px 0 120px"}>
      {heroBlock}
      <div id="kenko-menu-start" style={{ height: 0 }} />

      {view === "menu" && (
        <MenuView
          isMobile={isMobile}
          cart={cart}
          cartCount={cartCount()}
          cartTotal={cartTotal()}
          onAdd={addToCart}
          onRemove={removeFromCart}
          onViewCart={() => setView("cart")}
          cur={cur}
        />
      )}

      {view === "cart" && (
        <CartView
          isMobile={isMobile}
          cart={cart}
          itemById={itemById}
          cartCount={cartCount()}
          cartTotal={cartTotal()}
          onAdd={addToCart}
          onRemove={removeFromCart}
          onBack={() => setView("menu")}
          pickupTime={pickupTime}
          setPickupTime={setPickupTime}
          pickupSlots={getPickupSlots()}
          isLoggedIn={isLoggedIn}
          loggedInPhone={loggedInPhone}
          maskedPhone={maskedPhone}
          whatsappInput={whatsappInput}
          setWhatsappInput={setWhatsappInput}
          editContact={editContact}
          setEditContact={setEditContact}
          onSubmit={submitOrder}
          cur={cur}
        />
      )}

      {view === "confirm" && (
        <ConfirmView
          isMobile={isMobile}
          cart={cart}
          itemById={itemById}
          cartTotal={cartTotal()}
          pickupTime={pickupTime}
          onAgain={() => { setCart({}); setPickupTime(""); setWhatsappInput(""); setEditContact(false); setView("menu"); }}
          onHome={() => { const el = document.getElementById("home"); if (el) window.scrollTo({ top: el.offsetTop - 80, behavior: "smooth" }); }}
          cur={cur}
        />
      )}
    </Section>
  );
}

// ────────────────────────────────────────
// MENU VIEW
// ────────────────────────────────────────
function MenuView({ isMobile, cart, cartCount, cartTotal, onAdd, onRemove, onViewCart, cur }) {
  const categories = window.KENKO_MENU.categories;
  const [activeCat, setActiveCat] = React.useState(categories[0].id);

  const scrollToCat = (id) => {
    setActiveCat(id);
    const el = document.getElementById(`kenko-cat-${id}`);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 140;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  // Track active category on scroll
  React.useEffect(() => {
    const onScroll = () => {
      let current = categories[0].id;
      for (const c of categories) {
        const el = document.getElementById(`kenko-cat-${c.id}`);
        if (el && el.getBoundingClientRect().top - 160 <= 0) current = c.id;
      }
      setActiveCat(current);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Category tabs (horizontal scroll pills) */}
      <div style={{
        display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4, marginBottom: 36,
        scrollbarWidth: "none",
      }}>
        <style>{`.kenko-cat-tabs::-webkit-scrollbar{display:none}`}</style>
        <div className="kenko-cat-tabs" style={{ display: "flex", gap: 8, flexWrap: isMobile ? "nowrap" : "wrap" }}>
          {categories.map(c => {
            const on = activeCat === c.id;
            return (
              <button key={c.id} onClick={() => scrollToCat(c.id)} style={{
                fontFamily: "var(--f-body)", fontSize: 13, fontWeight: 500,
                padding: "9px 16px", borderRadius: "var(--r-pill)",
                background: on ? "var(--walnut-700)" : "var(--sand-50)",
                color: on ? "var(--paper)" : "var(--clay-600)",
                border: `1px solid ${on ? "var(--walnut-700)" : "var(--hairline)"}`,
                cursor: "pointer", whiteSpace: "nowrap", transition: "all .2s ease",
              }}>{c.name}</button>
            );
          })}
        </div>
      </div>

      {/* Menu categories */}
      <div style={{ display: "flex", flexDirection: "column", gap: 48 }}>
        {categories.map(cat => (
          <div key={cat.id} id={`kenko-cat-${cat.id}`} style={{ scrollMarginTop: 120 }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 20, flexWrap: "wrap" }}>
              <h3 style={{ fontFamily: "var(--f-display)", fontStyle: "italic", fontSize: isMobile ? 28 : 32, fontWeight: 400, margin: 0, color: "var(--espresso-900)", letterSpacing: -0.5 }}>
                {cat.name}
              </h3>
              {cat.tag && (
                <span style={{
                  fontFamily: "var(--f-mono)", fontSize: 9, letterSpacing: 1.8, textTransform: "uppercase",
                  background: cat.tagColor || "var(--sage-500)", color: "var(--paper)",
                  padding: "4px 10px", borderRadius: "var(--r-pill)",
                }}>{cat.tag}</span>
              )}
              <div style={{ flex: 1, height: 1, background: "var(--hairline)", minWidth: 40 }} />
            </div>

            <div style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
              gap: 14,
            }}>
              {cat.items.map(item => (
                <MenuItemCard
                  key={item.id}
                  item={item}
                  qty={cart[item.id] || 0}
                  onAdd={onAdd}
                  onRemove={onRemove}
                  cur={cur}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Sticky cart bar — fixed at bottom-center, visible only when cart has items */}
      {cartCount > 0 && (
        <button
          onClick={onViewCart}
          style={{
            position: "fixed",
            bottom: isMobile ? 90 : 28,
            left: "50%", transform: "translateX(-50%)",
            zIndex: 50,
            background: "var(--walnut-700)", color: "var(--paper)",
            border: "none", cursor: "pointer",
            padding: "14px 24px", borderRadius: "var(--r-pill)",
            boxShadow: "var(--sh-3)",
            fontFamily: "var(--f-body)", fontWeight: 600, fontSize: 14,
            display: "inline-flex", alignItems: "center", gap: 14,
            transition: "transform .2s ease",
          }}
          onMouseEnter={e => e.currentTarget.style.transform = "translateX(-50%) translateY(-2px)"}
          onMouseLeave={e => e.currentTarget.style.transform = "translateX(-50%) translateY(0)"}
        >
          <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            <CartIcon /> {cartCount} {cartCount === 1 ? "item" : "items"}
          </span>
          <span style={{ opacity: 0.45 }}>·</span>
          <span>{cur}{cartTotal}</span>
          <span style={{ opacity: 0.45 }}>·</span>
          <span style={{ fontFamily: "var(--f-mono)", fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase" }}>
            View order →
          </span>
        </button>
      )}
    </>
  );
}

function MenuItemCard({ item, qty, onAdd, onRemove, cur }) {
  return (
    <div style={{
      background: "var(--paper)", borderRadius: "var(--r-lg)",
      border: "1px solid var(--hairline)", boxShadow: "var(--sh-1)",
      padding: "20px 24px",
      display: "flex", gap: 20, alignItems: "flex-start",
    }}>
      {/* LEFT */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <VegDot veg={item.veg} />
          <div style={{ fontFamily: "var(--f-body)", fontWeight: 600, fontSize: 16, color: "var(--espresso-900)", lineHeight: 1.3 }}>
            {item.name}
          </div>
        </div>
        <div style={{ fontFamily: "var(--f-body)", fontSize: 13, color: "var(--clay-600)", lineHeight: 1.5 }}>
          {item.desc}
        </div>
        {item.macros && (
          <div style={{ fontFamily: "var(--f-mono)", fontSize: 10, color: "var(--clay-600)", letterSpacing: 1, marginTop: 8, textTransform: "uppercase" }}>
            {item.macros}
          </div>
        )}
        {item.tags && item.tags.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
            {item.tags.map(t => (
              <span key={t} style={{
                fontFamily: "var(--f-mono)", fontSize: 9, letterSpacing: 1.5, textTransform: "uppercase",
                background: "var(--sand-100)", color: "var(--clay-600)",
                padding: "4px 9px", borderRadius: "var(--r-pill)",
                border: "1px solid var(--hairline)",
              }}>{t}</span>
            ))}
          </div>
        )}
      </div>

      {/* RIGHT */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 10, flexShrink: 0 }}>
        <div style={{ fontFamily: "var(--f-display)", fontStyle: "italic", fontSize: 22, color: "var(--espresso-900)", lineHeight: 1 }}>
          {cur}{item.price}
        </div>
        {qty === 0 ? (
          <button onClick={() => onAdd(item.id)} style={{
            background: "var(--walnut-700)", color: "var(--paper)",
            border: "none", cursor: "pointer",
            padding: "8px 16px", borderRadius: "var(--r-pill)",
            fontFamily: "var(--f-body)", fontWeight: 600, fontSize: 13,
            transition: "background .2s ease",
          }}
            onMouseEnter={e => e.currentTarget.style.background = "var(--espresso-800)"}
            onMouseLeave={e => e.currentTarget.style.background = "var(--walnut-700)"}
          >+ Add</button>
        ) : (
          <Stepper qty={qty} onPlus={() => onAdd(item.id)} onMinus={() => onRemove(item.id)} />
        )}
      </div>
    </div>
  );
}

function Stepper({ qty, onPlus, onMinus, size = 32 }) {
  const fontPx = size <= 26 ? 14 : 16;
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
      <button onClick={onMinus} style={{
        width: size, height: size, borderRadius: "50%",
        background: "var(--sand-100)", color: "var(--clay-600)",
        border: "1px solid var(--hairline)", cursor: "pointer",
        fontFamily: "var(--f-body)", fontWeight: 600, fontSize: fontPx,
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        lineHeight: 1, padding: 0,
      }}>−</button>
      <span style={{ fontFamily: "var(--f-body)", fontWeight: 700, fontSize: 16, color: "var(--espresso-900)", minWidth: 20, textAlign: "center" }}>
        {qty}
      </span>
      <button onClick={onPlus} style={{
        width: size, height: size, borderRadius: "50%",
        background: "var(--walnut-700)", color: "var(--paper)",
        border: "none", cursor: "pointer",
        fontFamily: "var(--f-body)", fontWeight: 600, fontSize: fontPx,
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        lineHeight: 1, padding: 0,
      }}>+</button>
    </div>
  );
}

function VegDot({ veg }) {
  const color = veg ? "#4F8B3E" : "#B83A2A";
  return (
    <span title={veg ? "Vegetarian" : "Non-vegetarian"} style={{
      width: 12, height: 12, borderRadius: 2,
      border: `1.5px solid ${color}`,
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      flexShrink: 0,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: color }} />
    </span>
  );
}

function CartIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3 4h2l2.5 12h11L21 7H6" />
      <circle cx="9" cy="20" r="1.4" />
      <circle cx="17" cy="20" r="1.4" />
    </svg>
  );
}

// ────────────────────────────────────────
// CART VIEW
// ────────────────────────────────────────
function CartView({
  isMobile, cart, itemById, cartCount, cartTotal,
  onAdd, onRemove, onBack,
  pickupTime, setPickupTime, pickupSlots,
  isLoggedIn, loggedInPhone, maskedPhone,
  whatsappInput, setWhatsappInput,
  editContact, setEditContact,
  onSubmit, cur,
}) {
  const cartItems = Object.entries(cart)
    .map(([id, qty]) => ({ item: itemById[id], qty }))
    .filter(r => r.item);

  const useLoggedIn = isLoggedIn && !editContact;
  const waNum = useLoggedIn ? loggedInPhone : whatsappInput;
  const waDigits = (waNum || "").replace(/\D/g, "");
  const canSubmit = pickupTime && (useLoggedIn ? waDigits.length >= 10 : waDigits.length >= 10);

  return (
    <div>
      <button onClick={onBack} style={{
        background: "transparent", border: "none", cursor: "pointer",
        fontFamily: "var(--f-body)", fontSize: 14, color: "var(--clay-600)",
        padding: 0, marginBottom: 20,
        display: "inline-flex", alignItems: "center", gap: 6,
      }}>← Menu</button>

      <div style={{
        background: "var(--paper)", borderRadius: "var(--r-xl)",
        boxShadow: "var(--sh-2)", maxWidth: 560, margin: "0 auto",
        padding: 28, position: "relative", overflow: "hidden",
      }}>
        {/* Dark header */}
        <div style={{
          background: "var(--espresso-900)", color: "var(--sand-100)",
          padding: "16px 20px", margin: "-28px -28px 24px",
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <div style={{ fontFamily: "var(--f-mono)", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", color: "var(--ochre-500)", display: "inline-flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--ochre-500)" }} />
            Your order
          </div>
          <div style={{ fontFamily: "var(--f-mono)", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", color: "var(--sand-300)" }}>
            {cartCount} {cartCount === 1 ? "item" : "items"}
          </div>
        </div>

        {/* Order items list */}
        <div>
          {cartItems.map((row, i) => (
            <div key={row.item.id} style={{
              borderTop: i === 0 ? "none" : "1px solid var(--hairline)",
              padding: "12px 0",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                    <span style={{ fontFamily: "var(--f-mono)", fontSize: 10, color: "var(--clay-600)", letterSpacing: 1 }}>{row.qty}×</span>
                    <span style={{ fontFamily: "var(--f-body)", fontWeight: 500, fontSize: 14, color: "var(--espresso-900)" }}>{row.item.name}</span>
                  </div>
                  <div style={{ marginTop: 8 }}>
                    <Stepper qty={row.qty} onPlus={() => onAdd(row.item.id)} onMinus={() => onRemove(row.item.id)} size={26} />
                  </div>
                </div>
                <div style={{ fontFamily: "var(--f-body)", fontWeight: 600, fontSize: 14, color: "var(--walnut-700)", whiteSpace: "nowrap" }}>
                  {cur}{row.qty * row.item.price}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ height: 1, background: "var(--hairline)", margin: "16px 0" }} />

        {/* Total */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <span style={{ fontFamily: "var(--f-body)", fontWeight: 600, fontSize: 16, color: "var(--espresso-900)" }}>Total</span>
          <span style={{ fontFamily: "var(--f-body)", fontWeight: 700, fontSize: 20, color: "var(--walnut-700)" }}>{cur}{cartTotal}</span>
        </div>

        {/* Pickup time */}
        <div style={{ marginTop: 24 }}>
          <div style={{ fontFamily: "var(--f-mono)", fontSize: 10, letterSpacing: 1.8, textTransform: "uppercase", color: "var(--clay-600)" }}>
            Choose pickup time
          </div>
          {pickupSlots.length > 0 && (
            <div style={{ fontFamily: "var(--f-body)", fontSize: 12, color: "var(--clay-600)", marginTop: 6, marginBottom: 12 }}>
              Next available slot: {(pickupSlots.find(s => !s.disabled) || {}).display || "Tomorrow morning"}
            </div>
          )}

          <div>
            <select
              value={pickupTime}
              onChange={e => setPickupTime(e.target.value)}
              style={{
                width: "100%",
                background: "var(--paper)", color: "var(--espresso-900)",
                border: "1.5px solid var(--hairline-strong)", borderRadius: "var(--r-md)",
                padding: "12px 14px", fontFamily: "var(--f-body)", fontSize: 14,
                cursor: "pointer", appearance: "none",
                backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8' fill='none'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23998877' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 14px center",
                paddingRight: 36,
              }}
            >
              <option value="">Pick a time</option>
              {pickupSlots.map(s => (
                <option key={s.value} value={s.value} disabled={s.disabled} style={s.disabled ? { color: "#bbb" } : undefined}>
                  {s.display}{s.disabled ? " — past" : ""}
                </option>
              ))}
            </select>
          </div>
          <div style={{ fontFamily: "var(--f-mono)", fontSize: 10, letterSpacing: 1.5, color: "var(--clay-600)", marginTop: 8 }}>
            Café open 7:00 AM – 9:00 PM · Past slots are greyed out
          </div>
          {!pickupTime && (
            <div style={{ fontFamily: "var(--f-mono)", fontSize: 9, letterSpacing: 1.5, textTransform: "uppercase", color: "var(--terracotta-500)", marginTop: 8 }}>
              Please select a pickup time to continue
            </div>
          )}
        </div>

        {/* Contact */}
        <div style={{ marginTop: 24 }}>
          {useLoggedIn ? (
            <>
              <div style={{ fontFamily: "var(--f-mono)", fontSize: 10, letterSpacing: 1.8, textTransform: "uppercase", color: "var(--clay-600)" }}>
                Order confirmed to
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 8 }}>
                <div style={{ fontFamily: "var(--f-body)", fontWeight: 500, fontSize: 15, color: "var(--espresso-900)" }}>
                  +91 {maskedPhone}
                </div>
                <button onClick={() => setEditContact(true)} style={{
                  background: "transparent", border: "none", cursor: "pointer", padding: 0,
                  fontFamily: "var(--f-mono)", fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase",
                  color: "var(--walnut-700)", textDecoration: "underline",
                }}>Edit</button>
              </div>
            </>
          ) : (
            <>
              <div style={{ fontFamily: "var(--f-mono)", fontSize: 10, letterSpacing: 1.8, textTransform: "uppercase", color: "var(--clay-600)" }}>
                Your WhatsApp number
              </div>
              <div style={{ fontFamily: "var(--f-body)", fontSize: 12, color: "var(--clay-600)", marginTop: 6, marginBottom: 10 }}>
                Order confirmation and receipt sent here
              </div>
              <input
                type="tel"
                value={whatsappInput}
                onChange={e => setWhatsappInput(e.target.value)}
                placeholder="+91 98765 43210"
                style={{
                  width: "100%", boxSizing: "border-box",
                  background: "var(--paper)", color: "var(--espresso-900)",
                  border: "1.5px solid var(--hairline-strong)", borderRadius: "var(--r-md)",
                  padding: "10px 12px", fontFamily: "var(--f-body)", fontSize: 14,
                }}
              />
              {isLoggedIn && editContact && (
                <button onClick={() => { setEditContact(false); setWhatsappInput(""); }} style={{
                  background: "transparent", border: "none", cursor: "pointer", padding: 0, marginTop: 8,
                  fontFamily: "var(--f-mono)", fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase",
                  color: "var(--clay-600)", textDecoration: "underline",
                }}>← Use saved number</button>
              )}
            </>
          )}
        </div>

        {/* Place order */}
        <button
          disabled={!canSubmit}
          onClick={() => canSubmit && onSubmit(waNum)}
          style={{
            width: "100%", marginTop: 20,
            height: 48, borderRadius: "var(--r-pill)",
            border: "none", cursor: canSubmit ? "pointer" : "not-allowed",
            background: canSubmit ? "var(--walnut-700)" : "var(--sand-200)",
            color: canSubmit ? "var(--paper)" : "var(--clay-600)",
            fontFamily: "var(--f-body)", fontWeight: 600, fontSize: 14,
            transition: "background .2s ease",
          }}
          onMouseEnter={e => canSubmit && (e.currentTarget.style.background = "var(--espresso-800)")}
          onMouseLeave={e => canSubmit && (e.currentTarget.style.background = "var(--walnut-700)")}
        >
          {canSubmit
            ? <>Place order →&nbsp;&nbsp;{cur}{cartTotal}</>
            : !pickupTime
              ? "Select pickup time to continue"
              : "Enter a valid WhatsApp number"}
        </button>

        <div style={{ fontFamily: "var(--f-mono)", fontSize: 9, letterSpacing: 1.5, textTransform: "uppercase", color: "var(--clay-600)", textAlign: "center", marginTop: 14 }}>
          Payment at pickup · Order goes to Kenko kitchen + your WhatsApp
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────
// CONFIRM VIEW
// ────────────────────────────────────────
function ConfirmView({ isMobile, cart, itemById, cartTotal, pickupTime, onAgain, onHome, cur }) {
  const cartItems = Object.entries(cart)
    .map(([id, qty]) => ({ item: itemById[id], qty }))
    .filter(r => r.item);

  return (
    <div style={{
      background: "var(--paper)", borderRadius: "var(--r-xl)",
      boxShadow: "var(--sh-3)", maxWidth: 480, margin: "0 auto",
      padding: 36, textAlign: "left",
    }}>
      <div style={{
        width: 56, height: 56, borderRadius: "50%",
        background: "var(--sage-500)",
        display: "flex", alignItems: "center", justifyContent: "center",
        marginBottom: 20,
      }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12l5 5L20 7" />
        </svg>
      </div>

      <h3 style={{ fontFamily: "var(--f-display)", fontStyle: "italic", fontSize: 32, fontWeight: 400, color: "var(--espresso-900)", margin: 0, letterSpacing: -0.5 }}>
        Order placed.
      </h3>
      <p style={{ fontFamily: "var(--f-body)", fontSize: 15, color: "var(--espresso-800)", lineHeight: 1.6, marginTop: 12 }}>
        Your order is heading to the Kenko kitchen.<br/>
        Pickup at <strong style={{ color: "var(--espresso-900)" }}>{pickupTime}</strong>.
      </p>

      {/* Order summary */}
      <div style={{
        background: "var(--sand-100)", borderRadius: "var(--r-lg)",
        padding: 16, marginTop: 16,
      }}>
        <div style={{ fontFamily: "var(--f-mono)", fontSize: 10, letterSpacing: 1.8, textTransform: "uppercase", color: "var(--clay-600)", marginBottom: 10 }}>
          Order summary
        </div>
        {cartItems.map(row => (
          <div key={row.item.id} style={{
            display: "flex", justifyContent: "space-between", alignItems: "baseline",
            padding: "6px 0", fontFamily: "var(--f-body)", fontSize: 13, color: "var(--espresso-900)",
          }}>
            <span>{row.qty}× {row.item.name}</span>
            <span style={{ color: "var(--clay-600)" }}>{cur}{row.qty * row.item.price}</span>
          </div>
        ))}
        <div style={{ height: 1, background: "var(--hairline)", margin: "10px 0" }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <span style={{ fontFamily: "var(--f-body)", fontWeight: 600, fontSize: 14, color: "var(--espresso-900)" }}>Total</span>
          <span style={{ fontFamily: "var(--f-body)", fontWeight: 700, fontSize: 16, color: "var(--walnut-700)" }}>{cur}{cartTotal}</span>
        </div>
      </div>

      <p style={{ fontFamily: "var(--f-body)", fontSize: 13, color: "var(--clay-600)", marginTop: 12, marginBottom: 0 }}>
        Receipt sent to your WhatsApp.
      </p>

      <div style={{
        background: "var(--sand-100)", borderRadius: "var(--r-lg)",
        border: "1px solid var(--hairline)",
        padding: "14px 16px", marginTop: 10,
      }}>
        <div style={{ fontFamily: "var(--f-body)", fontSize: 15, fontWeight: 600, color: "var(--espresso-900)", lineHeight: 1.5 }}>
          Please collect your order and pay at Kenko Café, 1st floor.<br/>
          We'll have it ready at your pickup time.
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, marginTop: 24, flexWrap: isMobile ? "wrap" : "nowrap" }}>
        <button onClick={onAgain} style={{
          flex: 1,
          background: "transparent", color: "var(--walnut-700)",
          border: "1px solid var(--walnut-700)", borderRadius: "var(--r-pill)",
          padding: "12px 22px", cursor: "pointer",
          fontFamily: "var(--f-body)", fontWeight: 500, fontSize: 14,
        }}>Order again</button>
        <button onClick={onHome} style={{
          flex: 1,
          background: "var(--walnut-700)", color: "var(--paper)",
          border: "none", borderRadius: "var(--r-pill)",
          padding: "12px 22px", cursor: "pointer",
          fontFamily: "var(--f-body)", fontWeight: 600, fontSize: 14,
        }}>Back to home</button>
      </div>
    </div>
  );
}

function WhatsAppIcon({ small }) {
  const s = small ? 13 : 16;
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.7.1-.2.3-.8.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.4-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.4.1-.6.1-.1.3-.3.4-.5.1-.2.2-.3.3-.5.1-.2 0-.3 0-.5 0-.1-.7-1.7-1-2.3-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.3 5.2 4.6 2.6 1 3.1.8 3.7.8.6-.1 1.7-.7 2-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.6-.3z M12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.6 1.4 5.1L2 22l5-1.3c1.5.8 3.2 1.3 5 1.3 5.5 0 10-4.5 10-10S17.5 2 12 2z"/>
    </svg>
  );
}

Object.assign(window, { TrainersSection, SocialSection, MembersSection, KenkoSection });
