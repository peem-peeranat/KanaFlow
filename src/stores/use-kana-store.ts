"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Kana } from "@/constants/kana-data";
import {
  HIRAGANA_DATA,
  KATAKANA_DATA,
  ALL_KANA,
  KANA_GROUPS,
  type KanaGroup,
} from "@/constants/kana-data";
import type { Vocabulary } from "@/constants/vocabulary-data";
import { filterVocabularyByRows } from "@/constants/vocabulary-data";

export type PracticeMode = "hiragana" | "katakana" | "mixed";

export type QuizType =
  | "type-romaji"       // พิมพ์ romaji
  | "choice-kana"       // ดูตัวอักษร → เลือก romaji
  | "choice-romaji"     // ดู romaji → เลือกตัวอักษร
  | "listening"         // ฟังเสียง → เลือก romaji
  | "vocabulary-romaji";  // แสดงคำศัพท์ → เลือก romaji

export type DeckItem =
  | { kind: "kana"; data: Kana }
  | { kind: "vocabulary"; data: Vocabulary };

export type SessionPhase = "idle" | "active" | "review";

export interface AnswerRecord {
  displayChar: string;
  displayRomaji: string;
  correctAnswer: string;
  userAnswer: string;
  correct: boolean;
}

interface KanaState {
  // Practice Configuration
  mode: PracticeMode;
  selectedRows: Set<KanaGroup>;
  setMode: (mode: PracticeMode) => void;
  toggleRow: (row: KanaGroup) => void;
  selectAllRows: () => void;
  clearRows: () => void;

  // Dynamic Deck
  deck: DeckItem[];
  quizTypesPerCard: QuizType[];
  choiceOptions: string[][];
  setDeck: (deck: DeckItem[]) => void;
  shuffleDeck: () => void;
  buildAndShuffleDeck: () => void;

  // Session Tracking
  currentIndex: number;
  correctCount: number;
  totalAttempts: number;
  mistakeList: Kana[];
  answerHistory: AnswerRecord[];
  sessionPhase: SessionPhase;
  isFlipped: boolean;
  userInput: string;

  setCurrentIndex: (index: number) => void;
  incrementCorrect: () => void;
  incrementAttempts: () => void;
  addMistake: (kana: Kana) => void;
  setSessionPhase: (phase: SessionPhase) => void;
  setFlipped: (flipped: boolean) => void;
  setUserInput: (input: string) => void;

  // Smart Focus - re-insert mistake 4 positions after error
  reinsertMistake: (kana: Kana) => void;

  // Session control
  startSession: () => void;
  startMistakeReview: () => void;
  recordAnswer: (correct: boolean, userAnswer: string, correctAnswer?: string) => void;
  nextCard: () => void;
  resetSession: () => void;

  // Persisted stats (synced to localStorage via persist middleware)
  bestStreak: number;
  totalMastered: number;
  preferredMode: PracticeMode;
  updateBestStreak: (streak: number) => void;
  updateTotalMastered: (count: number) => void;
  setPreferredMode: (mode: PracticeMode) => void;
}

/**
 * Fisher-Yates shuffle algorithm for unbiased random permutation
 */
function fisherYatesShuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function getKanaByMode(mode: PracticeMode): Kana[] {
  switch (mode) {
    case "hiragana":
      return HIRAGANA_DATA;
    case "katakana":
      return KATAKANA_DATA;
    case "mixed":
      return ALL_KANA;
    default:
      return HIRAGANA_DATA;
  }
}

