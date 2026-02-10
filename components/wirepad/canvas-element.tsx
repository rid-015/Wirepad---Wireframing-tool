"use client";

import React from "react"

import type { CanvasElement } from "@/lib/store";
import { useDraggable } from "@dnd-kit/core";

function ElementRenderer({ element }: { element: CanvasElement }) {
  switch (element.type) {
    case "button":
      return (
        <div className="flex h-full w-full items-center justify-center rounded-md border border-muted-foreground/30 bg-muted/50 text-xs text-muted-foreground">
          Button
        </div>
      );
    case "text":
      return (
        <div className="flex h-full w-full items-start text-xs text-muted-foreground">
          Text block
        </div>
      );
    case "input":
      return (
        <div className="flex h-full w-full items-center rounded-md border border-muted-foreground/30 bg-muted/30 px-2 text-xs text-muted-foreground/50">
          Input field...
        </div>
      );
    case "card":
      return (
        <div className="flex h-full w-full flex-col rounded-lg border border-muted-foreground/20 bg-muted/30 p-3">
          <div className="mb-2 h-2 w-16 rounded bg-muted-foreground/20" />
          <div className="h-2 w-full rounded bg-muted-foreground/10" />
          <div className="mt-1 h-2 w-3/4 rounded bg-muted-foreground/10" />
        </div>
      );
    case "image":
      return (
        <div className="flex h-full w-full items-center justify-center rounded-md border border-dashed border-muted-foreground/30 bg-muted/20 text-xs text-muted-foreground/50">
          <svg
            className="h-6 w-6 text-muted-foreground/30"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z"
            />
          </svg>
        </div>
      );
    default:
      return null;
  }
}

export function CanvasElementComponent({
  element,
}: {
  element: CanvasElement;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: element.id,
      data: {
        type: element.type,
        fromSidebar: false,
        element,
      },
    });

  const style: React.CSSProperties = {
    position: "absolute",
    left: element.x,
    top: element.y,
    width: element.width,
    height: element.height,
    transform: transform
      ? `translate(${transform.x}px, ${transform.y}px)`
      : undefined,
    zIndex: isDragging ? 50 : 1,
    opacity: isDragging ? 0.7 : 1,
    transition: isDragging ? "none" : "box-shadow 0.15s ease",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="cursor-grab active:cursor-grabbing outline-none ring-0 hover:ring-1 hover:ring-muted-foreground/30 rounded-md"
    >
      <ElementRenderer element={element} />
    </div>
  );
}
