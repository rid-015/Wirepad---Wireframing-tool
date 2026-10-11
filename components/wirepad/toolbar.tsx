"use client";

import { useRef } from "react";
import { FRAMES, type FrameKey } from "@/lib/component-registry";
import { GRID_SIZES, activePage, useWirepadStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Icon } from "./icon";

export const UI = ({ name, size = 14 }: { name: string; size?: number }) => <Icon name={name} size={size} strokeWidth={1.75} />;

export const FRAME_ICONS: Record<FrameKey, string> = { desktop: "Monitor", tablet: "Tablet", mobile: "Smartphone" };

const iconBtn =
  "flex h-[30px] w-[30px] items-center justify-center rounded-md bg-transparent text-[#a3a3a3] hover:bg-[#1f1f1f] hover:text-[#ededed]";
const sep = "mx-1.5 h-4 w-px bg-[#262626]";
const segment = "flex gap-0.5 rounded-[7px] border border-[#232323] bg-[#171717] p-0.5";
const menuItem = "flex justify-between rounded-[5px] bg-transparent px-2.5 py-2 text-left text-xs text-[#d4d4d4] hover:bg-[#222]";
const menuLabel = "px-2.5 pb-1 pt-2 text-[10px] uppercase tracking-[0.08em] text-[#5c5c5c]";
const primaryBtn =
  "flex h-[30px] items-center gap-1.5 rounded-md bg-[#ededed] px-3 text-xs font-medium text-[#121212] hover:bg-white";

