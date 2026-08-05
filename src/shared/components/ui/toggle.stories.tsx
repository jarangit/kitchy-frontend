import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Toggle } from "./toggle";

const meta = {
  title: "UI/Toggle",
  component: Toggle,
  parameters: {
    layout: "centered",
  },
  args: {
    label: "Notifications",
    checked: false,
    onChange: () => {},
  },
  argTypes: {
    checked: { control: "boolean" },
  },
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Off: Story = {
  args: { checked: false },
};

export const On: Story = {
  args: { checked: true },
};

export const Disabled: Story = {
  args: { checked: true, disabled: true },
};

export const Interactive: Story = {
  args: {},
  render: (args) => {
    const [checked, setChecked] = useState(false);
    return (
      <div className="flex items-center gap-3">
        <Toggle {...args} checked={checked} onChange={setChecked} />
        <span className="text-body text-text-secondary">
          {checked ? "On" : "Off"}
        </span>
      </div>
    );
  },
};
