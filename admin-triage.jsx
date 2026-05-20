/* Admin Triage + Requires-Review surfaces
 * Loaded BEFORE admin.jsx in coach-universe.html.
 * Exposes:
 *   window.AdminReviewTab        — Requires Review tab content
 *   window.AdminDeclineTriage    — Decline triage page (Session at Risk + Option A / Option B)
 *   window.REVIEW_SEED           — sample SLA-missed log items
 *   window.adminMakeTriageInvite — helper to turn an Invites row into a triage object
 */

const { useState: useStateTri, useMemo: useMemoTri } = React;

// ───────── Shared atoms ─────────
function TriMono({ children, color = "var(--clay-600)", size = 10, dot, dotColor }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: dot ? 7 : 0,
      fontFamily: "var(--f-mono)", fontSize: size,
      letterSpacing: "1.8px", textTransform: "uppercase", color,
    }}>
      {dot && <span style={{ width: 6, height: 6, borderRadius: "50%", background: dotColor || color, flexShrink: 0 }} />}
      {children}
    </span>
  );
}

const triAvatar = (p) => {
  const Av = window.CoachAvatar;
  return Av ? <Av {...p} /> : (
    <div style={{
      width: p.size, height: p.size, borderRadius: "50%",
      background: "var(--walnut-700)", color: "var(--paper)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "var(--f-display)", fontStyle: "italic", fontSize: p.size * 0.4,
    }}>{p.coach?.initials || "?"}</div>
  );
};

function TriClientAv({ initials, size = 32 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: "var(--walnut-700)", color: "var(--paper)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "var(--f-display)", fontStyle: "italic", fontSize: size * 0.42, flexShrink: 0,
    }}>{initials}</div>
  );
}

// ───────── REVIEW SEED ─────────
const REVIEW_SEED = [
  {
    id: "rev-01",
    bucket: "today",
    client: { name: "Riya Sharma", initials: "RS" },
    coachId: "joe",
    slot: "TUE · 29 APR · 07:00 AM",
    resolvedAt: "Auto-resolved · 8:00 PM yesterday",
    outcome: "User notified to rebook. No response yet.",
  },
  {
    id: "rev-02",
    bucket: "week",
    client: { name: "Karthik N.", initials: "KN" },
    coachId: "lee",
    slot: "WED · 30 APR · 06:30 AM",
    resolvedAt: "Auto-resolved · 8:00 PM, 2 days ago",
    outcome: "Credit returned · user rebooked Thu 8 AM.",
  },
  {
    id: "rev-03",
    bucket: "week",
    client: { name: "Priya R.", initials: "PR" },
    coachId: "rahul",
    slot: "THU · 24 APR · 05:30 PM",
    resolvedAt: "Auto-resolved · 5 days ago",
    outcome: "Reassigned to Deb · session completed.",
  },
  {
    id: "rev-04",
    bucket: "week",
    client: { name: "Anita V.", initials: "AV" },
    coachId: "lee",
    slot: "TUE · 22 APR · 09:00 AM",
    resolvedAt: "Auto-resolved · 6 days ago",
    outcome: "User chose Coach Anisha · session completed.",
  },
];

// ───────── REQUIRES REVIEW TAB ─────────

