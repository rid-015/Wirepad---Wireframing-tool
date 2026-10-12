# Wirepad

A fast, minimal wireframing tool for the browser. Drag ready-made components onto desktop, tablet or mobile pages, then export images or share a link. There are no accounts or servers: your work is saved in your browser.

**Live:** [wirepad.ridv.art](https://wirepad.ridv.art)

![Wirepad editor](docs/screenshot.png)

## Features

- **60+ ready-made components:** shapes and text, buttons and form fields, navbars, sidebars and tabs, cards and lists, tables and charts, image/video/avatar/map placeholders, mobile UI (status bar, app bar, tab bar, keyboard), modals and alerts, and icons.
- **Artboards:** Desktop (1440×1024), Tablet (834×1194) and Mobile (390×844).
- **Fast editing:**
  - drag from the library or click to add;
  - move and resize from large edge and corner handles, with alignment guides that snap to the page and to other elements;
  - <kbd>⇧</kbd> keeps proportions while resizing;
  - <kbd>⌘/Ctrl</kbd>+<kbd>D</kbd> duplicates (and repeats the last offset), <kbd>⌥/Alt</kbd>-drag duplicates while dragging;
  - copy, cut, paste, arrow-key nudge, and undo/redo.
- **Grid:** 8 / 16 / 32 px, toggled from the top bar or cycled with <kbd>G</kbd>.
- **Pages and templates:** multiple pages per project. Start from Blank, Landing page, Dashboard, Settings, Login or Mobile feed.
- **Export:** PNG, PNG @2x, JPG, or every page at once. Projects can be saved and loaded as `.json` files.
- **Share links:** a view-only link carries the whole project, compressed into the URL. Nothing is uploaded. Viewers can flip through pages, export images, or make an editable copy.
- **Autosave:** everything is saved to your browser's local storage as you work.

## Keyboard shortcuts

| Action | Shortcut |
| --- | --- |
| Undo / Redo | <kbd>⌘</kbd> <kbd>Z</kbd> / <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>Z</kbd> |
| Duplicate | <kbd>⌘</kbd> <kbd>D</kbd> |
| Duplicate while dragging | <kbd>⌥</kbd> drag |
| Copy / Cut / Paste | <kbd>⌘</kbd> <kbd>C</kbd> / <kbd>⌘</kbd> <kbd>X</kbd> / <kbd>⌘</kbd> <kbd>V</kbd> |
| Delete | <kbd>⌫</kbd> |
| Nudge (×10 with Shift) | Arrow keys |
| Bring forward / Send backward | <kbd>]</kbd> / <kbd>[</kbd> |
| Cycle grid 8 / 16 / 32 / off | <kbd>G</kbd> |
| New blank page | <kbd>P</kbd> |
| Templates | <kbd>T</kbd> |
| Zoom in / out / fit | <kbd>⌘</kbd> <kbd>+</kbd> / <kbd>⌘</kbd> <kbd>−</kbd> / <kbd>⌘</kbd> <kbd>0</kbd> |
| Export PNG | <kbd>⌘</kbd> <kbd>E</kbd> |
| Deselect / close | <kbd>Esc</kbd> |
| All shortcuts | <kbd>?</kbd> |

On Windows and Linux, use <kbd>Ctrl</kbd> for <kbd>⌘</kbd> and <kbd>Alt</kbd> for <kbd>⌥</kbd>.

## Getting started

Requires Node.js 20.9+ and [pnpm](https://pnpm.io).

```bash
pnpm install
pnpm dev
```

Then open [http://localhost:3000](http://localhost:3000). For a production build, run `pnpm build && pnpm start`.

## Project structure

```
app/                         Next.js app shell, fonts (Geist) and global styles
components/wirepad/
  editor.tsx                 Layout, keyboard shortcuts, global pointer handling
  toolbar.tsx                Top bar: undo, zoom, artboard, grid, export, share
  sidebar.tsx                Component library with search
  canvas.tsx                 Artboard, selection handles, guides, grid overlay
  canvas-element.tsx         Renders each wireframe component
  screen-manager.tsx         Pages list and properties inspector
  modals.tsx                 Templates, share link and shortcuts dialogs
lib/
  component-registry.ts      Component library, templates, project types
  store.ts                   Zustand store: project state, undo/redo, autosave
  interactions.ts            Move, resize, smart guides, library drag-and-drop
  export.ts                  PNG/JPG/JSON export (html-to-image)
  share.ts                   Encode/decode projects in share links
```

**Built with** Next.js, React, TypeScript, Tailwind CSS, Zustand, html-to-image and Lucide icons.
