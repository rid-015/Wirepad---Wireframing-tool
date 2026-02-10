"use client";

import React from "react"

import {
  MousePointerClick,
  Type,
  TextCursorInput,
  RectangleHorizontal,
  ImageIcon,
} from "lucide-react";
import type { ElementType } from "@/lib/store";
import { useDraggable } from "@dnd-kit/core";

interface ComponentItem {
  type: ElementType;
  label: string;
  icon: React.ReactNode;
  defaultWidth: number;
  defaultHeight: number;
}

const COMPONENT_ITEMS: ComponentItem[] = [
  {
    type: "button",
    label: "Button",
    icon: <MousePointerClick className="h-4 w-4" />,
    defaultWidth: 120,
    defaultHeight: 40,
  },
  {
    type: "text",
    label: "Text",
    icon: <Type className="h-4 w-4" />,
    defaultWidth: 200,
    defaultHeight: 24,
  },
  {
    type: "input",
    label: "Input",
    icon: <TextCursorInput className="h-4 w-4" />,
    defaultWidth: 200,
    defaultHeight: 40,
  },
  {
    type: "card",
    label: "Card",
    icon: <RectangleHorizontal className="h-4 w-4" />,
    defaultWidth: 240,
    defaultHeight: 140,
  },
  {
    type: "image",
    label: "Image",
    icon: <ImageIcon className="h-4 w-4" />,
    defaultWidth: 160,
    defaultHeight: 120,
  },
];

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
      className={`flex items-center gap-3 rounded-md px-3 py-2 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground cursor-grab active:cursor-grabbing ${
        isDragging ? "opacity-40" : ""
      }`}
    >
      {item.icon}
      <span>{item.label}</span>
    </button>
  );
}

export function Sidebar() {
  return (
    <aside className="flex h-full w-52 flex-col border-r border-border bg-sidebar">
      <div className="px-4 py-3">
        <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
          Components
        </p>
      </div>
      <nav className="flex flex-1 flex-col gap-0.5 px-2">
        {COMPONENT_ITEMS.map((item) => (
          <DraggableItem key={item.type} item={item} />
        ))}
      </nav>
    </aside>
  );
}

export { COMPONENT_ITEMS };
