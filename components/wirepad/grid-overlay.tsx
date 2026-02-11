"use client";

import { useWirepadStore } from "@/lib/store";

export function GridOverlay() {
  const { grid } = useWirepadStore();

  if (!grid.visible) return null;

  const size = grid.size;

  const color = "hsla(0,0%,100%,0.05)";

  return (
    <div
      className="pointer-events-none absolute inset-0"
      style={{
        backgroundImage: `linear-gradient(to right,${color} 1px,transparent 1px),linear-gradient(to bottom,${color} 1px,transparent 1px)`,
        backgroundSize: `${size}px ${size}px`,
        backgroundPosition: "0px 0px",
        imageRendering: "pixelated",
      }}
      aria-hidden="true"
    />
  );
}
