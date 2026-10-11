"use client";

import type React from "react";
import { useState, useCallback } from "react";
import type { CanvasElement } from "@/lib/store";
import { useWirepadStore } from "@/lib/store";
import { useDraggable } from "@dnd-kit/core";
import { Trash2, Copy } from "lucide-react";
import { ElementRenderer } from "./element-renderer";

const EDITABLE_TYPES = new Set(["heading", "text", "paragraph", "button"]);
const SHAPE_TYPES = new Set([
  "shape-rectangle",
  "shape-circle",
  "shape-rounded-rect",
  "shape-divider-line",
  "shape-arrow-line",
]);
const MIN_SIZE = 8;

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

type ResizeDirection =
  | "n"
  | "s"
  | "e"
  | "w"
  | "ne"
  | "nw"
  | "se"
  | "sw";

const HANDLE_POSITIONS: {
  dir: ResizeDirection;
  cursor: string;
  className: string;
}[] = [
  {
    dir: "nw",
    cursor: "nwse-resize",
    className: "-top-1 -left-1",
  },
  {
    dir: "ne",
    cursor: "nesw-resize",
    className: "-top-1 -right-1",
  },
  {
    dir: "sw",
    cursor: "nesw-resize",
    className: "-bottom-1 -left-1",
  },
  {
    dir: "se",
    cursor: "nwse-resize",
    className: "-bottom-1 -right-1",
  },
  {
    dir: "n",
    cursor: "ns-resize",
    className: "-top-1 left-1/2 -translate-x-1/2",
  },
  {
    dir: "s",
    cursor: "ns-resize",
    className: "-bottom-1 left-1/2 -translate-x-1/2",
  },
  {
    dir: "w",
    cursor: "ew-resize",
    className: "top-1/2 -left-1 -translate-y-1/2",
  },
  {
    dir: "e",
    cursor: "ew-resize",
    className: "top-1/2 -right-1 -translate-y-1/2",
  },
];

function ResizeHandles({
  element,
  onResizeStart,
}: {
  element: CanvasElement;
  onResizeStart: (dir: ResizeDirection, e: React.PointerEvent) => void;
}) {
  return (
    <>
      {HANDLE_POSITIONS.map(({ dir, cursor, className }) => (
        <div
          key={dir}
          className={`absolute z-[60] h-2 w-2 rounded-full border border-muted-foreground/60 bg-background ${className}`}
          style={{ cursor }}
          onPointerDown={(e) => {
            e.stopPropagation();
            e.preventDefault();
            onResizeStart(dir, e);
          }}
          role="separator"
          aria-label={`Resize ${dir}`}
        />
      ))}
    </>
  );
}

export function CanvasElementComponent({
  element,
}: {
  element: CanvasElement;
}) {
  const { selectedElementId, selectElement, updateElement } =
    useWirepadStore();
  const isSelected = selectedElementId === element.id;
  const [isEditing, setIsEditing] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const isEditable = EDITABLE_TYPES.has(element.type);
  const isShape = SHAPE_TYPES.has(element.type);

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: element.id,
      disabled: isEditing || isResizing,
      data: {
        type: element.type,
        fromSidebar: false,
        element,
      },
    });

  const handleResizeStart = useCallback(
    (dir: ResizeDirection, e: React.PointerEvent) => {
      setIsResizing(true);
      const startX = e.clientX;
      const startY = e.clientY;
      const startW = element.width;
      const startH = element.height;
      const startElX = element.x;
      const startElY = element.y;

      const onMove = (ev: PointerEvent) => {
        const dx = ev.clientX - startX;
        const dy = ev.clientY - startY;

        let newX = startElX;
        let newY = startElY;
        let newW = startW;
        let newH = startH;

        if (dir.includes("e")) newW = Math.max(MIN_SIZE, startW + dx);
        if (dir.includes("w")) {
          newW = Math.max(MIN_SIZE, startW - dx);
          newX = startElX + (startW - newW);
        }
        if (dir.includes("s")) newH = Math.max(MIN_SIZE, startH + dy);
        if (dir.includes("n")) {
          newH = Math.max(MIN_SIZE, startH - dy);
          newY = startElY + (startH - newH);
        }

        updateElement(element.id, {
          x: newX,
          y: newY,
          width: newW,
          height: newH,
        });
      };

      const onUp = () => {
        setIsResizing(false);
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
      };

      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
    },
    [element.id, element.x, element.y, element.width, element.height, updateElement],
  );

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

  const handleDoubleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (isEditable) {
        setIsEditing(true);
      }
    },
    [isEditable],
  );

  const handleCommitText = useCallback(
    (text: string) => {
      updateElement(element.id, {
        properties: { ...element.properties, text },
      });
      setIsEditing(false);
    },
    [element.id, element.properties, updateElement],
  );

  // Prevent action bar pointer events from starting a drag
  const stopDrag = (e: React.PointerEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...(isEditing ? {} : listeners)}
      {...attributes}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      className={`rounded-md outline-none ${
        isEditing
          ? "cursor-text ring-1 ring-muted-foreground/60"
          : "cursor-grab active:cursor-grabbing"
      } ${
        !isEditing && isSelected
          ? "ring-1 ring-muted-foreground/60"
          : !isEditing
            ? "ring-0 hover:ring-1 hover:ring-muted-foreground/30"
            : ""
      }`}
    >
      {isSelected && !isDragging && !isEditing && (
        <ActionBar elementId={element.id} onPointerDown={stopDrag} />
      )}
      {isSelected && isShape && !isDragging && (
        <ResizeHandles element={element} onResizeStart={handleResizeStart} />
      )}
      <ElementRenderer
        element={element}
        isEditing={isEditing}
        onCommitText={handleCommitText}
      />
    </div>
  );
}
