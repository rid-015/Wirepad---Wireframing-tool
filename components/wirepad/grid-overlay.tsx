"use client";

import { useWirepadStore } from "@/lib/store";

export function GridOverlay() {
  const { grid } = useWirepadStore();

  if (!grid.visible) return null;

  const size = grid.size;

  return (
    <div
      className="pointer-events-none absolute inset-0"
      style={{
        backgroundImage: `
          linear-gradient(to right, hsl(0 0% 100% / 0.04) 1px, transparent 1px),
          linear-gradient(to bottom, hsl(0 0% 100% / 0.04) 1px, transparent 1px)
        `,
        backgroundSize: `${size}px ${size}px`,
      }}
      aria-hidden="true"
    />
  );
}
