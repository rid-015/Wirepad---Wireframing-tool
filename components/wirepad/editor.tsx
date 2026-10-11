"use client";

import { useEffect, useCallback, useRef, useState } from "react";
import {
  DndContext,
  DragOverlay,
  type DragEndEvent,
  type DragStartEvent,
  type Modifier,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { getEventCoordinates } from "@dnd-kit/utilities";
import { useWirepadStore } from "@/lib/store";
import type { ComponentItem } from "@/lib/component-registry";
import { Toolbar } from "./toolbar";
import { Sidebar, ComponentPreview } from "./sidebar";
import { Canvas, CANVAS_WIDTH, CANVAS_HEIGHT } from "./canvas";
import { ScreenManager } from "./screen-manager";

// Keeps the drag preview centered under the pointer.
const snapCenterToCursor: Modifier = ({
  activatorEvent,
  draggingNodeRect,
  transform,
}) => {
  if (!draggingNodeRect || !activatorEvent) return transform;
  const coords = getEventCoordinates(activatorEvent);
  if (!coords) return transform;
  return {
    ...transform,
    x: transform.x + coords.x - draggingNodeRect.left - draggingNodeRect.width / 2,
    y: transform.y + coords.y - draggingNodeRect.top - draggingNodeRect.height / 2,
  };
};

export function Editor() {
  const [draggingItem, setDraggingItem] = useState<ComponentItem | null>(null);
  const { addElement, updateElement, grid, loadFromStorage } =
    useWirepadStore();

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  // Last known pointer position, used to place sidebar drops exactly where
  // the drag preview is released.
  const pointer = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    })
  );

  const snapToGrid = useCallback(
    (x: number, y: number): [number, number] => {
      if (!grid.snap || !grid.visible) return [x, y];
      const size = grid.size;
      return [Math.round(x / size) * size, Math.round(y / size) * size];
    },
    [grid.snap, grid.visible, grid.size]
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const data = event.active.data.current;
    setDraggingItem(data?.fromSidebar ? (data.item as ComponentItem) : null);
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      setDraggingItem(null);
      const { active, over, delta } = event;

      if (!over || over.id !== "canvas") return;

      const data = active.data.current;
      if (!data) return;

      if (data.fromSidebar) {
        const canvasContainer = document.getElementById("canvas-droppable");
        if (!canvasContainer) return;

        const defaultWidth = data.defaultWidth || 120;
        const defaultHeight = data.defaultHeight || 40;

        // Drop centered on the pointer, matching the drag preview
        const rect = canvasContainer.getBoundingClientRect();
        let x = pointer.current.x - rect.left - defaultWidth / 2;
        let y = pointer.current.y - rect.top - defaultHeight / 2;

        // Clamp within canvas
        x = Math.max(0, Math.min(x, CANVAS_WIDTH - defaultWidth));
        y = Math.max(0, Math.min(y, CANVAS_HEIGHT - defaultHeight));

        const [snappedX, snappedY] = snapToGrid(x, y);

        addElement({
          id: `el-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          type: data.type,
          x: snappedX,
          y: snappedY,
          width: defaultWidth,
          height: defaultHeight,
          properties: {},
        });
      } else if (data.element) {
        // Moving existing element
        const el = data.element;
        let newX = el.x + delta.x;
        let newY = el.y + delta.y;

        // Clamp within canvas
        newX = Math.max(0, Math.min(newX, CANVAS_WIDTH - el.width));
        newY = Math.max(0, Math.min(newY, CANVAS_HEIGHT - el.height));

        const [snappedX, snappedY] = snapToGrid(newX, newY);

        updateElement(el.id, { x: snappedX, y: snappedY });
      }
    },
    [addElement, updateElement, snapToGrid]
  );

  return (
    <DndContext
      id="wirepad-dnd"
      sensors={sensors}
      autoScroll={false}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setDraggingItem(null)}
    >
      <div className="flex h-screen flex-col">
        <Toolbar />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <Canvas />
          <ScreenManager />
        </div>
      </div>
      <DragOverlay modifiers={[snapCenterToCursor]} dropAnimation={null}>
        {draggingItem && (
          <div className="opacity-80 drop-shadow-2xl">
            <ComponentPreview
              item={draggingItem}
              maxWidth={draggingItem.defaultWidth}
              maxHeight={draggingItem.defaultHeight}
            />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
