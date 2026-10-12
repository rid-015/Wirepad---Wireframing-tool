"use client";

import { useEffect } from "react";
import { Monitor } from "lucide-react";
import { onPointerMove, onPointerUp } from "@/lib/interactions";
import { GRID_SIZES, activePage, useWirepadStore } from "@/lib/store";
import { Canvas } from "./canvas";
import { Modals } from "./modals";
import { ScreenManager } from "./screen-manager";
import { Sidebar } from "./sidebar";
import { Toolbar } from "./toolbar";

const ARROWS: Record<string, [number, number]> = { arrowleft: [-1, 0], arrowright: [1, 0], arrowup: [0, -1], arrowdown: [0, 1] };
const GRID_CYCLE = [0, ...GRID_SIZES];

function onKey(e: KeyboardEvent) {
  const s = useWirepadStore.getState();
  const t = e.target as HTMLElement | null;
  const typing = !!t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "SELECT" || t.isContentEditable);
  const mod = e.metaKey || e.ctrlKey, k = e.key.toLowerCase();
  if (!s.project) return;
  if (k === "escape") {
    if (s.modal || s.exportOpen || s.gridOpen) s.set({ modal: null, exportOpen: false, gridOpen: false });
    else if (typing) t!.blur();
    else s.set({ selId: null, multi: [] });
    return;
  }
  if (typing) return;
  if (mod && (k === "=" || k === "+")) { e.preventDefault(); s.zoomBy(1.25); return; }
  if (mod && k === "-") { e.preventDefault(); s.zoomBy(0.8); return; }
  if (mod && k === "0") { e.preventDefault(); s.fit(); return; }
  if (mod && k === "e") { e.preventDefault(); s.exportImg("png"); return; }
  if (s.view || s.modal) return;
  const sel = s.selId && activePage(s.project).elements.find((x) => x.id === s.selId);
  if (mod && k === "z") { e.preventDefault(); if (e.shiftKey) s.redo(); else s.undo(); return; }
  if (mod && k === "y") { e.preventDefault(); s.redo(); return; }
  if (mod && k === "d") { e.preventDefault(); s.dupSel(); return; }
  if (mod && k === "c") { if (sel) s.copySel(); return; }
  if (mod && k === "x") { if (sel) s.cutSel(); return; }
  if (mod && k === "v") { e.preventDefault(); s.pasteClip(); return; }
  if (mod && k === "a") { e.preventDefault(); s.selectAll(); return; }
  if (mod) return;
  const any = !!sel || s.multi.length > 0;
  if ((k === "delete" || k === "backspace") && any) { e.preventDefault(); s.deleteSel(); return; }
  if (ARROWS[k] && any) {
    e.preventDefault();
    const m = e.shiftKey ? 10 : 1, [ax, ay] = ARROWS[k];
    s.nudge(ax * m, ay * m);
    return;
  }
  if (k === "]") { s.reorder(1); return; }
  if (k === "[") { s.reorder(-1); return; }
  if (k === "g") { s.setGrid(GRID_CYCLE[(GRID_CYCLE.indexOf(s.grid) + 1) % GRID_CYCLE.length]); return; }
  if (k === "p") { s.createPage("blank"); return; }
  if (k === "t") { s.set({ modal: "new" }); return; }
  if (e.key === "?") { s.set({ modal: "keys" }); return; }
}

export function Editor() {
  const view = useWirepadStore((s) => s.view);
  const ghost = useWirepadStore((s) => s.ghost);
  const toast = useWirepadStore((s) => s.toast);
  const loaded = useWirepadStore((s) => !!s.project);

  useEffect(() => {
    useWirepadStore.getState().init();
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, []);

  return (
    <div className="flex h-screen select-none flex-col overflow-hidden bg-[#121212] font-sans text-xs text-[#ededed] antialiased">
      <Toolbar />
      <div className="flex min-h-0 flex-1">
        {loaded && !view && <Sidebar />}
        <Canvas />
        {loaded && !view && <ScreenManager />}
      </div>
      <Modals />
      {ghost && (
        <div
          style={{ left: ghost.x, top: ghost.y }}
          className="pointer-events-none fixed z-[60] -translate-x-1/2 -translate-y-1/2 rounded-md border border-[#3a3a3a] bg-[#262626] px-2.5 py-1.5 text-xs text-[#ededed] shadow-[0_8px_24px_rgba(0,0,0,.5)]"
        >
          {ghost.label}
        </div>
      )}
      {toast && (
        <div className="fixed bottom-6 left-1/2 z-[70] -translate-x-1/2 rounded-lg bg-[#ededed] px-3.5 py-[9px] text-xs font-medium text-[#121212] shadow-[0_8px_24px_rgba(0,0,0,.4)]">
          {toast}
        </div>
      )}
      {loaded && !view && (
        // Editing needs a pointer and room for both panels; shared view links still work on small screens.
        <div className="fixed inset-0 z-[80] flex flex-col items-center justify-center gap-4 bg-[#121212] px-8 text-center lg:hidden">
          <Monitor className="h-10 w-10 text-[#5c5c5c]" />
          <h1 className="text-lg font-medium">Wirepad is a desktop tool</h1>
          <p className="max-w-xs text-sm text-[#8c8c8c]">Please open Wirepad on a laptop or desktop for the full experience.</p>
        </div>
      )}
    </div>
  );
}
