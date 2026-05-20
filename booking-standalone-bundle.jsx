// Booking flow — Calendly-style: pick by trainer availability OR by any trainer slot
// Now supports SINGLE or BULK (multi-day) booking with package discounts.
const { useState: useBS, useMemo: useBM, useEffect: useBE } = React;

// Per-session price (INR)
const SESSION_PRICE = 2400;

// ─── Booking policy: simulated "now" for prototype demo ─────────────────
// Real implementation would use new Date(). We pin to the data's reference
// today (BOOKING_DAYS[0] = Apr 17 2026) at 21:00 so the 8pm cut-off rule is
// visible in the prototype.
const NOW = new Date(2026, 3, 17, 21, 0);
const CUTOFF_HOUR = 20; // 8pm
function isAfterCutoff() { return NOW.getHours() >= CUTOFF_HOUR; }
function isSameDay(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}
function isTomorrow(date) {
  const t = new Date(NOW); t.setDate(NOW.getDate() + 1);
  return isSameDay(date, t);
}
function isSunday(date) { return date.getDay() === 0; }
// A day's PT slots are unbookable if: it's Sunday, OR it's tomorrow and we're past cutoff.
function isDayLocked(date) {
  if (isSunday(date)) return "sunday";
  if (isTomorrow(date) && isAfterCutoff()) return "cutoff";
  return null;
}

// Duration packages — user picks one explicitly (NOT span-derived).
// Each maps to a number of weeks the schedule will cover.
const DURATIONS = [
  { id: "twoweek", weeks: 2, days: 14, pct: 5,  label: "2 weeks",  sub: "5% off"  },
  { id: "month",   weeks: 4, days: 28, pct: 10, label: "1 month",  sub: "10% off" },
  { id: "twomo",   weeks: 8, days: 56, pct: 15, label: "2 months", sub: "15% off" },
];
const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const WEEKDAY_SHORT  = ["S", "M", "T", "W", "T", "F", "S"];

// Given chosen weekday-of-week numbers (Set of 0-6) + a duration in days,
// return the indices into BOOKING_DAYS that fall on those weekdays within [day0, day0+durationDays).
function expandSchedule(weekdaySet, durationDays) {
  const out = [];
  for (let i = 0; i < Math.min(durationDays, BOOKING_DAYS.length); i++) {
    if (weekdaySet.has(BOOKING_DAYS[i].date.getDay())) out.push(i);
  }
  return out;
}

function Booking({ initialMode = "time", user = null, onSignIn = null }) {
  const [mode, setMode] = useBS(initialMode);             // "time" or "trainer"
  const [bookingType, setBookingType] = useBS("single");  // "single" or "bulk"
  const [step, setStep] = useBS(1);
  const [selection, setSelection] = useBS(null);
  const [auth, setAuth] = useBS({ method: null, value: "", reminders: ["email", "sms"] });
  const [banner, setBanner] = useBS(null); // { method, value } | null

  // Auto-dismiss the confirm banner after 6s
  useBE(() => {
    if (!banner) return;
    const t = setTimeout(() => setBanner(null), 6000);
    return () => clearTimeout(t);
  }, [banner]);

  const confirmBooking = () => {
    setStep(3); // → payment
  };

  const payAndComplete = () => {
    setBanner({ method: auth.method, value: auth.value });
    setStep(4); // → success
  };

  const reset = () => {
    setStep(1); setSelection(null);
    setAuth({ method: null, value: "", reminders: ["email", "sms"] });
  };

  return (
    <section id="book" style={{ background: "var(--sand-50)", padding: "120px 0 140px" }}>
      <div style={{ maxWidth: 1240, margin: "0 auto", padding: "0 32px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 40, alignItems: "end", marginBottom: 16 }}>
          <EyebrowTitle
            eyebrow="Book a session"
            title={<>Reserve your hour.</>}
            lead="One session, a week, or a full two-month block. Pick a coach or a time — the package discount kicks in automatically as you commit further out."
          />
          <div style={{ fontFamily: "var(--f-mono)", fontSize: 11, letterSpacing: 2, color: "var(--clay-600)", textTransform: "uppercase" }}>
            Step {step} / 4
          </div>
        </div>
        <div style={{
          fontFamily: "var(--f-body)", fontSize: 13, lineHeight: 1.5,
          color: "var(--clay-600)", marginBottom: 32, maxWidth: 640,
          paddingLeft: 14, borderLeft: "2px solid var(--hairline-strong)",
        }}>
          PT sessions can be booked until 8pm the evening before.
          Sundays are group classes only &mdash; no PT on Sundays.
        </div>

        <BookingStepper step={step} />

        {step === 1 && (
          <BookingPick
            mode={mode} setMode={setMode}
            bookingType={bookingType} setBookingType={setBookingType}
            onConfirm={(sel) => { setSelection(sel); setStep(2); }}
          />
        )}
        {step === 2 && (
          <BookingLogin
            user={user} onSignIn={onSignIn}
            selection={selection}
            auth={auth} setAuth={setAuth}
            onBack={() => setStep(1)}
            onConfirm={confirmBooking}
          />
        )}
        {step === 3 && (
          <BookingPayment
            selection={selection} auth={auth}
            onBack={() => setStep(2)}
            onPay={payAndComplete}
          />
        )}
        {step === 4 && (
          <BookingSuccess selection={selection} auth={auth} onReset={reset} />
        )}
      </div>

      {banner && <ConfirmBanner method={banner.method} value={banner.value} onClose={() => setBanner(null)} />}
    </section>
  );
}

function BookingPick({ mode, setMode, bookingType, setBookingType, onConfirm }) {
  const PT = window.PT_TRAINERS || TRAINERS;
  const [trainerId, setTrainerId] = useBS(PT[0].id);

  // Single-mode state
  const [dayIdx, setDayIdx] = useBS(0);
  const [selected, setSelected] = useBS(null); // {time, trainerId}
  const [weekOffset, setWeekOffset] = useBS(0);

  // Bulk-mode state — NEW model: cadence + duration drive the schedule, not free-form dates.
  const [daysPerWeek, setDaysPerWeek]   = useBS(3);                  // 2 / 3 / 4 / 5
  const [weekdays, setWeekdays]         = useBS(new Set([1, 3, 5])); // weekday-of-week numbers, 0=Sun..6=Sat
  const [durationId, setDurationId]     = useBS("twoweek");          // 2wk / 1mo / 2mo
  const [bulkTimes, setBulkTimes]       = useBS([]);                 // "HH:MM" strings — applied to every chosen weekday

  // ─── SINGLE mode views ────────────────────────────────────────────────
  const day = BOOKING_DAYS[dayIdx];
  const filteredSlots = useBM(() => {
    if (mode === "trainer") return day.slots.filter((s) => s.trainerId === trainerId);
    const map = {};
    day.slots.forEach((s) => { (map[s.time] = map[s.time] || []).push(s.trainerId); });
    return Object.entries(map).map(([time, ids]) => ({ time, ids }));
  }, [mode, trainerId, dayIdx]);

  const duration = DURATIONS.find(d => d.id === durationId) || DURATIONS[0];
  const scheduledDayIdxs = useBM(() => expandSchedule(weekdays, duration.days), [weekdays, duration.days]);

  // ─── BULK aggregation under the new model ─────────────────────────────
  // For each scheduled day, count how many of the picked time slots have an available trainer.
  const bulkSummary = useBM(() => {
    if (scheduledDayIdxs.length === 0 || bulkTimes.length === 0) {
      return { sessions: 0, perDay: [], misses: 0 };
    }
    let sessions = 0, misses = 0;
    const perDay = scheduledDayIdxs.map((idx) => {
      const d = BOOKING_DAYS[idx];
      const hits = bulkTimes.map((t) => {
        const slotMatch = d.slots.find((s) => s.time === t && (mode === "time" || s.trainerId === trainerId));
        if (slotMatch) sessions += 1; else misses += 1;
        return { time: t, ok: !!slotMatch, trainerId: slotMatch?.trainerId };
      });
      return { idx, day: d, hits };
    });
    return { sessions, perDay, misses };
  }, [scheduledDayIdxs, bulkTimes, trainerId, mode]);

  // Times rail: union of all times that appear in BOOKING_DAYS (deterministic order)
  const ALL_TIMES = useBM(() => {
    const set = new Set();
    BOOKING_DAYS.forEach((d) => d.slots.forEach((s) => set.add(s.time)));
    return [...set].sort();
  }, []);

  const isBulk = bookingType === "bulk";

  return (
    <div style={{ display: "grid", gridTemplateColumns: "380px 1fr", gap: 24 }}>
      {/* ─── LEFT: mode + booking type + trainer ─── */}
      <Card tone="paper" style={{ padding: 32 }}>
        <div style={{ fontFamily: "var(--f-mono)", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "var(--clay-600)", marginBottom: 16 }}>
          01 · How would you like to book?
        </div>
        <div style={{ display: "flex", gap: 4, background: "var(--sand-100)", padding: 4, borderRadius: "var(--r-pill)", border: "1px solid var(--hairline)" }}>
          {[
            { id: "trainer", label: "By trainer", icon: "user" },
            { id: "time", label: "By time", icon: "clock" },
          ].map((m) => (
            <button key={m.id}
              onClick={() => { setMode(m.id); setSelected(null); }}
              style={pillBtn(mode === m.id)}>
              <Icon name={m.icon} size={14} /> {m.label}
            </button>
          ))}
        </div>

        {/* Single vs Bulk */}
        <div style={{ marginTop: 24, fontFamily: "var(--f-mono)", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "var(--clay-600)", marginBottom: 12 }}>
          02 · Single or recurring?
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {[
            { id: "single", label: "Single session", sub: "One day, one slot" },
            { id: "bulk",   label: "Multi-day plan", sub: "Bulk discount up to 15%" },
          ].map((b) => {
            const on = bookingType === b.id;
            return (
              <button key={b.id} onClick={() => setBookingType(b.id)} style={{
                padding: 14, borderRadius: "var(--r-md)",
                border: `1.5px solid ${on ? "var(--walnut-700)" : "var(--hairline)"}`,
                background: on ? "var(--sand-100)" : "var(--paper)",
                cursor: "pointer", textAlign: "left", transition: "all .15s",
              }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--espresso-900)" }}>{b.label}</div>
                <div style={{ fontFamily: "var(--f-mono)", fontSize: 9.5, letterSpacing: 1, color: "var(--clay-600)", marginTop: 4, textTransform: "uppercase" }}>{b.sub}</div>
              </button>
            );
          })}
        </div>

        <div style={{ marginTop: 24, fontFamily: "var(--f-mono)", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "var(--clay-600)", marginBottom: 14 }}>
          {mode === "trainer" ? "03 · Pick your coach" : "03 · Pick a focus (optional)"}
        </div>

        {mode === "trainer" ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {PT.map((t) => (
              <button key={t.id}
                onClick={() => { setTrainerId(t.id); setSelected(null); }}
                style={{
                  display: "flex", alignItems: "center", gap: 14,
                  padding: 14, borderRadius: "var(--r-md)",
                  border: `1px solid ${trainerId === t.id ? "var(--walnut-700)" : "var(--hairline)"}`,
                  background: trainerId === t.id ? "var(--sand-100)" : "var(--paper)",
                  cursor: "pointer", textAlign: "left", transition: "all .2s",
                }}>
                <TrainerAvatar t={t} size={42} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "var(--espresso-900)" }}>{t.name}</div>
                  <div style={{ fontFamily: "var(--f-mono)", fontSize: 10, letterSpacing: 1, color: "var(--clay-600)", marginTop: 2, textTransform: "uppercase" }}>{t.role}</div>
                </div>
                {trainerId === t.id && <Icon name="check" size={16} color="var(--walnut-700)" />}
              </button>
            ))}
          </div>
        ) : (
          <div>
            <p style={{ fontSize: 13, lineHeight: 1.6, color: "var(--espresso-800)", opacity: 0.75, margin: 0 }}>
              Any trainer who has this slot open will be offered. You'll see all available coaches at that time — pick whoever resonates.
            </p>
            <div style={{ marginTop: 20, display: "flex", flexWrap: "wrap", gap: 6 }}>
              {["Strength", "Mobility", "Recovery", "Yoga", "Cardio", "Assessment"].map((g) => (
                <Chip key={g} tone="sand">{g}</Chip>
              ))}
            </div>
          </div>
        )}

        {/* Bulk pricing preview */}
        {isBulk && (
          <BulkPricingCard
            sessions={bulkSummary.sessions}
            duration={duration}
            scheduledDays={scheduledDayIdxs.length}
            timesCount={bulkTimes.length}
          />
        )}
      </Card>

      {/* ─── RIGHT: day + slots ─── */}
      <Card tone="paper" style={{ padding: 32 }}>
        {!isBulk ? (
          <SingleDaySlots
            mode={mode} trainerId={trainerId}
            dayIdx={dayIdx} setDayIdx={(i) => { setDayIdx(i); setSelected(null); }}
            selected={selected} setSelected={setSelected}
            day={day} filteredSlots={filteredSlots}
            onConfirm={onConfirm}
            weekOffset={weekOffset} setWeekOffset={setWeekOffset}
          />
        ) : (
          <BulkPicker
            mode={mode} trainerId={trainerId}
            daysPerWeek={daysPerWeek} setDaysPerWeek={setDaysPerWeek}
            weekdays={weekdays} setWeekdays={setWeekdays}
            durationId={durationId} setDurationId={setDurationId}
            duration={duration}
            bulkTimes={bulkTimes} setBulkTimes={setBulkTimes}
            allTimes={ALL_TIMES}
            scheduledDayIdxs={scheduledDayIdxs}
            summary={bulkSummary}
            onConfirm={() => onConfirm({
              type: "bulk",
              trainer: TRAINERS.find(t => t.id === trainerId),
              mode,
              daysPerWeek,
              weekdays: [...weekdays],
              duration,
              days: scheduledDayIdxs.map(i => BOOKING_DAYS[i]),
              times: bulkTimes,
              sessions: bulkSummary.sessions,
              tier: duration,
              perDay: bulkSummary.perDay,
            })}
          />
        )}
      </Card>
    </div>
  );
}

