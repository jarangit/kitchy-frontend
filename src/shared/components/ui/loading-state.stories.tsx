import type { Meta, StoryObj } from "@storybook/react-vite";
import { LoadingState } from "./loading-state";

const meta = {
  title: "UI/LoadingState",
  component: LoadingState,
  parameters: {
    layout: "centered",
  },
  args: {
    title: "Loading orders...",
    description: "Fetching the latest activity for this store.",
  },
} satisfies Meta<typeof LoadingState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {};

export const Minimal: Story = {
  args: {
    description: undefined,
  },
};
