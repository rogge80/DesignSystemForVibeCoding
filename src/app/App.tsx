import { useState } from "react";
import {
  Copy, Check, ChevronRight, Terminal, Zap, Code2, ArrowRight, Sparkles,
  Info, AlertTriangle, CheckCircle2, XCircle, Clock, Search, Bell, User,
  Menu, Home, BookOpen, Layers, Settings, ExternalLink
} from "lucide-react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import logoBverw from "@/imports/logo_bverw.png";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function cx(...cls: (string | false | null | undefined)[]) {
  return cls.filter(Boolean).join(" ");
}

function useCopy(text: string) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return { copied, copy };
}

// ─── Design tokens (mirrors Oblique CSS vars) ─────────────────────────────────

const OB = {
  blue:      "#2379a4",
  blueHover: "#236487",
  bluePress: "#255069",
  red:       "#ff0000",
  bgPage:    "#f0f4f7",
  bgHigh:    "#dfe4e9",
  bgCard:    "#ffffff",
  fgHigh:    "#131b22",
  fgMed:     "#263645",
  fgLow:     "#2f4356",
  fgMuted:   "#596978",
  fgDisabled:"rgba(19,27,34,0.4)",
  border:    "#acb4bd",
  borderSub: "#dfe4e9",
  shadow:    "0 1px 3px rgba(19,27,34,0.05), 0 4px 8px rgba(19,27,34,0.08)",
  shadowHov: "0 -5px 6px rgba(19,27,34,0.04), 0 15px 20px rgba(19,27,34,0.12)",
  focus:     "#8b5cf6",
  font:      '"Noto Sans", system-ui, sans-serif',
  mono:      '"Noto Sans Mono", monospace',
  radius:    "1px",
  radiusLg:  "4px",
} as const;

// ─── Oblique Button ───────────────────────────────────────────────────────────

type BtnVariant = "primary" | "secondary" | "ghost" | "danger" | "brand";
type BtnSize    = "sm" | "md" | "lg";

function ObBtn({
  variant = "primary",
  size = "md",
  icon,
  children,
  disabled = false,
  onClick,
}: {
  variant?: BtnVariant;
  size?: BtnSize;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
}) {
  const [hov, setHov] = useState(false);
  const [press, setPress] = useState(false);

  const pad: Record<BtnSize, string> = {
    sm: "5px 10px",
    md: "6px 12px",
    lg: "8px 16px",
  };
  const fs: Record<BtnSize, string> = { sm: "0.875rem", md: "1rem", lg: "1.125rem" };

  const base: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    fontFamily: OB.font,
    fontWeight: 500,
    fontSize: fs[size],
    letterSpacing: "0.5px",
    lineHeight: "1rem",
    padding: pad[size],
    borderRadius: OB.radius,
    border: `1px solid transparent`,
    cursor: disabled ? "not-allowed" : "pointer",
    transition: "background 200ms cubic-bezier(0,0,0.2,1), box-shadow 200ms cubic-bezier(0,0,0.2,1)",
    outline: "none",
  };

  const colors: Record<BtnVariant, React.CSSProperties> = {
    primary: {
      background: disabled ? "rgba(19,27,34,0.1)" : press ? OB.bluePress : hov ? OB.blueHover : OB.blue,
      color: disabled ? OB.fgDisabled : "#ffffff",
      borderColor: "transparent",
      boxShadow: hov && !disabled ? OB.shadowHov : "none",
    },
    secondary: {
      background: disabled ? "rgba(19,27,34,0.1)" : press ? OB.bgHigh : hov ? OB.bgHigh : OB.bgCard,
      color: disabled ? OB.fgDisabled : OB.fgHigh,
      borderColor: disabled ? "transparent" : OB.border,
      boxShadow: hov && !disabled ? OB.shadowHov : "none",
    },
    ghost: {
      background: "transparent",
      color: disabled ? OB.fgDisabled : press ? OB.bluePress : hov ? OB.blueHover : OB.blue,
      borderColor: "transparent",
    },
    danger: {
      background: disabled ? "rgba(19,27,34,0.1)" : press ? "#7a1419" : hov ? "#7a1419" : "#99191e",
      color: disabled ? OB.fgDisabled : "#ffffff",
      borderColor: "transparent",
      boxShadow: hov && !disabled ? OB.shadowHov : "none",
    },
    brand: {
      background: disabled ? "rgba(19,27,34,0.1)" : press ? "#cc0000" : hov ? "#dd0000" : OB.red,
      color: disabled ? OB.fgDisabled : "#ffffff",
      borderColor: "transparent",
      boxShadow: hov && !disabled ? OB.shadowHov : "none",
    },
  };

  return (
    <button
      style={{ ...base, ...colors[variant] }}
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => { setHov(false); setPress(false); }}
      onMouseDown={() => setPress(true)}
      onMouseUp={() => setPress(false)}
    >
      {icon}
      {children}
    </button>
  );
}

// ─── Badge ────────────────────────────────────────────────────────────────────

const STATUS_COLORS: Record<string, { bg: string; fg: string; dot: string }> = {
  info:      { bg: "#eff6ff", fg: "#1e3a8a", dot: "#3b82f6" },
  success:   { bg: "#ecfdf5", fg: "#065f46", dot: "#10b981" },
  warning:   { bg: "#fffbeb", fg: "#92400e", dot: "#f59e0b" },
  error:     { bg: "#ffedee", fg: "#99191e", dot: "#ef4444" },
  progress:  { bg: "#eef2ff", fg: "#3730a3", dot: "#6366f1" },
  scheduled: { bg: "#fdf2f8", fg: "#9d174d", dot: "#ec4899" },
  waiting:   { bg: "#f5f3ff", fg: "#5b21b6", dot: "#8b5cf6" },
  neutral:   { bg: OB.bgHigh,  fg: OB.fgMed,  dot: OB.border },
};

