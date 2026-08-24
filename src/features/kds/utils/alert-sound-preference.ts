const STORAGE_KEY = "kitchy.kds.alertSoundOn";

export const readAlertSoundEnabled = (): boolean => {
  if (typeof window === "undefined") return true;
  try {
    return localStorage.getItem(STORAGE_KEY) !== "false";
  } catch {
    return true;
  }
};

export const writeAlertSoundEnabled = (enabled: boolean): void => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, enabled ? "true" : "false");
  } catch {
    /* Ignore -- persistence is a non-critical enhancement. */
  }
};
