import { useEffect, useState } from "react";

export function trustColor(score) {
  if (score >= 80) return "#2E9E5B";
  if (score >= 60) return "#D6A61A";
  return "#C4472A";
}
export function trustLabelKey(score) {
  if (score >= 80) return "high";
  if (score >= 60) return "mid";
  return "low";
}
export function trustTone(score) {
  const k = trustLabelKey(score);
  return k === "high" ? "trust" : k === "mid" ? "gold" : "warn";
}

export function TrustGauge({ score, size = 120, strokeWidth = 12, showLabel = true }) {
  const r = (size - strokeWidth) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, score)) / 100;
  const color = trustColor(score);
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#E4EAE8" strokeWidth={strokeWidth} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={strokeWidth}
          strokeDasharray={c} strokeDashoffset={c * (1 - pct)} strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1s cubic-bezier(.4,0,.2,1)" }} />
      </svg>
      {showLabel && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono" style={{ fontSize: size * 0.26, fontWeight: 700, color: "#0B2B2B", lineHeight: 1 }}>{score}</span>
          <span style={{ fontSize: size * 0.09, color: "#5B7370", fontWeight: 600 }}>/100</span>
        </div>
      )}
    </div>
  );
}

export function MiniBar({ label, value }) {
  const color = trustColor(value);
  return (
    <div className="mb-3">
      <div className="flex justify-between mb-1">
        <span style={{ fontSize: 13, color: "#3A504D", fontWeight: 500 }}>{label}</span>
        <span className="font-mono" style={{ fontSize: 13, fontWeight: 700, color }}>{value}/100</span>
      </div>
      <div style={{ height: 8, background: "#E4EAE8", borderRadius: 999 }}>
        <div style={{ width: `${value}%`, height: "100%", background: color, borderRadius: 999, transition: "width 1s ease" }} />
      </div>
    </div>
  );
}

const BADGE_TONES = {
  trust: { bg: "#E4F4F1", fg: "#0E7C7B" },
  warn: { bg: "#FBEAE5", fg: "#C4472A" },
  gold: { bg: "#FAF0DC", fg: "#9C6A16" },
  deep: { bg: "#E8EEF3", fg: "#0B3D5C" },
};

export function Badge({ children, tone = "trust" }) {
  const c = BADGE_TONES[tone];
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full font-semibold"
      style={{ background: c.bg, color: c.fg, fontSize: 12, padding: "3px 9px" }}
    >
      {children}
    </span>
  );
}

export function AnimatedNumber({ value, animate }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!animate) return;
    let start = null;
    const dur = 1400;
    function step(ts) {
      if (!start) start = ts;
      const p = Math.min(1, (ts - start) / dur);
      setN(Math.floor(value * (1 - Math.pow(1 - p, 3))));
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }, [animate, value]);
  return <>{n.toLocaleString()}</>;
}
