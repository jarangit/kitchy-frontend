import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { ChipTab } from "./chip-tab";

const meta = {
  title: "UI/ChipTab",
  component: ChipTab,
  parameters: {
    layout: "centered",
  },
  args: {
    children: "Today",
  },
  argTypes: {
    active: { control: "boolean" },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
  },
} satisfies Meta<typeof ChipTab>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Active: Story = {
  args: { active: true },
};

export const Inactive: Story = {
  args: { active: false },
};

export const Sizes: Story = {
  args: { active: true },
  render: (args) => (
    <div className="flex items-center gap-3">
      <ChipTab {...args} size="sm">
        Small
      </ChipTab>
      <ChipTab {...args} size="md">
        Medium
      </ChipTab>
      <ChipTab {...args} size="lg">
        Large
      </ChipTab>
    </div>
  ),
};

export const Interactive: Story = {
  render: (args) => {
    const [active, setActive] = useState("today");
    return (
      <div className="flex gap-2">
        {["today", "week", "month"].map((key) => (
          <ChipTab
            key={key}
            {...args}
            active={active === key}
            onClick={() => setActive(key)}
          >
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </ChipTab>
        ))}
      </div>
    );
  },
};
