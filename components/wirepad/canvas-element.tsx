"use client";

import type React from "react";
import type { CanvasElement } from "@/lib/store";
import { useWirepadStore } from "@/lib/store";
import { useDraggable } from "@dnd-kit/core";
import { Trash2, Copy } from "lucide-react";

function ElementRenderer({ element }: { element: CanvasElement }) {
  switch (element.type) {
    // --- Layout ---
    case "container":
      return (
        <div className="flex h-full w-full rounded-lg border border-dashed border-muted-foreground/20 bg-muted/10 p-2">
          <span className="text-[9px] text-muted-foreground/30">Container</span>
        </div>
      );
    case "section":
      return (
        <div className="flex h-full w-full flex-col rounded-md border border-muted-foreground/15 bg-muted/10 p-2">
          <span className="text-[9px] text-muted-foreground/30">Section</span>
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
    case "divider":
      return (
        <div className="flex h-full w-full items-center">
          <div className="h-px w-full bg-muted-foreground/20" />
        </div>
      );
    case "list-item":
      return (
        <div className="flex h-full w-full items-center gap-3 border-b border-muted-foreground/10 px-3">
          <div className="h-3 w-3 rounded-full bg-muted-foreground/20" />
          <div className="h-2 flex-1 rounded bg-muted-foreground/15" />
          <div className="h-2 w-6 rounded bg-muted-foreground/10" />
        </div>
      );

    // --- Inputs ---
    case "button":
      return (
        <div className="flex h-full w-full items-center justify-center rounded-md border border-muted-foreground/30 bg-muted/50 text-xs text-muted-foreground">
          Button
        </div>
      );
    case "text-input":
    case "input":
      return (
        <div className="flex h-full w-full items-center rounded-md border border-muted-foreground/30 bg-muted/30 px-2 text-xs text-muted-foreground/50">
          Input field...
        </div>
      );
    case "textarea":
      return (
        <div className="flex h-full w-full rounded-md border border-muted-foreground/30 bg-muted/30 p-2 text-xs text-muted-foreground/50">
          Text area...
        </div>
      );
    case "checkbox":
      return (
        <div className="flex h-full w-full items-center gap-2">
          <div className="h-3.5 w-3.5 rounded-sm border border-muted-foreground/40" />
          <span className="text-xs text-muted-foreground">Checkbox</span>
        </div>
      );
    case "radio":
      return (
        <div className="flex h-full w-full items-center gap-2">
          <div className="h-3.5 w-3.5 rounded-full border border-muted-foreground/40" />
          <span className="text-xs text-muted-foreground">Radio</span>
        </div>
      );
    case "toggle":
      return (
        <div className="flex h-full w-full items-center">
          <div className="relative h-5 w-10 rounded-full bg-muted-foreground/20">
            <div className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-muted-foreground/40" />
          </div>
        </div>
      );
    case "dropdown":
      return (
        <div className="flex h-full w-full items-center justify-between rounded-md border border-muted-foreground/30 bg-muted/30 px-2 text-xs text-muted-foreground/50">
          <span>Select...</span>
          <svg
            className="h-3 w-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      );
    case "slider":
      return (
        <div className="flex h-full w-full items-center">
          <div className="relative h-1 w-full rounded-full bg-muted-foreground/20">
            <div className="absolute left-0 top-0 h-1 w-2/5 rounded-full bg-muted-foreground/40" />
            <div className="absolute left-[40%] top-1/2 h-3 w-3 -translate-y-1/2 rounded-full border border-muted-foreground/40 bg-muted" />
          </div>
        </div>
      );

    // --- Navigation ---
    case "navbar":
      return (
        <div className="flex h-full w-full items-center justify-between rounded-md border border-muted-foreground/15 bg-muted/30 px-3">
          <div className="h-2.5 w-12 rounded bg-muted-foreground/25" />
          <div className="flex gap-3">
            <div className="h-2 w-8 rounded bg-muted-foreground/15" />
            <div className="h-2 w-8 rounded bg-muted-foreground/15" />
            <div className="h-2 w-8 rounded bg-muted-foreground/15" />
          </div>
        </div>
      );
    case "sidebar-nav":
      return (
        <div className="flex h-full w-full flex-col gap-1 rounded-md border border-muted-foreground/15 bg-muted/20 p-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className={`flex items-center gap-2 rounded px-2 py-1.5 ${i === 1 ? "bg-muted/40" : ""}`}
            >
              <div className="h-2.5 w-2.5 rounded-sm bg-muted-foreground/20" />
              <div className="h-2 flex-1 rounded bg-muted-foreground/15" />
            </div>
          ))}
        </div>
      );
    case "tabs":
      return (
        <div className="flex h-full w-full items-end gap-0 border-b border-muted-foreground/15">
          {["Tab 1", "Tab 2", "Tab 3"].map((t, i) => (
            <div
              key={t}
              className={`px-3 pb-1.5 text-[10px] ${i === 0 ? "border-b border-muted-foreground/50 text-muted-foreground" : "text-muted-foreground/40"}`}
            >
              {t}
            </div>
          ))}
        </div>
      );
    case "breadcrumb":
      return (
        <div className="flex h-full w-full items-center gap-1 text-[10px] text-muted-foreground/40">
          <span className="text-muted-foreground/60">Home</span>
          <span>/</span>
          <span className="text-muted-foreground/60">Page</span>
          <span>/</span>
          <span className="text-muted-foreground">Current</span>
        </div>
      );
    case "pagination":
      return (
        <div className="flex h-full w-full items-center justify-center gap-1">
          {["<", "1", "2", "3", ">"].map((p) => (
            <div
              key={p}
              className={`flex h-6 w-6 items-center justify-center rounded text-[10px] ${p === "2" ? "bg-muted-foreground/20 text-muted-foreground" : "text-muted-foreground/40"}`}
            >
              {p}
            </div>
          ))}
        </div>
      );
    case "bottom-nav":
      return (
        <div className="flex h-full w-full items-center justify-around rounded-md border border-muted-foreground/15 bg-muted/30 px-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div className="h-4 w-4 rounded bg-muted-foreground/20" />
              <div className="h-1.5 w-6 rounded bg-muted-foreground/10" />
            </div>
          ))}
        </div>
      );

    // --- Content ---
    case "heading":
    case "text":
      return (
        <div className="flex h-full w-full items-start text-sm font-medium text-muted-foreground">
          Heading
        </div>
      );
    case "paragraph":
      return (
        <div className="flex h-full w-full flex-col gap-1.5">
          <div className="h-2 w-full rounded bg-muted-foreground/15" />
          <div className="h-2 w-full rounded bg-muted-foreground/15" />
          <div className="h-2 w-3/4 rounded bg-muted-foreground/15" />
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
    case "avatar":
      return (
        <div className="flex h-full w-full items-center justify-center rounded-full bg-muted-foreground/20 text-[9px] text-muted-foreground/50">
          A
        </div>
      );
    case "icon":
      return (
        <div className="flex h-full w-full items-center justify-center rounded bg-muted-foreground/15 text-[8px] text-muted-foreground/40">
          *
        </div>
      );

    // --- Feedback ---
    case "toast":
      return (
        <div className="flex h-full w-full items-center gap-2 rounded-lg border border-muted-foreground/20 bg-muted/40 px-3">
          <div className="h-3 w-3 rounded-full bg-muted-foreground/25" />
          <div className="flex flex-1 flex-col gap-1">
            <div className="h-2 w-20 rounded bg-muted-foreground/20" />
            <div className="h-1.5 w-32 rounded bg-muted-foreground/10" />
          </div>
        </div>
      );
    case "alert":
      return (
        <div className="flex h-full w-full items-start gap-2 rounded-md border border-muted-foreground/20 bg-muted/30 p-3">
          <div className="mt-0.5 h-3.5 w-3.5 shrink-0 rounded-full bg-muted-foreground/25" />
          <div className="flex flex-col gap-1">
            <div className="h-2 w-16 rounded bg-muted-foreground/20" />
            <div className="h-1.5 w-full rounded bg-muted-foreground/10" />
          </div>
        </div>
      );
    case "progress":
      return (
        <div className="flex h-full w-full items-center">
          <div className="h-1.5 w-full rounded-full bg-muted-foreground/15">
            <div className="h-1.5 w-3/5 rounded-full bg-muted-foreground/35" />
          </div>
        </div>
      );
    case "skeleton":
      return (
        <div className="flex h-full w-full flex-col gap-2 rounded-md p-2">
          <div className="h-3 w-2/3 animate-pulse rounded bg-muted-foreground/10" />
          <div className="h-2 w-full animate-pulse rounded bg-muted-foreground/8" />
          <div className="h-2 w-4/5 animate-pulse rounded bg-muted-foreground/8" />
        </div>
      );

    // --- Data Display ---
    case "table":
      return (
        <div className="flex h-full w-full flex-col overflow-hidden rounded-md border border-muted-foreground/15">
          <div className="flex gap-2 border-b border-muted-foreground/15 bg-muted/30 px-2 py-1.5">
            <div className="h-2 w-16 rounded bg-muted-foreground/20" />
            <div className="h-2 w-20 rounded bg-muted-foreground/20" />
            <div className="h-2 w-12 rounded bg-muted-foreground/20" />
          </div>
          {[1, 2, 3, 4].map((r) => (
            <div
              key={r}
              className="flex gap-2 border-b border-muted-foreground/8 px-2 py-1.5 last:border-0"
            >
              <div className="h-2 w-16 rounded bg-muted-foreground/10" />
              <div className="h-2 w-20 rounded bg-muted-foreground/10" />
              <div className="h-2 w-12 rounded bg-muted-foreground/10" />
            </div>
          ))}
        </div>
      );
    case "list":
      return (
        <div className="flex h-full w-full flex-col rounded-md border border-muted-foreground/15">
          {[1, 2, 3, 4].map((r) => (
            <div
              key={r}
              className="flex items-center gap-2 border-b border-muted-foreground/8 px-3 py-2 last:border-0"
            >
              <div className="h-2.5 w-2.5 rounded-full bg-muted-foreground/20" />
              <div className="h-2 flex-1 rounded bg-muted-foreground/12" />
            </div>
          ))}
        </div>
      );
    case "chart":
      return (
        <div className="flex h-full w-full items-end justify-around gap-1 rounded-md border border-muted-foreground/15 bg-muted/10 p-3 pb-2">
          {[40, 65, 35, 80, 55, 70, 45].map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-t bg-muted-foreground/20"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
      );

    // --- Prebuilt Blocks ---
    case "block-login":
      return (
        <div className="flex h-full w-full flex-col items-center justify-center gap-3 rounded-lg border border-muted-foreground/15 bg-muted/10 p-6">
          <div className="h-3 w-16 rounded bg-muted-foreground/25" />
          <div className="h-8 w-full rounded-md border border-muted-foreground/20 bg-muted/20" />
          <div className="h-8 w-full rounded-md border border-muted-foreground/20 bg-muted/20" />
          <div className="h-8 w-full rounded-md bg-muted-foreground/20" />
          <div className="h-2 w-20 rounded bg-muted-foreground/10" />
        </div>
      );
    case "block-signup":
      return (
        <div className="flex h-full w-full flex-col items-center justify-center gap-3 rounded-lg border border-muted-foreground/15 bg-muted/10 p-6">
          <div className="h-3 w-20 rounded bg-muted-foreground/25" />
          <div className="h-8 w-full rounded-md border border-muted-foreground/20 bg-muted/20" />
          <div className="h-8 w-full rounded-md border border-muted-foreground/20 bg-muted/20" />
          <div className="h-8 w-full rounded-md border border-muted-foreground/20 bg-muted/20" />
          <div className="h-8 w-full rounded-md bg-muted-foreground/20" />
          <div className="h-2 w-24 rounded bg-muted-foreground/10" />
        </div>
      );
    case "block-dashboard":
      return (
        <div className="flex h-full w-full flex-col gap-3 rounded-lg border border-muted-foreground/15 bg-muted/10 p-3">
          <div className="flex gap-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex flex-1 flex-col gap-1 rounded-md border border-muted-foreground/10 p-2"
              >
                <div className="h-1.5 w-8 rounded bg-muted-foreground/15" />
                <div className="h-3 w-12 rounded bg-muted-foreground/20" />
              </div>
            ))}
          </div>
          <div className="flex-1 rounded-md border border-muted-foreground/10 p-2">
            <div className="flex h-full items-end justify-around gap-1">
              {[50, 70, 40, 85, 60].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t bg-muted-foreground/15"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <div className="flex-1 rounded-md border border-muted-foreground/10 p-2">
              <div className="h-2 w-16 rounded bg-muted-foreground/15" />
            </div>
            <div className="flex-1 rounded-md border border-muted-foreground/10 p-2">
              <div className="h-2 w-16 rounded bg-muted-foreground/15" />
            </div>
          </div>
        </div>
      );
    case "block-settings":
      return (
        <div className="flex h-full w-full flex-col gap-3 rounded-lg border border-muted-foreground/15 bg-muted/10 p-4">
          <div className="h-3 w-16 rounded bg-muted-foreground/25" />
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="flex items-center justify-between border-b border-muted-foreground/8 pb-2"
            >
              <div className="h-2 w-20 rounded bg-muted-foreground/15" />
              <div className="h-5 w-9 rounded-full bg-muted-foreground/15" />
            </div>
          ))}
        </div>
      );
    case "block-profile":
      return (
        <div className="flex h-full w-full flex-col items-center gap-3 rounded-lg border border-muted-foreground/15 bg-muted/10 p-4">
          <div className="h-12 w-12 rounded-full bg-muted-foreground/20" />
          <div className="h-3 w-20 rounded bg-muted-foreground/20" />
          <div className="h-2 w-32 rounded bg-muted-foreground/10" />
          <div className="mt-2 w-full space-y-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between border-b border-muted-foreground/8 pb-2"
              >
                <div className="h-2 w-16 rounded bg-muted-foreground/12" />
                <div className="h-2 w-24 rounded bg-muted-foreground/8" />
              </div>
            ))}
          </div>
        </div>
      );
    case "block-empty-state":
      return (
        <div className="flex h-full w-full flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-muted-foreground/20 bg-muted/10 p-4">
          <div className="h-10 w-10 rounded-full bg-muted-foreground/10" />
          <div className="h-2.5 w-24 rounded bg-muted-foreground/15" />
          <div className="h-2 w-36 rounded bg-muted-foreground/8" />
          <div className="mt-1 h-6 w-20 rounded-md bg-muted-foreground/15" />
        </div>
      );
    case "block-modal":
      return (
        <div className="flex h-full w-full flex-col rounded-lg border border-muted-foreground/20 bg-muted/30 p-4">
          <div className="mb-3 h-3 w-20 rounded bg-muted-foreground/25" />
          <div className="mb-1 h-2 w-full rounded bg-muted-foreground/10" />
          <div className="mb-4 h-2 w-3/4 rounded bg-muted-foreground/10" />
          <div className="mt-auto flex justify-end gap-2">
            <div className="h-6 w-14 rounded-md border border-muted-foreground/20" />
            <div className="h-6 w-14 rounded-md bg-muted-foreground/20" />
          </div>
        </div>
      );
    case "block-confirmation":
      return (
        <div className="flex h-full w-full flex-col items-center justify-center gap-3 rounded-lg border border-muted-foreground/20 bg-muted/30 p-4">
          <div className="h-8 w-8 rounded-full bg-muted-foreground/15" />
          <div className="h-2.5 w-24 rounded bg-muted-foreground/20" />
          <div className="h-2 w-36 rounded bg-muted-foreground/10" />
          <div className="flex gap-2">
            <div className="h-6 w-16 rounded-md border border-muted-foreground/20" />
            <div className="h-6 w-16 rounded-md bg-muted-foreground/20" />
          </div>
        </div>
      );

    default:
      return (
        <div className="flex h-full w-full items-center justify-center rounded-md border border-dashed border-muted-foreground/20 text-[10px] text-muted-foreground/30">
          {element.type}
        </div>
      );
  }
}

