import { store } from "@/shared/store/store";

/**
 * Synthesized "tab" click sound played on interactive presses.
 *
 * Uses the Web Audio API to generate a short percussive burst so no audio
 * asset is required. The AudioContext is created lazily on the first call so
 * it happens inside a user gesture (required by iOS/Safari autoplay policy).
 */

let audioContext: AudioContext | null = null;
let lastPlayedAt = 0;

const COOLDOWN_MS = 40;

const getAudioContext = (): AudioContext | null => {
  if (typeof window === "undefined") return null;
  const Ctor =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!Ctor) return null;
  if (!audioContext) audioContext = new Ctor();
  if (audioContext.state === "suspended") void audioContext.resume();
  return audioContext;
};

const playAppleClick = (ctx: AudioContext) => {
  const duration = 0.045;

  const source = ctx.createOscillator();
  source.type = "sine";
  source.frequency.setValueAtTime(1850, ctx.currentTime);
  source.frequency.exponentialRampToValueAtTime(
    1400,
    ctx.currentTime + duration,
  );

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.09, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

  source.connect(gain);
  gain.connect(ctx.destination);
  source.start();
  source.stop(ctx.currentTime + duration);
};

export const playTabSound = (): void => {
  if (typeof window === "undefined") return;
  if (!store.getState().sound.isSoundOn) return;

  const now = performance.now();
  if (now - lastPlayedAt < COOLDOWN_MS) return;
  lastPlayedAt = now;

  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    playAppleClick(ctx);
  } catch {
    /* Ignore — audio is a non-critical enhancement. */
  }
};
