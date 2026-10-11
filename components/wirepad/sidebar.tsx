"use client";

import { CATEGORIES } from "@/lib/component-registry";
import { startSideDrag } from "@/lib/interactions";
import { useWirepadStore } from "@/lib/store";
import { Icon } from "./icon";
import { UI } from "./toolbar";

export function Sidebar() {
  const query = useWirepadStore((s) => s.query);
  const set = useWirepadStore((s) => s.set);
  const q = query.trim().toLowerCase();
  const cats = CATEGORIES.map((c) => ({
    name: c.name,
    items: c.items.filter((i) => !q || i.label.toLowerCase().includes(q) || c.name.toLowerCase().includes(q)),
  })).filter((c) => c.items.length);

  return (
    <aside className="flex w-[244px] shrink-0 flex-col border-r border-[#222] bg-[#0e0e0e]">
      <div className="px-3 pb-2 pt-3">
        <div className="flex h-[30px] items-center gap-2 rounded-md border border-[#262626] bg-[#121212] px-2.5 text-[#5c5c5c]">
          <UI name="Search" size={13} />
          <input
            value={query}
            onChange={(e) => set({ query: e.target.value })}
            placeholder="Search components"
            className="min-w-0 flex-1 border-none bg-transparent text-xs text-[#ededed] outline-none placeholder:text-[#5c5c5c]"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-2 pb-4">
        {cats.map((cat) => (
          <div key={cat.name}>
            <div className="px-1 pb-1.5 pt-3.5 text-[10px] font-medium uppercase tracking-[0.1em] text-[#5c5c5c]">{cat.name}</div>
            <div className="grid grid-cols-2 gap-1">
              {cat.items.map((it) => (
                <div
                  key={it.type + it.label}
                  onPointerDown={(e) => startSideDrag(e, it)}
                  title="Drag onto the page, or click to add"
                  className="flex h-[58px] cursor-grab touch-none flex-col items-center justify-center gap-[7px] rounded-md border border-[#1c1c1c] bg-[#131313] text-[#8c8c8c] hover:border-[#2a2a2a] hover:bg-[#1c1c1c] hover:text-[#ededed]"
                >
                  <Icon name={it.icon} size={18} strokeWidth={1.75} />
                  <span className="box-border max-w-full truncate px-1 text-[11px]">{it.label}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
        {!cats.length && <div className="px-2 py-8 text-center text-[#5c5c5c]">No components found</div>}
      </div>
    </aside>
  );
}
