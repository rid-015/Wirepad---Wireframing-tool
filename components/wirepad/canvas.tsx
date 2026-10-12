"use client";

import { useCallback, useEffect, useRef, type CSSProperties } from "react";
import { FRAMES, frameOf, type Page, type WireElement } from "@/lib/component-registry";
import { startMarquee, startMove, startPageResize, type Dir } from "@/lib/interactions";
import { activePage, dom, useWirepadStore } from "@/lib/store";
import { renderElement } from "./canvas-element";
import { Icon } from "./icon";

const ACCENT = "oklch(0.68 0.15 250)";
const GUIDE = "oklch(0.65 0.22 0)";
const BOARD_FONT = "var(--font-geist), system-ui, sans-serif";
const MONO = "var(--font-geist-mono), monospace";

/** Focuses an inspector field after the panel has re-rendered for the new selection. */
export function focusField(id: string) {
  requestAnimationFrame(() => {
    const r = document.getElementById(id);
    if (r instanceof HTMLInputElement || r instanceof HTMLTextAreaElement) {
      r.focus();
      r.select();
    }
  });
}

const badge = (z: number): CSSProperties => ({
  fontFamily: MONO, fontSize: 11 / z, color: "#fff", background: ACCENT,
  padding: `${2 / z}px ${6 / z}px`, borderRadius: 4 / z, whiteSpace: "nowrap",
});

/** Width or height in the size badge: Enter/blur commits, Esc reverts, ↑/↓ steps 1 (⇧ 10). */
function SizeInput({ el, k }: { el: WireElement; k: "w" | "h" }) {
  const v = el[k];
  const commit = (t: HTMLInputElement) => {
    const n = parseInt(t.value, 10);
    if (isNaN(n) || n === v) {
      t.value = String(v);
      return;
    }
    useWirepadStore.getState().updSel((q) => {
      q[k] = Math.max(4, n);
    });
  };
  return (
    <input
      key={el.id + k + v}
      defaultValue={v}
      title={k === "w" ? "Width" : "Height"}
      inputMode="numeric"
      onBlur={(e) => commit(e.target)}
      onFocus={(e) => e.target.select()}
      onKeyDown={(e) => {
        const t = e.currentTarget;
        if (e.key === "Enter") t.blur();
        else if (e.key === "Escape") {
          t.value = String(v);
          t.blur();
        } else if (e.key === "ArrowUp" || e.key === "ArrowDown") {
          e.preventDefault();
          t.value = String(Math.max(4, (parseInt(t.value, 10) || 0) + (e.key === "ArrowUp" ? 1 : -1) * (e.shiftKey ? 10 : 1)));
        }
      }}
      style={{ width: `${String(v).length + 0.6}ch`, padding: 0, border: "none", outline: "none", background: "transparent", color: "#fff", font: "inherit", textAlign: "center", cursor: "text" }}
    />
  );
}

/** Duplicate / delete toolbar pinned to the selection's top-right (above → below → inside). */
function SelTools({ z, top, bottom, pageH }: { z: number; top: number; bottom: number; pageH: number }) {
  const { dupSel, deleteSel } = useWirepadStore.getState();
  const room = 40 / z, s = 26 / z;
  const mode = top >= room ? "above" : pageH - bottom >= room ? "below" : "inside";
  const btn = (title: string, icon: string, fn: () => void, danger?: boolean) => (
    <button
      title={title}
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => {
        e.stopPropagation();
        fn();
      }}
      className={danger ? "hover:!bg-[#e5484d]" : "hover:!bg-[#333]"}
      style={{ width: s, height: s, display: "flex", alignItems: "center", justifyContent: "center", border: "none", borderRadius: 5 / z, background: "transparent", color: "#ededed", cursor: "pointer", padding: 0 }}
    >
      <Icon name={icon} size={14 / z} strokeWidth={1.75} />
    </button>
  );
  return (
    <div
      data-noexport="1"
      onPointerDown={(e) => e.stopPropagation()}
      style={{
        position: "absolute", right: mode === "inside" ? 6 / z : 0,
        ...(mode === "above" ? { top: -(s + 10 / z) } : mode === "below" ? { bottom: -(s + 10 / z) } : { top: 6 / z }),
        display: "flex", gap: 2 / z, padding: 2 / z, background: "#1c1c1c", border: `${1 / z}px solid #333`, borderRadius: 7 / z,
        boxShadow: `0 ${4 / z}px ${12 / z}px rgba(0,0,0,.3)`, pointerEvents: "auto", zIndex: 8,
      }}
    >
      {btn("Duplicate (⌘D)", "Copy", dupSel)}
      {btn("Delete (⌫)", "Trash2", deleteSel, true)}
    </div>
  );
}