function AdminReviewTab({ items, toast }) {
  const TRAINERS = window.TRAINERS || [];
  const coachById = (id) => TRAINERS.find(t => t.id === id) || { name: "—", initials: "?" };

  const [bucket, setBucket] = useStateTri("today");

  const data = items && items.length ? items : REVIEW_SEED;
  const buckets = {
    today: data.filter(d => d.bucket === "today"),
    week:  data.filter(d => d.bucket === "week"),
    older: data.filter(d => d.bucket === "older"),
  };
  const shown = buckets[bucket] || [];

  return (
    <div>
      <div className="mono" style={{
        color: "var(--clay-600)", marginBottom: 8,
        display: "inline-flex", alignItems: "center", gap: 8,
      }}>
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--ochre-500)" }} />
        POST-SLA LOG · AUTO-RESOLVED
      </div>
      <h2 className="serif" style={{
        fontSize: 44, margin: "0 0 12px", color: "var(--espresso-900)", fontStyle: "italic",
      }}>
        Sessions that slipped past their <em>SLA.</em>
      </h2>
      <p style={{
        fontFamily: "var(--f-body)", fontSize: 15, color: "var(--espresso-800)",
        lineHeight: 1.6, maxWidth: "64ch", margin: "0 0 28px",
      }}>
        These sit outside the active schedule. The system already resolved them — clients have been notified and credits returned where needed. Open one when you've got a quiet moment.
      </p>

      {/* Bucket strip */}
      <div style={{
        display: "flex", alignItems: "center", gap: 4,
        borderBottom: "1px solid var(--hairline)",
        marginBottom: 20,
      }}>
        {[
          { id: "today", lbl: "Past 24 hours", count: buckets.today.length },
          { id: "week",  lbl: "This week",     count: buckets.week.length },
          { id: "older", lbl: "Older",         count: 7 },
        ].map(t => {
          const active = bucket === t.id;
          return (
            <div key={t.id} onClick={() => setBucket(t.id)} className="mono" style={{
              padding: "10px 14px", position: "relative",
              fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase",
              color: active ? "var(--espresso-900)" : "var(--clay-600)",
              fontWeight: active ? 600 : 400,
              display: "inline-flex", alignItems: "center", gap: 6,
              cursor: "pointer",
            }}>
              {t.lbl}
              <span style={{
                fontSize: 8.5, padding: "1.5px 5.5px", borderRadius: 999,
                background: active ? "var(--ochre-500)" : "var(--sand-200)",
                color: active ? "var(--paper)" : "var(--clay-600)",
                letterSpacing: 0.5,
              }}>{t.count}</span>
              {active && <span style={{
                position: "absolute", left: 6, right: 6, bottom: -1,
                height: 2, background: "var(--ochre-500)",
              }} />}
            </div>
          );
        })}
        <div style={{ flex: 1 }} />
        <span className="mono" style={{ color: "var(--clay-500)", padding: "8px 12px" }}>
          Sorted: most recent
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {shown.length === 0 && (
          <div style={{
            padding: "40px 28px", textAlign: "center",
            background: "var(--sand-100)", border: "1px dashed var(--hairline-strong)",
            borderRadius: "var(--r-lg)",
            color: "var(--clay-600)",
          }}>
            <div className="serif" style={{ fontSize: 22, fontStyle: "italic", marginBottom: 6, color: "var(--espresso-900)" }}>
              All clear in this window.
            </div>
            <div style={{ fontSize: 13.5 }}>Nothing to review here yet.</div>
          </div>
        )}
        {shown.map(item => {
          const coach = coachById(item.coachId);
          return <ReviewCard key={item.id} item={item} coach={coach} onOpenHistory={() => toast && toast(`Opened ${item.client.name}'s session history`)} />;
        })}
      </div>
    </div>
  );
}

