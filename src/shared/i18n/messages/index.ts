import { enMessages } from "./en";
import { thMessages } from "./th";

export const messages = {
  th: thMessages,
  en: enMessages,
} as const;

export type MessageKey = keyof typeof thMessages;