// ─── Single-day slot picker (existing flow, lightly cleaned) ───────────────
function SingleDaySlots({ mode, trainerId, dayIdx, setDayIdx, selected, setSelected, day, filteredSlots, onConfirm, weekOffset, setWeekOffset }) {
  const WEEK = 7;
  const visibleStart = weekOffset * WEEK;
  const visibleDays = BOOKING_DAYS.slice(visibleStart, visibleStart + WEEK);

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div style={{ fontFamily: "var(--f-mono)", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "var(--clay-600)" }}>
          04 · Choose a day
        </div>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <button onClick={() => setWeekOffset(Math.max(0, weekOffset - 1))} disabled={weekOffset === 0} style={navBtn(weekOffset === 0)}>←</button>
          <div style={{ fontFamily: "var(--f-mono)", fontSize: 10, letterSpacing: 1.5, color: "var(--clay-600)", minWidth: 80, textAlign: "center" }}>
            Week {weekOffset + 1} / {Math.ceil(BOOKING_DAYS.length / WEEK)}
          </div>
          <button onClick={() => setWeekOffset(Math.min(Math.ceil(BOOKING_DAYS.length / WEEK) - 1, weekOffset + 1))} disabled={visibleStart + WEEK >= BOOKING_DAYS.length} style={navBtn(visibleStart + WEEK >= BOOKING_DAYS.length)}>→</button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6, marginBottom: 28 }}>
        {visibleDays.map((d, i) => {
          const realIdx = visibleStart + i;
          const isActive = realIdx === dayIdx;
          const lock = isDayLocked(d.date);
          const tomorrowCutoff = lock === "cutoff";
          return (
            <div key={d.iso} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <button onClick={() => setDayIdx(realIdx)}
                style={{
                  padding: "12px 6px", borderRadius: "var(--r-md)",
                  border: `1px solid ${isActive ? "var(--walnut-700)" : "var(--hairline)"}`,
                  background: isActive ? "var(--walnut-700)" : "var(--paper)",
                  color: isActive ? "var(--paper)" : "var(--espresso-900)",
                  cursor: "pointer", textAlign: "center", transition: "all .2s",
                  position: "relative",
                }}>
                <div style={{ fontFamily: "var(--f-mono)", fontSize: 9, letterSpacing: 1, opacity: 0.7, textTransform: "uppercase" }}>{d.label}</div>
                <div style={{ fontFamily: "var(--f-display)", fontSize: 22, marginTop: 2, lineHeight: 1 }}>{d.day}</div>
                <div style={{ fontFamily: "var(--f-mono)", fontSize: 9, opacity: 0.7, marginTop: 2, textTransform: "uppercase" }}>{d.month}</div>
                {lock && (
                  <div style={{
                    position: "absolute", top: 6, right: 6,
                    width: 6, height: 6, borderRadius: "50%",
                    background: lock === "sunday" ? "var(--terracotta-500)" : "var(--ochre-500)",
                  }} />
                )}
              </button>
              {tomorrowCutoff && (
                <div style={{
                  fontFamily: "var(--f-mono)", fontSize: 8.5, letterSpacing: 1, lineHeight: 1.35,
                  color: "var(--clay-600)", textAlign: "center", textTransform: "uppercase",
                }}>
                  Booking closed<br/>Cut-off was 8pm
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ fontFamily: "var(--f-mono)", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "var(--clay-600)", marginBottom: 14 }}>
        05 · Available slots — {day.date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
      </div>

      {(() => { const lock = isDayLocked(day.date); return lock === "sunday" ? (
        <div style={{
          padding: "48px 24px", borderRadius: "var(--r-md)",
          background: "var(--sand-200)", border: "1px solid var(--hairline)",
          textAlign: "center",
        }}>
          <div style={{
            fontFamily: "var(--f-mono)", fontSize: 13, letterSpacing: 2,
            textTransform: "uppercase", color: "var(--clay-600)", fontWeight: 600,
          }}>No PT Sundays</div>
          <div style={{
            fontFamily: "var(--f-body)", fontSize: 13, fontStyle: "italic",
            color: "var(--clay-600)", marginTop: 10, lineHeight: 1.55,
          }}>Group classes only — see schedule</div>
        </div>
      ) : null; })()}

      {isDayLocked(day.date) !== "sunday" && (mode === "trainer" ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
          {filteredSlots.length === 0 && <EmptyState trainer={TRAINERS.find(t => t.id === trainerId)} />}
          {filteredSlots.map((s, i) => {
            const isSel = selected && selected.time === s.time && selected.trainerId === s.trainerId;
            const disabled = isDayLocked(day.date) === "cutoff";
            return (
              <button key={i}
                onClick={disabled ? undefined : () => setSelected({ time: s.time, trainerId: s.trainerId })}
                disabled={disabled}
                style={disabled ? disabledSlotBtn() : slotBtn(isSel)}>
                <div style={{ fontFamily: "var(--f-display)", fontSize: 20, lineHeight: 1 }}>{s.time}</div>
                <div style={{ fontFamily: "var(--f-mono)", fontSize: 9, marginTop: 4, opacity: 0.7, textTransform: "uppercase" }}>60 min</div>
              </button>
            );
          })}
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8 }}>
          {filteredSlots.length === 0 && <div style={{ padding: 24, color: "var(--clay-600)" }}>No slots this day.</div>}
          {filteredSlots.map((row) => {
            const isSelRow = selected && selected.time === row.time;
            const disabled = isDayLocked(day.date) === "cutoff";
            return (
              <div key={row.time} style={{
                padding: 14, borderRadius: "var(--r-md)",
                border: `1px solid ${isSelRow ? "var(--walnut-700)" : "var(--hairline)"}`,
                background: disabled ? "var(--sand-200)" : "var(--paper)",
                opacity: disabled ? 0.55 : 1,
                pointerEvents: disabled ? "none" : "auto",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ fontFamily: "var(--f-display)", fontSize: 22, color: "var(--espresso-900)" }}>{row.time}</div>
                  <div style={{ fontFamily: "var(--f-mono)", fontSize: 10, color: "var(--clay-600)", letterSpacing: 1 }}>{row.ids.length} OPEN</div>
                </div>
                <div style={{ display: "flex", gap: 6, marginTop: 10, flexWrap: "wrap" }}>
                  {row.ids.map((id) => {
                    const t = TRAINERS.find(x => x.id === id);
                    const pick = selected && selected.time === row.time && selected.trainerId === id;
                    return (
                      <button key={id} onClick={() => setSelected({ time: row.time, trainerId: id })}
                        style={{
                          display: "inline-flex", alignItems: "center", gap: 6,
                          padding: "6px 10px", borderRadius: "var(--r-pill)",
                          border: `1px solid ${pick ? "var(--walnut-700)" : "var(--hairline)"}`,
                          background: pick ? "var(--walnut-700)" : "var(--sand-50)",
                          color: pick ? "var(--paper)" : "var(--espresso-900)",
                          cursor: "pointer", fontSize: 12, fontFamily: "var(--f-body)",
                          transition: "all .15s",
                        }}>
                        <TrainerAvatar t={t} size={18} />
                        {t.name.split(" ")[0]}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      ))}

      {selected && (
        <div style={{
          marginTop: 28, padding: 20, borderRadius: "var(--r-md)",
          background: "var(--sand-100)", border: "1px solid var(--hairline)",
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <TrainerAvatar t={TRAINERS.find(t => t.id === selected.trainerId)} size={40} />
            <div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{TRAINERS.find(t => t.id === selected.trainerId).name}</div>
              <div style={{ fontFamily: "var(--f-mono)", fontSize: 11, color: "var(--clay-600)", marginTop: 2 }}>
                {day.date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })} · {selected.time} · 60 min
              </div>
            </div>
          </div>
          <Btn onClick={() => onConfirm({ type: "single", trainer: TRAINERS.find(t => t.id === selected.trainerId), day, time: selected.time })} icon={<Icon name="arrow" size={14} />}>
            Continue
          </Btn>
        </div>
      )}
    </>
  );
}

// ─── Bulk picker: multi-day grid + multi-time grid + summary ───────────────
function BulkPicker({ mode, trainerId, daysPerWeek, setDaysPerWeek, weekdays, setWeekdays, durationId, setDurationId, duration, bulkTimes, setBulkTimes, allTimes, scheduledDayIdxs, summary, onConfirm }) {
  const toggleWeekday = (n) => {
    const next = new Set(weekdays);
    if (next.has(n)) next.delete(n); else {
      if (next.size >= daysPerWeek) {
        // Drop the earliest-added (smallest weekday) to keep cap.
        const first = [...next].sort()[0];
        next.delete(first);
      }
      next.add(n);
    }
    setWeekdays(next);
  };
  const toggleTime = (t) => {
    setBulkTimes(bulkTimes.includes(t) ? bulkTimes.filter(x => x !== t) : [...bulkTimes, t]);
  };
  const handleCadence = (n) => {
    setDaysPerWeek(n);
    // Trim weekdays down if user reduced cadence
    if (weekdays.size > n) {
      const trimmed = new Set([...weekdays].sort().slice(0, n));
      setWeekdays(trimmed);
    }
  };
  const ready = weekdays.size === daysPerWeek && bulkTimes.length > 0 && summary.sessions > 0;
  const cadenceComplete = weekdays.size === daysPerWeek;

  return (
    <>
      {/* 04 · Days per week */}
      <div style={{ fontFamily: "var(--f-mono)", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "var(--clay-600)", marginBottom: 12 }}>
        04 · How many days per week?
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6, marginBottom: 22 }}>
        {[2, 3, 4, 5].map((n) => {
          const on = daysPerWeek === n;
          return (
            <button key={n} onClick={() => handleCadence(n)} style={{
              padding: "12px 8px", borderRadius: "var(--r-md)",
              border: `1.5px solid ${on ? "var(--walnut-700)" : "var(--hairline)"}`,
              background: on ? "var(--walnut-700)" : "var(--paper)",
              color: on ? "var(--paper)" : "var(--espresso-900)",
              cursor: "pointer", textAlign: "center", transition: "all .15s",
            }}>
              <div style={{ fontFamily: "var(--f-display)", fontSize: 22, lineHeight: 1 }}>{n}</div>
              <div style={{ fontFamily: "var(--f-mono)", fontSize: 9, marginTop: 4, opacity: 0.7, textTransform: "uppercase" }}>days / wk</div>
            </button>
          );
        })}
      </div>

      {/* 05 · Which weekdays */}
      <div style={{ fontFamily: "var(--f-mono)", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "var(--clay-600)", marginBottom: 12 }}>
        05 · Which days?
        <span style={{ color: cadenceComplete ? "var(--sage-500)" : "var(--walnut-700)", marginLeft: 8 }}>
          {weekdays.size} / {daysPerWeek} picked
        </span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6, marginBottom: 22 }}>
        {WEEKDAY_LABELS.map((lbl, n) => {
          const on = weekdays.has(n);
          return (
            <button key={n} onClick={() => toggleWeekday(n)} style={{
              padding: "14px 6px", borderRadius: "var(--r-md)",
              border: `1.5px solid ${on ? "var(--walnut-700)" : "var(--hairline)"}`,
              background: on ? "var(--walnut-700)" : "var(--paper)",
              color: on ? "var(--paper)" : "var(--espresso-900)",
              cursor: "pointer", textAlign: "center", transition: "all .15s",
            }}>
              <div style={{ fontFamily: "var(--f-display)", fontSize: 18, lineHeight: 1 }}>{lbl}</div>
            </button>
          );
        })}
      </div>

      {/* 06 · Duration */}
      <div style={{ fontFamily: "var(--f-mono)", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "var(--clay-600)", marginBottom: 12 }}>
        06 · Duration
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 22 }}>
        {DURATIONS.map((d) => {
          const on = durationId === d.id;
          return (
            <button key={d.id} onClick={() => setDurationId(d.id)} style={{
              padding: 14, borderRadius: "var(--r-md)", textAlign: "left",
              border: `1.5px solid ${on ? "var(--walnut-700)" : "var(--hairline)"}`,
              background: on ? "var(--sand-100)" : "var(--paper)",
              cursor: "pointer", transition: "all .15s",
            }}>
              <div style={{ fontFamily: "var(--f-display)", fontSize: 20, color: "var(--espresso-900)", lineHeight: 1 }}>{d.label}</div>
              <div style={{ fontFamily: "var(--f-mono)", fontSize: 10, color: on ? "var(--walnut-700)" : "var(--clay-600)", marginTop: 6, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>{d.sub}</div>
            </button>
          );
        })}
      </div>

      {/* 07 · Time slots */}
      <div style={{ fontFamily: "var(--f-mono)", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "var(--clay-600)", marginBottom: 12 }}>
        07 · Pick time slots <span style={{ color: "var(--walnut-700)", marginLeft: 8 }}>{bulkTimes.length} selected</span>
        <div style={{ marginTop: 4, fontFamily: "var(--f-body)", fontSize: 12, fontWeight: 400, textTransform: "none", letterSpacing: 0, color: "var(--clay-600)" }}>
          Applied to every chosen weekday across the {duration.label.toLowerCase()}.
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6, marginBottom: 20 }}>
        {allTimes.map((t) => {
          const on = bulkTimes.includes(t);
          return (
            <button key={t} onClick={() => toggleTime(t)} style={slotBtn(on)}>
              <div style={{ fontFamily: "var(--f-display)", fontSize: 18, lineHeight: 1 }}>{t}</div>
              <div style={{ fontFamily: "var(--f-mono)", fontSize: 9, marginTop: 4, opacity: 0.7, textTransform: "uppercase" }}>60 min</div>
            </button>
          );
        })}
      </div>

      {/* Schedule preview */}
      {scheduledDayIdxs.length > 0 && bulkTimes.length > 0 && (
        <div style={{
          marginTop: 8, padding: 14, borderRadius: "var(--r-md)",
          background: "var(--sand-50)", border: "1px solid var(--hairline)",
          maxHeight: 200, overflowY: "auto",
        }}>
          <div style={{ fontFamily: "var(--f-mono)", fontSize: 9.5, letterSpacing: 1.5, textTransform: "uppercase", color: "var(--clay-600)", marginBottom: 10 }}>
            Schedule preview · {summary.sessions} session{summary.sessions === 1 ? "" : "s"}{summary.misses > 0 ? ` · ${summary.misses} unavailable` : ""}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {summary.perDay.slice(0, 16).map((row) => (
              <div key={row.idx} style={{ display: "grid", gridTemplateColumns: "150px 1fr", gap: 12, alignItems: "center", fontSize: 12 }}>
                <div style={{ fontFamily: "var(--f-mono)", fontSize: 10.5, letterSpacing: 1, color: "var(--espresso-900)" }}>
                  {row.day.date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                  {row.hits.map((h) => (
                    <span key={h.time} style={{
                      padding: "3px 8px", borderRadius: 999,
                      background: h.ok ? "var(--walnut-700)" : "transparent",
                      color: h.ok ? "var(--paper)" : "var(--clay-600)",
                      border: h.ok ? "none" : "1px dashed var(--hairline-strong)",
                      fontFamily: "var(--f-mono)", fontSize: 10.5, letterSpacing: 0.5,
                      textDecoration: h.ok ? "none" : "line-through",
                    }}>{h.time}</span>
                  ))}
                </div>
              </div>
            ))}
            {summary.perDay.length > 16 && (
              <div style={{ fontFamily: "var(--f-mono)", fontSize: 10, color: "var(--clay-600)", letterSpacing: 1, textAlign: "center", paddingTop: 6 }}>
                +{summary.perDay.length - 16} more
              </div>
            )}
          </div>
        </div>
      )}

      {/* Continue */}
      <div style={{
        marginTop: 24, padding: 20, borderRadius: "var(--r-md)",
        background: "var(--sand-100)", border: "1px solid var(--hairline)",
        display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16,
      }}>
        <div>
          <div style={{ fontFamily: "var(--f-mono)", fontSize: 9.5, letterSpacing: 1.5, color: "var(--clay-600)", textTransform: "uppercase" }}>
            {ready ? `${duration.label} · ${duration.pct}% off` : "Complete cadence, duration, and times to continue"}
          </div>
          <div style={{ fontFamily: "var(--f-display)", fontSize: 22, color: "var(--espresso-900)", marginTop: 4 }}>
            {ready ? `${summary.sessions} sessions · ${formatINR(calcTotal(summary.sessions, duration.pct))}` : "—"}
          </div>
        </div>
        <Btn disabled={!ready} onClick={onConfirm} icon={<Icon name="arrow" size={14} />}>Continue</Btn>
      </div>
    </>
  );
}

function BulkPricingCard({ sessions, duration, scheduledDays, timesCount }) {
  const subtotal = sessions * SESSION_PRICE;
  const discount = Math.round(subtotal * duration.pct / 100);
  const total = subtotal - discount;
  return (
    <div style={{
      marginTop: 24, padding: 16, borderRadius: "var(--r-md)",
      background: "var(--espresso-900)", color: "var(--paper)",
    }}>
      <div style={{ fontFamily: "var(--f-mono)", fontSize: 9.5, letterSpacing: 1.5, opacity: 0.6, textTransform: "uppercase" }}>
        Package preview
      </div>
      <div style={{ fontFamily: "var(--f-display)", fontSize: 22, marginTop: 6, color: "var(--ochre, #C99A3F)" }}>
        {duration.label} · −{duration.pct}%
      </div>
      <div style={{ fontSize: 11.5, opacity: 0.75, marginTop: 4, lineHeight: 1.5 }}>{duration.sub} on every session in the block.</div>

      {/* Tier ladder */}
      <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 6 }}>
        {DURATIONS.map((t) => {
          const active = t.id === duration.id;
          return (
            <div key={t.id} style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "6px 10px", borderRadius: 6,
              background: active ? "rgba(201,154,63,0.18)" : "transparent",
              opacity: active ? 1 : 0.55,
            }}>
              <div style={{ fontFamily: "var(--f-mono)", fontSize: 10, letterSpacing: 1 }}>
                {active ? "●" : "○"} {t.label}
              </div>
              <div style={{ fontFamily: "var(--f-body)", fontSize: 12, fontWeight: 600 }}>
                {t.pct}% off
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid rgba(255,253,248,0.15)", display: "flex", flexDirection: "column", gap: 6 }}>
        <Row k="Days scheduled" v={scheduledDays} />
        <Row k="Times / day" v={timesCount} />
        <Row k="Sessions" v={sessions || 0} />
        <Row k="Subtotal" v={formatINR(subtotal)} />
        {duration.pct > 0 && <Row k={`Discount (${duration.pct}%)`} v={`− ${formatINR(discount)}`} accent />}
        <Row k="Total" v={formatINR(total)} bold />
      </div>
    </div>
  );
}

function Row({ k, v, bold, accent }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
      <span style={{ fontFamily: "var(--f-mono)", fontSize: 10, letterSpacing: 1, opacity: 0.7, textTransform: "uppercase" }}>{k}</span>
      <span style={{
        fontFamily: bold ? "var(--f-display)" : "var(--f-body)",
        fontSize: bold ? 18 : 13, fontWeight: bold ? 400 : 500,
        color: accent ? "var(--ochre, #C99A3F)" : "var(--paper)",
      }}>{v}</span>
    </div>
  );
}

function calcTotal(sessions, pct) {
  return sessions * SESSION_PRICE - Math.round(sessions * SESSION_PRICE * pct / 100);
}
function formatINR(n) {
  return "₹ " + n.toLocaleString("en-IN");
}

function pillBtn(active) {
  return {
    flex: 1, padding: "10px 14px", borderRadius: "var(--r-pill)",
    border: "none", cursor: "pointer",
    background: active ? "var(--walnut-700)" : "transparent",
    color: active ? "var(--paper)" : "var(--espresso-800)",
    fontFamily: "var(--f-body)", fontSize: 13, fontWeight: 500,
    display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
    transition: "all .2s",
  };
}
function navBtn(disabled) {
  return {
    width: 32, height: 32, borderRadius: "50%",
    border: "1px solid var(--hairline)", background: "var(--paper)",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.3 : 1, fontSize: 14, color: "var(--walnut-700)",
  };
}
function slotBtn(active) {
  return {
    padding: "12px 8px", borderRadius: "var(--r-md)",
    border: `1px solid ${active ? "var(--walnut-700)" : "var(--hairline)"}`,
    background: active ? "var(--walnut-700)" : "var(--paper)",
    color: active ? "var(--paper)" : "var(--espresso-900)",
    cursor: "pointer", textAlign: "center", transition: "all .15s",
  };
}
function disabledSlotBtn() {
  return {
    padding: "12px 8px", borderRadius: "var(--r-md)",
    border: "1px solid var(--hairline)",
    background: "var(--sand-200)",
    color: "var(--clay-600)",
    opacity: 0.4, cursor: "not-allowed", textAlign: "center",
  };
}

function EmptyState({ trainer }) {
  return (
    <div style={{ gridColumn: "1/-1", padding: 32, textAlign: "center", background: "var(--sand-100)", borderRadius: "var(--r-md)", border: "1px dashed var(--hairline-strong)" }}>
      <div style={{ fontFamily: "var(--f-display)", fontSize: 22, color: "var(--walnut-700)" }}>No slots this day</div>
      <div style={{ fontSize: 13, color: "var(--clay-600)", marginTop: 6 }}>
        {trainer.name.split(" ")[0]} is booked. Try another date, or switch to "By time" to see all trainers.
      </div>
    </div>
  );
}

function TrainerAvatar({ t, size = 36 }) {
  const tones = { walnut: "var(--walnut-700)", sage: "var(--sage-500)", terra: "var(--terracotta-500)", clay: "var(--clay-500)", sand: "var(--sand-400)" };
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: tones[t.tone] || "var(--walnut-700)",
      color: "var(--paper)", display: "inline-flex", alignItems: "center", justifyContent: "center",
      fontFamily: "var(--f-display)", fontSize: size * 0.42, flexShrink: 0,
    }}>{t.initials}</div>
  );
}

