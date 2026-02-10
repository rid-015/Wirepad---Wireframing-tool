import { toPng } from "html-to-image";
import type { WirepadProject } from "./store";

function downloadBlob(dataUrl: string, filename: string) {
  const link = document.createElement("a");
  link.download = filename;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export async function exportCanvasAsPng() {
  const canvasEl = document.getElementById("canvas-droppable");
  if (!canvasEl) return;

  const dataUrl = await toPng(canvasEl, {
    pixelRatio: 2,
    backgroundColor: "#1c1c1c",
  });

  downloadBlob(dataUrl, "wireframe.png");
}

export function exportProjectAsJson(project: WirepadProject) {
  const json = JSON.stringify(project, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  downloadBlob(url, "project.wirepad.json");
  URL.revokeObjectURL(url);
}
