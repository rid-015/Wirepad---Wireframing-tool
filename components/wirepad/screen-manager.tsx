"use client";

import { useEffect, useState } from "react";
import { ICON_NAMES, LABELS, type WireElement } from "@/lib/component-registry";
import { activePage, useWirepadStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { focusField } from "./canvas";
import { FRAME_ICONS, UI } from "./toolbar";

const field =
  "h-[30px] rounded-[5px] border border-[#262626] bg-[#171717] px-2 text-xs text-[#ededed] outline-none focus:border-[#4a4a4a]";
const stateBtn = "h-[26px] rounded-[5px] border border-[#262626] bg-[#171717] px-3 text-xs text-[#ededed] hover:bg-[#222]";
const smallBtn = "flex h-5 w-5 items-center justify-center rounded bg-transparent p-0 text-[#5c5c5c] hover:bg-[#2a2a2a]";

/** Number input that tolerates transient invalid text (e.g. empty, "-") while typing. */
function NumField({ label, value, min, onCommit }: { label: string; value: number; min?: number; onCommit: (v: number) => void }) {
  const [draft, setDraft] = useState(String(value));
  useEffect(() => setDraft(String(value)), [value]);
  return (
    <label className="flex h-7 items-center gap-1.5 rounded-[5px] border border-[#262626] bg-[#171717] px-2">
      <span className="w-2.5 text-[#5c5c5c]">{label}</span>
      <input
        type="number"
        value={draft}
        onChange={(e) => {
          setDraft(e.target.value);
          const v = parseInt(e.target.value, 10);
          if (!isNaN(v)) onCommit(min != null ? Math.max(min, v) : v);
        }}
        onBlur={() => setDraft(String(value))}
        className="w-full min-w-0 flex-1 border-none bg-transparent font-mono text-[11px] text-[#ededed] outline-none"
      />
    </label>
  );
}

function Inspector({ el }: { el: WireElement }) {
  const s = useWirepadStore();
  const pr = el.props || {};
  const num = (k: "x" | "y" | "w" | "h", min?: number) => (v: number) =>
    s.updSel((x) => {
      x[k] = min != null ? Math.max(min, v) : v;
    }, "pos-" + k);
  const prop = (k: string) => (e: { target: { value: string } }) => {
    const v = e.target.value;
    s.updSel((x) => {
      x.props[k] = v;
    }, "prop-" + k);
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-semibold">{LABELS[el.type] || el.type}</span>
        <button
          onClick={s.deleteSel}
          title="Delete (⌫)"
          className="flex h-[26px] w-[26px] items-center justify-center rounded-[5px] bg-transparent text-[#8c8c8c] hover:bg-[#1f1f1f] hover:text-[#e5484d]"
        >
          <UI name="Trash2" />
        </button>
      </div>
      <div className="grid grid-cols-2 gap-1.5">
        <NumField label="X" value={el.x} onCommit={num("x")} />
        <NumField label="Y" value={el.y} onCommit={num("y")} />
        <NumField label="W" value={el.w} min={8} onCommit={num("w", 8)} />
        <NumField label="H" value={el.h} min={8} onCommit={num("h", 8)} />
      </div>
      {"text" in pr && (
        <label className="flex flex-col gap-1.5">
          <span className="text-[#8c8c8c]">Label</span>
          <input
            id="wp-label"
            value={pr.text ?? ""}
            onChange={prop("text")}
            placeholder={el.type === "paragraph" || el.type === "image" ? "Empty shows placeholder" : ""}
            className={field}
          />
        </label>
      )}
      {"value" in pr && (
        <label className="flex flex-col gap-1.5">
          <span className="text-[#8c8c8c]">Value</span>
          <input value={pr.value ?? ""} onChange={prop("value")} className={field} />
        </label>
      )}
      {"items" in pr && (
        <label className="flex flex-col gap-1.5">
          <span className="text-[#8c8c8c]">
            Items <span className="text-[#5c5c5c]">· comma separated</span>
          </span>
          <textarea value={pr.items ?? ""} onChange={prop("items")} rows={3} className={cn(field, "h-auto resize-y py-[7px]")} />
        </label>
      )}
      {el.type === "icon" && (
        <label className="flex flex-col gap-1.5">
          <span className="text-[#8c8c8c]">Icon</span>
          <select
            value={pr.icon || "Star"}
            onChange={(e) => {
              const v = e.target.value;
              s.updSel((x) => {
                x.props.icon = v;
              });
            }}
            className={cn(field, "px-1.5")}
          >
            {ICON_NAMES.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
      )}
      {"on" in pr && (
        <div className="flex items-center justify-between">
          <span className="text-[#8c8c8c]">State</span>
          <button
            onClick={() =>
              s.updSel((x) => {
                x.props.on = x.props.on ? "" : "1";
              })
            }
            className={stateBtn}
          >
            {pr.on ? "On" : "Off"}
          </button>
        </div>
      )}
      {el.type === "rect" && (
        <div className="flex items-center justify-between">
          <span className="text-[#8c8c8c]">Fill</span>
          <button
            onClick={() =>
              s.updSel((x) => {
                x.props.fill = x.props.fill ? "" : "1";
              })
            }
            className={stateBtn}
          >
            {pr.fill ? "Filled" : "Outline"}
          </button>
        </div>
      )}
      <span className="leading-[1.6] text-[#5c5c5c]">Drag edges or corners to resize · ⇧ keeps ratio · ⌥ drag or ⌘D duplicates</span>
    </>
  );
}

export function ScreenManager() {
  const s = useWirepadStore();
  const P = s.project;
  if (!P) return null;
  const pg = activePage(P);
  const el = pg.elements.find((e) => e.id === s.selId);

  return (
    <aside className="flex min-h-0 w-64 shrink-0 flex-col border-l border-[#222] bg-[#0e0e0e]">
      <div className="flex items-center justify-between pb-1.5 pl-4 pr-3 pt-3">
        <span className="text-[10px] font-medium uppercase tracking-[0.1em] text-[#8c8c8c]">Pages</span>
        <div className="flex gap-0.5">
          <button
            onClick={() => s.set({ modal: "new" })}
            title="Templates (T)"
            className="flex h-6 items-center gap-[5px] rounded-[5px] bg-transparent px-[7px] text-[11px] text-[#a3a3a3] hover:bg-[#1f1f1f] hover:text-[#ededed]"
          >
            <UI name="LayoutTemplate|LayoutGrid" size={12} />
            Templates
          </button>
          <button
            onClick={() => s.createPage("blank")}
            title="New blank page (P)"
            className="flex h-6 w-6 items-center justify-center rounded-[5px] bg-transparent text-[#a3a3a3] hover:bg-[#1f1f1f] hover:text-[#ededed]"
          >
            <UI name="Plus" />
          </button>
        </div>
      </div>
      <div className="flex max-h-[34%] shrink-0 flex-col gap-0.5 overflow-y-auto px-2 pb-2.5">
        {P.pages.map((p) => {
          const act = p.id === P.activeId;
          return (
            <div
              key={p.id}
              onClick={() => s.setActive(p.id)}
              onDoubleClick={() => {
                s.set({ selId: null });
                focusField("wp-page-name");
              }}
              className={cn("flex cursor-pointer items-center gap-2 rounded-md px-2 py-[7px] hover:text-[#ededed]", act ? "bg-[#222] text-[#ededed]" : "bg-transparent text-[#8c8c8c]")}
            >
              <UI name={FRAME_ICONS[p.frame] || "Monitor"} size={13} />
              <span className="min-w-0 flex-1 truncate">{p.name}</span>
              <span className="font-mono text-[10px] text-[#5c5c5c]">{p.elements.length}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  s.dupPage(p.id);
                }}
                title="Duplicate page"
                className={cn(smallBtn, "hover:text-[#ededed]")}
              >
                <UI name="Copy" size={12} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  s.delPage(p.id);
                }}
                title="Delete page"
                className={cn(smallBtn, "hover:text-[#e5484d]")}
              >
                <UI name="Trash2" size={12} />
              </button>
            </div>
          );
        })}
      </div>
      <div className="h-px shrink-0 bg-[#222]" />

      <div className="flex flex-1 flex-col gap-[18px] overflow-y-auto px-4 pb-5 pt-3.5">
        {el ? (
          <Inspector el={el} />
        ) : (
          <>
            <label className="flex flex-col gap-1.5">
              <span className="text-[#8c8c8c]">Page name</span>
              <input
                id="wp-page-name"
                value={pg.name}
                onChange={(e) => {
                  const v = e.target.value;
                  s.commit((P2, p2) => {
                    p2.name = v;
                  }, "pgname");
                }}
                className={field}
              />
            </label>
            <button
              onClick={s.clearPage}
              className="h-[30px] rounded-[5px] border border-[#262626] bg-transparent text-xs text-[#a3a3a3] hover:border-[#3a2626] hover:text-[#e5484d]"
            >
              Clear page
            </button>
          </>
        )}
      </div>
    </aside>
  );
}
