import * as lucide from "lucide-react";
import type { LucideIcon } from "lucide-react";

// The namespace (not `icons`) so legacy aliases like "Filter" and "AlignLeft" still resolve.
const lookup = lucide as unknown as Record<string, LucideIcon | undefined>;

/** Lucide icon by name. `name` may list `|` separated fallbacks; unknown names render an empty box. */
export function Icon({
  name,
  size = 16,
  color = "currentColor",
  strokeWidth = 2,
}: {
  name: string;
  size?: number;
  color?: string;
  strokeWidth?: number;
}) {
  for (const n of name.split("|")) {
    const C = lookup[n];
    // Icons are forwardRef objects; skip helper exports like createLucideIcon.
    if (C && "$$typeof" in C) return <C size={size} color={color} strokeWidth={strokeWidth} style={{ display: "block", flexShrink: 0 }} />;
  }
  return <span style={{ display: "inline-block", width: size, height: size, flexShrink: 0 }} />;
}
