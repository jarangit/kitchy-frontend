import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { AlphanumericKeypad } from "./alphanumeric-keypad";

const meta = {
  title: "UI/AlphanumericKeypad",
  component: AlphanumericKeypad,
  parameters: {
    layout: "centered",
  },
  args: {
    label: "Order number",
  },
} satisfies Meta<typeof AlphanumericKeypad>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: (args) => {
    const [value, setValue] = useState("");
    return (
      <div className="w-80">
        <AlphanumericKeypad
          {...args}
          value={value}
          onChange={setValue}
          onDone={() => {}}
        />
      </div>
    );
  },
};

export const WithDeviceKeyboard: Story = {
  render: (args) => {
    const [value, setValue] = useState("");
    return (
      <div className="w-80">
        <AlphanumericKeypad
          {...args}
          value={value}
          onChange={setValue}
          onDone={() => {}}
          onRequestDeviceKeyboard={() => {}}
        />
      </div>
    );
  },
};
