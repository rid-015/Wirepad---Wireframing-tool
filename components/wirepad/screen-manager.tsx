"use client";

import { FIELDS, ICON_NAMES, LABELS, frameOf, type Field, type WireElement } from "@/lib/component-registry";
import { activePage, useWirepadStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { FRAME_ICONS, UI } from "./toolbar";

const field =
  "h-[30px] rounded-[5px] border border-[#262626] bg-[#171717] px-2 text-xs text-[#ededed] outline-none focus:border-[#4a4a4a]";
const smallBtn = "flex h-5 w-5 items-center justify-center rounded bg-transparent p-0 text-[#5c5c5c] hover:bg-[#2a2a2a]";
const hint = "text-[#5c5c5c]";

/** Duplicate / delete group shown in the inspector header. */
function SelActions({ multi }: { multi?: boolean }) {
  const dupSel = useWirepadStore((s) => s.dupSel);
  const deleteSel = useWirepadStore((s) => s.deleteSel);
  const btn = "flex h-[26px] w-[26px] items-center justify-center rounded-[5px] bg-transparent p-0 text-[#ededed]";
  return (
    <div className="flex items-center gap-0.5 rounded-[7px] border border-[#333] bg-[#1c1c1c] p-0.5">
      <button onClick={dupSel} title="Duplicate (⌘D)" className={cn(btn, "hover:bg-[#333]")}>
        <UI name="Copy" />
      </button>
      <button onClick={deleteSel} title={multi ? "Delete all (⌫)" : "Delete (⌫)"} className={cn(btn, "hover:bg-[#e5484d]")}>
        <UI name="Trash2" />
      </button>
    </div>
  );
}

function FieldInput({ fd, el, index }: { fd: Field; el: WireElement; index: number }) {
  const updSel = useWirepadStore((s) => s.updSel);
  const v = el.props?.[fd.k];
  const id = "wp-field-" + index;
  const onChange = (e: { target: { value: string } }) => {
    const nv = e.target.value;
    updSel((x) => {
      x.props = x.props || {};
      x.props[fd.k] = nv;
    }, fd.kind === "icon" ? null : "prop-" + fd.k);
  };

  if (fd.kind === "toggle") {
    const on = !!v;
    return (
      <button
        onClick={() =>
          updSel((x) => {
            x.props = x.props || {};
            x.props[fd.k] = x.props[fd.k] ? "" : "1";
          })
        }
        className="flex h-8 items-center justify-between bg-transparent p-0 text-xs text-[#8c8c8c]"
      >
        <span>{fd.label}</span>
        <span className="relative h-[18px] w-[30px] rounded-full" style={{ background: on ? "oklch(0.62 0.15 250)" : "#333333" }}>
          <span className="absolute top-0.5 h-3.5 w-3.5 rounded-full bg-white" style={{ left: on ? 14 : 2 }} />
        </span>
      </button>
    );
  }
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[#8c8c8c]">{fd.label}</span>
      {fd.kind === "area" ? (
        <>
          <textarea id={id} value={v ?? ""} onChange={onChange} rows={3} className={cn(field, "h-auto resize-y py-[7px] leading-normal")} />
          <span className={cn(hint, "text-[11px]")}>{fd.hint}</span>
        </>
      ) : fd.kind === "icon" ? (
        <select value={v || "Star"} onChange={onChange} className={cn(field, "px-1.5")}>
          {ICON_NAMES.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      ) : (
        <input id={id} value={v ?? ""} onChange={onChange} placeholder={fd.hint} className={field} />
      )}
    </label>
  );
}

function Inspector({ el }: { el: WireElement }) {
  const fields = FIELDS[el.type] || [];
  return (
    <>
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-semibold">{LABELS[el.type] || el.type}</span>
        <SelActions />
      </div>
      {fields.map((fd, i) => (
        <FieldInput key={el.id + fd.k + fd.kind} fd={fd} el={el} index={i} />
      ))}
      {!fields.length && <span className={hint}>Nothing to customise. Resize it on the canvas.</span>}
      <span className={cn(hint, "leading-[1.6]")}>Drag edges or corners to resize · ⇧ keeps ratio · ⌥ drag or ⌘D duplicates</span>
    </>
  );
}

export function ScreenManager() {
  const s = useWirepadStore();
  const P = s.project;
  if (!P) return null;
  const pg = activePage(P);
  const F = frameOf(pg);
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
              className={cn("flex cursor-pointer items-center gap-2 rounded-md px-2 py-[7px] hover:text-[#ededed]", act ? "bg-[#222] text-[#ededed]" : "bg-transparent text-[#8c8c8c]")}
            >
              <UI name={FRAME_ICONS[p.frame] || "Monitor"} size={13} />
              <input
                value={p.name}
                onChange={(e) => s.renamePage(p.id, e.target.value)}
                onFocus={() => s.setActive(p.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") e.currentTarget.blur();
                }}
                spellCheck={false}
                title="Click to rename"
                className="-my-[3px] -ml-1 min-w-0 flex-1 truncate rounded border border-transparent bg-transparent px-1 py-0.5 text-xs text-inherit outline-none focus:border-[#3a3a3a] focus:bg-[#171717] focus:text-[#ededed]"
              />
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
        ) : s.multi.length > 1 ? (
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-semibold">{`${s.multi.length} selected`}</span>
            <SelActions multi />
          </div>
        ) : (
          <>
            <span className="text-[#8c8c8c]">{`${F.label} · ${F.w} wide`}</span>
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
