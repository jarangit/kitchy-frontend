/// <reference types="vitest" />

import { render, screen } from "@testing-library/react";
import KdsStatsBar from "@/features/kds/components/kds-stats-bar";
import { LanguageProvider } from "@/shared/i18n/language-context";

vi.mock("@/features/kds/components/kds-layout", () => ({
  useKdsLayout: () => ({
    fullscreen: false,
    toggleFullscreen: vi.fn(),
  }),
}));

describe("KdsStatsBar", () => {
  it("renders queue stats without realtime badge", () => {
    render(
      <LanguageProvider>
        <KdsStatsBar groups={[]} />
      </LanguageProvider>,
    );

    expect(screen.getByText("รอทำ")).toBeInTheDocument();
    expect(screen.queryByText("เรียลไทม์")).not.toBeInTheDocument();
    expect(screen.queryByText("โพลลิง")).not.toBeInTheDocument();
  });

  it("still renders done and overdue stats", () => {
    render(
      <LanguageProvider>
        <KdsStatsBar groups={[]} />
      </LanguageProvider>,
    );

    expect(screen.getByText("เสร็จแล้ว")).toBeInTheDocument();
    expect(screen.getByText("ช้าเกิน 15 นาที")).toBeInTheDocument();
  });
});
