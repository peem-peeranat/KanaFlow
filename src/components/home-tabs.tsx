"use client";

import { useState } from "react";
import { KanaTable } from "@/components/kana-table";
import { Dashboard } from "@/components/dashboard";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

type Tab = "memorize" | "practice";

export function HomeTabs() {
  const [tab, setTab] = useState<Tab>("practice");

  return (
    <div
      className="flex flex-col overflow-hidden"
      style={{ height: "100dvh", maxHeight: "100dvh" }}
    >
      {/* Tab bar - fixed at top */}
      <header
        className="fixed inset-x-0 top-0 z-10 border-b border-border/80 bg-background/95 backdrop-blur-sm"
        style={{
          paddingTop: "max(0.5rem, env(safe-area-inset-top))",
          paddingLeft: "env(safe-area-inset-left)",
          paddingRight: "env(safe-area-inset-right)",
        }}
      >
        <div className="mx-auto flex max-w-2xl items-center gap-3 px-3 pb-3 pt-1">
          <div className="flex min-w-0 flex-1 gap-1 rounded-lg bg-muted/50 p-1">
            <Button
              variant="ghost"
              className={cn(
                "flex-1 min-h-touch transition-all",
                tab === "memorize"
                  ? "border-2 border-primary bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
              onClick={() => setTab("memorize")}
            >
              ท่องจำ
            </Button>
            <Button
              variant="ghost"
              className={cn(
                "flex-1 min-h-touch transition-all",
                tab === "practice"
                  ? "border-2 border-primary bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
              onClick={() => setTab("practice")}
            >
              แบบฝึกหัด
            </Button>
          </div>
          <div className="shrink-0 pl-1">
            <ThemeToggle variant="inline" />
          </div>
        </div>
      </header>

      {/* Content - แท็บ memorize ใช้ flex เพื่อให้หัวข้อ+ปุ่ม fix และสกอร์ลได้แค่ตาราง */}
      <main
        className={cn(
          "flex min-h-0 flex-1 flex-col overflow-hidden",
          tab === "memorize" && "min-h-0"
        )}
        style={{
          paddingTop: "calc(4.5rem + env(safe-area-inset-top))",
          paddingBottom: tab === "memorize" ? 0 : "env(safe-area-inset-bottom)",
        }}
      >
        {tab === "memorize" ? (
          <div className="flex min-h-0 flex-1 flex-col">
            <KanaTable />
          </div>
        ) : (
          <Dashboard />
        )}
      </main>
    </div>
  );
}
