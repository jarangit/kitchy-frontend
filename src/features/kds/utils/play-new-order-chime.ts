/**
 * Synthesized two-tone chime played when a new order arrives on the KDS
 * board.
 *
 * Uses the Web Audio API so no audio asset is required. The AudioContext
 * is created lazily and resumed on demand -- browsers only allow playback
 * after a user gesture, which the KDS sound toggle provides when alerts
 * are enabled (see unlockAlertAudio).
 */

let audioContext: AudioContext | null = null;
let lastPlayedAt = 0;

const COOLDOWN_MS = 1000;

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

const playTone = (
  ctx: AudioContext,
  frequency: number,
  startDelay: number,
  duration: number,
  peak: number,
) => {
  const startAt = ctx.currentTime + startDelay;

  const source = ctx.createOscillator();
  source.type = "sine";
  source.frequency.setValueAtTime(frequency, startAt);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, startAt);
  gain.gain.exponentialRampToValueAtTime(peak, startAt + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);

  source.connect(gain);
  gain.connect(ctx.destination);
  source.start(startAt);
  source.stop(startAt + duration);
};

/**
 * Create/resume the AudioContext inside a user gesture and play a short
 * confirmation blip so staff hear that new-order alerts are enabled.
 */
export const unlockAlertAudio = (): void => {
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    playTone(ctx, 880, 0, 0.15, 0.07);
  } catch {
    /* Ignore -- audio is a non-critical enhancement. */
  }
};

/**
 * Bell-like "ding" (E6 -> C6) for an incoming order. Multiple orders
 * landing within the cooldown play as one chime instead of stacking up.
 */
export const playNewOrderChime = (): void => {
  if (typeof window === "undefined") return;

  const now = performance.now();
  if (now - lastPlayedAt < COOLDOWN_MS) return;
  lastPlayedAt = now;

  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    playTone(ctx, 1318.5, 0, 0.55, 0.14);
    playTone(ctx, 1046.5, 0.18, 0.75, 0.11);
  } catch {
    /* Ignore -- audio is a non-critical enhancement. */
  }
};
