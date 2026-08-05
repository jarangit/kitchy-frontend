import type { Meta, StoryObj } from "@storybook/react-vite";
import { ErrorState } from "./error-state";

const meta = {
  title: "UI/ErrorState",
  component: ErrorState,
  parameters: {
    layout: "centered",
  },
  args: {
    title: "Something went wrong",
    description: "We could not load your data. Please try again.",
  },
  argTypes: {
    onRetry: { action: "retry" },
  },
} satisfies Meta<typeof ErrorState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {};

export const WithRetry: Story = {
  args: {
    onRetry: () => {},
  },
};

export const Minimal: Story = {
  args: {
    description: undefined,
  },
};
