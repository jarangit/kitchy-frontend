/**
 * Typed publish/subscribe event bus.
 *
 * A minimal, dependency-free implementation of the Observer pattern that lets
 * loosely-coupled parts of the app react to domain events without knowing
 * about each other. Consumers subscribe via `on(event, handler)` and the bus
 * returns an unsubscribe function that is friendly to React `useEffect`
 * cleanup.
 *
 * Usage:
 *   type Events = { "order:created": { orderId: string } };
 *   const bus = createEventBus<Events>();
 *   const off = bus.on("order:created", (p) => console.log(p.orderId));
 *   bus.emit("order:created", { orderId: "123" });
 *   off();
 */
export type EventHandler<T> = (payload: T) => void;

export interface EventBus<TMap extends Record<string, unknown>> {
  on<K extends keyof TMap>(event: K, handler: EventHandler<TMap[K]>): () => void;
  off<K extends keyof TMap>(event: K, handler: EventHandler<TMap[K]>): void;
  emit<K extends keyof TMap>(event: K, payload: TMap[K]): void;
  clear(): void;
}

export function createEventBus<
  TMap extends Record<string, unknown>,
>(): EventBus<TMap> {
  const listeners = new Map<keyof TMap, Set<EventHandler<unknown>>>();

  return {
    on(event, handler) {
      let set = listeners.get(event);
      if (!set) {
        set = new Set();
        listeners.set(event, set);
      }
      set.add(handler as EventHandler<unknown>);
      return () => {
        const current = listeners.get(event);
        current?.delete(handler as EventHandler<unknown>);
      };
    },
    off(event, handler) {
      listeners.get(event)?.delete(handler as EventHandler<unknown>);
    },
    emit(event, payload) {
      const set = listeners.get(event);
      if (!set) return;
      // Snapshot to allow handlers to unsubscribe during iteration.
      for (const handler of Array.from(set)) {
        try {
          (handler as EventHandler<typeof payload>)(payload);
        } catch (err) {
          // Never let one broken handler break the whole emit pipeline.
          // eslint-disable-next-line no-console
          console.error(`[event-bus] handler for "${String(event)}" threw`, err);
        }
      }
    },
    clear() {
      listeners.clear();
    },
  };
}
