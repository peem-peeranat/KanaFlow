"use client";

import { useEffect } from "react";
import { useKanaStore } from "@/stores/use-kana-store";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

export function ReviewScreen() {
  const {
    correctCount,
    totalAttempts,
    answerHistory,
    bestStreak,
    resetSession,
    updateBestStreak,
    updateTotalMastered,
    startSession,
  } = useKanaStore();

  const accuracy =
    totalAttempts > 0 ? Math.round((correctCount / totalAttempts) * 100) : 0;

  useEffect(() => {
    if (totalAttempts > 0 && accuracy === 100) {
      updateTotalMastered(1);
    }
    if (correctCount > bestStreak) {
      updateBestStreak(correctCount);
    }
  }, [accuracy, correctCount, totalAttempts, bestStreak, updateBestStreak, updateTotalMastered]);

  return (
    <div
      className="flex w-full flex-col overflow-hidden"
      style={{ height: "100dvh", maxHeight: "100dvh" }}
    >
      <ThemeToggle />
      {/* Header + Accuracy */}
      <div
        className="shrink-0 px-4 pb-4 text-center sm:px-6"
        style={{ paddingTop: "max(4rem, env(safe-area-inset-top))" }}
      >
        <div className="mx-auto max-w-md">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            <span className="border-b-2 border-primary pb-1">เสร็จสิ้น</span>
          </h1>
          <p className="mt-2 text-muted-foreground">
            ผลการฝึกของคุณ
          </p>
          <div
            className="mt-4 rounded-2xl border-2 border-primary bg-card p-6 sm:p-8"
            role="status"
            aria-live="polite"
          >
            <p className="text-5xl font-semibold sm:text-6xl">{accuracy}%</p>
            <p className="mt-2 text-sm text-muted-foreground">ความถูกต้อง</p>
            <p className="mt-2 text-sm">
              {correctCount} / {totalAttempts} ถูกต้อง
            </p>
          </div>
        </div>
      </div>

      {/* ส่วนเฉลย - สกอร์ลได้อย่างเดียว */}
      {answerHistory.length > 0 ? (
        <section
          aria-labelledby="breakdown-heading"
          className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-4"
        >
          <h2 id="breakdown-heading" className="mb-3 text-center text-sm font-medium text-foreground">
            รวมเฉลยคำตอบ
          </h2>
          <div className="mx-auto flex max-w-md flex-col gap-2 pb-4">
            {answerHistory.map((record, index) => (
                <div
                  key={`${record.displayChar}-${index}`}
                  className={cn(
                    "flex min-w-0 flex-col gap-2 rounded-xl border px-4 py-3 transition-smooth",
                    record.correct
                      ? "border-green-500/40 bg-green-500/10"
                      : "border-red-500/40 bg-red-500/10"
                  )}
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-2xl" aria-hidden="true">{record.displayChar}</span>
                    <span className="text-muted-foreground">({record.displayRomaji})</span>
                    <span
                      className={cn(
                        "shrink-0 text-xs font-medium",
                        record.correct ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                      )}
                    >
                      {record.correct ? "✓ ถูก" : "✗ ผิด"}
                    </span>
                  </div>
                  <div className="flex flex-col gap-0.5 text-sm">
                    <span className="text-muted-foreground">
                      คำตอบที่ถูก: <strong className="text-foreground">{record.correctAnswer}</strong>
                    </span>
                    {!record.correct && (
                      <span className="text-red-600 dark:text-red-400">
                        คำตอบที่เลือก: {record.userAnswer || "(ว่าง)"}
                      </span>
                    )}
                  </div>
                </div>
            ))}
          </div>
        </section>
      ) : (
        <div className="min-h-0 flex-1" />
      )}

      {/* ปุ่ม New Session + Back to Dashboard - fix ด้านล่าง */}
      <div
        className="shrink-0 px-4 pt-4 sm:px-6"
        style={{ paddingBottom: "max(1.5rem, env(safe-area-inset-bottom))" }}
      >
        <div className="mx-auto flex max-w-md flex-col gap-3">
          <Button
            size="lg"
            variant="outline"
            className="min-h-touch w-full border-2 border-primary bg-card font-medium text-primary"
            onClick={() => {
              resetSession();
              startSession();
            }}
            aria-label="Start new session"
          >
            ฝึกต่อ
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="min-h-touch w-full"
            onClick={resetSession}
            aria-label="Return to dashboard"
          >
            กลับไปหน้าแรก
          </Button>
        </div>
      </div>
    </div>
  );
}
