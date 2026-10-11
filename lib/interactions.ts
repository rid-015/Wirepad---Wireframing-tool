import type React from "react";
import { frameOf, uid, type LibraryItem, type WireElement } from "./component-registry";
import { activePage, dom, dupMemo, useWirepadStore } from "./store";

/** Resize handle direction: any combination of n/s/e/w, or undefined for a move. */
export type Dir = "n" | "s" | "e" | "w" | "nw" | "ne" | "se" | "sw";

interface Drag {
  id: string;
  origId: string;
  dir?: Dir;
  alt: boolean;
  sx: number;
  sy: number;
  o: WireElement;
  pre: string;
  moved: boolean;
  vx: number[];
  vy: number[];
}

let drag: Drag | null = null;
let side: { item: LibraryItem; sx: number; sy: number; on: boolean } | null = null;

const S = () => useWirepadStore.getState();
const clone = <T,>(o: T): T => JSON.parse(JSON.stringify(o));

/** Snap targets: page edges/centre plus every other element's edges and centres. */
function guideLines(excludeId: string | null) {
  const pg = activePage(S().project!);
  const F = frameOf(pg);
  const vx = [0, F.w / 2, F.w], vy = [0, F.h / 2, F.h];
  pg.elements.forEach((o) => {
    if (o.id === excludeId) return;
    vx.push(o.x, o.x + o.w / 2, o.x + o.w);
    vy.push(o.y, o.y + o.h / 2, o.y + o.h);
  });
  return { vx, vy };
}

function near(vals: number[], list: number[]) {
  const th = 6 / S().zoom;
  let best: { d: number; v: number } | null = null;
  for (const m of vals)
    for (const v of list) {
      const dd = v - m;
      if (Math.abs(dd) < th && (best === null || Math.abs(dd) < Math.abs(best.d))) best = { d: dd, v };
    }
  return best;
}

export function startMove(e: React.PointerEvent, id: string, dir?: Dir) {
  const s = S();
  if (s.view || !s.project || e.button !== 0) return;
  e.stopPropagation();
  e.preventDefault();
  (document.activeElement as HTMLElement | null)?.blur?.();
  const el = activePage(s.project).elements.find((x) => x.id === id);
  if (!el) return;
  const pre = JSON.stringify(s.project);
  let target = el, alt = false;
  if (e.altKey && !dir) {
    // ⌥-drag leaves the original in place and drags a copy.
    target = { ...clone(el), id: uid() };
    alt = true;
    const P = clone(s.project);
    activePage(P).elements.push(target);
    s.set({ project: P, selId: target.id });
  } else if (s.selId !== id) s.set({ selId: id });
  drag = { id: target.id, origId: id, dir, alt, sx: e.clientX, sy: e.clientY, o: { ...target }, pre, moved: false, ...guideLines(alt ? null : id) };
}

export function startSideDrag(e: React.PointerEvent, item: LibraryItem) {
  if (e.button !== 0) return;
  e.preventDefault();
  side = { item, sx: e.clientX, sy: e.clientY, on: false };
}

export function onPointerMove(e: PointerEvent) {
  const s = S();
  if (side) {
    if (!side.on && Math.hypot(e.clientX - side.sx, e.clientY - side.sy) > 4) side.on = true;
    if (side.on) s.set({ ghost: { x: e.clientX, y: e.clientY, label: side.item.label } });
    return;
  }
  const d = drag;
  if (!d || !s.project) return;
  const z = s.zoom, dx = (e.clientX - d.sx) / z, dy = (e.clientY - d.sy) / z;
  if (!d.moved && Math.hypot(dx * z, dy * z) < 2) return;
  d.moved = true;
  const o = d.o;
  let { x, y, w, h } = o;
  let gx: number | null = null, gy: number | null = null;
  if (!d.dir) {
    x = o.x + dx;
    y = o.y + dy;
    const bx = near([x, x + w / 2, x + w], d.vx);
    if (bx) { x += bx.d; gx = bx.v; } else x = s.snap(x);
    const by = near([y, y + h / 2, y + h], d.vy);
    if (by) { y += by.d; gy = by.v; } else y = s.snap(y);
    x = Math.round(x);
    y = Math.round(y);
  } else {
    const se = (v: number, list: number[], ax: "x" | "y") => {
      const b = near([v], list);
      if (b) {
        if (ax === "x") gx = b.v; else gy = b.v;
        return Math.round(b.v);
      }
      return s.snap(v);
    };
    let L = o.x, Rt = o.x + o.w, Tp = o.y, B = o.y + o.h;
    if (d.dir.includes("e")) Rt = Math.max(L + 4, se(Rt + dx, d.vx, "x"));
    if (d.dir.includes("w")) L = Math.min(Rt - 4, se(L + dx, d.vx, "x"));
    if (d.dir.includes("s")) B = Math.max(Tp + 4, se(B + dy, d.vy, "y"));
    if (d.dir.includes("n")) Tp = Math.min(B - 4, se(Tp + dy, d.vy, "y"));
    if (e.shiftKey && d.dir.length === 2) {
      const r = o.w / o.h;
      let nw = Rt - L, nh = B - Tp;
      if (nw / nh > r) nh = Math.round(nw / r); else nw = Math.round(nh * r);
      if (d.dir.includes("w")) L = Rt - nw; else Rt = L + nw;
      if (d.dir.includes("n")) Tp = B - nh; else B = Tp + nh;
      gx = gy = null;
    }
    x = L; y = Tp; w = Rt - L; h = B - Tp;
  }
  const P = clone(s.project);
  const el = activePage(P).elements.find((q) => q.id === d.id);
  if (el) Object.assign(el, { x, y, w, h });
  s.set({ project: P, guides: { x: gx, y: gy } });
}

export function onPointerUp(e: PointerEvent) {
  const s = S();
  if (side) {
    const sd = side;
    side = null;
    if (sd.on) {
      s.set({ ghost: null });
      const b = dom.board;
      if (!b) return;
      const r = b.getBoundingClientRect();
      if (e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom)
        s.addEl(sd.item, (e.clientX - r.left) / s.zoom, (e.clientY - r.top) / s.zoom);
    } else s.addEl(sd.item);
    return;
  }
  const d = drag;
  drag = null;
  if (!d) return;
  if (s.guides) s.set({ guides: null });
  if (d.moved) {
    s.commitLive(d.pre);
    if (d.alt) dupMemo.last = { newId: d.id, sx: d.o.x, sy: d.o.y };
  } else if (d.alt) s.set({ project: JSON.parse(d.pre), selId: d.origId });
}
