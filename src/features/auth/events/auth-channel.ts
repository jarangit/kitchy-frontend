/**
 * Cross-tab auth synchronisation over BroadcastChannel.
 *
 * When the user logs in or out on one tab, the other open tabs need to
 * react (refetch `["me"]` or clear caches + redirect to /login). This
 * module is a thin Observer over the browser's BroadcastChannel API with
 * a graceful no-op fallback for environments that lack it (older Safari,
 * SSR, test runners).
 */
export type AuthChannelEvent = { type: "login" | "logout" };

type AuthSubscriber = (event: AuthChannelEvent) => void;

const CHANNEL_NAME = "kitchy-auth";

const isSupported =
  typeof window !== "undefined" && typeof BroadcastChannel !== "undefined";

let channel: BroadcastChannel | null = null;
const subscribers = new Set<AuthSubscriber>();

const ensureChannel = (): BroadcastChannel | null => {
  if (!isSupported) return null;
  if (!channel) {
    channel = new BroadcastChannel(CHANNEL_NAME);
    channel.onmessage = (ev: MessageEvent<AuthChannelEvent>) => {
      const data = ev.data;
      if (!data || (data.type !== "login" && data.type !== "logout")) return;
      for (const sub of Array.from(subscribers)) {
        try {
          sub(data);
        } catch (err) {
          console.error("[auth-channel] subscriber threw", err);
        }
      }
    };
  }
  return channel;
};

export const authChannel = {
  broadcast(event: AuthChannelEvent) {
    ensureChannel()?.postMessage(event);
  },
  broadcastLogin() {
    this.broadcast({ type: "login" });
  },
  broadcastLogout() {
    this.broadcast({ type: "logout" });
  },
  /**
   * Subscribe to messages from other tabs. Returns an unsubscribe fn.
   * Note: events emitted by the current tab are NOT delivered back to it
   * (BroadcastChannel semantics) -- so local handlers must fire separately.
   */
  subscribe(sub: AuthSubscriber): () => void {
    ensureChannel();
    subscribers.add(sub);
    return () => {
      subscribers.delete(sub);
    };
  },
};
