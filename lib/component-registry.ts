export type FrameKey = "desktop" | "tablet" | "mobile";

export interface Frame {
  label: string;
  w: number;
  h: number;
}

export const FRAMES: Record<FrameKey, Frame> = {
  desktop: { label: "Desktop", w: 1440, h: 1024 },
  tablet: { label: "Tablet", w: 834, h: 1194 },
  mobile: { label: "Mobile", w: 390, h: 844 },
};

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
  elements: WireElement[];
}

export interface Project {
  name: string;
  activeId: string;
  pages: Page[];
}

/** A component in the library. `w`/`h` of FULL means "match the frame". */
export interface LibraryItem {
  type: string;
  label: string;
  /** Lucide icon name, with `|` separated fallbacks. */
  icon: string;
  w: number;
  h: number;
  props: ElementProps;
  /** Where a click-to-add places it vertically. */
  at?: "top" | "bottom";
}

export interface Category {
  name: string;
  items: LibraryItem[];
}

export const FULL = -1;

export const uid = () => Math.random().toString(36).slice(2, 9);

const T = (
  type: string,
  label: string,
  icon: string,
  w: number,
  h: number,
  props: ElementProps = {},
  at?: "top" | "bottom"
): LibraryItem => ({ type, label, icon, w, h, props, at });

export const CATEGORIES: Category[] = [
  {
    name: "Shapes & text",
    items: [
      T("rect", "Rectangle", "Square", 160, 100),
      T("ellipse", "Ellipse", "Circle", 100, 100),
      T("line", "Line", "Minus", 200, 12),
      T("arrow", "Arrow", "MoveRight|ArrowRight", 160, 20),
      T("heading", "Heading", "Heading", 320, 44, { text: "Page heading" }),
      T("text", "Text", "Type", 200, 28, { text: "Text label" }),
      T("paragraph", "Paragraph", "AlignLeft", 320, 80, { text: "" }),
      T("link", "Link", "Link", 120, 24, { text: "Learn more" }),
      T("note", "Sticky note", "StickyNote", 180, 140, { text: "Note…" }),
      T("divider", "Divider", "SeparatorHorizontal|Minus", 320, 12),
    ],
  },
  {
    name: "Forms",
    items: [
      T("button", "Button", "MousePointerClick", 140, 44, { text: "Button" }),
      T("button2", "Secondary", "RectangleHorizontal", 140, 44, { text: "Cancel" }),
      T("input", "Text input", "TextCursorInput", 280, 44, { text: "Placeholder" }),
      T("textarea", "Text area", "AlignJustify", 280, 110, { text: "Write something…" }),
      T("search", "Search", "Search", 280, 44, { text: "Search…" }),
      T("select", "Dropdown", "SquareChevronDown|ChevronDown", 220, 44, { text: "Select option" }),
      T("checkbox", "Checkbox", "SquareCheck|CheckSquare", 180, 24, { text: "Remember me", on: "1" }),
      T("radio", "Radio", "CircleDot", 180, 24, { text: "Option", on: "1" }),
      T("toggle", "Toggle", "ToggleRight", 52, 28, { on: "1" }),
      T("slider", "Slider", "SlidersHorizontal", 240, 24, { value: "60" }),
      T("progress", "Progress", "Activity", 240, 12, { value: "60" }),
      T("badge", "Badge", "Tag", 80, 26, { text: "New" }),
    ],
  },
  {
    name: "Navigation",
    items: [
      T("navbar", "Navbar", "PanelTop", FULL, 64, { text: "Brand", items: "Home, Product, Pricing, About" }, "top"),
      T("sidebar", "Sidebar", "PanelLeft", 240, 600, { text: "Acme", items: "Dashboard, Projects, Messages, Calendar, Settings" }),
      T("tabs", "Tabs", "Columns3", 360, 40, { items: "Overview, Activity, Settings" }),
      T("breadcrumb", "Breadcrumb", "ChevronsRight", 280, 24, { items: "Home, Projects, Wirepad" }),
      T("pagination", "Pagination", "Ellipsis|MoreHorizontal", 300, 32),
      T("footer", "Footer", "PanelBottom", FULL, 160, {}, "bottom"),
    ],
  },
  {
    name: "Cards & lists",
    items: [
      T("card", "Card", "CreditCard", 280, 260, { text: "Card title" }),
      T("list", "List", "List", 340, 240),
      T("listitem", "List item", "Rows3", 340, 60, { text: "List item" }),
      T("stat", "Stat card", "Hash", 260, 120, { text: "Revenue", value: "$12,480" }),
    ],
  },
  {
    name: "Tables & charts",
    items: [
      T("table", "Table", "Table2|Table", 520, 220, { items: "Name, Status, Date, Amount" }),
      T("barchart", "Bar chart", "ChartColumn|BarChart3", 360, 240, { text: "Monthly" }),
      T("linechart", "Line chart", "ChartLine|LineChart", 360, 240, { text: "Growth" }),
      T("piechart", "Pie chart", "ChartPie|PieChart", 200, 200),
    ],
  },
  {
    name: "Media",
    items: [
      T("image", "Image", "Image", 320, 200, { text: "" }),
      T("video", "Video", "Video|Film", 360, 200),
      T("avatar", "Avatar", "CircleUser|UserCircle", 48, 48),
      T("map", "Map", "Map", 360, 220),
    ],
  },
  {
    name: "Mobile",
    items: [
      T("statusbar", "Status bar", "Signal", FULL, 44, {}, "top"),
      T("appbar", "App bar", "ArrowLeft", FULL, 52, { text: "Title" }, "top"),
      T("tabbar", "Tab bar", "PanelBottom", FULL, 84, { items: "Home, Search, Saved, Profile" }, "bottom"),
      T("keyboard", "Keyboard", "Keyboard", FULL, 260, {}, "bottom"),
      T("homeind", "Home bar", "GripHorizontal|Minus", FULL, 34, {}, "bottom"),
    ],
  },
  {
    name: "Modals & alerts",
    items: [
      T("modal", "Modal", "AppWindow", 420, 240, { text: "Modal title" }),
      T("confirm", "Confirm", "CircleHelp|HelpCircle", 320, 230, { text: "Delete this item?" }),
      T("alert", "Alert", "CircleAlert|AlertCircle", 360, 72, { text: "Something needs attention" }),
      T("toast", "Toast", "Bell", 320, 52, { text: "Changes saved" }),
      T("tooltip", "Tooltip", "MessageSquare", 160, 52, { text: "Tooltip text" }),
      T("scrim", "Backdrop", "SquareDashed|Square", FULL, FULL),
    ],
  },
  {
    name: "Icons",
    items: [
      "Star", "Heart", "Search", "Menu", "User", "Settings", "Bell", "House", "ShoppingCart", "Mail",
      "Plus", "X", "Check", "Camera", "Calendar", "Share2", "Trash2", "Lock", "MapPin", "Filter",
    ].map((n) =>
      T("icon", n === "House" ? "Home" : n === "Share2" ? "Share" : n === "Trash2" ? "Trash" : n, n, 32, 32, { icon: n })
    ),
  },
];