function ObBadge({ status = "neutral", children }: { status?: keyof typeof STATUS_COLORS; children: React.ReactNode }) {
  const c = STATUS_COLORS[status] ?? STATUS_COLORS.neutral;
  return (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      gap: "5px",
      padding: "2px 8px",
      borderRadius: OB.radius,
      background: c.bg,
      color: c.fg,
      fontFamily: OB.font,
      fontSize: "0.75rem",
      fontWeight: 600,
      letterSpacing: "0.5px",
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: c.dot, flexShrink: 0 }} />
      {children}
    </span>
  );
}

// ─── Code Block ──────────────────────────────────────────────────────────────

function CodeBlock({ code, language = "typescript" }: { code: string; language?: string }) {
  const { copied, copy } = useCopy(code);
  return (
    <div style={{ background: OB.fgHigh, borderRadius: OB.radiusLg, overflow: "hidden", border: `1px solid ${OB.fgMed}` }}>
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "8px 14px",
        borderBottom: `1px solid rgba(255,255,255,0.08)`,
        background: OB.fgMed,
      }}>
        <span style={{ fontFamily: OB.mono, fontSize: "11px", color: "rgba(255,255,255,0.45)", letterSpacing: "0.06em" }}>
          {language}
        </span>
        <button
          onClick={copy}
          style={{
            display: "flex", alignItems: "center", gap: "5px",
            fontFamily: OB.mono, fontSize: "11px",
            color: copied ? "#34d399" : "rgba(255,255,255,0.45)",
            background: "none", border: "none", cursor: "pointer",
            transition: "color 150ms",
          }}
        >
          {copied ? <Check size={11} /> : <Copy size={11} />}
          {copied ? "copied" : "copy"}
        </button>
      </div>
      <pre style={{ padding: "16px", margin: 0, fontFamily: OB.mono, fontSize: "13px", lineHeight: 1.7, color: "#e2e8f0", overflowX: "auto" }}>
        <code dangerouslySetInnerHTML={{ __html: highlightTS(code) }} />
      </pre>
    </div>
  );
}

function highlightTS(code: string): string {
  return code
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/(\/\/[^\n]*)/g, `<span style="color:#64748b">$1</span>`)
    .replace(/("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)/g, `<span style="color:#86efac">$1</span>`)
    .replace(/\b(import|from|export|const|let|await|async|return|for|of|type|interface)\b/g, `<span style="color:#93c5fd">$1</span>`)
    .replace(/\b(true|false|null|undefined)\b/g, `<span style="color:#fda4af">$1</span>`)
    .replace(/\b(\d+)\b/g, `<span style="color:#f9a8d4">$1</span>`);
}

// ─── Section wrapper ──────────────────────────────────────────────────────────

function SectionLabel({ n, label }: { n: string; label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "28px" }}>
      <span style={{ fontFamily: OB.mono, fontSize: "11px", color: OB.blue, fontWeight: 500, minWidth: "24px" }}>{n}</span>
      <div style={{ width: "1px", height: "16px", background: OB.border }} />
      <span style={{ fontFamily: OB.font, fontSize: "11px", fontWeight: 600, color: OB.fgMuted, letterSpacing: "0.12em", textTransform: "uppercase" }}>
        {label}
      </span>
    </div>
  );
}

function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      background: OB.bgCard,
      border: `1px solid ${OB.borderSub}`,
      borderRadius: OB.radiusLg,
      padding: "24px",
      ...style,
    }}>
      {children}
    </div>
  );
}

// ─── Master Layout Header (Oblique-style) ─────────────────────────────────────

