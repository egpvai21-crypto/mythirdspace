// Shared UI atoms for My Third Space
const { useState, useEffect, useMemo, useRef } = React;

// ---------- Logo ----------
function M3SLogo({ size = 36, color = "currentColor" }) {
  const isLight = color.includes("sand") || color.includes("paper");
  // The logo PNG already contains the "M3S · MY THIRD SPACE" lockup.
  // Use it directly as a wordmark; aspect ratio ~679:357 (~1.9:1).
  return (
    <div style={{ display: "inline-flex", alignItems: "center", color, lineHeight: 0 }} aria-label="My Third Space">
      <img
        src="assets/mts-logo.png"
        alt="My Third Space"
        style={{
          height: size * 1.5,
          width: "auto",
          objectFit: "contain",
          display: "block",
          filter: isLight
            ? "none"
            : "brightness(0) saturate(100%) invert(20%) sepia(40%) saturate(850%) hue-rotate(355deg) brightness(85%) contrast(95%)",
          opacity: isLight ? 0.95 : 1,
        }}
      />
    </div>
  );
}

// ---------- Button ----------
function Btn({ children, variant = "primary", size = "md", onClick, style, disabled, as = "button", href, icon }) {
  const base = {
    display: "inline-flex", alignItems: "center", gap: 8,
    fontFamily: "var(--f-body)", fontWeight: 500,
    border: "1px solid transparent", cursor: disabled ? "not-allowed" : "pointer",
    borderRadius: "var(--r-pill)",
    transition: "all .2s ease",
    opacity: disabled ? 0.5 : 1,
    textDecoration: "none",
    whiteSpace: "nowrap",
  };
  const sizes = {
    sm: { padding: "8px 16px", fontSize: 13 },
    md: { padding: "12px 22px", fontSize: 14 },
    lg: { padding: "16px 32px", fontSize: 15 },
  };
  const variants = {
    primary: { background: "var(--walnut-700)", color: "var(--paper)", borderColor: "var(--walnut-700)" },
    secondary: { background: "transparent", color: "var(--walnut-700)", borderColor: "var(--walnut-700)" },
    ghost: { background: "transparent", color: "var(--walnut-700)", borderColor: "transparent" },
    sage: { background: "var(--sage-500)", color: "var(--paper)", borderColor: "var(--sage-500)" },
    terra: { background: "var(--terracotta-500)", color: "var(--paper)", borderColor: "var(--terracotta-500)" },
  };
  const Tag = as === "a" ? "a" : "button";
  return (
    <Tag
      href={href}
      onClick={disabled ? undefined : onClick}
      style={{ ...base, ...sizes[size], ...variants[variant], ...style }}
      onMouseEnter={(e) => !disabled && (e.currentTarget.style.transform = "translateY(-1px)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
    >
      {children}{icon}
    </Tag>
  );
}

// ---------- Chip ----------
function Chip({ children, tone = "sand", active, onClick }) {
  const tones = {
    sand: { bg: "var(--sand-100)", fg: "var(--walnut-700)", border: "var(--hairline)" },
    sage: { bg: "var(--sage-200)", fg: "#4a5a41", border: "rgba(123,139,111,0.35)" },
    terra: { bg: "var(--terracotta-200)", fg: "#7a3f26", border: "rgba(184,107,75,0.35)" },
  };
  const t = tones[tone];
  return (
    <button
      onClick={onClick}
      style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        fontFamily: "var(--f-mono)", fontSize: 11, letterSpacing: 1, textTransform: "uppercase",
        padding: "6px 12px", borderRadius: "var(--r-pill)",
        background: active ? "var(--walnut-700)" : t.bg,
        color: active ? "var(--paper)" : t.fg,
        border: `1px solid ${active ? "var(--walnut-700)" : t.border}`,
        cursor: onClick ? "pointer" : "default",
      }}
    >{children}</button>
  );
}

// ---------- Section wrappers ----------
function Section({ children, id, bg = "var(--sand-50)", pad = "0 0 72px", style }) {
  return (
    <section id={id} style={{ background: bg, padding: pad, scrollMarginTop: 0, ...style }}>
      <div style={{ maxWidth: 1240, margin: "0 auto", padding: "18px 32px 0" }}>
        {children}
      </div>
    </section>
  );
}