function ReviewCard({ item, coach, onOpenHistory }) {
  const [hov, setHov] = useStateTri(false);
  return (
    <div style={{
      background: "var(--sand-200)",
      border: "1px solid var(--hairline)",
      borderLeft: "4px solid var(--ochre-500)",
      borderRadius: "var(--r-lg)",
      padding: "20px 22px 22px",
    }}>
      {/* Status + resolved-at row */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        gap: 12, flexWrap: "wrap", marginBottom: 14,
      }}>
        <span className="mono" style={{
          display: "inline-flex", alignItems: "center", gap: 7,
          padding: "5px 11px", borderRadius: 999,
          background: "rgba(201,154,63,0.10)",
          border: "1px solid rgba(201,154,63,0.45)",
          fontSize: 9.5, letterSpacing: 1.8, color: "var(--ochre-500)", textTransform: "uppercase",
        }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--ochre-500)" }} />
          SLA MISSED
        </span>
        <span className="mono" style={{ color: "var(--clay-600)", fontSize: 9.5, letterSpacing: 1.8, textTransform: "uppercase" }}>
          {item.resolvedAt}
        </span>
      </div>

      {/* Party + slot */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 12, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <TriClientAv initials={item.client.initials} size={28} />
          <span style={{ fontFamily: "var(--f-body)", fontSize: 14, fontWeight: 600, color: "var(--espresso-900)" }}>
            {item.client.name}
          </span>
        </div>
        <span className="mono" style={{ color: "var(--clay-500)" }}>↛</span>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {triAvatar({ coach, size: 28 })}
          <span style={{ fontFamily: "var(--f-body)", fontSize: 14, fontWeight: 500, color: "var(--espresso-900)" }}>
            {coach.name}
          </span>
        </div>
        <span style={{ width: 1, height: 16, background: "var(--hairline-strong)", marginInline: 4 }} />
        <span className="mono" style={{
          fontSize: 11.5, letterSpacing: 0.8, color: "var(--espresso-800)", fontWeight: 500,
        }}>{item.slot}</span>
      </div>

      {/* Italic note */}
      <p className="serif" style={{
        fontStyle: "italic", fontSize: 17, lineHeight: 1.35,
        color: "var(--espresso-800)", margin: "0 0 18px",
        textWrap: "pretty", letterSpacing: "-0.2px",
      }}>
        “Client was auto-notified at 8:00 PM to select a new slot.”
      </p>

      {/* Outcome line */}
      <div style={{
        display: "flex", alignItems: "center", gap: 10, marginBottom: 16,
        paddingTop: 12, borderTop: "1px dashed var(--hairline)",
        flexWrap: "wrap",
      }}>
        <TriMono dot dotColor="var(--sage-500)" size={9.5}>Outcome</TriMono>
        <span style={{ fontFamily: "var(--f-body)", fontSize: 12.5, color: "var(--espresso-800)" }}>
          {item.outcome}
        </span>
      </div>

      {/* Ghost CTA */}
      <button
        onClick={onOpenHistory}
        onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
        style={{
          padding: "9px 18px", borderRadius: 999,
          border: "1.25px solid " + (hov ? "var(--walnut-700)" : "var(--hairline-strong)"),
          background: hov ? "var(--paper)" : "transparent",
          color: "var(--espresso-900)",
          fontFamily: "var(--f-body)", fontSize: 12.5, fontWeight: 500,
          cursor: "pointer", transition: "all .18s",
          display: "inline-flex", alignItems: "center", gap: 8,
        }}>
        View session history
        <span style={{ transform: hov ? "translateX(2px)" : "none", transition: "transform .2s" }}>→</span>
      </button>
    </div>
  );
}

// ───────── DECLINE TRIAGE PAGE ─────────

// Helper to materialize a triage object from an invites row or a flag
function adminMakeTriageInvite(opts = {}) {
  return {
    id: opts.id || "triage-" + Math.random().toString(36).slice(2, 7),
    client: opts.client || { name: "Riya Sharma", initials: "RS", tenure: "Member · 3 yrs" },
    coachId: opts.coachId || "joe",
    slot: opts.slot || { day: "TUE", date: "29 APR 2026", time: "07:00 AM", duration: 60, room: "Ground floor studio" },
    reason: opts.reason || "Pre-existing PT runs to 6:45 — no buffer to reset for a 7 AM.",
    submittedAt: opts.submittedAt || "Today, 9:14 AM",
    sla: opts.sla || { deadline: "RESOLVE BY 8:00 PM TONIGHT", remaining: "3H 22M LEFT" },
    availableCoachIds: opts.availableCoachIds || ["deb", "anisha"],
  };
}