function MasterHeader({ activeTab, setActiveTab }: { activeTab: string; setActiveTab: (t: string) => void }) {
  const tabs = ["Colors", "Typography", "Components", "Tokens", "Patterns"];
  return (
    <header style={{ background: OB.bgCard, borderBottom: `1px solid ${OB.border}`, position: "sticky", top: 0, zIndex: 100 }}>
      {/* Main header with official federal logo */}
      <div style={{ padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: "64px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <ImageWithFallback
            src={logoBverw}
            alt="Schweizerische Eidgenossenschaft – Confédération suisse – Confederazione Svizzera – Confederaziun svizra"
            style={{ height: "40px", width: "auto", objectFit: "contain" }}
          />
          <div style={{ width: "1px", height: "32px", background: OB.borderSub }} />
          <div>
            <p style={{ fontFamily: OB.font, fontSize: "14px", fontWeight: 700, color: OB.fgHigh, lineHeight: 1.2, margin: 0 }}>
              Vibe Coding with Claude
            </p>
            <p style={{ fontFamily: OB.mono, fontSize: "10px", color: OB.fgMuted, margin: 0 }}>Design System · oblique</p>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <Search size={16} style={{ color: OB.fgMuted }} />
          <div style={{ width: "1px", height: "20px", background: OB.borderSub, margin: "0 8px" }} />
          {["Home", "Docs", "Components", "GitHub"].map((item) => (
            <button key={item} style={{
              fontFamily: OB.font, fontSize: "13px", fontWeight: 500,
              color: OB.blue, background: "none", border: "none",
              padding: "6px 10px", cursor: "pointer", borderRadius: OB.radius,
              display: "flex", alignItems: "center", gap: "4px",
            }}>
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* Tab navigation */}
      <nav style={{ padding: "0 24px", display: "flex", gap: "0", borderTop: `1px solid ${OB.borderSub}` }}>
        {tabs.map((tab) => {
          const active = tab === activeTab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                fontFamily: OB.font, fontSize: "13px", fontWeight: active ? 600 : 500,
                color: active ? OB.blue : OB.fgMuted,
                background: "none", border: "none",
                borderBottom: active ? `2px solid ${OB.blue}` : "2px solid transparent",
                padding: "10px 16px",
                cursor: "pointer",
                transition: "color 150ms, border-color 150ms",
                marginBottom: "-1px",
              }}
            >
              {tab}
            </button>
          );
        })}
      </nav>
    </header>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section style={{ background: OB.fgHigh, padding: "56px 40px" }}>
      <div style={{ maxWidth: "960px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 320px", gap: "48px", alignItems: "center" }}>
        <div>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "6px",
            background: "rgba(35,121,164,0.25)", border: "1px solid rgba(35,121,164,0.4)",
            borderRadius: OB.radius, padding: "3px 10px", marginBottom: "24px",
          }}>
            <Sparkles size={11} style={{ color: "#7dd3fc" }} />
            <span style={{ fontFamily: OB.mono, fontSize: "11px", color: "#7dd3fc", letterSpacing: "0.06em" }}>
              oblique · v11 compatible
            </span>
          </div>
          <h1 style={{ fontFamily: OB.font, fontSize: "clamp(36px,5vw,60px)", fontWeight: 800, color: "#ffffff", lineHeight: 1.05, letterSpacing: "-0.5px", margin: "0 0 16px" }}>
            Vibe Coding<br />
            <span style={{ color: OB.red }}>with Claude</span>
          </h1>
          <p style={{ fontFamily: OB.font, fontSize: "16px", lineHeight: 1.7, color: "rgba(255,255,255,0.6)", maxWidth: "480px", margin: "0 0 28px" }}>
            A design system for AI-native developer tools, built on the Oblique design language of the Swiss Confederation.
          </p>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <ObBtn variant="primary" icon={<ArrowRight size={14} />}>Get started</ObBtn>
            <ObBtn variant="secondary" icon={<Code2 size={14} />}>View source</ObBtn>
          </div>
        </div>
        {/* Fake terminal card */}
        <div style={{
          background: OB.fgMed, borderRadius: OB.radiusLg,
          border: `1px solid rgba(255,255,255,0.08)`,
          overflow: "hidden",
        }}>
          <div style={{ padding: "10px 14px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", gap: "6px", alignItems: "center" }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#e8365d" }} />
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#e8901a" }} />
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#84cc16" }} />
            <span style={{ marginLeft: "8px", fontFamily: OB.mono, fontSize: "11px", color: "rgba(255,255,255,0.3)" }}>terminal</span>
          </div>
          <pre style={{ padding: "16px", margin: 0, fontFamily: OB.mono, fontSize: "12px", lineHeight: 1.7, color: "#94a3b8" }}>
            <span style={{ color: "#64748b" }}>{"// stream a response\n"}</span>
            <span style={{ color: "#93c5fd" }}>const</span>
            {" stream = "}
            <span style={{ color: "#93c5fd" }}>await</span>
            {"\n  client.messages\n  .stream({\n    model: "}
            <span style={{ color: "#86efac" }}>"claude-sonnet-4-6"</span>
            {",\n    messages: [{\n      role: "}
            <span style={{ color: "#86efac" }}>"user"</span>
            {",\n      content: prompt,\n    }],\n  });\n\n"}
            <span style={{ color: "#34d399" }}>▊</span>
          </pre>
        </div>
      </div>
    </section>
  );
}

// ─── 01 Colors ────────────────────────────────────────────────────────────────

const COLOR_GROUPS = [
  {
    title: "Brand & Interactive",
    items: [
      { name: "brand", value: "#ff0000", label: "Swiss Red", token: "--accent" },
      { name: "primary", value: "#2379a4", label: "Oblique Blue", token: "--primary" },
      { name: "hover",   value: "#236487", label: "Blue Hover",   token: "interaction-bg-hover" },
      { name: "press",   value: "#255069", label: "Blue Pressed",  token: "interaction-bg-pressed" },
    ],
  },
  {
    title: "Neutral — Normal",
    items: [
      { name: "bg-highest", value: "#ffffff", label: "BG Highest",  token: "neutral-bg-contrast_highest" },
      { name: "bg-high",    value: "#f0f4f7", label: "BG High",     token: "neutral-bg-contrast_high" },
      { name: "bg-med",     value: "#dfe4e9", label: "BG Medium",   token: "neutral-bg-contrast_medium" },
      { name: "bg-low",     value: "#acb4bd", label: "BG Low",      token: "neutral-bg-contrast_low" },
    ],
  },
  {
    title: "Foreground",
    items: [
      { name: "fg-highest", value: "#131b22", label: "FG Highest", token: "neutral-fg-contrast_highest" },
      { name: "fg-high",    value: "#1c2834", label: "FG High",    token: "neutral-fg-contrast_high" },
      { name: "fg-med",     value: "#263645", label: "FG Medium",  token: "neutral-fg-contrast_medium" },
      { name: "fg-low",     value: "#2f4356", label: "FG Low",     token: "neutral-fg-contrast_low" },
    ],
  },
  {
    title: "Status",
    items: [
      { name: "info",      value: "#1e3a8a", label: "Info",      token: "status-info-fg" },
      { name: "success",   value: "#065f46", label: "Resolved",  token: "status-resolved-fg" },
      { name: "warning",   value: "#92400e", label: "Pending",   token: "status-pending-fg" },
      { name: "error",     value: "#99191e", label: "Critical",  token: "status-critical-fg" },
    ],
  },
];

