"use client";

import { useDroppable } from "@dnd-kit/core";
import { useWirepadStore } from "@/lib/store";
import { CanvasElementComponent } from "./canvas-element";
import { GridOverlay } from "./grid-overlay";

const CANVAS_WIDTH = 375;
const CANVAS_HEIGHT = 812;

export function Canvas() {
  const activeScreen = useWirepadStore((s) => s.getActiveScreen());
  const selectElement = useWirepadStore((s) => s.selectElement);
  const { setNodeRef, isOver } = useDroppable({
    id: "canvas",
  });

  const elements = activeScreen.elements;

  const handleCanvasClick = () => {
    selectElement(null);
  };

  return (
    <main className="flex flex-1 items-center justify-center bg-background p-8">
      <div
        ref={setNodeRef}
        id="canvas-droppable"
        onClick={handleCanvasClick}
        className={`relative overflow-hidden rounded-2xl border transition-colors ${
          isOver
            ? "border-muted-foreground/40 bg-canvas"
            : "border-border bg-canvas"
        }`}
        style={{ width: CANVAS_WIDTH, height: CANVAS_HEIGHT }}
      >
        {/* Phone notch indicator */}
        <div className="absolute left-1/2 top-0 z-10 h-7 w-28 -translate-x-1/2 rounded-b-2xl bg-background/80" />

        {/* Bottom bar */}
        <div className="absolute bottom-2 left-1/2 z-10 h-1 w-28 -translate-x-1/2 rounded-full bg-muted-foreground/20" />

        <GridOverlay />

        {/* Canvas content area */}
        <div className="absolute inset-0 pt-8">
          {elements.map((element) => (
            <CanvasElementComponent key={element.id} element={element} />
          ))}

          {elements.length === 0 && (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground/30">
              <p className="text-xs">Drag components here</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export { CANVAS_WIDTH, CANVAS_HEIGHT };
