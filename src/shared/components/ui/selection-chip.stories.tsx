import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { LuDessert, LuGlassWater } from "react-icons/lu";
import { SelectionChip } from "./selection-chip";

const meta = {
  title: "UI/SelectionChip",
  component: SelectionChip,
  parameters: {
    layout: "centered",
  },
  args: {
    children: "Dine in",
  },
  argTypes: {
    active: { control: "boolean" },
  },
} satisfies Meta<typeof SelectionChip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Inactive: Story = {
  args: { active: false },
};

export const Active: Story = {
  args: { active: true },
};

export const WithIcon: Story = {
  args: { active: true },
  render: (args) => (
    <div className="w-72">
      <SelectionChip {...args}>
        <LuGlassWater size={18} />
        Dine in
      </SelectionChip>
    </div>
  ),
};

export const Interactive: Story = {
  render: (args) => {
    const [selected, setSelected] = useState("dine-in");
    const items = [
      { key: "dine-in", label: "Dine in", icon: <LuGlassWater size={18} /> },
      { key: "takeaway", label: "Takeaway", icon: <LuDessert size={18} /> },
    ];
    return (
      <div className="grid w-72 grid-cols-2 gap-3">
        {items.map((item) => (
          <SelectionChip
            key={item.key}
            {...args}
            active={selected === item.key}
            onClick={() => setSelected(item.key)}
          >
            {item.icon}
            {item.label}
          </SelectionChip>
        ))}
      </div>
    );
  },
};
