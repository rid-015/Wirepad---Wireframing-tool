"use client";

import { useEffect, useCallback } from "react";
import {
  DndContext,
  type DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useWirepadStore } from "@/lib/store";
import { Toolbar } from "./toolbar";
import { Sidebar } from "./sidebar";
import { Canvas, CANVAS_WIDTH, CANVAS_HEIGHT } from "./canvas";

export function Editor() {
  const { addElement, updateElement, grid, loadFromStorage } =
    useWirepadStore();

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

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

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over, delta } = event;

      if (!over || over.id !== "canvas") return;

      const data = active.data.current;
      if (!data) return;

      if (data.fromSidebar) {
        const canvasContainer = document.getElementById("canvas-droppable");
        if (!canvasContainer) return;

        const defaultWidth = data.defaultWidth || 120;
        const defaultHeight = data.defaultHeight || 40;

        // Drop at center of canvas by default, offset by delta
        let x = CANVAS_WIDTH / 2 - defaultWidth / 2 + delta.x;
        let y = CANVAS_HEIGHT / 2 - defaultHeight / 2 + delta.y;

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
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="flex h-screen flex-col">
        <Toolbar />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <Canvas />
        </div>
      </div>
    </DndContext>
  );
}