export const useKanaStore = create<KanaState>()(
  persist(
    (set, get) => ({
      mode: "hiragana",
      selectedRows: new Set(KANA_GROUPS),
      deck: [],
      quizTypesPerCard: [],
      choiceOptions: [],
      currentIndex: 0,
      correctCount: 0,
      totalAttempts: 0,
      mistakeList: [],
      answerHistory: [],
      sessionPhase: "idle",
      isFlipped: false,
      userInput: "",
      bestStreak: 0,
      totalMastered: 0,
      preferredMode: "hiragana",

      setMode: (mode) =>
        set({
          mode,
          selectedRows: new Set(KANA_GROUPS),
          preferredMode: mode,
        }),

      toggleRow: (row) =>
        set((state) => {
          const newRows = new Set(state.selectedRows);
          if (newRows.has(row)) {
            newRows.delete(row);
          } else {
            newRows.add(row);
          }
          return { selectedRows: newRows };
        }),

      selectAllRows: () =>
        set({ selectedRows: new Set(KANA_GROUPS) }),

      clearRows: () =>
        set({ selectedRows: new Set() }),

      setDeck: (deck) => set({ deck }),

      shuffleDeck: () =>
        set((state) => ({
          deck: fisherYatesShuffle(state.deck),
        })),

      buildAndShuffleDeck: () => {
        const { mode, selectedRows } = get();
        const TOTAL_CARDS = 20;
        const sourceKana = getKanaByMode(mode);
        const filtered =
          selectedRows.size === 0
            ? sourceKana
            : sourceKana.filter((k) => selectedRows.has(k.group as KanaGroup));

        if (filtered.length === 0) {
          set({ deck: [], quizTypesPerCard: [], choiceOptions: [] });
          return;
        }

        const rows: KanaGroup[] =
          selectedRows.size > 0
            ? Array.from(selectedRows)
            : [...new Set(filtered.map((k) => k.group as KanaGroup))];
        const numRows = rows.length;
        const availableVocab = filterVocabularyByRows(selectedRows);
        const hasVocab = availableVocab.length >= 4;

        const kanaQuizTypes: QuizType[] = [
          "type-romaji",
          "choice-kana",
          "choice-romaji",
          "listening",
        ];
        const vocabQuizType: QuizType = "vocabulary-romaji";

        const byRow = new Map<KanaGroup, Kana[]>();
        for (const k of filtered) {
          const g = k.group as KanaGroup;
          if (!byRow.has(g)) byRow.set(g, []);
          byRow.get(g)!.push(k);
        }

        const basePerRow = Math.floor(TOTAL_CARDS / numRows);
        const remainder = TOTAL_CARDS % numRows;
        const deckItems: DeckItem[] = [];

        // เฉลี่ยการ์ด kana ต่อแถว (เหลือที่สำหรับ vocab ถ้ามี) - เพิ่ม vocab เมื่อมีคำศัพท์มาก
        const vocabSlots = hasVocab
          ? Math.min(7, Math.max(5, Math.floor(availableVocab.length / 8)))
          : 0;
        const kanaSlots = TOTAL_CARDS - vocabSlots;

        const kanaPerRow = Math.floor(kanaSlots / numRows);
        const kanaRemainder = kanaSlots % numRows;

        // สุ่ม kana - ไม่ซ้ำกันในเซสชัน (ถ้าไม่พอให้ได้น้อยกว่า TOTAL_CARDS)
        const usedKanaIds = new Set<string>();
        for (let i = 0; i < numRows; i++) {
          const row = rows[i];
          const allInRow = byRow.get(row) ?? [];
          const count = kanaPerRow + (i < kanaRemainder ? 1 : 0);
          const available = allInRow.filter((k) => !usedKanaIds.has(k.id));
          if (available.length === 0) continue;
          const shuffled = fisherYatesShuffle([...available]);
          const toAdd = Math.min(count, shuffled.length);
          for (let j = 0; j < toAdd; j++) {
            deckItems.push({ kind: "kana", data: shuffled[j] });
            usedKanaIds.add(shuffled[j].id);
          }
        }

        // สุ่ม vocab - ไม่ซ้ำกัน เติมให้ครบ TOTAL_CARDS
        const shuffledVocab = fisherYatesShuffle([...availableVocab]);
        const usedVocabIds = new Set<string>();
        for (let v = 0; v < shuffledVocab.length && deckItems.length < TOTAL_CARDS; v++) {
          const pick = shuffledVocab[v];
          if (usedVocabIds.has(pick.id)) continue;
          usedVocabIds.add(pick.id);
          deckItems.push({ kind: "vocabulary", data: pick });
        }

        const shuffled = fisherYatesShuffle(deckItems);

        const romajiPool = [...new Set(filtered.map((k) => k.romaji))];
        const charPool = [...new Set(filtered.map((k) => k.char))];

        const quizTypesPerCard: QuizType[] = [];
        const choiceOptions: string[][] = [];

        // สร้าง quiz types ให้ครบทั้ง 4 แบบ และเฉลี่ยเท่าๆ กัน (type-romaji, choice-kana, choice-romaji, listening)
        const kanaItems = shuffled.filter((x) => x.kind === "kana");
        const basePerType = Math.floor(kanaItems.length / kanaQuizTypes.length);
        const quizRemainder = kanaItems.length % kanaQuizTypes.length;
        const kanaQuizPool: QuizType[] = [];
        for (let t = 0; t < kanaQuizTypes.length; t++) {
          const count = basePerType + (t < quizRemainder ? 1 : 0);
          for (let i = 0; i < count; i++) {
            kanaQuizPool.push(kanaQuizTypes[t]);
          }
        }
        const shuffledKanaQuiz = fisherYatesShuffle(kanaQuizPool);
        let kanaQuizIndex = 0;

        for (let i = 0; i < shuffled.length; i++) {
          const item = shuffled[i];
          if (item.kind === "vocabulary") {
            quizTypesPerCard.push(vocabQuizType);
            const correct = item.data.romaji;
            const wrongPool = [...romajiPool, ...availableVocab.map((v) => v.romaji)].filter(
              (x) => x !== correct
            );
            const wrong: string[] = [];
            const seen = new Set<string>([correct]);
            while (wrong.length < 3 && wrongPool.length > 0) {
              const pick = wrongPool[Math.floor(Math.random() * wrongPool.length)];
              if (pick && !seen.has(pick)) {
                seen.add(pick);
                wrong.push(pick);
              }
            }
            choiceOptions.push(fisherYatesShuffle([correct, ...wrong]));
          } else {
            const qt = shuffledKanaQuiz[kanaQuizIndex++] ?? kanaQuizTypes[0];
            quizTypesPerCard.push(qt);
            const kana = item.data;
            if (qt === "type-romaji") {
              choiceOptions.push([]);
            } else {
              const pool = qt === "choice-romaji" ? charPool : romajiPool;
              const getCorrect =
                qt === "choice-romaji" ? (k: Kana) => k.char : (k: Kana) => k.romaji;
              const correct = getCorrect(kana);
              const wrongPool = pool.filter((x) => x !== correct);
              const wrong: string[] = [];
              while (wrong.length < 3 && wrongPool.length > 0) {
                const j = Math.floor(Math.random() * wrongPool.length);
                const pick = wrongPool.splice(j, 1)[0];
                if (pick && !wrong.includes(pick)) wrong.push(pick);
              }
              choiceOptions.push(fisherYatesShuffle([correct, ...wrong]));
            }
          }
        }

        set({ deck: shuffled, quizTypesPerCard, choiceOptions });
      },

      setCurrentIndex: (currentIndex) => set({ currentIndex }),
      incrementCorrect: () =>
        set((state) => ({ correctCount: state.correctCount + 1 })),
      incrementAttempts: () =>
        set((state) => ({ totalAttempts: state.totalAttempts + 1 })),
      addMistake: (kana) =>
        set((state) => ({
          mistakeList: [...state.mistakeList, kana],
        })),
      setSessionPhase: (sessionPhase) => set({ sessionPhase }),
      setFlipped: (isFlipped) => set({ isFlipped }),
      setUserInput: (userInput) => set({ userInput }),

      reinsertMistake: (kana) => {
        const { deck, currentIndex } = get();
        const insertPosition = Math.min(currentIndex + 4, deck.length);
        const newDeck = [...deck];
        newDeck.splice(insertPosition, 0, { kind: "kana", data: kana });
        set({ deck: newDeck });
      },

      startSession: () => {
        get().buildAndShuffleDeck();
        const { deck } = get();
        if (deck.length === 0) return;
        set({
          sessionPhase: "active",
          currentIndex: 0,
          correctCount: 0,
          totalAttempts: 0,
          mistakeList: [],
          answerHistory: [],
          isFlipped: false,
          userInput: "",
        });
      },

      startMistakeReview: () => {
        const { mistakeList } = get();
        if (mistakeList.length === 0) return;
        const deck: DeckItem[] = fisherYatesShuffle([...mistakeList]).map((k) => ({
          kind: "kana" as const,
          data: k,
        }));
        const sourceKana = [...HIRAGANA_DATA, ...KATAKANA_DATA];
        const quizTypes: QuizType[] = ["type-romaji", "choice-kana", "choice-romaji", "listening"];
        const quizTypesPerCard = deck.map(
          () => quizTypes[Math.floor(Math.random() * quizTypes.length)]
        );
        const romajiPool = [...new Set(sourceKana.map((k) => k.romaji))];
        const charPool = [...new Set(sourceKana.map((k) => k.char))];
        const choiceOptions: string[][] = deck.map((item, i) => {
          const qt = quizTypesPerCard[i];
          if (qt === "type-romaji") return [];
          const kana = item.kind === "kana" ? item.data : null;
          if (!kana) return [];
          const pool = qt === "choice-romaji" ? charPool : romajiPool;
          const getCorrect = qt === "choice-romaji" ? (k: Kana) => k.char : (k: Kana) => k.romaji;
          const correct = getCorrect(kana);
          const wrongPool = pool.filter((x) => x !== correct);
          const wrong: string[] = [];
          while (wrong.length < 3 && wrongPool.length > 0) {
            const j = Math.floor(Math.random() * wrongPool.length);
            const pick = wrongPool.splice(j, 1)[0];
            if (pick && !wrong.includes(pick)) wrong.push(pick);
          }
          return fisherYatesShuffle([correct, ...wrong]);
        });
        set({
          deck,
          quizTypesPerCard,
          choiceOptions,
          sessionPhase: "active",
          currentIndex: 0,
          correctCount: 0,
          totalAttempts: 0,
          mistakeList: [],
          answerHistory: [],
          isFlipped: false,
          userInput: "",
        });
      },

      recordAnswer: (correct, userAnswer, correctAnswer) => {
        const state = get();
        const item = state.deck[state.currentIndex];
        if (!item) return;

        const displayChar = item.kind === "kana" ? item.data.char : item.data.kana;
        const displayRomaji = item.kind === "kana" ? item.data.romaji : item.data.romaji;
        const record: AnswerRecord = {
          displayChar,
          displayRomaji,
          correctAnswer: correctAnswer ?? displayRomaji,
          userAnswer: userAnswer.trim(),
          correct,
        };

        set((s) => ({
          totalAttempts: s.totalAttempts + 1,
          correctCount: s.correctCount + (correct ? 1 : 0),
          userInput: "",
          answerHistory: [...s.answerHistory, record],
        }));

        if (!correct && item.kind === "kana") {
          get().addMistake(item.data);
        }
      },

      nextCard: () => {
        const { deck, currentIndex } = get();
        if (currentIndex >= deck.length - 1) {
          set({
            sessionPhase: "review",
            isFlipped: false,
          });
        } else {
          set({
            currentIndex: currentIndex + 1,
            isFlipped: false,
          });
        }
      },

      resetSession: () =>
        set({
          sessionPhase: "idle",
          currentIndex: 0,
          correctCount: 0,
          totalAttempts: 0,
          mistakeList: [],
          answerHistory: [],
          deck: [],
          quizTypesPerCard: [],
          choiceOptions: [],
          isFlipped: false,
          userInput: "",
        }),

      updateBestStreak: (streak) =>
        set((state) => ({
          bestStreak: Math.max(state.bestStreak, streak),
        })),

      updateTotalMastered: (count) =>
        set((state) => ({
          totalMastered: state.totalMastered + count,
        })),

      setPreferredMode: (preferredMode) => set({ preferredMode }),
    }),
    {
      name: "kanaflow-storage",
      partialize: (state) => ({
        bestStreak: state.bestStreak,
        totalMastered: state.totalMastered,
        preferredMode: state.preferredMode,
        mode: state.preferredMode,
      }),
    }
  )
);
