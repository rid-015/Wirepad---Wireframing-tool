"use client";

import { Monitor } from "lucide-react";
import { Editor } from "@/components/wirepad/editor";

export default function Page() {
  return (
    <>
      <div className="flex lg:hidden h-screen w-screen flex-col items-center justify-center gap-4 bg-background px-8 text-center">
        <Monitor className="h-10 w-10 text-muted-foreground/50" />
        <h1 className="text-lg font-medium text-foreground">
          Wirepad is a desktop tool
        </h1>
        <p className="max-w-xs text-sm text-muted-foreground">
          Please open Wirepad on a laptop or desktop for the full experience.
        </p>
      </div>
      <div className="hidden lg:contents">
        <Editor />
      </div>
    </>
  );
}
