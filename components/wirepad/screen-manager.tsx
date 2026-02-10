"use client";

import { useState, useRef, useEffect } from "react";
import { Plus, Trash2, Smartphone } from "lucide-react";
import { useWirepadStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

function ScreenItem({
  screen,
  isActive,
}: {
  screen: { id: string; name: string; elements: { id: string }[] };
  isActive: boolean;
}) {
  const { setActiveScreen, renameScreen, removeScreen, project } =
    useWirepadStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(screen.name);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const commitRename = () => {
    const trimmed = editValue.trim();
    if (trimmed && trimmed !== screen.name) {
      renameScreen(screen.id, trimmed);
    } else {
      setEditValue(screen.name);
    }
    setIsEditing(false);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => setActiveScreen(screen.id)}
      onKeyDown={(e) => {
        if (e.key === "Enter") setActiveScreen(screen.id);
      }}
      className={`group flex items-center gap-2 rounded-md px-2.5 py-2 text-xs transition-colors cursor-pointer ${
        isActive
          ? "bg-accent text-foreground"
          : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
      }`}
    >
      <Smartphone className="h-3.5 w-3.5 shrink-0" />

      {isEditing ? (
        <input
          ref={inputRef}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={commitRename}
          onKeyDown={(e) => {
            if (e.key === "Enter") commitRename();
            if (e.key === "Escape") {
              setEditValue(screen.name);
              setIsEditing(false);
            }
          }}
          className="min-w-0 flex-1 bg-transparent text-xs outline-none"
          onClick={(e) => e.stopPropagation()}
        />
      ) : (
        <span
          className="min-w-0 flex-1 truncate"
          onDoubleClick={(e) => {
            e.stopPropagation();
            setIsEditing(true);
          }}
        >
          {screen.name}
        </span>
      )}

      <span className="shrink-0 text-[10px] text-muted-foreground/50">
        {screen.elements.length}
      </span>

      {project.screens.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            removeScreen(screen.id);
          }}
          className="shrink-0 opacity-0 transition-opacity group-hover:opacity-100 text-muted-foreground hover:text-destructive"
          aria-label={`Delete ${screen.name}`}
        >
          <Trash2 className="h-3 w-3" />
        </button>
      )}
    </div>
  );
}

export function ScreenManager() {
  const { project, addScreen } = useWirepadStore();

  return (
    <TooltipProvider delayDuration={200}>
      <aside className="flex h-full w-52 flex-col border-l border-border bg-sidebar">
        <div className="flex items-center justify-between px-4 py-3">
          <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
            Screens
          </p>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-muted-foreground hover:text-foreground"
                onClick={() => addScreen()}
              >
                <Plus className="h-3.5 w-3.5" />
                <span className="sr-only">Add screen</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Add new screen</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <div className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-2 pb-2">
          {project.screens.map((screen) => (
            <ScreenItem
              key={screen.id}
              screen={screen}
              isActive={screen.id === project.activeScreenId}
            />
          ))}
        </div>
      </aside>
    </TooltipProvider>
  );
}
