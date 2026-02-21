/**
 * KanaFlow - คำศัพท์ภาษาญี่ปุ่นพื้นฐาน
 * ใช้สำหรับโหมดคำศัพท์ แบ่งตาม groups (rows) ที่ใช้
 */

import type { KanaGroup } from "./kana-data";

export interface Vocabulary {
  id: string;
  kana: string;
  romaji: string;
  meaning: string; // ความหมายภาษาไทย
  groups: KanaGroup[]; // แถวที่ใช้ในคำนี้
}

/**
 * คำศัพท์พื้นฐาน - แต่ละคำ map กับ groups ตามตัวอักษรที่ใช้
 * ใช้ filter เฉพาะคำที่ใช้แค่ kana จาก selectedRows
 */
export const VOCABULARY_DATA: Vocabulary[] = [
  // Vowels only
  { id: "v-ie", kana: "いえ", romaji: "ie", meaning: "บ้าน", groups: ["Vowels"] },
  { id: "v-ue", kana: "うえ", romaji: "ue", meaning: "ข้างบน", groups: ["Vowels"] },
  { id: "v-ao", kana: "あお", romaji: "ao", meaning: "สีน้ำเงิน", groups: ["Vowels"] },
  { id: "v-oi", kana: "おい", romaji: "oi", meaning: "อร่อย", groups: ["Vowels"] },
  { id: "v-ei", kana: "えい", romaji: "ei", meaning: "ใช่", groups: ["Vowels"] },
  // Vowels + K
  { id: "vk-aka", kana: "あか", romaji: "aka", meaning: "แดง", groups: ["Vowels", "K"] },
  { id: "vk-kao", kana: "かお", romaji: "kao", meaning: "ใบหน้า", groups: ["Vowels", "K"] },
  { id: "vk-ki", kana: "き", romaji: "ki", meaning: "ต้นไม้", groups: ["Vowels", "K"] },
  { id: "vk-koe", kana: "こえ", romaji: "koe", meaning: "เสียง", groups: ["Vowels", "K"] },
  { id: "vk-kiku", kana: "きく", romaji: "kiku", meaning: "ฟัง", groups: ["Vowels", "K"] },
  // Vowels + K + S
  { id: "vks-okashi", kana: "おかし", romaji: "okashi", meaning: "ขนม", groups: ["Vowels", "K", "S"] },
  { id: "vks-sake", kana: "さけ", romaji: "sake", meaning: "เหล้าญี่ปุ่น", groups: ["Vowels", "K", "S"] },
  { id: "vks-kasa", kana: "かさ", romaji: "kasa", meaning: "ร่ม", groups: ["Vowels", "K", "S"] },
  { id: "vks-suki", kana: "すき", romaji: "suki", meaning: "ชอบ", groups: ["Vowels", "K", "S"] },
  { id: "vks-sakura", kana: "さくら", romaji: "sakura", meaning: "ดอกซากุระ", groups: ["Vowels", "K", "S", "R"] },
  // Vowels + K + T
  { id: "vkt-kutsu", kana: "くつ", romaji: "kutsu", meaning: "รองเท้า", groups: ["Vowels", "K", "T"] },
  { id: "vkt-kite", kana: "きて", romaji: "kite", meaning: "มานะ", groups: ["Vowels", "K", "T"] },
  { id: "vkt-takai", kana: "たかい", romaji: "takai", meaning: "สูง/แพง", groups: ["Vowels", "K", "T"] },
  { id: "vkt-toki", kana: "とき", romaji: "toki", meaning: "เวลา", groups: ["Vowels", "K", "T"] },
  { id: "vkt-kato", kana: "かと", romaji: "kato", meaning: "ตระกูลคาโต้", groups: ["Vowels", "K", "T"] },
  // Vowels + N
  { id: "vn-nani", kana: "なに", romaji: "nani", meaning: "อะไร", groups: ["Vowels", "N"] },
  { id: "vn-niku", kana: "にく", romaji: "niku", meaning: "เนื้อ", groups: ["Vowels", "N", "K"] },
  { id: "vn-neko", kana: "ねこ", romaji: "neko", meaning: "แมว", groups: ["Vowels", "N", "K"] },
  { id: "vn-noru", kana: "のる", romaji: "noru", meaning: "ขึ้น(รถ)", groups: ["Vowels", "N", "R"] },
  // Vowels + H
  { id: "vh-hai", kana: "はい", romaji: "hai", meaning: "ใช่", groups: ["Vowels", "H"] },
  { id: "vh-hi", kana: "ひ", romaji: "hi", meaning: "ดวงอาทิตย์", groups: ["Vowels", "H"] },
  { id: "vh-hana", kana: "はな", romaji: "hana", meaning: "ดอกไม้", groups: ["Vowels", "H", "N"] },
  { id: "vh-hoshi", kana: "ほし", romaji: "hoshi", meaning: "ดาว", groups: ["Vowels", "H", "S"] },
  { id: "vh-hito", kana: "ひと", romaji: "hito", meaning: "คน", groups: ["Vowels", "H", "T"] },
  // Vowels + M
  { id: "vm-mizu", kana: "みず", romaji: "mizu", meaning: "น้ำ", groups: ["Vowels", "M"] },
  { id: "vm-michi", kana: "みち", romaji: "michi", meaning: "ถนน", groups: ["Vowels", "M", "T"] },
  { id: "vm-mori", kana: "もり", romaji: "mori", meaning: "ป่า", groups: ["Vowels", "M", "R"] },
  { id: "vm-me", kana: "め", romaji: "me", meaning: "ตา", groups: ["Vowels", "M"] },
  { id: "vm-mono", kana: "もの", romaji: "mono", meaning: "สิ่งของ", groups: ["Vowels", "M", "N"] },
  // Vowels + Y
  { id: "vy-yama", kana: "やま", romaji: "yama", meaning: "ภูเขา", groups: ["Vowels", "Y", "M"] },
  { id: "vy-yuki", kana: "ゆき", romaji: "yuki", meaning: "หิมะ", groups: ["Vowels", "Y", "K"] },
  { id: "vy-yoru", kana: "よる", romaji: "yoru", meaning: "กลางคืน", groups: ["Vowels", "Y", "R"] },
  { id: "vy-yasai", kana: "やさい", romaji: "yasai", meaning: "ผัก", groups: ["Vowels", "Y", "S"] },
  { id: "vy-yubi", kana: "ゆび", romaji: "yubi", meaning: "นิ้ว", groups: ["Vowels", "Y"] },
  // Vowels + R
  { id: "vr-ringo", kana: "りんご", romaji: "ringo", meaning: "แอปเปิล", groups: ["Vowels", "R", "N", "K"] },
  { id: "vr-rikishi", kana: "りきし", romaji: "rikishi", meaning: "นักมวยปล้ำ", groups: ["Vowels", "R", "K", "S"] },
  { id: "vr-aru", kana: "ある", romaji: "aru", meaning: "มี(สิ่งของ)", groups: ["Vowels", "R"] },
  { id: "vr-iru", kana: "いる", romaji: "iru", meaning: "อยู่", groups: ["Vowels", "R"] },
  { id: "vr-uru", kana: "うる", romaji: "uru", meaning: "ขาย", groups: ["Vowels", "R"] },
  // Vowels + W
  { id: "vw-watashi", kana: "わたし", romaji: "watashi", meaning: "ฉัน", groups: ["Vowels", "W", "T", "S"] },
  { id: "vw-warui", kana: "わるい", romaji: "warui", meaning: "แย่", groups: ["Vowels", "W", "R"] },
  // เพิ่มคำศัพท์ผสม
  { id: "vk-aki", kana: "あき", romaji: "aki", meaning: "ฤดูใบไม้ร่วง", groups: ["Vowels", "K"] },
  { id: "vk-iku", kana: "いく", romaji: "iku", meaning: "ไป", groups: ["Vowels", "K"] },
  { id: "vk-ueki", kana: "うえき", romaji: "ueki", meaning: "ต้นไม้ในกระถาง", groups: ["Vowels", "K"] },
  { id: "vk-oka", kana: "おか", romaji: "oka", meaning: "เนิน", groups: ["Vowels", "K"] },
  { id: "vk-eki", kana: "えき", romaji: "eki", meaning: "สถานี", groups: ["Vowels", "K"] },
  { id: "vks-kisu", kana: "きす", romaji: "kisu", meaning: "จูบ", groups: ["Vowels", "K", "S"] },
  { id: "vks-kuso", kana: "くそ", romaji: "kuso", meaning: "อึ", groups: ["Vowels", "K", "S"] },
  { id: "vks-soko", kana: "そこ", romaji: "soko", meaning: "ที่นั่น", groups: ["Vowels", "K", "S"] },
  { id: "vks-ashi", kana: "あし", romaji: "ashi", meaning: "เท้า", groups: ["Vowels", "S"] },
  { id: "vks-uso", kana: "うそ", romaji: "uso", meaning: "โกหก", groups: ["Vowels", "S"] },
  { id: "vkt-chi", kana: "ち", romaji: "chi", meaning: "เลือด", groups: ["Vowels", "T"] },
  { id: "vkt-te", kana: "て", romaji: "te", meaning: "มือ", groups: ["Vowels", "T"] },
  { id: "vkt-ato", kana: "あと", romaji: "ato", meaning: "หลัง", groups: ["Vowels", "T"] },
  { id: "vkt-ita", kana: "いた", romaji: "ita", meaning: "ไม้กระดาน", groups: ["Vowels", "T"] },
  { id: "vkt-tsuki", kana: "つき", romaji: "tsuki", meaning: "ดวงจันทร์", groups: ["Vowels", "T"] },
  { id: "vn-name", kana: "なめ", romaji: "name", meaning: "เลีย", groups: ["Vowels", "N", "M"] },
  { id: "vn-nemu", kana: "ねむ", romaji: "nemu", meaning: "ง่วง", groups: ["Vowels", "N", "M"] },
  { id: "vn-inochi", kana: "いのち", romaji: "inochi", meaning: "ชีวิต", groups: ["Vowels", "N", "K", "T"] },
  { id: "vh-heya", kana: "へや", romaji: "heya", meaning: "ห้อง", groups: ["Vowels", "H", "Y"] },
  { id: "vh-haru", kana: "はる", romaji: "haru", meaning: "ฤดูใบไม้ผลิ", groups: ["Vowels", "H", "R"] },
  { id: "vh-fuyu", kana: "ふゆ", romaji: "fuyu", meaning: "ฤดูหนาว", groups: ["Vowels", "H", "Y"] },
  { id: "vh-hikari", kana: "ひかり", romaji: "hikari", meaning: "แสง", groups: ["Vowels", "H", "K", "R"] },
  { id: "vm-matsu", kana: "まつ", romaji: "matsu", meaning: "รอ", groups: ["Vowels", "M", "T"] },
  { id: "vm-mise", kana: "みせ", romaji: "mise", meaning: "ร้าน", groups: ["Vowels", "M", "S"] },
  { id: "vm-mushi", kana: "むし", romaji: "mushi", meaning: "แมลง", groups: ["Vowels", "M", "S"] },
  { id: "vm-momiji", kana: "もみじ", romaji: "momiji", meaning: "ใบไม้แดง", groups: ["Vowels", "M"] },
  { id: "vy-yume", kana: "ゆめ", romaji: "yume", meaning: "ความฝัน", groups: ["Vowels", "Y", "M"] },
  { id: "vr-riku", kana: "りく", romaji: "riku", meaning: "แผ่นดิน", groups: ["Vowels", "R", "K"] },
  { id: "vr-ren", kana: "れん", romaji: "ren", meaning: "ความรัก", groups: ["Vowels", "R", "N"] },
  { id: "vr-roku", kana: "ろく", romaji: "roku", meaning: "หก", groups: ["Vowels", "R", "K"] },
  { id: "vkt-kita", kana: "きた", romaji: "kita", meaning: "ทิศเหนือ", groups: ["Vowels", "K", "T"] },
  { id: "vkt-koto", kana: "こと", romaji: "koto", meaning: "สิ่ง", groups: ["Vowels", "K", "T"] },
  { id: "vhn-hashi", kana: "はし", romaji: "hashi", meaning: "สะพาน/ตะเกียบ", groups: ["Vowels", "H", "S"] },
  { id: "vmn-machi", kana: "まち", romaji: "machi", meaning: "เมือง", groups: ["Vowels", "M", "T"] },
  { id: "vm-mado", kana: "まど", romaji: "mado", meaning: "หน้าต่าง", groups: ["Vowels", "M"] },
];

/**
 * กรองคำศัพท์ที่ใช้แค่ kana จาก selectedRows
 * คำศัพท์จะถูกใช้ได้ถ้า groups ของคำเป็น subset ของ selectedRows
 */
export function filterVocabularyByRows(
  selectedRows: Set<KanaGroup>
): Vocabulary[] {
  if (selectedRows.size === 0) return VOCABULARY_DATA;
  return VOCABULARY_DATA.filter((v) =>
    v.groups.every((g) => selectedRows.has(g))
  );
}
