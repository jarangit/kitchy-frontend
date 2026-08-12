import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect, type ReactNode } from "react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { StoreSideNav } from "./store-side-nav";
import { store } from "@/shared/store/store";
import {
  clearCurrentStore,
  setCurrentStoreId,
} from "@/shared/store/slices/current-store-slice";

/**
 * Nested router scaffold: resolves the `/store/:id/*` param so the nav
 * can build its links, and pins the initial entry to a known sub-path
 * to exercise the active NavLink state.
 */
const RouterScaffold = ({
  path,
  children,
}: {
  path: string;
  children: ReactNode;
}) => (
  <MemoryRouter initialEntries={[path]}>
    <Routes>
      <Route path="/store/:id/*" element={children} />
    </Routes>
  </MemoryRouter>
);

const NavPreview = ({ path }: { path: string }) => (
  <RouterScaffold path={path}>
    <div className="flex min-h-screen">
      <StoreSideNav />
      <div className="flex flex-1 items-center justify-center bg-bg text-label text-text-tertiary">
        Content area
      </div>
    </div>
  </RouterScaffold>
);

/**
 * Seeds the Redux current-store id + React Query caches so the badge
 * hooks resolve real numbers (4 pending kitchen tickets, 2 in-progress
 * transactions) without hitting the network.
 */
const BadgeSeed = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    store.dispatch(setCurrentStoreId("abc"));
    queryClient.setQueryData(["stations", "abc"], [{ id: "st-1" }]);
    queryClient.setQueryData(
      ["kds-orders", "st-1"],
      Array.from({ length: 4 }, (_, i) => ({
        id: `k-${i}`,
        status: "pending",
      })),
    );
    queryClient.setQueryData(
      ["transactions", "abc"],
      [
        { id: "t-1", status: "PREPARING" },
        { id: "t-2", status: "NEW" },
        { id: "t-3", status: "COMPLETED" },
        { id: "t-4", status: "CANCELLED" },
      ],
    );

    return () => {
      store.dispatch(clearCurrentStore());
    };
  }, [queryClient]);

  return <>{children}</>;
};

const meta = {
  title: "Layout/StoreSideNav",
  component: StoreSideNav,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof StoreSideNav>;

export default meta;
type Story = StoryObj<typeof meta>;

export const HomeActive: Story = {
  render: () => <NavPreview path="/store/abc" />,
};

export const PosActive: Story = {
  render: () => <NavPreview path="/store/abc/pos" />,
};

export const TransactionsActive: Story = {
  render: () => <NavPreview path="/store/abc/transactions" />,
};

export const KdsActive: Story = {
  render: () => <NavPreview path="/store/abc/kds" />,
};

export const SettingsActive: Story = {
  render: () => <NavPreview path="/store/abc/settings" />,
};

export const WithBadges: Story = {
  render: () => (
    <BadgeSeed>
      <NavPreview path="/store/abc/kds" />
    </BadgeSeed>
  ),
};
