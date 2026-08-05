import type { Meta, StoryObj } from "@storybook/react-vite";
import ElapsedTime from "./elapsed-time";

const meta = {
  title: "Shared/ElapsedTime",
  component: ElapsedTime,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof ElapsedTime>;

export default meta;
type Story = StoryObj<typeof meta>;

const minutesAgo = (minutes: number) =>
  new Date(Date.now() - minutes * 60 * 1000).toISOString();

export const JustNow: Story = {
  args: { createdAt: minutesAgo(0.5) },
};

export const TenMinutesAgo: Story = {
  args: { createdAt: minutesAgo(10) },
};

export const TwoHoursAgo: Story = {
  args: { createdAt: minutesAgo(2 * 60) },
};
