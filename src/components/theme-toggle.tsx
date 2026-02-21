"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface ThemeToggleProps {
  /** inline = อยู่ในแถวกับ header, fixed = ลอยมุมขวาบน */
  variant?: "inline" | "fixed";
}

export function ThemeToggle({ variant = "fixed" }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isInline = variant === "inline";

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      className={cn(
        isInline ? "min-h-touch min-w-[44px]" : "fixed z-20 min-h-touch min-w-[44px]",
        "text-muted-foreground hover:text-foreground"
      )}
      style={
        isInline
          ? undefined
          : {
              top: "max(1rem, env(safe-area-inset-top))",
              right: "max(1rem, env(safe-area-inset-right))",
            }
      }
    >
      {theme === "dark" ? (
        <Sun className="h-5 w-5" strokeWidth={1.5} />
      ) : (
        <Moon className="h-5 w-5" strokeWidth={1.5} />
      )}
    </Button>
  );
}