function Board({ page, zoom: z }: { page: Page; zoom: number }) {
  const view = useWirepadStore((s) => s.view);
  const selId = useWirepadStore((s) => s.selId);
  const multi = useWirepadStore((s) => s.multi);
  const marq = useWirepadStore((s) => s.marq);
  const grid = useWirepadStore((s) => s.grid);
  const guides = useWirepadStore((s) => s.guides);
  const F = frameOf(page);
  const setBoard = useCallback((n: HTMLDivElement | null) => {
    dom.board = n;
  }, []);

  const sel = !view ? page.elements.find((e) => e.id === selId) : undefined;
  const ms = !view && multi.length ? page.elements.filter((q) => multi.includes(q.id)) : [];
  const bw = 1.5 / z, hs = 9 / z, hit = 14 / z, ch = 20 / z;
  const edges: Record<string, CSSProperties> = {
    n: { left: 0, right: 0, top: -hit / 2, height: hit, cursor: "ns-resize" },
    s: { left: 0, right: 0, bottom: -hit / 2, height: hit, cursor: "ns-resize" },
    w: { top: 0, bottom: 0, left: -hit / 2, width: hit, cursor: "ew-resize" },
    e: { top: 0, bottom: 0, right: -hit / 2, width: hit, cursor: "ew-resize" },
  };
  const corners: Record<string, [number, number, string]> = { nw: [0, 0, "nwse"], ne: [1, 0, "nesw"], se: [1, 1, "nwse"], sw: [0, 1, "nesw"] };
  const gc = "rgba(70,120,210,0.13)", lw = Math.max(1, 1 / z);

  let groupBox: { L: number; T: number; R: number; B: number } | null = null;
  if (ms.length)
    groupBox = {
      L: Math.min(...ms.map((q) => q.x)), T: Math.min(...ms.map((q) => q.y)),
      R: Math.max(...ms.map((q) => q.x + q.w)), B: Math.max(...ms.map((q) => q.y + q.h)),
    };

  // Size badge sits above the selection, below it near the page top, or inside when there is no room.
  const below = sel ? sel.y < 30 / z : false;
  const inside = sel ? below && F.h - (sel.y + sel.h) < 34 / z : false;

  return (
    <div
      ref={setBoard}
      style={{
        position: "absolute", left: 0, top: 0, width: F.w, height: F.h,
        transform: `scale(${z})`, transformOrigin: "0 0", background: "#ffffff", overflow: "hidden",
        color: "#2b2b2b", boxShadow: "0 12px 40px rgba(0,0,0,.45)", fontFamily: BOARD_FONT, letterSpacing: "-0.01em",
      }}
    >
      {grid > 0 && !view && (
        <div
          data-noexport="1"
          style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            backgroundImage: `linear-gradient(to right, ${gc} ${lw}px, transparent ${lw}px), linear-gradient(to bottom, ${gc} ${lw}px, transparent ${lw}px)`,
            backgroundSize: `${grid}px ${grid}px`,
          }}
        />
      )}
      {page.elements.map((el) => (
        <div
          key={el.id}
          onPointerDown={(e) => startMove(e, el.id)}
          onDoubleClick={() => focusField("wp-field-0")}
          style={{ position: "absolute", left: el.x, top: el.y, width: el.w, height: el.h, cursor: view ? "default" : "move", touchAction: "none" }}
        >
          {renderElement(el)}
        </div>
      ))}
      {ms.map((q) => (
        <div key={"_m" + q.id} data-noexport="1" style={{ position: "absolute", left: q.x, top: q.y, width: q.w, height: q.h, outline: `${1 / z}px solid ${ACCENT}`, pointerEvents: "none", zIndex: 5 }} />
      ))}
      {groupBox && (
        <div
          data-noexport="1"
          style={{ position: "absolute", left: groupBox.L, top: groupBox.T, width: groupBox.R - groupBox.L, height: groupBox.B - groupBox.T, outline: `${1.5 / z}px dashed ${ACCENT}`, pointerEvents: "none", zIndex: 5 }}
        >
          <div style={{ position: "absolute", left: 0, top: -24 / z, ...badge(z) }}>{`${ms.length} selected`}</div>
          <SelTools z={z} top={groupBox.T} bottom={groupBox.B} pageH={F.h} />
        </div>
      )}
      {marq && (
        <div
          data-noexport="1"
          style={{ position: "absolute", left: marq.x, top: marq.y, width: marq.w, height: marq.h, background: "oklch(0.68 0.15 250 / 0.08)", border: `${1 / z}px solid ${ACCENT}`, boxSizing: "border-box", pointerEvents: "none", zIndex: 7 }}
        />
      )}
      {sel && (
        <div
          data-noexport="1"
          style={{ position: "absolute", left: sel.x, top: sel.y, width: sel.w, height: sel.h, outline: `${bw}px solid ${ACCENT}`, pointerEvents: "none", zIndex: 5 }}
        >
          <div
            onPointerDown={(e) => e.stopPropagation()}
            style={{
              position: "absolute", left: "50%", transform: "translateX(-50%)",
              ...(inside ? { top: 6 / z } : below ? { top: `calc(100% + ${8 / z}px)` } : { top: -24 / z }),
              ...badge(z), pointerEvents: "auto", display: "flex", alignItems: "center", gap: 3 / z,
            }}
          >
            <SizeInput el={sel} k="w" />×<SizeInput el={sel} k="h" />
          </div>
          <SelTools z={z} top={sel.y} bottom={sel.y + sel.h} pageH={F.h} />
          {Object.entries(edges).map(([dir, st]) => (
            <div key={dir} onPointerDown={(e) => startMove(e, sel.id, dir as Dir)} style={{ position: "absolute", pointerEvents: "auto", touchAction: "none", ...st }} />
          ))}
          {Object.entries(corners).map(([dir, [px, py, cur]]) => (
            <div
              key={dir}
              onPointerDown={(e) => startMove(e, sel.id, dir as Dir)}
              style={{
                position: "absolute", left: `calc(${px * 100}% - ${ch / 2}px)`, top: `calc(${py * 100}% - ${ch / 2}px)`,
                width: ch, height: ch, display: "flex", alignItems: "center", justifyContent: "center",
                pointerEvents: "auto", cursor: cur + "-resize", touchAction: "none",
              }}
            >
              <div style={{ width: hs, height: hs, background: "#fff", border: `${bw}px solid ${ACCENT}`, boxSizing: "border-box", borderRadius: 2 / z }} />
            </div>
          ))}
        </div>
      )}
      {guides && guides.x != null && (
        <div data-noexport="1" style={{ position: "absolute", top: 0, bottom: 0, left: guides.x, width: 1 / z, marginLeft: -0.5 / z, background: GUIDE, pointerEvents: "none", zIndex: 6 }} />
      )}
      {guides && guides.y != null && (
        <div data-noexport="1" style={{ position: "absolute", left: 0, right: 0, top: guides.y, height: 1 / z, marginTop: -0.5 / z, background: GUIDE, pointerEvents: "none", zIndex: 6 }} />
      )}
      {!page.elements.length && !view && (
        <div
          data-noexport="1"
          style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4 / z, color: "#8e8e93", fontSize: 14 / z, pointerEvents: "none", textAlign: "center" }}
        >
          <span>Drag components here</span>
          <span style={{ color: "#b4b4b9" }}>or pick one from Templates</span>
        </div>
      )}
    </div>
  );
}