export const ICON_NAMES = [
  "Star", "Heart", "Search", "Menu", "User", "Users", "Settings", "Bell", "House", "ShoppingCart",
  "Mail", "Plus", "X", "Check", "Camera", "Calendar", "Share2", "Trash2", "Lock", "MapPin",
  "Filter", "Download", "Upload", "Phone", "MessageCircle", "Bookmark", "Clock", "Eye", "Pencil", "ArrowRight",
  "ArrowLeft", "ChevronDown", "Info", "Globe", "Image", "Music", "Play", "Sun", "Moon", "Zap",
];

export const LABELS: Record<string, string> = {};
const DEFAULT_PROPS: Record<string, ElementProps> = {};
CATEGORIES.forEach((c) =>
  c.items.forEach((i) => {
    if (!LABELS[i.type]) LABELS[i.type] = i.label;
    if (!DEFAULT_PROPS[i.type]) DEFAULT_PROPS[i.type] = i.props;
  })
);
LABELS.icon = "Icon";

const E = (type: string, x: number, y: number, w: number, h: number, p: ElementProps = {}): WireElement => ({
  id: uid(),
  type,
  x,
  y,
  w,
  h,
  props: { ...(DEFAULT_PROPS[type] || {}), ...p },
});

export interface Template {
  id: string;
  name: string;
  /** null keeps the current page's frame. */
  frame: FrameKey | null;
  build: () => WireElement[];
}