function BookingLogin({ user, onSignIn, selection, auth, setAuth, onBack, onConfirm }) {
  // Pre-fill auth from logged-in user once.
  React.useEffect(() => {
    if (user && !auth.method) {
      if (user.email) setAuth((a) => ({ ...a, method: "email", value: user.email }));
      else if (user.phone) setAuth((a) => ({ ...a, method: "phone", value: user.phone }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const validEmail = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(auth.value);
  const validPhone = /^\+?[\d\s-]{8,}$/.test(auth.value);
  const ok = user
    ? true
    : auth.method === "email" ? validEmail
    : auth.method === "phone" ? validPhone
    : false;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 24 }}>
      <Card tone="paper" style={{ padding: 40 }}>
        {user ? (
          <SignedInBlock user={user} auth={auth} setAuth={setAuth} selection={selection} />
        ) : (
          <GuestAuthBlock auth={auth} setAuth={setAuth} onSignIn={onSignIn} selection={selection} />
        )}

        <RemindersBlock auth={auth} setAuth={setAuth} />

        <div style={{ marginTop: 40 }}>
          <Btn variant="ghost" onClick={onBack}>← Back</Btn>
        </div>
      </Card>

      <BookingSummary selection={selection} auth={auth} canConfirm={ok} onConfirm={onConfirm} />
    </div>
  );
}

// ─── Signed-in: show masked contact, no auth picker ──────────────────────
function SignedInBlock({ user, auth, setAuth, selection }) {
  const method = user.email ? "email" : "phone";
  const value = user.email || user.phone || "";
  const masked = maskContact(method, value);
  return (
    <>
      <div style={{ fontFamily: "var(--f-mono)", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "var(--clay-600)", marginBottom: 12 }}>
        06 · Signed in
      </div>
      <h3 style={{ fontFamily: "var(--f-display)", fontSize: 36, fontWeight: 400, lineHeight: 1.1, margin: 0, color: "var(--espresso-900)" }}>
        {selection?.type === "bulk" ? "Your plan, saved." : "Your slot, saved."}
      </h3>
      <p style={{ fontSize: 15, lineHeight: 1.6, color: "var(--espresso-800)", opacity: 0.8, marginTop: 12, maxWidth: 480 }}>
        Confirmation and reminders will be sent to the contact on your profile.
      </p>

      <div style={{
        marginTop: 24, padding: "18px 20px", borderRadius: "var(--r-md)",
        background: "var(--sand-100)", border: "1px solid var(--hairline)",
        display: "flex", alignItems: "center", gap: 14,
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: "50%",
          background: "var(--walnut-700)", color: "var(--paper)",
          display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          fontFamily: "var(--f-display)", fontSize: 16,
        }}>
          {(user.name || "M").slice(0, 1).toUpperCase()}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: "var(--f-body)", fontSize: 14, fontWeight: 600, color: "var(--espresso-900)" }}>
            {user.name || "Member"}
          </div>
          <div style={{ fontFamily: "var(--f-mono)", fontSize: 12, color: "var(--clay-600)", marginTop: 3, letterSpacing: 0.5 }}>
            {masked}
          </div>
        </div>
        <Icon name="check" size={18} color="var(--sage-500)" />
      </div>
    </>
  );
}

