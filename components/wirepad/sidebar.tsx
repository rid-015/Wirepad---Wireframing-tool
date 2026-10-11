"use client";

import { useState } from "react";
import { ChevronRight, Search, X } from "lucide-react";
import { useDraggable } from "@dnd-kit/core";
import {
  type ComponentItem,
  COMPONENT_CATEGORIES,
  searchComponents,
} from "@/lib/component-registry";
import { ElementRenderer } from "./element-renderer";

/**
 * Renders a component scaled down to fit a box. `layoutWidth` lets wide
 * components lay out narrower first, so thumbnails stay legible.
 */
export function ComponentPreview({
  item,
  maxWidth,
  maxHeight,
  layoutWidth = item.defaultWidth,
}: {
  item: ComponentItem;
  maxWidth: number;
  maxHeight: number;
  layoutWidth?: number;
}) {
  const width = Math.min(item.defaultWidth, layoutWidth);
  const height = item.defaultHeight;
  const scale = Math.min(maxWidth / width, maxHeight / height, 1);

  return (
    <div
      className="pointer-events-none relative shrink-0"
      style={{
        width: width * scale,
        height: height * scale,
      }}
      aria-hidden="true"
    >
      <div
        className="absolute left-0 top-0 origin-top-left"
        style={{
          width,
          height,
          transform: `scale(${scale})`,
        }}
      >
        <ElementRenderer
          element={{
            id: `preview-${item.type}`,
            type: item.type,
            x: 0,
            y: 0,
            width,
            height,
            properties: {},
          }}
        />
      </div>
    </div>
  );
}

function ComponentTile({ item, tall }: { item: ComponentItem; tall?: boolean }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `sidebar-${item.type}`,
    data: {
      type: item.type,
      fromSidebar: true,
      item,
      defaultWidth: item.defaultWidth,
      defaultHeight: item.defaultHeight,
    },
  });

  return (
    <button
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      type="button"
      title={`Drag ${item.label} onto the canvas`}
      className={`group flex flex-col overflow-hidden rounded-lg border border-border bg-background text-left transition-colors hover:border-muted-foreground/40 focus-visible:border-muted-foreground/60 focus-visible:outline-none cursor-grab active:cursor-grabbing ${
        isDragging ? "opacity-40" : ""
      }`}
    >
      <div
        className={`flex w-full items-center justify-center bg-canvas px-2 transition-colors group-hover:bg-accent/60 ${
          tall ? "h-32" : "h-14"
        }`}
      >
        <ComponentPreview
          item={item}
          maxWidth={100}
          maxHeight={tall ? 116 : 40}
          layoutWidth={tall ? undefined : 200}
        />
      </div>
      <span className="truncate border-t border-border px-2 py-1 text-[11px] text-muted-foreground transition-colors group-hover:text-foreground">
        {item.label}
      </span>
    </button>
  );
}

export function Sidebar() {
  const [query, setQuery] = useState("");
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(
      COMPONENT_CATEGORIES.map((c) => [c.name, Boolean(c.collapsed)])
    )
  );
  const categories = searchComponents(query);
  const isSearching = query.trim().length > 0;

  const toggle = (name: string) =>
    setCollapsed((prev) => ({ ...prev, [name]: !prev[name] }));

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-border bg-sidebar">
      {/* Search */}
      <div className="px-3 pt-3 pb-2">
        <div className="flex items-center gap-2 rounded-md border border-border bg-background px-2.5 py-2 transition-colors focus-within:border-muted-foreground/40">
          <Search className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search components"
            className="min-w-0 flex-1 bg-transparent text-xs text-foreground placeholder:text-muted-foreground/50 outline-none"
          />
          {isSearching && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="rounded p-0.5 text-muted-foreground/60 hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>

      {/* Component grid */}
      <div className="flex-1 overflow-y-auto px-3 pb-4 scrollbar-thin">
        {categories.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-1 py-10 text-center text-xs text-muted-foreground/60">
            <span>No components match “{query.trim()}”</span>
          </div>
        ) : (
          categories.map((category) => {
            const isOpen = isSearching || !collapsed[category.name];
            const tall = category.name === "Screens";
            return (
              <section key={category.name} className="pt-2">
                <button
                  type="button"
                  onClick={() => toggle(category.name)}
                  disabled={isSearching}
                  aria-expanded={isOpen}
                  className="flex w-full items-center gap-1 rounded py-1.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground/70 transition-colors hover:text-foreground disabled:hover:text-muted-foreground/70"
                >
                  <ChevronRight
                    className={`h-3 w-3 transition-transform ${isOpen ? "rotate-90" : ""}`}
                  />
                  <span className="flex-1 text-left">{category.name}</span>
                  <span className="tabular-nums text-muted-foreground/40">
                    {category.items.length}
                  </span>
                </button>
                {isOpen && (
                  <div className="grid grid-cols-2 gap-2 pt-1 pb-2">
                    {category.items.map((item) => (
                      <ComponentTile key={item.type} item={item} tall={tall} />
                    ))}
                  </div>
                )}
              </section>
            );
          })
        )}
      </div>
    </aside>
  );
}
