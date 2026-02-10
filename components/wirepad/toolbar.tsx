"use client";

import { Grid3X3, Trash2 } from "lucide-react";
import { useWirepadStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function Toolbar() {
  const { grid, setGridVisible, setGridSize, clearCanvas } = useWirepadStore();

  return (
    <TooltipProvider delayDuration={200}>
      <header className="flex h-12 items-center justify-between border-b border-border bg-toolbar px-4">
        <div className="flex items-center gap-3">
          <h1 className="text-sm font-semibold tracking-tight text-foreground">
            Wirepad
          </h1>
          <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
            MVP
          </span>
        </div>

        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={grid.visible ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setGridVisible(!grid.visible)}
                className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
              >
                <Grid3X3 className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Grid</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Toggle grid overlay</p>
            </TooltipContent>
          </Tooltip>

          {grid.visible && (
            <Select
              value={String(grid.size)}
              onValueChange={(val) =>
                setGridSize(Number(val) as 8 | 12 | 16)
              }
            >
              <SelectTrigger className="h-8 w-[72px] text-xs text-muted-foreground border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="8">8px</SelectItem>
                <SelectItem value="12">12px</SelectItem>
                <SelectItem value="16">16px</SelectItem>
              </SelectContent>
            </Select>
          )}

          <div className="mx-1 h-4 w-px bg-border" />

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearCanvas}
                className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Clear</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Clear all elements</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </header>
    </TooltipProvider>
  );
}
