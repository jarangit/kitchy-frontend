import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect } from "react";
import LoadingOverlay from "./loading-screen";
import { useLoading } from "@/shared/hooks/useLoading";

const meta = {
  title: "Shared/LoadingOverlay",
  component: LoadingOverlay,
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof LoadingOverlay>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Loading: Story = {
  args: {},
  render: () => {
    const { isLoading, startLoading, stopLoading } = useLoading();

    useEffect(() => {
      startLoading();
      return () => {
        stopLoading();
      };
    }, [startLoading, stopLoading]);

    if (!isLoading) return <div />;

    return <LoadingOverlay />;
  },
};
