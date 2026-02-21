"use client";

import { useCallback, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useKanaStore } from "@/stores/use-kana-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { speak } from "@/lib/speech";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";
import type { Kana } from "@/constants/kana-data";

function normalizeRomaji(input: string): string {
  return input.trim().toLowerCase().replace(/\s+/g, "");
}

function isCorrect(userInput: string, kana: Kana): boolean {
  const normalized = normalizeRomaji(userInput);
  const expected = normalizeRomaji(kana.romaji);
  return normalized === expected;
}

export function Flashcard() {
  const inputRef = useRef<HTMLInputElement>(null);
  const {
    deck,
    currentIndex,
    isFlipped,
    userInput,
    setFlipped,
    setUserInput,
    recordAnswer,
    nextCard,
    resetSession,
  } = useKanaStore();

  const deckItem = deck[currentIndex];
  const currentKana = deckItem?.kind === "kana" ? deckItem.data : null;
  const isValid = currentKana && userInput.length > 0 && isCorrect(userInput, currentKana);

  const handleSubmit = useCallback(() => {
    if (!currentKana) return;
    if (isValid) {
      recordAnswer(true, userInput);
      nextCard();
    } else if (userInput.trim()) {
      recordAnswer(false, userInput);
      nextCard(); // ไม่เฉลยทันที - เฉลยทั้งหมดตอนจบในหน้าสรุป
    }
  }, [currentKana, isValid, userInput, recordAnswer, nextCard]);

  const handleFlip = useCallback(() => {
    setFlipped(!isFlipped);
  }, [isFlipped, setFlipped]);

  const handlePlaySound = useCallback(() => {
    if (currentKana) speak(currentKana.char);
  }, [currentKana]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [currentIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleSubmit();
      } else if (e.key === " ") {
        e.preventDefault();
        handleFlip();
      } else if (e.key === "r" || e.key === "R") {
        if (!e.ctrlKey && !e.metaKey && document.activeElement?.tagName !== "INPUT") {
          e.preventDefault();
          handlePlaySound();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleSubmit, handleFlip, handlePlaySound]);

  if (!currentKana) return null;

  return (
    <div
      className="flex min-h-[100dvh] flex-col items-center justify-center p-4"
      style={{
        paddingTop: "max(4rem, env(safe-area-inset-top))",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      {/* Progress */}
      <div className="mb-6 flex w-full max-w-md items-center gap-2" aria-live="polite">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / deck.length) * 100}%` }}
          />
        </div>
        <span className="text-sm font-medium text-muted-foreground">
          {currentIndex + 1}/{deck.length}
        </span>
      </div>

      {/* Flashcard */}
      <div className="w-full max-w-md">
        <button
          type="button"
          onClick={handleFlip}
          className="group relative w-full cursor-pointer perspective-1000"
          aria-label={isFlipped ? "Hide answer" : "Reveal answer"}
        >
          <motion.div
            className="relative h-64 w-full rounded-2xl border border-border bg-card shadow-lg"
            style={{ transformStyle: "preserve-3d" }}
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
          >
            {/* Front */}
            <div
              className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl backface-hidden"
              style={{
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
              }}
            >
              <span
                className="flashcard-char text-foreground"
                aria-hidden="true"
              >
                {currentKana.char}
              </span>
              <p className="mt-2 text-sm text-muted-foreground">
                พิมพ์ romaji · Space พลิกดูเฉลย
              </p>
            </div>

            {/* Back */}
            <div
              className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl border-2 border-primary bg-card text-foreground"
              style={{
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
              }}
            >
              <span className="flashcard-char">{currentKana.char}</span>
              <p className="mt-2 text-2xl font-light">{currentKana.romaji}</p>
            </div>
          </motion.div>
        </button>

        {/* Input & Actions */}
        <div className="mt-8 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="romaji-input" className="sr-only">
              Enter romaji for {currentKana.char}
            </Label>
            <Input
              id="romaji-input"
              ref={inputRef}
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="พิมพ์ romaji..."
              autoComplete="off"
              autoCapitalize="off"
              className="text-center text-xl"
              aria-invalid={userInput.length > 0 && !isValid && userInput.trim().length >= currentKana.romaji.length}
              aria-describedby="input-hint"
            />
            <p id="input-hint" className="text-center text-xs text-muted-foreground">
              Enter ส่งคำตอบ · Space พลิก · R เล่นเสียง
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            <Button
              variant="outline"
              size="lg"
              onClick={handlePlaySound}
              aria-label="Play pronunciation"
              className="transition-smooth"
            >
              🔊 เล่นเสียง
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={handleFlip}
              aria-label={isFlipped ? "Hide answer" : "Reveal answer"}
              className="transition-smooth"
            >
              พลิกดูเฉลย
            </Button>
            <Button
              size="lg"
              onClick={handleSubmit}
              disabled={!userInput.trim()}
              aria-label="Submit answer"
              variant="outline"
              className="border-2 border-primary bg-card text-primary transition-smooth disabled:border-border disabled:text-muted-foreground"
            >
              ตรวจคำตอบ
            </Button>
          </div>
        </div>
      </div>

      {/* Exit - รองรับ safe area บน iPhone */}
      <Button
        variant="ghost"
        className="absolute min-h-touch min-w-[44px] text-muted-foreground hover:text-foreground"
        style={{
          top: "max(1rem, env(safe-area-inset-top))",
          left: "max(1rem, env(safe-area-inset-left))",
        }}
        onClick={resetSession}
        aria-label="Exit session"
      >
        ← ออก
      </Button>
      <ThemeToggle />
    </div>
  );
}
