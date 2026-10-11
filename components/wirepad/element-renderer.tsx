"use client";

import type React from "react";
import { useRef } from "react";
import type { CanvasElement } from "@/lib/store";
import {
  Bell,
  Check,
  ChevronDown,
  ChevronLeft,
  Home,
  ImageIcon,
  Info,
  Plus,
  Search,
  Star,
  User,
  Wifi,
  BatteryFull,
  Signal,
  X,
} from "lucide-react";

// Shared wireframe tokens so every component reads as one system.
const STROKE = "border-muted-foreground/45";
const STROKE_SOFT = "border-muted-foreground/25";
const FILL = "bg-muted-foreground/[0.07]";
const INK = "bg-muted-foreground/40";
const INK_SOFT = "bg-muted-foreground/20";
const TEXT = "text-muted-foreground";
const TEXT_SOFT = "text-muted-foreground/60";
const SOLID = "bg-muted-foreground/75 text-background";

export function getDefaultText(type: string): string {
  switch (type) {
    case "heading":
    case "text":
      return "Heading";
    case "paragraph":
      return "Paragraph text goes here. Double-click to edit.";
    case "button":
      return "Button";
    default:
      return "";
  }
}

function EditableText({
  value,
  onCommit,
  multiline,
  className,
}: {
  value: string;
  onCommit: (text: string) => void;
  multiline?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const handleBlur = () => {
    const text = ref.current?.innerText?.trim() || value;
    onCommit(text);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !multiline) {
      e.preventDefault();
      ref.current?.blur();
    }
    // Stop the event from reaching DnD listeners
    e.stopPropagation();
  };

  return (
    <div
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      onPointerDown={(e) => e.stopPropagation()}
      className={`outline-none cursor-text ${className ?? ""}`}
    >
      {value}
    </div>
  );
}

/** Placeholder text line. */
function Bar({ className = "", soft }: { className?: string; soft?: boolean }) {
  return (
    <div
      className={`h-2 shrink-0 rounded-full ${soft ? INK_SOFT : INK} ${className}`}
    />
  );
}

function Field({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`flex h-full w-full items-center gap-2 rounded-lg border ${STROKE} ${FILL} px-3 text-xs ${TEXT_SOFT} ${className}`}
    >
      {children}
    </div>
  );
}

function Frame({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`flex h-full w-full flex-col overflow-hidden rounded-xl border ${STROKE} ${FILL} ${className}`}
    >
      {children}
    </div>
  );
}

function MiniButton({ solid, className = "" }: { solid?: boolean; className?: string }) {
  return (
    <div
      className={`h-8 rounded-lg ${solid ? "bg-muted-foreground/60" : `border ${STROKE}`} ${className}`}
    />
  );
}

function MiniField({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <Bar soft className="w-14" />
      <div className={`h-9 w-full rounded-lg border ${STROKE}`} />
    </div>
  );
}

