"use client";

import { useCallback, useEffect } from "react";
import { useKanaStore } from "@/stores/use-kana-store";
import { Button } from "@/components/ui/button";
import { speak } from "@/lib/speech";
import { ThemeToggle } from "@/components/theme-toggle";
import type { QuizType } from "@/stores/use-kana-store";

function normalizeRomaji(input: string): string {
  return input.trim().toLowerCase().replace(/\s+/g, "");
}

// ข้อความโจทย์หลากหลาย - เพิ่มความหลากหลายลดความซ้ำซาก
const PROMPTS: Record<QuizType, string[]> = {
  "choice-kana": [
    "เลือก romaji ที่ถูกต้อง · กดการ์ดเพื่อฟังเสียง",
    "คำอ่านคืออะไร? · กดการ์ดเพื่อฟัง",
    "เลือกคำอ่านที่ตรงกับตัวอักษร",
    "ตัวอักษรนี้อ่านว่าอย่างไร?",
    "จับคู่คำอ่านกับตัวอักษร",
    "romaji ที่ถูกต้องคือ?",
  ],
  "choice-romaji": [
    "เลือกตัวอักษรที่ถูกต้อง · กดการ์ดเพื่อฟังเสียง",
    "ตัวอักษรที่ตรงกับคำอ่านคือ?",
    "เลือก hiragana/katakana ที่ถูกต้อง",
    "คำอ่านนี้เขียนว่าอย่างไร?",
    "จับคู่ตัวอักษรกับคำอ่าน",
    "ตัวอักษรที่ถูกต้องคือ?",
  ],
  listening: [
    "ฟังเสียง แล้วเลือกคำตอบ",
    "กดการ์ดเพื่อเล่นเสียง",
    "ฟังแล้วเลือก romaji ที่ถูกต้อง",
    "ฟังแล้วเลือกคำอ่าน",
    "เสียงนี้อ่านว่าอย่างไร?",
    "กดเพื่อฟัง · เลือกคำตอบ",
  ],
  "vocabulary-romaji": [
    "คำอ่านคืออะไร?",
    "เลือก romaji ที่ถูกต้อง",
    "คำศัพท์นี้อ่านว่าอย่างไร?",
    "คำนี้เขียน romaji ว่าอย่างไร?",
    "จับคู่คำศัพท์กับคำอ่าน",
    "romaji ของคำนี้คือ?",
  ],
  "type-romaji": [],
};

function getPrompt(quizType: QuizType): string {
  const list = PROMPTS[quizType];
  if (!list.length) return "";
  return list[Math.floor(Math.random() * list.length)];
}

export function FlashcardChoice() {
  const {
    deck,
    currentIndex,
    choiceOptions,
    quizTypesPerCard,
    recordAnswer,
    nextCard,
    resetSession,
  } = useKanaStore();

  const quizType = quizTypesPerCard[currentIndex] ?? "choice-kana";
  const deckItem = deck[currentIndex];
  const options = choiceOptions[currentIndex] ?? [];

  const displayChar =
    deckItem?.kind === "kana"
      ? deckItem.data.char
      : deckItem?.kind === "vocabulary"
        ? deckItem.data.kana
        : "";
  const displayRomaji =
    deckItem?.kind === "kana"
      ? deckItem.data.romaji
      : deckItem?.kind === "vocabulary"
        ? deckItem.data.romaji
        : "";

  const getCorrectAnswer = useCallback((): string => {
    if (!deckItem) return "";
    if (deckItem.kind === "vocabulary") {
      return deckItem.data.romaji;
    }
    return quizType === "choice-romaji" ? deckItem.data.char : deckItem.data.romaji;
  }, [deckItem, quizType]);

  const handleSelect = useCallback(
    (selected: string) => {
      if (!deckItem) return;
      const correct = getCorrectAnswer();
      const isCorrect =
        quizType === "choice-romaji"
        ? selected === correct
        : normalizeRomaji(selected) === normalizeRomaji(correct);
      recordAnswer(isCorrect, selected, correct);
      nextCard();
    },
    [deckItem, quizType, getCorrectAnswer, recordAnswer, nextCard]
  );

  useEffect(() => {
    if (quizType === "listening" && displayChar) {
      speak(displayChar);
    }
  }, [quizType, currentIndex, displayChar]);

  const isVocabulary = quizType === "vocabulary-romaji";
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "1" && options[0]) handleSelect(options[0]);
      else if (e.key === "2" && options[1]) handleSelect(options[1]);
      else if (e.key === "3" && options[2]) handleSelect(options[2]);
      else if (e.key === "4" && options[3]) handleSelect(options[3]);
      else if (
        !isVocabulary &&
        (e.key === "r" || e.key === "R") &&
        displayChar
      ) {
        if (!e.ctrlKey && !e.metaKey) {
          e.preventDefault();
          speak(displayChar);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [options, displayChar, handleSelect, isVocabulary]);

  if (!deckItem || options.length === 0) return null;

  const isListening = quizType === "listening";
  const showKana = quizType === "choice-kana" || quizType.startsWith("vocabulary-");
  const showRomaji = quizType === "choice-romaji";
  const prompt = getPrompt(quizType);

  return (
    <div
      className="flex min-h-[100dvh] flex-col items-center justify-center p-4"
      style={{
        paddingTop: "max(4rem, env(safe-area-inset-top))",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
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

      <div className="w-full max-w-md space-y-8">
        <div
          role={isVocabulary ? undefined : "button"}
          tabIndex={isVocabulary ? undefined : 0}
          onClick={isVocabulary ? undefined : () => speak(displayChar)}
          onKeyDown={
            isVocabulary
              ? undefined
              : (e) => {
                  if (e.key === "Enter" || e.key === " ") speak(displayChar);
                }
          }
          className={`w-full rounded-2xl border border-border bg-card p-8 text-center shadow-lg ${
            isVocabulary
              ? ""
              : "cursor-pointer transition-colors active:bg-accent/30 hover:bg-accent/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring touch-manipulation"
          }`}
          aria-label={isVocabulary ? undefined : "กดเพื่อเล่นเสียง"}
        >
          {isListening ? (
            <div>
              <p className="mb-4 text-sm text-muted-foreground">
                {prompt || "ฟังเสียง แล้วเลือกคำตอบ"}
              </p>
              <p className="text-sm text-muted-foreground">
                กดการ์ดเพื่อเล่นเสียง
              </p>
            </div>
          ) : showKana ? (
            <>
              <span
                className={
                  quizType.startsWith("vocabulary-")
                    ? "text-4xl font-light sm:text-5xl"
                    : "flashcard-char text-foreground"
                }
              >
                {displayChar}
              </span>
              <p className="mt-2 text-sm text-muted-foreground">
                {prompt}
              </p>
            </>
          ) : (
            <>
              <span className="text-4xl font-light sm:text-5xl">
                {displayRomaji}
              </span>
              <p className="mt-2 text-sm text-muted-foreground">{prompt}</p>
            </>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          {options.map((opt, i) => (
            <Button
              key={`${opt}-${i}`}
              variant="outline"
              size="lg"
              className="min-h-touch text-lg transition-all hover:border-primary/50 hover:bg-accent/50 active:scale-[0.99]"
              onClick={() => handleSelect(opt)}
              aria-label={`ตัวเลือก ${i + 1}: ${opt}`}
            >
              {opt}
            </Button>
          ))}
        </div>
      </div>

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
