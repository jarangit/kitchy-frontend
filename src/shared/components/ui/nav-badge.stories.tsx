import type { Meta, StoryObj } from "@storybook/react-vite";
import { LuBell } from "react-icons/lu";
import { NavBadge } from "./nav-badge";

const meta = {
  title: "UI/NavBadge",
  component: NavBadge,
  parameters: {
    layout: "centered",
  },
  args: {
    count: 3,
  },
  argTypes: {
    count: { control: "number" },
    max: { control: "number" },
  },
} satisfies Meta<typeof NavBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Single: Story = {
  args: { count: 1 },
  render: (args) => (
    <div className="relative inline-flex p-2">
      <LuBell size={28} className="text-text-primary" />
      <NavBadge {...args} />
    </div>
  ),
};

export const DoubleDigit: Story = {
  args: { count: 24 },
  render: (args) => (
    <div className="relative inline-flex p-2">
      <LuBell size={28} className="text-text-primary" />
      <NavBadge {...args} />
    </div>
  ),
};

export const Capped: Story = {
  args: { count: 145, max: 99 },
  render: (args) => (
    <div className="relative inline-flex p-2">
      <LuBell size={28} className="text-text-primary" />
      <NavBadge {...args} />
    </div>
  ),
};

export const Zero: Story = {
  args: { count: 0 },
  render: (args) => (
    <div className="relative inline-flex p-2">
      <LuBell size={28} className="text-text-primary" />
      <NavBadge {...args} />
    </div>
  ),
};
