import type { ElementType } from "./store";

export interface ComponentItem {
  type: ElementType;
  label: string;
  defaultWidth: number;
  defaultHeight: number;
}

export interface ComponentCategory {
  name: string;
  items: ComponentItem[];
}

export const COMPONENT_CATEGORIES: ComponentCategory[] = [
  {
    name: "Layout",
    items: [
      { type: "container", label: "Container", defaultWidth: 335, defaultHeight: 200 },
      { type: "section", label: "Section", defaultWidth: 335, defaultHeight: 120 },
      { type: "card", label: "Card", defaultWidth: 240, defaultHeight: 140 },
      { type: "divider", label: "Divider", defaultWidth: 335, defaultHeight: 8 },
      { type: "list-item", label: "List Item", defaultWidth: 335, defaultHeight: 48 },
    ],
  },
  {
    name: "Inputs",
    items: [
      { type: "button", label: "Button", defaultWidth: 120, defaultHeight: 40 },
      { type: "text-input", label: "Text Input", defaultWidth: 200, defaultHeight: 40 },
      { type: "textarea", label: "Text Area", defaultWidth: 200, defaultHeight: 80 },
      { type: "checkbox", label: "Checkbox", defaultWidth: 140, defaultHeight: 24 },
      { type: "radio", label: "Radio Button", defaultWidth: 140, defaultHeight: 24 },
      { type: "toggle", label: "Toggle Switch", defaultWidth: 48, defaultHeight: 24 },
      { type: "dropdown", label: "Dropdown Select", defaultWidth: 200, defaultHeight: 40 },
      { type: "slider", label: "Slider", defaultWidth: 200, defaultHeight: 24 },
    ],
  },
  {
    name: "Navigation",
    items: [
      { type: "navbar", label: "Navbar", defaultWidth: 335, defaultHeight: 48 },
      { type: "sidebar-nav", label: "Sidebar Navigation", defaultWidth: 200, defaultHeight: 300 },
      { type: "tabs", label: "Tabs", defaultWidth: 300, defaultHeight: 36 },
      { type: "breadcrumb", label: "Breadcrumb", defaultWidth: 240, defaultHeight: 20 },
      { type: "pagination", label: "Pagination", defaultWidth: 240, defaultHeight: 32 },
      { type: "bottom-nav", label: "Bottom Navigation", defaultWidth: 335, defaultHeight: 56 },
    ],
  },
  {
    name: "Content",
    items: [
      { type: "heading", label: "Heading Text", defaultWidth: 200, defaultHeight: 32 },
      { type: "paragraph", label: "Paragraph Text", defaultWidth: 300, defaultHeight: 60 },
      { type: "image", label: "Image Placeholder", defaultWidth: 160, defaultHeight: 120 },
      { type: "avatar", label: "Avatar", defaultWidth: 40, defaultHeight: 40 },
      { type: "icon", label: "Icon Placeholder", defaultWidth: 24, defaultHeight: 24 },
    ],
  },
  {
    name: "Feedback",
    items: [
      { type: "toast", label: "Toast Notification", defaultWidth: 280, defaultHeight: 56 },
      { type: "alert", label: "Alert Box", defaultWidth: 300, defaultHeight: 64 },
      { type: "progress", label: "Progress Bar", defaultWidth: 240, defaultHeight: 8 },
      { type: "skeleton", label: "Loading Skeleton", defaultWidth: 240, defaultHeight: 60 },
    ],
  },
  {
    name: "Data Display",
    items: [
      { type: "table", label: "Table Placeholder", defaultWidth: 320, defaultHeight: 180 },
      { type: "list", label: "List Placeholder", defaultWidth: 300, defaultHeight: 160 },
      { type: "chart", label: "Chart Placeholder", defaultWidth: 300, defaultHeight: 180 },
    ],
  },
  {
    name: "Prebuilt Blocks",
    items: [
      { type: "block-login", label: "Login Screen", defaultWidth: 335, defaultHeight: 400 },
      { type: "block-signup", label: "Signup Screen", defaultWidth: 335, defaultHeight: 480 },
      { type: "block-dashboard", label: "Dashboard Layout", defaultWidth: 335, defaultHeight: 600 },
      { type: "block-settings", label: "Settings Page", defaultWidth: 335, defaultHeight: 500 },
      { type: "block-profile", label: "Profile Screen", defaultWidth: 335, defaultHeight: 450 },
      { type: "block-empty-state", label: "Empty State", defaultWidth: 280, defaultHeight: 240 },
      { type: "block-modal", label: "Modal Dialog", defaultWidth: 300, defaultHeight: 200 },
      { type: "block-confirmation", label: "Confirmation Dialog", defaultWidth: 280, defaultHeight: 180 },
    ],
  },
];

export function getAllComponents(): ComponentItem[] {
  return COMPONENT_CATEGORIES.flatMap((c) => c.items);
}

export function searchComponents(query: string): ComponentCategory[] {
  if (!query.trim()) return COMPONENT_CATEGORIES;

  const lower = query.toLowerCase();
  return COMPONENT_CATEGORIES.map((category) => ({
    ...category,
    items: category.items.filter((item) =>
      item.label.toLowerCase().includes(lower)
    ),
  })).filter((category) => category.items.length > 0);
}
