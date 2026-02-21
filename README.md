# KanaFlow

A high-performance Japanese kana learning platform built with Next.js, TypeScript, Tailwind CSS, and Shadcn/UI. Master Hiragana and Katakana through focused, spaced repetition practice.

## Features

- **Practice Modes**: Hiragana, Katakana, or Mixed
- **Row Filtering**: Select specific phonological rows (Vowels, K, S, T, N, H, M, Y, R, W, N-final)
- **Smart Spaced Repetition**: Mistake characters are re-inserted 4 positions ahead for reinforcement
- **3D Flashcard Animation**: Smooth flip animation with Framer Motion
- **Real-time Validation**: Input turns green when correct
- **Web Speech API**: Japanese pronunciation via browser's native speech synthesis
- **LocalStorage Persistence**: Best streak, total mastered, and preferred mode saved locally
- **Dark/Light Theme**: System-aware theme switching with next-themes
- **Mobile-First**: 44px touch targets, fully responsive

## Keyboard Shortcuts

- **Enter**: Submit answer / Next card
- **Space**: Flip card / Reveal answer
- **R**: Play pronunciation

## Getting Started

```bash
bun install
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) to start learning.

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Zustand (state management)
- Framer Motion (animations)
- Radix UI (primitives)
- next-themes (dark mode)
