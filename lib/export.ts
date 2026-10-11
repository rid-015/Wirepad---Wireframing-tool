import { toJpeg, toPng } from "html-to-image";
import type { Frame, Project } from "./component-registry";

export const PAPER = "#fffefa";

export const slug = (s: string) =>
  String(s || "page").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "page";

export function download(href: string, filename: string) {
  const a = document.createElement("a");
  a.href = href;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

/** Renders the artboard node at its natural size, skipping editor-only overlays (`data-noexport`). */
export async function boardToImage(node: HTMLElement, frame: Frame, fmt: "png" | "jpg", scale: number) {
  if (document.fonts?.ready) await document.fonts.ready;
  const opts = {
    width: frame.w,
    height: frame.h,
    pixelRatio: scale,
    backgroundColor: PAPER,
    quality: 0.95,
    style: { transform: "none", boxShadow: "none" },
    filter: (n: HTMLElement) => !(n.dataset && n.dataset.noexport),
  };
  return fmt === "jpg" ? toJpeg(node, opts) : toPng(node, opts);
}

export function exportProjectJson(project: Project) {
  const blob = new Blob([JSON.stringify(project, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  download(url, slug(project.name) + ".wirepad.json");
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