export function Toolbar() {
  const s = useWirepadStore();
  const fileRef = useRef<HTMLInputElement>(null);
  const P = s.project;
  if (!P) return <header className="h-12 shrink-0 border-b border-[#262626] bg-[#121212]" />;
  const pg = activePage(P);
  const edit = !s.view;

  return (
    <header className="grid h-12 shrink-0 grid-cols-[1fr_auto_1fr] items-center gap-3 border-b border-[#262626] bg-[#121212] px-3">
      <div className="flex min-w-0 items-center gap-2.5">
        <div className="flex shrink-0 items-center gap-2">
          <div className="box-border h-[18px] w-[18px] border-[1.5px] border-[#ededed] [border-radius:4px_2px_5px_2px]" />
          <span className="text-[13px] font-semibold tracking-[-0.01em]">Wirepad</span>
        </div>
        <div className="h-4 w-px shrink-0 bg-[#262626]" />
        {edit ? (
          <input
            value={P.name}
            onChange={(e) => {
              const v = e.target.value;
              s.commit((P2) => {
                P2.name = v;
              }, "pname");
            }}
            spellCheck={false}
            className="w-[200px] min-w-0 rounded-[5px] border border-transparent bg-transparent px-1.5 py-[5px] text-xs text-[#a3a3a3] outline-none hover:border-[#262626] focus:border-[#3a3a3a] focus:text-[#ededed]"
          />
        ) : (
          <>
            <span className="truncate text-[#a3a3a3]">{P.name}</span>
            <span className="shrink-0 rounded border border-[#333] px-1.5 py-0.5 text-[10px] uppercase tracking-[0.08em] text-[#8c8c8c]">View only</span>
          </>
        )}
      </div>

      <div className="flex items-center gap-0.5">
        {edit && (
          <>
            <button onClick={s.undo} title="Undo (⌘Z)" className={iconBtn} style={{ opacity: s.canUndo ? 1 : 0.35 }}>
              <UI name="Undo2|Undo" />
            </button>
            <button onClick={s.redo} title="Redo (⌘⇧Z)" className={iconBtn} style={{ opacity: s.canRedo ? 1 : 0.35 }}>
              <UI name="Redo2|Redo" />
            </button>
            <div className={sep} />
          </>
        )}
        {!edit && (
          <div className="mr-2 flex gap-0.5">
            {P.pages.map((p) => {
              const act = p.id === P.activeId;
              return (
                <button
                  key={p.id}
                  onClick={() => s.setActive(p.id)}
                  className={cn("h-7 rounded-md px-2.5 text-xs hover:text-[#ededed]", act ? "bg-[#222] text-[#ededed]" : "bg-transparent text-[#8c8c8c]")}
                >
                  {p.name}
                </button>
              );
            })}
          </div>
        )}
        <button onClick={() => s.zoomBy(0.8)} title="Zoom out (⌘−)" className={iconBtn}>
          <UI name="Minus" />
        </button>
        <button
          onClick={s.fit}
          title="Zoom to fit (⌘0)"
          className="h-[30px] min-w-12 rounded-md bg-transparent font-mono text-[11px] text-[#a3a3a3] hover:bg-[#1f1f1f] hover:text-[#ededed]"
        >
          {Math.round(s.zoom * 100) + "%"}
        </button>
        <button onClick={() => s.zoomBy(1.25)} title="Zoom in (⌘+)" className={iconBtn}>
          <UI name="Plus" />
        </button>
        {edit && (
          <>
            <div className={sep} />
            <div className={segment}>
              {(Object.keys(FRAMES) as FrameKey[]).map((k) => {
                const f = FRAMES[k], act = pg.frame === k;
                return (
                  <button
                    key={k}
                    title={`${f.label} · ${f.w}×${f.h}`}
                    onClick={() => {
                      if (act) return;
                      s.commit((P2, p2) => {
                        p2.frame = k;
                      });
                      requestAnimationFrame(() => useWirepadStore.getState().fit());
                    }}
                    className={cn("flex h-[26px] w-8 items-center justify-center rounded-[5px] hover:text-[#ededed]", act ? "bg-[#2a2a2a] text-[#ededed]" : "bg-transparent text-[#8c8c8c]")}
                  >
                    <UI name={FRAME_ICONS[k]} size={15} />
                  </button>
                );
              })}
            </div>
            <div className={sep} />
            <div title="Grid (G cycles)" className={cn(segment, "items-center")}>
              <span className="flex items-center px-1.5 text-[#5c5c5c]">
                <UI name="Grid3x3|Grid" />
              </span>
              {GRID_SIZES.map((v) => {
                const act = s.grid === v;
                return (
                  <button
                    key={v}
                    title={act ? "Hide grid" : `${v}px grid`}
                    onClick={() => s.setGrid(act ? 0 : v)}
                    className={cn("h-[26px] min-w-8 rounded-[5px] px-1.5 font-mono text-[11px] hover:text-[#ededed]", act ? "bg-[#2a2a2a] text-[#ededed]" : "bg-transparent text-[#8c8c8c]")}
                  >
                    {v}
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>

      <div className="flex items-center justify-end gap-1.5">
        <span className="mr-1 whitespace-nowrap text-[11px] text-[#5c5c5c]">{s.view ? "" : s.saved ? "Saved in browser" : "Saving…"}</span>
        <button onClick={() => s.set({ modal: "keys" })} title="Keyboard shortcuts (?)" className={iconBtn}>
          <UI name="Keyboard" size={15} />
        </button>
        <div className="relative">
          <button
            onClick={() => s.set({ exportOpen: !s.exportOpen })}
            className="flex h-[30px] items-center gap-1.5 rounded-md border border-[#262626] bg-transparent px-2.5 text-xs text-[#d4d4d4] hover:bg-[#1f1f1f]"
          >
            <UI name="Download" />
            <span>Export</span>
            <UI name="ChevronDown" size={12} />
          </button>
          {s.exportOpen && (
            <>
              <div onClick={() => s.set({ exportOpen: false })} className="fixed inset-0 z-40" />
              <div className="absolute right-0 top-9 z-[41] flex w-[220px] flex-col rounded-lg border border-[#2a2a2a] bg-[#161616] p-1 shadow-[0_12px_32px_rgba(0,0,0,.5)]">
                <div className={menuLabel}>Current page</div>
                <button onClick={() => s.exportImg("png")} className={menuItem}>
                  PNG<span className="font-mono text-[11px] text-[#5c5c5c]">⌘E</span>
                </button>
                <button onClick={() => s.exportImg("png", 2)} className={menuItem}>PNG @2x</button>
                <button onClick={() => s.exportImg("jpg")} className={menuItem}>JPG</button>
                <button onClick={() => s.exportImg("png", 1, true)} className={menuItem}>All pages as PNG</button>
                {edit && (
                  <>
                    <div className="my-1 h-px bg-[#262626]" />
                    <div className={menuLabel}>Project</div>
                    <button onClick={s.exportJson} className={menuItem}>Download .json</button>
                    <button
                      onClick={() => {
                        s.set({ exportOpen: false });
                        fileRef.current?.click();
                      }}
                      className={menuItem}
                    >
                      Import .json…
                    </button>
                    <button onClick={s.resetProject} className={cn(menuItem, "text-[#e5484d]")}>New project</button>
                  </>
                )}
              </div>
            </>
          )}
        </div>
        {edit ? (
          <button onClick={s.openShare} className={primaryBtn}>
            <UI name="Share2|Share" />
            <span>Share</span>
          </button>
        ) : (
          <button onClick={s.editCopy} className={primaryBtn}>
            <UI name="PenLine|Pencil" size={13} />
            <span>Edit a copy</span>
          </button>
        )}
      </div>
      <input
        ref={fileRef}
        type="file"
        accept=".json,application/json"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          e.target.value = "";
          if (f) s.importFile(f);
        }}
      />
    </header>
  );
}
