/// <reference types="vitest" />

import { render } from "@testing-library/react";
import { LanguageProvider } from "@/shared/i18n/language-context";
import { RealtimeProvider } from "@/shared/realtime/realtime-provider";

const {
  on,
  off,
  emit,
  connect,
  disconnect,
  warning,
  success,
  dismiss,
} = vi.hoisted(() => ({
  on: vi.fn(),
  off: vi.fn(),
  emit: vi.fn(),
  connect: vi.fn(),
  disconnect: vi.fn(),
  warning: vi.fn(() => "toast-1"),
  success: vi.fn(),
  dismiss: vi.fn(),
}));

vi.mock("@/shared/hooks/hooks", () => ({
  useAppSelector: (selector: (state: any) => unknown) =>
    selector({
      currentStore: { storeId: "store-1" },
      currentStation: { stationId: "station-1" },
    }),
}));

vi.mock("@/shared/events/app-events", () => ({
  appBus: {
    emit: vi.fn(),
    on: vi.fn(() => () => undefined),
  },
}));

vi.mock("@/shared/services/toast-service", () => ({
  toast: {
    warning,
    success,
    dismiss,
  },
}));

vi.mock("@/shared/realtime/realtime-client", () => ({
  getRealtimeConnectionState: () => false,
  subscribeRealtimeConnection: () => () => undefined,
  getRealtimeClient: () => ({
    connected: false,
    on,
    off,
    emit,
    connect,
    disconnect,
  }),
  refreshRealtimeAuth: () => ({
    connected: false,
    on,
    off,
    emit,
    connect,
    disconnect,
  }),
}));

describe("RealtimeProvider", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("registers connect and disconnect handlers", () => {
    render(
      <LanguageProvider>
        <RealtimeProvider />
      </LanguageProvider>,
    );

    expect(on).toHaveBeenCalledWith("connect", expect.any(Function));
    expect(on).toHaveBeenCalledWith("disconnect", expect.any(Function));
    expect(connect).toHaveBeenCalled();
  });

  it("shows reconnect fallback toast messages through translated handlers", () => {
    render(
      <LanguageProvider>
        <RealtimeProvider />
      </LanguageProvider>,
    );

    const connectHandler = on.mock.calls.find(
      (call: [string, (...args: unknown[]) => void]) => call[0] === "connect",
    )?.[1];
    const disconnectHandler = on.mock.calls.find(
      (call: [string, (...args: unknown[]) => void]) =>
        call[0] === "disconnect",
    )?.[1];

    expect(connectHandler).toBeTypeOf("function");
    expect(disconnectHandler).toBeTypeOf("function");

    connectHandler();
    disconnectHandler();
    connectHandler();

    expect(warning).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "เรียลไทม์หลุดการเชื่อมต่อ",
      }),
    );
    expect(dismiss).toHaveBeenCalledWith("toast-1");
    expect(success).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "เชื่อมต่อเรียลไทม์กลับมาแล้ว",
      }),
    );
  });
});
