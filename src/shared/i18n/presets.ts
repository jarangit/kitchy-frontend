import type { Language } from "./language-context";

export const getDefaultQuickNotes = (language: Language) => {
  if (language === "en") {
    return [
      "No sugar",
      "No vegetables",
      "No onion",
      "Less spicy",
      "Extra spicy",
      "No ice",
    ];
  }

  return [
    "ไม่หวาน",
    "ไม่เอาผัก",
    "ไม่ใส่หอม",
    "เผ็ดน้อย",
    "เผ็ดมาก",
    "ไม่ใส่น้ำแข็ง",
  ];
};

export const getDefaultDeliveryPlatforms = (language: Language) => [
  "LINE MAN",
  "GrabFood",
  "ShopeeFood",
  "Robinhood",
  "Foodpanda",
  language === "en" ? "Other" : "อื่นๆ",
];