function AdminDeclineTriage({ triage, onClose, toast }) {
  const TRAINERS = window.TRAINERS || [];
  const coachById = (id) => TRAINERS.find(t => t.id === id);
  const decliningCoach = coachById(triage.coachId) || { name: "Coach", initials: "?", role: "" };

  const [resolved, setResolved] = useStateTri(null); // 'reassigned-<coachId>' | 'notified' | null

  function doReassign(coach) {
    setResolved("reassigned-" + coach.id);
    toast && toast(`Assigned to ${coach.name} · client notified`);
    setTimeout(() => onClose && onClose(), 1400);
  }
  function doNotify() {
    setResolved("notified");
    toast && toast(`${triage.client.name} notified to pick a new slot`);
    setTimeout(() => onClose && onClose(), 1400);
  }

  const availableCoaches = (triage.availableCoachIds || [])
    .map(id => coachById(id))
    .filter(Boolean);

  return (
    <div>
      {/* Breadcrumb / back */}
      <div style={{
        display: "flex", alignItems: "center", gap: 12, marginBottom: 22,
        fontFamily: "var(--f-mono)", fontSize: 10, letterSpacing: 1.6,
        textTransform: "uppercase", color: "var(--clay-600)",
      }}>
        <span onClick={onClose} style={{ cursor: "pointer" }}>← Back to invites</span>
        <span style={{ width: 3, height: 3, borderRadius: "50%", background: "var(--clay-500)" }} />
        <span>Decline triage</span>
      </div>

      <div className="mono" style={{
        color: "var(--clay-600)", marginBottom: 8,
        display: "inline-flex", alignItems: "center", gap: 8,
      }}>
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--terracotta-500)" }} />
        COACH DECLINE · ACTION NEEDED
      </div>
      <h2 className="serif" style={{
        fontSize: 40, margin: "0 0 12px", color: "var(--espresso-900)",
        fontStyle: "italic", lineHeight: 1.05, letterSpacing: "-0.5px",
      }}>
        A session needs <em>reassignment.</em>
      </h2>
      <p style={{
        fontFamily: "var(--f-body)", fontSize: 14.5, color: "var(--espresso-800)",
        lineHeight: 1.55, maxWidth: "60ch", margin: "0 0 28px",
      }}>
        {decliningCoach.name.split(" ")[0]} declined this morning. Pick a path before the SLA closes — hand the slot to a free coach, or let {triage.client.name.split(" ")[0]} choose another time.
      </p>

      {/* SECTION 1 — Session at Risk Card */}
      <div style={{
        background: "var(--paper)",
        borderRadius: "var(--r-lg)",
        border: "1px solid var(--hairline-strong)",
        borderLeft: "4px solid var(--terracotta-500)",
        boxShadow: "var(--sh-2)",
        overflow: "hidden",
        marginBottom: 36,
      }}>
        {/* Top strip */}
        <div style={{
          padding: "14px 24px",
          background: "linear-gradient(90deg, rgba(184,107,75,0.06) 0%, rgba(184,107,75,0) 80%)",
          borderBottom: "1px solid var(--hairline)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          gap: 12, flexWrap: "wrap",
        }}>
          <span className="mono" style={{
            display: "inline-flex", alignItems: "center", gap: 7,
            padding: "5px 11px 5px 9px", borderRadius: 999,
            background: "rgba(184,107,75,0.10)",
            border: "1px solid rgba(184,107,75,0.32)",
            fontSize: 9.5, letterSpacing: 1.8, color: "var(--terracotta-500)", textTransform: "uppercase",
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--terracotta-500)" }} />
            Awaiting resolution
          </span>
          <div style={{ display: "inline-flex", alignItems: "baseline", gap: 10, fontFamily: "var(--f-mono)" }}>
            <span style={{ fontSize: 9.5, letterSpacing: 1.8, textTransform: "uppercase", color: "var(--clay-600)" }}>
              {triage.sla.deadline}
            </span>
            <span style={{ width: 1, height: 12, background: "var(--hairline-strong)", alignSelf: "center" }} />
            <span style={{ fontSize: 11, letterSpacing: 1.5, color: "var(--terracotta-500)", fontWeight: 500 }}>
              {triage.sla.remaining}
            </span>
          </div>
        </div>

        {/* Body */}
        <div style={{
          padding: "26px 28px 28px",
          display: "grid", gridTemplateColumns: "1.05fr 1px 1fr", gap: 28,
        }}>
          {/* Left: parties + slot */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <TriMono dot dotColor="var(--terracotta-500)">Flagged time slot</TriMono>
            <div style={{
              fontFamily: "var(--f-mono)", fontSize: 15, letterSpacing: 0.8,
              color: "var(--espresso-900)", fontWeight: 500,
            }}>
              {triage.slot.day} · {triage.slot.date} · {triage.slot.time}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <TriClientAv initials={triage.client.initials} size={40} />
                <div>
                  <div style={{ fontFamily: "var(--f-body)", fontSize: 15, fontWeight: 600, color: "var(--espresso-900)" }}>
                    {triage.client.name}
                  </div>
                  <div className="mono" style={{ fontSize: 9, letterSpacing: 1.4, color: "var(--clay-600)", marginTop: 2 }}>
                    {triage.client.tenure || "Member"}
                  </div>
                </div>
              </div>

              <span className="mono" style={{ fontSize: 14, color: "var(--terracotta-500)" }}>↛</span>

              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ position: "relative" }}>
                  {triAvatar({ coach: decliningCoach, size: 40 })}
                  <div style={{
                    position: "absolute", bottom: -2, right: -2,
                    width: 18, height: 18, borderRadius: "50%",
                    background: "var(--terracotta-500)", color: "var(--paper)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 11, fontWeight: 700,
                    border: "2px solid var(--paper)",
                    fontFamily: "var(--f-body)",
                  }}>×</div>
                </div>
                <div>
                  <div style={{
                    fontFamily: "var(--f-body)", fontSize: 15, fontWeight: 600,
                    color: "var(--espresso-900)", textDecoration: "line-through",
                    textDecorationColor: "rgba(62,44,28,0.4)", textDecorationThickness: 1,
                  }}>{decliningCoach.name}</div>
                  <div className="mono" style={{ fontSize: 9, letterSpacing: 1.4, color: "var(--terracotta-500)", marginTop: 2 }}>
                    Declined · {triage.submittedAt.replace("Today, ", "")}
                  </div>
                </div>
              </div>
            </div>

            <div style={{
              display: "inline-flex", alignItems: "center", gap: 10, flexWrap: "wrap",
              paddingTop: 6, borderTop: "1px solid var(--hairline)",
            }}>
              <span className="mono" style={{ fontSize: 9.5, letterSpacing: 1.6, color: "var(--clay-600)" }}>
                {triage.slot.duration} MIN
              </span>
              <span style={{ width: 3, height: 3, borderRadius: "50%", background: "var(--clay-500)" }} />
              <span className="mono" style={{ fontSize: 9.5, letterSpacing: 1.6, color: "var(--clay-600)" }}>
                {triage.slot.room}
              </span>
              <span style={{ width: 3, height: 3, borderRadius: "50%", background: "var(--clay-500)" }} />
              <span className="mono" style={{ fontSize: 9.5, letterSpacing: 1.6, color: "var(--clay-600)" }}>
                PT package · 11 left
              </span>
            </div>
          </div>

          <div style={{ width: 1, background: "var(--hairline)" }} />

          {/* Right: reason */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12, paddingTop: 2 }}>
            <TriMono dot dotColor="var(--walnut-700)">Stated reason</TriMono>
            <blockquote className="serif" style={{
              fontStyle: "italic", fontSize: 22, lineHeight: 1.25,
              color: "var(--espresso-900)", letterSpacing: "-0.4px",
              textWrap: "pretty", margin: 0,
            }}>
              “{triage.reason}”
            </blockquote>
            <div style={{
              fontFamily: "var(--f-body)", fontSize: 12.5, color: "var(--clay-600)",
              display: "inline-flex", alignItems: "center", gap: 8,
            }}>
              <span style={{ width: 18, height: 1, background: "var(--clay-500)" }} />
              {decliningCoach.name.split(" ")[0]}, submitted {triage.submittedAt}
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2 — Resolution Options */}
      <div style={{ marginBottom: 22, display: "flex", flexDirection: "column", gap: 8 }}>
        <TriMono dot dotColor="var(--walnut-700)">Resolution options · choose one path</TriMono>
        <h3 className="serif" style={{
          fontSize: 32, lineHeight: 1.05, letterSpacing: "-0.5px",
          color: "var(--espresso-900)", fontStyle: "italic", margin: 0,
        }}>
          Reassign internally, or send it<br />back to <em>her.</em>
        </h3>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.45fr 1fr", gap: 28, alignItems: "start" }}>
        {/* OPTION A */}
        <section>
          <OptionLabel letter="A" color="var(--walnut-700)" bg="var(--sand-100)" text="Reassign to another coach" />
          <h4 className="serif" style={{
            fontSize: 24, fontStyle: "italic", margin: "12px 0 6px",
            color: "var(--espresso-900)", lineHeight: 1.1,
          }}>
            Available coaches at this time slot.
          </h4>
          <p style={{
            fontFamily: "var(--f-body)", fontSize: 13.5, color: "var(--clay-600)",
            lineHeight: 1.55, margin: "0 0 18px", maxWidth: "52ch",
          }}>
            {availableCoaches.length > 0
              ? `${availableCoaches.length} coach${availableCoaches.length === 1 ? "" : "es"} free at this time. Assigning sends ${triage.client.name.split(" ")[0]} a confirmation and updates the coach calendar.`
              : "Coaches across the floor are all on calendar at this time."}
          </p>

          {availableCoaches.length === 0 ? (
            <div style={{
              padding: "22px 22px",
              background: "var(--sand-100)",
              border: "1px dashed var(--hairline-strong)",
              borderRadius: "var(--r-lg)",
            }}>
              <div className="serif" style={{ fontStyle: "italic", fontSize: 18, color: "var(--espresso-900)", marginBottom: 4 }}>
                No coaches available at this time.
              </div>
              <div style={{ fontFamily: "var(--f-body)", fontSize: 13, color: "var(--clay-600)", lineHeight: 1.55 }}>
                Use Option B — let the member rebook with the original coach on a different day.
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {availableCoaches.map(c => (
                <TriageCoachCard
                  key={c.id}
                  coach={c}
                  selected={resolved === "reassigned-" + c.id}
                  disabled={!!resolved}
                  onAssign={() => doReassign(c)}
                />
              ))}
            </div>
          )}
        </section>

        {/* Divider with OR */}
        <section style={{ position: "relative", paddingLeft: 12 }}>
          <div style={{
            position: "absolute", left: -16, top: 0, bottom: 0,
            width: 1, background: "var(--hairline)",
          }}>
            <div className="mono" style={{
              position: "absolute", top: 80, left: -14,
              width: 28, height: 28, borderRadius: "50%",
              background: "var(--sand-50)", border: "1px solid var(--hairline-strong)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 9, letterSpacing: 1.5, color: "var(--clay-600)",
            }}>OR</div>
          </div>

          {/* OPTION B */}
          <div style={{
            background: "var(--sand-100)",
            border: "1px solid var(--hairline)",
            borderRadius: "var(--r-xl)",
            padding: "22px 24px 26px",
            display: "flex", flexDirection: "column", gap: 12,
          }}>
            <OptionLabel letter="B" color="var(--clay-600)" bg="var(--paper)" text="Notify user to reschedule" />
            <h4 className="serif" style={{
              fontSize: 24, fontStyle: "italic", color: "var(--espresso-900)",
              lineHeight: 1.1, letterSpacing: "-0.3px", margin: "4px 0 0",
            }}>
              Let {triage.client.name.split(" ")[0]} pick another<br />time herself.
            </h4>
            <p style={{
              fontFamily: "var(--f-body)", fontSize: 13.5, color: "var(--espresso-800)",
              lineHeight: 1.6, margin: 0, textWrap: "pretty",
            }}>
              User will see available same-day slots with their original coach. We push the choice back rather than auto-shuffling.
            </p>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 8, margin: "4px 0 6px", padding: 0 }}>
              {[
                "Push + email within 2 minutes",
                `${decliningCoach.name.split(" ")[0]}'s name stays attached to the booking`,
                "Slot returns to the package if she skips",
              ].map((t, i) => (
                <li key={i} style={{
                  fontFamily: "var(--f-body)", fontSize: 12.5, color: "var(--espresso-800)",
                  display: "flex", alignItems: "baseline", gap: 10, lineHeight: 1.5,
                }}>
                  <span className="mono" style={{ fontSize: 9.5, color: "var(--clay-600)", letterSpacing: 1.5, minWidth: 16, flexShrink: 0 }}>
                    {`0${i + 1}`}
                  </span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>

            <NotifyButton resolved={resolved === "notified"} disabled={!!resolved} onClick={doNotify} />

            <div style={{
              marginTop: 4, paddingTop: 12,
              borderTop: "1px dashed var(--hairline)",
              fontFamily: "var(--f-body)", fontSize: 11.5, color: "var(--clay-600)",
              fontStyle: "italic", lineHeight: 1.5,
            }}>
              Coach availability will be re-shown automatically if no action by 8 PM.
            </div>
          </div>
        </section>
      </div>

      {/* Toast-like inline resolution banner */}
      {resolved && (
        <div style={{
          marginTop: 28, padding: "14px 18px",
          background: "var(--sage-200)", color: "var(--sage-500)",
          border: "1px solid rgba(123,139,111,0.4)",
          borderRadius: "var(--r-lg)",
          display: "inline-flex", alignItems: "center", gap: 12,
          fontFamily: "var(--f-body)", fontSize: 14, fontWeight: 500,
        }}>
          <span>✓</span>
          {resolved === "notified"
            ? `${triage.client.name} notified · slot reopened.`
            : `Assigned to ${(availableCoaches.find(c => "reassigned-" + c.id === resolved) || {}).name} · ${triage.client.name} will see the confirmation in their app.`}
        </div>
      )}

      <style>{`
        @media (max-width: 1100px) {
          [data-triage-grid="opts"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

function OptionLabel({ letter, color, bg, text }) {
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: 10,
      padding: "6px 12px", background: bg, borderRadius: 999,
      border: "1px solid var(--hairline)",
      width: "fit-content",
    }}>
      <span style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        width: 18, height: 18, borderRadius: "50%",
        background: color, color: "var(--paper)",
        fontFamily: "var(--f-mono)", fontSize: 9.5, fontWeight: 600,
      }}>{letter}</span>
      <span className="mono" style={{
        fontSize: 10, letterSpacing: 1.8, color: "var(--espresso-800)", textTransform: "uppercase",
      }}>{text}</span>
    </div>
  );
}

function TriageCoachCard({ coach, selected, disabled, onAssign }) {
  const [hov, setHov] = useStateTri(false);
  return (
    <div
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        background: "var(--paper)",
        borderRadius: "var(--r-lg)",
        border: "1px solid " + (selected ? "var(--sage-500)" : (hov ? "var(--hairline-strong)" : "var(--hairline)")),
        boxShadow: hov ? "var(--sh-2)" : "var(--sh-1)",
        padding: "18px 20px",
        display: "flex", alignItems: "stretch", gap: 16,
        transition: "all .2s",
        transform: hov && !disabled ? "translateY(-1px)" : "none",
        opacity: disabled && !selected ? 0.5 : 1,
      }}>
      {triAvatar({ coach, size: 48 })}
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 6 }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
          <div style={{ fontFamily: "var(--f-body)", fontSize: 16, fontWeight: 600, color: "var(--espresso-900)" }}>
            {coach.name}
          </div>
          <span className="mono" style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            fontSize: 9, letterSpacing: 1.4, color: "var(--sage-500)", textTransform: "uppercase",
          }}>
            <span style={{
              width: 12, height: 12, borderRadius: "50%", background: "var(--sage-500)",
              color: "var(--paper)", display: "inline-flex", alignItems: "center", justifyContent: "center",
              fontSize: 8, fontWeight: 700,
            }}>✓</span>
            Available
          </span>
        </div>
        <div style={{ fontFamily: "var(--f-body)", fontSize: 13.5, color: "var(--espresso-800)" }}>
          {coach.role || coach.specialty || "Coach"}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginTop: 2 }}>
          <span className="mono" style={{ fontSize: 9.5, letterSpacing: 1.4, color: "var(--clay-600)" }}>
            Free 6:00 – 8:30 AM
          </span>
          <span style={{ width: 3, height: 3, borderRadius: "50%", background: "var(--clay-500)" }} />
          <span className="mono" style={{ fontSize: 9.5, letterSpacing: 1.4, color: "var(--clay-600)" }}>
            {Math.floor(8 + Math.random() * 6)} PT this week
          </span>
        </div>
        <div style={{ marginTop: 12 }}>
          <button
            onClick={onAssign}
            disabled={disabled}
            style={{
              padding: "11px 22px", borderRadius: 999, border: "none",
              background: selected ? "var(--sage-500)" : (hov && !disabled ? "var(--espresso-800)" : "var(--terracotta-500)"),
              color: "var(--paper)",
              fontFamily: "var(--f-body)", fontSize: 13.5, fontWeight: 600,
              cursor: disabled ? "default" : "pointer",
              transition: "all .18s",
              display: "inline-flex", alignItems: "center", gap: 8,
            }}>
            {selected ? "✓ Assigned" : `Assign to ${coach.name.split(" ")[0]}`}
            {!selected && <span style={{ transform: hov ? "translateX(3px)" : "none", transition: "transform .2s" }}>→</span>}
          </button>
        </div>
      </div>
    </div>
  );
}

function NotifyButton({ resolved, disabled, onClick }) {
  const [hov, setHov] = useStateTri(false);
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        padding: "11px 22px", borderRadius: 999,
        border: "1.25px solid " + (resolved ? "var(--sage-500)" : (hov && !disabled ? "var(--walnut-700)" : "var(--hairline-strong)")),
        background: resolved ? "var(--sage-200)" : (hov && !disabled ? "var(--paper)" : "transparent"),
        color: resolved ? "var(--sage-500)" : "var(--espresso-900)",
        fontFamily: "var(--f-body)", fontSize: 13.5, fontWeight: 500,
        cursor: disabled ? "default" : "pointer",
        transition: "all .18s",
        width: "100%",
        display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
        opacity: disabled && !resolved ? 0.55 : 1,
      }}>
      {resolved ? "✓ Notification sent" : "Notify user to pick a new slot →"}
    </button>
  );
}

// ───── Export to window ─────
Object.assign(window, {
  AdminReviewTab,
  AdminDeclineTriage,
  REVIEW_SEED,
  adminMakeTriageInvite,
});
