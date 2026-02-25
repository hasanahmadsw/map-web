"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { resolvedTheme = "light", setTheme } = useTheme();

  return (
    <div className="flex rounded-lg border p-0.5">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme("light")}
        className={cn(
          "h-8 w-8 rounded-md",
          resolvedTheme === "light" && "bg-accent text-foreground"
        )}
        aria-label="Light mode"
      >
        <Sun className="h-[1.1rem] w-[1.1rem]" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme("dark")}
        className={cn(
          "h-8 w-8 rounded-md",
          resolvedTheme === "dark" && "bg-accent text-foreground"
        )}
        aria-label="Dark mode"
      >
        <Moon className="h-[1.1rem] w-[1.1rem]" />
      </Button>
    </div>
  );
}