function ActionBar({
  elementId,
  onPointerDown,
}: {
  elementId: string;
  onPointerDown: (e: React.PointerEvent) => void;
}) {
  const { removeElement, duplicateElement } = useWirepadStore();

  return (
    <div
      className="absolute -top-9 left-1/2 z-[60] flex -translate-x-1/2 items-center gap-0.5 rounded-md border border-border bg-background px-1 py-0.5 shadow-lg shadow-black/30"
      onPointerDown={onPointerDown}
    >
      <button
        type="button"
        onClick={() => duplicateElement(elementId)}
        className="flex items-center justify-center rounded p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        aria-label="Duplicate element"
      >
        <Copy className="h-3 w-3" />
      </button>
      <div className="mx-0.5 h-3 w-px bg-border" />
      <button
        type="button"
        onClick={() => removeElement(elementId)}
        className="flex items-center justify-center rounded p-1.5 text-muted-foreground transition-colors hover:bg-destructive/20 hover:text-destructive"
        aria-label="Delete element"
      >
        <Trash2 className="h-3 w-3" />
      </button>
    </div>
  );
}

export function CanvasElementComponent({
  element,
}: {
  element: CanvasElement;
}) {
  const { selectedElementId, selectElement } = useWirepadStore();
  const isSelected = selectedElementId === element.id;

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
    zIndex: isDragging ? 50 : isSelected ? 40 : 1,
    opacity: isDragging ? 0.7 : 1,
    transition: isDragging ? "none" : "box-shadow 0.15s ease",
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectElement(element.id);
  };

  // Prevent action bar pointer events from starting a drag
  const stopDrag = (e: React.PointerEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={handleClick}
      className={`cursor-grab rounded-md outline-none active:cursor-grabbing ${
        isSelected
          ? "ring-1 ring-muted-foreground/60"
          : "ring-0 hover:ring-1 hover:ring-muted-foreground/30"
      }`}
    >
      {isSelected && !isDragging && (
        <ActionBar elementId={element.id} onPointerDown={stopDrag} />
      )}
      <ElementRenderer element={element} />
    </div>
  );
}
