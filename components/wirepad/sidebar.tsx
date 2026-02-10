"use client";

import { useState } from "react";
import { Search, ChevronRight } from "lucide-react";
import { useDraggable } from "@dnd-kit/core";
import {
  type ComponentItem,
  type ComponentCategory,
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

  return (
    <button
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`flex w-full items-center rounded px-2.5 py-1.5 text-[11px] text-muted-foreground transition-colors hover:bg-accent hover:text-foreground cursor-grab active:cursor-grabbing ${
        isDragging ? "opacity-40" : ""
      }`}
    >
      <span className="truncate">{item.label}</span>
    </button>
  );
}

function CategorySection({
  category,
  defaultOpen,
}: {
  category: ComponentCategory;
  defaultOpen: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center gap-1.5 px-3 py-1.5 text-[10px] font-medium uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
      >
        <ChevronRight
          className={`h-3 w-3 shrink-0 transition-transform ${isOpen ? "rotate-90" : ""}`}
        />
        <span>{category.name}</span>
        <span className="ml-auto text-muted-foreground/40 normal-case tracking-normal">
          {category.items.length}
        </span>
      </button>
      {isOpen && (
        <div className="flex flex-col gap-px pl-3 pr-1 pb-1">
          {category.items.map((item) => (
            <DraggableItem key={item.type} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}

export function Sidebar() {
  const [query, setQuery] = useState("");
  const categories = searchComponents(query);
  const isSearching = query.trim().length > 0;

  return (
    <aside className="flex h-full w-56 flex-col border-r border-border bg-sidebar">
      {/* Search */}
      <div className="px-3 pt-3 pb-2">
        <div className="flex items-center gap-2 rounded-md border border-border bg-background px-2.5 py-1.5">
          <Search className="h-3.5 w-3.5 shrink-0 text-muted-foreground/50" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search components..."
            className="min-w-0 flex-1 bg-transparent text-xs text-foreground placeholder:text-muted-foreground/40 outline-none"
          />
        </div>
      </div>

      {/* Component list */}
      <div className="flex-1 overflow-y-auto pb-2">
        {categories.length === 0 ? (
          <div className="flex items-center justify-center py-8 text-xs text-muted-foreground/40">
            No components found
          </div>
        ) : (
          <div className="flex flex-col gap-0.5">
            {categories.map((category) => (
              <CategorySection
                key={category.name}
                category={category}
                defaultOpen={isSearching || category.name === "Layout" || category.name === "Inputs"}
              />
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}
