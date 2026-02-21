/**
 * KanaFlow - เสียงอ่านตัวอักษรญี่ปุ่น
 *
 * ใช้ pre-recorded audio สำหรับ single kana (แก้ปัญหาเสียงสั้น/ขาดบน iPhone)
 * Fallback เป็น Web Speech API สำหรับคำศัพท์ (หลายตัวอักษร)
 *
 * Audio source: Kuuuube/kana-quiz-sounds (GitHub)
 */

import { HIRAGANA_DATA, KATAKANA_DATA } from "@/constants/kana-data";

const AUDIO_CDN = "https://cdn.jsdelivr.net/gh/Kuuuube/kana-quiz-sounds@master/audio/0";

const charToRomaji = new Map<string, string>();
for (const k of [...HIRAGANA_DATA, ...KATAKANA_DATA]) {
  charToRomaji.set(k.char, k.romaji);
}

let cachedVoice: SpeechSynthesisVoice | null = null;

function getJapaneseVoice(): SpeechSynthesisVoice | null {
  if (typeof window === "undefined") return null;
  if (cachedVoice) return cachedVoice;

  let voices = window.speechSynthesis.getVoices();
  if (voices.length === 0) voices = window.speechSynthesis.getVoices();

  const jaVoices = voices.filter(
    (v) => v.lang.startsWith("ja") || v.lang.includes("ja")
  );

  const preferred = [
    (v: SpeechSynthesisVoice) => v.name.includes("Google") && v.lang.includes("ja"),
    (v: SpeechSynthesisVoice) => v.name.includes("Microsoft") && v.lang.includes("ja"),
    (v: SpeechSynthesisVoice) => v.name.includes("Kyoko"),
    (v: SpeechSynthesisVoice) => v.name.includes("Nanami"),
    (v: SpeechSynthesisVoice) => v.lang === "ja-JP",
    (v: SpeechSynthesisVoice) => v.lang.startsWith("ja"),
  ];

  for (const pred of preferred) {
    const found = jaVoices.find(pred);
    if (found) {
      cachedVoice = found;
      return found;
    }
  }
  cachedVoice = jaVoices[0] ?? null;
  return cachedVoice;
}

export function ensureVoicesLoaded(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      resolve(voices);
      return;
    }
    window.speechSynthesis.onvoiceschanged = () => {
      cachedVoice = null;
      resolve(window.speechSynthesis.getVoices());
    };
  });
}

function speakWithTTS(text: string): void {
  if (window.speechSynthesis.speaking) window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "ja-JP";
  utterance.rate = 0.7;
  utterance.volume = 1;

  const voice = getJapaneseVoice();
  if (voice) utterance.voice = voice;

  window.speechSynthesis.speak(utterance);
}

/**
 * พูดตัวอักษร/คำศัพท์
 * - Single kana: ใช้ pre-recorded audio (ชัดเจน ไม่ขาดบน iPhone)
 * - คำศัพท์: ใช้ Web Speech API
 */
export function speak(text: string): void {
  if (typeof window === "undefined" || !text.trim()) return;

  const trimmed = text.trim();

  if (trimmed.length === 1) {
    const romaji = charToRomaji.get(trimmed);
    if (romaji) {
      const audio = new Audio(`${AUDIO_CDN}/${romaji}.mp3`);
      audio.play().catch(() => speakWithTTS(trimmed));
      return;
    }
  }

  speakWithTTS(trimmed);
}
