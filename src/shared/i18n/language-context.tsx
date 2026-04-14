import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { messages, type MessageKey } from "./messages";

export type Language = "th" | "en";

const STORAGE_KEY = "app-language";

interface TranslationValues {
  [key: string]: string | number;
}

interface LanguageContextValue {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: MessageKey, values?: TranslationValues) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

const getInitialLanguage = (): Language => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored === "en" ? "en" : "th";
};

const interpolate = (template: string, values?: TranslationValues) => {
  if (!values) return template;

  return template.replace(/\{(\w+)\}/g, (_, key: string) => {
    const value = values[key];
    return value === undefined ? `{${key}}` : String(value);
  });
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>(getInitialLanguage);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, language);
  }, [language]);

  const t = useCallback(
    (key: MessageKey, values?: TranslationValues) => {
      const message = messages[language][key] ?? messages.en[key] ?? key;
      return interpolate(message, values);
    },
    [language]
  );

  const value = useMemo(
    () => ({ language, setLanguage, t }),
    [language, t]
  );

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
};

export const useLanguageContext = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguageContext must be used within LanguageProvider");
  }

  return context;
};
