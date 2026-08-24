import { useState } from "react";
import {
  readAlertSoundEnabled,
  writeAlertSoundEnabled,
} from "@/features/kds/utils/alert-sound-preference";
import { unlockAlertAudio } from "@/features/kds/utils/play-new-order-chime";

/**
 * New-order alert sound preference, persisted per device.
 *
 * Enabling alerts unlocks the AudioContext inside the click gesture
 * (required by browser autoplay policy) and plays a short confirmation
 * blip so staff hear that alerts are on. Side effects stay outside any
 * state updater so React StrictMode double-invocation stays harmless.
 */
export const useAlertSound = () => {
  const [alertSoundOn, setAlertSoundOn] = useState(readAlertSoundEnabled);

  const toggleAlertSound = () => {
    const next = !alertSoundOn;
    setAlertSoundOn(next);
    writeAlertSoundEnabled(next);
    if (next) unlockAlertAudio();
  };

  return { alertSoundOn, toggleAlertSound };
};
