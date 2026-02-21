/**
 * Web Speech API - Japanese voice synthesis for KanaFlow
 * ปรับปรุงเสียงให้ตรงกับสำเนียงญี่ปุ่นมากขึ้น
 *
 * ใช้ตัวอักษรญี่ปุ่น (あ, か, し...) แทน romaji เพื่อให้ TTS อ่านเป็นภาษาญี่ปุ่น
 * เลือก voice ที่มีคุณภาพสูง (Google, Microsoft)
 */

let cachedVoice: SpeechSynthesisVoice | null = null;

function getJapaneseVoice(): SpeechSynthesisVoice | null {
  if (typeof window === "undefined") return null;
  if (cachedVoice) return cachedVoice;

  const voices = window.speechSynthesis.getVoices();
  const jaVoices = voices.filter(
    (v) => v.lang.startsWith("ja") || v.lang.includes("ja")
  );

  // ลำดับความชอบ: Google > Microsoft > Kyoko (Mac) > อื่นๆ
  const preferred = [
    (v: SpeechSynthesisVoice) => v.name.includes("Google") && v.lang.includes("ja"),
    (v: SpeechSynthesisVoice) => v.name.includes("Microsoft") && v.lang.includes("ja"),
    (v: SpeechSynthesisVoice) => v.name.includes("Kyoko"), // Mac - คุณภาพดี
    (v: SpeechSynthesisVoice) => v.name.includes("Nanami"), // Windows
    (v: SpeechSynthesisVoice) => v.name.includes("Haruka"),
    (v: SpeechSynthesisVoice) => v.lang === "ja-JP",
    (v: SpeechSynthesisVoice) => v.lang.startsWith("ja"),
  ];

  for (const pred of preferred) {
    const found = jaVoices.find(pred);
    if (found) {
      cachedVoice = found;
      return cachedVoice;
    }
  }

  cachedVoice = jaVoices[0] ?? null;
  return cachedVoice;
}

// Voice list loads asynchronously - poll until ready
export function ensureVoicesLoaded(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      resolve(voices);
      return;
    }
    window.speechSynthesis.onvoiceschanged = () => {
      cachedVoice = null; // reset cache when voices load
      resolve(window.speechSynthesis.getVoices());
    };
  });
}

/**
 * พูดตัวอักษร kana
 * @param kanaChar - ตัวอักษรญี่ปุ่น (あ, か, し...) - ให้ผลลัพธ์ดีกว่า romaji
 * @param fallbackRomaji - ใช้เมื่อไม่มี kanaChar (optional)
 */
export function speak(text: string, lang = "ja-JP"): void {
  if (typeof window === "undefined") return;

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = 0.85; // ช้าลงเล็กน้อยเพื่อความชัดเจน
  utterance.pitch = 1;

  const voice = getJapaneseVoice();
  if (voice) {
    utterance.voice = voice;
  }

  window.speechSynthesis.speak(utterance);
}

