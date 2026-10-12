import { FRAMES, type Frame, type Page } from "./wirepad-lib";

export {
  CATEGORIES,
  FIELDS,
  FRAMES,
  ICON_NAMES,
  LABELS,
  TEMPLATES,
  adaptPage,
  defaultProject,
  makePage,
  uid,
} from "./wirepad-lib";
export type {
  Category,
  ElementProps,
  Field,
  Frame,
  FrameKey,
  LibraryItem,
  Page,
  Project,
  Template,
  WireElement,
} from "./wirepad-lib";

export const FULL = -1;
export const INSET = -2;

/** The page's frame with its custom height applied. */
export function frameOf(page: Page): Frame {
  const F = FRAMES[page.frame] || FRAMES.desktop;
  return page.h ? { ...F, h: page.h } : F;
}

/** True when the page is taller than its device's default, so fit uses width only. */
export function isTall(page: Page): boolean {
  return frameOf(page).h > (FRAMES[page.frame] || FRAMES.desktop).h + 1;
}
