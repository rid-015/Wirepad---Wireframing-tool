import { createElement as h, type CSSProperties, type ReactNode } from "react";
import type { WireElement } from "@/lib/component-registry";
import { Icon } from "./icon";

const BW = "1.5px";
const INK = "#2b2b2b", SOFT = "#a3a29c", FILL = "#ebeae4", LINE = "#d8d7d0", PAPER = "#fffefa";

type Child = ReactNode;

/** Draws one wireframe element filling its positioned box. Built with createElement to keep variadic children key-free. */
export function renderElement(el: WireElement): ReactNode {
  const W = el.w, H = el.h, p = el.props || {};
  const I = (n: string, s = 16, c = INK, w = 2) => h(Icon, { name: n, size: s, color: c, strokeWidth: w });
  const d = (style: CSSProperties, ...ch: Child[]) => h("div", { style }, ...ch);
  const fs = (n: number) => Math.round(n * 0.86);
  const bx = (x: CSSProperties = {}): CSSProperties => ({ boxSizing: "border-box", border: `${BW} solid ${INK}`, borderRadius: 6, ...x });
  const bs = (x: CSSProperties = {}): CSSProperties => ({ boxSizing: "border-box", border: `${BW} solid ${INK}`, borderRadius: 3, ...x });
  const full: CSSProperties = { position: "absolute", inset: 0, boxSizing: "border-box" };
  const fc: CSSProperties = { display: "flex", alignItems: "center" };
  const ln = (w: string, x: CSSProperties = {}) => d({ height: 6, width: w, background: LINE, borderRadius: 3, flexShrink: 0, ...x });
  const tx = (t: Child, x: CSSProperties = {}) => d({ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", minWidth: 0, ...x }, t);
  const its = () => String(p.items ?? "").split(",").map((s) => s.trim()).filter(Boolean);
  const xl = (c = SOFT) =>
    h("svg", { style: { position: "absolute", inset: 0, width: "100%", height: "100%" }, preserveAspectRatio: "none", viewBox: "0 0 100 100" },
      h("line", { x1: 0, y1: 0, x2: 100, y2: 100, stroke: c, strokeWidth: 1.5, vectorEffect: "non-scaling-stroke" }),
      h("line", { x1: 100, y1: 0, x2: 0, y2: 100, stroke: c, strokeWidth: 1.5, vectorEffect: "non-scaling-stroke" }));
  const btn = (t: string, pri?: boolean, x: CSSProperties = {}) =>
    d({ ...bx({ background: pri ? INK : "transparent", color: pri ? PAPER : INK }), ...fc, justifyContent: "center", padding: "0 16px", height: 36, fontSize: fs(15), whiteSpace: "nowrap", ...x }, t);
  const on = !!p.on;

  switch (el.type) {
    case "rect": return d({ ...full, ...bx({ background: p.fill ? FILL : "transparent" }) });
    case "ellipse": return d({ ...full, border: `${BW} solid ${INK}`, borderRadius: "50%" });
    case "line": return d({ ...full, ...fc }, d({ height: 2, width: "100%", background: INK, borderRadius: 2 }));
    case "arrow": return d({ ...full, ...fc }, d({ flex: 1, height: 2, background: INK }), d({ width: 0, height: 0, borderTop: "7px solid transparent", borderBottom: "7px solid transparent", borderLeft: `11.5px solid ${INK}` }));
    case "divider": return d({ ...full, ...fc }, d({ height: 2, width: "100%", background: LINE }));
    case "text": return d({ ...full, fontSize: fs(18), lineHeight: 1.25, overflow: "hidden" }, p.text);
    case "heading": return d({ ...full, fontSize: Math.max(14, Math.round(H * 0.74)), lineHeight: 1.1, fontWeight: 600, letterSpacing: "-0.02em", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }, p.text);
    case "link": return tx(p.text, { ...full, fontSize: fs(17), textDecoration: "underline" });
    case "note": return d({ ...full, background: "#f9eca0", padding: 12, fontSize: fs(18), lineHeight: 1.25, boxShadow: "2px 3px 0 rgba(0,0,0,.12)", overflow: "hidden" }, p.text);
    case "paragraph": {
      if (p.text) return d({ ...full, fontSize: fs(17), lineHeight: 1.35, color: "#555", overflow: "hidden" }, p.text);
      const n = Math.max(1, Math.floor((H + 12) / 18)), ws = ["100%", "96%", "99%", "92%"];
      return d({ ...full, display: "flex", flexDirection: "column", gap: 12, paddingTop: 2, overflow: "hidden" }, ...Array.from({ length: n }, (_, i) => ln(i === n - 1 && n > 1 ? "62%" : ws[i % 4])));
    }
    case "button": return d({ ...full, ...bx({ background: INK, color: PAPER }), ...fc, justifyContent: "center", fontSize: fs(17), overflow: "hidden" }, p.text);
    case "button2": return d({ ...full, ...bx(), ...fc, justifyContent: "center", fontSize: fs(17), overflow: "hidden" }, p.text);
    case "input": return d({ ...full, ...bx(), ...fc, padding: "0 14px", color: SOFT, fontSize: fs(17) }, tx(p.text));
    case "textarea": return d({ ...full, ...bx(), padding: "10px 14px", color: SOFT, fontSize: fs(17), overflow: "hidden" }, p.text);
    case "search": return d({ ...full, ...bx(), ...fc, gap: 10, padding: "0 14px", color: SOFT, fontSize: fs(17) }, I("Search", 18, SOFT), tx(p.text));
    case "select": return d({ ...full, ...bx(), ...fc, gap: 8, padding: "0 12px 0 14px", fontSize: fs(17) }, tx(p.text, { flex: 1 }), I("ChevronDown", 18));
    case "checkbox": {
      const s = Math.min(20, H);
      return d({ ...full, ...fc, gap: 10, fontSize: fs(17) }, d({ ...bs({ width: s, height: s, background: on ? INK : "transparent" }), ...fc, justifyContent: "center", flexShrink: 0 }, on ? I("Check", s - 6, PAPER, 3) : null), tx(p.text));
    }
    case "radio": {
      const s = Math.min(20, H);
      return d({ ...full, ...fc, gap: 10, fontSize: fs(17) }, d({ width: s, height: s, boxSizing: "border-box", border: `${BW} solid ${INK}`, borderRadius: "50%", ...fc, justifyContent: "center", flexShrink: 0 }, on ? d({ width: s - 10, height: s - 10, borderRadius: "50%", background: INK }) : null), tx(p.text));
    }
    case "toggle": {
      const k = H - 10;
      return d({ ...full, border: `${BW} solid ${INK}`, borderRadius: H, background: on ? INK : "transparent" }, d({ position: "absolute", top: 3, left: on ? W - k - 7 : 3, width: k, height: k, borderRadius: "50%", background: on ? PAPER : INK }));
    }
    case "slider": {
      const pc = Math.max(0, Math.min(100, +p.value || 0));
      return d({ ...full, ...fc }, d({ position: "relative", width: "100%", height: 4, background: LINE, borderRadius: 2 },
        d({ position: "absolute", left: 0, top: 0, bottom: 0, width: pc + "%", background: INK, borderRadius: 2 }),
        d({ position: "absolute", left: `calc(${pc}% - 9px)`, top: -7, width: 18, height: 18, boxSizing: "border-box", borderRadius: "50%", background: PAPER, border: `${BW} solid ${INK}` })));
    }
    case "progress": {
      const pc = Math.max(0, Math.min(100, +p.value || 0));
      return d({ ...full, border: `${BW} solid ${INK}`, borderRadius: H, overflow: "hidden" }, d({ height: "100%", width: pc + "%", background: INK }));
    }
    case "badge": return d({ ...full, border: `${BW} solid ${INK}`, borderRadius: H, ...fc, justifyContent: "center", fontSize: fs(14) }, p.text);
    case "navbar": {
      const small = W < 600;
      return d({ ...full, ...fc, gap: 24, padding: "0 24px", borderBottom: `${BW} solid ${INK}` },
        d({ ...bs({ width: 28, height: 28, background: FILL }), flexShrink: 0 }), tx(p.text, { fontWeight: 700, fontSize: fs(20), flexShrink: 0 }), d({ flex: 1 }),
        small ? I("Menu", 24) : d({ display: "flex", gap: 28, overflow: "hidden", fontSize: fs(17) }, ...its().map((t) => tx(t))),
        small ? null : btn("Sign up", true));
    }
    case "sidebar": {
      const ic = ["LayoutDashboard|LayoutGrid", "Folder", "MessageSquare", "Calendar", "Settings", "Users", "ChartColumn|BarChart3", "Bell"];
      return d({ ...full, borderRight: `${BW} solid ${INK}`, background: "#f7f6f1", padding: 18, display: "flex", flexDirection: "column", gap: 6, overflow: "hidden" },
        d({ ...fc, gap: 10, marginBottom: 16 }, d({ ...bs({ width: 28, height: 28, background: FILL }) }), tx(p.text, { fontWeight: 700, fontSize: fs(20) })),
        ...its().map((t, i) => d({ ...fc, gap: 12, padding: "8px 10px", borderRadius: 5, background: i === 0 ? FILL : "transparent", border: i === 0 ? `${BW} solid ${INK}` : "2px solid transparent", fontSize: fs(17) }, I(ic[i % ic.length], 18), tx(t))));
    }
    case "tabs": return d({ ...full, display: "flex", alignItems: "flex-end", gap: 28, borderBottom: `2px solid ${LINE}`, overflow: "hidden" },
      ...its().map((t, i) => d({ paddingBottom: 8, marginBottom: -2, fontSize: fs(17), whiteSpace: "nowrap", color: i === 0 ? INK : "#8a8984", borderBottom: `3px solid ${i === 0 ? INK : "transparent"}` }, t)));
    case "breadcrumb": {
      const a = its();
      return d({ ...full, ...fc, gap: 8, fontSize: fs(16), overflow: "hidden", whiteSpace: "nowrap" },
        ...a.flatMap((t, i) => [d({ color: i === a.length - 1 ? INK : "#8a8984", fontWeight: i === a.length - 1 ? 700 : 400 }, t), i < a.length - 1 ? d({ color: SOFT }, "/") : null]));
    }
    case "pagination": return d({ ...full, ...fc, gap: 6, justifyContent: "center" },
      ...["‹", "1", "2", "3", "…", "9", "›"].map((t, i) => d({ ...bs({ width: Math.min(H, 34), height: Math.min(H, 34), background: i === 1 ? INK : "transparent", color: i === 1 ? PAPER : INK, borderColor: t === "…" ? "transparent" : INK }), ...fc, justifyContent: "center", fontSize: fs(15) }, t)));
    case "footer": {
      const n = W > 600 ? 4 : 2;
      return d({ ...full, borderTop: `${BW} solid ${INK}`, padding: "24px " + (W > 600 ? 80 : 16) + "px", display: "flex", gap: 32 },
        ...Array.from({ length: n }, () => d({ flex: 1, display: "flex", flexDirection: "column", gap: 12 }, ln("50%", { background: "#bdbcb5", height: 8 }), ln("70%"), ln("60%"), ln("40%"))));
    }
    case "card": return d({ ...full, ...bx(), overflow: "hidden", display: "flex", flexDirection: "column" },
      d({ position: "relative", height: "50%", borderBottom: `${BW} solid ${INK}`, background: FILL, flexShrink: 0 }, xl()),
      d({ padding: 14, display: "flex", flexDirection: "column", gap: 10, minHeight: 0 }, tx(p.text, { fontSize: fs(19), fontWeight: 700 }), ln("95%"), ln("78%"), ln("50%")));
    case "list":
    case "listitem": {
      const n = el.type === "list" ? Math.max(1, Math.floor(H / 60)) : 1, rh = el.type === "list" ? 60 : H;
      return d({ ...full, overflow: "hidden" }, ...Array.from({ length: n }, (_, i) => d({ ...fc, gap: 12, height: rh, borderBottom: `1.5px solid ${LINE}`, padding: "0 4px", boxSizing: "border-box" },
        d({ width: 36, height: 36, boxSizing: "border-box", border: `${BW} solid ${INK}`, borderRadius: "50%", background: FILL, flexShrink: 0 }),
        d({ flex: 1, display: "flex", flexDirection: "column", gap: 8, minWidth: 0 }, p.text ? tx(p.text, { fontSize: fs(17) }) : ln(["55%", "40%", "62%"][i % 3], { background: "#bdbcb5" }), ln(["80%", "70%", "75%"][i % 3])),
        I("ChevronRight", 18, SOFT))));
    }
    case "stat": return d({ ...full, ...bx(), padding: 18, display: "flex", flexDirection: "column", justifyContent: "center", gap: 6, overflow: "hidden" },
      tx(p.text, { fontSize: fs(16), color: "#77766f" }), tx(p.value, { fontSize: fs(32), fontWeight: 700, lineHeight: 1.1 }), ln("40%", { marginTop: 4 }));
    case "table": {
      const c = its(), n = Math.max(1, Math.floor((H - 42) / 38));
      return d({ ...full, ...bx(), overflow: "hidden", display: "flex", flexDirection: "column" },
        d({ display: "flex", height: 40, flexShrink: 0, background: FILL, borderBottom: `${BW} solid ${INK}`, alignItems: "center", padding: "0 14px", gap: 16 }, ...c.map((t) => tx(t, { flex: 1, fontSize: fs(16), fontWeight: 700 }))),
        ...Array.from({ length: n }, (_, r) => d({ display: "flex", height: 38, flexShrink: 0, alignItems: "center", padding: "0 14px", gap: 16, borderBottom: `1.5px solid ${LINE}` },
          ...c.map((_, j) => d({ flex: 1 }, ln(["70%", "45%", "60%", "35%", "55%"][(r + j) % 5]))))));
    }
    case "barchart": return d({ ...full, ...bx(), padding: 16, display: "flex", flexDirection: "column", gap: 12 }, tx(p.text, { fontSize: fs(17), fontWeight: 700 }),
      d({ flex: 1, display: "flex", alignItems: "flex-end", gap: 10, borderLeft: `${BW} solid ${INK}`, borderBottom: `${BW} solid ${INK}`, padding: "0 8px", minHeight: 0 },
        ...[40, 65, 50, 85, 60, 75, 45, 92].map((x) => d({ flex: 1, height: x + "%", ...bs({ background: FILL, borderBottom: "none" }) }))));
    case "linechart": return d({ ...full, ...bx(), padding: 16, display: "flex", flexDirection: "column", gap: 12 }, tx(p.text, { fontSize: fs(17), fontWeight: 700 }),
      d({ flex: 1, position: "relative", borderLeft: `${BW} solid ${INK}`, borderBottom: `${BW} solid ${INK}`, minHeight: 0 },
        h("svg", { style: { position: "absolute", inset: 0, width: "100%", height: "100%" }, viewBox: "0 0 100 100", preserveAspectRatio: "none" },
          h("polyline", { points: "0,80 14,62 28,68 42,40 57,48 71,26 85,32 100,10", fill: "none", stroke: INK, strokeWidth: 2.5, vectorEffect: "non-scaling-stroke", strokeLinejoin: "round" }),
          h("polyline", { points: "0,90 14,84 28,86 42,72 57,76 71,64 85,68 100,56", fill: "none", stroke: SOFT, strokeWidth: 2, strokeDasharray: "5 4", vectorEffect: "non-scaling-stroke" }))));
    case "piechart": {
      const s = Math.min(W, H);
      return d({ ...full, ...fc, justifyContent: "center" }, d({ width: s, height: s, boxSizing: "border-box", borderRadius: "50%", border: `${BW} solid ${INK}`, background: `conic-gradient(${INK} 0 34%, #9d9c95 0 58%, ${FILL} 0 100%)` }));
    }
    case "image": return d({ ...full, ...bx({ background: FILL }), overflow: "hidden" }, xl(),
      p.text ? d({ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)", background: PAPER, padding: "2px 8px", fontSize: fs(15), color: "#77766f", whiteSpace: "nowrap" }, p.text) : null);
    case "video": return d({ ...full, ...bx({ background: "#3b3b39" }), ...fc, justifyContent: "center", overflow: "hidden" },
      d({ width: 56, height: 56, borderRadius: "50%", background: PAPER, ...fc, justifyContent: "center" }, d({ width: 0, height: 0, marginLeft: 5, borderTop: "11px solid transparent", borderBottom: "11px solid transparent", borderLeft: `17px solid ${INK}` })),
      d({ position: "absolute", left: 16, right: 16, bottom: 14, height: 4, background: "#6b6b67", borderRadius: 2 }, d({ width: "35%", height: "100%", background: PAPER, borderRadius: 2 })));
    case "avatar": {
      const s = Math.min(W, H);
      return d({ ...full, border: `${BW} solid ${INK}`, borderRadius: "50%", background: FILL, ...fc, justifyContent: "center", overflow: "hidden" }, I("User", Math.round(s * 0.55), INK));
    }
    case "map": return d({ ...full, ...bx({ background: "#efeee7" }), overflow: "hidden", ...fc, justifyContent: "center" },
      h("svg", { style: { position: "absolute", inset: 0, width: "100%", height: "100%" }, viewBox: "0 0 100 100", preserveAspectRatio: "none" },
        ...["0,30 40,38 100,20", "20,0 30,50 24,100", "0,75 55,60 100,82", "70,0 62,45 80,100"].map((pt) => h("polyline", { points: pt, fill: "none", stroke: "#d6d5cd", strokeWidth: 7, vectorEffect: "non-scaling-stroke" }))),
      d({ position: "relative" }, I("MapPin", 34, INK, 2.2)));
    case "statusbar": return d({ ...full, ...fc, justifyContent: "space-between", padding: "0 26px", fontSize: fs(17), fontWeight: 700 }, "9:41", d({ ...fc, gap: 6 }, I("Signal", 16), I("Wifi", 16), I("BatteryFull|Battery", 20)));
    case "appbar": return d({ ...full, ...fc, gap: 12, padding: "0 14px", borderBottom: `1.5px solid ${LINE}` }, I("ChevronLeft", 24), tx(p.text, { flex: 1, textAlign: "center", fontSize: fs(19), fontWeight: 700 }), I("Ellipsis|MoreHorizontal", 24));
    case "tabbar": {
      const ic = ["House|Home", "Search", "Heart", "User", "Settings"];
      return d({ ...full, display: "flex", justifyContent: "space-around", alignItems: "flex-start", paddingTop: 10, borderTop: `${BW} solid ${INK}`, background: PAPER },
        ...its().map((t, i) => d({ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, fontSize: fs(13), color: i === 0 ? INK : "#8a8984" }, I(ic[i % ic.length], 24, i === 0 ? INK : "#8a8984"), t)));
    }
    case "homeind": return d({ ...full, ...fc, justifyContent: "center" }, d({ width: 134, height: 5, borderRadius: 3, background: INK }));
    case "keyboard": {
      const key = (t: string, x: CSSProperties = {}) => d({ flex: 1, ...bs({ borderWidth: 1.5, background: PAPER }), ...fc, justifyContent: "center", fontSize: fs(16), ...x }, t);
      return d({ ...full, background: FILL, padding: "10px 4px", display: "flex", flexDirection: "column", gap: 10, borderTop: `${BW} solid ${INK}` },
        ...["qwertyuiop", "asdfghjkl", "zxcvbnm"].map((r, i) => d({ flex: 1, display: "flex", gap: 5, padding: i === 1 ? "0 18px" : i === 2 ? "0 44px" : 0 }, ...r.split("").map((c) => key(c)))),
        d({ flex: 1, display: "flex", gap: 5 }, key("123", { flex: 1.3 }), key("space", { flex: 5 }), key("return", { flex: 1.8 })));
    }
    case "icon": return d({ ...full, ...fc, justifyContent: "center" }, I(p.icon || "Star", Math.min(W, H), INK, 2));
    case "modal": return d({ ...full, ...bx({ background: PAPER, boxShadow: `5px 6px 0 ${INK}` }), padding: 20, display: "flex", flexDirection: "column", gap: 12, overflow: "hidden" },
      d({ ...fc, gap: 8, marginBottom: 4 }, tx(p.text, { flex: 1, fontSize: fs(21), fontWeight: 700 }), I("X", 20)), ln("100%"), ln("94%"), ln("68%"), d({ flex: 1 }),
      d({ display: "flex", justifyContent: "flex-end", gap: 10 }, btn("Cancel"), btn("Confirm", true)));
    case "confirm": return d({ ...full, ...bx({ background: PAPER, boxShadow: `5px 6px 0 ${INK}` }), padding: 20, display: "flex", flexDirection: "column", alignItems: "center", gap: 10, textAlign: "center", overflow: "hidden" },
      I("CircleAlert|AlertCircle", 34), tx(p.text, { fontSize: fs(20), fontWeight: 700, maxWidth: "100%" }), ln("85%"), ln("60%"), d({ flex: 1 }),
      d({ display: "flex", gap: 10, width: "100%" }, btn("Cancel", false, { flex: 1 }), btn("Delete", true, { flex: 1 })));
    case "alert": return d({ ...full, ...bx({ background: "#f4f3ed" }), ...fc, gap: 14, padding: "0 16px", overflow: "hidden" },
      I("CircleAlert|AlertCircle", 24), d({ flex: 1, display: "flex", flexDirection: "column", gap: 8, minWidth: 0 }, tx(p.text, { fontSize: fs(17), fontWeight: 700 }), ln("80%")));
    case "toast": return d({ ...full, ...bx({ background: INK, color: PAPER }), ...fc, gap: 12, padding: "0 16px" }, I("CircleCheck|CheckCircle", 20, PAPER), tx(p.text, { flex: 1, fontSize: fs(17) }), I("X", 16, PAPER));
    case "tooltip": return d({ ...full, display: "flex", flexDirection: "column", alignItems: "center" },
      d({ flex: 1, width: "100%", ...bs({ background: INK, color: PAPER, borderColor: INK }), ...fc, justifyContent: "center", fontSize: fs(16), padding: "0 10px", overflow: "hidden" }, tx(p.text)),
      d({ width: 0, height: 0, borderLeft: "8px solid transparent", borderRight: "8px solid transparent", borderTop: `8px solid ${INK}` }));
    case "scrim": return d({ ...full, background: "rgba(30,30,28,.35)" });
    default: return d({ ...full, ...bx() });
  }
}