// ─── Guest: Continue with Google OR Phone OTP ───────────────────────
function GuestAuthBlock({ auth, setAuth, onSignIn, selection }) {
  const [phone, setPhone] = useBS(auth.method === "phone" ? auth.value.replace(/^\+91\s*/, "") : "");
  const [otpSent, setOtpSent] = useBS(false);
  const [otp, setOtp] = useBS("");
  const phoneDigits = phone.replace(/\D/g, "");
  const validLocalPhone = phoneDigits.length >= 10;

  // Sync phone state → auth, so the right-card Confirm CTA enables once OTP verified.
  const verify = () => {
    if (otp.length !== 6) return;
    const value = "+91 " + phoneDigits;
    setAuth({ ...auth, method: "phone", value });
    onSignIn && onSignIn({ name: "Member", phone: value });
  };
  const sendOtp = () => {
    if (!validLocalPhone) return;
    setOtpSent(true);
    // Also stash partial auth so summary can preview the masked number.
    setAuth({ ...auth, method: "phone", value: "+91 " + phoneDigits });
  };

  const handleGoogle = () => {
    const u = { name: "Aanya Member", email: "aanya@gmail.com" };
    setAuth({ ...auth, method: "email", value: u.email });
    onSignIn && onSignIn(u);
  };

  return (
    <>
      <div style={{ fontFamily: "var(--f-mono)", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "var(--clay-600)", marginBottom: 12 }}>
        06 · Save this to your profile
      </div>
      <h3 style={{ fontFamily: "var(--f-display)", fontStyle: "italic", fontSize: 36, fontWeight: 400, lineHeight: 1.1, margin: 0, color: "var(--espresso-900)" }}>
        {selection?.type === "bulk" ? "Your plan, saved." : "Your slot, saved."}
      </h3>
      <p style={{ fontSize: 15, lineHeight: 1.6, color: "var(--espresso-800)", opacity: 0.8, marginTop: 12, maxWidth: 480 }}>
        Sign in so we can send reminders and let you reschedule in one tap. Continue with Google or your phone &mdash; no passwords.
      </p>

      {/* Google */}
      <button onClick={handleGoogle} style={{
        marginTop: 24, width: "100%", padding: "14px 18px", borderRadius: "var(--r-md)",
        border: "1.5px solid var(--hairline-strong)", background: "var(--paper)",
        cursor: "pointer", display: "flex", alignItems: "center", gap: 12,
        fontFamily: "var(--f-body)", fontSize: 14, fontWeight: 600, color: "var(--espresso-900)",
        transition: "all .15s",
      }}
        onMouseEnter={(e) => e.currentTarget.style.background = "var(--sand-100)"}
        onMouseLeave={(e) => e.currentTarget.style.background = "var(--paper)"}>
        <GoogleG />
        Continue with Google
        <span style={{ marginLeft: "auto", fontFamily: "var(--f-mono)", fontSize: 10, color: "var(--clay-600)", letterSpacing: 1 }}>→</span>
      </button>

      {/* Divider */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "18px 0" }}>
        <div style={{ flex: 1, height: 1, background: "var(--hairline)" }} />
        <div style={{ fontFamily: "var(--f-mono)", fontSize: 10, letterSpacing: 2, color: "var(--clay-600)", textTransform: "uppercase" }}>or</div>
        <div style={{ flex: 1, height: 1, background: "var(--hairline)" }} />
      </div>

      {/* Phone */}
      <div style={{ display: "grid", gridTemplateColumns: "96px 1fr", gap: 10 }}>
        <div style={{
          padding: "14px 16px", borderRadius: "var(--r-md)",
          border: "1.5px solid var(--hairline-strong)", background: "var(--paper)",
          fontFamily: "var(--f-body)", fontSize: 16, color: "var(--espresso-900)",
          textAlign: "center", boxSizing: "border-box",
        }}>+91</div>
        <input
          type="tel" inputMode="numeric"
          value={phone}
          onChange={(e) => { setPhone(e.target.value); if (otpSent) { setOtpSent(false); setOtp(""); } }}
          placeholder="Phone number"
          style={{
            padding: "14px 16px", borderRadius: "var(--r-md)",
            border: "1.5px solid var(--hairline-strong)", background: "var(--paper)",
            fontFamily: "var(--f-body)", fontSize: 16, color: "var(--espresso-900)",
            outline: "none", boxSizing: "border-box",
          }}
          onFocus={(e) => e.target.style.borderColor = "var(--walnut-700)"}
          onBlur={(e) => e.target.style.borderColor = "var(--hairline-strong)"}
        />
      </div>

      {!otpSent ? (
        <button onClick={sendOtp} disabled={!validLocalPhone} style={{
          marginTop: 12, width: "100%", padding: "14px 22px", borderRadius: "var(--r-pill)",
          border: "none",
          background: validLocalPhone ? "var(--walnut-700)" : "var(--sand-200)",
          color: validLocalPhone ? "var(--paper)" : "var(--clay-600)",
          fontFamily: "var(--f-body)", fontSize: 14, fontWeight: 600,
          cursor: validLocalPhone ? "pointer" : "not-allowed",
          transition: "all .2s",
        }}>Send OTP</button>
      ) : (
        <div style={{ marginTop: 14 }}>
          <div style={{ fontFamily: "var(--f-mono)", fontSize: 10, letterSpacing: 2, color: "var(--clay-600)", textTransform: "uppercase", marginBottom: 8 }}>
            Enter 6-digit OTP
          </div>
          <input
            type="tel" inputMode="numeric" autoFocus
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
            placeholder="123456"
            style={{
              width: "100%", padding: "14px 16px", borderRadius: "var(--r-md)",
              border: "1.5px solid var(--hairline-strong)", background: "var(--paper)",
              fontFamily: "var(--f-mono)", fontSize: 22, letterSpacing: 8, textAlign: "center",
              color: "var(--espresso-900)", outline: "none", boxSizing: "border-box",
            }}
          />
          <button onClick={verify} disabled={otp.length !== 6} style={{
            marginTop: 12, width: "100%", padding: "14px 22px", borderRadius: "var(--r-pill)",
            border: "none",
            background: otp.length === 6 ? "var(--walnut-700)" : "var(--sand-200)",
            color: otp.length === 6 ? "var(--paper)" : "var(--clay-600)",
            fontFamily: "var(--f-body)", fontSize: 14, fontWeight: 600,
            cursor: otp.length === 6 ? "pointer" : "not-allowed",
            transition: "all .2s",
          }}>Verify &amp; Sign In</button>
          <button onClick={() => { setOtpSent(false); setOtp(""); }} style={{
            marginTop: 8, width: "100%", padding: 4, background: "transparent", border: "none",
            fontFamily: "var(--f-mono)", fontSize: 10, letterSpacing: 1.5, color: "var(--clay-600)",
            cursor: "pointer", textTransform: "uppercase",
          }}>← Change number</button>
        </div>
      )}
    </>
  );
}

