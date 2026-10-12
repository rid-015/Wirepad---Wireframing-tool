"use client";

import { useMemo, type ReactNode } from "react";
import { FRAMES, TEMPLATES, makePage, type FrameKey } from "@/lib/component-registry";
import { useWirepadStore } from "@/lib/store";
import { Thumb } from "./canvas";
import { UI } from "./toolbar";

export const SHORTCUTS: [string, string][] = [
  ["Undo", "⌘ Z"],
  ["Redo", "⌘ ⇧ Z"],
  ["Duplicate (repeats last offset)", "⌘ D"],
  ["Duplicate while dragging", "⌥ drag"],
  ["Copy / Paste", "⌘ C  ⌘ V"],
  ["Box select", "Drag empty area"],
  ["Add to selection", "⇧ click"],
  ["Select all", "⌘ A"],
  ["Delete", "⌫"],
  ["Nudge", "Arrows · ⇧ ×10"],
  ["Resize keeping ratio", "⇧ corner"],
  ["Grid 8 / 16 / 32 / off", "G"],
  ["New blank page", "P"],
  ["Templates", "T"],
  ["Zoom in / out", "⌘ +  ⌘ −"],
  ["Zoom to fit", "⌘ 0"],
  ["Export PNG", "⌘ E"],
  ["Deselect / close", "Esc"],
];

function Modal({ title, width, gap, children }: { title: string; width: number; gap: number; children: ReactNode }) {
  const close = () => useWirepadStore.getState().set({ modal: null });
  return (
    <div onClick={close} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6">
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: width, gap }}
        className="flex max-h-[90vh] w-full flex-col overflow-auto rounded-[10px] border border-[#2a2a2a] bg-[#151515] p-5 shadow-[0_24px_64px_rgba(0,0,0,.6)]"
      >
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold">{title}</span>
          <button
            onClick={close}
            className="flex h-[26px] w-[26px] items-center justify-center rounded-[5px] bg-transparent text-[#8c8c8c] hover:bg-[#222] hover:text-[#ededed]"
          >
            <UI name="X" size={15} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

const DEVICES: FrameKey[] = ["desktop", "tablet", "mobile"];

function TemplatesModal() {
  const createPage = useWirepadStore((s) => s.createPage);
  // Built once per opening: build() mints fresh element ids.
  const groups = useMemo(
    () =>
      DEVICES.map((k) => ({
        k,
        items: [
          { id: "blank", name: "Blank", page: makePage("blank", k), frame: k },
          ...TEMPLATES.filter((t) => t.frame === k).map((t) => ({ id: t.id, name: t.name, page: makePage(t.id), frame: undefined })),
        ],
      })),
    []
  );
  return (
    <Modal title="Start from a template" width={940} gap={16}>
      <div className="flex flex-col gap-[22px]">
        {groups.map((g) => (
          <div key={g.k} className="flex flex-col gap-2.5">
            <span className="text-[10px] font-medium uppercase tracking-[0.1em] text-[#8c8c8c]">{FRAMES[g.k].label}</span>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(168px,1fr))] gap-2.5">
              {g.items.map((t) => (
                <button
                  key={t.id}
                  onClick={() => createPage(t.id, t.frame)}
                  className="flex flex-col gap-2 rounded-lg border border-[#262626] bg-[#1a1a1a] p-1.5 text-left text-[#ededed] hover:border-[#4a4a4a] hover:bg-[#1e1e1e]"
                >
                  <Thumb page={t.page} />
                  <span className="truncate px-1 pb-0.5 text-xs">{t.name}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
}

function ShareModal() {
  const shareUrl = useWirepadStore((s) => s.shareUrl);
  const copyShare = useWirepadStore((s) => s.copyShare);
  return (
    <Modal title="Share view-only link" width={460} gap={14}>
      <p className="m-0 text-pretty leading-[1.55] text-[#a3a3a3]">
        The whole project is stored inside the link, so nothing is uploaded. Anyone who opens it can view every page and export images. Edits you make
        later need a new link.
      </p>
      <div className="flex gap-1.5">
        <input
          readOnly
          value={shareUrl}
          onFocus={(e) => e.target.select()}
          className="h-8 min-w-0 flex-1 rounded-md border border-[#262626] bg-[#0e0e0e] px-2.5 font-mono text-[11px] text-[#d4d4d4] outline-none"
        />
        <button onClick={copyShare} className="h-8 rounded-md bg-[#ededed] px-3.5 text-xs font-medium text-[#121212] hover:bg-white">
          Copy link
        </button>
      </div>
      <span className="font-mono text-[10px] text-[#5c5c5c]">{shareUrl ? `${(shareUrl.length / 1024).toFixed(1)} KB link` : ""}</span>
    </Modal>
  );
}

function KeysModal() {
  return (
    <Modal title="Keyboard shortcuts" width={400} gap={12}>
      <div className="flex flex-col">
        {SHORTCUTS.map(([label, keys]) => (
          <div key={label} className="flex items-center justify-between border-b border-[#1f1f1f] py-[7px]">
            <span className="text-[#a3a3a3]">{label}</span>
            <span className="whitespace-pre rounded border border-[#2a2a2a] bg-[#1f1f1f] px-1.5 py-0.5 font-mono text-[11px] text-[#ededed]">{keys}</span>
          </div>
        ))}
      </div>
    </Modal>
  );
}

export function Modals() {
  const modal = useWirepadStore((s) => s.modal);
  const project = useWirepadStore((s) => s.project);
  if (!project) return null;
  if (modal === "new") return <TemplatesModal />;
  if (modal === "share") return <ShareModal />;
  if (modal === "keys") return <KeysModal />;
  return null;
}