export function ElementRenderer({
  element,
  isEditing,
  onCommitText,
}: {
  element: CanvasElement;
  isEditing?: boolean;
  onCommitText?: (text: string) => void;
}) {
  const displayText = element.properties.text || getDefaultText(element.type);
  const editable = isEditing && onCommitText;

  switch (element.type) {
    // --- Layout ---
    case "container":
      return (
        <div
          className={`h-full w-full rounded-xl border border-dashed ${STROKE} bg-muted-foreground/[0.03]`}
        />
      );
    case "section":
      return (
        <div className={`flex h-full w-full flex-col gap-2 rounded-lg border ${STROKE_SOFT} p-3`}>
          <Bar className="w-20" />
          <Bar soft className="w-full" />
        </div>
      );
    case "card":
      return (
        <Frame>
          <div className="flex h-1/2 min-h-0 items-center justify-center border-b border-muted-foreground/25 bg-muted-foreground/10">
            <ImageIcon className={`h-5 w-5 ${TEXT_SOFT}`} />
          </div>
          <div className="flex flex-1 flex-col justify-center gap-1.5 px-3">
            <Bar className="w-2/3" />
            <Bar soft className="w-full" />
          </div>
        </Frame>
      );
    case "divider":
      return (
        <div className="flex h-full w-full items-center">
          <div className="h-px w-full bg-muted-foreground/35" />
        </div>
      );
    case "list-item":
      return (
        <div className={`flex h-full w-full items-center gap-3 border-b ${STROKE_SOFT} px-3`}>
          <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${INK_SOFT}`}>
            <User className={`h-4 w-4 ${TEXT_SOFT}`} />
          </div>
          <div className="flex flex-1 flex-col gap-1.5">
            <Bar className="w-1/2" />
            <Bar soft className="w-3/4" />
          </div>
          <ChevronDown className={`h-4 w-4 -rotate-90 ${TEXT_SOFT}`} />
        </div>
      );

    // --- Inputs ---
    case "button":
      return (
        <div
          className={`flex h-full w-full items-center justify-center rounded-lg px-3 text-xs font-medium ${SOLID}`}
        >
          {editable ? (
            <EditableText value={displayText} onCommit={onCommitText} className="text-center" />
          ) : (
            displayText
          )}
        </div>
      );
    case "fab":
      return (
        <div className={`flex h-full w-full items-center justify-center rounded-2xl ${SOLID}`}>
          <Plus className="h-6 w-6" />
        </div>
      );
    case "text-input":
    case "input":
      return (
        <Field>
          <span className="truncate">Placeholder</span>
        </Field>
      );
    case "search-bar":
      return (
        <Field className="rounded-full">
          <Search className="h-4 w-4 shrink-0" />
          <span className="truncate">Search</span>
        </Field>
      );
    case "textarea":
      return (
        <Field className="items-start py-2.5">
          <span>Write something…</span>
        </Field>
      );
    case "checkbox":
      return (
        <div className={`flex h-full w-full items-center gap-2 text-xs ${TEXT}`}>
          <div className={`flex h-4 w-4 shrink-0 items-center justify-center rounded ${SOLID}`}>
            <Check className="h-3 w-3" strokeWidth={3} />
          </div>
          <span className="truncate">Checkbox</span>
        </div>
      );
    case "radio":
      return (
        <div className={`flex h-full w-full items-center gap-2 text-xs ${TEXT}`}>
          <div
            className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 border-muted-foreground/60`}
          >
            <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/80" />
          </div>
          <span className="truncate">Option</span>
        </div>
      );
    case "toggle":
      return (
        <div className="flex h-full w-full items-center">
          <div className="relative h-6 w-11 rounded-full bg-muted-foreground/60">
            <div className="absolute right-0.5 top-0.5 h-5 w-5 rounded-full bg-background" />
          </div>
        </div>
      );
    case "dropdown":
      return (
        <Field className="justify-between">
          <span className="truncate">Select option</span>
          <ChevronDown className="h-4 w-4 shrink-0" />
        </Field>
      );
    case "slider":
      return (
        <div className="flex h-full w-full items-center px-2">
          <div className="relative h-1 w-full rounded-full bg-muted-foreground/25">
            <div className="absolute left-0 top-0 h-1 w-2/5 rounded-full bg-muted-foreground/70" />
            <div className="absolute left-[40%] top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-muted-foreground/70 bg-background" />
          </div>
        </div>
      );

    // --- Navigation ---
    case "status-bar":
      return (
        <div className={`flex h-full w-full items-center justify-between px-5 text-[11px] font-semibold ${TEXT}`}>
          <span>9:41</span>
          <div className="flex items-center gap-1">
            <Signal className="h-3 w-3" />
            <Wifi className="h-3 w-3" />
            <BatteryFull className="h-3.5 w-3.5" />
          </div>
        </div>
      );
    case "navbar":
      return (
        <div className={`flex h-full w-full items-center justify-between border-b ${STROKE_SOFT} px-3 ${TEXT}`}>
          <ChevronLeft className="h-5 w-5" />
          <span className="text-xs font-semibold">Title</span>
          <Bell className="h-4 w-4" />
        </div>
      );
    case "sidebar-nav":
      return (
        <Frame className="gap-1 p-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className={`flex items-center gap-2 rounded-md px-2 py-2 ${i === 1 ? "bg-muted-foreground/15" : ""}`}
            >
              <div className={`h-3 w-3 rounded ${INK}`} />
              <Bar soft={i !== 1} className="flex-1" />
            </div>
          ))}
        </Frame>
      );
    case "tabs":
      return (
        <div className={`flex h-full w-full items-stretch border-b ${STROKE_SOFT}`}>
          {["Tab 1", "Tab 2", "Tab 3"].map((t, i) => (
            <div
              key={t}
              className={`flex flex-1 items-center justify-center text-[11px] ${
                i === 0
                  ? `-mb-px border-b-2 border-muted-foreground/80 font-medium ${TEXT}`
                  : TEXT_SOFT
              }`}
            >
              {t}
            </div>
          ))}
        </div>
      );
    case "breadcrumb":
      return (
        <div className={`flex h-full w-full items-center gap-1.5 text-[11px] ${TEXT_SOFT}`}>
          <span>Home</span>
          <span>/</span>
          <span>Page</span>
          <span>/</span>
          <span className={`font-medium ${TEXT}`}>Current</span>
        </div>
      );
    case "pagination":
      return (
        <div className="flex h-full w-full items-center justify-center gap-1">
          {["‹", "1", "2", "3", "›"].map((p) => (
            <div
              key={p}
              className={`flex h-7 w-7 items-center justify-center rounded-md text-[11px] ${
                p === "2" ? SOLID : `border ${STROKE_SOFT} ${TEXT_SOFT}`
              }`}
            >
              {p}
            </div>
          ))}
        </div>
      );
    case "bottom-nav":
      return (
        <div className={`flex h-full w-full items-center justify-around border-t ${STROKE_SOFT} px-2`}>
          {[Home, Search, Bell, User].map((Icon, i) => (
            <div
              key={i}
              className={`flex flex-col items-center gap-1 ${i === 0 ? TEXT : TEXT_SOFT}`}
            >
              <Icon className="h-5 w-5" />
              <div className={`h-1 w-1 rounded-full ${i === 0 ? "bg-muted-foreground" : "bg-transparent"}`} />
            </div>
          ))}
        </div>
      );

    // --- Content ---
    case "heading":
    case "text":
      return editable ? (
        <EditableText
          value={displayText}
          onCommit={onCommitText}
          className="flex h-full w-full items-start text-lg font-semibold text-foreground/80"
        />
      ) : (
        <div className="flex h-full w-full items-start text-lg font-semibold leading-tight text-foreground/80">
          {displayText}
        </div>
      );
    case "paragraph":
      return editable ? (
        <EditableText
          value={displayText}
          onCommit={onCommitText}
          multiline
          className={`h-full w-full text-xs leading-relaxed ${TEXT}`}
        />
      ) : (
        <div className={`h-full w-full overflow-hidden text-xs leading-relaxed ${TEXT}`}>
          {displayText}
        </div>
      );
    case "image":
      // Classic wireframe placeholder: box with a cross.
      return (
        <div className={`relative h-full w-full overflow-hidden rounded-lg border ${STROKE} ${FILL}`}>
          <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" aria-hidden="true">
            <line x1="0" y1="0" x2="100%" y2="100%" stroke="currentColor" strokeWidth="1" className="text-muted-foreground/25" />
            <line x1="100%" y1="0" x2="0" y2="100%" stroke="currentColor" strokeWidth="1" className="text-muted-foreground/25" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="rounded-md bg-canvas p-1.5">
              <ImageIcon className={`h-5 w-5 ${TEXT_SOFT}`} />
            </div>
          </div>
        </div>
      );
    case "avatar":
      return (
        <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-muted-foreground/25">
          <User className="h-3/5 w-3/5 text-muted-foreground/70" />
        </div>
      );
    case "icon":
      return (
        <div className="flex h-full w-full items-center justify-center">
          <Star className="h-full w-full text-muted-foreground/70" />
        </div>
      );
    case "chip":
      return (
        <div
          className={`flex h-full w-full items-center justify-center gap-1 rounded-full border ${STROKE} px-3 text-[11px] ${TEXT}`}
        >
          <span className="truncate">Label</span>
          <X className="h-3 w-3 shrink-0" />
        </div>
      );

    // --- Feedback ---
    case "toast":
      return (
        <div className={`flex h-full w-full items-center gap-3 rounded-xl ${SOLID} px-3`}>
          <Check className="h-4 w-4 shrink-0" />
          <span className="flex-1 truncate text-xs">Changes saved</span>
          <span className="text-xs font-semibold">Undo</span>
        </div>
      );
    case "alert":
      return (
        <div className={`flex h-full w-full items-start gap-2.5 rounded-lg border ${STROKE} ${FILL} p-3`}>
          <Info className={`h-4 w-4 shrink-0 ${TEXT}`} />
          <div className="flex flex-1 flex-col gap-1.5 pt-0.5">
            <Bar className="w-1/3" />
            <Bar soft className="w-full" />
          </div>
        </div>
      );
    case "progress":
      return (
        <div className="flex h-full w-full items-center">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted-foreground/20">
            <div className="h-full w-3/5 rounded-full bg-muted-foreground/70" />
          </div>
        </div>
      );
    case "skeleton":
      return (
        <div className="flex h-full w-full items-center gap-3 p-2">
          <div className="h-10 w-10 shrink-0 animate-pulse rounded-full bg-muted-foreground/15" />
          <div className="flex flex-1 flex-col gap-2">
            <div className="h-2.5 w-2/3 animate-pulse rounded-full bg-muted-foreground/15" />
            <div className="h-2 w-full animate-pulse rounded-full bg-muted-foreground/10" />
          </div>
        </div>
      );

    // --- Data Display ---
    case "table":
      return (
        <Frame>
          <div className={`flex gap-3 border-b ${STROKE_SOFT} bg-muted-foreground/10 px-3 py-2`}>
            <Bar className="w-1/4" />
            <Bar className="w-1/3" />
            <Bar className="w-1/5" />
          </div>
          {[1, 2, 3, 4].map((r) => (
            <div
              key={r}
              className={`flex gap-3 border-b ${STROKE_SOFT} px-3 py-2 last:border-0`}
            >
              <Bar soft className="w-1/4" />
              <Bar soft className="w-1/3" />
              <Bar soft className="w-1/5" />
            </div>
          ))}
        </Frame>
      );
    case "list":
      return (
        <Frame>
          {[1, 2, 3, 4].map((r) => (
            <div
              key={r}
              className={`flex flex-1 items-center gap-3 border-b ${STROKE_SOFT} px-3 last:border-0`}
            >
              <div className={`h-6 w-6 shrink-0 rounded-full ${INK_SOFT}`} />
              <Bar className="w-1/2" />
            </div>
          ))}
        </Frame>
      );
    case "chart":
      return (
        <Frame className="p-3">
          <Bar className="mb-3 w-1/3" />
          <div className={`flex flex-1 items-end gap-1.5 border-b border-l ${STROKE_SOFT} pl-1`}>
            {[40, 65, 35, 80, 55, 70, 45].map((h, i) => (
              <div
                key={i}
                className={`flex-1 rounded-t ${i === 3 ? "bg-muted-foreground/60" : "bg-muted-foreground/30"}`}
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </Frame>
      );

    // --- Prebuilt Screens ---
    case "block-login":
      return (
        <Frame className="justify-center gap-4 p-6">
          <div className="flex flex-col items-center gap-2 pb-2">
            <div className={`h-10 w-10 rounded-xl ${INK_SOFT}`} />
            <Bar className="h-3 w-24" />
          </div>
          <MiniField />
          <MiniField />
          <MiniButton solid className="mt-2" />
          <Bar soft className="mx-auto w-28" />
        </Frame>
      );
    case "block-signup":
      return (
        <Frame className="justify-center gap-4 p-6">
          <Bar className="mx-auto mb-2 h-3 w-28" />
          <MiniField />
          <MiniField />
          <MiniField />
          <MiniButton solid className="mt-2" />
          <Bar soft className="mx-auto w-32" />
        </Frame>
      );
    case "block-dashboard":
      return (
        <Frame className="gap-3 p-3">
          <div className="flex items-center justify-between">
            <Bar className="h-3 w-24" />
            <div className={`h-7 w-7 rounded-full ${INK_SOFT}`} />
          </div>
          <div className="flex gap-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`flex flex-1 flex-col gap-1.5 rounded-lg border ${STROKE_SOFT} p-2`}
              >
                <Bar soft className="w-8" />
                <Bar className="h-3 w-12" />
              </div>
            ))}
          </div>
          <div className={`flex flex-1 items-end gap-1.5 rounded-lg border ${STROKE_SOFT} p-3`}>
            {[50, 70, 40, 85, 60, 75].map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-t bg-muted-foreground/30"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
          {[1, 2, 3].map((i) => (
            <div key={i} className={`flex items-center gap-2 rounded-lg border ${STROKE_SOFT} p-2`}>
              <div className={`h-6 w-6 rounded-full ${INK_SOFT}`} />
              <Bar soft className="flex-1" />
            </div>
          ))}
        </Frame>
      );
    case "block-settings":
      return (
        <Frame className="gap-1 p-4">
          <Bar className="mb-3 h-3 w-20" />
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className={`flex items-center justify-between border-b ${STROKE_SOFT} py-3 last:border-0`}
            >
              <Bar className="w-24" />
              <div
                className={`relative h-5 w-9 rounded-full ${i % 2 ? "bg-muted-foreground/60" : "bg-muted-foreground/20"}`}
              >
                <div
                  className={`absolute top-0.5 h-4 w-4 rounded-full bg-background ${i % 2 ? "right-0.5" : "left-0.5"}`}
                />
              </div>
            </div>
          ))}
        </Frame>
      );
    case "block-profile":
      return (
        <Frame className="items-center gap-2 p-4">
          <div className="mt-2 flex h-16 w-16 items-center justify-center rounded-full bg-muted-foreground/25">
            <User className="h-8 w-8 text-muted-foreground/70" />
          </div>
          <Bar className="mt-1 h-3 w-24" />
          <Bar soft className="w-32" />
          <MiniButton solid className="my-2 w-28" />
          <div className="w-full">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`flex items-center justify-between border-b ${STROKE_SOFT} py-3 last:border-0`}
              >
                <Bar className="w-16" />
                <Bar soft className="w-24" />
              </div>
            ))}
          </div>
        </Frame>
      );
    case "block-empty-state":
      return (
        <div
          className={`flex h-full w-full flex-col items-center justify-center gap-3 rounded-xl border border-dashed ${STROKE} p-4`}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted-foreground/15">
            <Search className={`h-5 w-5 ${TEXT_SOFT}`} />
          </div>
          <Bar className="h-2.5 w-28" />
          <Bar soft className="w-40" />
          <MiniButton solid className="mt-1 w-24" />
        </div>
      );
    case "block-modal":
      return (
        <div className={`flex h-full w-full flex-col rounded-2xl border ${STROKE} bg-card p-4 shadow-xl shadow-black/40`}>
          <div className="mb-3 flex items-center justify-between">
            <Bar className="h-3 w-24" />
            <X className={`h-4 w-4 ${TEXT_SOFT}`} />
          </div>
          <Bar soft className="mb-2 w-full" />
          <Bar soft className="w-3/4" />
          <div className="mt-auto flex justify-end gap-2">
            <MiniButton className="w-16" />
            <MiniButton solid className="w-16" />
          </div>
        </div>
      );
    case "block-confirmation":
      return (
        <div
          className={`flex h-full w-full flex-col items-center justify-center gap-3 rounded-2xl border ${STROKE} bg-card p-4 shadow-xl shadow-black/40`}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted-foreground/15">
            <Info className={`h-5 w-5 ${TEXT}`} />
          </div>
          <Bar className="h-2.5 w-28" />
          <Bar soft className="w-40" />
          <div className="mt-1 flex w-full gap-2">
            <MiniButton className="flex-1" />
            <MiniButton solid className="flex-1" />
          </div>
        </div>
      );

    // --- Shapes ---
    case "shape-rectangle":
      return <div className={`h-full w-full border ${STROKE} ${FILL}`} />;
    case "shape-circle":
      return <div className={`h-full w-full rounded-full border ${STROKE} ${FILL}`} />;
    case "shape-rounded-rect":
      return <div className={`h-full w-full rounded-xl border ${STROKE} ${FILL}`} />;
    case "shape-divider-line":
      return (
        <div className="flex h-full w-full items-center">
          <div className="h-px w-full bg-muted-foreground/50" />
        </div>
      );
    case "shape-arrow-line":
      return (
        <div className="flex h-full w-full items-center">
          <svg className="h-full w-full" viewBox="0 0 160 24" preserveAspectRatio="none" aria-hidden="true">
            <line x1="4" y1="12" x2="148" y2="12" stroke="currentColor" strokeWidth="1.5" className="text-muted-foreground/60" />
            <polyline points="142,6 152,12 142,18" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-muted-foreground/60" />
          </svg>
        </div>
      );

    default:
      return (
        <div
          className={`flex h-full w-full items-center justify-center rounded-md border border-dashed ${STROKE_SOFT} text-[10px] ${TEXT_SOFT}`}
        >
          {element.type}
        </div>
      );
  }
}
