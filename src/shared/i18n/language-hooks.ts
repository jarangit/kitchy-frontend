import { useContext } from "react";
import { LanguageContext } from "@/shared/i18n/language-context-value";

export const useLanguageContext = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguageContext must be used within LanguageProvider");
  }

  return context;
};