function ColorsSection() {
  return (
    <section style={{ padding: "40px 24px" }}>
      <div style={{ maxWidth: "960px", margin: "0 auto" }}>
        <SectionLabel n="01" label="Color Tokens" />
        <div style={{ display: "grid", gap: "24px" }}>
          {COLOR_GROUPS.map((group) => (
            <div key={group.title}>
              <p style={{ fontFamily: OB.font, fontSize: "12px", fontWeight: 600, color: OB.fgMuted, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "10px" }}>
                {group.title}
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "10px" }}>
                {group.items.map((c) => (
                  <div key={c.name} style={{ background: OB.bgCard, border: `1px solid ${OB.borderSub}`, borderRadius: OB.radiusLg, overflow: "hidden" }}>
                    <div style={{ height: "52px", background: c.value, borderBottom: `1px solid ${OB.borderSub}` }} />
                    <div style={{ padding: "10px 12px" }}>
                      <p style={{ fontFamily: OB.font, fontSize: "13px", fontWeight: 600, color: OB.fgHigh, margin: "0 0 2px" }}>{c.label}</p>
                      <p style={{ fontFamily: OB.mono, fontSize: "11px", color: OB.fgMuted, margin: "0 0 2px" }}>{c.value}</p>
                      <p style={{ fontFamily: OB.mono, fontSize: "10px", color: OB.border, margin: 0 }}>{c.token}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── 02 Typography ────────────────────────────────────────────────────────────

function TypographySection() {
  const scale = [
    { label: "5xl / 3rem",    fs: "3rem",     fw: 800,  ls: "-1.5px", text: "Ship it fast." },
    { label: "3xl / 2.125rem",fs: "2.125rem", fw: 700,  ls: "-1px",   text: "Design system" },
    { label: "xl / 1.4375rem",fs: "1.4375rem",fw: 700,  ls: "-0.5px", text: "Component library" },
    { label: "lg / 1.125rem", fs: "1.125rem", fw: 700,  ls: "auto",   text: "Token reference" },
    { label: "md / 1rem",     fs: "1rem",     fw: 500,  ls: "0.5px",  text: "Body text in Noto Sans. Readable and neutral." },
    { label: "sm / 0.875rem", fs: "0.875rem", fw: 400,  ls: "auto",   text: "Secondary text for captions, labels and descriptions." },
    { label: "xs / 0.75rem",  fs: "0.75rem",  fw: 600,  ls: "0.5px",  text: "BADGE · LABEL · STATUS" },
  ];

  return (
    <section style={{ padding: "40px 24px" }}>
      <div style={{ maxWidth: "960px", margin: "0 auto" }}>
        <SectionLabel n="02" label="Typography" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
          <Card>
            <p style={{ fontFamily: OB.mono, fontSize: "11px", color: OB.fgMuted, marginBottom: "16px" }}>Noto Sans — body &amp; headings</p>
            <p style={{ fontFamily: OB.font, fontSize: "80px", fontWeight: 800, lineHeight: 0.9, color: OB.fgHigh }}>Aa</p>
            <p style={{ fontFamily: OB.font, fontSize: "20px", fontWeight: 400, lineHeight: 1.2, color: OB.fgMed, marginTop: "12px" }}>ABCDEFGHIJKLMNOPQRSTUVWXYZ</p>
            <p style={{ fontFamily: OB.font, fontSize: "20px", fontWeight: 400, lineHeight: 1.2, color: OB.fgMuted }}>abcdefghijklmnopqrstuvwxyz</p>
            <p style={{ fontFamily: OB.font, fontSize: "20px", fontWeight: 400, lineHeight: 1.2, color: OB.border }}>0123456789 !@#$%^&amp;*()</p>
          </Card>
          <Card>
            <p style={{ fontFamily: OB.mono, fontSize: "11px", color: OB.fgMuted, marginBottom: "16px" }}>Noto Sans Mono — code &amp; labels</p>
            <p style={{ fontFamily: OB.mono, fontSize: "80px", fontWeight: 400, lineHeight: 0.9, color: OB.fgHigh }}>Aa</p>
            <p style={{ fontFamily: OB.mono, fontSize: "18px", fontWeight: 400, lineHeight: 1.2, color: OB.fgMed, marginTop: "12px" }}>ABCDEFGHIJKLMNOPQRSTUVWXYZ</p>
            <p style={{ fontFamily: OB.mono, fontSize: "18px", fontWeight: 400, lineHeight: 1.2, color: OB.fgMuted }}>abcdefghijklmnopqrstuvwxyz</p>
            <p style={{ fontFamily: OB.mono, fontSize: "18px", fontWeight: 400, lineHeight: 1.2, color: OB.border }}>0123456789 !@#$%^&amp;*()</p>
          </Card>
        </div>
        <Card style={{ marginTop: "20px" }}>
          <p style={{ fontFamily: OB.mono, fontSize: "11px", color: OB.fgMuted, marginBottom: "20px" }}>Type scale</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {scale.map((row) => (
              <div key={row.label} style={{ display: "flex", alignItems: "baseline", gap: "20px", borderBottom: `1px solid ${OB.borderSub}`, paddingBottom: "16px" }}>
                <span style={{ fontFamily: OB.mono, fontSize: "10px", color: OB.border, minWidth: "130px", flexShrink: 0 }}>{row.label}</span>
                <p style={{ fontFamily: OB.font, fontSize: row.fs, fontWeight: row.fw, letterSpacing: row.ls, color: OB.fgHigh, lineHeight: 1.1, margin: 0 }}>
                  {row.text}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </section>
  );
}

// ─── 03 Components ────────────────────────────────────────────────────────────

function ComponentsSection() {
  const [tab, setTab] = useState("Buttons");
  const [inputVal, setInputVal] = useState("");
  const [inputFocus, setInputFocus] = useState(false);
  const TABS = ["Buttons", "Badges", "Alerts", "Forms", "Navigation"];

  return (
    <section style={{ padding: "40px 24px" }}>
      <div style={{ maxWidth: "960px", margin: "0 auto" }}>
        <SectionLabel n="03" label="Components" />
        <div style={{ display: "flex", gap: "0", borderBottom: `1px solid ${OB.border}`, marginBottom: "24px" }}>
          {TABS.map((t) => (
            <button key={t} onClick={() => setTab(t)} style={{
              fontFamily: OB.font, fontSize: "13px", fontWeight: tab === t ? 600 : 500,
              color: tab === t ? OB.blue : OB.fgMuted,
              background: "none", border: "none",
              borderBottom: tab === t ? `2px solid ${OB.blue}` : "2px solid transparent",
              padding: "8px 14px", cursor: "pointer",
              marginBottom: "-1px", transition: "color 150ms",
            }}>{t}</button>
          ))}
        </div>

        {tab === "Buttons" && (
          <div style={{ display: "grid", gap: "24px" }}>
            {[
              { label: "Primary — default", els: [
                <ObBtn key="p1" variant="primary">Save changes</ObBtn>,
                <ObBtn key="p2" variant="primary" icon={<ArrowRight size={14} />}>Continue</ObBtn>,
                <ObBtn key="p3" variant="primary" disabled>Disabled</ObBtn>,
              ]},
              { label: "Secondary", els: [
                <ObBtn key="s1" variant="secondary">Cancel</ObBtn>,
                <ObBtn key="s2" variant="secondary" icon={<Code2 size={14} />}>View source</ObBtn>,
                <ObBtn key="s3" variant="secondary" disabled>Disabled</ObBtn>,
              ]},
              { label: "Ghost / text", els: [
                <ObBtn key="g1" variant="ghost">Learn more</ObBtn>,
                <ObBtn key="g2" variant="ghost" icon={<ExternalLink size={13} />}>Open in new tab</ObBtn>,
              ]},
              { label: "Danger", els: [
                <ObBtn key="d1" variant="danger">Delete</ObBtn>,
                <ObBtn key="d2" variant="danger" icon={<XCircle size={14} />}>Remove access</ObBtn>,
                <ObBtn key="d3" variant="danger" disabled>Disabled</ObBtn>,
              ]},
              { label: "Brand (Swiss Red)", els: [
                <ObBtn key="b1" variant="brand">Federal portal</ObBtn>,
                <ObBtn key="b2" variant="brand" icon={<ExternalLink size={13} />}>admin.ch</ObBtn>,
              ]},
              { label: "Sizes", els: [
                <ObBtn key="sz1" size="sm">Small</ObBtn>,
                <ObBtn key="sz2" size="md">Medium</ObBtn>,
                <ObBtn key="sz3" size="lg">Large</ObBtn>,
              ]},
            ].map(({ label, els }) => (
              <Card key={label}>
                <p style={{ fontFamily: OB.mono, fontSize: "11px", color: OB.fgMuted, marginBottom: "14px" }}>{label}</p>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>{els}</div>
              </Card>
            ))}
          </div>
        )}

        {tab === "Badges" && (
          <Card>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
              <div>
                <p style={{ fontFamily: OB.mono, fontSize: "11px", color: OB.fgMuted, marginBottom: "14px" }}>Status badges</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  <ObBadge status="info">Info</ObBadge>
                  <ObBadge status="success">Resolved</ObBadge>
                  <ObBadge status="warning">Pending</ObBadge>
                  <ObBadge status="error">Critical</ObBadge>
                  <ObBadge status="progress">In Progress</ObBadge>
                  <ObBadge status="scheduled">Scheduled</ObBadge>
                  <ObBadge status="waiting">Waiting</ObBadge>
                  <ObBadge status="neutral">Closed</ObBadge>
                </div>
              </div>
              <div>
                <p style={{ fontFamily: OB.mono, fontSize: "11px", color: OB.fgMuted, marginBottom: "14px" }}>Claude model tags</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  <ObBadge status="progress">claude-opus-4-8</ObBadge>
                  <ObBadge status="info">claude-sonnet-4-6</ObBadge>
                  <ObBadge status="success">claude-haiku-4-5</ObBadge>
                  <ObBadge status="waiting">streaming</ObBadge>
                  <ObBadge status="scheduled">cached</ObBadge>
                  <ObBadge status="warning">tool use</ObBadge>
                </div>
              </div>
            </div>
          </Card>
        )}

        {tab === "Alerts" && (
          <div style={{ display: "grid", gap: "10px" }}>
            {([
              { type: "info",    icon: <Info size={16} />,          bg: "#eff6ff", fg: "#1e3a8a", border: "#bfdbfe", title: "Info",      msg: "Your API key has been rotated. Update your .env file." },
              { type: "success", icon: <CheckCircle2 size={16} />,  bg: "#ecfdf5", fg: "#065f46", border: "#a7f3d0", title: "Success",   msg: "Deployment completed successfully in 3.2s." },
              { type: "warning", icon: <AlertTriangle size={16} />, bg: "#fffbeb", fg: "#92400e", border: "#fde68a", title: "Warning",   msg: "Rate limit approaching. 80% of monthly tokens used." },
              { type: "error",   icon: <XCircle size={16} />,       bg: "#ffedee", fg: "#99191e", border: "#fecaca", title: "Error",     msg: "Request failed: model overloaded. Retry in 30s." },
            ] as const).map((a) => (
              <div key={a.type} style={{
                display: "flex", gap: "12px", alignItems: "flex-start",
                padding: "14px 16px",
                background: a.bg, border: `1px solid ${a.border}`,
                borderRadius: OB.radiusLg, borderLeft: `3px solid ${a.fg}`,
              }}>
                <span style={{ color: a.fg, flexShrink: 0, marginTop: "1px" }}>{a.icon}</span>
                <div>
                  <p style={{ fontFamily: OB.font, fontSize: "13px", fontWeight: 700, color: a.fg, margin: "0 0 2px" }}>{a.title}</p>
                  <p style={{ fontFamily: OB.font, fontSize: "13px", color: a.fg, margin: 0, opacity: 0.85 }}>{a.msg}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "Forms" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            <Card>
              <p style={{ fontFamily: OB.mono, fontSize: "11px", color: OB.fgMuted, marginBottom: "20px" }}>Input field</p>
              <div style={{ marginBottom: "16px" }}>
                <label style={{ fontFamily: OB.font, fontSize: "12px", fontWeight: 600, color: OB.fgMed, display: "block", marginBottom: "5px" }}>
                  API KEY <span style={{ color: OB.blue }}>*</span>
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    placeholder="sk-ant-..."
                    onFocus={() => setInputFocus(true)}
                    onBlur={() => setInputFocus(false)}
                    style={{
                      width: "100%", padding: "8px 36px 8px 10px",
                      fontFamily: OB.mono, fontSize: "13px", color: OB.fgHigh,
                      background: OB.bgCard,
                      border: `1px solid ${inputFocus ? OB.blue : OB.border}`,
                      borderRadius: OB.radius,
                      outline: inputFocus ? `3px solid ${OB.focus}` : "none",
                      outlineOffset: "2px",
                      boxSizing: "border-box",
                    }}
                  />
                  <Zap size={13} style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: OB.border }} />
                </div>
                <p style={{ fontFamily: OB.font, fontSize: "12px", color: OB.fgMuted, marginTop: "4px" }}>
                  Found at console.anthropic.com
                </p>
              </div>
              <div>
                <label style={{ fontFamily: OB.font, fontSize: "12px", fontWeight: 600, color: OB.fgMed, display: "block", marginBottom: "5px" }}>
                  MODEL
                </label>
                <select style={{
                  width: "100%", padding: "8px 10px",
                  fontFamily: OB.font, fontSize: "13px", color: OB.fgHigh,
                  background: OB.bgCard, border: `1px solid ${OB.border}`,
                  borderRadius: OB.radius, outline: "none",
                }}>
                  <option>claude-sonnet-4-6</option>
                  <option>claude-opus-4-8</option>
                  <option>claude-haiku-4-5</option>
                </select>
              </div>
            </Card>
            <Card>
              <p style={{ fontFamily: OB.mono, fontSize: "11px", color: OB.fgMuted, marginBottom: "20px" }}>Checkbox &amp; radio</p>
              {["Prompt caching enabled", "Streaming mode", "Tool use", "Extended thinking"].map((label, i) => (
                <label key={label} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px", cursor: "pointer" }}>
                  <input type="checkbox" defaultChecked={i < 2} style={{ width: "16px", height: "16px", accentColor: OB.blue, cursor: "pointer" }} />
                  <span style={{ fontFamily: OB.font, fontSize: "14px", color: OB.fgHigh }}>{label}</span>
                </label>
              ))}
            </Card>
          </div>
        )}

        {tab === "Navigation" && (
          <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: "20px" }}>
            {/* Sidebar nav */}
            <Card style={{ padding: "12px" }}>
              <p style={{ fontFamily: OB.mono, fontSize: "10px", color: OB.fgMuted, padding: "6px 10px", marginBottom: "4px" }}>NAVIGATION</p>
              {[
                { icon: <Home size={15} />, label: "Overview", active: true },
                { icon: <Layers size={15} />, label: "Components" },
                { icon: <BookOpen size={15} />, label: "Guidelines" },
                { icon: <Code2 size={15} />, label: "API Reference" },
                { icon: <Settings size={15} />, label: "Settings" },
              ].map(({ icon, label, active }) => (
                <div key={label} style={{
                  display: "flex", alignItems: "center", gap: "10px",
                  padding: "8px 10px", borderRadius: OB.radius,
                  background: active ? "rgba(35,121,164,0.1)" : "transparent",
                  borderLeft: active ? `2px solid ${OB.blue}` : "2px solid transparent",
                  cursor: "pointer", marginBottom: "2px",
                  color: active ? OB.blue : OB.fgMuted,
                }}>
                  {icon}
                  <span style={{ fontFamily: OB.font, fontSize: "13px", fontWeight: active ? 600 : 400 }}>{label}</span>
                </div>
              ))}
            </Card>
            {/* Breadcrumb + content */}
            <div>
              <Card style={{ marginBottom: "16px", padding: "12px 16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  {["Home", "Components", "Button"].map((crumb, i, arr) => (
                    <span key={crumb} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <span style={{
                        fontFamily: OB.font, fontSize: "12px",
                        color: i < arr.length - 1 ? OB.blue : OB.fgMuted,
                        fontWeight: i === arr.length - 1 ? 600 : 400,
                        cursor: i < arr.length - 1 ? "pointer" : "default",
                        textDecoration: i < arr.length - 1 ? "underline" : "none",
                      }}>{crumb}</span>
                      {i < arr.length - 1 && <ChevronRight size={11} style={{ color: OB.border }} />}
                    </span>
                  ))}
                </div>
              </Card>
              <Card>
                <p style={{ fontFamily: OB.mono, fontSize: "11px", color: OB.fgMuted, marginBottom: "12px" }}>Pagination</p>
                <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
                  {["‹", "1", "2", "3", "…", "12", "›"].map((p, i) => (
                    <button key={i} style={{
                      width: "32px", height: "32px",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontFamily: OB.font, fontSize: "13px", fontWeight: p === "2" ? 700 : 400,
                      color: p === "2" ? "#ffffff" : OB.blue,
                      background: p === "2" ? OB.blue : "transparent",
                      border: `1px solid ${p === "2" ? OB.blue : OB.border}`,
                      borderRadius: OB.radius, cursor: "pointer",
                    }}>{p}</button>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// ─── 04 Tokens ────────────────────────────────────────────────────────────────

function TokensSection() {
  const rows = [
    { token: "--background",       value: "#f0f4f7",   tw: "bg-background",        desc: "Page ground" },
    { token: "--foreground",       value: "#131b22",   tw: "text-foreground",       desc: "Body text" },
    { token: "--card",             value: "#ffffff",   tw: "bg-card",              desc: "Card / panel" },
    { token: "--primary",          value: "#2379a4",   tw: "bg-primary",           desc: "Swiss Blue — interactive" },
    { token: "--accent",           value: "#ff0000",   tw: "bg-accent",            desc: "Swiss Red — brand" },
    { token: "--secondary",        value: "#dfe4e9",   tw: "bg-secondary",         desc: "Neutral surface" },
    { token: "--muted",            value: "#f0f4f7",   tw: "bg-muted",             desc: "Subdued surface" },
    { token: "--muted-foreground", value: "#596978",   tw: "text-muted-foreground",desc: "Captions, hints" },
    { token: "--border",           value: "#acb4bd",   tw: "border-border",        desc: "Hairline rule" },
    { token: "--ring",             value: "#8b5cf6",   tw: "outline-ring",         desc: "Focus ring" },
    { token: "--radius",           value: "0.0625rem", tw: "rounded",              desc: "Default border radius (1px)" },
    { token: "--destructive",      value: "#99191e",   tw: "bg-destructive",       desc: "Danger / error" },
  ];

  return (
    <section style={{ padding: "40px 24px" }}>
      <div style={{ maxWidth: "960px", margin: "0 auto" }}>
        <SectionLabel n="04" label="Token Reference" />
        <div style={{ border: `1px solid ${OB.borderSub}`, borderRadius: OB.radiusLg, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: OB.bgHigh, borderBottom: `1px solid ${OB.border}` }}>
                {["CSS Variable", "Value", "Tailwind class", "Description"].map((h) => (
                  <th key={h} style={{ padding: "9px 14px", textAlign: "left", fontFamily: OB.mono, fontSize: "10px", color: OB.fgMuted, letterSpacing: "0.08em", fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={row.token} style={{ borderBottom: i < rows.length - 1 ? `1px solid ${OB.borderSub}` : "none", background: OB.bgCard }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = OB.bgPage)}
                  onMouseLeave={(e) => (e.currentTarget.style.background = OB.bgCard)}
                >
                  <td style={{ padding: "9px 14px", fontFamily: OB.mono, fontSize: "12px", color: OB.blue }}>{row.token}</td>
                  <td style={{ padding: "9px 14px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <div style={{ width: "14px", height: "14px", borderRadius: "2px", background: row.value, border: `1px solid ${OB.borderSub}`, flexShrink: 0 }} />
                      <span style={{ fontFamily: OB.mono, fontSize: "12px", color: OB.fgMuted }}>{row.value}</span>
                    </div>
                  </td>
                  <td style={{ padding: "9px 14px", fontFamily: OB.mono, fontSize: "12px", color: "#065f46" }}>{row.tw}</td>
                  <td style={{ padding: "9px 14px", fontFamily: OB.font, fontSize: "13px", color: OB.fgMuted }}>{row.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Border radius showcase */}
        <Card style={{ marginTop: "20px" }}>
          <p style={{ fontFamily: OB.mono, fontSize: "11px", color: OB.fgMuted, marginBottom: "16px" }}>Border radius scale (Oblique)</p>
          <div style={{ display: "flex", gap: "20px", alignItems: "flex-end", flexWrap: "wrap" }}>
            {[
              { label: "none", r: "0px",    size: 40 },
              { label: "sm",   r: "1px",    size: 40 },
              { label: "md",   r: "2px",    size: 40 },
              { label: "lg",   r: "4px",    size: 40 },
              { label: "rounded",r: "999px",size: 40 },
            ].map((item) => (
              <div key={item.label} style={{ textAlign: "center" }}>
                <div style={{ width: item.size, height: item.size, background: OB.blue, borderRadius: item.r, margin: "0 auto 6px" }} />
                <p style={{ fontFamily: OB.mono, fontSize: "10px", color: OB.fgMuted }}>{item.label}</p>
                <p style={{ fontFamily: OB.mono, fontSize: "10px", color: OB.border }}>{item.r}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </section>
  );
}

// ─── 05 Patterns ─────────────────────────────────────────────────────────────

const PATTERNS = [
  {
    label: "stream response",
    lang: "typescript",
    code: `import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

const stream = await client.messages.stream({
  model: "claude-sonnet-4-6",
  max_tokens: 1024,
  messages: [{ role: "user", content: "Write a haiku about coding." }],
});

for await (const event of stream) {
  if (event.type === "content_block_delta") {
    process.stdout.write(event.delta.text);
  }
}`,
  },
  {
    label: "tool use",
    lang: "typescript",
    code: `const response = await client.messages.create({
  model: "claude-sonnet-4-6",
  max_tokens: 1024,
  tools: [{
    name: "get_weather",
    description: "Get the current weather for a location.",
    input_schema: {
      type: "object",
      properties: {
        location: { type: "string", description: "City name" },
      },
      required: ["location"],
    },
  }],
  messages: [{ role: "user", content: "What's the weather in Bern?" }],
});`,
  },
  {
    label: "prompt caching",
    lang: "typescript",
    code: `const response = await client.messages.create({
  model: "claude-sonnet-4-6",
  max_tokens: 1024,
  system: [{
    type: "text",
    text: veryLongSystemPrompt,
    cache_control: { type: "ephemeral" }, // cache this prefix
  }],
  messages: [{ role: "user", content: userMessage }],
});

// Check cache efficiency
const { cache_read_input_tokens, cache_creation_input_tokens } =
  response.usage;
console.log("Cache read:", cache_read_input_tokens);`,
  },
  {
    label: "extended thinking",
    lang: "typescript",
    code: `const response = await client.messages.create({
  model: "claude-sonnet-4-6",
  max_tokens: 16000,
  thinking: {
    type: "enabled",
    budget_tokens: 10000, // thinking budget
  },
  messages: [{
    role: "user",
    content: "Solve this step by step: ...",
  }],
});

// Thinking blocks appear before text blocks
for (const block of response.content) {
  if (block.type === "thinking") {
    console.log("Thought:", block.thinking);
  }
}`,
  },
];

function PatternsSection() {
  const [active, setActive] = useState(0);
  return (
    <section style={{ padding: "40px 24px" }}>
      <div style={{ maxWidth: "960px", margin: "0 auto" }}>
        <SectionLabel n="05" label="Code Patterns" />
        <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: "16px" }}>
          <Card style={{ padding: "8px" }}>
            {PATTERNS.map((p, i) => (
              <button
                key={p.label}
                onClick={() => setActive(i)}
                style={{
                  display: "block", width: "100%", textAlign: "left",
                  padding: "9px 12px",
                  borderRadius: OB.radius,
                  background: active === i ? "rgba(35,121,164,0.1)" : "transparent",
                  borderLeft: active === i ? `2px solid ${OB.blue}` : "2px solid transparent",
                  fontFamily: OB.mono, fontSize: "12px",
                  color: active === i ? OB.blue : OB.fgMuted,
                  cursor: "pointer", marginBottom: "2px",
                  border: "none",
                }}
              >{p.label}</button>
            ))}
          </Card>
          <CodeBlock code={PATTERNS[active].code} language={PATTERNS[active].lang} />
        </div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer style={{ background: OB.fgHigh, borderTop: `1px solid rgba(255,255,255,0.06)`, padding: "20px 24px" }}>
      <div style={{ maxWidth: "960px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "28px", height: "28px", background: OB.blue, borderRadius: OB.radius }}>
            <Terminal size={13} style={{ color: "#fff" }} />
          </div>
          <span style={{ fontFamily: OB.font, fontSize: "13px", color: "rgba(255,255,255,0.5)" }}>
            Vibe Coding with Claude — Design System · Built on Oblique v11
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <ObBadge status="progress">claude-sonnet-4-6</ObBadge>
          <span style={{ fontFamily: OB.mono, fontSize: "11px", color: "rgba(255,255,255,0.3)" }}>© 2026 Schweizerische Eidgenossenschaft</span>
        </div>
      </div>
    </footer>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

const SECTIONS: Record<string, React.ReactNode> = {
  Colors:     <ColorsSection />,
  Typography: <TypographySection />,
  Components: <ComponentsSection />,
  Tokens:     <TokensSection />,
  Patterns:   <PatternsSection />,
};

export default function App() {
  const [tab, setTab] = useState("Colors");
  return (
    <div style={{ fontFamily: OB.font, background: OB.bgPage, minHeight: "100vh" }}>
      <MasterHeader activeTab={tab} setActiveTab={setTab} />
      <Hero />
      <main>{SECTIONS[tab]}</main>
      <Footer />
    </div>
  );
}