function EyebrowTitle({ eyebrow, title, lead, align = "left", color = "var(--walnut-700)" }) {
  return (
    <div style={{ textAlign: align, maxWidth: align === "center" ? 760 : undefined, margin: align === "center" ? "0 auto" : undefined }}>
      {eyebrow && (
        <div style={{ fontFamily: "var(--f-mono)", fontSize: 12, letterSpacing: 2.5, textTransform: "uppercase", color: "var(--clay-600)", marginBottom: 20 }}>
          — {eyebrow}
        </div>
      )}
      <h2 style={{
        fontFamily: "var(--f-display)", fontWeight: 400,
        fontSize: "clamp(38px, 5vw, 68px)", lineHeight: 1.02, letterSpacing: -0.5,
        color, margin: 0,
      }}>{title}</h2>
      {lead && (
        <p style={{ fontSize: 17, lineHeight: 1.6, color: "var(--espresso-800)", opacity: 0.8, marginTop: 20, maxWidth: 620 }}>
          {lead}
        </p>
      )}
    </div>
  );
}

// ---------- Card ----------
function Card({ children, tone = "paper", style, onClick, hoverable }) {
  const tones = {
    paper: { bg: "var(--paper)", fg: "var(--ink)", border: "var(--hairline)" },
    sand: { bg: "var(--sand-100)", fg: "var(--ink)", border: "var(--hairline)" },
    walnut: { bg: "var(--walnut-700)", fg: "var(--paper)", border: "transparent" },
    sage: { bg: "var(--sage-500)", fg: "var(--paper)", border: "transparent" },
    terra: { bg: "var(--terracotta-500)", fg: "var(--paper)", border: "transparent" },
    espresso: { bg: "var(--espresso-800)", fg: "var(--paper)", border: "transparent" },
  };
  const t = tones[tone];
  const [hover, setHover] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: t.bg, color: t.fg,
        border: `1px solid ${t.border}`,
        borderRadius: "var(--r-lg)",
        padding: 28,
        boxShadow: hoverable && hover ? "var(--sh-3)" : "var(--sh-1)",
        transform: hoverable && hover ? "translateY(-4px)" : "none",
        transition: "all .25s ease",
        cursor: onClick ? "pointer" : "default",
        ...style,
      }}
    >{children}</div>
  );
}

// ---------- Divider ----------
function Hairline({ label, style }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16, ...style }}>
      <div style={{ flex: 1, height: 1, background: "var(--hairline)" }} />
      {label && (
        <span style={{ fontFamily: "var(--f-mono)", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "var(--clay-600)" }}>{label}</span>
      )}
      <div style={{ flex: 1, height: 1, background: "var(--hairline)" }} />
    </div>
  );
}

// ---------- Icon (line) ----------
function Icon({ name, size = 22, color = "currentColor", strokeWidth = 1.5 }) {
  const paths = {
    heart: "M12 21s-7-4.5-7-11a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 6.5-7 11-7 11z",
    leaf: "M5 19c7 1 14-5 14-14-7 0-14 5-14 14zM5 19c2-4 6-8 10-10",
    calendar: "M3 7h18v13H3zM3 7l0-3M21 7l0-3M8 3v4M16 3v4M3 11h18",
    user: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 20c0-4 4-6 8-6s8 2 8 6",
    arrow: "M5 12h14M13 6l6 6-6 6",
    check: "M5 12l5 5L20 7",
    clock: "M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18zM12 7v5l3 2",
    moon: "M21 13A9 9 0 1 1 11 3a7 7 0 0 0 10 10z",
    flame: "M12 3s6 6 6 11a6 6 0 0 1-12 0c0-2 1-3 2-4-1-2 0-5 4-7zM12 21a3 3 0 0 1-3-3c0-2 3-4 3-4s3 2 3 4a3 3 0 0 1-3 3z",
    dumbbell: "M3 10v4M7 7v10M17 7v10M21 10v4M7 12h10",
    sparkle: "M12 3v6M12 15v6M3 12h6M15 12h6M5 5l4 4M15 15l4 4M19 5l-4 4M9 15l-4 4",
    phone: "M5 3h4l2 5-3 2a11 11 0 0 0 6 6l2-3 5 2v4a2 2 0 0 1-2 2A17 17 0 0 1 3 5a2 2 0 0 1 2-2z",
    mail: "M3 6h18v12H3zM3 6l9 7 9-7",
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d={paths[name] || paths.sparkle} />
    </svg>
  );
}

Object.assign(window, { M3SLogo, Btn, Chip, Section, EyebrowTitle, Card, Hairline, Icon });
