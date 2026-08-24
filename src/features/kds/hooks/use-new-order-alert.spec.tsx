/// <reference types="vitest" />

import { renderHook } from "@testing-library/react";
import { useNewOrderAlert } from "@/features/kds/hooks/use-new-order-alert";
import { playNewOrderChime } from "@/features/kds/utils/play-new-order-chime";
import type { KdsOrderGroup } from "@/features/kds/types/kds.model";

vi.mock("@/features/kds/utils/play-new-order-chime", () => ({
  playNewOrderChime: vi.fn(),
  unlockAlertAudio: vi.fn(),
}));

const makeGroup = (orderId: string): KdsOrderGroup => ({
  orderId,
  orderNumber: `#${orderId}`,
  createdAt: new Date().toISOString(),
  status: "PENDING",
  items: [],
});

describe("useNewOrderAlert", () => {
  beforeEach(() => {
    vi.mocked(playNewOrderChime).mockClear();
  });

  it("treats the first snapshot as baseline and stays silent", () => {
    const { result } = renderHook(() =>
      useNewOrderAlert([makeGroup("1")], { enabled: true }),
    );

    expect(result.current).toBeUndefined();
    expect(playNewOrderChime).not.toHaveBeenCalled();
  });

  it("plays the chime once when a new order arrives", () => {
    const { rerender } = renderHook(
      ({ groups }: { groups: KdsOrderGroup[] }) =>
        useNewOrderAlert(groups, { enabled: true }),
      { initialProps: { groups: [makeGroup("1")] } },
    );

    rerender({ groups: [makeGroup("2"), makeGroup("1")] });

    expect(playNewOrderChime).toHaveBeenCalledTimes(1);
  });

  it("does not replay for known orders on later snapshots", () => {
    const groups = [makeGroup("1"), makeGroup("2")];
    const { rerender } = renderHook(
      ({ groups }: { groups: KdsOrderGroup[] }) =>
        useNewOrderAlert(groups, { enabled: true }),
      { initialProps: { groups } },
    );

    rerender({ groups: [...groups] });
    rerender({ groups: [makeGroup("2"), makeGroup("1")] });

    expect(playNewOrderChime).not.toHaveBeenCalled();
  });

  it("does not replay when an order leaves and re-enters PENDING", () => {
    const first = makeGroup("1");
    const { rerender } = renderHook(
      ({ groups }: { groups: KdsOrderGroup[] }) =>
        useNewOrderAlert(groups, { enabled: true }),
      { initialProps: { groups: [first] } },
    );

    rerender({ groups: [] });
    rerender({ groups: [makeGroup("1")] });
    expect(playNewOrderChime).not.toHaveBeenCalled();

    rerender({ groups: [makeGroup("9"), makeGroup("1")] });
    expect(playNewOrderChime).toHaveBeenCalledTimes(1);
  });

  it("stays silent while disabled but does not replay a backlog on re-enable", () => {
    const { rerender } = renderHook(
      ({ groups, enabled }: { groups: KdsOrderGroup[]; enabled: boolean }) =>
        useNewOrderAlert(groups, { enabled }),
      {
        initialProps: {
          groups: [makeGroup("1")] as KdsOrderGroup[],
          enabled: false,
        },
      },
    );

    rerender({ groups: [makeGroup("2"), makeGroup("1")], enabled: false });
    expect(playNewOrderChime).not.toHaveBeenCalled();

    rerender({ groups: [makeGroup("2"), makeGroup("1")], enabled: true });
    expect(playNewOrderChime).not.toHaveBeenCalled();

    rerender({
      groups: [makeGroup("3"), makeGroup("2"), makeGroup("1")],
      enabled: true,
    });
    expect(playNewOrderChime).toHaveBeenCalledTimes(1);
  });

  it("re-baselines silently when the scope changes", () => {
    const { rerender } = renderHook(
      ({ groups, scopeKey }: { groups: KdsOrderGroup[]; scopeKey?: string }) =>
        useNewOrderAlert(groups, { enabled: true, scopeKey }),
      {
        initialProps: {
          groups: [makeGroup("1")] as KdsOrderGroup[],
          scopeKey: "station-a",
        },
      },
    );

    rerender({
      groups: [makeGroup("7"), makeGroup("1")],
      scopeKey: "station-b",
    });
    expect(playNewOrderChime).not.toHaveBeenCalled();

    rerender({
      groups: [makeGroup("8"), makeGroup("7"), makeGroup("1")],
      scopeKey: "station-b",
    });
    expect(playNewOrderChime).toHaveBeenCalledTimes(1);
  });

  it("ignores pending snapshots so loading states never trigger alerts", () => {
    const { rerender } = renderHook(
      ({
        groups,
        isSnapshotPending,
      }: {
        groups: KdsOrderGroup[];
        isSnapshotPending: boolean;
      }) => useNewOrderAlert(groups, { enabled: true, isSnapshotPending }),
      {
        initialProps: {
          groups: [] as KdsOrderGroup[],
          isSnapshotPending: true,
        },
      },
    );

    // Snapshot churn during load must neither alert nor consume state.
    rerender({ groups: [makeGroup("9")], isSnapshotPending: true });
    expect(playNewOrderChime).not.toHaveBeenCalled();

    // First ready snapshot becomes the silent baseline.
    rerender({ groups: [makeGroup("1")], isSnapshotPending: false });
    expect(playNewOrderChime).not.toHaveBeenCalled();

    rerender({
      groups: [makeGroup("2"), makeGroup("1")],
      isSnapshotPending: false,
    });
    expect(playNewOrderChime).toHaveBeenCalledTimes(1);
  });
});
