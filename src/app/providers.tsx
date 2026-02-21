"use client";

import { useEffect } from "react";
import { ThemeProvider } from "next-themes";
import { ensureVoicesLoaded } from "@/lib/speech";

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window !== "undefined") {
      ensureVoicesLoaded();
    }
  }, []);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  );
}
