/* Admin Panel — My Third Space Coach Universe
 * Loaded before coach-universe.jsx. Exposes:
 *   window.ADMIN_USERS, window.isAdminUser, window.getAdminRecord
 *   window.AdminPage
 *   window.AdminLoginRows  (admin rows for login demo picker)
 */

const { useState: useStateAdm, useMemo: useMemoAdm, useEffect: useEffectAdm } = React;

const ADMIN_USERS = [
  {
    id: "shwetambari",
    name: "Shwetambari Shetty",
    initials: "SS",
    role: "Studio Owner",
    adminRole: "owner",
    tone: "espresso",
    bio: "Founder of My Third Space. Fifteen years on the floor.",
    canManageAdmins: true,
  },
  {
    id: "harshita",
    name: "Harshita",
    initials: "HA",
    role: "Studio Manager",
    adminRole: "manager",
    tone: "walnut",
    bio: "Operations and studio management.",
    canManageAdmins: false,
  },
];

function isAdminUser(coach) {
  if (!coach) return false;
  return ADMIN_USERS.some(a => a.id === coach.id);
}

function getAdminRecord(coach) {
  if (!coach) return null;
  return ADMIN_USERS.find(a => a.id === coach.id) || null;
}

// ───────── shared mini bits ─────────

const adminCoachAvatar = (p) => {
  const Av = window.CoachAvatar;
  return <Av {...p} />;
};

function MonoChip({ children, bg, fg, border, style }) {
  return (
    <span className="mono" style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      padding: "4px 10px", borderRadius: "var(--r-pill)",
      background: bg || "var(--sand-100)", color: fg || "var(--clay-600)",
      border: border ? `1px solid ${border}` : "1px solid transparent",
      fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase", whiteSpace: "nowrap",
      ...style,
    }}>{children}</span>
  );
}

function StatusPill({ status }) {
  const map = {
    "ON FLOOR":  { bg: "var(--sage-500)",       fg: "var(--paper)",          dot: "var(--paper)" },
    "AVAILABLE": { bg: "var(--sand-100)",       fg: "var(--clay-600)",       dot: "var(--clay-600)" },
    "OFF TODAY": { bg: "var(--terracotta-200)", fg: "var(--terracotta-500)", dot: "var(--terracotta-500)" },
  };
  const m = map[status] || map["AVAILABLE"];
  return (
    <MonoChip bg={m.bg} fg={m.fg}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: m.dot, display: "inline-block" }} />
      {status}
    </MonoChip>
  );
}

// ───────── header strip + tab bar ─────────

function AdminHeaderStrip({ adminData }) {
  return (
    <div style={{
      background: "var(--espresso-900)", width: "calc(100% + 80px)",
      margin: "-36px -40px 28px", padding: "18px 40px",
      display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap",
    }}>
      <div className="mono" style={{ color: "var(--ochre-500)", display: "inline-flex", alignItems: "center", gap: 10, letterSpacing: 2 }}>
        <span style={{ fontSize: 14 }}>⬡</span> ADMIN PANEL
      </div>
      <div className="mono" style={{ color: "var(--sand-300)", letterSpacing: 2 }}>
        {(adminData?.name || "").toUpperCase()} · {(adminData?.adminRole || "").toUpperCase()}
      </div>
    </div>
  );
}

