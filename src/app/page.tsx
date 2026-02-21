"use client";

import { useKanaStore } from "@/stores/use-kana-store";
import { HomeTabs } from "@/components/home-tabs";
import { Flashcard } from "@/components/flashcard";
import { FlashcardChoice } from "@/components/flashcard-choice";
import { ReviewScreen } from "@/components/review-screen";

export default function Home() {
  const sessionPhase = useKanaStore((s) => s.sessionPhase);
  const currentIndex = useKanaStore((s) => s.currentIndex);
  const quizTypesPerCard = useKanaStore((s) => s.quizTypesPerCard);

  if (sessionPhase === "active") {
    const currentQuizType = quizTypesPerCard[currentIndex] ?? "type-romaji";
    const isTypeRomaji = currentQuizType === "type-romaji";
    return isTypeRomaji ? <Flashcard /> : <FlashcardChoice />;
  }

  if (sessionPhase === "review") {
    return <ReviewScreen />;
  }

  return <HomeTabs />;
}
