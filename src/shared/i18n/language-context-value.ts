import { createContext } from "react";
import type { MessageKey } from "@/shared/i18n/messages";

export type Language = "th" | "en";

export interface TranslationValues {
  [key: string]: string | number;
}

export interface LanguageContextValue {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: MessageKey, values?: TranslationValues) => string;
}

export const LanguageContext = createContext<LanguageContextValue | null>(null);
