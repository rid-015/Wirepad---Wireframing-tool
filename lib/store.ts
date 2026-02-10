import { create } from "zustand";

export type ElementType =
  // Layout
  | "container"
  | "section"
  | "card"
  | "divider"
  | "list-item"
  // Inputs
  | "button"
  | "text-input"
  | "textarea"
  | "checkbox"
  | "radio"
  | "toggle"
  | "dropdown"
  | "slider"
  // Navigation
  | "navbar"
  | "sidebar-nav"
  | "tabs"
  | "breadcrumb"
  | "pagination"
  | "bottom-nav"
  // Content
  | "heading"
  | "paragraph"
  | "image"
  | "avatar"
  | "icon"
  // Feedback
  | "toast"
  | "alert"
  | "progress"
  | "skeleton"
  // Data Display
  | "table"
  | "list"
  | "chart"
  // Prebuilt Blocks
  | "block-login"
  | "block-signup"
  | "block-dashboard"
  | "block-settings"
  | "block-profile"
  | "block-empty-state"
  | "block-modal"
  | "block-confirmation"
  // Legacy aliases
  | "text"
  | "input";

export interface CanvasElement {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  properties: Record<string, string>;
}

export interface Screen {
  id: string;
  name: string;
  elements: CanvasElement[];
}

interface GridSettings {
  visible: boolean;
  size: 8 | 12 | 16;
  snap: boolean;
}

interface WirepadProject {
  screens: Screen[];
  activeScreenId: string;
}

interface WirepadState {
  project: WirepadProject;
  grid: GridSettings;
  selectedElementId: string | null;

  // Screen actions
  addScreen: (name?: string) => void;
  removeScreen: (id: string) => void;
  renameScreen: (id: string, name: string) => void;
  setActiveScreen: (id: string) => void;

  // Element actions (operate on active screen)
  addElement: (element: CanvasElement) => void;
  updateElement: (id: string, updates: Partial<CanvasElement>) => void;
  removeElement: (id: string) => void;
  duplicateElement: (id: string) => void;
  clearCanvas: () => void;

  // Selection
  selectElement: (id: string | null) => void;

  // Grid actions
  setGridVisible: (visible: boolean) => void;
  setGridSize: (size: 8 | 12 | 16) => void;
  setGridSnap: (snap: boolean) => void;

  // Persistence
  loadFromStorage: () => void;

  // Derived helpers
  getActiveScreen: () => Screen;
}

const STORAGE_KEY = "wirepad-project";

function createScreenId() {
  return `screen-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function createDefaultProject(): WirepadProject {
  const defaultId = createScreenId();
  return {
    screens: [{ id: defaultId, name: "Screen 1", elements: [] }],
    activeScreenId: defaultId,
  };
}

function saveToStorage(project: WirepadProject) {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(project));
  }
}

function updateActiveScreenElements(
  project: WirepadProject,
  updater: (elements: CanvasElement[]) => CanvasElement[]
): WirepadProject {
  return {
    ...project,
    screens: project.screens.map((s) =>
      s.id === project.activeScreenId
        ? { ...s, elements: updater(s.elements) }
        : s
    ),
  };
}

export const useWirepadStore = create<WirepadState>((set, get) => ({
  project: createDefaultProject(),
  selectedElementId: null,
  grid: {
    visible: false,
    size: 8,
    snap: true,
  },

  // Screen actions
  addScreen: (name) => {
    const { project } = get();
    const screenNum = project.screens.length + 1;
    const newScreen: Screen = {
      id: createScreenId(),
      name: name || `Screen ${screenNum}`,
      elements: [],
    };
    const newProject = {
      ...project,
      screens: [...project.screens, newScreen],
      activeScreenId: newScreen.id,
    };
    set({ project: newProject });
    saveToStorage(newProject);
  },

  removeScreen: (id) => {
    const { project } = get();
    if (project.screens.length <= 1) return;
    const remaining = project.screens.filter((s) => s.id !== id);
    const newActiveId =
      project.activeScreenId === id
        ? remaining[0].id
        : project.activeScreenId;
    const newProject = {
      ...project,
      screens: remaining,
      activeScreenId: newActiveId,
    };
    set({ project: newProject });
    saveToStorage(newProject);
  },

  renameScreen: (id, name) => {
    const { project } = get();
    const newProject = {
      ...project,
      screens: project.screens.map((s) =>
        s.id === id ? { ...s, name } : s
      ),
    };
    set({ project: newProject });
    saveToStorage(newProject);
  },

  setActiveScreen: (id) => {
    const { project } = get();
    const newProject = { ...project, activeScreenId: id };
    set({ project: newProject });
    saveToStorage(newProject);
  },

  // Element actions
  addElement: (element) => {
    const { project } = get();
    const newProject = updateActiveScreenElements(project, (els) => [
      ...els,
      element,
    ]);
    set({ project: newProject });
    saveToStorage(newProject);
  },

  updateElement: (id, updates) => {
    const { project } = get();
    const newProject = updateActiveScreenElements(project, (els) =>
      els.map((el) => (el.id === id ? { ...el, ...updates } : el))
    );
    set({ project: newProject });
    saveToStorage(newProject);
  },

  removeElement: (id) => {
    const { project, selectedElementId } = get();
    const newProject = updateActiveScreenElements(project, (els) =>
      els.filter((el) => el.id !== id)
    );
    set({
      project: newProject,
      selectedElementId: selectedElementId === id ? null : selectedElementId,
    });
    saveToStorage(newProject);
  },

  duplicateElement: (id) => {
    const { project } = get();
    const screen = project.screens.find(
      (s) => s.id === project.activeScreenId,
    );
    const original = screen?.elements.find((el) => el.id === id);
    if (!original) return;
    const newEl: CanvasElement = {
      ...original,
      id: `el-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      x: original.x + 20,
      y: original.y + 20,
      properties: { ...original.properties },
    };
    const newProject = updateActiveScreenElements(project, (els) => [
      ...els,
      newEl,
    ]);
    set({ project: newProject, selectedElementId: newEl.id });
    saveToStorage(newProject);
  },

  selectElement: (id) => set({ selectedElementId: id }),

  clearCanvas: () => {
    const { project } = get();
    const newProject = updateActiveScreenElements(project, () => []);
    set({ project: newProject, selectedElementId: null });
    saveToStorage(newProject);
  },

  // Grid actions
  setGridVisible: (visible) =>
    set((state) => ({ grid: { ...state.grid, visible } })),
  setGridSize: (size) =>
    set((state) => ({ grid: { ...state.grid, size } })),
  setGridSnap: (snap) =>
    set((state) => ({ grid: { ...state.grid, snap } })),

  // Persistence
  loadFromStorage: () => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const data = JSON.parse(stored);
          if (data.screens && data.activeScreenId) {
            set({ project: data });
          } else if (data.elements) {
            // Migrate old single-screen format
            const id = createScreenId();
            const migrated: WirepadProject = {
              screens: [
                { id, name: "Screen 1", elements: data.elements },
              ],
              activeScreenId: id,
            };
            set({ project: migrated });
            saveToStorage(migrated);
          }
        }
      } catch {
        // Ignore parse errors
      }
    }
  },

  // Derived
  getActiveScreen: () => {
    const { project } = get();
    return (
      project.screens.find((s) => s.id === project.activeScreenId) ||
      project.screens[0]
    );
  },
}));
