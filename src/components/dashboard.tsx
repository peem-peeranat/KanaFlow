"use client";

import { useKanaStore } from "@/stores/use-kana-store";
import { KANA_GROUPS } from "@/constants/kana-data";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { cn } from "@/lib/utils";
import type { PracticeMode } from "@/stores/use-kana-store";

const MODES: { value: PracticeMode; label: string }[] = [
  { value: "hiragana", label: "Hiragana" },
  { value: "katakana", label: "Katakana" },
  { value: "mixed", label: "Mixed" },
];

export function Dashboard() {
  const {
    mode,
    selectedRows,
    setMode,
    toggleRow,
    selectAllRows,
    clearRows,
    startSession,
  } = useKanaStore();

  const selectedCount = selectedRows.size;
  const totalRows = KANA_GROUPS.length;

  return (
    <div
      className="flex flex-col overflow-y-auto p-4 sm:p-6"
      style={{
        minHeight: "calc(100dvh - 8rem)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      <header className="mb-6 pt-2 text-center sm:mb-8 sm:pt-4">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          <span className="border-b-2 border-primary pb-1">KanaFlow</span>
        </h1>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          ฝึกจำตัวอักษรญี่ปุ่นอย่างเป็นระบบ
        </p>
      </header>

      <main className="mx-auto w-full max-w-2xl space-y-6">
        {/* Mode Selection */}
        <section
          aria-labelledby="mode-heading"
          className="rounded-xl border border-border bg-card p-4 shadow-sm sm:p-5"
        >
          <h2
            id="mode-heading"
            className="mb-3 text-sm font-medium text-foreground"
          >
            โหมดฝึก
          </h2>
          <div className="flex flex-nowrap gap-2" role="group">
            {MODES.map((m) => (
              <Button
                key={m.value}
                variant="outline"
                size="lg"
                onClick={() => setMode(m.value)}
                aria-pressed={mode === m.value}
                aria-label={`Select ${m.label} mode`}
                className={cn(
                  "flex-1 min-w-0 transition-smooth",
                  mode === m.value &&
                    "border-primary text-primary ring-2 ring-primary/30"
                )}
              >
                {m.label}
              </Button>
            ))}
          </div>
        </section>

        {/* Row Filter Grid */}
        <section
          aria-labelledby="rows-heading"
          className="rounded-xl border border-border bg-card p-4 shadow-sm sm:p-5"
        >
          <div className="mb-3 flex items-center justify-between">
            <h2
              id="rows-heading"
              className="text-sm font-medium text-foreground"
            >
              เลือกแถว ({selectedCount}/{totalRows})
            </h2>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={selectAllRows}
                aria-label="Select all rows"
                className="text-muted-foreground hover:text-foreground"
              >
                All
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearRows}
                aria-label="Clear selection"
                className="text-muted-foreground hover:text-foreground"
              >
                Clear
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-5 sm:gap-2.5">
            {KANA_GROUPS.map((row) => (
              <Toggle
                key={row}
                variant="outline"
                pressed={selectedRows.has(row)}
                onPressedChange={() => toggleRow(row)}
                aria-label={`Toggle ${row} row`}
                aria-pressed={selectedRows.has(row)}
                className={cn(
                  "min-h-touch transition-smooth",
                  selectedRows.has(row) && "border-2 border-primary text-primary"
                )}
              >
                {row}
              </Toggle>
            ))}
          </div>
        </section>

        {/* Start Session */}
        <div className="flex flex-col gap-3 pt-2">
          <Button
            variant="outline"
            size="lg"
            className="min-h-[52px] border-2 border-primary bg-card text-lg font-medium text-primary transition-smooth hover:bg-accent disabled:border-border disabled:opacity-50 disabled:text-muted-foreground"
            onClick={startSession}
            disabled={selectedCount === 0}
            aria-label="Start practice session"
          >
            เริ่มฝึก
          </Button>
          {selectedCount === 0 && (
            <p className="text-center text-sm text-muted-foreground">
              เลือกอย่างน้อย 1 แถวเพื่อเริ่มต้น
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
