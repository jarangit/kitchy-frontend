import type { Meta, StoryObj } from "@storybook/react-vite";
import { LuChefHat } from "react-icons/lu";
import { NavBadge } from "./nav-badge";

const meta = {
  title: "UI/NavBadge",
  component: NavBadge,
  parameters: {
    layout: "centered",
  },
  args: {
    count: 4,
  },
  argTypes: {
    count: {
      control: "number",
    },
    max: {
      control: "number",
    },
  },
  render: (args) => (
    <div className="relative flex h-9 w-9 items-center justify-center rounded-full border border-border bg-sidebar-bg text-text-secondary">
      <LuChefHat size={18} aria-hidden="true" />
      <NavBadge {...args} />
    </div>
  ),
} satisfies Meta<typeof NavBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { count: 4 },
};

export const DoubleDigit: Story = {
  args: { count: 27 },
};

export const MaxedOut: Story = {
  args: { count: 150 },
};

export const HiddenAtZero: Story = {
  args: { count: 0 },
};
