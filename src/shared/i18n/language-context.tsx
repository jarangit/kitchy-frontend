import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { messages, type MessageKey } from "./messages";
import {
  LanguageContext,
  type Language,
  type TranslationValues,
} from "@/shared/i18n/language-context-value";

const STORAGE_KEY = "app-language";

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
