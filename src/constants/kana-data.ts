/**
 * KanaFlow - Japanese Kana Learning Data
 * Centralized constants for Hiragana and Katakana characters
 * Organized by phonological rows: Vowels, K, S, T, N, H, M, Y, R, W, N-final
 */

export interface Kana {
  id: string;
  char: string;
  romaji: string;
  group: string;
  type: "hiragana" | "katakana";
}

export const KANA_GROUPS = [
  "Vowels",
  "K",
  "S",
  "T",
  "N",
  "H",
  "M",
  "Y",
  "R",
  "W",
  "N-final",
] as const;

export type KanaGroup = (typeof KANA_GROUPS)[number];

// Hiragana - Vowels
const H_VOWELS: Kana[] = [
  { id: "h-a", char: "あ", romaji: "a", group: "Vowels", type: "hiragana" },
  { id: "h-i", char: "い", romaji: "i", group: "Vowels", type: "hiragana" },
  { id: "h-u", char: "う", romaji: "u", group: "Vowels", type: "hiragana" },
  { id: "h-e", char: "え", romaji: "e", group: "Vowels", type: "hiragana" },
  { id: "h-o", char: "お", romaji: "o", group: "Vowels", type: "hiragana" },
];

// Hiragana - K row
const H_K: Kana[] = [
  { id: "h-ka", char: "か", romaji: "ka", group: "K", type: "hiragana" },
  { id: "h-ki", char: "き", romaji: "ki", group: "K", type: "hiragana" },
  { id: "h-ku", char: "く", romaji: "ku", group: "K", type: "hiragana" },
  { id: "h-ke", char: "け", romaji: "ke", group: "K", type: "hiragana" },
  { id: "h-ko", char: "こ", romaji: "ko", group: "K", type: "hiragana" },
];

// Hiragana - S row
const H_S: Kana[] = [
  { id: "h-sa", char: "さ", romaji: "sa", group: "S", type: "hiragana" },
  { id: "h-shi", char: "し", romaji: "shi", group: "S", type: "hiragana" },
  { id: "h-su", char: "す", romaji: "su", group: "S", type: "hiragana" },
  { id: "h-se", char: "せ", romaji: "se", group: "S", type: "hiragana" },
  { id: "h-so", char: "そ", romaji: "so", group: "S", type: "hiragana" },
];

// Hiragana - T row
const H_T: Kana[] = [
  { id: "h-ta", char: "た", romaji: "ta", group: "T", type: "hiragana" },
  { id: "h-chi", char: "ち", romaji: "chi", group: "T", type: "hiragana" },
  { id: "h-tsu", char: "つ", romaji: "tsu", group: "T", type: "hiragana" },
  { id: "h-te", char: "て", romaji: "te", group: "T", type: "hiragana" },
  { id: "h-to", char: "と", romaji: "to", group: "T", type: "hiragana" },
];

// Hiragana - N row
const H_N: Kana[] = [
  { id: "h-na", char: "な", romaji: "na", group: "N", type: "hiragana" },
  { id: "h-ni", char: "に", romaji: "ni", group: "N", type: "hiragana" },
  { id: "h-nu", char: "ぬ", romaji: "nu", group: "N", type: "hiragana" },
  { id: "h-ne", char: "ね", romaji: "ne", group: "N", type: "hiragana" },
  { id: "h-no", char: "の", romaji: "no", group: "N", type: "hiragana" },
];

// Hiragana - H row
const H_H: Kana[] = [
  { id: "h-ha", char: "は", romaji: "ha", group: "H", type: "hiragana" },
  { id: "h-hi", char: "ひ", romaji: "hi", group: "H", type: "hiragana" },
  { id: "h-fu", char: "ふ", romaji: "fu", group: "H", type: "hiragana" },
  { id: "h-he", char: "へ", romaji: "he", group: "H", type: "hiragana" },
  { id: "h-ho", char: "ほ", romaji: "ho", group: "H", type: "hiragana" },
];

