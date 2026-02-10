import type { ElementType } from "./store";
import type { LucideIcon } from "lucide-react";
import {
  RectangleHorizontal,
  Rows3,
  CreditCard,
  Minus,
  List,
  MousePointerClick,
  TextCursorInput,
  AlignLeft,
  CheckSquare,
  Circle,
  ToggleRight,
  ChevronDown,
  SlidersHorizontal,
  PanelTop,
  PanelLeft,
  Columns3,
  MoreHorizontal,
  ChevronsLeftRight,
  Dock,
  Heading,
  Type,
  ImageIcon,
  UserCircle,
  Sparkles,
  Bell,
  AlertTriangle,
  Loader,
  BarChart3,
  Table2,
  ListOrdered,
  LayoutDashboard,
  LogIn,
  UserPlus,
  Settings,
  User,
  Inbox,
  MessageSquare,
  ShieldCheck,
  Activity,
  Square,
  CircleDot,
  SquareIcon,
  MoveHorizontal,
  ArrowRight,
} from "lucide-react";

export interface ComponentItem {
  type: ElementType;
  label: string;
  icon: LucideIcon;
  defaultWidth: number;
  defaultHeight: number;
}

export interface ComponentCategory {
  name: string;
  items: ComponentItem[];
}

export const COMPONENT_CATEGORIES: ComponentCategory[] = [
  {
    name: "Shapes",
    items: [
      { type: "shape-rectangle", label: "Rectangle", icon: Square, defaultWidth: 120, defaultHeight: 80 },
      { type: "shape-circle", label: "Circle", icon: CircleDot, defaultWidth: 80, defaultHeight: 80 },
      { type: "shape-rounded-rect", label: "Rounded Rect", icon: SquareIcon, defaultWidth: 120, defaultHeight: 80 },
      { type: "shape-divider-line", label: "Divider Line", icon: MoveHorizontal, defaultWidth: 200, defaultHeight: 4 },
      { type: "shape-arrow-line", label: "Arrow Line", icon: ArrowRight, defaultWidth: 160, defaultHeight: 24 },
    ],
  },
  {
    name: "Layout",
    items: [
      { type: "container", label: "Container", icon: RectangleHorizontal, defaultWidth: 335, defaultHeight: 200 },
      { type: "section", label: "Section", icon: Rows3, defaultWidth: 335, defaultHeight: 120 },
      { type: "card", label: "Card", icon: CreditCard, defaultWidth: 240, defaultHeight: 140 },
      { type: "divider", label: "Divider", icon: Minus, defaultWidth: 335, defaultHeight: 8 },
      { type: "list-item", label: "List Item", icon: List, defaultWidth: 335, defaultHeight: 48 },
    ],
  },
  {
    name: "Inputs",
    items: [
      { type: "button", label: "Button", icon: MousePointerClick, defaultWidth: 120, defaultHeight: 40 },
      { type: "text-input", label: "Text Input", icon: TextCursorInput, defaultWidth: 200, defaultHeight: 40 },
      { type: "textarea", label: "Text Area", icon: AlignLeft, defaultWidth: 200, defaultHeight: 80 },
      { type: "checkbox", label: "Checkbox", icon: CheckSquare, defaultWidth: 140, defaultHeight: 24 },
      { type: "radio", label: "Radio Button", icon: Circle, defaultWidth: 140, defaultHeight: 24 },
      { type: "toggle", label: "Toggle Switch", icon: ToggleRight, defaultWidth: 48, defaultHeight: 24 },
      { type: "dropdown", label: "Dropdown", icon: ChevronDown, defaultWidth: 200, defaultHeight: 40 },
      { type: "slider", label: "Slider", icon: SlidersHorizontal, defaultWidth: 200, defaultHeight: 24 },
    ],
  },
  {
    name: "Navigation",
    items: [
      { type: "navbar", label: "Navbar", icon: PanelTop, defaultWidth: 335, defaultHeight: 48 },
      { type: "sidebar-nav", label: "Sidebar Nav", icon: PanelLeft, defaultWidth: 200, defaultHeight: 300 },
      { type: "tabs", label: "Tabs", icon: Columns3, defaultWidth: 300, defaultHeight: 36 },
      { type: "breadcrumb", label: "Breadcrumb", icon: MoreHorizontal, defaultWidth: 240, defaultHeight: 20 },
      { type: "pagination", label: "Pagination", icon: ChevronsLeftRight, defaultWidth: 240, defaultHeight: 32 },
      { type: "bottom-nav", label: "Bottom Nav", icon: Dock, defaultWidth: 335, defaultHeight: 56 },
    ],
  },
  {
    name: "Content",
    items: [
      { type: "heading", label: "Heading", icon: Heading, defaultWidth: 200, defaultHeight: 32 },
      { type: "paragraph", label: "Paragraph", icon: Type, defaultWidth: 300, defaultHeight: 60 },
      { type: "image", label: "Image", icon: ImageIcon, defaultWidth: 160, defaultHeight: 120 },
      { type: "avatar", label: "Avatar", icon: UserCircle, defaultWidth: 40, defaultHeight: 40 },
      { type: "icon", label: "Icon", icon: Sparkles, defaultWidth: 24, defaultHeight: 24 },
    ],
  },
  {
    name: "Feedback",
    items: [
      { type: "toast", label: "Toast", icon: Bell, defaultWidth: 280, defaultHeight: 56 },
      { type: "alert", label: "Alert", icon: AlertTriangle, defaultWidth: 300, defaultHeight: 64 },
      { type: "progress", label: "Progress Bar", icon: Activity, defaultWidth: 240, defaultHeight: 8 },
      { type: "skeleton", label: "Skeleton", icon: Loader, defaultWidth: 240, defaultHeight: 60 },
    ],
  },
  {
    name: "Data Display",
    items: [
      { type: "table", label: "Table", icon: Table2, defaultWidth: 320, defaultHeight: 180 },
      { type: "list", label: "List", icon: ListOrdered, defaultWidth: 300, defaultHeight: 160 },
      { type: "chart", label: "Chart", icon: BarChart3, defaultWidth: 300, defaultHeight: 180 },
    ],
  },
  {
    name: "Prebuilt Blocks",
    items: [
      { type: "block-login", label: "Login Screen", icon: LogIn, defaultWidth: 335, defaultHeight: 400 },
      { type: "block-signup", label: "Signup Screen", icon: UserPlus, defaultWidth: 335, defaultHeight: 480 },
      { type: "block-dashboard", label: "Dashboard", icon: LayoutDashboard, defaultWidth: 335, defaultHeight: 600 },
      { type: "block-settings", label: "Settings", icon: Settings, defaultWidth: 335, defaultHeight: 500 },
      { type: "block-profile", label: "Profile", icon: User, defaultWidth: 335, defaultHeight: 450 },
      { type: "block-empty-state", label: "Empty State", icon: Inbox, defaultWidth: 280, defaultHeight: 240 },
      { type: "block-modal", label: "Modal", icon: MessageSquare, defaultWidth: 300, defaultHeight: 200 },
      { type: "block-confirmation", label: "Confirm Dialog", icon: ShieldCheck, defaultWidth: 280, defaultHeight: 180 },
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
