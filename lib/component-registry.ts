import type { ElementType } from "./store";

export interface ComponentItem {
  type: ElementType;
  label: string;
  defaultWidth: number;
  defaultHeight: number;
  /** Extra search terms beyond the label. */
  keywords?: string[];
}

export interface ComponentCategory {
  name: string;
  items: ComponentItem[];
  /** Start collapsed in the sidebar. */
  collapsed?: boolean;
}

// Section, Divider, Rounded Rect, Sidebar Nav, Breadcrumb and Pagination are
// no longer offered in the palette (redundant or desktop-only on a phone
// canvas), but remain valid ElementTypes so saved projects still render.
export const COMPONENT_CATEGORIES: ComponentCategory[] = [
  {
    name: "Basics",
    items: [
      { type: "heading", label: "Heading", defaultWidth: 200, defaultHeight: 32, keywords: ["title", "text"] },
      { type: "paragraph", label: "Paragraph", defaultWidth: 300, defaultHeight: 60, keywords: ["text", "body", "copy"] },
      { type: "shape-rectangle", label: "Rectangle", defaultWidth: 120, defaultHeight: 80, keywords: ["box", "square", "shape"] },
      { type: "shape-circle", label: "Circle", defaultWidth: 80, defaultHeight: 80, keywords: ["ellipse", "shape"] },
      { type: "shape-divider-line", label: "Line", defaultWidth: 200, defaultHeight: 4, keywords: ["divider", "separator", "rule"] },
      { type: "shape-arrow-line", label: "Arrow", defaultWidth: 160, defaultHeight: 24, keywords: ["flow", "connector"] },
    ],
  },
  {
    name: "Layout",
    items: [
      { type: "container", label: "Container", defaultWidth: 335, defaultHeight: 200, keywords: ["group", "section", "frame"] },
      { type: "card", label: "Card", defaultWidth: 240, defaultHeight: 160, keywords: ["tile", "panel"] },
      { type: "list-item", label: "List Item", defaultWidth: 335, defaultHeight: 56, keywords: ["row", "cell"] },
    ],
  },
  {
    name: "Inputs",
    items: [
      { type: "button", label: "Button", defaultWidth: 140, defaultHeight: 44, keywords: ["cta", "action"] },
      { type: "fab", label: "FAB", defaultWidth: 56, defaultHeight: 56, keywords: ["floating action button", "add", "plus"] },
      { type: "text-input", label: "Text Field", defaultWidth: 280, defaultHeight: 44, keywords: ["input", "form"] },
      { type: "search-bar", label: "Search Bar", defaultWidth: 335, defaultHeight: 44, keywords: ["find", "query"] },
      { type: "textarea", label: "Text Area", defaultWidth: 280, defaultHeight: 96, keywords: ["multiline", "comment"] },
      { type: "dropdown", label: "Dropdown", defaultWidth: 280, defaultHeight: 44, keywords: ["select", "picker", "menu"] },
      { type: "checkbox", label: "Checkbox", defaultWidth: 140, defaultHeight: 24, keywords: ["check", "tick"] },
      { type: "radio", label: "Radio", defaultWidth: 140, defaultHeight: 24, keywords: ["option", "choice"] },
      { type: "toggle", label: "Toggle", defaultWidth: 48, defaultHeight: 28, keywords: ["switch"] },
      { type: "slider", label: "Slider", defaultWidth: 240, defaultHeight: 24, keywords: ["range"] },
    ],
  },
  {
    name: "Navigation",
    items: [
      { type: "status-bar", label: "Status Bar", defaultWidth: 375, defaultHeight: 32, keywords: ["time", "battery", "system"] },
      { type: "navbar", label: "Top Bar", defaultWidth: 375, defaultHeight: 52, keywords: ["navbar", "header", "app bar"] },
      { type: "tabs", label: "Tabs", defaultWidth: 335, defaultHeight: 40, keywords: ["segmented"] },
      { type: "bottom-nav", label: "Tab Bar", defaultWidth: 375, defaultHeight: 64, keywords: ["bottom nav", "footer"] },
    ],
  },
  {
    name: "Content",
    items: [
      { type: "image", label: "Image", defaultWidth: 200, defaultHeight: 140, keywords: ["photo", "picture", "media"] },
      { type: "avatar", label: "Avatar", defaultWidth: 48, defaultHeight: 48, keywords: ["user", "profile", "person"] },
      { type: "icon", label: "Icon", defaultWidth: 24, defaultHeight: 24, keywords: ["symbol", "star"] },
      { type: "chip", label: "Chip", defaultWidth: 88, defaultHeight: 32, keywords: ["tag", "badge", "pill", "filter"] },
    ],
  },
  {
    name: "Feedback",
    items: [
      { type: "toast", label: "Toast", defaultWidth: 335, defaultHeight: 48, keywords: ["snackbar", "notification"] },
      { type: "alert", label: "Alert", defaultWidth: 335, defaultHeight: 72, keywords: ["banner", "warning", "info"] },
      { type: "progress", label: "Progress", defaultWidth: 240, defaultHeight: 8, keywords: ["loading", "bar"] },
      { type: "skeleton", label: "Skeleton", defaultWidth: 300, defaultHeight: 60, keywords: ["loading", "placeholder"] },
    ],
  },
  {
    name: "Data",
    items: [
      { type: "list", label: "List", defaultWidth: 335, defaultHeight: 200, keywords: ["rows", "feed"] },
      { type: "table", label: "Table", defaultWidth: 335, defaultHeight: 180, keywords: ["grid", "rows", "columns"] },
      { type: "chart", label: "Chart", defaultWidth: 335, defaultHeight: 200, keywords: ["graph", "bar", "analytics"] },
    ],
  },
  {
    name: "Screens",
    collapsed: true,
    items: [
      { type: "block-login", label: "Login", defaultWidth: 335, defaultHeight: 420, keywords: ["sign in", "auth"] },
      { type: "block-signup", label: "Sign Up", defaultWidth: 335, defaultHeight: 480, keywords: ["register", "auth"] },
      { type: "block-dashboard", label: "Dashboard", defaultWidth: 335, defaultHeight: 600, keywords: ["home", "overview"] },
      { type: "block-settings", label: "Settings", defaultWidth: 335, defaultHeight: 360, keywords: ["preferences"] },
      { type: "block-profile", label: "Profile", defaultWidth: 335, defaultHeight: 460, keywords: ["account", "user"] },
      { type: "block-empty-state", label: "Empty State", defaultWidth: 300, defaultHeight: 260, keywords: ["no results", "zero"] },
      { type: "block-modal", label: "Modal", defaultWidth: 315, defaultHeight: 200, keywords: ["dialog", "sheet", "popup"] },
      { type: "block-confirmation", label: "Confirm", defaultWidth: 300, defaultHeight: 220, keywords: ["dialog", "delete", "are you sure"] },
    ],
  },
];

export function getAllComponents(): ComponentItem[] {
  return COMPONENT_CATEGORIES.flatMap((c) => c.items);
}

export function searchComponents(query: string): ComponentCategory[] {
  if (!query.trim()) return COMPONENT_CATEGORIES;

  const lower = query.trim().toLowerCase();
  return COMPONENT_CATEGORIES.map((category) => ({
    ...category,
    items: category.items.filter(
      (item) =>
        item.label.toLowerCase().includes(lower) ||
        category.name.toLowerCase().includes(lower) ||
        item.keywords?.some((k) => k.includes(lower))
    ),
  })).filter((category) => category.items.length > 0);
}