// Hiragana - M row
const H_M: Kana[] = [
  { id: "h-ma", char: "ま", romaji: "ma", group: "M", type: "hiragana" },
  { id: "h-mi", char: "み", romaji: "mi", group: "M", type: "hiragana" },
  { id: "h-mu", char: "む", romaji: "mu", group: "M", type: "hiragana" },
  { id: "h-me", char: "め", romaji: "me", group: "M", type: "hiragana" },
  { id: "h-mo", char: "も", romaji: "mo", group: "M", type: "hiragana" },
];

// Hiragana - Y row
const H_Y: Kana[] = [
  { id: "h-ya", char: "や", romaji: "ya", group: "Y", type: "hiragana" },
  { id: "h-yu", char: "ゆ", romaji: "yu", group: "Y", type: "hiragana" },
  { id: "h-yo", char: "よ", romaji: "yo", group: "Y", type: "hiragana" },
];

// Hiragana - R row
const H_R: Kana[] = [
  { id: "h-ra", char: "ら", romaji: "ra", group: "R", type: "hiragana" },
  { id: "h-ri", char: "り", romaji: "ri", group: "R", type: "hiragana" },
  { id: "h-ru", char: "る", romaji: "ru", group: "R", type: "hiragana" },
  { id: "h-re", char: "れ", romaji: "re", group: "R", type: "hiragana" },
  { id: "h-ro", char: "ろ", romaji: "ro", group: "R", type: "hiragana" },
];

// Hiragana - W row
const H_W: Kana[] = [
  { id: "h-wa", char: "わ", romaji: "wa", group: "W", type: "hiragana" },
  { id: "h-wo", char: "を", romaji: "wo", group: "W", type: "hiragana" },
];

// Hiragana - N-final
const H_N_FINAL: Kana[] = [
  { id: "h-n-final", char: "ん", romaji: "n", group: "N-final", type: "hiragana" },
];

// Katakana - Vowels
const K_VOWELS: Kana[] = [
  { id: "k-a", char: "ア", romaji: "a", group: "Vowels", type: "katakana" },
  { id: "k-i", char: "イ", romaji: "i", group: "Vowels", type: "katakana" },
  { id: "k-u", char: "ウ", romaji: "u", group: "Vowels", type: "katakana" },
  { id: "k-e", char: "エ", romaji: "e", group: "Vowels", type: "katakana" },
  { id: "k-o", char: "オ", romaji: "o", group: "Vowels", type: "katakana" },
];

// Katakana - K row
const K_K: Kana[] = [
  { id: "k-ka", char: "カ", romaji: "ka", group: "K", type: "katakana" },
  { id: "k-ki", char: "キ", romaji: "ki", group: "K", type: "katakana" },
  { id: "k-ku", char: "ク", romaji: "ku", group: "K", type: "katakana" },
  { id: "k-ke", char: "ケ", romaji: "ke", group: "K", type: "katakana" },
  { id: "k-ko", char: "コ", romaji: "ko", group: "K", type: "katakana" },
];

// Katakana - S row
const K_S: Kana[] = [
  { id: "k-sa", char: "サ", romaji: "sa", group: "S", type: "katakana" },
  { id: "k-shi", char: "シ", romaji: "shi", group: "S", type: "katakana" },
  { id: "k-su", char: "ス", romaji: "su", group: "S", type: "katakana" },
  { id: "k-se", char: "セ", romaji: "se", group: "S", type: "katakana" },
  { id: "k-so", char: "ソ", romaji: "so", group: "S", type: "katakana" },
];

// Katakana - T row
const K_T: Kana[] = [
  { id: "k-ta", char: "タ", romaji: "ta", group: "T", type: "katakana" },
  { id: "k-chi", char: "チ", romaji: "chi", group: "T", type: "katakana" },
  { id: "k-tsu", char: "ツ", romaji: "tsu", group: "T", type: "katakana" },
  { id: "k-te", char: "テ", romaji: "te", group: "T", type: "katakana" },
  { id: "k-to", char: "ト", romaji: "to", group: "T", type: "katakana" },
];

