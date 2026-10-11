"use client";

import { useCallback, useEffect, useRef, type CSSProperties } from "react";
import { frameOf, type Page } from "@/lib/component-registry";
import { startMove, type Dir } from "@/lib/interactions";
import { activePage, dom, useWirepadStore } from "@/lib/store";
import { renderElement } from "./canvas-element";

const ACCENT = "oklch(0.68 0.15 250)";
const GUIDE = "oklch(0.65 0.22 0)";
const BOARD_FONT = "var(--font-geist), system-ui, sans-serif";

/** Focuses an inspector field after the panel has re-rendered for the new selection. */
export function focusField(id: string) {
  requestAnimationFrame(() => {
    const r = document.getElementById(id) as HTMLInputElement | null;
    if (r) {
      r.focus();
      r.select();
    }
  });
}

function Board({ page, zoom: z }: { page: Page; zoom: number }) {
  const view = useWirepadStore((s) => s.view);
  const selId = useWirepadStore((s) => s.selId);
  const grid = useWirepadStore((s) => s.grid);
  const guides = useWirepadStore((s) => s.guides);
  const F = frameOf(page);
  const setBoard = useCallback((n: HTMLDivElement | null) => {
    dom.board = n;
  }, []);

  const sel = !view ? page.elements.find((e) => e.id === selId) : undefined;
  const bw = 1.5 / z, hs = 9 / z, hit = 14 / z, ch = 20 / z;
  const edges: Record<string, CSSProperties> = {
    n: { left: 0, right: 0, top: -hit / 2, height: hit, cursor: "ns-resize" },
    s: { left: 0, right: 0, bottom: -hit / 2, height: hit, cursor: "ns-resize" },
    w: { top: 0, bottom: 0, left: -hit / 2, width: hit, cursor: "ew-resize" },
    e: { top: 0, bottom: 0, right: -hit / 2, width: hit, cursor: "ew-resize" },
  };
  const corners: Record<string, [number, number, string]> = { nw: [0, 0, "nwse"], ne: [1, 0, "nesw"], se: [1, 1, "nwse"], sw: [0, 1, "nesw"] };
  const gc = "rgba(70,120,210,0.13)", lw = Math.max(1, 1 / z);

  return (
    <div
      ref={setBoard}
      style={{
        position: "absolute", left: 0, top: 0, width: F.w, height: F.h,
        transform: `scale(${z})`, transformOrigin: "0 0", background: "#fffefa", overflow: "hidden",
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
          onDoubleClick={() => focusField("wp-label")}
          style={{ position: "absolute", left: el.x, top: el.y, width: el.w, height: el.h, cursor: view ? "default" : "move", touchAction: "none" }}
        >
          {renderElement(el)}
        </div>
      ))}
      {sel && (
        <div
          data-noexport="1"
          style={{ position: "absolute", left: sel.x, top: sel.y, width: sel.w, height: sel.h, outline: `${bw}px solid ${ACCENT}`, pointerEvents: "none", zIndex: 5 }}
        >
          <div
            style={{
              position: "absolute", left: "50%", transform: "translateX(-50%)",
              ...(sel.y < 30 / z ? { top: `calc(100% + ${8 / z}px)` } : { top: -24 / z }),
              fontFamily: "var(--font-geist-mono), monospace", fontSize: 11 / z, color: "#fff", background: ACCENT,
              padding: `${2 / z}px ${6 / z}px`, borderRadius: 4 / z, whiteSpace: "nowrap",
            }}
          >
            {`${sel.w} × ${sel.h}`}
          </div>
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
        <div data-noexport="1" style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "#b5b4ad", fontSize: 22, pointerEvents: "none" }}>
          Drag components here
        </div>
      )}
    </div>
  );
}

/** Static, scaled-down render of a set of elements, used for template previews. */
export function Thumb({ page }: { page: Page }) {
  const F = frameOf(page);
  const s = Math.min(196 / F.w, 132 / F.h);
  return (
    <div className="flex h-[140px] items-center justify-center overflow-hidden rounded-[5px] bg-[#0e0e0e] pointer-events-none">
      <div style={{ width: F.w * s, height: F.h * s, position: "relative", overflow: "hidden", background: "#fffefa" }}>
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
  const ref = useRef<HTMLDivElement>(null);

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

  const onCanvasDown = () => {
    const s = useWirepadStore.getState();
    if (s.selId) s.set({ selId: null });
    (document.activeElement as HTMLElement | null)?.blur?.();
  };

  const pg = project && activePage(project);
  const F = pg && frameOf(pg);

  return (
    <main
      className="relative min-w-0 flex-1"
      style={{ backgroundColor: "#181818", backgroundImage: "radial-gradient(#262626 1px, transparent 1px)", backgroundSize: "20px 20px" }}
    >
      <div ref={ref} onPointerDown={onCanvasDown} className="absolute inset-0 flex overflow-auto">
        {pg && F && (
          <div className="m-auto shrink-0 px-16 pb-16 pt-12">
            <div className="mb-2.5 flex justify-between gap-4 text-[11px] text-[#8c8c8c]">
              <span>{pg.name}</span>
              <span className="font-mono text-[#5c5c5c]">{`${F.label} · ${F.w}×${F.h}`}</span>
            </div>
            <div style={{ width: F.w * zoom, height: F.h * zoom, position: "relative" }}>
              <Board page={pg} zoom={zoom} />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
