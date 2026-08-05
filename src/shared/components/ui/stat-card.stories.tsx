import type { Meta, StoryObj } from "@storybook/react-vite";
import { LuTrendingUp, LuWallet } from "react-icons/lu";
import { IconTile } from "./icon-tile";
import { StatCard } from "./stat-card";

const meta = {
  title: "UI/StatCard",
  component: StatCard,
  parameters: {
    layout: "centered",
  },
  args: {
    label: "Today's revenue",
    value: "฿12,480",
  },
  argTypes: {
    tone: {
      control: "select",
      options: ["default", "success", "warning", "danger", "info"],
    },
  },
} satisfies Meta<typeof StatCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {};

export const WithHint: Story = {
  args: {
    hint: "+12.5% vs yesterday",
  },
};

export const WithTrailingIcon: Story = {
  args: {
    hint: "+12.5% vs yesterday",
  },
  render: (args) => (
    <StatCard
      {...args}
      trailing={
        <IconTile tone="success">
          <LuTrendingUp size={20} />
        </IconTile>
      }
    />
  ),
};

export const SuccessTone: Story = {
  args: {
    label: "Orders completed",
    value: "342",
    tone: "success",
    hint: "This month",
  },
};

export const DangerTone: Story = {
  args: {
    label: "Failed payments",
    value: "4",
    tone: "danger",
    hint: "Last 7 days",
  },
};

export const Clickable: Story = {
  args: {
    hint: "Tap to view report",
    onClick: () => {},
  },
  render: (args) => (
    <StatCard
      {...args}
      trailing={
        <IconTile tone="neutral">
          <LuWallet size={20} />
        </IconTile>
      }
    />
  ),
};
