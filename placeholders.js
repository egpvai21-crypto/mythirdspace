// Subtle striped SVG placeholders for imagery.
window.Placeholder = function ({ label = "image", w = 800, h = 500, tone = "walnut", style = {} }) {
  const palettes = {
    walnut:   ["#5E4228", "#6B4D31"],
    sand:     ["#EADBC4", "#E2D0B3"],
    sage:     ["#7B8B6F", "#8A9A7E"],
    terra:    ["#B86B4B", "#C27A5C"],
    clay:     ["#A8825A", "#B6906A"],
    espresso: ["#3E2C1C", "#4B3825"],
  };
  const [a, b] = palettes[tone] || palettes.walnut;
  const id = "p_" + Math.random().toString(36).slice(2, 7);
  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid slice" width="100%" height="100%" role="img" aria-label="${label}">
    <defs>
      <pattern id="${id}" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <rect width="14" height="14" fill="${a}"/>
        <line x1="0" y1="0" x2="0" y2="14" stroke="${b}" stroke-width="6"/>
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#${id})"/>
  </svg>`;
  return React.createElement("div", {
    style: {
      position: "relative",
      width: "100%", height: "100%",
      overflow: "hidden",
      background: a,
      ...style,
    },
    dangerouslySetInnerHTML: undefined,
  },
    React.createElement("div", {
      style: { position: "absolute", inset: 0 },
      dangerouslySetInnerHTML: { __html: svg }
    }),
    label ? React.createElement("div", {
      style: {
        position: "absolute", left: 12, bottom: 10,
        fontFamily: "var(--f-mono)", fontSize: 11, letterSpacing: 0.5,
        color: "rgba(255,253,248,0.85)", textTransform: "uppercase",
        background: "rgba(30,20,14,0.35)", padding: "4px 8px", borderRadius: 4,
        backdropFilter: "blur(2px)"
      }
    }, `[${label}]`) : null
  );
};