/** Static, scaled-down render of a page for template previews. Tall pages crop to the top. */
export function Thumb({ page }: { page: Page }) {
  const F = FRAMES[page.frame];
  const s = Math.min(176 / F.w, 120 / F.h);
  return (
    <div className="pointer-events-none flex h-32 items-center justify-center overflow-hidden rounded-[5px] bg-[#0e0e0e]">
      <div style={{ width: F.w * s, height: F.h * s, position: "relative", overflow: "hidden", background: "#ffffff" }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: F.w, height: F.h, transform: `scale(${s})`, transformOrigin: "0 0", color: "#2b2b2b", fontFamily: BOARD_FONT }}>
          {page.elements.map((el) => (
            <div key={el.id} style={{ position: "absolute", left: el.x, top: el.y, width: el.w, height: el.h }}>
              {renderElement(el)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Canvas() {
  const project = useWirepadStore((s) => s.project);
  const zoom = useWirepadStore((s) => s.zoom);
  const view = useWirepadStore((s) => s.view);
  const ref = useRef<HTMLDivElement>(null);
  const pg = project && activePage(project);
  const F = pg && frameOf(pg);

  useEffect(() => {
    const c = ref.current;
    dom.canvas = c;
    if (!c) return;
    const fit = () => useWirepadStore.getState().fit();
    // Fit once the project has loaded and the canvas has a size.
    let n = 0, t: ReturnType<typeof setTimeout>;
    const tryFit = () => {
      if (!fit() && n++ < 40) t = setTimeout(tryFit, 50);
    };
    tryFit();
    let lastW = 0, lastH = 0;
    const ro = new ResizeObserver(() => {
      if (!c.clientWidth) return;
      if (Math.abs(c.clientWidth - lastW) > 2 || Math.abs(c.clientHeight - lastH) > 2) {
        if (fit()) {
          lastW = c.clientWidth;
          lastH = c.clientHeight;
        }
      }
    });
    ro.observe(c);
    return () => {
      clearTimeout(t);
      ro.disconnect();
      dom.canvas = null;
    };
  }, [!!project]); // eslint-disable-line react-hooks/exhaustive-deps

  // Re-fit whenever the active page, its device or its height changes.
  const sig = pg ? `${pg.id}|${pg.frame}|${pg.h || ""}` : "";
  const lastSig = useRef<string | null>(null);
  useEffect(() => {
    if (!sig) return;
    if (lastSig.current != null && lastSig.current !== sig) useWirepadStore.getState().fit();
    lastSig.current = sig;
  }, [sig]);

  return (
    <main
      className="relative min-w-0 flex-1"
      style={{ backgroundColor: "#181818", backgroundImage: "radial-gradient(#262626 1px, transparent 1px)", backgroundSize: "20px 20px" }}
    >
      <div ref={ref} onPointerDown={startMarquee} className="absolute inset-0 flex overflow-auto">
        {pg && F && (
          <div className="m-auto shrink-0 px-16 pb-16 pt-12">
            <div className="mb-2.5 flex justify-between gap-4 text-[11px] text-[#8c8c8c]">
              <span>{pg.name}</span>
              <span className="font-mono text-[#5c5c5c]">{`${F.label} · ${F.w}×${F.h}`}</span>
            </div>
            <div style={{ width: F.w * zoom, height: F.h * zoom, position: "relative" }}>
              <Board page={pg} zoom={zoom} />
            </div>
            {!view && (
              <div onPointerDown={startPageResize} title="Drag to change page height" className="mt-1.5 flex h-7 cursor-ns-resize touch-none items-center justify-center">
                <div className="flex h-[22px] items-center gap-1.5 rounded-full border border-[#333] bg-[#222] px-2.5 font-mono text-[11px] text-[#a3a3a3]">
                  <Icon name="GripHorizontal|Minus" size={14} strokeWidth={1.75} />
                  {`${F.h}px`}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
