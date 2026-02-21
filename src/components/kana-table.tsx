"use client";

import { useState } from "react";
import { HIRAGANA_DATA, KATAKANA_DATA, KANA_GROUPS } from "@/constants/kana-data";
import { speak } from "@/lib/speech";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Kana } from "@/constants/kana-data";

function getKanaByGroup(data: Kana[]) {
  const byGroup: Record<string, Kana[]> = {};
  for (const k of data) {
    if (!byGroup[k.group]) byGroup[k.group] = [];
    byGroup[k.group].push(k);
  }
  return byGroup;
}

function KanaGrid({
  data,
  onPlay,
}: {
  data: Kana[];
  onPlay: (kanaChar: string) => void;
}) {
  return (
    <div className="grid grid-cols-5 gap-2 sm:grid-cols-5 sm:gap-3">
      {data.map((k) => (
        <button
          key={k.id}
          type="button"
          onClick={() => onPlay(k.char)}
          className="flex min-h-[48px] min-w-[48px] flex-col items-center justify-center rounded-lg border border-border bg-background px-2 py-3 transition-all hover:border-primary/30 hover:bg-accent/50 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring touch-manipulation"
          aria-label={`${k.char} ${k.romaji} เล่นเสียง`}
        >
          <span className="text-2xl sm:text-3xl">{k.char}</span>
          <span className="mt-1 text-xs text-muted-foreground">{k.romaji}</span>
        </button>
      ))}
    </div>
  );
}

export function KanaTable() {
  const [activeTab, setActiveTab] = useState<"hiragana" | "katakana">("hiragana");

  const data = activeTab === "hiragana" ? HIRAGANA_DATA : KATAKANA_DATA;
  const byGroup = getKanaByGroup(data);

  return (
    <div
      className="h-full overflow-y-auto overflow-x-hidden"
      style={{ paddingBottom: "max(2rem, env(safe-area-inset-bottom))" }}
    >
      <div className="px-4 sm:px-6">
        {/* หัวข้อ + ปุ่ม - sticky */}
        <div className="sticky top-0 z-10 -mx-4 bg-background/95 px-4 pb-4 pt-4 backdrop-blur-sm sm:-mx-6 sm:px-6 sm:pt-5">
          <header className="text-center">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              <span className="border-b-2 border-primary pb-1">ตารางตัวอักษร</span>
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              กดที่ตัวอักษรเพื่อฟังเสียง
            </p>
          </header>
          <div className="mx-auto mt-4 flex max-w-2xl gap-2 rounded-lg bg-muted/50 p-1">
            <Button
              variant="ghost"
              className={cn(
                "flex-1 transition-all",
                activeTab === "hiragana" ? "bg-background shadow-sm" : "text-muted-foreground"
              )}
              onClick={() => setActiveTab("hiragana")}
            >
              Hiragana
            </Button>
            <Button
              variant="ghost"
              className={cn(
                "flex-1 transition-all",
                activeTab === "katakana" ? "bg-background shadow-sm" : "text-muted-foreground"
              )}
              onClick={() => setActiveTab("katakana")}
            >
              Katakana
            </Button>
          </div>
        </div>

        {/* ตารางตัวอักษร */}
        <div className="mx-auto max-w-2xl space-y-6 pt-2">
          {KANA_GROUPS.map((group) => {
            const kanaList = byGroup[group];
            if (!kanaList?.length) return null;
            return (
              <section
                key={group}
                className="rounded-xl border border-border bg-card p-4 shadow-sm"
              >
                <h2 className="mb-3 text-sm font-medium text-foreground">
                  {group}
                </h2>
                <KanaGrid data={kanaList} onPlay={(char) => speak(char)} />
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