function AdminTabs({ tab, setTab, canManageAdmins, reviewCount }) {
  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "calendar", label: "Calendar" },
    { id: "invites",  label: "Invites" },
    { id: "review",   label: "Review",   badge: reviewCount || 0, badgeColor: "var(--ochre-500)" },
    { id: "coaches",  label: "Coaches" },
    { id: "users",    label: "Users" },
  ];
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{
        display: "inline-flex", padding: 6, borderRadius: "var(--r-xl)",
        background: "var(--espresso-900)", gap: 2, flexWrap: "wrap",
      }}>
        {tabs.map(t => {
          const active = tab === t.id;
          return (
            <button key={t.id} onClick={() => setTab(t.id)} className="mono" style={{
              padding: "9px 16px", borderRadius: "var(--r-lg)", border: "none", cursor: "pointer",
              background: active ? "var(--terracotta-500)" : "transparent",
              color: active ? "var(--paper)" : "var(--sand-200)",
              fontFamily: "var(--f-mono)", fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase",
              transition: "background .15s, color .15s",
              display: "inline-flex", alignItems: "center", gap: 8,
            }}>
              {t.label}{t.id === "users" && !canManageAdmins ? " 🔒" : ""}
              {t.badge > 0 && (
                <span style={{
                  minWidth: 18, padding: "1.5px 6px", borderRadius: 999,
                  background: active ? "var(--paper)" : (t.badgeColor || "var(--terracotta-500)"),
                  color: active ? "var(--terracotta-500)" : "var(--paper)",
                  fontFamily: "var(--f-mono)", fontSize: 9.5, fontWeight: 600,
                  letterSpacing: 0.5, textAlign: "center", lineHeight: 1.4,
                }}>{t.badge}</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ───────── OVERVIEW ─────────

function AdminOverview({ toast, invitesPendingCount, openTriage }) {
  const TRAINERS = window.TRAINERS || [];

  const floor = {
    joe:     { status: "ON FLOOR", note: "7:00–8:00 AM · Meera P." },
    deb:     { status: "ON FLOOR", note: "7:00–8:00 AM · Vikram R." },
    deepika: { status: "AVAILABLE" },
    lee:     { status: "ON FLOOR", note: "9:00–10:00 AM · Anita V." },
    pilates: { status: "AVAILABLE", _name: "Anisha" },
    rahul:   { status: "ON FLOOR", note: "9:30–10:30 AM · Group Strength" },
    aakash:  { status: "OFF TODAY" },
    tarun:   { status: "AVAILABLE" },
    santo:   { status: "ON FLOOR", note: "8:00–9:00 AM · Karan S." },
    shahbaz: { status: "ON FLOOR", note: "7:00–8:00 AM · Yoga Flow" },
  };

  const stats = [
    { eyebrow: "TODAY'S SESSIONS", num: "14", sub: "of 18 available slots", chipBg: "var(--ochre-500)", chipFg: "var(--espresso-900)", chipText: "78% CAPACITY" },
    { eyebrow: "ACTIVE CLIENTS",   num: "47", sub: "across all coaches",    chipBg: "var(--sage-200)", chipFg: "var(--sage-500)",     chipText: "↑ +3 THIS WEEK" },
    { eyebrow: "PENDING INVITES",  num: String(invitesPendingCount || 7), sub: "awaiting coach action", chipBg: "var(--terracotta-200)", chipFg: "var(--terracotta-500)", chipText: "3 OVERDUE > 48H" },
    { eyebrow: "MONTHLY REVENUE",  num: "₹2.4L", sub: "April 2026 to date",  chipBg: "var(--sage-200)", chipFg: "var(--sage-500)",     chipText: "↑ +12% VS MARCH" },
  ];

  const flags = [
    { id: "overdue-invite", accent: "var(--terracotta-500)", eyebrow: "OVERDUE INVITE",
      text: "Anita V. → Lee — invite pending 72h. Client waiting.",
      cta: "Triage →", chipBg: "var(--terracotta-500)", chipFg: "var(--paper)",
      triage: {
        id: "flag-anita",
        client: { name: "Anita V.", initials: "AV", tenure: "Member · 1 yr" },
        coachId: "lee",
        slot: { day: "TUE", date: "29 APR 2026", time: "09:00 AM", duration: 60, room: "Ground floor studio" },
        reason: "Slept through alarm twice this week — not safe to coach at 9 AM.",
        submittedAt: "Today, 8:42 AM",
        sla: { deadline: "RESOLVE BY 8:00 PM TONIGHT", remaining: "3H 22M LEFT" },
        availableCoachIds: ["deb", "anisha"],
      },
    },
    { accent: "var(--ochre-500)", eyebrow: "CAPACITY WARNING",
      text: "Saturday 8AM is at 95% capacity across group classes.",
      cta: "View →", chipBg: "#FFF2D8", chipFg: "#6A4A10" },
    { accent: "var(--sage-500)", eyebrow: "PROGRAMME ENDING",
      text: "3 clients' programmes end this month. No renewal logged.",
      cta: "Review →", chipBg: "var(--sage-200)", chipFg: "var(--sage-500)" },
    { accent: "var(--terracotta-500)", eyebrow: "COACH CONFLICT",
      text: "Rahul has overlapping PT invite and group class on Apr 24 9AM.",
      cta: "Resolve →", chipBg: "var(--terracotta-200)", chipFg: "var(--terracotta-500)" },
  ];

  return (
    <div>
      <div className="mono" style={{ color: "var(--clay-600)", marginBottom: 8 }}>● STUDIO HEALTH</div>
      <h2 className="serif" style={{ fontSize: 44, margin: "0 0 24px", color: "var(--espresso-900)", fontStyle: "italic" }}>
        Today at My Third Space.
      </h2>

      {/* Stat grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 28 }}>
        {stats.map((s, i) => (
          <div key={i} style={{
            background: "var(--paper)", borderRadius: "var(--r-lg)", boxShadow: "var(--sh-2)",
            padding: 22, border: "1px solid var(--hairline)",
          }}>
            <div className="mono" style={{ color: "var(--clay-600)", marginBottom: 14, display: "inline-flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--ochre-500)" }} />
              {s.eyebrow}
            </div>
            <div style={{ fontFamily: "var(--f-display)", fontSize: 54, lineHeight: 1, color: "var(--espresso-900)", marginBottom: 8 }}>{s.num}</div>
            <div style={{ color: "var(--clay-600)", fontSize: 13, marginBottom: 12 }}>{s.sub}</div>
            <MonoChip bg={s.chipBg} fg={s.chipFg}>{s.chipText}</MonoChip>
          </div>
        ))}
      </div>

      {/* 2-col */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* Floor status */}
        <div style={{ background: "var(--paper)", borderRadius: "var(--r-lg)", boxShadow: "var(--sh-2)", padding: 24, border: "1px solid var(--hairline)" }}>
          <div className="mono" style={{ color: "var(--clay-600)", marginBottom: 6, display: "inline-flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--terracotta-500)" }} />
            COACH FLOOR STATUS
          </div>
          <h3 className="serif" style={{ fontSize: 22, margin: "0 0 14px", color: "var(--espresso-900)" }}>Coach utilisation today</h3>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {TRAINERS.map(c => {
              const f = floor[c.id] || { status: "AVAILABLE" };
              return (
                <div key={c.id} style={{
                  display: "flex", alignItems: "center", gap: 12, padding: "10px 0",
                  borderBottom: "1px solid var(--hairline)",
                }}>
                  {adminCoachAvatar({ coach: c, size: 32 })}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 500, color: "var(--espresso-900)" }}>{c.name}</div>
                    <div className="mono" style={{ color: "var(--clay-600)", fontSize: 9 }}>
                      {f.note || c.role}
                    </div>
                  </div>
                  <StatusPill status={f.status} />
                </div>
              );
            })}
          </div>
        </div>

        {/* Flags */}
        <div style={{ background: "var(--paper)", borderRadius: "var(--r-lg)", boxShadow: "var(--sh-2)", padding: 24, border: "1px solid var(--hairline)" }}>
          <div className="mono" style={{ color: "var(--clay-600)", marginBottom: 6, display: "inline-flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--terracotta-500)" }} />
            NEEDS ATTENTION
          </div>
          <h3 className="serif" style={{ fontSize: 22, margin: "0 0 14px", color: "var(--espresso-900)" }}>Flagged items</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {flags.map((f, i) => (
              <div key={i} style={{
                position: "relative", padding: "14px 16px 14px 22px",
                background: "var(--sand-50)", borderRadius: "var(--r-md)",
                border: "1px solid var(--hairline)",
              }}>
                <div style={{ position: "absolute", left: 0, top: 12, bottom: 12, width: 3, borderRadius: "0 2px 2px 0", background: f.accent }} />
                <div className="mono" style={{ color: f.accent, marginBottom: 6 }}>{f.eyebrow}</div>
                <div style={{ fontSize: 14, color: "var(--espresso-900)", lineHeight: 1.5, marginBottom: 10 }}>{f.text}</div>
                <button onClick={() => {
                  if (f.triage && openTriage) { openTriage(f.triage); return; }
                  toast(`${f.eyebrow.toLowerCase()} — ${f.cta.replace(" →","")}`);
                }} className="mono" style={{
                  background: f.chipBg, color: f.chipFg, border: "none", cursor: "pointer",
                  padding: "5px 12px", borderRadius: "var(--r-pill)",
                  fontSize: 10, letterSpacing: 1.5, fontWeight: 600,
                }}>{f.cta}</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ───────── CALENDAR ─────────

function AdminCalendarTab({ toast }) {
  const TRAINERS = window.TRAINERS || [];
  const [allocCell, setAllocCell] = useStateAdm(null);
  const [filter, setFilter] = useStateAdm("ALL");

  const days = ["MON 20", "TUE 21", "WED 22", "THU 23", "FRI 24", "SAT 25", "SUN 26"];
  // [coachId][dayIdx] -> array of {kind, label, sub}
  const grid = {
    joe: {
      0: [{ kind: "pt", label: "Meera P.", sub: "7AM PT" }],
      2: [{ kind: "pt", label: "Anita V.", sub: "6:30AM PT" }],
      3: [{ kind: "group", label: "Strength", sub: "9AM Group" }],
    },
    deb: {
      0: [{ kind: "pt", label: "Vikram R.", sub: "7AM PT" }],
      2: [{ kind: "block", label: "Off", sub: "Programming" }],
      4: [{ kind: "pt", label: "Rohan T.", sub: "5PM PT" }],
    },
    deepika: {
      1: [{ kind: "pending", label: "Rohan T.", sub: "6AM pending" }],
      4: [{ kind: "group", label: "Hyrox", sub: "6PM Group" }],
    },
    lee: {
      2: [{ kind: "pt", label: "Anita V.", sub: "9AM PT" }],
      4: [{ kind: "pending", label: "Anita V.", sub: "9AM pending" }],
      5: [{ kind: "group", label: "Saturday Strong", sub: "8AM Group" }],
    },
    pilates: {
      1: [{ kind: "group", label: "Pilates", sub: "10AM Group" }],
      3: [{ kind: "group", label: "Pilates", sub: "10AM Group" }],
    },
    rahul: {
      0: [{ kind: "pending", label: "Meera P.", sub: "7AM pending" }, { kind: "group", label: "Strength", sub: "9:30 Group" }],
      3: [{ kind: "pending", label: "Anita V.", sub: "8AM pending" }],
      5: [{ kind: "group", label: "Hyrox", sub: "9AM Group" }],
    },
    aakash: {
      1: [{ kind: "block", label: "Off", sub: "Personal" }],
      2: [{ kind: "block", label: "Off", sub: "Personal" }],
    },
    tarun: {
      0: [{ kind: "pt", label: "Karan S.", sub: "6PM PT" }],
      3: [{ kind: "pt", label: "Karan S.", sub: "6PM PT" }],
    },
    santo: {
      1: [{ kind: "pt", label: "Karan S.", sub: "8AM PT" }],
      4: [{ kind: "pt", label: "Shreya M.", sub: "7PM PT" }],
    },
    shahbaz: {
      0: [{ kind: "group", label: "Yoga Flow", sub: "7AM Group" }],
      3: [{ kind: "group", label: "Yoga Flow", sub: "7AM Group" }],
      5: [{ kind: "group", label: "Yoga Flow", sub: "7AM Group" }],
    },
  };

  const cellStyles = {
    pt:      { bg: "rgba(94,66,40,0.4)",  fg: "var(--paper)",          border: "1px solid var(--walnut-700)" },
    group:   { bg: "var(--sage-200)",     fg: "var(--sage-500)",       border: "1px solid var(--sage-500)" },
    block:   { bg: "var(--terracotta-200)", fg: "var(--terracotta-500)", border: "1px solid var(--terracotta-500)", stripes: true },
    pending: { bg: "#FFF2D8",             fg: "#6A4A10",               border: "1px dashed #E8C77A" },
  };

  function passFilter(kind) {
    if (filter === "ALL") return true;
    if (filter === "PT") return kind === "pt" || kind === "pending";
    if (filter === "GROUP") return kind === "group";
    return true;
  }

  return (
    <div>
      <div className="mono" style={{ color: "var(--clay-600)", marginBottom: 8 }}>● CALENDAR COMMAND CENTRE</div>
      <h2 className="serif" style={{ fontSize: 44, margin: "0 0 24px", color: "var(--espresso-900)", fontStyle: "italic" }}>
        All coaches. One view.
      </h2>

      {/* Date nav */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12, flexWrap: "wrap" }}>
        <button className="btn-icon">‹</button>
        <div className="serif" style={{ fontSize: 22, color: "var(--espresso-900)" }}>Week of Apr 20 – Apr 26, 2026</div>
        <button className="btn-icon">›</button>
        <button className="btn-ghost">Today</button>
        <div style={{ display: "flex", gap: 4, padding: 4, background: "var(--sand-100)", borderRadius: 999, marginLeft: "auto" }}>
          {["MONTH","WEEK","DAY"].map(v => (
            <button key={v} className="mono" style={{
              padding: "7px 14px", borderRadius: 999, border: "none", cursor: "pointer",
              background: v === "WEEK" ? "var(--paper)" : "transparent",
              color: v === "WEEK" ? "var(--walnut-700)" : "var(--clay-600)",
              boxShadow: v === "WEEK" ? "var(--sh-1)" : "none",
              fontFamily: "var(--f-mono)", fontSize: 10,
            }}>{v}</button>
          ))}
        </div>
      </div>

      {/* Bulk actions */}
      <div style={{
        background: "var(--paper)", borderRadius: "var(--r-lg)", boxShadow: "var(--sh-1)",
        border: "1px solid var(--hairline)", padding: "12px 16px",
        display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 16,
      }}>
        <span className="mono" style={{ color: "var(--clay-600)" }}>BULK ACTIONS</span>
        {["Select all pending","Approve selected","Reject selected","Reassign selected →"].map(b => (
          <button key={b} onClick={() => toast(`${b} (demo)`)} className="mono" style={{
            background: "var(--sand-100)", color: "var(--walnut-700)", border: "1px solid var(--hairline)",
            padding: "6px 12px", borderRadius: "var(--r-pill)", cursor: "pointer", fontSize: 10,
          }}>{b}</button>
        ))}
        <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
          {["ALL COACHES","PT","GROUP"].map(f => {
            const fid = f.startsWith("ALL") ? "ALL" : f;
            const active = filter === fid;
            return (
              <button key={f} onClick={() => setFilter(fid)} className="mono" style={{
                background: active ? "var(--walnut-700)" : "var(--paper)",
                color: active ? "var(--paper)" : "var(--walnut-700)",
                border: "1px solid " + (active ? "var(--walnut-700)" : "var(--hairline-strong)"),
                padding: "6px 12px", borderRadius: "var(--r-pill)", cursor: "pointer", fontSize: 10,
              }}>{f === "PT" ? "PT ONLY" : f === "GROUP" ? "GROUP ONLY" : f}</button>
            );
          })}
        </div>
      </div>

      {/* Grid */}
      <div style={{
        background: "var(--paper)", borderRadius: "var(--r-lg)", boxShadow: "var(--sh-2)",
        border: "1px solid var(--hairline)", overflow: "hidden",
      }}>
        {/* Header */}
        <div style={{ display: "grid", gridTemplateColumns: "240px repeat(7, 1fr)", borderBottom: "1px solid var(--hairline)", background: "var(--sand-50)" }}>
          <div className="mono" style={{ padding: "12px 16px", color: "var(--clay-600)" }}>COACH</div>
          {days.map(d => (
            <div key={d} className="mono" style={{ padding: "12px 10px", color: "var(--clay-600)", borderLeft: "1px solid var(--hairline)", textAlign: "center" }}>{d}</div>
          ))}
        </div>
        {/* Rows */}
        {TRAINERS.map(c => (
          <div key={c.id} style={{
            display: "grid", gridTemplateColumns: "240px repeat(7, 1fr)",
            borderBottom: "1px solid var(--hairline)", minHeight: 64,
          }}>
            <div style={{
              padding: "10px 16px", display: "flex", alignItems: "center", gap: 10,
              position: "sticky", left: 0, background: "var(--paper)",
            }}>
              {adminCoachAvatar({ coach: c, size: 28 })}
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: "var(--espresso-900)" }}>{c.name}</div>
                <div className="mono" style={{ color: "var(--clay-600)", fontSize: 9, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 200 }}>{c.role}</div>
              </div>
            </div>
            {days.map((d, di) => {
              const items = (grid[c.id]?.[di] || []).filter(it => passFilter(it.kind));
              return (
                <button key={di} onClick={() => items.length === 0 && setAllocCell({ coach: c, dayIdx: di, day: d })} style={{
                  borderLeft: "1px solid var(--hairline)", background: items.length ? "transparent" : "var(--sand-50)",
                  padding: 4, display: "flex", flexDirection: "column", gap: 4, cursor: items.length ? "default" : "pointer",
                  border: "none", fontFamily: "var(--f-body)", textAlign: "left",
                  borderImage: "none",
                }}>
                  {items.map((it, ii) => {
                    const st = cellStyles[it.kind];
                    return (
                      <div key={ii} style={{
                        background: st.bg, color: st.fg, border: st.border,
                        borderRadius: 4, padding: "4px 6px", fontSize: 11, lineHeight: 1.2,
                        backgroundImage: st.stripes ? "repeating-linear-gradient(45deg, transparent 0 4px, rgba(184,107,75,0.25) 4px 8px)" : "none",
                      }}>
                        <div style={{ fontFamily: "var(--f-mono)", fontSize: 9, letterSpacing: 1, textTransform: "uppercase", opacity: 0.85 }}>
                          {it.kind === "pending" ? "Pending" : it.kind === "pt" ? "PT" : it.kind === "group" ? "Group" : "Off"}
                        </div>
                        <div style={{ fontWeight: 500 }}>{it.label}</div>
                      </div>
                    );
                  })}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {allocCell && <AllocationModal cell={allocCell} onClose={() => setAllocCell(null)} onSave={() => { setAllocCell(null); toast(`Slot allocated for ${allocCell.coach.name} · ${allocCell.day}`); }} />}
    </div>
  );
}

function AllocationModal({ cell, onClose, onSave }) {
  const [type, setType] = useStateAdm("PT");
  const [client, setClient] = useStateAdm("Meera P.");
  const [duration, setDuration] = useStateAdm(60);
  const [reason, setReason] = useStateAdm("personal");
  const [note, setNote] = useStateAdm("");

  const clients = ["Meera P.", "Karan S.", "Anita V.", "Vikram R.", "Rohan T.", "Shreya M."];
  const types = ["PT", "GROUP", "BLOCK"];
  const typeLabel = { PT: "PT Session", GROUP: "Group Class", BLOCK: "Block Time" };

  return (
    <div className="m3s-modal-backdrop" onClick={onClose}>
      <div className="m3s-modal" onClick={e => e.stopPropagation()} style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ background: "var(--espresso-900)", padding: "20px 24px" }}>
          <div className="mono" style={{ color: "var(--ochre-500)" }}>⬡ ALLOCATE SESSION</div>
          <div style={{ color: "var(--sand-200)", fontSize: 14, marginTop: 4 }}>{cell.coach.name} · {cell.day}</div>
        </div>
        <div style={{ padding: 24 }}>
          <label className="mono" style={{ display: "block", color: "var(--clay-600)", marginBottom: 8 }}>Session type</label>
          <div style={{ display: "flex", gap: 6, marginBottom: 18 }}>
            {types.map(t => {
              const active = type === t;
              return (
                <button key={t} onClick={() => setType(t)} className="mono" style={{
                  padding: "8px 14px", borderRadius: 999,
                  border: "1px solid " + (active ? "var(--walnut-700)" : "var(--hairline-strong)"),
                  background: active ? "var(--walnut-700)" : "var(--paper)",
                  color: active ? "var(--paper)" : "var(--walnut-700)",
                  cursor: "pointer", fontSize: 10,
                }}>{typeLabel[t].toUpperCase()}</button>
              );
            })}
          </div>

          {type === "PT" && (
            <>
              <label className="mono" style={{ display: "block", color: "var(--clay-600)", marginBottom: 8 }}>Client</label>
              <select className="m3s-input" value={client} onChange={e => setClient(e.target.value)} style={{ marginBottom: 16 }}>
                {clients.map(c => <option key={c}>{c}</option>)}
              </select>
              <label className="mono" style={{ display: "block", color: "var(--clay-600)", marginBottom: 8 }}>Duration</label>
              <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
                {[45,60,90].map(d => (
                  <button key={d} onClick={() => setDuration(d)} style={{
                    padding: "8px 14px", borderRadius: 999,
                    border: "1px solid " + (duration === d ? "var(--walnut-700)" : "var(--hairline-strong)"),
                    background: duration === d ? "var(--walnut-700)" : "var(--paper)",
                    color: duration === d ? "var(--paper)" : "var(--walnut-700)",
                    cursor: "pointer", fontSize: 13, fontFamily: "var(--f-body)",
                  }}>{d} min</button>
                ))}
              </div>
              <label className="mono" style={{ display: "block", color: "var(--clay-600)", marginBottom: 8 }}>Allocation note</label>
              <input className="m3s-input" value={note} onChange={e => setNote(e.target.value)} placeholder="Optional note for the coach" />
            </>
          )}

          {type === "GROUP" && (
            <>
              <label className="mono" style={{ display: "block", color: "var(--clay-600)", marginBottom: 8 }}>Class name</label>
              <input className="m3s-input" placeholder="e.g. Saturday Strong" style={{ marginBottom: 16 }} />
              <label className="mono" style={{ display: "block", color: "var(--clay-600)", marginBottom: 8 }}>Capacity</label>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <button className="btn-icon">–</button>
                <span style={{ fontFamily: "var(--f-display)", fontSize: 28, color: "var(--espresso-900)" }}>12</span>
                <button className="btn-icon">+</button>
              </div>
            </>
          )}

          {type === "BLOCK" && (
            <>
              <label className="mono" style={{ display: "block", color: "var(--clay-600)", marginBottom: 8 }}>Reason</label>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
                {["personal","programming","travel","studio event"].map(r => {
                  const active = reason === r;
                  return (
                    <button key={r} onClick={() => setReason(r)} className="mono" style={{
                      padding: "7px 12px", borderRadius: 999,
                      border: "1px solid " + (active ? "var(--walnut-700)" : "var(--hairline-strong)"),
                      background: active ? "var(--walnut-700)" : "var(--paper)",
                      color: active ? "var(--paper)" : "var(--walnut-700)",
                      cursor: "pointer", fontSize: 10,
                    }}>{r}</button>
                  );
                })}
              </div>
              <label className="mono" style={{ display: "block", color: "var(--clay-600)", marginBottom: 8 }}>Recurrence</label>
              <div style={{ display: "flex", gap: 6 }}>
                {["one-off","weekly","custom"].map(r => (
                  <button key={r} className="mono" style={{
                    padding: "7px 12px", borderRadius: 999, border: "1px solid var(--hairline-strong)",
                    background: "var(--paper)", color: "var(--walnut-700)", cursor: "pointer", fontSize: 10,
                  }}>{r}</button>
                ))}
              </div>
            </>
          )}
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, padding: "0 24px 24px" }}>
          <button className="btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={onSave} style={{ background: "var(--terracotta-500)" }}>Allocate →</button>
        </div>
      </div>
    </div>
  );
}

// ───────── INVITES ─────────

function AdminInvitesTab({ invites, setInvites, toast, openTriage }) {
  const TRAINERS = window.TRAINERS || [];
  const coachById = (id) => TRAINERS.find(t => t.id === id);

  const extras = [
    { id: "adm-inv-00", member: "Riya Sharma", memberInitials: "RS", coachId: "joe", day: "Tue, Apr 29", time: "07:00", duration: 60, submitted: "Today, 9:14 AM", status: "rejected", reason: "Pre-existing PT runs to 6:45 — no buffer to reset for a 7 AM." },
    { id: "adm-inv-01", member: "Rohan T.",  memberInitials: "RT", coachId: "deepika", day: "Wed, Apr 23", time: "06:00", duration: 60, submitted: "3 days ago", status: "pending" },
    { id: "adm-inv-02", member: "Vikram R.", memberInitials: "VR", coachId: "joe",     day: "Fri, Apr 25", time: "07:00", duration: 60, submitted: "1 day ago",  status: "pending" },
    { id: "adm-inv-03", member: "Priya K.",  memberInitials: "PK", coachId: "rahul",   day: "Mon, Apr 28", time: "06:30", duration: 60, submitted: "5 days ago", status: "overdue" },
  ];

  // Combine SEED + extras, mapping to coach
  const baseCoachMap = { "inv-01": "joe", "inv-02": "rahul", "inv-03": "lee" };
  const combined = [
    ...invites.map(i => ({ ...i, coachId: baseCoachMap[i.id] || "joe", submitted: i.requestedAt })),
    ...extras,
  ];

  const [selected, setSelected] = useStateAdm({});
  const [filter, setFilter] = useStateAdm("ALL");
  const [coachFilter, setCoachFilter] = useStateAdm("ALL");
  const [reassign, setReassign] = useStateAdm(null);

  const filterMatch = (i) => {
    if (filter === "ALL") return true;
    if (filter === "PENDING") return i.status === "pending";
    if (filter === "ACCEPTED") return i.status === "accepted";
    if (filter === "REJECTED") return i.status === "rejected";
    if (filter === "OVERDUE") return i.status === "overdue";
    return true;
  };
  const filtered = combined.filter(i => filterMatch(i) && (coachFilter === "ALL" || i.coachId === coachFilter));

  const selectedCount = Object.values(selected).filter(Boolean).length;

  function toggleAll() {
    if (selectedCount === filtered.length) { setSelected({}); return; }
    const next = {};
    filtered.forEach(i => next[i.id] = true);
    setSelected(next);
  }
  function bulk(action) {
    if (selectedCount === 0) return;
    toast(`${action} ${selectedCount} invite${selectedCount === 1 ? "" : "s"}`);
    setSelected({});
  }

  const statusChip = (s) => {
    const map = {
      pending:  { bg: "#FFF2D8",                 fg: "#6A4A10",                 lbl: "Pending" },
      accepted: { bg: "var(--sage-200)",         fg: "var(--sage-500)",         lbl: "Accepted" },
      rejected: { bg: "var(--terracotta-200)",   fg: "var(--terracotta-500)",   lbl: "Rejected" },
      overdue:  { bg: "var(--terracotta-500)",   fg: "var(--paper)",            lbl: "Overdue" },
      "alternate-sent": { bg: "#FFF2D8", fg: "#6A4A10", lbl: "Alt sent" },
    };
    const m = map[s] || map.pending;
    return <MonoChip bg={m.bg} fg={m.fg}>{m.lbl.toUpperCase()}</MonoChip>;
  };

  return (
    <div>
      <div className="mono" style={{ color: "var(--clay-600)", marginBottom: 8 }}>● ALL PT INVITES</div>
      <h2 className="serif" style={{ fontSize: 44, margin: "0 0 24px", color: "var(--espresso-900)", fontStyle: "italic" }}>
        Studio-wide invite queue.
      </h2>

      {/* Filter + bulk */}
      <div style={{
        background: "var(--paper)", borderRadius: "var(--r-lg)", boxShadow: "var(--sh-1)",
        border: "1px solid var(--hairline)", padding: "14px 20px",
        display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap", marginBottom: 20,
      }}>
        <label style={{ display: "inline-flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
          <input type="checkbox" checked={selectedCount > 0 && selectedCount === filtered.length} onChange={toggleAll} />
          <span className="mono" style={{ color: "var(--clay-600)" }}>SELECT ALL</span>
        </label>
        <button onClick={() => bulk("Approved")} disabled={!selectedCount} className="mono" style={{
          padding: "6px 12px", borderRadius: "var(--r-pill)", border: "1px solid var(--sage-500)",
          background: selectedCount ? "var(--sage-200)" : "var(--sand-50)",
          color: selectedCount ? "var(--sage-500)" : "var(--clay-600)",
          cursor: selectedCount ? "pointer" : "not-allowed", fontSize: 10, opacity: selectedCount ? 1 : 0.5,
        }}>✓ APPROVE</button>
        <button onClick={() => bulk("Rejected")} disabled={!selectedCount} className="mono" style={{
          padding: "6px 12px", borderRadius: "var(--r-pill)", border: "1px solid var(--terracotta-500)",
          background: selectedCount ? "var(--terracotta-200)" : "var(--sand-50)",
          color: selectedCount ? "var(--terracotta-500)" : "var(--clay-600)",
          cursor: selectedCount ? "pointer" : "not-allowed", fontSize: 10, opacity: selectedCount ? 1 : 0.5,
        }}>✗ REJECT</button>
        <button onClick={() => bulk("Reassigned")} disabled={!selectedCount} className="mono" style={{
          padding: "6px 12px", borderRadius: "var(--r-pill)", border: "1px solid var(--ochre-500)",
          background: selectedCount ? "#FFF2D8" : "var(--sand-50)",
          color: selectedCount ? "#6A4A10" : "var(--clay-600)",
          cursor: selectedCount ? "pointer" : "not-allowed", fontSize: 10, opacity: selectedCount ? 1 : 0.5,
        }}>→ REASSIGN</button>

        <div style={{ marginLeft: "auto", display: "flex", gap: 6, flexWrap: "wrap" }}>
          {["ALL","PENDING","ACCEPTED","REJECTED","OVERDUE"].map(f => {
            const active = filter === f;
            return (
              <button key={f} onClick={() => setFilter(f)} className="mono" style={{
                padding: "6px 10px", borderRadius: "var(--r-pill)",
                border: "1px solid " + (active ? "var(--walnut-700)" : "var(--hairline-strong)"),
                background: active ? "var(--walnut-700)" : "var(--paper)",
                color: active ? "var(--paper)" : "var(--walnut-700)",
                cursor: "pointer", fontSize: 10,
              }}>{f}</button>
            );
          })}
          <select value={coachFilter} onChange={e => setCoachFilter(e.target.value)} className="mono" style={{
            padding: "6px 10px", borderRadius: "var(--r-pill)",
            border: "1px solid var(--hairline-strong)", background: "var(--paper)",
            color: "var(--walnut-700)", fontSize: 10, cursor: "pointer",
          }}>
            <option value="ALL">ALL COACHES</option>
            {TRAINERS.map(c => <option key={c.id} value={c.id}>{c.name.toUpperCase()}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      <div style={{ background: "var(--paper)", borderRadius: "var(--r-lg)", boxShadow: "var(--sh-2)", border: "1px solid var(--hairline)", overflow: "hidden" }}>
        <div style={{
          display: "grid", gridTemplateColumns: "32px 1.2fr 1.2fr 1.2fr 0.9fr 0.9fr 1.1fr",
          padding: "12px 20px", background: "var(--sand-100)",
          borderBottom: "1px solid var(--hairline)", gap: 12, alignItems: "center",
        }}>
          <span />
          <span className="mono" style={{ color: "var(--clay-600)" }}>CLIENT</span>
          <span className="mono" style={{ color: "var(--clay-600)" }}>COACH</span>
          <span className="mono" style={{ color: "var(--clay-600)" }}>SESSION</span>
          <span className="mono" style={{ color: "var(--clay-600)" }}>SUBMITTED</span>
          <span className="mono" style={{ color: "var(--clay-600)" }}>STATUS</span>
          <span className="mono" style={{ color: "var(--clay-600)", textAlign: "right" }}>ACTIONS</span>
        </div>
        {filtered.map(i => {
          const c = coachById(i.coachId);
          return (
            <div key={i.id} style={{
              display: "grid", gridTemplateColumns: "32px 1.2fr 1.2fr 1.2fr 0.9fr 0.9fr 1.1fr",
              padding: "16px 20px", borderBottom: "1px solid var(--hairline)", gap: 12, alignItems: "center",
            }}>
              <input type="checkbox" checked={!!selected[i.id]} onChange={() => setSelected({ ...selected, [i.id]: !selected[i.id] })} />
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: "50%", background: "var(--sand-200)", color: "var(--walnut-700)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "var(--f-display)", fontStyle: "italic", fontSize: 13, flexShrink: 0,
                }}>{i.memberInitials}</div>
                <span style={{ fontWeight: 500, fontSize: 14, color: "var(--espresso-900)" }}>{i.member}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {c && adminCoachAvatar({ coach: c, size: 24 })}
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 13, color: "var(--espresso-900)" }}>{c?.name || "—"}</div>
                  <div className="mono" style={{ color: "var(--clay-600)", fontSize: 9 }}>{c?.role || ""}</div>
                </div>
              </div>
              <span style={{ fontSize: 13, color: "var(--espresso-900)" }}>{i.day} · {i.time}</span>
              <span className="mono" style={{ color: "var(--clay-600)" }}>{i.submitted}</span>
              {statusChip(i.status)}
              <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
                {(i.status === "rejected" || i.status === "overdue") && openTriage && (
                  <button onClick={() => openTriage({
                    id: i.id,
                    client: { name: i.member, initials: i.memberInitials, tenure: "Member" },
                    coachId: i.coachId,
                    slot: { day: (i.day || "").split(",")[0].toUpperCase(), date: (i.day || "").split(", ")[1] || i.day, time: i.time, duration: i.duration || 60, room: "Ground floor studio" },
                    submittedAt: i.submitted || "Today",
                    reason: i.reason || "Pre-existing PT runs into the slot — no buffer to reset.",
                    sla: { deadline: "RESOLVE BY 8:00 PM TONIGHT", remaining: "3H 22M LEFT" },
                    availableCoachIds: ["deb", "anisha"].filter(id => id !== i.coachId),
                  })} className="mono" style={{
                    padding: "5px 10px", borderRadius: "var(--r-pill)",
                    border: "1px solid var(--terracotta-500)",
                    background: "var(--terracotta-500)", color: "var(--paper)",
                    cursor: "pointer", fontSize: 9.5, letterSpacing: 1.4,
                    display: "inline-flex", alignItems: "center", gap: 4,
                  }} title="Open decline triage">△ TRIAGE</button>
                )}
                <button onClick={() => toast(`Accepted ${i.member}`)} className="btn-icon" title="Accept" style={{ color: "var(--sage-500)" }}>✓</button>
                <button onClick={() => toast(`Rejected ${i.member}`)} className="btn-icon" title="Reject" style={{ color: "var(--terracotta-500)" }}>✗</button>
                <button onClick={() => setReassign(i)} className="btn-icon" title="Reassign" style={{ color: "var(--ochre-500)" }}>→</button>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div style={{ padding: 32, textAlign: "center", color: "var(--clay-600)" }}>No invites match this filter.</div>
        )}
      </div>

      {reassign && <ReassignModal inv={reassign} onClose={() => setReassign(null)} onSend={(coach) => { setReassign(null); toast(`Reassigned ${reassign.member} → ${coach.name}`); }} />}
    </div>
  );
}

function ReassignModal({ inv, onClose, onSend }) {
  const TRAINERS = window.TRAINERS || [];
  const [picked, setPicked] = useStateAdm(null);
  const [reason, setReason] = useStateAdm("");

  return (
    <div className="m3s-modal-backdrop" onClick={onClose}>
      <div className="m3s-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 420 }}>
        <div className="mono" style={{ color: "var(--clay-600)", marginBottom: 6 }}>REASSIGN INVITE</div>
        <h3 className="serif" style={{ fontSize: 26, margin: "0 0 6px", color: "var(--espresso-900)" }}>{inv.member}</h3>
        <div style={{ color: "var(--clay-600)", fontSize: 13, marginBottom: 18 }}>{inv.day} · {inv.time} · {inv.duration} min</div>

        <label className="mono" style={{ display: "block", color: "var(--clay-600)", marginBottom: 8 }}>Reassign to</label>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 16 }}>
          {TRAINERS.map(c => {
            const active = picked?.id === c.id;
            return (
              <button key={c.id} onClick={() => setPicked(c)} style={{
                display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
                padding: 8, borderRadius: "var(--r-md)",
                border: "1px solid " + (active ? "var(--walnut-700)" : "var(--hairline)"),
                background: active ? "var(--sand-100)" : "var(--paper)",
                cursor: "pointer",
              }}>
                {adminCoachAvatar({ coach: c, size: 32 })}
                <span style={{ fontSize: 11, color: "var(--espresso-900)" }}>{c.name}</span>
              </button>
            );
          })}
        </div>

        <label className="mono" style={{ display: "block", color: "var(--clay-600)", marginBottom: 8 }}>Reason for reassignment</label>
        <input className="m3s-input" value={reason} onChange={e => setReason(e.target.value)} placeholder="e.g. Lee at capacity" />

        <div style={{ display: "flex", gap: 8, marginTop: 20, justifyContent: "flex-end" }}>
          <button className="btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn-primary" disabled={!picked} onClick={() => picked && onSend(picked)} style={{ background: "var(--terracotta-500)" }}>Reassign →</button>
        </div>
      </div>
    </div>
  );
}

// ───────── COACHES ─────────

// Studio-wide ratings panel rendered below the coach grid.
function AdminRatingsPanel() {
  const loadRatings = window.loadRatings || (() => []);
  const coachAverages = window.coachAverages || (() => null);
  const CRITERIA = window.RATING_CRITERIA || [];

  const all = loadRatings()
    .sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));
  const coachIds = [...new Set(all.map(r => r.coachId))];

  const [selectedCoach, setSelectedCoach] = useStateAdm('all');
  const [selectedPeriod, setSelectedPeriod] = useStateAdm('all');

  const filtered = all.filter(r => {
    if (selectedCoach !== 'all' && r.coachId !== selectedCoach) return false;
    if (selectedPeriod === 'week') {
      const cutoff = new Date(); cutoff.setDate(cutoff.getDate() - 7);
      return new Date(r.sessionDate) >= cutoff;
    }
    if (selectedPeriod === 'month') {
      const cutoff = new Date(); cutoff.setMonth(cutoff.getMonth() - 1);
      return new Date(r.sessionDate) >= cutoff;
    }
    return true;
  });

  if (all.length === 0) {
    return (
      <div style={{
        marginTop: 36, padding: 32, borderRadius: 'var(--r-lg)',
        background: 'var(--paper)', border: '1px solid var(--hairline)',
        textAlign: 'center', color: 'var(--clay-600)',
      }}>
        <div className="mono" style={{ color: 'var(--clay-600)', marginBottom: 8 }}>● ALL MEMBER RATINGS</div>
        <div>No member ratings have come in yet.</div>
      </div>
    );
  }

  return (
    <div style={{ marginTop: 36 }}>
      <div style={{
        fontFamily: 'var(--f-mono)', fontSize: 10, letterSpacing: 1.8,
        textTransform: 'uppercase', color: 'var(--clay-600)',
        marginBottom: 4,
      }}>● ALL MEMBER RATINGS</div>
      <h3 style={{
        fontFamily: 'var(--f-display)', fontSize: 28,
        color: 'var(--espresso-900)', margin: '0 0 20px',
        fontStyle: 'italic',
      }}>Studio-wide feedback.</h3>

      {/* Filters */}
      <div style={{
        display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20,
      }}>
        {['all', ...coachIds].map(id => (
          <button key={id} onClick={() => setSelectedCoach(id)} style={{
            padding: '6px 14px', borderRadius: 999, border: 'none',
            background: selectedCoach === id
              ? 'var(--walnut-700)' : 'var(--sand-100)',
            color: selectedCoach === id
              ? 'var(--paper)' : 'var(--clay-600)',
            fontFamily: 'var(--f-mono)', fontSize: 10,
            letterSpacing: 1.2, textTransform: 'uppercase',
            cursor: 'pointer',
          }}>
            {id === 'all'
              ? 'All coaches'
              : (all.find(r => r.coachId === id)?.coachName || id)}
          </button>
        ))}
        {['all', 'week', 'month'].map(p => (
          <button key={p} onClick={() => setSelectedPeriod(p)} style={{
            padding: '6px 14px', borderRadius: 999, border: 'none',
            background: selectedPeriod === p
              ? 'var(--espresso-800)' : 'var(--sand-100)',
            color: selectedPeriod === p
              ? 'var(--paper)' : 'var(--clay-600)',
            fontFamily: 'var(--f-mono)', fontSize: 10,
            letterSpacing: 1.2, textTransform: 'uppercase',
            cursor: 'pointer',
          }}>
            {p === 'all' ? 'All time' : p === 'week' ? 'This week' : 'This month'}
          </button>
        ))}
      </div>

      {/* Coach averages summary table */}
      <div style={{
        background: 'var(--paper)', border: '1px solid var(--hairline)',
        borderRadius: 12, overflow: 'hidden', marginBottom: 24,
        boxShadow: 'var(--sh-2)',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '160px 80px 80px 80px 80px 80px 80px',
          gap: 0, padding: '10px 20px',
          background: 'var(--sand-100)',
          fontFamily: 'var(--f-mono)', fontSize: 9.5,
          letterSpacing: 1.2, textTransform: 'uppercase',
          color: 'var(--clay-600)',
        }}>
          <div>Coach</div>
          <div>Overall</div>
          <div>Workout</div>
          <div>Form</div>
          <div>Comms</div>
          <div>Structure</div>
          <div>Sessions</div>
        </div>
        {coachIds.map((coachId, i) => {
          const avgs = coachAverages(coachId);
          const name = all.find(r => r.coachId === coachId)?.coachName || coachId;
          if (!avgs) return null;
          return (
            <div key={coachId} style={{
              display: 'grid',
              gridTemplateColumns: '160px 80px 80px 80px 80px 80px 80px',
              gap: 0, padding: '14px 20px',
              borderTop: i === 0 ? 'none' : '1px solid var(--hairline)',
              alignItems: 'center',
            }}>
              <div style={{
                fontFamily: 'var(--f-body)', fontSize: 14,
                fontWeight: 600, color: 'var(--espresso-900)',
              }}>{name}</div>
              {['overall','workout','form','communication','structure'].map(k => (
                <div key={k} style={{
                  fontFamily: 'var(--f-display)', fontStyle: 'italic',
                  fontSize: 18, color: avgs[k] >= 4
                    ? 'var(--sage-500)'
                    : avgs[k] >= 3 ? 'var(--ochre-500)'
                    : 'var(--terracotta-500)',
                }}>{avgs[k]}</div>
              ))}
              <div style={{
                fontFamily: 'var(--f-mono)', fontSize: 10,
                color: 'var(--clay-600)',
              }}>{avgs.count}</div>
            </div>
          );
        })}
      </div>

      {/* Individual rating feed */}
      <div style={{
        fontFamily: 'var(--f-mono)', fontSize: 10, letterSpacing: 1.4,
        textTransform: 'uppercase', color: 'var(--clay-600)',
        marginBottom: 10,
      }}>Individual ratings ({filtered.length})</div>
      <div style={{
        background: 'var(--paper)', border: '1px solid var(--hairline)',
        borderRadius: 12, overflow: 'hidden', boxShadow: 'var(--sh-1)',
      }}>
        {filtered.map((r, i) => (
          <div key={r.id} style={{
            padding: '14px 20px',
            borderTop: i === 0 ? 'none' : '1px solid var(--hairline)',
            display: 'grid',
            gridTemplateColumns: '1fr auto',
            gap: 16, alignItems: 'flex-start',
          }}>
            <div>
              <div style={{
                fontFamily: 'var(--f-mono)', fontSize: 9.5,
                letterSpacing: 1.2, textTransform: 'uppercase',
                color: 'var(--clay-600)', marginBottom: 4,
              }}>
                {r.sessionDate} · {r.coachName} · from {r.clientName}
              </div>
              <div style={{
                display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 6,
              }}>
                {CRITERIA.map(c => (
                  <div key={c.key} style={{
                    padding: '3px 10px', borderRadius: 999,
                    background: 'var(--sand-100)',
                    fontFamily: 'var(--f-mono)', fontSize: 9,
                    letterSpacing: 1, textTransform: 'uppercase',
                    color: 'var(--clay-600)',
                  }}>
                    {c.key}: {r.scores[c.key]}/5
                  </div>
                ))}
              </div>
              {r.comment && (
                <div style={{
                  fontFamily: 'var(--f-body)', fontSize: 13,
                  color: 'var(--espresso-800)', fontStyle: 'italic',
                  lineHeight: 1.4,
                }}>"{r.comment}"</div>
              )}
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{
                fontFamily: 'var(--f-display)', fontStyle: 'italic',
                fontSize: 22, color: 'var(--espresso-900)', lineHeight: 1,
              }}>{r.overall}</div>
              <div style={{
                fontFamily: 'var(--f-mono)', fontSize: 9,
                color: 'var(--clay-600)',
              }}>/ 5</div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div style={{ padding: 32, textAlign: 'center', color: 'var(--clay-600)', fontSize: 13 }}>
            No ratings match the current filters.
          </div>
        )}
      </div>
    </div>
  );
}

function AdminCoachesTab({ toast, onJumpToCalendar }) {
  const TRAINERS = window.TRAINERS || [];
  const data = {
    joe:     { clients: 6, sessions: 8,  capacity: 75, status: "ON FLOOR" },
    deb:     { clients: 5, sessions: 6,  capacity: 62, status: "ON FLOOR" },
    deepika: { clients: 4, sessions: 9,  capacity: 82, status: "AVAILABLE" },
    lee:     { clients: 7, sessions: 10, capacity: 90, status: "ON FLOOR" },
    pilates: { clients: 0, sessions: 12, capacity: null, status: "AVAILABLE", groupOnly: true },
    rahul:   { clients: 6, sessions: 11, capacity: 88, status: "ON FLOOR" },
    aakash:  { clients: 4, sessions: 5,  capacity: 55, status: "OFF TODAY" },
    tarun:   { clients: 3, sessions: 7,  capacity: 70, status: "AVAILABLE" },
    santo:   { clients: 5, sessions: 9,  capacity: 80, status: "ON FLOOR" },
    shahbaz: { clients: 0, sessions: 14, capacity: null, status: "ON FLOOR", groupOnly: true },
  };

  const summary = [
    `${TRAINERS.length} COACHES`,
    `${TRAINERS.filter(t => t.ptEligible).length} PT-ELIGIBLE`,
    `${TRAINERS.filter(t => !t.ptEligible).length} GROUP ONLY`,
    `${Object.values(data).filter(d => d.status === "OFF TODAY").length} OFF TODAY`,
  ];

  return (
    <div>
      <div className="mono" style={{ color: "var(--clay-600)", marginBottom: 8 }}>● COACH ROSTER</div>
      <h2 className="serif" style={{ fontSize: 44, margin: "0 0 16px", color: "var(--espresso-900)", fontStyle: "italic" }}>
        The M3S team.
      </h2>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 28 }}>
        {summary.map((s, i) => <MonoChip key={i}>{s}</MonoChip>)}
      </div>

      <div className="admin-coach-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {TRAINERS.map(c => {
          const d = data[c.id] || { clients: 0, sessions: 0, capacity: 0, status: "AVAILABLE" };
          return (
            <div key={c.id} style={{
              background: "var(--paper)", borderRadius: "var(--r-lg)", boxShadow: "var(--sh-2)",
              border: "1px solid var(--hairline)", padding: 22,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                {adminCoachAvatar({ coach: c, size: 52 })}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 16, fontWeight: 600, color: "var(--espresso-900)" }}>{c.name}</div>
                  <div className="mono" style={{ color: "var(--clay-600)", fontSize: 9 }}>{c.role}</div>
                  <div style={{ marginTop: 6 }}>
                    {c.ptEligible
                      ? <MonoChip bg="var(--sage-200)" fg="var(--sage-500)">PT ELIGIBLE</MonoChip>
                      : <MonoChip bg="var(--sand-200)" fg="var(--clay-600)">GROUP ONLY</MonoChip>
                    }
                  </div>
                </div>
                <StatusPill status={d.status} />
              </div>

              <div style={{
                display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
                gap: 12, paddingTop: 14, borderTop: "1px solid var(--hairline)", marginBottom: 14,
              }}>
                <div>
                  <div style={{ fontFamily: "var(--f-body)", fontSize: 18, fontWeight: 600, color: "var(--espresso-900)" }}>{d.clients}</div>
                  <div className="mono" style={{ color: "var(--clay-600)", fontSize: 9 }}>ACTIVE</div>
                </div>
                <div>
                  <div style={{ fontFamily: "var(--f-body)", fontSize: 18, fontWeight: 600, color: "var(--espresso-900)" }}>{d.sessions}</div>
                  <div className="mono" style={{ color: "var(--clay-600)", fontSize: 9 }}>THIS WEEK</div>
                </div>
                <div>
                  {d.capacity != null ? (
                    <>
                      <div style={{ fontFamily: "var(--f-body)", fontSize: 18, fontWeight: 600, color: "var(--espresso-900)" }}>{d.capacity}%</div>
                      <div style={{ marginTop: 4, height: 4, background: "var(--sand-200)", borderRadius: 999, overflow: "hidden" }}>
                        <div style={{ width: d.capacity + "%", height: "100%", background: "var(--ochre-500)" }} />
                      </div>
                    </>
                  ) : (
                    <>
                      <div style={{ fontFamily: "var(--f-body)", fontSize: 14, fontWeight: 600, color: "var(--clay-600)" }}>—</div>
                      <div className="mono" style={{ color: "var(--clay-600)", fontSize: 9 }}>GROUP</div>
                    </>
                  )}
                </div>
              </div>

              {(() => {
                const avgs = window.coachAverages && window.coachAverages(c.id);
                return avgs ? (
                  <div style={{
                    marginBottom: 14, paddingTop: 10,
                    borderTop: "1px solid var(--hairline)",
                    display: "flex", alignItems: "center",
                    justifyContent: "space-between",
                  }}>
                    <div style={{
                      fontFamily: "var(--f-mono)", fontSize: 9.5,
                      letterSpacing: 1.2, textTransform: "uppercase",
                      color: "var(--clay-600)",
                    }}>Member rating</div>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                      <span style={{
                        fontFamily: "var(--f-display)", fontStyle: "italic",
                        fontSize: 20, color: "var(--espresso-900)",
                      }}>{avgs.overall}</span>
                      <span style={{
                        fontFamily: "var(--f-mono)", fontSize: 9,
                        color: "var(--clay-600)",
                      }}>/ 5 · {avgs.count} sessions</span>
                    </div>
                  </div>
                ) : (
                  <div style={{
                    marginBottom: 14, paddingTop: 10,
                    borderTop: "1px solid var(--hairline)",
                    fontFamily: "var(--f-mono)", fontSize: 9.5,
                    color: "var(--clay-600)", letterSpacing: 1.2,
                    textTransform: "uppercase",
                  }}>No ratings yet</div>
                );
              })()}

              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => onJumpToCalendar && onJumpToCalendar(c)} style={{
                  flex: 1, padding: "8px 12px", borderRadius: "var(--r-pill)",
                  background: "var(--paper)", color: "var(--walnut-700)",
                  border: "1px solid var(--hairline-strong)", cursor: "pointer",
                  fontSize: 12, fontFamily: "var(--f-body)",
                }}>View schedule →</button>
                <button onClick={() => toast(`Editing ${c.name}'s profile (demo)`)} style={{
                  flex: 1, padding: "8px 12px", borderRadius: "var(--r-pill)",
                  background: "var(--paper)", color: "var(--walnut-700)",
                  border: "1px solid var(--hairline-strong)", cursor: "pointer",
                  fontSize: 12, fontFamily: "var(--f-body)",
                }}>Edit profile →</button>
              </div>
            </div>
          );
        })}
      </div>

      <AdminRatingsPanel />

      <div style={{
        marginTop: 20, padding: 32, textAlign: "center",
        background: "var(--paper)", borderRadius: "var(--r-lg)",
        border: "2px dashed var(--ochre-500)",
      }}>
        <div className="mono" style={{ color: "var(--ochre-500)", marginBottom: 8 }}>+ ONBOARD NEW COACH</div>
        <div style={{ color: "var(--clay-600)", fontSize: 14, marginBottom: 16 }}>Invite a new coach to Coach Universe</div>
        <button onClick={() => toast("Coach invite sent (demo)")} className="btn-primary" style={{ background: "var(--terracotta-500)" }}>
          Send invite →
        </button>
      </div>

      <style>{`
        @media (max-width: 1100px) { .admin-coach-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 700px)  { .admin-coach-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}

// ───────── USERS ─────────

function AdminUsersTab({ adminData, toast }) {
  const [admins, setAdmins] = useStateAdm(ADMIN_USERS);
  const [editing, setEditing] = useStateAdm(null);
  const [removing, setRemoving] = useStateAdm(null);
  const [adding, setAdding] = useStateAdm({ coachId: "", role: "MANAGER" });

  if (!adminData?.canManageAdmins) {
    return (
      <div style={{
        background: "var(--espresso-900)", color: "var(--paper)",
        borderRadius: "var(--r-xl)", padding: 48, textAlign: "center",
        maxWidth: 560, margin: "40px auto",
      }}>
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--sand-300)" strokeWidth="1.5" style={{ marginBottom: 16 }}>
          <rect x="4" y="10" width="16" height="11" rx="2" />
          <path d="M8 10V7a4 4 0 1 1 8 0v3" />
        </svg>
        <h3 className="serif" style={{ fontSize: 28, margin: "0 0 12px", fontStyle: "italic" }}>Owner access only.</h3>
        <p style={{ color: "var(--sand-300)", fontSize: 15, lineHeight: 1.6, margin: 0 }}>
          Admin and user management is restricted to the Studio Owner. Contact Shwetambari to update admin permissions.
        </p>
      </div>
    );
  }

  const accessChip = (role) => {
    if (role === "owner") return <MonoChip bg="var(--espresso-900)" fg="var(--paper)">OWNER</MonoChip>;
    if (role === "manager") return <MonoChip bg="var(--walnut-700)" fg="var(--paper)">MANAGER</MonoChip>;
    return <MonoChip bg="var(--sand-200)" fg="var(--clay-600)">SENIOR COACH</MonoChip>;
  };

  return (
    <div>
      <div className="mono" style={{ color: "var(--clay-600)", marginBottom: 8 }}>● ADMIN &amp; USER MANAGEMENT</div>
      <h2 className="serif" style={{ fontSize: 44, margin: "0 0 24px", color: "var(--espresso-900)", fontStyle: "italic" }}>
        Who can access what.
      </h2>

      {/* Current admins table */}
      <div style={{ background: "var(--paper)", borderRadius: "var(--r-lg)", boxShadow: "var(--sh-2)", border: "1px solid var(--hairline)", overflow: "hidden", marginBottom: 28 }}>
        <div style={{
          display: "grid", gridTemplateColumns: "1.6fr 1.2fr 1fr 1fr 1fr",
          padding: "12px 20px", background: "var(--sand-100)", borderBottom: "1px solid var(--hairline)", gap: 12, alignItems: "center",
        }}>
          {["NAME","ROLE","ACCESS LEVEL","ADDED ON","ACTIONS"].map(h => (
            <span key={h} className="mono" style={{ color: "var(--clay-600)" }}>{h}</span>
          ))}
        </div>
        {admins.map(a => {
          const isYou = adminData?.id === a.id;
          return (
            <div key={a.id} style={{
              display: "grid", gridTemplateColumns: "1.6fr 1.2fr 1fr 1fr 1fr",
              padding: "16px 20px", borderBottom: "1px solid var(--hairline)", gap: 12, alignItems: "center",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                {adminCoachAvatar({ coach: a, size: 32 })}
                <div>
                  <div style={{ fontWeight: 500, fontSize: 14, color: "var(--espresso-900)" }}>{a.name}</div>
                  {isYou && <div className="mono" style={{ color: "var(--ochre-500)", marginTop: 2 }}>● YOU</div>}
                </div>
              </div>
              <span style={{ fontSize: 13, color: "var(--espresso-900)" }}>{a.role}</span>
              {accessChip(a.adminRole)}
              <span className="mono" style={{ color: "var(--clay-600)" }}>{a.adminRole === "owner" ? "STUDIO FOUNDING" : "JAN 12, 2026"}</span>
              <div style={{ display: "flex", gap: 6 }}>
                {a.adminRole === "owner" ? (
                  <span className="mono" style={{ color: "var(--clay-600)", opacity: 0.5 }}>—</span>
                ) : (
                  <>
                    <button onClick={() => setEditing(a)} className="mono" style={{
                      padding: "6px 10px", borderRadius: "var(--r-pill)", border: "1px solid var(--hairline-strong)",
                      background: "var(--paper)", color: "var(--walnut-700)", cursor: "pointer", fontSize: 10,
                    }}>Edit role ↓</button>
                    <button onClick={() => setRemoving(a)} className="mono" style={{
                      padding: "6px 10px", borderRadius: "var(--r-pill)", border: "1px solid var(--terracotta-200)",
                      background: "var(--paper)", color: "var(--terracotta-500)", cursor: "pointer", fontSize: 10,
                    }}>Remove ✕</button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 28 }}>
        {[
          { lbl: "OWNER",         text: "Full access + add/remove admins + billing." },
          { lbl: "MANAGER",       text: "Coach + calendar + invite management. No admin settings." },
          { lbl: "SENIOR COACH",  text: "Client overview + invite management only (future)." },
        ].map(l => (
          <div key={l.lbl} style={{ background: "var(--sand-100)", borderRadius: "var(--r-lg)", padding: 16 }}>
            <div className="mono" style={{ color: "var(--walnut-700)", marginBottom: 6 }}>{l.lbl}</div>
            <div style={{ color: "var(--clay-600)", fontSize: 13, lineHeight: 1.5 }}>{l.text}</div>
          </div>
        ))}
      </div>

      {/* Add admin */}
      <div style={{ background: "var(--paper)", borderRadius: "var(--r-lg)", boxShadow: "var(--sh-2)", border: "1px solid var(--hairline)", padding: 24 }}>
        <div className="mono" style={{ color: "var(--clay-600)", marginBottom: 6, display: "inline-flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--terracotta-500)" }} />
          ADD ADMIN ACCESS
        </div>
        <h3 className="serif" style={{ fontSize: 24, margin: "0 0 20px", color: "var(--espresso-900)" }}>Grant admin to a coach.</h3>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 20 }}>
          <div>
            <label className="mono" style={{ display: "block", color: "var(--clay-600)", marginBottom: 8 }}>SELECT PERSON</label>
            <select className="m3s-input" value={adding.coachId} onChange={e => setAdding({ ...adding, coachId: e.target.value })}>
              <option value="">— pick a coach —</option>
              {(window.TRAINERS || []).map(c => <option key={c.id} value={c.id}>{c.name} · {c.role}</option>)}
              <option value="external">External person (email invite)</option>
            </select>
          </div>
          <div>
            <label className="mono" style={{ display: "block", color: "var(--clay-600)", marginBottom: 8 }}>ACCESS LEVEL</label>
            <div style={{ display: "flex", gap: 6 }}>
              {["MANAGER","SENIOR COACH"].map(r => {
                const active = adding.role === r;
                return (
                  <button key={r} onClick={() => setAdding({ ...adding, role: r })} className="mono" style={{
                    padding: "10px 14px", borderRadius: "var(--r-pill)",
                    border: "1px solid " + (active ? "var(--walnut-700)" : "var(--hairline-strong)"),
                    background: active ? "var(--walnut-700)" : "var(--paper)",
                    color: active ? "var(--paper)" : "var(--walnut-700)",
                    cursor: "pointer", fontSize: 10,
                  }}>{r}</button>
                );
              })}
            </div>
          </div>
        </div>

        <div style={{ background: "var(--sand-100)", borderRadius: "var(--r-md)", padding: 16, marginBottom: 20 }}>
          <div className="mono" style={{ color: "var(--clay-600)", marginBottom: 10 }}>PERMISSIONS PREVIEW · {adding.role}</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {[
              { ok: true,  text: "View all coach calendars" },
              { ok: true,  text: "Approve / reject PT invites" },
              { ok: true,  text: "Reassign clients" },
              { ok: false, text: "Add or remove admins" },
              { ok: false, text: "Access billing and revenue" },
            ].map((p, i) => (
              <div key={i} className="mono" style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                color: p.ok ? "var(--sage-500)" : "var(--terracotta-500)",
              }}>
                <span style={{ fontSize: 12 }}>{p.ok ? "✓" : "✗"}</span>
                <span style={{ textTransform: "none", letterSpacing: 0.5, color: "var(--espresso-900)", fontSize: 11 }}>{p.text}</span>
              </div>
            ))}
          </div>
        </div>

        <button onClick={() => {
          if (!adding.coachId) { toast("Pick a coach first"); return; }
          toast("Admin access granted (demo)");
          setAdding({ coachId: "", role: "MANAGER" });
        }} className="btn-primary" style={{ background: "var(--terracotta-500)" }}>
          Grant admin access →
        </button>
      </div>

      {editing && (
        <div className="m3s-modal-backdrop" onClick={() => setEditing(null)}>
          <div className="m3s-modal" onClick={e => e.stopPropagation()} style={{ padding: 0, overflow: "hidden", maxWidth: 380 }}>
            <div style={{ background: "var(--espresso-900)", padding: "16px 20px" }}>
              <div className="mono" style={{ color: "var(--ochre-500)" }}>⬡ EDIT ADMIN ROLE</div>
            </div>
            <div style={{ padding: 24 }}>
              <p style={{ margin: "0 0 16px", color: "var(--espresso-900)" }}>Changing {editing.name}'s access level.</p>
              <div className="mono" style={{ color: "var(--clay-600)", marginBottom: 8 }}>Current</div>
              <div style={{ marginBottom: 16 }}>{accessChip(editing.adminRole)}</div>
              <div className="mono" style={{ color: "var(--clay-600)", marginBottom: 8 }}>New role</div>
              <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
                {["MANAGER","SENIOR COACH"].map(r => (
                  <button key={r} className="mono" style={{
                    padding: "8px 14px", borderRadius: "var(--r-pill)",
                    border: "1px solid var(--hairline-strong)", background: "var(--paper)",
                    color: "var(--walnut-700)", cursor: "pointer", fontSize: 10,
                  }}>{r}</button>
                ))}
              </div>
              <div className="mono" style={{ color: "var(--terracotta-500)", marginBottom: 4 }}>
                ⚠ DOWNGRADING REMOVES ADMIN PANEL ACCESS
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, padding: "0 24px 24px", justifyContent: "flex-end" }}>
              <button className="btn-ghost" onClick={() => setEditing(null)}>Cancel</button>
              <button className="btn-primary" onClick={() => { setEditing(null); toast(`${editing.name}'s role updated`); }} style={{ background: "var(--terracotta-500)" }}>Update role →</button>
            </div>
          </div>
        </div>
      )}

      {removing && (
        <div className="m3s-modal-backdrop" onClick={() => setRemoving(null)}>
          <div className="m3s-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 400 }}>
            <h3 className="serif" style={{ fontSize: 24, margin: "0 0 12px", color: "var(--espresso-900)" }}>
              Remove {removing.name}'s admin access?
            </h3>
            <p style={{ color: "var(--clay-600)", lineHeight: 1.5, marginBottom: 24 }}>
              They will return to standard coach access. This can be undone at any time.
            </p>
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button className="btn-ghost" onClick={() => setRemoving(null)}>Keep access</button>
              <button className="btn-primary" onClick={() => {
                setAdmins(admins.filter(x => x.id !== removing.id));
                toast(`${removing.name}'s admin access removed`);
                setRemoving(null);
              }} style={{ background: "var(--terracotta-500)" }}>Remove access</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ───────── Admin Page Root ─────────

function AdminPage({ coach, adminData, invites, setInvites, toast }) {
  const [tab, setTab] = useStateAdm("overview");
  const [triage, setTriage] = useStateAdm(null);
  const pendingCount = (invites || []).filter(i => i.status === "pending").length;
  const reviewItems = window.REVIEW_SEED || [];
  const reviewCount = reviewItems.filter(r => r.bucket === "today").length;

  function openTriage(opts) {
    const make = window.adminMakeTriageInvite || ((o) => o);
    setTriage(make(opts || {}));
    setTab("invites"); // breadcrumb says "Back to invites"
  }

  // Triage view replaces the normal tab body
  if (triage && window.AdminDeclineTriage) {
    return (
      <div data-screen-label="Admin Panel · Decline Triage">
        <AdminHeaderStrip adminData={adminData} />
        <AdminTabs tab={tab} setTab={(t) => { setTriage(null); setTab(t); }} canManageAdmins={!!adminData?.canManageAdmins} reviewCount={reviewCount} />
        <window.AdminDeclineTriage
          triage={triage}
          onClose={() => setTriage(null)}
          toast={toast}
        />
      </div>
    );
  }

  return (
    <div data-screen-label="Admin Panel">
      <AdminHeaderStrip adminData={adminData} />
      <AdminTabs tab={tab} setTab={setTab} canManageAdmins={!!adminData?.canManageAdmins} reviewCount={reviewCount} />
      {tab === "overview" && <AdminOverview toast={toast} invitesPendingCount={pendingCount} openTriage={openTriage} />}
      {tab === "calendar" && <AdminCalendarTab toast={toast} />}
      {tab === "invites"  && <AdminInvitesTab invites={invites} setInvites={setInvites} toast={toast} openTriage={openTriage} />}
      {tab === "review"   && window.AdminReviewTab && <window.AdminReviewTab items={reviewItems} toast={toast} />}
      {tab === "coaches"  && <AdminCoachesTab toast={toast} onJumpToCalendar={() => setTab("calendar")} />}
      {tab === "users"    && <AdminUsersTab adminData={adminData} toast={toast} />}
    </div>
  );
}

Object.assign(window, {
  ADMIN_USERS, isAdminUser, getAdminRecord, AdminPage,
});
