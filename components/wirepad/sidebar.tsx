"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { useDraggable } from "@dnd-kit/core";
import {
  type ComponentItem,
  searchComponents,
} from "@/lib/component-registry";

function DraggableItem({ item }: { item: ComponentItem }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `sidebar-${item.type}`,
    data: {
      type: item.type,
      fromSidebar: true,
      defaultWidth: item.defaultWidth,
      defaultHeight: item.defaultHeight,
    },
  });

  const Icon = item.icon;

  return (
    <button
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`flex w-full items-center gap-2.5 rounded px-2.5 py-1.5 text-[11px] text-muted-foreground transition-colors hover:bg-accent hover:text-foreground cursor-grab active:cursor-grabbing ${
        isDragging ? "opacity-40" : ""
      }`}
    >
      <Icon className="h-3.5 w-3.5 shrink-0" />
      <span className="truncate">{item.label}</span>
    </button>
  );
}

export function Sidebar() {
  const [query, setQuery] = useState("");
  const categories = searchComponents(query);
  const isSearching = query.trim().length > 0;

  return (
    <aside className="flex h-full w-60 flex-col border-r border-border bg-sidebar">
      {/* Search */}
      <div className="px-3 pt-3 pb-2">
        <div className="flex items-center gap-2 rounded-md border border-border bg-background px-2.5 py-1.5">
          <Search className="h-3.5 w-3.5 shrink-0 text-muted-foreground/50" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search..."
            className="min-w-0 flex-1 bg-transparent text-xs text-foreground placeholder:text-muted-foreground/40 outline-none"
          />
        </div>
      </div>

      {/* Component list */}
      <div className="flex-1 overflow-y-auto px-1 pb-2 scrollbar-thin">
        {categories.length === 0 ? (
          <div className="flex items-center justify-center py-8 text-xs text-muted-foreground/40">
            No components found
          </div>
        ) : (
          <div className="flex flex-col">
            {categories.map((category) => (
              <div key={category.name}>
                {/* Lightweight category label - only show if not searching or multiple categories */}
                {(!isSearching || categories.length > 1) && (
                  <div className="px-2.5 pt-3 pb-1 text-[10px] font-medium uppercase tracking-widest text-muted-foreground/40">
                    {category.name}
                  </div>
                )}
                <div className="flex flex-col">
                  {category.items.map((item) => (
                    <DraggableItem key={item.type} item={item} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}