// Katakana - N row
const K_N: Kana[] = [
  { id: "k-na", char: "ナ", romaji: "na", group: "N", type: "katakana" },
  { id: "k-ni", char: "ニ", romaji: "ni", group: "N", type: "katakana" },
  { id: "k-nu", char: "ヌ", romaji: "nu", group: "N", type: "katakana" },
  { id: "k-ne", char: "ネ", romaji: "ne", group: "N", type: "katakana" },
  { id: "k-no", char: "ノ", romaji: "no", group: "N", type: "katakana" },
];

// Katakana - H row
const K_H: Kana[] = [
  { id: "k-ha", char: "ハ", romaji: "ha", group: "H", type: "katakana" },
  { id: "k-hi", char: "ヒ", romaji: "hi", group: "H", type: "katakana" },
  { id: "k-fu", char: "フ", romaji: "fu", group: "H", type: "katakana" },
  { id: "k-he", char: "ヘ", romaji: "he", group: "H", type: "katakana" },
  { id: "k-ho", char: "ホ", romaji: "ho", group: "H", type: "katakana" },
];

// Katakana - M row
const K_M: Kana[] = [
  { id: "k-ma", char: "マ", romaji: "ma", group: "M", type: "katakana" },
  { id: "k-mi", char: "ミ", romaji: "mi", group: "M", type: "katakana" },
  { id: "k-mu", char: "ム", romaji: "mu", group: "M", type: "katakana" },
  { id: "k-me", char: "メ", romaji: "me", group: "M", type: "katakana" },
  { id: "k-mo", char: "モ", romaji: "mo", group: "M", type: "katakana" },
];

// Katakana - Y row
const K_Y: Kana[] = [
  { id: "k-ya", char: "ヤ", romaji: "ya", group: "Y", type: "katakana" },
  { id: "k-yu", char: "ユ", romaji: "yu", group: "Y", type: "katakana" },
  { id: "k-yo", char: "ヨ", romaji: "yo", group: "Y", type: "katakana" },
];

// Katakana - R row
const K_R: Kana[] = [
  { id: "k-ra", char: "ラ", romaji: "ra", group: "R", type: "katakana" },
  { id: "k-ri", char: "リ", romaji: "ri", group: "R", type: "katakana" },
  { id: "k-ru", char: "ル", romaji: "ru", group: "R", type: "katakana" },
  { id: "k-re", char: "レ", romaji: "re", group: "R", type: "katakana" },
  { id: "k-ro", char: "ロ", romaji: "ro", group: "R", type: "katakana" },
];

// Katakana - W row
const K_W: Kana[] = [
  { id: "k-wa", char: "ワ", romaji: "wa", group: "W", type: "katakana" },
  { id: "k-wo", char: "ヲ", romaji: "wo", group: "W", type: "katakana" },
];

// Katakana - N-final
const K_N_FINAL: Kana[] = [
  { id: "k-n-final", char: "ン", romaji: "n", group: "N-final", type: "katakana" },
];

/** Complete Hiragana character set (46 characters) */
export const HIRAGANA_DATA: Kana[] = [
  ...H_VOWELS,
  ...H_K,
  ...H_S,
  ...H_T,
  ...H_N,
  ...H_H,
  ...H_M,
  ...H_Y,
  ...H_R,
  ...H_W,
  ...H_N_FINAL,
];

/** Complete Katakana character set (46 characters) */
export const KATAKANA_DATA: Kana[] = [
  ...K_VOWELS,
  ...K_K,
  ...K_S,
  ...K_T,
  ...K_N,
  ...K_H,
  ...K_M,
  ...K_Y,
  ...K_R,
  ...K_W,
  ...K_N_FINAL,
];

/** All kana for mixed mode */
export const ALL_KANA: Kana[] = [...HIRAGANA_DATA, ...KATAKANA_DATA];
