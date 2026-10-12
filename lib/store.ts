import { create } from "zustand";
import {
  FRAMES,
  FULL,
  INSET,
  adaptPage,
  defaultProject,
  frameOf,
  isTall,
  makePage,
  uid,
  type FrameKey,
  type LibraryItem,
  type Page,
  type Project,
  type WireElement,
} from "./component-registry";
import { boardToImage, download, exportProjectJson } from "./export";
import { decodeShare, encodeShare } from "./share";

const KEY = "wirepad:v2:project";
const GRID_KEY = "wirepad:grid";
export const GRID_SIZES = [8, 16, 32] as const;
export const MIN_PAGE_H = 200;
export const MAX_PAGE_H = 20000;

const clone = <T,>(o: T): T => JSON.parse(JSON.stringify(o));
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const fileName = (s: string) => String(s || "").replace(/[\\/:*?"<>|]+/g, "").trim() || "Page";

export const activePage = (P: Project): Page => P.pages.find((p) => p.id === P.activeId) || P.pages[0];

/** DOM nodes the store needs for fitting, dropping and exporting. Set by the canvas. */
export const dom: { canvas: HTMLDivElement | null; board: HTMLDivElement | null } = { canvas: null, board: null };

export type Modal = "new" | "share" | "keys" | null;
export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface State {
  project: Project | null;
  view: boolean;
  /** Single selection. */
  selId: string | null;
  /** Multi-selection (2+ ids); exclusive with selId. */
  multi: string[];
  marq: Rect | null;
  zoom: number;
  grid: number;
  guides: { x: number | null; y: number | null } | null;
  modal: Modal;
  exportOpen: boolean;
  gridOpen: boolean;
  toast: string | null;
  shareUrl: string;
  query: string;
  ghost: { x: number; y: number; label: string } | null;
  saved: boolean;
  canUndo: boolean;
  canRedo: boolean;
}

interface Actions {
  init: () => Promise<void>;
  set: (s: Partial<State>) => void;
  setProject: (p: Project, extra?: Partial<State>) => void;
  commit: (fn: (P: Project, pg: Page) => void, key?: string | null, extra?: Partial<State>) => void;
  /** Pushes an undo snapshot taken before a live (uncommitted) change, then saves. */
  commitLive: (pre: string) => void;
  undo: () => void;
  redo: () => void;
  flash: (msg: string) => void;
  fit: () => boolean;
  /** Re-fits and scrolls the canvas to the top after the next render. */
  toTop: () => void;
  zoomBy: (f: number) => void;
  setGrid: (v: number) => void;
  snap: (v: number) => number;
  select: (ids: string[]) => void;
  selectAll: () => void;
  addEl: (item: LibraryItem, cx?: number, cy?: number) => void;
  updSel: (fn: (el: WireElement) => void, key?: string | null) => void;
  nudge: (dx: number, dy: number) => void;
  deleteSel: () => void;
  dupSel: () => void;
  paste: (src: WireElement, dx?: number, dy?: number) => WireElement;
  copySel: () => void;
  cutSel: () => void;
  pasteClip: () => void;
  reorder: (dir: number) => void;
  setFrame: (k: FrameKey) => void;
  setActive: (id: string) => void;
  createPage: (tplId: string, frame?: FrameKey) => void;
  renamePage: (id: string, name: string) => void;
  dupPage: (id: string) => void;
  delPage: (id: string) => void;
  clearPage: () => void;
  exportImg: (fmt: "png" | "jpg", scale?: number, all?: boolean) => Promise<void>;
  exportJson: () => void;
  importFile: (f: File) => Promise<void>;
  openShare: () => Promise<void>;
  copyShare: () => Promise<void>;
  editCopy: () => void;
}

// Non-reactive editor memory.
let undoStack: string[] = [];
let redoStack: string[] = [];
let lastKey: string | null = null;
let lastT = 0;
let saveTimer: ReturnType<typeof setTimeout> | undefined;
let toastTimer: ReturnType<typeof setTimeout> | undefined;
let clip: WireElement | null = null;
/** `?fresh=1` shows the first-run state without reading or writing saved data. */
let fresh = false;
/** Remembers the last duplicate so ⌘D repeats the offset the user dragged it to. */
export const dupMemo: { last: { newId: string; sx: number; sy: number } | null } = { last: null };

const fitSoon = () => requestAnimationFrame(() => useWirepadStore.getState().fit());

export const useWirepadStore = create<State & Actions>()((set, get) => ({
  project: null,
  view: false,
  selId: null,
  multi: [],
  marq: null,
  zoom: 1,
  grid: 0,
  guides: null,
  modal: null,
  exportOpen: false,
  gridOpen: false,
  toast: null,
  shareUrl: "",
  query: "",
  ghost: null,
  saved: true,
  canUndo: false,
  canRedo: false,

  async init() {
    let grid = 0;
    try {
      grid = +(localStorage.getItem(GRID_KEY) || 0) || 0;
    } catch {}
    let project: Project | null = null;
    let view = false;
    const m = location.hash.match(/^#v=(.+)$/);
    if (m) {
      try {
        project = await decodeShare(m[1]);
        view = true;
      } catch (e) {
        console.warn("Bad share link", e);
      }
    }
    fresh = /[?&]fresh\b/.test(location.search);
    if (!project && !fresh) {
      try {
        project = JSON.parse(localStorage.getItem(KEY) || "null");
      } catch {}
    }
    if (!project || !Array.isArray(project.pages) || !project.pages.length) project = defaultProject();
    if (!project.pages.find((p) => p.id === project!.activeId)) project.activeId = project.pages[0].id;
    set({ project, view, grid });
  },

  set: (s) => set(s),

  setProject(p, extra = {}) {
    set({ project: p, saved: false, ...extra });
    if (get().view || fresh) return;
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      try {
        localStorage.setItem(KEY, JSON.stringify(p));
        set({ saved: true });
      } catch {
        get().flash("Storage full — export a .json backup");
      }
    }, 300);
  },

  commit(fn, key, extra) {
    const { view, project } = get();
    if (view || !project) return;
    const now = Date.now();
    // Rapid edits with the same key (typing, nudging) collapse into one undo step.
    if (!(key && key === lastKey && now - lastT < 900)) {
      undoStack.push(JSON.stringify(project));
      if (undoStack.length > 150) undoStack.shift();
      redoStack = [];
    }
    lastKey = key ?? null;
    lastT = now;
    const d = clone(project);
    fn(d, activePage(d));
    get().setProject(d, { ...extra, canUndo: true, canRedo: false });
  },

  commitLive(pre) {
    undoStack.push(pre);
    redoStack = [];
    lastKey = null;
    get().setProject(get().project!, { canUndo: true, canRedo: false });
  },

  undo() {
    const { project } = get();
    if (!undoStack.length || !project) return;
    redoStack.push(JSON.stringify(project));
    lastKey = null;
    get().setProject(JSON.parse(undoStack.pop()!), { canUndo: undoStack.length > 0, canRedo: true });
  },

  redo() {
    const { project } = get();
    if (!redoStack.length || !project) return;
    undoStack.push(JSON.stringify(project));
    lastKey = null;
    get().setProject(JSON.parse(redoStack.pop()!), { canUndo: true, canRedo: redoStack.length > 0 });
  },

  flash(msg) {
    clearTimeout(toastTimer);
    set({ toast: msg });
    toastTimer = setTimeout(() => set({ toast: null }), 1800);
  },

  fit() {
    const c = dom.canvas;
    const { project } = get();
    if (!c || !project || !c.clientWidth || !c.clientHeight) return false;
    const pg = activePage(project);
    const F = frameOf(pg);
    // Tall pages fit by width and scroll.
    const z = Math.min((c.clientWidth - 128) / F.w, isTall(pg) ? 1 : (c.clientHeight - 136) / F.h, 1);
    set({ zoom: Math.max(0.1, Math.floor(z * 100) / 100) });
    return true;
  },

  toTop() {
    setTimeout(
      () =>
        requestAnimationFrame(() => {
          get().fit();
          if (dom.canvas) dom.canvas.scrollTop = 0;
        }),
      0
    );
  },

  zoomBy(f) {
    set((s) => ({ zoom: Math.min(4, Math.max(0.1, Math.round(s.zoom * f * 100) / 100)) }));
  },

  setGrid(v) {
    set({ grid: v });
    try {
      localStorage.setItem(GRID_KEY, String(v));
    } catch {}
  },

  snap(v) {
    const g = get().grid;
    return g ? Math.round(v / g) * g : Math.round(v);
  },

  select(ids) {
    set(ids.length > 1 ? { multi: ids, selId: null } : { multi: [], selId: ids[0] || null });
  },

  selectAll() {
    const { project, select } = get();
    if (project) select(activePage(project).elements.map((q) => q.id));
  },

  addEl(item, cx, cy) {
    const { project, snap, zoom } = get();
    if (!project) return;
    const F = frameOf(activePage(project));
    const w = item.w === FULL ? F.w : item.w === INSET ? F.w - 32 : Math.min(item.w, F.w - 32);
    const h = item.h === FULL ? F.h : item.h;
    const fx = item.w === FULL ? 0 : item.w === INSET ? 16 : null;
    let x: number, y: number;
    if (cx == null || cy == null) {
      x = fx ?? Math.round((F.w - w) / 2);
      // Click-to-add lands in the middle of what is visible, not the middle of a tall page.
      let vy = F.h / 2;
      if (dom.canvas && dom.board) {
        const cr = dom.canvas.getBoundingClientRect(), br = dom.board.getBoundingClientRect();
        vy = (cr.top + cr.height / 2 - br.top) / zoom;
      }
      y =
        item.at === "top"
          ? 0
          : item.at === "bottom"
            ? F.h - h - (item.w === INSET ? 34 : 0)
            : Math.round(Math.max(0, Math.min(F.h - h, vy - h / 2)));
    } else {
      x = fx ?? snap(cx - w / 2);
      y = snap(cy - h / 2);
    }
    const el: WireElement = { id: uid(), type: item.type, x, y, w, h, props: { ...item.props } };
    get().commit((P, pg) => pg.elements.push(el), null, { selId: el.id, multi: [] });
  },

  updSel(fn, key) {
    const id = get().selId;
    if (!id) return;
    get().commit(
      (P, pg) => {
        const el = pg.elements.find((e) => e.id === id);
        if (el) fn(el);
      },
      key ? key + id : null
    );
  },

  nudge(dx, dy) {
    const { multi, updSel, commit } = get();
    if (multi.length)
      commit((P, pg) =>
        pg.elements.forEach((q) => {
          if (multi.includes(q.id)) {
            q.x += dx;
            q.y += dy;
          }
        }), "nudge-multi");
    else
      updSel((el) => {
        el.x += dx;
        el.y += dy;
      }, "nudge");
  },

  deleteSel() {
    const { multi, selId, commit, flash } = get();
    if (multi.length) {
      commit((P, pg) => {
        pg.elements = pg.elements.filter((e) => !multi.includes(e.id));
      }, null, { multi: [], selId: null });
      flash(`Deleted ${multi.length} items — ⌘Z to undo`);
      return;
    }
    if (!selId) return;
    commit((P, pg) => {
      pg.elements = pg.elements.filter((e) => e.id !== selId);
    }, null, { selId: null });
  },

  dupSel() {
    const { project, selId, multi } = get();
    if (!project) return;
    if (multi.length) {
      const nu: string[] = [];
      get().commit((P, pg) => {
        pg.elements
          .filter((q) => multi.includes(q.id))
          .forEach((q) => {
            const c = { ...clone(q), id: uid(), x: q.x + 16, y: q.y + 16 };
            pg.elements.push(c);
            nu.push(c.id);
          });
      }, null);
      set({ multi: nu });
      return;
    }
    const el = selId && activePage(project).elements.find((e) => e.id === selId);
    if (!el) return;
    let dx = 16, dy = 16;
    const ld = dupMemo.last;
    if (ld && ld.newId === el.id && (el.x !== ld.sx || el.y !== ld.sy)) {
      dx = el.x - ld.sx;
      dy = el.y - ld.sy;
    }
    const n = get().paste(el, dx, dy);
    dupMemo.last = { newId: n.id, sx: el.x, sy: el.y };
  },

  paste(src, dx = 16, dy = dx) {
    const n = { ...clone(src), id: uid(), x: src.x + dx, y: src.y + dy };
    get().commit((P, pg) => pg.elements.push(n), null, { selId: n.id, multi: [] });
    return n;
  },

  copySel() {
    const { project, selId } = get();
    const el = project && selId && activePage(project).elements.find((e) => e.id === selId);
    if (el) clip = clone(el);
  },

  cutSel() {
    get().copySel();
    if (clip) get().deleteSel();
  },

  pasteClip() {
    if (!clip) return;
    get().paste(clip, 16);
    clip = { ...clip, x: clip.x + 16, y: clip.y + 16 };
  },

  reorder(dir) {
    const id = get().selId;
    if (!id) return;
    get().commit((P, pg) => {
      const a = pg.elements, i = a.findIndex((e) => e.id === id), j = i + dir;
      if (i < 0 || j < 0 || j >= a.length) return;
      [a[i], a[j]] = [a[j], a[i]];
    });
  },

  setFrame(k) {
    const { project, commit, flash, toTop } = get();
    if (!project) return;
    const pg = activePage(project);
    if (pg.frame === k) return;
    const had = pg.elements.length;
    commit((P, p2) => {
      adaptPage(p2, k);
    }, null, { selId: null, multi: [] });
    toTop();
    if (had) flash(`Adapted to ${FRAMES[k].label} — ⌘Z to undo`);
  },

  setActive(id) {
    const { project } = get();
    if (!project || project.activeId === id) return;
    get().setProject({ ...project, activeId: id }, { selId: null, multi: [] });
    get().toTop();
  },

  createPage(tplId, frame) {
    const { project } = get();
    if (!project) return;
    const pg = makePage(tplId, frame || activePage(project).frame);
    if (tplId === "blank") pg.name = "Page " + (project.pages.length + 1);
    get().commit((P) => {
      P.pages.push(pg);
      P.activeId = pg.id;
    }, null, { modal: null, selId: null, multi: [] });
    get().toTop();
  },

  renamePage(id, name) {
    get().commit((P) => {
      const t = P.pages.find((x) => x.id === id);
      if (t) t.name = name;
    }, "pgname" + id);
  },

  dupPage(id) {
    const src = get().project?.pages.find((p) => p.id === id);
    if (!src) return;
    const n: Page = { ...clone(src), id: uid(), name: src.name + " copy" };
    n.elements.forEach((e) => (e.id = uid()));
    get().commit((P) => {
      P.pages.splice(P.pages.findIndex((p) => p.id === id) + 1, 0, n);
      P.activeId = n.id;
    }, null, { selId: null, multi: [] });
  },

  delPage(id) {
    if ((get().project?.pages.length ?? 0) <= 1) {
      get().flash("A project needs at least one page");
      return;
    }
    get().commit((P) => {
      const i = P.pages.findIndex((p) => p.id === id);
      P.pages.splice(i, 1);
      if (P.activeId === id) P.activeId = P.pages[Math.max(0, i - 1)].id;
    }, null, { selId: null, multi: [] });
    fitSoon();
  },

  clearPage() {
    const { project } = get();
    if (!project || !activePage(project).elements.length) return;
    get().commit((P, pg) => {
      pg.elements = [];
    }, null, { selId: null, multi: [] });
    get().flash("Page cleared — ⌘Z to undo");
  },

  async exportImg(fmt, scale = 1, all = false) {
    set({ exportOpen: false });
    const P = get().project;
    if (!P) return;
    const orig = P.activeId;
    const list = all ? P.pages : [activePage(P)];
    try {
      for (const pg of list) {
        if (all) {
          set({ project: { ...get().project!, activeId: pg.id } });
          await sleep(120);
        }
        const node = dom.board;
        if (!node) throw new Error("No artboard");
        const url = await boardToImage(node, frameOf(pg), fmt, scale);
        download(url, `${fileName(pg.name)}${scale > 1 ? "@" + scale + "x" : ""}.${fmt}`);
      }
      get().flash(list.length > 1 ? `Exported ${list.length} pages` : `Exported ${fmt.toUpperCase()}`);
    } catch (e) {
      console.error(e);
      get().flash("Export failed");
    }
    if (all) set({ project: { ...get().project!, activeId: orig } });
  },

  exportJson() {
    const P = get().project;
    if (P) exportProjectJson(P);
    set({ exportOpen: false });
  },

  async importFile(f) {
    try {
      const d: Project = JSON.parse(await f.text());
      if (!Array.isArray(d.pages) || !d.pages.length) throw new Error("bad");
      if (!d.pages.find((p) => p.id === d.activeId)) d.activeId = d.pages[0].id;
      get().commit((P) => {
        Object.keys(P).forEach((k) => delete (P as unknown as Record<string, unknown>)[k]);
        Object.assign(P, d);
      }, null, { selId: null, multi: [] });
      fitSoon();
      get().flash("Project imported");
    } catch {
      get().flash("That file is not a Wirepad project");
    }
  },

  async openShare() {
    const P = get().project;
    if (!P) return;
    try {
      const code = await encodeShare(P);
      set({ modal: "share", shareUrl: location.href.split("#")[0] + "#v=" + code });
    } catch {
      get().flash("Could not create link");
    }
  },

  async copyShare() {
    try {
      await navigator.clipboard.writeText(get().shareUrl);
      get().flash("Link copied");
    } catch {
      get().flash("Select the link and copy it manually");
    }
  },

  editCopy() {
    let has = false;
    try {
      has = !!localStorage.getItem(KEY);
    } catch {}
    if (has && !window.confirm("Replace the project saved in this browser with this shared copy?")) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(get().project));
    } catch {}
    history.replaceState(null, "", location.href.split("#")[0]);
    undoStack = [];
    redoStack = [];
    set({ view: false, saved: true, canUndo: false, canRedo: false });
    fitSoon();
  },
}));