// Google G logo (matches onboarding flow)
function GoogleG() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0012 23z"/>
      <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.07H2.18A11 11 0 001 12c0 1.77.42 3.45 1.18 4.93l3.66-2.83z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.83C6.71 7.31 9.14 5.38 12 5.38z"/>
    </svg>
  );
}

function RemindersBlock({ auth, setAuth }) {
  return (
    <div style={{ marginTop: 28 }}>
      <div style={{ fontFamily: "var(--f-mono)", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "var(--clay-600)", marginBottom: 12 }}>
        Reminders
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {[
          { id: "email", label: "Email 24h before" },
          { id: "sms", label: "SMS 2h before" },
          { id: "ics", label: "Add to calendar" },
        ].map((r) => {
          const on = auth.reminders.includes(r.id);
          return (
            <button key={r.id}
              onClick={() => setAuth({ ...auth, reminders: on ? auth.reminders.filter(x => x !== r.id) : [...auth.reminders, r.id] })}
              style={{
                padding: "10px 16px", borderRadius: "var(--r-pill)",
                border: `1px solid ${on ? "var(--walnut-700)" : "var(--hairline)"}`,
                background: on ? "var(--walnut-700)" : "var(--paper)",
                color: on ? "var(--paper)" : "var(--espresso-900)",
                cursor: "pointer", fontSize: 13, fontFamily: "var(--f-body)",
                display: "inline-flex", alignItems: "center", gap: 6, transition: "all .15s",
              }}>
              {on && <Icon name="check" size={13} />}
              {r.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function BookingSummary({ selection, auth, canConfirm, onConfirm }) {
  if (!selection) return null;
  const isBulk = selection.type === "bulk";

  if (isBulk) {
    const subtotal = selection.sessions * SESSION_PRICE;
    const discount = Math.round(subtotal * selection.tier.pct / 100);
    const total = subtotal - discount;
    return (
      <Card tone="walnut" style={{ padding: 28, position: "sticky", top: 100, height: "fit-content", maxHeight: "calc(100vh - 120px)", overflowY: "auto" }}>
        <div style={{ fontFamily: "var(--f-mono)", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", opacity: 0.65, marginBottom: 16 }}>
          Your package
        </div>
        <div style={{ paddingBottom: 16, borderBottom: "1px solid rgba(255,253,248,0.15)" }}>
          <div style={{ fontFamily: "var(--f-display)", fontSize: 22 }}>{selection.tier.label}</div>
          {selection.tier.pct > 0 && (
            <div style={{ fontFamily: "var(--f-mono)", fontSize: 11, color: "var(--ochre, #C99A3F)", letterSpacing: 1, marginTop: 4 }}>
              −{selection.tier.pct}% PACKAGE DISCOUNT
            </div>
          )}
        </div>
        <div style={{ paddingTop: 16, display: "flex", flexDirection: "column", gap: 12 }}>
          <SumRow k="Sessions" v={selection.sessions} />
          <SumRow k="Cadence" v={`${selection.daysPerWeek}× / week`} />
          <SumRow k="Days" v={selection.weekdays.map(n => WEEKDAY_LABELS[n]).join(", ")} />
          <SumRow k="Times" v={selection.times.join(", ")} />
          {selection.mode === "trainer" && <SumRow k="Coach" v={selection.trainer.name} />}
          <SumRow k="Subtotal" v={formatINR(subtotal)} />
          {selection.tier.pct > 0 && <SumRow k={`Discount (−${selection.tier.pct}%)`} v={`− ${formatINR(discount)}`} />}
          <SumRow k="Total" v={formatINR(total)} highlight />
        </div>
        <CancellationPolicy />
        {onConfirm && <SummaryCTA canConfirm={canConfirm} onConfirm={onConfirm} label="Confirm booking" />}
      </Card>
    );
  }

  return (
    <Card tone="walnut" style={{ padding: 28, position: "sticky", top: 100, height: "fit-content" }}>
      <div style={{ fontFamily: "var(--f-mono)", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", opacity: 0.65, marginBottom: 16 }}>
        Your booking
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 14, paddingBottom: 20, borderBottom: "1px solid rgba(255,253,248,0.15)" }}>
        <TrainerAvatar t={selection.trainer} size={48} />
        <div>
          <div style={{ fontSize: 15, fontWeight: 600 }}>{selection.trainer.name}</div>
          <div style={{ fontFamily: "var(--f-mono)", fontSize: 10, letterSpacing: 1, opacity: 0.7, marginTop: 3, textTransform: "uppercase" }}>{selection.trainer.role}</div>
        </div>
      </div>
      <div style={{ paddingTop: 20, display: "flex", flexDirection: "column", gap: 14 }}>
        <SumRow k="Date" v={selection.day.date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })} />
        <SumRow k="Time" v={`${selection.time} — ${addMin(selection.time, 60)} IST`} />
        <SumRow k="Duration" v="60 minutes" />
        <SumRow k="Location" v="M3S Studio · Indiranagar" />
        <SumRow k="Price" v={formatINR(SESSION_PRICE)} highlight />
      </div>
      <CancellationPolicy />
      {onConfirm && <SummaryCTA canConfirm={canConfirm} onConfirm={onConfirm} label="Confirm booking" />}
    </Card>
  );
}

function SummaryCTA({ canConfirm, onConfirm, label }) {
  return (
    <div style={{ marginTop: 16 }}>
      <button onClick={onConfirm} disabled={!canConfirm} style={{
        width: "100%", padding: "14px 22px", borderRadius: "var(--r-pill)",
        border: "none",
        background: canConfirm ? "var(--paper)" : "rgba(255,253,248,0.18)",
        color: canConfirm ? "var(--espresso-900)" : "rgba(255,253,248,0.55)",
        fontFamily: "var(--f-body)", fontSize: 15, fontWeight: 600, letterSpacing: 0.2,
        cursor: canConfirm ? "pointer" : "not-allowed",
        display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 10,
        transition: "all .2s",
      }}
        onMouseEnter={(e) => { if (canConfirm) { e.currentTarget.style.background = "var(--sand-100)"; e.currentTarget.style.transform = "translateY(-1px)"; } }}
        onMouseLeave={(e) => { if (canConfirm) { e.currentTarget.style.background = "var(--paper)"; e.currentTarget.style.transform = "translateY(0)"; } }}>
        {label} <span style={{ fontSize: 17, fontWeight: 400, lineHeight: 1 }}>→</span>
      </button>
      {!canConfirm && (
        <div style={{ marginTop: 8, fontFamily: "var(--f-mono)", fontSize: 9.5, letterSpacing: 1.5, color: "rgba(255,253,248,0.55)", textAlign: "center", textTransform: "uppercase" }}>
          Sign in to continue
        </div>
      )}
    </div>
  );
}

function SumRow({ k, v, highlight }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 16 }}>
      <span style={{ fontFamily: "var(--f-mono)", fontSize: 10, letterSpacing: 1.5, opacity: 0.65, textTransform: "uppercase" }}>{k}</span>
      <span style={{ fontSize: highlight ? 18 : 13, fontWeight: highlight ? 600 : 400, fontFamily: highlight ? "var(--f-display)" : "var(--f-body)", textAlign: "right" }}>{v}</span>
    </div>
  );
}

function addMin(t, m) {
  const [h, mm] = t.split(":").map(Number);
  const d = new Date(2026, 3, 17, h, mm + m);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

function BookingConfirm({ selection, auth, onReset }) {
  const isBulk = selection?.type === "bulk";
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 24 }}>
      <Card tone="paper" style={{ padding: 48, textAlign: "center" }}>
        <div style={{
          width: 72, height: 72, borderRadius: "50%",
          background: "var(--sage-500)", color: "var(--paper)",
          display: "inline-flex", alignItems: "center", justifyContent: "center", margin: "0 auto",
        }}>
          <Icon name="check" size={34} strokeWidth={2.5} />
        </div>
        <h3 style={{ fontFamily: "var(--f-display)", fontSize: 48, fontWeight: 400, lineHeight: 1.05, margin: "24px 0 12px", color: "var(--espresso-900)" }}>
          {isBulk ? "Your plan is locked." : "You're in."}
        </h3>
        <p style={{ fontSize: 16, lineHeight: 1.6, color: "var(--espresso-800)", opacity: 0.85, margin: "0 auto", maxWidth: 460 }}>
          {isBulk
            ? `${selection.sessions} sessions over ${selection.duration.label.toLowerCase()}, locked at ${selection.tier.pct}% off. We've sent the schedule to `
            : `We've sent a confirmation to `}
          <strong>{auth.value}</strong>. {auth.reminders.includes("sms") && "SMS reminders 2 hours before each session. "}See you on the floor.
        </p>

        <div style={{ marginTop: 40, display: "inline-flex", flexDirection: "column", gap: 8, padding: 20, border: "1px dashed var(--hairline-strong)", borderRadius: "var(--r-md)", textAlign: "left", minWidth: 320 }}>
          <div style={{ fontFamily: "var(--f-mono)", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "var(--clay-600)" }}>BOOKING REF</div>
          <div style={{ fontFamily: "var(--f-mono)", fontSize: 15, color: "var(--espresso-900)" }}>M3S-{Math.random().toString(36).slice(2, 8).toUpperCase()}</div>
        </div>

        <div style={{ marginTop: 32, display: "flex", gap: 12, justifyContent: "center" }}>
          <Btn variant="secondary" onClick={onReset}>Book another</Btn>
          <Btn variant="sage">Add to calendar</Btn>
        </div>
      </Card>

      <BookingSummary selection={selection} />
    </div>
  );
}

Object.assign(window, { Booking });

// ─── Labeled stepper: CHOOSE → CONFIRM → PAY → DONE ──────────────────────
function BookingStepper({ step }) {
  const STEPS = [
    { n: 1, label: "Choose" },
    { n: 2, label: "Confirm" },
    { n: 3, label: "Pay" },
    { n: 4, label: "Done" },
  ];
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 12,
      marginBottom: 40, flexWrap: "wrap",
    }}>
      {STEPS.map((s, i) => {
        const status = step > s.n ? "done" : step === s.n ? "active" : "todo";
        const color =
          status === "done" ? "var(--sage-500)"
          : status === "active" ? "var(--walnut-700)"
          : "var(--clay-600)";
        const isLast = i === STEPS.length - 1;
        return (
          <React.Fragment key={s.n}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              opacity: status === "todo" ? 0.7 : 1,
            }}>
              {/* Step indicator: circled number, ✓ when done */}
              <span style={{
                width: 22, height: 22, borderRadius: "50%",
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                fontFamily: "var(--f-mono)", fontSize: 11, fontWeight: 700, letterSpacing: 0,
                background: status === "done" ? "var(--sage-500)"
                  : status === "active" ? "var(--walnut-700)"
                  : "transparent",
                color: status === "todo" ? "var(--clay-600)" : "var(--paper)",
                border: status === "todo" ? "1.5px solid var(--hairline-strong)" : "none",
                flexShrink: 0,
                transition: "all .2s",
              }}>
                {status === "done" ? (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                ) : s.n}
              </span>
              <span style={{
                fontFamily: "var(--f-mono)", fontSize: 11, letterSpacing: 2,
                textTransform: "uppercase", fontWeight: status === "active" ? 600 : 500,
                color,
                transition: "color .2s",
              }}>{s.label}</span>
            </div>
            {!isLast && (
              <span aria-hidden="true" style={{
                flex: "1 1 24px", minWidth: 24, maxWidth: 80,
                height: 1.5, borderRadius: 1,
                background: step > s.n ? "var(--sage-500)" : "var(--hairline-strong)",
                transition: "background .3s",
              }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ─── Step 3: Razorpay-style payment screen ────────────────────────────────
function BookingPayment({ selection, auth, onBack, onPay }) {
  const [method, setMethod] = useBS("upi");
  const [upiId, setUpiId] = useBS("");
  const [upiApp, setUpiApp] = useBS(null);
  const [card, setCard] = useBS({ number: "", expiry: "", cvv: "", name: "", save: false });

  const isBulk = selection?.type === "bulk";
  const sessions = isBulk ? selection.sessions : 1;
  const subtotal = sessions * SESSION_PRICE;
  const discount = isBulk ? Math.round(subtotal * selection.tier.pct / 100) : 0;
  const sessionFee = subtotal - discount;
  const convenienceFee = 0;
  const total = sessionFee + convenienceFee;

  const setCardNumber = (raw) => {
    const digits = raw.replace(/\D/g, "").slice(0, 16);
    const spaced = digits.replace(/(.{4})/g, "$1 ").trim();
    setCard({ ...card, number: spaced });
  };
  const setExpiry = (raw) => {
    const digits = raw.replace(/\D/g, "").slice(0, 4);
    const formatted = digits.length > 2 ? digits.slice(0, 2) + "/" + digits.slice(2) : digits;
    setCard({ ...card, expiry: formatted });
  };
  const setCvv = (raw) => setCard({ ...card, cvv: raw.replace(/\D/g, "").slice(0, 3) });

  const PAYMENT_METHODS = [
    { id: "upi", label: "UPI", sub: "Google Pay / PhonePe / BHIM" },
    { id: "card", label: "Credit / Debit Card", sub: "Visa, Mastercard, RuPay, Amex" },
    { id: "netbank", label: "Net Banking", sub: "All Indian banks" },
    { id: "emi", label: "EMI", sub: "3 / 6 / 9 / 12 months · No-cost options" },
  ];

  const sessionLine = isBulk
    ? `${selection.sessions} sessions · ${selection.duration.label}`
    : `${selection.trainer.name} · Personal Training`;
  const whenLine = isBulk
    ? `${selection.weekdays.map((n) => WEEKDAY_LABELS[n]).join(" · ")} · ${selection.times.join(", ")}`
    : `${selection.day.date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })} · ${selection.time} IST`;

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div style={{
        width: "100%", maxWidth: 480,
        background: "var(--paper)", borderRadius: "var(--r-xl)",
        boxShadow: "var(--sh-3)", overflow: "hidden",
        border: "1px solid var(--hairline)",
      }}>
        {/* Dark header */}
        <div style={{
          background: "var(--espresso-900)", color: "var(--paper)",
          padding: "20px 24px",
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              background: "#3395FF", color: "#FFFFFF",
              padding: "4px 9px", borderRadius: 4,
              fontFamily: "var(--f-mono)", fontWeight: 700, fontSize: 12, letterSpacing: 0.5,
            }}>rzp</div>
            <div style={{ fontFamily: "var(--f-mono)", fontSize: 10, letterSpacing: 2, opacity: 0.7, textTransform: "uppercase" }}>
              Secure payment
            </div>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--sand-300)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="4" y="11" width="16" height="10" rx="2"/>
            <path d="M8 11V7a4 4 0 0 1 8 0v4"/>
          </svg>
        </div>

        {/* Order summary */}
        <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--hairline)" }}>
          <div style={{ fontFamily: "var(--f-mono)", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "var(--clay-600)", marginBottom: 10 }}>
            Booking summary
          </div>
          <div style={{ fontFamily: "var(--f-body)", fontSize: 14, fontWeight: 500, color: "var(--espresso-900)", lineHeight: 1.4 }}>
            {sessionLine}
          </div>
          <div style={{ fontFamily: "var(--f-mono)", fontSize: 11, color: "var(--clay-600)", marginTop: 6, letterSpacing: 0.5 }}>
            {whenLine}
          </div>

          <div style={{ height: 1, background: "var(--hairline)", margin: "16px 0" }} />

          <SumLine label="Session fee" value={formatINR(sessionFee)} valueStyle={{ fontWeight: 600, fontSize: 16, color: "var(--walnut-700)" }} />
          <SumLine label="Convenience fee" value={formatINR(convenienceFee)} labelStyle={{ color: "var(--clay-600)", fontSize: 13 }} valueStyle={{ color: "var(--clay-600)", fontSize: 13 }} />

          <div style={{ height: 1, background: "var(--hairline-strong)", margin: "14px 0 12px" }} />

          <SumLine label="Total" value={formatINR(total)}
            labelStyle={{ fontWeight: 600, fontSize: 14, color: "var(--espresso-900)" }}
            valueStyle={{ fontWeight: 700, fontSize: 18, color: "var(--espresso-900)" }} />
        </div>

        {/* Method selector */}
        <div style={{ padding: "20px 24px" }}>
          <div style={{ fontFamily: "var(--f-mono)", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "var(--clay-600)", marginBottom: 12 }}>
            Choose payment method
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {PAYMENT_METHODS.map((m) => {
              const on = method === m.id;
              return (
                <div key={m.id}>
                  <button onClick={() => setMethod(m.id)} style={{
                    width: "100%", display: "flex", alignItems: "center", gap: 12,
                    padding: "12px 14px", borderRadius: "var(--r-md)",
                    border: `1px solid ${on ? "var(--walnut-700)" : "var(--hairline)"}`,
                    background: on ? "var(--sand-100)" : "var(--paper)",
                    cursor: "pointer", textAlign: "left", transition: "all .15s",
                  }}>
                    <Radio on={on} />
                    <PaymentGlyph kind={m.id} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--espresso-900)" }}>{m.label}</div>
                      <div style={{ fontFamily: "var(--f-mono)", fontSize: 9.5, letterSpacing: 1, color: "var(--clay-600)", marginTop: 3, textTransform: "uppercase" }}>{m.sub}</div>
                    </div>
                  </button>

                  {on && m.id === "upi" && (
                    <div style={{ padding: "14px 14px 4px" }}>
                      <input
                        type="text" value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="yourname@upi"
                        style={pmtInput()}
                      />
                      <div style={{ fontFamily: "var(--f-mono)", fontSize: 9.5, letterSpacing: 1.5, color: "var(--clay-600)", textTransform: "uppercase", margin: "12px 0 8px" }}>
                        Or pay with
                      </div>
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                        {[
                          { id: "gpay", label: "GPay", color: "#1A73E8" },
                          { id: "phonepe", label: "PhonePe", color: "#5F259F" },
                          { id: "bhim", label: "BHIM", color: "#00BAF2" },
                        ].map((app) => {
                          const onApp = upiApp === app.id;
                          return (
                            <button key={app.id} onClick={() => setUpiApp(onApp ? null : app.id)} style={{
                              display: "inline-flex", alignItems: "center", gap: 8,
                              padding: "8px 12px", borderRadius: "var(--r-pill)",
                              border: `1px solid ${onApp ? "var(--walnut-700)" : "var(--hairline)"}`,
                              background: onApp ? "var(--walnut-700)" : "var(--paper)",
                              color: onApp ? "var(--paper)" : "var(--espresso-900)",
                              cursor: "pointer", fontSize: 12, fontFamily: "var(--f-body)", fontWeight: 500,
                              transition: "all .15s",
                            }}>
                              <span style={{
                                width: 16, height: 16, borderRadius: 3,
                                background: app.color, color: "white",
                                fontSize: 9, fontWeight: 700,
                                display: "inline-flex", alignItems: "center", justifyContent: "center",
                              }}>{app.label[0]}</span>
                              {app.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {on && m.id === "card" && (
                    <div style={{ padding: "14px 14px 4px", display: "flex", flexDirection: "column", gap: 10 }}>
                      <input type="text" inputMode="numeric" value={card.number}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="1234 5678 9012 3456" style={pmtInput()} />
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                        <input type="text" inputMode="numeric" value={card.expiry}
                          onChange={(e) => setExpiry(e.target.value)}
                          placeholder="MM/YY" style={pmtInput()} />
                        <input type="password" inputMode="numeric" value={card.cvv}
                          onChange={(e) => setCvv(e.target.value)}
                          placeholder="CVV" style={pmtInput()} />
                      </div>
                      <input type="text" value={card.name}
                        onChange={(e) => setCard({ ...card, name: e.target.value })}
                        placeholder="Cardholder name" style={pmtInput()} />
                      <label style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--espresso-800)", cursor: "pointer", marginTop: 2 }}>
                        <input type="checkbox" checked={card.save}
                          onChange={(e) => setCard({ ...card, save: e.target.checked })}
                          style={{ accentColor: "var(--walnut-700)", width: 14, height: 14 }} />
                        Save card for future bookings
                      </label>
                    </div>
                  )}

                  {on && m.id === "netbank" && (
                    <div style={{ padding: "14px 14px 4px" }}>
                      <select style={pmtInput()} defaultValue="">
                        <option value="" disabled>Select your bank</option>
                        <option>HDFC Bank</option>
                        <option>ICICI Bank</option>
                        <option>State Bank of India</option>
                        <option>Axis Bank</option>
                        <option>Kotak Mahindra Bank</option>
                      </select>
                    </div>
                  )}

                  {on && m.id === "emi" && (
                    <div style={{ padding: "14px 14px 4px", display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {["3 mo", "6 mo", "9 mo", "12 mo"].map((t) => (
                        <span key={t} style={{
                          padding: "8px 14px", borderRadius: "var(--r-pill)",
                          border: "1px solid var(--hairline)", background: "var(--sand-50)",
                          fontSize: 12, color: "var(--espresso-800)", fontFamily: "var(--f-body)",
                        }}>{t}</span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div style={{ padding: "0 24px 24px" }}>
          <button onClick={onPay} style={{
            width: "100%", padding: "14px 22px", borderRadius: "var(--r-pill)",
            border: "none", background: "var(--walnut-700)", color: "var(--paper)",
            fontFamily: "var(--f-body)", fontSize: 15, fontWeight: 600, letterSpacing: 0.2,
            cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 10,
            boxShadow: "var(--sh-2)", transition: "all .2s",
          }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "var(--espresso-800)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "var(--walnut-700)"; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            Pay {formatINR(total)} <span style={{ fontSize: 17, fontWeight: 400, lineHeight: 1 }}>→</span>
          </button>
          <div style={{
            marginTop: 12, fontFamily: "var(--f-mono)", fontSize: 9, letterSpacing: 2,
            color: "var(--clay-600)", textAlign: "center", textTransform: "uppercase",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
          }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="4" y="11" width="16" height="10" rx="2"/>
              <path d="M8 11V7a4 4 0 0 1 8 0v4"/>
            </svg>
            256-bit encrypted · Secured by Razorpay
          </div>
          <div style={{
            marginTop: 4, fontFamily: "var(--f-body)", fontSize: 10,
            color: "var(--clay-600)", textAlign: "center", opacity: 0.7,
          }}>
            Powered by <span style={{ fontFamily: "var(--f-mono)", fontWeight: 600, color: "#3395FF" }}>Razorpay</span>
          </div>

          <div style={{ marginTop: 16, textAlign: "center" }}>
            <button onClick={onBack} style={{
              background: "transparent", border: "none", cursor: "pointer",
              fontFamily: "var(--f-body)", fontSize: 12.5, color: "var(--clay-600)",
              textDecoration: "underline", textUnderlineOffset: 3,
            }}>← Back to sign-in</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Radio({ on }) {
  return (
    <span style={{
      width: 18, height: 18, borderRadius: "50%",
      border: `1.5px solid ${on ? "var(--walnut-700)" : "var(--hairline-strong)"}`,
      display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      background: "var(--paper)",
    }}>
      {on && <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--walnut-700)" }} />}
    </span>
  );
}

function PaymentGlyph({ kind }) {
  const base = { width: 28, height: 20, borderRadius: 4, display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontFamily: "var(--f-mono)", fontWeight: 700, fontSize: 9, letterSpacing: 0.5 };
  if (kind === "upi") return <span style={{ ...base, background: "var(--sand-100)", color: "var(--walnut-700)" }}>UPI</span>;
  if (kind === "card") return (
    <span style={{ ...base, background: "var(--espresso-900)", color: "var(--paper)", justifyContent: "flex-start", padding: "0 4px", position: "relative" }}>
      <span style={{ width: 10, height: 7, background: "var(--ochre-500)", borderRadius: 1 }} />
    </span>
  );
  if (kind === "netbank") return <span style={{ ...base, background: "var(--sage-500)", color: "var(--paper)" }}>NB</span>;
  if (kind === "emi") return <span style={{ ...base, background: "var(--terracotta-500)", color: "var(--paper)" }}>EMI</span>;
  return null;
}

function SumLine({ label, value, labelStyle = {}, valueStyle = {} }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "4px 0" }}>
      <span style={{ fontFamily: "var(--f-body)", fontSize: 14, color: "var(--espresso-800)", ...labelStyle }}>{label}</span>
      <span style={{ fontFamily: "var(--f-body)", fontSize: 14, color: "var(--espresso-900)", ...valueStyle }}>{value}</span>
    </div>
  );
}

function pmtInput() {
  return {
    width: "100%", padding: "12px 14px",
    borderRadius: "var(--r-md)", border: "1.5px solid var(--hairline-strong)",
    background: "var(--paper)", fontFamily: "var(--f-body)", fontSize: 14,
    color: "var(--espresso-900)", outline: "none",
    boxSizing: "border-box",
  };
}

// ─── Step 4: Success card (paper, same 480px container) ───────────────────
function BookingSuccess({ selection, auth, onReset }) {
  const isBulk = selection?.type === "bulk";
  const masked = maskContact(auth.method, auth.value);
  const ref = useBM(() => "M3S-" + Math.random().toString(36).slice(2, 8).toUpperCase(), []);

  const seeYouLine = isBulk
    ? `See you for ${selection.sessions} sessions, starting ${selection.days[0].date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}.`
    : `See you ${selection.day.date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })} at ${selection.time} with ${selection.trainer.name}.`;

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div style={{
        width: "100%", maxWidth: 480,
        background: "var(--paper)", borderRadius: "var(--r-xl)",
        boxShadow: "var(--sh-3)", overflow: "hidden",
        border: "1px solid var(--hairline)",
        padding: "44px 32px 32px", textAlign: "center",
      }}>
        <div style={{
          width: 56, height: 56, borderRadius: "50%",
          background: "var(--sage-500)", color: "var(--paper)",
          display: "inline-flex", alignItems: "center", justifyContent: "center", margin: "0 auto",
          boxShadow: "0 8px 20px -8px rgba(123,139,111,0.6)",
        }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <h3 style={{
          fontFamily: "var(--f-display)", fontSize: 32, fontWeight: 400, fontStyle: "italic",
          lineHeight: 1.1, margin: "20px 0 12px", color: "var(--espresso-900)",
          letterSpacing: "-0.5px",
        }}>
          You're booked.
        </h3>

        <p style={{
          fontFamily: "var(--f-body)", fontSize: 15, lineHeight: 1.55,
          color: "var(--espresso-800)", margin: "0 auto 4px", maxWidth: 380,
        }}>
          Confirmation sent to <span style={{ fontFamily: "var(--f-mono)", fontWeight: 600, fontSize: 14 }}>{masked}</span>.
        </p>
        <p style={{
          fontFamily: "var(--f-body)", fontSize: 15, lineHeight: 1.55,
          color: "var(--espresso-800)", margin: "0 auto", maxWidth: 380,
        }}>
          {seeYouLine}
        </p>

        <div style={{
          margin: "28px auto 0", display: "inline-flex", flexDirection: "column", gap: 6,
          padding: "12px 18px", border: "1px dashed var(--hairline-strong)",
          borderRadius: "var(--r-md)", textAlign: "left",
        }}>
          <div style={{ fontFamily: "var(--f-mono)", fontSize: 9.5, letterSpacing: 2, textTransform: "uppercase", color: "var(--clay-600)" }}>Booking ref</div>
          <div style={{ fontFamily: "var(--f-mono)", fontSize: 14, color: "var(--espresso-900)", letterSpacing: 0.5 }}>{ref}</div>
        </div>

        <div style={{ marginTop: 28, display: "flex", flexDirection: "column", gap: 10 }}>
          <button style={{
            width: "100%", padding: "13px 22px", borderRadius: "var(--r-pill)",
            border: "none", background: "var(--walnut-700)", color: "var(--paper)",
            fontFamily: "var(--f-body)", fontSize: 14.5, fontWeight: 600,
            cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
            transition: "all .2s",
          }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "var(--espresso-800)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "var(--walnut-700)"; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            Add to calendar <span style={{ fontSize: 16, fontWeight: 400 }}>→</span>
          </button>
          <button onClick={() => { onReset(); window.scrollTo({ top: 0, behavior: "smooth" }); }} style={{
            width: "100%", padding: "12px 22px", borderRadius: "var(--r-pill)",
            border: "1px solid var(--hairline-strong)", background: "transparent", color: "var(--espresso-900)",
            fontFamily: "var(--f-body)", fontSize: 14, fontWeight: 500,
            cursor: "pointer", transition: "all .2s",
          }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "var(--sand-100)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
          >
            Back to home
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Cancellation policy block ────────────────────────────────────
function CancellationPolicy() {
  const rowStyle = {
    display: "flex", alignItems: "center", gap: 8,
    fontFamily: "var(--f-body)", fontSize: 13, lineHeight: 1.4,
    color: "var(--espresso-800)",
  };
  const Mark = ({ color, children }) => (
    <span style={{
      width: 14, height: 14, flexShrink: 0,
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      color,
    }}>{children}</span>
  );
  return (
    <div style={{
      marginTop: 16, padding: "14px 16px", borderRadius: "var(--r-md)",
      background: "var(--sand-100)", border: "1px solid var(--hairline)",
    }}>
      <div style={{
        fontFamily: "var(--f-mono)", fontSize: 10, letterSpacing: 2,
        textTransform: "uppercase", color: "var(--clay-600)", marginBottom: 10,
      }}>Cancellation policy</div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={rowStyle}>
          <Mark color="var(--sage-500)">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          </Mark>
          Cancel 8+ hours before <span style={{ color: "var(--clay-600)" }}>→</span> <strong style={{ fontWeight: 600 }}>Full refund</strong>
        </div>
        <div style={rowStyle}>
          <Mark color="var(--ochre-500)">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 3 A9 9 0 0 1 12 21 Z" fill="currentColor" stroke="none"/></svg>
          </Mark>
          Cancel 4–8 hours before <span style={{ color: "var(--clay-600)" }}>→</span> <strong style={{ fontWeight: 600 }}>50% refund</strong>
        </div>
        <div style={rowStyle}>
          <Mark color="var(--terracotta-500)">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="5" x2="19" y2="19"/><line x1="19" y1="5" x2="5" y2="19"/></svg>
          </Mark>
          Cancel under 4 hours <span style={{ color: "var(--clay-600)" }}>→</span> <strong style={{ fontWeight: 600 }}>No refund</strong>
        </div>
      </div>

      <div style={{
        marginTop: 12, paddingTop: 10, borderTop: "1px solid var(--hairline)",
        fontFamily: "var(--f-mono)", fontSize: 10, letterSpacing: 1, lineHeight: 1.5,
        color: "var(--clay-600)", textTransform: "uppercase",
      }}>
        Refund processed to original payment method within 3–5 business days.
      </div>
    </div>
  );
}

// ─── Confirm banner ───────────────────────────────────────────────────────
function maskContact(method, value) {
  if (method === "email") {
    if (!value || !value.includes("@")) return "eXXXXX@gXXXl.com";
    const [user, domain] = value.split("@");
    const dotIdx = domain.lastIndexOf(".");
    const tld = dotIdx >= 0 ? domain.slice(dotIdx) : "";
    const dom = dotIdx >= 0 ? domain.slice(0, dotIdx) : domain;
    const mu = user.length <= 2 ? user : user[0] + "X".repeat(Math.max(1, user.length - 2)) + user[user.length - 1];
    const md = dom.length <= 2 ? dom : dom[0] + "X".repeat(Math.max(1, dom.length - 2)) + dom[dom.length - 1];
    return mu + "@" + md + tld;
  }
  // phone
  const digits = (value || "").replace(/\D/g, "");
  if (digits.length < 6) return "9XXXXXX210";
  return digits[0] + "XXXX" + digits.slice(-5);
}

function ConfirmBanner({ method, value, onClose }) {
  const masked = maskContact(method, value);
  return (
    <div role="status" aria-live="polite" style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 300,
      height: 48, padding: "0 24px",
      background: "var(--sage-500)", color: "var(--paper)",
      display: "flex", alignItems: "center", justifyContent: "center", gap: 12,
      fontFamily: "var(--f-body)", fontSize: 14, fontWeight: 500,
      boxShadow: "0 6px 20px -8px rgba(62,44,28,0.18)",
      animation: "m3sBannerIn .3s ease-out",
    }}>
      <style>{`@keyframes m3sBannerIn { from { transform: translateY(-100%); } to { transform: translateY(0); } }`}</style>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polyline points="20 6 9 17 4 12" />
      </svg>
      <span>
        Booking confirmed &mdash; details sent to <strong style={{ fontWeight: 600, fontFamily: "var(--f-mono)", fontSize: 13, letterSpacing: 0.5 }}>{masked}</strong>
      </span>
      <button onClick={onClose} aria-label="Dismiss"
        style={{
          position: "absolute", right: 18, top: "50%", transform: "translateY(-50%)",
          width: 24, height: 24, padding: 0, border: "none", background: "transparent",
          color: "var(--paper)", opacity: 0.7, cursor: "pointer",
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          transition: "opacity .15s",
        }}
        onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
        onMouseLeave={(e) => e.currentTarget.style.opacity = 0.7}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="6" y1="6" x2="18" y2="18" />
          <line x1="18" y1="6" x2="6" y2="18" />
        </svg>
      </button>
    </div>
  );
}