export const TEMPLATES: Template[] = [
  { id: "blank", name: "Blank", frame: null, build: () => [] },
  {
    id: "landing",
    name: "Landing page",
    frame: "desktop",
    build: () => [
      E("navbar", 0, 0, 1440, 72, { text: "Wirepad", items: "Product, Pricing, Docs, Blog" }),
      E("heading", 80, 200, 640, 56, { text: "Sketch it before you build it" }),
      E("paragraph", 80, 284, 540, 80),
      E("button", 80, 400, 164, 48, { text: "Get started" }),
      E("button2", 260, 400, 150, 48, { text: "Learn more" }),
      E("image", 760, 150, 600, 390),
      E("heading", 80, 608, 400, 40, { text: "Features" }),
      E("card", 80, 672, 410, 240, { text: "Fast" }),
      E("card", 515, 672, 410, 240, { text: "Simple" }),
      E("card", 950, 672, 410, 240, { text: "Shareable" }),
      E("footer", 0, 944, 1440, 80),
    ],
  },
  {
    id: "dashboard",
    name: "Dashboard",
    frame: "desktop",
    build: () => [
      E("sidebar", 0, 0, 240, 1024, { text: "Acme", items: "Overview, Projects, Team, Reports, Settings" }),
      E("heading", 280, 32, 300, 40, { text: "Overview" }),
      E("search", 980, 30, 300, 44),
      E("avatar", 1352, 28, 48, 48),
      E("stat", 280, 104, 262, 120, { text: "Revenue", value: "$48,210" }),
      E("stat", 566, 104, 262, 120, { text: "Users", value: "2,481" }),
      E("stat", 852, 104, 262, 120, { text: "Orders", value: "913" }),
      E("stat", 1138, 104, 262, 120, { text: "Churn", value: "2.4%" }),
      E("linechart", 280, 256, 736, 320, { text: "Revenue" }),
      E("barchart", 1040, 256, 360, 320, { text: "Channels" }),
      E("table", 280, 608, 1120, 376, { items: "Customer, Plan, Status, Date, Amount" }),
    ],
  },
  {
    id: "settings",
    name: "Settings",
    frame: "tablet",
    build: () => {
      const rows = ["Push notifications", "Email updates", "Dark mode", "Two-factor authentication", "Location access"];
      return [
        E("appbar", 0, 0, 834, 64, { text: "Settings" }),
        E("heading", 32, 100, 300, 36, { text: "Account" }),
        E("avatar", 32, 160, 72, 72),
        E("text", 124, 172, 300, 26, { text: "Jordan Lee" }),
        E("text", 124, 202, 300, 22, { text: "jordan@example.com" }),
        ...rows.flatMap((t, i) => [
          E("text", 32, 288 + i * 68, 500, 26, { text: t }),
          E("toggle", 750, 286 + i * 68, 52, 28, { on: i % 2 ? "" : "1" }),
          E("divider", 32, 330 + i * 68, 770, 12),
        ]),
        E("button2", 32, 650, 180, 48, { text: "Sign out" }),
      ];
    },
  },
  {
    id: "login",
    name: "Login",
    frame: "mobile",
    build: () => [
      E("statusbar", 0, 0, 390, 44),
      E("rect", 163, 120, 64, 64, { fill: "1" }),
      E("heading", 24, 220, 342, 40, { text: "Welcome back" }),
      E("paragraph", 24, 274, 300, 30),
      E("text", 24, 336, 200, 24, { text: "Email" }),
      E("input", 24, 362, 342, 48, { text: "you@example.com" }),
      E("text", 24, 428, 200, 24, { text: "Password" }),
      E("input", 24, 454, 342, 48, { text: "••••••••" }),
      E("link", 24, 518, 180, 24, { text: "Forgot password?" }),
      E("button", 24, 570, 342, 52, { text: "Sign in" }),
      E("text", 64, 644, 300, 24, { text: "No account? Sign up" }),
      E("homeind", 0, 810, 390, 34),
    ],
  },
  {
    id: "feed",
    name: "Mobile feed",
    frame: "mobile",
    build: () => [
      E("statusbar", 0, 0, 390, 44),
      E("appbar", 0, 44, 390, 52, { text: "Discover" }),
      E("tabs", 16, 108, 358, 40, { items: "For you, Following, Popular" }),
      E("card", 16, 164, 358, 290, { text: "Morning hike" }),
      E("card", 16, 470, 358, 290, { text: "City lights" }),
      E("tabbar", 0, 760, 390, 84),
    ],
  },
];

export function frameOf(page: Page): Frame {
  return FRAMES[page.frame] || FRAMES.desktop;
}

export function makePage(tplId: string, frame?: FrameKey, name?: string): Page {
  const t = TEMPLATES.find((x) => x.id === tplId) || TEMPLATES[0];
  const f = t.frame || frame || "desktop";
  return { id: uid(), name: name || t.name, frame: f, elements: t.build() };
}

export function defaultProject(): Project {
  const p = makePage("landing", "desktop", "Home");
  return { name: "Untitled project", activeId: p.id, pages: [p] };
}
