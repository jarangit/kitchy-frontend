import { useEffect } from "react";
import { playTabSound } from "@/shared/audio/tab-sound";

const INTERACTIVE_SELECTOR = [
  "button",
  "a[href]",
  'a[role="button"]',
  '[role="button"]',
  '[role="switch"]',
  '[role="tab"]',
  "select",
  "summary",
  "input",
  "[data-sound]",
].join(",");

/**
 * Global click-sound feedback. Mounted once at the app root so every
 * interactive press across the app (including full-screen POS/KDS screens)
 * plays the synthesized tab sound, honoring the store's sound toggle.
 */
export function TabSoundFeedback() {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target as Element | null;
      if (!(target instanceof Element)) return;
      const interactive = target.closest(INTERACTIVE_SELECTOR);
      if (!interactive) return;
      if (interactive.hasAttribute("disabled")) return;
      playTabSound();
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return null;
}
