import * as React from "react";

type ChipVariant = "default" | "saffron" | "sage" | "gold" | "plum";
export function Chip({ children, variant = "default" }: { children: React.ReactNode; variant?: ChipVariant }) {
  const cls = variant === "default" ? "chip" : `chip chip-${variant}`;
  return <span className={cls}>{children}</span>;
}

type NumColor = "saffron" | "sage" | "gold" | "plum" | "ink";
export function NumPill({ n, color = "saffron" }: { n: React.ReactNode; color?: NumColor }) {
  const map: Record<NumColor, { bg: string; fg: string }> = {
    saffron: { bg: "var(--saffron-100)", fg: "var(--saffron-700)" },
    sage:    { bg: "#E2EBE0",            fg: "#3D5C3B" },
    gold:    { bg: "#F2E5BD",            fg: "#6E5418" },
    plum:    { bg: "#E5D6E7",            fg: "#4A2D4D" },
    ink:     { bg: "var(--ink-100)",     fg: "var(--ink-700)" },
  };
  const m = map[color];
  return <span className="num-badge" style={{ background: m.bg, color: m.fg }}>{n}</span>;
}

export function ProgressBar({
  value, max = 100,
  color = "var(--saffron-500)", track = "var(--ink-200)",
}: { value: number; max?: number; color?: string; track?: string }) {
  return (
    <div style={{ background: track, height: 6, borderRadius: 99, overflow: "hidden" }}>
      <div style={{ width: `${(value / max) * 100}%`, height: "100%", background: color, borderRadius: 99 }} />
    </div>
  );
}

export function ProgressRing({
  value = 0, size = 56, stroke = 5, color = "var(--saffron-500)",
}: { value?: number; size?: number; stroke?: number; color?: string }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const off = c * (1 - value / 100);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size / 2} cy={size / 2} r={r} stroke="var(--ink-200)" strokeWidth={stroke} fill="none" />
      <circle cx={size / 2} cy={size / 2} r={r} stroke={color} strokeWidth={stroke} fill="none"
              strokeDasharray={c} strokeDashoffset={off} strokeLinecap="round"
              transform={`rotate(-90 ${size / 2} ${size / 2})`} />
      <text x="50%" y="52%" textAnchor="middle" dominantBaseline="middle"
            fontFamily="var(--font-en)" fontSize={size * 0.3} fontWeight="600" fill="var(--ink-900)">
        {value}%
      </text>
    </svg>
  );
}

export function DualLabel({
  en, th, color = "var(--saffron-600)",
}: { en: string; th: string; color?: string }) {
  return (
    <div>
      <div style={{
        fontFamily: "var(--font-en)", fontSize: 11, fontWeight: 700,
        letterSpacing: "0.1em", textTransform: "uppercase", color,
      }}>{en}</div>
      <div style={{ fontSize: 18, fontWeight: 600, color: "var(--ink-900)", marginTop: 2 }}>{th}</div>
    </div>
  );
}

export function SectionHeader({
  title, en, action,
}: { title: string; en?: string; action?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", margin: "14px 0 12px" }}>
      <div>
        {en && <div style={{
          fontFamily: "var(--font-en)", fontSize: 10, fontWeight: 700,
          letterSpacing: "0.12em", color: "var(--ink-500)",
        }}>{en}</div>}
        <div style={{ fontSize: 17, fontWeight: 600, marginTop: 2 }}>{title}</div>
      </div>
      {action && <span style={{ fontSize: 13, color: "var(--saffron-600)", fontWeight: 500 }}>{action}</span>}
    </div>
  );
}

export function Toggle({ on }: { on: boolean }) {
  return (
    <div style={{
      width: 36, height: 22, borderRadius: 11,
      background: on ? "var(--saffron-500)" : "var(--ink-200)",
      position: "relative", flex: "0 0 auto",
    }}>
      <div style={{
        position: "absolute", top: 2, left: on ? 16 : 2,
        width: 18, height: 18, borderRadius: 9, background: "#fff",
        boxShadow: "0 1px 2px rgba(0,0,0,0.15)",
      }} />
    </div>
  );
}
