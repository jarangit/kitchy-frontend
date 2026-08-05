import type { Meta, StoryObj } from "@storybook/react-vite";
import Countdown from "./countdown";

const meta = {
  title: "Shared/Countdown",
  component: Countdown,
  parameters: {
    layout: "centered",
  },
  args: {
    seconds: 300,
    onComplete: () => {},
  },
  argTypes: {
    seconds: { control: "number" },
  },
} satisfies Meta<typeof Countdown>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FiveMinutes: Story = {
  args: { seconds: 300 },
};

export const UnderOneMinute: Story = {
  args: { seconds: 45 },
};

export const Completed: Story = {
  args: { seconds: 0 },
};
