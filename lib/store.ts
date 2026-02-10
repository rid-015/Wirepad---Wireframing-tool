import { create } from "zustand";

export type ElementType = "button" | "text" | "input" | "card" | "image";

export interface CanvasElement {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  properties: Record<string, string>;
}

interface GridSettings {
  visible: boolean;
  size: 8 | 12 | 16;
  snap: boolean;
}

interface WirepadState {
  elements: CanvasElement[];
  grid: GridSettings;
  addElement: (element: CanvasElement) => void;
  updateElement: (id: string, updates: Partial<CanvasElement>) => void;
  removeElement: (id: string) => void;
  clearCanvas: () => void;
  setGridVisible: (visible: boolean) => void;
  setGridSize: (size: 8 | 12 | 16) => void;
  setGridSnap: (snap: boolean) => void;
  loadFromStorage: () => void;
}

const STORAGE_KEY = "wirepad-project";

function saveToStorage(elements: CanvasElement[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ elements }));
  }
}

export const useWirepadStore = create<WirepadState>((set, get) => ({
  elements: [],
  grid: {
    visible: false,
    size: 8,
    snap: true,
  },

  addElement: (element) => {
    const newElements = [...get().elements, element];
    set({ elements: newElements });
    saveToStorage(newElements);
  },

  updateElement: (id, updates) => {
    const newElements = get().elements.map((el) =>
      el.id === id ? { ...el, ...updates } : el
    );
    set({ elements: newElements });
    saveToStorage(newElements);
  },

  removeElement: (id) => {
    const newElements = get().elements.filter((el) => el.id !== id);
    set({ elements: newElements });
    saveToStorage(newElements);
  },

  clearCanvas: () => {
    set({ elements: [] });
    saveToStorage([]);
  },

  setGridVisible: (visible) =>
    set((state) => ({ grid: { ...state.grid, visible } })),

  setGridSize: (size) =>
    set((state) => ({ grid: { ...state.grid, size } })),

  setGridSnap: (snap) =>
    set((state) => ({ grid: { ...state.grid, snap } })),

  loadFromStorage: () => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const data = JSON.parse(stored);
          set({ elements: data.elements || [] });
        }
      } catch {
        // Ignore parse errors
      }
    }
  },
}));
