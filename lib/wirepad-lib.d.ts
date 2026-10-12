import type { ComponentType, ReactNode, createElement } from "react";

export type FrameKey = "desktop" | "tablet" | "mobile";

export interface Frame {
  label: string;
  w: number;
  h: number;
}

/** Element props are strings; booleans are "1" | "". */
export type ElementProps = Record<string, string>;

export interface WireElement {
  id: string;
  type: string;
  x: number;
  y: number;
  w: number;
  h: number;
  props: ElementProps;
}

export interface Page {
  id: string;
  name: string;
  frame: FrameKey;
  /** Custom page height; absent means the frame's default. */
  h?: number;
  elements: WireElement[];
}

export interface Project {
  name: string;
  activeId: string;
  pages: Page[];
}

/** A library component. w: -1 = full frame width, -2 = inset (frame − 32); h: -1 = frame height. */
export interface LibraryItem {
  type: string;
  label: string;
  /** Lucide icon name, with `|` separated fallbacks. */
  icon: string;
  w: number;
  h: number;
  props: ElementProps;
  at?: "top" | "bottom";
}

export interface Category {
  name: string;
  /** Devices the category is offered on; absent means all. */
  only?: FrameKey[];
  items: LibraryItem[];
}

export interface Field {
  /** Prop key the field edits. */
  k: string;
  label: string;
  kind: "text" | "area" | "toggle" | "icon";
  hint: string;
}

export interface Template {
  id: string;
  name: string;
  frame: FrameKey | null;
  h?: number;
  build: () => WireElement[];
}

export interface IconProps {
  name: string;
  size?: number;
  color?: string;
  strokeWidth?: number;
}

export const FRAMES: Record<FrameKey, Frame>;
export const CATEGORIES: Category[];
export const FIELDS: Record<string, Field[]>;
export const ICON_NAMES: string[];
export const LABELS: Record<string, string>;
export const TEMPLATES: Template[];
export function uid(): string;
export function makeRenderer(h: typeof createElement, Icon: ComponentType<IconProps>): (el: WireElement) => ReactNode;
/** Re-lays out a page for another device in place. Returns false if nothing changed. */
export function adaptPage(page: Page, to: FrameKey): boolean;
export function makePage(tplId: string, frame?: FrameKey, name?: string): Page;
export function defaultProject(): Project;
